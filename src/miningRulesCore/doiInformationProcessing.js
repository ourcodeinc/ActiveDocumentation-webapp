/**
 *
 * @param caretLocationsData [{xmlFile: "xml_data_for_file", filePath: "file_path",
 * caretArray: [{startOffset: 0, endOffset: 1}]}]
 */
import {getXpathForFeature} from "./featureSelectionProcessing";

export const processCaretLocations = (caretLocationsData) => {
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
                    return {xpath, elementText, startOffset: location.startOffset, endOffset: location.endOffset}
                })
                .filter(d => d !== null);
            if (xpathQueries.length === 0) {
                return null;
            }
            return {filePath: fileSet.filePath, xpathQueries}
        })
        .filter(d => d !== null)
};