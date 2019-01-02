/**
 * Created by saharmehrpour on 9/5/17.
 */

import {Component} from 'react';
import {connect} from "react-redux";

import {
    receiveExpressionStatementXML, ignoreFile, updateFilePath, updateRuleTable, updateTagTable,
    updateWS
} from "../actions";
import {checkRulesForAll, checkRulesForFile, runRulesByTypes} from './ruleExecutor';

class WebSocketManager extends Component {

    constructor(props) {
        super(props);


        let xml = []; // object of `filePath` and `xml`
        let ruleTable = []; // retrieved from ruleJson.txt
        let tagTable = []; // retrieved from tagJson.txt
        let ws = new WebSocket("ws://localhost:8887");
        let filtered;

        // PubSub.publish('NEW_WS', [ws]);
        this.props.onUpdateWS(ws);

        ws.onopen = function () {
            // PubSub.publish('NEW_CONNECTION', []);
        };


        if (!window.WebSocket) {
            alert("FATAL: WebSocket not natively supported. This demo will not work!");
        }

        ws.onmessage = (e) => {

            let message = JSON.parse(e.data);

            // if (message.command !== 'XML')
            //     console.log(message);

            switch (message.command) {

                // send initially on open
                case "XML":
                    xml.push(message.data);
                    break;

                // send initially on open, when the ruleJson.txt is changed, followed by VERIFY_RULES
                case "RULE_TABLE":
                    ruleTable = JSON.parse(message.data);
                    break;

                // send initially on open, when the tagJson.txt is changed, followed by VERIFY_RULES
                case "TAG_TABLE":
                    tagTable = JSON.parse(message.data);
                    this.props.onUpdateTagTable(tagTable);
                    break;

                case "PROJECT_HIERARCHY":
                    // received by projectHierarchy
                    this.props.onProjectHierarchy(message.data);
                    break;

                case "VERIFY_RULES":
                    // received by RuleExecutor
                    ruleTable = checkRulesForAll(xml, ruleTable);
                    this.props.onUpdateRuleTable(ruleTable);
                    break;

                // followed by CHECK_RULES_FOR_FILE
                case "UPDATE_XML":
                    filtered = xml.filter((d) => d.filePath === message.data['filePath']);
                    if (filtered.length === 0)
                        xml.push({'filePath': message.data['filePath'], 'xml': message.data['xml']});
                    else
                        filtered[0].xml = message.data['xml'];
                    break;

                // when the code changes, after UPDATE_XML
                case "CHECK_RULES_FOR_FILE":
                    let filePath = message.data;
                    // received by RuleExecutor
                    ruleTable = checkRulesForFile(xml, ruleTable, filePath);
                    this.props.onFilePathChange(filePath.replace('/Users/saharmehrpour/Documents/Workspace/', ''));
                    this.props.onUpdateRuleTable(ruleTable);
                    window.location.hash = "#/codeChanged";
                    break;

                // tagName and tag
                case "UPDATE_TAG":
                    let newTag = JSON.parse(message.data);
                    filtered = tagTable.filter((d) => d.tagName === newTag['tagName']);
                    if (filtered.length === 0)
                        tagTable.push(newTag);
                    else
                        tagTable.filter((d) => d.tagName === newTag['tagName'])[0].detail = newTag['detail'];
                    window.location.hash = "#/tag/" + newTag['tagName'];

                    break;

                // Followed after sending MODIFIED_RULE
                // ruleIndex and rule
                case "UPDATE_RULE":
                    let updatedRule = JSON.parse(message.data['rule']);
                    try {
                        let ruleIndex = -1;
                        ruleTable.forEach((d, i) => +d.index === +updatedRule.index ? ruleIndex = i : "");
                        ruleTable[ruleIndex] = runRulesByTypes(xml, updatedRule);
                        this.props.onUpdateRuleTable(ruleTable);
                    }
                    catch (e) {
                        console.log(e);
                    }
                    break;

                // when the tagJson.txt changes, after TAG_TABLE
                case "UPDATE_TAG_TABLE":
                    this.props.onUpdateTagTable(tagTable);
                    window.location.hash = "#/tagJsonChanged";
                    break;

                // when the ruleJson.txt changes, after RULE_TABLE
                case "UPDATE_RULE_TABLE":
                    window.location.hash = "#/ruleJsonChanged";
                    break;

                // after sending a piece of code EXPR_STMT
                case "EXPR_STMT_XML":
                    this.props.onReceiveExprStmtXML(message.data); // {xmlText: "", messageID: ""}
                    break;

                case "NEW_RULE":
                    let newAddedRule = JSON.parse(message.data['rule']);
                    ruleTable.push(newAddedRule);
                    // received by RuleExecutor
                    ruleTable[ruleTable.length - 1] = runRulesByTypes(xml, newAddedRule);
                    this.props.onUpdateRuleTable(ruleTable);
                    break;


                case "NEW_TAG":
                    let newAddedTag = JSON.parse(message.data['tag']);
                    tagTable.push(newAddedTag);
                    this.props.onUpdateTagTable(tagTable);
                    break;

                // after sending a piece of code DECL_STMT
                case "SHOW_RULES_FOR_FILE":
                    let focusedFilePath = message.data.replace('/Users/saharmehrpour/Documents/Workspace/', '');
                    if (!this.props.ignoreFile) {
                        this.props.onFilePathChange(focusedFilePath);
                        window.location.hash = "#/rulesForFile/" + focusedFilePath.replace(/\//g, '%2F');
                    }
                    else
                        this.props.onFalsifyIgnoreFile();

                    break;

                case "PROJECT":
                    // console.log(message);
                    break;

                case "ENTER":
                case "LEFT":
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
        ignoreFile: state.ignoreFile,
        message: state.message
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onUpdateWS: (ws) => {
            dispatch(updateWS(ws));
        },
        onProjectHierarchy: (hierarchyData) => {

        },
        onUpdateRuleTable: (ruleTable) => {
            dispatch(updateRuleTable(ruleTable));
        },
        onUpdateTagTable: (tagTable) => {
            dispatch(updateTagTable(tagTable));
        },
        onFilePathChange: (filePath) => {
            dispatch(updateFilePath(filePath));
        },
        onFalsifyIgnoreFile: () => {
            dispatch(ignoreFile(false))
        },
        onReceiveExprStmtXML: (data) => {
            dispatch(receiveExpressionStatementXML(data))
        }
    }
}

/**
 * Factory method to create a new WebSocketManager instance
 * @returns {WebSocketManager}
 */
export default connect(mapStateToProps, mapDispatchToProps)(WebSocketManager);
