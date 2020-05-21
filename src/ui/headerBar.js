/**
 * Created by saharmehrpour on 9/7/17.
 */


import React, {Component} from "react";
import "../App.css";
import Utilities from "../core/utilities";

import {FormControl} from "react-bootstrap";
import {connect} from "react-redux";
import GoAlert from "react-icons/lib/go/alert";
import {updateTagTable} from "../actions";


export class HeaderBar extends Component {

    render() {
        return (
            <div style={{paddingBottom: "30px"}} id="headerBar">
                {this.props.ws.readyState === 1 ? null : (
                    <div className={"webSocketError"}><GoAlert size={25}/>The tool is not connected to the IDE. Check IntelliJ IDE. Then refresh the page.</div>
                )}
                <div className="headerDiv">
                    {this.renderHeader()}
                </div>
            </div>
        )
    }


    renderHeader() {
        switch (this.props.currentHash[0]) {
            case "tag":
                return (
                    <div>
                        <span className="text-16 primary">Rules related to tag: </span><br/>
                        <span className="text-24 important">{this.props.title}</span>
                        <FormControl componentClass="textarea" defaultValue={this.props.content} style={{resize: "vertical"}}
                                     onBlur={(e) => this.props.onUpdateTag(this.props, e.target.value)} key={new Date()}
                                     placeholder="Information about tag"
                                     onClick={(e) => {
                                         e.target.style.cssText = "height:0";
                                         e.target.style.cssText = `overflow:hidden;height:${e.target.scrollHeight}px`;
                                     }}/>
                    </div>
                );
            case "rule":
                return (
                    <div>
                        <span className="text-16 primary">Rule Index: </span>
                        <span
                            className="text-24 important">{this.props.title.replace(this.props.projectPath, "")}</span>
                    </div>
                );
            case "codeChanged":
                return (
                    <div>
                        <span className="text-16 primary">Code Changed in File:</span><br/>
                        <span
                            className="text-24 important">{this.props.content.replace(this.props.projectPath, "")}</span>
                    </div>
                );
            case "ruleChanged":
                return (
                    <div>
                        <h3>Rule {this.props.title} is changed.</h3>
                    </div>
                );
            case "genRule":
                return (
                    <div>
                        <h3>{this.props.title}</h3>
                    </div>
                );
            case "rulesForFile":
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
function mapStateToProps(state) {
    let path = "";
    try {
        path = state["projectHierarchy"]["properties"]["canonicalPath"];
    } catch (e) {
    }
    let props = {
        tags: state.tagTable,
        currentHash: state.currentHash,
        ws: state.ws,
        ignoreFileChange: state.ignoreFileChange,
        projectPath: path
    };

    switch (state.currentHash[0]) {
        case "tag":
            props["tag"] = state.tagTable.filter((d) => d["tagName"] === state.currentHash[1])[0]; // can throw errors
            props["title"] = state.currentHash[1];
            props["content"] = props["tag"]["detail"];
            break;
        case "rule":
            props["title"] = state.currentHash[1];
            props["content"] = "";
            break;
        case "rules":
            props["title"] = "All Rules";
            props["content"] = "";
            break;
        case "tagJsonChanged":
            props["title"] = "tagJson.txt is changed.";
            props["content"] = "";
            break;
        case "ruleJsonChanged":
            props["title"] = "ruleJson.txt is changed.";
            props["content"] = "";
            break;
        case "hierarchy":
            props["title"] = "Project Hierarchy";
            props["content"] = "";
            break;
        case "index":
            props["title"] = "Active Documentation";
            props["content"] = "";
            break;
        case "genRule":
            props["title"] = "New Rule";
            props["content"] = "";
            break;
        case "violatedRules":
            props["title"] = "Violated Rules";
            props["content"] = "";
            break;
        case "rulesForFile":
            props["title"] = "";
            props["content"] = state.openFilePath;
            break;
        case "codeChanged":
            props["title"] = "Code changed in";
            props["content"] = state.openFilePath;
            break;
        case "minedRules":
            props["title"] = "Mining Rules";
            props["content"] = "";
            break;
        case "featureSelection":
            props["title"] = "Feature Selection";
            props["content"] = "";
            break;
        default:
            props["title"] = "";
            props["content"] = "Error no page is found for: " + state.currentHash[0];
            break;
    }

    return props;

}

function mapDispatchToProps(dispatch) {
    return {
        onUpdateTag: (props, newValue) => {
            if (newValue !== props["tag"]["detail"]) {
                props["tags"].filter((d) => d["tagName"] === props["currentHash"][1])[0]["detail"] = newValue; // can throw errors
                Utilities.sendToServer(props["ws"], "MODIFIED_TAG", props["tag"]);
                dispatch(updateTagTable(props["tags"]));
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderBar);