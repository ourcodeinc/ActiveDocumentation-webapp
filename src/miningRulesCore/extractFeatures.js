/*
This file contains methods for extracting features using the sets of predefined
features as in featureConfig.js
 */

import {featureTypes, mapFocusedElementToFeatures, defaultFeatures} from "./featureConfig";
import {
    returnNodeArray,
    runXPathMultipleNodes, runXPathMultipleNodesAndChildren,
    runXPathNoNode,
    runXPathSingleNode, runXPathSingleNodeAndChildren
} from "./xPathQueryExecutor";


/**
 * featureInfo is a Map > featureDescription: {featureId, featureIndex (from features in featureConfig), nodes, weight}
 * featureInfoReverse is a Map > featureId: featureDescription
 * featureMap is a Map > featureId: array of identifiers
 * featureMapReverse is a Map > identifier: array of featureIds
 *
 * featureInfoContainers: {featureInfo, featureInfoReverse, featureMap, featureMapReverse}
 * featureCategories: {classType, constructorType, functionType}
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
 * @typedef {{identifier: string, mapFocusedElementToFeaturesKey: string, filePath: string}} focusedElementDataType
 *
 * as featureMetaData
 * note: if changed, update minedRulesState.featureMetaData accordingly
 */
export const createFeatureMetaDataMap = () => {
    return {
        featureInfoContainers: {featureInfo: {}, featureInfoReverse: {}, featureMap: {}, featureMapReverse: {}},
        featureGroups: {spec: {}, usage: {}}
    }
};


/**
 * extract features for one xmlFile. It updates 5 main maps given as input parameters
 * @param xmlFile {{xml: string, filePath: string}}
 * @param projectPath {string} is used to simplify the identifiers
 * @param focusedElementData {focusedElementDataType}
 * @param featureMetaData {featureMetaDataType}
 */
export function extractFeaturesFromXmlFile(xmlFile, projectPath,
                                           focusedElementData,
                                           featureMetaData) {
    let key = focusedElementData.mapFocusedElementToFeaturesKey;
    let identifier = focusedElementData.identifier;
    let featuresToExtract = mapFocusedElementToFeatures[key];

    let xmlFeatureIds = [];
    for (let i = 0; i < featuresToExtract.spec.length; i++) {
        let spec_item = featuresToExtract.spec[i];
        let container_xpath = (defaultFeatures[spec_item.container.node]).xpath;
        let containerNodes = returnNodeArray(xmlFile.xml, container_xpath);
        for (let j = 0; j < containerNodes.length; j++) {
            let containerFeatureIds = [];
            let containerNode = containerNodes[j];
            for (let featureId of spec_item.container.featureSet) {
                let container_node_xpath = (spec_item.container.featureQueryPrefix ? spec_item.container.featureQueryPrefix : "") +
                    (defaultFeatures[featureId].xpath);
                containerFeatureIds = containerFeatureIds.concat(extractFeatureFromNode(containerNode, featureId,
                    featureMetaData, container_node_xpath));
            }

            for (let k = 0; k < spec_item.content_groups.length; k++) {
                let group = spec_item.content_groups[k];
                let groupNodes = [containerNode];
                if (group.node) {
                    let group_xpath = defaultFeatures[group.node].xpath;
                    groupNodes = returnNodeArray(containerNode, group_xpath);
                }

                for (let l = 0; l < groupNodes.length; l++) {
                    let node = groupNodes[l];
                    let groupFeatureIds = []
                    for (let featureId of group.featureSet) {
                        let xpath_feature = (group.featureQueryPrefix ? group.featureQueryPrefix : "") +
                            (defaultFeatures[featureId].xpath);
                        let result = extractFeatureFromNode(node, featureId, featureMetaData, xpath_feature);
                        groupFeatureIds = groupFeatureIds.concat(result);
                    }

                    let groupId = group.id;//`${key}_spec_${i}_content_groups_${k}`;
                    if (!featureMetaData.featureGroups.spec[groupId])
                        featureMetaData.featureGroups.spec[groupId] = {elementFeatures: [], rule: {}};
                    let element = `${xmlFile.filePath.replace(projectPath, "")}_${spec_item.container.type}_${j}_${group.type}_${l}`;
                    let featureIds = containerFeatureIds.concat(groupFeatureIds);
                    featureMetaData.featureGroups.spec[groupId].elementFeatures.push({element, featureIds});
                    xmlFeatureIds = [...new Set(xmlFeatureIds.concat(featureIds))];
                }
            }

            let newUsageFeatureIds = processFeatureSetUsage(xmlFile, projectPath, featureMetaData, key,
                featuresToExtract, containerNode, identifier);
            xmlFeatureIds = [...new Set(xmlFeatureIds.concat(newUsageFeatureIds))];
        }
    }
    addFeatureIdsToMap(xmlFeatureIds, xmlFile.filePath.replace(projectPath, ""), featureMetaData);
}

/**
 * extract the features of mapFocusedElementToFeatures[key].usage for xmlFile
 * @param xmlFile {{xml: string, filePath: string}}
 * @param projectPath {string} is used to simplify the identifiers
 * @param featureMetaData {featureMetaDataType}
 * @param key {string} of the mapFocusedElementToFeatures
 * @param featuresToExtract {{spec: [], usage: []}} selected from mapFocusedElementToFeatures
 * @param parentNode {Node} the node on which the usage queries are executed
 * @param identifier {string} identifier of the focused element
 * @return {number[]} array of featureIds for the xmlFile
 */
const processFeatureSetUsage = (xmlFile, projectPath, featureMetaData,
                                key, featuresToExtract, parentNode, identifier) => {
    let newUsageFeatureIds = [];
    for (let i = 0; i < featuresToExtract.usage.length; i++) {
        let usage_item = featuresToExtract.usage[i];
        let container_xpath = (defaultFeatures[usage_item.container.node]).xpath
            .replace(new RegExp("<IDENTIFIER>", "g"), identifier);
        let containerNodes = returnNodeArray(parentNode, container_xpath);

    for (let j = 0; j < containerNodes.length; j++) {
            let containerFeatureIds = [];
            let containerNode = containerNodes[j];
            for (let featureId of usage_item.container.featureSet) {
                let container_node_xpath = (usage_item.container.featureQueryPrefix ? usage_item.container.featureQueryPrefix : "") +
                    (defaultFeatures[featureId].xpath).replace(new RegExp("<IDENTIFIER>", "g"), identifier);
                containerFeatureIds = containerFeatureIds
                    .concat(extractFeatureFromNode(containerNode, featureId, featureMetaData, container_node_xpath));
            }

            for (let k = 0; k < usage_item.content_groups.length; k++) {
                let group = usage_item.content_groups[k];
                let groupNodes = [containerNode];
                if (group.node) {
                    let group_xpath = (defaultFeatures[group.node].xpath)
                        .replace(new RegExp("<IDENTIFIER>", "g"), identifier);
                    groupNodes = returnNodeArray(containerNode, group_xpath);
                }
                for (let l = 0; l < groupNodes.length; l++) {
                    let node = groupNodes[l];
                    let groupFeatureIds = []
                    for (let featureId of group.featureSet) {
                        let xpath_feature = (group.featureQueryPrefix ? group.featureQueryPrefix : "") +
                            (defaultFeatures[featureId].xpath).replace(new RegExp("<IDENTIFIER>", "g"), identifier);
                        let result = extractFeatureFromNode(node, featureId, featureMetaData, xpath_feature);
                        groupFeatureIds = groupFeatureIds.concat(result);
                    }

                    let groupId = group.id;//`${key}_usage_${i}_content_groups_${k}`;
                    if (!featureMetaData.featureGroups.usage[groupId])
                        featureMetaData.featureGroups.usage[groupId] = {elementFeatures: [], rule: {}};
                    let element = `${xmlFile.filePath.replace(projectPath, "")}_${usage_item.container.type}_${j}_${group.type}_${l}`;
                    let featureIds = containerFeatureIds.concat(groupFeatureIds);
                    featureMetaData.featureGroups.usage[groupId].elementFeatures.push({element, featureIds});
                    newUsageFeatureIds = [...new Set(newUsageFeatureIds.concat(featureIds))];
                }
            }
        }
    }
    return newUsageFeatureIds;
}


/**
 * run the xpath query of a feature on the given node
 * @param mainNode {Node} the node on which the query is executed
 * @param featureIndex {string} a key from defaultFeatures
 * @param featureMetaData {featureMetaDataType}
 * @param xpath {string}
 * @return {*[]} array of featureIds
 */
const extractFeatureFromNode = (mainNode, featureIndex, featureMetaData, xpath) => {
    let featureIds = [], result = [];
    let featureInfo = featureMetaData.featureInfoContainers.featureInfo,
        featureInfoReverse = featureMetaData.featureInfoContainers.featureInfoReverse;
    switch (defaultFeatures[featureIndex].type) {
        case featureTypes.no_node:
            result = extractNoNodeFeature(mainNode, featureIndex, featureInfo, featureInfoReverse, xpath);
            featureIds = featureIds.concat(result);
            break;
        case featureTypes.single_node_text:
            result = extractSingleTextFeature(mainNode, featureIndex, featureInfo, featureInfoReverse, xpath);
            featureIds = featureIds.concat(result);
            break;
        case featureTypes.single_node_and_children_text:
            result = extractSingleTextFeature(mainNode, featureIndex, featureInfo, featureInfoReverse, xpath, true);
            featureIds = featureIds.concat(result);
            break;
        case featureTypes.multiple_nodes_texts:
            result = extractMultipleTextsFeature(mainNode, featureIndex, featureInfo, featureInfoReverse, xpath);
            featureIds = featureIds.concat(result);
            break;
        case featureTypes.multiple_nodes_and_children_texts:
            result = extractMultipleTextsFeature(mainNode, featureIndex, featureInfo, featureInfoReverse, xpath, true);
            featureIds = featureIds.concat(result);
            break;
        default:
            break;
    }
    return featureIds;
}


/**
 * extract features when no node is queried. E.g., class with no constructors
 * @param mainNode {Node} the node on which the query is executed
 * @param featureIndex {string} a key from defaultFeatures
 * @param featureInfo {{}} feature_desc: {featureIndex, featureId, nodes, weight}
 * @param featureInfoReverse {{}} featureId: feature_desc
 * @param xpath {string}
 * @return {number[]} array of the new featureId
 */
const extractNoNodeFeature = (mainNode, featureIndex, featureInfo, featureInfoReverse, xpath) => {
    let result = runXPathNoNode(mainNode, xpath);
    if (!result) return [];
    let featureId = featureInfo.hasOwnProperty(defaultFeatures[featureIndex].description)
        ? featureInfo[defaultFeatures[featureIndex].description].featureId
        : Object.keys(featureInfo).length;
    featureInfo[defaultFeatures[featureIndex].description] = Object.assign({}, {
        featureIndex: featureIndex,
        featureId,
        weight: defaultFeatures[featureIndex].weight
    });
    featureInfoReverse[featureId] = defaultFeatures[featureIndex].description;
    return [featureId];
}

/**
 * extract features when only one node (as text()) is queried. E.g., class with visibility xx
 * @param mainNode {Node} the node on which the query is executed
 * @param featureIndex {string} a key from defaultFeatures
 * @param featureInfo {Object.<string, {featureIndex: string, featureId:number, nodes: undefined|string[], weight: number} >} feature_desc
 * @param featureInfoReverse {Object.<number, string>} featureId: feature_desc
 * @param xpath {string}
 * @param includeChildren {boolean} used to extract children of the xpath query node
 * @return {*[]} returns the array of new featureIds
 */
const extractSingleTextFeature = (mainNode, featureIndex, featureInfo,
                                  featureInfoReverse, xpath, includeChildren = false) => {
    let ids = [];
    let result = includeChildren ? runXPathSingleNodeAndChildren(mainNode, xpath)
        : runXPathSingleNode(mainNode, xpath);
    if (result.length === 0) return [];
    for (let j = 0; j < result.length; j++) {
        let description = defaultFeatures[featureIndex].description.replace("<TEMP_0>", result[j].replace(/"/g, "'"));
        let featureId = featureInfo.hasOwnProperty(description) ? featureInfo[description].featureId
            : Object.keys(featureInfo).length;
        featureInfo[description] =
            Object.assign({}, {
                featureIndex: featureIndex, featureId, nodes: [result[j]],
                weight: defaultFeatures[featureIndex].weight
            });
        featureInfoReverse[featureId] = description;
        ids.push(featureId);
    }
    return ids;
}

/**
 * extract features when several nodes (all as text()) are queried. E.g., parameter with type xx and name yy
 * @param mainNode {Node} the node on which the query is executed
 * @param featureIndex {string} a key from defaultFeatures
 * @param featureInfo {Object.<string, {featureIndex: string, featureId:number, nodes: undefined|string[], weight: number} >} feature_desc
 * @param featureInfoReverse {Object.<number, string>} featureId: feature_desc
 * @param xpath {string}
 * @param includeChildren {boolean} used to extract children of the xpath query node
 * @return {*[]} returns the array of new featureIds
 */
const extractMultipleTextsFeature = (mainNode, featureIndex, featureInfo,
                                     featureInfoReverse, xpath, includeChildren = false) => {
    let ids = [];
    let result = includeChildren ? runXPathMultipleNodesAndChildren(mainNode, xpath, defaultFeatures[featureIndex].nodes) :
        runXPathMultipleNodes(mainNode, xpath, defaultFeatures[featureIndex].nodes);
    if (result.length === 0) return [];
    for (let i = 0; i < result.length; i++) {
        let description = defaultFeatures[featureIndex].description;
        for (let j = 0; j < result[i].length; j++) {
            description = description.replace(`<TEMP_${j}>`, result[i][j].replace(/"/g, "'"));
        }
        let featureId = featureInfo.hasOwnProperty(description) ? featureInfo[description].featureId
            : Object.keys(featureInfo).length;
        featureInfo[description] = Object.assign({}, {
            featureIndex: featureIndex,
            featureId,
            nodes: result[i],
            weight: defaultFeatures[featureIndex].weight
        });
        featureInfoReverse[featureId] = description;
        ids.push(featureId);
    }
    return ids;
}


/**
 * add featureIds to featureMetaData.featureInfoContainers.featureMap and featureMapReverse
 * @param featureIds {number[]}
 * @param identifier {string} the key used in the maps (right now it is filePath.replace(projectPath, "")
 * @param featureMetaData {featureMetaDataType}
 * */
const addFeatureIdsToMap = (featureIds, identifier, featureMetaData) => {
    featureMetaData.featureInfoContainers.featureMapReverse[identifier] = featureIds;
    for (let featureId of featureIds) {
        if (!featureMetaData.featureInfoContainers.featureMap[featureId])
            featureMetaData.featureInfoContainers.featureMap[featureId] = [];
        featureMetaData.featureInfoContainers.featureMap[featureId].push(identifier);
    }
}