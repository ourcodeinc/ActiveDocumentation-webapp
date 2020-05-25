/**
 * Dependant on Grammar: OfContext, ExpressionContext, ..sContext, ConditionContext and "subclass"
 */

import pluralize from "pluralize";

import {generateTreeForElement, getConditionByName} from "../rulePadGraphicalEditor/graphicalEditorConstants";
import {grammar_keywords, special_word} from "./textualEditorConstant";
import {initial_graphicalElementTree, initial_graphicalElements} from "../../../initialState";

/**
 * create the quantifier and the constraint guiTree based on the grammar parse tree
 * @param grammarTree
 * @returns {{}}
 */
export async function generateGuiTrees(grammarTree) {
    let trees = await createConstraintTree(grammarTree);
    // console.log(trees);
    if (Object.entries(trees).length === 0)
        return null;
    // // match with redux state: rulePadState.graphicalEditorState
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
    // console.log(tree);
    let combinedNodes = combineNode(tree);
    // console.log(combinedNodes);
    let combinedWordsNodes = combineWordsNode(combinedNodes);
    // console.log(combinedWordsNodes);
    let reorderedMustClause = reorderMustClause(combinedWordsNodes);
    // console.log(reorderedMustClause);
    let newTree = traverseNormalNode(reorderedMustClause);
    // console.log(newTree);
    newTree.selectedElement = true;
    let parentChildTree = reverseParentChildOrder(newTree);
    // console.log(parentChildTree);
    let treeOfIDs = createGuiElementTree(parentChildTree);
    // console.log(treeOfIDs);
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
        // it has 4 children:
        // [0]..Context or TerminalNodeImpl e.g. "function ", [1]TerminalNodeImpl "must ",
        // [2]TerminalNodeImpl "have ", [3]..ExpressionContext
        newNode.children[3].isConstraint = true;
        if (newNode.children[3].children)
            newNode.children[3].children.forEach(child => child.isConstraint = true);

        if (newNode.children[0].children) {

            // in children[0].children look for ..ConditionContext
            let conditionNodeIndex = newNode.children[0].children.map(gChild => gChild.nodeType.endsWith("ConditionContext")).indexOf(true);

            // if exists: replace it with another one w/ it and children[3] as its children
            if (conditionNodeIndex !== -1)
                newNode.children[0].children[conditionNodeIndex].children = newNode.children[0].children[conditionNodeIndex].children
                    .concat(newNode.children[3]);

            // if not: create and add it w/ children[2] as its child
            else {
                // must exist with e.g. "function " text
                let string = newNode.children[0].children.filter(gChild => gChild.nodeType === "TerminalNodeImpl")[0].text.trim();
                let nodeType = string.charAt(0).toUpperCase() + string.slice(1) + "ConditionContext";
                newNode.children[0].children.push({
                    nodeType: nodeType,
                    children: [{...newNode.children[3]}]
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
                        children: [{...newNode.children[3]}]
                    }]
                }
            }
        }
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
    return {nodeType: node.constructor.name, text: node.getSymbol().text.trim()}
};


/**
 * combine word letters
 * @param node
 * @returns {*} node
 */
const combineWordsNode = (node) => {
    if (node.nodeType === "WordsContext") {
        let word = "";
        for (let i = 1; i < node.children.length - 1; i++) {
            if (node.children[i].nodeType === "TerminalNodeImpl")
                word += node.children[i].text;
            else
                word += node.children[i].children.map(child => child.text === "" ? " " : child.text).join("");
        }
        // let word = node.children.map(child => child.text !== "\"" ? child.text : null).join("");
        return {nodeType: "word", text: word}
    }
    if (node.nodeType === "CombinatorialWordsContext") {
        let word = node.children.map(child => child.text !== "\"" ? (child.text === "" ? " " : child.text) : null).join("");
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
    // key, value, children, text
    // we add "of" and "withChildren" here

    let guiNode = {};
    guiNode.isConstraint = treeNode.isConstraint || isConstraint;

    // context nodes
    let keywords = grammar_keywords.slice().map(w => pluralize(w).split(" ").map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(""));
    if (keywords.indexOf(treeNode.nodeType.replace("Context", "")) !== -1) {
        guiNode.key = grammar_keywords[keywords.indexOf(treeNode.nodeType.replace("Context", ""))];
        if (treeNode.children) {
            treeNode.children.forEach(child => {
                if (child.nodeType.endsWith("OfContext")) {
                    // child has two children, the first is "of "
                    if (child.children[1].nodeType === "TerminalNodeImpl")
                        guiNode.of = {
                            key: child.children[1].text.trim(),
                            isConstraint: child.children[1].isConstraint || guiNode.isConstraint
                        };
                    else
                        guiNode.of = traverseNormalNode(child.children[1]);
                }

                else if (child.nodeType.endsWith("ConditionContext")) {
                    child.children.forEach((node, i) => {
                        if (node.nodeType === "TerminalNodeImpl" && grammar_keywords.indexOf(node.text.trim()) !== -1) {
                            let guiChild = {
                                key: node.text.trim(),
                                isConstraint: node.isConstraint || guiNode.isConstraint
                            };
                            if (!guiNode.withChildren) guiNode.withChildren = [];
                            guiNode.withChildren = guiNode.withChildren.concat([guiChild]);
                        }
                        // implementation of "..."/Interface
                        else if (node.nodeType === "TerminalNodeImpl" && node.text.trim() === "of") {
                            if (child.children.length !== 2 || i !== 0
                                || (child.children[i + 1].nodeType !== "TerminalNodeImpl" && child.children[i + 1].nodeType !== "word")) console.log("error?", child);
                            else {
                                if (!special_word.includes(child.children[1].text)) {
                                    guiNode.value = {word: child.children[1].text, type: "text"};
                                }
                            }
                        }
                        else if (node.nodeType.endsWith("ExpressionContext")) {
                            if (!guiNode.withChildren) guiNode.withChildren = [];
                            guiNode.withChildren = guiNode.withChildren.concat(traverseExpressionNode(node, guiNode.isConstraint));
                        }
                        else if (keywords.indexOf(node.nodeType.replace("Context", ""))!== -1) {
                            if (!guiNode.withChildren) guiNode.withChildren = [];
                            guiNode.withChildren = guiNode.withChildren.concat([traverseNormalNode(node, guiNode.isConstraint)]);
                        }
                        else if (node.nodeType === "word") {
                            let type = "text";
                            // exception in the GUI
                            if (treeNode.nodeType === "visibilitiesContext") type = "value";
                            guiNode.value = {word: node.text, type: type};
                        }
                    });
                }
                // name, extension, implementation, type, specifier
                // {nodeType: "word", text: "..."}
                else if (child.nodeType === "word") {
                    let type = "text";
                    // exception in the GUI
                    if (treeNode.nodeType === "visibilitiesContext") type = "value";
                    guiNode.value = {word: child.text, type: type};
                }
            })
        }
        return guiNode
    }

    if (["InputSentenceContext", "MustClauseContext"].indexOf(treeNode.nodeType) !== -1)
        return traverseNormalNode(treeNode.children[0]);

    // else if (treeNode.nodeType === "TerminalNodeImpl")
    //     console.log("???", treeNode);

    return {};
};


/**
 * traverse a ExpressionContext node to create a list of nodes
 * @param ExpressionNode
 * @param isConstraint
 * @returns {Array} array of new nodes
 */
const traverseExpressionNode = (ExpressionNode, isConstraint) => {
    let guiWithArray = [];
    let setIsConstraint = ExpressionNode.isConstraint || isConstraint;
    // context nodes
    let keywords = grammar_keywords.slice().map(w => pluralize(w).split(" ").map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(""));

    if (ExpressionNode.children) {
        ExpressionNode.children.forEach(child => {
            if (child.nodeType === "TerminalNodeImpl" && grammar_keywords.indexOf(child.text.trim()) !== -1)
                guiWithArray.push({
                    key: child.text.trim(),
                    isConstraint: child.isConstraint || setIsConstraint
                });

            else if (child.nodeType.endsWith("ExpressionContext"))
                guiWithArray = guiWithArray.concat(traverseExpressionNode(child, setIsConstraint));

            else if (keywords.indexOf(child.nodeType.replace("Context", "")) !== -1) {
                guiWithArray.push(traverseNormalNode(child, setIsConstraint));
            }
        });
    }

    return guiWithArray;
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
        return {
            ...parentNode,
            withChildren: (parentNode.withChildren ? parentNode.withChildren.concat([node]) : [node])
        }
    }
    else
        return node;
};


/**
 * build a tree from GUI element IDs
 * @param parseTree
 * return false or a tree of ids corresponding to the input tree
 */
const createGuiElementTree = (parseTree) => {

    let newGuiElements = JSON.parse(JSON.stringify(initial_graphicalElements));
    let newElementTree = JSON.parse(JSON.stringify(initial_graphicalElementTree));

    let visitedIDs = [];

    let checkNode = (node, idStack, parent_id, isRoot = false) => {
        if (idStack.length === 0) return false;
        let copiedIdStack = JSON.parse(JSON.stringify(idStack));
        while (idStack.length > 0) {
            let elem_id = idStack.pop();

            // check if this is the node
            if (getConditionByName(newGuiElements[elem_id].conditionName).grammar === node.key) {

                let neighbor = false;

                // check if some ids appear more than once in the guiTree
                // if so, create a new node
                if (visitedIDs.indexOf(elem_id) !== -1) {
                    neighbor = elem_id;

                    // create a new element
                    let newElementId = Math.random().toString(36).substr(2, 16);
                    let newElementsData = generateTreeForElement(newGuiElements[elem_id].conditionName, newElementId, parent_id);

                    // look for childGroup/subGroup for guiNode.elementId using parentId
                    // add it to newElementTree and newGuiElements
                    Object.keys(newElementTree[parent_id].children).forEach(childGroup => {
                        if (childGroup !== "body") {
                            if (newElementTree[parent_id].children[childGroup].indexOf(elem_id) !== -1)
                                newElementTree[parent_id].children[childGroup].push(newElementId);
                        }
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
                    elementType: newGuiElements[elem_id].conditionName, // for new elements
                    parentId: parent_id,
                    isConstraint: node.isConstraint ? node.isConstraint : false // sometimes it is undefined
                };
                if (neighbor) newNode.neighbor = neighbor;
                visitedIDs.push(elem_id);

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

                // for each node in "withChildren" check if they exist. If not continue the search
                let found = true;
                if (node.withChildren) {
                    newNode.withChildren = [];
                    node.withChildren.forEach(withChildNode => {
                        let where = checkNode(withChildNode, JSON.parse(JSON.stringify(elementChildren)), elem_id);
                        if (!where) {
                            found = false;
                            return;
                        }
                        newNode.withChildren.push(where);
                    });
                }
                if (found) return newNode;
            }
        }

        // if the root is not class search through its children, etc.
        if (isRoot) {
            let elementChildren = [];
            copiedIdStack.forEach(elem_id => {
                Object.keys(newElementTree[elem_id].children).forEach(childGroup => {
                    if (childGroup !== "body") elementChildren = elementChildren.concat(newElementTree[elem_id].children[childGroup]);
                    else newElementTree[elem_id].children["body"].forEach(subGroup => elementChildren = elementChildren.concat(subGroup));
                });
            });
            return checkNode(node, JSON.parse(JSON.stringify(elementChildren)), "")
        }

        return false;
    };

    // search newElementTree from id="0" to find the root node
    return checkNode(parseTree, ["0"], "", true);

};


/**
 * build a new tree based on the tree data
 * @param grammarTree
 * @param guiTree
 * @return {{newGuiElements, newElementTree, grammarTree: *, guiTree: *}}
 */
const updateGuiElements = (grammarTree, guiTree) => {
    if (!guiTree) return {};
    let newGuiElements = JSON.parse(JSON.stringify(initial_graphicalElements));
    let newElementTree = JSON.parse(JSON.stringify(initial_graphicalElementTree));


    let checkNode = (grammarNode, guiNode) => {
        if (!newGuiElements.hasOwnProperty(guiNode.elementId)) {
            let newElementsData = generateTreeForElement(guiNode.elementType, guiNode.elementId, guiNode.parentId);
            // adding new trees
            newElementsData.trees.forEach(tree => newElementTree[tree.id] = tree.node);
            // adding new elements
            newElementsData.elements.forEach(elem => newGuiElements[elem.id] = elem.node);

            // look for childGroup/subGroup for guiNode.elementId using parentId
            // add it to newElementTree and newGuiElements
            Object.keys(newElementTree[guiNode.parentId].children).forEach(childGroup => {
                if (childGroup !== "body") {
                    if (newElementTree[guiNode.parentId].children[childGroup].indexOf(guiNode.neighbor) !== -1)
                        newElementTree[guiNode.parentId].children[childGroup].push(guiNode.elementId);
                }
                else
                    newElementTree[guiNode.parentId].children["body"].forEach((subGroup, i) => {
                        if (subGroup.indexOf(guiNode.neighbor) !== -1)
                            newElementTree[guiNode.parentId].children["body"][i].push(guiNode.elementId);
                    });
            });
        }

        newGuiElements[guiNode.elementId].activeElement = true;
        if (guiNode.selectedElement) {
            newGuiElements[guiNode.elementId].selectedElement = true;
            newElementTree.selectedElementID = guiNode.elementId;
        }
        newGuiElements[guiNode.elementId].isConstraint = guiNode.isConstraint;

        if (guiNode.child) checkNode(grammarNode.child, guiNode.child);

        if (guiNode.withChildren)
            guiNode.withChildren.forEach((withChildNode, i) => checkNode(grammarNode.withChildren[i], withChildNode));
        if (grammarNode.value)
            newGuiElements[guiNode.elementId][grammarNode.value.type] = grammarNode.value.word;

    };

    checkNode(grammarTree, guiTree);
    return {newGuiElements, newElementTree, grammarTree, guiTree}
};