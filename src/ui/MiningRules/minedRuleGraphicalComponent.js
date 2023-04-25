// /**
//  * Modified copy of RulePad/rulePadGraphicalEditor/graphicalComponent
//  * It doesn't consider 'selection' (EoI) or constraint.
//  * It also doesn't show inactive, empty elements.
//  * Copied from src/ui/rulePadGraphicalEditor/graphicalComponent.js
//  */
//
// import React, {Component, Fragment} from "react";
// import {MdClose} from "react-icons/md";
// import {FaEraser} from "react-icons/fa";
// import {Button} from "react-bootstrap";
// import {marked} from "marked";
// import ReactToolTip from "react-tooltip";
//
// import {getConditionByName} from "../RulePad/rulePadGraphicalEditor/graphicalEditorConstants";
// import {documentations_IMarkdownString} from "../RulePad/rulePadTextualEditor/textualEditorConstant";
// import {CustomDropDown} from "../RulePad/rulePadGraphicalEditor/graphicalComponent";
//
//
// class MinedRuleGraphicalComponent extends Component {
//
//     constructor(props) {
//         super(props);
//         // ruleIndex, elementId, rootTree, guiElements, canBeStarredIDs, changeGuiElementJobs(), root << for styling
//
//         this.state = {};
//
//         this.state.guiElements = props["guiElements"];
//         this.state.elementId = props["elementId"];
//
//         // {conditionName: "class_el", activeElement: false, selectedElement: false},
//         this.state.thisElement = this.state.guiElements[this.state.elementId];
//         /*
//            {type: "element",
//             children: {
//                 top: "class_annotation",
//                 before_1: "class_memory",
//                 before_2: "class_visibility",
//                 before_3: "",
//                 after_1: "class_name",
//                 after_2: "class_implements",
//                 after_3: "class_extends",
//                 body: [
//                     "declaration_statement_el",
//                     "constructor_el",
//                     "function_el",
//                     "abstract_function_el"
//                 ]
//             },
//             grammar: "class",
//             pre_before_1: "",
//             pre_before_2: "",
//             pre_before_3: "",
//             pre_after_1: "class",
//             pre_after_2: "",
//             pre_after_3: "",
//             post_after_3: "",
//             pre_body: "{",
//             post_body: "}",
//             canBeSelected: true
//         }
//         */
//         this.state.elementCondition = getConditionByName(this.state.thisElement.conditionName);
//         /*
//            {top: ["0.0.0"],
//             before_1: ["0.1.0"],
//             before_2: ["0.2.0"],
//             before_3: ["0.3.0"],
//             after_1: ["0.4.0"],
//             after_2: ["0.5.0"],
//             after_3: ["0.6.0"],
//             body: [["0.7.0"], ["0.7.1"], ["0.7.2"], ["0.7.3"]]
//         }
//         */
//         this.state.elementNode = props["rootTree"][this.state.elementId];
//
//         // reference for components
//         this.thisNode = {};
//         this.nodes = {};
//
//         this.state.hoverCheckbox = {element: false};
//         // for storing temporary states
//         this.state.texts = {};
//         Object.keys(this.state.elementNode.children).forEach(group => {
//             this.state.hoverCheckbox[group] = [];
//             this.state.texts[group] = [];
//             this.nodes[group] = [];
//             if (group === "body")
//                 this.state.elementNode.children["body"].forEach(subGroup => {
//                     this.state.hoverCheckbox["body"].push([]);
//                     this.state.texts["body"].push([]);
//                     this.nodes["body"].push([]);
//                     subGroup.forEach((childId) => {
//                         this.state.hoverCheckbox["body"][this.state.hoverCheckbox["body"].length - 1].push(false);
//                         this.state.texts["body"][this.state.texts["body"].length - 1].push(this.state.guiElements[childId].text ? this.state.guiElements[childId].text : "");
//                         this.nodes["body"][this.nodes["body"].length - 1].push({});
//                     });
//                 });
//             else
//                 this.state.elementNode.children[group].forEach(childId => {
//                     this.state.hoverCheckbox[group].push(false);
//                     this.state.texts[group].push(this.state.guiElements[childId].text ? this.state.guiElements[childId].text : "");
//                     this.nodes[group].push({});
//                 })
//         });
//     }
//
//     UNSAFE_componentWillReceiveProps(nextProps) {
//         let hoverCheckbox = {element: false};
//         // recover texts:
//         let texts = {};
//         Object.keys(nextProps["rootTree"][nextProps.elementId].children).forEach(group => {
//             hoverCheckbox[group] = [];
//             texts[group] = [];
//             this.nodes[group] = [];
//             if (group === "body")
//                 nextProps["rootTree"][nextProps.elementId].children["body"].forEach(subGroup => {
//                     hoverCheckbox["body"].push([]);
//                     texts["body"].push([]);
//                     this.nodes["body"].push([]);
//                     subGroup.forEach((childId) => {
//                         hoverCheckbox["body"][hoverCheckbox["body"].length - 1].push(false);
//                         texts["body"][texts["body"].length - 1].push(nextProps.guiElements[childId].text ? nextProps.guiElements[childId].text : "");
//                         this.nodes["body"][this.nodes["body"].length - 1].push({});
//                     })
//                 });
//             else
//                 nextProps["rootTree"][nextProps.elementId].children[group].forEach(childId => {
//                     hoverCheckbox[group].push(false);
//                     texts[group].push(nextProps.guiElements[childId].text ? nextProps.guiElements[childId].text : "");
//                     this.nodes[group].push({});
//                 })
//         });
//
//         this.setState({
//             guiElements: nextProps.guiElements,
//             elementId: nextProps.elementId,
//             thisElement: nextProps.guiElements[nextProps.elementId],
//             elementNode: nextProps["rootTree"][nextProps.elementId],
//             elementCondition: getConditionByName(nextProps.guiElements[nextProps.elementId].conditionName),
//
//             texts: texts,
//             hoverCheckbox: hoverCheckbox
//         });
//     }
//
//     render() {
//         return (
//             <div className={"overlayContainer"}
//                  onMouseEnter={() => this.overlayDiv.style.display = "none"}
//                  onMouseLeave={(e) => {
//                      e.stopPropagation();
//                      this.overlayDiv.style.display = this.props.root || this.state.thisElement.activeElement ? "none" : "block";
//                  }}>
//                 <div
//                     className={"mainDiv-overlay elementDiv" + (this.state.thisElement.activeElement ? " activeElement" : "")}
//                     id={`id__${this.props.ruleIndex}__${this.state.elementId}`}
//
//                     ref={node => this.thisNode = node}
//
//                     onMouseLeave={() => {
//                         // if a textbox is focused blur when leaving the parent div
//                         if (this.thisNode.contains(document.activeElement))
//                             document.activeElement.blur();
//                     }}
//                 >
//                     {this.renderElementToolBar()}
//                     <div className={"rowGroup"}>
//                         {this.renderGroup("top")}
//                     </div>
//                     <div className={"rowGroup"}>
//                         {this.renderPrePost("pre_before_1")}
//                         {this.renderGroup("before_1")}
//                         {this.renderPrePost("pre_before_2")}
//                         {this.renderGroup("before_2")}
//                         {this.renderPrePost("pre_before_3")}
//                         {this.renderGroup("before_3")}
//
//                         {this.renderPrePost("pre_after_1")}
//                         {this.renderGroup("after_1")}
//                         {this.renderPrePost("pre_after_2")}
//                         {this.renderGroup("after_2")}
//                         {this.renderPrePost("pre_after_3")}
//                         {this.renderGroup("after_3")}
//                         {this.renderPrePost("post_after_3")}
//                     </div>
//                     {this.renderPrePost("pre_body")}
//                     {this.renderBody()}
//                     {this.renderPrePost("post_body")}
//                 </div>
//                 {this.renderOverlayDiv()}
//             </div>
//         )
//     }
//
//     renderElementToolBar() {
//         // erasing and resetting the element and all its descendants
//         let eraseFunction = () => {
//
//             // erasing all children
//             let resetAllChildren = (nodeId, jobs) => {
//                 jobs.push({
//                     elementId: nodeId,
//                     task: "UPDATE_ELEMENT",
//                     value: {
//                         activeElement: false,
//                         text: "" // may not be input text field
//                     }
//                 });
//                 Object.keys(this.props["rootTree"][nodeId].children).forEach(group => {
//                     if (group !== "body") {
//                         this.props["rootTree"][nodeId].children[group].forEach(elemId => {
//                             if (this.state.guiElements[elemId].activeElement) {
//                                 jobs.push({
//                                     elementId: elemId,
//                                     task: "UPDATE_ELEMENT",
//                                     value: {
//                                         activeElement: false,
//                                         text: "" // may not be input text field
//                                     }
//                                 });
//                                 resetAllChildren(elemId, jobs);
//                             }
//                         });
//                         if (this.props["rootTree"][nodeId].children[group].length > 1)
//                             jobs.push({
//                                 elementId: nodeId,
//                                 task: "REMOVE_EXTRA",
//                                 value: group
//                             });
//                     }
//                     else
//                         this.props["rootTree"][nodeId].children["body"].forEach((subGroup, i) => {
//                             subGroup.forEach(elemId => {
//                                 if (this.state.guiElements[elemId].activeElement) {
//                                     jobs.push({
//                                         elementId: elemId,
//                                         task: "UPDATE_ELEMENT",
//                                         value: {
//                                             activeElement: false,
//                                             text: "" // may not be input text field
//                                         }
//                                     });
//                                     resetAllChildren(elemId, jobs);
//                                 }
//                             });
//                             if (subGroup.length > 1)
//                                 jobs.push({
//                                     elementId: nodeId,
//                                     task: "REMOVE_EXTRA",
//                                     value: "body," + i
//                                 });
//                         });
//                 });
//
//                 return jobs;
//             };
//
//             // search for all descendants and reset them all
//             let jobs = resetAllChildren(this.state.elementId, []);
//
//             this.props["changeGuiElementJobs"](this.props.ruleIndex, jobs);
//         };
//
//         if (this.state.thisElement.activeElement || this.props.root)
//             return (
//                 <div className={"elementIconsDiv"}>
//                     {!this.state.thisElement.activeElement ? null
//                         : this.renderErase(eraseFunction)}
//                 </div>
//             );
//         return null;
//     }
//
//     renderGroup(group) {
//         return this.state.elementNode.children[group].map((childId, i) => {
//             let childElement = this.state.guiElements[childId];
//             let childCondition = getConditionByName(childElement.conditionName);
//
//             switch (childCondition.type) {
//                 case "element":
//                     return this.renderElementChild(group, null, i, childId, childCondition);
//
//                 case "wideText":
//                 case "smallText":
//                 case "text":
//                     return this.renderTextChild(group, null, i, childId, childElement, childCondition);
//
//                 case "dropdown":
//                     return this.renderDropDownChild(group, null, i, childId, childElement, childCondition);
//
//                 default:
//                     return null;
//             }
//         });
//     }
//
//     renderBody() {
//         return this.state.elementNode.children["body"].map((ids, i) =>
//             (<div className={"bodyChildrenContainer"} key={i}>
//                 {
//                     ids.map((childId, j) => {
//                         let childElement = this.state.guiElements[childId];
//                         let childCondition = getConditionByName(childElement.conditionName);
//
//                         switch (childCondition.type) {
//                             case "element":
//                                 return this.renderElementChild("body", i, j, childId, childCondition);
//
//                             case "wideText":
//                             case "smallText":
//                             case "text":
//                                 return this.renderTextChild("body", i, j, childId, childElement, childCondition);
//
//                             case "dropdown":
//                                 return this.renderDropDownChild("body", i, j, childId, childElement, childCondition);
//
//                             default:
//                                 return null;
//                         }
//                     })
//                 }
//             </div>)
//         );
//     }
//
//     renderElementChild(group, innerIndex, index, childId, childCondition) {
//         // add element after clicking on the button
//         let processAddElement = () => {
//             let jobs = [];
//             jobs.push({
//                 elementId: this.state.elementId,
//                 task: "ADD_EXTRA",
//                 value: group !== "body" ? group : "body," + innerIndex
//             });
//             this.props["changeGuiElementJobs"](this.props.ruleIndex, jobs);
//         };
//         if (this.state.guiElements[childId].activeElement)
//             return (
//                 <Fragment key={index}>
//                     <div className={group === "body" ? "rowGroup" : "rowItem"}>
//                         <MinedRuleGraphicalComponent key={new Date()} ruleIndex={this.props.ruleIndex} elementId={childId}
//                                                      rootTree={this.props["rootTree"]} guiElements={this.state.guiElements}
//                                                      canBeStarredIDs={this.props["canBeStarredIDs"]}
//                                                      changeGuiElementJobs={this.props["changeGuiElementJobs"]}
//                         />
//                     </div>
//                 </Fragment>
//             )
//
//         return (
//             <Fragment key={index}>
//                 <div className={"rowItem"}>
//                     <Button style={{padding: "0px 5px"}} onClick={processAddElement}>Add {childCondition.grammar}</Button>
//                 </div>
//             </Fragment>
//         )
//     }
//
//     renderTextChild(group, innerIndex, index, childId, childElement, childCondition) {
//         let inputTextNode = null;
//         let closeInformationDiv = null;
//         let clickedElement = null;
//         let shouldDisplayInformation = true;
//         let className = "inputTextContainer "
//             + (childCondition.type === "wideText" ? "rowGroup"
//                 : childCondition.type === "smallText" ? "smallText rowItem"
//                     : "rowItem");
//         let nodes = group !== "body" ? this.nodes[group] : this.nodes["body"][innerIndex];
//         let texts = group !== "body" ? this.state.texts[group] : this.state.texts["body"][innerIndex];
//         let children = group !== "body" ? this.state.elementNode.children[group] : this.state.elementNode.children["body"][innerIndex];
//         let informationGroup = childCondition.informationType ? childCondition.informationType : "TEXTS";
//         let wordRegex = /^(!?([a-zA-Z0-9_-]+|\.\.\.[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]+\.\.\.|\.\.\.[a-zA-Z0-9_-]+\.\.\.)(&&|\|\|))*!?([a-zA-Z0-9_-]+|\.\.\.[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]+\.\.\.|\.\.\.[a-zA-Z0-9_-]+\.\.\.)$/;
//         let combinatorialRegex = /^([a-zA-Z0-9_-]|\.|=|>|<|\(|\)| |'|,)+$/;
//         let wordOrCombinatorialRegex = /^(([a-zA-Z0-9_-]|\.|=|>|<|\(|\)| |'|,)+|((!?([a-zA-Z0-9_-]+|\.\.\.[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]+\.\.\.|\.\.\.[a-zA-Z0-9_-]+\.\.\.)(&&|\|\|))*!?([a-zA-Z0-9_-]+|\.\.\.[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]+\.\.\.|\.\.\.[a-zA-Z0-9_-]+\.\.\.)))$/;
//         let validatorRegex = childCondition.wordValidation === "both" ? wordOrCombinatorialRegex : childCondition.wordValidation === "word" ? wordRegex : combinatorialRegex;
//
//         let mouseEnter = () => {
//             if (childElement.activeElement && nodes && nodes[index] && nodes[index]["checkbox"]
//                 && Object.entries(nodes[index]["checkbox"]).length !== 0)
//                 nodes[index]["checkbox"].style.display = "block";
//         };
//
//         let mouseLeave = () => {
//             if (nodes && nodes[index] && nodes[index]["checkbox"]
//                 && Object.entries(nodes[index]["checkbox"]).length !== 0)
//                 nodes[index]["checkbox"].style.display = "none";
//         };
//
//         let change = (e) => {
//             let newTexts = this.state.texts;
//             if (group === "body")
//                 newTexts["body"][innerIndex][index] = e.target.value;
//             else
//                 newTexts[group][index] = e.target.value;
//             this.setState({texts: newTexts});
//         };
//
//         let focus = () => {
//             if (childCondition.informationType && shouldDisplayInformation
//                 && nodes && nodes[index] && nodes[index]["information"]
//                 && Object.entries(nodes[index]["information"]).length !== 0)
//                 nodes[index]["information"].style.display = "block";
//         };
//
//         let blur = (inputText) => {
//             // if clicked on close information do not lose focus
//             if (closeInformationDiv.contains(clickedElement)) {
//                 if (nodes && nodes[index] && nodes[index]["information"]
//                     && Object.entries(nodes[index]["information"]).length !== 0)
//                     nodes[index]["information"].style.display = "none";
//                 shouldDisplayInformation = false;
//                 inputTextNode.focus();
//                 clickedElement = null;
//                 return;
//             }
//             // hide information div
//             if (nodes && nodes[index] && nodes[index]["information"]
//                 && Object.entries(nodes[index]["information"]).length !== 0)
//                 nodes[index]["information"].style.display = "none";
//             shouldDisplayInformation = true;
//
//             // if the text is not changed, do nothing
//             if (!this.state.guiElements[children[index]].text && inputText === "") return;
//             if (this.state.guiElements[children[index]].text === inputText) return;
//
//             let jobs = [];
//             // update text
//             jobs.push({
//                 elementId: childId,
//                 task: "UPDATE_ELEMENT",
//                 value: {
//                     text: inputText,
//                     activeElement: inputText !== ""
//                 }
//             });
//             // if the childElement is not unique and there is no available empty element, add one
//             // or remove extras
//             if (!childCondition.unique) {
//                 let availableElements = children.reduce((count, elemId) => {
//                     if (elemId !== childId)
//                         return count + (this.state.guiElements[elemId].activeElement ? 0 : 1);
//                     return count + (inputText !== "" ? 0 : 1)
//                 }, 0);
//                 if (availableElements < 1)
//                     jobs.push({
//                         elementId: this.state.elementId,
//                         task: "ADD_EXTRA",
//                         value: group !== "body" ? group : "body," + innerIndex
//                     });
//                 else if (availableElements > 1)
//                     jobs.push({
//                         elementId: this.state.elementId,
//                         task: "REMOVE_EXTRA",
//                         value: group !== "body" ? group : "body," + innerIndex
//                     });
//             }
//
//             // update activeElement for the main element
//             let haveActiveChild = inputText !== "";
//             Object.keys(this.state.elementNode.children).forEach(group => {
//                 if (group !== "body")
//                     this.state.elementNode.children[group].forEach(elemId => {
//                         if (elemId !== childId && this.state.guiElements[elemId].activeElement) haveActiveChild = true;
//                     });
//                 else
//                     this.state.elementNode.children["body"].forEach(subGroup => {
//                         subGroup.forEach(elemId => {
//                             if (elemId !== childId && this.state.guiElements[elemId].activeElement) haveActiveChild = true;
//                         });
//                     });
//             });
//             jobs.push({
//                 elementId: this.state.elementId,
//                 task: "UPDATE_ELEMENT",
//                 value: {activeElement: haveActiveChild}
//             });
//
//             this.props["changeGuiElementJobs"](this.props.ruleIndex, jobs);
//         };
//
//         let closeFunction = () => blur("");
//
//         return (
//             <div key={index} id={`id__${this.props.ruleIndex}__${childId}`}
//                  className={className}
//                  onMouseEnter={mouseEnter}
//                  onMouseLeave={mouseLeave}
//                  onMouseMove={e => clickedElement = e.target}
//             >
//                 <div>
//                     <div className={"rowItem" + (childElement.activeElement ? "" : " inactiveText")}><b>{childCondition.pre}</b></div>
//                     <div className={"inputTextDiv rowItem " + (childCondition.type === "wideText" ? "wideText" : "")}>
//                         <form>
//                             <input type={"text"}
//                                    style={childCondition.type === "wideText" || texts[index] === "" || texts[index].match(validatorRegex) ? {} : {backgroundColor: "#ffbeb4"}}
//                                    ref={node => inputTextNode = node}
//                                    className={"inputText" + (childElement.activeElement ? " activeElement " : "")}
//                                    value={texts[index]}
//                                    placeholder={childCondition.placeholder}
//                                    onChange={change}
//                                    onFocus={focus}
//                                    onBlur={(e) => blur(e.target.value)}/>
//                             <div className={"checkboxConstraintDiv rowGroup"}
//                                  ref={node => group !== "body" ? this.nodes[group][index]["checkbox"] = node : this.nodes["body"][innerIndex][index]["checkbox"] = node}>
//                                 {!childElement.activeElement ? null : this.renderErase(closeFunction)}
//                             </div>
//                         </form>
//                     </div>
//                     <div className={"informationDiv rowGroup"}
//                          ref={node => group !== "body" ? this.nodes[group][index]["information"] = node : this.nodes["body"][innerIndex][index]["information"] = node}>
//                         <div>
//                             <div className={"MdRemove"} style={{float: "right"}}
//                                  ref={node => closeInformationDiv = node}>
//                                 <MdClose size={20} className={"react-icons"} onClick={() => {
//                                 }}/>
//                             </div>
//                             <span
//                                 dangerouslySetInnerHTML={{__html: marked(documentations_IMarkdownString[informationGroup].value)}}/>
//                         </div>
//                     </div>
//                 </div>
//
//             </div>
//         )
//     }
//
//     renderDropDownChild(group, innerIndex, index, childId, childElement, childCondition) {
//
//         let nodes = group !== "body" ? this.nodes[group] : this.nodes["body"][innerIndex];
//         let children = group !== "body" ? this.state.elementNode.children[group] : this.state.elementNode.children["body"][innerIndex];
//
//         let mouseEnter = () => {
//             if (childElement.activeElement && nodes && nodes[index] && nodes[index]["checkbox"]
//                 && Object.entries(nodes[index]["checkbox"]).length !== 0)
//                 nodes[index]["checkbox"].style.display = "block";
//         };
//
//         let mouseLeave = () => {
//             if (nodes && nodes[index] && nodes[index]["checkbox"]
//                 && Object.entries(nodes[index]["checkbox"]).length !== 0)
//                 nodes[index]["checkbox"].style.display = "none";
//         };
//
//         let clear = () => {
//             if (nodes && nodes[index] && nodes[index]["information"]
//                 && Object.entries(nodes[index]["information"]).length !== 0)
//                 nodes[index]["information"].style.display = "none";
//
//             let jobs = [];
//             // update text
//             jobs.push({
//                 elementId: childId,
//                 task: "UPDATE_ELEMENT",
//                 value: {
//                     text: "",
//                     activeElement: false,
//                 }
//             });
//             // if the childElement is not unique and there is no available empty element, add one
//             // or remove extras
//             if (!childCondition.unique) {
//                 let availableElements = children.reduce((count, elemId) => {
//                     if (elemId !== childId)
//                         return count + (this.state.guiElements[elemId].activeElement ? 0 : 1);
//                     return count + 1
//                 }, 0);
//                 if (availableElements < 1)
//                     jobs.push({
//                         elementId: this.state.elementId,
//                         task: "ADD_EXTRA",
//                         value: group !== "body" ? group : "body," + innerIndex
//                     });
//                 else if (availableElements > 1)
//                     jobs.push({
//                         elementId: this.state.elementId,
//                         task: "REMOVE_EXTRA",
//                         value: group !== "body" ? group : "body," + innerIndex
//                     });
//             }
//
//             // update activeElement for the main element
//             let haveActiveChild = false;
//             Object.keys(this.state.elementNode.children).forEach(group => {
//                 if (group !== "body")
//                     this.state.elementNode.children[group].forEach(elemId => {
//                         if (elemId !== childId && this.state.guiElements[elemId].activeElement) haveActiveChild = true;
//                     });
//                 else
//                     this.state.elementNode.children["body"].forEach(subGroup => {
//                         subGroup.forEach(elemId => {
//                             if (elemId !== childId && this.state.guiElements[elemId].activeElement) haveActiveChild = true;
//                         });
//                     });
//             });
//             jobs.push({
//                 elementId: this.state.elementId,
//                 task: "UPDATE_ELEMENT",
//                 value: {activeElement: haveActiveChild}
//             });
//
//             this.props["changeGuiElementJobs"](this.props.ruleIndex, jobs);
//         };
//
//         return (
//             <div
//                 className={"rowItem dropdownDiv"} key={index}
//                 id={`id__${this.props.ruleIndex}__${childId}`}
//                 onMouseEnter={mouseEnter}
//                 onMouseLeave={mouseLeave}
//             >
//                 <div className={"checkboxConstraintDiv rowGroup"} style={{marginTop: "-25px"}}
//                      ref={node => group !== "body" ? this.nodes[group][index]["checkbox"] = node : this.nodes["body"][innerIndex][index]["checkbox"] = node}>
//                     {!childElement.activeElement ? null : this.renderErase(clear)}
//                 </div>
//                 <CustomDropDown
//                     className={(childElement.activeElement ? "activeElement" : "")}
//                     menuItemsText={childCondition.items}
//                     menuItemsEvent={childCondition.items.map(item => item === "N/A" ? childCondition.placeholder : item)}
//                     menuDefault={childElement.text && childCondition.items.indexOf(childElement.text) !== -1 ? childElement.text : childCondition.placeholder}
//                     onSelectFunction={(evt) => {
//                         let jobs = [{
//                             elementId: childId,
//                             task: "UPDATE_ELEMENT",
//                             value: {
//                                 text: evt,
//                                 activeElement: !(evt === childCondition.placeholder)
//                             }
//                         }];
//                         jobs.push({
//                             elementId: this.state.elementId,
//                             task: "UPDATE_ELEMENT",
//                             value: {activeElement: !(evt === childCondition.placeholder)}
//                         });
//                         this.props["changeGuiElementJobs"](this.props.ruleIndex, jobs);
//                     }}
//                 />
//             </div>
//         )
//     }
//
//     renderPrePost(category) {
//         if (this.state.elementCondition[category] === "") return null;
//         if (category === "pre_body" || category === "post_body")
//             return (
//                 <div className={"rowGroup"}>
//                     <div className={"rowItem"}><b>{this.state.elementCondition[category]}</b></div>
//                 </div>
//             );
//         return (
//             <div className={"rowItem"}>
//                 <b>
//                     {this.state.elementCondition[category]}
//                 </b>
//             </div>
//         )
//     }
//
//     renderOverlayDiv() {
//         return (
//             <div ref={node => this.overlayDiv = node}
//                  className={"overlay"}
//                  id={`overlay__${this.props.ruleIndex}__${this.state.elementId}`}
//                  style={{display: this.props.root || this.state.thisElement.activeElement ? "none" : "block"}}>
//                 <div className={"messageDivContainer"}>
//                     <div className={"messageDiv"}>
//                         <strong>Specify {this.state.elementCondition.grammar}</strong>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
//
//     renderErase(closeFunction) {
//         return (
//             <div style={{float: "left"}}>
//                 <div style={{float: "left"}}>
//                     <div data-tip={"React-tooltip"} data-for={"clear"}>
//                         <div className={"MdRemove rowItem"} style={{display: "inline-block"}}>
//                             <FaEraser size={20} className={"react-icons"} onClick={closeFunction}/>
//                         </div>
//                     </div>
//                     <ReactToolTip place={"top"} type={"dark"} effect={"solid"} id={"clear"} delayShow={300}>
//                         <span>Clear the Element and its Characteristics</span>
//                     </ReactToolTip>
//                 </div>
//             </div>
//         )
//     }
//
// }
//
//
// export default MinedRuleGraphicalComponent;
