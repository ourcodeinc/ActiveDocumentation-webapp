/**
 * Created by saharmehrpour on 12/17/18.
 *
 */

import React, {Component, Fragment} from 'react';
import {MdStar, MdClose} from 'react-icons/lib/md/index';
import {FaClose} from "react-icons/lib/fa/index";
import {Button, MenuItem, Dropdown, Modal} from 'react-bootstrap';
import {RootCloseWrapper} from 'react-overlays';
import Switch from 'react-switch';

import {getConditionByName} from "./guiConstants";
import * as marked from "marked";
import {documentations_IMarkdownString} from "../ruleGenerationText/textConstant";


class GuiComponent extends Component {

    constructor(props) {
        super(props);
        // ruleIndex, elementId, rootTree, guiElements, onChangeGuiElement(), root << for styling

        this.state = {};

        this.state.guiElements = props["guiElements"];
        this.state.elementId = props["elementId"];
        this.state.rootTree = props["rootTree"];

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
        this.state.elementNode = this.state.rootTree[this.state.elementId];

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
                    this.state.texts[group].push(this.state.guiElements[childId].text ? this.state.guiElements[childId].text : "")
                    this.nodes[group].push({});
                })
        });
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        // recover texts:
        let texts = {};
        Object.keys(nextProps.rootTree[nextProps.elementId].children).forEach(group => {
            texts[group] = [];
            this.nodes[group] = [];
            if (group === "body")
                nextProps.rootTree[nextProps.elementId].children["body"].forEach(subGroup => {
                    texts["body"].push([]);
                    this.nodes["body"].push([]);
                    subGroup.forEach((childId) => {
                        texts["body"][texts["body"].length - 1].push(nextProps.guiElements[childId].text ? nextProps.guiElements[childId].text : "")
                        this.nodes["body"][this.nodes["body"].length - 1].push({});
                    })
                });
            else
                nextProps.rootTree[nextProps.elementId].children[group].forEach(childId => {
                    texts[group].push(nextProps.guiElements[childId].text ? nextProps.guiElements[childId].text : "")
                    this.nodes[group].push({});
                })
        });

        this.setState({
            guiElements: nextProps.guiElements,
            elementId: nextProps.elementId,
            rootTree: nextProps.rootTree,
            thisElement: nextProps.guiElements[nextProps.elementId],
            elementNode: nextProps.rootTree[nextProps.elementId],
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

                    onDoubleClick={(e) => {
                        e.stopPropagation(); // to stop propagating the click to the underneath elements
                        this._handleConstraintElement(this.state.elementId, this.state.thisElement);
                    }}>
                    {this.renderSelectedElementStar()}
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

    renderSelectedElementStar() {
        if ((this.state.thisElement.activeElement && this.state.elementCondition.canBeSelected) || this.props.root)
            return (
                <div className={"MdStar" + (this.state.thisElement.selectedElement ? " selectedElement" : "")}
                     id={`gui__star__${this.props.ruleIndex}__${this.state.elementId}`}>
                    <MdStar size={20}
                            onClick={() => this._handleSelectedElement(this.state.elementId, this.state.thisElement, this.state.elementCondition)}/>
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
                    return (
                        <Fragment key={i}>
                            <div className={"rowItem"}>
                                <GuiComponent key={new Date()} ruleIndex={this.props.ruleIndex} elementId={childId}
                                              rootTree={this.state.rootTree} guiElements={this.state.guiElements}
                                              onChangeGuiElement={this.props.onChangeGuiElement}
                                />
                                {(i < this.state.elementNode.children[group].length - 1) ? (
                                    <div className={"removeIcon"}>
                                        Remove Element
                                    </div>
                                ) : null}
                            </div>
                            {(i === this.state.elementNode.children[group].length - 1 && this.state.guiElements[childId].activeElement) ? (
                                <div className={"rowItem"}>
                                    <Button
                                        onClick={() => {
                                            let jobs = [];
                                            jobs.push({
                                                elementId: this.state.elementId,
                                                task: "ADD_EXTRA",
                                                value: group
                                            });
                                            this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
                                        }}>
                                        Add {childCondition.grammar}</Button>
                                </div>
                            ) : null}
                        </Fragment>
                    );
                case "wideText":
                case "smallText":
                case "text":
                    return (
                        <div key={i} id={`id__${this.props.ruleIndex}__${childId}`}
                             className={"inputTextContainer "
                             + (childCondition.type === "wideText" ? "rowGroup"
                                 : childCondition.type === "smallText" ? "smallText rowItem"
                                     : "rowItem") +
                             (childElement.activeElement ? " activeElement" : "")
                             + (childElement.isConstraint ? " constraintElement" : "")}
                             onMouseEnter={() => {
                                 if (childElement.activeElement && this.nodes[group] && this.nodes[group][i]
                                     && this.nodes[group][i]["toggle"]
                                     && Object.entries(this.nodes[group][i]["toggle"]).length !== 0)
                                     this.nodes[group][i]["toggle"].style.display = "block";
                             }}
                             onMouseLeave={() => {
                                 if (this.nodes[group] && this.nodes[group][i]
                                     && this.nodes[group][i]["toggle"]
                                     && Object.entries(this.nodes[group][i]["toggle"]).length !== 0)
                                     this.nodes[group][i]["toggle"].style.display = "none";
                             }}
                        >
                            <div>
                                <div className={"rowItem"}><b>{childCondition.pre}</b></div>
                                <div
                                    className={"inputTextDiv rowItem " + (childCondition.type === "wideText" ? "wideText" : "")}>
                                    <input type={"text"}
                                           className={"inputText" + (childElement.activeElement ? " activeElement " : "")}
                                           value={this.state.texts[group][i]}
                                           placeholder={childCondition.placeholder}
                                           onChange={e => {
                                               let texts = this.state.texts;
                                               texts[group][i] = e.target.value;
                                               this.setState({texts});
                                           }}
                                           onFocus={()=> {
                                               if (this.nodes[group] && this.nodes[group][i]
                                                   && this.nodes[group][i]["information"]
                                                   && Object.entries(this.nodes[group][i]["information"]).length !== 0)
                                                   this.nodes[group][i]["information"].style.display = "block";
                                           }}
                                           onBlur={e => {
                                               if (this.nodes[group] && this.nodes[group][i]
                                                   && this.nodes[group][i]["information"]
                                                   && Object.entries(this.nodes[group][i]["information"]).length !== 0)
                                                   this.nodes[group][i]["information"].style.display = "none";

                                               if (this.state.elementNode.children[group][i] === e.target.value) return;
                                               let jobs = [];

                                               // update texts
                                               jobs.push({
                                                   elementId: childId,
                                                   task: "UPDATE_ELEMENT",
                                                   value: {
                                                       text: e.target.value,
                                                       activeElement: e.target.value !== "",
                                                       isConstraint: e.target.value === "" ? false : childElement.isConstraint
                                                   }
                                               });

                                               // if the element is not unique and there is no available empty element, add one
                                               // or remove extras
                                               if (!childCondition.unique) {
                                                   let availableElements = this.state.elementNode.children[group].reduce((count, elemId) => {
                                                       if (elemId !== childId)
                                                           return count + (this.state.guiElements[elemId].activeElement ? 0 : 1);
                                                       return count + (e.target.value !== "" ? 0 : 1)
                                                   }, 0);
                                                   if (availableElements < 1)
                                                       jobs.push({
                                                           elementId: this.state.elementId,
                                                           task: "ADD_EXTRA",
                                                           value: group // must be constraint if its parent is
                                                       });
                                                   else if (availableElements > 1)
                                                       jobs.push({
                                                           elementId: this.state.elementId,
                                                           task: "REMOVE_EXTRA",
                                                           value: group
                                                       });
                                               }

                                               // update activeElement for the main element
                                               let haveActiveChild = e.target.value !== "";
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
                                               // if (haveActiveChild !== this.state.thisElement.activeElement)
                                               jobs.push({
                                                   elementId: this.state.elementId,
                                                   task: "UPDATE_ELEMENT",
                                                   value: {activeElement: haveActiveChild}
                                               });

                                               this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
                                           }}
                                    />
                                    <div className={"toggleConstraintDiv rowGroup"}
                                         ref={node => this.nodes[group][i]["toggle"] = node}>
                                        <div>
                                            <div style={{float: "left", marginTop: "3px"}}>
                                                <Switch
                                                    onChange={() => this._handleConstraintElement(childId, childElement)}
                                                    checked={childElement.isConstraint ? childElement.isConstraint : false}
                                                    onColor="#b1b1ff"
                                                    onHandleColor="#3333fc"
                                                    handleDiameter={15}
                                                    uncheckedIcon={false}
                                                    checkedIcon={false}
                                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                                    height={15}
                                                    width={30}
                                                />
                                            </div>
                                            <div className={"MdRemove rowItem"} style={{display: "inline-block"}}>
                                                <FaClose size={20}
                                                         onClick={() => {
                                                             // similar to blur
                                                             let jobs = [];

                                                             // update texts
                                                             jobs.push({
                                                                 elementId: childId,
                                                                 task: "UPDATE_ELEMENT",
                                                                 value: {
                                                                     text: "",
                                                                     activeElement: false,
                                                                     isConstraint: false
                                                                 }
                                                             });

                                                             // if the element is not unique and there is no available empty element, add one
                                                             // or remove extras
                                                             if (!childCondition.unique) {
                                                                 let availableElements = this.state.elementNode.children[group].reduce((count, elemId) => {
                                                                     if (elemId !== childId)
                                                                         return count + (this.state.guiElements[elemId].activeElement ? 0 : 1);
                                                                     return count + 1
                                                                 }, 0);
                                                                 if (availableElements < 1)
                                                                     jobs.push({
                                                                         elementId: this.state.elementId,
                                                                         task: "ADD_EXTRA",
                                                                         value: group // must be constraint if its parent is
                                                                     });
                                                                 else if (availableElements > 1)
                                                                     jobs.push({
                                                                         elementId: this.state.elementId,
                                                                         task: "REMOVE_EXTRA",
                                                                         value: group
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
                                                             // if (haveActiveChild !== this.state.thisElement.activeElement)
                                                             jobs.push({
                                                                 elementId: this.state.elementId,
                                                                 task: "UPDATE_ELEMENT",
                                                                 value: {activeElement: haveActiveChild}
                                                             });

                                                             this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
                                                         }}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={"informationDiv rowGroup"}
                                         ref={node => this.nodes[group][i]["information"] = node}>
                                        <div>
                                            <div className={"MdRemove"} style={{float: "right"}}>
                                                <MdClose size={20}
                                                         onClick={() => {
                                                             if (this.nodes[group] && this.nodes[group][i]
                                                                 && this.nodes[group][i]["information"]
                                                                 && Object.entries(this.nodes[group][i]["information"]).length !== 0)
                                                                 this.nodes[group][i]["information"].style.display = "none";
                                                         }}/>
                                            </div>
                                            {childCondition.type === "wideText" ? (
                                                <span
                                                    dangerouslySetInnerHTML={{__html: marked(documentations_IMarkdownString["EXACT_CODE"].value)}}
                                                />
                                            ) : (
                                            <span
                                                dangerouslySetInnerHTML={{__html: marked(documentations_IMarkdownString["QUOTES"].value)}}
                                            />
                                            )}
                                        </div>
                                    </div>

                                </div>
                                <div className={"rowItem"}><b>{childCondition.post}</b></div>
                            </div>
                        </div>
                    );
                case "dropdown":
                    return (
                        <div
                            className={"rowItem dropdownDiv " + (childElement.activeElement ? "activeElement" : "")
                            + (childElement.isConstraint ? " constraintElement" : "")} key={i}
                            id={`id__${this.props.ruleIndex}__${childId}`}

                            onMouseEnter={() => {
                                if (childElement.activeElement && this.nodes[group] && this.nodes[group][i]
                                    && this.nodes[group][i]["toggle"]
                                    && Object.entries(this.nodes[group][i]["toggle"]).length !== 0)
                                    this.nodes[group][i]["toggle"].style.display = "block";
                            }}
                            onMouseLeave={() => {
                                if (this.nodes[group] && this.nodes[group][i]
                                    && this.nodes[group][i]["toggle"]
                                    && Object.entries(this.nodes[group][i]["toggle"]).length !== 0)
                                    this.nodes[group][i]["toggle"].style.display = "none";
                            }}
                        >
                            <div className={"toggleConstraintDiv rowGroup"} style={{marginTop: "-25px"}}
                                 ref={node => this.nodes[group][i]["toggle"] = node}>
                                <div>
                                    <div style={{float: "left", marginTop: "3px"}}>
                                        <Switch
                                            onChange={() => this._handleConstraintElement(childId, childElement)}
                                            checked={childElement.isConstraint ? childElement.isConstraint : false}
                                            onColor="#b1b1ff"
                                            onHandleColor="#3333fc"
                                            handleDiameter={15}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                            height={15}
                                            width={30}
                                        />
                                    </div>
                                    <div className={"MdRemove rowItem"} style={{display: "inline-block"}}>
                                        <FaClose size={20}
                                                 onClick={() => {
                                                     // similar to blur
                                                     let jobs = [];

                                                     // update texts
                                                     jobs.push({
                                                         elementId: childId,
                                                         task: "UPDATE_ELEMENT",
                                                         value: {
                                                             text: "",
                                                             activeElement: false,
                                                             isConstraint: false
                                                         }
                                                     });

                                                     // if the element is not unique and there is no available empty element, add one
                                                     // or remove extras
                                                     if (!childCondition.unique) {
                                                         let availableElements = this.state.elementNode.children[group].reduce((count, elemId) => {
                                                             if (elemId !== childId)
                                                                 return count + (this.state.guiElements[elemId].activeElement ? 0 : 1);
                                                             return count + 1
                                                         }, 0);
                                                         if (availableElements < 1)
                                                             jobs.push({
                                                                 elementId: this.state.elementId,
                                                                 task: "ADD_EXTRA",
                                                                 value: group // must be constraint if its parent is
                                                             });
                                                         else if (availableElements > 1)
                                                             jobs.push({
                                                                 elementId: this.state.elementId,
                                                                 task: "REMOVE_EXTRA",
                                                                 value: group
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
                                                     // if (haveActiveChild !== this.state.thisElement.activeElement)
                                                     jobs.push({
                                                         elementId: this.state.elementId,
                                                         task: "UPDATE_ELEMENT",
                                                         value: {activeElement: haveActiveChild}
                                                     });

                                                     this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
                                                 }}/>
                                    </div>
                                </div>
                            </div>
                            <CustomDropDown
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
                                    this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
                                }}
                            />
                        </div>
                    );
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
                                return (
                                    <Fragment key={j}>
                                        <div className={"rowGroup"}>
                                            <GuiComponent key={new Date()} ruleIndex={this.props.ruleIndex}
                                                          elementId={childId}
                                                          rootTree={this.state.rootTree}
                                                          guiElements={this.state.guiElements}
                                                          onChangeGuiElement={this.props.onChangeGuiElement}
                                            />
                                            {(j > 0 && j < this.state.elementNode.children["body"][i].length - 1) ? (
                                                <div className={"removeIcon"}>
                                                    <Button
                                                        onClick={() => {
                                                            let jobs = [];
                                                            jobs.push({
                                                                elementId: childId,
                                                                task: "REMOVE_ELEMENT",
                                                                value: {parentId: this.state.elementId}
                                                            });
                                                            this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
                                                        }}
                                                    >Remove Element</Button>
                                                </div>
                                            ) : null}
                                        </div>
                                        {(j === this.state.elementNode.children["body"][i].length - 1 && this.state.guiElements[childId].activeElement) ? (
                                            <div className={"rowItem"}>
                                                <Button
                                                    onClick={() => {
                                                        let jobs = [];
                                                        jobs.push({
                                                            elementId: this.state.elementId,
                                                            task: "ADD_EXTRA",
                                                            value: "body," + i
                                                        });
                                                        this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
                                                    }}
                                                >Add {childCondition.grammar}</Button>
                                            </div>
                                        ) : null}
                                    </Fragment>
                                );

                            case "wideText":
                            case "smallText":
                            case "text":
                                return (
                                    <div key={j} id={`id__${this.props.ruleIndex}__${childId}`}
                                         className={"inputTextContainer "
                                         + (childCondition.type === "wideText" ? "rowGroup"
                                             : childCondition.type === "smallText" ? "smallText rowItem"
                                                 : "rowItem")
                                         + (childElement.activeElement ? " activeElement" : "")
                                         + (childElement.isConstraint ? " constraintElement" : "")}
                                         onMouseEnter={() => {
                                             if (childElement.activeElement && this.nodes["body"] && this.nodes["body"][i]
                                                 && this.nodes["body"][i][j] && this.nodes["body"][i][j]["information"]
                                                 && Object.entries(this.nodes["body"][i][j]["information"]).length !== 0)
                                                 this.nodes["body"][i][j]["toggle"].style.display = "block";
                                         }}
                                         onMouseLeave={() => {
                                             if (this.nodes["body"] && this.nodes["body"][i] && this.nodes["body"][i][j]
                                                 && this.nodes["body"][i][j]["information"]
                                                 && Object.entries(this.nodes["body"][i][j]["information"]).length !== 0)
                                                 this.nodes["body"][i][j]["toggle"].style.display = "none";
                                         }}
                                    >
                                        <div>
                                            <div className={"rowItem"}><b>{childCondition.pre}</b></div>
                                            <div
                                                className={"inputTextDiv rowItem " + (childCondition.type === "wideText" ? "wideText" : "")}>
                                                <input type={"text"}
                                                       className={"inputText" + (childElement.activeElement ? " activeElement " : "")}
                                                       value={this.state.texts["body"][i][j]}
                                                       placeholder={childCondition.placeholder}
                                                       onChange={e => {
                                                           let texts = this.state.texts;
                                                           texts["body"][i][j] = e.target.value;
                                                           this.setState({texts});
                                                       }}
                                                       onFocus={() => {
                                                           if (this.nodes["body"] && this.nodes["body"][i] && this.nodes["body"][i][j]
                                                               && this.nodes["body"][i][j]["information"]
                                                               && Object.entries(this.nodes["body"][i][j]["information"]).length !== 0)
                                                               this.nodes["body"][i][j]["information"].style.display = "block";
                                                       }}
                                                       onBlur={e => {
                                                           if (this.nodes["body"] && this.nodes["body"][i] && this.nodes["body"][i][j]
                                                               && this.nodes["body"][i][j]["information"]
                                                               && Object.entries(this.nodes["body"][i][j]["information"]).length !== 0)
                                                               this.nodes["body"][i][j]["information"].style.display = "none";

                                                           if (this.state.elementNode.children["body"][i][j] === e.target.value) return;
                                                           let jobs = [];
                                                           // update the text
                                                           jobs.push({
                                                               elementId: childId,
                                                               task: "UPDATE_ELEMENT",
                                                               value: {
                                                                   text: e.target.value,
                                                                   activeElement: e.target.value !== ""
                                                               }
                                                           });
                                                           // if the childElement is not unique and there is no available empty element, add one
                                                           // or remove extras
                                                           if (!childCondition.unique) {
                                                               let availableElements = this.state.elementNode.children["body"][i].reduce((count, elemId) => {
                                                                   if (elemId !== childId)
                                                                       return count + (this.state.guiElements[elemId].activeElement ? 0 : 1);
                                                                   return count + (e.target.value !== "" ? 0 : 1)
                                                               }, 0);
                                                               if (availableElements < 1)
                                                                   jobs.push({
                                                                       elementId: this.state.elementId,
                                                                       task: "ADD_EXTRA",
                                                                       value: "body," + i
                                                                   });
                                                               else if (availableElements > 1)
                                                                   jobs.push({
                                                                       elementId: this.state.elementId,
                                                                       task: "REMOVE_EXTRA",
                                                                       value: "body," + i
                                                                   });
                                                           }

                                                           // update activeElement for the main element
                                                           let haveActiveChild = e.target.value !== "";
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

                                                           this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
                                                       }}
                                                />

                                                <div className={"toggleConstraintDiv rowGroup"}
                                                     ref={node => this.nodes["body"][i][j]["toggle"] = node}>
                                                    <div>
                                                        <div style={{float: "left", marginTop: "3px"}}>
                                                            <Switch
                                                                onChange={() => this._handleConstraintElement(childId, childElement)}
                                                                checked={childElement.isConstraint ? childElement.isConstraint : false}
                                                                onColor="#b1b1ff"
                                                                onHandleColor="#3333fc"
                                                                handleDiameter={15}
                                                                uncheckedIcon={false}
                                                                checkedIcon={false}
                                                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                                                height={15}
                                                                width={30}
                                                            />
                                                        </div>
                                                        <div className={"MdRemove rowItem"}
                                                             style={{display: "inline-block"}}>
                                                            <FaClose size={20}
                                                                     onClick={() => {
                                                                         // similar to blur

                                                                         let jobs = [];
                                                                         // update the text
                                                                         jobs.push({
                                                                             elementId: childId,
                                                                             task: "UPDATE_ELEMENT",
                                                                             value: {
                                                                                 text: "",
                                                                                 activeElement: false
                                                                             }
                                                                         });
                                                                         // if the childElement is not unique and there is no available empty element, add one
                                                                         // or remove extras
                                                                         if (!childCondition.unique) {
                                                                             let availableElements = this.state.elementNode.children["body"][i].reduce((count, elemId) => {
                                                                                 if (elemId !== childId)
                                                                                     return count + (this.state.guiElements[elemId].activeElement ? 0 : 1);
                                                                                 return count + 1
                                                                             }, 0);
                                                                             if (availableElements < 1)
                                                                                 jobs.push({
                                                                                     elementId: this.state.elementId,
                                                                                     task: "ADD_EXTRA",
                                                                                     value: "body," + i
                                                                                 });
                                                                             else if (availableElements > 1)
                                                                                 jobs.push({
                                                                                     elementId: this.state.elementId,
                                                                                     task: "REMOVE_EXTRA",
                                                                                     value: "body," + i
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

                                                                         this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
                                                                     }}/>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={"informationDiv rowGroup"}
                                                     ref={node => this.nodes["body"][i][j]["information"] = node}>
                                                    <div>
                                                        <div className={"MdRemove"} style={{float: "right"}}>
                                                            <MdClose size={20}
                                                                     onClick={() => {
                                                                         if (this.nodes["body"] && this.nodes["body"][i] && this.nodes["body"][i][j]
                                                                             && this.nodes["body"][i][j]["information"]
                                                                             && Object.entries(this.nodes["body"][i][j]["information"]).length !== 0)
                                                                             this.nodes["body"][i][j]["information"].style.display = "none";
                                                                     }}/>
                                                        </div>
                                                        {childCondition.type === "wideText" ? (
                                                            <span
                                                                dangerouslySetInnerHTML={{__html: marked(documentations_IMarkdownString["EXACT_CODE"].value)}}
                                                            />
                                                        ) : (
                                                            <span
                                                                dangerouslySetInnerHTML={{__html: marked(documentations_IMarkdownString["QUOTES"].value)}}
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                            <div className={"rowItem"}><b>{childCondition.post}</b></div>
                                        </div>
                                    </div>
                                );
                            case "dropdown":
                                return (
                                    <div
                                        className={"rowItem dropdownDiv " + (childElement.activeElement ? "activeElement" : "")
                                        + (childElement.isConstraint ? " constraintElement" : "")} key={j}
                                        id={`id__${this.props.ruleIndex}__${childId}`}

                                        onMouseEnter={() => {
                                            if (childElement.activeElement && this.nodes["body"] && this.nodes["body"][i] && this.nodes["body"][i][j]
                                                && this.nodes["body"][i][j]["toggle"]
                                                && Object.entries(this.nodes["body"][i][j]["toggle"]).length !== 0)
                                                this.nodes["body"][i][j]["toggle"].style.display = "block";
                                        }}
                                        onMouseLeave={() => {
                                            if (this.nodes["body"] && this.nodes["body"][i] && this.nodes["body"][i][j]
                                                && this.nodes["body"][i][j]["toggle"]
                                                && Object.entries(this.nodes["body"][i][j]["toggle"]).length !== 0)
                                                this.nodes["body"][i][j]["toggle"].style.display = "none";
                                        }}
                                    >
                                        <div className={"toggleConstraintDiv rowGroup"} style={{marginTop: "-25px"}}
                                             ref={node => this.nodes["body"][i][j]["toggle"] = node}>
                                            <div>
                                                <div style={{float: "left", marginTop: "3px"}}>
                                                    <Switch
                                                        onChange={() => this._handleConstraintElement(childId, childElement)}
                                                        checked={childElement.isConstraint ? childElement.isConstraint : false}
                                                        onColor="#b1b1ff"
                                                        onHandleColor="#3333fc"
                                                        handleDiameter={15}
                                                        uncheckedIcon={false}
                                                        checkedIcon={false}
                                                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                                        height={15}
                                                        width={30}
                                                    />
                                                </div>
                                                <div className={"MdRemove rowItem"} style={{display: "inline-block"}}>
                                                    <FaClose size={20}
                                                             onClick={() => {
                                                                 // similar to blur

                                                                 let jobs = [];
                                                                 // update the text
                                                                 jobs.push({
                                                                     elementId: childId,
                                                                     task: "UPDATE_ELEMENT",
                                                                     value: {
                                                                         text: "",
                                                                         activeElement: false
                                                                     }
                                                                 });
                                                                 // if the childElement is not unique and there is no available empty element, add one
                                                                 // or remove extras
                                                                 if (!childCondition.unique) {
                                                                     let availableElements = this.state.elementNode.children["body"][i].reduce((count, elemId) => {
                                                                         if (elemId !== childId)
                                                                             return count + (this.state.guiElements[elemId].activeElement ? 0 : 1);
                                                                         return count + 1
                                                                     }, 0);
                                                                     if (availableElements < 1)
                                                                         jobs.push({
                                                                             elementId: this.state.elementId,
                                                                             task: "ADD_EXTRA",
                                                                             value: "body," + i
                                                                         });
                                                                     else if (availableElements > 1)
                                                                         jobs.push({
                                                                             elementId: this.state.elementId,
                                                                             task: "REMOVE_EXTRA",
                                                                             value: "body," + i
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

                                                                 this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
                                                             }}/>
                                                </div>
                                            </div>
                                        </div>
                                        <CustomDropDown

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
                                                this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
                                            }}
                                        />
                                    </div>
                                );
                            default:
                                return null;
                        }
                    })
                }
            </div>)
        );
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

        this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
    }

    _handleConstraintElement(elementId, thisElement) {
        if (!thisElement.activeElement) return;
        let jobs = [];
        jobs.push({
            elementId: elementId,
            task: "UPDATE_ELEMENT",
            value: {isConstraint: !thisElement.isConstraint}
        });
        this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
    }

    _handleSelectedElement(elementId, thisElement, elementCondition) {
        if (!(thisElement.activeElement && elementCondition.canBeSelected)) return;
        let jobs = [];
        jobs.push({
            elementId: elementId,
            task: "SELECT_ELEMENT",
            value: true
        });
        this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
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
                <Dropdown id={this.state.id} open={this.state.open} className={"dropdownToggle"}
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