/**
 * Created by saharmehrpour.
 * Rendering the page for mining design rules from code.
 * 1. Initially, the tool 'pre-processes' the files to form groupings.
 * The page renders a message to select an element in the IDE.
 * 2. After selecting the element (receiving a message), the tool will extracts the features
 * and renders the summary of features to get approval from the user.
 * 3. After the approval, the tool mines the rules and displays the result.
 */

import React, {Component} from "react";
import "../../App.css";
import {connect} from "react-redux";
import {Button} from "react-bootstrap";
import {FaAngleDoubleLeft, FaAngleDoubleRight, FaCaretDown, FaCaretUp} from "react-icons/fa";
import "rc-slider/assets/index.css";

import {
    updatedMinedRules,
    updateFeatureMetaData,
    updateGroupingMetaData,
    updateSelectedAlgorithm,
    updateSentReceivedMessages
} from "../../actions";
import Utilities from "../../core/utilities";
import {reduxStoreMessages} from "../../reduxStoreConstants";
import {createGroupingMetaData, formGroupings} from "../../miningRulesCore/preProcessing";
import {createFeatureMetaDataMap} from "../../miningRulesCore/extractFeatures";
import {generateFeatures, prepareFilesAndRequestMineRules} from "../../miningRulesCore/processing";
import {featureGroupInformation, focusElementType, identifierKeysInRulePad} from "../../miningRulesCore/featureConfig";
import {createXPath, findFileFoldersForFeatureIds, switchAlgorithm} from "../../miningRulesCore/postProcessing";
import {webSocketSendMessage} from "../../core/coreConstants";
import {runXpathQueryMinedRules} from "../../core/ruleExecutor";
import MinedRulePad from "./minedRulePad";
import Badge from "react-bootstrap/lib/Badge";

class MinedRulesComponent extends Component {

    constructor(props) {
        super(props);

        this.views = {
            default_view: 0,
            loading_view: 1,
            clusters_view: 2,
        }

        this.state = {
            view: this.views.default_view,
            minedRules: [],
            loadingTitle: "Mining Rules",
            message: "",
            cluster: [],

            isExpanded: false,
            expandedFileGroup: "",
            expandedClusterIndex: 0,
        };
        this.messagesToBeSent = []; // the messages that are going to the server to be written on files
        this.clusterLimit = 10; // number of clusters in each category of mined rules.
    }

    render() {
        switch (this.state.view) {
            case this.views.default_view:
                return (
                    <div className={"minedRulesComponent overlayContainer"}>
                        {this.renderDefaultView()}
                    </div>);
            case this.views.loading_view:
                return (
                    <div className={"minedRulesComponent overlayContainer"}>
                        {this.renderLoading()}
                    </div>);
            case this.views.clusters_view:
                return (
                    <div className={"minedRulesComponent overlayContainer"}>
                        <div className={"minedRulesComponent"}>
                            {this.renderFocusedElementInfo()}
                            {this.renderMessages()}
                            {this.renderDescription()}
                            {this.renderClusters()}
                        </div>
                    </div>);
            default:
                return null;
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        switch (nextProps.message) {
            case reduxStoreMessages.update_rule_table_msg:
                this.preProcessGroupings();
                break;

            case reduxStoreMessages.update_focused_element_identifiers:
                if (nextProps.focusedElementData.identifier === "") {
                    this.setState({
                        minedRules: [],
                        identifier: "",
                        view: this.views.default_view,
                    });
                    break;
                }
                this.setState({
                    minedRules: [],
                    loadingTitle: "Processing the codebase",
                    identifier: nextProps.focusedElementData.identifier,
                    view: this.views.loading_view,
                });
                break;

            case reduxStoreMessages.request_mine_rules_for_element_msg:
                if (nextProps.focusedElementData.identifier === "")
                    break;
                this.setState({
                    minedRules: [],
                    loadingTitle: "Mining Rules",
                    view: this.views.loading_view,
                }, this.processFeaturesForSelectedScope);
                break;

            case reduxStoreMessages.update_mined_rules_msg:
                let countRules = nextProps.minedRules.reduce((sum, group) => sum + group.rulePadStates.length, 0);
                if (countRules === 0) {
                    let newAlgorithm = switchAlgorithm(this.props.selectedAlgorithm);
                    if (newAlgorithm) {
                        this.props.onUpdateSelectedAlgorithm(newAlgorithm);
                        console.log("Trying the next algorithm: ", newAlgorithm);
                        let message = {
                            command: webSocketSendMessage.mine_design_rules_msg,
                            data: {parameters: newAlgorithm.parameters, algorithm: newAlgorithm.key}
                        };
                        Utilities.sendToServer(this.props.ws, message.command, message.data);
                    } else {
                        this.setState({
                            minedRules: nextProps.minedRules, // no rule
                            view: this.views.clusters_view,
                            message: "No rule is found.",
                        });
                    }
                } else {
                    let newMinedRules = this.updateRulePadState(nextProps.minedRules);
                    newMinedRules = this.updateCodeSnippets(newMinedRules);
                    this.setState({
                        minedRules: newMinedRules,
                        view: this.views.clusters_view,
                    });
                }
                break;

            case reduxStoreMessages.update_feature_metadata_msg:
                this.setState({
                    featureMetaData: nextProps.featureMetaData
                }, () => this.sendFeaturesForMiningRules());
                break;

            case reduxStoreMessages.send_expr_stmt_xml_msg:
                // keep loading gif if the tool is still waiting to receive messages from srcMl
                this.setState({
                    view: this.views.loading_view,
                    loadingTitle: "Processing the rules",
                });
                break;

            case reduxStoreMessages.receive_expr_stmt_xml_msg:
                let newMinedRules = this.matchSentAndReceivedMessages(nextProps);
                newMinedRules = this.updateCodeSnippets(newMinedRules);
                if (nextProps.sentMessages.length === 1) {
                    this.setState({
                        minedRules: newMinedRules,
                        view: this.views.clusters_view,
                        loadingTitle: "Done.",
                        message: "",
                    });
                } else {
                    this.setState({
                        minedRules: newMinedRules,
                    });
                }
                break;

            default:
                break;

        }
    }

    renderDefaultView() {
        return (
            <div>
                <h4>Pick an element in the IDE, and select <strong>Mine Rules</strong> from the context menu.</h4>
                {this.state.identifier === "" ? (
                        <h4 className={"focusedElementError"}>The focused element should be Class, Field, or Method.</h4>)
                    : null}
            </div>
        )
    }

    renderLoading() {
        return (
            <div className={"overlayLoading"}>
                <div className={"spinnerContainer"}>
                    <div className={"loadingTitle"}>
                        <h3>{this.state.loadingTitle}</h3>
                    </div>
                    <div className={"spinner"}/>
                </div>
            </div>);
    }

    renderFocusedElementInfo() {
        let filePath = "";
        let identifier = "";
        let nodeTitle = "";
        if (this.props.focusedElementData.mapFocusedElementToFeaturesKey !== "") {
            let mapFilter = focusElementType
                .filter(d => d.mapFocusedElementToFeaturesKey ===
                    this.props.focusedElementData.mapFocusedElementToFeaturesKey);
            if (mapFilter.length === 1)
                nodeTitle = mapFilter[0].title;
            filePath = this.props.focusedElementData.filePath;
            identifier = this.props.focusedElementData.identifier;
            return (
                <div style={{marginBottom: "40px"}}>
                    <h5>Potential code patterns for <span>{nodeTitle}</span> <code>{identifier}</code></h5>
                    <h5>{filePath}</h5>
                </div>
            )
        }
    }

    renderMessages() {
        let countRules = this.state.minedRules.reduce((sum, group) => sum + group.rulePadStates.length, 0);
        let nextAlgorithmExist = !!switchAlgorithm(this.props.selectedAlgorithm);
        return (
            <div style={{marginBottom: "40px"}}>
                <h4>{this.state.message}</h4>
                {countRules === 0 || !nextAlgorithmExist ? null : (
                    <span>
                        <span>Not finding what your are looking for? </span>
                        <Button onClick={() => this.tryDifferentAlgorithm()}>Re-run the tool.</Button>
                    </span>
                )}
            </div>
        )
    }

    renderDescription() {
        let countRules = this.state.minedRules.reduce((sum, group) => sum + group.rulePadStates.length, 0);
        if (countRules === 0) return null;
        return (<span>
            <h5>The following code snippets illustrates potential design rules.</h5>
            <h5>The left column denote <strong>when</strong> a design rules applies (If part),
                and the right column denotes <strong>how</strong> the rule is applied</h5>
            <h5>The purple background in the code shows how likely each element is in a design rule.</h5>
            <h5><span className={"frequency-color frequency-10"}>Darker purple</span> means it's more likely to be part of a rule,
                and <span className={"frequency-color frequency-1"}>lighter purple</span> means it is less likely to be part of a rule.
            </h5>
            <h5><span className={"frequency-color frequency-identifier"}>Orange</span> background highlights the identifiers</h5>
        </span>)
    }

    renderClusters() {
        let countRules = this.state.minedRules.reduce((sum, group) => sum + group.rulePadStates.length, 0);
        if (this.state.minedRules.length > 0 && countRules === 0)
            return (
                <div>
                    <h4><strong>No rule is found.</strong></h4>
                </div>)
        let minedRulesArray = this.state.minedRules
            .filter(group => group.rulePadStates.length !== 0)
            .map(group => {
            let title = featureGroupInformation[group.fileGroup].desc;
            let content = this.renderDesignRules(group);
            return {title, content}
        });
        return (<Accordion items={minedRulesArray}/>);
    }

    renderDesignRules(group) {
        let header = featureGroupInformation[group.fileGroup].headers;
        return (
            <div>
                <div>
                    <div className={"groupHeader"}>{header[0]}</div>
                    <div className={"groupHeader"}>{header[1]}</div>
                </div>
                <div className={"generateRuleGui guiBoundingBox minedRuleBoundingBox"}>
                    <div className={"leftColumn"}>
                        {group.rulePadStates
                            .filter((_, clusterIndex) => clusterIndex < this.clusterLimit)
                            .map((rulePadState, clusterIndex) => {
                                let isClusterExpanded = this.state.isExpanded &&
                                    this.state.expandedFileGroup === group.fileGroup &&
                                    this.state.expandedClusterIndex === clusterIndex;
                                let expandedClass = isClusterExpanded ? "expanded" : "";
                                return (<div className={`clusterRule ${expandedClass}`}>
                                        <div className={"clusterParent"}>
                                            <MinedRulePad key={new Date()} rulePadState={rulePadState.parent}
                                                          isCluster={true}
                                                          featureMetaData={this.props.featureMetaData}
                                                          fileGroup={group.fileGroup}
                                                          elementId={featureGroupInformation[group.fileGroup].rootId[0]}/>
                                            {/*{<CodeSnippets codeSnippets={rulePadState.quantifierSnippets}*/}
                                            {/*               ws={this.props.ws}/>}*/}
                                        </div>
                                        <div className={"expandIcons"}>
                                            {isClusterExpanded ?
                                                <FaAngleDoubleLeft size={20}
                                                                   onClick={() => this.setState({isExpanded: false})}/>
                                                :
                                                <FaAngleDoubleRight size={20}
                                                                    onClick={() => this.setState({
                                                                        isExpanded: true,
                                                                        expandedFileGroup: group.fileGroup,
                                                                        expandedClusterIndex: clusterIndex,
                                                                    })}/>}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                    <div className={"rightColumn"}>
                        {!this.state.isExpanded || this.state.expandedFileGroup !== group.fileGroup ||
                        this.state.expandedClusterIndex < 0 || this.state.expandedClusterIndex >= group.rulePadStates.length ?
                            null :
                            group.rulePadStates[this.state.expandedClusterIndex].children
                                .map((child, i) => {
                                        return (
                                            <div className={"clusterRule"}>
                                                <div className={"clusterChild"}>
                                                    <MinedRulePad key={new Date()} rulePadState={child} isCluster={true}
                                                                  featureMetaData={this.props.featureMetaData}
                                                                  fileGroup={group.fileGroup}
                                                                  elementId={featureGroupInformation[group.fileGroup].rootId[1]}/>
                                                    {<CodeSnippets
                                                        codeSnippets={group.rulePadStates[this.state.expandedClusterIndex].constraintsSnippets[i]}
                                                        ws={this.props.ws}/>}
                                                </div>
                                            </div>)
                                    }
                                )
                        }
                    </div>
                </div>
            </div>
        )
    }

    /**
     * Find the groupings
     * Since the method is called after reduxStoreMessages.project_path_msg
     * the projectPath is not updated in the props yet.
     */
    preProcessGroupings() {
        let groupingMetaData = new createGroupingMetaData();
        formGroupings(this.props.xmlFiles, this.props.projectPath, groupingMetaData);
        this.props.onUpdateGroupingMetaData(groupingMetaData);
    }

    /**
     * For a selected element (scope), extract features from relevant file (from initial groupings)
     * populate the feature map and send the info to the server for mining process.
     */
    processFeaturesForSelectedScope() {
        let featureMetaData = createFeatureMetaDataMap();
        this.messagesToBeSent = generateFeatures(this.props.xmlFiles, this.props.projectPath,
            this.props.focusedElementData, this.props.doiInformation, this.props.groupingMetaData, featureMetaData);

        this.setState({}//{loadingStatus: false}
            , () => this.props.onUpdateFeatureMetaData(featureMetaData)
        );
    }

    /**
     * selected features are sent to the server for mining rules
     */
    sendFeaturesForMiningRules() {
        let messages = prepareFilesAndRequestMineRules(this.props.featureMetaData,
            this.props.selectedAlgorithm, this.messagesToBeSent)
        for (let message of messages) {
            Utilities.sendToServer(this.props.ws, message.command, message.data);
        }
        this.setState({view: this.views.loading_view});
    }

    /**
     * When a selected algorithm does not find design rules, switch to the next algorithm
     */
    tryDifferentAlgorithm() {
        let newAlgorithm = switchAlgorithm(this.props.selectedAlgorithm);
        console.log("Trying the next algorithm: ", newAlgorithm);
        if (newAlgorithm) {
            this.props.onUpdateSelectedAlgorithm(newAlgorithm);
            let message = {
                command: webSocketSendMessage.mine_design_rules_msg,
                data: {parameters: newAlgorithm.parameters, algorithm: newAlgorithm.key}
            };
            Utilities.sendToServer(this.props.ws, message.command, message.data);
            this.setState({
                loadingTitle: "Trying again",
                view: this.views.loading_view
            });
        } else {
            this.setState({message: "No rule is found."});
        }
    }

    /**
     * update the xpath queries and snippets of each rulePadState
     */
    updateRulePadState(minedRules) {
        return minedRules.map(group => {
            let fileGroup = group.fileGroup;
            let rulePadStates = group.rulePadStates
                .map(rulePadState => {
                    // the rule is already updated
                    if (rulePadState.quantifierXPathQuery) {
                        return rulePadState;
                    }
                    let newRulePadStateData = Object.assign({}, rulePadState,
                        {filesFolders: [], quantifierXPathQuery: "", constraintsXPathQuery: []});
                    try {
                        let rootIds = featureGroupInformation[fileGroup].rootId;
                        // only considering the feature Ids of identifiers
                        let featureIds = [];
                        // adding parent featureIds
                        rulePadState.parent.guiElements[rootIds[0]]._data_.withChildren.forEach(child => {
                            if (identifierKeysInRulePad.includes(child.key))
                                featureIds.push(...child._data_.elements.map(element => element.featureId));
                        });
                        newRulePadStateData.quantifierXPathQuery =
                            createXPath(rulePadState.parent.guiTree, rulePadState.parent.guiElements, rootIds[0]);

                        // each child has a constraint query
                        newRulePadStateData.constraintsXPathQuery = rulePadState.children.map(child => {
                            // adding child featureIds
                            child.guiElements[rootIds[1]]._data_.withChildren.forEach(child => {
                                if (identifierKeysInRulePad.includes(child.key))
                                    featureIds.push(...child._data_.elements.map(element => element.featureId));
                            });
                            let xpath = createXPath(child.guiTree, child.guiElements, rootIds[1]);
                            return xpath + "[ancestor::" + newRulePadStateData.quantifierXPathQuery + "]";
                        });
                        newRulePadStateData.filesFolders =
                            findFileFoldersForFeatureIds(featureIds, fileGroup, this.props.featureMetaData);
                    } catch (e) {
                        console.log("error happened in processing rulePadState data", rulePadState, e);
                    }
                    return newRulePadStateData;
                });
            return {fileGroup, rulePadStates};
        });
    }

    matchSentAndReceivedMessages(nextProps) {
        let sentMessages = nextProps.sentMessages.map(a => ({...a})); // clone
        let receivedMessages = nextProps.receivedMessages.map(a => ({...a})); // clone
        let minedRules = this.state.minedRules.slice(0);

        sentMessages.sort((a, b) => a["messageID"] - b["messageID"]);
        receivedMessages.forEach(a => a["messageID"] = +a["messageID"]);
        receivedMessages.sort((a, b) => a["messageID"] - b["messageID"]);

        let matchedIndices = {sent: [], received: []};

        function replaceMessagesInXpathQueries(xpath, lookFor, resultXPath) {
            if (xpath.indexOf(lookFor) !== -1) {
                while (xpath.indexOf(lookFor) !== -1) {
                    xpath = xpath.replace(lookFor, resultXPath);
                }
                while (xpath.indexOf("[]") !== -1) {
                    xpath = xpath.replace("[]", "");
                }
                while (xpath.indexOf("][") !== -1) {
                    xpath = xpath.replace("][", " and ");
                }
            }
            return xpath;
        }

        // todo improve the running time, maybe have a storage for pointing where to check?
        function processXpathQueries(lookFor, resultXPath) {
            minedRules.forEach(group => {
                group.rulePadStates.forEach(rulePadState => {
                    // first check quantifierXpathQuery:
                    try {
                        rulePadState.quantifierXPathQuery = replaceMessagesInXpathQueries(
                            rulePadState.quantifierXPathQuery, lookFor, resultXPath);
                    } catch (e) {
                        console.log("error quantifierXPathQuery", {rulePadState});
                    }
                    // second check each constraintsXpathQuery
                    for (let i = 0; i < rulePadState.constraintsXPathQuery.length; i++) {
                        rulePadState.constraintsXPathQuery[i] = replaceMessagesInXpathQueries(
                            rulePadState.constraintsXPathQuery[i], lookFor, resultXPath);
                    }
                })
            })
        }

        let otherIndex = 0;
        for (let index = 0; index < sentMessages.length; index++) {
            if (otherIndex >= receivedMessages.length) break;
            for (let j = otherIndex; j < receivedMessages.length; j++) {
                // matched messages
                if (+sentMessages[index]["messageID"] === +receivedMessages[j]["messageID"]) {
                    matchedIndices.sent.push(index);
                    matchedIndices.received.push(j);
                    otherIndex = j + 1;
                    let resultXPath = '[' +
                        this.traverseReceivedXml(receivedMessages[j]["xmlText"], sentMessages[index]) + ']';
                    // replace all occurrences of textAndXPath.originalText
                    processXpathQueries(sentMessages[j]["lookFor"], resultXPath);
                    break;
                }
            }
        }
        // remove matched messages from list of messages
        for (let i = matchedIndices.sent.length - 1; i >= 0; i--)
            sentMessages.splice(matchedIndices.sent[i], 1);
        for (let i = matchedIndices.received.length - 1; i >= 0; i--)
            receivedMessages.splice(matchedIndices.received[i], 1);

        // at least one message is responded
        if (matchedIndices.sent.length > 0) {
            // rulePadStateData = this.updateCodeSnippets(rulePadStateData)
            // this.setState({rulePadState: rulePadStateData},
            //     () =>
            this.props.onUpdateSentReceivedMessages(sentMessages, receivedMessages)
            //     );
        }
        return minedRules;
    }

    /**
     * check validity of an xml and generate the xpath query, copied from rulePad.js
     * @param xmlText
     * @param sentMessageData
     * @returns string xpath
     * derived from the originalText
     */
    traverseReceivedXml(xmlText, sentMessageData) {
        let exprValidation = sentMessageData["query"];
        let parser = new DOMParser();

        function nsResolver(prefix) {
            let ns = {"src": "http://www.srcML.org/srcML/src"};
            return ns[prefix] || null;
        }

        // checks validity of the XML
        let xml = parser.parseFromString(xmlText, "text/xml");
        if (!xml.evaluate) {
            console.log("error in xml.evaluate");
            return "";
        }

        let validNodes = xml.evaluate(exprValidation, xml, nsResolver, XPathResult.ANY_TYPE, null);
        let resultValidNode = validNodes.iterateNext();
        if (!resultValidNode) {
            console.log("error: XPath is not valid.");
            return "";
        }

        /**
         * recursive function
         * traverse the state_children of a parent node to generate xpath query conditions
         * @param parentNode
         * @returns string
         */
        let traverseChildren = (parentNode) => {
            let res = [];
            let children = parentNode.childNodes;
            for (let i = 0; i < children.length; i++) {
                if (children[i].nodeName === "#text") {
                    if (children.length === 1)
                        res.push(`text()='${children[i].nodeValue}'`);
                } else {
                    res.push(traverseChildren(children[i]));
                }
            }
            return "src:" + parentNode.nodeName + "[" + res.join(" and ") + "]";
        };

        // result xpath: 'src:expr[....]' where 'src:expr[' and the final ']' is extra.
        let resultXPath = traverseChildren(resultValidNode);
        resultXPath = resultXPath.substring(sentMessageData["cuttingLength"], resultXPath.length - 1);
        return resultXPath;
    }

    updateCodeSnippets(minedRules) {
        return minedRules.map(group => {
            let fileGroup = group.fileGroup;
            let rulePadStates = group.rulePadStates.map(rulePadState => {
                return runXpathQueryMinedRules(this.props.xmlFiles, fileGroup, this.props.projectPath, rulePadState)
            })
            return {fileGroup, rulePadStates};
        })
    }

}

function mapStateToProps(state) {
    return {
        message: state.message,
        ws: state.ws,
        xmlFiles: state.xmlFiles,
        projectPath: state.projectPath,
        featureMetaData: state.minedRulesState.featureMetaData,
        groupingMetaData: state.minedRulesState.groupingMetaData,
        focusedElementData: state.minedRulesState.focusedElementData,
        doiInformation: state.minedRulesState.doiInformation,
        selectedAlgorithm: state.minedRulesState.selectedAlgorithm,
        minedRules: state.minedRulesState.minedRules,
        sentMessages: state.sentXpathMessages,
        receivedMessages: state.receivedXpathMessages,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onUpdateFeatureMetaData: (featureMetaData) => dispatch(updateFeatureMetaData(featureMetaData)),
        onUpdateGroupingMetaData: (groupingMetaData) => dispatch(updateGroupingMetaData(groupingMetaData)),
        onUpdateSelectedAlgorithm: (newAlgorithm) => dispatch(updateSelectedAlgorithm(newAlgorithm)),
        onUpdateMinedRules: (modifiedOutput) => dispatch(updatedMinedRules(modifiedOutput)),
        onUpdateSentReceivedMessages: (sentMessages, receivedMessaged) =>
            dispatch(updateSentReceivedMessages(sentMessages, receivedMessaged)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MinedRulesComponent);

class AccordionItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: props.isOpen,
        };
    }

    render() {
        const {title, content} = this.props;
        this.caretClass = {
            true: {cursor: "pointer", color: "black"},
            false: {cursor: "pointer", color: "darkgrey"}
        };
        return (
            <div className="accordion-item">
                <div
                    onClick={() => this.setState((prevState) => ({
                        isOpen: !prevState.isOpen,
                    }))}
                    className={`accordion-item-header ${this.state.isOpen ? 'open' : ''}`}>
                    {title}
                    <div style={{float: "right"}}>
                        <FaCaretUp size={20}
                                   style={this.caretClass[this.state.isOpen.toString()]}
                                   className={"react-icons"}/>
                        <FaCaretDown size={20}
                                     style={this.caretClass[(!this.state.isOpen).toString()]}
                                     className={"react-icons"}/>
                    </div>
                </div>
                {this.state.isOpen && <div className="accordion-item-content">{content}</div>}
            </div>
        );
    }
}

export class Accordion extends Component {
    render() {
        const {items} = this.props;

        return (
            <div className="accordion">
                {items.map((item, index) => (
                    <AccordionItem
                        key={index}
                        title={item.title}
                        content={item.content}
                        isOpen={index === 0}
                    />
                ))}
            </div>
        );
    }
}

class CodeSnippets extends Component {
    constructor(props) {
        super(props);
        // ws and codeSnippets
        this.state = {
            /**
             * @type codeSnippets {{fileGroup: string, snippets: {filePath: string, xml: string, snippet: string}[],
             * files: {all: string[], found: string[]}}[]}
             */
            codeSnippets: props.codeSnippets,
            isExpanded: false,
        }
    }

    render() {
        return (
            <div>
                {this.renderBadges()}
                {!this.state.isExpanded ? null : this.renderCodeSnippets()}
            </div>
        )
    }

    renderBadges() {
        if (!this.state.codeSnippets) {
            return <div>{"Unavailable"}</div>
        }
        let count = this.state.codeSnippets.reduce((sum, group) => sum + group.snippets.length, 0);
        return (
            <div onClick={() => this.setState({isExpanded: !this.state.isExpanded})}>
                <Badge variant="success">{`${count} Example Snippets`}</Badge>
            </div>);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({codeSnippets: nextProps.codeSnippets})
    }

    renderCodeSnippets() {
        if (!this.state.codeSnippets) {
            return <div>{"Unavailable"}</div>
        }
        return this.state.codeSnippets.map(group => {
            if (group.snippets.length === 0) {
                return null;
            }
            return group.snippets.map((snippet, i) => {
                return (
                    <div data-file-path={snippet.filePath} className={"snippetDiv"} key={i}>
                            <pre className="link" onClick={() => {
                                Utilities.sendToServer(this.props.ws, webSocketSendMessage.snippet_xml_msg, snippet.xml)
                            }}>
                                <div className="content" dangerouslySetInnerHTML={{__html: snippet.snippet}}/>
                            </pre>
                    </div>)
            })
        });
    }
}