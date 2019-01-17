/**
 * Created by saharmehrpour on 12/17/18.
 *
 */

import React from 'react';

import TiDelete from 'react-icons/lib/ti/delete';

import {GuiConstants} from './guiConstants';
import {CustomAddDropDown, CustomFollowDropDown} from "./customAddFollowDropDown";


class GuiComponent extends React.Component {

    constructor(props) {
        super(props);

        this.ws = props["ws"];
        this.state = {...props["state"], element: props["element"]};

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
                {this.renderRemoveElement("innerRemoveIcon")}
                <div className={"rowGroup"}>
                    {this.renderGroup("top")}
                </div>
                <div className={"rowGroup"}>
                    {this.renderElementMainBefore()}
                    {this.renderGroup("before_1")}
                    {this.renderGroup("before_2")}
                    {this.renderElementMainMiddle(1)}
                    {this.renderGroup("after_1")}
                    {this.renderElementMainMiddle(2)}
                    {this.renderGroup("after_2")}
                    {this.renderElementMainAfter()}
                </div>
                <div className={"rowGroup"}>{this.renderElementBodyBegin()}</div>
                <div className={"rowGroup"}>{this.renderGroup("within")}</div>
                <div className={"rowGroup"}>{this.renderElementBodyEnd()}</div>
                <div className={"rowGroup"}>{this.renderChild()}</div>
            </div>
        )
    }


    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        this.setState({
            element: nextProps.element,
            ...nextProps.state
        });
    }

    /**
     * render groups: top, before, after, within
     */
    renderGroup(group) {
        if (GuiConstants.code_fragment[this.state.element][group].length === 0) return null;
        return (
            <div className={this.chooseClass(group) + (group === "within" ? "" : " rowItem")}>
                {this.renderDefaultTitle(group)}
                {this.state.children[group].map((cons, i) =>
                    (<div className={group === "within" || group === "top" ? "rowGroup" : "rowItem"} key={i}>
                        {cons.value.type === "text" || cons.value.type === "wideText" ? this.renderTextElement(cons, group, i) : (
                            <GuiComponent ws={this.ws} state={cons}
                                          element={cons.value.type}
                                          callbackFromParent={this.sendDataBack}
                                          removeFunction={() => {
                                              const children = this.state.children;
                                              children[group].splice(i, 1);
                                              this.setState({children});
                                              this.sendDataBack();
                                          }}/>
                        )}
                    </div>)
                )}

                <div className={group === "within" ? "rowGroup" : "rowItem"}>
                    <CustomAddDropDown
                        menuItemsText={GuiConstants.code_fragment[this.state.element][group]
                            .map(key => GuiConstants.gui_tree[key]["buttonName"])}
                        menuItemsEvent={GuiConstants.code_fragment[this.state.element][group]}
                        onSelectFunction={(evt) => {
                            this.state.children[group].push({
                                key: evt,
                                value: GuiConstants.gui_tree[evt],
                                target: "",
                                children: JSON.parse(JSON.stringify(GuiConstants.state_children)),
                                grammar: GuiConstants.gui_tree[evt]["grammar"]
                            });
                            this.sendDataBack();
                            this.forceUpdate();
                        }}/>
                </div>
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
                        menuItemsText={GuiConstants.code_fragment[this.state.element]["child"]
                            .map(key => GuiConstants.gui_tree[key]["buttonName"])}
                        menuItemsEvent={GuiConstants.code_fragment[this.state.element]["child"]}
                        target={this.state.target}
                        onSelectFunction={(evt) => {
                            const children = this.state.children;
                            children.child = {
                                key: evt,
                                value: GuiConstants.gui_tree[evt],
                                target: this.state.target !== "" ? this.state.target : "default",
                                children: JSON.parse(JSON.stringify(GuiConstants.state_children)),
                                grammar: GuiConstants.gui_tree[evt]["grammar"]
                            };
                            this.setState({children});
                            this.sendDataBack();
                        }}
                    />
                </div>
            );

        else {
            // elements that don't need to be rendered
            if (this.state.children["child"].value["type"] === "text")
                return (<TiDelete size={20}
                                  className={"tiDelete " + (this.state.target === "" ? "default" : this.state.target)}
                                  onClick={() => {
                                      const children = this.state.children;
                                      children["child"] = {};
                                      this.setState({children});
                                      this.sendDataBack();
                                  }}/>);
            else if (this.state.children["child"].value["type"] === "wideText")
                return (
                    <div className={"ruleGroupDiv " + (this.state["target"] !== "" ? this.state["target"] : "default")}>
                        {GuiConstants.gui_tree[this.state.children["child"]["key"]]["pre"] ? (
                            <div className={"rowItem inlineText"}>
                                <b>{GuiConstants.gui_tree[this.state.children["child"]["key"]]["pre"]}</b>
                            </div>
                        ) : null}
                        <div className={"rowItem inlineText"} style={{width: "70%"}}>
                            <input type={"text"} className={"inputText"} disabled={true}
                                   value={typeof this.state.children["child"]["text"] === "string" ? this.state.children["child"]["text"] : ""}
                                   placeholder={this.state.children["child"].value.placeholder}
                                   onBlur={(e) => {
                                       let children = this.state.children;
                                       children["child"].text = e.target.value;
                                       this.sendDataBack();
                                   }}
                                   onChange={(e) => {
                                       const text = this.state.text;
                                       text["child"].text = e.target.value;
                                       this.setState({text});
                                   }}/>
                        </div>
                        {GuiConstants.gui_tree[this.state.children["child"]["key"]]["post"] ? (
                            <div className={"rowItem inlineText"}>
                                <b>{GuiConstants.gui_tree[this.state.children["child"]["key"]]["post"]}</b>
                            </div>
                        ) : null}
                        <div className={"removeIcon rowItem inlineText"}>
                            <TiDelete size={20}
                                      className={"tiDelete " + (this.state.target === "" ? "default" : this.state.target)}
                                      onClick={() => {
                                          const children = this.state.children;
                                          children["child"] = {};
                                          this.setState({children});
                                          this.sendDataBack();
                                      }}/>
                        </div>
                    </div>
                );
            else
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


    /**
     * render elements defined by input text
     * @param cons
     * @param group
     * @param i
     * @returns {XML}
     */
    renderTextElement(cons, group, i) {
        return (
            <div className={cons.value.type === "wideText"? "divBorder" : ""}>
                {GuiConstants.gui_tree[cons["key"]]["pre"] ? (
                    <div className={"rowItem inlineText"}>
                        <b>{GuiConstants.gui_tree[cons["key"]]["pre"]}</b>
                    </div>
                ) : null}
                <div className={"rowItem inlineText"}
                     style={cons.value.type === "wideText" ? {width: "70%"} : {}}>
                    <input type={"text"}
                           className={"inputText" + (cons["key"].includes(" not ") ? " redText" : "")}
                           value={typeof this.state.text[group][i].text === "string" ? this.state.text[group][i].text : ""}
                           placeholder={cons.value.placeholder}
                           onBlur={(e) => {
                               cons.text = e.target.value;
                               this.sendDataBack();
                           }}
                           onChange={(e) => {
                               const text = this.state.text;
                               text[group][i].text = e.target.value;
                               this.setState({text});
                           }}/>
                </div>
                {GuiConstants.gui_tree[cons["key"]]["post"] ? (
                    <div className={"rowItem inlineText"}>
                        <b>{GuiConstants.gui_tree[cons["key"]]["post"]}</b>
                    </div>
                ) : null}
                <div className={"removeIcon rowItem inlineText"}>
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
        )
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
                              className={"tiDelete " + this.state.target}
                              onClick={() => this.props["removeFunction"]()}/>
                </div>);
        return null;
    }

    /**
     *  render the text in the beginning of the main line
     */
    renderElementMainBefore() {
        switch (this.state.element) {
            case "annotation":
                return (<div className={"rowItem"}><b>@</b></div>);
            case "return value":
                return (<div className={"rowItem"}><b>return</b></div>);
            default:
                return null;
        }
    }

    /**
     * render the text in the main line of the element
     * @param location location of the inserted element:
     * 1 (only for declaration statement between after_1 and after_2) or 2 (between before_2 and after_1)
     */
    renderElementMainMiddle(location) {
        if (location === 2) {
            if (this.state.element === "declaration statement")
                return (<div className={"rowItem inlineText"}><b>=</b></div>);
            return null;
        }

        switch (this.state.element) {
            case "constructor":
                return (<div className={"rowItem inlineText"}><b>className (</b></div>);
            case "function":
            case "abstract function":
                return (<div className={"rowItem inlineText"}><b>(</b></div>);
            case "class":
                return (<div className={"rowItem inlineText"}><b>class</b></div>);
            case "interface":
                return (<div className={"rowItem inlineText"}><b>interface</b></div>);

            default:
                return null;
        }
    }


    /**
     *  render the text at the end of the main line
     */
    renderElementMainAfter() {
        switch (this.state.element) {
            case "abstract function":
                return (<div className={"rowItem inlineText"}><p><b>); </b></p></div>);
            case "function":
            case "constructor":
                return (<div className={"rowItem inlineText"}><p><b>) </b></p></div>);

            default:
                return null;
        }
    }


    /**
     *  render the text in the beginning of the body
     */
    renderElementBodyBegin() {
        switch (this.state.element) {
            case "class":
            case "interface":
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
        switch (this.state.element) {
            case "class":
            case "interface":
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
        switch (this.state.element) {
            case "class":
                if (group === 'after_1' && this.state.children["after_1"].length === 0)
                    return (<div className={" rowItem inlineText"}>
                        <span className={"temporary-text"}>class name</span>
                    </div>);
                return null;
            case "interface":
                if (group === 'after_1' && this.state.children["after_1"].length === 0)
                    return (<div className={" rowItem inlineText"}>
                        <span className={"temporary-text"}>interface name</span>
                    </div>);
                return null;
            case "function":
            case "abstract function":
            case "constructor":
                if (group === 'before_2' && this.state.children["before_2"].length === 0)
                    return(<div className={" rowItem inlineText"}>
                        <span className={"temporary-text"}>{this.state.element} name</span>
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
            }
            if (group === "before_2") {
                if (targetKey === "name" && this.state.element === "function") isTarget = true;
                if (targetKey === "name" && this.state.element === " abstract function") isTarget = true;
                if (targetKey === "type" && this.state.element === "declaration statement") isTarget = true;
            }
            if (group === "after_1") {
                if (targetKey === "name" && this.state.element === "class") isTarget = true;
                if (targetKey === "name" && this.state.element === "interface") isTarget = true;
                if (targetKey === "name" && this.state.element === "declaration statement") isTarget = true;
                if (targetKey === "parameter") isTarget = true;
            }
            if (group === "after_2") {
                if (targetKey === "implementation") isTarget = true;
                if (targetKey === "extension") isTarget = true;
                if (targetKey === "initial value") isTarget = true;
            }
        }


        return isTarget ? "divBorder ruleGroupDiv " + (this.state["target"] !== "" ? this.state["target"] : "default") : "divBorder";
    }

}

export default GuiComponent;
