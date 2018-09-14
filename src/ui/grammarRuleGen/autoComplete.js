import React, {Component} from 'react';
import {constants} from "../constants";
import {FormControl, FormGroup, ListGroup, ListGroupItem, Panel} from "react-bootstrap";

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
                        <FormControl componentClass="textarea" name="myCountry" placeholder="Design Rule"
                                     id={"queryText"}
                                     onClick={this.onClickTextArea}
                                     onChange={this.handleChange}
                                     onKeyUp={this.onKeyUp}
                                     onFocus={() => {
                                         this.suggestionDivRef.style.display = "block";
                                         this.setState({focused: true})
                                     }}
                                     value={this.state.myText}
                        />
                        <div ref={this.setSuggestionDivRef} className={"suggestionDiv"}>
                            <Panel bsStyle="default">

                                {this.state.grammarSuggestion.length !== 0 || this.state.phraseSuggestion.length !== 0 ? null :
                                    (<Panel.Heading>
                                        <Panel.Title componentClass="h3">Templates</Panel.Title>
                                    </Panel.Heading>)
                                }
                                {this.state.grammarSuggestion.length !== 0 || this.state.phraseSuggestion.length !== 0 ? null :
                                    <ListGroup>
                                        {constants.templates.map((word, i) =>
                                            (<ListGroupItem key={i} className={"item"}>{word}</ListGroupItem>)
                                        )}
                                    </ListGroup>
                                }

                                {this.state.grammarSuggestion.length === 0 ? null :
                                    (<Panel.Heading>
                                        <Panel.Title componentClass="h3">Grammar</Panel.Title>
                                    </Panel.Heading>)
                                }
                                <ListGroup>
                                    {this.state.grammarSuggestion.map((word, i) =>
                                        (<ListGroupItem key={i} className={"item"}
                                                        onClick={() => this.updateGrammarText(word)}>
                                            {word}
                                        </ListGroupItem>)
                                    )}
                                </ListGroup>
                                {this.state.phraseSuggestion.length === 0 ? null :
                                    (<Panel.Heading>
                                        <Panel.Title componentClass="h3">Phrase</Panel.Title>
                                    </Panel.Heading>)
                                }
                                <ListGroup>
                                    {this.state.phraseSuggestion.map((sug, i) =>
                                        (<ListGroupItem key={i} className={"item"}
                                                        onClick={() => this.updatePhraseText(sug)}>
                                            {sug.phraseText}
                                        </ListGroupItem>)
                                    )}
                                </ListGroup>
                            </Panel>
                        </div>

                    </FormGroup>
                </form>
            </div>
        );
    }

    /**
     * update text and suggestion upon changing the text
     * @param e
     */
    handleChange(e) {
        let start = e.target.selectionStart === e.target.selectionEnd ? -1 : e.target.selectionStart;
        let end = e.target.selectionEnd;
        let newText = e.target.value;
        this.setState({
                myText: newText,
                selectionStart: start,
                selectionEnd: end,
                grammarSuggestion: this.grammarSuggestion(e.target.value, start, end),
                phraseSuggestion: this.phraseSuggestion(e.target.value, start, end)
            },
            () => this.onUpdateText(newText));
    }


    /**
     * update suggestion upon changing the caret/offset position
     * @param e
     */
    onClickTextArea(e) {
        let start = e.target.selectionStart === e.target.selectionEnd ? -1 : e.target.selectionStart;
        let end = e.target.selectionStart === e.target.selectionEnd ? e.target.selectionStart : e.target.selectionEnd;

        this.setState({
            selectionStart: start,
            selectionEnd: end,
            grammarSuggestion: this.grammarSuggestion(this.state.myText, start, end),//this.grammarSuggestion(e.target.value.slice(start, end)),
            phraseSuggestion: this.phraseSuggestion(this.state.myText, start, end)//e.target.value.slice(start, end))
        });
    }


    /**
     * update suggestion upon moving the caret/offset by keyboard arrow keys
     * @param e
     */
    onKeyUp(e) {
        let start = e.target.selectionStart === e.target.selectionEnd ? -1 : e.target.selectionStart;
        let end = e.target.selectionStart === e.target.selectionEnd ? e.target.selectionStart : e.target.selectionEnd;

        if (e.keyCode === 37 || e.keyCode === 39) { // left and right arrows
            this.setState({
                selectionStart: start,
                selectionEnd: end,
                grammarSuggestion: this.grammarSuggestion(e.target.value, start, end),
                phraseSuggestion: this.phraseSuggestion(e.target.value, start, end)//e.target.value.slice(0, e.target.selectionStart))
            });
        }
        // if (e.keyCode === 32) { // space
        // }

        // if (e.keyCode === 38) { // up
        // }

        // if (e.keyCode === 40) { // down
        // }
    }


    /**
     *
     * @param myText full text
     * @param selectionStart based on state.selectionStart
     * @param selectionEnd based on state.selectionEnd
     * @returns {Array}
     */
    grammarSuggestion(myText, selectionStart, selectionEnd) {

        // empty
        if (myText === "")
            return [];

        let grammarWords = Object.keys(constants.grammar);
        let result = [];


        // selection
        if (selectionStart !== -1) {
            console.log("selection");
            // todo completion
        }
        else {
            let caretPosition = selectionEnd;
            let beforeCaret = caretPosition > 0 ? myText[caretPosition - 1] : null;
            let afterCaret = myText.length > caretPosition ? myText[caretPosition] : null;

            // middle of word (letter before && letter|null after) -> suggestion for completion of the word
            if (beforeCaret !== " " && afterCaret !== " ") {

                let wordArray = myText.slice(0, caretPosition).split(" ");
                let lastWord = wordArray[wordArray.length - 1];
                for (let w = 0; w < grammarWords.length; w++) {
                    if (grammarWords[w].indexOf(lastWord) !== -1 && grammarWords[w] !== lastWord) {
                        result.push(grammarWords[w]);
                    }
                }
            }

            // end of word (letter before && space after) -> suggestion for substitution
            else if (beforeCaret !== " " && afterCaret === " ") {

                let wordArray = myText.slice(0, caretPosition + 1).split(" ");
                let trimmedWordArray = wordArray.slice(0, wordArray.length - 2);
                let found = false;
                for (let cnt = 0; cnt < trimmedWordArray.length; cnt++) {
                    let query = trimmedWordArray.slice(cnt).join(" ");
                    for (let gr = 0; gr < grammarWords.length; gr++) {
                        if (grammarWords[gr] === query) {
                            result = result.concat(constants.grammar[grammarWords[gr]]);
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }
            }

            // beginning of word (space before && letter after) -> suggestion for completion
            else if (beforeCaret === " " || !afterCaret) {

                let wordArray = myText.slice(0, caretPosition).trim().split(" ");
                let found = false;
                for (let cnt = 0; cnt < wordArray.length; cnt++) {
                    let query = wordArray.slice(cnt).join(" ");
                    for (let gr = 0; gr < grammarWords.length; gr++) {
                        if (grammarWords[gr] === query) {
                            result = result.concat(constants.grammar[grammarWords[gr]]);
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }
            }
        }
        return result;
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
                newText = myText.slice(0, caretPosition) + suggestion + " ";
                focus = newText.length;
            }
        }
        //focus = caretPosition + suggestion.length;

        this.setState({
                myText: newText,
                selectionStart: -1,
                selectionEnd: focus,
                grammarSuggestion: this.grammarSuggestion(newText, -1, focus),
                phraseSuggestion: this.phraseSuggestion(newText, -1, focus)
            },
            () => this.setCaretPosition("queryText", focus),
            () => this.onUpdateText(newText)
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

        let phrases = Object.keys(constants.phrases);
        let wordList = myText.slice(selectionStart === -1 ? 0 : selectionStart, selectionEnd).split(" ");
        let result = [];

        for (let cnt = 0; cnt < wordList.length; cnt++) {
            let query = wordList.slice(cnt).join(" ");
            for (let ph = 0; ph < phrases.length; ph++) {
                if (phrases[ph].indexOf(query) !== -1 && phrases[ph] !== query) {
                    result.push({phraseText: phrases[ph], startWordIndex: cnt});
                }
                if (phrases[ph] === query) // avoiding loop
                    return result;
            }
        }
        return result;
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
            beforeSuggestion = myTextWords.slice(0, suggestion["startWordIndex"] - 1).join(" ");

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
        this.setState({
                myText: newText,
                selectionStart: -1,
                selectionEnd: focus,
                grammarSuggestion: this.grammarSuggestion(newText, -1, focus),
                phraseSuggestion: this.phraseSuggestion(newText, -1, focus)
            },
            () => this.setCaretPosition("queryText", focus),
            () => this.onUpdateText(newText)
        );
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

}

export default AutoComplete;