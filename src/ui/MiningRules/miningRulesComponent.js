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
import {Button, Col, Row} from "react-bootstrap";
import "rc-slider/assets/index.css";

import {
    updateFeatureMetaData,
    updateGroupingMetaData,
    updateMinedRulePadState,
    updateNewRuleFromMinedRules,
    updateSelectedAlgorithm
} from "../../actions";
import Utilities from "../../core/utilities";
import {reduxStoreMessages} from "../../reduxStoreConstants";
import {createGroupingMetaData, formGroupings} from "../../miningRulesCore/preProcessing";
import {createFeatureMetaDataMap} from "../../miningRulesCore/extractFeatures";
import {generateFeatures, prepareFilesAndRequestMineRules} from "../../miningRulesCore/processing";
import {featureGroupInformation, focusElementType} from "../../miningRulesCore/featureConfig";
import MinedClusterRulePad from "./minedClusterRulePad";
import {constantRuleIndex} from "../uiConstants";
import RulePad from "../RulePad/rulePad";
import {
    createRulePadStateForItemSet,
    findFileFoldersForItemSet,
    switchAlgorithm
} from "../../miningRulesCore/postProcessing";
import {webSocketSendMessage} from "../../core/coreConstants";
import {FaCaretDown, FaCaretUp, FaSearch} from "react-icons/fa";
import ReactToolTip from "react-tooltip";

class MiningRulesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            minedRules: [],
            loadingStatus: false, // for loading icons when mining rules
            loadingTitle: "Mining Rules",
            showSelectedCluster: false,
            showFocusedElementErrorMessage: false,
            message: "",
            selectedGroupIndex: props.selectedGroupIndex,
            selectedClusterIndex: props.selectedClusterIndex
        };
        this.messagesToBeSent = []; // the messages that are going to the server to be written on files
        this.clusterLimit = 10; // number of clusters in each category of mined rules.
    }

    render() {
        return (
            <div className={"miningRulesComponent overlayContainer"}>
                <div className={"mainDiv-overlay"}>
                    {this.renderDefaultView()}
                    {this.state.showSelectedCluster ? this.renderSelectedCluster() : (
                        <div className={"minedRulesComponent"}>
                            {this.renderFocusedElementInfo()}
                            {this.renderMessages()}
                            {this.renderDescription()}
                            {this.renderMinedClusters()}
                        </div>
                    )}
                </div>
                {this.renderLoading()}
            </div>
        )
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
                        showSelectedCluster: false,
                        showFocusedElementErrorMessage: true
                    });
                    break;
                }
                this.setState({
                    minedRules: [],
                    loadingTitle: "Extracting Features",
                    loadingStatus: true,
                    showSelectedCluster: false,
                    showFocusedElementErrorMessage: false
                });
                break;

            case reduxStoreMessages.request_mine_rules_for_element_msg:
                if (nextProps.focusedElementData.identifier === "")
                    break;
                this.setState({
                    minedRules: [],
                    loadingTitle: "Mining Rules",
                    loadingStatus: true,
                    showSelectedCluster: false
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
                            loadingStatus: false,
                            showSelectedCluster: false,
                            message: "No rule is found.",
                        });
                    }
                } else {
                    this.setState({
                        minedRules: nextProps.minedRules,
                        loadingStatus: false,
                        showSelectedCluster: false,
                        message: "",
                    });
                }
                break;

            case reduxStoreMessages.updated_selected_mined_cluster_msg:
                this.setState({
                    showSelectedCluster: true,
                    selectedGroupIndex: nextProps.selectedGroupIndex,
                    selectedClusterIndex: nextProps.selectedClusterIndex
                });
                break;

            case reduxStoreMessages.update_feature_metadata_msg:
                this.setState({
                    featureMetaData: nextProps.featureMetaData
                }, () => this.sendFeaturesForMiningRules());
                break;

            default:
                break;

        }
    }

    renderDefaultView() {
        if (this.state.minedRules.length > 0)
            return (
                <div>{this.renderLoading()}</div>
            );
        if (this.state.loadingStatus) return null;
        return (
            <div>
                <h4>Pick an element in the IDE, and select <strong>Mine Rules</strong> from the context menu.</h4>
                {this.state.showFocusedElementErrorMessage ? (
                        <h4 className={"focusedElementError"}>The focused element should be Class, Field, or Method.</h4>)
                    : null}
            </div>
        )
    }

    renderLoading() {
        return (<div className={(this.state.loadingStatus ? "" : "hidden")}>
            <div className={"overlayLoading"}>
                <div className={"spinnerContainer"}>
                    <div className={"loadingTitle"}>
                        <h3>{this.state.loadingTitle}</h3>
                    </div>
                    <div className="spinner"/>
                </div>
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
                    <h5>Potential design rules for <span>{nodeTitle}</span> <code>{identifier}</code></h5>
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
            <h5>The purple background in the code shows how likely each element is in a design rule.</h5>
            <h5><span className={"frequency-10"}>Darker purple</span> means it's more likely to be part of a rule,
                and <span className={"frequency-1"}>lighter purple</span> means it is less likely to be part of a rule.
            </h5>
            <h5>You can explore a code snippet and explore the design rules that can be derived from it using <FaSearch/> icon.</h5>
        </span>)
    }

    renderMinedClusters() {
        let process = (group, groupIndex, clusterIndex) => {
            let rulePadState = group.rulePadStates[clusterIndex];
            let fileGroup = group.fileGroup;
            return (<div>
                <div className={"generateRuleGui guiBoundingBox minedRuleBoundingBox"}>
                    <Row>
                        <Col md={12}>
                            <div className={"exploreIcon"} data-tip={"React-tooltip"} data-for={"explore-icon"}
                                 onClick={() => this.updateSelectedMinedCluster(groupIndex, clusterIndex)}>
                                <FaSearch size={30}/>
                                <ReactToolTip place={"bottom"} type={"dark"} effect={"solid"} id={"explore-icon"} delayShow={300}>
                                    <span>{"Explore the rules derived from this code snippet."}</span>
                                </ReactToolTip>
                            </div>
                            <MinedClusterRulePad key={new Date()} rulePadState={rulePadState}
                                                 featureMetaData={this.state.featureMetaData} fileGroup={fileGroup}/>
                        </Col>
                    </Row>
                </div>
            </div>)
        }
        let countRules = this.state.minedRules.reduce((sum, group) => sum + group.rulePadStates.length, 0);
        if (this.state.minedRules.length > 0 && countRules === 0 && !this.state.loadingStatus)
            return (
                <div>
                    <h4><strong>No rule is found.</strong></h4>
                </div>)
        let minedRulesArray = this.state.minedRules.map((group, groupIndex) => {
            let title = featureGroupInformation[group.fileGroup].desc;
            let content;
            if (group.rulePadStates.length === 0) {
                content = `No rule is found in this category.`;
            } else {
                content = group.rulePadStates.filter((_, clusterIndex) => clusterIndex < this.clusterLimit)
                    .map((_, clusterIndex) => process(group, groupIndex, clusterIndex))
            }
            return {title, content}
        });
        return (<Accordion items={minedRulesArray}/>);
    }

    renderSelectedCluster() {
        let rulePadState = this.state.minedRules[this.state.selectedGroupIndex]
            .rulePadStates[this.state.selectedClusterIndex];
        let fileGroup = this.state.minedRules[this.state.selectedGroupIndex].fileGroup;
        return (<div className={"minedRulesComponent"}>
            <div className={"generateRuleGui guiBoundingBox minedRuleBoundingBox"}>
                <Row>
                    <Col md={12}>
                        <MinedClusterRulePad key={new Date()} rulePadState={rulePadState}
                                             featureMetaData={this.state.featureMetaData} fileGroup={fileGroup}/>
                    </Col>
                </Row>
            </div>
            <div>
                <h3>Example Rule from this code snippet.</h3>
            </div>
            <div className={"generateRuleGui guiBoundingBox"}>
                <Row>
                    <Col md={12}>
                        <RulePad ruleIndex={constantRuleIndex.minedRuleIndex}/>
                    </Col>
                </Row>
            </div>

            <div>
                <div style={{"padding": "10px", "float": "left"}}>
                    <Button onClick={() => this.setState({showSelectedCluster: false})}>Close</Button>
                </div>
                <div style={{"padding": "10px"}}>
                    <Button onClick={() => {
                        window.location.hash = `#/rules`;
                        window.scrollTo({top: 0, behavior: 'smooth'});
                        this.props.onUpdateNewRuleFromMinedRules();
                    }}>Add Rule</Button>
                </div>
            </div>
        </div>)
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

        this.setState({loadingStatus: false}
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
        this.setState({loadingStatus: true});
    }

    /**
     * Nominate a frequent itemSet to be displayed in RulePad
     * populate RulePad with the frequent itemSets from the cluster with the highest utility
     * @param groupIndex {number}
     * @param clusterIndex {number}
     */
    updateSelectedMinedCluster(groupIndex, clusterIndex) {
        let allFrequentItemSetsInCluster = this.state.minedRules[groupIndex].clusters[clusterIndex].cluster;
        const maxUtilityItemSet = allFrequentItemSetsInCluster.reduce((max, obj) =>
            obj.utility > max.utility ? obj : max);
        let rulePadState = createRulePadStateForItemSet(maxUtilityItemSet,
            this.state.minedRules[groupIndex].fileGroup, this.props.featureMetaData);
        let filesFolders = findFileFoldersForItemSet(maxUtilityItemSet,
            this.state.minedRules[groupIndex].fileGroup, this.props.featureMetaData);
        this.props.onUpdateMinedRulePadState(groupIndex, clusterIndex, rulePadState, filesFolders);
    }

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
            this.setState({loadingStatus: true});
        } else {
            this.setState({message: "No rule is found."});
        }
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
        selectedGroupIndex: state.minedRulesState.minedRulePadState.selectedGroupIndex,
        selectedClusterIndex: state.minedRulesState.minedRulePadState.selectedClusterIndex
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onUpdateFeatureMetaData: (featureMetaData) => dispatch(updateFeatureMetaData(featureMetaData)),
        onUpdateGroupingMetaData: (groupingMetaData) => dispatch(updateGroupingMetaData(groupingMetaData)),
        onUpdateMinedRulePadState: (groupIndex, clusterIndex, rulePadState, filesFolders) =>
            dispatch(updateMinedRulePadState(groupIndex, clusterIndex, rulePadState, filesFolders)),
        onUpdateSelectedAlgorithm: (newAlgorithm) => dispatch(updateSelectedAlgorithm(newAlgorithm)),
        onUpdateNewRuleFromMinedRules: () => dispatch(updateNewRuleFromMinedRules()),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MiningRulesComponent);

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