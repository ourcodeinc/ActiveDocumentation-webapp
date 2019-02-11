/**
 * Created by saharmehrpour on 12/17/18.
 *
 */

import React, {Component, Fragment} from 'react';
import MdStar from 'react-icons/lib/md/star';
import {Button, MenuItem, Dropdown} from 'react-bootstrap';
import {RootCloseWrapper} from 'react-overlays';
import MdLockOpen from 'react-icons/lib/md/lock-open';
import MdLock from 'react-icons/lib/md/lock';

import {getConditionByName} from "./guiConstants";


class GuiComponent extends Component {

    constructor(props) {
        super(props);
        // ruleIndex, elementId, rootTree, guiElements, onChangeGuiElement()

        this.state = {};

        this.state.guiElements = props["guiElements"];
        this.state.elementId = props["elementId"];
        this.state.rootTree = props["rootTree"];

        // {conditionName: "class_el", activeElement: false, selectedElement: false, fake_activeElement: true/false/undefined},
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

        // for storing temporary states
        this.state.texts = {};
        Object.keys(this.state.elementNode.children).forEach(group => {
            this.state.texts[group] = [];
            if (group === "body")
                this.state.elementNode.children["body"].forEach(subGroup => {
                    this.state.texts["body"].push([]);
                    subGroup.forEach((childId) => {
                        this.state.texts["body"][this.state.texts["body"].length - 1].push(this.state.guiElements[childId].text ? this.state.guiElements[childId].text : "")
                    });
                });
            else
                this.state.elementNode.children[group].forEach(childId => {
                    this.state.texts[group].push(this.state.guiElements[childId].text ? this.state.guiElements[childId].text : "")
                })
        });
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        // recover texts:
        let texts = {};
        Object.keys(nextProps.rootTree[nextProps.elementId].children).forEach(group => {
            texts[group] = [];
            if (group === "body")
                nextProps.rootTree[nextProps.elementId].children["body"].forEach(subGroup => {
                    texts["body"].push([]);
                    subGroup.forEach((childId) => {
                        texts["body"][texts["body"].length - 1].push(nextProps.guiElements[childId].text ? nextProps.guiElements[childId].text : "")
                    })
                });
            else
                nextProps.rootTree[nextProps.elementId].children[group].forEach(childId => {
                    texts[group].push(nextProps.guiElements[childId].text ? nextProps.guiElements[childId].text : "")
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
            <div
                className={"elementDiv" + (this.state.thisElement.activeElement ? " activeElement" : "") + (this.state.thisElement.selectedElement ? " selectedElement" : "")}>
                {this.renderConstraintElementLock()}
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
        )
    }

    renderConstraintElementLock() {
        if (this.state.thisElement.activeElement && this.state.elementCondition.canBeSelected)
            return (
                <div>
                    {this.state.thisElement.isConstraint ? (
                        <MdLockOpen size={20} onClick={() => {
                            let jobs = [];
                            jobs.push({
                                elementId: this.state.elementId,
                                task: "CONSTRAINT_ELEMENT",
                                value: false
                            });
                            this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
                        }}/>
                    ) : (
                        <MdLock size={20} onClick={() => {
                            let jobs = [];
                            jobs.push({
                                elementId: this.state.elementId,
                                task: "CONSTRAINT_ELEMENT",
                                value: true
                            });
                            this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
                        }}/>
                    )}
                </div>
            );
        return null;
    }

    renderSelectedElementStar() {
        if (this.state.thisElement.activeElement && this.state.elementCondition.canBeSelected)
            return (
                <div className={"MdStar" + (this.state.thisElement.selectedElement ? " selectedElement" : "")}>
                    <MdStar size={20} onClick={() => {
                        let jobs = [];
                        jobs.push({
                            elementId: this.state.elementId,
                            task: "SELECT_ELEMENT",
                            value: true
                        });
                        this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
                    }}/>
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
                                        Add Field</Button>
                                </div>
                            ) : null}
                        </Fragment>
                    );
                case "wideText":
                case "smallText":
                case "text":
                    return (
                        <Fragment key={i}>
                            <div
                                className={"inputTextContainer "
                                + (childCondition.type === "wideText" ? "rowGroup"
                                    : childCondition.type === "smallText" ? "smallText rowItem"
                                        : "rowItem")}>
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
                                               onBlur={e => {
                                                   if (this.state.elementNode.children[group][i] === e.target.value) return;
                                                   let jobs = [];

                                                   // update texts
                                                   jobs.push({
                                                       elementId: childId,
                                                       task: "UPDATE_ELEMENT",
                                                       value: {
                                                           text: e.target.value,
                                                           activeElement: e.target.value !== "",
                                                           fake_activeElement: false
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
                                                               value: group
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
                                                       value: {
                                                           activeElement: haveActiveChild,
                                                           fake_activeElement: false
                                                       }
                                                   });

                                                   this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
                                               }}
                                        />
                                    </div>
                                    <div className={"rowItem"}><b>{childCondition.post}</b></div>
                                </div>
                            </div>
                        </Fragment>
                    );
                case "dropdown":
                    return (
                        <div className={"rowItem dropdownDiv"} key={i}>
                            <CustomDropDown
                                menuItemsText={childCondition.items}
                                menuItemsEvent={childCondition.items.map(item => item === "N/A" ? childCondition.placeholder : item)}
                                menuDefault={childElement.value ? childElement.value : childCondition.placeholder}
                                onSelectFunction={(evt) => {
                                    let jobs = [{
                                        elementId: childId,
                                        task: "UPDATE_ELEMENT",
                                        value: {
                                            value: evt,
                                            activeElement: !(evt === childCondition.placeholder)
                                        }
                                    }];
                                    jobs.push({
                                        elementId: this.state.elementId,
                                        task: "UPDATE_ELEMENT",
                                        value: {
                                            activeElement: !(evt === childCondition.placeholder),
                                            fake_activeElement: false
                                        }
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
                                            {(j < this.state.elementNode.children["body"][i].length - 1) ? (
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
                                                >Add Field</Button>
                                            </div>
                                        ) : null}
                                    </Fragment>
                                );

                            case "wideText":
                            case "smallText":
                            case "text":
                                return (
                                    <Fragment key={j}>
                                        <div
                                            className={"inputTextContainer "
                                            + (childCondition.type === "wideText" ? "rowGroup"
                                                : childCondition.type === "smallText" ? "smallText rowItem"
                                                    : "rowItem")}>
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
                                                           onBlur={e => {
                                                               if (this.state.elementNode.children["body"][i][j] === e.target.value) return;
                                                               let jobs = [];
                                                               // update the text
                                                               jobs.push({
                                                                   elementId: childId,
                                                                   task: "UPDATE_ELEMENT",
                                                                   value: {
                                                                       text: e.target.value,
                                                                       activeElement: e.target.value !== "",
                                                                       fake_activeElement: false
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
                                                                   value: {
                                                                       activeElement: haveActiveChild,
                                                                       fake_activeElement: false
                                                                   }
                                                               });

                                                               this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
                                                           }}
                                                    />
                                                </div>
                                                <div className={"rowItem"}><b>{childCondition.post}</b></div>
                                            </div>
                                        </div>

                                    </Fragment>
                                );
                            case "dropdown":
                                return (
                                    <div className={"rowItem dropdownDiv"} key={j}>
                                        <CustomDropDown
                                            menuItemsText={childCondition.items}
                                            menuItemsEvent={childCondition.items.map(item => item === "N/A" ? childCondition.placeholder : item)}
                                            menuDefault={childElement.value ? childElement.value : childCondition.placeholder}
                                            onSelectFunction={(evt) => {
                                                let jobs = [{
                                                    elementId: childId,
                                                    task: "UPDATE_ELEMENT",
                                                    value: {
                                                        value: evt,
                                                        activeElement: !(evt === childCondition.placeholder)
                                                    }
                                                }];
                                                jobs.push({
                                                    elementId: this.state.elementId,
                                                    task: "UPDATE_ELEMENT",
                                                    value: {
                                                        activeElement: !(evt === childCondition.placeholder),
                                                        fake_activeElement: false
                                                    }
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
                <b onClick={() => {
                    if (this.state.thisElement.selectedElement || (this.state.thisElement.activeElement && !this.state.thisElement.fake_activeElement)) return;
                    let status = this.state.thisElement.activeElement;
                    let jobs = [];
                    jobs.push({
                        elementId: this.state.elementId,
                        task: "UPDATE_ELEMENT",
                        value: {activeElement: !status, fake_activeElement: true}
                    });
                    this.props.onChangeGuiElement(this.props.ruleIndex, jobs);
                }}>
                    {this.state.elementCondition[category]}
                </b>
            </div>
        )
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