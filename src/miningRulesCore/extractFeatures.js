/*
This file contains methods for extracting features using the sets of predefined
features as in featureConfig.js
 */

import {defaultFeatures, featureTypes, mapFocusedElementToFeatures} from "./featureConfig";
import {
    returnNodeArray,
    runXPathMultipleNodes,
    runXPathMultipleNodesAndChildren,
    runXPathNoNode,
    runXPathSingleNode,
    runXPathSingleNodeAndChildren
} from "./xPathQueryExecutor";


/**
 * featureInfo is a Map > featureDescription: {featureId, featureIndex (from features in featureConfig), nodes, weight}
 * featureInfoReverse is a Map > featureId: featureDescription
 * featureMap is a Map > featureId: array of identifiers
 * featureMapReverse is a Map > identifier: array of featureIds
 *
 * featureInfoContainers: {featureInfo, featureInfoReverse, featureMap, featureMapReverse}
 * featureCategories: {classType, constructorType, functionType}
 * @typedef {import("../initialState")} elementFeatures
 * @typedef {import("../initialState")} featureMetaDataType
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
 * very similar to processFeatureSetUsage
 * @param xmlFile {{xml: string, filePath: string}}
 * @param projectPath {string} is used to simplify the identifiers
 * @param focusedElementData {focusedElementDataType}
 * @param featureMetaData {featureMetaDataType}
 */
export function extractFeaturesFromXmlFile(xmlFile, projectPath,
                                           focusedElementData,
                                           featureMetaData) {
    // only select feature sets that belong to the same element group as the focusedElement
    let featuresToExtract = mapFocusedElementToFeatures[focusedElementData.mapFocusedElementToFeaturesKey];

    let xmlFeatureIds = [];

    if (featuresToExtract.spec.length !== 1) {
        console.log("Error happened for extracting the features for spec of " +
            focusedElementData.mapFocusedElementToFeaturesKey);
        return;
    }
    // The object defining the features of the specifications of an element.
    let specObject = featuresToExtract.spec[0];
    // The object defining the features for the element containing the specification features.
    let containerObject = specObject.container;
    let containerXpath = (defaultFeatures[containerObject.node]).xpath;
    // find the container nodes
    let containerNodes = returnNodeArray(xmlFile.xml, containerXpath);
    for (let j = 0; j < containerNodes.length; j++) {
        let containerFeatureIds = [];
        let containerNode = containerNodes[j];
        // extract the default set of features for the container
        for (let featureIndex of containerObject.featureSet) {
            // prepare the XPath for running the default features on container nodes
            let containerNodeXpath = (containerObject.featureQueryPrefix ? containerObject.featureQueryPrefix : "") +
                (defaultFeatures[featureIndex].xpath);
            containerFeatureIds = containerFeatureIds.concat(extractFeatureFromNode(containerNode, featureIndex,
                featureMetaData, containerNodeXpath));
        }

        // for each group of specifications
        for (let k = 0; k < specObject.contentGroups.length; k++) {
            let group = specObject.contentGroups[k];
            // find the parent nodes for extracting features
            let groupNodes = [containerNode];
            if (group.node) {
                let groupXpath = defaultFeatures[group.node].xpath;
                groupNodes = returnNodeArray(containerNode, groupXpath);
            }

            // for each parent node
            for (let l = 0; l < groupNodes.length; l++) {
                let node = groupNodes[l];
                let groupFeatureIds = []
                // extract the features from the parent node
                for (let featureId of group.featureSet) {
                    let xpathFeature = (group.featureQueryPrefix ? group.featureQueryPrefix : "") +
                        (defaultFeatures[featureId].xpath);
                    let result = extractFeatureFromNode(node, featureId, featureMetaData, xpathFeature);
                    groupFeatureIds = groupFeatureIds.concat(result);
                }

                // populate the featureMetaData.featureGroups.spec
                let groupId = group.groupId;
                if (!featureMetaData.featureGroups.spec[groupId])
                    featureMetaData.featureGroups.spec[groupId] = {elementFeatures: [], rule: {}};
                let element = `${xmlFile.filePath.replace(projectPath, "")}`
                    + `_${specObject.container.type}_${j}_${group.type}_${l}`;
                let featureIds = containerFeatureIds.concat(groupFeatureIds);
                featureIds = Array.from(new Set(featureIds));
                // updating the featureMetaData
                featureMetaData.featureGroups.spec[groupId].elementFeatures.push({element, featureIds});
                xmlFeatureIds = [...new Set(xmlFeatureIds.concat(featureIds))];
            }
        }

        // extract features for usages of each container node
        let newUsageFeatureIds = processFeatureSetUsage(xmlFile, projectPath, focusedElementData,
            featureMetaData, containerNode);
        xmlFeatureIds = [...new Set(xmlFeatureIds.concat(newUsageFeatureIds))];
    }

    addFeatureIdsToMap(xmlFeatureIds, xmlFile.filePath.replace(projectPath, ""), featureMetaData);
}

/**
 * extract the features of mapFocusedElementToFeatures[key].usage for xmlFile
 * very similar to extractFeaturesFromXmlFile
 * @param xmlFile {{xml: string, filePath: string}}
 * @param projectPath {string} is used to simplify the identifiers
 * @param focusedElementData {focusedElementDataType}
 * @param featureMetaData {featureMetaDataType}
 * @param parentNode {Node} the node on which the usage queries are executed
 * @return {number[]} array of featureIds for the xmlFile
 */
const processFeatureSetUsage = (xmlFile, projectPath,
                                focusedElementData,
                                featureMetaData,
                                parentNode) => {

    let key = focusedElementData.mapFocusedElementToFeaturesKey;
    let identifier = focusedElementData.identifier;
    let featuresToExtract = mapFocusedElementToFeatures[key];

    let newUsageFeatureIds = [];
    // per each usage group
    for (let i = 0; i < featuresToExtract.usage.length; i++) {
        // find the container in the parentNode (container node of spec)
        // containing/using the focused element
        let usageItem = featuresToExtract.usage[i];
        let containerXpath = (defaultFeatures[usageItem.container.node]).xpath
            .replace(new RegExp("<IDENTIFIER>", "g"), identifier);
        let containerNodes = returnNodeArray(parentNode, containerXpath);
        // per each container node
        for (let j = 0; j < containerNodes.length; j++) {
            let containerFeatureIds = [];
            let containerNode = containerNodes[j];
            // extract the featureSet group
            for (let featureId of usageItem.container.featureSet) {
                // prepare the XPath for running the default features on container nodes
                let containerNodeXpath = (usageItem.container.featureQueryPrefix ? usageItem.container.featureQueryPrefix : "") +
                    (defaultFeatures[featureId].xpath).replace(new RegExp("<IDENTIFIER>", "g"), identifier);
                containerFeatureIds = containerFeatureIds.concat(extractFeatureFromNode(containerNode, featureId,
                    featureMetaData, containerNodeXpath));
            }

            // for each group of usages
            for (let k = 0; k < usageItem.contentGroups.length; k++) {
                let group = usageItem.contentGroups[k];
                // find the parent nodes for extracting features
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

                    // populate the featureMetaData.featureGroups.usage
                    let groupId = group.groupId;
                    if (!featureMetaData.featureGroups.usage[groupId])
                        featureMetaData.featureGroups.usage[groupId] = {elementFeatures: [], rule: {}};
                    let element = `${xmlFile.filePath.replace(projectPath, "")}`
                        + `_${usageItem.container.type}_${j}_${group.type}_${l}`;
                    let featureIds = containerFeatureIds.concat(groupFeatureIds);
                    featureIds = Array.from(new Set(featureIds));
                    // updating the featureMetaData
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
    switch (defaultFeatures[featureIndex].type) {
        case featureTypes.no_node:
            return extractNoNodeFeature(mainNode, featureIndex, featureMetaData, xpath);
        case featureTypes.single_node_text:
            return extractSingleTextFeature(mainNode, featureIndex, featureMetaData, xpath);
        case featureTypes.single_node_and_children_text:
            return extractSingleTextFeature(mainNode, featureIndex, featureMetaData, xpath, true);
        case featureTypes.multiple_nodes_texts:
            return extractMultipleTextsFeature(mainNode, featureIndex, featureMetaData, xpath);
        case featureTypes.multiple_nodes_and_children_texts:
            return extractMultipleTextsFeature(mainNode, featureIndex, featureMetaData, xpath, true);
        case featureTypes.single_node_text_ends_with:
            return extractSingleTextEndsWithFeature(mainNode, featureIndex, featureMetaData, xpath);
        case featureTypes.single_node_text_starts_with:
            return extractSingleTextEndsWithFeature(mainNode, featureIndex, featureMetaData, xpath, true);
        default:
            return [];
    }
}


/**
 * extract features when no node is queried. E.g., class with no constructors
 * @param mainNode {Node} the node on which the query is executed
 * @param featureIndex {string} a key from defaultFeatures
 * @param featureMetaData {featureMetaDataType}
 * @param xpath {string}
 * @return {number[]} array of the new featureId
 */
const extractNoNodeFeature = (mainNode, featureIndex, featureMetaData, xpath) => {
    let result = runXPathNoNode(mainNode, xpath);
    if (!result) return [];
    let featureId = addToFeatureMetaData(featureMetaData, defaultFeatures[featureIndex].description, featureIndex,
        [], defaultFeatures[featureIndex].weight);
    return [featureId];
}

/**
 * extract features when only one node (as text()) is queried. E.g., class with visibility xx
 * @param mainNode {Node} the node on which the query is executed
 * @param featureIndex {string} a key from defaultFeatures
 * @param featureMetaData {featureMetaDataType}
 * @param xpath {string}
 * @param includeChildren {boolean} used to extract children of the xpath query node
 * @return {*[]} returns the array of new featureIds
 */
const extractSingleTextFeature = (mainNode, featureIndex, featureMetaData,
                                  xpath, includeChildren = false) => {
    let ids = [];
    let result = includeChildren ? runXPathSingleNodeAndChildren(mainNode, xpath)
        : runXPathSingleNode(mainNode, xpath);
    if (result.length === 0) return [];
    for (let j = 0; j < result.length; j++) {
        let description = defaultFeatures[featureIndex].description.replace("<TEMP_0>", result[j].replace(/"/g, "'"));

        let featureId = addToFeatureMetaData(featureMetaData, description, featureIndex,
            [result[j]], defaultFeatures[featureIndex].weight);
        ids.push(featureId);
    }
    return ids;
}

/**
 * extract features when several nodes (all as text()) are queried. E.g., parameter with type xx and name yy
 * @param mainNode {Node} the node on which the query is executed
 * @param featureIndex {string} a key from defaultFeatures
 * @param featureMetaData {featureMetaDataType}
 * @param xpath {string}
 * @param includeChildren {boolean} used to extract children of the xpath query node
 * @return {*[]} returns the array of new featureIds
 */
const extractMultipleTextsFeature = (mainNode, featureIndex, featureMetaData,
                                     xpath, includeChildren = false) => {
    let ids = [];
    let result = includeChildren ? runXPathMultipleNodesAndChildren(mainNode, xpath, defaultFeatures[featureIndex].nodes) :
        runXPathMultipleNodes(mainNode, xpath, defaultFeatures[featureIndex].nodes);
    if (result.length === 0) return [];
    for (let i = 0; i < result.length; i++) {
        let description = defaultFeatures[featureIndex].description;
        for (let j = 0; j < result[i].length; j++) {
            description = description.replace(`<TEMP_${j}>`, result[i][j].replace(/"/g, "'"));
        }

        let featureId = addToFeatureMetaData(featureMetaData, description, featureIndex,
            result[i], defaultFeatures[featureIndex].weight);
        ids.push(featureId);
    }
    return ids;
}


/**
 * extract features when only one node (as text()) is queried. E.g., class with visibility xx
 * @param mainNode {Node} the node on which the query is executed
 * @param featureIndex {string} a key from defaultFeatures
 * @param featureMetaData {featureMetaDataType}
 * @param xpath {string}
 * @param startsWith {boolean} used to indicate whether the target starts or ends with a key
 * @return {*[]} returns the array of new featureIds
 */
const extractSingleTextEndsWithFeature = (mainNode, featureIndex, featureMetaData,
                                          xpath, startsWith = false) => {
    let ids = [];
    let result = runXPathSingleNode(mainNode, xpath);
    if (result.length === 0) return [];
    for (let j = 0; j < result.length; j++) {

        // break the text based on camelCase letters or symbols
        // add spaces where the string needs to break
        let processedString = result[j]
            .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // camelCase
            .replace(/(_)/g, ' $1 ') // underscore
        let parts = processedString
            .split(" ")
            .map(d => d.trim())
            .filter(d => d.length > 0);
        if (parts === null || parts.length <= 1) continue;

        let commonPart = "";
        let startPartIndex = startsWith ? 0 : 1;
        let endPartIndex = startsWith ? parts.length - 2 : parts.length - 1;
        for (let k = startPartIndex; k <= endPartIndex; k++) {
            commonPart = startsWith ? parts.slice(0, k + 1).join("") : parts.slice(k).join("");
            let str = startsWith ? commonPart + "..." : "..." + commonPart;

            let description = defaultFeatures[featureIndex].description
                .replace("<TEMP_0>", str);

            let featureId = addToFeatureMetaData(featureMetaData, description, featureIndex,
                [str], defaultFeatures[featureIndex].weight);
            ids.push(featureId);
        }
    }
    return ids;
}

/**
 * add feature information to featureMetaData
 * @param featureMetaData {featureMetaDataType}
 * @param featureDescription {string} the description of the feature created by featureConfig.defaultFeatures.description
 * @param featureIndex {string} name of the feature in featureConfig.defaultFeatures
 * @param nodes {string[]} values of nodes in the feature, e.g., public/private in "class with visibility <TEMP_0>"
 * @param weight {number}
 * @return {number}
 * */
const addToFeatureMetaData = (featureMetaData, featureDescription,
                              featureIndex, nodes, weight) => {
    // {feature_desc: {featureIndex, featureId, nodes, weight}}
    let featureInfo = featureMetaData.featureInfoContainers.featureInfo,
        // {featureId: feature_desc}
        featureInfoReverse = featureMetaData.featureInfoContainers.featureInfoReverse;
    let featureId = featureInfo.hasOwnProperty(featureDescription) ? featureInfo[featureDescription].featureId
        : Object.keys(featureInfo).length;

    featureInfo[featureDescription] = Object.assign({}, {featureIndex, featureId, nodes, weight});
    featureInfoReverse[featureId] = featureDescription;

    return featureId
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