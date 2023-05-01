/**
 * Created by saharmehrpour on 9/7/17.
 */

import React, {Component} from "react";
import "../App.css";
import Utilities from "../core/utilities";

import {FormControl} from "react-bootstrap";
import {connect} from "react-redux";
import {GoAlert} from "react-icons/go";
import {webSocketSendMessage} from "../core/coreConstants";
import {hashConst} from "./uiConstants";

export class HeaderBar extends Component {

    render() {
        return (
            <div style={{paddingBottom: "30px"}} id="headerBar">
                {this.props.ws.readyState === 1 ? null : (
                    <div className={"webSocketError"}><GoAlert size={25} className={"react-icons"}/>
                    The tool is not connected to the IDE. Check IntelliJ IDE. Then refresh the page.</div>
                )}
                <div className="headerDiv">
                    {this.renderHeader()}
                </div>
            </div>
        )
    }

    renderHeader() {
        switch (this.props.currentHash[0]) {
            case hashConst.tag:
                return (
                    <div>
                        <span className="text-16 primary">Rules related to tag: </span><br/>
                        <span className="text-24 important">{this.props.title}</span>
                        <FormControl componentClass="textarea" defaultValue={this.props.content} style={{resize: "vertical"}}
                                     onBlur={(e) => {
                                         if (e.target.value !== this.props.tag.detail) {
                                             let filtered = this.props.tagTable.filter((d) => d.tagName === this.props.tag.tagName);
                                             if (filtered.length === 1) {
                                                 filtered[0].detail = e.target.value;
                                                 Utilities.sendToServer(this.props.ws, webSocketSendMessage.modified_tag_msg, filtered[0]);
                                             }
                                         }
                                     }}
                                     key={new Date()}
                                     placeholder="Information about tag"
                                     onClick={(e) => {
                                         e.target.style.cssText = "height:0";
                                         e.target.style.cssText = `overflow:hidden;height:${e.target.scrollHeight}px`;
                                     }}/>
                    </div>
                );
            case hashConst.rule:
                return (
                    <div>
                        <span className="text-16 primary">Rule Index: </span>
                        <span
                            className="text-24 important">{this.props.title.replace(this.props.projectPath, "")}</span>
                    </div>
                );
            case hashConst.codeChanged:
                return (
                    <div>
                        <span className="text-16 primary">Code Changed in File:</span><br/>
                        <span
                            className="text-24 important">{this.props.content.replace(this.props.projectPath, "")}</span>
                    </div>
                );
            case hashConst.ruleChanged:
                return (
                    <div>
                        <h3>Rule {this.props.title} is changed.</h3>
                    </div>
                );
            case hashConst.generateRule:
                return (
                    <div>
                        <h3>{this.props.title}</h3>
                    </div>
                );
            case hashConst.rulesForFile:
                return (
                    <div>
                        <span className="text-16 primary">Rules applicable for File:</span><br/>
                        <span
                            className="text-24 important">{this.props.content.replace(this.props.projectPath, "")}</span>
                    </div>
                );
            default:
                return (
                    <div>
                        <h3>{this.props.title}</h3>
                    </div>
                );
        }

    }

}

// map state to props
/**
 * @param state {{ruleTable:[{index:number, title:string, description:string, tags:[], grammar:string,
 * checkForFilesFolders:[string], checkForFilesFoldersConstraints:"INCLUDE"|"EXCLUDE"|"NONE",
 * processFilesFolders:"WITHIN",
 * quantifierXPathQuery:[], constraintXPathQuery:[], quantifierQueryType:string, constraintQueryType:string,
 * rulePanelState:{editMode:boolean, title:string, description:string, ruleTags:[], folderConstraint:string,
 * filesFolders:[],
 * constraintXPath:string, quantifierXPath:string, autoCompleteArray:[],
 * graphicalEditorState:{guiTree:{}, guiElements:{}, ruleType:string}},
 * xPathQueryResult:[{
 * data:{quantifierResult:[{filePath:string,snippet:string,xml:{fileName:string,
 * xml:string}}],
 * satisfied:number, satisfiedResult:[], violated:number, violatedResult:[]
 * changed:boolean,violatedChanged:string,satisfiedChanged:string,allChanged:string},
 * filePath:string
 * }]}], tagTable: [{ID:string,tagName:string,detail:string}], currentHash:string[],
 * ws:any, projectPath: string, openFilePath:string}}
 */
function mapStateToProps(state) {
    let props = {
        tagTable: state.tagTable,
        currentHash: state.currentHash,
        ws: state.ws,
        projectPath: state.projectPath,
        tag: "",
        title: "",
        content: ""
    };

    switch (state.currentHash[0]) {
        case hashConst.tag:
            try {
                props.tag = state.tagTable.filter((d) => d.ID === state.currentHash[1])[0];
            } catch {
            }
            props.title = props.tag.tagName;
            props.content = props.tag.detail;
            break;
        case hashConst.rules:
            props.title = "All Rules";
            break;
        case hashConst.tagJsonChanged:
            props.title = "tagTable.json is changed.";
            break;
        case hashConst.ruleJsonChanged:
            props.title = "ruleTable.json is changed.";
            break;
        case hashConst.index:
            props.title = "Active Documentation";
            break;
        case hashConst.violatedRules:
            props.title = "Violated Rules";
            break;
        case hashConst.rulesForFile:
            props.content = state.openFilePath.replace(state.projectPath, "");
            break;
        case hashConst.codeChanged:
            props.title = "Code changed in";
            props.content = state.openFilePath.replace(state.projectPath, "");
            break;
        case hashConst.learnDesignRules:
            props.title = "Learn Design Rules";
            break;
        default:
            props.content = "Error no page is found for: " + state.currentHash[0];
            break;
    }

    return props;

}

export default connect(mapStateToProps, null)(HeaderBar);