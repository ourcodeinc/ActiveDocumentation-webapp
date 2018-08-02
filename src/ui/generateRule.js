/**
 * Created by saharmehrpour on 2/23/18.
 */

import React from 'react';
import '../App.css';

import * as d3 from 'd3';
import PubSub from 'pubsub-js';
import {DropdownButton, MenuItem, HelpBlock, Tabs, Tab} from 'react-bootstrap';
import {FormControl, Label, Button, FormGroup, ButtonToolbar} from 'react-bootstrap';
import {Row, Col} from 'react-bootstrap';
import ClassFragment from './ruleGen/classFragment';

import TiDelete from 'react-icons/lib/ti/delete';

import Utilities from "../core/utilities";


class GenerateRule extends React.Component {

    constructor() {
        super();
        this.attachListener();

        this.state = {
            index: "",
            title: "",
            description: "",
            tags: [
                {
                    "detail": "rules about artifact classes. These classes are entities and are persisted by \"Objectify\"",
                    "tagName": "Artifact"
                },
                {
                    "detail": "rules about Microtasks",
                    "tagName": "Microtask"
                },
                {
                    "detail": "rules about \"Command\" classes and their subclasses, methods and method calls.",
                    "tagName": "Command"
                },
                {
                    "detail": "rules about Sharding and policies about persisting data \nDefinition: Sharding is a process of ensuring that computation done in different classes does not require data from other classes. Sharding is a process of finding different portions of the runtime execution states that can be executed in parallel.\nHere is this region of data and we are going to do computation on this data without requiring other data\nReason: Rather than having one process that require the whole data, you can have separate processes that are doing different computation on different regions in isolation, so it makes it easy to parallelize\nHow to do parallelism",
                    "tagName": "Sharding"
                },
                {
                    "detail": "rules about entity classes and subclasses, i.e. those classes annotated with \"Entity\" and \"Subclass\". Entity objects are persisted by \"Objectify\"",
                    "tagName": "Entity"
                },
                {
                    "detail": "rules about Objectify and Objectify method calls which are needed for persisting data",
                    "tagName": "Objectify"
                },
                {
                    "detail": "rules about Data Transfer Object\nWe need some subset of the state of the class that is important and needed to be persisted. \nSome other parts of the state is a volatile state or not important and can be reconstructed. \nWhen part of a class is persisted (in Firebase) or transferred to a client.",
                    "tagName": "DTO"
                },
                {
                    "detail": "rules about serialization required for persisting data",
                    "tagName": "Serialization"
                },
                {
                    "detail": "rules about arguments and body of class constructors",
                    "tagName": "Constructor"
                }
            ],
            folderConstraint: "",
            filesFolders: [],
            selectedTags: [],
            ws: null,
            ruleType: "",
            cRuleType: "",
            activeTab: "quantifier",
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
            quantifierDetail: "",
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
            constraintDetail: "",
            q0: "src:unit/src:class",
            q1: "src:unit/src:class",
            q2: "src:unit/src:class",
            c0: "src:unit/src:class",
            c1: "src:unit/src:class",
            c2: "src:unit/src:class"
        };

    }

    render() {
        return (
            <div>
                {this.renderForm()}
                {this.renderTabs()}
                <div>
                    <div style={{width: 200, float: "left", paddingRight: "5px"}}>
                        <Button bsStyle="primary" block onClick={() => this.submitNewRule()}>Submit</Button>
                    </div>
                    <div style={{width: 200, float: "left"}}>
                        <Button bsStyle="default" block onClick={() => this.clearForm()}>Clear Form</Button>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * subscribe for events
     */
    attachListener() {

        // [ws]
        PubSub.subscribe('NEW_WS', (msg, data) => {
            this.setState({ws: data[0]});
        });

        // [hash value]
        PubSub.subscribe('HASH', (msg, data) => {
            if (data[0] === 'genRule')
                d3.select('#generateRule').classed('hidden', false);
            else
                d3.select('#generateRule').classed('hidden', true);

        });

        // called in RuleExecutor.checkRulesForAll() and RuleExecutor.checkRules_org()
        // [ruleTable, tagTable]
        PubSub.subscribe('DISPLAY_RULES', (msg, data) => {
            this.setState({tags: data[1]});
        });

        // [tagTable, newTag]
        PubSub.subscribe('UPDATE_TAG', (msg, data) => {
            this.setState({tags: data[0]});
        });

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
     * render the quantifier and constraint tabs
     * @returns {XML}
     */
    renderTabs() {
        return (
            <div style={{clear: "both", marginTop: "20px"}}>
                <Tabs animation={true} id={"gen_rule_quantifier_constraint"} activeKey={this.state.activeTab}
                      onSelect={(key) => this.setState({activeTab: key})}>
                    <Tab eventKey={"quantifier"} title={"Quantifier Query"} animation={true}>
                        <div style={{marginTop: "10px"}}>
                            <HelpBlock>The quantifier query finds the matches that the rules must be applied on.
                                Provide details about the quantifier.</HelpBlock>
                            <FormControl componentClass="textarea" value={this.state.quantifierDetail}
                                         placeholder="Detail about quantifier"
                                         onChange={(e) => {
                                             this.setState({quantifierDetail: e.target.value})
                                         }}
                                         onKeyUp={(e) => {
                                             e.target.style.cssText = 'height:auto; padding:0';
                                             e.target.style.cssText = 'height:' + e.target.scrollHeight + 'px';
                                         }}/>

                            <div style={{marginTop: "5px"}}>
                                <em>{"Select the type of the quantifier: "}</em>
                                <DropdownButton title={this.state.ruleType} id="dropdown-size-medium">
                                    <MenuItem key={"one-class"} eventKey={"selected from one class"}
                                              onSelect={(evt) => this.setState({ruleType: evt, cRuleType: evt})}
                                    >{"selected from one class"}</MenuItem>
                                    <MenuItem key={"two-class"}
                                              eventKey={"selected from one class which is directed from another class"}
                                              onSelect={(evt) => this.setState({ruleType: evt, cRuleType: evt})}
                                    >{"selected from one class which is directed from another class"}</MenuItem>
                                    <MenuItem key={"two-class-returning"}
                                              eventKey={"selected from one class with the help of another class"}
                                              onSelect={(evt) => this.setState({ruleType: evt, cRuleType: evt})}
                                    >{"selected from one class with the help of another class"}</MenuItem>
                                </DropdownButton>
                            </div>

                            <div style={{marginTop: "10px"}}>{this.createQuantifierDivs()}</div>
                        </div>
                    </Tab>

                    <Tab eventKey={"constraint"} title={"Constraint Query"} animation={true}>
                        <div style={{marginTop: "10px"}}>
                            <HelpBlock>The constraint query verifies that the rule is satisfied by the matches.
                                Provide details about the quantifier.</HelpBlock>
                            <FormControl componentClass="textarea" value={this.state.constraintDetail}
                                         placeholder="Detail about conditioned"
                                         onChange={(e) => {
                                             this.setState({constraintDetail: e.target.value})
                                         }}
                                         onKeyUp={(e) => {
                                             e.target.style.cssText = 'height:auto; padding:0';
                                             e.target.style.cssText = 'height:' + e.target.scrollHeight + 'px';
                                         }}/>

                            <em>{"Select the type of the constraint: "}</em>
                            <DropdownButton title={this.state.cRuleType} id="dropdown-size-medium">
                                <MenuItem key={"one-class"} eventKey={"selected from one class"}
                                          onSelect={(evt) => this.setState({cRuleType: evt})}
                                >{"selected from one class"}</MenuItem>
                                <MenuItem key={"two-class"}
                                          eventKey={"selected from one class which is directed from another class"}
                                          onSelect={(evt) => this.setState({cRuleType: evt})}
                                >{"selected from one class which is directed from another class"}</MenuItem>
                                <MenuItem key={"two-class-returning"}
                                          eventKey={"selected from one class with the help of another class"}
                                          onSelect={(evt) => this.setState({cRuleType: evt})}
                                >{"selected from one class with the help of another class"}</MenuItem>
                            </DropdownButton>

                            <div style={{marginTop: "10px"}}>{this.createConstraintDivs()}</div>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        );
    }

    /**
     * clear form
     */
    clearForm() {
        this.setState({
            index: "",
            title: "",
            description: "",
            folderConstraint: "",
            filesFolders: [],
            selectedTags: [],
            ruleType: "",
            cRuleType: "",
            activeTab: "quantifier",
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
            quantifierDetail: "",
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
            constraintDetail: "",
            q0: "src:unit/src:class",
            q1: "src:unit/src:class",
            q2: "src:unit/src:class",
            c0: "src:unit/src:class",
            c1: "src:unit/src:class",
            c2: "src:unit/src:class"
        });
    }


    submitNewRule() {
        let rule = {
            index: this.state.index,
            ruleTitle: this.state.title,
            description: this.state.description,
            tags: this.state.selectedTags,
            ruleType: {
                constraint: this.state.folderConstraint,
                checkFor: this.state.filesFolders.filter((d) => d !== ""),
                type: "WITHIN"
            },
            quantifier: {},
            conditioned: {}
        };

        if (rule.index === "" || rule.ruleTitle === "" || rule.description === "") {
            console.log("empty fields");
            return;
        }

        if (rule.ruleType.constraint === "" || (rule.ruleType.constraint === "FOLDER" && rule.ruleType.checkFor.length === 0)) {
            console.log("folder constraints are not specified");
            return;
        }

        switch (this.state.ruleType) {
            case "selected from one class":
                rule.quantifier = {detail: this.state.quantifierDetail, command: this.state.q0};
                rule.ruleType.type = "WITHIN";
                break;
            case "selected from one class which is directed from another class":
                rule.quantifier = {
                    type: "FIND_FROM_TEXT",
                    detail: this.state.quantifierDetail,
                    command1: this.state.q0,
                    command2: this.state.q1
                };
                rule.ruleType.type = "MIXED";
                break;
            case "selected from one class with the help of another class":
                rule.quantifier = {
                    type: "RETURN_TO_BASE",
                    detail: this.state.quantifierDetail,
                    command1: this.state.q0,
                    command2: this.state.q1,
                    command3: this.state.q2
                };
                rule.ruleType.type = "MIXED";
                break;
            default:
                console.log("quantifier is not specified");
                return;

        }

        switch (this.state.cRuleType) {
            case "selected from one class":
                rule.conditioned = {detail: this.state.constraintDetail, command: this.state.c0};
                break;
            case "selected from one class which is directed from another class":
                rule.conditioned = {
                    type: "FIND_FROM_TEXT",
                    detail: this.state.constraintDetail,
                    command1: this.state.c0,
                    command2: this.state.c1
                };
                break;
            case "selected from one class with the help of another class":
                rule.conditioned = {
                    type: "RETURN_TO_BASE",
                    detail: this.state.constraintDetail,
                    command1: this.state.c0,
                    command2: this.state.c1,
                    command3: this.state.c2
                };
                break;
            default:
                console.log("condition is not specified");
                return;

        }

        Utilities.sendToServer(this.state.ws, "NEW_RULE", rule);
        this.clearForm();
    }

    /**
     * render the div for quantifier query
     * @returns {XML}
     */
    createQuantifierDivs() {
        switch (this.state.ruleType) {
            case "selected from one class":
                return (
                    <div>
                        <form><ClassFragment assignedId={"class_0"} ws={this.state.ws}
                                             key={new Date()} state={this.state.quantifier.q0}
                                             callbackFromParent={this.receiveStateData0}/></form>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_quant_0"}>{this.state.q0}</code>
                        </div>
                    </div>
                );
            case "selected from one class which is directed from another class":
                return (
                    <div>
                        <form><ClassFragment assignedId={"class_0"} ws={this.state.ws}
                                             key={new Date()} state={this.state.quantifier.q0}
                                             callbackFromParent={this.receiveStateData0}/></form>
                        <HelpBlock>The innermost <span style={{color: "#2aabd2"}}>blue</span> box (output of this query)
                            must be <code>text()</code></HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_quant_0"}>{this.state.q0}</code>
                        </div>
                        <form><ClassFragment assignedId={"class_1"} ws={this.state.ws}
                                             key={new Date()} state={this.state.quantifier.q1}
                                             callbackFromParent={this.receiveStateData1}/></form>
                        <HelpBlock>Use <code>&#60;TEMP&#62;</code> to refer to the
                            output of the previous query.</HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_quant_1"}>{this.state.q1}</code>
                        </div>
                    </div>
                );
            case "selected from one class with the help of another class":
                return (
                    <div>

                        <form><ClassFragment assignedId={"class_0"} ws={this.state.ws}
                                             key={new Date()} state={this.state.quantifier.q0}
                                             callbackFromParent={this.receiveStateData0}/></form>
                        <HelpBlock>The innermost <span style={{color: "#2aabd2"}}>blue</span> box (output of this query)
                            must be <code>text()</code></HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_quant_0"}>{this.state.q0}</code>
                        </div>

                        <form><ClassFragment assignedId={"class_1"} ws={this.state.ws}
                                             key={new Date()} state={this.state.quantifier.q1}
                                             callbackFromParent={this.receiveStateData1}/></form>
                        <HelpBlock>The innermost <span style={{color: "#2aabd2"}}>blue</span> box (output of this query)
                            must be <code>text()</code>.
                            Use <code>&#60;TEMP&#62;</code> to refer to the
                            output of the previous query.</HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_quant_1"}>{this.state.q1}</code>
                        </div>

                        <form><ClassFragment assignedId={"class_2"} ws={this.state.ws}
                                             key={new Date()} state={this.state.quantifier.q2}
                                             callbackFromParent={this.receiveStateData2}/></form>
                        <HelpBlock>Use <code>&#60;TEMP&#62;</code> to refer to the
                            output of the previous query.</HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_quant_2"}>{this.state.q2}</code>
                        </div>
                    </div>
                );
            default:
                return (<div/>)
        }
    }

    /**
     * render the div for constraint query
     * @returns {XML}
     */
    createConstraintDivs() {
        switch (this.state.cRuleType) {
            case "selected from one class":
                return (
                    <div>
                        <form><ClassFragment assignedId={"c_class_0"} ws={this.state.ws}
                                             key={new Date()} state={this.state.constraint.q0}
                                             callbackFromParent={this.receiveCStateData0}/></form>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_constr_0"}>{this.state.c0}</code>
                        </div>
                    </div>
                );
            case "selected from one class which is directed from another class":
                return (
                    <div>
                        <form><ClassFragment assignedId={"c_class_0"} ws={this.state.ws}
                                             key={new Date()} state={this.state.constraint.q0}
                                             callbackFromParent={this.receiveCStateData0}/></form>
                        <HelpBlock>The innermost <span style={{color: "#2aabd2"}}>blue</span> box (output of this query)
                            must be <code>text()</code></HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_constr_0"}>{this.state.c0}</code>
                        </div>
                        <form><ClassFragment assignedId={"c_class_1"} ws={this.state.ws}
                                             key={new Date()} state={this.state.constraint.q1}
                                             callbackFromParent={this.receiveCStateData1}/></form>
                        <HelpBlock>Use <code>&#60;TEMP&#62;</code> to refer to the
                            output of the previous query.</HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_constr_1"}>{this.state.c1}</code>
                        </div>
                    </div>
                );
            case "selected from one class with the help of another class":
                return (
                    <div>
                        <form><ClassFragment assignedId={"c_class_0"} ws={this.state.ws}
                                             key={new Date()} state={this.state.constraint.q0}
                                             callbackFromParent={this.receiveCStateData0}/></form>
                        <HelpBlock>The innermost <span style={{color: "#2aabd2"}}>blue</span> box (output of this query)
                            must be <code>text()</code></HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_constr_0"}>{this.state.c0}</code>
                        </div>
                        <form><ClassFragment assignedId={"c_class_1"} ws={this.state.ws}
                                             key={new Date()} state={this.state.constraint.q1}
                                             callbackFromParent={this.receiveCStateData1}/></form>
                        <HelpBlock>The innermost <span style={{color: "#2aabd2"}}>blue</span> box (output of this query)
                            must be <code>text()</code>.
                            Use <code>&#60;TEMP&#62;</code> to refer to the
                            output of the previous query.</HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_constr_1"}>{this.state.c1}</code>
                        </div>
                        <form><ClassFragment assignedId={"c_class_2"} ws={this.state.ws}
                                             key={new Date()} state={this.state.constraint.q2}
                                             callbackFromParent={this.receiveCStateData2}/></form>
                        <HelpBlock>Use <code>&#60;TEMP&#62;</code> to refer to the
                            output of the previous query.</HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_constr_2"}>{this.state.c2}</code>
                        </div>
                    </div>
                );
            default:
                return (<div/>)
        }
    }


    /**
     * create a dropdown for tags
     */
    renderTags() {
        return (
            <div>
                <div style={{paddingBottom: "10px"}}>
                    <DropdownButton title={"Select Tags"} id={"drop_down"}>
                        {this.state.tags.map((el, i) => {
                            if (this.state.selectedTags.indexOf(el.tagName) === -1)
                                return (
                                    <MenuItem eventKey={el.tagName} key={i}
                                              onSelect={(evt) => {
                                                  const selectedTags = this.state.selectedTags;
                                                  selectedTags.push(evt);
                                                  this.setState({selectedTags})
                                              }}
                                    >{el.tagName}
                                    </MenuItem>);
                            return (null);
                        })}
                    </DropdownButton>
                </div>
                <div>
                    {this.state.selectedTags.map((d, i) => {
                        return (
                            <div style={{float: "left", margin: "0 15px 10px 0"}} key={i}>
                                <Label onClick={() => PubSub.publish('UPDATE_HASH', ['tag', d])}>{d}</Label>
                                <TiDelete size={23}
                                          className={"tiDelete"}
                                          onClick={() => {
                                              const selectedTags = this.state.selectedTags;
                                              selectedTags.splice(i, 1);
                                              this.setState({selectedTags});
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
                        return (
                            <Row key={i} style={{paddingBottom: "5px"}}>
                                <Col sm={11} md={10}>
                                    <FormControl id={"filesFolders_textarea_" + i} type="text"
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
     * receive state data from the child nodes
     */
    receiveStateData0 = () => {
        let xpathRes = "src:unit/" + this.traverseChildren(this.state.quantifier.q0);
        const constraint = JSON.parse(JSON.stringify(this.state.constraint));
        constraint.q0 = JSON.parse(JSON.stringify(this.state.quantifier.q0));
        this.setState({
            constraint,
            q0: xpathRes,
            c0: xpathRes
        });
    };

    /**
     * receive state data from the child nodes
     */
    receiveStateData1 = () => {
        let xpathRes = "src:unit/" + this.traverseChildren(this.state.quantifier.q1);
        const constraint = JSON.parse(JSON.stringify(this.state.constraint));
        constraint.q1 = JSON.parse(JSON.stringify(this.state.quantifier.q1));
        this.setState({
            constraint,
            q1: xpathRes,
            c1: xpathRes
        });
    };

    /**
     * receive state data from the child nodes
     */
    receiveStateData2 = () => {
        let xpathRes = "src:unit/" + this.traverseChildren(this.state.quantifier.q2);
        const constraint = JSON.parse(JSON.stringify(this.state.constraint));
        constraint.q2 = JSON.parse(JSON.stringify(this.state.quantifier.q2));
        this.setState({
            constraint,
            q2: xpathRes,
            c2: xpathRes
        });
    };


    /**
     * receive state data from the child nodes
     */
    receiveCStateData0 = () => {
        let xpathRes = "src:unit/" + this.traverseChildren(this.state.constraint.q0);
        this.setState({c0: xpathRes});
    };

    /**
     * receive state data from the child nodes
     */
    receiveCStateData1 = () => {
        let xpathRes = "src:unit/" + this.traverseChildren(this.state.constraint.q1);
        this.setState({c1: xpathRes});
    };

    /**
     * receive state data from the child nodes
     */
    receiveCStateData2 = () => {
        let xpathRes = "src:unit/" + this.traverseChildren(this.state.constraint.q2);
        this.setState({c2: xpathRes});
    };


    /**
     * traverse the state_children of a parent node to generate xpath query conditions
     * @param parentNode
     * @returns {string} xpath
     */
    traverseChildren(parentNode) {

        let res = parentNode.xpath;
        let children =
            parentNode.children["top"]
                .concat(parentNode.children["after"])
                .concat(parentNode.children["after_1"])
                .concat(parentNode.children["after_2"])
                .concat(parentNode.children["before"])
                .concat(parentNode.children["before_1"])
                .concat(parentNode.children["before_2"])
                .concat(parentNode.children["within"]);

        let resChildren = [];

        for (let i = 0; i < children.length; i++)
            resChildren.push(this.traverseChildren(children[i]));

        res = (children.length !== 0) ? res + ((res !== "") ? "[" : "") + resChildren.join(' and ') + ((res !== "") ? "]" : "") : res;
        res = (parentNode.children["follows"].hasOwnProperty('key')) ?
            res + '/' + this.traverseChildren(parentNode.children["follows"]) : res;

        return res;
    }
}

export default GenerateRule;
