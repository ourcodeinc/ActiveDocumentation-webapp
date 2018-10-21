/**
 * Created by saharmehrpour on 3/12/18.
 */

import React from 'react';

import TiDelete from 'react-icons/lib/ti/delete';

import {GuiConstants} from './guiConstants';
import {CustomAddDropDown, CustomFollowDropDown} from "./customAddFollowDropDown";
import SrcMLFragment from "./srcMLFragment";


class GuiComponent extends React.Component {

    constructor(props) {
        super(props);
        
        this.element = props["element"];
        this.ws = props["ws"];
        this.state = props["state"];

        /*
            since the element might keep many text values, each for
            one child, it needs to store a copy of the children
            It can't be replaced with a simple text variable
         */
        this.state.text = JSON.parse(JSON.stringify(this.state.children));

    }

    render() {
        return (
            <div className={"ruleGroupDiv " + this.state.target}>
                {["annotation", "declaration", "expression", "returnValue", "call"].indexOf(this.element) === -1 ? this.renderRemoveElement("innerRemoveIcon") : null}
                <div className={"rowGroup"}>
                    {this.renderGroup("top")}
                </div>
                <div className={"rowGroup"}>
                    {this.renderElementMainBefore()}
                    {this.renderGroup("before_1")}
                    {this.renderGroup("before_2")}
                    {this.element !== "declarationStatement" ? this.renderElementMainMiddle() : null}
                    {this.renderGroup("after_1")}
                    {this.element === "declarationStatement" ? this.renderElementMainMiddle() : null}
                    {this.renderGroup("after_2")}
                    <div className={"rowItem inlineText"}>{this.renderElementMainAfter()}</div>
                    <div
                        className={"rowItem"}>{["annotation", "declaration", "expression", "returnValue", "call"].indexOf(this.element) !== -1 ? this.renderChild() : null}</div>
                    {["annotation", "declaration", "expression", "returnValue", "call"].indexOf(this.element) !== -1 ? this.renderRemoveElement("removeIcon") : null}
                </div>
                <div className={"rowGroup"}>{this.renderElementBodyBegin()}</div>
                <div className={"rowGroup"}>{this.renderGroup("within")}</div>
                <div
                    className={"rowGroup"}>{["annotation", "declaration", "expression", "returnValue", "call"].indexOf(this.element) === -1 ? this.renderChild() : null}</div>
                <div className={"rowGroup"}>{this.renderElementBodyEnd()}</div>
            </div>
        )
    }


    /**
     * render groups: top, before, after, within
     */
    renderGroup(group) {
        if (Object.keys(GuiConstants.code_fragment[this.element][group]).length === 0) return null;
        return (
            <div className={this.chooseClass(group)}>
                {this.renderDefaultTitle(group)}
                {this.state.children[group].map((cons, i) => {
                    return (
                        <div className={group === "within" ? "" : "rowItem"} key={i}>
                            <div className={"rowItem inlineText"}>
                                <b>{GuiConstants.code_fragment[this.element][group][cons["key"]]["pre"]}</b>
                            </div>
                            <div
                                className={group === "within" || group === "top" ? "" : "rowItem"}>
                                {this.state.children[group][i].value.type === "text" ? (
                                    <div style={{marginTop: "2px"}}>
                                        <div style={{float: "left"}}>
                                            <input type={"text"} className={"inputText"}
                                                   value={cons["text"]}
                                                   placeholder={this.state.children[group][i].value.placeholder}
                                                   onBlur={(e) => {
                                                       cons.text = e.target.value;
                                                       // update XPath
                                                       const children = this.state.children;
                                                       // children[group][i].xpath = this.state.children[group][i].value["xpath"].replace('<NAME>', this.state.children[group][i].text);
                                                       this.setState({children});
                                                       this.sendDataBack();
                                                   }}
                                                   onChange={(e) => {
                                                       const text = this.state.text;
                                                       text[group][i].text = e.target.value;
                                                       this.setState({text});
                                                   }}/>
                                        </div>
                                        <div className={"removeIcon"}>
                                            <TiDelete size={20}
                                                      className={"tiDelete"}
                                                      onClick={() => {
                                                          const children = this.state.children;
                                                          children[group].splice(i, 1);
                                                          this.setState({children});
                                                          this.sendDataBack();
                                                      }}/>
                                        </div>
                                    </div>
                                ) : this.state.children[group][i].value.type === "srcml" ? (
                                    <div style={{marginTop: "2px"}}>
                                        <div style={{float: "left"}}>
                                            <SrcMLFragment ws={this.ws} state={this.state.children[group][i]}
                                                           placeholder={"Name or Literal"}
                                                           callbackFromParent={this.sendDataBack}
                                                           removeFunction={() => {
                                                               const children = this.state.children;
                                                               children[group].splice(i, 1);
                                                               this.setState({children});
                                                               this.sendDataBack();
                                                           }}/>
                                        </div>
                                    </div>
                                ) : (
                                    <GuiComponent ws={this.ws} state={this.state.children[group][i]}
                                                  element={this.state.children[group][i].value.type}
                                                  callbackFromParent={this.sendDataBack}
                                                  removeFunction={() => {
                                                      const children = this.state.children;
                                                      children[group].splice(i, 1);
                                                      this.setState({children});
                                                      this.sendDataBack();
                                                  }}/>
                                )}
                            </div>
                            <div className={group === "within" ? "inlineText" : "rowItem inlineText"}>
                                <b>{GuiConstants.code_fragment[this.element][group][cons["key"]]["post"]}</b>
                            </div>
                        </div>
                    )
                })}

                <CustomAddDropDown
                    menuItemsText={Object.keys(GuiConstants.code_fragment[this.element][group])
                        .map(key => GuiConstants.code_fragment[this.element][group][key]["buttonName"])}
                    menuItemsEvent={Object.keys(GuiConstants.code_fragment[this.element][group])
                        .map(key => key)}
                    onSelectFunction={(evt) => {
                        this.state.children[group].push({
                            key: evt,
                            value: GuiConstants.code_fragment[this.element][group][evt],
                            target: "",
                            children: JSON.parse(JSON.stringify(GuiConstants.state_children)),
                            // xpath: GuiConstants.code_fragment[this.element][group][evt]["xpath"],
                            grammar: GuiConstants.code_fragment[this.element][group][evt]["grammar"]
                        });
                        this.sendDataBack();
                        this.forceUpdate();
                    }}/>
            </div>
        )
    }


    /**
     * render the 'child' elements and constraints, drop down or a component
     */
    renderChild() {
        if (!this.state.children["child"].hasOwnProperty("key"))
            return (
                <div>
                    <CustomFollowDropDown
                        menuItemsText={Object.keys(GuiConstants.code_fragment[this.element]["child"])
                            .map(key => GuiConstants.code_fragment[this.element]["child"][key]["buttonName"])}
                        menuItemsEvent={Object.keys(GuiConstants.code_fragment[this.element]["child"])
                            .map(key => key)}
                        target={this.state.target}
                        onSelectFunction={(evt) => {
                            const children = this.state.children;
                            children.child = {
                                key: evt,
                                value: GuiConstants.code_fragment[this.element]["child"][evt],
                                target: this.state.target !== "" ? this.state.target : "default",
                                children: JSON.parse(JSON.stringify(GuiConstants.state_children)),
                                // xpath: GuiConstants.code_fragment[this.element]["child"][evt]["xpath"],
                                grammar: GuiConstants.code_fragment[this.element]["child"][evt]["grammar"]
                            };
                            this.setState({children});
                            this.sendDataBack();
                        }}
                    />
                </div>
            );

        else {
            switch (this.state.children["child"].key) {
                // elements that don't need to be rendered
                case "expression":
                case "annotation":
                case "parameter":
                case "extend":
                case "implement":
                case "specifier":
                case "type":
                case "name":
                    return (<TiDelete size={20}
                                      className={"tiDelete"}
                                      style={{color: "#2babd2"}}
                                      onClick={() => {
                                          const children = this.state.children;
                                          children["child"] = {};
                                          this.setState({children});
                                          this.sendDataBack();
                                      }}/>);
                default:
                    return (<GuiComponent ws={this.ws} state={this.state.children["child"]}
                                          element={this.state.children["child"].key}
                                          callbackFromParent={this.sendDataBack}
                                          removeFunction={() => {
                                              const children = this.state.children;
                                              children["child"] = {};
                                              this.setState({children});
                                              this.sendDataBack();
                                          }}/>)
            }
        }
    }


    /**
     * render the delete icon
     * @param className "innerRemoveIcon" when the icon is appearing on top-right
     * "removeIcon" when it appears inline
     * @returns {*}
     */
    renderRemoveElement(className = "innerRemoveIcon") {
        if (this.props["removeFunction"])
            return (
                <div className={className}>
                    <TiDelete size={20}
                              className={"tiDelete"}
                              onClick={() => this.props["removeFunction"]()}/>
                </div>);
        return null;
    }

    /**
     *  render the text in the beginning of the main line
     */
    renderElementMainBefore() {
        switch (this.element) {
            case "annotation":
                return (<div className={"rowItem"}><b>@</b></div>);
            case "returnValue":
                return (<div className={"rowItem"}><b>return</b></div>);
            default:
                return null;
        }
    }

    /**
     * render the text in the main line of the element
     */
    renderElementMainMiddle() {
        switch (this.element) {
            case "constructor":
                return (<div className={"rowItem inlineText"}><b>className (</b></div>);
            case "function":
            case "abstractFunction":
                return (<div className={"rowItem inlineText"}><b>(</b></div>);
            case "class":
                return (<div className={"rowItem inlineText"}><b>class</b></div>);
            case "expressionStatement":
            case "declarationStatement":
                return (<div className={"rowItem inlineText"}><b>=</b></div>);
            case "call":
            case "annotation":
                return (<div className={"rowItem"}><b>(</b></div>);

            default:
                return null;
        }
    }


    /**
     *  render the text at the end of the main line
     */
    renderElementMainAfter() {
        switch (this.element) {
            case "call":
            case "annotation":
                return (<div className={"rowItem"}><b>)</b></div>);
            case "abstractFunction":
                return (<div className={"inlineText"}><p><b>); </b></p></div>);

            case "function":
            case "constructor":
                return (<div className={"inlineText"}><p><b>) </b></p></div>);

            default:
                return null;
        }
    }


    /**
     *  render the text in the beginning of the body
     */
    renderElementBodyBegin() {
        switch (this.element) {
            case "class":
            case "function":
            case "constructor":
                return (<div className={"rowGroup"}><b>&#123;</b></div>);
            default:
                return null;
        }
    }


    /**
     *  render the text at the end of the body
     */
    renderElementBodyEnd() {
        switch (this.element) {
            case "class":
            case "function":
            case "constructor":
                return (<div className={"rowGroup"}><b>&#125;</b></div>);
            default:
                return null;
        }
    }


    /**
     * render default title when there is no children
     * @param group
     * @returns {XML}
     */
    renderDefaultTitle(group) {
        switch (this.element) {
            case "class":
                if (group === 'after_1' && this.state.children["after_1"].length === 0)
                    return (<div className={" rowItem inlineText"}>
                        <span className={"temporary-text"}>className</span>
                    </div>);
                return null;

            case "function":
            case "abstractFunction":
            case "constructor":
                if (group === 'before_2' && this.state.children["before_2"].length === 0)
                    return(<div className={" rowItem inlineText"}>
                        <span className={"temporary-text"}>{this.element} Name</span>
                    </div>);
                return null;

            default:
                return null;
        }
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

        let isTarget = false;
        if (this.state.children["child"].hasOwnProperty("key")) {
            let targetKey = this.state.children["child"].key;

            if(group === "top") {
                if (targetKey === "annotation") isTarget = true;
            }
            if (group === "before_1") {
                if (targetKey === "specifier") isTarget = true;
                if (targetKey === "name" && this.element === "annotation") isTarget = true;
                if (targetKey === "name" && this.element === "returnValue") isTarget = true;
                if (targetKey === "name" && this.element === "expressionStatement") isTarget = true;
            }
            if (group === "before_2") {
                if (targetKey === "name" && this.element === "function") isTarget = true;
                if (targetKey === "name" && this.element === "abstractFunction") isTarget = true;
                if (targetKey === "type" && this.element === "declaration") isTarget = true;
            }
            if (group === "after_1") {
                if (targetKey === "name" && this.element === "class") isTarget = true;
                if (targetKey === "name" && this.element === "declarationStatement") isTarget = true;
                if (targetKey === "name" && this.element === "declaration") isTarget = true;
                if (targetKey === "declaration" && this.element === "function") isTarget = true;
                if (targetKey === "parameter" && this.element === "function") isTarget = true;
                if (targetKey === "parameter" && this.element === "abstractFunction") isTarget = true;
                if (targetKey === "parameter" && this.element === "constructor") isTarget = true;
            }
            if (group === "after_2") {
                if (targetKey === "implement") isTarget = true;
                if (targetKey === "extend") isTarget = true;
                if (targetKey === "expression" && this.element === "declarationStatement") isTarget = true;
            }
        }


        return isTarget ? "divBorder rowItem ruleGroupDiv " + (this.state["target"] !== "" ? this.state["target"] : "default") : "divBorder rowItem";
    }

}

export default GuiComponent;
