/**
 * Heavily dependant on Grammar
 */

import {TerminalNodeImpl} from "antlr4/tree/Tree";
import Utilities from "../../core/utilities";
import store from "../../reduxStore";
import {sendExpressionStatementXML} from "../../actions";

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
    }

    traverseTree() {
        this.traverseNode(this.tree);

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

                case "VisibilitiesContext":
                    this.visibilitiesContextTraversal(node);
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

                case "OfContext":
                case "WithWordContext":
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
            // clone the children of 'with' for first token
            let oldCondition = node.children[0].children[1].children[1];
            let clonedNode = Object.assign(Object.create(Object.getPrototypeOf(oldCondition)), oldCondition);
            // update the children of the first token
            node.children[0].children[1].children[1].children = [
                new TerminalNodeImpl({text: "(("}),
                clonedNode,
                new TerminalNodeImpl({text: ") and ("}),
                node.children[3],
                new TerminalNodeImpl({text: "))"})
            ];
            // remove the node after must
            node.children.splice(3, 1);
        }
        else {
            // copy the node after must to the children of the first token
            node.children[0].children.splice(1, 0, node.children[3]);
            // remove the node after must
            node.children.splice(3, 1);
            // console.log("re-organize (else)", node);
        }
    }

    classesContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // // move Of children to first
        // for (let i = 0; i < node.children.length; i++) {
        //     let nodeType = node.getChild(i).constructor.name;
        //     if (nodeType.indexOf("ClassOfContext") !== -1) {
        //         nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
        //         break;
        //     }
        // }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ClassOfContext") {
                this.XPath += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
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

        // // move Of children to first
        // for (let i = 0; i < node.children.length; i++) {
        //     let nodeType = node.getChild(i).constructor.name;
        //     if (nodeType.indexOf("InterfaceOfContext") !== -1) {
        //         nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
        //         break;
        //     }
        // }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "InterfaceOfContext") {
                this.XPath += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
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

        // // move Of children to first
        // for (let i = 0; i < node.children.length; i++) {
        //     let nodeType = node.getChild(i).constructor.name;
        //     if (nodeType.indexOf("NameOfContext") !== -1) {
        //         nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
        //         break;
        //     }
        // }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "NameOfContext") {
                this.XPath += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }

            // console.log("name", node);

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:name";
            }

            if (nodeType === "NameConditionContext") {
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext") {
                        tempText = this.wordsContextTraversal(nodeChildren[i].getChild(j));
                    }
                }
                this.XPath += "[" + tempText + "]";
            }
        }
    }

    annotationsContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // // move Of children to first
        // for (let i = 0; i < node.children.length; i++) {
        //     let nodeType = node.getChild(i).constructor.name;
        //     if (nodeType.indexOf("AnnotationOfContext") !== -1) {
        //         nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
        //         break;
        //     }
        // }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "AnnotationOfContext") {
                this.XPath += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:annotation";
            }

            if (nodeType === "AnnotationConditionContext") {
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "CombinatorialWordsContext") {
                        tempText = this.combinatorialWordsContextTraversal(nodeChildren[i].getChild(j));
                        this.sendTextDataToSrcML(tempText, "annotation");
                    }
                }
                this.XPath += "['" + tempText + "']";
            }
        }
    }

    extensionsContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // // move Of children to first
        // for (let i = 0; i < node.children.length; i++) {
        //     let nodeType = node.getChild(i).constructor.name;
        //     if (nodeType.indexOf("ExtensionOfContext") !== -1) {
        //         nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
        //         break;
        //     }
        // }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ExtensionOfContext") {
                this.XPath += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:super/src:extends";
            }

            if (nodeType === "ExtensionConditionContext") {
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext") {
                        tempText = this.wordsContextTraversal(nodeChildren[i].getChild(j));
                    }
                }
                this.XPath += "/src:name[" + tempText + "]";
            }
        }
    }

    implementationsContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // // move Of children to first
        // for (let i = 0; i < node.children.length; i++) {
        //     let nodeType = node.getChild(i).constructor.name;
        //     if (nodeType.indexOf("ImplementationOfContext") !== -1) {
        //         nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
        //         break;
        //     }
        // }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ImplementationOfContext") {
                this.XPath += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:super/src:implements";
            }

            if (nodeType === "ImplementationConditionContext") {
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext") {
                        tempText = this.wordsContextTraversal(nodeChildren[i].getChild(j));
                    }
                }
                this.XPath += "/src:name[" + tempText + "]";
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

        // // move Of children to first
        // for (let i = 0; i < node.children.length; i++) {
        //     let nodeType = node.getChild(i).constructor.name;
        //     if (nodeType.indexOf(kindOfFunction + "OfContext") !== -1) {
        //         nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
        //         break;
        //     }
        // }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === kindOfFunction + "OfContext") {
                this.XPath += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]"; // /src:block/ // there is "function of class" only
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

        // // move Of children to first
        // for (let i = 0; i < node.children.length; i++) {
        //     let nodeType = node.getChild(i).constructor.name;
        //     if (nodeType.indexOf("ParameterOfContext") !== -1) {
        //         nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
        //         break;
        //     }
        // }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ParameterOfContext") {
                this.XPath += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:parameter_list/src:parameter/src:decl";
            }

            if (nodeType === "ParameterConditionContext") {
                this.XPath += "[";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }
        }
    }

    typesContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // // move Of children to first
        // for (let i = 0; i < node.children.length; i++) {
        //     let nodeType = node.getChild(i).constructor.name;
        //     if (nodeType.indexOf("TypeOfContext") !== -1) {
        //         nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
        //         break;
        //     }
        // }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "TypeOfContext") {
                this.XPath += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:type";
            }

            if (nodeType === "TypeConditionContext") {
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "CombinatorialWordsContext") {
                        tempText = "[" + this.combinatorialWordsContextTraversal(nodeChildren[i].getChild(j)) + "]";
                        this.sendTextDataToSrcML(tempText, "type");
                    }
                    else if (nodeChildren[i].getChild(j).constructor.name === "WordsContext") {
                        tempText = "/src:name[" + this.wordsContextTraversal(nodeChildren[i].getChild(j)) + "]";
                    }
                }
                this.XPath += tempText;
            }
        }
    }

    specifiersContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // // move Of children to first
        // for (let i = 0; i < node.children.length; i++) {
        //     let nodeType = node.getChild(i).constructor.name;
        //     if (nodeType.indexOf("SpecifierOfContext") !== -1) {
        //         nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
        //         break;
        //     }
        // }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "SpecifierOfContext") {
                this.XPath += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:specifier";
            }

            if (nodeType === "SpecifierConditionContext") {
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext") {
                        tempText = this.wordsContextTraversal(nodeChildren[i].getChild(j));
                    }
                }
                this.XPath += "[" + tempText + "]";
            }
        }
    }

    visibilitiesContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // // move Of children to first
        // for (let i = 0; i < node.children.length; i++) {
        //     let nodeType = node.getChild(i).constructor.name;
        //     if (nodeType.indexOf("VisibilityOfContext") !== -1) {
        //         nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
        //         break;
        //     }
        // }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "SpecifierOfContext") {
                this.XPath += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:specifier";
            }

            if (nodeType === "VisibilityConditionContext") {
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext") {
                        tempText = this.wordsContextTraversal(nodeChildren[i].getChild(j));
                    }
                }
                this.XPath += "[" + tempText + "]";
            }
        }
    }

    returnValuesContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // // move Of children to first
        // for (let i = 0; i < node.children.length; i++) {
        //     let nodeType = node.getChild(i).constructor.name;
        //     if (nodeType.indexOf("ReturnValueOfContext") !== -1) {
        //         nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
        //         break;
        //     }
        // }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ReturnValueOfContext") {
                this.XPath += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:block/descendant-or-self::src:return/src:expr";
            }

            if (nodeType === "ReturnValueConditionContext") {
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "CombinatorialWordsContext") {
                        tempText = this.combinatorialWordsContextTraversal(nodeChildren[i].getChild(j));
                        this.sendTextDataToSrcML(tempText, "returnValue");
                    }
                }
                this.XPath += "['" + tempText + "']";
            }
        }
    }

    declarationStatementsContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        // for (let i = 0; i < node.children.length; i++) {
        //     let nodeType = node.getChild(i).constructor.name;
        //     if (nodeType.indexOf("DeclarationStatementOfContext") !== -1) {
        //         nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
        //         break;
        //     }
        // }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "DeclarationStatementOfContext") {
                this.XPath += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "descendant-or-self::src:decl_stmt/src:decl";
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

        // // move Of children to first
        // for (let i = 0; i < node.children.length; i++) {
        //     let nodeType = node.getChild(i).constructor.name;
        //     if (nodeType.indexOf("ExpressionStatementOfContext") !== -1) {
        //         nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
        //         break;
        //     }
        // }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ExpressionStatementOfContext") {
                this.XPath += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "descendant-or-self::src:expr_stmt/src:expr";
            }

            if (nodeType === "ExpressionStatementConditionContext") {
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "CombinatorialWordsContext") {
                        tempText = this.combinatorialWordsContextTraversal(nodeChildren[i].getChild(j));
                        this.sendTextDataToSrcML(tempText, "expressionStatement");
                    }
                }
                this.XPath += "['" + tempText + "']";
            }
        }
    }

    initialValuesContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // // move Of children to first
        // for (let i = 0; i < node.children.length; i++) {
        //     let nodeType = node.getChild(i).constructor.name;
        //     if (nodeType.indexOf("InitialValueOfContext") !== -1) {
        //         nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
        //         break;
        //     }
        // }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "InitialValueOfContext") {
                this.XPath += "[ancestor-or-self::";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }

            if (nodeType === "TerminalNodeImpl") {
                if (this.XPath === "") this.XPath += "/";
                this.XPath += "src:init/src:expr";
            }

            if (nodeType === "InitialValueConditionContext") {
                let tempText = "";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "CombinatorialWordsContext") {
                        tempText = this.combinatorialWordsContextTraversal(nodeChildren[i].getChild(j));
                        this.sendTextDataToSrcML(tempText, "initialValue");
                    }
                }
                this.XPath += "['" + tempText + "']";
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


    /**
     * traverse Words node to extract the word
     * It doesn't alter this.XPath
     * name/extension/implementation/specifier/visibility
     * @param node
     * @returns {string}
     */
    mmwordsContextTraversal(node) {
        let word = "";
        let not = false;
        let status = "equal";
        // words has at least 3 children
        if (node.children[1].getSymbol().text === "!") not = true;
        else if ((node.children[1].getSymbol().text === "!..." || node.children[1].getSymbol().text === "...")
            && node.children[node.children.length - 2].getSymbol().text === "...") {
            not = node.children[1].getSymbol().text.startsWith("!");
            status = "contains";
        }
        else if (node.children[1].getSymbol().text === "!..." || node.children[1].getSymbol().text === "...") {
            not = node.children[1].getSymbol().text.startsWith("!");
            status = "ends-with";
        }
        else if (node.children[node.children.length - 2].getSymbol().text === "...") {
            status = "starts-with";
        }


        for (let i = 0; i < node.children.length; i++) {
            if (i !== 1 && i !== node.children.length - 2)
                word += node.getChild(i).getSymbol().text;
            else if (["...", "!...", "!"].indexOf(node.getChild(i).getSymbol().text) === -1)
                word += node.getChild(i).getSymbol().text;
        }

        if (status === "equal") return not ? "not(text()=" + word + ")" : "text()=" + word;
        if (status === "contains") return not ? "not(contains(text()," + word + "))" : "contains(text()," + word + ")";
        if (status === "starts-with") return not ? "not(starts-with(text()," + word + "))" : "starts-with(text()," + word + ")";

        // ends-with(@id,'register') <== not valid
        // substring(@id, string-length(@id) - string-length('register') +1) = 'register'

        if (status === "ends-with") {
            let query = "substring(text(), string-length(text()) - string-length(" + word + ") + 1) = " + word;
            return not ? "not(" + query + ")" : query;
        }
        return "text()=" + word;
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
     */
    sendTextDataToSrcML(text, elementType) {
        if (text === "") return;
        let code = text;
        let query = "";
        let messageID = Math.floor(new Date().getTime() / 1000); // to match send and receive messages

        switch (elementType) {
            case "annotation":
                code = "@" + text;
                query = "//src:unit[count(src:annotation)=1]/src:annotation";
                break;
            case "type":
                code = text + " dummy_variable = 0;";
                query = "//src:unit[count(src:decl_stmt)=1]/src:decl_stmt/src:type";
                break;
            case "returnValue":
            case "expressionStatement":
            case "initialValue":
            default:
                code = text;
                query = "//src:unit[count(src:expr_stmt)=1]/src:expr_stmt/src:expr";
                break;

        }

        Utilities.sendToServer(this.ws, "EXPR_STMT", {"codeText": code, "messageID": messageID});
        store.dispatch(sendExpressionStatementXML({
            "codeText": code,
            "messageID": messageID,
            "lookFor": "'" + text + "'",
            "query": query
        }));
    }
}

export default GenerateXpath;