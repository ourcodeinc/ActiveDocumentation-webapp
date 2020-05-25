/**
 * Heavily dependant on Grammar, mainly keywords with, of, etc.
 */


import React, {Component} from "react";
import posTagger from "wink-pos-tagger";
import * as monaco from "monaco-editor";
import * as diff from "diff";

import {
    documentations_IMarkdownString,
    error_messages_IMarkdownString,
    autoComplete_suggestion,
    grammar_connectors,
    grammar_keywords,
    sample_phrases,
    sample_phrase_hash
} from "./textualEditorConstant";
import {LANGUAGE_FORMAT, LANGUAGE_THEME, EDITOR_OPTION} from "./monacoEditorConfig";

class TextualEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // for styling
            focusStatus: "", // "focused" : ""
            formStatus: props.hasOwnProperty("formStatus") ? props.formStatus : "has-error", // "has-error" : "has-success"
        };

        this.autoCompleteArray = props["autoCompleteArray"];
        this.autoCompleteArrayHover = props["autoCompleteArray"];

        this.decorations = [];

        if (!props.onBlur) console.error(`'onBlur' is a required function in props`);
    }

    render() {
        return (
            <div className={"overlayContainer ruleGeneratorTextContainer"}
                 onMouseEnter={() => this.overlayDiv.style.display = "none"}
                 onMouseLeave={(e) => {
                     e.stopPropagation();
                     this.overlayDiv.style.display = this.state.focusStatus === "focused" || this.autoCompleteArray.length !== 0 ? "none" : "block";
                 }}
            >
                <div className={"monacoWrapper " + this.state.formStatus + " " + this.state.focusStatus}>
                    <div ref={(node) => this.monacoEditorContainer = node} style={{height: "100px"}}/>
                </div>
                {this.renderOverlayDiv()}
            </div>
        );
    }

    //componentDidUpdate doesn't work
    UNSAFE_componentWillReceiveProps(nextProps) {
        let changedArray = false;
        if (this.autoCompleteArray.length !== nextProps.autoCompleteArray.length) changedArray = true;
        else this.autoCompleteArray.forEach((a, i) => {
            if (a.id !== nextProps.autoCompleteArray[i].id || a.text !== nextProps.autoCompleteArray[i].text) changedArray = true
        });

        if (nextProps.hasOwnProperty("autoCompleteArray") && changedArray) {
            this.autoCompleteArray = nextProps["autoCompleteArray"];
            this.autoCompleteArrayHover = nextProps["autoCompleteArray"];
            this.editor.setValue(this.autoCompleteArray.map(a => a.text).join(" "));
            this.props.onUpdate(this.editor.getModel().getValue().trim());
        }
        if (nextProps.hasOwnProperty("formStatus") && this.state.formStatus !== nextProps.formStatus)
            this.setState({formStatus: nextProps.formStatus});

        if (nextProps.hasOwnProperty("errorPoint")) {
            if (nextProps.errorPoint !== -1) {
                // startLineNumber, startColumn, endLineNumber, endColumn
                let fullRange = this.editor.getModel().getFullModelRange();
                this.decorations = this.editor.deltaDecorations(this.decorations, [
                    {
                        range: new monaco.Range(1, nextProps.errorPoint, 1, fullRange.endColumn),
                        options: {inlineClassName: "text-has-error"}
                    }
                ]);
            }
            else
                this.decorations = this.editor.deltaDecorations(this.decorations, [{
                    range: new monaco.Range(1, 1, 1, 1),
                    options: {}
                }]);
        }
    }


    /**
     * before un-mounting dispose unwanted registration
     */
    componentWillUnmount() {
        this.hoverProvider.dispose();
        this.completionProvider.dispose()
    }

    /**
     * For configuring monaco editor
     */
    componentDidMount() {
        window.addEventListener("resize", () => this.editor.layout());

        monaco.languages.register({id: "mySpecialLanguage"});
        monaco.languages.setMonarchTokensProvider("mySpecialLanguage", LANGUAGE_FORMAT);
        monaco.editor.defineTheme("draco-light", LANGUAGE_THEME);

        this.editor = monaco.editor.create(this.monacoEditorContainer, {
            value: this.autoCompleteArray.map(a => a.text).join(" "),
            language: "mySpecialLanguage",
            ...EDITOR_OPTION
        });

        // on hover information
        this.hoverProvider = monaco.languages.registerHoverProvider("mySpecialLanguage", {
            provideHover: (model, position, token) => {
                let range = new monaco.Range(1, 1, position.lineNumber, position.column);
                let arrayIndex = model.getValueInRange(range).split(" ").length - 1;
                let doc = {value: ""};
                if (this.autoCompleteArrayHover.length > arrayIndex) {
                    if (this.autoCompleteArrayHover[arrayIndex].id) {
                        let els = document.getElementsByClassName("hoveredAutoComplete");
                        for (let i = 0; i < els.length; i++) els[i].classList.remove("hoveredAutoComplete");

                        let hoveredElementNode = document.getElementById("id__" + this.props.ruleIndex + "__" + this.autoCompleteArrayHover[arrayIndex].id);
                        if (hoveredElementNode) {
                            hoveredElementNode.classList.add("hoveredAutoComplete");
                            setTimeout(() => hoveredElementNode.classList.remove("hoveredAutoComplete"), 1200);
                        }
                    }

                    let thisWord = this.autoCompleteArrayHover[arrayIndex].text;
                    if (Object.keys(documentations_IMarkdownString).indexOf(thisWord) !== -1)
                        doc = documentations_IMarkdownString[thisWord];

                    if (arrayIndex < this.autoCompleteArrayHover.length - 1) {
                        let xWord = thisWord + " " + this.autoCompleteArrayHover[arrayIndex + 1].text;
                        if (Object.keys(documentations_IMarkdownString).indexOf(xWord) !== -1)
                            doc = documentations_IMarkdownString[xWord];
                    }
                    if (arrayIndex > 0) {
                        let xWord = this.autoCompleteArrayHover[arrayIndex - 1].text + " " + thisWord;
                        if (Object.keys(documentations_IMarkdownString).indexOf(xWord) !== -1)
                            doc = documentations_IMarkdownString[xWord];
                    }

                    if (thisWord === "with") doc = documentations_IMarkdownString["WITH"];
                    if (thisWord === "of") doc = documentations_IMarkdownString["OF"];
                    if (thisWord === "and" || thisWord === "or" || thisWord === "(" || thisWord === ")")
                        doc = documentations_IMarkdownString["AND_OR_PAREN"];
                    if (thisWord === "must" || thisWord === "have") doc = documentations_IMarkdownString["MUST_HAVE"];
                    if (thisWord.startsWith("\"")) doc = documentations_IMarkdownString["QUOTES"];
                }
                return {contents: [doc]}
            }
        });

        // auto complete suggestions
        this.completionProvider = monaco.languages.registerCompletionItemProvider("mySpecialLanguage", {
            triggerCharacters: [" "].concat("abcdefghijklmnopqrstuvwxyz".split("")), // if removed the suggestions won't be updated for the first word
            provideCompletionItems: (model, position, context, token) => {
                let resultSuggestion = [];

                this.grammarSuggestion(model.getValue(), position.column - 1).forEach(item => {
                    let CompletionItem = {
                        label: item.label,
                        documentation: item.documentation,
                        insertText: item.insertText + " ",
                        kind: monaco.languages.CompletionItemKind[item.kind === "suggestion" ? "Customcolor" : "Event"],
                        command: {id: "editor.action.triggerSuggest", title: 123}
                        // detail: item.detail
                    };
                    if (!item.documentation) delete CompletionItem.documentation;
                    resultSuggestion.push(CompletionItem);
                });

                // underline the last word if there is an error
                if (model.getValue().trim() !== "" && resultSuggestion.length === 1 && resultSuggestion[0].label === "Error") {
                    // get the latest word and its index
                    let wordsArray = model.getValue().split(" ");
                    let index;
                    for (index = wordsArray.length - 1; index >= 0; index--)
                        if (wordsArray[index] !== "") break;
                    let startCol = position.column - (wordsArray[index].length + (wordsArray.length - index - 1));
                    this.decorations = this.editor.deltaDecorations(this.decorations, [
                        {
                            range: new monaco.Range(position.lineNumber, startCol, position.lineNumber, position.column),
                            options: {inlineClassName: "text-has-error"}
                        }
                    ]);
                }
                else {
                    this.decorations = this.editor.deltaDecorations(this.decorations, [{
                        range: new monaco.Range(1, 1, 1, 1),
                        options: {}
                    }]);
                    return {
                        isIncomplete: true,
                        suggestions: resultSuggestion
                    };
                }
            }
        });

        // on editor focus, used for styling and suggestion display
        this.editor.onDidFocusEditorText(() => {
            this.setState({focusStatus: "focused"});
            // always display suggestion widget
            this.editor.trigger("anything", "editor.action.triggerSuggest");
        });

        this.editor.onDidBlurEditorText(() => {
            this.setState({
                focusStatus: "",
                formStatus: this.editor.getModel().getValue() === "" ? "has-error" : this.state.formStatus
            });

            if (this.autoCompleteArray.map(d => d.text).join(" ") !== this.editor.getModel().getValue())
                this.props.onBlur(this.editor.getModel().getValue().trim());
        });

        this.editor.onKeyDown((e) => {
            this.setState({formStatus: "has-warning"});
            this.props.onError(-1); // close error alert
        });

        // on changed text
        this.editor.onDidChangeModelContent((e) => {
            // calculate the diff
            let wordDiffs =
                diff.diffWords(this.autoCompleteArray.map(d => d.text).join(" ").replace(/"/g, "") // quotations are considered as a word
                    , this.editor.getModel().getValue().replace(/"/g, ""));

            let newAutoCompleteArray = [];
            let arrayIndex = 0;
            wordDiffs.forEach(d => {
                if (!d.removed && !d.added)
                    newAutoCompleteArray = newAutoCompleteArray.concat(this.autoCompleteArray.slice(arrayIndex, arrayIndex + d.value.trim().split(" ").length));
                else if (d.added)
                    newAutoCompleteArray = newAutoCompleteArray.concat(d.value.trim().split(" ").map(a => {
                        return {text: a, id: ""}
                    }));
                if (!d.added)
                    arrayIndex += d.value.split(" ").length;
            });
            this.autoCompleteArrayHover = newAutoCompleteArray;
        });
    }


    /**
     * The editor cannot have placeholder, instead the overlaying div is used.
     * The overlaying div will be displayed when the editor is empty.
     * @returns {XML}
     */
    renderOverlayDiv() {
        return (
            <div ref={node => this.overlayDiv = node}
                 className={"overlay designRuleOverlay"}
                 style={{display: this.state.focusStatus === "focused" || this.autoCompleteArray.length !== 0 ? "none" : "block"}}>
                <div className={"messageDivContainer"}>
                    <div className={"messageDiv"}>
                        <strong>Design Rule.</strong>
                    </div>
                </div>
            </div>
        )
    }

    /**
     *
     * @param myText full text
     * @param selectionEnd based on state.selectionEnd
     * @returns {Array} array of objects: suggestion: "", info:"", type: "suggestion" or "error"
     */
    grammarSuggestion(myText, selectionEnd) {
        try {
            return this.grammarSuggestion_try_catch(myText, selectionEnd);
        }
        catch (e) {
            console.log("error in 'grammarSuggestion' function :");
            console.log(e);
            return [];
        }
    }

    /**
     *
     * @param myText full text
     * @param selectionEnd based on state.selectionEnd
     * @returns {Array} array of objects: suggestion: "", info:"", type: "suggestion" or "error"
     */
    grammarSuggestion_try_catch(myText, selectionEnd) {

        /**
         * lemmatize the words in the input string
         * @param input
         * @returns String
         */
        const lemmatizeWords = (input) => {
            let tagger = posTagger();
            let pos = tagger.tagSentence(input);
            let lemmatized = [];
            pos.forEach(node => {
                if (node.pos !== "DT") {
                    if (node.tag === "quoted_phrase" || !node.lemma)
                        lemmatized.push(node.value);
                    else
                        lemmatized.push(node.lemma);
                }
            });

            let stringReplaceAll = (string, search, replacement) => {
                return string.replace(new RegExp(search, "g"), replacement);
            };

            let str = lemmatized.join(" ");
            str = stringReplaceAll(str, "''", "");
            str = stringReplaceAll(str, "`` ", "");
            return str;
        };

        /**
         * find all names in the phrase
         * used for suggesting ofExpressions
         * @param input
         */
        const findNounsInInput = (input) => {
            let tagger = posTagger();
            let pos = tagger.tagSentence(input);
            let nouns = [];

            // find nouns outside of paired parenthesis
            let unresolvedCloseParen = 0;
            for (let i = pos.length - 1; i > -1; i--) {
                if (pos[i].value === ")")
                    unresolvedCloseParen++;
                else if (pos[i].value === "(") {
                    if (unresolvedCloseParen > 0)
                        unresolvedCloseParen--;
                }
                else if ((pos[i].pos === "NN" || pos[i].pos === "NNS") && unresolvedCloseParen === 0) {
                    nouns.push(!pos[i].lemma ? pos[i].value : pos[i].lemma);
                    if (i > 0 && pos[i].lemma && pos[i - 1].lemma) {
                        if (pos[i - 1].lemma === "abstract" && pos[i].lemma === "function") nouns.push("abstract function");
                        if (pos[i - 1].lemma === "return" && pos[i].lemma === "value") nouns.push("return value");
                        if (pos[i - 1].lemma === "declaration" && pos[i].lemma === "statement") nouns.push("declaration statement");
                        if (pos[i - 1].lemma === "expression" && pos[i].lemma === "statement") nouns.push("expression statement");
                        if (pos[i - 1].lemma === "initial" && pos[i].lemma === "value") nouns.push("initial value");
                    }
                }
            }
            return nouns;
        };

        /**
         * @param input array of words and letters including "(" and ")"
         * @returns number index of "(" for ")" -2: error; -1: not found
         */
        const findCorrespondingOpenParenIndex = (input) => {
            let unresolvedCloseParen = 0;
            for (let i = input.length - 1; i > -1; i--) {
                if (input[i] === ")")
                    unresolvedCloseParen++;
                else if (input[i] === "(") {
                    if (unresolvedCloseParen === 0) return -2;
                    else if (unresolvedCloseParen === 1) return i;
                    else unresolvedCloseParen--;
                }
            }
            return -1;
        };

        /**
         * @param input array of words and letters including "(" and ")"
         * @returns number index of "(" for ")" -2: error; -1: not found
         */
        const findUnResolvedParenthesis = (input) => {
            let unresolvedCloseParen = 0;
            for (let i = 0; i < input.length; i++) {
                if (input[i] === "(")
                    unresolvedCloseParen++;
                else if (input[i] === ")")
                    unresolvedCloseParen--;
            }
            return unresolvedCloseParen;
        };

        /**
         * remove contents of paired parenthesis
         * @param input array of strings
         * @returns Array of words, removed contents of paired parenthesis
         */
        const removePairedParenthesis = (input) => {
            let openParenthesisIndices = [];
            let shouldRemove = new Array(input.length).fill(false);

            for (let i = 0; i < input.length; i++) {
                if (input[i] === ")") {
                    // faulty input
                    if (openParenthesisIndices.length === 0) return input;
                    let startIndex = openParenthesisIndices.pop();
                    for (let j = startIndex + 1; j < i; j++)
                        shouldRemove[j] = true;
                }
                else if (input[i] === "(")
                    openParenthesisIndices.push(i);
            }

            return input.filter((d, i) => !shouldRemove[i]);
        };

        /**
         * creating error message
         * @param errorMessageNumber
         * @return {[]} array with a single element
         */
        const errorGenerator = (errorMessageNumber) => {
            this.setState({formStatus: "has-error"});
            this.props.onError(errorMessageNumber);
            return [{
                label: "Error",
                documentation: error_messages_IMarkdownString[errorMessageNumber],
                detail: "",
                insertText: "",
                kind: "error"
            }]
        };

        /*
         * determines if the last word is finished yet or not
         * like: function with an[notation]
         */
        if (myText === "") return [];
        let caretPosition = selectionEnd;
        let beforeCaret = caretPosition > 0 ? myText[caretPosition - 1] : null;
        let isMiddleOfWord = (beforeCaret !== " " && beforeCaret !== null);
        let text = myText.slice(0, caretPosition);
        if (text === "") return [];

        let wordsArray = [];

        /*
         * lemmatization
         * If the last word is not finished yet, it is removed from the list of words
         * because in lemmatization, 'an' and 'a' and other determiners are removed, e.g. an(notation)
         * Then it is pushed back.
         * Note that letters are transformed to lower case.
         */
        let typingWord = isMiddleOfWord ? text.split(" ").pop() : "";
        let toLemmatize = isMiddleOfWord ? text.split(" ").slice(0, text.split(" ").length - 1).join(" ") : text;
        toLemmatize.replace(/\( /g, " ( ").replace(/\) /g, " ) ");
        wordsArray = toLemmatize !== "" ? (lemmatizeWords(toLemmatize)).split(" ") : [];
        if (isMiddleOfWord) wordsArray.push(typingWord);

        // lastWord is the main part used for suggestions
        let lastWord = wordsArray[wordsArray.length - 1].toLowerCase();
        // if the lastWord is ')'
        wordsArray = removePairedParenthesis(wordsArray.slice(0, wordsArray.length - 1)).concat([lastWord]);
        let lastWordIndex = wordsArray.length - 1;

        // complete incomplete connectors as the last word
        if (isMiddleOfWord) {
            if (["wi", "wit"].includes(lastWord))
                lastWord = "with";
            else if (["ha", "hav"].includes(lastWord))
                lastWord = "have";
            else if (["mu", "mus"].includes(lastWord))
                lastWord = "must";
            else if (["eq", "equ", "equa"].includes(lastWord))
                lastWord = "equal";
            else if (["inc", "incl", "inclu", "includ"].includes(lastWord))
                lastWord = "include";
            else if (["st", "sta", "star"].includes(lastWord))
                lastWord = "start";
            else if (["en"].includes(lastWord))
                lastWord = "end";
            else if (["wi", "wit"].includes(lastWord))
                lastWord = "with";
            else if (lastWordIndex > 0 && wordsArray[lastWordIndex - 1] === "()") {
                if (["a", "an"].includes(lastWord)) lastWord = "and";
                if (lastWord === "o") lastWord = "or";
            }
        }

        // determines type of the lastWord
        let isConnectorWord = grammar_connectors.indexOf(lastWord) !== -1;
        let isKeyword = grammar_keywords.indexOf(lastWord) !== -1;
        let isWord = lastWord ? lastWord.startsWith("\"") : false;
        let isSpecialWord = false; // cannot match with the list of special words directly because of lemmatization
        if (lastWordIndex > 1) {
            let word = selectXWord(lastWordIndex - 2);
            if (word !== "" && autoComplete_suggestion[word].preWord
                && autoComplete_suggestion[word].preWord === wordsArray[lastWordIndex - 1])
                isSpecialWord = true;
        }
        let specialCase = "";
        if (lastWord === "a" || lastWord === "an" || lastWord === "o") specialCase = lastWord;

        let xWord; // must be in TextConstants.keywords
        let results = [], beforeSuggText = "", suggText = "", infoText = "";
        let lastWithIndex = wordsArray.map((w) => (w === "with") ? 1 : 0).lastIndexOf(1);
        let mustIndex = wordsArray.indexOf("must");

        // check if parenthesis are paired
        if (findUnResolvedParenthesis(wordsArray) < 0) return errorGenerator(203);

        /**
         * try to find 2-part keywords
         * @param index
         * @returns {*} keyword string
         */
        function selectXWord(index) {
            if (index < 0) return "";
            if (wordsArray.length < index + 1) return "";
            if (index > 0) {
                while (index > 0 && wordsArray[index - 1] === "(") index--;
                if (wordsArray[index - 1] === "abstract" && wordsArray[index] === "function") return "abstract function";
                if (wordsArray[index - 1] === "return" && wordsArray[index] === "value") return "return value";
                if (wordsArray[index - 1] === "declaration" && wordsArray[index] === "statement") return "declaration statement";
                if (wordsArray[index - 1] === "expression" && wordsArray[index] === "statement") return "expression statement";
                if (wordsArray[index - 1] === "initial" && wordsArray[index] === "value") return "initial value";
            }
            if (wordsArray.length > index + 2) {
                while (wordsArray.length < index + 2 && wordsArray[index] === "(") index--;
                if (wordsArray[index] === "abstract" && wordsArray[index + 1] === "function") return "abstract function";
                if (wordsArray[index] === "return" && wordsArray[index + 1] === "value") return "return value";
                if (wordsArray[index] === "declaration" && wordsArray[index + 1] === "statement") return "declaration statement";
                if (wordsArray[index] === "expression" && wordsArray[index + 1] === "statement") return "expression statement";
                if (wordsArray[index] === "initial" && wordsArray[index + 1] === "value") return "initial value";
            }
            if (grammar_keywords.indexOf(wordsArray[index]) !== -1) return wordsArray[index];
            return "";
        }

        // This block process strings in the lastWord
        if (isWord || isSpecialWord) {
            // "someWord["]
            if (!lastWord.endsWith("\"") && isWord)
                return [TextualEditor.createGrammarSuggestion(lastWord + "\"", "", "QUOTES")];
            // … [X] with name/annotation/etc. "someWord"
            xWord = selectXWord(lastWithIndex - 1);
            let space = isMiddleOfWord ? " " : "";
            results.push(TextualEditor.createGrammarSuggestion(space + "and", xWord, "AND_OR_PAREN"));
            results.push(TextualEditor.createGrammarSuggestion(space + "or", xWord, "AND_OR_PAREN"));
            results.push(TextualEditor.createGrammarSuggestion(space + "of", xWord, "OF"));

            if (findUnResolvedParenthesis(wordsArray) > 0) {
                xWord = selectXWord(lastWithIndex - 1);
                if (xWord === "") return errorGenerator(303);
                results.push(TextualEditor.createGrammarSuggestion(space + ")", xWord + " (...", "AND_OR_PAREN"));
            }
            else if (wordsArray.indexOf("must") === -1) {
                xWord = selectXWord(0);
                if (xWord === "") return errorGenerator(303);
                results.push(TextualEditor.createGrammarSuggestion(space + "must have", xWord, "MUST_HAVE"));
            }
            return results;
        }

        /*
         * If the last word is random letters and is not finished yet,
         * update the lastWord to one to the last word
        */
        if (!isConnectorWord && !isKeyword && isMiddleOfWord) lastWord = wordsArray.length >= 2 ? wordsArray[wordsArray.length - 2] : lastWord;
        if (!isConnectorWord && !isKeyword && isMiddleOfWord) lastWordIndex = wordsArray.length >= 2 ? wordsArray.length - 2 : lastWordIndex;
        let isSecondWord = lastWordIndex !== (wordsArray.length - 1);

        switch (lastWord) {
            case "with":
                // [X] with
                xWord = selectXWord(lastWordIndex - 1);
                if (xWord === "") return errorGenerator(100);

                // … [X] with (
                suggText = (!isSecondWord && isMiddleOfWord ? "with " : "") + "(";
                infoText = xWord + (!isSecondWord && isMiddleOfWord ? "" : " with");
                results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, "AND_OR_PAREN"));

                // … [X] with …
                beforeSuggText = !isSecondWord && isMiddleOfWord ? "with" : "";
                infoText = xWord + (!isSecondWord && isMiddleOfWord ? "" : " with");
                results = results.concat(this.withSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));
                break;

            case "have":
                // [X] … must have …
                if (lastWordIndex < 2) return errorGenerator(101);

                xWord = selectXWord(0);
                if (xWord === "") return errorGenerator(101);
                if (!autoComplete_suggestion[xWord].withClause) return errorGenerator(301);

                beforeSuggText = !isSecondWord && isMiddleOfWord ? "have" : "";
                infoText = xWord + " must" + (!isSecondWord && isMiddleOfWord ? "" : " have");
                results = results.concat(this.withSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));
                break;

            case "must":
                // … must …
                if (wordsArray.reduce((n, val) => n + (val === "must"), 0) > 1) return errorGenerator(102);
                xWord = selectXWord(0);
                if (xWord === "") return errorGenerator(101);

                // [X] … must have [based on X]
                beforeSuggText = (!isSecondWord && isMiddleOfWord ? "must " : "") + "have";
                infoText = xWord + (!isSecondWord && isMiddleOfWord ? "" : " must");
                results = results.concat(this.withSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));
                break;

            case "and":
            case "or":

                // [X] … must have  … and [based on X]
                if (lastWithIndex < mustIndex) {
                    xWord = selectXWord(0);
                    if (xWord === "") return errorGenerator(101);

                    if (!autoComplete_suggestion[xWord].withClause) return errorGenerator(301);

                    beforeSuggText = !isSecondWord && isMiddleOfWord ? lastWord : "";
                    infoText = xWord + " must" + (!isSecondWord && isMiddleOfWord ? "" : lastWord);
                    results = results.concat(this.withSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));

                    break;
                }

                // … [X] with  … and [based on X]
                xWord = selectXWord(lastWithIndex - 1);
                if (xWord === "") return errorGenerator(200);

                if (!autoComplete_suggestion[xWord].withClause) return errorGenerator(200);
                beforeSuggText = (isConnectorWord && isMiddleOfWord ? lastWord + " " : "");
                infoText = xWord + " with ... " + (isConnectorWord && isMiddleOfWord ? "" : lastWord);
                results = results.concat(this.withSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));

                beforeSuggText = (isConnectorWord && isMiddleOfWord ? lastWord + " " : "") + "(";
                infoText = xWord + " with ... " + (isConnectorWord && isMiddleOfWord ? "" : lastWord);
                results = results.concat(this.withSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));

                break;

            case "(":
                // [X] with (
                if (lastWordIndex < 2) return errorGenerator(202);
                // [X] must have (
                if (lastWithIndex < 3 && wordsArray.includes("must")) return errorGenerator(202);

                xWord = selectXWord(lastWithIndex - 1);
                if (xWord === "") return errorGenerator(100);

                // … <must> … [X] with ( [based on X]
                if (xWord !== "" && wordsArray.indexOf("must") < lastWithIndex) {
                    if (!autoComplete_suggestion[xWord].withClause) return errorGenerator(202);

                    beforeSuggText = "";
                    infoText = xWord + " with (";
                    results = results.concat(this.withSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));
                    break;
                }
                // [X] … must have ( … and/or ( [based on X]
                else {
                    xWord = selectXWord(0);
                    if (xWord === "") return errorGenerator(303);

                    suggText = "have";
                    infoText = xWord + " must";
                    results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, "MUST_HAVE"));

                    beforeSuggText = (isConnectorWord && isMiddleOfWord ? lastWord + " " : "") + "(";
                    infoText = xWord + " must have" + (isConnectorWord && isMiddleOfWord ? "" : " " + lastWord);
                    results = results.concat(this.withSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));

                    break;
                }
            // return errorGenerator(300);

            case ")":
                // [X] with ( )
                if (lastWordIndex < 3) return errorGenerator(201);
                // [X] must have ( )
                if (lastWithIndex < 1 && !wordsArray.includes("must")) return errorGenerator(201);

                // … [X] with ( … ) of [based on X]
                let corrOpenParanIndex = findCorrespondingOpenParenIndex(wordsArray);
                if (corrOpenParanIndex < 2) return errorGenerator(203);
                xWord = selectXWord(corrOpenParanIndex - 2);

                // [X] with (…) and/or ( …
                if (xWord !== "") {
                    suggText = "and (";
                    infoText = xWord + " with ...";
                    results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, "AND_OR_PAREN"));
                    suggText = "or (";
                    results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, "AND_OR_PAREN"));

                    // [X] with (…) of
                    suggText = "of";
                    results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, "OF"));
                }
                // [X] … must have ( )
                else if (corrOpenParanIndex > 1 && wordsArray[corrOpenParanIndex - 2] === "must") {
                    xWord = selectXWord(0);
                    if (xWord === "") return errorGenerator(303);

                    suggText = "and (";
                    infoText = xWord + " must have ... ";
                    results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, "AND_OR_PAREN"));
                    suggText = "or (";
                    results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, "AND_OR_PAREN"));
                }
                else
                    return errorGenerator(302);

                // [X]… <no must> … with ( … ) must have
                if (!wordsArray.includes("must") && findUnResolvedParenthesis(wordsArray) === 0) { // no open parenthesis
                    xWord = selectXWord(0);
                    if (xWord === "") return errorGenerator(303);

                    suggText = "must have";
                    infoText = xWord + " ...";
                    results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, "MUST_HAVE"));
                }

                break;

            case "of":
                // [X] of
                if (lastWordIndex < 1) return errorGenerator(204);

                // extension/implementation of Superclass/Interface/"…"
                xWord = selectXWord(lastWordIndex - 1);
                if (xWord !== "" && autoComplete_suggestion[xWord].preWord && autoComplete_suggestion[xWord].preWord === "of") {
                    suggText = (!isSecondWord && isMiddleOfWord ? "of " : "") + autoComplete_suggestion[xWord].placeholder;
                    infoText = xWord + (!isSecondWord && isMiddleOfWord ? "" : " of");
                    results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, xWord));

                    suggText = (!isSecondWord && isMiddleOfWord ? "of " : "") + "\"SOME_TEXT\"";
                    infoText = xWord + (!isSecondWord && isMiddleOfWord ? "" : " of");
                    results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, xWord));
                    break;
                }

                // NOT accurate
                // … must … [X] … of [based on X]
                let arrayInput = mustIndex > 0 ? wordsArray.slice(mustIndex, wordsArray.length) : wordsArray;
                let nouns = findNounsInInput(arrayInput.join(" "));

                nouns.forEach(d => {
                    xWord = d;
                    suggText = (isConnectorWord && isMiddleOfWord) ? "of" : "";
                    infoText = xWord + (isConnectorWord && isMiddleOfWord ? "" : " of");
                    results = results.concat(this.ofSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));
                });
                break;

            case "": // not displayed
                // results = results.concat(grammar_keywords
                //     .map(d => TextualEditor.createGrammarSuggestion(d, "", 100)));
                break;

            default:
                xWord = selectXWord(lastWordIndex) === "" ? lastWord : selectXWord(lastWordIndex);

                // typing special word
                if (isMiddleOfWord && !isSecondWord && lastWordIndex > 1) {
                    // … [X] preWord special_word
                    xWord = selectXWord(lastWordIndex - 2);
                    if (xWord === "" || !autoComplete_suggestion[xWord].preWord
                        || autoComplete_suggestion[xWord].preWord !== wordsArray[lastWordIndex - 1]) break;
                    suggText = autoComplete_suggestion[xWord].placeholder;
                    infoText = xWord + " " + autoComplete_suggestion[xWord].preWord;
                    results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, xWord));
                }

                // after special word
                else if (!isMiddleOfWord && !isSecondWord && lastWordIndex > 1) {
                    // … [X] preWord special_word [based on X]
                    if (xWord && xWord !== "" && autoComplete_suggestion[xWord] && autoComplete_suggestion[xWord].preWord
                        && autoComplete_suggestion[xWord].preWord === wordsArray[lastWordIndex - 1])
                        xWord = selectXWord(lastWordIndex - 2);
                }
                // xWord = selectXWord(lastWordIndex) === "" ? lastWord : selectXWord(lastWordIndex);
                grammar_keywords
                    .filter(d => (isMiddleOfWord && !isSecondWord) ? d.indexOf(xWord) !== -1 : d === xWord)
                    .forEach(d => {
                        // if there exists an open parenthesis
                        if (lastWordIndex > 1 && findUnResolvedParenthesis(wordsArray) > 0) {
                            suggText = ")";
                            infoText = "";
                            results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, "AND_OR_PAREN"));
                            suggText = "and";
                            results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, "AND_OR_PAREN"));
                            suggText = "or";
                            results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, "AND_OR_PAREN"));
                        }
                        // still typing the keyword
                        if (isMiddleOfWord && !isSecondWord)
                            results.push(TextualEditor.createGrammarSuggestion(d, "", d));
                        else {
                            if (!!autoComplete_suggestion[d].withClause) {
                                suggText = (isMiddleOfWord && !isSecondWord ? d + " " : "" ) + "with";
                                infoText = isMiddleOfWord && !isSecondWord ? "" : d;
                                results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, "WITH"));
                            }
                            else {
                                if (!!autoComplete_suggestion[d].preWord) {
                                    suggText = (isMiddleOfWord && !isSecondWord ? d + " " : "" )
                                        + autoComplete_suggestion[d].preWord + " " + autoComplete_suggestion[d].placeholder;
                                    infoText = isMiddleOfWord && !isSecondWord ? "" : d;
                                    results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, d));
                                }


                                suggText = (isMiddleOfWord && !isSecondWord ? d + " " : "" )
                                    + (autoComplete_suggestion[d].preWord ? autoComplete_suggestion[d].preWord + " " : "") + "\"SOME_TEXT\"";
                                infoText = isMiddleOfWord && !isSecondWord ? "" : d;
                                results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, "QUOTES"));
                            }

                            if (autoComplete_suggestion[d].ofClause.length > 0) {
                                suggText = (isMiddleOfWord && !isSecondWord ? d + " " : "") + "of";
                                infoText = isMiddleOfWord && !isSecondWord ? "" : d;
                                results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, "OF"));
                            }

                            if (findUnResolvedParenthesis(wordsArray) === 0 && !isSecondWord && wordsArray.indexOf("must") === -1) {
                                suggText = (!isMiddleOfWord ? "" : d + " ") + "must have";
                                infoText = lastWordIndex !== 0 ? xWord : (isMiddleOfWord ? "" : d);
                                results.push(TextualEditor.createGrammarSuggestion(suggText, infoText, "MUST_HAVE"));
                            }
                        }
                    });
        }

        if (results.length === 0) {
            if (specialCase !== "") {
                // special case for a and and
                if (specialCase === "a" || specialCase === "an")
                    results.push(TextualEditor.createGrammarSuggestion("and", "and", "AND_OR_PAREN"));
                if (specialCase === "o")
                    results.push(TextualEditor.createGrammarSuggestion("or", "or", "AND_OR_PAREN"));
            }
            else return errorGenerator(400);
        }
        return results;
    }

    /**
     *
     * @param myText full text
     * @param selectionStart based on state.selectionStart
     * @param selectionEnd based on state.selectionEnd
     * @returns {Array}
     */
    phraseSuggestion(myText, selectionStart, selectionEnd) {
        // empty
        if (myText === "")
            return [];

        let results = [];

        let wordsArray = myText.slice(selectionStart === -1 ? 0 : selectionStart, selectionEnd).trim().split(" ");
        let phraseIndexArrays = wordsArray.map(d => sample_phrase_hash.hasOwnProperty(d) ? sample_phrase_hash[d] : []);
        // trying to find the non-empty intersection of phrase indices for each word
        let intersection = [];

        for (let cnt = 0; cnt < wordsArray.length; cnt++) {
            if (phraseIndexArrays[cnt].length === 0) continue;
            intersection = new Set(phraseIndexArrays[cnt]);
            if (cnt < wordsArray.length - 1) { // not last array
                for (let i = cnt + 1; i < wordsArray.length; i++) {
                    let temp = new Set(phraseIndexArrays[i]);
                    if (temp.length === 0) break;
                    intersection = new Set([...intersection].filter(d => [...temp].includes(d)));
                    if (intersection.length === 0) break;
                }
            }
            intersection = [...intersection];
            if (intersection.length === 0) continue;
            /* eslint-disable */
            results = sample_phrases.filter((d, i) => intersection.includes(i))
                .map(d => TextualEditor.createPhraseSuggestion(d["replaceWordWith"], cnt));
            /* eslint-enable */
        }
        return results;
    }

    /**
     * create an array of suggestion
     * @param word
     * @param beforeSugText what appears before the main suggestion
     * @param infoText what appears as the info (grey text)
     * @param doFilter
     * @param filterLetters
     * @returns {Array}
     */
    withSuggestionCreator(word, beforeSugText, infoText, doFilter, filterLetters) {
        let result = [];
        if (grammar_keywords.includes(word)) {
            if (autoComplete_suggestion[word].withClause)
                result = autoComplete_suggestion[word].withClause;

            // check if filtering makes no result, ignore it
            if (result.filter(d => !doFilter ? true : d.startsWith(filterLetters)).length !== 0)
                result = result.filter(d => !doFilter ? true : d.startsWith(filterLetters));
            return result.map(d => TextualEditor.createGrammarSuggestion(beforeSugText + (beforeSugText !== "" ? " " : "") + d, infoText, word));
        }
        return [];
    };

    /**
     * create an array of suggestion for of Clause
     * @param word
     * @param beforeSugText what appears before the main suggestion
     * @param infoText what appears as the info (grey text)
     * @param doFilter boolean
     * @param filterLetters
     * @returns {Array}
     */
    ofSuggestionCreator(word, beforeSugText, infoText, doFilter, filterLetters) {
        if (grammar_keywords.includes(word)) {
            return autoComplete_suggestion[word].ofClause
                .filter(d => !doFilter ? true : d.startsWith(filterLetters))
                .map(d => TextualEditor.createGrammarSuggestion(beforeSugText + (beforeSugText !== "" ? " " : "") + d, infoText, word));
        }
        return [];
    };

    /**
     * used for creating grammar suggestion objects, each row in suggestion auto-complete
     * @param text
     * @param info
     * @param docIndex
     * @returns {{label: *, documentation: string}}
     */
    static createGrammarSuggestion(text, info, docIndex) {
        let CompletionItem = {
            label: text,
            documentation: documentations_IMarkdownString[docIndex],
            detail: info,
            insertText: text,
            kind: "suggestion"
        };
        if (docIndex === 0) delete CompletionItem.documentation;
        return CompletionItem;
    }

    /**
     * used for creating phrase suggestion objects, each row in suggestion auto-complete
     * @param text
     * @param index
     * @returns {{phraseText: *, startWordIndex: *}}
     */
    static createPhraseSuggestion(text, index) {
        return {phraseText: text, startWordIndex: index};
    }


}

export default TextualEditor;