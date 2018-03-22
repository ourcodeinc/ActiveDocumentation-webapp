/**
 * Created by saharmehrpour on 3/12/18.
 */

import React from 'react';
import '../../App.css';

import {DropdownButton, FormControl, MenuItem, Row} from 'react-bootstrap';
import MdDelete from 'react-icons/lib/md/delete';

import {constants} from '../constants';
import ExpressionFragment from "./expressionFragment";
import DeclarationFragment from "./declarationFragment";

import * as d3 from "d3";


class FunctionFragment extends React.Component {

    constructor(props) {
        super(props);
        // target assignedId ws callbackFromParent constraintIndices root category

        this.ws = props["ws"];
        this.state = props["state"]
    }

    render() {
        return (
            <div className={"ruleGroupDiv " + this.state.target} id={this.props["assignedID"]}>
                {/*<div style={{marginTop: "10px"}}><em>{this.props["category"]}</em></div>*/}
                <Row style={{margin: "0"}}>{this.renderGroup("top")}</Row>
                <Row style={{margin: "0"}}>

                    {this.renderGroup("before_1")}
                    {(this.props["category"] !== "constructor") ? this.renderGroup("before_2") : ""}
                    <div className={"rowItem inlineText"}>
                        <b>{this.props["category"] === "constructor" ? "className (" : "("}</b>
                    </div>
                    {this.renderGroup("after")}
                    <div className={"inlineText"}>
                        <p><b>{this.props["category"] === "functionDeclaration" ? ");" : ")"} </b></p>
                    </div>
                </Row>
                <p><b>{this.renderBraces("start")} </b></p>
                {(this.props["category"] !== "functionDeclaration") ? this.renderGroup("within") : ""}
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
        let isBrace = (this.props["category"] !== "functionDeclaration");
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
        if (!this.state.children["follows"].hasOwnProperty("key"))
            return (
                <div>
                    <DropdownButton title={`follows`} id={"drop_down"} className={this.state.target}>
                        {Object.keys(constants.code_fragment[this.props["category"]]["follows"]).map((key, i) => {
                            return (
                                <MenuItem eventKey={key} key={i}
                                          onSelect={(evt) => {
                                              const children = this.state.children;
                                              children.follows = {
                                                  key: evt,
                                                  value: constants.code_fragment[this.props["category"]]["follows"][evt],
                                                  target: this.state.target,
                                                  children: JSON.parse(JSON.stringify(constants.state_children)),
                                                  xpath: constants.code_fragment[this.props["category"]]["follows"][evt].xpath
                                              };
                                              this.setState({children});
                                              this.sendDataBack();
                                          }}
                                >{constants.code_fragment[this.props["category"]]["follows"][key].name}
                                </MenuItem>);
                        })}
                    </DropdownButton>
                </div>
            );

        else {
            return (
                <div>
                    <div style={{float: 'right'}}><MdDelete size={25}
                                                            style={{cursor: "pointer", marginTop: "8px"}}
                                                            onClick={() => {
                                                                const children = this.state.children;
                                                                children["follows"] = {};
                                                                this.setState({children});
                                                                this.sendDataBack();
                                                            }}/></div>
                    {(() => {
                        switch (this.state.children["follows"].key) {
                            case "declaration":
                                return (<DeclarationFragment ws={this.ws} state={this.state.children["follows"]}
                                                             assignedId={this.props["assignedID"] + "_decl_follows"}
                                                             callbackFromParent={this.sendDataBack}/>);

                            case "expression":
                                return (<ExpressionFragment ws={this.ws} state={this.state.children["follows"]}
                                                            assignedId={this.props["assignedID"] + "_expr_follows"}
                                                            callbackFromParent={this.sendDataBack}/>);
                            case "name":
                                // d3.select(`#${this.props["assignedID"]}-before_2`).classed(`ruleGroupDiv ${this.state["target"]}`, true);
                                break;
                            case "parameter":
                                d3.select(`#${this.props["assignedID"]}-after`).classed(`ruleGroupDiv ${this.state["target"]}`, true);
                                break;
                            default:
                                return (<div/>)
                        }
                    })()}
                </div>
            )
        }

    }


    /**
     * render groups: top, before, after, within
     */
    renderGroup(group) {
        return (
            <div className={this.chooseClass(group)} id={`${this.props["assignedID"]}-${group}`}>
                {(group === 'before_2' && this.state.children["before_2"].length === 0) ?
                    <div className={" rowItem inlineText"}><p><b>{this.props["category"] + "Name"}</b>
                    </p></div> : ""
                }
                {this.state.children[group].map((cons, i) => {
                    return (
                        <div className={group === "within" ? "" : "rowItem"} key={i}>
                            <div style={{float: 'right'}}><MdDelete size={25}
                                                                    style={{cursor: "pointer", marginTop: "8px"}}
                                                                    onClick={() => {
                                                                        const children = this.state.children;
                                                                        children[group].splice(i, 1);
                                                                        this.setState({children});
                                                                        this.sendDataBack();
                                                                    }}/></div>
                            <div className={"rowItem inlineText"}>
                                <b>{constants.code_fragment[this.props["category"]][group][cons["key"]]["pre"]}</b>
                            </div>
                            <div className={group === "within" ? "" : "rowItem"}
                                 style={(this.state.children[group][i].value.type === 'text') ? {paddingTop: "5px"} : {}}>
                            {this.switchMethod(group, i, cons)}
                            </div>
                            <div className={group === "within" ? "inlineText" : "rowItem inlineText"}>
                                <b>{constants.code_fragment[this.props["category"]][group][cons["key"]]["post"]}</b>
                            </div>
                        </div>
                    )
                })}


                <DropdownButton title={``} id="dropdown-size-medium">
                    {Object.keys(constants.code_fragment[this.props["category"]][group]).map((key, i) => {
                        return (
                            <MenuItem eventKey={key} key={i}
                                      onSelect={(evt) => {
                                          this.state.children[group].push({
                                              key: evt,
                                              value: constants.code_fragment[this.props["category"]][group][evt],
                                              target: "default",
                                              children: JSON.parse(JSON.stringify(constants.state_children)),
                                              xpath: constants.code_fragment[this.props["category"]][group][evt]["xpath"]
                                          });
                                          this.sendDataBack();
                                          this.forceUpdate();
                                      }}
                            >{constants.code_fragment[this.props["category"]][group][key].name}
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

            case "declaration":
                return (<DeclarationFragment ws={this.ws} state={this.state.children[group][i]}
                                             assignedId={this.props["assignedID"] + "_decl_" + i}
                                             callbackFromParent={this.sendDataBack}/>);
            case "expression":
                return (<ExpressionFragment ws={this.ws} state={this.state.children[group][i]}
                                            assignedId={this.props["assignedID"] + "_expr_" + i}
                                            callbackFromParent={this.sendDataBack}/>);
            case "text":
                return (
                    <FormControl type="text" value={cons["text"]}
                                 placeholder={this.state.children[group][i].value.placeholder}
                                 onChange={(e) => {
                                     cons.text = e.target.value;
                                     this.updateXpathText(group, i);
                                     let newStateGroup = {};
                                     newStateGroup[group] = this.state.children[group];
                                     this.setState(newStateGroup);
                                 }}/>
                );
            case "number":
                return (
                    <FormControl type="number" value={cons["text"]}
                                 placeholder={this.state.children[group][i].value.placeholder}
                                 onChange={(e) => {
                                     cons.text = e.target.value;
                                     this.updateXpathNumber(group, i);
                                     let newStateGroup = {};
                                     newStateGroup[group] = this.state.children[group];
                                     this.setState(newStateGroup);
                                 }}/>
                );
            default:
                return (<div/>);
        }
    }

    /**
     * update the text of constraints
     * @param group
     * @param i
     */
    updateXpathText(group, i) {
        const children = this.state.children;
        children[group][i].xpath = this.state.children[group][i].value["xpath"].replace('<NAME>', this.state.children[group][i].text);
        this.setState({children});
        this.sendDataBack();
    }


    /**
     * update the text of constraints
     * @param group
     * @param i
     */
    updateXpathNumber(group, i) {
        const children = this.state.children;
        children[group][i].xpath = this.state.children[group][i].value["xpath"].replace('<COUNT>', this.state.children[group][i].text);
        this.setState({children});
        this.sendDataBack();
    }

    /**
     * send the xpath data to the parent node
     */
    sendDataBack = () => {
        this.props["callbackFromParent"]();
    };


    /**
     * choose the class of the div to display the border for the selected node (name)
     * @param group
     * @returns {*}
     */
    chooseClass(group) {
        if (group === "within")
            return "";
        if (this.state.children["follows"].hasOwnProperty("key") && this.state.children["follows"].key === 'name' && group === 'before_2')
            return "divBorder rowItem ruleGroupDiv " + this.state["target"];
        if (this.state.children["follows"].hasOwnProperty("key") && this.state.children["follows"].key === 'parameter' && group === 'after')
            return "divBorder rowItem ruleGroupDiv " + this.state["target"];
        return "divBorder rowItem";
    }


}

export default FunctionFragment;
