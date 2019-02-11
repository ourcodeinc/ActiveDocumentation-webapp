/**
 * Dependant on Grammar: OfContext, ExpressionContext, ..sContext, ConditionContext and 'subclass'
 */

import pluralize from 'pluralize';

import {generateTreeForElement, getConditionByName} from "../ruleGenerationGUI/guiConstants";
import {TextConstants} from "./textConstant";
import {initial_elementTree, initial_guiElements} from "../../initialState";

/**
 * create the quantifier and the constraint guiTree based on the grammar parse tree
 * @param grammarTree
 * @returns {{}}
 */
export async function generateGuiTrees(grammarTree) {
    let trees = await createConstraintTree(grammarTree);
    // match with redux state: newOrEditRule.guiState
    return {
        guiTree: trees.newElementTree,
        guiElements: trees.newGuiElements
    };
}

/**
 * create the gui tree based on the grammar parse tree for constraint
 * @param tree
 * @returns {{newGuiElements, newElementTree, grammarTree: *, guiTree: *}}
 */
const createConstraintTree = (tree) => {
    let combinedNodes = combineNode(tree);
    let combinedWordsNodes = combineWordsNode(combinedNodes);
    let reorderedMustClause = reorderMustClause(combinedWordsNodes);
    let newTree = traverseNormalNode(reorderedMustClause);
    newTree.selectedElement = true;
    let parentChildTree = reverseParentChildOrder(newTree);
    let treeOfIDs = createGuiElementTree(parentChildTree);
    return updateGuiElements(parentChildTree, treeOfIDs);
};

/**
 * For constraint queries, the constraint is quantifier query + the constraint
 * @param treeNode
 * @returns {{}}
 */
const reorderMustClause = (treeNode) => {
    let newNode = JSON.parse(JSON.stringify(treeNode));

    function camelCase(words) {
        let wordArray = words.split(" ");
        let str = "";
        wordArray.forEach(w => str += w.charAt(0).toUpperCase() + w.slice(1));
        return str;
    }

    if (newNode.nodeType === "MustClauseContext") {
        // it has 3 children: [0]..Context or TerminalNodeImpl e.g. "function ", [1]TerminalNodeImpl "must ", [2]..ExpressionContext

        newNode.children[2].children.forEach(child => child.isConstraint = true);

        if (newNode.children[0].children) {

            // in children[0].children look for ..ConditionContext
            let conditionNodeIndex = newNode.children[0].children.map(gChild => gChild.nodeType.endsWith("ConditionContext")).indexOf(true);

            // if exists: replace it with another one w/ it and children[2] as its children
            if (conditionNodeIndex !== -1)
                newNode.children[0].children[conditionNodeIndex].children = newNode.children[0].children[conditionNodeIndex].children
                    .concat(newNode.children[2]);

            // if not: create and add it w/ children[2] as its child
            else {
                // must exist with e.g. "function " text
                let string = newNode.children[0].children.filter(gChild => gChild.nodeType === "TerminalNodeImpl")[0].text.trim();
                let nodeType = string.charAt(0).toUpperCase() + string.slice(1) + "ConditionContext";
                newNode.children[0].children.push({
                    nodeType: nodeType,
                    children: [{...newNode.children[2]}]
                })
            }
        }

        else {
            // the node does not have condition or parent nodes
            if (newNode.children[0].nodeType === "TerminalNodeImpl") {
                let nodeType = newNode.children[0].text.charAt(0).toUpperCase() + newNode.children[0].text.trim().slice(1);
                newNode.children[0] = {
                    nodeType: camelCase(pluralize(nodeType)) + "Context",
                    children: [{...newNode.children[0]}, {
                        nodeType: nodeType + "ConditionContext",
                        children: [{...newNode.children[2]}]
                    }]
                }
            }
        }
    }
    // todo not covered
    else if (newNode.nodeType === "MustBeEqualToClauseContext") {
        newNode.children = [{...newNode.children[2]}]
    }

    else {
        if (newNode.children)
            newNode.children = newNode.children.map(child => reorderMustClause(child))
    }
    return newNode;
};


/**
 * build a node with 2 attributes: nodeType, children/text from grammarTree
 * @param node
 * @returns {*} node
 */
const combineNode = (node) => {
    if (node.children) {
        if (node.children.length > 1)
            return {nodeType: node.constructor.name, children: node.children.map(combineNode)};
        else
            return {...combineNode(node.children[0])};
    }
    return {nodeType: node.constructor.name, text: node.getSymbol().text}
};


/**
 * combine word letters
 * @param node
 * @returns {*} node
 */
const combineWordsNode = (node) => {
    if (node.nodeType === "WordsContext") {
        let word = node.children.map(child => child.text !== "\"" ? child.text : null).join("");
        return {nodeType: "word", text: word}
    }
    if (node.nodeType === "CombinatorialWordsContext") {
        let word = node.children.map(child => child.text !== "\"" ? child.text : null).join("");
        return {nodeType: "word", text: word}
    }

    if (node.children && node.children.length > 0)
        node.children = node.children.map(child => combineWordsNode(child));
    return node;
};


/**
 * traverse non-ExpressionContext nodes
 * @param treeNode
 * @param isConstraint
 * @returns {{}} a new node
 */
const traverseNormalNode = (treeNode, isConstraint = false) => {

    // guiNode must have
    // key, value, target, children, text
    // we add "of" and "where" here

    let guiNode = {};
    guiNode.isConstraint = treeNode.isConstraint || isConstraint;

    // context nodes
    let keywords = TextConstants.keywords.slice().map(w => pluralize(w).split(" ").map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(""));
    if (keywords.indexOf(treeNode.nodeType.replace("Context", "")) !== -1) {
        guiNode.key = TextConstants.keywords[keywords.indexOf(treeNode.nodeType.replace("Context", ""))]; //console.log("--->",guiNode.key);
        if (treeNode.children) {
            treeNode.children.forEach(child => {
                if (child.nodeType.endsWith("OfContext"))
                // child has two children, the first is "of "
                    guiNode.of = traverseNormalNode(child.children[1]);

                else if (child.nodeType.endsWith("ConditionContext")) {
                    // check if it has "ExpressionContext" child
                    let hasExpressionContext = child.children.filter(node => node.nodeType.endsWith("ExpressionContext")).length > 0;
                    if (hasExpressionContext)
                        child.children.forEach(node => {
                            if (node.nodeType.endsWith("ExpressionContext"))
                                guiNode.where = guiNode.where ? guiNode.where.concat(traverseExpressionNode(node, guiNode.isConstraint)) : traverseExpressionNode(node, guiNode.isConstraint);
                        });

                    else {
                        // name, extension, implementation, type, specifier
                        // child children: where not? equalsTo|includes|startsWith|endsWith words
                        if (child.children.length < 3) return;
                        let node = {};
                        node.hasNot = child.children[1].text.trim() === "not";
                        let index = node.hasNot ? 2 : 1;
                        node.checkType = child.children[index].text.trim();
                        node.word = child.children[index + 1].text;
                        guiNode.value = node;
                    }
                }
            })
        }
    }
    else if (["InputSentenceContext", "MustClauseContext", "MustBeEqualToClauseContext"].indexOf(treeNode.nodeType) !== -1)
        guiNode = traverseNormalNode(treeNode.children[0]);

    else if (treeNode.nodeType === "TerminalNodeImpl")
        if (TextConstants.keywords.slice().concat("subclass").indexOf(treeNode.text.trim()) !== -1)
            guiNode.key = treeNode.text.trim();

        else
            console.log(treeNode.nodeType + " node is skipped.", treeNode);

    return guiNode;
};


/**
 * traverse a ExpressionContext node to create a list of nodes
 * @param ExpressionNode
 * @param isConstraint
 * @returns {Array} array of new nodes
 */
const traverseExpressionNode = (ExpressionNode, isConstraint) => {
    let guiWhereArray = [];
    let setIsConstraint = ExpressionNode.isConstraint || isConstraint;
    if (ExpressionNode.children) {
        let child = ExpressionNode.children[0];
        if (child.nodeType === "TerminalNodeImpl") {
            // ( ExpressionContext )
            if (child.text === "(")
                guiWhereArray = traverseExpressionNode(ExpressionNode.children[1], setIsConstraint || child.isConstraint);

            else if (child.text.trim() === "have") {
                // have annotation
                if (ExpressionNode.children[1].nodeType === "TerminalNodeImpl")
                    guiWhereArray.push({
                        key: ExpressionNode.children[1].text.trim(),
                        isConstraint: setIsConstraint || ExpressionNode.children[1].isConstraint
                    });

                // have AnnotationsContext
                else
                    guiWhereArray.push(traverseNormalNode(ExpressionNode.children[1], setIsConstraint || child.isConstraint));
            }
        }
        // ExpressionContext and/or ExpressionContext
        else
            ExpressionNode.children.forEach(child => {
                if (child.nodeType.endsWith("ExpressionContext"))
                    guiWhereArray = guiWhereArray.concat(traverseExpressionNode(child, setIsConstraint || child.isConstraint));
            });
    }
    return guiWhereArray;
};


/**
 * the original tree is grandchild -> child -> parent -> grandparent
 * this function reverse the order
 * @param node
 * @returns {*}
 */
const reverseParentChildOrder = (node) => {
    if (node.hasOwnProperty("of")) {
        let parentNode = reverseParentChildOrder(node.of);
        delete node.of;
        return {...parentNode, where: (parentNode.where ? parentNode.where.concat([node]) : [node])}
    }
    else
        return node;
};


/**
 * build a tree from GUI element IDs
 * @param parseTree
 * @return false/a tree of ids corresponding to the input tree
 */
const createGuiElementTree = (parseTree) => {

    let newGuiElements = JSON.parse(JSON.stringify(initial_guiElements));
    let newElementTree = JSON.parse(JSON.stringify(initial_elementTree));

    let visitedIDs = [];

    let checkNode = (node, idStack, parent_id) => {
        while (idStack.length > 0) {
            let elem_id = idStack.pop();

            // check if this is the node
            if (getConditionByName(newGuiElements[elem_id].conditionName).grammar === node.key) {

                // check if some ids appear more than once in the guiTree
                // if so, create a new node
                if (visitedIDs.indexOf(elem_id) !== -1) {
                    // create a new element
                    let newElementId = Math.floor(new Date().getTime() / 10).toString();
                    let newElementsData = generateTreeForElement(newGuiElements[elem_id].conditionName, newElementId);

                    // look for childGroup/subGroup for guiNode.elementId using parentId
                    // add it to newElementTree and newGuiElements
                    Object.keys(newElementTree[parent_id].children).forEach(childGroup => {
                        if (childGroup !== "body")
                            if (newElementTree[parent_id].children[childGroup].indexOf(elem_id) !== -1)
                                newElementTree[parent_id].children[childGroup].push(newElementId);
                            else
                                newElementTree[parent_id].children["body"].forEach((subGroup, i) => {
                                    if (subGroup.indexOf(elem_id) !== -1)
                                        newElementTree[parent_id].children["body"][i].push(newElementId);
                                });
                    });

                    // adding new trees
                    newElementsData.trees.forEach(tree => newElementTree[tree.id] = tree.node);
                    // adding new elements
                    newElementsData.elements.forEach(elem => newGuiElements[elem.id] = elem.node);

                    // update the elementId
                    elem_id = newElementId;
                }

                let newNode = {
                    elementId: elem_id,
                    parentId: parent_id,
                    isConstraint: node.isConstraint ? node.isConstraint : false // sometimes it is undefined
                };
                if (node.selectedElement)
                    newNode.selectedElement = node.selectedElement;

                // accumulate all children
                let elementChildren = [];
                Object.keys(newElementTree[elem_id].children).forEach(childGroup => {
                    if (childGroup !== "body") elementChildren = elementChildren.concat(newElementTree[elem_id].children[childGroup]);
                    else newElementTree[elem_id].children["body"].forEach(subGroup => elementChildren = elementChildren.concat(subGroup));
                });

                // first check for child
                if (node.child) {
                    let childId = checkNode(node.child, JSON.parse(JSON.stringify(elementChildren)), elem_id);
                    if (!childId) continue;
                    newNode.child = childId
                }

                // for each node in 'where' check if they exist. If not continue the search
                let found = true;
                if (node.where) {
                    newNode.where = [];
                    node.where.forEach(whereNode => {
                        let where = checkNode(whereNode, JSON.parse(JSON.stringify(elementChildren)), elem_id);
                        if (!where) {
                            found = false;
                            return;
                        }
                        newNode.where.push(where);
                    });
                }
                if (found) return newNode;
            }
        }
        return false;
    };

    // search newElementTree from id="0" to find the root node
    return checkNode(parseTree, ["0"], "");

};


/**
 * build a new tree based on the tree data
 * @param grammarTree
 * @param guiTree
 * @return {{newGuiElements, newElementTree, grammarTree: *, guiTree: *}}
 */
const updateGuiElements = (grammarTree, guiTree) => {
    if (!guiTree) return {};
    let newGuiElements = JSON.parse(JSON.stringify(initial_guiElements));
    let newElementTree = JSON.parse(JSON.stringify(initial_elementTree));


    let checkNode = (grammarNode, guiNode) => {
        newGuiElements[guiNode.elementId].activeElement = true;
        if (guiNode.selectedElement) {
            newGuiElements[guiNode.elementId].selectedElement = true;
            newElementTree.selectedElementID = guiNode.elementId;
        }
        newGuiElements[guiNode.elementId].isConstraint = guiNode.isConstraint;

        if (guiNode.child) checkNode(grammarNode.child, guiNode.child);

        if (guiNode.where)
            guiNode.where.forEach((whereNode, i) => checkNode(grammarNode.where[i], whereNode));
        if (grammarNode.value) // todo process rootNode["properties"].text
            newGuiElements[guiNode.elementId].text = (grammarNode.value.hasNot ? "not " : "") + grammarNode.value.checkType + " " + grammarNode.value.word;

    };

    checkNode(grammarTree, guiTree);
    return {newGuiElements, newElementTree, grammarTree, guiTree}
};