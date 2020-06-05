/**
 * Created by saharmehrpour on 12/29/17.
 */

import React, {Component} from "react";
import "../../App.css";
import {connect} from "react-redux";
import {ButtonToolbar, Button} from "react-bootstrap";

import {computeXPath} from "../../miningRulesCore/findingFeature";
import {updateResetFeatureSelection, updateSaveFeatureSelection} from "../../actions";

class FeatureSelection extends Component {

    constructor(props) {
        super(props);

        this.state = {
            editMode: false,

            // computed
            startModifiedSelectionIndex: 0,
            startSelectionIndex: 0,
            endSelectionIndex: 0,
            endModifiedSelectionIndex: 0,
            mappedText: [],

            // received from webSocket
            filePath: "",
            wholeText: "",
            selectedText: "",

            // computed
            xpath: ""
        }
    }

    render() {
        return (
            <div className={"featureSelection"}>
                <p>{this.state.filePath.replace(this.props.projectPath.slice, "")
                    .replace(this.props.projectPath.slice(1), "")}</p>
                {this.state.editMode ? this.renderEditableFeature() : this.renderHighlightedText()}
                <p>{this.state.xpath}</p>
                <ButtonToolbar>
                    <Button onClick={() => this.saveFeature()}>Save</Button>
                    <Button onClick={() => this.resetFeature()}>Cancel</Button>
                </ButtonToolbar>
            </div>
        )
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.message === "UPDATE_FEATURE_SELECTION") {

            let startModifiedSelectionIndex = nextProps.wholeText.indexOf(nextProps.modifiedSelectedText);
            let startSelectionIndex = nextProps.wholeText.indexOf(nextProps.selectedText);
            let endSelectionIndex = startSelectionIndex + nextProps.selectedText.length;
            let endModifiedSelectionIndex = startModifiedSelectionIndex + nextProps.modifiedSelectedText.length;

            let indexCount = 0;
            let mapIndex = 0;
            let mappedText = nextProps.wholeText
                .split(/([ \t\n();{}.])/)
                .map(word => {
                    let label = "", id = "n";
                    if (indexCount < startModifiedSelectionIndex) label = "";
                    else if (indexCount < startSelectionIndex) {
                        label = "highlightModifiedSelection";
                        if (nextProps.displayTextArray.length > mapIndex && nextProps.displayTextArray[mapIndex].text === word) {
                            id = nextProps.displayTextArray[mapIndex].id;
                            mapIndex++;
                        }
                    } else if (indexCount <= endSelectionIndex) {
                        label = "highlightSelection";
                        if (nextProps.displayTextArray.length > mapIndex && nextProps.displayTextArray[mapIndex].text === word) {
                            id = nextProps.displayTextArray[mapIndex].id;
                            mapIndex++;
                        }
                    } else if (indexCount <= endModifiedSelectionIndex) {
                        label = "highlightModifiedSelection";
                        if (nextProps.displayTextArray.length > mapIndex && nextProps.displayTextArray[mapIndex].text === word) {
                            id = nextProps.displayTextArray[mapIndex].id;
                            mapIndex++;
                        }
                    }
                    indexCount += word.length;
                    return {
                        text: word,
                        className: label,
                        id: id
                    }
                });
            
            this.setState({
                startModifiedSelectionIndex,
                startSelectionIndex,
                endSelectionIndex,
                endModifiedSelectionIndex,
                mappedText,

                filePath: nextProps.filePath,
                wholeText: nextProps.wholeText,
                selectedText: nextProps.selectedText,

                xpath: nextProps.xpath,
                editMode: false
            })
        }
    }

    renderHighlightedText() {
        return (
            <div onClick={()=>this.setState({editMode: true})}>
                <pre>
                    {this.state.wholeText.substring(0, this.state.startModifiedSelectionIndex)}
                    <span className={"highlightModifiedSelection"}>
                        {this.state.wholeText.substring(this.state.startModifiedSelectionIndex, this.state.startSelectionIndex)}
                        <span className={"highlightSelection"}>{this.state.selectedText}</span>
                        {this.state.wholeText.substring(this.state.endSelectionIndex, this.state.endModifiedSelectionIndex)}
                    </span>
                    {this.state.wholeText.substring(this.state.endModifiedSelectionIndex)}
                </pre>
            </div>
        );
    }

    renderEditableFeature() {

        return (
            <div>
                <pre>
                {this.state.mappedText.map((word, i) => (
                    <span className={"selectedTextEnv" + (word.id !== "n" ? " editableText" : "")} key={i}>
                        {word.id !== "n" ? (
                            <input type={"text"} value={word.text} style={{width: (word.text.length * 8 + 8) + "px"}}
                                   className={"inputText"}
                                   onChange={(e) => {
                                       let newMappedText = this.state.mappedText;
                                       newMappedText[i].text = e.target.value;
                                       this.setState({mappedText: newMappedText})
                                   }}
                                   onBlur={() => {
                                       // update the idMap
                                       let newIdMap = this.props.idMap;
                                       newIdMap[word.id].text = word.text;
                                       //  calculate the XPath
                                       this.setState({xpath: computeXPath(newIdMap)});
                                   }}
                            />
                        ) : word.text
                        }
                    </span>
                ))}
                </pre>
            </div>
        );

    }

    resetFeature() {
        this.setState({
            editMode: false,
            startModifiedSelectionIndex: 0,
            startSelectionIndex: 0,
            endSelectionIndex: 0,
            endModifiedSelectionIndex: 0,
            mappedText: [],
            filePath: "",
            wholeText: "",
            selectedText: "",
            xpath: ""
        });
        this.props.resetFeatureSelection();
        window.location.hash = "#/index";
    }

    saveFeature() {
        let featureDesc = this.state.mappedText
            .map(d => d.text.trim())
            .filter(d => d!=="")
            .join("");
        this.props.saveFeatureSelection(featureDesc, this.state.xpath);
        window.location.hash = "#/minedRules";
    }

}

function mapStateToProps(state) {
    return {
        message: state.message,
        filePath: state.featureSelection.filePath,
        startOffset: state.featureSelection.startOffset,
        endOffset: state.featureSelection.endOffset,
        startLineOffset: state.featureSelection.startLineOffset,
        lineNumber: state.featureSelection.lineNumber,
        wholeText: state.featureSelection.lineText,
        selectedText: state.featureSelection.selectedText,
        xpath: state.featureSelection.xpath,
        modifiedSelectedText: state.featureSelection.modifiedSelectedText,
        idMap: state.featureSelection.idMap,
        displayTextArray: state.featureSelection.displayTextArray,
        projectPath: state.projectPath
    }
}

function mapDispatchToProps(dispatch) {
    return {
        resetFeatureSelection: () => dispatch(updateResetFeatureSelection()),
        saveFeatureSelection: (featureDescription, featureXpath) => dispatch(updateSaveFeatureSelection(featureDescription, featureXpath))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeatureSelection);