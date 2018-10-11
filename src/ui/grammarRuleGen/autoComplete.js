import React, {Component, Fragment} from 'react';
import {constants} from "../constants";
import {FormControl, FormGroup, ListGroup, ListGroupItem, Panel} from "react-bootstrap";
import posTagger from 'wink-pos-tagger';

class AutoComplete extends Component {
    constructor(props) {
        super(props);

        this.state = {
            myText: props.hasOwnProperty("defaultValue") ? props.defaultValue : "",
            selectionStart: -1,
            selectionEnd: 0,
            grammarSuggestion: [],
            phraseSuggestion: [],
            focused: false
        };

        if (!props.onUpdateText || !props.onBlur)
            return new Error(`'onUpdateText' and 'onBlur' are required functions in props`);

        this.onUpdateText = props.onUpdateText;
        this.onBlur = props.onBlur;

        this.handleChange = this.handleChange.bind(this);
        this.onClickTextArea = this.onClickTextArea.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.setSuggestionDivRef = this.setSuggestionDivRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

    }

    render() {
        return (
            <div ref={this.setWrapperRef} className={"autoCompleteContainer"}>
                <form>
                    <FormGroup>
                        <FormControl componentClass="textarea" placeholder="Design Rule"
                                     style={{resize: "none"}}
                                     id={"queryText"}
                                     onClick={this.onClickTextArea}
                                     onChange={this.handleChange}
                                     onKeyUp={this.onKeyUp}
                                     onFocus={() => {
                                         this.suggestionDivRef.style.display = "block";
                                         this.setState({focused: true})
                                     }}
                                     value={this.state["myText"]}
                                     ref={(node) => this.queryText = node}
                        />
                        <div ref={this.setSuggestionDivRef} className={"suggestionDiv"}>
                            <Panel bsStyle="default">

                                {this.state.grammarSuggestion.length !== 0 || this.state.phraseSuggestion.length !== 0 ? null : (
                                    <Fragment>
                                        <Panel.Heading>
                                            <Panel.Title componentClass="h3">Templates</Panel.Title>
                                        </Panel.Heading>
                                        <ListGroup>
                                            {constants.templates.map((word, i) =>
                                                (<ListGroupItem key={i}>{word}</ListGroupItem>)
                                            )}
                                        </ListGroup>
                                    </Fragment>
                                )}

                                {this.state.grammarSuggestion.length === 0 ? null : (
                                    <Fragment>
                                        <Panel.Heading>
                                            <Panel.Title componentClass="h3">Grammar</Panel.Title>
                                        </Panel.Heading>
                                        <ListGroup>
                                            {this.state.grammarSuggestion.map((word, i) =>
                                                (<ListGroupItem key={i}
                                                                onClick={() => this.updateGrammarText(word.suggestion)}>
                                                    <span style={{color: "#999999"}}> {word.information} </span>
                                                    {word.suggestion}
                                                </ListGroupItem>)
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
                            </Panel>
                        </div>

                    </FormGroup>
                </form>
            </div>
        );
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        if (nextProps["caretPosition"] && nextProps["caretPosition"] !== -1) {
            let focus = nextProps["caretPosition"];
            this.grammarSuggestion(this.state.myText, -1, focus).then(data =>
                this.setState({
                        selectionStart: -1,
                        selectionEnd: focus,
                        grammarSuggestion: data,
                        phraseSuggestion: this.phraseSuggestion(this.state.myText, -1, focus)
                    },
                    () => this.setCaretPosition("queryText", focus),
                )
            );
        }
    }

    /**
     * update text and suggestion upon changing the text
     * @param e
     */
    handleChange(e) {
        let start = e.target.selectionStart === e.target.selectionEnd ? -1 : e.target.selectionStart;
        let end = e.target.selectionEnd;
        let newText = e.target.value;
        this.grammarSuggestion(e.target.value, start, end).then(data =>
            this.setState({
                    myText: newText,
                    selectionStart: start,
                    selectionEnd: end,
                    grammarSuggestion: data,
                    phraseSuggestion: this.phraseSuggestion(newText, start, end)
                },
                () => {
                    this.setCaretPosition("queryText", end);
                    this.onUpdateText(newText)
                })
        );
    }


    /**
     * update suggestion upon changing the caret/offset position
     * @param e
     */
    onClickTextArea(e) {
        let start = e.target.selectionStart === e.target.selectionEnd ? -1 : e.target.selectionStart;
        let end = e.target.selectionStart === e.target.selectionEnd ? e.target.selectionStart : e.target.selectionEnd;
        this.grammarSuggestion(this.state.myText, start, end).then(data =>
            this.setState({
                selectionStart: start,
                selectionEnd: end,
                grammarSuggestion: data,//this.grammarSuggestion(this.state.myText, start, end),//this.grammarSuggestion(e.target.value.slice(start, end)),
                phraseSuggestion: this.phraseSuggestion(this.state.myText, start, end)//e.target.value.slice(start, end))
            })
        );
    }


    /**
     * update suggestion upon moving the caret/offset by keyboard arrow keys
     * @param e
     */
    onKeyUp(e) {
        let start = e.target.selectionStart === e.target.selectionEnd ? -1 : e.target.selectionStart;
        let end = e.target.selectionStart === e.target.selectionEnd ? e.target.selectionStart : e.target.selectionEnd;
        let myText = e.target.value;

        if (e.keyCode === 37 || e.keyCode === 39) { // left and right arrows
            this.grammarSuggestion(e.target.value, start, end).then(data =>
                this.setState({
                    selectionStart: start,
                    selectionEnd: end,
                    grammarSuggestion: data,
                    phraseSuggestion: this.phraseSuggestion(myText, start, end)//e.target.value.slice(0, e.target.selectionStart))
                })
            );
        }
        // if (e.keyCode === 32) { // space
        // }

        // if (e.keyCode === 38) { // up
        // }

        // if (e.keyCode === 40) { // down
        // }
    }


    /**
     * For hiding the suggestion div
     */

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    setSuggestionDivRef(node) {
        this.suggestionDivRef = node;
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
     * @param selectionStart based on state.selectionStart
     * @param selectionEnd based on state.selectionEnd
     * @returns {Array} array of objects: suggestion: "", info:""
     */
    async grammarSuggestion(myText, selectionStart, selectionEnd) {

        // empty
        if (myText === "")
            return [];

        // let grammarWords = constants.keywords;
        let results = [];

        // selection
        if (selectionStart !== -1) {
            console.log("selection");
            // todo completion
        }
        else {
            let caretPosition = selectionEnd;
            let beforeCaret = caretPosition > 0 ? myText[caretPosition - 1] : null;
            let isMiddleOfWord = (beforeCaret !== " " && beforeCaret !== null);

            let wordsArray = [];

            /**
             * this block is only for cases when the last word is not finished yet
             * like: function where have an
             * because otherwise lemmatization will remove 'an' and 'a' and other determiners
             */
            if (isMiddleOfWord) {
                let arr = myText.slice(0, caretPosition).split(" ");
                let toAdd = arr.length > 0 ? arr[arr.length - 1] : "";
                let toLemmatize = arr.length > 1 ? arr.slice(0, arr.length - 1).join(" ") : "";
                wordsArray = toLemmatize !== "" ? (await this.lemmatizeWords(toLemmatize)).split(" ") : [];
                if (toAdd !== "") wordsArray.push(toAdd);
            }
            else {
                let text = myText.slice(0, caretPosition);
                wordsArray = text !== "" ? (await this.lemmatizeWords(text)).split(" ") : [];
            }

            let lastWord = wordsArray[wordsArray.length - 1];
            let lastWordIndex = wordsArray.length - 1;
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

            let isConnectorWord = ["where", "have", "must", "be", "equal", "to", "not", "and", "or", "include", "of", "(", ")"].indexOf(lastWord) !== -1;
            let isKeyword = constants.keywords.indexOf(lastWord) !== -1;

            // if the last word is random letters!
            if (!isConnectorWord && !isKeyword) lastWord = wordsArray.length >= 2 ? wordsArray[wordsArray.length - 2] : lastWord;
            if (!isConnectorWord && !isKeyword) lastWordIndex = wordsArray.length >= 2 ? wordsArray.length - 2 : lastWordIndex;
            let isSecondWord = lastWordIndex !== (wordsArray.length - 1);


            let xWord; // must be in constants.keywords
            let lastWhereIndex = wordsArray.lastIndexOf("where");
            let beforeSuggText = "", suggText = "",  infoText = "";

            /**
             * try to find 2-part keywords
             * @param index
             * @returns {*} keyword string
             */
            function selectXWord(index) {
                if (wordsArray.length < index + 1) return "";
                if (index > 0) {
                    if (wordsArray[index - 1] === "abstract" && wordsArray[index] === "function") return "abstract function";
                    if (wordsArray[index - 1] === "return" && wordsArray[index] === "value") return "return value";
                    if (wordsArray[index - 1] === "declaration" && wordsArray[index] === "statement") return "declaration statement";
                    if (wordsArray[index - 1] === "expression" && wordsArray[index] === "statement") return "expression statement";
                    if (wordsArray[index - 1] === "initial" && wordsArray[index] === "value") return "initial value";
                }
                if (wordsArray.length < index + 2) {
                    if (wordsArray[index] === "abstract" && wordsArray[index + 1] === "function") return "abstract function";
                    if (wordsArray[index] === "return" && wordsArray[index + 1] === "value") return "return value";
                    if (wordsArray[index] === "declaration" && wordsArray[index + 1] === "statement") return "declaration statement";
                    if (wordsArray[index] === "expression" && wordsArray[index + 1] === "statement") return "expression statement";
                    if (wordsArray[index] === "initial" && wordsArray[index + 1] === "value") return "initial value";
                }
                if (constants.keywords.indexOf(wordsArray[index])!== -1) return wordsArray[index];
                return "";
            }

            switch (lastWord) {
                case "where":
                    // … [X] where [based on X]
                    if (lastWordIndex < 1) return [];
                    xWord = selectXWord(lastWordIndex - 1);
                    if (xWord === "") return [];

                    let hasWhereHaveClause = !!constants.autoComplete_suggestion[xWord].whereHaveClause;

                    if(hasWhereHaveClause) {
                        if (isSecondWord) {
                            suggText = "have";
                            infoText = xWord + " where ";
                        }
                        else {
                            suggText = (isMiddleOfWord ? "where" : "") + " have";
                            infoText = xWord + (!isMiddleOfWord ? " where " : "");
                        }
                        results.push(AutoComplete.createGrammarSuggestion(suggText, infoText));
                    }
                    else {
                        if (isSecondWord) {
                            beforeSuggText = "";
                            infoText = xWord + " where";
                        }
                        else {
                            beforeSuggText = isMiddleOfWord ? "where" : "";
                            infoText = xWord + (!isMiddleOfWord ? " where " : "");
                        }
                        results = results.concat(this.whereSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));
                    }
                    break;

                case "have":
                    if (lastWordIndex < 2) return [];
                    // [X] … must have [based on X]
                    if (wordsArray[lastWordIndex - 1] === "must") {
                        xWord = selectXWord(0);
                        if (xWord === "") return [];

                        if (isSecondWord) {
                            beforeSuggText = "";
                            infoText = xWord + " must have";
                        }
                        else {
                            beforeSuggText = isMiddleOfWord ? "have" : "";
                            infoText = xWord + " must" + (!isMiddleOfWord ? " have" : "");
                        }
                        results = results.concat(this.whereSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));
                    }
                    // … [X] where ( … and have [based on X]
                    else {
                        if (lastWhereIndex < 1) return [];
                        xWord = selectXWord(lastWhereIndex - 1);
                        if (xWord === "") return [];

                        if (!constants.autoComplete_suggestion[xWord].whereHaveClause) return [];

                        if (isSecondWord) {
                            beforeSuggText = "";
                            infoText = xWord + " where have";
                        }
                        else {
                            beforeSuggText = isMiddleOfWord ? "have" : "";
                            infoText = xWord + " where" + (!isMiddleOfWord ? " have" : "");
                        }
                        results = results.concat(this.whereSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));
                    }

                    break;

                case "must":
                    if (lastWordIndex < 1) return [];
                    xWord = selectXWord(0);
                    if (xWord === "") return [];

                    // [X] … must have [based on X]
                    if (isSecondWord) {
                        beforeSuggText = "have";
                        infoText = xWord + " must";
                    }
                    else {
                        beforeSuggText = isMiddleOfWord ? "must have" : "have";
                        infoText = xWord + (!isMiddleOfWord ? " must" : "");
                    }
                    results = results.concat(this.whereSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));

                    // [X] … must be equal to [X]
                    suggText = (isConnectorWord && isMiddleOfWord) ? "must be equal to" : "be equal to";
                    infoText = (isConnectorWord && isMiddleOfWord) ? xWord : xWord + " must";
                    results.push(AutoComplete.createGrammarSuggestion(suggText, infoText));
                    break;

                case "be":
                    if (lastWordIndex < 2) return [];
                    //[X] … must be equal to [X]
                    if (wordsArray[lastWordIndex - 1] !== "must") return [];
                    xWord = selectXWord(0);
                    if (xWord === "") return [];

                    suggText = (isConnectorWord && isMiddleOfWord) ? "be equal to" : "equal to";
                    infoText = (isConnectorWord && isMiddleOfWord) ? xWord + " must" : xWord + " must be";
                    results.push(AutoComplete.createGrammarSuggestion(suggText, infoText));
                    break;

                case "equal":
                    if (lastWordIndex < 3) return [];

                    // [X] … must be equal to
                    if (wordsArray[lastWordIndex - 1] === "be") {
                        xWord = selectXWord(0);
                        if (xWord === "") return [];

                        suggText = (isConnectorWord && isMiddleOfWord) ? "equal to" : "to";
                        infoText = (isConnectorWord && isMiddleOfWord) ? xWord + " must be" : xWord + " must be equal";
                        results.push(AutoComplete.createGrammarSuggestion(suggText, infoText));
                    }

                    // … where … [X] not? equal to
                    else {
                        xWord = wordsArray[lastWordIndex - 1] === "not" ? selectXWord(lastWordIndex - 2) : selectXWord(lastWordIndex - 1);
                        if (xWord === "") return [];

                        results.push(AutoComplete.createGrammarSuggestion(((isConnectorWord && isMiddleOfWord) ? "equal " : "") + "to"
                            , xWord + (wordsArray[lastWordIndex - 1] === "not" ? " not" : "")));

                        suggText = (isConnectorWord && isMiddleOfWord) ? "equal to" : "to";
                        infoText = (isConnectorWord && isMiddleOfWord) ? "where " + xWord + (wordsArray[lastWordIndex - 1] === "not" ? " not" : "")
                            : "where " + xWord + (wordsArray[lastWordIndex - 1] === "not" ? " not" : "") + " equal";
                        results.push(AutoComplete.createGrammarSuggestion(suggText, infoText));
                    }
                    break;

                case "to":
                    if (wordsArray[lastWordIndex - 1] !== "equal") return [];

                    if (lastWordIndex < 3) return [];
                    // … [X] where equal to
                    if (wordsArray[lastWordIndex - 2] === "where") {
                        xWord = selectXWord(lastWordIndex - 3);
                        if (xWord === "") return [];
                    }

                    if (lastWordIndex < 4) return [];
                    // … [X] must be equal to [X]
                    if (wordsArray[lastWordIndex - 3] === "must" && wordsArray[lastWordIndex - 2] === "be") {
                        xWord = selectXWord(0);
                        if (xWord === "") return [];

                        suggText = (isConnectorWord && isMiddleOfWord) ? "to " + xWord : xWord;
                        infoText = (isConnectorWord && isMiddleOfWord) ? xWord + " must be equal" : xWord + " must be equal to";
                        results.push(AutoComplete.createGrammarSuggestion(suggText, infoText));
                        break;
                    }
                    // … [X] where not equal to
                    if (wordsArray[lastWordIndex - 3] === "where" && wordsArray[lastWordIndex - 2] === "not") {
                        xWord = selectXWord(lastWordIndex - 4);
                        if (xWord === "") return [];
                    }
                    // … [X] equal to
                    else {
                        xWord = selectXWord(lastWordIndex - 2);
                        if (xWord === "") return [];
                    }
                    break;

                case "not":
                    if (lastWordIndex < 1) return [];
                    xWord = constants.keywords.includes(selectXWord(lastWordIndex - 1)) ? selectXWord(lastWordIndex - 1) + " " : "";
                    suggText = (isConnectorWord && isMiddleOfWord) ? "not include" : "include";
                    infoText = (isConnectorWord && isMiddleOfWord) ? xWord : xWord + "not";
                    results.push(AutoComplete.createGrammarSuggestion(suggText, infoText));
                    suggText = (isConnectorWord && isMiddleOfWord) ? "not equal to" : "equal to";
                    results.push(AutoComplete.createGrammarSuggestion(suggText, infoText));
                    break;

                case "and":
                case "or":
                    let openParanIndex = this.findCorrespondingOpenParanIndex(wordsArray.slice(0).push(")"));

                    // … [X] where ( … and [based on X]
                    if (openParanIndex > 0) {
                        xWord = selectXWord(openParanIndex - 2);
                        if (xWord === "") return [];
                    }
                    // … [X] where … and [based on X]
                    else if (lastWhereIndex > 0) {
                        xWord = selectXWord(lastWordIndex - 1);
                        if (xWord === "") return [];
                    }

                    beforeSuggText = (isConnectorWord && isMiddleOfWord) ? lastWord : "";
                    infoText = (isConnectorWord && isMiddleOfWord) ? xWord + " where ... " : xWord + " where ... " + lastWord;
                    results = results.concat(this.whereSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));
                    break;

                case "include":
                    if (lastWordIndex < 2) return [];
                    // … [X] not? include
                    xWord = wordsArray[lastWordIndex - 1] === "not" ? selectXWord(lastWordIndex - 2) : selectXWord(lastWordIndex - 1);

                    suggText = (isConnectorWord && isMiddleOfWord) ? "include" : "";
                    infoText = (isConnectorWord && isMiddleOfWord) ? "where " + xWord + (wordsArray[lastWordIndex - 1] === "not" ? " not": "")
                        : "where " + xWord + (wordsArray[lastWordIndex - 1] === "not" ? " not": "") + " include";
                    results.push(AutoComplete.createGrammarSuggestion(suggText, infoText));
                    break;

                case "start":
                    if (lastWordIndex < 2) return [];
                    // … [X] not? start with
                    xWord = wordsArray[lastWordIndex - 1] === "not" ? selectXWord(lastWordIndex - 2) : selectXWord(lastWordIndex - 1);

                    suggText = (isConnectorWord && isMiddleOfWord) ? "start with" : "with";
                    infoText = (isConnectorWord && isMiddleOfWord) ? "where " + xWord + (wordsArray[lastWordIndex - 1] === "not" ? " not": "")
                        : "where " + xWord + (wordsArray[lastWordIndex - 1] === "not" ? " not": "") + " start with";
                    results.push(AutoComplete.createGrammarSuggestion(suggText, infoText));
                    break;

                case "end":
                    if (lastWordIndex < 2) return [];
                    // … [X] not? end with
                    xWord = wordsArray[lastWordIndex - 1] === "not" ? selectXWord(lastWordIndex - 2) : selectXWord(lastWordIndex - 1);

                    suggText = (isConnectorWord && isMiddleOfWord) ? "end with" : "with";
                    infoText = (isConnectorWord && isMiddleOfWord) ? "where " + xWord + (wordsArray[lastWordIndex - 1] === "not" ? " not": "")
                        : "where " + xWord + (wordsArray[lastWordIndex - 1] === "not" ? " not": "") + " end with";
                    results.push(AutoComplete.createGrammarSuggestion(suggText, infoText));
                    break;

                case "with":
                    if (lastWordIndex < 3) return [];
                    // … [X] not? end with
                    xWord = wordsArray[lastWordIndex - 2] === "not" ? selectXWord(lastWordIndex - 3) : selectXWord(lastWordIndex - 2);

                    suggText = (isConnectorWord && isMiddleOfWord) ? "with" : "";
                    infoText = (isConnectorWord && isMiddleOfWord) ? "where " + xWord + (wordsArray[lastWordIndex - 1] === "not" ? " not": "") + wordsArray[lastWordIndex - 1]
                        : "where " + xWord + (wordsArray[lastWordIndex - 1] === "not" ? " not ": "") + wordsArray[lastWordIndex - 1] + " with";
                    results.push(AutoComplete.createGrammarSuggestion(suggText, infoText));
                    break;

                case "(":
                    if (lastWordIndex < 2) return [];
                    if (lastWhereIndex < 1) return [];
                    // … [X] where ( [based on X]
                    xWord = selectXWord(lastWordIndex - 1);
                    if (xWord === "") return [];

                    beforeSuggText = "(";
                    infoText = xWord + " where";
                    results = results.concat(this.whereSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));
                    break;

                case ")":
                    if (lastWordIndex < 3) return [];
                    if (lastWhereIndex < 1) return [];
                    // … [X] where ( … ) of [based on X]
                    let corrOpenParanIndex =  this.findCorrespondingOpenParanIndex(wordsArray);
                    if (corrOpenParanIndex < 1) return [];
                    xWord = selectXWord(corrOpenParanIndex - 1);
                    if (xWord === "") return [];

                    beforeSuggText = ")";
                    infoText = xWord + " where ( ... " ;
                    results = results.concat(this.whereSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));

                    // [X]… <no must> … where ( … ) must have [based on X]
                    // [X]… <no must> … where ( … ) must be equal to [X]
                    if(!wordsArray.includes("must")) {
                        xWord = selectXWord(0);
                        if (xWord === "") return [];

                        beforeSuggText = ") must have";
                        infoText = xWord + " where ( ..." ;
                        results = results.concat(this.whereSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));

                        suggText = ") must be equal to " + xWord;
                        infoText = xWord + " where ( ...";
                        results.push(AutoComplete.createGrammarSuggestion(suggText, infoText));
                    }

                    break;

                case "of":
                    if (lastWordIndex < 1) return [];
                    // … [X] where ( … ) of [based on X]
                    if (wordsArray[lastWordIndex -1] === ")") {
                        let corrOpenParanIndex =  this.findCorrespondingOpenParanIndex(wordsArray);
                        if (corrOpenParanIndex < 2) return [];
                        if (wordsArray[corrOpenParanIndex - 1] !== "where") return [];
                        xWord = selectXWord(corrOpenParanIndex - 2);
                        if (xWord === "") return [];

                        suggText = (isConnectorWord && isMiddleOfWord) ? "of" : "";
                        infoText = (isConnectorWord && isMiddleOfWord) ? xWord + " where ( ... )" : xWord + " where ( ... ) of";
                        results = results.concat(this.ofSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));
                    }

                    // … must … [X] … of [based on X]
                    else {
                        let mustIndex = wordsArray.indexOf("must");
                        let arrayInput = mustIndex > 0 ? wordsArray.slice(mustIndex, wordsArray.length) : wordsArray;
                        let nouns = await this.findNounsInInput(arrayInput.join(" "));

                        nouns.forEach(d => {
                            xWord = d;
                            suggText = (isConnectorWord && isMiddleOfWord) ? "of" : "";
                            infoText = (isConnectorWord && isMiddleOfWord) ? xWord : xWord + " of";
                            results = results.concat(this.ofSuggestionCreator(xWord, beforeSuggText, infoText, isSecondWord, isSecondWord ? wordsArray[wordsArray.length - 1] : ""));
                        })
                    }
                    break;

                case "":
                    results = results.concat(constants.keywords
                        .map(d => AutoComplete.createGrammarSuggestion(d, "")));
                    break;

                default:
                    xWord = selectXWord(lastWordIndex) === "" ? lastWord : selectXWord(lastWordIndex);
                    constants.keywords
                        .filter(d => d.indexOf(xWord) !== -1)
                        .forEach(d => {
                            if(isMiddleOfWord && !isSecondWord) // still typing the keyword
                                results.push(AutoComplete.createGrammarSuggestion(d, ""));

                            else {
                                let hasWhereHaveClause = !!constants.autoComplete_suggestion[d].whereHaveClause;
                                suggText = (isMiddleOfWord) ?
                                    (isSecondWord ? "" : d + " ") + "where" + (hasWhereHaveClause ? " have" : "")
                                    : "where" + (hasWhereHaveClause ? " have" : "");
                                infoText = (isMiddleOfWord) ? (!isSecondWord ? "" : d) : d;
                                results.push(AutoComplete.createGrammarSuggestion(suggText, infoText));
                                // results = results.concat(this.whereSuggestionCreator(d, beforeSuggText, infoText, false));

                                suggText = (isMiddleOfWord) ? (isSecondWord ? "" : d + " ") + "of" : "of";
                                infoText = (isMiddleOfWord) ? (!isSecondWord ? "" : d) : d;
                                results.push(AutoComplete.createGrammarSuggestion(suggText, infoText));
                                // results = results.concat(this.ofSuggestionCreator(d, beforeSuggText, infoText, false));

                                if (!isSecondWord && wordsArray.indexOf("must") === -1) {
                                    suggText = (!isMiddleOfWord ? "" : d + " ") + "must be equal to" + (!isMiddleOfWord ? "" : d + " ");
                                    infoText = lastWordIndex !== 0 ? xWord : (isMiddleOfWord ? "" : d);
                                    results.push(AutoComplete.createGrammarSuggestion(suggText, infoText));

                                    suggText = (!isMiddleOfWord ? "" : d + " ") + "must have";
                                    infoText = lastWordIndex !== 0 ? xWord : (isMiddleOfWord ? "" : d);
                                    results.push(AutoComplete.createGrammarSuggestion(suggText, infoText));
                                    // results = results.concat(this.whereSuggestionCreator(wordsArray[0], beforeSuggText, infoText, false));
                                }
                            }
                        });
            }
        }
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
            let caretPosition = this.state.selectionEnd;
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
                focus = newText.length;
            }
        }
        //focus = caretPosition + suggestion.length;
        this.grammarSuggestion(newText, -1, focus).then(data =>
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
            )
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
        let phraseIndexArrays = wordsArray.map(d => constants.phrase_hash.hasOwnProperty(d) ? constants.phrase_hash[d] : []);
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
            results = constants.defined_phrases.filter((d, i) => intersection.includes(i))
                .map(d => AutoComplete.createPhraseSuggestion(d["replaceWordWith"], cnt));
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
        this.grammarSuggestion(newText, -1, focus).then(data =>
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
            )
        );
    }

    /**
     * find all names in the phrase
     * used for suggesting ofExpressions
     * @param input
     */
    findNounsInInput(input) {

        let nouns = [];
        const connector = new ConnectorServer({dsn: 'http://localhost:9000'});
        const props = new Properties({
            annotators: 'tokenize,ssplit,pos,lemma,ner,parse',
        });
        const pipeline = new Pipeline(props, 'English', connector);
        const sent = new CoreNLP.simple.Sentence(input);
        return pipeline.annotate(sent)
            .then(sent => {
                const tree = CoreNLP.util.Tree.fromSentence(sent);
                tree.visitLeaves(node => {
                    if (node.pos() === "NN" || node.pos() === "NNS")
                        nouns.push(node.token().lemma());
                });
                return Promise.resolve(nouns);
            })
            .catch(err => {
                console.log('err', err);
                return Promise.reject([]);
            });
    }


    /**
     *
     * @param input array of words and letters including "(" and ")"
     * @returns number index of "(" for ")" -2: error; -1: not found
     */
    findCorrespondingOpenParanIndex(input) {
        let openCloseParan = [];
        for (let i = input.length - 1; i > -1; i--) {
            if (input[i] === ")")
                openCloseParan.push(")");
            else if (input[i] === "(") {
                if (openCloseParan.length === 0)
                    return -2;
                else if (openCloseParan.length === 1)
                    return i;
                else
                    openCloseParan.pop();
            }
        }
        return -1;
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
        if (constants.keywords.includes(word)) {
            if (constants.autoComplete_suggestion[word].whereHaveClause)
                result = constants.autoComplete_suggestion[word].whereHaveClause;
            else
                result = constants.autoComplete_suggestion[word].whereClause;

            // check if filtering makes no result, ignore it
            if (result.filter(d => !doFilter ? true : d.startsWith(filterLetters)).length !== 0)
                result = result.filter(d => !doFilter ? true : d.startsWith(filterLetters));
            return result.map(d => AutoComplete.createGrammarSuggestion(beforeSugText + (beforeSugText !== "" ? " " : "") + d, infoText));
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
        if (constants.keywords.includes(word)) {
            return constants.autoComplete_suggestion[word].ofClause
                .filter(d => !doFilter ? true : d.startsWith(filterLetters))
                .map(d => AutoComplete.createGrammarSuggestion(beforeSugText + (beforeSugText !== "" ? " " : "") + d, infoText));
        }
        return [];
    };

    /**
     * lemmatize the words in the input string
     * @param input
     * @returns
     */
    lemmatizeWords(input) {
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

        let str = lemmatized.join(" ");
        str = AutoComplete.stringReplaceAll(str, "''", "");
        str = AutoComplete.stringReplaceAll(str, "`` ","" );
        return str;
    }

    /**
     * used for creating grammar suggestion objects, each row in suggestion auto-complete
     * @param text
     * @param info
     * @returns {{suggestion: *, information: *}}
     */
    static createGrammarSuggestion(text, info) {
        return {suggestion: text, information: info};
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

    /**
     *  same as Utilities.stringReplaceAll
     * @param str
     * @param search
     * @param replacement
     * @returns {string|XML|*|void}
     */
    static stringReplaceAll(str, search, replacement) {
        return str.replace(new RegExp(search, 'g'), replacement);
    };

}

export default AutoComplete;