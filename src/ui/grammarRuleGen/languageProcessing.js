import antlr4 from 'antlr4/index';
import CoreNLP, {Properties, Pipeline, ConnectorServer} from 'corenlp';
import Traverse from '../grammarRuleGen/generateXpath';

/**
 * verify the text entered in AutoComplete based on Grammar
 */
export default async function verifyTextBasedOnGrammar(autoCompleteText) {
    if (autoCompleteText === "") return Promise.reject("EMPTY_FIELD");
    let replacedPhrases = replacePhrase(autoCompleteText);
    if (replacedPhrases === "") return Promise.reject("NO_INPUT_AFTER_REPLACING_PHRASES");
    let lemmatized = await lemmatize(replacedPhrases);
    if (lemmatized === "") return Promise.reject("NO_INPUT_AFTER_LEMMATIZATION");
    let returnedObj = antlr(lemmatized + " ");
    if (returnedObj.hasOwnProperty("grammarErrors") || returnedObj.hasOwnProperty("xpathTraverseErrors"))
        return Promise.reject(returnedObj);
    return {quantifierXPath: returnedObj.quantifier, constraintXPath: returnedObj.constraint};
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
 * @returns Promise
 */
const lemmatize = (input) => {

    let lemmatized = [];

    const connector = new ConnectorServer({dsn: 'http://localhost:9000'});
    const props = new Properties({
        annotators: 'tokenize,ssplit,pos,lemma,ner,parse',
    });
    const pipeline = new Pipeline(props, 'English', connector);
    const sent = new CoreNLP.simple.Sentence(input);
    return pipeline.annotate(sent)
        .then(sent => {
            // console.log('parse', sent.parse()); // constituency parsing string representation
            const tree = CoreNLP.util.Tree.fromSentence(sent);
            // console.log(JSON.parse(tree.dump()));
            tree.visitLeaves(node => {
                if (node.pos() !== "DT")
                    lemmatized.push(
                        node.token().index() > 2 && sent.word(node.token().index() - 2) === '``' ?
                            node.word() : node.token().lemma());
            });

            let str = lemmatized.join(" ");
            str = stringReplaceAll(str, " ''", "\"");
            str = stringReplaceAll(str, " and ", "  and "); // for extra spaces around and
            str = stringReplaceAll(str, " or ", "  or "); // for extra spaces around or
            str = stringReplaceAll(str, "`` ","\"" );
            str = stringReplaceAll(str, "-lrb-","(" );
            str = stringReplaceAll(str, "-rrb-",")" );

            return Promise.resolve(str);
        })
        .catch(err => {
            console.log('err', err);
            return Promise.reject("")
        });
};


/**
 *  same as Utilities.stringReplaceAll
 * @param str
 * @param search
 * @param replacement
 * @returns {string|XML|*|void}
 */
const stringReplaceAll = (str, search, replacement) => {
    return str.replace(new RegExp(search, 'g'), replacement);
};

/**
 * check the text against grammar and returns the XPaths for quantifier and constraint
 * @param input
 * @returns {*} {"quantifier": xpath, "constraint": xpath}
 */
const antlr = (input) => {

    let MyGrammarLexerModule = require('../../generated-parser/myGrammarLexer');
    let MyGrammarParserModule = require('../../generated-parser/myGrammarParser');

    let ErrorListener = function(errors) {
        antlr4.error.ErrorListener.call(this);
        this.errors = errors;
        return this;
    };

    ErrorListener.prototype = Object.create(antlr4.error.ErrorListener.prototype);
    ErrorListener.prototype.constructor = ErrorListener;
    ErrorListener.prototype.syntaxError = function(rec, sym, line, col, msg, e) {
        this.errors.push({rec:rec, sym:sym, line:line, col:col, msg:msg, e:e});
    };

    let errors = [];
    let listener = new ErrorListener(errors);


    let chars = new antlr4.InputStream(input);
    let lexer = new MyGrammarLexerModule.myGrammarLexer(chars);
    let tokens = new antlr4.CommonTokenStream(lexer);
    let parser = new MyGrammarParserModule.myGrammarParser(tokens);
    parser.buildParseTrees = true;

    parser.removeErrorListeners();
    parser.addErrorListener(listener);

    let tree = parser.inputSentence();

    if (errors.length !== 0)
        return {grammarErrors: errors};

    try {

        let traverse = new Traverse(tree, false);
        traverse.traverseTree();

        let quant = traverse.getQuantifierXPath();
        let constr = traverse.getConstraintXPath();

        if (constr === "") {

            let chars2 = new antlr4.InputStream(input);
            let lexer2 = new MyGrammarLexerModule.myGrammarLexer(chars2);
            let tokens2 = new antlr4.CommonTokenStream(lexer2);
            let parser2 = new MyGrammarParserModule.myGrammarParser(tokens2);
            parser2.buildParseTrees = true;
            let tree2 = parser2.inputSentence();
            let traverse2 = new Traverse(tree2, true);
            traverse2.traverseTree();
            constr = traverse2.getQuantifierXPath();
        }

        return {"quantifier": quant, "constraint": constr};

    }
    catch (error) {
        return {xpathTraverseErrors: error};
    }
};
