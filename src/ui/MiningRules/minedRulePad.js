/**
 * Created by saharmehrpour on 1/14/20.
 * Copied from src/ui/rulePadGraphicalEditor/graphicalComponent.js
 *
 */

import React, {Component, Fragment} from "react";

import {getConditionByName} from "../RulePad/rulePadGraphicalEditor/graphicalEditorConstants";


class MinedRulePad extends Component {

    constructor(props) {
        super(props);
        // elementId, rootTree, guiElements, root << for styling

        this.state = {};

        this.state.guiElements = props["guiElements"];
        this.state.elementId = props["elementId"];
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
        this.state.elementNode = props["rootTree"][this.state.elementId];
    }


    render() {
        return (
            <div className={"overlayContainer " + this.props["styleClass"]}>
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
                        {this.renderAfter2()}

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

    renderAfter2() {
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
                                  rootTree={this.props["rootTree"]} guiElements={this.state.guiElements}
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
        return (
            <div key={index} id={`id__${this.props.ruleIndex}__${childId}`}
                 className={className}>
                <div>
                    <div className={"rowItem" + (childElement.activeElement ? "" : " inactiveText")}><b>{childCondition.pre}</b></div>
                    <div className={"inputTextDiv rowItem " + (childCondition.type === "wideText" ? "wideText" : "")}>
                        <span className={"minedRules inputText" + (childElement.activeElement ? " activeElement " : "")}>
                            {childElement.text ? childElement.text : childCondition.placeholder}</span>
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

}


export default MinedRulePad;
