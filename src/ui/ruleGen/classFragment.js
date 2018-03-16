/**
 * Created by saharmehrpour on 3/12/18.
 */

import React from 'react';
import '../../App.css';

import {DropdownButton, FormControl, MenuItem, Row} from 'react-bootstrap';
import {constants} from '../constants';
import FunctionFragment from './functionFragment'
// import ExpressionFragment from "./expressionFragment";
import DeclarationFragment from "./declarationFragment";

import * as d3 from "d3";


class ClassFragment extends React.Component {

    constructor(props) {
        super(props);

        this.xpath = {
            "root": props["root"],
            "xpathConstraint": {
                "top": [],
                "before": [],
                "after_1": [],
                "after_2": [],
                "within": []
            },
            "xpathFollows": "",
        };

        this.state = {
            "assignedID": props["assignedId"],
            "target": props["target"],

            "top": [], // {key: key, value: constant Obj}
            "before": [],
            "after_1": [],
            "after_2": [],
            "within": [],
            "follows": {}
        }

    }

    render() {
        return (
            <div className={"ruleGroupDiv " + this.state.target} id={this.state.assignedID}>
                <Row style={{marginLeft: "0"}}>
                    {this.renderGroup("top")}
                </Row>
                <Row style={{marginLeft: "0"}}>
                    {/*{this.renderGroup("before")}*/}
                    <div className={"rowItem inlineText"}><b>class</b></div>
                    {this.renderGroup("after_1")}
                    {this.renderGroup("after_2")}
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
        if (!this.state["follows"].hasOwnProperty("key"))
            return (
                <div>
                    <DropdownButton title={`follows`} className={this.state.target} id={"drop_down"}>
                        {Object.keys(constants.code_fragment["class"]["follows"]).map((key, i) => {
                            return (
                                <MenuItem eventKey={key} key={i}
                                          onSelect={(evt) => {
                                              this.setState({
                                                  follows: {
                                                      key: evt,
                                                      value: constants.code_fragment["class"]["follows"][evt]
                                                  }
                                              })
                                          }}
                                >{constants.code_fragment["class"]["follows"][key].name}
                                </MenuItem>);
                        })}
                    </DropdownButton>
                </div>
            );

        else {
            this.updateXpathFollows();
            switch (this.state["follows"].key) {
                case "subclass":
                    return (
                        <ClassFragment target={this.state.target} assignedId={this.state.assignedID + "_class_follows"}
                                       callbackFromParent={this.receiveXpathDataFollows} isConstraint={false}
                                       root={constants.code_fragment["class"]["follows"][this.state["follows"].key].xpath}/>);

                case "function":
                    return (
                        <FunctionFragment target={this.state.target} category={"function"}
                                          assignedId={this.state.assignedID + "_function_follows"}
                                          callbackFromParent={this.receiveXpathDataFollows} isConstraint={false}
                                          root={constants.code_fragment["class"]["follows"][this.state["follows"].key].xpath}/>);

                case "constructor":
                    return (<FunctionFragment target={this.state.target} category={"constructor"}
                                              assignedId={this.state.assignedID + "_constructor_follows"}
                                              callbackFromParent={this.receiveXpathDataFollows} isConstraint={false}
                                              root={constants.code_fragment["class"]["follows"][this.state["follows"].key].xpath}/>);
                case "function declaration":
                    return (<FunctionFragment target={this.state.target} category={"function declaration"}
                                              assignedId={this.state.assignedID + "_function_decl_follows"}
                                              callbackFromParent={this.receiveXpathDataFollows} isConstraint={false}
                                              root={constants.code_fragment["class"]["follows"][this.state["follows"].key].xpath}/>);
                case "declaration":
                    return (<DeclarationFragment target={this.state.target}
                                                 assignedId={this.state.assignedID + "_decl_follows"}
                                                 callbackFromParent={this.receiveXpathDataFollows} isConstraint={false}
                                                 root={constants.code_fragment["class"]["follows"][this.state["follows"].key].xpath}/>);
                case "name":
                    d3.select(`#${this.state.assignedID}-after_1`).classed(`ruleGroupDiv ${this.state["target"]}`, true);
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
                                <b>{constants.code_fragment["class"][group][cons["key"]]["pre"]}</b>
                            </div>
                            <div className={group === "within" ? "" : "rowItem"}>
                                {this.switchMethod(group, i, cons)}
                            </div>
                            <div className={group === "within" ? "inlineText" : "rowItem inlineText"}>
                                <b>{constants.code_fragment["class"][group][cons["key"]]["post"]}</b>
                            </div>
                        </div>
                    )
                })}


                <DropdownButton title={``} id="dropdown-size-medium">
                    {Object.keys(constants.code_fragment["class"][group]).map((key, i) => {
                        return (
                            <MenuItem eventKey={key} key={i}
                                      onSelect={(evt) => {
                                          this.xpath.xpathConstraint[group].push(constants.code_fragment["class"][group][evt]["xpath"]);
                                          this.sendDataBack();
                                          this.state[group].push({
                                              key: evt,
                                              value: constants.code_fragment["class"][group][evt],
                                              text: ""
                                          });
                                          this.forceUpdate();
                                      }}
                            >{constants.code_fragment["class"][group][key].name}
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
            case "class":
                return (<ClassFragment target={"default"} assignedId={this.state.assignedID + "_class_" + i}
                                       callbackFromParent={this.receiveXpathDataConstraints} isConstraint={true}
                                       constraintIndices={{"group": group, "i": i}}
                                       root={constants.code_fragment["class"][group][this.state[group][i].key].xpath}/>);
            case "function":
                return (<FunctionFragment target={"default"} category={"function"}
                                          assignedId={this.state.assignedID + "_function_" + i}
                                          callbackFromParent={this.receiveXpathDataConstraints} isConstraint={true}
                                          constraintIndices={{"group": group, "i": i}}
                                          root={constants.code_fragment["class"][group][this.state[group][i].key].xpath}/>);
            case "constructor":
                return (<FunctionFragment target={"default"} category={"constructor"}
                                          assignedId={this.state.assignedID + "_constructor_" + i}
                                          callbackFromParent={this.receiveXpathDataConstraints} isConstraint={true}
                                          constraintIndices={{"group": group, "i": i}}
                                          root={constants.code_fragment["class"][group][this.state[group][i].key].xpath}/>);
            case "function declaration":
                return (<FunctionFragment target={"default"} category={"function declaration"}
                                          assignedId={this.state.assignedID + "_function_decl_" + i}
                                          callbackFromParent={this.receiveXpathDataConstraints} isConstraint={true}
                                          constraintIndices={{"group": group, "i": i}}
                                          root={constants.code_fragment["class"][group][this.state[group][i].key].xpath}/>);
            case "declaration":
                return (<DeclarationFragment target={""}
                                             assignedId={this.state.assignedID + "_decl_" + i}
                                             callbackFromParent={this.receiveXpathDataConstraints} isConstraint={true}
                                             constraintIndices={{"group": group, "i": i}}
                                             root={constants.code_fragment["class"][group][this.state[group][i].key].xpath}/>);
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
            default:
                return (<div/>)

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
        this.xpath.xpathConstraint[constraintIndices.group][constraintIndices.i] = xpathData;
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
        this.xpath.xpathConstraint[group][i] = this.state[group][i].value["xpath"].replace('<NAME>',this.state[group][i].text);
        this.sendDataBack();
    }

    /**
     * send the xpath data to the parent node
     */
    sendDataBack() {

        let cons = this.xpath.xpathConstraint["top"]
            .concat(this.xpath.xpathConstraint["before"])
            .concat(this.xpath.xpathConstraint["after_1"])
            .concat(this.xpath.xpathConstraint["after_2"])
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

export default ClassFragment;
