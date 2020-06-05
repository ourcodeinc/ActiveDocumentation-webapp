import antlr4 from "antlr4/index";
import posTagger from "wink-pos-tagger";

import Traverse from "./generateXPath";


/**
 * verify the text entered in AutoComplete based on Grammar
 */
export default async function verifyTextBasedOnGrammar(autoCompleteText) {
    if (autoCompleteText === "") return Promise.reject("EMPTY_FIELD");
    let replacedPhrases = replacePhrase(autoCompleteText);
    if (replacedPhrases === "") return Promise.reject("NO_INPUT_AFTER_REPLACING_PHRASES");
    let returnValue = await lemmatize(replacedPhrases);
    if (returnValue.lemmatized === "") return Promise.reject("NO_INPUT_AFTER_LEMMATIZATION");
    let returnedObj = antlr(returnValue.lemmatized.trim() + " ");
    if (returnedObj.hasOwnProperty("grammarErrors") || returnedObj.hasOwnProperty("xpathTraverseErrors"))
        return Promise.reject(returnedObj);
    return {
        quantifierXPath: returnedObj.results.quantifier,
        constraintXPath: returnedObj.results.constraint,
        grammarTree: returnedObj.grammarTree,
        wordArray: returnValue.wordArray.map(d => {
            return {id: "", text: d}
        })
    };
}

/**
 * replace phrases based on stored phrases
 * @returns {string} replaced string
 */
const replacePhrase = (input) => {
    // let keys = Object.keys(constants.replace_phrase);
    // for (let j = 0; j < keys.length; j++)
    //     input = input.replace(keys[j], constants.replace_phrase[keys[j]]);
    return input;
};


/**
 * lemmatization returns base form of the verbs, make letters lower case, and singular form of nouns
 * it takes some time in the first run due to loading libraries
 * @param input
 * @returns
 */
const lemmatize = (input) => {

    let tagger = posTagger();
    let pos = tagger.tagSentence(input);
    let lemmatized = [];
    let wordArray = [];
    pos.forEach(node => {
        if (node.pos !== "DT") {
            if (node.tag === "quoted_phrase" || node.value === "Superclass" || node.value === "Interface") { // exceptions
                lemmatized.push(node.value + " ");
                wordArray.push(node.value)
            }
            else if (node.tag === "punctuation") {
                lemmatized.push(node.value);
                wordArray.push(node.value)
            }
            else if (!node.lemma) {
                lemmatized.push(node.value + " ");
                wordArray.push(node.value);
            }
            else {
                lemmatized.push(node.lemma + " ");
                wordArray.push(node.lemma)
            }
        }
    });
    return {lemmatized: lemmatized.join("").trim(), wordArray: wordArray};
};


/**
 *  same as Utilities.stringReplaceAll
 * @param str
 * @param search
 * @param replacement
 * @returns {string|XML|*|void}
 */
// const stringReplaceAll = (str, search, replacement) => {
//     return str.replace(new RegExp(search, "g"), replacement);
// };

/**
 * check the text against grammar and returns the XPaths for quantifier and constraint
 * @param input
 * @returns {*} {"quantifier": xpath, "constraint": xpath}
 */
const antlr = (input) => {

    let inputText = input + "";
    let MyGrammarLexerModule = require("./generated-parser/myGrammarLexer");
    let MyGrammarParserModule = require("./generated-parser/myGrammarParser");

    let ErrorListener = function (errors) {
        antlr4.error.ErrorListener.call(this);
        this.errors = errors;
        return this;
    };

    ErrorListener.prototype = Object.create(antlr4.error.ErrorListener.prototype);
    ErrorListener.prototype.constructor = ErrorListener;
    ErrorListener.prototype.syntaxError = function (rec, sym, line, col, msg, e) {
        this.errors.push({rec: rec, sym: sym, line: line, col: col, msg: msg, e: e});
    };

    let errors = [];
    let listener = new ErrorListener(errors);

    let orgParser = new MyGrammarParserModule.myGrammarParser(new antlr4.CommonTokenStream(new MyGrammarLexerModule.myGrammarLexer(new antlr4.InputStream(input))));
    orgParser.buildParseTrees = true;
    orgParser.removeErrorListeners();
    orgParser.addErrorListener(listener);
    let orgTree = orgParser.inputSentence();

    let chars = new antlr4.InputStream(input);
    let lexer = new MyGrammarLexerModule.myGrammarLexer(chars);
    let tokens = new antlr4.CommonTokenStream(lexer);
    let parser = new MyGrammarParserModule.myGrammarParser(tokens);
    parser.buildParseTrees = true;

    parser.removeErrorListeners();
    parser.addErrorListener(listener);
    let tree = parser.inputSentence();

    if (errors.length !== 0)
        return {grammarErrors: errors, inputText: inputText};

    try {
        let traverse = new Traverse(tree);
        traverse.traverseTree();

        return {results: {quantifier: traverse.XPathQ, constraint: traverse.XPathC}, grammarTree: orgTree};
    }
    catch (error) {
        console.log(error);
        return {xpathTraverseErrors: error};
    }
};


/**
 * parse the input text without constraint
 * used in minedRules
 * @param input text based on grammar without constraint only from "classes" tokens
 * @return {{grammarTree: *}|{grammarErrors: Array, inputText: string}}
 */
export const verifyPartialTextBasedOnGrammar = (input) => {

    let MyGrammarLexerModule = require("./generated-parser/myGrammarLexer");
    let MyGrammarParserModule = require("./generated-parser/myGrammarParser");

    let ErrorListener = function (errors) {
        antlr4.error.ErrorListener.call(this);
        this.errors = errors;
        return this;
    };

    ErrorListener.prototype = Object.create(antlr4.error.ErrorListener.prototype);
    ErrorListener.prototype.constructor = ErrorListener;
    ErrorListener.prototype.syntaxError = function (rec, sym, line, col, msg, e) {
        this.errors.push({rec: rec, sym: sym, line: line, col: col, msg: msg, e: e});
    };

    let errors = [];
    let listener = new ErrorListener(errors);

    let orgParser = new MyGrammarParserModule.myGrammarParser(new antlr4.CommonTokenStream(new MyGrammarLexerModule.myGrammarLexer(new antlr4.InputStream(input))));
    orgParser.buildParseTrees = true;
    orgParser.removeErrorListeners();
    orgParser.addErrorListener(listener);
    let orgTree = orgParser.classes();

    if (errors.length !== 0)
        return {grammarErrors: errors, error: true, listOfErrors: errors};

    return {grammarTree: orgTree, error: false};

};