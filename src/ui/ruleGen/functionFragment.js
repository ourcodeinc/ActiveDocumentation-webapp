/**
 * Created by saharmehrpour on 3/12/18.
 */

import React from 'react';
import '../../App.css';

import {DropdownButton, FormControl, MenuItem, Row} from 'react-bootstrap';
import {constants} from '../constants';
// import ClassFragment from './classFragment';
import ExpressionFragment from "./expressionFragment";
import DeclarationFragment from "./declarationFragment";

import * as d3 from "d3";


class FunctionFragment extends React.Component {

    constructor(props) {
        super(props);

        this.xpath = {
            "root": props["root"],
            "xpathConstraint": {
                "top": [],
                "before_1": [],
                "before_2": [],
                "after": [],
                "within": []
            },
            "xpathFollows": "",
        };

        this.state = {
            "assignedID": props["assignedId"],
            "category": props["category"],
            "target": props["target"],

            "top": [],
            "before_1": [],
            "before_2": [],
            "after": [],
            "within": [],
            "follows": {}
        }
    }

    render() {
        return (
            <div className={"ruleGroupDiv " + this.state.target} id={this.state.assignedID}>
                <div style={{marginTop: "10px"}}><em>{this.state.category}</em></div>
                <Row style={{margin: "0"}}>{this.renderGroup("top")}</Row>
                <Row style={{margin: "0"}}>

                    {this.renderGroup("before_1")}
                    {this.renderGroup("before_2")}
                    <div className={"rowItem inlineText"}>
                        <b>{this.state["category"] === "constructor" ? "className (" : "("}</b>
                    </div>
                    {this.renderGroup("after")}
                    <div className={"inlineText"}>
                        <p><b>{this.state["category"] === "function declaration" ? ");" : ")"} </b></p>
                    </div>
                </Row>
                <p><b>{this.renderBraces("start")} </b></p>
                {(this.state["category"] !== "function declaration") ? this.renderGroup("within") : ""}
                {this.renderFollows()}
                <p><b>{this.renderBraces("end")} </b></p>
            </div>
        )
    }

    /**
     * render curly braces - braces can't be rendered directly
     * @param location
     * @returns {*}
     */
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
        if (!this.state["follows"].hasOwnProperty("key"))
            return (
                <div>
                    <DropdownButton title={`follows`} id={"drop_down"} className={this.state.target}>
                        {Object.keys(constants.code_fragment[this.state["category"]]["follows"]).map((key, i) => {
                            return (
                                <MenuItem eventKey={key} key={i}
                                          onSelect={(evt) => {
                                              this.setState({
                                                  follows: {
                                                      key: evt,
                                                      value: constants.code_fragment[this.state["category"]]["follows"][evt],
                                                  }
                                              })
                                          }}
                                >{constants.code_fragment[this.state["category"]]["follows"][key].name}
                                </MenuItem>);
                        })}
                    </DropdownButton>
                </div>
            );

        else {
            this.updateXpathFollows();
            switch (this.state["follows"].key) {
                case "declaration":
                    return (<DeclarationFragment target={this.state.target}
                                                 assignedId={this.state.assignedID + "_decl_follows"}
                                                 callbackFromParent={this.receiveXpathDataFollows} isConstraint={false}
                                                 root={constants.code_fragment[this.state["category"]]["follows"][this.state["follows"].key].xpath}/>);

                case "expression":
                    return (<ExpressionFragment target={this.state.target}
                                                assignedId={this.state.assignedID + "_expr_follows"}
                                                callbackFromParent={this.receiveXpathDataFollows} isConstraint={false}
                                                root={constants.code_fragment[this.state["category"]]["follows"][this.state["follows"].key].xpath}/>);
                case "name":
                    d3.select(`#${this.state.assignedID}-before_2`).classed(`ruleGroupDiv ${this.state["target"]}`, true);
                    break;
                case "parameter":
                    d3.select(`#${this.state.assignedID}-after`).classed(`ruleGroupDiv ${this.state["target"]}`, true);
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
            <div className={group === "within" ? "" : "rowItem"} id={`${this.state.assignedID}-${group}`}>
                {this.state[group].map((cons, i) => {
                    return (
                        <div className={group === "within" ? "" : "rowItem"} key={i}>
                            <div className={"rowItem inlineText"}>
                                <b>{constants.code_fragment[this.state["category"]][group][cons["key"]]["pre"]}</b>
                            </div>
                            <div className={group === "within" ? "" : "rowItem"}>
                                {this.switchMethod(group, i, cons)}
                            </div>
                            <div className={group === "within" ? "inlineText" : "rowItem inlineText"}>
                                <b>{constants.code_fragment[this.state["category"]][group][cons["key"]]["post"]}</b>
                            </div>
                        </div>
                    )
                })}


                <DropdownButton title={``} id="dropdown-size-medium">
                    {Object.keys(constants.code_fragment[this.state["category"]][group]).map((key, i) => {
                        return (
                            <MenuItem eventKey={key} key={i}
                                      onSelect={(evt) => {
                                          this.xpath.xpathConstraint[group].push(constants.code_fragment[this.state["category"]][group][evt]["xpath"]);
                                          this.sendDataBack();
                                          this.state[group].push({
                                              key: evt,
                                              value: constants.code_fragment[this.state["category"]][group][evt]
                                          });
                                          this.forceUpdate();
                                      }}
                            >{constants.code_fragment[this.state["category"]][group][key].name}
                            </MenuItem>);
                    })}
                </DropdownButton>
            </div>
        )
    }

    /**
     * switch method for rendering within constraints
     * @param group
     * @param i index of each constraint object
     * @param cons
     * @returns {XML}
     */
    switchMethod(group, i, cons) {
        let type = this.state[group][i].value.type;
        switch (type) {

            case "declaration":
                return (<DeclarationFragment target={""}
                                             assignedId={this.state.assignedID + "_decl_" + i}
                                             callbackFromParent={this.receiveXpathDataConstraints} isConstraint={true}
                                             constraintIndices={{"group": group, "i": i}}
                                             root={constants.code_fragment[this.state["category"]][group][this.state[group][i].key].xpath}/>);
            case "expression":
                return (<ExpressionFragment target={""}
                                            assignedId={this.state.assignedID + "_expr_" + i}
                                            callbackFromParent={this.receiveXpathDataConstraints} isConstraint={true}
                                            constraintIndices={{"group": group, "i": i}}
                                            root={constants.code_fragment[this.state["category"]][group][this.state[group][i].key].xpath}/>);
            case "text":
                return (
                    <FormControl type="text" value={cons["text"]}
                                 placeholder={this.state[group][i].value.placeholder}
                                 onChange={(e) => {
                                     cons.text = e.target.value;
                                     this.updateXpathText(group, i);
                                     let newStateGroup = {};
                                     newStateGroup[group] = this.state[group];
                                     this.setState(newStateGroup);
                                 }}/>
                );
            case "number":
                return (
                    <FormControl type="number" value={cons["text"]}
                                 placeholder={this.state[group][i].value.placeholder}
                                 onChange={(e) => {
                                     cons.text = e.target.value;
                                     this.updateXpathNumber(group, i);
                                     let newStateGroup = {};
                                     newStateGroup[group] = this.state[group];
                                     this.setState(newStateGroup);
                                 }}/>
                );
            default:
                return (<div/>);
        }
    }


    /**
     * update follows data after selecting followed element
     */
    updateXpathFollows() {
        this.xpath.xpathFollows = this.state["follows"].value["xpath"];
        this.sendDataBack();
    }


    /**
     * receive xpath data from the child nodes
     * @param xpathData
     * @param constraintIndices
     */
    receiveXpathDataConstraints = (xpathData, constraintIndices) => {
        this.xpath.xpathConstraint[constraintIndices.group][constraintIndices.index][constraintIndices.i] = xpathData;
        this.sendDataBack();
    };

    /**
     * receive xpath data from the child nodes
     * @param xpathData
     */
    receiveXpathDataFollows = (xpathData) => {
        this.xpath.xpathFollows = xpathData;
        this.sendDataBack();
    };

    /**
     * update the text of constraints
     * @param group
     * @param i
     */
    updateXpathText(group, i) {
        this.xpath.xpathConstraint[group][i] = this.state[group][i].value["xpath"].replace('<NAME>', this.state[group][i].text);
        this.sendDataBack();
    }


    /**
     * update the text of constraints
     * @param group
     * @param i
     */
    updateXpathNumber(group, i) {
        this.xpath.xpathConstraint[group][i] = this.state[group][i].value["xpath"].replace('<COUNT>', this.state[group][i].text);
        this.sendDataBack();
    }

    /**
     * send the xpath data to the parent node
     */
    sendDataBack() {

        let cons = this.xpath.xpathConstraint["top"]
            .concat(this.xpath.xpathConstraint["before_1"])
            .concat(this.xpath.xpathConstraint["before_2"])
            .concat(this.xpath.xpathConstraint["after"])
            .concat(this.xpath.xpathConstraint["within"]).join(' and ');

        let xpathData = this.xpath.root;
        xpathData = (cons === "") ? xpathData : xpathData + "[" + cons + "]";
        xpathData = (this.xpath.xpathFollows === "") ? xpathData : xpathData + "/" + this.xpath.xpathFollows;

        if (this.props["isConstraint"])
            this.props["callbackFromParent"](xpathData, this.props["constraintIndices"]);
        else
            this.props["callbackFromParent"](xpathData);

    }


}

export default FunctionFragment;
