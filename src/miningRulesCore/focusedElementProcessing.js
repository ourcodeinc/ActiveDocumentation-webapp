import {DOI_DISCARD_TIME, focusElementType} from "./featureConfig";
import {runXPathSingleNode} from "./xPathQueryExecutor";

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

    if (selectedNode === null) return {mapFocusedElementToFeaturesKey: "", identifier: ""};

    /**
     * find an ancestor of a node that is listed as a focused_element
     * @param node {Node}
     * @return {Node}
     */
    let findAncestorNode = (node) => {
        if (node === null) return null;
        if (node.nodeName === "unit") return node;
        let acceptedNodeType = focusElementType.map(d => d.nodeName);
        let ancestor = findAncestorNode(node.parentNode);
        if (acceptedNodeType.includes(node.nodeName)) {
            if (node.nodeName !== "class" && ancestor.nodeName !== "class")
                return ancestor;
            return node;
        } else {
            return ancestor
        }
    }

    let ancestorNode = findAncestorNode(selectedNode);
    let filtered = focusElementType.filter(d => d.nodeName === ancestorNode.nodeName);
    if (filtered.length === 0)
        return {mapFocusedElementToFeaturesKey: "", identifier: ""};

    let mapFocusedElementToFeaturesKey = filtered[0].mapFocusedElementToFeaturesKey;
    let identifier = runXPathSingleNode(ancestorNode, filtered[0].identifierXpath).join("");
    return {mapFocusedElementToFeaturesKey, identifier}
}

/**
 * process the doi information and remove information prior to DOI_DISCARD_TIME
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
        .filter(d => Math.abs(+d.timeStamp - now) < DOI_DISCARD_TIME)
        .map(d => {
            return {
                timeStamp: new Date(+d.timeStamp),
                filePath: d.filePath.replace(projectPath, "")
            }
        });

    let searches = recentSearchKeyWords
        .filter(d => Math.abs(+d.timeStamp - now) < DOI_DISCARD_TIME)
        .map(d => {
            return {
                timeStamp: new Date(+d.timeStamp),
                filePath: d.filePath.replace(projectPath, ""),
                keyword: d.keyword
            }
        });

    let elements = recentVisitedElements
        .filter(d => Math.abs(+d.timeStamp - now) < DOI_DISCARD_TIME)
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

/**
 * finding the start and end xml nodes in srcML data
 * @param mainXml
 * @param startOffset index
 * @param endOffset index
 * @return {{startNode: Node, endNode: Node, selectedText: string}}
 */
export const getNodesFromOffsets = (mainXml, startOffset, endOffset) => {
    let xml = mainXml.slice(0); // copy of xml data

    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, "text/xml");

    let str = "",        // string to keep track of the offset
        selectedText = "";
    let offsetToCheck = +startOffset + 1;
    let startNode = null,
        endNode = null;

    let traverseNodes = (node) => {
        for (let i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].nodeName === "#text") {
                str += node.childNodes[i].nodeValue;
                if (!!startNode)
                    selectedText += node.childNodes[i].nodeValue;

                if (str.length >= offsetToCheck) {
                    if (offsetToCheck === (+startOffset + 1)) {
                        startNode = node;
                        offsetToCheck = endOffset;
                        selectedText += node.childNodes[i].nodeValue;

                        // if the startOffset and endOffset are both belong to the same text node
                        if (str.length >= offsetToCheck) {
                            endNode = node;
                            offsetToCheck = Infinity;
                            return "end";
                        }
                    } else {
                        endNode = node;
                        offsetToCheck = Infinity;
                        return "end";
                    }
                }
            } else {
                let res = traverseNodes(node.childNodes[i]);
                if (res === "end")
                    return res;
            }
        }
        return "";
    };
    traverseNodes(xmlDoc);
    return {endNode, startNode, selectedText};
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
