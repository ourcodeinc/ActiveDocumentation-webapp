/**
 * Created by saharmehrpour on 9/7/17.
 */


import React, {Component} from 'react';
import '../App.css';
import Utilities from '../core/utilities';

import * as d3 from 'd3';
import {FormControl} from 'react-bootstrap';
import {connect} from "react-redux";
import {updateTagTable} from "../actions";


export class HeaderBar extends Component {

    render() {
        return (
            <div style={{paddingBottom: "30px"}} id="headerBar">
                <div className="headerDiv">
                    {this.renderHeader()}
                </div>
            </div>
        )
    }


    renderHeader() {
        switch (this.props.hash[0]) {
            case 'tag':
                return (
                    <div>
                        <span className="text-16 primary">Rules related to tag: </span><br/>
                        <span className="text-24 important">{this.props.title}</span>
                        <FormControl componentClass="textarea" defaultValue={this.props.content}
                                     onBlur={(e) => this.props.onUpdateTag(this.props, e.target.value)} key={new Date()}
                                     placeholder="Information about tag"/>
                    </div>
                );
            case 'rule':
                return (
                    <div>
                        <span className="text-16 primary">Rule Index: </span>
                        <span
                            className="text-24 important">{this.props.title.replace("/Users/saharmehrpour/Documents/Workspace/", "")}</span>
                    </div>
                );
            case 'codeChanged':
                return (
                    <div>
                        <span className="text-16 primary">Code Changed in File:</span><br/>
                        <span
                            className="text-24 important">{this.props.content.replace("/Users/saharmehrpour/Documents/Workspace/", "")}</span>
                    </div>
                );
            case 'ruleChanged':
                return (
                    <div>
                        <h3>Rule {this.props.title} is changed.</h3>
                    </div>
                );
            case 'genRule':
                return (
                    <div>
                        <h3>{this.props.title}</h3>
                    </div>
                );
            case 'rulesForFile':
                return (
                    <div>
                        <span className="text-16 primary">Rules applicable for File:</span><br/>
                        <span
                            className="text-24 important">{this.props.content.replace("/Users/saharmehrpour/Documents/Workspace/", "")}</span>
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


    /**
     * update the length of a text area to remove scroll
     */
    updateTextareaLength() {
        d3.select("#headerBar").selectAll("textarea")
            .each(function () {
                let el = this;
                el.style.cssText = 'height:0';
                el.style.cssText = 'overflow:hidden;height:' + el.scrollHeight + 'px';
            });
    }
}

// map state to props
function mapStateToProps(state) {

    let props = {
        tags: state["tagTable"],
        hash: state["hash"],
        ws: state["ws"],
        ignoreFile: state["ignoreFile"]
    };

    switch (state["hash"][0]) {
        case 'tag':
            props["tag"] = state["tagTable"].filter((d) => d['tagName'] === state["hash"][1])[0]; // can throw errors
            props["title"] = state["hash"][1];
            props["content"] = props["tag"]["detail"];
            break;
        case 'rule':
            props["title"] = state["hash"][1];
            props["content"] = "";
            break;
        case 'rules':
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
            props["content"] = state["filePath"];
            break;
        case "codeChanged":
            props["title"] = "Code changed in";
            props["content"] = state["filePath"];
            break;
        default:
            props["title"] = "";
            props["content"] = "Error no page is found for: " + state["hash"][0];
            break;
    }

    return props;

}

function mapDispatchToProps(dispatch) {
    return {
        onUpdateTag: (props, newValue) => {
            if (newValue !== props["tag"]["detail"]) {
                props["tags"].filter((d) => d["tagName"] === props["hash"][1])[0]["detail"] = newValue; // can throw errors
                Utilities.sendToServer(props["ws"], "MODIFIED_TAG", props["tag"]);
                dispatch(updateTagTable(props["tags"]));
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderBar);