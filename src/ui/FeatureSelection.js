/**
* Created by saharmehrpour on 12/29/17.
*/

import React, {Component} from "react";
import "../App.css";
import {connect} from "react-redux";

class FeatureSelection extends Component {

    render () {
        return (
            <div>
                <p>{this.props.filePath.replace(this.props.projectPath.slice, "")
                    .replace(this.props.projectPath.slice(1), "")}</p>
                <p>starting offset: {this.props.startIndex}</p>
                <p>ending offset: {this.props.endIndex}</p>
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
        startIndex: state.featureSelection.startIndex,
        endIndex: state.featureSelection.endIndex,
        xpath: state.featureSelection.xpath,
        selectedText: state.featureSelection.selectedText,
        projectPath: path
    }
}

// function mapDispatchToProps(dispatch) {
//     return {
//     }
// }


export default connect(mapStateToProps, null)(FeatureSelection);