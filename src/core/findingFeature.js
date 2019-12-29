/**
 * Created by saharmehrpour on 12/27/19.
 */


/**
 * finding the start and end xml nodes in srcML data
 * @param mainXml
 * @param start index
 * @param end index
 * @return {{xpath: string, selectedText: string}}
 */
export const getXpathForFeature = (mainXml, start, end) => {
    let xml = mainXml.slice(0); // copy of xml data

    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml,"text/xml");

    let str = "",        // string to keep track of the offset
        selectedText = "";
    let offsetToCheck = start;
    let startNode = null,
        endNode = null;

    let traverseNodes = (node) => {
        for (let i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].nodeName === "#text") {
                str += node.childNodes[i].nodeValue;
                if (!!startNode)
                    selectedText += node.childNodes[i].nodeValue;

                if (str.length >= offsetToCheck) {
                    if (offsetToCheck === start) {
                        startNode = node;
                        offsetToCheck = end;
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
    return {xpath: lowestCommonAncestor(startNode, endNode), selectedText: selectedText};
};

/**
 * finding the lowest common ancestor of two xml nodes
 * @param startNode
 * @param endNode
 * @return string xpath
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
        return "";
    }

    return computeXpath(common, startNode, endNode);

};

/**
 * computing the xpath query from commonNode including only the startNode and endNode
 * @param commonNode
 * @param startNode
 * @param endNode
 * @return string xpath
 */
const computeXpath = (commonNode, startNode, endNode) => {

    let xpathObject = {};
    let xpath = "";

    /**
     * This recursive function create an array of objects for included elements in Xpath query
     * Each object is key:nodeName value:[children]
     * @param node
     * @param obj
     * @param included denotes whether the node is included or not: true | false (if some child is included, e.g. startNode, then the node is also included
     * @return {boolean|*} true | false | "last" last node to be included (it contains endNode)
     */
    let traverseCommonNode = (node, obj, included) => {
        if (node.nodeName === "#text") {
            if (included) {
                if (!["", "(", ")", "{", "}", ";", "."].includes(node.nodeValue.trim())) {
                    obj.key = "#text";
                    obj.value = "text()=\"" + node.nodeValue + "\"";
                    return true;
                }
            }
            return false;
        }

        let includeNode = included;
        let arr = [];

        for (let i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i] === startNode)
                includeNode = true;

            let tempObj = {};
            let inc = traverseCommonNode(node.childNodes[i], tempObj, includeNode);

            if (inc === "last") {
                arr.push(tempObj);
                obj.key = node.nodeName;
                obj.value = arr;
                return "last";
            }
            if (inc && node.childNodes[i] === endNode) {
                arr.push(tempObj);
                obj.key = node.nodeName;
                obj.value = arr;
                return "last";
            }
            if (inc) {
                arr.push(tempObj);
                includeNode = true;
            }
        }
        obj.key = node.nodeName;
        obj.value = arr;
        return included ? true : includeNode;
    };


    /**
     * traverse the object created by traverseCommonNode
     * @param obj
     */
    let traverseObject = (obj) => {
        if (obj.key === "#text") {
            xpath += obj.value;
        } else {
            if (obj.value.length > 1) {
                xpath += "src:" + obj.key + "[";
                for (let i = 0; i < obj.value.length; i++) {
                    traverseObject(obj.value[i]);
                    xpath += (i < obj.value.length - 1) ? " and " : "";
                }
                xpath += "]";
            } else if (obj.value.length === 1) {
                xpath += "src:" + obj.key + "/";
                traverseObject(obj.value[0]);
            }
        }
    };

    traverseCommonNode(commonNode, xpathObject, false);
    traverseObject(xpathObject);

    return xpath;

};