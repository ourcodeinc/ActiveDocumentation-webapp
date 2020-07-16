/**
 * Created by saharmehrpour on 12/27/19.
 */


/**
 * finding the start and end xml nodes in srcML data
 * @param mainXml
 * @param startOffset index
 * @param endOffset index
 * @return {{xpath: string, selectedText: string, idMap, displayTextArray: Array}}
 */
export const getXpathForFeature = (mainXml, startOffset, endOffset) => {
    let xml = mainXml.slice(0); // copy of xml data

    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml,"text/xml");

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
                    } else {
                        endNode = node;
                        offsetToCheck = Infinity;
                        return "end";
                    }
                }
            }
            else {
                let res = traverseNodes(node.childNodes[i]);
                if (res === "end")
                    return res;
            }
        }
        return "";
    };

    traverseNodes(xmlDoc);
    let idMapDisplayTextArray = lowestCommonAncestor(startNode, endNode);
    let xpath = computeXPath(idMapDisplayTextArray.idMap);

    return {
        xpath: xpath,
        idMap: idMapDisplayTextArray.idMap,
        displayTextArray: idMapDisplayTextArray.displayTextArray,
        selectedText: selectedText
    };
};

/**
 * finding the lowest common ancestor of two xml nodes
 * @param startNode
 * @param endNode
 * @return {{displayTextArray: Array, idMap}}
 */
const lowestCommonAncestor = (startNode, endNode) => {
    let startNodePath = [startNode], endNodePath = [endNode];
    let node1 = startNode, node2 = endNode;

    while (node1.parentNode !== null) {
        startNodePath.push(node1.parentNode);
        node1 = node1.parentNode;
    }
    while (node2.parentNode !== null) {
        endNodePath.push(node2.parentNode);
        node2 = node2.parentNode;
    }
    startNodePath = startNodePath.reverse();
    endNodePath = endNodePath.reverse();

    let commonIndex = -1;
    let common = null;
    for (let i = 0; i < Math.min(startNodePath.length, endNodePath.length); i++) {
        if (startNodePath[i] === endNodePath[i]) {
            commonIndex = i;
            common = startNodePath[i];
        } else
            break;
    }

    // if the common ancestor is not found.
    // This should not happen, in the worst case the document node is the parent
    if (commonIndex < 0) {
        console.log("weird error!");
        return {displayTextArray: [], idMap:{}};
    }

    return computeIdMapTree(common, startNode, endNode);
};


/**
 *
 * @param commonNode
 * @param startNode
 * @param endNode
 * @return {{displayTextArray: Array, idMap}}
 */
const computeIdMapTree = (commonNode, startNode, endNode) => {

    let displayTextArray = [];
    let idMap = {};

    let traverseCommonNode = (node, included, nodeId = "0", parentId = "u") => {
        if (node.nodeName === "#text") {
            if (included) {
                if (!["", "(", ")", "{", "}", ";", "."].includes(node.nodeValue.trim())) {
                    idMap[nodeId] = {parentId: parentId, children: [], text: node.nodeValue.trim(), type: "#text"};
                    displayTextArray.push({id: nodeId, text: node.nodeValue.trim()});
                    return true;
                }
                if (node.nodeValue.trim() !== "")
                    displayTextArray.push({id: "n", text: node.nodeValue.trim()});
                else if (node.nodeValue.indexOf("\n") !== -1)
                    displayTextArray.push({id: "n", text: "\n"});
            }
            return false;
        }

        let includeNode = included;
        let childrenIdArray = [];

        for (let i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i] === startNode)
                includeNode = true;

            let inc = traverseCommonNode(node.childNodes[i], includeNode, nodeId + "_" + i, nodeId);

            if (inc === "last") {
                childrenIdArray.push(nodeId + "_" + i);
                idMap[nodeId] = {parentId: parentId, children: childrenIdArray, text: "", type: node.nodeName};

                return "last";
            }
            if (inc && node.childNodes[i] === endNode) {
                childrenIdArray.push(nodeId + "_" + i);
                idMap[nodeId] = {parentId: parentId, children: childrenIdArray, text: "", type: node.nodeName};

                return "last";
            }
            if (inc) {
                includeNode = true;
                childrenIdArray.push(nodeId + "_" + i);
            }
        }

        idMap[nodeId] = {parentId: parentId, children: childrenIdArray, text: "", type: node.nodeName};
        return included ? true : includeNode;
    };

    traverseCommonNode(commonNode, commonNode === startNode, "0");

    return {displayTextArray, idMap};

};


/**
 * compute the xpath from the xpath tree built by computeXpathTree
 * @param idMap
 * @return {string}
 */
export const computeXPath = (idMap) => {
    let xpath = "";

    /**
     * traverse the object created by traverseCommonNode
     * @param obj
     */
    let traverseObject = (obj) => {
        if (obj.type === "#text" ) {
            if(obj.text.trim() !== "")
                xpath += "text()=\"" + obj.text + "\"";
        } else {
            if (obj.children.length > 1) {
                xpath += "src:" + obj.type + "[";
                for (let i = 0; i < obj.children.length; i++) {
                    traverseObject(idMap[obj.children[i]]);
                    xpath += (i < obj.children.length - 1) ? " and " : "";
                }
                xpath += "]";
            } else if (obj.children.length === 1) {
                xpath += "src:" + obj.type + "/";
                traverseObject(idMap[obj.children[0]]);
            }
        }
    };

    traverseObject(idMap[0]);
    return xpath;
};