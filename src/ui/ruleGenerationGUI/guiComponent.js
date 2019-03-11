/**
 * Created by saharmehrpour on 12/17/18.
 *
 */

import React, {Component, Fragment} from 'react';
import {MdStar, MdClose} from 'react-icons/lib/md/index';
import {FaEraser} from "react-icons/lib/fa/index";
import {Button, MenuItem, Dropdown, Modal} from 'react-bootstrap';
import {RootCloseWrapper} from 'react-overlays';
import Switch from 'react-switch';
import * as marked from 'marked';
import ReactToolTip from 'react-tooltip';

import {getConditionByName} from "./guiConstants";
import {documentations_IMarkdownString} from "../ruleGenerationText/textConstant";


class GuiComponent extends Component {

    constructor(props) {
        super(props);
        // ruleIndex, elementId, rootTree, guiElements, canBeStarredIDs, changeGuiElementJobs(), root << for styling

        this.state = {};

        this.state.guiElements = props["guiElements"];
        this.state.elementId = props["elementId"];

        // {conditionName: "class_el", activeElement: false, selectedElement: false},
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

        this.switchHandleColor = "#bfd9ff"; // same as inputText backGround color, constraint
        this.switchOnColor = "#d9e9ff";
        this.switchOffColor = "#e2e2e2"; // same as inputText backGround color, on hover

        // reference for components
        this.thisNode = {};
        this.nodes = {};
        // for storing temporary states
        this.state.texts = {};
        Object.keys(this.state.elementNode.children).forEach(group => {
            this.state.texts[group] = [];
            this.nodes[group] = [];
            if (group === "body")
                this.state.elementNode.children["body"].forEach(subGroup => {
                    this.state.texts["body"].push([]);
                    this.nodes["body"].push([]);
                    subGroup.forEach((childId) => {
                        this.state.texts["body"][this.state.texts["body"].length - 1].push(this.state.guiElements[childId].text ? this.state.guiElements[childId].text : "")
                        this.nodes["body"][this.nodes["body"].length - 1].push({});
                    });
                });
            else
                this.state.elementNode.children[group].forEach(childId => {
                    this.state.texts[group].push(this.state.guiElements[childId].text ? this.state.guiElements[childId].text : "");
                    this.nodes[group].push({});
                })
        });
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        // recover texts:
        let texts = {};
        Object.keys(nextProps["rootTree"][nextProps.elementId].children).forEach(group => {
            texts[group] = [];
            this.nodes[group] = [];
            if (group === "body")
                nextProps["rootTree"][nextProps.elementId].children["body"].forEach(subGroup => {
                    texts["body"].push([]);
                    this.nodes["body"].push([]);
                    subGroup.forEach((childId) => {
                        texts["body"][texts["body"].length - 1].push(nextProps.guiElements[childId].text ? nextProps.guiElements[childId].text : "")
                        this.nodes["body"][this.nodes["body"].length - 1].push({});
                    })
                });
            else
                nextProps["rootTree"][nextProps.elementId].children[group].forEach(childId => {
                    texts[group].push(nextProps.guiElements[childId].text ? nextProps.guiElements[childId].text : "")
                    this.nodes[group].push({});
                })
        });

        this.setState({
            guiElements: nextProps.guiElements,
            elementId: nextProps.elementId,
            thisElement: nextProps.guiElements[nextProps.elementId],
            elementNode: nextProps["rootTree"][nextProps.elementId],
            elementCondition: getConditionByName(nextProps.guiElements[nextProps.elementId].conditionName),

            texts: texts
        });
    }


    render() {
        return (
            <div className={"overlayContainer"}
                 onMouseEnter={() => this.overlayDiv.style.display = "none"}
                 onMouseLeave={(e) => {
                     e.stopPropagation();
                     this.overlayDiv.style.display = this.props.root || this.state.thisElement.activeElement ? "none" : "block";
                 }}>
                <div
                    className={"mainDiv-overlay elementDiv" + (this.state.thisElement.activeElement ? " activeElement" : "")
                    + (this.state.thisElement.selectedElement ? " selectedElement" : "")
                    + (this.state.thisElement.isConstraint ? " constraintElement" : "")}
                    id={`id__${this.props.ruleIndex}__${this.state.elementId}`}

                    ref={node => this.thisNode = node}

                    onMouseLeave={() => {
                        // if a textbox is focused blur when leaving the parent div
                        if (this.thisNode.contains(document.activeElement))
                            document.activeElement.blur();
                    }}
                >
                    {this.renderStarAndToggle()}
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
                        {this.renderPrePost("pre_after_2")}
                        {this.renderGroup("after_2")}
                        {this.renderPrePost("pre_after_3")}
                        {this.renderGroup("after_3")}
                        {this.renderPrePost("post_after_3")}
                    </div>
                    {this.renderPrePost("pre_body")}
                    {this.renderBody()}
                    {this.renderPrePost("post_body")}
                </div>
                {this.renderOverlayDiv()}
            </div>
        )
    }

    renderStarAndToggle() {

        let resetAllChildren = (nodeId, jobs) => {
            jobs.push({
                elementId: nodeId,
                task: "UPDATE_ELEMENT",
                value: {
                    activeElement: false,
                    isConstraint: false,
                    text: "" // may not be input text field
                }
            });
            Object.keys(this.props["rootTree"][nodeId].children).forEach(group => {
                if (group !== "body") {
                    this.props["rootTree"][nodeId].children[group].forEach(elemId => {
                        jobs.push({
                            elementId: elemId,
                            task: "UPDATE_ELEMENT",
                            value: {
                                activeElement: false,
                                isConstraint: false,
                                text: "" // may not be input text field
                            }
                        });
                        resetAllChildren(elemId, jobs);
                    });
                    if (this.props["rootTree"][nodeId].children[group].length > 1)
                        jobs.push({
                            elementId: nodeId,
                            task: "REMOVE_EXTRA",
                            value: group
                        });
                }
                else
                    this.props["rootTree"][nodeId].children["body"].forEach((subGroup, i) => {
                        subGroup.forEach(elemId => {
                            jobs.push({
                                elementId: elemId,
                                task: "UPDATE_ELEMENT",
                                value: {
                                    activeElement: false,
                                    isConstraint: false,
                                    text: "" // may not be input text field
                                }
                            });
                            resetAllChildren(elemId, jobs);
                        });
                        if (subGroup.length > 1)
                            jobs.push({
                                elementId: nodeId,
                                task: "REMOVE_EXTRA",
                                value: "body," + i
                            });
                    });
            });

            return jobs;
        };
        let changeFunction = () => this._handleConstraintElement(this.state.elementId, this.state.thisElement);
        let checkedStatus = this.state.thisElement.isConstraint ? this.state.thisElement.isConstraint : false;
        let closeFunction = () => {
            // search for all descendants and reset them all
            let jobs = resetAllChildren(this.state.elementId, []);
            this.props["changeGuiElementJobs"](this.props.ruleIndex, jobs);
        };

        // don't display switch if it is not delegate for a constraint element and the starred element.
        // I.e. can't be starred AND have a constraint child
        let hasConstraintChild = false;
        Object.keys(this.state.elementNode.children).forEach(group => {
            if (group !== "body")
                this.state.elementNode.children[group].forEach(childId => {
                    if (this.state.guiElements[childId].isConstraint)
                        hasConstraintChild = true;
                });
            else
                this.state.elementNode.children["body"].forEach(ids =>{
                    ids.forEach(childId => {
                        if (this.state.guiElements[childId].isConstraint)
                            hasConstraintChild = true;
                    })
                })
        });
        let isDelegate = this.props["canBeStarredIDs"].indexOf(this.state.elementId) === -1 && hasConstraintChild;

        if ((this.state.thisElement.activeElement && this.state.elementCondition.canBeSelected) || this.props.root)
            return (
                <div className={"elementIconsDiv"}>
                    {!this.state.thisElement.activeElement ? null : this.renderToggleAndClose(changeFunction, checkedStatus, closeFunction, !isDelegate)}
                    {this.props["canBeStarredIDs"].indexOf(this.state.elementId) === -1 ? null : (
                        <div style={{float: "left"}}>
                            <div data-tip={"React-tooltip"} data-for={"star"}>
                                <div
                                    className={"MdStar" + (this.state.thisElement.selectedElement ? " selectedElement" : "")}
                                    id={`gui__star__${this.props.ruleIndex}__${this.state.elementId}`}>
                                    <MdStar size={20}
                                            onClick={() => this._handleSelectedElement(this.state.elementId, this.state.thisElement, this.state.elementCondition)}/>
                                </div>
                            </div>
                            <ReactToolTip place={"top"} type={"dark"} effect={"solid"} id={"star"} delayShow={300}>
                                <span>{"Element of Interest"}</span>
                            </ReactToolTip>
                        </div>
                    )}
                </div>
            );
        return null;
    }

    renderGroup(group) {
        return this.state.elementNode.children[group].map((childId, i) => {
            let childElement = this.state.guiElements[childId];
            let childCondition = getConditionByName(childElement.conditionName);

            switch (childCondition.type) {
                case "element":
                    return this.renderElementChild(group, null, i, childId, childCondition);

                case "wideText":
                case "smallText":
                case "text":
                    return this.renderTextChild(group, null, i, childId, childElement, childCondition);

                case "dropdown":
                    return this.renderDropDownChild(group, null, i, childId, childElement, childCondition);

                default:
                    return null;
            }
        });
    }

    renderBody() {
        return this.state.elementNode.children["body"].map((ids, i) =>
            (<div className={"bodyChildrenContainer"} key={i}>
                {
                    ids.map((childId, j) => {
                        let childElement = this.state.guiElements[childId];
                        let childCondition = getConditionByName(childElement.conditionName);

                        switch (childCondition.type) {
                            case "element":
                                return this.renderElementChild("body", i, j, childId, childCondition);

                            case "wideText":
                            case "smallText":
                            case "text":
                                return this.renderTextChild("body", i, j, childId, childElement, childCondition);

                            case "dropdown":
                                return this.renderDropDownChild("body", i, j, childId, childElement, childCondition);

                            default:
                                return null;
                        }
                    })
                }
            </div>)
        );
    }

    renderElementChild(group, innerIndex, index, childId, childCondition) {
        let array = group === "body" ? this.state.elementNode.children["body"][innerIndex] : this.state.elementNode.children[group];

        return (
            <Fragment key={index}>
                <div className={group === "body" ? "rowGroup" : "rowItem"}>
                    <GuiComponent key={new Date()} ruleIndex={this.props.ruleIndex} elementId={childId}
                                  rootTree={this.props["rootTree"]} guiElements={this.state.guiElements}
                                  canBeStarredIDs={this.props["canBeStarredIDs"]}
                                  changeGuiElementJobs={this.props["changeGuiElementJobs"]}
                    />
                    {(index < array.length - 1) ? (
                        <div className={"removeIcon"}>
                            <Button
                                onClick={() => {
                                    let jobs = [];
                                    jobs.push({
                                        elementId: childId,
                                        task: "REMOVE_ELEMENT",
                                        value: {parentId: this.state.elementId}
                                    });
                                    this.props["changeGuiElementJobs"](this.props.ruleIndex, jobs);
                                }}
                            >Remove Element</Button>
                        </div>
                    ) : null}
                </div>
                {(index === array.length - 1 && this.state.guiElements[childId].activeElement) ? (
                    <div className={"rowItem"}>
                        <Button
                            onClick={() => {
                                let jobs = [];
                                jobs.push({
                                    elementId: this.state.elementId,
                                    task: "ADD_EXTRA",
                                    value: group !== "body" ? group : "body," + innerIndex
                                });
                                this.props["changeGuiElementJobs"](this.props.ruleIndex, jobs);
                            }}>
                            Add {childCondition.grammar}</Button>
                    </div>
                ) : null}
            </Fragment>
        )
    }

    renderTextChild(group, innerIndex, index, childId, childElement, childCondition) {
        let inputTextNode = null;
        let closeInformationDiv = null;
        let clickedElement = null;
        let shouldDisplayInformation = true;

        let className = "inputTextContainer "
            + (childCondition.type === "wideText" ? "rowGroup"
                : childCondition.type === "smallText" ? "smallText rowItem"
                    : "rowItem");
        // + (childElement.activeElement ? " activeElement" : "")
        // + (childElement.isConstraint ? " constraintElement" : "");

        let nodes = group !== "body" ? this.nodes[group] : this.nodes["body"][innerIndex];
        let texts = group !== "body" ? this.state.texts[group] : this.state.texts["body"][innerIndex];
        let children = group !== "body" ? this.state.elementNode.children[group] : this.state.elementNode.children["body"][innerIndex];

        let informationGroup = childCondition.type === "wideText" ? "EXACT_CODE" : "QUOTES";

        let mouseEnter = () => {
            if (childElement.activeElement && nodes && nodes[index] && nodes[index]["toggle"]
                && Object.entries(nodes[index]["toggle"]).length !== 0)
                nodes[index]["toggle"].style.display = "block";
        };

        let mouseLeave = () => {
            if (nodes && nodes[index] && nodes[index]["toggle"]
                && Object.entries(nodes[index]["toggle"]).length !== 0)
                nodes[index]["toggle"].style.display = "none";
        };

        let change = (e) => {
            let newTexts = this.state.texts;
            if (group === "body")
                newTexts["body"][innerIndex][index] = e.target.value;
            else
                newTexts[group][index] = e.target.value;
            this.setState({texts: newTexts});
        };

        let focus = () => {
            if (shouldDisplayInformation && nodes && nodes[index] && nodes[index]["information"]
                && Object.entries(nodes[index]["information"]).length !== 0)
                nodes[index]["information"].style.display = "block";
        };

        let blur = (inputText) => {
            // if clicked on close information do not lose focus
            if (closeInformationDiv.contains(clickedElement)) {
                if (nodes && nodes[index] && nodes[index]["information"]
                    && Object.entries(nodes[index]["information"]).length !== 0)
                    nodes[index]["information"].style.display = "none";
                shouldDisplayInformation = false;
                inputTextNode.focus();
                clickedElement = null;
                return;
            }
            // hide information div
            if (nodes && nodes[index] && nodes[index]["information"]
                && Object.entries(nodes[index]["information"]).length !== 0)
                nodes[index]["information"].style.display = "none";
            shouldDisplayInformation = true;

            // if the text is not changed, do nothing
            if (!this.state.guiElements[children[index]].text && inputText === "") return;
            if (this.state.guiElements[children[index]].text === inputText) return;

            let jobs = [];
            // update text
            jobs.push({
                elementId: childId,
                task: "UPDATE_ELEMENT",
                value: {
                    text: inputText,
                    activeElement: inputText !== "",
                    isConstraint: inputText === "" ? false : childElement.isConstraint
                }
            });
            // if the childElement is not unique and there is no available empty element, add one
            // or remove extras
            if (!childCondition.unique) {
                let availableElements = children.reduce((count, elemId) => {
                    if (elemId !== childId)
                        return count + (this.state.guiElements[elemId].activeElement ? 0 : 1);
                    return count + (inputText !== "" ? 0 : 1)
                }, 0);
                if (availableElements < 1)
                    jobs.push({
                        elementId: this.state.elementId,
                        task: "ADD_EXTRA",
                        value: group !== "body" ? group : "body," + innerIndex
                    });
                else if (availableElements > 1)
                    jobs.push({
                        elementId: this.state.elementId,
                        task: "REMOVE_EXTRA",
                        value: group !== "body" ? group : "body," + innerIndex
                    });
            }

            // update activeElement for the main element
            let haveActiveChild = inputText !== "";
            Object.keys(this.state.elementNode.children).forEach(group => {
                if (group !== "body")
                    this.state.elementNode.children[group].forEach(elemId => {
                        if (elemId !== childId && this.state.guiElements[elemId].activeElement) haveActiveChild = true;
                    });
                else
                    this.state.elementNode.children["body"].forEach(subGroup => {
                        subGroup.forEach(elemId => {
                            if (elemId !== childId && this.state.guiElements[elemId].activeElement) haveActiveChild = true;
                        });
                    });
            });
            jobs.push({
                elementId: this.state.elementId,
                task: "UPDATE_ELEMENT",
                value: {activeElement: haveActiveChild}
            });

            this.props["changeGuiElementJobs"](this.props.ruleIndex, jobs);
        };

        let changeFunction = () => this._handleConstraintElement(childId, childElement);
        let checkedStatus = childElement.isConstraint ? childElement.isConstraint : false;
        let closeFunction = () => blur("");

        // display toggle if the element parent is not constraint OR the parent can be starred
        let renderSwitch = !this.state.thisElement.isConstraint || this.props["canBeStarredIDs"].indexOf(this.state.elementId) !== -1;
        // if the element is the only descendant, display the switch
        let isOnlyDescendant = (elemId) => {
            let parentId = this.props["rootTree"][elemId].parentId;
            if (parentId === "") return true;
            if (this.props["canBeStarredIDs"].indexOf(parentId) !== -1) return true;
            let numberOfConstraintChild = 0;
            Object.keys(this.state.elementNode.children).forEach(group => {
                if (group !== "body")
                    this.props["rootTree"][parentId].children[group].forEach(siblingId => {
                        if (this.state.guiElements[siblingId].isConstraint)
                            numberOfConstraintChild += 1;
                    });
                else
                    this.props["rootTree"][parentId].children["body"].forEach(ids =>{
                        ids.forEach(siblingId => {
                            if (this.state.guiElements[siblingId].isConstraint)
                                numberOfConstraintChild += 1;
                        })
                    })
            });
            if (numberOfConstraintChild > 1) return false;
            return isOnlyDescendant(parentId);
        };
        renderSwitch = isOnlyDescendant(childId) ? true : renderSwitch;

        return (
            <div key={index} id={`id__${this.props.ruleIndex}__${childId}`}
                 className={className}
                 onMouseEnter={mouseEnter}
                 onMouseLeave={mouseLeave}
                 onMouseMove={e => clickedElement = e.target}
            >
                <div>
                    <div className={"rowItem"}><b>{childCondition.pre}</b></div>
                    <div className={"inputTextDiv rowItem " + (childCondition.type === "wideText" ? "wideText" : "")}>
                        <form>
                            <input type={"text"}
                                   ref={node => inputTextNode = node}
                                   className={"inputText" + (childElement.activeElement ? " activeElement " : "") + (childElement.isConstraint ? " constraintElement" : "")}
                                   value={texts[index]}
                                   placeholder={childCondition.placeholder}
                                   onChange={change}
                                   onFocus={focus}
                                   onBlur={(e) => blur(e.target.value)}/>
                            <div className={"toggleConstraintDiv rowGroup"}
                                 ref={node => group !== "body" ? this.nodes[group][index]["toggle"] = node : this.nodes["body"][innerIndex][index]["toggle"] = node}>
                                {!childElement.activeElement ? null : this.renderToggleAndClose(changeFunction, checkedStatus, closeFunction, renderSwitch)}
                            </div>
                        </form>
                    </div>
                    <div className={"informationDiv rowGroup"}
                         ref={node => group !== "body" ? this.nodes[group][index]["information"] = node : this.nodes["body"][innerIndex][index]["information"] = node}>
                        <div>
                            <div className={"MdRemove"} style={{float: "right"}}
                                 ref={node => closeInformationDiv = node}>
                                <MdClose size={20} onClick={() => {
                                }}/>
                            </div>
                            <span
                                dangerouslySetInnerHTML={{__html: marked(documentations_IMarkdownString[informationGroup].value)}}/>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

    renderDropDownChild(group, innerIndex, index, childId, childElement, childCondition) {

        let nodes = group !== "body" ? this.nodes[group] : this.nodes["body"][innerIndex];
        let children = group !== "body" ? this.state.elementNode.children[group] : this.state.elementNode.children["body"][innerIndex];

        let mouseEnter = () => {
            if (childElement.activeElement && nodes && nodes[index] && nodes[index]["toggle"]
                && Object.entries(nodes[index]["toggle"]).length !== 0)
                nodes[index]["toggle"].style.display = "block";
        };

        let mouseLeave = () => {
            if (nodes && nodes[index] && nodes[index]["toggle"]
                && Object.entries(nodes[index]["toggle"]).length !== 0)
                nodes[index]["toggle"].style.display = "none";
        };

        let clear = () => {
            if (nodes && nodes[index] && nodes[index]["information"]
                && Object.entries(nodes[index]["information"]).length !== 0)
                nodes[index]["information"].style.display = "none";

            let jobs = [];
            // update text
            jobs.push({
                elementId: childId,
                task: "UPDATE_ELEMENT",
                value: {
                    text: "",
                    activeElement: false,
                    isConstraint: false
                }
            });
            // if the childElement is not unique and there is no available empty element, add one
            // or remove extras
            if (!childCondition.unique) {
                let availableElements = children.reduce((count, elemId) => {
                    if (elemId !== childId)
                        return count + (this.state.guiElements[elemId].activeElement ? 0 : 1);
                    return count + 1
                }, 0);
                if (availableElements < 1)
                    jobs.push({
                        elementId: this.state.elementId,
                        task: "ADD_EXTRA",
                        value: group !== "body" ? group : "body," + innerIndex
                    });
                else if (availableElements > 1)
                    jobs.push({
                        elementId: this.state.elementId,
                        task: "REMOVE_EXTRA",
                        value: group !== "body" ? group : "body," + innerIndex
                    });
            }

            // update activeElement for the main element
            let haveActiveChild = false;
            Object.keys(this.state.elementNode.children).forEach(group => {
                if (group !== "body")
                    this.state.elementNode.children[group].forEach(elemId => {
                        if (elemId !== childId && this.state.guiElements[elemId].activeElement) haveActiveChild = true;
                    });
                else
                    this.state.elementNode.children["body"].forEach(subGroup => {
                        subGroup.forEach(elemId => {
                            if (elemId !== childId && this.state.guiElements[elemId].activeElement) haveActiveChild = true;
                        });
                    });
            });
            jobs.push({
                elementId: this.state.elementId,
                task: "UPDATE_ELEMENT",
                value: {activeElement: haveActiveChild}
            });

            this.props["changeGuiElementJobs"](this.props.ruleIndex, jobs);
        };

        let changeFunction = () => this._handleConstraintElement(childId, childElement);
        let checkedStatus = childElement.isConstraint ? childElement.isConstraint : false;

        // display toggle if the element parent is not constraint OR the parent can be starred
        let renderSwitch = !this.state.thisElement.isConstraint || this.props["canBeStarredIDs"].indexOf(this.state.elementId) !== -1;
        // if the element is the only descendant, display the switch
        let isOnlyDescendant = (elemId) => {
            let parentId = this.props["rootTree"][elemId].parentId;
            if (parentId === "") return true;
            if (this.props["canBeStarredIDs"].indexOf(parentId) !== -1) return true;
            let numberOfConstraintChild = 0;
            Object.keys(this.state.elementNode.children).forEach(group => {
                if (group !== "body")
                    this.props["rootTree"][parentId].children[group].forEach(siblingId => {
                        if (this.state.guiElements[siblingId].isConstraint)
                            numberOfConstraintChild += 1;
                    });
                else
                    this.props["rootTree"][parentId].children["body"].forEach(ids =>{
                        ids.forEach(siblingId => {
                            if (this.state.guiElements[siblingId].isConstraint)
                                numberOfConstraintChild += 1;
                        })
                    })
            });
            if (numberOfConstraintChild > 1) return false;
            return isOnlyDescendant(parentId);
        };
        renderSwitch = isOnlyDescendant(childId) ? true : renderSwitch;

        return (
            <div
                className={"rowItem dropdownDiv"} key={index}
                id={`id__${this.props.ruleIndex}__${childId}`}
                onMouseEnter={mouseEnter}
                onMouseLeave={mouseLeave}
            >
                <div className={"toggleConstraintDiv rowGroup"} style={{marginTop: "-25px"}}
                     ref={node => group !== "body" ? this.nodes[group][index]["toggle"] = node : this.nodes["body"][innerIndex][index]["toggle"] = node}>
                    {!childElement.activeElement ? null : this.renderToggleAndClose(changeFunction, checkedStatus, clear, renderSwitch)}
                </div>
                <CustomDropDown
                    className={(childElement.activeElement ? "activeElement" : "") + (childElement.isConstraint ? " constraintElement" : "")}
                    menuItemsText={childCondition.items}
                    menuItemsEvent={childCondition.items.map(item => item === "N/A" ? childCondition.placeholder : item)}
                    menuDefault={childElement.text && childCondition.items.indexOf(childElement.text) !== -1 ? childElement.text : childCondition.placeholder}
                    onSelectFunction={(evt) => {
                        let jobs = [{
                            elementId: childId,
                            task: "UPDATE_ELEMENT",
                            value: {
                                text: evt,
                                activeElement: !(evt === childCondition.placeholder)
                            }
                        }];
                        jobs.push({
                            elementId: this.state.elementId,
                            task: "UPDATE_ELEMENT",
                            value: {activeElement: !(evt === childCondition.placeholder)}
                        });
                        this.props["changeGuiElementJobs"](this.props.ruleIndex, jobs);
                    }}
                />
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

    renderOverlayDiv() {
        return (
            <div ref={node => this.overlayDiv = node}
                 className={"overlay"}
                 id={`overlay__${this.props.ruleIndex}__${this.state.elementId}`}
                 style={{display: this.props.root || this.state.thisElement.activeElement ? "none" : "block"}}>
                <div className={"messageDivContainer"}>
                    <div className={"messageDiv"}>
                        <strong>Specify {this.state.elementCondition.grammar}</strong>
                    </div>
                </div>
            </div>
        )
    }

    renderToggleAndClose(changeFunction, checkedStatus, closeFunction, renderSwitch = true) {
        return (
            <div style={{float: "left"}}>
                {!renderSwitch ? null : (
                    <div style={{float: "left"}}>
                        <div data-tip={"React-tooltip"} data-for={"switch"}>
                            <div className={"toggleConstraintContainer"}>
                                <Switch
                                    onChange={changeFunction}
                                    checked={checkedStatus}
                                    onColor={this.switchOnColor}
                                    offColor={this.switchOffColor}
                                    onHandleColor={this.switchHandleColor}
                                    handleDiameter={15}
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                    height={15}
                                    width={30}
                                />
                            </div>
                        </div>
                        <ReactToolTip place={"top"} type={"dark"} effect={"solid"} id={"switch"} delayShow={300}>
                            <span>{"Change to/from Constraint"}</span>
                        </ReactToolTip>
                    </div>
                )}
                <div style={{float: "left"}}>
                    <div data-tip={"React-tooltip"} data-for={"clear"}>
                        <div className={"MdRemove rowItem"} style={{display: "inline-block"}}>
                            <FaEraser size={20} onClick={closeFunction}/>
                        </div>
                    </div>
                    <ReactToolTip place={"top"} type={"dark"} effect={"solid"} id={"clear"} delayShow={300}>
                        <span>Clear the Element and Remove its Characteristics</span>
                    </ReactToolTip>
                </div>
            </div>
        )
    }


    /**
     * render the dialog for documentation
     * @returns {XML}
     */
    renderDocModalDialog() {
        return (
            <Modal show={this.state.showDocModal} onHide={() => this.setState({showDocModal: false})}
                   backdrop={"static"} keyboard={true}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.elementCondition.grammar}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span
                        dangerouslySetInnerHTML={{__html: marked(documentations_IMarkdownString[this.state.elementCondition.grammar].value)}}/>
                </Modal.Body>
            </Modal>
        )
    }

    _handleActivateElement(elementId, thisElement) {
        if (thisElement.selectedElement || thisElement.activeElement) return;
        let status = thisElement.activeElement;
        let jobs = [];
        jobs.push({
            elementId: elementId,
            task: "UPDATE_ELEMENT",
            value: {
                activeElement: !status,
                isConstraint: false
            }
        });

        this.props["changeGuiElementJobs"](this.props.ruleIndex, jobs);
    }

    _handleConstraintElement(elementId, thisElement) {
        if (!thisElement.activeElement) return;
        let jobs = [];
        jobs.push({
            elementId: elementId,
            task: "UPDATE_ELEMENT",
            value: {
                activeElement: !thisElement.isConstraint ? true : thisElement.activeElement,
                isConstraint: !thisElement.isConstraint
            }
        });
        this.props["changeGuiElementJobs"](this.props.ruleIndex, jobs);
    }

    _handleSelectedElement(elementId, thisElement, elementCondition) {
        if (!(thisElement.activeElement && elementCondition.canBeSelected)) return;
        let jobs = [];
        jobs.push({
            elementId: elementId,
            task: "SELECT_ELEMENT",
            value: true
        });
        this.props["changeGuiElementJobs"](this.props.ruleIndex, jobs);
    }

}


export default GuiComponent;


class CustomDropDown extends Component {
    constructor(props) {
        super(props);

        if (!props.menuItemsText || !props.onSelectFunction || !props.menuItemsEvent)
            console.error(`'menuItemsEvent', 'menuItemsText' and 'onSelectFunction' are required in props`);

        this.state = {
            menuItemsText: props.menuItemsText,
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
                    <CustomMenu bsRole="menu">
                        {this.state.menuItemsEvent.map((el, i) =>
                            (<MenuItem eventKey={el} key={i}
                                       onSelect={(evt) => {
                                           this.setState({menuDefault: evt, open: false},
                                               () => this.state.onSelectFunction(evt)
                                           )
                                       }}
                            > {this.state.menuItemsText[i]}
                            </MenuItem>)
                        )}
                    </CustomMenu>
                </Dropdown>
            </RootCloseWrapper>
        )
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            menuItemsText: nextProps.menuItemsText,
            menuItemsEvent: nextProps.menuItemsEvent,
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