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
    updateFeatureMetaData, updateSelectedMinedCluster, updateGroupingMetaData, updateMinedRulePadState
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
import {createRulePadStateForItemSet} from "../../miningRulesCore/postProcessing";

class MiningRulesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            minedRules: [],
            loadingStatus: false, // for loading icons when mining rules
            loadingTitle: "Mining Rules",
            showSelectedCluster: false,
            selectedGroupIndex: props.selectedGroupIndex,
            selectedClusterIndex: props.selectedClusterIndex
        };
    }

    render() {
        return (
            <div className={"miningRulesComponent overlayContainer"}>
                <div className={"mainDiv-overlay"}>
                {this.renderDefaultView()}
                    {this.state.showSelectedCluster ? this.renderSelectedCluster() : (
                        <div className={"minedRulesComponent"}>
                            {this.renderFocusedElementInfo()}
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
                this.setState({
                    minedRules: [],
                    loadingTitle: "Extracting Features",
                    loadingStatus: true,
                    showSelectedCluster: false
                });
                break;

            case reduxStoreMessages.request_mine_rules_for_element_msg:
                this.setState({
                    minedRules: [],
                    loadingTitle: "Mining Rules",
                    loadingStatus: true,
                    showSelectedCluster: false
                }, this.processFeaturesForSelectedScope);
                break;

            case reduxStoreMessages.update_mined_rules_msg:
                this.setState({
                    minedRules: nextProps.minedRules,
                    loadingStatus: false,
                    showSelectedCluster: false,
                });
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

            case reduxStoreMessages.save_feature_selection_msg:
                this.setState({
                    customFeatures: nextProps.customFeatures
                });
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
                <h3>Pick an element in the IDE, and select <strong>Mine Rules</strong> from the context menu.</h3>
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
                <div style={{marginBottom: "60px"}}>
                    <h4><strong>Focused Element </strong>{nodeTitle} with identifier <code>{identifier}</code></h4>
                    <h4>{filePath}</h4>
                </div>
            )
        }
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
        return this.state.minedRules.map((group, groupIndex) => {
            if (group.rulePadStates.length === 0) {
                return (
                    <div key={groupIndex}>
                        <h4><strong>{"No rules found for "}
                            {featureGroupInformation[group.fileGroup].desc}</strong></h4>
                    </div>)
            } else {
                return (
                    <div key={groupIndex}>
                        <h4>{featureGroupInformation[group.fileGroup].desc}</h4>
                        {group.rulePadStates.map((_, clusterIndex) => process(group, groupIndex, clusterIndex))}
                    </div>)
            }
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
                        <h5><strong>Size of the cluster: </strong>{clusterObject.cluster.length}</h5>
                        <h5><strong>Average frequency (Support) of cluster members: </strong>
                            {clusterObject.averageSupport}
                        </h5>
                    </Col>
                </Row>
            </div>

            <div className={"generateRuleGui guiBoundingBox"}>
                <Row>
                    <Col md={8}>
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
        generateFeatures(this.props.xmlFiles, this.props.projectPath, this.props.focusedElementData,
            this.props.doiInformation, this.props.groupingMetaData, featureMetaData);

        this.setState({loadingStatus: false}
            , () => this.props.onUpdateFeatureMetaData(featureMetaData)
        );
    }

    /**
     * selected features are sent to the server for mining rules
     */
    sendFeaturesForMiningRules() {
        let messages = prepareFilesAndRequestMineRules(this.props.featureMetaData)
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
        this.props.onUpdateMinedRulePadState(groupIndex, clusterIndex, rulePadState);
        // this.props.onUpdateSelectedMinedCluster(clusterIndex, groupIndex)
    }

}

function mapStateToProps(state) {
    return {
        message: state.message,
        ws: state.ws,
        xmlFiles: state.xmlFiles,
        featureMetaData: state.minedRulesState.featureMetaData,
        groupingMetaData: state.minedRulesState.groupingMetaData,
        focusedElementData: state.minedRulesState.focusedElementData,
        doiInformation: state.minedRulesState.doiInformation,
        minedRules: state.minedRulesState.minedRules,
        projectPath: state.projectPath,
        selectedGroupIndex: state.minedRulesState.minedRulePadState.selectedGroupIndex,
        selectedClusterIndex: state.minedRulesState.minedRulePadState.selectedClusterIndex
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onUpdateFeatureMetaData: (featureMetaData) => dispatch(updateFeatureMetaData(featureMetaData)),
        onUpdateGroupingMetaData: (groupingMetaData) => dispatch(updateGroupingMetaData(groupingMetaData)),
        onUpdateSelectedMinedCluster: (groupIndex, clusterIndex) =>
            dispatch(updateSelectedMinedCluster(groupIndex, clusterIndex)),
        onUpdateMinedRulePadState: (groupIndex, clusterIndex, rulePadState) =>
            dispatch(updateMinedRulePadState(groupIndex, clusterIndex, rulePadState))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MiningRulesComponent);