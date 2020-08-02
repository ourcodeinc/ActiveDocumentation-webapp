/**
 *
 * @param caretLocationsData [{xmlFile: "xml_data_for_file", filePath: "file_path",
 * caretArray: [{startOffset: 0, endOffset: 1}]}]
 */
import {getXpathForFeature} from "./featureSelectionProcessing";

export const processCaretLocations = (caretLocationsData) => {
    let xpathList = [];
    return caretLocationsData
        .map(fileSet => {
            let xpathQueries = (fileSet.caretArray)
                .map(location => {
                    let computedData = getXpathForFeature(fileSet.xmlFile.xml,
                        location.startOffset, location.endOffset, true);
                    if (computedData === null) {
                        return null;
                    }
                    let xpath = computedData.xpath;
                    let elementText = computedData.selectedText;
                    if (xpathList.includes(xpath)) return null;
                    xpathList.push(xpath);
                    return {
                        srcmlXpath: xpath,
                        featureDescription: elementText.trim(),
                        featureXpath: xpath.replace(/src:/g, ""),
                        startOffset: location.startOffset,
                        endOffset: location.endOffset
                    }
                })
                .filter(d => d !== null);
            if (xpathQueries.length === 0) {
                return null;
            }
            return {filePath: fileSet.filePath, xpathQueries}
        })
        .filter(d => d !== null);
};