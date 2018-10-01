import {TerminalNodeImpl} from "antlr4/tree/Tree";
import Utilities from "../../core/utilities";

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

                case "NamesContext":
                    this.namesContextTraversal(node);
                    break;

                case "AnnotationsContext":
                    this.annotationsContextTraversal(node);
                    break;

                case "ExtensionsContext":
                    this.extensionsContextTraversal(node);
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

                case "InitValuesContext":
                    this.initValuesContextTraversal(node);
                    break;

                case "ArgumentsContext":
                    this.argumentsContextTraversal(node);
                    break;

                case "CallsContext":
                    this.callsContextTraversal(node);
                    break;

                case "CallersContext":
                    this.callersContextTraversal(node);
                    break;

                case "ValuesContext":
                    // todo
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

            let oldCondition = node.children[0].children[1].children[3];
            let clonedNode = Object.assign( Object.create( Object.getPrototypeOf(oldCondition)), oldCondition);
            node.children[0].children[1].children[3].children = [
                new TerminalNodeImpl({text: "(("}),
                clonedNode,
                new TerminalNodeImpl({text: ") and ("}),
                node.children[4],
                new TerminalNodeImpl({text: "))"})
            ];
            node.children.splice(1, 4);
        }
        else {
            node.children[0].children.splice(1, 0, node.children[4]);
            node.children.splice(1, 4);
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
                if(this.XPath === "") this.XPath += "/";
                this.XPath += "src:name"; // todo: check parent or different name entities? descendant-or-self::
            }

            if (nodeType === "NameConditionContext") {
                let includes = false;
                let not = false;
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "NotContext")
                        not = true;
                    if (nodeChildren[i].getChild(j).constructor.name === "EqualsToContext")
                        this.XPath += not ? "[text()!=\"" : "[text()=\"";
                    if (nodeChildren[i].getChild(j).constructor.name === "IncludesContext") {
                        this.XPath += not ? "[not(contains(text(),\"" : "[contains(text(),\"";
                        includes = true;
                    }
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext")
                        for (let k = 0; k < nodeChildren[i].getChild(j).children.length; k++)
                            this.XPath += nodeChildren[i].getChild(j).getChild(k).getSymbol().text;
                }
                this.XPath += !includes ? "\"]" : not ? "\"))]" : "\")]";
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
                if(this.XPath === "") this.XPath += "/";
                this.XPath += "src:annotation";
            }

            if (nodeType === "AnnotationConditionContext" || nodeType === "AnnotationExpressionContext") {
                this.XPath += "[";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
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
                if(this.XPath === "") this.XPath += "/";
                this.XPath += "src:super/src:extends";
            }

            if (nodeType === "ExtensionConditionContext") {
                this.XPath += "[src:name/text()";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "NotContext")
                        this.XPath += "!";
                    if (nodeChildren[i].getChild(j).constructor.name === "EqualsToContext")
                        this.XPath += "=\"";
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext")
                        for (let k = 0; k < nodeChildren[i].getChild(j).children.length; k++)
                            this.XPath += nodeChildren[i].getChild(j).getChild(k).getSymbol().text;
                }
                this.XPath += "\"";
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
                if(this.XPath === "") this.XPath += "/";
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
                if(this.XPath === "") this.XPath += "/";
                this.XPath += "src:parameter_list/src:parameter/src:decl";
            }

            if (nodeType === "ParameterConditionContext" || nodeType === "ParameterExpressionContext") {
                this.XPath += "[";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
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
                if(this.XPath === "") this.XPath += "/";
                this.XPath += "src:type";
            }

            if (nodeType === "TypeConditionContext") { // not existed yet
                this.XPath += "[src:name/text()";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "NotContext")
                        this.XPath += "!";
                    if (nodeChildren[i].getChild(j).constructor.name === "EqualsToContext")
                        this.XPath += "=\"";
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext")
                        for (let k = 0; k < nodeChildren[i].getChild(j).children.length; k++)
                            this.XPath += nodeChildren[i].getChild(j).getChild(k).getSymbol().text;
                }
                this.XPath += "\"";
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
                if(this.XPath === "") this.XPath += "/";
                this.XPath += "src:specifier";
            }

            if (nodeType === "SpecifierConditionContext") {
                this.XPath += "[text()";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "NotContext")
                        this.XPath += "!";
                    if (nodeChildren[i].getChild(j).constructor.name === "EqualsToContext")
                        this.XPath += "=\"";
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext")
                        for (let k = 0; k < nodeChildren[i].getChild(j).children.length; k++)
                            this.XPath += nodeChildren[i].getChild(j).getChild(k).getSymbol().text;
                }
                this.XPath += "\"";
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
                if(this.XPath === "") this.XPath += "/";
                this.XPath += "src:block/descendant-or-self::src:return/src:expr";
            }

            if (nodeType === "ReturnValueConditionContext" || nodeType === "ReturnValueExpressionContext") {
                this.XPath += "[";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
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
                if(this.XPath === "") this.XPath += "/";
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
                if(this.XPath === "") this.XPath += "/";
                this.XPath += "src:block/descendant-or-self::src:expr_stmt/src:expr";
            }

            if (nodeType === "ExpressionStatementConditionContext" || nodeType === "ExpressionStatementExpressionContext") {
                this.XPath += "[";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }
        }
    }

    initValuesContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = node.getChild(i).constructor.name;
            if (nodeType.indexOf("InitValueOfContext") !== -1) {
                nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                break;
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "InitValueOfContext") {
                this.traverseNode(nodeChildren[i]);
                this.XPath += "/";
            }

            if (nodeType === "TerminalNodeImpl") {
                if(this.XPath === "") this.XPath += "/";
                this.XPath += "src:init/src:expr";
            }

            if (nodeType === "InitValueConditionContext" || nodeType === "InitExpressionContext") {
                this.XPath += "[";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }
        }
    }

    argumentsContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = node.getChild(i).constructor.name;
            if (nodeType.indexOf("ArgumentOfContext") !== -1) {
                nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                break;
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "ArgumentOfContext") {
                this.traverseNode(nodeChildren[i]);
                this.XPath += "/";
            }

            if (nodeType === "TerminalNodeImpl") {
                if(this.XPath === "") this.XPath += "/";
                this.XPath += "src:argument_list/src:argument/src:expr";
            }

            if (nodeType === "ArgumentConditionContext" || nodeType === "ArgumentExpressionContext") {
                this.XPath += "[";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }
        }
    }

    callsContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = node.getChild(i).constructor.name;
            if (nodeType.indexOf("CallOfContext") !== -1) {
                nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                break;
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "CallOfContext") {
                this.traverseNode(nodeChildren[i]);
                this.XPath += "/";
            }

            if (nodeType === "TerminalNodeImpl") {
                if(this.XPath === "") this.XPath += "/";
                this.XPath += "src:call";
            }

            if (nodeType === "CallConditionContext") {
                this.XPath += "[";
                this.traverseNode(nodeChildren[i]);
                this.XPath += "]";
            }
        }
    }

    callersContextTraversal(node) {
        let nodeChildren = node.children.slice(0);

        // move Of children to first
        for (let i = 0; i < node.children.length; i++) {
            let nodeType = node.getChild(i).constructor.name;
            if (nodeType.indexOf("CallerOfContext") !== -1) {
                nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
                break;
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            let nodeType = nodeChildren[i].constructor.name;

            // process ofContext
            if (nodeType === "CallerOfContext") {
                this.traverseNode(nodeChildren[i]);
                this.XPath += "/";
            }

            if (nodeType === "TerminalNodeImpl") {
                if(this.XPath === "") this.XPath += "/";
                this.XPath += "descendant-or-self::src:name";
            }

            if (nodeType === "CallerConditionContext" || nodeType === "CallerExpressionContext") {
                this.XPath += "[text()";
                for (let j = 0; j < nodeChildren[i].children.length; j++) {
                    if (nodeChildren[i].getChild(j).constructor.name === "NotContext")
                        this.XPath += "!";
                    if (nodeChildren[i].getChild(j).constructor.name === "EqualsToContext")
                        this.XPath += "=\"";
                    if (nodeChildren[i].getChild(j).constructor.name === "WordsContext")
                        for (let k = 0; k < nodeChildren[i].getChild(j).children.length; k++)
                            this.XPath += nodeChildren[i].getChild(j).getChild(k).getSymbol().text;
                }
                this.XPath += "\"";
                this.XPath += "]";
            }
        }
    }

    // chainCallsContextTraversal(node) {
    //     let nodeChildren = node.children.slice(0);
    //
    //     // move Of children to first
    //     for (let i = 0; i < node.children.length; i++) {
    //         let nodeType = node.getChild(i).constructor.name;
    //         if (nodeType.indexOf("ChainCallOfContext") !== -1) {
    //             nodeChildren = Utilities.arrayMove(nodeChildren, i, 0);
    //             break;
    //         }
    //     }
    //
    //     for (let i = 0; i < node.children.length; i++) {
    //         let nodeType = nodeChildren[i].constructor.name;
    //
    //         // process ofContext
    //         if (nodeType === "ChainCallOfContext") {
    //             this.traverseNode(nodeChildren[i]);
    //             this.XPath += "/";
    //         }
    //
    //         if (nodeType === "TerminalNodeImpl") {
    //             this.XPath += "";
    //         }
    //
    //         if (nodeType === "ChainCallConditionContext") {
    //             this.XPath += "[";
    //             this.traverseNode(nodeChildren[i]);
    //             this.XPath += "]";
    //         }
    //     }
    // }

}

export default GenerateXpath;