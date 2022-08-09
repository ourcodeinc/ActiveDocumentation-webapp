/*
This file contains methods responsible for processing the mined rules, and
transform them into formats displayable for RulePad.
 */

import {
    attributeFileNames,
    defaultFeatures,
    minSupport,
    sortGroupInformation,
} from "./featureConfig";
import {processRulePadForMiningRules} from "../ui/RulePad/rulePadTextualEditor/generateGuiTree"

/**
 * @typedef {import("../initialState")} featureMetaDataType
 * @typedef {import("../initialState")} parsedOutputType
 * @typedef {import("../initialState")} initialParsedOutputType
 * @typedef {import("../initialState")} extendedParsedOutputType
 * @typedef {import("../initialState")} frequentItemSetType
 *
 * @param outputFiles array of {outputFileName: String of contents}
 * @param featureMetaData {featureMetaDataType}
 *
 * each array is a frequent ItemSet
 */
export async function processReceivedFrequentItemSets (outputFiles, featureMetaData) {
    let initialParsedOutput = parseFrequentItemSets_CHUI(outputFiles);
    removeSparseData(initialParsedOutput);
    let parsedOutput = doSeparateFIQ(initialParsedOutput, featureMetaData);
    let extendedParsedOutput = doGrouping(parsedOutput, featureMetaData);
    return Promise.resolve(createRulePad(extendedParsedOutput));
}

/**
 *
 * @param outputFiles array of {outputFileName: String of contents}
 * @return {initialParsedOutputType}
 */
const parseFrequentItemSets_CHUI = (outputFiles) => {
    let results = [];
    for (const [outputFileName, output] of Object.entries(outputFiles)) {
        let fileGroup = outputFileName.replace(attributeFileNames.prefix, "")
            .replace(attributeFileNames.postfix, "");
        let outputLines = output.split("\n");
        let frequentItemSets = [];
        for (let line of outputLines) {
            let split = line.split(" #");
            if (split.length < 3) continue;

            let featureIds = (split[0]).split(" ")
                .filter(d => d.trim() !== "")
                .map(d => +d);
            let support = +((split[1].trim()).replace("SUP: ", ""));
            let utility = +((split[2].trim()).replace("UTIL: ", ""));

            frequentItemSets.push({featureIds, support, utility});
        }
        results.push({fileGroup, frequentItemSets});
    }
    return results;
}

/**
 * remove frequent ItemSets found by a mining algorithms with low
 * support. The support is hardcoded for now
 * @param initialParsedOutput {initialParsedOutputType}
 * array of featureIds
 * (see return of parseFrequentItemSets_CHUI())
 */
const removeSparseData = (initialParsedOutput) => {
    for (let group of initialParsedOutput) {
        group.frequentItemSets = group.frequentItemSets.filter(d => d.support >= minSupport);
    }
}

/**
 * @param initialParsedOutput {initialParsedOutputType}
 * @param featureMetaData {featureMetaDataType}
 * @return {parsedOutputType}
 */
const doSeparateFIQ = (initialParsedOutput, featureMetaData) => {
    let newParsedGroup = [];
    for (let fileGroup of initialParsedOutput) {
        let newFG = {};
        newFG.fileGroup = fileGroup.fileGroup;
        newFG.frequentItemSets = fileGroup.frequentItemSets.map(fiq => {
            let newFIds = {};
            for (let fid of fiq.featureIds) {
                let desc = featureMetaData.featureInfoContainers.featureInfoReverse[fid];
                let fIndex = featureMetaData.featureInfoContainers.featureInfo[desc].featureIndex;
                let featureSortGroup = defaultFeatures[fIndex].FeatureSortGroup;
                if (featureSortGroup in newFIds)
                    newFIds[featureSortGroup].push(fid)
                else
                    newFIds[featureSortGroup] = [fid]
            }
            return {utility: fiq.utility, support: fiq.support, featureIds: newFIds}
        });
        newParsedGroup.push(newFG);
    }
    return newParsedGroup;
}

/**
 * @param parsedOutput {parsedOutputType}
 * @param featureMetaData {featureMetaDataType}
 * @returns {extendedParsedOutputType}
 */
const doGrouping = (parsedOutput, featureMetaData) => {
    /**
     * @param newFrequentItemSets {frequentItemSetType[]}
     * @param fiqIds {number[]}
     * @param groupByIdentifier
     * @returns {{frequentItemSetIds: number[], builtObject}[]}
     */
    function divide(newFrequentItemSets, fiqIds, groupByIdentifier) {
        if (newFrequentItemSets.length < fiqIds.length)
            return [];
        let toBeGroupedIndices = fiqIds;
        let result = [];
        while (toBeGroupedIndices.length > 0) {
            let maxId = newFrequentItemSets[toBeGroupedIndices[0]].featureIds[groupByIdentifier],
                maxCount = 0,
                count = {};
            // count occurrences
            for (let index of toBeGroupedIndices) {
                let fIds = newFrequentItemSets[index].featureIds[groupByIdentifier];
                for (let fId of fIds) {
                    if (fId in count)
                        count[fId].push(index)
                    else
                        count[fId] = [index];
                    if (count[fId].length > maxCount)
                        [maxCount, maxId] = [count[fId].length, +fId];
                }
            }
            if (maxCount === 0)
                return [{frequentItemSetIds: fiqIds}]

            let builtObject = buildObjectForFeature(maxId, featureMetaData);
            builtObject.frequentItemSetIds = count[maxId];
            for (let child of builtObject.withChildren)
                child.selectedFeatureId = maxId;

            result.push({frequentItemSetIds: count[maxId], builtObject});
            // filter the rest
            toBeGroupedIndices = toBeGroupedIndices.filter(d => !count[maxId].includes(d))
        }
        return result;
    }

    /**
     * @param divided {{frequentItemSetIds: number[], builtObject}}
     * @param newFileGroup {{fileGroup: string, frequentItemSets: frequentItemSetType[]}}
     * @param groupingIdentifier {string}
     */
    function doMerge(divided, newFileGroup, groupingIdentifier) {
        let merged = {};
        for (let fiqId of divided.frequentItemSetIds) { // for each itemSet
            let featureIds = newFileGroup.frequentItemSets[fiqId].featureIds;
            if (!(groupingIdentifier in featureIds)) break;
            for (let fid of featureIds[groupingIdentifier]) { // for each feature in the target group of the itemSet
                let desc = featureMetaData.featureInfoContainers.featureInfoReverse[fid];
                let featureIndex = featureMetaData.featureInfoContainers.featureInfo[desc].featureIndex;
                if (featureIndex in merged) {
                    if (fid in merged[featureIndex])
                        merged[featureIndex][fid].push(fiqId);
                    else
                        merged[featureIndex][fid] = [fiqId];
                } else {
                    merged[featureIndex] = {};
                    merged[featureIndex][fid] = [fiqId];
                }
            }
        }
        for (let featureIndex of Object.keys(merged)) {
            let maxId = null, maxCount = 0;
            for (let featureId of Object.keys(merged[featureIndex])) {
                if (merged[featureIndex][featureId].length > maxCount)
                    [maxId, maxCount] = [+featureId, merged[featureIndex][featureId].length]
            }
            if (maxId !== null) {
                let builtObject = buildObjectForFeature(maxId, featureMetaData);
                for (let child of builtObject.withChildren) {
                    child.frequentItemSetIds = merged[featureIndex][maxId];
                    child.allFeatureIds = Object.entries(merged[featureIndex]).map(d => {
                        return {featureId: +d[0], frequentItemSetIds: d[1]}
                    });
                    child.selectedFeatureId = maxId;
                }
                divided.builtObject.withChildren.push(...builtObject.withChildren);
            }
        }
        return divided;
    }

    let result = [];
    for (let fileGroup of parsedOutput) {
        let res = {
            fileGroup: fileGroup.fileGroup,
            builtObjects: []
        };
        let fis = fileGroup.frequentItemSets;
        let fiqIndices = new Array(fis.length).fill(0).map((_, i) => i);
        let groupingIdentifiers = sortGroupInformation[fileGroup.fileGroup].identifierGroup.groupBy;
        let divided = divide(fis, fiqIndices, groupingIdentifiers[0]);
        if (groupingIdentifiers.length > 1) {
            for (let div of divided) {
                let newDivided = divide(fis, div.frequentItemSetIds, groupingIdentifiers[1]);
                newDivided.forEach(nDiv => {
                    let groupingIdentifierDivided = sortGroupInformation[fileGroup.fileGroup].identifierGroup.rest[1];
                    doMerge(nDiv, fileGroup, groupingIdentifierDivided)
                    div.builtObject.withChildren.push(nDiv.builtObject);
                })
                let groupingIdentifier = sortGroupInformation[fileGroup.fileGroup].identifierGroup.rest[0];
                doMerge(div, fileGroup, groupingIdentifier);
                div.builtObject.selectedElement = true;
                res.builtObjects.push(div.builtObject);
            }
        } else {
            // todo
        }
        result.push(res);
    }
    return result;
}

const buildObjectForFeature = (featureId, featureMetaData) => {
    let desc = featureMetaData.featureInfoContainers.featureInfoReverse[featureId];
    let featureInfo = featureMetaData.featureInfoContainers.featureInfo[desc];
    /**{key: string, withChildren:
     *          ([{key: string, value: {word: string, type: string}}]|
     *           [{key: string, withChildren: [{key: string, value: {word: string, type: string}}]}])}
     */
    let obj = JSON.parse(JSON.stringify(defaultFeatures[featureInfo.featureIndex].FeatureObject));
    let count = 0;
    while (count < featureInfo.nodes.length) {
        for (let child of obj.withChildren) {
            if ("value" in child) {
                child.value.word = child.value.word.replace(`<TEMP_${count}>`, featureInfo.nodes[count]);
                count++;
                if (count === featureInfo.nodes.length) break;
            } else if ("withChildren" in child) {
                for (let grandChild of child.withChildren) {
                    if ("value" in grandChild) {
                        grandChild.value.word = grandChild.value.word.replace(`<TEMP_${count}>`, featureInfo.nodes[count]);
                        count++;
                        if (count === featureInfo.nodes.length) break;
                    }
                }
            }
        }
    }
    return obj;
}

/**
 * create an object readable by rulePadTextualEditor/generateGuiTree.createGuiElementTree
 * by combining FeatureObject property of each feature
 * @param extendedParsedOutput {extendedParsedOutputType}
 * @return {{}}
 */
const createRulePad = (extendedParsedOutput) => {
    return extendedParsedOutput.map(fileGroup => {
        let rulePadStates = fileGroup.builtObjects.map(obj => {
            return processRulePadForMiningRules(obj)
        })
        return {rulePadStates, data: fileGroup}
    })
}