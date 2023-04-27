/*
This file contains methods responsible for processing the mined rules, and
transform them into formats displayable for RulePad.
 */

import {
    selectedAlgorithm, allAlgorithms,
    attributeFileNames,
    defaultFeatures, featureGroupInformation,
    MIN_SUPPORT_FOR_FILTER, MIN_UTILITY_FOR_FILTER, MIN_WEIGHT_TO_INCLUDE_FILE
} from "./featureConfig";
import {clusterSimilarItemSets} from "./clustering";
import {processRulePadForMiningRules} from "../ui/RulePad/rulePadTextualEditor/generateGuiTree"

/**
 * @typedef {import("../initialState")} featureMetaDataType
 * @typedef {import("../initialState")} initialFrequentItemSetType
 * @typedef {import("../initialState")} initialParsedOutputType
 * @typedef {import("../initialState")} builtObjectRulePadOutputType
 *
 * @param outputFiles array of {outputFileName: String of contents}
 * @param featureMetaData {featureMetaDataType}
 *
 * each array is a frequent ItemSet
 */
export async function processReceivedFrequentItemSets (outputFiles, featureMetaData) {
    let initialParsedOutput = parseFrequentItemSets(outputFiles, featureMetaData);
    removeSparseItemSets(initialParsedOutput);
    let clusteredOutput = clusterSimilarItemSets(initialParsedOutput, featureMetaData);
    let combinedFeaturesOutput = combineFeatures(clusteredOutput, featureMetaData);
    sortClusters(combinedFeaturesOutput);
    let clusteredParsedOutput = createBuiltObject(combinedFeaturesOutput, featureMetaData);
    return Promise.resolve(createRulePad(clusteredParsedOutput, featureMetaData));
}

/**
 * parse the output of smpf.jar
 * @param outputFiles array of {outputFileName: String of contents}
 * @param featureMetaData {featureMetaDataType}
 * @return {initialParsedOutputType}
 */
const parseFrequentItemSets = (outputFiles, featureMetaData) => {
    let results = [];
    for (const [outputFileName, output] of Object.entries(outputFiles)) {
        let fileGroup = outputFileName.replace(attributeFileNames.prefix, "")
            .replace(attributeFileNames.postfix, "");
        let outputLines = output.split("\n");
        let frequentItemSets = [];
        for (let line of outputLines) {
            let split = line.split(" #");
            if (split.length < 3 && selectedAlgorithm === allAlgorithms.CHUI_MINER_MAX) continue;
            if (split.length < 2 && selectedAlgorithm === allAlgorithms.FP_MAX) continue;
            let featureIds = (split[0]).split(" ")
                .filter(d => d.trim() !== "")
                .map(d => +d);
            let support = +((split[1].trim()).replace("SUP: ", ""));
            let utility = 0;
            if (selectedAlgorithm === allAlgorithms.CHUI_MINER_MAX)
                utility = +((split[2].trim()).replace("UTIL: ", ""));
            else if (selectedAlgorithm === allAlgorithms.FP_MAX)
                utility = calculateUtility(featureIds, featureMetaData);

            frequentItemSets.push({featureIds, support, utility});
        }
        results.push({fileGroup, frequentItemSets});
    }
    return results;
}

/**
 * sum the weights of the features in the itemSet
 * @param featureIds {number[]}
 * @param featureMetaData {featureMetaDataType}
 * @returns {number}
 */
const calculateUtility = (featureIds, featureMetaData) => {
    let sumUtilities = 0;
    for (let featureId of featureIds) {
        let featureDesc = featureMetaData.featureInfoContainers.featureInfoReverse[featureId];
        if (!featureDesc) return 0;
        let featureInfo = featureMetaData.featureInfoContainers.featureInfo[featureDesc];
        if (!featureInfo) return 0;
        sumUtilities += featureInfo.weight;
    }
    return sumUtilities;
}

/**
 * remove frequent ItemSets found by a mining allAlgorithms with low
 * support and low utility.
 * @param initialParsedOutput {initialParsedOutputType}
 * array of featureIds
 * (see return of parseFrequentItemSets_CHUI())
 */
const removeSparseItemSets = (initialParsedOutput) => {
    for (let group of initialParsedOutput) {
        group.frequentItemSets = group.frequentItemSets
            .filter(d => d.support >= MIN_SUPPORT_FOR_FILTER && d.utility >= MIN_UTILITY_FOR_FILTER);
    }
}

/**
 * Combine the features in each cluster
 * @param clusteredOutput {[{fileGroup: string, clusters: [[initialFrequentItemSetType]]}]}
 * @param featureMetaData {featureMetaDataType}
 * @return {{fileGroup: string, clusters: {combinedFeatures: {}, cluster: [initialFrequentItemSetType]}[]}[]}
 */
const combineFeatures = (clusteredOutput,
                         featureMetaData) => {
    let results = [];
    for (let fileGroup of clusteredOutput) {
        let combinedClusters = [];
        for (let cluster of fileGroup.clusters) {
            let combinedFeatures = {};
            for (let i = 0; i < cluster.length; i++) {
                let itemSet = cluster[i];
                for (let featureId of itemSet.featureIds) {
                    let desc = featureMetaData.featureInfoContainers.featureInfoReverse[featureId];
                    let featureInfo = featureMetaData.featureInfoContainers.featureInfo[desc];
                    let featureIndex = featureInfo.featureIndex;
                    if (!(featureIndex in combinedFeatures)) {
                        combinedFeatures[featureIndex] = {};
                    }
                    if (!(featureId in combinedFeatures[featureIndex])) {
                        combinedFeatures[featureIndex][featureId] = [];
                    }
                    combinedFeatures[featureIndex][featureId].push(i);
                }
            }
            combinedClusters.push({combinedFeatures, cluster});
        }
        results.push({fileGroup: fileGroup.fileGroup, clusters: combinedClusters});
    }
    return results;
}

/**
 * Sort clusters based on their utilities and supports
 * @param combinedFeaturesOutput {
 * {fileGroup: string, clusters: {combinedFeatures: {}, cluster: [initialFrequentItemSetType]}[]}[]}
 */
const sortClusters = (combinedFeaturesOutput) => {
    /**
     * First sort by sum of utilities, then cluster size, finally average support.
     * @param cluster1 {{combinedFeatures: {}, cluster: [initialFrequentItemSetType]}}
     * @param cluster2 {{combinedFeatures: {}, cluster: [initialFrequentItemSetType]}}
     */
    let sortFunction = (cluster1,
                        cluster2) => {
        // Step 1
        let sumUtility2 =
            cluster2.cluster.reduce((sum, itemSet) => sum + itemSet.utility, 0);
        let sumUtility1 =
            cluster1.cluster.reduce((sum, itemSet) => sum + itemSet.utility, 0);
        if (sumUtility2 !== sumUtility1)
            return  sumUtility2 - sumUtility1
        // Step 2
        if (cluster2.cluster.length !== cluster1.cluster.length)
            return cluster2.cluster.length - cluster1.cluster.length;
        // Step 3
        let averageSupport2 =
            (cluster2.cluster.reduce((sum, itemSet) => sum + itemSet.support, 0))
            / cluster2.cluster.length;
        let averageSupport1 =
            (cluster1.cluster.reduce((sum, itemSet) => sum + itemSet.support, 0))
            / cluster1.cluster.length;
        return averageSupport2 - averageSupport1;
    }

    combinedFeaturesOutput.forEach(fileGroup => {
        fileGroup.clusters.sort(sortFunction);
    });
}

/**
 * @param combinedFeaturesOutput {{fileGroup: string,
 * clusters: {combinedFeatures: {}, cluster: [initialFrequentItemSetType]}[]}[]}
 * @param featureMetaData {featureMetaDataType}
 * @return {builtObjectRulePadOutputType}
 */
const createBuiltObject = (combinedFeaturesOutput,
                           featureMetaData) => {
    let results = [];
    for (let fileGroup of combinedFeaturesOutput) {
        let builtClusters = [];
        for (let cluster of fileGroup.clusters) {
            let builtObjects = {};
            let mergeKeys = featureGroupInformation[fileGroup.fileGroup].mergeKeys;
            for (let mergeKey of mergeKeys) {
                builtObjects[mergeKey] = {key: mergeKey, withChildren: [],
                    _data_: {cluster: cluster.cluster}};
            }
            let combinedFeatures = cluster.combinedFeatures;
            let combinedFeaturesKeys = Object.keys(combinedFeatures);
            for (let featureKey of combinedFeaturesKeys) {
                // find feature value with most occurrences
                let maxOccurrence = 0;
                let maxFeatureId = -1;
                Object.keys(combinedFeatures[featureKey]).forEach(featureId => {
                    if (combinedFeatures[featureKey][featureId].length > maxOccurrence) {
                        maxOccurrence = combinedFeatures[featureKey][featureId].length;
                        maxFeatureId = featureId;
                    }
                });
                if (maxOccurrence === 0) continue;

                // add the feature to the builtObject
                let desc = featureMetaData.featureInfoContainers.featureInfoReverse[maxFeatureId];
                let featureInfo = featureMetaData.featureInfoContainers.featureInfo[desc];
                let featureObject = defaultFeatures[featureInfo.featureIndex].FeatureObject;
                let featureChild = {...{_data_: combinedFeatures[featureKey],
                        _occurrence_: maxOccurrence, _featureId_: maxFeatureId},
                ...createWithChildrenForFeature(featureInfo)};
                if (featureObject.key === mergeKeys[0]) {
                    featureChild.isConstraint = true;
                }

                let repeatedChildIndex = builtObjects[featureObject.key].withChildren
                    .findIndex(child => child.key === featureChild.key);
                if (repeatedChildIndex > -1) {
                    let combinedData = {
                        ...featureChild._data_,
                        ...builtObjects[featureObject.key].withChildren[repeatedChildIndex]._data_
                    };
                    if (builtObjects[featureObject.key].withChildren[repeatedChildIndex]._occurrence_
                        < featureChild._occurrence_) {
                        featureChild._data_ = combinedData;
                        builtObjects[featureObject.key].withChildren[repeatedChildIndex] = featureChild;
                    }
                    else
                        builtObjects[featureObject.key].withChildren[repeatedChildIndex]._data_ = combinedData;
                }
                else
                    builtObjects[featureObject.key].withChildren.push(featureChild);
            }
            let builtObject = builtObjects[mergeKeys[0]];
            builtObject.withChildren.push(builtObjects[mergeKeys[1]]);
            builtObject._data_ = {cluster: cluster.cluster};
            builtObject.selectedElement = true;
            builtObject.isConstraint = false;
            builtClusters.push(builtObject);
        }
        results.push({fileGroup: fileGroup.fileGroup, clusters: builtClusters});
    }
    return results;
}

/**
 * @param featureInfo
 * @return {{key: string, value: {word: string, type: string}}|
 *          {key: string, withChildren: {key: string, value: {word: string, type: string}}}}
 */
const createWithChildrenForFeature = (featureInfo) => {
    /**{key: string, withChildren:
     *          ({key: string, value: {word: string, type: string}}|
     *           {key: string, withChildren: {key: string, value: {word: string, type: string}}})}
     */
    let child = JSON.parse(JSON.stringify(defaultFeatures[featureInfo.featureIndex].FeatureObject.withChildren));
    if ("value" in child) {
        child.value.word = child.value.word.replace(`<TEMP_0>`, featureInfo.nodes[0]);
    } else if ("withChildren" in child) {
        let grandChild = child.withChildren;
        if ("value" in grandChild) {
            grandChild.value.word = grandChild.value.word.replace(`<TEMP_0>`, featureInfo.nodes[0]);
        }
    }
    return child;
}

/**
 * @param featureIndex {string}
 * @param combinedFeature {number[]}
 * @param featureMetaData {featureMetaDataType}
 * @return {any}
 */
const createWithChildrenForCombinedFeatures = (featureIndex, combinedFeature, featureMetaData) => {
    /**{key: string, withChildren:
     *          ({key: string, value: {word: string, type: string}}|
     *           {key: string, withChildren: {key: string, value: {word: string, type: string}}})}
     */
    let child = JSON.parse(JSON.stringify(defaultFeatures[featureIndex].FeatureObject.withChildren));
    let values = [];
    for (let featureId of combinedFeature) {
        let desc = featureMetaData.featureInfoContainers.featureInfoReverse[featureId];
        let featureInfo = featureMetaData.featureInfoContainers.featureInfo[desc];
        values.push(featureInfo.nodes[0])
    }
    if ("value" in child) {
        child.value.word = child.value.word.replace(`<TEMP_0>`, values.join("||"));
    } else if ("withChildren" in child) {
        let grandChild = child.withChildren;
        if ("value" in grandChild) {
            grandChild.value.word = grandChild.value.word.replace(`<TEMP_0>`, values.join("||"));
        }
    }
    return child;
}

/**
 * create an object readable by rulePadTextualEditor/generateGuiTree.createGuiElementTree
 * by combining FeatureObject property of each feature
 * @param clusteredParsedOutput {builtObjectRulePadOutputType}
 * @param featureMetaData {featureMetaDataType}
 * @return {{buildObjectData, rulePadStates}[]}
 */
const createRulePad = (clusteredParsedOutput, featureMetaData) => {
    return clusteredParsedOutput.map(fileGroup => {
        let rulePadStates = fileGroup.clusters.map(cluster => {
            return processRulePadForMiningRules(cluster)
        });
        let clusters = fileGroup.clusters.map(d => {
            let cluster = d._data_.cluster;
            let allFeatures = cluster.reduce((features, itemSet) => [...features, ...itemSet.featureIds], []);
            allFeatures = [... new Set(allFeatures)];
            let sumWeights = allFeatures.reduce((sum, featureId) => {
                let desc = featureMetaData.featureInfoContainers.featureInfoReverse[featureId];
                return sum + featureMetaData.featureInfoContainers.featureInfo[desc].weight;
                }, 0)
            return {
                cluster,
                sumWeights,
                averageSupport:
                    Math.floor((cluster.reduce((sum, itemSet) => sum + itemSet.support, 0))
                        / cluster.length)
            }
        });
        return {
            rulePadStates,
            fileGroup: fileGroup.fileGroup,
            clusters
        };
    })
}

/**
 * Create the RulePadState for a single itemSet
 * @param frequentItemSet {initialFrequentItemSetType}
 * @param fileGroup {string}
 * @param featureMetaData {featureMetaDataType}
 * @return {{guiTree: any, guiElements: any}}
 */
export const createRulePadStateForItemSet = (frequentItemSet, fileGroup, featureMetaData) => {
    // combine overlapping features
    let combinedFeatures = {};
    for (let featureId of frequentItemSet.featureIds) {
        let desc = featureMetaData.featureInfoContainers.featureInfoReverse[featureId];
        let featureInfo = featureMetaData.featureInfoContainers.featureInfo[desc];
        let featureIndex = featureInfo.featureIndex.replace(/(_starts_with)|(_ends_with)/, '');
        if (!(featureIndex in combinedFeatures)) {
            combinedFeatures[featureIndex] = [];
        }
        combinedFeatures[featureIndex].push(featureId);
    }
    let builtObjects = {};
    let mergeKeys = featureGroupInformation[fileGroup].mergeKeys;
    for (let mergeKey of mergeKeys) {
        builtObjects[mergeKey] = {key: mergeKey, withChildren: []};
    }
    let combinedFeaturesKeys = Object.keys(combinedFeatures);
    for (let combinedFeatureKey of combinedFeaturesKeys) {
        let desc = featureMetaData.featureInfoContainers.featureInfoReverse[combinedFeatures[combinedFeatureKey][0]];
        let featureInfo = featureMetaData.featureInfoContainers.featureInfo[desc];
        let featureObject = defaultFeatures[featureInfo.featureIndex].FeatureObject;
        let featureChild =
                createWithChildrenForCombinedFeatures(combinedFeatureKey, combinedFeatures[combinedFeatureKey], featureMetaData);
        if (featureObject.key === mergeKeys[1]) {
            featureChild.isConstraint = true;
        }
        builtObjects[featureObject.key].withChildren.push(featureChild);
    }
    builtObjects[mergeKeys[1]].isConstraint = true;
    let builtObject = builtObjects[mergeKeys[0]];
    builtObject.withChildren.push(builtObjects[mergeKeys[1]]);
    builtObject.selectedElement = true;
    builtObject.isConstraint = false;
    return processRulePadForMiningRules(builtObject);
}

/**
 * Find the paths on which the mined rule is going to be checked.
 * @param maxUtilityItemSet {initialFrequentItemSetType}
 * @param fileGroup {string}
 * @param featureMetaData {featureMetaDataType}
 * @return {string[]}
 */
export const findFileFoldersForItemSet = (maxUtilityItemSet, fileGroup,
                                          featureMetaData) => {
    // only adding the paths of files that contain the constraint feature.
    let filesFolders = [];
    let mergeKeys = featureGroupInformation[fileGroup].mergeKeys;
    let featureIds = maxUtilityItemSet.featureIds;
    for (let featureId of featureIds) {
        let desc = featureMetaData.featureInfoContainers.featureInfoReverse[featureId];
        let featureInfo = featureMetaData.featureInfoContainers.featureInfo[desc];
        let featureObject = defaultFeatures[featureInfo.featureIndex].FeatureObject;
        if (featureInfo.weight >= MIN_WEIGHT_TO_INCLUDE_FILE && featureObject.key === mergeKeys[0]) {
            filesFolders = filesFolders.concat(featureMetaData.featureInfoContainers.featureMap[featureId]);
        }
    }
    let paths = [...new Set(filesFolders)];

    // combine paths
    // Create a dictionary to store paths by their common prefix
    const pathDict = {};
    for (const path of paths) {
        const prefix = path.split('/').slice(0, -1).join('/');
        if (!pathDict[prefix]) {
            pathDict[prefix] = [];
        }
        pathDict[prefix].push(path);
    }
    // Iterate over the paths and combine them if necessary
    const combinedPaths = [];
    for (const prefix in pathDict) {
        if (pathDict[prefix].length > 1) {
            const combinedPath = prefix + '/';
            combinedPaths.push(combinedPath);
        } else {
            combinedPaths.push(...pathDict[prefix]);
        }
    }
    return combinedPaths;
}