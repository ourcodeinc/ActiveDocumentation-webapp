/**
 * Created by saharmehrpour on 9/5/17.
 */

import {Component} from "react";
import {connect} from "react-redux";

import {
    receiveExpressionStatementXML,
    ignoreFileChange, updateFilePath,
    updateRuleTable, updateTagTable,
    updateWS, updateXmlFiles,
    updateProjectHierarchyData, updatedMinedRules, updateProjectPath,
    updateLoadingGif, updateFocusedElementData, updateDoiInformation, requestMineRulesForElement
} from "../actions";
import {checkRulesForAll, checkRulesForFile, runRulesByTypes} from "./ruleExecutor";
import {webSocketReceiveMessage} from "./coreConstants";
import {processReceivedFrequentItemSets} from "../miningRulesCore/postProcessing";
import {getDataForFocusedElement, processDoiInformation} from "../miningRulesCore/focusedElementProcessing";
import Utilities from "./utilities";
import {hashConst} from "../ui/uiConstants";

class WebSocketManager extends Component {

    constructor(props) {
        super(props);

        let xmlData = []; // [{filePath: "", xml: ""}]
        let ruleTable = [];
        let tagTable = [];
        let ws = new WebSocket("ws://localhost:8887");
        let projectPath = "";
        let counter = 3;

        this.props.onUpdateWS(ws);

        ws.onopen = function () {};

        if (!window.WebSocket) {
            alert("FATAL: WebSocket not natively supported. This demo will not work!");
        }

        ws.onmessage = async (e) => {

            let message = Utilities.parseJson(e.data, "the received message", {command: ""});

            // if (message.command !== "XML") console.log(message);

            switch (message.command) {

                case webSocketReceiveMessage.enter_chat_msg:
                    this.props.onLoadingGif(true);
                    break;

                case webSocketReceiveMessage.project_path_msg:
                    // data: projectPath
                    projectPath = message.data;
                    this.props.onProjectPathUpdate(projectPath);
                    break;

                case webSocketReceiveMessage.project_hierarchy_msg:
                    // data: {projectHierarchy}
                    this.props.onProjectHierarchy(message.data);
                    break;

                case webSocketReceiveMessage.xml_files_msg:
                    // data: {filePath: "", xml: ""}
                    xmlData.push(message.data);
                    break;

                case webSocketReceiveMessage.rule_table_msg:
                    // data: [ruleTable]
                    ruleTable = Utilities.parseJson(message.data, "ruleTable", []);
                    this.props.onUpdateXmlFiles(xmlData);
                    break;

                case webSocketReceiveMessage.tag_table_msg:
                    // data: [tagTable]
                    tagTable = Utilities.parseJson(message.data, "tagTable", []);
                    this.props.onUpdateTagTable(tagTable);
                    break;

                case webSocketReceiveMessage.verify_rules_msg:
                    // data: ""
                    ruleTable = checkRulesForAll(xmlData, ruleTable);
                    this.props.onUpdateRuleTable(ruleTable);
                    break;

                case webSocketReceiveMessage.update_xml_file_msg:
                    // data: {filePath: "", xml: ""}
                    let filteredXML = xmlData.filter((d) => d.filePath === message.data["filePath"]);
                    if (filteredXML.length === 0)
                        xmlData.push({"filePath": message.data["filePath"], "xml": message.data["xml"]});
                    else
                        filteredXML[0].xml = message.data["xml"];
                    this.props.onUpdateXmlFiles(xmlData);
                    break;

                case webSocketReceiveMessage.check_rules_for_file_msg:
                    // data: "filePath"
                    let filePath = message.data;
                    ruleTable = checkRulesForFile(xmlData, ruleTable, filePath);
                    this.props.onFilePathChange(filePath);
                    this.props.onUpdateRuleTable(ruleTable);
                    window.location.hash = `#/${hashConst.codeChanged}`;
                    break;

                case webSocketReceiveMessage.update_tag_msg:
                    // data: {tagID: longNumber, tagInfo: {...}}
                    let newTag = message.data["tagInfo"];
                    let filteredTag = tagTable.filter((d) => d.tagName === newTag["tagName"]);
                    if (filteredTag.length === 0)
                        tagTable.push(newTag);
                    else
                        tagTable.filter((d) => d.tagName === newTag["tagName"])[0].detail = newTag["detail"];
                    window.location.hash = `#/${hashConst.tag}/` + data["tagID"];

                    break;
                case webSocketReceiveMessage.failed_update_tag_msg:
                    // data: {tagID: longNumber, tagInfo: {...}}
                    break;

                case webSocketReceiveMessage.update_rule_msg:
                    // data: {ruleID: longNumber, ruleInfo: {...}}
                    let updatedRule = message.data["ruleInfo"];
                    try {
                        let ruleIndex = -1;
                        ruleTable.forEach((d, i) => +d.index === +updatedRule.index ? ruleIndex = i : "");
                        ruleTable[ruleIndex] = runRulesByTypes(xmlData, updatedRule);
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
                    // data: {ruleID: longNumber, ruleInfo: {...}}
                    let newAddedRule = message.data["ruleInfo"];
                    ruleTable.push(newAddedRule);
                    // received by RuleExecutor
                    ruleTable[ruleTable.length - 1] = runRulesByTypes(xmlData, newAddedRule);
                    this.props.onUpdateRuleTable(ruleTable);
                    break;

                case webSocketReceiveMessage.failed_new_rule_msg:
                    // data: {ruleID: longNumber, rule: {...}}
                    break;

                case webSocketReceiveMessage.new_tag_msg:
                    // data: {tagID: longNumber, tagInfo: {...}}
                    tagTable.push(message.data["tagInfo"]);
                    this.props.onUpdateTagTable(tagTable);
                    break;

                case webSocketReceiveMessage.failed_new_tag_msg:
                    // data: {tagID: longNumber, tag: {...}}
                    break;

                case webSocketReceiveMessage.file_change_in_ide_msg:
                    // data: "filePath"
                    let focusedFilePath = message.data;
                    if (!this.props.ignoreFileChange) {
                        this.props.onFilePathChange(focusedFilePath);
                        window.location.hash = `#/${hashConst.rulesForFile}/` + focusedFilePath.replace(/\//g, "%2F");
                    } else {
                        counter--;
                        if (counter === 0) {
                            this.props.onFalsifyIgnoreFile();
                            counter = 3;
                        }
                    }
                    break;

                /* Mining Rules */

                case webSocketReceiveMessage.element_info_for_mine_rules:
                    window.location.hash = `#/${hashConst.learnDesignRules}/`;
                    let focusedElementFile = xmlData.filter(d => d.filePath === message.data["filePath"]);
                    if (focusedElementFile.length > 0) {
                        let focusedElementData = getDataForFocusedElement(
                            focusedElementFile[0], message.data["startOffset"]);
                        focusedElementData.filePath = message.data["filePath"].replace(projectPath, "");
                        this.props.onUpdateFocusedElementData(focusedElementData);
                    }
                    break;

                case webSocketReceiveMessage.doi_information:
                    // "recentVisitedFiles", "recentSearches", "recentVisitedElements"
                    let recentVisitedFiles = Utilities.parseJson(message.data["recentVisitedFiles"],
                        "recentVisitedFiles", []);
                    let recentSearchKeywords = Utilities.parseJson(message.data["recentSearches"],
                        "recentSearches", []);
                    let recentVisitedElements = Utilities.parseJson(message.data["recentVisitedElements"],
                        "recentVisitedElements", []);
                    let newDoiInformation = processDoiInformation(recentVisitedFiles, recentSearchKeywords,
                        recentVisitedElements, xmlData, this.props.projectPath);
                    this.props.onUpdateDoiInformation(newDoiInformation);

                    break;

                case webSocketReceiveMessage.request_mine_rules_for_element:
                    window.location.hash = `#/${hashConst.learnDesignRules}/`;
                    this.props.onRequestMineRulesForElement();
                    break;

                case webSocketReceiveMessage.mined_design_rules:
                    // "minedFrequentItemSets", "algorithm"
                    let output = message.data["minedFrequentItemSets"];
                    let algorithm = message.data["algorithm"];
                    processReceivedFrequentItemSets(output, algorithm, this.props.featureMetaData)
                        .then(processedRules => {
                            this.props.onUpdateMinedRules(processedRules);
                        }).catch(e => console.log("error happened in promise", e));
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
        projectPath: state.projectPath,
        featureMetaData: state.minedRulesState.featureMetaData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onLoadingGif: (status) => dispatch(updateLoadingGif(status)),
        onUpdateWS: (ws) => dispatch(updateWS(ws)),
        onProjectHierarchy: (hierarchyData) => dispatch(updateProjectHierarchyData(hierarchyData)),
        onProjectPathUpdate: (projectPath) => dispatch(updateProjectPath(projectPath)),
        onUpdateRuleTable: (ruleTable) => dispatch(updateRuleTable(ruleTable)),
        onUpdateTagTable: (tagTable) => dispatch(updateTagTable(tagTable)),
        onFilePathChange: (filePath) => dispatch(updateFilePath(filePath)),
        onFalsifyIgnoreFile: () => dispatch(ignoreFileChange(false)),
        onReceiveExprStmtXML: (data) => dispatch(receiveExpressionStatementXML(data)),
        onUpdateXmlFiles: (xmlFiles) => dispatch(updateXmlFiles(xmlFiles)),

        onUpdateFocusedElementData: (focusedElementData) => dispatch(updateFocusedElementData(focusedElementData)),
        onUpdateDoiInformation: (doiInformation) => dispatch(updateDoiInformation(doiInformation)),
        onRequestMineRulesForElement: () => dispatch(requestMineRulesForElement()),
        onUpdateMinedRules: (modifiedOutput) => dispatch(updatedMinedRules(modifiedOutput)),
    }
}

/**
 * Factory method to create a new WebSocketManager instance
 * @returns {WebSocketManager}
 */
export default connect(mapStateToProps, mapDispatchToProps)(WebSocketManager);
