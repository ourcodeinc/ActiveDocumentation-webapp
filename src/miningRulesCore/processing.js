/*
This file contains methods for generating and processing features for
mining design rules, given DOI information and a focused element.
It also prepare texts that should be written in files designated as the
output of mining algorithms.
 */

import {mineFeaturesFromXmlFile} from "./extractFeatures";
import {
    algorithm,
    attributeFileNames,
    breakFeatureDescription,
    minOccurrence,
    minUtility,
    new_features
} from "./featureConfig";
import {webSocketSendMessage} from "../core/coreConstants";
import {verifyPartialTextBasedOnGrammar} from "../core/languageProcessing";
import {generateGuiTrees} from "../ui/RulePad/rulePadTextualEditor/generateGuiTree";
// import {createTextFromItemSets, grammarTextToRulePadGUI} from "./postProcessing";

/**
 * The method extracts features and updates the featureMetaData
 *
 * @typedef {{identifier: string, mapFocusedElementToFeaturesKey: string, filePath: string}} focusedElementDataType
 * @typedef {{recentVisitedFiles: {timestamp: Date, filePath: string}[],
 * recentVisitedElements: {timestamp: Date, filePath: string, startOffset:number,
 * endOffset: number, visitedElement: string}[],
 * recentSearches: {timestamp: Date, filePath: string, keyword: string}[]}} doiInformationType
 * @typedef {Object.<string, Object.<string, string[]>>} groupMappingType
 * @typedef {Object.<string, Object.<string, string[]>>} fileMappingType
 * @typedef {{groupMapping: groupMappingType, fileMapping: fileMappingType
 * }} groupingMetaDataType
 * @typedef {{element: string, featureIds: number[]}} elementFeatures
 * @typedef {{featureInfoContainers: {
 * featureInfo: Object.<string, {featureIndex: string, featureId: number, nodes: undefined|string[], weight: number}>,
 * featureInfoReverse: Object.<number, string>,
 * featureMap: Object.<number, string[]>,
 * featureMapReverse: Object.<string, number[]>},
 * featureGroups: {
 * spec: Object.<string, {elementFeatures: elementFeatures[], rule: {}}>,
 * usage: Object.<string, {elementFeatures: elementFeatures[], rule: {}}>}
 * }} featureMetaDataType
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
    // let targetImports = (groupingMetaData.fileMapping[focusedElementFilePath] &&
    //     groupingMetaData.fileMapping[focusedElementFilePath].imports) ?
    //     groupingMetaData.fileMapping[focusedElementFilePath].imports : [];

    // let allVisitedFiles = doiInformation.recentVisitedFiles.map(d => d.filePath);
    let fileToProcess = xmlFiles
        .filter((xmlFile) => {
            // // also includes recently visited files
            // if (allVisitedFiles.includes(xmlFile.filePath.replace(projectPath, ""))) return true;

            let path = xmlFile.filePath.replace(projectPath, "");
            if (groupingMetaData.fileMapping[path]) {
                // if the file belongs to the same package, include it
                if (groupingMetaData.fileMapping[path].packages) {
                    let filePackages = groupingMetaData.fileMapping[path].packages ?
                        groupingMetaData.fileMapping[path].packages : [];
                    for (let filePack of filePackages) {
                        for (let pack of targetPackage) {
                            if (filePack.startsWith(pack))
                                return true;
                            if (pack.startsWith(filePack))
                                return true;
                        }
                    }
                }
                // // if the file import the package, include it
                // if (groupingMetaData.fileMapping[path].imports) {
                //     let fileImports = groupingMetaData.fileMapping[path].imports ?
                //         groupingMetaData.fileMapping[path].imports : [];
                //     if (fileImports) {
                //         for (let fileImp of fileImports) {
                //             for (let imp of targetImports) {
                //                 if (fileImp.startsWith(imp)) {
                //                     console.log(path)
                //                     return true;
                //                 }
                //             }
                //         }
                //     }
                // }
            }
            return false;
        });

    fileToProcess.forEach(xmlFile => {
        mineFeaturesFromXmlFile(xmlFile, projectPath, focusedElementData, featureMetaData);
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
            new_features[featureMetaData.featureInfoContainers.featureInfo[feature_desc].featureIndex].weight;
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
 * remove features that appear less than minOccurrence from featureMaps
 * @param featureMetaData {featureMetaDataType}
 * * @param minOccurrence {number}  positive number
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
 * combine all features into RulePad, so a developer can remove unwanted features
 * @param featureMetaData {featureMetaDataType}
 */
export const combineFeatureSetToRulePad = (featureMetaData) => {
    return Promise.all([
        createRuleTextSpec("spec", featureMetaData),
        createRuleTextSpec("usage", featureMetaData)
    ]);
}

/**
 * @param category {"spec"|"usage"}
 * @param featureMetaData {featureMetaDataType}
 * @return {Promise<void>}
 */
async function createRuleTextSpec (category, featureMetaData) {
    let specGroupKeys = Object.keys(featureMetaData.featureGroups[category]);
    for (let specKey of specGroupKeys) {
        let allElements = featureMetaData.featureGroups[category][specKey].elementFeatures;
        let allFeatureIds = [...new Set(allElements.map(el => el.featureIds).flat())];
        let texts = preProcessFeatureIdsForRules(allFeatureIds, featureMetaData);
         if (texts.length === 0) return;
        await processTextToRulePad(texts, featureMetaData, category, specKey,
            "grammar", "rulePadState");
    }
}

/**
 * @typedef {{featureInfoContainers: {
 * featureInfo: Object.<string, {featureIndex: string, featureId: number, nodes: undefined|string[], weight: number}>,
 * featureInfoReverse: Object.<number, string>,
 * featureMap: Object.<number, string[]>,
 * featureMapReverse: Object.<string, number[]>},
 * featureGroups: {
 * spec: Object.<string, {elementFeatures: elementFeatures[], rule: {}}>,
 * usage: Object.<string, {elementFeatures: elementFeatures[], rule: {}}>}
 * }} featureMetaDataType
 *
 * combine all features into RulePad, so a developer can remove unwanted features
 * this function aggregate all possible values
 * @param featureMetaData {featureMetaDataType}
 * @return {Promise<void[]>}
 */
export const combineFeatureSetToRulePadCompressed = (featureMetaData) => {
    return Promise.all([
        createRuleTextUsages("spec", featureMetaData),
        createRuleTextUsages("usage", featureMetaData)
    ]);
}

/**
 *
 * @param category {"spec"|"usage"}
 * @param featureMetaData {featureMetaDataType}
 * @return {Promise<void>}
 */
async function createRuleTextUsages (category, featureMetaData) {
    let groupBy = key => array =>
        array.reduce((objectsByKeyValue, obj) => {
            const value = obj[key];
            objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
            return objectsByKeyValue;
        }, {});
    let groupByFeatureIndex = groupBy('featureIndex');

    let mapFeatureId = (feature_id) => {
        let feature_desc = featureMetaData.featureInfoContainers.featureInfoReverse[feature_id];
        return {
            featureDesc: feature_desc,
            featureId: feature_id,
            featureIndex: featureMetaData.featureInfoContainers.featureInfo[feature_desc].featureIndex
        }
    }

    let specGroupKeys = Object.keys(featureMetaData.featureGroups[category]);
    for (let specKey of specGroupKeys) {
        let allElements = featureMetaData.featureGroups[category][specKey].elementFeatures;
        let allFeatureIds = [...new Set(allElements.map(el => el.featureIds).flat())];
        let allFeatureInfo = allFeatureIds.map(mapFeatureId);

        let descriptionGroups = {};
        for (let breakText of breakFeatureDescription) {
            descriptionGroups[breakText.id] = [];
        }

        allFeatureInfo.forEach(featureInfo => {
            for (let breakText of breakFeatureDescription) {
                if (featureInfo.featureDesc.startsWith(breakText.text)) {
                    descriptionGroups[breakText.id].push(featureInfo);
                    return;
                }
            }
        });

        let texts = [];
        for (let breakText of breakFeatureDescription) {
            if (descriptionGroups[breakText.id].length === 0) continue;
            let featuresGroupByFeatureIndex = groupByFeatureIndex(descriptionGroups[breakText.id]);
            let indices = Object.keys(featuresGroupByFeatureIndex);
            let textArray = [];
            for (let feature_index of indices) {
                let nodeName = new_features[feature_index].nodeName ? new_features[feature_index].nodeName : [""];
                let desc = new_features[feature_index].description.replace(breakText.text, "");
                for (let i = 0; i < nodeName.length; i++) {
                    desc = desc.replace(`<TEMP_${i}>`,
                        `${nodeName[i]}_${featuresGroupByFeatureIndex[feature_index].length}_values`)
                }
                textArray.push(desc);
            }
            let text = "( " + textArray.join(" and ") + " )";
            texts.push({priority: breakText.priority, id: breakText.id, text, preText: breakText.text})
        }

        if (texts.length === 0) return;
        await processTextToRulePad(texts, featureMetaData, category, specKey,
            "grammarCompressed", "rulePadStateCompressed");
    }
}

/**
 * process featureMetaData to be sent for mining
 * @param texts {{priority: number, id: string, text, preText: string}[]}
 * @param featureMetaData {featureMetaDataType}
 * @param category {"spec"|"usage"}
 * @param specKey {string}
 * @param grammarRuleKey {"grammar"|"grammarCompressed"}
 * @param rulePadStateKey {"rulePadState"|"rulePadStateCompressed"}
 * @return {Promise<void>}
 */
async function processTextToRulePad(texts, featureMetaData, category, specKey, grammarRuleKey, rulePadStateKey) {
    texts.sort((a, b) => a.priority - b.priority);
    let finalRule = texts[0].preText + "( " + texts[0].text + " and " + texts[1].preText + texts[1].text + " )";
    // this condition is for parsing based on the grammar
    if (!finalRule.startsWith("class with"))
        finalRule = "class with ( " + finalRule + " )";

    finalRule = finalRule.replace(/ {2}/g, " ")
        .replace(/\)/g, " )")
        .replace(/\( /g, "(")
        .replace(/\) /g, ")")
        .replace(/ {2}/g, " ");

    let rulePadState = await grammarTextToRulePadGUI(finalRule)
    // .then(rulePadState => {
    featureMetaData.featureGroups[category][specKey].rule[grammarRuleKey] = finalRule;
    featureMetaData.featureGroups[category][specKey].rule[rulePadStateKey] = rulePadState;
    // });
}

/**
 * create txt files for writing in files and processing for mining design rules
 * @param featureMetaData {featureMetaDataType}
 * @return {{command, data}[]} strings for writing in file and processing by CHUI-Miner */
export const prepareMapsToSend = (featureMetaData) => {

    /**
     * @type {{name: string, content: string}[]}
     */
    let files = [];

    /**
     * transform input to CHUI transactions
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

/**
 * @param grammarText
 * @return {Promise<T | {guiTree: {}, guiElements: {}}>|Promise<{guiTree: {}, guiElements: {}}>}
 */
export const grammarTextToRulePadGUI = (grammarText) => {
    // the "classes" token must have an space at the end
    let result = verifyPartialTextBasedOnGrammar(grammarText + " ");
    if (result.error) {
        console.log("error happened in parsing");
        console.log({grammarText, errors: result.listOfErrors});
        return Promise.resolve({guiTree: {}, guiElements: {}});
    }

    return generateGuiTrees(result.grammarTree)
        .then((tree) => {
            return {guiTree: tree.guiTree, guiElements: tree.guiElements}
        })
        .catch((error) => {
            console.error("error happened in creating the guiTree");
            console.log({grammarText, error});
            return {guiTree: {}, guiElements: {}};
        });
}


/**
 *
 * @param featureIds {number[]}
 * @param featureMetaData {featureMetaDataType}
 * @return {{priority: number, id: string, text, preText: string}[]}
 */
export const preProcessFeatureIdsForRules = (featureIds, featureMetaData) => {
    let allFeatureDesc = featureIds
        .map(feature_id => featureMetaData.featureInfoContainers.featureInfoReverse[feature_id]);

    let descriptionGroups = {};
    for (let breakText of breakFeatureDescription) {
        descriptionGroups[breakText.id] = [];
    }

    allFeatureDesc.forEach(feature_desc => {
        for (let breakText of breakFeatureDescription) {
            if (feature_desc.startsWith(breakText.text)) {
                descriptionGroups[breakText.id].push(feature_desc);
                return;
            }
        }
    });

    let texts = [];
    for (let breakText of breakFeatureDescription) {
        if (descriptionGroups[breakText.id].length === 0) continue;
        let textArray = [];
        for (let feature_desc of descriptionGroups[breakText.id]) {
            textArray.push(feature_desc.slice(breakText.text.length));
        }
        let text = "( " + textArray.join(" and ") + " )";
        texts.push({priority: breakText.priority, id: breakText.id, text, preText: breakText.text})
    }
    return texts;
}