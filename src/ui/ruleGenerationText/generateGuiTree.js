import lemmatize from 'wink-lemmatizer';

export const generateGuiTree = (grammarTree) =>  {
    let combinedNodes = combineNode(grammarTree); //console.log(JSON.stringify(combinedNodes));
    let combinedWordsNodes = combineWordsNode(combinedNodes); //console.log(JSON.stringify(combinedWordsNodes));
    let newTree = traverseNormalNode(combinedWordsNodes); //console.log(newTree);
    console.log(JSON.stringify(reverseParentChildOrder(newTree)));
    return {};
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
    if (["Names", "Annotation", "Extensions", "Implementations", "Functions", "AbstractFunctions",
            "Constructors", "Parameters", "Types", "Specifiers", "ReturnValues", "DeclarationStatements",
            "ExpressionStatements", "InitValues", "Arguments", "Calls", "Callers", "Classes"]
            .indexOf(treeNode.nodeType.replace("Context", "")) !== -1) {
        guiNode.key = lemmatize.noun(treeNode.nodeType.replace("Context","").toLowerCase());
        if (treeNode.children) {
            treeNode.children.forEach(child => {
                if (child.nodeType.endsWith("OfContext"))
                    // child has two children, the first is "of "
                    guiNode.of = traverseNormalNode(child.children[1]);

                else if (child.nodeType.endsWith("ConditionContext")) {
                    // child has two children, the first is "where "
                    if (child.children[1].nodeType.endsWith("ExpressionContext"))
                        guiNode.where = traverseExpressionNode(child.children[1]);
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
    else if (["InputSentenceContext", "MustClauseContext"].indexOf(treeNode.nodeType) !== -1)
        guiNode = traverseNormalNode(treeNode.children[0]);

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
        else {
            guiWhereArray = guiWhereArray.concat(traverseExpressionNode(ExpressionNode.children[0]));
            guiWhereArray = guiWhereArray.concat(traverseExpressionNode(ExpressionNode.children[2]));
        }
    }
    return guiWhereArray;
};


const reverseParentChildOrder = (node) => {
    if (node.hasOwnProperty("of")) {
        let parentNode = reverseParentChildOrder(node.of);
        delete node.of;
        return {...parentNode , child: node}
    }
    else
        return node;
};