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
import {
    FaAngleDown, FaAngleUp,
    FaCaretDown,
    FaCaretUp, FaSearch,
} from "react-icons/fa";
import "rc-slider/assets/index.css";

import {
    updatedMinedRules,
    updateFeatureMetaData,
    updateGroupingMetaData,
    updateSelectedAlgorithm,
    updateSentReceivedMessages,
} from "../../actions";
import Utilities from "../../core/utilities";
import {reduxStoreMessages} from "../../reduxStoreConstants";
import {createGroupingMetaData, formGroupings} from "../../miningRulesCore/preProcessing";
import {createFeatureMetaDataMap} from "../../miningRulesCore/extractFeatures";
import {generateFeatures, prepareFilesAndRequestMineRules} from "../../miningRulesCore/processing";
import {
    defaultFeatures,
    featureGroupInformation,
    focusElementType,
    identifierKeysInRulePad,
} from "../../miningRulesCore/featureConfig";
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
        };

        this.state = {
            view: this.views.default_view,
            minedRules: [],
            minedRulesGrouped: [], // [{key, value}]
            searchTerm: "",
            loadingTitle: "Mining Rules",
            message: "",
            cluster: [],

            isExpanded: false,
            expandedIdentifierGroupIndex: 0,
            isColorCodingEnabled: true,
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
                        newMinedRulesGrouped: [],
                        identifier: "",
                        view: this.views.default_view,
                    });
                    break;
                }
                this.setState({
                    minedRules: [],
                    newMinedRulesGrouped: [],
                    loadingTitle: "Processing the codebase",
                    identifier: nextProps.focusedElementData.identifier,
                    view: this.views.loading_view,
                });
                break;

            case reduxStoreMessages.request_mine_rules_for_element_msg:
                if (nextProps.focusedElementData.identifier === "") {
                    break;
                }
                this.setState({
                    minedRules: [],
                    newMinedRulesGrouped: [],
                    loadingTitle: "Mining Rules",
                    view: this.views.loading_view,
                }, this.processFeaturesForSelectedScope);
                break;

            case reduxStoreMessages.update_mined_rules_msg:
                const countRules = nextProps.minedRules.reduce((sum, group) => sum + group.rulePadStates.length, 0);
                if (countRules === 0) {
                    const newAlgorithm = switchAlgorithm(this.props.selectedAlgorithm);
                    if (newAlgorithm) {
                        this.props.onUpdateSelectedAlgorithm(newAlgorithm);
                        console.log("Trying the next algorithm: ", newAlgorithm);
                        const message = {
                            command: webSocketSendMessage.mine_design_rules_msg,
                            data: {parameters: newAlgorithm.parameters, algorithm: newAlgorithm.key},
                        };
                        Utilities.sendToServer(this.props.ws, message.command, message.data);
                    } else {
                        this.setState({
                            minedRules: nextProps.minedRules, // no rule
                            minedRulesGrouped: [],
                            view: this.views.clusters_view,
                            message: "No rule is found.",
                        });
                    }
                } else {
                    const minedRulesGrouped = this.groupByIdentifier(nextProps.minedRules);
                    const newMinedRulesGrouped = this.updateRulePadState(minedRulesGrouped);
                    this.setState({
                        minedRules: nextProps.minedRules,
                        minedRulesGrouped: newMinedRulesGrouped,
                        view: this.views.clusters_view,
                    });
                }
                break;

            case reduxStoreMessages.update_feature_metadata_msg:
                this.setState({
                    featureMetaData: nextProps.featureMetaData,
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
                const newMinedRulesGrouped2 = this.matchSentAndReceivedMessages(nextProps);
                const newMinedRulesGrouped = this.updateCodeSnippets(newMinedRulesGrouped2);
                if (nextProps.sentMessages.length === 1) {
                    this.setState({
                        minedRulesGrouped: newMinedRulesGrouped,
                        view: this.views.clusters_view,
                        loadingTitle: "Done.",
                        message: "",
                    });
                } else {
                    this.setState({
                        minedRulesGrouped: newMinedRulesGrouped,
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
                    <h4 className={"focusedElementError"}>The focused element should be Class, Field, or Method.</h4>) :
                    null}
            </div>
        );
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
            const mapFilter = focusElementType
                .filter((d) => d.mapFocusedElementToFeaturesKey ===
                    this.props.focusedElementData.mapFocusedElementToFeaturesKey);
            if (mapFilter.length === 1) {
                nodeTitle = mapFilter[0].title;
            }
            filePath = this.props.focusedElementData.filePath;
            identifier = this.props.focusedElementData.identifier;
            return (
                <div style={{marginBottom: "20px"}}>
                    <h5>Potential design rules found based on <span>{nodeTitle}</span> <code>{identifier}</code></h5>
                    <h5>{filePath}</h5>
                </div>
            );
        }
    }

    renderMessages() {
        const countRules = this.state.minedRules.reduce((sum, group) => sum + group.rulePadStates.length, 0);
        const nextAlgorithmExist = !!switchAlgorithm(this.props.selectedAlgorithm);
        return (
            <div style={{marginBottom: "20px"}}>
                <h4>{this.state.message}</h4>
                {countRules === 0 || !nextAlgorithmExist ? null : (
                    <span>
                        <span>Not finding what your are looking for? </span>
                        <Button onClick={() => this.tryDifferentAlgorithm()}>Re-run the tool.</Button>
                    </span>
                )}
            </div>
        );
    }

    renderDescription() {
        const countRules = this.state.minedRules.reduce((sum, group) => sum + group.rulePadStates.length, 0);
        if (countRules === 0) return null;
        return (
            <div className="descriptionWrapper">
                <div className="color-coding-toggle" style={{marginBottom: "15px"}}>
                    <input
                        type="checkbox"
                        checked={this.state.isColorCodingEnabled}
                        onChange={this.handleColorCodingToggle}
                        style={{marginRight: "10px"}}
                    />
                    Highlight Code Elements Based On Their Likelihood Of Being Part Of A Rule
                </div>
                <div className={"descriptionContainer"}>
                    <span className={"descriptionTitle"}>Tutorial</span>
                    <div style={{marginBottom: "20px"}}>
                        <h5>The following code snippets illustrates potential design rules.</h5>
                        <h5>The top snippet denotes <strong>when</strong> a design rules applies (IF part),
                            and bottom components denote <strong>how</strong> the rule is applied (THEN part).</h5>
                    </div>
                    {this.state.isColorCodingEnabled && (
                        <div>
                            <h5>The purple background in the code shows how likely each element is in a design
                                rule.</h5>
                            <h5><span className={"frequency-color frequency-10"}>Darker purple</span> means it's more
                                likely to be part of a rule,
                                and <span className={"frequency-color frequency-1"}>lighter purple</span> means it is
                                less likely to be part of a rule.
                            </h5>
                        </div>
                    )}
                    <h5><span className={"frequency-color frequency-identifier"}>Orange</span> background
                        highlights the identifiers.</h5>

                </div>
            </div>);
    }

    renderClusters() {
        const countRules = this.state.minedRules.reduce((sum, group) => sum + group.rulePadStates.length, 0);
        const handleSearchChange = (event) => {
            this.setState({searchTerm: event.target.value});
        };
        if (this.state.minedRules.length > 0 && countRules === 0) {
            return (
                <div>
                    <h4><strong>No rule is found.</strong></h4>
                </div>);
        }
        const filteredRules = this.state.minedRulesGrouped.filter((group) =>
            group.key.toLowerCase().includes(this.state.searchTerm.toLowerCase()),
        );

        return (
            <div>
                {/* ADDED: Search bar */}
                <div className="search-bar-container">
                    <FaSearch className="search-icon"/>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search rules..."
                        value={this.state.searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                {filteredRules.map((identifierGroup, index) => {
                    const childrenKeys = Object.keys(identifierGroup.value.children);
                    if (childrenKeys.length === 0) {
                        return null;
                    }
                    const keyParts = identifierGroup.key.split("%");
                    const identifierType = keyParts[0];
                    const identifierValue = keyParts[1];
                    const parentElementId =
                        featureGroupInformation[identifierGroup.value.children[childrenKeys[0]].fileGroup].rootId[0];
                    const expandedClass = "expanded";

                    const thenParts = childrenKeys.map((key) => {
                        const fileGroup = identifierGroup.value.children[key].fileGroup;
                        const title = featureGroupInformation[fileGroup].mergeKeys[1]
                            .replace(/\b\w/g, (char) => char.toUpperCase());
                        const content = this.renderThenPart(key, identifierGroup);
                        return {title, content};
                    });

                    const isRuleExpanded = this.state.isExpanded && this.state.expandedIdentifierGroupIndex === index;
                    const hidden = !this.state.isExpanded || this.state.expandedIdentifierGroupIndex !== index;
                    const classNameHidden = hidden ? "hidden" : "";

                    return (
                        <div className={"generateRuleGui guiBoundingBox minedRuleBoundingBox"} key={index}>
                            <div className={"identifierContainer"}>
                                <div className={"identifierHeader"}>
                                    {"Rules applied on "}
                                    <strong>{identifierType}</strong>
                                    {" "}
                                    <span
                                        className={"inputText activeElement frequency-color frequency-identifier"}>
                                        {identifierValue}
                                    </span>
                                </div>
                                {isRuleExpanded ?
                                    <div className={"expandIcons"}
                                        onClick={() => this.setState({isExpanded: false})}>
                                        <FaAngleUp size={20}/></div> :
                                    <div className={"expandIcons"}
                                        onClick={() => this.setState({
                                            isExpanded: true,
                                            expandedIdentifierGroupIndex: index,
                                        })}>
                                        <FaAngleDown size={20}/>
                                    </div>
                                }
                            </div>
                            <div className={`clusterRuleContainer ${classNameHidden}`}>
                                <div className={"ifKeyword"}>
                                    <strong>{`IF a ${identifierType} is named ${identifierValue}`}</strong></div>
                                <div className={`ifPart ${expandedClass}`}>
                                    <MinedRulePad key={new Date()} rulePadState={identifierGroup.value.parent}
                                        isCluster={true}
                                        featureMetaData={this.props.featureMetaData}
                                        fileGroup={identifierGroup.value.children[childrenKeys[0]].fileGroup}
                                        elementId={parentElementId}
                                        isColorCodingEnabled={this.state.isColorCodingEnabled}/>
                                </div>
                                <div className={"thenKeyword"}><strong>{`THEN the ${identifierType} may have:`}</strong>
                                </div>
                                <div className={"thenParts"}>
                                    <Accordion items={thenParts}/>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    renderThenPart(key, identifierGroup) {
        return identifierGroup.value.children[key].contents.map((child, i) => {
            return (
                <div className={"thenPart"} key={i}>
                    <MinedRulePad key={new Date()} rulePadState={child}
                        isCluster={true}
                        featureMetaData={this.props.featureMetaData}
                        fileGroup={identifierGroup.value.children[key].fileGroup}
                        elementId={featureGroupInformation[identifierGroup.value.children[key].fileGroup].rootId[1]}
                        isColorCodingEnabled={this.state.isColorCodingEnabled}/>
                    {identifierGroup.value.constraintsSnippets &&
                    identifierGroup.value.constraintsSnippets[key] &&
                    identifierGroup.value.constraintsSnippets[key][i] ?
                        <CodeSnippets
                            codeSnippets={identifierGroup.value.constraintsSnippets[key][i]}
                            ws={this.props.ws}/> : null
                    }
                </div>
            );
        });
    }

    /**
     * grouping the found rules by identifiers
     * @param minedRules
     * @return {{value: {parent: *, children: {}, identifierFeatureInfo: {}|*}, key: string}[]}
     */
    groupByIdentifier(minedRules) {
        const grouped = {};
        minedRules.forEach((group) => {
            // '_' added to fix the issue regarding 'constructor' keyword. Access the actual string by slice(1)
            const groupType = "_" + featureGroupInformation[group.fileGroup].mergeKeys[1];
            group.rulePadStates.forEach((rulePadState, index) => {
                if (index >= this.clusterLimit) {
                    return;
                }
                const identifierType = defaultFeatures[rulePadState.identifierFeatureInfo.featureIndex].FeatureObject.key;
                const identifierValue = rulePadState.identifierFeatureInfo.nodes[0];
                // '%' is used as a separator of type and value
                const key = `${identifierType}%${identifierValue}`;
                if (!(key in grouped)) {
                    grouped[key] = {};
                }
                if (!(groupType in grouped[key])) {
                    grouped[key][groupType] = {"fileGroup": group.fileGroup, "contents": []};
                }
                grouped[key][groupType].contents.push(rulePadState);
            });
        });

        return Object.keys(grouped).map((key) => {
            const value = grouped[key];
            let parent; let identifierFeatureInfo;
            const children = {};

            for (const prop of Object.keys(value)) {
                if (value[prop].contents.length > 0) {
                    if (!parent) {
                        // Assuming parent and identifierFeatureInfo are the same across all properties
                        parent = value[prop].contents[0].parent;
                        identifierFeatureInfo = value[prop].contents[0].identifierFeatureInfo;
                    }
                    // Collect fileGroup and children for each property
                    children[prop] = {
                        fileGroup: value[prop].fileGroup,
                        contents: value[prop].contents.map((item) => item.children).flat(),
                    };
                }
            }
            return {
                key: key,
                value: {
                    parent: parent,
                    identifierFeatureInfo: identifierFeatureInfo,
                    children: children,
                },
            };
        });
    }

    /**
     * Find the groupings
     * Since the method is called after reduxStoreMessages.project_path_msg
     * the projectPath is not updated in the props yet.
     */
    preProcessGroupings() {
        const groupingMetaData = createGroupingMetaData();
        formGroupings(this.props.xmlFiles, this.props.projectPath, groupingMetaData);
        this.props.onUpdateGroupingMetaData(groupingMetaData);
    }

    /**
     * For a selected element (scope), extract features from relevant file (from initial groupings)
     * populate the feature map and send the info to the server for mining process.
     */
    processFeaturesForSelectedScope() {
        const featureMetaData = createFeatureMetaDataMap();
        this.messagesToBeSent = generateFeatures(this.props.xmlFiles, this.props.projectPath,
            this.props.focusedElementData, this.props.doiInformation, this.props.groupingMetaData, featureMetaData);

        this.setState({}// {loadingStatus: false}
            , () => this.props.onUpdateFeatureMetaData(featureMetaData),
        );
    }

    /**
     * selected features are sent to the server for mining rules
     */
    sendFeaturesForMiningRules() {
        const messages = prepareFilesAndRequestMineRules(this.props.featureMetaData,
            this.props.selectedAlgorithm, this.messagesToBeSent);
        for (const message of messages) {
            Utilities.sendToServer(this.props.ws, message.command, message.data);
        }
        this.setState({view: this.views.loading_view});
    }

    /**
     * When a selected algorithm does not find design rules, switch to the next algorithm
     */
    tryDifferentAlgorithm() {
        const newAlgorithm = switchAlgorithm(this.props.selectedAlgorithm);
        console.log("Trying the next algorithm: ", newAlgorithm);
        if (newAlgorithm) {
            this.props.onUpdateSelectedAlgorithm(newAlgorithm);
            const message = {
                command: webSocketSendMessage.mine_design_rules_msg,
                data: {parameters: newAlgorithm.parameters, algorithm: newAlgorithm.key},
            };
            Utilities.sendToServer(this.props.ws, message.command, message.data);
            this.setState({
                loadingTitle: "Trying again",
                view: this.views.loading_view,
            });
        } else {
            this.setState({message: "No rule is found."});
        }
    }

    /**
     * update the xpath queries and snippets of each rulePadState
     */
    updateRulePadState(minedRulesGrouped) {
        return minedRulesGrouped.map((identifierGroup) => {
            const childrenKeys = Object.keys(identifierGroup.value.children);
            if (childrenKeys.length === 0) {
                return identifierGroup;
            }
            const parentFileGroup = identifierGroup.value.children[childrenKeys[0]].fileGroup;
            const parentRootId = featureGroupInformation[parentFileGroup].rootId[0];
            // the rule is already updated
            if (identifierGroup.value.quantifierXPathQuery) {
                return identifierGroup;
            }
            const newIdentifierGroupValue = Object.assign({}, identifierGroup.value,
                {filesFolders: [], quantifierXPathQuery: "", constraintsXPathQuery: {}});

            // each identifierGroup has one quantifier query
            newIdentifierGroupValue.quantifierXPathQuery = createXPath(newIdentifierGroupValue.parent.guiTree,
                newIdentifierGroupValue.parent.guiElements, parentRootId);

            // only considering the feature Ids of identifiers
            const parentFeatureIds = [];
            // adding parent featureIds
            newIdentifierGroupValue.parent.guiElements[parentRootId]._data_.withChildren.forEach((child) => {
                if (identifierKeysInRulePad.includes(child.key)) {
                    parentFeatureIds.push(...child._data_.elements.map((element) => element.featureId));
                }
            });
            // files and folders of the parent is enough
            newIdentifierGroupValue.filesFolders =
                findFileFoldersForFeatureIds(parentFeatureIds, parentFileGroup, this.props.featureMetaData);

            // each child has a constraint query
            for (const key of childrenKeys) {
                newIdentifierGroupValue.constraintsXPathQuery[key] = [];

                // for each group of children, we have a different fileGroup
                const fileGroup = newIdentifierGroupValue.children[key].fileGroup;
                const rootId = featureGroupInformation[fileGroup].rootId[1];
                newIdentifierGroupValue.constraintsXPathQuery[key] =
                    newIdentifierGroupValue.children[key].contents.map((child) => {
                        let xpath = createXPath(child.guiTree, child.guiElements, rootId);
                        if (!xpath.startsWith("/")) xpath = "/" + xpath;
                        return xpath + "[ancestor::" + newIdentifierGroupValue.quantifierXPathQuery + "]";
                    });
            }
            return {key: identifierGroup.key, value: newIdentifierGroupValue};
        });
    }

    matchSentAndReceivedMessages(nextProps) {
        const sentMessages = nextProps.sentMessages.map((a) => ({...a})); // clone
        const receivedMessages = nextProps.receivedMessages.map((a) => ({...a})); // clone
        const minedRulesGrouped = this.state.minedRulesGrouped.slice(0);

        sentMessages.sort((a, b) => a["messageID"] - b["messageID"]);
        receivedMessages.forEach((a) => a["messageID"] = +a["messageID"]);
        receivedMessages.sort((a, b) => a["messageID"] - b["messageID"]);

        const matchedIndices = {sent: [], received: []};

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
            minedRulesGrouped.forEach((identifierGroup) => {
                try {
                    // first check quantifierXpathQuery:
                    identifierGroup.value.quantifierXPathQuery = replaceMessagesInXpathQueries(
                        identifierGroup.value.quantifierXPathQuery, lookFor, resultXPath);
                    // second check each constraintsXpathQuery
                    Object.keys(identifierGroup.value.constraintsXPathQuery).forEach((key) => {
                        identifierGroup.value.constraintsXPathQuery[key] =
                            identifierGroup.value.constraintsXPathQuery[key].map((childQuery) => {
                                return replaceMessagesInXpathQueries(childQuery, lookFor, resultXPath);
                            });
                    });
                } catch (e) {
                    console.log("error quantifierXPathQuery/constraintsXPathQuery", {identifierGroup});
                }
            });
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
                    const resultXPath = "[" +
                        this.traverseReceivedXml(receivedMessages[j]["xmlText"], sentMessages[index]) + "]";
                    // replace all occurrences of textAndXPath.originalText
                    processXpathQueries(sentMessages[j]["lookFor"], resultXPath);
                    break;
                }
            }
        }
        // remove matched messages from list of messages
        for (let i = matchedIndices.sent.length - 1; i >= 0; i--) {
            sentMessages.splice(matchedIndices.sent[i], 1);
        }
        for (let i = matchedIndices.received.length - 1; i >= 0; i--) {
            receivedMessages.splice(matchedIndices.received[i], 1);
        }

        // at least one message is responded
        if (matchedIndices.sent.length > 0) {
            this.props.onUpdateSentReceivedMessages(sentMessages, receivedMessages);
        }

        return minedRulesGrouped;
    }

    /**
     * check validity of an xml and generate the xpath query, copied from rulePad.js
     * @param xmlText
     * @param sentMessageData
     * @returns string xpath
     * derived from the originalText
     */
    traverseReceivedXml(xmlText, sentMessageData) {
        const exprValidation = sentMessageData["query"];
        const parser = new DOMParser();

        function nsResolver(prefix) {
            const ns = {"src": "http://www.srcML.org/srcML/src"};
            return ns[prefix] || null;
        }

        // checks validity of the XML
        const xml = parser.parseFromString(xmlText, "text/xml");
        if (!xml.evaluate) {
            console.log("error in xml.evaluate");
            return "";
        }

        const validNodes = xml.evaluate(exprValidation, xml, nsResolver, XPathResult.ANY_TYPE, null);
        const resultValidNode = validNodes.iterateNext();
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
        const traverseChildren = (parentNode) => {
            const res = [];
            const children = parentNode.childNodes;
            for (let i = 0; i < children.length; i++) {
                if (children[i].nodeName === "#text") {
                    if (children.length === 1) {
                        res.push(`text()='${children[i].nodeValue}'`);
                    }
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

    updateCodeSnippets(minedRulesGrouped) {
        return minedRulesGrouped.map((identifierGroup) => {
            try {
                return {
                    key: identifierGroup.key,
                    value: runXpathQueryMinedRules(this.props.xmlFiles, this.props.projectPath, identifierGroup.value),
                };
            } catch (e) {
                console.log("failed to runXpathQueryMinedRules on ", identifierGroup);
                return identifierGroup;
            }
        });
    }
    handleColorCodingToggle = () => {
        this.setState((prevState) => ({
            isColorCodingEnabled: !prevState.isColorCodingEnabled,
        }));
    };
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onUpdateFeatureMetaData: (featureMetaData) => dispatch(updateFeatureMetaData(featureMetaData)),
        onUpdateGroupingMetaData: (groupingMetaData) => dispatch(updateGroupingMetaData(groupingMetaData)),
        onUpdateSelectedAlgorithm: (newAlgorithm) => dispatch(updateSelectedAlgorithm(newAlgorithm)),
        onUpdateMinedRules: (modifiedOutput) => dispatch(updatedMinedRules(modifiedOutput)),
        onUpdateSentReceivedMessages: (sentMessages, receivedMessaged) =>
            dispatch(updateSentReceivedMessages(sentMessages, receivedMessaged)),
    };
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
            false: {cursor: "pointer", color: "darkgrey"},
        };
        return (
            <div className="accordion-item">
                <div
                    onClick={() => this.setState((prevState) => ({
                        isOpen: !prevState.isOpen,
                    }))}
                    className={`accordion-item-header ${this.state.isOpen ? "open" : ""}`}>
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
                        isOpen={false}
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
        };
    }

    render() {
        return (
            <div>
                {this.renderBadges()}
                {!this.state.isExpanded ? null : this.renderCodeSnippets()}
            </div>
        );
    }

    renderBadges() {
        if (!this.state.codeSnippets) {
            return <div>{"Unavailable"}</div>;
        }
        const count = this.state.codeSnippets.reduce((sum, group) => sum + group.snippets.length, 0);
        return (
            <div onClick={() => this.setState({isExpanded: !this.state.isExpanded})} className={"badge"}>
                <Badge variant="success">{`${count} Example Snippets`}</Badge>
            </div>);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({codeSnippets: nextProps.codeSnippets});
    }

    renderCodeSnippets() {
        if (!this.state.codeSnippets) {
            return <div>{"Unavailable"}</div>;
        }
        return this.state.codeSnippets.map((group) => {
            if (group.snippets.length === 0) {
                return null;
            }
            return group.snippets.map((snippet, i) => {
                return (
                    <div data-file-path={snippet.filePath} className={"snippetDiv"} key={i}>
                        <pre className="link" onClick={() => {
                            Utilities.sendToServer(this.props.ws, webSocketSendMessage.snippet_xml_msg, snippet.xml);
                        }}>
                            <div className="content" dangerouslySetInnerHTML={{__html: snippet.snippet}}/>
                        </pre>
                    </div>);
            });
        });
    }
}

