/**
 * Heavily dependant on Grammar
 */

import {TerminalNodeImpl} from "antlr4/tree/Tree";
import Utilities from "../../core/utilities";
import store from "../../reduxStore";

class GenerateXpath {

    /**
     * @param Tree: tree produced by ANTLR parser
     * @param isConstraint
     */
    constructor(Tree, isConstraint) {
        this.tree = Tree;
        this.XPath = "";
        this.quantifierXPath = "";
        this.constraintXPath = "";
        this.dumpXPath = false;
        this.isConstraint = isConstraint;
        this.ws = store.getState().ws;

        // keeps the number of messages already sent and waiting for the response
        // Without it there is a synchronization problem, that is the xpath is already sent
        // and the result XML is not received yet.
        this.numberOfWaitingMessages = 0;

        this.unsubscribe = store.subscribe(() => {
            if (store.getState().message === "RECEIVE_EXPR_STMT_XML") {
                // one message is replied.
                this.numberOfWaitingMessages -= 1;
                console.log(this.numberOfWaitingMessages, " <- numberOfWaitingMessages (subscribe)");
                let textAndXpath = this.traverseXml(store.getState().exprStmtXML);

                // replace all occurrences of textAndXpath.originalText
                let copiedXpath = this.XPath.split("'" + textAndXpath.originalText + "'");
                this.XPath = copiedXpath.join(textAndXpath.xpathResult);
            }
        });
    }

    traverseTree() {
        this.traverseNode(this.tree);

        // todo wait for this.numberOfWaitingMessages to be 0

        if (this.dumpXPath)
            return;
        if (this.quantifierXPath !== "")
            this.constraintXPath = this.XPath;
        else
            this.quantifierXPath = this.XPath;
    }

    getQuantifierXPath() {
        return this.quantifierXPath;
    }

    getConstraintXPath() {
        return this.constraintXPath;
    }

    /**
     *
     * @param node
     * @returns {*} a clean version of this.tree
     */
    traverseNode(node) {
        if (node instanceof TerminalNodeImpl) {

            /**
             * TerminalNodeImpl
             invokingState: number
             parentCtx: {parentNode}
             symbol: { CommonToken      --> getSymbol()
                channel: number
                column: number
                line: number
                source: [myGrammarLexer, InputStream]
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
                    this.XPath += nodeText;
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
             parser: myGrammarParser {...}
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
                    nodeChildren[0].constructor.name === "AndContext" ?
                        this.XPath += " and " : this.XPath += " or ";
                    break;

                case "ClassesContext":
                    this.classesContextTraversal(node);
                    break;

                case "interfacesContext":
                    this.interfacesContextTraversal(node);
                    break;

                case "NamesContext":
                    this.namesContextTraversal(node);
                    break;

                case "AnnotationsContext":
                    this.annotationsContextTraversal(node);
                    break;

                case "ExtensionsContext":
                    this.extensionsContextTraversal(node);
                    break;

                case "ImplementationsContext":
                    this.implementationsContextTraversal(node);
                    break;

                case "FunctionsContext":
                    this.allFunctionsContextTraversal(node, "Function", "function");
                    break;

                case "AbstractFunctionsContext":
                    this.allFunctionsContextTraversal(node, "AbstractFunction", "function_decl");
                    break;

                case "ConstructorsContext":
                    this.allFunctionsContextTraversal(node, "Constructor", "constructor");
                    break;

                case "ParametersContext":
                    this.parametersContextTraversal(node);
                    break;

                case "TypesContext":
                    this.typesContextTraversal(node);
                    break;

                case "SpecifiersContext":
                    this.specifiersContextTraversal(node);
                    break;

                case "ReturnValuesContext":
                    this.returnValuesContextTraversal(node);
                    break;

                case "DeclarationStatementsContext":
                    this.declarationStatementsContextTraversal(node);
                    break;

                case "ExpressionStatementsContext":
                    this.expressionStatementsContextTraversal(node);
                    break;

                case "InitialValuesContext":
                    this.initialValuesContextTraversal(node);
                    break;

                // WordsContext
                case "WordsContext":
                    for (let i = 0; i < node.children.length; i++) {
                        this.XPath += node.getChild(i).getSymbol().text;
                    }
                    break;

                case "OfContext":
                case "WhereContext":
                case "HaveContext":
                case "EndContext":
                    break;


                case "MustClauseContext":
                    if (this.isConstraint)
                        this.reorganize(node);
                    for (let i = 0; i < node.children.length; i++) {
                        this.traverseNode(nodeChildren[i]);
                    }
                    break;

                case "MustContext":
                    if (!this.isConstraint) {
                        this.quantifierXPath = this.XPath;
                        this.XPath = "";
                        this.dumpXPath = true;
                    }
                    break;

                case "MustBeEqualToContext":
                    this.quantifierXPath = this.XPath;
                    this.XPath = "";
                    break;

                default:
                    for (let i = 0; i < node.children.length; i++) {
                        this.traverseNode(nodeChildren[i]);
                    }

            }

        }
    }


    reorganize(node) {
        // reorganize the children
        if (node.children.length > 0
            && node.children[0].children.length >= 2
            && node.children[0].children[1].constructor.name.indexOf("ConditionContext") !== -1) {

            // clone the children of 'where' for first token
            let oldCondition = node.children[0].children[1].children[1];
            let clonedNode = Object.assign(Object.create(Object.getPrototypeOf(oldCondition)), oldCondition);
            // update the children of the first token
            node.children[0].children[1].children[1].children = [
                new TerminalNodeImpl({text: "(("}),
                clonedNode,
                new TerminalNodeImpl({text: ") and ("}),
                node.children[2],
                new TerminalNodeImpl({text: "))"})
            ];
            // remove the node after must
            node.children.splice(2, 1);
        }
        else {
            // copy the node after must to the children of the first token
            node.children[0].children.splice(1, 0, node.children[2]);
            // remove the node after must
            node.children.splice(2, 1);
            // console.log("re-organize (else)", node);
        }
    }

    classesContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = node.getChild(i).constructor.name;
            if (nodeType.indexOf("ClassOfContext") !== -1) {
                nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                break;
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ClassOfContext") {
                this.traverseNode(nodeChildren[i]);
                this.XPath += "/";
            }

            if (nodeType === "TerminalNodeImpl") {
                this.XPath += "src:class";
            }

            if (nodeType === "ClassConditionContext" || nodeType === "ClassExpressionContext") {
                this.XPath += "[";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }
        }
    }

    interfacesContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = node.getChild(i).constructor.name;
            if (nodeType.indexOf("InterfaceOfContext") !== -1) {
                nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                break;
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "InterfaceOfContext") {
                this.traverseNode(nodeChildren[i]);
                this.XPath += "/";
            }

            if (nodeType === "TerminalNodeImpl") {
                this.XPath += "src:interface";
            }

            if (nodeType === "InterfaceConditionContext" || nodeType === "InterfaceExpressionContext") {
                this.XPath += "[";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }
        }
    }

    namesContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = node.getChild(i).constructor.name;
            if (nodeType.indexOf("NameOfContext") !== -1) {
                nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                break;
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "NameOfContext") {
                this.traverseNode(nodeChildren[i]);
                this.XPath += "/";
            }

            // console.log("name", node);

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:name"; // todo: check parent or different name entities? descendant-or-self::
            }

            if (nodeType === "NameConditionContext") {
                let includes = false;
                let not = false;
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "NotContext")
                        not = true;
                    if (nodeChildren[i].getChild(j).constructor.name === "EqualsToContext")
                        this.XPath += not ? "[text()!=" : "[text()=";
                    if (nodeChildren[i].getChild(j).constructor.name === "IncludesContext") {
                        this.XPath += not ? "[not(contains(text()," : "[contains(text(),";
                        includes = true;
                    }
                    if (nodeChildren[i].getChild(j).constructor.name === "StartsWithContext") {
                        this.XPath += not ? "[not(starts-with(text()," : "[starts-with(text(),";
                        includes = true;
                    }
                    if (nodeChildren[i].getChild(j).constructor.name === "IncludesContext") {
                        this.XPath += not ? "[not(ends-with(text()," : "[ends-with(text(),";
                        includes = true;
                    }
                    let tempText = "";
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext") {
                        for (let k = 0; k < nodeChildren[i].getChild(j).children.length; k++)
                            tempText += nodeChildren[i].getChild(j).getChild(k).getSymbol().text;
                        this.XPath += tempText;
                    }
                }
                this.XPath += !includes ? "]" : not ? "))]" : ")]";
            }
        }
    }

    annotationsContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = node.getChild(i).constructor.name;
            if (nodeType.indexOf("AnnotationOfContext") !== -1) {
                nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                break;
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "AnnotationOfContext") {
                this.traverseNode(nodeChildren[i]);
                this.XPath += "/";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:annotation";
            }

            if (nodeType === "AnnotationConditionContext") {
                let not = false;
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "NotContext")
                        not = true;
                    if (nodeChildren[i].getChild(j).constructor.name === "CombinatorialWordsContext") {
                        tempText = this.combinatorialWordsContextTraversal(nodeChildren[i].getChild(j));
                        this.sendTextDataToSrcML(tempText);
                    }
                }
                this.XPath += not ? ("[not('" + tempText + "')]") : "['" + tempText + "']";
            }
        }
    }

    extensionsContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = node.getChild(i).constructor.name;
            if (nodeType.indexOf("ExtensionOfContext") !== -1) {
                nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                break;
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ExtensionOfContext") {
                this.traverseNode(nodeChildren[i]);
                this.XPath += "/";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:super/src:extends";
            }

            if (nodeType === "ExtensionConditionContext") {
                this.XPath += "[src:name/text()";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "NotContext")
                        this.XPath += "!";
                    if (nodeChildren[i].getChild(j).constructor.name === "EqualsToContext")
                        this.XPath += "=";
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext")
                        for (let k = 0; k < nodeChildren[i].getChild(j).children.length; k++)
                            this.XPath += nodeChildren[i].getChild(j).getChild(k).getSymbol().text;
                }
                this.XPath += "]";
            }
        }
    }

    implementationsContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = node.getChild(i).constructor.name;
            if (nodeType.indexOf("ImplementationOfContext") !== -1) {
                nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                break;
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ImplementationOfContext") {
                this.traverseNode(nodeChildren[i]);
                this.XPath += "/";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:super/src:implements";
            }

            if (nodeType === "ImplementationConditionContext") {
                this.XPath += "[src:name/text()";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "NotContext")
                        this.XPath += "!";
                    if (nodeChildren[i].getChild(j).constructor.name === "EqualsToContext")
                        this.XPath += "=";
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext")
                        for (let k = 0; k < nodeChildren[i].getChild(j).children.length; k++)
                            this.XPath += nodeChildren[i].getChild(j).getChild(k).getSymbol().text;
                }
                this.XPath += "]";
            }
        }
    }

    /**
     * @param node
     * @param kindOfFunction -> Function, AbstractFunction, Constructor
     * @param xPathTag -> function, function_decl, constructor
     */
    allFunctionsContextTraversal(node, kindOfFunction, xPathTag) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = node.getChild(i).constructor.name;
            if (nodeType.indexOf(kindOfFunction + "OfContext") !== -1) {
                nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                break;
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === kindOfFunction + "OfContext") {
                this.traverseNode(nodeChildren[i]);
                this.XPath += "/"; // /src:block/ // there is "function of class" only
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:block/src:" + xPathTag;
            }

            if (nodeType === kindOfFunction + "ConditionContext" || nodeType === kindOfFunction + "ExpressionContext") {
                this.XPath += "[";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }
        }
    }

    parametersContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = node.getChild(i).constructor.name;
            if (nodeType.indexOf("ParameterOfContext") !== -1) {
                nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                break;
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ParameterOfContext") {
                this.traverseNode(nodeChildren[i]);
                this.XPath += "/";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:parameter_list/src:parameter/src:decl";
            }

            if (nodeType === "ParameterConditionContext") {
                let not = false;
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "NotContext")
                        not = true;
                    if (nodeChildren[i].getChild(j).constructor.name === "CombinatorialWordsContext") {
                        tempText = this.combinatorialWordsContextTraversal(nodeChildren[i].getChild(j));
                        this.sendTextDataToSrcML(tempText);
                    }
                }
                this.XPath += not ? ("[not('" + tempText + "')]") : "['" + tempText + "']";
            }
        }
    }

    typesContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = node.getChild(i).constructor.name;
            if (nodeType.indexOf("TypeOfContext") !== -1) {
                nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                break;
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "TypeOfContext") {
                this.traverseNode(nodeChildren[i]);
                this.XPath += "/";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:type";
            }

            if (nodeType === "TypeConditionContext") { // not existed yet
                this.XPath += "[src:name/text()";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "NotContext")
                        this.XPath += "!";
                    if (nodeChildren[i].getChild(j).constructor.name === "EqualsToContext")
                        this.XPath += "=";
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext")
                        for (let k = 0; k < nodeChildren[i].getChild(j).children.length; k++)
                            this.XPath += nodeChildren[i].getChild(j).getChild(k).getSymbol().text;
                }
                this.XPath += "]";
            }
        }
    }

    specifiersContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = node.getChild(i).constructor.name;
            if (nodeType.indexOf("SpecifierOfContext") !== -1) {
                nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                break;
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "SpecifierOfContext") {
                this.traverseNode(nodeChildren[i]);
                this.XPath += "/";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:specifier";
            }

            if (nodeType === "SpecifierConditionContext") {
                this.XPath += "[text()";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "NotContext")
                        this.XPath += "!";
                    if (nodeChildren[i].getChild(j).constructor.name === "EqualsToContext")
                        this.XPath += "=";
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext")
                        for (let k = 0; k < nodeChildren[i].getChild(j).children.length; k++)
                            this.XPath += nodeChildren[i].getChild(j).getChild(k).getSymbol().text;
                }
                this.XPath += "]";
            }
        }
    }

    returnValuesContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = node.getChild(i).constructor.name;
            if (nodeType.indexOf("ReturnValueOfContext") !== -1) {
                nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                break;
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ReturnValueOfContext") {
                this.traverseNode(nodeChildren[i]);
                this.XPath += "/";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:block/descendant-or-self::src:return/src:expr";
            }

            if (nodeType === "ReturnValueConditionContext") {
                let not = false;
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "NotContext")
                        not = true;
                    if (nodeChildren[i].getChild(j).constructor.name === "CombinatorialWordsContext") {
                        tempText = this.combinatorialWordsContextTraversal(nodeChildren[i].getChild(j));
                        this.sendTextDataToSrcML(tempText);
                    }
                }
                this.XPath += not ? ("[not('" + tempText + "')]") : "['" + tempText + "']";
            }
        }
    }

    declarationStatementsContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = node.getChild(i).constructor.name;
            if (nodeType.indexOf("DeclarationStatementOfContext") !== -1) {
                nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                break;
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "DeclarationStatementOfContext") {
                this.traverseNode(nodeChildren[i]);
                this.XPath += "/src:block/descendant-or-self::";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:decl_stmt/src:decl";
            }

            if (nodeType === "DeclarationStatementConditionContext" || nodeType === "DeclarationStatementExpressionContext") {
                this.XPath += "[";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }
        }
    }

    expressionStatementsContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = node.getChild(i).constructor.name;
            if (nodeType.indexOf("ExpressionStatementOfContext") !== -1) {
                nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                break;
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ExpressionStatementOfContext") {
                this.traverseNode(nodeChildren[i]);
                this.XPath += "/";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:block/descendant-or-self::src:expr_stmt/src:expr";
            }

            if (nodeType === "ExpressionStatementConditionContext") {
                let not = false;
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "NotContext")
                        not = true;
                    if (nodeChildren[i].getChild(j).constructor.name === "CombinatorialWordsContext") {
                        tempText = this.combinatorialWordsContextTraversal(nodeChildren[i].getChild(j));
                        this.sendTextDataToSrcML(tempText);
                    }
                }
                this.XPath += not ? ("[not('" + tempText + "')]") : "['" + tempText + "']";
            }
        }
    }

    initialValuesContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = node.getChild(i).constructor.name;
            if (nodeType.indexOf("InitialValueOfContext") !== -1) {
                nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                break;
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "InitialValueOfContext") {
                this.traverseNode(nodeChildren[i]);
                this.XPath += "/";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:init/src:expr";
            }

            if (nodeType === "InitialValueConditionContext") {
                let not = false;
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "NotContext")
                        not = true;
                    if (nodeChildren[i].getChild(j).constructor.name === "CombinatorialWordsContext") {
                        tempText = this.combinatorialWordsContextTraversal(nodeChildren[i].getChild(j));
                        this.sendTextDataToSrcML(tempText);
                    }
                }
                this.XPath += not ? ("[not('" + tempText + "')]") : "['" + tempText + "']";
            }
        }
    }

    /**
     * traverse CombinatorialWords node to extract the word
     * It doesn't alter this.XPath
     * @param node
     * @returns {string}
     */
    combinatorialWordsContextTraversal(node){
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

    /**
     * send text data to the server to be processed by srcml
     * and return XML
     * @param text
     */
    sendTextDataToSrcML(text) {
        if (text === "") return;
        // todo process text for predefined literals like '?'

        // one message is sent
        this.numberOfWaitingMessages += 1;
        console.log(this.numberOfWaitingMessages, " <- numberOfWaitingMessages (send)");
        Utilities.sendToServer(this.ws, "EXPR_STMT", text);
    }

    /**
     * check validity of an xml and generate the xpath query
     * @param text
     * @returns {{text: string, xpathResult: string}} text is the original text and xpathResult the the xpath
     * derived from the originalText
     */
    traverseXml(text) {

        let exprValidation = "//src:unit[count(src:expr_stmt)=1]/src:expr_stmt/src:expr";
        let parser = new DOMParser();

        function nsResolver(prefix) {
            let ns = {'src': 'http://www.srcML.org/srcML/src'};
            return ns[prefix] || null;
        }

        // checks validity of the XML
        let xml = parser.parseFromString(text, "text/xml");
        if (!xml.evaluate) {
            console.log("error in xml.evaluate");
            return {text: "", xpathResult: ""};
        }


        let validNodes = xml.evaluate(exprValidation, xml, nsResolver, XPathResult.ANY_TYPE, null);
        let resultValidNode = validNodes.iterateNext(); // expr_stmt/expr
        if (!resultValidNode) {
            console.log("error");
            return {text: "", xpathResult: ""};
        }

        // result xpath: 'src:expr[....]' where 'src:expr[' and the final ']' is extra.
        let textAndXpath = this.traverseChildren(resultValidNode);
        textAndXpath.xpathResult = textAndXpath.xpathResult.substring(9,textAndXpath.xpathResult.length-1);
        return textAndXpath;
    }

    /**
     * traverse the state_children of a parent node to generate xpath query conditions
     * @param parentNode
     * @returns {{text: string, xpathResult: string}}
     */
    traverseChildren(parentNode) {
        let originalText = "";
        let res = [];
        let children = parentNode.childNodes;
        for (let i = 0; i < children.length; i++) {

            if (children[i].nodeName === "#text") {
                originalText += children[i].nodeValue;
                if (children.length === 1)
                    res.push("text()=\"" + children[i].nodeValue + "\"");
            }
            else {
                let textAndXpath = this.traverseChildren(children[i]);
                originalText += textAndXpath.originalText;
                res.push(textAndXpath.xpathResult);
            }
        }
        return {
            originalText: originalText,
            xpathResult: "src:" + parentNode.nodeName + "[" + res.join(' and ') + "]"
        };
    }

}

export default GenerateXpath;