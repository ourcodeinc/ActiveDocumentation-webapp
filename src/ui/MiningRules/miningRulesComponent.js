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
    updateSelectedAlgorithm
} from "../../actions";
import Utilities from "../../core/utilities";
import {reduxStoreMessages} from "../../reduxStoreConstants";
import {createGroupingMetaData, formGroupings} from "../../miningRulesCore/preProcessing";
import {createFeatureMetaDataMap} from "../../miningRulesCore/extractFeatures";
import {generateFeatures, prepareFilesAndRequestMineRules} from "../../miningRulesCore/processing";
import {focusElementType, featureGroupInformation} from "../../miningRulesCore/featureConfig";
import MinedClusterRulePad from "./minedClusterRulePad";
import {constantRuleIndex} from "../uiConstants";
import RulePad from "../RulePad/rulePad";
import {
    createRulePadStateForItemSet,
    findFileFoldersForItemSet,
    switchAlgorithm
} from "../../miningRulesCore/postProcessing";
import {webSocketSendMessage} from "../../core/coreConstants";

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
                }
                else {
                    this.setState({
                        minedRules: nextProps.minedRules,
                        loadingStatus: false,
                        showSelectedCluster: false,
                        message: `${countRules} rules are found.`,
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
                    <h4><strong>Focused Element </strong>{nodeTitle} with identifier <code>{identifier}</code></h4>
                    <h4>{filePath}</h4>
                </div>
            )
        }
    }
    
    renderMessages() {
        if (this.state.loadingStatus) {
            return null;
        }
        let countRules = this.state.minedRules.reduce((sum, group) => sum + group.rulePadStates.length, 0);
        let nextAlgorithmExist = !!switchAlgorithm(this.props.selectedAlgorithm);
        return(
            <div style={{marginBottom: "40px"}}>
                <h4>{this.state.message}</h4>
                {countRules === 0 || !nextAlgorithmExist ? null : (
                    <Button onClick={()=> this.tryDifferentAlgorithm()}>Try again.</Button>
                )}
            </div>
        )
    }

    renderMinedClusters() {
        let process = (group, groupIndex, clusterIndex) => {
            let clusterObject = group.clusters[clusterIndex];
            let rulePadState = group.rulePadStates[clusterIndex];
            let fileGroup = group.fileGroup;
            return (<div>
                <div className={"generateRuleGui guiBoundingBox minedRuleBoundingBox"}>
                    <Row>
                        <Col md={8}>
                            <MinedClusterRulePad key={new Date()} rulePadState={rulePadState}
                                          featureMetaData={this.state.featureMetaData} fileGroup={fileGroup}/>
                        </Col>
                        <Col md={3}>
                            <h5><strong>Sum of feature weights in the cluster: </strong>{clusterObject.sumWeights}</h5>
                            <h5><strong>Average utility of itemSets in the cluster: </strong>
                                {clusterObject.cluster.reduce((sum, itemSet) => sum + itemSet.utility, 0)}</h5>
                            <h5><strong>Size of the cluster: </strong>{clusterObject.cluster.length}</h5>
                            <h5><strong>Average frequency (Support) of cluster members: </strong>
                                {clusterObject.averageSupport}
                            </h5>
                            <Button onClick={() => this.updateSelectedMinedCluster(groupIndex, clusterIndex)}>
                                Explore</Button>
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
        return this.state.minedRules.map((group, groupIndex) => {
            return (group.rulePadStates.length === 0) ? null : (
                <div key={groupIndex}>
                    <h4><strong>{featureGroupInformation[group.fileGroup].desc}</strong></h4>
                    {group.rulePadStates.map((_, clusterIndex) => process(group, groupIndex, clusterIndex))}
                </div>)
        })
    }

    renderSelectedCluster() {
        let clusterObject = this.state.minedRules[this.state.selectedGroupIndex]
            .clusters[this.state.selectedClusterIndex];
        let rulePadState = this.state.minedRules[this.state.selectedGroupIndex]
            .rulePadStates[this.state.selectedClusterIndex];
        let fileGroup = this.state.minedRules[this.state.selectedGroupIndex].fileGroup;
        return (<div className={"minedRulesComponent"}>
            <div className={"generateRuleGui guiBoundingBox minedRuleBoundingBox"}>
                <Row>
                    <Col md={8}>
                        <MinedClusterRulePad key={new Date()} rulePadState={rulePadState}
                                             featureMetaData={this.state.featureMetaData} fileGroup={fileGroup}/>
                    </Col>
                    <Col md={3}>
                        <h5><strong>Sum of feature weights in the cluster: </strong>{clusterObject.sumWeights}</h5>
                        <h5><strong>Average utility of itemSets in the cluster: </strong>
                            {clusterObject.cluster.reduce((sum, itemSet) => sum + itemSet.utility, 0)}</h5>
                        <h5><strong>Size of the cluster: </strong>{clusterObject.cluster.length}</h5>
                        <h5><strong>Average frequency (Support) of cluster members: </strong>
                            {clusterObject.averageSupport}
                        </h5>
                    </Col>
                </Row>
            </div>
            <div>
                <h3>Example Rule from this cluster.</h3>
            </div>
            <div className={"generateRuleGui guiBoundingBox"}>
                <Row>
                    <Col md={12}>
                        <RulePad ruleIndex={constantRuleIndex.minedRuleIndex}/>
                    </Col>
                </Row>
            </div>

            <Button onClick={() => this.setState({showSelectedCluster: false})}>Close</Button>
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
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MiningRulesComponent);