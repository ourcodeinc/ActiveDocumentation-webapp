import antlr4 from 'antlr4/index';
import CoreNLP, {Properties, Pipeline, ConnectorServer} from 'corenlp';
import Traverse from '../grammarRuleGen/generateXpath';

import {constants} from "../constants";
import Utilities from "../../core/utilities";

/**
 * verify the text entered in AutoComplete based on Grammar
 */
export default async function verifyTextBasedOnGrammar(autoCompleteText) {
    let replacedPhrases = replacePhrase(autoCompleteText);
    let lemmatized = await lemmatize(replacedPhrases);
    let XPaths = antlr(lemmatized);
    return {quantifierXPath: XPaths.quantifier, constraintXPath: XPaths.constraint};
}

/**
 * replace phrases based on stored phrases
 * @returns {string} replaced string
 */
const replacePhrase = (input) => {
    let keys = Object.keys(constants.replace_phrase);
    for (let j = 0; j < keys.length; j++)
        input = input.replace(keys[j], constants.replace_phrase[keys[j]]);
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
                // console.log(
                //     node.token().index() > 2 && sent.word(node.token().index() - 2) === '``' ? node.word() :
                //         //node.word(), node.pos(),
                //         // node.token().before() === '"' ? node.word() :
                //         node.token().lemma()
                //     // , node.token().index()
                //     //, node.token().ner()
                //     // , node.token().characterOffsetBegin(),node.token().characterOffsetEnd()
                //     // , sent.word(node.token().index()-1)
                //     // , sent.word(node.token().index()-2)
                // )
            });

            let index = lemmatized.indexOf("``");
            while (index !== -1) {
                if (index !== -1) lemmatized.splice(index, 1);
                index = lemmatized.indexOf("``");
            }
            index = lemmatized.indexOf("''");
            while (index !== -1) {
                if (index !== -1) lemmatized.splice(index, 1);
                index = lemmatized.indexOf("''");
            }
            return Promise.resolve(Utilities.stringReplaceAll(Utilities.stringReplaceAll(lemmatized.join(" "), "-lrb-", "("), "-rrb-", ")"));
        })
        .catch(err => {
            console.log('err', err);
            return Promise.reject("")
        });
};


/**
 * check the text against grammar and returns the XPaths for quantifier and constraint
 * @param input
 * @returns {*} {"quantifier": xpath, "constraint": xpath}
 */
const antlr = (input) => {

    let MyGrammarLexerModule = require('../../generated-parser/myGrammarLexer');
    let MyGrammarParserModule = require('../../generated-parser/myGrammarParser');

    let chars = new antlr4.InputStream(input);
    let lexer = new MyGrammarLexerModule.myGrammarLexer(chars);
    let tokens = new antlr4.CommonTokenStream(lexer);
    let parser = new MyGrammarParserModule.myGrammarParser(tokens);
    parser.buildParseTrees = true;
    let tree = parser.inputSentence();

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
        console.log("error")
    }

    return {"quantifier": "", "constraint": ""};

};
