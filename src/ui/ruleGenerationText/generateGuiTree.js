/**
 * Dependant on Grammar: OfContext, ExpressionContext, ..sContext, ConditionContext and 'subclass'
 */

import lemmatize from 'wink-lemmatizer';
import pluralize from 'pluralize';

import {GuiConstants} from "../ruleGenerationGUI/guiConstants";
import Utilities from "../../core/utilities";
import {TextConstants} from "./textConstant";

/**
 * create the quantifier and the constraint guiTree based on the grammar parse tree
 * @param grammarTree
 * @returns {{}}
 */
export async function generateGuiTrees (grammarTree)  {
    let ruleTypeMust = ruleType(grammarTree);
    let quantifierTree = await createQuantifierTree(grammarTree);
    let constraintTree = await createConstraintTree(grammarTree);

    return {ruleType: ruleTypeMust, quantifier: quantifierTree, constraint: constraintTree}; // match with redux state: newOrEditRule.guiState
}


const ruleType = (tree) => {
    if (tree.constructor.name === "InputSentenceContext") {
        let designRule = tree.children.filter(child => child.constructor.name === "DesignRuleContext")[0];
        if (designRule.children[0].constructor.name === "MustBeEqualToClauseContext") return "MustBeEqualTo";
        if (designRule.children[0].constructor.name === "MustClauseContext") return "Must";
    }
    console.log("Check generateGuiTree.isMustBeEqual(), the rule type cannot be detected: " + tree.constructor.name);
    return "";
};

/**
 * create the gui tree based on the grammar parse tree for quantifier
 * @param tree
 * @returns {{key: string, value: string, target: string, children: {top: Array, before_1: Array, before_2: Array, after_1: Array, after_2: Array, within: Array, child: {}}, text: string}}
 */
const createQuantifierTree = (tree) => {
    let combinedNodes = combineNode(tree);
    let combinedWordsNodes = combineWordsNode(combinedNodes);
    let newTree = traverseNormalNode(combinedWordsNodes);
    let parentChildTree = reverseParentChildOrder(newTree);
    let quantifierTree = createGuiNodes(parentChildTree);
    quantifierTree.target = "follows";

    return quantifierTree;
};

/**
 * create the gui tree based on the grammar parse tree for constraint
 * @param tree
 * @returns {{key: string, value: string, target: string, children: {top: Array, before_1: Array, before_2: Array, after_1: Array, after_2: Array, within: Array, child: {}}, text: string}}
 */
const createConstraintTree = (tree) => {
    let combinedNodes = combineNode(tree);
    let combinedWordsNodes = combineWordsNode(combinedNodes);
    let reorderedMustClause = reorderMustClause(combinedWordsNodes);
    let newTree = traverseNormalNode(reorderedMustClause);
    let parentChildTree = reverseParentChildOrder(newTree);
    let constraintTree = createGuiNodes(parentChildTree);
    constraintTree.target = "follows";

    return constraintTree;
};

/**
 * For constraint queries, the constraint is quantifier query + the constraint
 * @param treeNode
 * @returns {{}}
 */
const reorderMustClause = (treeNode) => {
    let newNode = {...treeNode};
    if (newNode.nodeType === "MustClauseContext") {
        // it has 3 children: [0]..Context or TerminalNodeImpl e.g. "function ", [1]TerminalNodeImpl "must ", [2]..ExpressionContext

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
                    nodeType: pluralize(nodeType) + "Context",
                    children: [{...newNode.children[0]}, {
                        nodeType: nodeType + "ConditionContext",
                        children: [{...newNode.children[2]}]
                    }]
                }
            }
        }
    }
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

    if (node.children && node.children.length > 0)
        node.children = node.children.map(child => combineWordsNode(child));
    return node;
};


/**
 * traverse non-ExpressionContext nodes
 * @param treeNode
 * @returns {{}} a new node
 */
const traverseNormalNode = (treeNode) => {

    // guiNode must have
    // key, value, target, children, text
    // we add "of" and "where" here

    let guiNode = {};
    // context nodes
    let keywords = TextConstants.keywords.slice().map(w => pluralize(w).split(" ").map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(""));
    if (keywords.indexOf(treeNode.nodeType.replace("Context", "")) !== -1) {
        guiNode.key = lemmatize.noun(treeNode.nodeType.replace("Context","").toLowerCase());
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
                                guiNode.where = guiNode.where ? guiNode.where.concat(traverseExpressionNode(node)) : traverseExpressionNode(node);
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
 * @returns {Array} array of new nodes
 */
const traverseExpressionNode = (ExpressionNode) => {
    let guiWhereArray = [];
    if (ExpressionNode.children) {
        let child = ExpressionNode.children[0];
        if (child.nodeType === "TerminalNodeImpl") {
            // ( ExpressionContext )
            if (child.text === "(")
                guiWhereArray = traverseExpressionNode(ExpressionNode.children[1]);

            else if (child.text.trim() === "have") {
                // have annotation
                if (ExpressionNode.children[1].nodeType === "TerminalNodeImpl")
                    guiWhereArray.push({key: ExpressionNode.children[1].text.trim()});

                // have AnnotationsContext
                else
                    guiWhereArray.push(traverseNormalNode(ExpressionNode.children[1]));
            }
        }
        // ExpressionContext and/or ExpressionContext
        else
            ExpressionNode.children.forEach(child => {
                if (child.nodeType.endsWith("ExpressionContext"))
                guiWhereArray = guiWhereArray.concat(traverseExpressionNode(child));
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
        return {...parentNode , child: node}
    }
    else
        return node;
};


/***
 * base on the object obtained by reverseParentChildOrder function, a data structure for Generate Rule Gui is created
 * If guiConstant is changed, this function must be changed accordingly
 * @param node
 * @returns {{key: string, value: string, target: string, children: {top: Array, before_1: Array, before_2: Array, after_1: Array, after_2: Array, within: Array, child: {}}, text: string}}
 */
const createGuiNodes = (node) => {

    /** input:  {key: "", where: [{key: ""}], child: {key: ""} }
     *  or
        "value": {
            "hasNot": false,
            "checkType": "equal to",
            "word": "foo"
          }
     */
    /**  output:
     *      {
              "key": "annotation",
              "value": {
                "buttonName": "Has annotation",
                "type": "annotation",
                "pre": "",
                "post": "",
                "grammar": "annotation"
              },
              "target": "",
              "children": {
                "top": [],
                "before_1": [],
                "before_2": [],
                "after_1": [],
                "after_2": [],
                "within": [],
                "child": {}
              },
              "text": {
                "top": [],
                "before_1": [],
                "before_2": [],
                "after_1": [],
                "after_2": [],
                "within": [],
                "child": {}
              }
            }
     */

    let guiNode = {
        "key": "",
        "value": "",
        "target": "",
        "children": {
            "top": [],
            "before_1": [],
            "before_2": [],
            "after_1": [],
            "after_2": [],
            "within": [],
            "child": {}
        },
        "text": 0
    };

    guiNode.key = node.key;
    if (Object.keys(GuiConstants.gui_tree).indexOf(node.key) !== -1)
        guiNode.value = GuiConstants.gui_tree[node.key];

    if (Object.keys(GuiConstants.code_fragment).indexOf(node.key) !== -1) {
        let top = GuiConstants.code_fragment[node.key]["top"];
        let before_1 = GuiConstants.code_fragment[node.key]["before_1"];
        let before_2 = GuiConstants.code_fragment[node.key]["before_2"];
        let after_1 = GuiConstants.code_fragment[node.key]["after_1"];
        let after_2 = GuiConstants.code_fragment[node.key]["after_2"];
        let within = GuiConstants.code_fragment[node.key]["within"];

        if (node.where) {
            for (let i = 0; i < node.where.length; i++) {
                let whereChildKey = node.where[i].key
                    + (node.where[i].value ? ((node.where[i].value.hasNot ? " not " : " ") + node.where[i].value.checkType) : "");

                // alternative, when key doesn't match
                // like "name", where we have "name equal to" etc.
                let altWhereChildKey = whereChildKey + " equal to";

                if (top.indexOf(whereChildKey) !== -1)
                    guiNode.children["top"].push(createGuiNodes(node.where[i]));
                else if (before_1.indexOf(whereChildKey) !== -1 || before_1.indexOf(altWhereChildKey) !== -1)
                    guiNode.children["before_1"].push(createGuiNodes(node.where[i]));
                else if (before_2.indexOf(whereChildKey) !== -1 || before_2.indexOf(altWhereChildKey) !== -1)
                    guiNode.children["before_2"].push(createGuiNodes(node.where[i]));
                else if (after_1.indexOf(whereChildKey) !== -1 || after_1.indexOf(altWhereChildKey) !== -1)
                    guiNode.children["after_1"].push(createGuiNodes(node.where[i]));
                else if (after_2.indexOf(whereChildKey) !== -1)
                    guiNode.children["after_2"].push(createGuiNodes(node.where[i]));
                else if (within.indexOf(whereChildKey) !== -1)
                    guiNode.children["within"].push(createGuiNodes(node.where[i]));
                else
                    console.log("key not found: " + whereChildKey + "  altWhereChildKey must be added.", node);

            }
        }
    }

    if (node.value) {
        guiNode.key = node.key + (node.value.hasNot ? " not " : " ") + node.value.checkType;
        if (Object.keys(GuiConstants.gui_tree).indexOf(guiNode.key) !== -1) {
            guiNode.value = GuiConstants.gui_tree[guiNode.key];
            guiNode.text = node.value.word ? node.value.word : "";
        }
        else
            console.log(guiNode.key + " : guiNode.key not in guiTree. Must be added. ", node);
    }

    if (node.child) {
        guiNode.children.child = createGuiNodes(node.child);
        guiNode.children.child.target = "follows"
    }

    if (guiNode.text === 0) // not specified
        guiNode.text = guiNode.value.type === "text" ? "" : Utilities.cloneJSON(guiNode.children);

    return guiNode;

};