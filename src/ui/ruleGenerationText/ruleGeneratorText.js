/**
 * Heavily dependant on Grammar, mainly keywords like equal, where, to, etc.
 */


import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom'
import {TextConstants} from "./textConstant";
import {//FormControl, FormGroup,
    ListGroup, ListGroupItem, Panel} from "react-bootstrap";
import posTagger from 'wink-pos-tagger';
import MonacoEditor from 'react-monaco-editor';

import {ASP_FORMAT, ASP_THEME, EDITOR_OPTION} from "./monacoEditorConfig";

class RuleGeneratorText extends Component {
    constructor(props) {
        super(props);

        this.state = {
            myText: (props.hasOwnProperty("defaultValue") && props.defaultValue) ? props.defaultValue : "",
            selectionStart: -1,
            selectionEnd: 0,
            grammarSuggestion: [],
            phraseSuggestion: [],
            focused: false,

            editor: null,
            monaco: null
        };

        if (!props.onUpdateText || !props.onBlur)
            return new Error(`'onUpdateText' and 'onBlur' are required functions in props`);

        this.onUpdateText = props.onUpdateText;
        this.onBlur = props.onBlur;

        this.handleChange = this.handleChange.bind(this);
        // this.onClickTextArea = this.onClickTextArea.bind(this);
        // this.onKeyUp = this.onKeyUp.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.editorDidMount = this.editorDidMount.bind(this);

    }

    render() {
        return (
            <div ref={(node) => this.wrapperRef = node} className={"ruleGeneratorTextContainer"}>

                {/*<form>*/}
                {/*<FormGroup>*/}
                <div style={{border: "1px solid #cbcbcb"}}>
                        <MonacoEditor
                            ref="monaco"
                            options={EDITOR_OPTION}
                            language="asp"
                            value={this.state["myText"]}
                            height={50}
                            theme="draco-light"
                            editorDidMount={this.editorDidMount}
                            editorWillMount={this.editorWillMount}
                            onChange={this.handleChange}
                        />
                    </div>

                        {/*<FormControl componentClass="textarea" placeholder="Design Rule"*/}
                                     {/*style={{resize: "vertical"}}*/}
                                     {/*id={"queryText"}*/}
                                     {/*onClick={this.onClickTextArea}*/}
                                     {/*onChange={this.handleChange}*/}
                                     {/*onKeyUp={this.onKeyUp}*/}
                                     {/*onFocus={() => {*/}
                                         {/*this.suggestionDivRef.style.display = "block";*/}
                                         {/*this.setState({focused: true})*/}
                                     {/*}}*/}
                                     {/*value={this.state["myText"]}*/}
                                     {/*ref={(node) => this.queryText = node}*/}
                        {/*/>*/}
                        <div ref={(node) => this.suggestionDivRef = node} className={"suggestionDiv"}>
                            <Panel bsStyle="default">
                                {this.state.grammarSuggestion.length === 0 ? null : (
                                    <Fragment>
                                        <Panel.Heading>
                                            <Panel.Title componentClass="h3">Grammar</Panel.Title>
                                        </Panel.Heading>
                                        <ListGroup>
                                            {this.state.grammarSuggestion.map((item, i) =>
                                                item.type === "suggestion" ?
                                                    (<ListGroupItem key={i}
                                                                    onClick={() => this.updateGrammarText(item.suggestion)}>
                                                        <span
                                                            style={{color: "#999999"}}> {item.information + " "}</span>
                                                        {item.suggestion}
                                                    </ListGroupItem>)
                                                    : item.type === "error" ?
                                                    (<ListGroupItem key={i}>
                                                        <span style={{color: "#99555a"}}> {item.information}</span>
                                                    </ListGroupItem>)
                                                    : null
                                            )}
                                        </ListGroup>
                                    </Fragment>
                                )}
                                {this.state.phraseSuggestion.length === 0 ? null : (
                                    <Fragment>
                                        <Panel.Heading>
                                            <Panel.Title componentClass="h3">Phrase</Panel.Title>
                                        </Panel.Heading>

                                        <ListGroup>
                                            {this.state.phraseSuggestion.map((sug, i) =>
                                                (<ListGroupItem key={i}
                                                                onClick={() => this.updatePhraseText(sug)}>
                                                    {sug.phraseText}
                                                </ListGroupItem>)
                                            )}
                                        </ListGroup>
                                    </Fragment>
                                )}
                                {this.state.grammarSuggestion.filter(d => d.type === "suggestion").length !== 0 || this.state.phraseSuggestion.length !== 0 ? null : (
                                    <Fragment>
                                        <Panel.Heading>
                                            <Panel.Title componentClass="h3">Examples</Panel.Title>
                                        </Panel.Heading>
                                        <ListGroup>
                                            {TextConstants.templates.map((template, i) =>
                                                (<ListGroupItem key={i}
                                                                onClick={() => {
                                                                    ReactDOM.findDOMNode(this.queryText).focus();
                                                                    this.setState({
                                                                            myText: template,
                                                                            selectionStart: -1,
                                                                            selectionEnd: template.length,
                                                                        },
                                                                        () => {
                                                                            this.setCaretPosition("queryText", template.length);
                                                                            this.onUpdateText(template)
                                                                        })
                                                                }}>{template}</ListGroupItem>)
                                            )}
                                        </ListGroup>
                                    </Fragment>
                                )}
                            </Panel>
                        </div>

                    {/*</FormGroup>*/}
                {/*</form>*/}
            </div>
        );
    }

    editorDidMount(editor, monaco) {
        this.setState({
            editor: editor,
            monaco: monaco
        });
        editor.onDidChangeCursorSelection((e) => {
            if (e.reason === 3) {
                let value = this.state.editor.getValue();
                let selection = e.selection; // indices starts from 1
                let start = selection.startColumn === selection.endColumn ? -1 : selection.startColumn - 1;
                let end = selection.endColumn;
                this.setState({
                    myText: value,
                    selectionStart: start,
                    selectionEnd: end,
                    grammarSuggestion: this.grammarSuggestion(value, end),
                    phraseSuggestion: this.phraseSuggestion(value, start, end)
                });
            }

        });
        editor.onDidFocusEditorText(() => {
            this.suggestionDivRef.style.display = "block";
            this.setState({focused: true});
        });
    }

    editorWillMount(monaco) {
        monaco.languages.register({id: "asp"});
        monaco.languages.setMonarchTokensProvider("asp", ASP_FORMAT);
        monaco.editor.defineTheme("draco-light", ASP_THEME);
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        if (nextProps["caretPosition"] && nextProps["caretPosition"] !== -1) {
            let focus = nextProps["caretPosition"];
            let data = this.grammarSuggestion(this.state.myText, focus);
            this.setState({
                    myText: nextProps.defaultValue ? nextProps.defaultValue : this.state.myText,
                    selectionStart: -1,
                    selectionEnd: focus,
                    grammarSuggestion: data,
                    phraseSuggestion: this.phraseSuggestion(this.state.myText, -1, focus)
                },
                () => this.setCaretPosition("queryText", focus)
            );

        }
        else
            this.setState({myText: nextProps.defaultValue ? nextProps.defaultValue : this.state.myText})
    }

    /**
     * update text and suggestion upon changing the text
     * @param newText
     */
    handleChange(newText) {
        let selection = this.state.editor.getSelection(); // indices starts from 1
        let start = selection.startColumn === selection.endColumn ? -1 : selection.startColumn - 1;
        let end = selection.endColumn;


        // let start = e.target.selectionStart === e.target.selectionEnd ? -1 : e.target.selectionStart;
        // let end = e.target.selectionEnd;
        let data = this.grammarSuggestion(newText, end);

        this.setState({
                focused: true,
                myText: newText,
                selectionStart: start,
                selectionEnd: end,
                grammarSuggestion: data,
                phraseSuggestion: this.phraseSuggestion(newText, start, end)
            },
            () => {
                this.setCaretPosition("queryText", end);
                this.onUpdateText(newText)
            });
    }


    // /**
    //  * update suggestion upon changing the caret/offset position
    //  * @param e
    //  */
    // onClickTextArea(e) {
    //     let start = e.target.selectionStart === e.target.selectionEnd ? -1 : e.target.selectionStart;
    //     let end = e.target.selectionStart === e.target.selectionEnd ? e.target.selectionStart : e.target.selectionEnd;
    //     let data = this.grammarSuggestion(this.state.myText, end);
    //         this.setState({
    //             selectionStart: start,
    //             selectionEnd: end,
    //             grammarSuggestion: data,//this.grammarSuggestion(this.state.myText, start, end),//this.grammarSuggestion(e.target.value.slice(start, end)),
    //             phraseSuggestion: this.phraseSuggestion(this.state.myText, start, end)//e.target.value.slice(start, end))
    //         });
    // }
    //
    //
    // /**
    //  * update suggestion upon moving the caret/offset by keyboard arrow keys
    //  * @param e
    //  */
    // onKeyUp(e) {
    //     let start = e.target.selectionStart === e.target.selectionEnd ? -1 : e.target.selectionStart;
    //     let end = e.target.selectionStart === e.target.selectionEnd ? e.target.selectionStart : e.target.selectionEnd;
    //     let myText = e.target.value;
    //
    //     e.target.style.cssText = 'height:0';
    //     e.target.style.cssText = 'overflow:hidden;height:' + e.target.scrollHeight + 'px';
    //
    //     if (e.keyCode === 37 || e.keyCode === 39) { // left and right arrows
    //         let data = this.grammarSuggestion(e.target.value, end);
    //         this.setState({
    //             selectionStart: start,
    //             selectionEnd: end,
    //             grammarSuggestion: data,
    //             phraseSuggestion: this.phraseSuggestion(myText, start, end)//e.target.value.slice(0, e.target.selectionStart))
    //         });
    //     }
    //     // if (e.keyCode === 32) { // space
    //     // }
    //
    //     // if (e.keyCode === 38) { // up
    //     // }
    //
    //     // if (e.keyCode === 40) { // down
    //     // }
    // }


    /**
     * For hiding the suggestion div
     */

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        window.addEventListener('resize', () => this.state.editor.layout());
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.suggestionDivRef.style.display = "none";
            if (this.state.focused)
                this.onBlur();
            this.setState({focused: false});
        }
    }


    /**
     * set the caret position, used when a word is replaced or added in the textbox
     * @param elemId
     * @param caretPos
     */
    setCaretPosition(elemId, caretPos) {
        let elem = document.getElementById(elemId);

        if (elem !== null) {
            if (elem.createTextRange) {
                let range = elem.createTextRange();
                range.move('character', caretPos);
                range.select();
            }
            else {
                if (elem.selectionStart) {
                    elem.focus();
                    elem.setSelectionRange(caretPos, caretPos);
                }
                else
                    elem.focus();
            }
        }
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
                return string.replace(new RegExp(search, 'g'), replacement);
            };

            let str = lemmatized.join(" ");
            str = stringReplaceAll(str, "''", "");
            str = stringReplaceAll(str, "`` ","" );
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
         * remove contents of paired parenthesis
         * @param input array of strings
         * @returns Array of words, removed contents of paired parenthesis
         */
        const removePairedParenthesis = (input) => {
            let copiedInput = [];
            let unresolvedClosedParen = 0, remove = false;
            for (let i = input.length - 1; i > -1; i--) {
                if (input[i] === ")") {
                    unresolvedClosedParen++;
                    remove = true;
                }
                else if (input[i] === "(") {
                    unresolvedClosedParen--;
                    if (unresolvedClosedParen <= 0)
                        remove = false;
                    if (unresolvedClosedParen < 0 && copiedInput[0] !== "(")
                        copiedInput = ["("].concat(copiedInput);
                    if (unresolvedClosedParen >= 0) {
                        if (["and", "or"].indexOf(copiedInput[0]) !== -1) copiedInput.shift();
                        else copiedInput = ["()"].concat(copiedInput);
                    }
                }
                else if (!remove)
                    copiedInput = [input[i]].concat(copiedInput);
            }

            return copiedInput;
        };

        /**
         * creating error message
         * @param errorMessageNumber
         * @return {[]} array with a single element
         */
        const errorGenerator = (errorMessageNumber) => {
            return [{suggestion: "", information: TextConstants.error_messages[errorMessageNumber], type: "error"}]
        };


        /**
         * return wordsArray[index], if wordsArray[index] is a parenthesis, returns
         *  wordsArray[index-1]
         * @param index
         * @return {*}
         */
        const wordsArrayAtIndex = (index) => {
          if (index < 0) return "";
          let newIndex = index;
          while (wordsArray[newIndex] === "(" || wordsArray[newIndex] === ")") {
              newIndex--;
              if (newIndex < 0) return "";
          }
          return wordsArray[newIndex]
        };


        /*
         * determines if the last word is finished yet or not
         * like: function where have an[notation]
         */
        if (myText === "") return [];
        let caretPosition = selectionEnd;
        let beforeCaret = caretPosition > 0 ? myText[caretPosition - 1] : null;
        let isMiddleOfWord = (beforeCaret !== " " && beforeCaret !== null);

        let wordsArray = [];

        /*
         * lemmatization
         * If the last word is not finished yet, it is removed from the list of words
         * because in lemmatization, 'an' and 'a' and other determiners are removed, e.g. an(notation)
         * Then it is pushed back.
         */
        let text = myText.slice(0, caretPosition);
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
            if (["wh", "whe", "wher"].includes(lastWord))
                lastWord = "where";
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
        let isConnectorWord = TextConstants.connectors.indexOf(lastWord) !== -1;
        let isKeyword = TextConstants.keywords.indexOf(lastWord) !== -1;
        let isWord = lastWord ? lastWord.startsWith("\"") : false;

        let xWord; // must be in TextConstants.keywords
        let results = [], beforeSuggText = "", suggText = "",  infoText = "";
        let auxWordArray = wordsArray.map((w, i) => {
            return (w === "where" && ["not", "equal", "include", "start", "end"].indexOf(wordsArray[i + 1]) === -1) ? 1 : 0
        });
        let lastWhereIndex = auxWordArray.lastIndexOf(1);

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
            if (wordsArray.length < index + 2) {
                while (wordsArray.length < index + 2 && wordsArray[index] === "(") index--;
                if (wordsArray[index] === "abstract" && wordsArray[index + 1] === "function") return "abstract function";
                if (wordsArray[index] === "return" && wordsArray[index + 1] === "value") return "return value";
                if (wordsArray[index] === "declaration" && wordsArray[index + 1] === "statement") return "declaration statement";
                if (wordsArray[index] === "expression" && wordsArray[index + 1] === "statement") return "expression statement";
                if (wordsArray[index] === "initial" && wordsArray[index + 1] === "value") return "initial value";
            }
            if (TextConstants.keywords.indexOf(wordsArray[index]) !== -1) return wordsArray[index];
            return "";
        }

        // This block process strings in the lastWord
        if (isWord) {
            // "someWord["]
            if (!lastWord.endsWith("\""))
                return [RuleGeneratorText.createGrammarSuggestion("\"", lastWord)];
            // … [X] where have name/annotation/etc. where not? equal to "someWord" [based on X]
            xWord = selectXWord(lastWhereIndex - 1);
            results.push(RuleGeneratorText.createGrammarSuggestion("and have", xWord));
            results.push(RuleGeneratorText.createGrammarSuggestion("or have", xWord));
            results.push(RuleGeneratorText.createGrammarSuggestion("of", xWord));

            if (wordsArray.indexOf("must") === -1)
                results.push(RuleGeneratorText.createGrammarSuggestion("must", selectXWord(0)));

            return results;
        }

        /*
         * If the last word is random letters and is not finished yet,
         * update the lastWord to one to the last word
        */
        if (!isConnectorWord && !isKeyword && isMiddleOfWord) lastWord = wordsArray.length >= 2 ? wordsArray[wordsArray.length - 2] : lastWord;
        if (!isConnectorWord && !isKeyword && isMiddleOfWord) lastWordIndex = wordsArray.length >= 2 ? wordsArray.length - 2 : lastWordIndex;
        let isSecondWord = lastWordIndex !== (wordsArray.length - 1);

        /*
         * If the last word is random letters and it follows 'to', 'with', 'include',
         * it should be quoted.
         */
        if (isSecondWord && wordsArray[wordsArray.length - 1].length > 2 && ["to", "with", "include"].indexOf(wordsArray[wordsArray.length - 2]) !== -1) {
            suggText = "\"" + wordsArray[wordsArray.length - 1] + "\"";
            infoText = "(Strings and variables must be quoted)";
            results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
        }
// console.log(wordsArray, lastWord);
        switch (lastWord) {
            case "where":
                // [X] where
                xWord = selectXWord(lastWordIndex - 1);
                if (xWord === "") return errorGenerator(100);

                // … [X] where have …
                if (!!TextConstants.autoComplete_suggestion[xWord].whereHaveClause) {
                    suggText = (!isSecondWord && isMiddleOfWord ? "where" : "") + " have";
                    infoText = xWord + (!isSecondWord && isMiddleOfWord ? "" : " where");
                    results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                }
                // … [X] where not? equal to/include/start with/end with
                else {
                    beforeSuggText = !isSecondWord && isMiddleOfWord ? "where" : "";
                    infoText = xWord + (!isSecondWord && isMiddleOfWord ? "" : " where");
                    results = results.concat(this.whereSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));
                }
                break;

            case "have":
                // [X] where have
                if (lastWordIndex < 2) return errorGenerator(101);

                // [X] … must have [based on X]
                if (wordsArrayAtIndex(lastWordIndex - 1) === "must") {
                    xWord = selectXWord(0);
                    if (xWord === "") return errorGenerator(304);

                    beforeSuggText = !isSecondWord && isMiddleOfWord ? "have" : "";
                    infoText = xWord + " must" + (!isSecondWord && isMiddleOfWord ? "" : " have");
                    results = results.concat(this.whereSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));
                }
                // … [X] where have [based on X]
                else {
                    xWord = selectXWord(lastWhereIndex - 1);
                    if (xWord === "") return errorGenerator(101);

                    if (!TextConstants.autoComplete_suggestion[xWord].whereHaveClause) 
                        return errorGenerator(302);

                    beforeSuggText = !isSecondWord && isMiddleOfWord ? "have" : "";
                    infoText = xWord + " where" + (!isSecondWord && isMiddleOfWord ? "" : " have");
                    results = results.concat(this.whereSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));
                }

                break;

            case "must":
                // … must …
                if (wordsArray.reduce((n, val) => n + (val === "must"), 0) > 1) return errorGenerator(103);
                xWord = selectXWord(0);
                if (xWord === "") return errorGenerator(304);

                // [X] … must have [based on X]
                beforeSuggText = (!isSecondWord && isMiddleOfWord ? "must " : "") + "have";
                infoText = xWord + (!isSecondWord && isMiddleOfWord ? "" : " must");
                results = results.concat(this.whereSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));

                // [X] … must be equal to [X]
                suggText = ((isConnectorWord && isMiddleOfWord) ? "must " : "") + "be equal to";
                infoText = xWord + ((isConnectorWord && isMiddleOfWord) ? "" : " must");
                results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                break;

            case "be":
                // [X] must be
                if (lastWordIndex < 2) return errorGenerator(102);

                // … must be …
                if (wordsArrayAtIndex(lastWordIndex - 1) !== "must") return errorGenerator(102);
                xWord = selectXWord(0);
                if (xWord === "") return errorGenerator(304);

                // [X] … must be equal to
                suggText = ((isConnectorWord && isMiddleOfWord) ? "be " : "") + "equal to";
                infoText = xWord + " must" + ((isConnectorWord && isMiddleOfWord) ? "" : " be");
                results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                break;

            case "equal":
                // [X] where equal
                if (lastWordIndex < 2) return errorGenerator(201);

                // [X] … must be equal to
                if (wordsArrayAtIndex(lastWordIndex - 1) === "be") {
                    xWord = selectXWord(0);
                    if (xWord === "") return errorGenerator(304);

                    suggText = (isConnectorWord && isMiddleOfWord ? "equal " : "") + "to";
                    infoText = xWord + " must be" + (isConnectorWord && isMiddleOfWord ? "" : " equal");
                    results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                }

                // … [X] where not? equal to
                else {
                    xWord = wordsArrayAtIndex(lastWordIndex - 1) === "not" ? selectXWord(lastWordIndex - 3) : selectXWord(lastWordIndex - 2);
                    if (xWord === "") return errorGenerator(201);

                    if (!TextConstants.autoComplete_suggestion[xWord].whereClause) return errorGenerator(201);
                    suggText = ((isConnectorWord && isMiddleOfWord) ? "equal " : "") + "to";
                    infoText = xWord + " where " + (wordsArrayAtIndex(lastWordIndex - 1) === "not" ? " not" : "") + ((isConnectorWord && isMiddleOfWord) ? "" : " equal");
                    results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                }
                break;

            case "to":
                // [X] where equal to
                if (lastWordIndex < 3) return errorGenerator(202);
                if (wordsArrayAtIndex(lastWordIndex - 1) !== "equal") return errorGenerator(202);

                // [X] … must be equal to [X]
                if (wordsArrayAtIndex(lastWordIndex - 3) === "must" && wordsArrayAtIndex(lastWordIndex - 2) === "be") {
                    xWord = selectXWord(0);
                    if (xWord === "") return errorGenerator(304);

                    suggText = (isConnectorWord && isMiddleOfWord ? "to " : "") + xWord;
                    infoText = xWord + " must be equal" + (isConnectorWord && isMiddleOfWord ? "" : " to");
                    results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                    break;
                }
                // … [X] where not equal to
                if (wordsArrayAtIndex(lastWordIndex - 3) === "where" && wordsArrayAtIndex(lastWordIndex - 2) === "not") {
                    xWord = selectXWord(lastWordIndex - 4);
                    if (xWord === "") return errorGenerator(300);
                    if (!TextConstants.autoComplete_suggestion[xWord].whereClause) return errorGenerator(202);
                    suggText = (isMiddleOfWord) ? "to" : "\"TEXT\"";
                    infoText = xWord + " where not equal" + (isMiddleOfWord ? "" : " to");
                    results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                }
                // … [X] where equal to
                else if (wordsArrayAtIndex(lastWordIndex - 2) === "where") {
                    xWord = selectXWord(lastWordIndex - 3);
                    if (xWord === "") return errorGenerator(300);
                    if (!TextConstants.autoComplete_suggestion[xWord].whereClause) return errorGenerator(202);
                    suggText = (isMiddleOfWord) ? "to" : "\"TEXT\"";
                    infoText = xWord + " where equal" + (isMiddleOfWord ? "" : " to");
                    results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                }
                break;

            case "not":
                // [X] where not
                if (lastWordIndex < 2) return errorGenerator(203);
                xWord = selectXWord(lastWordIndex - 2);
                if (xWord === "") return errorGenerator(203);
                if (!TextConstants.autoComplete_suggestion[xWord].whereClause) return errorGenerator(203);
                suggText = (isConnectorWord && isMiddleOfWord ? "not " : "" ) + "equal to";
                infoText = xWord + " where" + (isConnectorWord && isMiddleOfWord ? "" : " not");
                results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                if (xWord !== "name") break;
                // include, start with, end with are only used for 'name'
                suggText = (isConnectorWord && isMiddleOfWord ? "not " : "" ) + "include";
                results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                suggText = (isConnectorWord && isMiddleOfWord ? "not " : "" ) + "start with";
                results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                suggText = (isConnectorWord && isMiddleOfWord ? "not " : "" ) + "end with";
                results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                break;

            case "and":
            case "or":
                // … [X] where … and [based on X]
                xWord = selectXWord(lastWhereIndex - 1);
                if (xWord === "") return errorGenerator(204);

                if (!TextConstants.autoComplete_suggestion[xWord].whereHaveClause) return errorGenerator(204);
                beforeSuggText = (isConnectorWord && isMiddleOfWord ? lastWord + " " : "") + "have";
                infoText = xWord + " where ... " + (isConnectorWord && isMiddleOfWord ? "" : lastWord);
                results = results.concat(this.whereSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));
                break;

            case "include":
                // [X] where include
                if (lastWordIndex < 2) return errorGenerator(205);
                // … [X] where not? include
                xWord = wordsArrayAtIndex(lastWordIndex - 1) === "not" ? selectXWord(lastWordIndex - 3) : selectXWord(lastWordIndex - 2);
                if (xWord === "") return errorGenerator(205);

                if (!TextConstants.autoComplete_suggestion[xWord].whereClause) return errorGenerator(205);
                suggText = (isConnectorWord && isMiddleOfWord ? "include " : "") + "\"TEXT\"";
                infoText = xWord + " where" + (wordsArrayAtIndex(lastWordIndex - 1) === "not" ? " not" : "") + (isConnectorWord && isMiddleOfWord ? "" : " include");
                results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                break;

            case "start":
                // [X] where start
                if (lastWordIndex < 2) return errorGenerator(206);
                // … [X] where not? start with
                xWord = wordsArrayAtIndex(lastWordIndex - 1) === "not" ? selectXWord(lastWordIndex - 3) : selectXWord(lastWordIndex - 2);
                if (xWord === "") return errorGenerator(206);

                if (!TextConstants.autoComplete_suggestion[xWord].whereClause) return errorGenerator(206);
                suggText = (isConnectorWord && isMiddleOfWord ? "start " : "") + "with \"TEXT\"";
                infoText = xWord + " where" + (wordsArrayAtIndex(lastWordIndex - 1) === "not" ? " not" : "") + (isConnectorWord && isMiddleOfWord ? "" : " start");
                results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                break;

            case "end":
                // [X] where end
                if (lastWordIndex < 2) return errorGenerator(207);
                // … [X] where not? end with
                xWord = wordsArrayAtIndex(lastWordIndex - 1) === "not" ? selectXWord(lastWordIndex - 3) : selectXWord(lastWordIndex - 2);
                if (xWord === "") return errorGenerator(207);

                if (!TextConstants.autoComplete_suggestion[xWord].whereClause) return errorGenerator(207);
                suggText = (isConnectorWord && isMiddleOfWord ? "end " : "") + "with \"TEXT\"";
                infoText = xWord + " where" + (wordsArrayAtIndex(lastWordIndex - 1) === "not" ? " not" : "") + (isConnectorWord && isMiddleOfWord ? "" : " end");
                results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                break;

            case "with":
                // [X] where end/start with
                if (lastWordIndex < 3) return errorGenerator(208);
                // … [X] where not? end/start with
                xWord = wordsArrayAtIndex(lastWordIndex - 2) === "not" ? selectXWord(lastWordIndex - 4) : selectXWord(lastWordIndex - 3);
                if (xWord === "") return errorGenerator(208);

                if (!TextConstants.autoComplete_suggestion[xWord].whereClause) return errorGenerator(208);
                suggText = (isConnectorWord && isMiddleOfWord ? "with " : "") + "\"TEXT\"";
                infoText = xWord + " where" + (wordsArrayAtIndex(lastWordIndex - 2) === "not" ? " not " : " ") + wordsArrayAtIndex(lastWordIndex - 1) + (isConnectorWord && isMiddleOfWord ? "" : " with");
                results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                break;

            case "(":
                // [X] where (
                if (lastWordIndex < 2) return errorGenerator(210);
                // [X] must (
                if (lastWhereIndex < 1 && !wordsArray.includes("must")) return errorGenerator(210);

                xWord = selectXWord(lastWhereIndex - 1);
                // … [X] where ( have [based on X]
                if (xWord !== "" && wordsArray.indexOf("must") < lastWhereIndex) {
                    if (!TextConstants.autoComplete_suggestion[xWord].whereHaveClause) return errorGenerator(210);

                    beforeSuggText = (!!TextConstants.autoComplete_suggestion[xWord].whereHaveClause ? " have" : "" );
                    infoText = xWord + " where (";
                    results = results.concat(this.whereSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));
                    break;
                }

                // [X] … must ( … and/or ( have [based on X]
                if (["must", "and", "or"].indexOf(wordsArrayAtIndex(lastWordIndex - 1)) !== -1) {
                    xWord = selectXWord(0);
                    if (xWord === "") return errorGenerator(304);

                    suggText = "have";
                    infoText = xWord + " must";
                    results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                    break;
                }

                return errorGenerator(300);

            case ")":
                // [X] where ( )
                if (lastWordIndex < 3) return errorGenerator(209);
                // [X] must ( )
                if (lastWhereIndex < 1 && !wordsArray.includes("must")) return errorGenerator(209);

                // … [X] where ( … ) of [based on X]
                let corrOpenParanIndex =  findCorrespondingOpenParenIndex(wordsArray);
                if (corrOpenParanIndex < 2) return errorGenerator(211);
                xWord = selectXWord(corrOpenParanIndex - 2);

                // [X] where (…) and/or ( have …
                if (xWord !== "") {
                    suggText = "and (" + (!!TextConstants.autoComplete_suggestion[xWord].whereHaveClause ? " have" : "" );
                    infoText = xWord + " where ( ( ... ) ";
                    results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                    suggText = "or (" + (!!TextConstants.autoComplete_suggestion[xWord].whereHaveClause ? " have" : "" );
                    results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                    // [X] where (…) of
                    suggText = "of";
                    results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                }
                // [X] … must ( )
                else if (corrOpenParanIndex > 1 && wordsArray[corrOpenParanIndex - 1] === "must") {
                    xWord = selectXWord(0);
                    if (xWord === "") return errorGenerator(304);
                    suggText = "have";
                    infoText = xWord + " where ( ... ) must" ;
                    results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                }
                else
                    return errorGenerator(303);

                // [X]… <no must> … where ( … ) must have
                // [X]… <no must> … where ( … ) must be equal to
                if(!wordsArray.includes("must") && findCorrespondingOpenParenIndex(wordsArray.concat(")")) < 0) { // no open parenthesis
                    xWord = selectXWord(0);
                    if (xWord === "") return errorGenerator(304);

                    suggText = "must have";
                    infoText = xWord + " where ( ... )" ;
                    results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));

                    suggText = "must be equal to " + xWord;
                    infoText = xWord;
                    results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                }

                break;

            case "of":
                // [X] of
                if (lastWordIndex < 1) return errorGenerator(212);

                // NOT accurate
                // … must … [X] … of [based on X]
                let mustIndex = wordsArray.indexOf("must");
                let arrayInput = mustIndex > 0 ? wordsArray.slice(mustIndex, wordsArray.length) : wordsArray;
                let nouns = findNounsInInput(arrayInput.join(" "));

                nouns.forEach(d => {
                    xWord = d;
                    suggText = (isConnectorWord && isMiddleOfWord) ? "of" : "";
                    infoText = xWord + (isConnectorWord && isMiddleOfWord ? "" : " of");
                    results = results.concat(this.ofSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));
                });
                break;

            case "":
                results = results.concat(TextConstants.keywords
                    .map(d => RuleGeneratorText.createGrammarSuggestion(d, "")));
                break;

            default:
                xWord = selectXWord(lastWordIndex) === "" ? lastWord : selectXWord(lastWordIndex);
                TextConstants.keywords
                    .filter(d => isMiddleOfWord ? d.indexOf(xWord) !== -1 : d === xWord)
                    .forEach(d => {
                        if(isMiddleOfWord && !isSecondWord) // still typing the keyword
                            results.push(RuleGeneratorText.createGrammarSuggestion(d, ""));

                        else {
                            let hasWhereHaveClause = !!TextConstants.autoComplete_suggestion[d].whereHaveClause;
                            suggText = (isMiddleOfWord && !isSecondWord ? d + " " : "" ) + "where" + (hasWhereHaveClause ? " have" : "");
                            infoText = isMiddleOfWord && !isSecondWord ? "" : d;
                            results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));

                            suggText = (isMiddleOfWord && !isSecondWord ? d + " " : "") + "of";
                            infoText = isMiddleOfWord && !isSecondWord ? "" : d;
                            results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));

                            if (!isSecondWord && wordsArray.indexOf("must") === -1) {
                                suggText = (!isMiddleOfWord ? "" : d + " ") + "must be equal to" + (!isMiddleOfWord ? "" : d + " ");
                                infoText = lastWordIndex !== 0 ? xWord : (isMiddleOfWord ? "" : d);
                                results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));

                                suggText = (!isMiddleOfWord ? "" : d + " ") + "must have";
                                infoText = lastWordIndex !== 0 ? xWord : (isMiddleOfWord ? "" : d);
                                results.push(RuleGeneratorText.createGrammarSuggestion(suggText, infoText));
                            }
                        }
                    });
        }

        if (results.length === 0)
            return errorGenerator(400);
        return results;
    }


    /**
     * update the text upon selecting an item from the list
     * @param suggestion = String
     */
    updateGrammarText(suggestion) {

        let myText = this.state.myText;
        let newText = "";
        let focus = 0;
        let caretPosition = 0;

        // selection
        if (this.state.selectionStart !== -1) {
            caretPosition = this.state.selectionStart;
            newText = myText.slice(0, this.state.selectionStart) + suggestion + myText.slice(this.state.selectionEnd);
            focus = caretPosition + suggestion.length;
        }

        else {
            caretPosition = this.state.selectionEnd;
            let beforeCaret = caretPosition > 0 ? myText[caretPosition - 1] : null;
            let afterCaret = myText.length - 1 > caretPosition ? myText[caretPosition] : null;

            // -> replace wo-rd with suggestion
            if (beforeCaret !== " " && afterCaret !== " ") {
                let wordListBeforeCaret = myText.slice(0, caretPosition).split(" ");
                wordListBeforeCaret.pop();
                let wordListAfterCaret = myText.slice(caretPosition).split(" ");
                wordListAfterCaret.splice(0, 1);
                newText = (wordListBeforeCaret.length > 0 ? wordListBeforeCaret.join(" ") + " " : "") + suggestion + " " + wordListAfterCaret.join(" ");
                focus = ((wordListBeforeCaret.length > 0 ? wordListBeforeCaret.join(" ") + " " : "") + suggestion + " ").length;
            }

            // -> replace word- with suggestion
            else if (beforeCaret !== " " && afterCaret === " ") {
                let wordList = myText.slice(0, caretPosition).split(" ");
                wordList[wordList.length - 1] = suggestion;
                newText = wordList.join(" ") + myText.slice(caretPosition);
                focus = (wordList.join(" ")).length;
            }

            // -> add suggestion + space at caret
            else if (beforeCaret === " " || !afterCaret) {
                newText = myText.slice(0, caretPosition) + suggestion + " " + myText.slice(caretPosition);
                focus = caretPosition + suggestion.length;
            }
        }
        //focus = caretPosition + suggestion.length;
        let data = this.grammarSuggestion(newText, focus);
        this.setState({
                myText: newText,
                selectionStart: -1,
                selectionEnd: focus,
                grammarSuggestion: data,
                phraseSuggestion: this.phraseSuggestion(newText, -1, focus)
            },
            () => {
                this.setCaretPosition("queryText", focus);
                this.onUpdateText(newText)
            }
        );
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
        let phraseIndexArrays = wordsArray.map(d => TextConstants.phrase_hash.hasOwnProperty(d) ? TextConstants.phrase_hash[d] : []);
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
            results = TextConstants.defined_phrases.filter((d, i) => intersection.includes(i))
                .map(d => RuleGeneratorText.createPhraseSuggestion(d["replaceWordWith"], cnt));
            /* eslint-enable */
        }
        return results;
    }

    /**
     * update the text upon selecting an item from the list
     * @param suggestion = phraseText: String , startWordIndex: index
     */
    updatePhraseText(suggestion) {

        let myText = this.state.myText;
        let myTextWords = myText.split(" ");
        let beforeSuggestion = "";
        if (suggestion["startWordIndex"] > 0)
            beforeSuggestion = myTextWords.slice(0, suggestion["startWordIndex"]).join(" ");

        let newText = "";
        let focus = 0;

        // substitute
        if (this.state.selectionStart !== -1) {
            newText = beforeSuggestion + " " + suggestion["phraseText"] + " " + myText.slice(this.state.selectionEnd);
            focus = (beforeSuggestion + " " + suggestion["phraseText"] + " ").length;
        }
        else {

            let caretPosition = this.state.selectionEnd;
            let afterCaret = myText.length - 1 > caretPosition ? myText[caretPosition] : null;

            let wordListAfterCaret = myText.slice(caretPosition).trim().split(" ");
            if (afterCaret !== " " || !afterCaret) // afterCaret is a letter
                wordListAfterCaret.splice(0, 1);
            newText = (beforeSuggestion.length > 0 ? beforeSuggestion + " " : "") + suggestion["phraseText"] + " " + wordListAfterCaret.join(" ");
            focus = ((beforeSuggestion.length > 0 ? beforeSuggestion + " " : "") + suggestion["phraseText"] + " ").length;

        }
        let data = this.grammarSuggestion(newText, focus);
        this.setState({
                myText: newText,
                selectionStart: -1,
                selectionEnd: focus,
                grammarSuggestion: data,
                phraseSuggestion: this.phraseSuggestion(newText, -1, focus)
            },
            () => {
                this.setCaretPosition("queryText", focus);
                this.onUpdateText(newText)
            }
        );
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
    whereSuggestionCreator(word, beforeSugText, infoText, doFilter, filterLetters) {
        let result = [];
        if (TextConstants.keywords.includes(word)) {
            if (TextConstants.autoComplete_suggestion[word].whereHaveClause)
                result = TextConstants.autoComplete_suggestion[word].whereHaveClause;
            else
                result = TextConstants.autoComplete_suggestion[word].whereClause;

            // check if filtering makes no result, ignore it
            if (result.filter(d => !doFilter ? true : d.startsWith(filterLetters)).length !== 0)
                result = result.filter(d => !doFilter ? true : d.startsWith(filterLetters));
            return result.map(d => RuleGeneratorText.createGrammarSuggestion(beforeSugText + (beforeSugText !== "" ? " " : "") + d, infoText));
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
        if (TextConstants.keywords.includes(word)) {
            return TextConstants.autoComplete_suggestion[word].ofClause
                .filter(d => !doFilter ? true : d.startsWith(filterLetters))
                .map(d => RuleGeneratorText.createGrammarSuggestion(beforeSugText + (beforeSugText !== "" ? " " : "") + d, infoText));
        }
        return [];
    };

    /**
     * used for creating grammar suggestion objects, each row in suggestion auto-complete
     * @param text
     * @param info
     * @returns {{suggestion: *, information: *, type: "suggestion"}}
     */
    static createGrammarSuggestion(text, info) {
        return {suggestion: text, information: info, type: "suggestion"};
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

export default RuleGeneratorText;