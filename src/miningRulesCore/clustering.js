/*
This file uses the BIRCH algorithm to cluster similar itemSets.
 */

import {BRANCHING_FACTOR, MAX_LEAF_ENTRIES, SIMILARITY_THRESHOLD} from "./featureConfig";

/**
 * @typedef {import("../initialState")} featureMetaDataType
 * @typedef {import("../initialState")} initialParsedOutputType
 * @typedef {import("../initialState")} initialFrequentItemSetType
 *
 * @typedef {{itemSets: Array, children: Array}} BirchNode
 */

/**
 * Function to calculate similarity between two itemSets
 * The similarity is measured by accumulating the weights of common features
 * @param itemSet1 {initialFrequentItemSetType}
 * @param itemSet2 {initialFrequentItemSetType}
 * @param featureMetaData {featureMetaDataType}
 * @returns {number}
 */
const similarity = (itemSet1, itemSet2,
                    featureMetaData) => {
    const set1 = new Set(itemSet1.featureIds);
    const set2 = new Set(itemSet2.featureIds);
    const commonFeatures = new Set([...set1].filter(x => set2.has(x)));
    return Array.from(commonFeatures).reduce((sum, featureId) => {
        let desc = featureMetaData.featureInfoContainers.featureInfoReverse[featureId];
        let weight = featureMetaData.featureInfoContainers.featureInfo[desc].weight;
        return sum + weight
    }, 0);
}

/**
 * given an itemSet, Finds the node in the BIRCH tree that is the most similar.
 * @param itemSet
 * @param node {BirchNode}
 * @param featureMetaData {featureMetaDataType}
 * @return {{similarNode: BirchNode, maxSimilarity: number}}
 */
const findSimilarNode = (itemSet, node, featureMetaData) => {
    let maxSimilarity = -1;
    let similarNode = node;
    if (node.children.length === 0) {
        maxSimilarity = Infinity;
        for (let item of node.itemSets) {
            // we want the new itemSet to have a high similarity with all the members
            let dist = similarity(itemSet, item, featureMetaData);
            if (dist < maxSimilarity) {
                maxSimilarity = dist;
                similarNode = node;
            }
        }
    } else {
        for (let child of node.children) {
            let result = findSimilarNode(itemSet, child, featureMetaData);
            if (result.maxSimilarity > maxSimilarity) {
                maxSimilarity = result.maxSimilarity;
                similarNode = result.similarNode;
            }
        }
    }
    return maxSimilarity >= SIMILARITY_THRESHOLD ? {maxSimilarity, similarNode} : {
        maxSimilarity: -1,
        similarNode: node
    };
}

/**
 * Function to cluster itemSets using BIRCH algorithm
 * @param data {initialFrequentItemSetType[]}
 * @param featureMetaData {featureMetaDataType}
 * @returns {initialFrequentItemSetType[][]}
 */
const runBIRCH = (data, featureMetaData) => {
    // Initialize BIRCH tree
    /**
     * @type {BirchNode}
     */
    const root = {itemSets: [], children: []};

    // Insert each itemSet into the BIRCH tree
    for (const itemSet of data) {
        let mostSimilar = findSimilarNode(itemSet, root, featureMetaData);
        let currentNode = mostSimilar.similarNode;

        // Insert itemSet into the most similar node
        // It is a leaf
        if (currentNode.children.length === 0) {
            currentNode.itemSets.push(itemSet);
            // Split the current node if it exceeds the maximum number of itemSets
            if (currentNode.itemSets.length > MAX_LEAF_ENTRIES) {
                let half = Math.floor(currentNode.children.length / 2);
                /**
                 * @type {BirchNode}
                 */
                let newChildOne = {itemSets: [], children: []};
                /**
                 * @type {BirchNode}
                 */
                let newChildTwo = {itemSets: [], children: []};
                for (let i = 0; i < half; i++) {
                    newChildOne.itemSets.push(currentNode.itemSets.pop());
                }
                while (currentNode.itemSets.length > 0) {
                    newChildTwo.itemSets.push(currentNode.itemSets.pop());
                }
                currentNode.children.push(newChildOne, newChildTwo);
            }
        }
        // It is a middle node
        else {
            /**
             * @type {BirchNode}
             */
            const newChild = {itemSets: [itemSet], children: []};
            if (currentNode.children.length < BRANCHING_FACTOR) {
                currentNode.children.push(newChild);
            }
            // Split the children if it exceeds the branching factor
            else {
                /**
                 * @type {BirchNode}
                 */
                let newParent = {itemSets: [], children: []};
                while (currentNode.children.length > 0) {
                    newParent.children.push(currentNode.children.pop());
                }
                currentNode.children.push(newParent, newChild);
            }
        }
    }
    /**
     * @type {initialFrequentItemSetType[][]}
     */
    const clusters = [];

    /**
     * Finds the itemSets stored in the leaves of the tree
     * @param node
     */
    function clusterNode(node) {
        if (node.children.length === 0) {
            if (node.itemSets.length > 0)
                clusters.push(node.itemSets);
        } else {
            for (const child of node.children) {
                clusterNode(child);
            }
        }
    }

    // Cluster itemSets in the BIRCH tree using hierarchical approach
    clusterNode(root);
    return clusters;
}


/**
 * @param initialParsedOutput {initialParsedOutputType}
 * @param featureMetaData {featureMetaDataType}
 * @return {{fileGroup: string, clusters: [[initialFrequentItemSetType]]}[]}
 */
export const clusterSimilarItemSets = (initialParsedOutput, featureMetaData) => {
    let clusteredResults = [];
    for (let fileGroup of initialParsedOutput) {
        let group = fileGroup.frequentItemSets;
        let clusters = runBIRCH(group, featureMetaData);
        clusteredResults.push({fileGroup: fileGroup.fileGroup, clusters});
    }
    return clusteredResults;
}

