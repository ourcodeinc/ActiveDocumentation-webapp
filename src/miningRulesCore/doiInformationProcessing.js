/**
 *
 * @param caretLocationsData [{xmlFile: "xml_data_for_file", filePath: "file_path", <other_info_from_plugin>}]
 */
import {getXpathForFeature} from "./featureSelectionProcessing";

export const processCaretLocations = (caretLocationsData) => {

    caretLocationsData.forEach(datum => {
        //  find the element name, element type, and element XPath
        //  e.g., if the caret is on `B`:
        //  class A extends B {
        //  the xpath would be //src:class/src:extends/src:name/text()="B"
        //  the name is "B"
        //  the element is `name`
        //  return {elementText: elementText, elementType: elementType, xpath: elementXPath}


        // todo provide startOffset and endOffset
        let computedData = getXpathForFeature(datum.xmlFile, 0, 0);
        let xpath = computedData.xpath;
        let elementText = computedData.selectedText;
        // todo get the last element in XPath (before text() )
        let elementType = "";
    })
};