/**
 * Heavily dependant on Grammar
 */

import {TerminalNodeImpl} from "antlr4/tree/Tree";
import Utilities from "./utilities";
import store from "../reduxStore";
import {sendExpressionStatementXML} from "../actions";
import {webSocketSendMessage} from "./coreConstants";
import {mapCommentsToXPath} from "../miningRulesCore/featureConfig";

class GenerateXPath {

    /**
     * @param Tree: tree produced by ANTLR parser
     */
    constructor(Tree) {
        this.tree = Tree;
        this.XPathQ = "";
        this.XPathC = "";
        this.ws = store.getState().ws;
    }

    traverseTree() {
        this.traverseNode(this.tree, false);
        while (this.XPathQ.indexOf("[]") !== -1)
            this.XPathQ = this.XPathQ.replace("[]","");
        while (this.XPathQ.indexOf("][") !== -1)
            this.XPathQ = this.XPathQ.replace("]["," and ");
        while (this.XPathC.indexOf("[]") !== -1)
            this.XPathC = this.XPathC.replace("[]","");
        while (this.XPathC.indexOf("][") !== -1)
            this.XPathC = this.XPathC.replace("]["," and ");
    }

    /**
     *
     * @param node
     * @param isConstraintCondition
     * @returns {*} a clean version of this.tree
     */
    traverseNode(node, isConstraintCondition) {
        isConstraintCondition = isConstraintCondition || node.isConstraintCondition;

        if (node instanceof TerminalNodeImpl) {

            /**
             * TerminalNodeImpl
             invokingState: number
             parentCtx: {parentNode}
             symbol: { CommonToken      --> getSymbol()
                channel: number
                column: number
                line: number
                source: [rulePadGrammarLexer, InputStream]
                start: number
                stop: number
                tokenIndex: number
                type: number
                _text: null
                text: "..."             --> .text
             */

                // <EOF>   " "   function/name/class    ( )

            let token = node.getSymbol();
            let nodeText = token.text;

            switch (nodeText) {
                case "(":
                case "((":
                case ") and (":
                case "))":
                case ")":
                    if (!isConstraintCondition) this.XPathQ += nodeText;
                    this.XPathC += nodeText;
                    break;

                default:
                    break;
            }
        }
        else {

            /**
             * ***Context
             children: [...]
             exception: null ?
             invokingState: number
             parentCtx: {parentNode}
             parser: rulePadGrammarParser {...}
             ruleIndex: number
             start: CommonToken {source: Array(2), type: 21, channel: 0, start: 8, stop: 8, …}
             stop: CommonToken {source: Array(2), type: 26, channel: 0, start: 66, stop: 66, …}
             */

            let nodeChildren = node.children.slice(0);
            let nodeType = node.constructor.name;

            // move Of children to first
            for (let i = 0; i < node.children.length; i++) {
                let nodeType = node.getChild(i).constructor.name;
                if (nodeType.indexOf("OfContext") !== -1 && nodeType !== "OfContext") {
                    nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                    break;
                }
            }

            switch (nodeType) {

                case "BinaryContext":
                    if (nodeChildren[0].constructor.name === "AndContext") {
                        if (!isConstraintCondition) this.XPathQ += " and ";
                        this.XPathC += " and ";
                    }
                    else {
                        if (!isConstraintCondition) this.XPathQ += " or ";
                        this.XPathC += " or ";
                    }

                    break;

                case "CommentsContext":
                    this.commentsContextTraversal(node, isConstraintCondition);
                    break;

                case "SubclassesContext":
                    this.classesContextTraversal(node, isConstraintCondition, true);
                    break;

                case "ClassesContext":
                    this.classesContextTraversal(node, isConstraintCondition, false);
                    break;

                case "interfacesContext":
                    this.interfacesContextTraversal(node, isConstraintCondition);
                    break;

                case "NamesContext":
                    this.namesContextTraversal(node, isConstraintCondition);
                    break;

                case "ClassNamesContext":
                    this.classNamesContextTraversal(node, isConstraintCondition);
                    break;

                case "AnnotationsContext":
                    this.annotationsContextTraversal(node, isConstraintCondition);
                    break;

                case "ExtensionsContext":
                    this.extensionsContextTraversal(node, isConstraintCondition);
                    break;

                case "ImplementationsContext":
                    this.implementationsContextTraversal(node, isConstraintCondition);
                    break;

                case "FunctionsContext":
                    this.allFunctionsContextTraversal(node, "Function", "function", isConstraintCondition);
                    break;

                case "AbstractFunctionsContext":
                    this.allFunctionsContextTraversal(node, "AbstractFunction", "function_decl", isConstraintCondition);
                    break;

                case "ConstructorsContext":
                    this.allFunctionsContextTraversal(node, "Constructor", "constructor", isConstraintCondition);
                    break;

                case "ParametersContext":
                    this.parametersContextTraversal(node, isConstraintCondition);
                    break;

                case "TypesContext":
                    this.typesContextTraversal(node, isConstraintCondition);
                    break;

                case "SpecifiersContext":
                    this.specifiersContextTraversal(node, isConstraintCondition);
                    break;

                case "VisibilitiesContext":
                    this.visibilitiesContextTraversal(node, isConstraintCondition);
                    break;

                case "ReturnValuesContext":
                    this.returnValuesContextTraversal(node, isConstraintCondition);
                    break;

                case "DeclarationStatementsContext":
                    this.declarationStatementsContextTraversal(node, isConstraintCondition);
                    break;

                case "ExpressionStatementsContext":
                    this.expressionStatementsContextTraversal(node, isConstraintCondition);
                    break;

                case "ValueContext":
                    this.valueContextTraversal(node, isConstraintCondition);
                    break;

                case "InitialValuesContext":
                    this.initialValuesContextTraversal(node, isConstraintCondition);
                    break;

                case "OfContext":
                case "WithWordContext":
                case "HaveContext":
                case "EndContext":
                    break;


                case "MustClauseContext":
                    this.reorganize(node);
                    for (let i = 0; i < node.children.length; i++) {
                        this.traverseNode(nodeChildren[i], isConstraintCondition);
                    }
                    break;

                case "MustContext":
                    break;

                default:
                    for (let i = 0; i < node.children.length; i++) {
                        this.traverseNode(nodeChildren[i], isConstraintCondition);
                    }

            }

        }
    }


    reorganize(node) {
        // reorganize the children
        if (node.children.length > 0
            && node.children[0].children.length >= 2
            && node.children[0].children[1].constructor.name.indexOf("ConditionContext") !== -1) {
            // clone the children of 'with' for first token
            let oldCondition = node.children[0].children[1].children[1];
            let clonedNode = Object.assign(Object.create(Object.getPrototypeOf(oldCondition)), oldCondition);
            // update the children of the first token

            node.children[3].isConstraintCondition = true;
            let startNode = new TerminalNodeImpl({text: "(("});
            startNode.isConstraintCondition = true;
            let middleNode = new TerminalNodeImpl({text: ") and ("});
            middleNode.isConstraintCondition = true;
            let endNode = new TerminalNodeImpl({text: "))"});
            endNode.isConstraintCondition = true;
            node.children[0].children[1].children[1].children = [startNode, clonedNode, middleNode, node.children[3], endNode];
            // remove the node after must
            node.children.splice(3, 1);
        }
        else {
            // copy the node after must to the children of the first token
            node.children[3].isConstraintCondition = true;
            node.children[0].children.splice(1, 0, node.children[3]);
            // remove the node after must
            node.children.splice(3, 1);
            // console.log("re-organize (else)", node);
        }
    }

    commentsContextTraversal(node, isConstraintCondition) {
        // based on the grammar the first and last children are quotation marks
        if (node.children.length <= 2) return "";
        let commentPrefix = node.getChild(1).getChild(0).getSymbol().text;
        let identifiers = node.children.length === 4 ? this.identifiersContextTraversal(node.getChild(2)) : "";
        let predefinedComments = mapCommentsToXPath.map(d => d.comment);
        let index = predefinedComments.indexOf(commentPrefix);
        if (index !== -1) {
            if (!isConstraintCondition) {
                this.XPathQ += mapCommentsToXPath[index].xpath.replace(/<TEMP_0>/g, identifiers);
            }
            this.XPathC += mapCommentsToXPath[index].xpath.replace(/<TEMP_0>/g, identifiers);
            return;
        }
        if (!isConstraintCondition)
            this.XPathQ += '[]';
        this.XPathC += '[]';
    }

    classesContextTraversal(node, isConstraintCondition, isSubclass = false) {
        let nodeChildren = node.children.slice(0);

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ClassOfContext") {
                if (!isConstraintCondition) this.XPathQ += "[ancestor-or-self::";
                this.XPathC += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }
            if (nodeType === "SubclassOfContext") {
                if (!isConstraintCondition) this.XPathQ += "[ancestor::";
                this.XPathC += "[ancestor::";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (!isConstraintCondition) this.XPathQ += (isSubclass ? "/" : "") + "src:class";
                this.XPathC += (isSubclass ? "src:block/" : "") + "src:class";
            }

            if (nodeType === "ClassConditionContext" || nodeType === "ClassExpressionContext" ||
                nodeType === "SubclassConditionContext" || nodeType === "SubclassExpressionContext") {
                if (!isConstraintCondition) this.XPathQ += "[";
                this.XPathC += "[";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }
        }
    }

    interfacesContextTraversal(node, isConstraintCondition) {
        let nodeChildren = node.children.slice(0);

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "InterfaceOfContext") {
                if (!isConstraintCondition) this.XPathQ += "[ancestor-or-self::";
                this.XPathC += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (!isConstraintCondition) this.XPathQ += "src:interface";
                this.XPathC += "src:interface";
            }

            if (nodeType === "InterfaceConditionContext" || nodeType === "InterfaceExpressionContext") {
                if (!isConstraintCondition) this.XPathQ += "[";
                this.XPathC += "[";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }
        }
    }

    namesContextTraversal(node, isConstraintCondition) {
        let nodeChildren = node.children.slice(0);

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "NameOfContext") {
                if (!isConstraintCondition) this.XPathQ += "[ancestor-or-self::";
                this.XPathC += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPathQ === "" && !isConstraintCondition) this.XPathQ += "/";
                if (this.XPathC === "") this.XPathC += "/";

                if (!isConstraintCondition) this.XPathQ += "src:name";
                this.XPathC += "src:name";
            }

            if (nodeType === "NameConditionContext") {
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext") {
                        tempText = this.wordsContextTraversal(nodeChildren[i].getChild(j));
                        if (!isConstraintCondition) this.XPathQ += "[" + tempText + "]";
                        this.XPathC += "[" + tempText + "]";
                    }
                }

            }
        }
    }

    classNamesContextTraversal(node, isConstraintCondition) {
        let nodeChildren = node.children.slice(0);

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "NameOfContext") {
                if (!isConstraintCondition) this.XPathQ += "[ancestor-or-self::";
                this.XPathC += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPathQ === "" && !isConstraintCondition) this.XPathQ += "/";
                if (this.XPathC === "") this.XPathC += "/";

                if (!isConstraintCondition) this.XPathQ += "src:name";
                this.XPathC += "src:name";
            }

            if (nodeType === "ClassNameConditionContext") {
                let tempText = "";
                let messageID = Math.floor(new Date().getTime() / 1000); // to match send and receive messages
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "CombinatorialWordsContext") {
                        tempText = this.combinatorialWordsContextTraversal(nodeChildren[i].getChild(j));
                        this.sendTextDataToSrcML(tempText, "className", messageID);
                        if (!isConstraintCondition) this.XPathQ += "[" + messageID + tempText + "]";
                        this.XPathC += "[" + messageID + tempText + "]";
                    }
                    else if (nodeChildren[i].getChild(j).constructor.name === "WordsContext") {
                        tempText = this.wordsContextTraversal(nodeChildren[i].getChild(j));
                        if (!isConstraintCondition) this.XPathQ += "[" + tempText + "]";
                        this.XPathC += "[" + tempText + "]";
                    }
                }
            }
        }
    }

    // simplified version of wordsContextTraversal
    identifiersContextTraversal(node) {
        let identifierTraversal = (node) => {
            let identifier = "\"";
            for (let i = 0; i < node.children.length; i++) {
                identifier += node.getChild(i).getSymbol().text;
            }
            identifier += "\"";
            return "text()=" + identifier;
        }
        let result = "";
        for (let i = 0; i < node.children.length; i++) {
            if (node.getChild(i) instanceof TerminalNodeImpl) {
                if (node.getChild(i).getSymbol().text === "&&") result += " and ";
                else if (node.getChild(i).getSymbol().text === "||") result += " or ";
            }
            else
                result += identifierTraversal(node.getChild(i))
        }
        return result;
    }

    annotationsContextTraversal(node, isConstraintCondition) {
        let nodeChildren = node.children.slice(0);

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "AnnotationOfContext") {
                if (!isConstraintCondition) this.XPathQ += "[ancestor-or-self::";
                this.XPathC += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPathQ === "" && !isConstraintCondition) this.XPathQ += "/";
                if (this.XPathC === "") this.XPathC += "/";

                if (!isConstraintCondition) this.XPathQ += "src:annotation";
                this.XPathC += "src:annotation";
            }

            if (nodeType === "AnnotationConditionContext") {
                let tempText = "";
                let messageID = Math.floor(new Date().getTime() / 1000); // to match send and receive messages
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "CombinatorialWordsContext") {
                        tempText = this.combinatorialWordsContextTraversal(nodeChildren[i].getChild(j));
                        this.sendTextDataToSrcML(tempText, "annotation", messageID);
                        if (!isConstraintCondition) this.XPathQ += "[" + messageID + tempText + "]";
                        this.XPathC += "[" + messageID + tempText + "]";
                    }
                    else if (nodeChildren[i].getChild(j).constructor.name === "WordsContext") {
                        tempText = this.wordsContextTraversal(nodeChildren[i].getChild(j));
                        if (!isConstraintCondition) this.XPathQ += "/src:name[" + tempText + "]";
                        this.XPathC += "/src:name[" + tempText + "]";
                    }
                }
            }
        }
    }

    extensionsContextTraversal(node, isConstraintCondition) {
        let nodeChildren = node.children.slice(0);

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ExtensionOfContext") {
                if (!isConstraintCondition) this.XPathQ += "[ancestor-or-self::";
                this.XPathC += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPathQ === "" && !isConstraintCondition) this.XPathQ += "/";
                if (this.XPathC === "") this.XPathC += "/";

                if (!isConstraintCondition) this.XPathQ += "src:super/src:extends";
                this.XPathC += "src:super/src:extends";
            }

            if (nodeType === "ExtensionConditionContext") {
                let tempText = "";
                let messageID = Math.floor(new Date().getTime() / 1000); // to match send and receive messages
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext") {
                        tempText = this.wordsContextTraversal(nodeChildren[i].getChild(j));
                        if (!isConstraintCondition) this.XPathQ += "/src:name[" + tempText + "]";
                        this.XPathC += "/src:name[" + tempText + "]";
                    }
                    else if (nodeChildren[i].getChild(j).constructor.name === "CombinatorialWordsContext") {
                        tempText = this.combinatorialWordsContextTraversal(nodeChildren[i].getChild(j));
                        this.sendTextDataToSrcML(tempText, "extensionImplementationName", messageID);
                        if (!isConstraintCondition) this.XPathQ += "[" + messageID + tempText + "]";
                        this.XPathC += "[" + messageID + tempText + "]";
                    }
                }
            }
        }
    }

    implementationsContextTraversal(node, isConstraintCondition) {
        let nodeChildren = node.children.slice(0);

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ImplementationOfContext") {
                if (!isConstraintCondition) this.XPathQ += "[ancestor-or-self::";
                this.XPathC += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPathQ === "" && !isConstraintCondition) this.XPathQ += "/";
                if (this.XPathC === "") this.XPathC += "/";

                if (!isConstraintCondition) this.XPathQ += "src:super/src:implements";
                this.XPathC += "src:super/src:implements";
            }

            if (nodeType === "ImplementationConditionContext") {
                let tempText = "";
                let messageID = Math.floor(new Date().getTime() / 1000); // to match send and receive messages
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext") {
                        tempText = this.wordsContextTraversal(nodeChildren[i].getChild(j));
                        if (!isConstraintCondition) this.XPathQ += "/src:name[" + tempText + "]";
                        this.XPathC += "/src:name[" + tempText + "]";
                    }
                    else if (nodeChildren[i].getChild(j).constructor.name === "CombinatorialWordsContext") {
                        tempText = this.combinatorialWordsContextTraversal(nodeChildren[i].getChild(j));
                        this.sendTextDataToSrcML(tempText, "extensionImplementationName", messageID);
                        if (!isConstraintCondition) this.XPathQ += "[" + messageID + tempText + "]";
                        this.XPathC += "[" + messageID + tempText + "]";
                    }
                }
            }
        }
    }

    /**
     * @param node
     * @param kindOfFunction -> Function, AbstractFunction, Constructor
     * @param xPathTag -> function, function_decl, constructor
     * @param isConstraintCondition
     */
    allFunctionsContextTraversal(node, kindOfFunction, xPathTag, isConstraintCondition) {
        let nodeChildren = node.children.slice(0);

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === kindOfFunction + "OfContext") {
                if (!isConstraintCondition) this.XPathQ += "[ancestor-or-self::";
                this.XPathC += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPathQ === "" && !isConstraintCondition) this.XPathQ += "/";
                if (this.XPathC === "") this.XPathC += "/";

                if (!isConstraintCondition) this.XPathQ += "src:block/src:" + xPathTag;
                this.XPathC += "src:block/src:" + xPathTag;
            }

            if (nodeType === kindOfFunction + "ConditionContext" || nodeType === kindOfFunction + "ExpressionContext") {
                if (!isConstraintCondition) this.XPathQ += "[";
                this.XPathC += "[";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }
        }
    }

    parametersContextTraversal(node, isConstraintCondition) {
        let nodeChildren = node.children.slice(0);

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ParameterOfContext") {
                if (!isConstraintCondition) this.XPathQ += "[ancestor-or-self::";
                this.XPathC += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPathQ === "" && !isConstraintCondition) this.XPathQ += "/";
                if (this.XPathC === "") this.XPathC += "/";

                if (!isConstraintCondition) this.XPathQ += "src:parameter_list/src:parameter/src:decl";
                this.XPathC += "src:parameter_list/src:parameter/src:decl";
            }

            if (nodeType === "ParameterConditionContext") {
                if (!isConstraintCondition) this.XPathQ += "[";
                this.XPathC += "[";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }
        }
    }

    typesContextTraversal(node, isConstraintCondition) {
        let nodeChildren = node.children.slice(0);

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "TypeOfContext") {
                if (!isConstraintCondition) this.XPathQ += "[ancestor-or-self::";
                this.XPathC += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPathQ === "" && !isConstraintCondition) this.XPathQ += "/";
                if (this.XPathC === "") this.XPathC += "/";

                if (!isConstraintCondition) this.XPathQ += "src:type";
                this.XPathC += "src:type";
            }

            if (nodeType === "TypeConditionContext") {
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    let messageID = Math.floor(new Date().getTime() / 1000); // to match send and receive messages
                    if (nodeChildren[i].getChild(j).constructor.name === "CombinatorialWordsContext") {
                        tempText = this.combinatorialWordsContextTraversal(nodeChildren[i].getChild(j));
                        this.sendTextDataToSrcML(tempText, "type", messageID);
                        if (!isConstraintCondition) this.XPathQ += "[" + messageID + tempText + "]";
                        this.XPathC += "[" + messageID + tempText + "]";

                    }
                    else if (nodeChildren[i].getChild(j).constructor.name === "WordsContext") {
                        tempText = "/src:name[" + this.wordsContextTraversal(nodeChildren[i].getChild(j)) + "]";
                        if (!isConstraintCondition) this.XPathQ += tempText;
                        this.XPathC += tempText;
                    }
                }

            }
        }
    }

    specifiersContextTraversal(node, isConstraintCondition) {
        let nodeChildren = node.children.slice(0);

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "SpecifierOfContext") {
                if (!isConstraintCondition) this.XPathQ += "[ancestor-or-self::";
                this.XPathC += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPathQ === "" && !isConstraintCondition) this.XPathQ += "/";
                if (this.XPathC === "") this.XPathC += "/";

                if (!isConstraintCondition) this.XPathQ += "src:specifier";
                this.XPathC += "src:specifier";
            }

            if (nodeType === "SpecifierConditionContext") {
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext") {
                        tempText = this.wordsContextTraversal(nodeChildren[i].getChild(j));
                        if (!isConstraintCondition) this.XPathQ += "[" + tempText + "]";
                        this.XPathC += "[" + tempText + "]";
                    }
                }

            }
        }
    }

    visibilitiesContextTraversal(node, isConstraintCondition) {
        let nodeChildren = node.children.slice(0);

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "SpecifierOfContext") {
                if (!isConstraintCondition) this.XPathQ += "[ancestor-or-self::";
                this.XPathC += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPathQ === "" && !isConstraintCondition) this.XPathQ += "/";
                if (this.XPathC === "") this.XPathC += "/";

                if (!isConstraintCondition) this.XPathQ += "src:specifier";
                this.XPathC += "src:specifier";
            }

            if (nodeType === "VisibilityConditionContext") {
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext") {
                        tempText = this.wordsContextTraversal(nodeChildren[i].getChild(j));
                        if (!isConstraintCondition) this.XPathQ += "[" + tempText + "]";
                        this.XPathC += "[" + tempText + "]";
                    }
                }
            }
        }
    }

    returnValuesContextTraversal(node, isConstraintCondition) {
        let nodeChildren = node.children.slice(0);

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ReturnValueOfContext") {
                if (!isConstraintCondition) this.XPathQ += "[ancestor-or-self::";
                this.XPathC += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPathQ === "" && !isConstraintCondition) this.XPathQ += "/";
                if (this.XPathC === "") this.XPathC += "/";

                if (!isConstraintCondition) this.XPathQ += "src:block/descendant-or-self::src:return/src:expr";
                this.XPathC += "src:block/descendant-or-self::src:return/src:expr";
            }

            if (nodeType === "ReturnValueConditionContext") {
                let tempText = "";
                let messageID = Math.floor(new Date().getTime() / 1000); // to match send and receive messages
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "CombinatorialWordsContext") {
                        tempText = this.combinatorialWordsContextTraversal(nodeChildren[i].getChild(j));
                        this.sendTextDataToSrcML(tempText, "returnValue", messageID);
                        if (!isConstraintCondition) this.XPathQ += "[" + messageID + tempText + "]";
                        this.XPathC += "[" + messageID + tempText + "]";
                    }
                }
            }
        }
    }

    declarationStatementsContextTraversal(node, isConstraintCondition) {
        let nodeChildren = node.children.slice(0);

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "DeclarationStatementOfContext") {
                if (!isConstraintCondition) this.XPathQ += "[ancestor-or-self::";
                this.XPathC += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPathQ === "" && !isConstraintCondition) this.XPathQ += "/";
                if (this.XPathC === "") this.XPathC += "/";

                if (!isConstraintCondition) this.XPathQ += "descendant-or-self::src:decl_stmt/src:decl";
                this.XPathC += "descendant-or-self::src:decl_stmt/src:decl";
            }

            if (nodeType === "DeclarationStatementConditionContext" || nodeType === "DeclarationStatementExpressionContext") {
                if (!isConstraintCondition) this.XPathQ += "[";
                this.XPathC += "[";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }
        }
    }

    expressionStatementsContextTraversal(node, isConstraintCondition) {
        let nodeChildren = node.children.slice(0);

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ExpressionStatementOfContext") {
                if (!isConstraintCondition) this.XPathQ += "[ancestor-or-self::";
                this.XPathC += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPathQ === "" && !isConstraintCondition) this.XPathQ += "/";
                if (this.XPathC === "") this.XPathC += "/";

                if (!isConstraintCondition) this.XPathQ += "descendant-or-self::src:expr_stmt/src:expr";
                this.XPathC += "descendant-or-self::src:expr_stmt/src:expr";
            }

            if (nodeType === "ExpressionStatementConditionContext" || nodeType === "ExpressionStatementExpressionContext") {

                if (!isConstraintCondition) this.XPathQ += "[";
                this.XPathC += "[";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }
        }
    }

    valueContextTraversal(node, isConstraintCondition) {
        let nodeChildren = node.children.slice(0);
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;
            if (nodeType === "ValueConditionContext") {
                let tempText = "";
                let messageID = Math.floor(new Date().getTime() / 1000); // to match send and receive messages
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "CombinatorialWordsContext") {
                        tempText = this.combinatorialWordsContextTraversal(nodeChildren[i].getChild(j));
                        this.sendTextDataToSrcML(tempText, "expressionStatement", messageID);
                        if (!isConstraintCondition) this.XPathQ += "[" + messageID + tempText + "]";
                        this.XPathC += "[" + messageID + tempText + "]";
                    }
                }
            }
        }
    }

    initialValuesContextTraversal(node, isConstraintCondition) {
        let nodeChildren = node.children.slice(0);

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "InitialValueOfContext") {
                if (!isConstraintCondition) this.XPathQ += "[ancestor-or-self::";
                this.XPathC += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i], isConstraintCondition);
                if (!isConstraintCondition) this.XPathQ += "]";
                this.XPathC += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPathQ === "" && !isConstraintCondition) this.XPathQ += "/";
                if (this.XPathC === "") this.XPathC += "/";

                if (!isConstraintCondition) this.XPathQ += "src:init/src:expr";
                this.XPathC += "src:init/src:expr";
            }

            if (nodeType === "InitialValueConditionContext") {
                let tempText = "";
                let messageID = Math.floor(new Date().getTime() / 1000); // to match send and receive messages
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "CombinatorialWordsContext") {
                        tempText = this.combinatorialWordsContextTraversal(nodeChildren[i].getChild(j));
                        this.sendTextDataToSrcML(tempText, "initialValue", messageID);
                        if (!isConstraintCondition) this.XPathQ += "[" + messageID + tempText + "]";
                        this.XPathC += "[" + messageID + tempText + "]";
                    }
                }

            }
        }
    }

    /**
     * traverse CombinatorialWords node to extract the word
     * It doesn't alter this.XPath
     * annotation/type/returnValue/expressionStatement/initialValue
     * @param node
     * @returns {string}
     */
    combinatorialWordsContextTraversal(node) {
        let word = "";

        // based on the grammar the first and last children are quotation marks
        if (node.children.length <= 2) return word;

        for (let k = 1; k < node.children.length - 1; k++) {
            if (node.getChild(k).constructor.name === "TerminalNodeImpl")
                word += node.getChild(k).getSymbol().text;
            else if (node.getChild(k).constructor.name === "SymbolsContext")
                word += node.getChild(k).getChild(0).getSymbol().text;
        }
        return word;
    }

    wordsContextTraversal(node) {

        let wordTraversal = (node) => {
            let word = "";
            let not = false;
            let status = "equal";
            // words has at least 3 children
            if (node.children[0].getSymbol().text === "!") not = true;
            else if ((node.children[0].getSymbol().text === "!..." || node.children[0].getSymbol().text === "...")
                && node.children[node.children.length - 1].getSymbol().text === "...") {
                not = node.children[0].getSymbol().text.startsWith("!");
                status = "contains";
            }
            else if (node.children[0].getSymbol().text === "!..." || node.children[0].getSymbol().text === "...") {
                not = node.children[0].getSymbol().text.startsWith("!");
                status = "ends-with";
            }
            else if (node.children[node.children.length - 1].getSymbol().text === "...") {
                status = "starts-with";
            }


            word += "\"";
            for (let i = 0; i < node.children.length; i++) {
                if (["...", "!...", "!"].indexOf(node.getChild(i).getSymbol().text) === -1)
                    word += node.getChild(i).getSymbol().text;
            }
            word += "\"";

            if (status === "equal") return not ? "not(text()=" + word + ")" : "text()=" + word;
            if (status === "contains") return not ? "not(contains(text()," + word + "))" : "contains(text()," + word + ")";
            if (status === "starts-with") return not ? "not(starts-with(text()," + word + "))" : "starts-with(text()," + word + ")";

            // ends-with(@id,'register') <== not valid
            // substring(@id, string-length(@id) - string-length('register') +1) = 'register'

            if (status === "ends-with") {
                let query = "substring(text(),string-length(text())-string-length(" + word + ")+1)=" + word;
                return not ? "not(" + query + ")" : query;
            }
            return "text()=" + word;
        };

        let result = "";
        for (let i = 1; i < node.children.length - 1; i++) {
            if (node.getChild(i) instanceof TerminalNodeImpl) {
                if (node.getChild(i).getSymbol().text === "&&") result += " and ";
                else if (node.getChild(i).getSymbol().text === "||") result += " or ";
            }
            else
                result += wordTraversal(node.getChild(i))
        }
        return result;
    }

    /**
     * send text data to the server to be processed by srcml
     * and return XML
     * @param text
     * @param elementType
     * @param messageID
     */
    sendTextDataToSrcML(text, elementType, messageID) {
        if (text === "") return;
        let code;
        let query;
        let cuttingLength; // for cutting XPath after receiving and processing the message
        // let messageID = Math.floor(new Date().getTime() / 1000); // to match send and receive messages

        switch (elementType) {
            case "annotation":
                code = "@" + text;
                query = "//src:unit[count(src:annotation)=1]/src:annotation";
                cuttingLength = 15; // src:annotation[
                break;
            case "type":
                code = text + " dummy_variable = 0;";
                query = "//src:unit[count(src:decl_stmt)=1]/src:decl_stmt/src:decl/src:type";
                cuttingLength = 9; // src:type[
                break;
            case "className":
                code = "class " + text + " {}";
                query = "//src:unit[count(src:class)=1]/src:class/src:name";
                cuttingLength = 9; // src:name[
                break;
            case "extensionImplementationName":
                code = text;
                query = "//src:unit[count(src:expr_stmt)=1]/src:expr_stmt/src:expr";
                cuttingLength = 9; // src:expr[
                break;
            case "returnValue":
            case "expressionStatement":
            case "initialValue":
            default:
                code = text;
                query = "//src:unit[count(src:expr_stmt)=1]/src:expr_stmt/src:expr";
                cuttingLength = 9; // src:expr[
                break;

        }

        Utilities.sendToServer(this.ws, webSocketSendMessage.code_to_xml_msg,
            {"codeText": code.replace(/'/g, "\""), "messageID": messageID});
        store.dispatch(sendExpressionStatementXML({
            "codeText": code,
            "messageID": messageID.toString(),
            "lookFor": `[${messageID + text}]`,
            "query": query,
            "cuttingLength": cuttingLength
        }));
    }
}

export default GenerateXPath;