/**
 * Created by saharmehrpour on 2/23/18.
 */

import React from 'react';
import '../App.css';

import * as d3 from 'd3';
import PubSub from 'pubsub-js';
// import {DropdownButton, MenuItem, HelpBlock, Tabs, Tab} from 'react-bootstrap';
import {HelpBlock} from 'react-bootstrap';
import ClassFragment from './ruleGen/classFragment';

// import TempClassFragment from "./ruleGen/tempClassFragment";


class GenerateRule extends React.Component {

    constructor() {
        super();
        this.attachListener();

        this.xpath = {
            quant0: "src:unit/src:class",
            quant1: "src:unit/src:class",
            quant2: "src:unit/src:class",
            constr0: "src:unit/src:class",
            constr1: "src:unit/src:class",
            constr2: "src:unit/src:class"
        };

        this.state = {
            ws: null,
            ruleType: "",
            cRuleType: "",
            activeTab: "quant"
        };

        this.st =
        // {
        //     "key": "",
        //     "value": "",
        //     "target": "follows",
        //     "children": {
        //         "top": [],
        //         "before": [],
        //         "after_1": [],
        //         "after_2": [],
        //         "within": [{
        //             "key": "HAS_FUNCTION",
        //             "value": {"name": "Has function ...", "xpath": "src:block/src:function", "type": "function"},
        //             "target": "default",
        //             "children": {
        //                 "top": [],
        //                 "before": [],
        //                 "before_1": [],
        //                 "before_2": [],
        //                 "after": [],
        //                 "after_1": [],
        //                 "after_2": [],
        //                 "within": [],
        //                 "follows": {
        //                     "key": "expression",
        //                     "value": {
        //                         "name": "expression",
        //                         "xpath": "src:block/descendant-or-self::src:expr_stmt",
        //                         "follows": "expression"
        //                     },
        //                     "target": "default",
        //                     "children": {
        //                         "top": [],
        //                         "before": [],
        //                         "before_1": [],
        //                         "before_2": [],
        //                         "after": [],
        //                         "after_1": [],
        //                         "after_2": [],
        //                         "within": [],
        //                         "follows": {}
        //                     },
        //                     "xpath": "",
        //                     "text": ""
        //                 }
        //             },
        //             "xpath": "src:block/src:function"
        //         }, {
        //             "key": "HAS_FUNCTION_DECL",
        //             "value": {
        //                 "name": "Has functionDeclaration ...",
        //                 "xpath": "src:block/src:function_decl",
        //                 "type": "functionDeclaration"
        //             },
        //             "target": "default",
        //             "children": {
        //                 "top": [],
        //                 "before": [],
        //                 "before_1": [],
        //                 "before_2": [],
        //                 "after": [],
        //                 "after_1": [],
        //                 "after_2": [],
        //                 "within": [],
        //                 "follows": {}
        //             },
        //             "xpath": "src:block/src:function_decl"
        //         }, {
        //             "key": "HAS_CONSTRUCTOR",
        //             "value": {
        //                 "name": "Has constructor ...",
        //                 "xpath": "src:block/src:constructor",
        //                 "type": "constructor"
        //             },
        //             "target": "default",
        //             "children": {
        //                 "top": [],
        //                 "before": [],
        //                 "before_1": [],
        //                 "before_2": [],
        //                 "after": [],
        //                 "after_1": [],
        //                 "after_2": [],
        //                 "within": [],
        //                 "follows": {
        //                     "key": "declaration",
        //                     "value": {
        //                         "name": "declaration",
        //                         "xpath": "src:block/descendant-or-self::src:decl_stmt",
        //                         "follows": "declaration"
        //                     },
        //                     "target": "default",
        //                     "children": {
        //                         "top": [],
        //                         "before": [],
        //                         "before_1": [],
        //                         "before_2": [],
        //                         "after": [],
        //                         "after_1": [],
        //                         "after_2": [],
        //                         "within": [],
        //                         "follows": {}
        //                     },
        //                     "xpath": "",
        //                     "text": ""
        //                 }
        //             },
        //             "xpath": "src:block/src:constructor"
        //         }, {
        //             "key": "HAS_SUBCLASS",
        //             "value": {"name": "Has subclass ...", "xpath": "src:block/src:class", "type": "class"},
        //             "target": "default",
        //             "children": {
        //                 "top": [],
        //                 "before": [],
        //                 "before_1": [],
        //                 "before_2": [],
        //                 "after": [],
        //                 "after_1": [],
        //                 "after_2": [],
        //                 "within": [{
        //                     "key": "HAS_FUNCTION",
        //                     "value": {
        //                         "name": "Has function ...",
        //                         "xpath": "src:block/src:function",
        //                         "type": "function"
        //                     },
        //                     "target": "default",
        //                     "children": {
        //                         "top": [],
        //                         "before": [],
        //                         "before_1": [],
        //                         "before_2": [],
        //                         "after": [],
        //                         "after_1": [],
        //                         "after_2": [],
        //                         "within": [],
        //                         "follows": {}
        //                     },
        //                     "xpath": "src:block/src:function"
        //                 }],
        //                 "follows": {
        //                     "key": "constructor",
        //                     "value": {
        //                         "name": "constructor",
        //                         "xpath": "src:block/src:constructor",
        //                         "follows": "constructor"
        //                     },
        //                     "target": "default",
        //                     "children": {
        //                         "top": [],
        //                         "before": [],
        //                         "before_1": [],
        //                         "before_2": [],
        //                         "after": [],
        //                         "after_1": [],
        //                         "after_2": [],
        //                         "within": [],
        //                         "follows": {}
        //                     },
        //                     "xpath": ""
        //                 }
        //             },
        //             "xpath": "src:block/src:class"
        //         }],
        //         "follows": {
        //             "key": "functionDeclaration",
        //             "value": {
        //                 "name": "functionDeclaration",
        //                 "xpath": "src:block/src:function_decl",
        //                 "follows": "functionDeclaration"
        //             },
        //             "target": "follows",
        //             "children": {
        //                 "top": [],
        //                 "before": [],
        //                 "before_1": [],
        //                 "before_2": [],
        //                 "after": [],
        //                 "after_1": [],
        //                 "after_2": [],
        //                 "within": [],
        //                 "follows": {
        //                     "key": "name",
        //                     "value": {"name": "name", "xpath": "src:name/text()", "follows": "name"},
        //                     "target": "follows",
        //                     "children": {
        //                         "top": [],
        //                         "before": [],
        //                         "before_1": [],
        //                         "before_2": [],
        //                         "after": [],
        //                         "after_1": [],
        //                         "after_2": [],
        //                         "within": [],
        //                         "follows": {}
        //                     },
        //                     "xpath": ""
        //                 }
        //             },
        //             "xpath": ""
        //         }
        //     },
        //     "xpath": "src:class"
        // };

        {
            key: "",
            value: "",
            target: "follows",
            children: {
                "top": [],
                "before": [],
                "after_1": [],
                "after_2": [],
                "within": [],
                "follows": {}
            },
            xpath: "src:class"
        };


    }

    render() {
        return (
            <div>
                <p id={"generated_xpath_quant_0"}>{this.xpath.quant0}</p>
                <ClassFragment
                    assignedId={"class_0"} ws={this.state.ws}
                    key={new Date()} state={this.st}
                    callbackFromParent={this.receiveXpathData0} isConstraint={false}
                />
            </div>
        )
        // return (
        //     <div>
        //         <Tabs animation={true} id={"gen_rule_quant"} activeKey={this.state.activeTab}
        //               onSelect={(key) => this.setState({activeTab: key})}>
        //             <Tab eventKey={"quant"} title={"Quantifier Query"} animation={true}>
        //                 <div style={{marginTop: "10px"}}>
        //                     <em>{"Select the type of the quantifier: "}</em>
        //                     <DropdownButton title={this.state.ruleType} id="dropdown-size-medium">
        //                         <MenuItem key={"one-class"} eventKey={"selected from one class"}
        //                                   onSelect={(evt) => this.setState({ruleType: evt})}
        //                         >{"selected from one class"}</MenuItem>
        //                         <MenuItem key={"two-class"}
        //                                   eventKey={"selected from one class which directs to another class"}
        //                                   onSelect={(evt) => this.setState({ruleType: evt})}
        //                         >{"selected from one class which directs to another class"}</MenuItem>
        //                         <MenuItem key={"two-class-returning"}
        //                                   eventKey={"selected from one class with the help of another class"}
        //                                   onSelect={(evt) => this.setState({ruleType: evt})}
        //                         >{"selected from one class with the help of another class"}</MenuItem>
        //                     </DropdownButton>
        //
        //                     <div style={{marginTop: "10px"}}>{this.createQuantDivs()}</div>
        //                 </div>
        //             </Tab>
        //             <Tab eventKey={"constr"} title={"Constraint Query"} animation={true}>
        //                 <div style={{marginTop: "10px"}}>
        //                     <em>{"Select the type of the constraint: "}</em>
        //                     <DropdownButton title={this.state.cRuleType} id="dropdown-size-medium">
        //                         <MenuItem key={"one-class"} eventKey={"selected from one class"}
        //                                   onSelect={(evt) => this.setState({cRuleType: evt})}
        //                         >{"selected from one class"}</MenuItem>
        //                         <MenuItem key={"two-class"}
        //                                   eventKey={"selected from one class which directs to another class"}
        //                                   onSelect={(evt) => this.setState({cRuleType: evt})}
        //                         >{"selected from one class which directs to another class"}</MenuItem>
        //                         <MenuItem key={"two-class-returning"}
        //                                   eventKey={"selected from one class with the help of another class"}
        //                                   onSelect={(evt) => this.setState({cRuleType: evt})}
        //                         >{"selected from one class with the help of another class"}</MenuItem>
        //                     </DropdownButton>
        //
        //                     <div style={{marginTop: "10px"}}>{this.createConstrDivs()}</div>
        //                 </div>
        //             </Tab>
        //         </Tabs>
        //     </div>
        // );
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
    createQuantDivs() {
        switch (this.state.ruleType) {
            case "selected from one class":
                return (
                    <div>
                        <p id={"generated_xpath_quant_0"}>{this.xpath.quant0}</p>
                        <form><ClassFragment target={"follows"} assignedId={"class_0"} ws={this.state.ws}
                                             key={new Date()}
                                             callbackFromParent={this.receiveXpathData0} isConstraint={false}
                                             root={"src:class"}/></form>
                    </div>
                );
            case "selected from one class which directs to another class":
                return (
                    <div>
                        <div><p id={"generated_xpath_quant_0"}>{this.xpath.quant0}</p></div>
                        <HelpBlock>The output of this query must be text()</HelpBlock>
                        <form><ClassFragment target={"follows"} assignedId={"class_0"} ws={this.state.ws}
                                             key={new Date()}
                                             callbackFromParent={this.receiveXpathData0} isConstraint={false}
                                             root={"src:class"}/></form>
                        <p id={"generated_xpath_quant_1"}>{this.xpath.quant1}</p>
                        <form><ClassFragment target={"follows"} assignedId={"class_1"} ws={this.state.ws}
                                             key={new Date()}
                                             callbackFromParent={this.receiveXpathData1} isConstraint={false}
                                             root={"src:class"}/></form>
                    </div>
                );
            case "selected from one class with the help of another class":
                return (
                    <div>
                        <div><p id={"generated_xpath_quant_0"}>{this.xpath.quant0}</p></div>
                        <HelpBlock>The output of this query must be text()</HelpBlock>
                        <form><ClassFragment target={"follows"} assignedId={"class_0"} ws={this.state.ws}
                                             key={new Date()}
                                             callbackFromParent={this.receiveXpathData0} isConstraint={false}
                                             root={"src:class"}/></form>
                        <div><p id={"generated_xpath_quant_1"}>{this.xpath.quant1}</p></div>
                        <HelpBlock>The output of this query must be text()</HelpBlock>
                        <form><ClassFragment target={"follows"} assignedId={"class_1"} ws={this.state.ws}
                                             key={new Date()}
                                             callbackFromParent={this.receiveXpathData1} isConstraint={false}
                                             root={"src:class"}/></form>
                        <p id={"generated_xpath_quant_2"}>{this.xpath.quant2}</p>
                        <form><ClassFragment target={"follows"} assignedId={"class_2"} ws={this.state.ws}
                                             key={new Date()}
                                             callbackFromParent={this.receiveXpathData2} isConstraint={false}
                                             root={"src:class"}/></form>
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
    createConstrDivs() {
        switch (this.state.cRuleType) {
            case "selected from one class":
                return (
                    <div>
                        <p id={"generated_xpath_constr_0"}>{this.xpath.constr0}</p>
                        <form><ClassFragment target={"follows"} assignedId={"c_class_0"} ws={this.state.ws}
                                             key={new Date()}
                                             callbackFromParent={this.receiveCXpathData0} isConstraint={false}
                                             root={"src:class"}/></form>
                    </div>
                );
            case "selected from one class which directs to another class":
                return (
                    <div>
                        <div><p id={"generated_xpath_constr_0"}>{this.xpath.constr0}</p></div>
                        <HelpBlock>The output of this query must be text()</HelpBlock>
                        <form><ClassFragment target={"follows"} assignedId={"c_class_0"} ws={this.state.ws}
                                             key={new Date()}
                                             callbackFromParent={this.receiveCXpathData0} isConstraint={false}
                                             root={"src:class"}/></form>
                        <p id={"generated_xpath_constr_1"}>{this.xpath.constr1}</p>
                        <form><ClassFragment target={"follows"} assignedId={"c_class_1"} ws={this.state.ws}
                                             key={new Date()}
                                             callbackFromParent={this.receiveCXpathData1} isConstraint={false}
                                             root={"src:class"}/></form>
                    </div>
                );
            case "selected from one class with the help of another class":
                return (
                    <div>
                        <div><p id={"generated_xpath_constr_0"}>{this.xpath.constr0}</p></div>
                        <HelpBlock>The output of this query must be text()</HelpBlock>
                        <form><ClassFragment target={"follows"} assignedId={"c_class_0"} ws={this.state.ws}
                                             key={new Date()}
                                             callbackFromParent={this.receiveCXpathData0} isConstraint={false}
                                             root={"src:class"}/></form>
                        <div><p id={"generated_xpath_constr_1"}>{this.xpath.constr1}</p></div>
                        <HelpBlock>The output of this query must be text()</HelpBlock>
                        <form><ClassFragment target={"follows"} assignedId={"c_class_1"} ws={this.state.ws}
                                             key={new Date()}
                                             callbackFromParent={this.receiveCXpathData1} isConstraint={false}
                                             root={"src:class"}/></form>
                        <p id={"generated_xpath_constr_2"}>{this.xpath.constr2}</p>
                        <form><ClassFragment target={"follows"} assignedId={"c_class_2"} ws={this.state.ws}
                                             key={new Date()}
                                             callbackFromParent={this.receiveCXpathData2} isConstraint={false}
                                             root={"src:class"}/></form>
                    </div>
                );
            default:
                return (<div/>)
        }
    }


    /**
     * receive xpath data from the child nodes
     * @param stateData
     */
    receiveXpathData0 = (stateData) => {
        console.log(">>>");
        console.log(stateData);
        console.log(JSON.stringify(stateData));
        console.log("<<<")
        // this.xpath.quant0 = "src:unit/" + xpathData;
        // d3.select("#generated_xpath_quant_0").text(this.xpath.quant0);
    };

    /**
     * receive xpath data from the child nodes
     * @param xpathData
     */
    receiveXpathData1 = (xpathData) => {
        this.xpath.quant1 = "src:unit/" + xpathData;
        d3.select("#generated_xpath_quant_1").text(this.xpath.quant1);
    };

    /**
     * receive xpath data from the child nodes
     * @param xpathData
     */
    receiveXpathData2 = (xpathData) => {
        this.xpath.quant2 = "src:unit/" + xpathData;
        d3.select("#generated_xpath_quant_2").text(this.xpath.quant2);
    };


    /**
     * receive xpath data from the child nodes
     * @param xpathData
     */
    receiveCXpathData0 = (xpathData) => {
        this.xpath.constr0 = "src:unit/" + xpathData;
        d3.select("#generated_xpath_constr_0").text(this.xpath.constr0);
    };

    /**
     * receive xpath data from the child nodes
     * @param xpathData
     */
    receiveCXpathData1 = (xpathData) => {
        this.xpath.constr1 = "src:unit/" + xpathData;
        d3.select("#generated_xpath_constr_1").text(this.xpath.constr1);
    };

    /**
     * receive xpath data from the child nodes
     * @param xpathData
     */
    receiveCXpathData2 = (xpathData) => {
        this.xpath.constr2 = "src:unit/" + xpathData;
        d3.select("#generated_xpath_constr_2").text(this.xpath.constr2);
    };

}

export default GenerateRule;
