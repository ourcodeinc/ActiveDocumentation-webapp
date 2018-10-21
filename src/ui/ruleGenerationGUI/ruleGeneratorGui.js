/**
 * Created by saharmehrpour on 2/23/18.
 */

import React, {Component} from 'react';
import '../../App.css';

import {Tabs, Tab} from 'react-bootstrap';
import {RootCloseWrapper} from "react-overlays";

import GuiComponent from './guiComponent';


class RuleGeneratorGui extends Component {

    constructor(props) {
        super(props);

        this.state = props["state"];
        this.class = props["className"] ? props["className"] : "generateRuleGui"

    }

    render() {
        return (
            <div style={{clear: "both", marginTop: "20px"}} className={this.class}>
                <button onClick={()=>console.log(this.state.quantifier, JSON.stringify(this.state.quantifier))}>Click</button>
                <Tabs animation={true} id={"rule_generator_gui_tabs"} activeKey={this.state.activeTab}
                      onSelect={(key) => this.setState({activeTab: key})}>
                    <Tab eventKey={"quantifier"} title={"Quantifier Query"} animation={true}>
                        <div style={{marginTop: "10px"}}>
                            <div>
                                <RootCloseWrapper onRootClose={() => {}}>
                                    <GuiComponent ws={this.state.ws} element={"class"}
                                              key={new Date()} state={this.state.quantifier}
                                              callbackFromParent={this.receiveQuantifierStateData}/>
                                </RootCloseWrapper>
                            </div>
                        </div>

                    </Tab>
                    <Tab eventKey={"constraint"} title={"Constraint Query"} animation={true}>
                        <div style={{marginTop: "10px"}}>
                            <div>
                                <GuiComponent ws={this.state.ws} element={"class"}
                                              key={new Date()} state={this.state.constraint}
                                              callbackFromParent={this.receiveConstraintStateData0}/>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
                {this.state.quantifierGrammar}
            </div>
        );
    }


    /**
     * receive state data from the child nodes
     */
    receiveQuantifierStateData = () => {
        //let xpathText = "src:unit/" + this.traverseChildrenXpath(this.state.quantifier);
        const constraint = JSON.parse(JSON.stringify(this.state.quantifier));
        let grammarText = this.traverseChildrenGrammar(this.state.quantifier);
        this.setState({
            constraint,
            // quantifierXpath: xpathText,
            // constraintXpath: xpathText,
            quantifierGrammar: grammarText
        });
    };

    /**
     * receive state data from the child nodes
     */
    receiveConstraintStateData0 = () => {
        //let xpathText = "src:unit/" + this.traverseChildrenXpath(this.state.constraint);
        let grammarText = this.traverseChildrenGrammar(this.state.constraint);
        this.setState({ constraintGrammar: grammarText}); //constraintXpath: xpathText
    };


    /**
     * traverse the state_children of a parent node to generate xpath query conditions
     * @param parentNode
     * @returns {string} xpath
     */
    traverseChildrenXpath(parentNode) {

        let res = parentNode.xpath;
        let children =
            parentNode.children["top"]
                .concat(parentNode.children["after_1"])
                .concat(parentNode.children["after_2"])
                .concat(parentNode.children["before_1"])
                .concat(parentNode.children["before_2"])
                .concat(parentNode.children["within"]);

        let resChildren = [];

        for (let i = 0; i < children.length; i++)
            resChildren.push(this.traverseChildrenXpath(children[i]));

        res = (children.length !== 0) ? res + ((res !== "") ? "[" : "") + resChildren.join(' and ') + ((res !== "") ? "]" : "") : res;
        res = (parentNode.children["child"].hasOwnProperty('key')) ?
            res + '/' + this.traverseChildrenXpath(parentNode.children["child"]) : res;

        return res;
    }

    /**
     * traverse the state_children of a parent node to generate xpath query conditions
     * @param parentNode
     * @returns {string} xpath
     */
    traverseChildrenGrammar(parentNode) {

        let grText = "";
        if(parentNode.children["child"].hasOwnProperty('key')) {
            grText += this.traverseChildrenGrammar(parentNode.children["child"]);
            grText += " of ";
        }

        grText += parentNode.grammar ? parentNode.grammar + " " : parentNode.key ? parentNode.key + " " : "(class) ";
        grText +=  typeof parentNode.text === "string" ? parentNode.text : "";

        let children =
            parentNode.children["top"]
                .concat(parentNode.children["after_1"])
                .concat(parentNode.children["after_2"])
                .concat(parentNode.children["before_1"])
                .concat(parentNode.children["before_2"])
                .concat(parentNode.children["within"]);


        if(children.length > 0) grText += "where (";

        for (let i = 0; i < children.length; i++) {
            grText += "have ";
            grText += this.traverseChildrenGrammar(children[i]);
            if (i < children.length - 1) grText += " and ";
        }

        if(children.length > 0) grText += ") ";

        return grText;
    }
}

export default RuleGeneratorGui;
