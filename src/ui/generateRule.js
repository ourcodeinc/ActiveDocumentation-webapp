/**
 * Created by saharmehrpour on 2/23/18.
 */

import React from 'react';
import '../App.css';

import * as d3 from 'd3';
import PubSub from 'pubsub-js';
import {DropdownButton, MenuItem, HelpBlock, Tabs, Tab} from 'react-bootstrap';
import ClassFragment from './ruleGen/classFragment';

// import TempClassFragment from "./ruleGen/tempClassFragment";


class GenerateRule extends React.Component {

    constructor() {
        super();
        this.attachListener();

        this.state = {
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
        };

    }

    render() {
        return (
            <div>
                <Tabs animation={true} id={"gen_rule_quantifier_constraint"} activeKey={this.state.activeTab}
                      onSelect={(key) => this.setState({activeTab: key})}>
                    <Tab eventKey={"quantifier"} title={"Quantifier Query"} animation={true}>
                        <div style={{marginTop: "10px"}}>
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

                            <div style={{marginTop: "10px"}}>{this.createQuantifierDivs()}</div>
                        </div>
                    </Tab>
                    <Tab eventKey={"constraint"} title={"Constraint Query"} animation={true}>
                        <div style={{marginTop: "10px"}}>
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
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_quant_0"}>{this.state.q0}</code>
                        </div>
                        <form><ClassFragment assignedId={"class_0"} ws={this.state.ws}
                                             key={new Date()} state={this.state.quantifier.q0}
                                             callbackFromParent={this.receiveStateData0}/></form>
                    </div>
                );
            case "selected from one class which is directed from another class":
                return (
                    <div>
                        <HelpBlock>The output of this query must be <code
                            style={{fontFamily: "monospace"}}>text()</code></HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_quant_0"}>{this.state.q0}</code>
                        </div>
                        <form><ClassFragment assignedId={"class_0"} ws={this.state.ws}
                                             key={new Date()} state={this.state.quantifier.q0}
                                             callbackFromParent={this.receiveStateData0}/></form>
                        <HelpBlock>Use <code style={{fontFamily: "monospace"}}>&#60;TEMP&#62;</code> to refer to the
                            output of the previous query.</HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_quant_1"}>{this.state.q1}</code>
                        </div>
                        <form><ClassFragment assignedId={"class_1"} ws={this.state.ws}
                                             key={new Date()} state={this.state.quantifier.q1}
                                             callbackFromParent={this.receiveStateData1}/></form>
                    </div>
                );
            case "selected from one class with the help of another class":
                return (
                    <div>
                        <HelpBlock>The output of this query must be <code
                            style={{fontFamily: "monospace"}}>text()</code></HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_quant_0"}>{this.state.q0}</code>
                        </div>
                        <form><ClassFragment assignedId={"class_0"} ws={this.state.ws}
                                             key={new Date()} state={this.state.quantifier.q0}
                                             callbackFromParent={this.receiveStateData0}/></form>
                        <HelpBlock>The output of this query must be <code
                            style={{fontFamily: "monospace"}}>text()</code>.
                            Use <code style={{fontFamily: "monospace"}}>&#60;TEMP&#62;</code> to refer to the
                            output of the previous query.</HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_quant_1"}>{this.state.q1}</code>
                        </div>
                        <form><ClassFragment assignedId={"class_1"} ws={this.state.ws}
                                             key={new Date()} state={this.state.quantifier.q1}
                                             callbackFromParent={this.receiveStateData1}/></form>
                        <HelpBlock>Use <code style={{fontFamily: "monospace"}}>&#60;TEMP&#62;</code> to refer to the
                            output of the previous query.</HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_quant_2"}>{this.state.q2}</code>
                        </div>
                        <form><ClassFragment assignedId={"class_2"} ws={this.state.ws}
                                             key={new Date()} state={this.state.quantifier.q2}
                                             callbackFromParent={this.receiveStateData2}/></form>
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
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_constr_0"}>{this.state.c0}</code>
                        </div>
                        <form><ClassFragment assignedId={"c_class_0"} ws={this.state.ws}
                                             key={new Date()} state={this.state.constraint.q0}
                                             callbackFromParent={this.receiveCStateData0}/></form>
                    </div>
                );
            case "selected from one class which is directed from another class":
                return (
                    <div>
                        <HelpBlock>The output of this query must be <code
                            style={{fontFamily: "monospace"}}>text()</code></HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_constr_0"}>{this.state.c0}</code>
                        </div>
                        <form><ClassFragment assignedId={"c_class_0"} ws={this.state.ws}
                                             key={new Date()} state={this.state.constraint.q0}
                                             callbackFromParent={this.receiveCStateData0}/></form>
                        <HelpBlock>Use <code style={{fontFamily: "monospace"}}>&#60;TEMP&#62;</code> to refer to the
                            output of the previous query.</HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_constr_1"}>{this.state.c1}</code>
                        </div>
                        <form><ClassFragment assignedId={"c_class_1"} ws={this.state.ws}
                                             key={new Date()} state={this.state.constraint.q1}
                                             callbackFromParent={this.receiveCStateData1}/></form>
                    </div>
                );
            case "selected from one class with the help of another class":
                return (
                    <div>
                        <HelpBlock>The output of this query must be <code
                            style={{fontFamily: "monospace"}}>text()</code></HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_constr_0"}>{this.state.c0}</code>
                        </div>
                        <form><ClassFragment assignedId={"c_class_0"} ws={this.state.ws}
                                             key={new Date()} state={this.state.constraint.q0}
                                             callbackFromParent={this.receiveCStateData0}/></form>
                        <HelpBlock>The output of this query must be <code
                            style={{fontFamily: "monospace"}}>text()</code>.
                            Use <code style={{fontFamily: "monospace"}}>&#60;TEMP&#62;</code> to refer to the
                            output of the previous query.</HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_constr_1"}>{this.state.c1}</code>
                        </div>
                        <form><ClassFragment assignedId={"c_class_1"} ws={this.state.ws}
                                             key={new Date()} state={this.state.constraint.q1}
                                             callbackFromParent={this.receiveCStateData1}/></form>
                        <HelpBlock>Use <code style={{fontFamily: "monospace"}}>&#60;TEMP&#62;</code> to refer to the
                            output of the previous query.</HelpBlock>
                        <div className={"generatedXpath"}>
                            <code id={"generated_xpath_constr_2"}>{this.state.c2}</code>
                        </div>
                        <form><ClassFragment assignedId={"c_class_2"} ws={this.state.ws}
                                             key={new Date()} state={this.state.constraint.q2}
                                             callbackFromParent={this.receiveCStateData2}/></form>
                    </div>
                );
            default:
                return (<div/>)
        }
    }


    /**
     * receive state data from the child nodes
     */
    receiveStateData0 = () => {
        let xpathRes = "src:unit/" + this.traverseChildren(this.state.quantifier.q0);
        const constraint = this.state.constraint;
        constraint.q0 = this.state.quantifier.q0;
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
        const constraint = this.state.constraint;
        constraint.q1 = this.state.quantifier.q1;
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
        const constraint = this.state.constraint;
        constraint.q2 = this.state.quantifier.q2;
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
     * @param stateData
     */
    receiveCStateData1 = (stateData) => {
        let xpathRes = "src:unit/" + this.traverseChildren(stateData);
        this.setState({c1: xpathRes});
    };

    /**
     * receive state data from the child nodes
     * @param stateData
     */
    receiveCStateData2 = (stateData) => {
        let xpathRes = "src:unit/" + this.traverseChildren(stateData);
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

        res = (children.length !== 0) ? res + "[" + resChildren.join(' and ') + "]" : res;
        res = (parentNode.children["follows"].hasOwnProperty('key')) ?
            res + '/' + this.traverseChildren(parentNode.children["follows"]) : res;

        return res;
    }
}

export default GenerateRule;
