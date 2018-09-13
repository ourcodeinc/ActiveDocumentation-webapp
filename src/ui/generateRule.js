/**
 * Created by saharmehrpour on 2/23/18.
 */

import React, {Component} from 'react';
import {connect} from "react-redux";
import '../App.css';

import {DropdownButton, MenuItem, HelpBlock} from 'react-bootstrap';
import {FormControl, Label, Button, FormGroup, ButtonToolbar} from 'react-bootstrap';
import {Row, Col} from 'react-bootstrap';
import TiDelete from 'react-icons/lib/ti/delete';

import antlr4 from 'antlr4/index';
import CoreNLP, {Properties, Pipeline, ConnectorServer} from 'corenlp';
import Traverse from './grammarRuleGen/generateXpath';

// import XPathGenerator from './ruleGen/xPathGenerator';
import Utilities from "../core/utilities";
import {constants} from "./constants";
import AutoComplete from "./grammarRuleGen/autoComplete";
import {submitNewRule} from "../actions";


class GenerateRule extends Component {

    constructor() {
        super();

        this.state = Utilities.cloneJSON(constants.initial_state);
        this.state.availableTags = [];
        this.state.autoCompleteText = "";
        this.state.quantifierXPath = "";
        this.state.constraintXPath = "";

    }

    render() {
        return (
            <div>
                {this.renderForm()}
                {/*<XPathGenerator key={new Date()} state={this.state}/>*/}
                <AutoComplete id={"raw_text"} ref={(autoComplete) => {
                    this.autoComplete = autoComplete;
                }} onBlur={() => this.verifyText()}/>
                <div style={{padding: "30px"}}>
                    {/*<Button bsStyle="primary" block onClick={() => this.verifyText()}>Verify</Button>*/}
                    <h4>Quantifier:</h4><span style={{wordWrap: "break-word"}}>{this.state.quantifierXPath}</span>
                    <h4>Constraint:</h4><span style={{wordWrap: "break-word"}}>{this.state.constraintXPath}</span>
                </div>

                <div>
                    <div style={{width: 200, float: "left", paddingRight: "5px"}}>
                        <Button bsStyle="primary" block onClick={() => this.onSubmitNewRule()}>Submit</Button>
                    </div>
                    <div style={{width: 200, float: "left"}}>
                        <Button bsStyle="default" block onClick={() => this.clearForm()}>Clear Form</Button>
                    </div>
                </div>
            </div>
        );
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps) !== JSON.stringify(this.state))
            this.setState({availableTags: nextProps.availableTags});
    }

    /**
     * render the form about rule title, description, tags, files, etc.
     * @returns {XML}
     */
    renderForm() {
        return (
            <div>
                <FormGroup validationState={(this.state.index === "") ? "error" : "success"}>
                    <div style={{padding: "10px 5px"}}>
                        <h4>Rule Index</h4>
                        <HelpBlock>The index is a key ID of the rule. It needs to be a unique integer.</HelpBlock>
                        <FormControl type="number" placeholder="Index" value={this.state.index}
                                     onChange={(e) => this.setState({index: e.target.value})}/>
                    </div>
                </FormGroup>
                <FormGroup validationState={(this.state.title === "") ? "error" : "success"}>
                    <div style={{padding: "10px 5px"}}>
                        <h4>Rule Title</h4>
                        <HelpBlock>Specify the rule title.</HelpBlock>
                        <FormControl componentClass="textarea" placeholder="Title"
                                     value={this.state.title}
                                     onChange={(e) => {
                                         this.setState({title: e.target.value})
                                     }}
                                     onKeyUp={(e) => {
                                         e.target.style.cssText = 'height:auto; padding:0';
                                         e.target.style.cssText = 'height:' + this.scrollHeight + 'px';
                                     }}/>
                    </div>
                </FormGroup>
                <FormGroup>
                    <div style={{padding: "10px 5px"}}>
                        <h4>Rule Description</h4>
                        <HelpBlock>More high level details about the rule.</HelpBlock>
                        <FormControl componentClass="textarea" placeholder="Description"
                                     value={this.state.description}
                                     onChange={(e) => {
                                         this.setState({description: e.target.value})
                                     }}
                                     onKeyUp={(e) => {
                                         e.target.style.cssText = 'height:auto; padding:0';
                                         e.target.style.cssText = 'height:' + this.scrollHeight + 'px';
                                     }}/>
                    </div>
                </FormGroup>
                <FormGroup>
                    <div style={{padding: "10px 5px", clear: "both"}}>
                        <h4>Rule Tags</h4>
                        <HelpBlock>Select the tags associated with this rule.</HelpBlock>
                        <div>{this.renderTags()}</div>
                    </div>
                </FormGroup>
                <FormGroup
                    validationState={(this.state.folderConstraint === "" || (this.state.folderConstraint === "FOLDER" && this.state.filesFolders.length === 0)) ? "error" : "success"}>
                    <div style={{padding: "10px 5px", clear: "both"}}>
                        <h4>Files/Folders</h4>
                        <HelpBlock>Select how the rules are verified; 'NONE' if the rule is verified on all files
                            and folders,
                            'FOLDER' if the rule is checked on specific folders/files. If the restriction is
                            'FOLDER',
                            at least one folder/file must be specified.</HelpBlock>
                        <div>{this.renderFileConstraints()}</div>
                    </div>
                </FormGroup>
            </div>
        );
    }


    /**
     * clear form
     */
    clearForm() {
        this.setState(JSON.parse(JSON.stringify(constants.initial_state)));
    }


    // submitNewRule() {
    //     let rule = {
    //         index: this.state.index,
    //         ruleTitle: this.state.title,
    //         description: this.state.description,
    //         tags: this.state.tags,
    //         ruleType: {
    //             constraint: this.state.folderConstraint,
    //             checkFor: this.state.filesFolders.filter((d) => d !== ""),
    //             type: "WITHIN"
    //         },
    //         quantifier: {},
    //         constraint: {}
    //     };
    //
    //     if (rule.index === "" || rule.ruleTitle === "" || rule.description === "") {
    //         console.log("empty fields");
    //         return;
    //     }
    //
    //     if (rule.ruleType.constraint === "" || (rule.ruleType.constraint === "FOLDER" && rule.ruleType.checkFor.length === 0)) {
    //         console.log("folder constraints are not specified");
    //         return;
    //     }
    //
    //     switch (this.state.xPathState.ruleType) {
    //         case "selected from one class":
    //             rule.quantifier = {detail: this.state.quantifierDetail, command: this.state.xPathState.q0};
    //             rule.ruleType.type = "WITHIN";
    //             break;
    //         case "selected from one class which is directed from another class":
    //             rule.quantifier = {
    //                 type: "FIND_FROM_TEXT",
    //                 detail: this.state.xPathState.quantifierDetail,
    //                 command1: this.state.xPathState.q0,
    //                 command2: this.state.xPathState.q1
    //             };
    //             rule.ruleType.type = "MIXED";
    //             break;
    //         case "selected from one class with the help of another class":
    //             rule.quantifier = {
    //                 type: "RETURN_TO_BASE",
    //                 detail: this.state.xPathState.quantifierDetail,
    //                 command1: this.state.xPathState.q0,
    //                 command2: this.state.xPathState.q1,
    //                 command3: this.state.xPathState.q2
    //             };
    //             rule.ruleType.type = "MIXED";
    //             break;
    //         default:
    //             console.log("quantifier is not specified");
    //             return;
    //
    //     }
    //
    //     switch (this.state.xPathState.cRuleType) {
    //         case "selected from one class":
    //             rule.constraint = {detail: this.state.xPathState.constraintDetail, command: this.state.xPathState.c0};
    //             break;
    //         case "selected from one class which is directed from another class":
    //             rule.constraint = {
    //                 type: "FIND_FROM_TEXT",
    //                 detail: this.state.xPathState.constraintDetail,
    //                 command1: this.state.xPathState.c0,
    //                 command2: this.state.xPathState.c1
    //             };
    //             break;
    //         case "selected from one class with the help of another class":
    //             rule.constraint = {
    //                 type: "RETURN_TO_BASE",
    //                 detail: this.state.xPathState.constraintDetail,
    //                 command1: this.state.xPathState.c0,
    //                 command2: this.state.xPathState.c1,
    //                 command3: this.state.xPathState.c2
    //             };
    //             break;
    //         default:
    //             console.log("condition is not specified");
    //             return;
    //
    //     }
    //
    //     Utilities.sendToServer(this.props.ws, "NEW_RULE", rule);
    //     this.clearForm();
    // }


    onSubmitNewRule() {
        let rule = {
            index: +this.state.index,
            title: this.state.title,
            description: this.state.description,
            tags: this.state.tags,
            ruleType: {
                constraint: this.state.folderConstraint,
                checkFor: this.state.filesFolders.filter((d) => d !== ""),
                type: "WITHIN"
            },
            quantifier: {},
            constraint: {}
        };

        if (rule.index === "" || rule.title === "" || rule.description === "") {
            console.log("empty fields");
            return;
        }

        if (rule.ruleType.constraint === "" || (rule.ruleType.constraint === "FOLDER" && rule.ruleType.checkFor.length === 0)) {
            console.log("folder constraints are not specified");
            return;
        }

        rule.quantifier = {detail: this.props.autoCompleteText, command: "src:unit/" + this.state.quantifierXPath};
        rule.constraint = {detail: this.props.autoCompleteText, command: "src:unit/" + this.state.constraintXPath};

        if (rule.quantifier === "" || rule.constraint === "") {
            console.log("XPaths are not specified");
            return;
        }

        this.props.onSubmitNewRule(rule);
        Utilities.sendToServer(this.props.ws, "NEW_RULE", rule);
        this.clearForm();

    }

    /**
     * create a dropdown for tags
     */
    renderTags() {
        return (
            <div>
                <div style={{paddingBottom: "10px"}}>
                    <DropdownButton title={"Select Tags"} id={"drop_down"}>
                        {this.state.availableTags.map((el, i) => {
                            if (this.state.tags.indexOf(el.tagName) === -1)
                                return (
                                    <MenuItem eventKey={el.tagName} key={i}
                                              onSelect={(evt) => {
                                                  const tags = this.state.tags;
                                                  tags.push(evt);
                                                  this.setState({tags})
                                              }}
                                    >{el.tagName}
                                    </MenuItem>);
                            return (null);
                        })}
                    </DropdownButton>
                </div>
                <div>
                    {this.state.tags.map((d, i) => {
                        return (
                            <div style={{float: "left", margin: "0 15px 10px 0"}} key={i}>
                                <Label>{d}</Label>
                                <TiDelete size={23}
                                          className={"tiDelete"}
                                          onClick={() => {
                                              const tags = this.state.tags;
                                              tags.splice(i, 1);
                                              this.setState({tags});
                                          }}/>
                            </div>)
                    })}
                </div>
            </div>
        )
    }


    /**
     * render the drop down for the file/folder constraint
     */
    renderFileConstraints() {
        return (
            <div>
                <div style={{paddingBottom: "10px"}}>
                    <em>{"Restriction:   "}</em>
                    <ButtonToolbar>
                        <DropdownButton
                            title={this.state.folderConstraint === "" ? "Select" : this.state.folderConstraint}
                            className={this.state.target} id={"drop_down"}>
                            <MenuItem eventKey={"FOLDER"} onSelect={(evt) => {
                                this.setState({folderConstraint: evt})
                            }}>FOLDER
                            </MenuItem>
                            <MenuItem eventKey={"NONE"} onSelect={(evt) => {
                                this.setState({folderConstraint: evt})
                            }}>NONE
                            </MenuItem>
                        </DropdownButton>
                        <Button onClick={() => {
                            const filesFolders = this.state.filesFolders;
                            filesFolders.push("");
                            this.setState({filesFolders});
                        }}>Add files/folders
                        </Button>
                    </ButtonToolbar>
                </div>
                <div>
                    {this.state.filesFolders.map((d, i) => {
                        console.log(d, i);
                        return (
                            <Row key={i} style={{paddingBottom: "5px"}}>
                                <Col sm={11} md={10}>
                                    <FormControl id={"filesFolders_textarea_" + i} type="text" defaultValue={d}
                                                 placeholder="relative File/Folder path"
                                                 onBlur={(e) => {
                                                     const filesFolders = this.state.filesFolders;
                                                     filesFolders[i] = e.target.value;
                                                     this.setState({filesFolders});
                                                 }}/>
                                </Col>
                                <Col sm={1} md={1} style={{paddingTop: "5px"}}>
                                    <TiDelete size={25}
                                              className={"tiDelete"}
                                              onClick={() => {
                                                  const filesFolders = this.state.filesFolders;
                                                  filesFolders.splice(i, 1);
                                                  this.setState({filesFolders});
                                              }}/>
                                </Col>
                            </Row>
                        )
                    })}
                </div>
            </div>
        )
    }


    /**
     * verify the text entered in AutoComplete based on Grammar
     */
    async verifyText() {

        //function where have annotation must have name where equal to ff

        let replacedPhrases = this.replacePhrase(this.props.autoCompleteText);
        let lemmatized = await this.lemmatize(replacedPhrases);
        let XPaths = this.antlr(lemmatized);
        this.setState({quantifierXPath: XPaths.quantifier, constraintXPath: XPaths.constraint});
    }

    /**
     * replace phrases based on stored phrases
     * @returns {string} replaced string
     */
    replacePhrase(input) {
        let keys = Object.keys(constants.replace_phrase);
        for (let j = 0; j < keys.length; j++)
            input = input.replace(keys[j], constants.replace_phrase[keys[j]]);
        return input;
    }


    /**
     * lemmatization returns base form of the verbs, make letters lower case, and singular form of nouns
     * it takes some time in the first run due to loading libraries
     * @param input
     * @returns Promise
     */
    lemmatize(input) {

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
    }


    /**
     * check the text against grammar and returns the XPaths for quantifier and constraint
     * @param input
     * @returns {*} {"quantifier": xpath, "constraint": xpath}
     */
    antlr(input) {

        let MyGrammarLexerModule = require('../generated-parser/myGrammarLexer');
        let MyGrammarParserModule = require('../generated-parser/myGrammarParser');

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

    }

}

function mapStateToProps(state) {

    return {
        rules: state.ruleTable,
        availableTags: state.tagTable,
        ws: state.ws,
        autoCompleteText: state.generateRule.autoCompleteText
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onSubmitNewRule: (newRuleProps) => {
            dispatch(submitNewRule(newRuleProps))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GenerateRule);
