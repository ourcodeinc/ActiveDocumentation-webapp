/**
 * Created by saharmehrpour on 3/12/18.
 */

import React from 'react';
import '../../App.css';

import {DropdownButton, FormControl, MenuItem, Row} from 'react-bootstrap';
import {constants} from '../constants';
import FunctionFragment from './functionFragment'
import DeclarationFragment from "./declarationFragment";

import * as d3 from "d3";


class ClassFragment extends React.Component {

    constructor(props) {
        super(props);
        // target assignedId ws callbackFromParent isConstraint constraintIndices root

        this.ws = props["ws"];
        this.state = props["state"]

    }

    render() {
        return (
            <div className={"ruleGroupDiv " + this.state.target} id={this.props["assignedId"]}>
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
        if (!this.state.children["follows"].hasOwnProperty("key"))
            return (
                <div>
                    <DropdownButton title={`follows`} className={this.state.target} id={"drop_down"}>
                        {Object.keys(constants.code_fragment["class"]["follows"]).map((key, i) => {
                            return (
                                <MenuItem eventKey={key} key={i}
                                          onSelect={(evt) => {
                                              this.state.children.follows = {
                                                  key: evt,
                                                  value: constants.code_fragment["class"]["follows"][evt],
                                                  target: this.state.target,
                                                  children: JSON.parse(JSON.stringify(constants.state_children)),
                                                  xpath: ""
                                              };

                                              this.forceUpdate();
                                          }}
                                >{constants.code_fragment["class"]["follows"][key].name}
                                </MenuItem>);
                        })}
                    </DropdownButton>
                </div>
            );

        else {
            this.sendDataBack();
            switch (this.state.children["follows"].key) {
                case "subclass":
                    return (
                        <ClassFragment ws={this.ws} state={this.state.children["follows"]}
                                       assignedId={this.props["assignedId"] + "_class_follows"}
                                       callbackFromParent={this.receiveDataFollows} isConstraint={false}/>);

                case "function":
                    return (
                        <FunctionFragment category={"function"} ws={this.ws} state={this.state.children["follows"]}
                                          assignedId={this.props["assignedId"] + "_function_follows"}
                                          callbackFromParent={this.receiveDataFollows} isConstraint={false}/>);

                case "constructor":
                    return (
                        <FunctionFragment category={"constructor"} ws={this.ws} state={this.state.children["follows"]}
                                          assignedId={this.props["assignedId"] + "_constructor_follows"}
                                          callbackFromParent={this.receiveDataFollows} isConstraint={false}/>);
                case "functionDeclaration":
                    return (<FunctionFragment category={"functionDeclaration"} ws={this.ws}
                                              state={this.state.children["follows"]}
                                              assignedId={this.props["assignedId"] + "_function_decl_follows"}
                                              callbackFromParent={this.receiveDataFollows} isConstraint={false}/>);
                case "declaration":
                    return (<DeclarationFragment ws={this.ws} state={this.state.children["follows"]}
                                                 assignedId={this.props["assignedId"] + "_decl_follows"}
                                                 callbackFromParent={this.receiveDataFollows} isConstraint={false}/>);
                case "name":
                    d3.select(`#${this.props["assignedId"]}-after_1`).classed(`ruleGroupDiv ${this.state["target"]}`, true);
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
            <div className={group === "within" ? "" : "rowItem"} id={`${this.props["assignedId"]}-${group}`}>
                {(group === 'after_1' && this.state.children["after_1"].length === 0) ?
                    <div className={" rowItem inlineText"}><p><b>{"className"}</b></p></div> : ""
                }
                {this.state.children[group].map((cons, i) => {
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
                                          this.state.children[group].push({
                                              key: evt,
                                              value: constants.code_fragment["class"][group][evt],
                                              target: "default",
                                              children: JSON.parse(JSON.stringify(constants.state_children)),
                                              xpath: constants.code_fragment["class"][group][evt]["xpath"]
                                          });
                                          this.sendDataBack();
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
        let type = this.state.children[group][i].value.type;
        switch (type) {
            case "class":
                return (
                    <ClassFragment ws={this.ws} state={this.state.children[group][i]}
                                   assignedId={this.props["assignedId"] + "_class_" + i}
                                   callbackFromParent={this.receiveDataConstraints} isConstraint={true}
                                   constraintIndices={{"group": group, "i": i}}/>);
            case "function":
                return (<FunctionFragment category={"function"} ws={this.ws} state={this.state.children[group][i]}
                                          assignedId={this.props["assignedId"] + "_function_" + i}
                                          callbackFromParent={this.receiveDataConstraints} isConstraint={true}
                                          constraintIndices={{"group": group, "i": i}}/>);
            case "constructor":
                return (<FunctionFragment category={"constructor"} ws={this.ws} state={this.state.children[group][i]}
                                          assignedId={this.props["assignedId"] + "_constructor_" + i}
                                          callbackFromParent={this.receiveDataConstraints} isConstraint={true}
                                          constraintIndices={{"group": group, "i": i}}/>);
            case "functionDeclaration":
                return (<FunctionFragment category={"functionDeclaration"} ws={this.ws}
                                          state={this.state.children[group][i]}
                                          assignedId={this.props["assignedId"] + "_function_decl_" + i}
                                          callbackFromParent={this.receiveDataConstraints} isConstraint={true}
                                          constraintIndices={{"group": group, "i": i}}/>);
            case "declaration":
                return (<DeclarationFragment ws={this.ws} state={this.state.children[group][i]}
                                             assignedId={this.props["assignedId"] + "_decl_" + i}
                                             callbackFromParent={this.receiveDataConstraints} isConstraint={true}
                                             constraintIndices={{"group": group, "i": i}}/>);
            case "text":
                return (
                    <FormControl type="text" value={cons["text"]}
                                 placeholder={this.state.children[group][i].value.placeholder}
                                 onChange={(e) => {
                                     cons.text = e.target.value;
                                     this.updateXpathText(group, i);
                                 }}/>
                );
            default:
                return (<div/>)

        }
    }


    /**
     * receive xpath data from the child nodes
     * @param stateData
     * @param constraintIndices
     */
    receiveDataConstraints = (stateData, constraintIndices) => {
        this.state.children[constraintIndices.group][constraintIndices.i] = stateData;
        this.sendDataBack();
    };

    /**
     * receive xpath data from the child nodes
     * @param stateData
     */
    receiveDataFollows = (stateData) => {
        this.state.children["follows"] = stateData;
        this.sendDataBack();
    };

    /**
     * update the text of constraints
     * @param group
     * @param i
     */
    updateXpathText(group, i) {
        this.state.children[group][i].xpath = this.state.children[group][i].value["xpath"].replace('<NAME>', this.state.children[group][i].text);
        this.sendDataBack();
    }

    /**
     * send the xpath data to the parent node
     */
    sendDataBack() {

        if (this.props["isConstraint"])
            this.props["callbackFromParent"](this.state, this.props["constraintIndices"]);
        else
            this.props["callbackFromParent"](this.state);

    }


}

export default ClassFragment;
