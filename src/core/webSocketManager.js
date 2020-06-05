/**
 * Created by saharmehrpour on 9/5/17.
 */

import {Component} from "react";
import {connect} from "react-redux";

import {
    receiveExpressionStatementXML, ignoreFileChange, updateFilePath, updateRuleTable, updateTagTable,
    updateWS, updateXmlFiles, updateProjectHierarchyData, updatedMinedRules, updateFeatureSelection,
    updateDangerousMinedRules, updateProjectPath
} from "../actions";
import {checkRulesForAll, checkRulesForFile, runRulesByTypes} from "./ruleExecutor";
import {parseGrouping} from "../miningRulesCore/parseGrouping";
import {getXpathForFeature} from "../miningRulesCore/findingFeature";
import {dangerousParseMetaDataFile} from "../miningRulesCore/miningRules";
import {webSocketReceiveMessage} from "./coreConstants";

class WebSocketManager extends Component {

    constructor(props) {
        super(props);

        let xml = []; // [{filePath: "", xml: ""}]
        let ruleTable = [];
        let tagTable = [];
        let ws = new WebSocket("ws://localhost:8887");
        let projectPath = "";

        this.props.onUpdateWS(ws);

        ws.onopen = function () {};

        if (!window.WebSocket) {
            alert("FATAL: WebSocket not natively supported. This demo will not work!");
        }

        ws.onmessage = (e) => {

            let message = JSON.parse(e.data);

            // if (message.command !== "XML") console.log(message);

            switch (message.command) {

                case webSocketReceiveMessage.xml_files_msg:
                    // data: {filePath: "", xml: ""}
                    xml.push(message.data);
                    break;

                case webSocketReceiveMessage.rule_table_msg:
                    // data: [ruleTable]
                    ruleTable = JSON.parse(message.data);
                    this.props.onUpdateXmlFiles(xml);
                    break;

                case webSocketReceiveMessage.tag_table_msg:
                    // data: [tagTable]
                    tagTable = JSON.parse(message.data);
                    this.props.onUpdateTagTable(tagTable);
                    break;

                case webSocketReceiveMessage.project_hierarchy_msg:
                    // data: {projectHierarchy}
                    this.props.onProjectHierarchy(message.data);
                    break;

                case webSocketReceiveMessage.project_path_msg:
                    // data: projectPath
                    projectPath = message.data;
                    this.props.onProjectPathUpdate(projectPath);
                    break;

                case webSocketReceiveMessage.verify_rules_msg:
                    // data: ""
                    ruleTable = checkRulesForAll(xml, ruleTable);
                    this.props.onUpdateRuleTable(ruleTable);
                    break;

                case webSocketReceiveMessage.update_xml_file_msg:
                    // data: {filePath: "", xml: ""}
                    let filteredXML = xml.filter((d) => d.filePath === message.data["filePath"]);
                    if (filteredXML.length === 0)
                        xml.push({"filePath": message.data["filePath"], "xml": message.data["xml"]});
                    else
                        filteredXML[0].xml = message.data["xml"];
                    this.props.onUpdateXmlFiles(xml);
                    break;

                case webSocketReceiveMessage.check_rules_for_file_msg:
                    // data: "filePath"
                    let filePath = message.data;
                    ruleTable = checkRulesForFile(xml, ruleTable, filePath);
                    this.props.onFilePathChange(filePath.replace(projectPath, ""));
                    this.props.onUpdateRuleTable(ruleTable);
                    window.location.hash = "#/codeChanged";
                    break;

                case webSocketReceiveMessage.update_tag_msg:
                    // data: {tagID: longNumber, tagInfo: {...}}
                    let newTag = message.data["tagInfo"];
                    let filteredTag = tagTable.filter((d) => d.tagName === newTag["tagName"]);
                    if (filteredTag.length === 0)
                        tagTable.push(newTag);
                    else
                        tagTable.filter((d) => d.tagName === newTag["tagName"])[0].detail = newTag["detail"];
                    window.location.hash = "#/tag/" + newTag["tagName"];

                    break;
                case webSocketReceiveMessage.failed_update_tag_msg:
                    // data: {tagID: longNumber, tagInfo: {...}}
                    break;

                case webSocketReceiveMessage.update_rule_msg: console.log(message.data);
                    // data: {ruleID: longNumber, ruleInfo: {...}}
                    let updatedRule = message.data["ruleInfo"];
                    try {
                        let ruleIndex = -1;
                        ruleTable.forEach((d, i) => +d.index === +updatedRule.index ? ruleIndex = i : "");
                        ruleTable[ruleIndex] = runRulesByTypes(xml, updatedRule);
                        this.props.onUpdateRuleTable(ruleTable);
                    } catch (e) {
                        console.log(e);
                    }
                    break;

                case webSocketReceiveMessage.failed_update_rule_msg:
                    // data: {ruleID: longNumber, ruleInfo: {...}}
                    break;

                case webSocketReceiveMessage.xml_from_code_msg:
                    // data: {xmlText: "", messageID: ""}
                    this.props.onReceiveExprStmtXML(message.data);
                    break;

                case webSocketReceiveMessage.new_rule_msg:
                    // data: {ruleID: longNumber, rule: {...}}
                    let newAddedRule = JSON.parse(message.data["rule"]);
                    ruleTable.push(newAddedRule);
                    // received by RuleExecutor
                    ruleTable[ruleTable.length - 1] = runRulesByTypes(xml, newAddedRule);
                    this.props.onUpdateRuleTable(ruleTable);
                    break;

                case webSocketReceiveMessage.failed_new_rule_msg:
                    // data: {ruleID: longNumber, rule: {...}}
                    break;

                case webSocketReceiveMessage.new_tag_msg:
                    // data: {tagID: longNumber, tag: {...}}
                    let newAddedTag = JSON.parse(message.data["tag"]);
                    tagTable.push(newAddedTag);
                    this.props.onUpdateTagTable(tagTable);
                    break;

                case webSocketReceiveMessage.failed_new_tag_msg:
                    // data: {tagID: longNumber, tag: {...}}
                    break;

                case webSocketReceiveMessage.file_change_in_ide_msg:
                    // data: "filePath"
                    let focusedFilePath = message.data.replace(projectPath, "");
                    if (!this.props.ignoreFileChange) {
                        this.props.onFilePathChange(focusedFilePath);
                        window.location.hash = "#/rulesForFile/" + focusedFilePath.replace(/\//g, "%2F");
                    } else
                        this.props.onFalsifyIgnoreFile();
                    break;

                    /* Mining Rules */

                case webSocketReceiveMessage.tnr_output_msg:
                    console.log(message.data);
                    break;

                case webSocketReceiveMessage.fp_max_output_msg:
                    // message.data = {"fpMaxOutput" : {0: "content of output0", ...}}
                    let modifiedOutput = parseGrouping(Object.values(message.data["fpMaxOutput"]), this.props.minedRuleMetaData);
                    this.props.onUpdateMinedRules(modifiedOutput);
                    break;

                case webSocketReceiveMessage.feature_selection_msg:
                    console.log(message.data);
                    let selected = xml.filter(d => d.filePath === message.data["path"]);
                    if (selected.length > 0) {
                        //  {{xpath: string, selectedText: string, idMap, displayTextArray: Array}}
                        let textXpathData = getXpathForFeature(selected[0].xml, message.data["startOffset"], message.data["endOffset"]);
                        window.location.hash = "#/featureSelection";

                        // filePath, startOffset, endOffset, startLineOffset, lineNumber, lineText, selectedText,
                        //         xpath, modifiedSelectedText, idMap, displayTextArray
                        this.props.onUpdateFeatureSelection({
                            ...message.data,
                            filePath: message.data["path"],
                            selectedText: message.data["text"],

                            xpath: textXpathData.xpath,
                            modifiedSelectedText: textXpathData.selectedText,
                            idMap: textXpathData.idMap,
                            displayTextArray: textXpathData.displayTextArray
                        });
                    }
                    break;

                // dangerously read output files and meta data.
                case webSocketReceiveMessage.dangerous_read_mined_rules_msg:
                    let metaData = dangerousParseMetaDataFile(JSON.parse(message.data["metaData"]));
                    let outputFiles = Object.values(JSON.parse(JSON.parse(message.data["outputFiles"])));
                    let output = parseGrouping(outputFiles, metaData);
                    this.props.onUpdateDangerousMinedRules(metaData, output);
                    break;

                default:
            }
        };
    }

    render() {
        return null;
    }

}


// map state to props
function mapStateToProps(state) {
    return {
        ignoreFileChange: state.ignoreFileChange,

        minedRuleMetaData: state.minedRulesState.metaData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onUpdateWS: (ws) => dispatch(updateWS(ws)),
        onProjectHierarchy: (hierarchyData) => dispatch(updateProjectHierarchyData(hierarchyData)),
        onProjectPathUpdate: (projectPath) => dispatch(updateProjectPath(projectPath)),
        onUpdateRuleTable: (ruleTable) => dispatch(updateRuleTable(ruleTable)),
        onUpdateTagTable: (tagTable) => dispatch(updateTagTable(tagTable)),
        onFilePathChange: (filePath) => dispatch(updateFilePath(filePath)),
        onFalsifyIgnoreFile: () => dispatch(ignoreFileChange(false)),
        onReceiveExprStmtXML: (data) => dispatch(receiveExpressionStatementXML(data)),
        onUpdateXmlFiles: (xmlFiles) => dispatch(updateXmlFiles(xmlFiles)),

        onUpdateMinedRules: (modifiedOutput) => dispatch(updatedMinedRules(modifiedOutput)),
        onUpdateFeatureSelection: (dataObject) => dispatch(updateFeatureSelection(dataObject)),
        onUpdateDangerousMinedRules: (metaData, minedRules) => dispatch(updateDangerousMinedRules(metaData, minedRules))
    }
}

/**
 * Factory method to create a new WebSocketManager instance
 * @returns {WebSocketManager}
 */
export default connect(mapStateToProps, mapDispatchToProps)(WebSocketManager);
