/**
 * Created by saharmehrpour on 3/13/18.
 */

import React from 'react';
import '../../App.css';

import {Dropdown, DropdownButton, MenuItem} from 'react-bootstrap';
import MdAddBox from 'react-icons/lib/md/add-box';
import TiDelete from 'react-icons/lib/ti/delete';

import {constants} from '../constants';

import ExpressionFragment from "./expressionFragment";
import AnnotationFragment from "./annotationFragment";
import CallFragment from "./chainCallFragment";
import SrcMLFragment from "./srcML";
import CustomToggle from "./customToggle";
import CustomMenu from "./customMenu";


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
                 className={(this.state.target === "") ? "divBorder rowItem" : "rowItem ruleGroupDiv " + this.state.target}>
                {(this.props["removeFunction"]) ?
                    <div className={"innerRemoveIcon"}>
                        <TiDelete size={25}
                                  className={"tiDelete"}
                                  onClick={() => this.props["removeFunction"]()}/>
                    </div> : ""}
                <div className={"rowGroup"}>
                    {(this.props["category"] === 'declarationStatement') ? this.renderGroup("top") : ""}
                </div>
                <div className={"rowGroup"}>
                    <div className={"rowItem"}>
                        {(this.props["category"] === 'declarationStatement') ? this.renderGroup("before_1") : ""}
                        {this.renderGroup("before_2")}
                        {this.renderGroup("after")}
                        <div className={"rowItem inlineText"}>
                            {(this.props["category"] === 'declarationStatement') ? <b>=</b> : ""}
                        </div>
                        {(this.props["category"] === 'declarationStatement') ? this.renderGroup("within") : ""}

                    </div>
                    <div className={"rowItem"}>
                        {this.renderFollows()}
                    </div>
                </div>
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
                <div className={"removeIcon"}>
                    <TiDelete size={25}
                              className={"tiDelete"}
                              style={{color: "#2babd2"}}
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
                            {(constants.code_fragment[this.props["category"]][group][cons["key"]]["pre"] === "") ? "" :
                                <div className={"rowItem inlineText"}>
                                    <b>{constants.code_fragment[this.props["category"]][group][cons["key"]]["pre"]}</b>
                                </div>
                            }
                            <div className={group === "within" ? "" : "rowItem"}>
                                {this.switchMethod(group, i, cons)}
                            </div>
                            {(constants.code_fragment[this.props["category"]][group][cons["key"]]["post"] === "") ? "" :
                                <div className={group === "within" ? "inlineText" : "rowItem inlineText"}>
                                    <b>{constants.code_fragment[this.props["category"]][group][cons["key"]]["post"]}</b>
                                </div>
                            }
                        </div>
                    )
                })}

                {(() => {
                    if (this.state.children[group].length === 0) return (
                        <Dropdown id="dropdown-size-medium">
                            <CustomToggle bsRole="toggle">
                                <MdAddBox size={25} className={"mdAddBox"}/>
                            </CustomToggle>

                            <CustomMenu bsRole="menu">
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
                            </CustomMenu>
                        </Dropdown>)
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
        let removeFunction = () => {
            const children = this.state.children;
            children[group].splice(i, 1);
            this.setState({children});
            this.sendDataBack();
        };

        switch (type) {
            case "chainCall":
                return (<CallFragment ws={this.ws} state={this.state.children[group][i]}
                                      assignedId={this.props["assignedId"] + "_call_" + i}
                                      callbackFromParent={this.sendDataBack}
                                      removeFunction={removeFunction}/>);
            case "srcml":
                return (
                    <SrcMLFragment ws={this.ws} state={this.state.children[group][i]} placeholder={"Name or Literal"}
                                   assignedId={this.props["assignedId"] + "_name_" + group + "_" + i}
                                   callbackFromParent={this.sendDataBack}
                                   removeFunction={removeFunction}/>);
            case "annotation":
                return (<AnnotationFragment ws={this.ws} state={this.state.children[group][i]}
                                            assignedId={this.props["assignedId"] + "_annotation_" + i}
                                            callbackFromParent={this.sendDataBack}
                                            removeFunction={removeFunction}/>);
            case "expression":
                return (<ExpressionFragment ws={this.ws} state={this.state.children[group][i]}
                                            assignedId={this.props["assignedId"] + "_expr_" + i}
                                            callbackFromParent={this.sendDataBack}
                                            removeFunction={removeFunction}/>);
            case "text":
                return (
                    <div style={{marginTop: "2px"}}>
                        <div style={{float: "left"}}>
                            <input type={"text"} className={"inputText"}
                                   value={cons["text"]}
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
                        </div>
                        <div className={"removeIcon"}>
                            <TiDelete size={25}
                                      className={"tiDelete"}
                                      onClick={() => {
                                          const children = this.state.children;
                                          children[group].splice(i, 1);
                                          this.setState({children});
                                          this.sendDataBack();
                                      }}/>
                        </div>
                    </div>
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
                return "divBorder rowItem ruleGroupDiv " + (this.state["target"] !== "" ? this.state["target"] : "default");
            if (this.state.children["follows"].key === 'name' && group === 'after')
                return "divBorder rowItem ruleGroupDiv " + (this.state["target"] !== "" ? this.state["target"] : "default");
            if (this.state.children["follows"].key === 'initialization expression' && group === 'within')
                return "divBorder rowItem ruleGroupDiv " + (this.state["target"] !== "" ? this.state["target"] : "default");

        }
        return "divBorder rowItem";
    }

}

export default DeclarationFragment;
