import {discard_time, focusElementType} from "./featureConfig";
import {runXPathSingleNode} from "./xPathQueryExecutor";
import {getNodesFromOffsets} from "./featureSelectionProcessing";

/**
 * finding the start and end xml nodes in srcML data
 * @param xmlFile {{xml: "", filePath: ""}}
 * @param startOffset {number} index
 * @return {{identifier: string, mapFocusedElementToFeaturesKey: string}}
 */
export const getDataForFocusedElement = (xmlFile, startOffset) => {
    let xml = xmlFile.xml;

    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, "text/xml");

    let str = "";        // string to keep track of the offset
    let offsetToCheck = +startOffset + 1;
    let selectedNode = null

    let traverseNodes = (node) => {
        for (let i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].nodeName === "#text") {
                str += node.childNodes[i].nodeValue;
                if (str.length >= offsetToCheck) {
                    selectedNode = node;
                    offsetToCheck = Infinity;
                    return "end";
                }
            } else {
                let res = traverseNodes(node.childNodes[i]);
                if (res === "end")
                    return res;
            }
        }
        return "";
    };

    // find the selected node in the IDE
    traverseNodes(xmlDoc);

    if (selectedNode === null) return {mapFocusedElementToFeaturesKey:"", identifier:""};

    /**
     * find an ancestor of a node that is listed as a focused_element
     * @param node {Node}
     * @return {Node}
     */
    let findAncestorNode = (node) => {
        if (node === null) return null;
        if (node.nodeName === "unit") return node;
        let acceptedNodeType = focusElementType.map(d => d.nodeName);
        if (acceptedNodeType.includes(node.nodeName)) {
            if (node.nodeName !== "class" && findAncestorNode(node.parentNode).nodeName!=="class")
                return findAncestorNode(node.parentNode);
            return node;
        }
        else {
            return findAncestorNode(node.parentNode)
        }
    }

    let ancestorNode = findAncestorNode(selectedNode);
    let filtered = focusElementType.filter(d => d.nodeName === ancestorNode.nodeName);
    if (filtered.length === 0)
        return {mapFocusedElementToFeaturesKey:"", identifier:""};

    let mapFocusedElementToFeaturesKey = filtered[0].mapFocusedElementToFeaturesKey;
    let identifier = runXPathSingleNode(ancestorNode, filtered[0].identifierXpath).join("");
    return {mapFocusedElementToFeaturesKey, identifier}


    // let filePathWithoutProjectPath = xmlFile.filePath.replace(projectPath, "");
    // // find the parent for each category
    // let parentNodes = {};
    // for (let parentCategories of [...Object.keys(nodesForSelectedScope)]) {
    //     let parentType = nodesForSelectedScope[parentCategories].nodeName;
    //     let node = selectedNode;
    //     while (node != null) {
    //         if (node.nodeName === parentType) {
    //             parentNodes[parentType] = node;
    //             break;
    //         }
    //         node = node.parentNode;
    //     }
    // }
    //
    // // find the identifiers used in the metaData
    // let identifiers = {};
    // for (let category of [...Object.keys(nodesForSelectedScope)]) {
    //     if (!parentNodes.hasOwnProperty(nodesForSelectedScope[category].nodeName))
    //         continue;
    //     let result = returnNodeIterator(xml, nodesForSelectedScope[category].query);
    //     if (result === -1)
    //         continue; // invalid xml
    //     let targetNode = result.iterateNext();
    //     let counterPerFile = 0;
    //     while (targetNode) {
    //         if (targetNode.isEqualNode(parentNodes[nodesForSelectedScope[category].nodeName])) {
    //             identifiers[category] = `${category}_${counterPerFile}`;
    //             break;
    //         }
    //         targetNode = result.iterateNext();
    //         counterPerFile++;
    //     }
    // }
    //
    // // ** the only place containing a hard-coded value
    // for (let category in identifiers) {
    //     if (category !== "class")
    //         identifiers[category] = `${filePathWithoutProjectPath}_${identifiers["class"]}_${identifiers[category]}`;
    // }
    // identifiers["class"] = `${filePathWithoutProjectPath}_${identifiers["class"]}`;
    // return identifiers;
}

/**
 * process the doi information and remove information prior to discard_time
 * @param recentVisitedFiles {[{timeStamp, filePath}]}
 * @param recentSearchKeyWords {[{timeStamp, filePath, keyword}]} filePath can be 'none'
 * @param recentVisitedElements {[{timeStamp, filePath, startOffset, endOffset}]}
 * @param xmlFiles {[{xml: string, filePath:string}]}
 * @param projectPath {string}
 * @return {{recentVisitedFiles: {timeStamp: Date, filePath: string}[],
 * recentVisitedElements: {timeStamp: Date, filePath: string, startOffset:number,
 * endOffset: number, visitedElement: string}[],
 * recentSearches: {timeStamp: Date, filePath: string, keyword: string}[]}}
 */
export const processDoiInformation = (recentVisitedFiles,
                                      recentSearchKeyWords,
                                      recentVisitedElements,
                                      xmlFiles, projectPath) => {
    let now = Date.now();

    let files = recentVisitedFiles
        .filter(d => Math.abs(+d.timeStamp - now) < discard_time)
        .map(d => {
            return {
                timeStamp: new Date(+d.timeStamp),
                filePath: d.filePath.replace(projectPath, "")
            }
        });

    let searches = recentSearchKeyWords
        .filter(d => Math.abs(+d.timeStamp - now) < discard_time)
        .map(d => {
            return {
                timeStamp: new Date(+d.timeStamp),
                filePath: d.filePath.replace(projectPath, ""),
                keyword: d.keyword
            }
        });

    let elements = recentVisitedElements
        .filter(d => Math.abs(+d.timeStamp - now) < discard_time)
        .map(d => {
            let xmlCaretFiles = xmlFiles.filter(dd => dd.filePath === d.filePath);
            if (xmlCaretFiles.length === 1) {
                let node = getNodesFromOffsets(xmlCaretFiles[0].xml,
                    +d.startOffset, +d.endOffset);
                return {
                    timeStamp: new Date(+d.timeStamp),
                    filePath: d.filePath,
                    startOffset: +d.startOffset,
                    endOffset: +d.endOffset,
                    visitedElement: node.selectedText.trim()
                }
            }
            return null;
        })
        .filter(d => {
            if (!d) return false;
            return !javaSymbol.includes(d.visitedElement) &&
                !javaKeywords.includes(d.visitedElement);
        });

    return {recentVisitedFiles: files, recentSearches: searches, recentVisitedElements: elements};
}


const javaKeywords = [
    "abstract", "continue", "for", "new", "switch",
    "assert", "default", "goto", "package", "synchronized",
    "boolean", "do", "if", "private", "this",
    "break", "double", "implements", "protected", "throw",
    "byte", "else", "import", "public", "throws",
    "case", "enum", "instanceof", "return", "transient",
    "catch", "extends", "int", "short", "try",
    "char", "final", "interface", "static", "void",
    "class", "finally", "long", "strictfp", "volatile",
    "const", "float", "native", "super", "while"
];

const javaSymbol = [
    "{", "}", "[", "]", ",", ";", ".", "<", ">", "*", "@",
    "(", ")", "+", "-", "=", "'", "\"", "!", "^", "\\", "/"
]
