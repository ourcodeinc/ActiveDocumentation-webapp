/*
This file contains methods responsible for processing the mined rules, and
transform them into formats displayable for RulePad.
 */

import {
    allAlgorithms,
    attributeFileNames,
    defaultFeatures,
    featureGroupInformation,
    featureSet, identifier_element_ids,
    identifierFeatures, identifierKeysInRulePad,
    MIN_FEATURE_COUNT_FOR_FILTER,
    MIN_SUPPORT_FOR_FILTER,
    MIN_UTILITY_FOR_FILTER,
    MIN_WEIGHT_TO_INCLUDE_FILE,
} from "./featureConfig";
import {processRulePadForMiningRules} from "../ui/RulePad/rulePadTextualEditor/generateGuiTree";
import {antlr} from "../core/languageProcessing";
import {buildFromGUI, buildTrivialGrammar} from "../ui/RulePad/rulePadGraphicalEditor/graphicalEditor";
import Utilities from "../core/utilities";
import {getConditionByName} from "../ui/RulePad/rulePadGraphicalEditor/graphicalEditorConstants";

/**
 * @typedef {import("../initialState")} featureMetaDataType
 * @typedef {import("../initialState")} initialFrequentItemSetType
 * @typedef {import("../initialState")} initialParsedOutputType
 * @typedef {import("../initialState")} builtObjectRulePadOutputType
 *
 * @param outputFiles array of {outputFileName: String of contents}
 * @param algorithm {string}
 * @param featureMetaData {featureMetaDataType}
 *
 * each array is a frequent ItemSet
 */
export async function processReceivedFrequentItemSets(outputFiles, algorithm, featureMetaData) {
    try {
        const initialParsedOutput = parseFrequentItemSets(outputFiles, algorithm, featureMetaData);
        removeSparseItemSets(initialParsedOutput);
        const categorizedFeatures = categorizeFeatures(initialParsedOutput, featureMetaData);
        const clusteredItemSets = clusterByIdentifiers(categorizedFeatures);
        const filtered = filteredClusters(clusteredItemSets);
        const mergedClusters = mergeClusterMembers(filtered, featureMetaData);
        const builtObjects = createBuiltObjects(mergedClusters, featureMetaData);
        sortBuiltObjectsByIdentifiers(builtObjects);
        const rulePadStates = createRulePad(builtObjects);
        return Promise.resolve(rulePadStates);
    } catch (e) {
        console.log(e);
        return [];
    }
}

/**
 * parse the output of smpf.jar
 * @param outputFiles array of {outputFileName: String of contents}
 * @param featureMetaData {featureMetaDataType}
 * @param algorithm {string}
 * @return {initialParsedOutputType}
 */
const parseFrequentItemSets = (outputFiles, algorithm, featureMetaData) => {
    const results = [];
    for (const [outputFileName, output] of Object.entries(outputFiles)) {
        const fileGroup = outputFileName
            .replace(attributeFileNames.weightedPrefix, "")
            .replace(attributeFileNames.prefix, "")
            .replace(attributeFileNames.postfix, "");
        const outputLines = output.split("\n");
        const frequentItemSets = [];
        for (const line of outputLines) {
            const split = line.split(" #");
            let featureIds = []; let support = 0; let utility = 0;
            switch (algorithm) {
                case allAlgorithms.FP_MAX_DEFAULT.key:
                case allAlgorithms.FP_MAX_RELAXED.key:
                case allAlgorithms.FP_MAX_EXTRA_RELAXED:
                case allAlgorithms.FP_CLOSE.key:
                    if (split.length < 2) break;
                    featureIds = (split[0]).split(" ")
                        .filter((d) => d.trim() !== "")
                        .map((d) => +d);
                    support = +((split[1].trim()).replace("SUP: ", ""));
                    utility = calculateUtility(featureIds, featureMetaData);
                    frequentItemSets.push({featureIds, support, utility});
                    break;
                case allAlgorithms.CHUI_MINER_DEFAULT.key:
                case allAlgorithms.CHUI_MINER_RELAXED.key:
                case allAlgorithms.CHUI_MINER_MAX.key:
                    if (split.length < 3) break;
                    featureIds = (split[0]).split(" ")
                        .filter((d) => d.trim() !== "")
                        .map((d) => +d);
                    support = +((split[1].trim()).replace("SUP: ", ""));
                    utility = +((split[2].trim()).replace("UTIL: ", ""));
                    frequentItemSets.push({featureIds, support, utility});
                    break;
            }
        }
        results.push({fileGroup, frequentItemSets});
    }
    return results;
};

/**
 * sum the weights of the features in the itemSet
 * @param featureIds {number[]}
 * @param featureMetaData {featureMetaDataType}
 * @returns {number}
 */
const calculateUtility = (featureIds, featureMetaData) => {
    let sumUtilities = 0;
    for (const featureId of featureIds) {
        const featureDesc = featureMetaData.featureInfoContainers.featureInfoReverse[featureId];
        if (!featureDesc) return 0;
        const featureInfo = featureMetaData.featureInfoContainers.featureInfo[featureDesc];
        if (!featureInfo) return 0;
        sumUtilities += featureInfo.weight;
    }
    return sumUtilities;
};

/**
 * remove frequent ItemSets found by a mining allAlgorithms with low
 * support and low utility.
 * @param initialParsedOutput {initialParsedOutputType}
 * array of featureIds
 * (see return of parseFrequentItemSets_CHUI())
 */
const removeSparseItemSets = (initialParsedOutput) => {
    for (const group of initialParsedOutput) {
        group.frequentItemSets = group.frequentItemSets
            .filter((d) => d.support >= MIN_SUPPORT_FOR_FILTER &&
                (d.utility >= MIN_UTILITY_FOR_FILTER) &&
                d.featureIds.length >= MIN_FEATURE_COUNT_FOR_FILTER,
            );
    }
};


/**
 * categorize the features based on the feature sets
 * @param initialParsedOutput {initialParsedOutputType}
 * @param featureMetaData {featureMetaDataType}
 * @returns {{fileGroup, categorized: *[]}[]}
 */
const categorizeFeatures = (initialParsedOutput, featureMetaData) => {
    return initialParsedOutput.map((fileGroupObject) => {
        const groupSetKeys = featureGroupInformation[fileGroupObject.fileGroup].categorizedFeatureSets.flat();
        const categorizedFeatures = fileGroupObject.frequentItemSets.map((itemSet, itemSetIndex) => {
            const categories = {};
            groupSetKeys.forEach((key) => categories[key] = {});
            itemSet.featureIds.forEach((featureId) => {
                const desc = featureMetaData.featureInfoContainers.featureInfoReverse[featureId];
                const featureInfo = featureMetaData.featureInfoContainers.featureInfo[desc];
                const featureWeight = featureMetaData.featureInfoContainers.featureInfo[desc].weight;
                const featureIndex = featureInfo.featureIndex;
                for (const key of groupSetKeys) {
                    if ((key in identifierFeatures && identifierFeatures[key].includes(featureIndex)) ||
                        (key in featureSet && featureSet[key].includes(featureIndex))) {
                        categories[key][featureIndex] = {featureId, desc, featureIndex, featureWeight};
                        return;
                    }
                }
            });
            return {categories, itemSetIndex};
        });
        return {fileGroup: fileGroupObject, categorized: categorizedFeatures};
    });
};

/**
 * @param categorizedFeatures {{fileGroup, categorized: *[]}[]}
 * @returns {{fileGroup, clusters: Object<number, Object<number, {itemSets, categories}[]>>}[]}
 */
const clusterByIdentifiers = (categorizedFeatures) => {
    /**
     * @param categorizedItemSets {*[]}
     * @param clusterKey {string}
     */
    function clusterByLevel(categorizedItemSets, clusterKey) {
        const clusters = {};
        categorizedItemSets.forEach((categorizedItemSet) => {
            // if there are identifiers for the itemSet
            // each itemSet may belong to multiple clusters
            if (Object.keys(categorizedItemSet.categories[clusterKey]).length > 0) {
                for (const key of identifierFeatures[clusterKey]) {
                    if (key in categorizedItemSet.categories[clusterKey]) {
                        const featureId = categorizedItemSet.categories[clusterKey][key].featureId;
                        if (!(featureId in clusters)) {
                            clusters[featureId] = [];
                        }
                        clusters[featureId].push(categorizedItemSet);
                    }
                }
            }
        });
        return clusters;
    }

    return categorizedFeatures.map((fileGroupObject) => {
        const groupSetKeys = featureGroupInformation[fileGroupObject.fileGroup.fileGroup].categorizedFeatureSets;
        let clusters = {};
        // if we can cluster itemSets based on the first level
        if (groupSetKeys.length > 0 && groupSetKeys[0].length > 0) {
            const level1ClusterKey = groupSetKeys[0][0];
            clusters = clusterByLevel(fileGroupObject.categorized, level1ClusterKey);
        }
        // if we can cluster itemSets based on the second level
        if (groupSetKeys.length > 1 && groupSetKeys[1].length > 0) {
            const level2ClusterKey = groupSetKeys[1][0];
            for (const key of Object.keys(clusters)) {
                clusters[key] = clusterByLevel(clusters[key], level2ClusterKey);
            }
        }
        return {fileGroup: fileGroupObject.fileGroup, clusters};
    });
};

/**
 * remove sub-clusters with no child instance
 * @param clusteredItemSets {{fileGroup, clusters: Object<number, Object<number, {itemSets, categories}[]>>}[]}
 * @returns {{fileGroup, clusters: Object<number, Object<number, {itemSets, categories}[]>>}[]}
 */
const filteredClusters = (clusteredItemSets) => {
    return clusteredItemSets.map((fileGroup) => {
        const filteredClusters = {};
        const level1Keys = Object.keys(fileGroup.clusters);
        for (const key1 of level1Keys) {
            const filteredCluster = {};
            const level2Keys = Object.keys(fileGroup.clusters[key1]);
            for (const key2 of level2Keys) {
                const count = fileGroup.clusters[key1][key2].length;
                if (count > 0) {
                    filteredCluster[key2] = fileGroup.clusters[key1][key2];
                }
            }
            if (Object.keys(filteredCluster).length > 0) {
                filteredClusters[key1] = filteredCluster;
            }
        }
        return {fileGroup: fileGroup.fileGroup, clusters: filteredClusters};
    });
};

/**
 * @param filteredClusters {{fileGroup, clusters: Object<number, Object<number, {itemSetIndex, categories}[]>>}[]}
 * @param featureMetaData {featureMetaDataType}
 * @returns {{fileGroup: {fileGroup: string, frequentItemSets: *[]},
 * clusters: Object<number, {parent: Object<string, *[]>, children: Object<number, Object<string, *[]>>[]}>
 *     }[]}
 */
const mergeClusterMembers = (filteredClusters,
    featureMetaData) => {
    /**
     * combine objects
     * @param obj {Object<string, {featureId, desc, featureIndex}>}
     * @param itemSetIndex {number}
     * @param key {string}
     * @param combinedObj {Object<string, {featureId, desc, featureIndex, itemSetIndices?: number[],
     *             frequency?: boolean}[]>}
     */
    function mergeObjects(obj, itemSetIndex, key, combinedObj) {
        if (!combinedObj[key]) {
            combinedObj[key] = [];
        }
        // Check for duplication based on featureId
        const existingIndex = combinedObj[key].findIndex((item) => item.featureId === obj[key].featureId);
        if (existingIndex === -1) {
            combinedObj[key].push(Object.assign({}, obj[key],
                {itemSetIndices: [itemSetIndex]},
            ));
        } else {
            combinedObj[key][existingIndex].itemSetIndices =
                [...new Set([...combinedObj[key][existingIndex].itemSetIndices, itemSetIndex])];
        }
    }

    return filteredClusters.map((fileGroupObject) => {
        const groupSetKeys = featureGroupInformation[fileGroupObject.fileGroup.fileGroup].categorizedFeatureSets;
        const mergedFeatures = {};
        const level1Keys = Object.keys(fileGroupObject.clusters);
        for (const key1 of level1Keys) {
            mergedFeatures[key1] = {parent: {}, children: {}};
            let allItemSetIndices = [];
            const level2Keys = Object.keys(fileGroupObject.clusters[key1]);
            for (const key2 of level2Keys) {
                mergedFeatures[key1].children[key2] = {};
                const itemSetIndices = [];
                for (const itemSetObject of fileGroupObject.clusters[key1][key2]) {
                    itemSetIndices.push(itemSetObject.itemSetIndex);
                    Object.keys(itemSetObject.categories[groupSetKeys[0][1]])
                        .forEach((key) => mergeObjects(
                            itemSetObject.categories[groupSetKeys[0][1]], itemSetObject.itemSetIndex,
                            key, mergedFeatures[key1].parent));
                    Object.keys(itemSetObject.categories[groupSetKeys[1][1]])
                        .forEach((key) => mergeObjects(
                            itemSetObject.categories[groupSetKeys[1][1]], itemSetObject.itemSetIndex,
                            key, mergedFeatures[key1].children[key2]));
                }
                const desc = featureMetaData.featureInfoContainers.featureInfoReverse[key2];
                const featureIndex = featureMetaData.featureInfoContainers.featureInfo[desc].featureIndex;
                const featureWeight = featureMetaData.featureInfoContainers.featureInfo[desc].weight;
                mergedFeatures[key1].children[key2][featureIndex] =
                    [{featureId: +key2, desc, featureIndex, itemSetIndices, featureWeight}];
                allItemSetIndices = [...new Set([...allItemSetIndices, ...itemSetIndices])];
            }

            const desc = featureMetaData.featureInfoContainers.featureInfoReverse[key1];
            const featureIndex = featureMetaData.featureInfoContainers.featureInfo[desc].featureIndex;
            const featureWeight = featureMetaData.featureInfoContainers.featureInfo[desc].weight;
            mergedFeatures[key1].parent[featureIndex] =
                [{featureId: +key1, desc, featureIndex, itemSetIndices: allItemSetIndices, featureWeight}];

            // calculate the frequency of features. It is used for color coding the GUI and generating xPath queries.
            for (const key2 of level2Keys) {
                const fis = Object.keys(mergedFeatures[key1].children[key2]);
                let subClusterItemSetCount = 0;
                for (const fi of fis) {
                    if (mergedFeatures[key1].children[key2][fi].length > 1) continue;
                    const featureId = mergedFeatures[key1].children[key2][fi][0].featureId;
                    if (featureId === +key2) {
                        subClusterItemSetCount = mergedFeatures[key1].children[key2][fi][0].itemSetIndices.length;
                        break;
                    }
                }
                for (const fi of fis) {
                    mergedFeatures[key1].children[key2][fi].forEach((item) => {
                        item.frequency = item.itemSetIndices.length / subClusterItemSetCount;
                    });
                }
            }
        }

        // calculate the frequency of features. It is used for color coding the GUI and generating xPath queries.
        for (const key1 of level1Keys) {
            const fis = Object.keys(mergedFeatures[key1].parent);
            let subClusterItemSetCount = 0;
            for (const fi of fis) {
                if (mergedFeatures[key1].parent[fi].length > 1) continue;
                const featureId = mergedFeatures[key1].parent[fi][0].featureId;
                if (featureId === +key1) {
                    subClusterItemSetCount = mergedFeatures[key1].parent[fi][0].itemSetIndices.length;
                    break;
                }
            }
            for (const fi of fis) {
                mergedFeatures[key1].parent[fi].forEach((item) => {
                    item.frequency = item.itemSetIndices.length / subClusterItemSetCount;
                });
            }
        }

        return {fileGroup: fileGroupObject.fileGroup, clusters: mergedFeatures};
    });
};

/**
 * @typedef {{parent: Object<string, *[]>, children: Object<number, Object<string, *[]>>[]}} clusterType
 * @param mergedClusters {{fileGroup: {fileGroup: string, frequentItemSets: *[]},
 * clusters: Object<number,clusterType>}[]}
 * @param featureMetaData {featureMetaDataType}
 * @returns {{fileGroup: {fileGroup: string, frequentItemSets: *[]},
 * builtObjects: {builtObject, identifierFeatureInfo}[]}[]}
 */
const createBuiltObjects = (mergedClusters, featureMetaData) => {
    function createFeatureObject(featureObjects, mergeKeys, builtObjects) {
        const featureKeys = Object.keys(featureObjects);
        for (const featureKey of featureKeys) {
            let maxWeight = 0;
            let maxFeatureId = -1;
            featureObjects[featureKey].forEach((featureObject) => {
                if (featureObject.featureWeight > maxWeight) {
                    maxWeight = featureObject.featureWeight;
                    maxFeatureId = featureObject.featureId;
                }
            });
            if (maxWeight === 0) continue;

            // add the feature to the builtObject
            for (const feature of featureObjects[featureKey]) {
                const featureInfo = featureMetaData.featureInfoContainers.featureInfo[feature.desc];
                const featureObject = defaultFeatures[featureInfo.featureIndex].FeatureObject;
                const featureChild = {
                    ...{
                        _data_: {
                            elements: featureObjects[featureKey],
                            maxFeatureId: maxFeatureId,
                        },
                    },
                    ...createWithChildrenForFeature(featureInfo),
                };
                if (featureObject.key === mergeKeys[0]) {
                    featureChild.isConstraint = true;
                }
                // When there are multiple child elements like parameters
                const repeatedChildIndices =
                    Utilities.findAllIndices(
                        builtObjects[featureObject.key].withChildren.map((child) => child.key), featureChild.key);
                let isChildAdded = false;
                if (repeatedChildIndices.length > 0) {
                    for (const repeatedChildIndex of repeatedChildIndices) {
                        // for nested elements like parameters
                        if (builtObjects[featureObject.key].withChildren[repeatedChildIndex].withChildren) {
                            const repeatedGrandChildIndex = builtObjects[featureObject.key]
                                .withChildren[repeatedChildIndex].withChildren
                                .findIndex((grandChild) => grandChild.key === featureChild.withChildren[0].key);

                            // if existing sub-element
                            if (repeatedGrandChildIndex > -1) {
                                builtObjects[featureObject.key].withChildren[repeatedChildIndex]
                                    .withChildren[repeatedGrandChildIndex]._data_ = {
                                        ...featureChild._data_,
                                        ...builtObjects[featureObject.key].withChildren[repeatedChildIndex]
                                            .withChildren[repeatedGrandChildIndex]._data_,
                                    };
                                isChildAdded = true;
                                break;
                            }
                        } else { // If element has no children by definition, but is repeated
                            builtObjects[featureObject.key].withChildren[repeatedChildIndex]._data_ = {
                                ...featureChild._data_,
                                ...builtObjects[featureObject.key].withChildren[repeatedChildIndex]._data_,
                            };
                            isChildAdded = true;
                            break;
                        }
                    }
                    // If no repeated grandChild is found
                    if (!isChildAdded) {
                        // For nested elements, like parameters.
                        // When a grandChild is a new element, add a new child.
                        // For example, when for parameter name and parameter type add two parameters.
                        // The reason is to create a correct xPath; parameter with name x and parameter with type y
                        if (featureChild.withChildren) {
                            featureChild.withChildren[0]._data_ = featureChild._data_;
                        }
                        builtObjects[featureObject.key].withChildren.push(featureChild);
                    }
                } else {
                    if (featureChild.withChildren) {
                        featureChild.withChildren[0]._data_ = featureChild._data_;
                    }
                    builtObjects[featureObject.key].withChildren.push(featureChild);
                }
                builtObjects[featureObject.key]._data_ = {
                    itemSetIndices: featureObjects[featureKey].map((d) => d.itemSetIndices).flat(),
                };
            }
        }
    }

    function createMasterObject(mergeKeys) {
        const masterBuiltObjects = {};
        for (const mergeKey of mergeKeys) {
            masterBuiltObjects[mergeKey] = {
                key: mergeKey,
                withChildren: [],
                _data_: [],
            };
        }
        return masterBuiltObjects;
    }

    function createGrammar(object) {
        let grammarText = object.key;
        if (object.withChildren) {
            const children = object.withChildren.map(createGrammar);
            grammarText += " with (" + children.join(" and ") + " )";
        } else if (object.value) {
            grammarText += ` "${object.value.word}"`;
        }
        return grammarText;
    }

    return mergedClusters.map((fileGroupObject) => {
        const mergeKeys = featureGroupInformation[fileGroupObject.fileGroup.fileGroup].mergeKeys;
        const clusterKeys = Object.keys(fileGroupObject.clusters);
        const builtObjects = [];
        for (const key of clusterKeys) {
            const featureObjects = fileGroupObject.clusters[key].parent;
            const parentFeature = createMasterObject(mergeKeys);
            createFeatureObject(featureObjects, mergeKeys, parentFeature);
            const builtObject = {parent: parentFeature[mergeKeys[0]], children: []};
            if (!builtObject.parent._data_) {
                builtObject.parent._data_ = {};
            }
            builtObject.parent._data_.grammar = createGrammar(parentFeature[mergeKeys[0]]);
            builtObject.selectedElement = true;
            builtObject.isConstraint = false;
            const childClusterKeys = Object.keys(fileGroupObject.clusters[key].children);
            for (const childKey of childClusterKeys) {
                const childFeatures = fileGroupObject.clusters[key].children[childKey];
                const builtObjectForCluster = createMasterObject(mergeKeys);
                createFeatureObject(childFeatures, mergeKeys, builtObjectForCluster);
                if (!builtObjectForCluster[mergeKeys[1]]._data_) {
                    builtObjectForCluster[mergeKeys[1]]._data_ = {};
                }
                builtObjectForCluster[mergeKeys[1]]._data_.grammar = createGrammar(builtObjectForCluster[mergeKeys[1]]);
                builtObjectForCluster[mergeKeys[1]]._data_.fullGrammar =
                    builtObject.parent._data_.grammar + " must have " +
                    builtObjectForCluster[mergeKeys[1]]._data_.grammar;
                builtObject.children.push(builtObjectForCluster[mergeKeys[1]]);
            }
            const desc = featureMetaData.featureInfoContainers.featureInfoReverse[key];
            const identifierFeatureInfo = featureMetaData.featureInfoContainers.featureInfo[desc];
            builtObjects.push({builtObject, identifierFeatureInfo});
        }
        return {fileGroup: fileGroupObject.fileGroup, builtObjects};
    });
};

/**
 * @param builtObjects {{fileGroup,
 * builtObjects: {builtObject: {children: [], parent: {key: string, withChildren:[], _data_: {}},
 * identifierFeatureInfo}}[]}[]}
 */
const sortBuiltObjectsByIdentifiers = (builtObjects) => {
    builtObjects.forEach((fileGroupObject) => {
        // sort level 1, parents
        fileGroupObject.builtObjects.sort((builtObj1, builtObj2) => {
            const parentFeatures1 = builtObj1.builtObject.parent.withChildren;
            const parentIdentifier1 = parentFeatures1
                .filter((feature) => identifierKeysInRulePad.includes(feature.key));
            if (parentIdentifier1.length !== 1) return -1;
            const identifierWeight1 = +parentIdentifier1[0]._data_.elements[0].featureWeight;

            const parentFeatures2 = builtObj2.builtObject.parent.withChildren;
            const parentIdentifier2 = parentFeatures2
                .filter((feature) => identifierKeysInRulePad.includes(feature.key));
            if (parentIdentifier2.length !== 1) return 1;
            const identifierWeight2 = +parentIdentifier2[0]._data_.elements[0].featureWeight;

            return identifierWeight2 - identifierWeight1;
        });

        // sort level 2, children
        fileGroupObject.builtObjects.forEach((builtObj) => {
            builtObj.builtObject.children.sort((child1, child2) => {
                const childFeatures1 = child1.withChildren;
                const childIdentifier1 = childFeatures1
                    .filter((feature) => identifierKeysInRulePad.includes(feature.key));
                if (childIdentifier1.length !== 1) return -1;
                const identifierWeight1 = +childIdentifier1[0]._data_.elements[0].featureWeight;

                const childFeatures2 = child2.withChildren;
                const childIdentifier2 = childFeatures2
                    .filter((feature) => identifierKeysInRulePad.includes(feature.key));
                if (childIdentifier2.length !== 1) return 1;
                const identifierWeight2 = +childIdentifier2[0]._data_.elements[0].featureWeight;

                return identifierWeight2 - identifierWeight1;
            });
        });
    });
};

/**
 * create an object readable by rulePadTextualEditor/generateGuiTree.createGuiElementTree
 * by combining FeatureObject property of each feature
 * xPath queries cannot be calculated here, because the received xmls should be processed.
 * @param builtObjects {{fileGroup: {fileGroup: string, frequentItemSets: *[]},
 * builtObjects: {cluster: clusterType, builtObject, identifierFeatureInfo}[]}[]}
 */
const createRulePad = (builtObjects) => {
    return builtObjects.map((fileGroupObject) => {
        const rulePadStates = [];
        fileGroupObject.builtObjects.forEach((clusterObject) => {
            const rulePadState = {
                parent: {}, children: [],
                identifierFeatureInfo: clusterObject.identifierFeatureInfo,
            };
            rulePadState.parent = processRulePadForMiningRules(clusterObject.builtObject.parent);
            rulePadState.children = clusterObject.builtObject.children.map(processRulePadForMiningRules);
            rulePadStates.push(rulePadState);
        });
        return {fileGroup: fileGroupObject.fileGroup.fileGroup, rulePadStates};
    });
};

/**
 * @param featureInfo
 * @return {{key: string, value: {word: string, type: string}}|
 *          {key: string, withChildren: {key: string, value: {word: string, type: string}}}}
 */
const createWithChildrenForFeature = (featureInfo) => {
    /** {key: string, withChildren:
     *          ({key: string, value: {word: string, type: string}}|
     *           {key: string, withChildren: {key: string, value: {word: string, type: string}}})}
     */
    const child = JSON.parse(JSON.stringify(defaultFeatures[featureInfo.featureIndex].FeatureObject.withChildren));
    if ("value" in child) {
        child.value.word = child.value.word.replace("<TEMP_0>", featureInfo.nodes[0]);
    } else if ("withChildren" in child) {
        const grandChildren = child.withChildren;
        let index = 0; // if there are more than one node.
        for (const grandChild of grandChildren) {
            if ("value" in grandChild) {
                grandChild.value.word = grandChild.value.word.replace(`<TEMP_${index}>`, featureInfo.nodes[index]);
                index++;
            }
        }
    }
    return child;
};


/**
 * Find the paths on which the mined rule is going to be checked.
 * @param featureIds {number[]}
 * @param fileGroup {string}
 * @param featureMetaData {featureMetaDataType}
 * @return {string[]}
 */
export const findFileFoldersForFeatureIds = (featureIds, fileGroup,
    featureMetaData) => {
    // only adding the paths of files that contain the constraint feature.
    let filesFolders = [];
    const mergeKeys = featureGroupInformation[fileGroup].mergeKeys;
    for (const featureId of featureIds) {
        const desc = featureMetaData.featureInfoContainers.featureInfoReverse[featureId];
        const featureInfo = featureMetaData.featureInfoContainers.featureInfo[desc];
        const featureObject = defaultFeatures[featureInfo.featureIndex].FeatureObject;
        if (featureInfo.weight >= MIN_WEIGHT_TO_INCLUDE_FILE && featureObject.key === mergeKeys[0]) {
            filesFolders = filesFolders.concat(featureMetaData.featureInfoContainers.featureMap[featureId]);
        }
    }
    const paths = [...new Set(filesFolders)];

    // combine paths
    // Create a dictionary to store paths by their common prefix
    const pathDict = {};
    for (const path of paths) {
        const prefix = path.split("/").slice(0, -1).join("/");
        if (!pathDict[prefix]) {
            pathDict[prefix] = [];
        }
        pathDict[prefix].push(path);
    }
    // Iterate over the paths and combine them if necessary
    const combinedPaths = [];
    for (const prefix in pathDict) {
        if (pathDict[prefix].length > 1) {
            const combinedPath = prefix + "/";
            combinedPaths.push(combinedPath);
        } else {
            combinedPaths.push(...pathDict[prefix]);
        }
    }
    return combinedPaths;
};

/**
 * create an xpath query from GUI
 * @param guiTree
 * @param guiElements
 * @param rootElementId
 * @return {*}
 */
export const createXPath = (guiTree, guiElements, rootElementId = guiTree.selectedElementID) => {
    const constraintTree = buildFromGUI(guiTree, guiElements, rootElementId, "constraint", true);
    const grammarTrivialTextC = buildTrivialGrammar(constraintTree);
    const textC = grammarTrivialTextC.map((d) => d.text).join(" ").replace(/\(\s/g, "(") + " ";
    const results = antlr(textC, "partial");
    return results.results?.constraint;
};

/**
 * Check if the guiElement is not an element or an identifier.
 * It is used to create an XPath
 * @param guiElements{{}} RulePad guiElements
 * @param guiElementId{string}
 * @return {boolean}
 */
export const isNotElementOrIdentifier = (guiElements, guiElementId) => {
    const elementType = getConditionByName(guiElements[guiElementId].conditionName).type;
    if (elementType === "element") return false;
    return !(identifier_element_ids.includes(guiElementId));
};

/**
 * Find the next algorithm for a given algorithm.
 * @param algorithm {{parameters: number[], key: string}}
 * @return {{parameters: number[], key: string}|null}
 */
export const switchAlgorithm = (algorithm) => {
    if (algorithm.key === allAlgorithms.CHUI_MINER_DEFAULT.key) {
        if (algorithm.parameters[0] === allAlgorithms.CHUI_MINER_DEFAULT.parameters[0]) {
            return allAlgorithms.CHUI_MINER_RELAXED;
        }
        if (algorithm.parameters[0] === allAlgorithms.CHUI_MINER_RELAXED.parameters[0]) {
            return allAlgorithms.CHUI_MINER_MAX;
        }
    }
    if (algorithm.key === allAlgorithms.CHUI_MINER_MAX.key) {
        return allAlgorithms.FP_MAX_DEFAULT;
    }
    if (algorithm.key === allAlgorithms.FP_MAX_DEFAULT.key) {
        if (algorithm.parameters[0] === allAlgorithms.FP_MAX_DEFAULT.parameters[0]) {
            return allAlgorithms.FP_MAX_RELAXED;
        }
        if (algorithm.parameters[0] === allAlgorithms.FP_MAX_RELAXED.parameters[0]) {
            return allAlgorithms.FP_MAX_EXTRA_RELAXED;
        }
        if (algorithm.parameters[0] === allAlgorithms.FP_MAX_EXTRA_RELAXED.parameters[0]) {
            return allAlgorithms.FP_CLOSE;
        }
    }
    return null;
};
