/**
 * Created by saharmehrpour on 2/23/18.
 */

import React, {Component} from 'react';
import '../../App.css';

import {Tabs, Tab} from 'react-bootstrap';

import ClassFragment from './classFragment';


class RuleGeneratorGui extends Component {

    constructor(props) {
        super(props);

        this.state = props["state"]['xPathState'];
        this.class = props["className"] ? props["className"] : "generateRuleGui"


    }

    render() {
        return (
            <div style={{clear: "both", marginTop: "20px"}} className={this.class}>
                <Tabs animation={true} id={"gen_rule_quantifier_constraint"} activeKey={this.state.activeTab}
                      onSelect={(key) => this.setState({activeTab: key})}>
                    <Tab eventKey={"quantifier"} title={"Quantifier Query"} animation={true}>
                        <div style={{marginTop: "10px"}}>
                            <div>
                                <ClassFragment assignedId={"class_0"} ws={this.state.ws}
                                                     key={new Date()} state={this.state.quantifier.q0}
                                                     callbackFromParent={this.receiveQuantifierStateData}/>
                                <div className={"generatedXpath"}>
                                    <code id={"generated_xpath_quant_0"}>{this.state.q0}</code>
                                </div>
                            </div>
                        </div>

                    </Tab>
                    <Tab eventKey={"constraint"} title={"Constraint Query"} animation={true}>
                        <div style={{marginTop: "10px"}}>
                            <div>
                                <ClassFragment assignedId={"c_class_0"} ws={this.state.ws}
                                                     key={new Date()} state={this.state.constraint.q0}
                                                     callbackFromParent={this.receiveConstraintStateData0}/>
                                <div className={"generatedXpath"}>
                                    <code id={"generated_xpath_constr_0"}>{this.state.c0}</code>
                                </div>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        );
    }


    /**
     * receive state data from the child nodes
     */
    receiveQuantifierStateData = () => {console.log(this.state.quantifier.q0);
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
    receiveConstraintStateData0 = () => {
        let xpathRes = "src:unit/" + this.traverseChildren(this.state.constraint.q0);
        this.setState({c0: xpathRes});
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

export default RuleGeneratorGui;
