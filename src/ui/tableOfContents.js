/**
 * Created by saharmehrpour on 9/5/17.
 */

import React, {Component} from "react";
import "../App.css";
import {connect} from "react-redux";
import {Button} from "react-bootstrap";
import {MdPlaylistAdd} from "react-icons/md";

import {changeEditMode} from "../actions";
import {hashConst} from "./uiConstants";

class TableOfContents extends Component {
    render() {
        return (
            <div>
                {this.props.rules.length > 0 ? (
                    <div>
                        <div className={"well well-sm"}>
                            <h4>Rules</h4>
                        </div>
                        <div className={"ist-inline"}>
                            <table>
                                <tbody>
                                    {this.props.rules.map((rule, i) => (
                                        <tr key={i}>
                                            <td className={"list-group-item"}>{rule.title}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>Welcome to the Rules Dashboard! This tool helps you manage design rules for your projects.</p>
                        <p>Explore how easy it is to create, view, and manage design rules with the intuitive interface.</p>
                        <br></br>
                        <div style={{marginTop: "20px"}}>
                                <h4>How Active Documentation Works ?</h4>
                                <p>
                                    ActiveDocumentation seamlessly integrates into your IDE and codebase, automatically monitoring and enforcing design rules.
                                </p>
                                <div style={{marginTop: "20px", color: "red"}}>
                                    <p><b>Have not installed Plugin yet?</b></p>
                                    <p>Please check out the <a href={"https://github.com/ourcodeinc/ActiveDocumentation-webapp/wiki/User-Manual#2-installing-the-plugin"}>installation process here</a> to install the plugin and get started.</p>
                                    </div>
                                <p>
                                    To get started, add a new rule by clicking the button above. You can also explore the detailed explanation of how rules work by visiting the <a href={`#/${hashConst.learnDesignRules}`}>Learn Design Rules</a> section.
                                </p>
                            </div>
                        <div>
                            <div>
                                <img src={`${process.env.PUBLIC_URL}/rules.png`} alt="Rules Dashboard Screenshot" style={{width: "450px", height: "400px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}/>
                            </div>
                            <br></br>
                            <p>Start by creating a rule to begin!</p>
                            <div className={"ist-inline"}>
                                <div style={{padding: "10px 0 10px 0", clear: "both"}}>
                                    <Button style={{padding: "0 5px"}}
                                        onClick={() => {
                                            window.location.hash = `#/${hashConst.rules}`;
                                            this.props.onAddNewRule();
                                        }}>
                                        <MdPlaylistAdd className={"react-icons"} size={35}/>
                                        Add a New Rule
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

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
 * }]}], tagTable: [{ID:string,tagName:string, detail:string}], currentHash:string[]}}
 */
function mapStateToProps(state) {
    return {
        rules: state.ruleTable,
        tags: state.tagTable,
        currentHash: state.currentHash,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onAddNewRule: () => dispatch(changeEditMode(-1, true)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TableOfContents);
