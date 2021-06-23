/*
This file contains methods responsible for processing the mined rules, and
transform them into formats displayable for RulePad.
 */

import {attributeFileNames, minSupport} from "./featureConfig";
import {grammarTextToRulePadGUI, preProcessFeatureIdsForRules} from "./processing";

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
 * @param outputFiles array of {outputFileName: String of contents}
 * @return {{fileGroup: string, frequentItemSets: {featureIds, support, utility}[]}[]} // array of featureIds
 * each array is a frequent ItemSet
 */
export const parseFrequentItemSets_CHUI = (outputFiles) => {
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
 * @param outputData {{fileGroup: string, frequentItemSets: {featureIds, support, utility}[]}[]} // array of featureIds
 * (see return of parseFrequentItemSets_CHUI())
 */
export const removeSparseData = (outputData) => {
    for (let group of outputData) {
        group.frequentItemSets = group.frequentItemSets.filter(d => d.support >= minSupport);
    }
}

// /**
//  * merge similar design rules
//  * @param parseFrequentItemSets as {[{fileType: "", frequentItemSets: [{attributes[ids], support, utility}]}]
//  */
// export const mergeFrequentItemSets = (parseFrequentItemSets) => {
//     function levenshteinDistance(itemSet1, itemSet2) {
//         let len = Math.abs(itemSet1.length - itemSet2.length);
//         let diff = itemSet1
//             .filter(x => !itemSet2.includes(x))
//             .concat(itemSet2.filter(x => !itemSet1.includes(x)))
//             .length;
//         return Math.abs(len - diff);
//     }
//
//     let allClusters = [];
//     for (let groups of parseFrequentItemSets) {
//         /**
//          * @type {*[]} [{attributes[ids], support, utility}]
//          */
//         let fItemSets = groups.frequentItemSets;
//         fItemSets.sort((a, b) => b.attributes.length - a.attributes.length);
//
//         /**
//          * @type {[{cluster: *[], primary: {}}]}
//          */
//         let clusters = [];
//         for (let entry of fItemSets) {
//             let clustered = false;
//             for (let cl of clusters) {
//                 let distance = levenshteinDistance(entry.attributes, cl.primary.attributes);
//                 if (distance < 3) {
//                     clustered = true;
//                     cl.cluster.push(entry);
//                 }
//             }
//             if (!clustered)
//                 clusters.push({primary: entry, cluster: []})
//         }
//         allClusters.push({fileType: groups.fileType, clusters: clusters})
//     }
//     return allClusters;
// }

// /**
//  * compute the GUI states of received mined itemSets
//  * @param rawRules {[{
//  *    fileType: class|constructor|function,
//  *    clusters:
//  *          [{
//  *              primary: {attributes: [number], support: number, utility: number},
//  *              cluster: [{attributes: [number], support: number, utility: number}, {}]
//  *          }]
//  * }]}
//  * @param featureMetaData {{featureInfoContainers: {featureInfo: {}, featureInfoReverse: {},
//  * featureMap: {}, featureMapReverse: {}},
//  * featureGroups: {spec: {}, usage: {}}}}
//  * @returns array of promises
//  */
// export const processRules = (rawRules, featureMetaData) => {
//
//     function process(rule) {
//         let text = createTextFromItemSets(rule.attributes, featureMetaData);
//         return grammarTextToRulePadGUI(text)
//             .then(rulePadState => {
//                 return Object.assign({}, rule, {rulePadState: rulePadState, grammar: text})
//             });
//     }
//
//     return rawRules.map(group => {
//         return Promise.all(group.clusters.map(cl => {
//             return Promise.all([process(cl.primary)].concat(cl.cluster.map(c => process(c))))
//                 .then(values => {
//                     return {
//                         primary: values[0],
//                         cluster: values.slice(1)
//                     }
//                 })
//         })).then(rules => {
//             return {
//                 fileType: group.fileType,
//                 rules: rules
//             }
//         })
//     })
//
// }


/**
 * compute the GUI states of received mined itemSets
 * @param rawOutput {{fileGroup: string, frequentItemSets: {featureIds, support, utility}[]}[]}
 * @param featureMetaData {featureMetaDataType}
 * @returns array of promises
 */
export const processOutPutRules = (rawOutput, featureMetaData) => {
    function process(frequentItemSet) {
        let text = createTextFromItemSets_new(frequentItemSet.featureIds, featureMetaData);
        return grammarTextToRulePadGUI(text)
            .then(rulePadState => {
                return Object.assign({}, frequentItemSet, {rulePadState: rulePadState, grammar: text})
            });
    }

    return rawOutput.map(group => {
        return Promise
            .all(group.frequentItemSets.map(fIS => process(fIS)))
            .then(rules => {
                return {
                    group: group.fileGroup,
                    rules: rules
                }
            })
    })
}

/**
 * form a textual representation by merging features
 * @param featureIds {number[]}
 * @param featureMetaData {featureMetaDataType}
 * @return {string}
 */
export const createTextFromItemSets_new = (featureIds, featureMetaData) => {
    let texts = preProcessFeatureIdsForRules(featureIds, featureMetaData);
    texts.sort((a, b) => a.priority - b.priority);
    let finalRule = texts.length === 2 ?
        texts[0].preText + "( " + texts[0].text + " and " + texts[1].preText + texts[1].text + " )"
        : texts.length === 1 ?
            texts[0].preText + "( " + texts[0].text + " )"
            : "";
    // this condition is for parsing based on the grammar
    if (!finalRule.startsWith("class with"))
        finalRule = "class with ( " + finalRule + " )";

    return finalRule.replace(/ {2}/g, " ")
        .replace(/\)/g, " )")
        .replace(/\( /g, "(")
        .replace(/\) /g, ")")
        .replace(/ {2}/g, " ");
}

/**
 * cluster similar design rules
 * @param parseFrequentItemSets {[{fileType: "", frequentItemSets: [{attributes:[number], support, utility}]}]}
 * @param featureMetaData {{featureInfoContainers: {featureInfo: {}, featureInfoReverse: {},
 * featureMap: {}, featureMapReverse: {}},
 * featureGroups: {spec: {}, usage: {}}}}
 */
export const clusterFrequentItemSets = (parseFrequentItemSets, featureMetaData) => {
    // // let allClusters = [];
    // for (let groups of parseFrequentItemSets) {
    //     let fItemSets = groups.frequentItemSets.map(itemSet => {
    //         let generalFeatures = itemSet.attributes.filter(item => {
    //             let desc = featureMetaData.featureInfoContainers.featureInfoReverse[item];
    //             let featureIndex = featureMetaData.featureInfoContainers.featureInfo[desc].featureIndex;
    //             return generalClassFeatureIndex.includes(featureIndex);
    //         });
    //         generalFeatures.sort((a, b) => a - b);
    //         return {generalFeatures: generalFeatures.join(","), itemSet}
    //     });
    //
    //     let initialCluster = {};
    //     fItemSets.forEach(fItem => {
    //         if (initialCluster[fItem.generalFeatures])
    //             initialCluster[fItem.generalFeatures] = initialCluster[fItem.generalFeatures].concat([fItem.itemSet]);
    //         else
    //             initialCluster[fItem.generalFeatures] = [fItem.itemSet];
    //     });
    //
    //     // let clusters = [];
    //     // clusters.push({primary: entry, cluster: []});
    //
    //     // allClusters.push({fileType: groups.fileType, clusters: clusters})
    //
    //     // todo - incomplete
    //
    // }
}