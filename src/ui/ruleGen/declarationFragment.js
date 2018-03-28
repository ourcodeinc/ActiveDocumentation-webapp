/**
 * Created by saharmehrpour on 3/13/18.
 */

import React from 'react';
import '../../App.css';

import {FormControl, Row, DropdownButton, MenuItem} from 'react-bootstrap';
import MdDelete from 'react-icons/lib/md/delete';

import {constants} from '../constants';

import ExpressionFragment from "./expressionFragment";
import AnnotationFragment from "./annotationFragment";


class DeclarationFragment extends React.Component {

    constructor(props) {
        super(props);
        // target assignedId ws callbackFromParent isConstraint constraintIndices root

        this.ws = props["ws"];

        this.state = props["state"];

        this.state.text = JSON.parse(JSON.stringify(this.state.children));
    }

    render() {
        return (
            <div id={this.props["assignedId"]}
                 className={(this.state.target === "") ? "divBorder" : "ruleGroupDiv " + this.state.target}>
                <Row style={{marginLeft: "0"}}>
                    {this.renderGroup("top")}
                </Row>
                <Row style={{margin: "0"}}>
                    <div className={"rowItem"}>
                        {this.renderGroup("before_1")}
                        {this.renderGroup("before_2")}
                        {this.renderGroup("after")}
                        {(this.props["category"] === 'declarationStatement') ? this.renderGroup("within") : ""}

                    </div>
                    {this.renderFollows()}
                </Row>
            </div>
        )
    }

    /**
     * send the xpath data to the parent node
     */
    sendDataBack = () => {
        this.props["callbackFromParent"]();
    };


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
                <div style={{float: 'right', marginTop: "20px"}}><
                    MdDelete size={25}
                             style={{cursor: "pointer", marginTop: "8px", color: "grey"}}
                             onClick={() => {
                                 const children = this.state.children;
                                 children["follows"] = {};
                                 this.setState({children});
                                 this.sendDataBack();
                             }}/>
                </div>
            )
        }
    }

    /**
     * render groups: top, before, after, within
     */
    renderGroup(group) {
        return (
            <div className={this.chooseClass(group)} id={`${this.props["assignedId"]}-${group}`}>
                {(group === 'after_1' && this.state.children["after_1"].length === 0) ?
                    <div className={" rowItem inlineText"}><p><b>{"className"}</b></p></div> : ""
                }
                {this.state.children[group].map((cons, i) => {
                    return (
                        <div className={group === "within" ? "" : "rowItem"} key={i}>
                            <div style={{float: 'right'}}>
                                <MdDelete size={25}
                                          style={{cursor: "pointer", marginTop: "8px", color: "grey"}}
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

                {(() => {
                    if (this.state.children[group].length === 0) return (
                        <DropdownButton title={``} id="dropdown-size-medium">
                            {Object.keys(constants.code_fragment[this.props["category"]][group]).map((key, i) => {
                                return (
                                    <MenuItem eventKey={key} key={i}
                                              onSelect={(evt) => {
                                                  this.state.children[group].push({
                                                      key: evt,
                                                      value: constants.code_fragment[this.props["category"]][group][evt],
                                                      target: "",
                                                      children: JSON.parse(JSON.stringify(constants.state_children)),
                                                      xpath: constants.code_fragment[this.props["category"]][group][evt]["xpath"]
                                                  });
                                                  this.state.text[group].push(this.state.children[group][this.state.children[group].length - 1]);
                                                  this.sendDataBack();
                                                  this.forceUpdate();
                                              }}
                                    >{constants.code_fragment[this.props["category"]][group][key].name}
                                    </MenuItem>);
                            })}
                        </DropdownButton>)
                })()}
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
            case "annotation":
                return (<AnnotationFragment ws={this.ws} state={this.state.children[group][i]}
                                            assignedId={this.props["assignedId"] + "_annotation_" + i}
                                            callbackFromParent={this.sendDataBack}/>);
            case "expressionStatement":
                return (<ExpressionFragment category={"expressionStatement"}
                                            ws={this.ws} state={this.state.children[group][i]}
                                            assignedId={this.props["assignedId"] + "_expr_" + i}
                                            callbackFromParent={this.sendDataBack}/>);
            case "text":
                return (
                    <FormControl type="text" value={this.state.text[group][i].text}
                                 placeholder={this.state.children[group][i].value.placeholder}
                                 onBlur={(e) => {
                                     cons.text = e.target.value;
                                     this.updateXpathText(group, i);
                                 }}
                                 onChange={(e) => {
                                     const text = this.state.text;
                                     text[group][i].text = e.target.value;
                                     this.setState({text});
                                 }}/>
                );
            default:
                return (<div/>)

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
     * choose the class of the div to display the border for the selected node (name)
     * @param group 'name', 'type'
     * @returns {*}
     */
    chooseClass(group) {
        if (this.state.children["follows"].hasOwnProperty("key")) {
            if (this.state.children["follows"].key === 'type' && group === 'before_2')
                return "divBorder rowItem ruleGroupDiv " + this.state["target"];
            if (this.state.children["follows"].key === 'name' && group === 'after')
                return "divBorder rowItem ruleGroupDiv " + this.state["target"];
            if (this.state.children["follows"].key === 'initialization expression' && group === 'within')
                return "divBorder rowItem ruleGroupDiv " + this.state["target"];

        }
        return "divBorder rowItem";
    }

}

export default DeclarationFragment;
