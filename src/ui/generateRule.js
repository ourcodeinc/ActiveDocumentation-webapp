/**
 * Created by saharmehrpour on 2/23/18.
 */

import React, {Component} from 'react';
import {connect} from "react-redux";
import '../App.css';

import {DropdownButton, MenuItem, HelpBlock, Alert} from 'react-bootstrap';
import {FormControl, Label, Button, FormGroup, ButtonToolbar} from 'react-bootstrap';
import {Row, Col} from 'react-bootstrap';
import TiDelete from 'react-icons/lib/ti/delete';

import Utilities from "../core/utilities";
import AutoComplete from "./ruleGenerationText/autoComplete";
import {submitNewRule} from "../actions";
import verifyTextBasedOnGrammar from "./ruleGenerationText/languageProcessing";


class GenerateRule extends Component {

    static initial_state = {
        index: "",
        title: "",
        description: "",
        folderConstraint: "",
        filesFolders: [],
        tags: [],
        xPathState: {
            activeTab: "quantifier",
            quantifierDetail: "",
            ruleType: "",
            cRuleType: "",
            constraintDetail: "",
            quantifier: {
                q0: {
                    key: "",
                    value: "",
                    target: "follows",
                    children: {
                        "top": [],
                        "before": [],
                        "before_1": [],
                        "before_2": [],
                        "after": [],
                        "after_1": [],
                        "after_2": [],
                        "within": [],
                        "follows": {}
                    },
                    xpath: "src:class"
                },
                q1: {
                    key: "",
                    value: "",
                    target: "follows",
                    children: {
                        "top": [],
                        "before": [],
                        "before_1": [],
                        "before_2": [],
                        "after": [],
                        "after_1": [],
                        "after_2": [],
                        "within": [],
                        "follows": {}
                    },
                    xpath: "src:class"
                },
                q2: {
                    key: "",
                    value: "",
                    target: "follows",
                    children: {
                        "top": [],
                        "before": [],
                        "before_1": [],
                        "before_2": [],
                        "after": [],
                        "after_1": [],
                        "after_2": [],
                        "within": [],
                        "follows": {}
                    },
                    xpath: "src:class"
                }
            },
            constraint: {
                q0: {
                    key: "",
                    value: "",
                    target: "follows",
                    children: {
                        "top": [],
                        "before": [],
                        "before_1": [],
                        "before_2": [],
                        "after": [],
                        "after_1": [],
                        "after_2": [],
                        "within": [],
                        "follows": {}
                    },
                    xpath: "src:class"
                },
                q1: {
                    key: "",
                    value: "",
                    target: "follows",
                    children: {
                        "top": [],
                        "before": [],
                        "before_1": [],
                        "before_2": [],
                        "after": [],
                        "after_1": [],
                        "after_2": [],
                        "within": [],
                        "follows": {}
                    },
                    xpath: "src:class"
                },
                q2: {
                    key: "",
                    value: "",
                    target: "follows",
                    children: {
                        "top": [],
                        "before": [],
                        "before_1": [],
                        "before_2": [],
                        "after": [],
                        "after_1": [],
                        "after_2": [],
                        "within": [],
                        "follows": {}
                    },
                    xpath: "src:class"
                }
            },
            q0: "src:unit/src:class",
            q1: "src:unit/src:class",
            q2: "src:unit/src:class",
            c0: "src:unit/src:class",
            c1: "src:unit/src:class",
            c2: "src:unit/src:class"
        }
    };

    constructor() {
        super();

        this.state = Utilities.cloneJSON(GenerateRule.initial_state);
        this.state.availableTags = [];
        this.state.autoCompleteText = "";
        this.state.quantifierXPath = "";
        this.state.constraintXPath = "";

        this.state.error = "";
        this.autoCompleteCaretPosition = -1;
        this.state.showAlert = true;

    }

    render() {
        return (
            <div>
                {/*{this.renderForm()}*/}
                {/*<RuleGeneratorGui key={new Date()} state={this.state}/>*/}
                {this.state.error === "" ? null : !this.state.showAlert ? null : (
                    <Alert bsStyle={this.state.error.alertType}>
                        <h4>{this.state.error.errorType}</h4>
                        <h6>{this.state.error.message}</h6>
                        <ButtonToolbar>
                            <Button onClick={() => this.setState({error: ""})}>Got it!</Button>
                            <Button onClick={() => this.setState({showAlert: false})}>Hide Alerts</Button>
                        </ButtonToolbar>
                    </Alert>
                )}
                {this.state.showAlert ? null : (
                    <div style={{paddingBottom: "10px"}}>
                        <Button onClick={() => this.setState({showAlert: true})}>Show Alerts</Button>
                    </div>
                )}

                <AutoComplete ref={(autoComplete) => this.autoComplete = autoComplete}
                              onBlur={() =>
                                  verifyTextBasedOnGrammar(this.state.autoCompleteText)
                                      .then((data) => this.processLanguageProcessingData(data))
                                      .catch((error) => this.processLanguageProcessingError(error))
                              }
                              onUpdateText={(text) => this.setState({autoCompleteText: text})}
                              caretPosition={(() => {
                                  let newFocus = this.autoCompleteCaretPosition;
                                  this.autoCompleteCaretPosition = -1;
                                  return newFocus;
                              })()}/>
                <div style={{padding: "30px"}}>
                    {/*<Button bsStyle="primary" block onClick={() => this.verifyText()}>Verify</Button>*/}
                    <h4>Quantifier:</h4><span style={{wordWrap: "break-word"}}>{this.state.quantifierXPath}</span>
                    <h4>Constraint:</h4><span style={{wordWrap: "break-word"}}>{this.state.constraintXPath}</span>
                </div>

                {/*<div>*/}
                    {/*<div style={{width: 200, float: "left", paddingRight: "5px"}}>*/}
                        {/*<Button bsStyle="primary" block onClick={() => this.onSubmitNewRule()}>Submit</Button>*/}
                    {/*</div>*/}
                    {/*<div style={{width: 200, float: "left"}}>*/}
                        {/*<Button bsStyle="default" block onClick={() => this.clearForm()}>Clear Form</Button>*/}
                    {/*</div>*/}
                {/*</div>*/}
            </div>
        );
    }

    /**
     * process the data received by running verifyTextBasedOnGrammar on autoComplete text
     * @param data
     */
    processLanguageProcessingData(data) {
        this.setState(Object.assign({}, data, {error: ""}));
    }

    /**
     * process the error received by running verifyTextBasedOnGrammar on autoComplete text
     * @param error
     */
    processLanguageProcessingError(error) {
        switch (error) {
            case "EMPTY_FIELD":
                this.setState({
                    error: {
                        errorType: "Empty Field",
                        message: "The design rule input must not be empty",
                        alertType: "warning"
                    }
                });
                break;
            case "NO_INPUT_AFTER_REPLACING_PHRASES":
                this.setState({
                    error: {
                        errorType: "Incorrect Input",
                        message: "The used phrases are incorrect. Try using different phrases.",
                        alertType: "danger"
                    }
                });
                break;
            case "NO_INPUT_AFTER_LEMMATIZATION":
                this.setState({
                    error: {
                        errorType: "Incorrect Input",
                        message: "The words used in the design rule are not compatible with CoreNLP library.",
                        alertType: "danger"
                    }
                });
                break;
            /**
             * {grammarErrors: [{rec, sym, line, col, msg, e}]}
             * or
             * {xpathTraverseErrors: errorMessage}
             */
            default:
                if (error.grammarErrors) {
                    let grammarError = error.grammarErrors[0];
                    this.autoCompleteCaretPosition = error.grammarErrors[0].col;
                    this.setState({
                        error: {
                            errorType: "Grammar Error",
                            message: grammarError.e.ctx.constructor.name
                            + (grammarError.e.ctx.parentCtx !== null ? (" in " + grammarError.e.ctx.parentCtx.constructor.name) : "")
                            + ", character " + error.grammarErrors[0].col,
                            alertType: "danger"
                        }
                    });
                }
                else
                    this.setState({
                        error: {
                            errorType: "error",
                            message: "",
                            alertType: "danger"
                        }
                    });
                break;
        }
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
        this.setState(JSON.parse(JSON.stringify(GenerateRule.initial_state)));
    }


    /**
     * submit the new rule
     */
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
            constraint: {},
            grammar: this.state.autoCompleteText
        };

        rule.quantifier = {detail: "", command: "src:unit/" + this.state.quantifierXPath};
        rule.constraint = {detail: "", command: "src:unit/" + this.state.constraintXPath};


        if (rule.index === "" || rule.title === "" || rule.description === "") {
            console.log("empty fields");
            return;
        }

        if (rule.ruleType.constraint === "" || (rule.ruleType.constraint === "FOLDER" && rule.ruleType.checkFor.length === 0)) {
            console.log("folder constraints are not specified");
            return;
        }

        if (this.state.quantifierXPath === "" || this.state.constraintXPath === "") {
            console.log("XPaths are not specified");
            return;
        }

        this.props.onSubmitNewRule(rule);
        Utilities.sendToServer(this.props.ws, "NEW_RULE", rule);
        this.clearForm();
        window.location.hash = "#/rule/" + rule.index;

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
                            <div className={"tagLabel"} key={i}>
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

}

function mapStateToProps(state) {

    return {
        rules: state.ruleTable, // redundant
        availableTags: state.tagTable,
        ws: state.ws
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onSubmitNewRule: (newRule) => {
            dispatch(submitNewRule(newRule))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GenerateRule);
