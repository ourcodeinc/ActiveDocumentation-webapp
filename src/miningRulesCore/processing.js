/*
This file contains methods for generating and processing features for
mining design rules, given DOI information and a focused element.
It also prepare texts that should be written in files designated as the
output of mining allAlgorithms.
 */

import {extractFeaturesFromXmlFile} from "./extractFeatures";
import {
    attributeFileNames,
    defaultFeatures,
    MAX_GROUP_SIZE,
    MIN_SUPPORT_FOR_MINING,
    weightUpdateActions,
    weightUpdateFactors
} from "./featureConfig";
import {webSocketSendMessage} from "../core/coreConstants";

/**
 * The method extracts features and updates the featureMetaData
 *
 * @typedef {import("../initialState")} focusedElementDataType
 * @typedef {import("../initialState")} doiInformationType
 * @typedef {import("../initialState")} groupMappingType
 * @typedef {import("../initialState")} fileMappingType
 * @typedef {import("../initialState")} groupingMetaDataType
 * @typedef {import("../initialState")} elementFeatures
 * @typedef {import("../initialState")} featureMetaDataType
 *
 * @param xmlFiles {[{xml: string, filePath:string}]}
 * @param projectPath is used to simplify the identifiers
 * @param focusedElementData {focusedElementDataType}
 * @param doiInformation {doiInformationType}
 * @param groupingMetaData {groupingMetaDataType}
 * @param featureMetaData {featureMetaDataType}
 * @return {{command, data}[]}
 */
export const generateFeatures = (xmlFiles, projectPath,
                                 focusedElementData,
                                 doiInformation,
                                 groupingMetaData,
                                 featureMetaData) => {

    let focusedElementFilePath = focusedElementData.filePath.replace(projectPath, "");
    /**
     * @type {string[]}
     */
    let targetPackage = (groupingMetaData.fileMapping[focusedElementFilePath] &&
        groupingMetaData.fileMapping[focusedElementFilePath].packages) ?
        groupingMetaData.fileMapping[focusedElementFilePath].packages : [];

    let targetImports = (groupingMetaData.fileMapping[focusedElementFilePath] &&
        groupingMetaData.fileMapping[focusedElementFilePath].imports) ?
        groupingMetaData.fileMapping[focusedElementFilePath].imports : [];

    let fileToProcess = xmlFiles
        .filter((xmlFile) => {
            let path = xmlFile.filePath.replace(projectPath, "");
            if (groupingMetaData.fileMapping[path]) {
                // if the file belongs to the same package, or is in the parent package, include it
                if (groupingMetaData.fileMapping[path].packages) {
                    let filePackages = groupingMetaData.fileMapping[path].packages ?
                        groupingMetaData.fileMapping[path].packages : [];
                    for (let filePack of filePackages) {
                        for (let pack of targetPackage) {
                            if (filePack.startsWith(pack))
                                return true;
                        }
                    }
                }
                // if the file import the package, include it
                if (groupingMetaData.fileMapping[path].imports) {
                    let fileImports = groupingMetaData.fileMapping[path].imports ?
                        groupingMetaData.fileMapping[path].imports : [];
                    if (fileImports) {
                        for (let fileImp of fileImports) {
                            // ignore import groups with more than MAX_GROUP_SIZE classes
                            if (groupingMetaData.groupMapping.imports[fileImp].length > MAX_GROUP_SIZE) continue;
                            for (let imp of targetImports) {
                                if (fileImp === imp)
                                    return true;
                            }
                        }
                    }
                }
            }
            return false;
        });

    let message = {
        command: webSocketSendMessage.learn_design_rules_helper_files_msg,
        data: {
            fileName: `files_to_process.txt`,
            content: fileToProcess.map(d => d.filePath.replace(projectPath, "")).join("\n")
        }
    }

    fileToProcess.forEach(xmlFile => {
        extractFeaturesFromXmlFile(xmlFile, projectPath, focusedElementData, featureMetaData);
    });

    removeMinOccurredFeatures(featureMetaData, MIN_SUPPORT_FOR_MINING);

    // find the featureIds of a file of focusedElement
    // and increase their weights
    let ids = featureMetaData.featureInfoContainers.featureMapReverse[focusedElementFilePath];
    let targetIds = ids ? ids : [];

    let targetIdWeight = targetIds.map(featureId => {
        return {featureId, weight: weightUpdateFactors.focusedFile, action: weightUpdateActions.multiply}
    })
    UpdateFeatureWeights(targetIdWeight, featureMetaData);
    updateFeatureWeightsDoi(doiInformation, featureMetaData, projectPath);
    return [message];
}

/**
 * remove features that appear less than MIN_SUPPORT_FOR_MINING from featureMaps
 * @param featureMetaData {featureMetaDataType}
 * @param minOccurrence {number}  positive number
 */
const removeMinOccurredFeatures = (featureMetaData,
                                   minOccurrence) => {
    let redundantFeatures = [];
    let filePaths = [];
    Object.keys(featureMetaData.featureInfoContainers.featureMap)
        .map(d => +d)
        .forEach((featureId) => {
            let occurrences = 0;
            // feature occurrence is the total number not only once per file
            featureMetaData.featureInfoContainers.featureMap[featureId].forEach(filePath => {
                occurrences += featureMetaData.featureInfoContainers.featureMapReverse[filePath]
                    .reduce((total, x) => (x === featureId ? total + 1 : total), 0);
            })
            if (occurrences < minOccurrence) {
                redundantFeatures.push(featureId);
                filePaths = filePaths.concat(featureMetaData.featureInfoContainers.featureMap[featureId]);
            }
        });

    /**
     * remove redundant features from featureMetaData.featureGroups
     * the features remain in featureMetaData.featureInfoContainers
     * @param gr {"spec"|"usage"}
     */
    function process(gr) {
        /**
         * @type {Object.<string, elementFeatures>}
         */
        let specGroups = featureMetaData.featureGroups[gr];
        let specGroupKeys = Object.keys(specGroups);
        for (let group of specGroupKeys) {
            specGroups[group].elementFeatures.forEach(el => {
                let cleanedPath = el.element.split(".java").length === 0 ? "" :
                    el.element.split(".java").pop() + ".java";
                if (cleanedPath === "") return;
                if (!filePaths.includes(cleanedPath)) return;
                featureMetaData.featureGroups[gr][group][el].featureIds =
                    featureMetaData.featureGroups[gr][group][el].featureIds.filter(featureId => {
                        return !redundantFeatures.includes(featureId)
                    });
            });
        }
    }

    process("spec");
    process("usage");

}

/**
 * update the weights of features
 * @param featureIdWeights {{featureId: number, weight: number, action: String}[]}
 * @param featureMetaData {featureMetaDataType}
 */
const UpdateFeatureWeights = (featureIdWeights, featureMetaData) => {
    for (let featureIdWeight of featureIdWeights) {
        let featureDesc = featureMetaData.featureInfoContainers.featureInfoReverse[featureIdWeight.featureId];
        if (!featureDesc) continue;
        let featureInfo = featureMetaData.featureInfoContainers.featureInfo[featureDesc];
        if (!featureInfo) continue;
        let originalWeight = featureMetaData.featureInfoContainers.featureInfo[featureDesc].weight ?
            featureMetaData.featureInfoContainers.featureInfo[featureDesc].weight :
            defaultFeatures[featureMetaData.featureInfoContainers.featureInfo[featureDesc].featureIndex].weight;
        switch (featureIdWeight.action) {
            case weightUpdateActions.replace:
                featureMetaData.featureInfoContainers.featureInfo[featureDesc].weight =
                    featureIdWeight.weight;
                break;
            case weightUpdateActions.add:
                featureMetaData.featureInfoContainers.featureInfo[featureDesc].weight =
                    originalWeight + featureIdWeight.weight
                break;
            case weightUpdateActions.multiply:
                featureMetaData.featureInfoContainers.featureInfo[featureDesc].weight =
                    originalWeight * featureIdWeight.weight
                break;
            default:
                break;
        }
    }
}

/**
 * @param doiInformation {doiInformationType}
 * @param featureMetaData {featureMetaDataType}
 * @param projectPath {string}
 */
const updateFeatureWeightsDoi = (doiInformation,
                                 featureMetaData,
                                 projectPath) => {

    let featureIdWeights = [];
    let allKeywords = doiInformation.recentSearches.map(d => d.keyword);
    let allElements = doiInformation.recentVisitedElements.map(d => d.visitedElement);
    let allVisitedFiles = doiInformation.recentVisitedFiles.map(d => d.filePath);

    // if a search keyword or visited elements is among the identifiers of features,
    // multiply the weight of the feature by 10
    let featureInfoKeys = Object.keys(featureMetaData.featureInfoContainers.featureInfo);
    for (let feature of featureInfoKeys) {
        let nodeValues = feature.nodes;
        if (!nodeValues) continue;
        for (let value of nodeValues) {
            if (allKeywords.includes(value) || allElements.includes(value)) {
                featureIdWeights.push({
                    featureId: feature.featureId,
                    weight: weightUpdateFactors.doiSearches,
                    action: weightUpdateActions.multiply
                });
            }
        }
    }

    // for all visited files, multiply the weight of all their feature by 5
    allVisitedFiles.forEach(file => {
        let path = file.replace(projectPath, "");
        let featureIds = featureMetaData.featureInfoContainers.featureMapReverse[path] ?
            featureMetaData.featureInfoContainers.featureMapReverse[path] : [];
        featureIds.forEach(id => {
            featureIdWeights.push({
                featureId: id,
                weight: weightUpdateFactors.doiVisited,
                action: weightUpdateActions.multiply
            });
        })
    });

    UpdateFeatureWeights(featureIdWeights, featureMetaData);
}


/**
 * create txt files for writing in files and processing for mining design rules
 * @param featureMetaData {featureMetaDataType}
 * @param selectedAlgorithm {Object<String, {parameters: number[], key: string}>}
 * @param additionalMessages {{command, data}[]}
 * @return {{command, data}[]} strings for writing in file and processing by the mining algorithm */
export const prepareFilesAndRequestMineRules = (featureMetaData,
                                                selectedAlgorithm,
                                                additionalMessages) => {

    /**
     * @type {{name: string, content: string}[]}
     */
    let files = [];
    /**
     * @type {{name: string, content: string}[]}
     */
    let weightedFiles = [];

    /**
     * transform input to transactions
     * output: <featureId1> <featureId2>:<weight of featureId1> <weight of featureId2>
     * @param featureIds {number[]}
     * @return {{unweighted:string, weighted: string}|null}
     */
    function processLine(featureIds) {
        let featureIdsInLine = [], weights = [];
        let sumUtilities = 0;
        for (let featureId of featureIds) {
            let featureDesc = featureMetaData.featureInfoContainers.featureInfoReverse[featureId];
            if (!featureDesc) return null;
            let featureInfo = featureMetaData.featureInfoContainers.featureInfo[featureDesc];
            if (!featureInfo) return null;
            featureIdsInLine.push(featureId);
            weights.push(Math.floor(featureInfo.weight));
            sumUtilities += Math.floor(featureInfo.weight);
        }
        return {
            unweighted: `${featureIdsInLine.join(" ")}`,
            weighted: `${featureIdsInLine.join(" ")}:${sumUtilities}:${weights.join(" ")}`
        };
    }

    /**
     * output: array of files with name: featureConfig.featureGroupInformation.key and contents created by processLine
     * @param group {"spec"|"usage"}
     */
    function processGroup(group) {
        // each group is a file
        for (let groupId of Object.keys(featureMetaData.featureGroups[group])) {
            let file = {name: groupId, content: ""};
            let weightedFile = {name: groupId, content: ""};
            // each element is a line
            for (let element of featureMetaData.featureGroups[group][groupId].elementFeatures) {
                let lines = processLine(element.featureIds);
                if (!lines) continue;
                file.content += lines.unweighted + "\n";
                weightedFile.content += lines.weighted + "\n";
            }
            files.push(file);
            weightedFiles.push(weightedFile);
        }
    }

    processGroup("spec");
    processGroup("usage");

    let allFeatures = [];
    let featureIds = Object.keys(featureMetaData.featureInfoContainers.featureInfoReverse);
    for (let i = 0; i < featureIds.length; i++) {
        let id = featureIds[i];
        let des = featureMetaData.featureInfoContainers.featureInfoReverse[id];
        let featureIdInfo = featureMetaData.featureInfoContainers.featureInfo[des];
        let str = `${id} ${featureIdInfo.featureIndex}`;
        if (featureIdInfo.nodes) {
            str += ` ${featureIdInfo.nodes.length} ${featureIdInfo.nodes.join(" ")}`
        } else {
            str += " 0"; // number of node values
        }
        allFeatures.push(str)
    }
    let featureFile = allFeatures.join("\n");

    let output = [{command: webSocketSendMessage.refresh_learn_design_rules_directory_msg, data: {}}];
    for (let file of files) {
        output.push({
            command: webSocketSendMessage.learn_design_rules_databases_msg,
            data: {
                fileName: `${attributeFileNames.prefix}${file.name}${attributeFileNames.postfix}`,
                content: file.content
            }
        })
    }
    for (let file of weightedFiles) {
        output.push({
            command: webSocketSendMessage.learn_design_rules_databases_msg,
            data: {
                fileName: `${attributeFileNames.weightedPrefix}${file.name}${attributeFileNames.postfix}`,
                content: file.content
            }
        })
    }
    output.push(...additionalMessages);
    output.push({
            command: webSocketSendMessage.learn_design_rules_features_msg,
            data: {fileName: attributeFileNames.featureFile, content: featureFile}
        },
        {
            command: webSocketSendMessage.mine_design_rules_msg,
            data: {parameters: selectedAlgorithm.parameters, algorithm: selectedAlgorithm.key}
        });

    return output;
}