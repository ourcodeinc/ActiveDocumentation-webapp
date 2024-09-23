/**
 * This file contains methods that are responsible for generate groups
 * using the featureConfig.groupingCategories and output them as groupingMetaData
 * Currently, the grouping is done at the start of the project.
 * In future, it can also update the grouping upon edits.
 */

import {groupingCategories} from "./featureConfig";
import {returnNodeIterator, runXPathSingleNode} from "./xPathQueryExecutor";

/**
 * groupMapping is a Map > group feature ID: [file paths]
 * fileMapping is a Map > file path : [group feature IDs]
 * @typedef {Object.<string, Object.<string, string[]>>} groupMappingType
 * @typedef {Object.<string, Object.<string, string[]>>} fileMappingType
 * @typedef {{groupMapping: groupMappingType, fileMapping: fileMappingType
 * }} groupingMetaDataType
 * @return {groupingMetaDataType}
 */
export const createGroupingMetaData = () => {
    const groupMapping = {};
    const fileMapping = {};
    for (const key in groupingCategories) {
        if (groupingCategories.hasOwnProperty(key)) {
            groupMapping[key] = {};
        }
    }
        groupMapping[key] = {};
    }
    return {groupMapping, fileMapping};
};

/**
 * group related files using the categories
 * @param xmlFiles {[{xml: string, filePath:string}]}
 * @param projectPath is used to simplify the identifiers
 * @param groupingMetaData {groupingMetaDataType}
 */
export const formGroupings = (xmlFiles, projectPath,
    groupingMetaData) => {
    for (const xmlFile of xmlFiles) {
        const xmlFileWithoutProjectPath = {filePath: xmlFile.filePath.replace(projectPath, ""), xml: xmlFile.xml};
        cleanGroupings(xmlFileWithoutProjectPath, groupingMetaData);
        addToGroupings(xmlFileWithoutProjectPath, groupingMetaData);
    }
};

/**
 * remove all the file info from grouping metaData
 * @param xmlFile {{xml: string, filePath:string}}
 * @param groupingMetaData {groupingMetaDataType}}
 */
const cleanGroupings = (xmlFile, groupingMetaData) => {
    const fileID = xmlFile.filePath;
    for (const key in groupingCategories) {
        if (!groupingMetaData.fileMapping[fileID] ||
            groupingMetaData.fileMapping[fileID][key]) {
            continue;
        }
        const categoryIds = groupingMetaData.fileMapping[fileID][key];
        for (const id of categoryIds) {
            if (!groupingMetaData.groupMapping[key][id]) {
                continue;
            }
            const group = groupingMetaData.groupMapping[key][id];
            let index = group.indexOf(fileID);
            while (index !== -1) { // in case the file have the same import/package several times [by mistake]
                group.splice(index, 1);
                index = group.indexOf(fileID);
            }
        }
    }
    if (groupingMetaData.fileMapping.hasOwnProperty(fileID)) {
        delete groupingMetaData.fileMapping[fileID];
    }
};

/**
 * Add the input file to the groupingMetaData according to the categories.
 * Currently, there are two grouping categories; imports and packages.
 * @param xmlFile {{xml: string, filePath:string}}
 * @param groupingMetaData {groupingMetaDataType}
 */
const addToGroupings = (xmlFile, groupingMetaData) => {
    const fileID = xmlFile.filePath;
    for (const groupingCategoryID in groupingCategories) {
        if (groupingCategories.hasOwnProperty(groupingCategoryID)) {
            const values = getValuesForGrouping(xmlFile.xml, groupingCategories[groupingCategoryID]);
            for (const valueID of values) {
                if (!groupingMetaData.groupMapping[groupingCategoryID][valueID]) {
                    groupingMetaData.groupMapping[groupingCategoryID][valueID] = [];
                }
                groupingMetaData.groupMapping[groupingCategoryID][valueID].push(fileID);

                if (!groupingMetaData.fileMapping[fileID]) {
                    groupingMetaData.fileMapping[fileID] = {};
                }
                if (!groupingMetaData.fileMapping[fileID][groupingCategoryID]) {
                    groupingMetaData.fileMapping[fileID][groupingCategoryID] = [];
                }
                groupingMetaData.fileMapping[fileID][groupingCategoryID].push(valueID);
            }
        }
    }
};

/**
 * Extract the values for queries used for grouping files.
 * For example, finds the imported packages in the given file.
 * @param mainXml {string}
 * @param groupingCategory {{categoryIdPrefix: string, query: string, excludedValues: [] }}
 * @returns {string[]}
 */
const getValuesForGrouping = (mainXml, groupingCategory) => {
    const results = [];
    const groupNodes = returnNodeIterator(mainXml, groupingCategory.query);
    let node = groupNodes.iterateNext();
    while (node !== null) {
        const text = runXPathSingleNode(node, "//*/text()").join("");
        results.push(text);
        node = groupNodes.iterateNext();
    }

    return results.filter((res) => {
        for (const val of groupingCategory.excludedValues) {
            if (res.startsWith(val)) {
                return false;
            }
        }
        return true;
    });
};
