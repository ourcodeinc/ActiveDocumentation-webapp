/**
 * Created by saharmehrpour on 3/12/18.
 */

import React from 'react';
import '../../App.css';

import {DropdownButton, FormControl, MenuItem, Row} from 'react-bootstrap';
import {constants} from '../constants';
import FunctionFragment from './functionFragment'
import ExpressionFragment from "./expressionFragment";
import DeclarationFragment from "./declarationFragment";
import * as d3 from "d3";


class ClassFragment extends React.Component {

    constructor(props) {
        super(props);

        this.xpath = {
            "xpathConstraint": {
                "top": [[]],
                "before": [[]],
                "after": [[], []],
                "within": [[]]
            },
            "xpathFollows": "",
            "xpathFollowNodes": ""
        };

        this.state = {
            "assignedID": props["assignedId"],
            "target": props["target"],

            "top": [[]], // {key: "HAS_ANNOTATION_NAMED", value: "Entity"}
            "before": [[]],
            "after": [[], []], // {key: "NAME_EQUALS_TO", value: "Command"}
            "within": [[]],
            "follows": []
        }

    }

    render() {
        return (
            <div className={"ruleGroupDiv " + this.state.target} id={this.state.assignedID}>
                {this.renderGroup("top")}
                <Row style={{marginLeft: "0"}}>
                    {this.renderGroup("before")}
                    <div className={"rowItem inlineText"}><b>class</b></div>
                    {this.renderGroup("after")}
                </Row>
                <b>&#123;</b>
                {this.renderGroup("within")}
                {this.renderFollows()}
                <b>&#125;</b>
            </div>
        )
    }


    /**
     * render the 'follows' elements and constraints, drop down or a component
     */
    renderFollows() {
        if (this.state["follows"].length === 0)
            return (
                <div>
                    {constants.code_fragment["class"]["follows"].map((elem, index) => {
                        return (
                            <DropdownButton title={`follows`} id="dropdown-size-medium"
                                            key={index} className={this.state.target}>
                                {Object.keys(elem).map((key, i) => {
                                    return (
                                        <MenuItem eventKey={key} key={i}
                                                  onSelect={(evt) => {
                                                      this.setState({
                                                          follows: [{
                                                              key: constants.code_fragment["class"]["follows"][0][evt].follows,
                                                              value: evt
                                                          }]
                                                      })
                                                  }}
                                        >{elem[key].name}
                                        </MenuItem>);
                                })}
                            </DropdownButton>
                        )
                    })}
                </div>
            );

        else {
            this.updateXpathFollows();
            switch (this.state["follows"][0].key) {
                case "class":
                    return (
                        <ClassFragment target={this.state.target} assignedId={this.state.assignedID + "_class_0"}
                                       callbackFromParent={this.receiveXpathDataFollows} isConstraint={false}/>);
                case "function":
                    return (<FunctionFragment target={this.state.target} category={"function"}
                                              assignedId={this.state.assignedID + "_function_0"}/>);
                case "constructor":
                    return (<FunctionFragment target={this.state.target} category={"constructor"}
                                              assignedId={this.state.assignedID + "_constructor_0"}/>);
                case "function declaration":
                    return (<FunctionFragment target={this.state.target} category={"function declaration"}
                                              assignedId={this.state.assignedID + "_function_decl_0"}/>);
                case "expression":
                    return (<ExpressionFragment target={this.state.target}/>);
                case "declaration":
                    return (<DeclarationFragment target={this.state.target}/>);
                case "name":
                    d3.select(`#${this.state.assignedID}`).select("#after_0").classed(`ruleGroupDiv ${this.state["target"]}`, true);
                    break;
                default:
                    return (<div/>)
            }
        }
    }

    /**
     * render groups: top, before, after, within
     */
    renderGroup(group) {
        return (
            <Row style={{margin: "0"}}>
                {constants.code_fragment["class"][group].map((elem, index) => {
                    return (
                        <div key={index} className={group === "within" ? "" : "rowItem"} id={`${group}_${index}`}>
                            {this.state[group][index].map((cons, i) => {
                                return (
                                    <div className={group === "within" ? "" : "rowItem"} key={i}>
                                        <div className={"rowItem inlineText"}>
                                            <b>{constants.code_fragment["class"][group][index][cons["key"]]["pre"]}</b>
                                        </div>
                                        <div className={group === "within" ? "" : "rowItem"}>
                                            {this.switchMethod(group, index, i, cons)}
                                        </div>
                                        <div className={group === "within" ? "inlineText" : "rowItem inlineText"}>
                                            <b>{constants.code_fragment["class"][group][index][cons["key"]]["post"]}</b>
                                        </div>
                                    </div>
                                )
                            })}


                            <DropdownButton title={``} id="dropdown-size-medium">
                                {Object.keys(elem).map((key, i) => {
                                    return (
                                        <MenuItem eventKey={key} key={i}
                                                  onSelect={(evt) => {
                                                      this.xpath.xpathConstraint[group][index].push("");
                                                      this.state[group][index].push({key: evt, value: ""});
                                                      this.forceUpdate();
                                                  }}
                                        >{elem[key].name}
                                        </MenuItem>);
                                })}
                            </DropdownButton>
                        </div>
                    )
                })}
            </Row>
        )
    }

    /**
     * switch method for rendering within constraints
     * @param group
     * @param index index of subgroup
     * @param i index of each constraint object
     * @param cons
     * @returns {XML}
     */
    switchMethod(group, index, i, cons) {
        let key = this.state[group][index][i]["key"];
        let component = constants.code_fragment["class"][group][index][key].type;

        switch (component) {
            case "class":
                return (<ClassFragment target={"default"} assignedId={this.state.assignedID + "_class_0"}
                                       callbackFromParent={this.receiveXpathDataConstraints} isConstraint={true}
                                       constraint={this.xpath.xpathConstraint[group][index][i]}/>);
            case "function":
                return (<FunctionFragment target={"default"} category={"function"}
                                          assignedId={this.state.assignedID + "_function_0"}/>);
            case "constructor":
                return (<FunctionFragment target={"default"} category={"constructor"}
                                          assignedId={this.state.assignedID + "_constructor_0"}/>);
            case "function declaration":
                return (<FunctionFragment target={"default"} category={"function declaration"}
                                          assignedId={this.state.assignedID + "_function_decl_0"}/>);
            case "expression":
                return (<ExpressionFragment target={"default"}/>);
            case "declaration":
                return (<DeclarationFragment target={"default"}/>);
            case "text":
                return (
                    <FormControl type="text" value={cons["value"]}
                                 placeholder="Enter text"
                                 onChange={(e) => {
                                     cons.value = e.target.value;
                                     let newStateGroup = {};
                                     newStateGroup[group] = this.state[group];
                                     this.setState(newStateGroup);
                                 }}/>
                );
            default:
                return (<div/>)

        }
    }


    /**
     * update follows data after selecting followed element
     */
    updateXpathFollows() {
        this.xpath.xpathFollows = constants.code_fragment["class"]["follows"][0][this.state["follows"][0].value]["xpath"];

        if(this.props["isConstraint"])
            this.props["callbackFromParent"]("[" + this.traverseConstraints() + "]/" + this.xpath.xpathFollows + this.xpath.xpathFollowNodes, this.props["constraint"]);

        this.props["callbackFromParent"]("[" + this.traverseConstraints() + "]/" + this.xpath.xpathFollows + this.xpath.xpathFollowNodes);
    }


    /**
     * receive xpath data from the child nodes
     * @param xpathData
     * @param xpathConstraint
     */
    receiveXpathDataConstraints = (xpathData, xpathConstraint) => {
        xpathConstraint = xpathData;
        this.props["callbackFromParent"]("[" + this.traverseConstraints() + "]/" + this.xpath.xpathFollows + this.xpath.xpathFollowNodes);

    };

    /**
     * receive xpath data from the child nodes
     * @param xpathData
     */
    receiveXpathDataFollows = (xpathData) => {
        this.xpath.xpathFollowNodes = xpathData;
        this.props["callbackFromParent"]("[" + this.traverseConstraints() + "]/" + this.xpath.xpathFollows + this.xpath.xpathFollowNodes);

    };

    traverseConstraints() {
        return this.xpath.xpathConstraint["top"][0]
            .concat(this.xpath.xpathConstraint["before"][0])
            .concat(this.xpath.xpathConstraint["before"][0])
            .concat(this.xpath.xpathConstraint["before"][1])
            .concat(this.xpath.xpathConstraint["within"][0])
            .join(' and ');
    }


}

export default ClassFragment;
