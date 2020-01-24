/**
* Created by saharmehrpour on 12/29/17.
*/

import React, {Component} from "react";
import "../App.css";
import {connect} from "react-redux";

class FeatureSelection extends Component {

    render () { console.log(this.props);
        return (
            <div>
                <p>{this.props.filePath.replace(this.props.projectPath.slice, "")
                    .replace(this.props.projectPath.slice(1), "")}</p>
                <p>starting offset: {this.props.startOffset}</p>
                <p>ending offset: {this.props.endOffset}</p>
                <p>{this.props.lineText}</p>
                <p>{this.props.xpath}</p>
                <p>{this.props.selectedText}</p>
            </div>
        )
    }

}

function mapStateToProps(state) {
    // copied from headerBar.js
    let path = "";
    try {
        path = state["projectHierarchy"]["properties"]["canonicalPath"];
    } catch (e) {
    }
    return {
        message: state.message,
        filePath: state.featureSelection.filePath,
        startOffset: state.featureSelection.startOffset,
        endOffset: state.featureSelection.endOffset,
        startLineOffset: state.featureSelection.startLineOffset,
        lineNumber: state.featureSelection.lineNumber,
        lineText: state.featureSelection.lineText,
        xpath: state.featureSelection.xpath,
        selectedText: state.featureSelection.selectedText,
        idMap: state.featureSelection.idMap,
        displayTextArray: state.featureSelection.displayTextArray,
        projectPath: path
    }
}


export default connect(mapStateToProps, null)(FeatureSelection);