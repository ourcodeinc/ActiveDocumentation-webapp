/*
This file contains methods responsible for processing the mined rules, and
transform them into formats displayable for RulePad.
 */

import {
    attributeFileNames,
    breakFeatureDescription,
    defaultFeatures,
    minSupport,
    sortGroupInformation,
} from "./featureConfig";
import {verifyPartialTextBasedOnGrammar} from "../core/languageProcessing";
import {generateGuiTrees} from "../ui/RulePad/rulePadTextualEditor/generateGuiTree";

/**
 * @typedef {import("../initialState")} featureMetaDataType
 * @typedef {import("../initialState")} parsedOutputType
 * @typedef {import("../initialState")} initialParsedOutputType
 * @typedef {import("../initialState")} extendedParsedOutputType
 * @typedef {import("../initialState")} dividedType
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
    let processedOutputPromise = processOutPutRules(extendedParsedOutput, featureMetaData);
    console.log({initialParsedOutput, featureMetaData, extendedParsedOutput,processedOutputPromise}); // todo remove
    return processedOutputPromise;
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
     * @returns {{selectedFeatureId: number|null, otherFeatureIds: {}, frequentItemSetIds: number[]}[]}
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
                    if (count[fId].length > maxCount) {
                        maxCount = count[fId].length;
                        maxId = fId;
                    }
                }
            }
            if (maxCount === 0)
                return [{selectedFeatureId: null, otherFeatureIds: null, frequentItemSetIds: fiqIds}]
            result.push({selectedFeatureId: maxId, otherFeatureIds: count, frequentItemSetIds: count[maxId]});
            // filter the rest
            toBeGroupedIndices = toBeGroupedIndices.filter(d => !count[maxId].includes(d))
        }
        return result;
    }

    /**
     * @param divided {{selectedFeatureId: number|null, otherFeatureIds: {}, frequentItemSetIds: number[]}}
     * @param newFileGroup {{fileGroup: string, frequentItemSets: frequentItemSetType[]}}
     * @param groupingIdentifier {string}
     * @return {*}
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
        return merged;
    }

    let result = [];
    for (let fileGroup of parsedOutput) {
        let res = {fileGroup: fileGroup.fileGroup, frequentItemSets: fileGroup.frequentItemSets, divided: []};
        let fis = fileGroup.frequentItemSets;
        let fiqIndices = new Array(fis.length).fill(0).map((_, i) => i);
        let groupingIdentifiers = sortGroupInformation[fileGroup.fileGroup].identifierGroup.groupBy;
        let divided = divide(fis, fiqIndices, groupingIdentifiers[0]);
        if (groupingIdentifiers.length > 1) {
            for (let div of divided) {
                let newDivided = divide(fis, div.frequentItemSetIds, groupingIdentifiers[1]);
                let subDivided = [];
                newDivided.forEach(nDiv => {
                    let groupingIdentifierDivided = sortGroupInformation[fileGroup.fileGroup].identifierGroup.rest[1];
                    let mergedDividedFeatureIds = doMerge(nDiv, fileGroup, groupingIdentifierDivided)
                    subDivided.push({selectedSpecifier: nDiv.selectedFeatureId,
                        otherSpecifiers: nDiv.otherFeatureIds, frequentItemSetIds: nDiv.frequentItemSetIds,
                        mergedFeatureIds: mergedDividedFeatureIds});
                })
                let groupingIdentifier = sortGroupInformation[fileGroup.fileGroup].identifierGroup.rest[0];
                let mergedFeatureIds = doMerge(div, fileGroup, groupingIdentifier)
                res.divided.push({selectedSpecifier: div.selectedFeatureId,
                    otherSpecifiers: div.otherFeatureIds,
                    frequentItemSetIds: div.frequentItemSetIds, mergedFeatureIds, subDivided});
            }
        }
        else {
            // todo, and fix dividedType
            // subDivided = null
        }
        result.push(res);
    }
    return result;
}

/**
 * compute the GUI states of received mined itemSets
 * @param parsedOutput {extendedParsedOutputType}
 * @param featureMetaData {featureMetaDataType}
 * @returns {Promise[]}
 */
export const processOutPutRules = (parsedOutput, featureMetaData) => {

    /**
     * @param featureIdGroup {Object<string, Object<number, number[]>>}
     * @returns {number[]}
     */
    function extracted(featureIdGroup) {
        let result = [];
        let featureGroupIds = Object.keys(featureIdGroup);
        for (let groupId of featureGroupIds ) {
            let maxId = -1, maxCount = 0;
            let fIds = Object.keys(featureIdGroup[groupId]);
            for (let fId of fIds) {
                let count = featureIdGroup[groupId][fId].length;
                if (count > maxCount)
                    [maxId, maxCount] = [fId, count]
            }
            if (maxCount > 0) result.push(maxId);
        }
        return result;
    }

    for (let fileGroup of parsedOutput) {
        let allRules = fileGroup.divided;
        for (let ruleGroup of allRules) {
            let text = "";
            let fids = [ruleGroup.selectedSpecifier];
            // first process the features of the container
            let mergedFeatureIds = extracted(ruleGroup.mergedFeatureIds)
            fids.push(...mergedFeatureIds);
            ruleGroup.grammarText = createTextFromItemSets(fids, featureMetaData);
            text = ruleGroup.grammarText;
            if (ruleGroup.subDivided !== null) {
                text = text + " and (";
                let subtexts = [];
                for (let rule of ruleGroup.subDivided) {
                    fids = [rule.selectedSpecifier];
                    let mergedFeatureIdsRule = extracted(rule.mergedFeatureIds);
                    fids.push(...mergedFeatureIdsRule);
                    rule.grammarText = createTextFromItemSets(fids, featureMetaData);
                    subtexts.push(rule.grammarText);
                }
                text = text + subtexts.join(" and ") + ")"
            }
            ruleGroup.mergedGrammarText = text;
        }
    }

    return parsedOutput.map(fileGroup => {
        return Promise
            .all(fileGroup.divided.map(ruleGroup => {
                return grammarTextToRulePadGUI(ruleGroup.mergedGrammarText)
                    .then(rulePadState => {
                        return {rulePadState: rulePadState, grammar: ruleGroup.mergedGrammarText, ruleGroup}
                    });
            }))
            .then(rules => {
                return {
                    frequentItemSets: fileGroup.frequentItemSets,
                    fileGroup: fileGroup.fileGroup,
                    rules: rules
                }
            })
    })
}

/**
 * cleanup a textual representation formed by merging features to create a grammar text
 * @param featureIds {number[]}
 * @param featureMetaData {featureMetaDataType}
 * @return {string}
 */
export const createTextFromItemSets = (featureIds, featureMetaData) => {
    let texts = preProcessFeatureIdsForRules(featureIds, featureMetaData);
    texts.sort((a, b) => a.priority - b.priority);
    let finalRule = texts.length === 2 ?
        texts[0].preText + "( " + texts[0].text + " and " + texts[1].preText + texts[1].text + " )"
        : texts.length === 1 ?
            texts[0].preText + "( " + texts[0].text + " )"
            : "";

    // cleanup the extra characters
    return finalRule.replace(/ {2}/g, " ")
        .replace(/\)/g, " )")
        .replace(/\( /g, "(")
        .replace(/\) /g, ")")
        .replace(/ {2}/g, " ");
}

/**
 * generate the GUI tree for the grammar text
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
 * merge feature description of features of groups to create a grammar text
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
            if (feature_desc.startsWith(breakText.prefix)) {
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
            textArray.push(feature_desc.slice(breakText.prefix.length));
        }
        let text = "( " + textArray.join(" and ") + " )";
        texts.push({priority: breakText.priority, id: breakText.id, text, preText: breakText.prefix})
    }
    return texts;
}