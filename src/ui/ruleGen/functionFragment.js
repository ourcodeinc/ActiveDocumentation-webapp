/**
 * Created by saharmehrpour on 3/12/18.
 */

import React from 'react';
import '../../App.css';

import {DropdownButton, FormControl, MenuItem, Row} from 'react-bootstrap';
import {constants} from '../constants';
import ClassFragment from './classFragment';
import ExpressionFragment from "./expressionFragment";
import DeclarationFragment from "./declarationFragment";
import * as d3 from "d3";


class FunctionFragment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            "assignedID": props["assignedId"],
            "category": props["category"],
            "target": props["target"],
            "top": [[]], // {key: "HAS_ANNOTATION_NAMED", value: "Override"}
            "before": [[], []], // {key: "NAME_EQUALS_TO", value: "execute"}
            "after": [[]],
            "within": [[]],
            "follows": []
        }
    }

    render() {
        return (
            <div className={"ruleGroupDiv " + this.state.target} id={this.state.assignedID}>
                <div style={{marginTop: "10px"}}><em>{this.state.category}</em></div>
                <Row style={{margin: "0"}}>{this.renderGroup("top")}</Row>
                <Row style={{margin: "0"}}>

                    {this.renderGroup("before")}
                    <div className={"rowItem inlineText"}>
                        <b>{this.state["category"] === "constructor" ? "className (" : "("}</b>
                    </div>
                    {this.renderGroup("after")}
                    <div className={"inlineText"}>
                        <p><b>{this.state["category"] === "function declaration" ? ");" : ")"} </b></p>
                    </div>
                </Row>
                <p><b>{this.renderBraces("start")} </b></p>
                {this.renderGroup("within")}
                {this.renderFollows()}
                <p><b>{this.renderBraces("end")} </b></p>
            </div>
        )
    }

    renderBraces(location) {
        let isBrace = (this.state["category"] !== "function declaration");
        switch (location) {
            case "start":
                return isBrace ? "{" : "";
            case "end":
                return isBrace ? "}" : "";
            default:
                return "";
        }
    }

    /**
     * render the 'follows' elements and constraints, drop down or a component
     */
    renderFollows() {
        if (this.state["follows"].length === 0)
            return (
                <div>
                    {constants.code_fragment[this.state["category"]]["follows"].map((elem, index) => {
                        return (
                            <DropdownButton title={`follows`} id="dropdown-size-medium"
                                            key={index} className={this.state.target}>
                                {Object.keys(elem).map((key, i) => {
                                    return (
                                        <MenuItem eventKey={key} key={i}
                                                  onSelect={(evt) => {
                                                      this.setState({
                                                          follows: [{
                                                              key: constants.code_fragment[this.state["category"]]["follows"][0][evt].follows,
                                                              value: ""
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
            console.log(this.state["follows"][0]);
            switch (this.state["follows"][0].key) {
                case "class":
                    return (
                        <ClassFragment target={this.state.target} assignedId={this.state.assignedID + "_class_0"}/>);
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
                    d3.select(`#${this.state.assignedID}`).select("#before_1").classed(`ruleGroupDiv ${this.state["target"]}`, true);
                    break;
                case "parameter":
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
            <div style={{margin: "0"}}>
                {constants.code_fragment[this.state["category"]][group].map((elem, index) => {
                    return (
                        <div key={index} className={group === "within" ? "" : "rowItem"} id={`${group}_${index}`}>
                            {this.state[group][index].map((cons, i) => {
                                return (
                                    <div className={group === "within" ? "" : "rowItem"} key={i}>
                                        <div className={"rowItem inlineText"}>
                                            <b>{constants.code_fragment[this.state["category"]][group][index][cons["key"]]["pre"]}</b>
                                        </div>
                                        <div className={group === "within" ? "" : "rowItem"}>
                                            {this.switchMethod(group, index, i, cons)}
                                        </div>
                                        <div className={group === "within" ? "inlineText" : "rowItem inlineText"}>
                                            <b>{constants.code_fragment[this.state["category"]][group][index][cons["key"]]["post"]}</b>
                                        </div>
                                    </div>
                                )
                            })}


                            <DropdownButton title={``} id="dropdown-size-medium">
                                {Object.keys(elem).map((key, i) => {
                                    return (
                                        <MenuItem eventKey={key} key={i}
                                                  onSelect={(evt) => {
                                                      console.log(evt);
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
            </div>
        )
    }

    switchMethod(group, index, i, cons) {
        let key = this.state[group][index][i]["key"];
        let component = constants.code_fragment[this.state["category"]][group][index][key].type;

        switch (component) {
            case "class":
                return (<ClassFragment target={"default"} assignedId={this.state.assignedID + "_class_0"}/>);
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
                return (<div/>);
        }
    }


}

export default FunctionFragment;
