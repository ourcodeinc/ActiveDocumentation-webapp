/**
 * Created by saharmehrpour on 2/23/18.
 */

import React, {Component} from 'react';
import '../../App.css';

import {Tabs, Tab, FormGroup, HelpBlock} from 'react-bootstrap';
import {RootCloseWrapper} from "react-overlays";
import {connect} from "react-redux";

import GuiComponent from './guiComponent';
import Utilities from "../../core/utilities";


class RuleGeneratorGui extends Component {

    constructor(props) {
        super(props);

        this.state = {...this.props};
        this.class = props["className"] ? props["className"] : "generateRuleGui"

    }

    render() {
        return (
            <div style={{clear: "both", marginTop: "20px"}} className={this.class}>
                {/*<p className={"text-muted"}>function where ( have annotation and have specifier ) of class where have function where have*/}
                {/*annotation and have name where equal to "foo" must have name</p>*/}
                {/*<p className={"text-muted"}>function where ( have annotation and have specifier ) of class where have function where have annotation*/}
                {/*and have name where equal to "foo" must be equal to function</p>*/}
                {/*<p className={"text-muted"}>function where have annotation and have specifier must have name</p>*/}
                {/*<p className={"text-muted"}>function where have annotation where (have name where equal to "bar")*/}
                {/*and have specifier must have name</p>*/}

                {/* Radio buttons - unnecessarily complex */}
                <FormGroup>
                    <HelpBlock>Rule Type:</HelpBlock>
                    <div className="radio"><label className="radio-inline">
                        <input type="radio" name="ruleTypeOptions"
                               value={"Must"}
                               checked={this.state.ruleType === "" ? true : this.state.ruleType === "Must"}
                               onChange={(e) => this.setState({ruleType: e.target.value})}/>
                        Quantifier "must" have additional restriction</label></div>
                    <div className="radio"><label className="radio-inline">
                        <input type="radio" name="ruleTypeOptions"
                               value={"MustBeEqualTo"}
                               checked={this.state.ruleType === "MustBeEqualTo"}
                               onChange={(e) => this.setState({ruleType: e.target.value})}/>
                        Quantifier "must be equal to" Constraint</label></div>
                </FormGroup>

                <Tabs animation={true} id={"rule_generator_gui_tabs"} activeKey={this.state.activeTab}
                      onSelect={(key) => this.setState({activeTab: key})}>
                    <Tab eventKey={"quantifier"} title={"Quantifier Query"} animation={true}>
                        <div style={{marginTop: "10px"}}>
                            <div>
                                <RootCloseWrapper onRootClose={() => {
                                }}>
                                    <GuiComponent ws={this.state.ws}
                                                  element={this.state.quantifier.key ? this.state.quantifier.key : "class"}
                                                  key={new Date()} state={this.state.quantifier}
                                                  callbackFromParent={this.receiveStateData}/>
                                </RootCloseWrapper>
                            </div>
                        </div>

                    </Tab>
                    <Tab eventKey={"constraint"} title={"Constraint Query"} animation={true}>
                        <div style={{marginTop: "10px"}}>
                            <div>
                                <RootCloseWrapper onRootClose={() => {
                                }}>
                                    <GuiComponent ws={this.state.ws}
                                                  element={this.state.constraint.key ? this.state.constraint.key : "class"}
                                                  key={new Date()} state={this.state.constraint}
                                                  callbackFromParent={this.receiveStateData}/>
                                </RootCloseWrapper>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
                <HelpBlock>GUI grammar:</HelpBlock>
                {this.state.GuiGrammar}

            </div>
        );
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps, () => {
                this.receiveStateData();
                this.forceUpdate();
            }
        );
    }

    /**
     * receive state data from the child nodes
     */
    receiveStateData = () => {

        let nodeQ = Utilities.cloneJSON(this.state.quantifier);
        while (nodeQ.children && nodeQ.children.child.key)
            nodeQ = nodeQ.children.child;

        let nodeC = Utilities.cloneJSON(this.state.constraint);
        while (nodeC.children && nodeC.children.child.key)
            nodeC = nodeC.children.child;

        if (nodeQ.key !== nodeC.key) {
            this.setState({GuiGrammar: "not equal target: " + nodeQ.key + " , " + nodeC.key});
            return;
        }

        /*
         * check if two gui nodes are equal (same children and key)
         */
        function equalObject(object1, object2) {
            if (object1.key !== object2.key) return false;
            Object.keys(object1.children).filter(key => key !== "child").forEach(group => {
                if (object1.children[group].length !== object2.children[group].length) return false;
                else {
                    object1.children[group].sort((a, b) => a.key > b.key ? 1 : a.key < b.key ? -1 : 0);
                    object2.children[group].sort((a, b) => a.key > b.key ? 1 : a.key < b.key ? -1 : 0);
                    for (let i = 0; i < object1.children[group].length; i++) {
                        if (!equalObject(object1.children[group][i], object2.children[group][i])) return false
                    }
                }
            });
            if (typeof object1.text === "string") return object1.text === object2.text;
            return true;
        }

        /*
         * check if the main path of the query is the same and detect the type of the rule: "MustEqualTo" or "Must"
         * returns either "MustEqualTo" or the array of {group: "", element: {GUI node}} when the type is "Must"
         */
        function equalMainPath(obj1, obj2) {
            if (obj1.children.child.key) {
                if (!equalObject(obj1, obj2)) return "MustBeEqualTo";
                return equalMainPath(obj1.children.child, obj2.children.child);
            }
            // if it is the target
            // check if children of obj1 is subset of children of obj2

            let addedConstraintIndex = []; // list of added constraints for "Must" case
            let groups = Object.keys(obj1.children).filter(key => key !== "child");
            for (let g = 0; g < groups.length; g++) {
                let group = groups[g];

                if (obj1.children[group].length > obj2.children[group].length) return "MustBeEqualTo";

                else {
                    obj1.children[group].sort((a, b) => a.key > b.key ? 1 : a.key < b.key ? -1 : 0);
                    obj2.children[group].sort((a, b) => a.key > b.key ? 1 : a.key < b.key ? -1 : 0);

                    let currentIndex2 = 0;
                    let countFound = 0;

                    for (let i = 0; i < obj1.children[group].length; i++) {
                        // obj2 has no more child to match
                        if (currentIndex2 >= obj2.children[group].length) return "MustBeEqualTo";
                        for (let j = currentIndex2; j < obj2.children[group].length; j++) {
                            if (equalObject(obj1.children[group][i], obj2.children[group][currentIndex2])) {
                                currentIndex2++;
                                countFound++;
                                break;
                            }
                            addedConstraintIndex.push({group: group, element: obj2.children[group][currentIndex2]});
                            currentIndex2++;
                        }
                        // didn't find the matching element
                        if (countFound < i + 1) return "MustBeEqualTo";
                    }
                    // remaining indices must be added
                    while (currentIndex2 < obj2.children[group].length) {
                        addedConstraintIndex.push({group: group, element: obj2.children[group][currentIndex2]});
                        currentIndex2++;
                    }
                }
            }
            return addedConstraintIndex
        }

        let result = equalMainPath(this.state.quantifier, this.state.constraint);

        if (result === "MustBeEqualTo") {
            let grammarTextQ = this.traverseChildrenGrammar(this.state.quantifier);
            let grammarTextC = this.traverseChildrenGrammar(this.state.constraint);
            this.setState({ruleType: "MustBeEqualTo", GuiGrammar: grammarTextQ + " must be equal to " + grammarTextC});
        }
        else {
            let tempChildren = {
                "top": [],
                "before": [],
                "before_1": [],
                "before_2": [],
                "after": [],
                "after_1": [],
                "after_2": [],
                "within": [],
                "child": {}
            };
            result.forEach(res => tempChildren[res.group].push(res.element));
            let tempTree = {...nodeQ, children: tempChildren};
            let grammarTextQ = this.traverseChildrenGrammar(this.state.quantifier);
            let grammarTextC = this.traverseChildrenGrammar(tempTree, true);
            this.setState({ruleType: "Must", GuiGrammar: grammarTextQ + " must " + grammarTextC});
        }
    };

    /**
     * traverse the state_children of a parent node to generate xpath query conditions
     * @param parentNode
     * @param mustHave boolean, when the grammar is partial and is wanted for constraint after 'must'
     * @returns {string} grammar
     */
    traverseChildrenGrammar(parentNode, mustHave = false) {

        let grText = "";
        if (parentNode.children["child"].hasOwnProperty('key')) {
            grText += this.traverseChildrenGrammar(parentNode.children["child"]);
            grText += " of ";
        }

        if (!mustHave) grText += (parentNode.value.type === "text" && !parentNode.text) ? parentNode.grammar.split(" ").slice(0, 1).join(" ")
            : parentNode.grammar ? parentNode.grammar + " " : parentNode.key ? parentNode.key + " " : "class ";
        grText += typeof parentNode.text !== "string" ? "" : parentNode.text !== "" ? ("\"" + parentNode.text + "\"") : "";

        let children = [];
        Object.keys(parentNode.children).filter(key => key !== "child").forEach(group => children = children.concat(parentNode.children[group]));

        if (children.length > 0 && !mustHave) grText += "where ";
        if (children.length > 1 && !mustHave) grText += "(";

        for (let i = 0; i < children.length; i++) {
            grText += "have ";
            grText += this.traverseChildrenGrammar(children[i]);
            if (i < children.length - 1) grText += " and ";
        }

        if (children.length > 1 && !mustHave) grText += ") ";

        return grText;
    }
}

function mapStateToProps(state) {
    return {
        ws: state.ws,
        activeTab: state.newOrEditRule.guiState.activeTab,
        quantifier: state.newOrEditRule.guiState.quantifier,
        constraint: state.newOrEditRule.guiState.constraint,
        ruleType: state.newOrEditRule.guiState.ruleType
    };
}

export default connect(mapStateToProps, null)(RuleGeneratorGui);
