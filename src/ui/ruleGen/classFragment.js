/**
 * Created by saharmehrpour on 3/12/18.
 */

import React from 'react';
import '../../App.css';

import {Dropdown, DropdownButton, MenuItem} from 'react-bootstrap';
// import MdAddCircleOutline from 'react-icons/lib/md/add-circle-outline';
// import MdAddCircle from 'react-icons/lib/md/add-circle';
import MdAddBox from 'react-icons/lib/md/add-box';
import TiDelete from 'react-icons/lib/ti/delete';

import {constants} from '../constants';
import FunctionFragment from './functionFragment'
import DeclarationFragment from "./declarationFragment";
import AnnotationFragment from "./annotationFragment";
import CustomToggle from "./customToggle";
import CustomMenu from "./customMenu";


class ClassFragment extends React.Component {

    constructor(props) {
        super(props);
        // target assignedId ws callbackFromParent root

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
                <div className={"rowGroup"}>
                    {this.renderGroup("top")}
                </div>
                <div className={"rowGroup"}>
                    <div className={"rowItem inlineText"}><b>class</b></div>
                    {this.renderGroup("after_1")}
                    {this.renderGroup("after_2")}
                </div>
                <div className={"rowGroup"}><b>&#123;</b></div>
                <div className={"rowGroup"}>{this.renderGroup("within")}</div>
                <div className={"rowGroup"}>{this.renderFollows()}</div>
                <div className={"rowGroup"}><b>&#125;</b></div>
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
                                              const children = this.state.children;
                                              children.follows = {
                                                  key: evt,
                                                  value: constants.code_fragment["class"]["follows"][evt],
                                                  target: this.state.target,
                                                  children: JSON.parse(JSON.stringify(constants.state_children)),
                                                  xpath: constants.code_fragment["class"]["follows"][evt].xpath
                                              };
                                              this.setState({children});
                                              this.sendDataBack();
                                          }}
                                >{constants.code_fragment["class"]["follows"][key].name}
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
                            case "subclass":
                                return (<ClassFragment ws={this.ws} state={this.state.children["follows"]}
                                                       assignedId={this.props["assignedId"] + "_class_follows"}
                                                       callbackFromParent={this.sendDataBack}
                                                       removeFunction={removeFunction}/>);

                            case "function":
                                return (<FunctionFragment category={"function"} ws={this.ws}
                                                          state={this.state.children["follows"]}
                                                          assignedId={this.props["assignedId"] + "_function_follows"}
                                                          callbackFromParent={this.sendDataBack}
                                                          removeFunction={removeFunction}/>);

                            case "constructor":
                                return (<FunctionFragment category={"constructor"} ws={this.ws}
                                                          state={this.state.children["follows"]}
                                                          assignedId={this.props["assignedId"] + "_constructor_follows"}
                                                          callbackFromParent={this.sendDataBack}
                                                          removeFunction={removeFunction}/>);
                            case "abstractFunction":
                                return (<FunctionFragment category={"abstractFunction"} ws={this.ws}
                                                          state={this.state.children["follows"]}
                                                          assignedId={this.props["assignedId"] + "_function_decl_follows"}
                                                          callbackFromParent={this.sendDataBack}
                                                          removeFunction={removeFunction}/>);
                            case "declarationStatement":
                                return (<DeclarationFragment category={"declarationStatement"}
                                                             ws={this.ws} state={this.state.children["follows"]}
                                                             assignedId={this.props["assignedId"] + "_decl_follows"}
                                                             callbackFromParent={this.sendDataBack}
                                                             removeFunction={removeFunction}/>);
                            case "name":
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
            <div className={this.chooseClass(group)} id={`${this.props["assignedId"]}-${group}`}>
                {(group === 'after_1' && this.state.children["after_1"].length === 0) ?
                    <div className={" rowItem inlineText"}>
                        <span className={"temporary-text"}>{"className"}</span>
                    </div> : ""}
                {this.state.children[group].map((cons, i) => {
                    return (
                        <div className={group === "within" ? "" : "rowItem"} key={i}>
                            {(constants.code_fragment["class"][group][cons["key"]]["pre"] === "") ? "" :
                                <div className={"rowItem inlineText"}>
                                    <b>{constants.code_fragment["class"][group][cons["key"]]["pre"]}</b>
                                </div>
                            }
                            <div
                                className={group === "within" || group === "top" ? "" : "rowItem"}>
                                {this.switchMethod(group, i, cons)}
                            </div>
                            {(constants.code_fragment["class"][group][cons["key"]]["post"] === "") ? "" :
                                <div className={group === "within" ? "inlineText" : "rowItem inlineText"}>
                                    <b>{constants.code_fragment["class"][group][cons["key"]]["post"]}</b>
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
                        {Object.keys(constants.code_fragment["class"][group]).map((key, i) => {
                            return (
                                <MenuItem eventKey={key} key={i}
                                          onSelect={(evt) => {
                                              this.state.children[group].push({
                                                  key: evt,
                                                  value: constants.code_fragment["class"][group][evt],
                                                  target: evt !== "HAS_ANNOTATION" ? "default" : "",
                                                  children: JSON.parse(JSON.stringify(constants.state_children)),
                                                  xpath: constants.code_fragment["class"][group][evt]["xpath"]
                                              });
                                              this.sendDataBack();
                                              this.forceUpdate();
                                          }}
                                >{constants.code_fragment["class"][group][key].name}
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
            case "class":
                return (<ClassFragment ws={this.ws} state={this.state.children[group][i]}
                                       assignedId={this.props["assignedId"] + "_class_" + i}
                                       callbackFromParent={this.sendDataBack}
                                       removeFunction={removeFunction}/>);


            case "function":
                return (<FunctionFragment category={"function"} ws={this.ws} state={this.state.children[group][i]}
                                          assignedId={this.props["assignedId"] + "_function_" + i}
                                          callbackFromParent={this.sendDataBack}
                                          removeFunction={removeFunction}/>);
            case "constructor":
                return (<FunctionFragment category={"constructor"} ws={this.ws} state={this.state.children[group][i]}
                                          assignedId={this.props["assignedId"] + "_constructor_" + i}
                                          callbackFromParent={this.sendDataBack}
                                          removeFunction={removeFunction}/>);
            case "abstractFunction":
                return (<FunctionFragment category={"abstractFunction"} ws={this.ws}
                                          state={this.state.children[group][i]}
                                          assignedId={this.props["assignedId"] + "_function_decl_" + i}
                                          callbackFromParent={this.sendDataBack}
                                          removeFunction={removeFunction}/>);
            case "declarationStatement":
                return (<DeclarationFragment category={"declarationStatement"}
                                             ws={this.ws} state={this.state.children[group][i]}
                                             assignedId={this.props["assignedId"] + "_decl_" + i}
                                             callbackFromParent={this.sendDataBack}
                                             removeFunction={removeFunction}/>);
            case "annotation":
                return (<AnnotationFragment ws={this.ws} state={this.state.children[group][i]}
                                            assignedId={this.props["assignedId"] + "_annotation_" + i}
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
        if (this.state.children["follows"].hasOwnProperty("key") && this.state.children["follows"].key === 'name' && group === 'after_1')
            return "divBorder rowItem ruleGroupDiv " + this.state["target"];
        return "divBorder rowItem";
    }

}

export default ClassFragment;
