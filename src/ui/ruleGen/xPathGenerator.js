/**
 * Created by saharmehrpour on 2/23/18.
 */

import React, {Component} from 'react';
import '../../App.css';

import {DropdownButton, MenuItem, HelpBlock, Tabs, Tab} from 'react-bootstrap';
import {FormControl} from 'react-bootstrap';

import ClassFragment from './classFragment';


class XPathGenerator extends Component {

    constructor(props) {
        super(props);

        this.state = props["state"]['xPathState'];


    }

    render() {
        return (
            <div>
                {this.renderTabs()}
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

export default XPathGenerator;
