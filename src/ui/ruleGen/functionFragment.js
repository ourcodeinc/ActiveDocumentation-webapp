/**
 * Created by saharmehrpour on 3/12/18.
 */

import React from 'react';
import '../../App.css';

import {Dropdown, DropdownButton, MenuItem} from 'react-bootstrap';
import TiDelete from 'react-icons/lib/ti/delete'
import MdAddBox from 'react-icons/lib/md/add-box';

import {constants} from '../constants';
import ExpressionFragment from "./expressionFragment";
import DeclarationFragment from "./declarationFragment";
import AnnotationFragment from "./annotationFragment";
import CallFragment from "./chainCallFragment";
import SrcMLFragment from "./srcML";
import CustomToggle from "./customToggle";
import CustomMenu from "./customMenu";


class FunctionFragment extends React.Component {

    constructor(props) {
        super(props);
        // target assignedId ws callbackFromParent constraintIndices root category

        this.ws = props["ws"];
        this.state = props["state"];

        this.state.text = JSON.parse(JSON.stringify(this.state.children));

    }

    render() {
        return (
            <div className={"ruleGroupDiv " + this.state.target} id={this.props["assignedId"]}>
                {(this.props["removeFunction"]) ?
                    <div className={"innerRemoveIcon"}>
                        <TiDelete size={25}
                                  className={"tiDelete"}
                                  onClick={() => this.props["removeFunction"]()}/>
                    </div> : ""}

                <div className={"rowGroup"}>{this.renderGroup("top")}</div>
                <div className={"rowGroup"}>
                    {this.renderGroup("before_1")}
                    {(this.props["category"] !== "constructor") ? this.renderGroup("before_2") : ""}
                    <div className={"rowItem inlineText"}>
                        <b>{this.props["category"] === "constructor" ? "className (" : "("}</b>
                    </div>
                    {this.renderGroup("after")}
                    <div className={"inlineText"}>
                        <p><b>{this.props["category"] === "abstractFunction" ? ");" : ")"} </b></p>
                    </div>
                </div>
                <div className={"rowGroup"}><b>{this.renderBraces("start")}</b></div>
                {(this.props["category"] !== "abstractFunction") ? this.renderGroup("within") : ""}
                <div className={"rowGroup"}>{this.renderFollows()}</div>
                <div className={"rowGroup"}><b>{this.renderBraces("end")}</b></div>
            </div>
        )
    }

    /**
     * render curly braces - braces can't be rendered directly
     * @param location
     * @returns {*}
     */
    renderBraces(location) {
        let isBrace = (this.props["category"] !== "abstractFunction");
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
                                                  target: this.state.target !== "" ? this.state.target : "default",
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
                    {(() => {
                        let removeFunction = () => {
                            const children = this.state.children;
                            children["follows"] = {};
                            this.setState({children});
                            this.sendDataBack();
                        };
                        switch (this.state.children["follows"].key) {
                            case "declarationStatement":
                                return (<DeclarationFragment category={"declarationStatement"}
                                                             ws={this.ws} state={this.state.children["follows"]}
                                                             assignedId={this.props["assignedId"] + "_decl_follows"}
                                                             callbackFromParent={this.sendDataBack}
                                                             removeFunction={removeFunction}/>);
                            case "declaration":
                                return (<DeclarationFragment category={"declaration"}
                                                             ws={this.ws} state={this.state.children["follows"]}
                                                             assignedId={this.props["assignedId"] + "_decl_follows"}
                                                             callbackFromParent={this.sendDataBack}
                                                             removeFunction={removeFunction}/>);
                            case "expression":
                                return (<ExpressionFragment ws={this.ws} state={this.state.children["follows"]}
                                                            assignedId={this.props["assignedId"] + "_expr_follows"}
                                                            callbackFromParent={this.sendDataBack}
                                                            removeFunction={removeFunction}/>);
                            case "chainCall":
                                return (<CallFragment ws={this.ws} state={this.state.children["follows"]}
                                                      assignedId={this.props["assignedId"] + "_expr_follows"}
                                                      callbackFromParent={this.sendDataBack}
                                                      removeFunction={removeFunction}/>);
                            case "return_value":
                                return (
                                    <div className={"row"} style={{margin: "0"}}>
                                        <div className={"rowItem inlineText"}><b>return</b></div>
                                        <div>
                                            <SrcMLFragment ws={this.ws} state={this.state.children["follows"]}
                                                           placeholder={"Return VariableName or Literal"}
                                                           assignedId={this.props["assignedId"] + "_return_value"}
                                                           callbackFromParent={this.sendDataBack}
                                                           removeFunction={removeFunction}/>
                                        </div>
                                    </div>
                                );
                            case "return_method_call":
                                return (
                                    <div className={"row"} style={{margin: "0"}}>
                                        <div className={"rowItem inlineText"}><b>return</b></div>
                                        <div>
                                            <CallFragment ws={this.ws} state={this.state.children["follows"]}
                                                          assignedId={this.props["assignedId"] + "_return_call"}
                                                          callbackFromParent={this.sendDataBack}
                                                          removeFunction={removeFunction}/>
                                        </div>
                                    </div>
                                );
                            case "name":
                            case "parameter":
                                return (
                                    <div style={{float: 'left', width: "100%"}}>
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
                                );
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
            <div className={this.chooseClass(group)} id={`${this.props["assignedId"]}-${group}`}>
                {(group === 'before_2' && this.state.children["before_2"].length === 0) ?
                    <div className={" rowItem inlineText"}>
                        <span className={"temporary-text"}>{this.props["category"] + "Name"}</span>
                    </div> : ""
                }
                {this.state.children[group].map((cons, i) => {
                    return (
                        <div className={group === "within" ? "row" : "rowItem"} style={{margin: "0"}} key={i}>
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

                <Dropdown id="dropdown-custom-menu">
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
                                                  target: "",//"default",
                                                  children: JSON.parse(JSON.stringify(constants.state_children)),
                                                  xpath: constants.code_fragment[this.props["category"]][group][evt]["xpath"]
                                              });
                                              this.sendDataBack();
                                              this.forceUpdate();
                                          }}
                                >{constants.code_fragment[this.props["category"]][group][key].name}
                                </MenuItem>);
                        })}
                    </CustomMenu>
                </Dropdown>
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

            case "declarationStatement":
                return (<DeclarationFragment category={"declarationStatement"}
                                             ws={this.ws} state={this.state.children[group][i]}
                                             assignedId={this.props["assignedId"] + "_decl_" + i}
                                             callbackFromParent={this.sendDataBack}
                                             removeFunction={removeFunction}/>);
            case "declaration":
                return (<DeclarationFragment category={"declaration"}
                                             ws={this.ws} state={this.state.children[group][i]}
                                             assignedId={this.props["assignedId"] + "_decl_" + i}
                                             callbackFromParent={this.sendDataBack}
                                             removeFunction={removeFunction}/>);
            case "expression":
                return (<ExpressionFragment ws={this.ws} state={this.state.children[group][i]}
                                            assignedId={this.props["assignedId"] + "_expr_" + i}
                                            callbackFromParent={this.sendDataBack}
                                            removeFunction={removeFunction}/>);
            case "chainCall":
                return (<CallFragment ws={this.ws} state={this.state.children[group][i]}
                                      assignedId={this.props["assignedId"] + "_call_" + i}
                                      callbackFromParent={this.sendDataBack}
                                      removeFunction={removeFunction}/>);
            case "annotation":
                return (<AnnotationFragment ws={this.ws} state={this.state.children[group][i]}
                                            assignedId={this.props["assignedId"] + "_annotation_" + i}
                                            callbackFromParent={this.sendDataBack}
                                            removeFunction={removeFunction}/>);
            case "srcml":
                return (
                    <SrcMLFragment ws={this.ws} state={this.state.children[group][i]}
                                   placeholder={"Name or Literal"}
                                   assignedId={this.props["assignedId"] + "_name_" + group + "_" + i}
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
            case "number":
                return (
                    <div style={{marginTop: "2px"}}>
                        <div style={{float: "left"}}>
                            <input type={"number"} className={"inputText"}
                                   value={cons["text"]}
                                   placeholder={this.state.children[group][i].value.placeholder}
                                   onBlur={(e) => {
                                       cons.text = e.target.value;
                                       this.updateXpathNumber(group, i);
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
            return "divBorder rowItem ruleGroupDiv " + (this.state["target"] !== "" ? this.state["target"] : "default");
        if (this.state.children["follows"].hasOwnProperty("key") && this.state.children["follows"].key === 'parameter' && group === 'after')
            return "divBorder rowItem ruleGroupDiv " + (this.state["target"] !== "" ? this.state["target"] : "default");
        return "divBorder rowItem";
    }


}

export default FunctionFragment;
