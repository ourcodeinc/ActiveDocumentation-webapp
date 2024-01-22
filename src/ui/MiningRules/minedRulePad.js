/**
 * Created by saharmehrpour on 1/14/20.
 * Copied from src/ui/rulePadGraphicalEditor/graphicalComponent.js
 *
 */

import React, {Component, Fragment} from "react";

import {getConditionByName} from "../RulePad/rulePadGraphicalEditor/graphicalEditorConstants";
import {CustomDropDown} from "../RulePad/rulePadGraphicalEditor/graphicalComponent";
import {identifier_element_ids} from "../../miningRulesCore/featureConfig";

class MinedRulePad extends Component {

    constructor(props) {
        super(props);
        // no need for ruleIndex
        // elementId [optional], rulePadState (guiTree, guiElements), styleClass [optional] << for styling
        // fileGroup
        // isCluster << for color coding the frequency
        // featureMetaData

        this.state = {};

        this.styleClass = this.props.styleClass ? this.props.styleClass : "rootContainer";

        this.state.guiElements = props.rulePadState.guiElements;
        this.state.elementId = props.elementId ? props.elementId : "0";
        this.state.thisElement = this.state.guiElements[this.state.elementId];

        this.state.elementCondition = getConditionByName(this.state.thisElement.conditionName);
        this.state.elementNode = props.rulePadState.guiTree[this.state.elementId];
    }

    render() {
        return (
            <div className={"overlayContainer " + this.styleClass}>
                {/*{this.renderExplore()}*/}
                <div
                    className={"mainDiv-overlay elementDiv" + (this.state.thisElement.activeElement ? " activeElement" : "")
                    + (this.state.thisElement.selectedElement ? " selectedElement" : "")
                    }>
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
                        childElement._data_._data_ && Object.keys(childElement._data_._data_.elements).length > 1) {
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
                    <MinedRulePad key={new Date()} elementId={childId}
                                  rulePadState={this.props.rulePadState} styleClass={""}
                                  featureMetaData={this.props.featureMetaData} fileGroup={this.props.fileGroup}
                                  isCluster={this.props.isCluster} depth={this.props.depth + 1}
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
        let colorCoding = this.computeColorCoding(childElement, childId);
        return (
            <div key={index} className={className}>
                <div>
                    <div className={"rowItem" + (childElement.activeElement ? "" : " inactiveText")}>
                        <b>{childCondition.pre}</b></div>
                    <div className={"inputTextDiv rowItem " + (childCondition.type === "wideText" ? "wideText" : "")}>
                        <span
                            className={"minedRuleEditor inputText" +
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
        let colorCoding = this.computeColorCoding(childElement, childId);
        let allFeatures = childElement._data_._data_.elements.map(d => {
            let info = this.props.featureMetaData.featureInfoContainers.featureInfo[d.desc];
            return info.nodes[0];
        });

        return (
            <div key={index} className={className}>
                <div>
                    <div className={"rowItem"}>
                        <b>{childCondition.pre}</b></div>
                    <div
                        className={"inputTextDiv rowItem " + (childCondition.type === "wideText" ? "wideText" : "")}
                    >
                        <CustomDropDown
                            className={"minedRuleEditor activeElement " + colorCoding}
                            menuItemsText={allFeatures}
                            menuItemsEvent={allFeatures.map((item) => item === "N/A" ? childCondition.placeholder
                                : item)}
                            menuDefault={childElement.text}
                            onSelectFunction={() => {
                            }}
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

    computeColorCoding(childElement, childId) {
        if (!this.props.isCluster) return "";
        try {
            if (identifier_element_ids.includes(childId)) {
                return "frequency-color frequency-identifier";
            }
            let frequency = 0;
            if (childElement.activeElement) {
                let elementIndex = childElement._data_._data_.elements
                    .map(d => d.featureId)
                    .indexOf(childElement._data_._data_.maxFeatureId);
                frequency = childElement._data_._data_.elements[elementIndex].frequency;
            }
            return "frequency-color frequency-" +
                Math.floor(frequency * 10);
        } catch (e) {
            return "frequency-color frequency-unknown";
        }
    }
}

export default MinedRulePad;

