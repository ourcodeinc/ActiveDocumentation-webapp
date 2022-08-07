/*
This file contains methods for generating and processing features for
mining design rules, given DOI information and a focused element.
It also prepare texts that should be written in files designated as the
output of mining algorithms.
 */

import {extractFeaturesFromXmlFile} from "./extractFeatures";
import {
    algorithm,
    attributeFileNames,
    minOccurrence,
    minUtility,
    defaultFeatures
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
                            for (let pack of targetPackage) {
                                if (fileImp === pack)
                                    return true;
                            }
                        }
                    }
                }
            }
            return false;
        });

    fileToProcess.forEach(xmlFile => {
        extractFeaturesFromXmlFile(xmlFile, projectPath, focusedElementData, featureMetaData);
    });

    removeMinOccurredFeatures(featureMetaData, minOccurrence);

    let targetIds = featureMetaData.featureInfoContainers.featureMapReverse[focusedElementFilePath] ?
        featureMetaData.featureInfoContainers.featureMapReverse[focusedElementFilePath] : [];

    let targetIdWeight = targetIds.map(featureId => {
        return {featureId, weight: 10, action: "multiply"}
    })
    UpdateFeatureWeights(targetIdWeight, featureMetaData);
    // updateFeatureWeightsDoi(doiInformation, featureMetaData, projectPath);
}

/**
 * remove features that appear less than minOccurrence from featureMaps
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
 * @param featureIdWeights {{featureId: number, weight: number, action: "replace"|"multiply"|"add"}[]}
 * @param featureMetaData {featureMetaDataType}
 */
const UpdateFeatureWeights = (featureIdWeights, featureMetaData) => {
    for (let featureIdWeight of featureIdWeights) {
        let feature_desc = featureMetaData.featureInfoContainers.featureInfoReverse[featureIdWeight.featureId];
        if (!feature_desc) continue;
        let feature_info = featureMetaData.featureInfoContainers.featureInfo[feature_desc];
        if (!feature_info) continue;
        let original_weight = featureMetaData.featureInfoContainers.featureInfo[feature_desc].weight ?
            featureMetaData.featureInfoContainers.featureInfo[feature_desc].weight :
            defaultFeatures[featureMetaData.featureInfoContainers.featureInfo[feature_desc].featureIndex].weight;
        switch (featureIdWeight.action) {
            case "replace":
                featureMetaData.featureInfoContainers.featureInfo[feature_desc].weight =
                    featureIdWeight.weight;
                break;
            case "add":
                featureMetaData.featureInfoContainers.featureInfo[feature_desc].weight =
                    original_weight + featureIdWeight.weight
                break;
            case "multiply":
                featureMetaData.featureInfoContainers.featureInfo[feature_desc].weight =
                    original_weight * featureIdWeight.weight
                break;
            default:
                break;
        }
    }
}

// /**
//  * @param doiInformation {doiInformationType}
//  * @param featureMetaData {featureMetaDataType}
//  * @param projectPath {string}
//  */
// const updateFeatureWeightsDoi = (doiInformation,
//                                         featureMetaData,
//                                         projectPath) => {
//
//     let featureIdWeights = [];
//     let allKeywords = doiInformation.recentSearches.map(d => d.keyword);
//     let allElements = doiInformation.recentVisitedElements.map(d => d.visitedElement);
//     let allVisitedFiles = doiInformation.recentVisitedFiles.map(d => d.filePath);
//
//     // if a search keyword or visited elements is among the identifiers of features,
//     // multiply the weight of the feature by 10
//     let featureInfoKeys = Object.keys(featureMetaData.featureInfoContainers.featureInfo);
//     for (let feature of featureInfoKeys) {
//         let nodeValues = feature.nodes;
//         if (!nodeValues) continue;
//         for (let value of nodeValues) {
//             if (allKeywords.includes(value) || allElements.includes(value)) {
//                 // todo update based on timestamp
//                 let weight = 10;
//                 featureIdWeights.push({featureId: feature.featureId, weight, action: "multiply"});
//             }
//         }
//     }
//
//     // for all visited files, multiply the weight of all their feature by 5
//     allVisitedFiles.forEach(file => {
//         let path = file.replace(projectPath, "");
//         let featureIds = featureMetaData.featureInfoContainers.featureMapReverse[path] ?
//             featureMetaData.featureInfoContainers.featureMapReverse[path] : [];
//         // todo update based on timestamp
//         featureIds.forEach(id => {
//             featureIdWeights.push({featureId: id, weight: 5, action: "multiply"});
//         })
//     });
//
//     UpdateFeatureWeights(featureIdWeights, featureMetaData);
// }


/**
 * create txt files for writing in files and processing for mining design rules
 * @param featureMetaData {featureMetaDataType}
 * @return {{command, data}[]} strings for writing in file and processing by CHUI-Miner */
export const prepareFilesAndRequestMineRules = (featureMetaData) => {

    /**
     * @type {{name: string, content: string}[]}
     */
    let files = [];

    /**
     * transform input to CHUI transactions
     * output: <featureId1> <featureId2>:<weight of featureId1> <weight of featureId2>
     * @param featureIds {number[]}
     * @return {string|null}
     */
    function processLine(featureIds) {
        let featureIdsInLine = [], weights = [];
        let sumUtilities = 0;
        for (let featureId of featureIds) {
            let feature_desc = featureMetaData.featureInfoContainers.featureInfoReverse[featureId];
            if (!feature_desc) return null;
            let feature_info = featureMetaData.featureInfoContainers.featureInfo[feature_desc];
            if (!feature_info) return null;
            featureIdsInLine.push(featureId);
            weights.push(feature_info.weight);
            sumUtilities += feature_info.weight;
        }
        return `${featureIdsInLine.join(" ")}:${sumUtilities}:${weights.join(" ")}`
    }

    /**
     * output: array of files with name: featureConfig.sortGroupInformation.key and contents created by processLine
     * @param group {"spec"|"usage"}
     */
    function processGroup(group) {
        // each group is a file
        for (let groupId of Object.keys(featureMetaData.featureGroups[group])) {
            let file = {name: groupId, content: ""}
            // each element is a line
            for (let element of featureMetaData.featureGroups[group][groupId].elementFeatures) {
                let line = processLine(element.featureIds);
                if (!line) continue;
                file.content += line + "\n";
            }
            files.push(file);
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
    output.push({
            command: webSocketSendMessage.learn_design_rules_features_msg,
            data: {fileName: attributeFileNames.featureFile, content: featureFile}
        },
        {
            command: webSocketSendMessage.mine_design_rules_msg,
            data: {utility : minUtility, algorithm}
        });

    return output;
}