import antlr4 from "antlr4/index";
import posTagger from "wink-pos-tagger";

import Traverse from "./generateXPath";


/**
 * verify the text entered in AutoComplete based on Grammar
 */
export default async function verifyTextBasedOnGrammar(autoCompleteText) {
    if (autoCompleteText === "") return Promise.reject("EMPTY_FIELD");
    let returnValue = await lemmatize(autoCompleteText);
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
 * check the text against grammar and returns the XPaths for quantifier and constraint
 * @param input
 * @param clause {"full" | "partial"}
 * @returns {*} {"quantifier": xpath, "constraint": xpath}
 */
export const antlr = (input, clause="full") => {

    let inputText = input + "";
    let rulePadGrammarLexerModule = require("./generated-parser/rulePadGrammarLexer");
    let rulePadGrammarParserModule = require("./generated-parser/rulePadGrammarParser");

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

    let orgParser = new rulePadGrammarParserModule.rulePadGrammarParser(
        new antlr4.CommonTokenStream(
            new rulePadGrammarLexerModule.rulePadGrammarLexer(new antlr4.InputStream(input))));
    orgParser.buildParseTrees = true;
    orgParser.removeErrorListeners();
    orgParser.addErrorListener(listener);
    let orgTree = clause === "full" ? orgParser.inputSentence() : orgParser.partialClause();

    let chars = new antlr4.InputStream(input);
    let lexer = new rulePadGrammarLexerModule.rulePadGrammarLexer(chars);
    let tokens = new antlr4.CommonTokenStream(lexer);
    let parser = new rulePadGrammarParserModule.rulePadGrammarParser(tokens);
    parser.buildParseTrees = true;

    parser.removeErrorListeners();
    parser.addErrorListener(listener)
    let tree = clause === "full" ? parser.inputSentence() : parser.partialClause();

    if (errors.length !== 0)
        return {grammarErrors: errors, inputText: inputText, clause, tree};

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
 * @return {{grammarTree, error: boolean}|{listOfErrors, error: true}}
 */
export const verifyPartialTextBasedOnGrammar = (input) => {

    let rulePadGrammarLexerModule = require("./generated-parser/rulePadGrammarLexer");
    let rulePadGrammarParserModule = require("./generated-parser/rulePadGrammarParser");

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

    let orgParser = new rulePadGrammarParserModule.rulePadGrammarParser(
        new antlr4.CommonTokenStream(new rulePadGrammarLexerModule.rulePadGrammarLexer(
            new antlr4.InputStream(input))));
    orgParser.buildParseTrees = true;
    orgParser.removeErrorListeners();
    orgParser.addErrorListener(listener);
    let orgTree = orgParser.classes();

    if (errors.length !== 0)
        return {listOfErrors: errors, error: true};

    return {grammarTree: orgTree, error: false};

};