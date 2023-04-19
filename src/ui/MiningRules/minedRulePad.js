/**
 * Created by saharmehrpour on 1/14/20.
 * Copied from src/ui/rulePadGraphicalEditor/graphicalComponent.js
 *
 */

import React, {Component, Fragment} from "react";

import {getConditionByName} from "../RulePad/rulePadGraphicalEditor/graphicalEditorConstants";
import {RootCloseWrapper} from "react-overlays";
import {Dropdown, MenuItem} from "react-bootstrap";


class MinedRulePad extends Component {

    constructor(props) {
        super(props);
        // elementId [optional], rulePadState (guiTree, guiElements), ruleIndex, styleClass [optional] << for styling
        // fileGroup

        this.state = {};

        this.styleClass = this.props.styleClass ? this.props.styleClass : "rootContainer";

        this.state.guiElements = props.rulePadState.guiElements;
        this.state.elementId = props.elementId ? props.elementId : "0";
        this.state.thisElement = this.state.guiElements[this.state.elementId];

        /*
           {type: "element",
            children: {
                top: "class_annotation",
                before_1: "class_memory",
                before_2: "class_visibility",
                before_3: "",
                after_1: "class_name",
                after_2: "class_implements",
                after_3: "class_extends",
                body: [
                    "declaration_statement_el",
                    "constructor_el",
                    "function_el",
                    "abstract_function_el"
                ]
            },
            grammar: "class",
            pre_before_1: "",
            pre_before_2: "",
            pre_before_3: "",
            pre_after_1: "class",
            pre_after_2: "",
            pre_after_3: "",
            post_after_3: "",
            pre_body: "{",
            post_body: "}",
            canBeSelected: true
        }
        */
        this.state.elementCondition = getConditionByName(this.state.thisElement.conditionName);
        /*
           {top: ["0.0.0"],
            before_1: ["0.1.0"],
            before_2: ["0.2.0"],
            before_3: ["0.3.0"],
            after_1: ["0.4.0"],
            after_2: ["0.5.0"],
            after_3: ["0.6.0"],
            body: [["0.7.0"], ["0.7.1"], ["0.7.2"], ["0.7.3"]]
        }
        */
        this.state.elementNode = props.rulePadState.guiTree[this.state.elementId];

        // when hover over an element, color coding regarding the frequency of the element would be shown.
        this.state.hover = false;
    }

    render() {
        return (
            <div className={"overlayContainer " + this.styleClass}
                 onMouseEnter={() => this.setState({hover: true})}
                 onMouseLeave={(e) => {
                     e.stopPropagation();
                     this.setState({hover: false})
                 }}
            >
                <div
                    className={"mainDiv-overlay elementDiv" + (this.state.thisElement.activeElement ? " activeElement" : "")
                    + (this.state.thisElement.selectedElement ? " selectedElement" : "")
                    + (this.state.thisElement.isConstraint ? " constraintElement" : "")}
                    id={`id__${this.props.ruleIndex}__${this.state.elementId}`}>
                    <div className={"rowGroup"}>
                        {this.renderGroup("top")}
                    </div>
                    <div className={"rowGroup"}>
                        {this.renderPrePost("pre_before_1")}
                        {this.renderGroup("before_1")}
                        {this.renderPrePost("pre_before_2")}
                        {this.renderGroup("before_2")}
                        {this.renderPrePost("pre_before_3")}
                        {this.renderGroup("before_3")}
                        {this.renderPrePost("pre_after_1")}
                        {this.renderGroup("after_1")}

                        {this.renderEmptyParamArgList()}
                        {this.renderAfter()}

                        {this.renderGroup("after_3")}
                        {this.renderPrePost("post_after_3")}

                        {this.renderEmptyBody()}
                    </div>
                    {this.renderBody()}
                </div>
            </div>
        )
    }


    renderGroup(group) {
        // remove empty top (its only annotation yet)
        if (group === "top" &&
            this.state.elementNode.children[group].filter(id => this.state.guiElements[id].activeElement).length === 0)
            return null;

        return this.state.elementNode.children[group].map((childId, i) => {
            let childElement = this.state.guiElements[childId];
            let childCondition = getConditionByName(childElement.conditionName);

            switch (childCondition.type) {
                case "element":
                    return this.renderElementChild(group, null, i, childId, childCondition);

                case "wideText":
                case "smallText":
                case "dropdown":
                case "text":
                    // if there are multiple values for the element
                    if (childElement.activeElement && childElement._data_ &&
                        childElement._data_._data_ && Object.keys(childElement._data_._data_).length > 1) {
                        return this.renderDropDownChild(group, null, i, childId, childElement, childCondition);
                    }
                    return this.renderTextChild(group, null, i, childId, childElement, childCondition);

                default:
                    return null;
            }
        });
    }

    renderEmptyParamArgList() {
        if (this.state.elementCondition["pre_after_2"] === "(" && this.state.elementCondition["pre_after_3"] === ")") {
            if (this.state.elementNode.children["after_2"].filter(id => this.state.guiElements[id].activeElement).length === 0)
                return (
                    <div className={"rowItem"}>
                        <b> {this.state.elementCondition["pre_after_2"]} ... {this.state.elementCondition["pre_after_3"]}</b>
                    </div>);
        }
        return null;
    }

    renderAfter() {
        if (this.state.elementCondition["pre_after_2"] === "(" && this.state.elementCondition["pre_after_3"] === ")") {
            if (this.state.elementNode.children["after_2"].filter(id => this.state.guiElements[id].activeElement).length === 0)
                return null;
        }

        return (
            <Fragment>
                {this.renderPrePost("pre_after_2")}
                {this.renderGroup("after_2")}
                {this.renderPrePost("pre_after_3")}
            </Fragment>
        )
    }

    renderEmptyBody() {
        if (this.state.elementNode.children["body"].filter(ids => ids.filter(id => this.state.guiElements[id].activeElement).length > 0).length === 0) {
            if (this.state.elementCondition["pre_body"] !== "")
                return (
                    <div className={"rowItem"}>
                        <b> {this.state.elementCondition["pre_body"]} ... {this.state.elementCondition["post_body"]}</b>
                    </div>);
        }
    }

    renderBody() {
        // remove empty body
        if (this.state.elementNode.children["body"].filter(ids => ids.filter(id => this.state.guiElements[id].activeElement).length > 0).length === 0)
            return null;

        return (
            <Fragment>
                {this.renderPrePost("pre_body")}
                {this.state.elementNode.children["body"].map((ids, i) => {
                        // remove empty child
                        if (ids.filter(id => this.state.guiElements[id].activeElement).length === 0) return null;

                        return (<div className={"bodyChildrenContainer"} key={i}>
                            {
                                ids.map((childId, j) => {
                                    let childElement = this.state.guiElements[childId];
                                    let childCondition = getConditionByName(childElement.conditionName);

                                    switch (childCondition.type) {
                                        case "element":
                                            return this.renderElementChild("body", i, j, childId);

                                        case "wideText":
                                        case "smallText":
                                        case "dropdown":
                                        case "text":
                                            return this.renderTextChild("body", i, j, childId, childElement, childCondition);

                                        default:
                                            return null;
                                    }
                                })
                            }
                        </div>)
                    }
                )}
                {this.renderPrePost("post_body")}
            </Fragment>)
    }

    renderElementChild(group, innerIndex, index, childId) {
        // remove empty child
        if (!this.state.guiElements[childId].activeElement) return null;

        return (
            <Fragment key={index}>
                <div className={group === "body" ? "rowGroup" : "rowItem"}>
                    <MinedRulePad key={new Date()} ruleIndex={this.props.ruleIndex} elementId={childId}
                                  rulePadState={this.props.rulePadState} styleClass={""}
                                  featureMetaData={this.props.featureMetaData} fileGroup={this.props.fileGroup}
                    />
                </div>
            </Fragment>
        )
    }

    renderTextChild(group, innerIndex, index, childId, childElement, childCondition) {
        let className = "inputTextContainer "
            + (childCondition.type === "wideText" ? "rowGroup"
                : childCondition.type === "smallText" ? "smallText rowItem"
                    : "rowItem");

        // color coding the features based on their frequencies in mined design rules.
        let colorCoding = this.computeColorCoding(childElement);
        return (
            <div key={index} id={`id__${this.props.ruleIndex}__${childId}`}
                 className={className}>
                <div>
                    <div className={"rowItem" + (childElement.activeElement ? "" : " inactiveText")}>
                        <b>{childCondition.pre}</b></div>
                    <div className={"inputTextDiv rowItem " + (childCondition.type === "wideText" ? "wideText" : "")}>
                        <span
                            className={"minedRules inputText" +
                            (childElement.activeElement ? " activeElement " + colorCoding : "")}>
                            {childElement.text ? childElement.text : childCondition.placeholder}</span>
                    </div>
                </div>
            </div>
        )
    }

    renderDropDownChild(group, innerIndex, index, childId, childElement, childCondition) {
        let className = "inputTextContainer "
            + (childCondition.type === "wideText" ? "rowGroup"
                : childCondition.type === "smallText" ? "smallText rowItem"
                    : "rowItem");

        // color coding the features based on their frequencies in mined design rules.
        let colorCoding = this.computeColorCoding(childElement);

        let allFeatures = Object.keys(childElement._data_._data_).map(d => {
            let desc = this.props.featureMetaData.featureInfoContainers.featureInfoReverse[d];
            let info = this.props.featureMetaData.featureInfoContainers.featureInfo[desc];
            return info.nodes[0];
        });
        let info = Object.keys(childElement._data_._data_).map(d => childElement._data_._data_[d].length);

        return (
            <div key={index} id={`id__${this.props.ruleIndex}__${childId}`}
                 className={className}>
                <div>
                    <div className={"rowItem"}>
                        <b>{childCondition.pre}</b></div>
                    <div
                        className={"inputTextDiv rowItem " + (childCondition.type === "wideText" ? "wideText" : "")}>
                        <CustomDropDown
                            className={"minedRules activeElement " //+ (this.state.hover ? colorCoding : "")
                            + colorCoding}
                            menuItemsText={allFeatures}
                            menuItemsInfo={info}
                            menuItemsEvent={allFeatures.map((item, i) => item === "N/A" ? childCondition.placeholder
                                : Object.keys(childElement._data_._data_)[i])}
                            menuDefault={childElement.text}
                            onSelectFunction={() => {}}
                        />
                    </div>
                    <div className={"informationDiv rowGroup"}>
                    </div>
                </div>
            </div>
        )
    }

    renderPrePost(category) {
        if (this.state.elementCondition[category] === "") return null;
        if (category === "pre_body" || category === "post_body")
            return (
                <div className={"rowGroup"}>
                    <div className={"rowItem"}><b>{this.state.elementCondition[category]}</b></div>
                </div>
            );
        return (
            <div className={"rowItem"}>
                <b>
                    {this.state.elementCondition[category]}
                </b>
            </div>
        )
    }

    computeColorCoding(childElement) {
        let featureItemSets = null, allItemSets = null;
        if (childElement.activeElement) {
            if (childElement._data_ && childElement._data_._data_) {
                featureItemSets = [...new Set(childElement._data_._data_[+childElement._data_._featureId_])];
            }
            if (this.state.thisElement._data_ &&
                this.state.thisElement._data_._data_ &&
                this.state.thisElement._data_._data_.cluster) {
                allItemSets = [...new Set(this.state.thisElement._data_._data_.cluster)];
            }
        }
        if (!featureItemSets || !allItemSets) return "";
        return "frequency-" +
            Math.floor(featureItemSets.length / allItemSets.length * 10);
    }
}

export default MinedRulePad;

class CustomDropDown extends Component {
    constructor(props) {
        super(props);

        if (!props.menuItemsText || !props.onSelectFunction || !props.menuItemsEvent)
            console.error(`'menuItemsEvent', 'menuItemsText' and 'onSelectFunction' are required in props`);

        this.state = {
            menuItemsText: props.menuItemsText,
            menuItemsInfo: props.menuItemsInfo ? props.menuItemsInfo : new Array(props.menuItemsText.length).fill(""),
            menuItemsEvent: props.menuItemsEvent,
            onSelectFunction: props.onSelectFunction,
            menuDefault: props.menuDefault ? props.menuDefault : "select",
            id: props.id ? props.id : "dropdown-custom-menu",
            open: false
        }
    }

    render() {
        return (
            <RootCloseWrapper onRootClose={() => this.setState({open: false})}>
                <Dropdown id={this.state.id} open={this.state.open}
                          className={"dropdownToggle " + (this.props["className"] ? this.props["className"] : "")}
                          onToggle={() => this.setState({open: !this.state.open})}>
                    <CustomToggle bsRole="toggle">
                        {this.state.menuDefault}
                        <span className={"caret"}/>
                    </CustomToggle>
                    <CustomMenu bsRole="menu" style={{width: "max-content"}}>
                        {this.state.menuItemsEvent.map((el, i) =>
                            (<MenuItem eventKey={el} key={i}
                                       onSelect={(evt) => {
                                           this.setState({menuDefault: evt, open: false},
                                               () => this.state.onSelectFunction(evt)
                                           )
                                       }}
                            > {this.state.menuItemsText[i]}<span
                                style={{float: "right"}}>{this.state.menuItemsInfo[i]}</span>
                            </MenuItem>)
                        )}
                    </CustomMenu>
                </Dropdown>
            </RootCloseWrapper>
        )
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            menuItemsText: nextProps.menuItemsText,
            menuItemsEvent: nextProps.menuItemsEvent,
            menuItemsInfo: nextProps.menuItemsInfo ? nextProps.menuItemsInfo : this.state.menuItemsInfo,
            onSelectFunction: nextProps.onSelectFunction,
            id: nextProps.id ? nextProps.id : "dropdown-custom-menu"
        });

    }
}

class CustomMenu extends Component {

    render() {
        const {children} = this.props;

        return (
            <div className="dropdown-menu">
                {React.Children.toArray(children)}
            </div>
        );
    }
}

class CustomToggle extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        this.props.onClick(e);
    }

    render() {
        return (
            <span onClick={this.handleClick}>
        {this.props.children}
        </span>
        );
    }
}
