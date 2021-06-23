/**
 * Created by saharmehrpour on 11/1/17.
 */

import React, {Component} from "react";
import "../../App.css";
import {connect} from "react-redux";
import {Button, Col, FormControl, FormGroup, Modal, Row} from "react-bootstrap";
import "rc-slider/assets/index.css";
// import Slider from "rc-slider";
// import Tooltip from "rc-tooltip/es";
import {IoIosArrowDroprightCircle, IoIosArrowDropleftCircle} from "react-icons/io";
import {IconContext} from "react-icons";

import {updateFeatureMetaData, updateGroupingMetaData} from "../../actions";
import Utilities from "../../core/utilities";
import {reduxStoreMessages} from "../../reduxStoreConstants";
import MinedRulePad from "./minedRulePad";
import {createGroupingMetaData, formGroupings} from "../../miningRulesCore/preProcessing";
import {createFeatureMetaDataMap} from "../../miningRulesCore/extractFeatures";
import {
    generateFeatures, prepareMapsToSend, combineFeatureSetToRulePadCompressed, grammarTextToRulePadGUI
} from "../../miningRulesCore/processing";
import {focusElementType, groupTitle} from "../../miningRulesCore/featureConfig";

class LearnDesignRulesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            featureRulePad: [],
            minedRules: [],
            loadingStatus: false, // for loading icons when mining rules
            loadingTitle: "Mining Design Rules",
            // minComplexity: 0,
            // maxComplexity: 100,
            // minSupport: 0,
            // maxSupport: 100,
        };
    }

    render() {
        return (
            <div className={"learningDesignRulesComponent overlayContainer"}>
                <div className={"mainDiv-overlay"}>
                {this.renderDefaultView()}
                {/*{this.renderButtonsSlidersFilter()}*/}
                <div className={"minedRulesComponent"}>
                    {this.renderFocusedElementInfo()}
                    {this.renderFeatureRulePad()}
                    {/*{this.renderMinedRulesRulePad()}*/}
                    {this.renderMinedRulesRulePad_new()}
                </div>
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

            case reduxStoreMessages.request_mine_rules_for_element_msg:
                this.setState({
                    minedRules: [],
                    loadingStatus: true,
                }, () => {
                    this.processFeaturesForSelectedScope();
                })
                break;

            case reduxStoreMessages.update_mined_rules_msg:
                this.setState({
                    minedRules: nextProps.minedRules,
                    loadingStatus: false,
                })
                break;

            case reduxStoreMessages.update_feature_metadata_msg:
                this.setState({
                    featureMetaData: nextProps.featureMetaData
                });
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

    /**
     * render the initial views
     * @return {null|*}
     */
    renderDefaultView() {
        if (this.state.minedRules.length > 0 || this.state.featureRulePad.length > 0)
            return (
                <div>
                    {this.renderLoading()}
                </div>
            );
        return (
            <div>
                <h3>Pick an element in the IDE, and select <strong>Mine Rules</strong> from the context menu.</h3>
            </div>
        )
    }


    /**
     * render loading gif
     * @return {null}
     */
    renderLoading() {
        return this.state.loadingStatus ? (
            <div className={"overlayLoading loadingMinedRulesContainer"}>
                <div className={"loadingMinedRules"}><h3>{this.state.loadingTitle}</h3></div>
                <div>
                    <div className="spinner"/>
                </div>
            </div>
        ) : null;
    }

    // /**
    //  * render the buttons and the sliders
    //  * @return {*}
    //  */
    // renderButtonsSlidersFilter() {
    //     // calculate the max and min number of attributes in mined rules
    //     let minNumberOfAttributes = Infinity;
    //     let maxNumberOfAttributes = -1 * Infinity;
    //     this.state.minedRules.forEach(group => {
    //         group["rules"].forEach(obj => {
    //             minNumberOfAttributes = Math.min(obj["attributes"].length, minNumberOfAttributes);
    //             maxNumberOfAttributes = Math.max(obj["attributes"].length, maxNumberOfAttributes);
    //         })
    //     });
    //
    //     // create marks for complexity slider IF there are mined rules
    //     let marksComplexity = {};
    //     if (this.state.minedRules.length > 0) {
    //         for (let i = minNumberOfAttributes; i <= maxNumberOfAttributes;
    //              i += Math.max(Math.floor((maxNumberOfAttributes - minNumberOfAttributes) / 8), 1))
    //             marksComplexity[i] = i;
    //     }
    //     marksComplexity[maxNumberOfAttributes] = maxNumberOfAttributes;
    //
    //     // // calculate the max and min number of files in mined rules
    //     // let minNumberOfFiles = Infinity;
    //     // let maxNumberOfFiles = -1 * Infinity;
    //     // this.state.minedRules.forEach(group => {
    //     //     minNumberOfFiles = Math.min(group["files"].length, minNumberOfFiles);
    //     //     maxNumberOfFiles = Math.max(group["files"].length, maxNumberOfFiles);
    //     // });
    //
    //     // // create marks for file slider IF there are mined rules
    //     // let marksFiles = {};
    //     // if (this.state.minedRules.length > 0) {
    //     //     for (let i = minNumberOfFiles; i <= maxNumberOfFiles;
    //     //          i += Math.max(Math.floor((maxNumberOfFiles - minNumberOfFiles) / 8), 1))
    //     //         marksFiles[i] = i;
    //     // }
    //     // marksFiles[maxNumberOfFiles] = maxNumberOfFiles;
    //
    //     if (this.state.minedRules.length === 0) return null;
    //
    //     return (
    //         <div className={"padding-bottom-25"}>
    //             <div className={"padding-bottom-25"}>
    //                 <Row className="show-grid">
    //                     <Col xsHidden md={2}>
    //                         Complexity
    //                     </Col>
    //                     <Col xs={5} md={5}>
    //                         <Slider.Range
    //                             step={1}
    //                             defaultValue={[minNumberOfAttributes, maxNumberOfAttributes]}
    //                             onAfterChange={(value) => this.setState({
    //                                 minComplexity: value[0],
    //                                 maxComplexity: value[1]
    //                             })}
    //                             min={minNumberOfAttributes}
    //                             max={maxNumberOfAttributes}
    //                             marks={marksComplexity}
    //                             handle={(props) => {
    //                                 // copied from rc-slider website
    //                                 const {value, dragging, index, ...restProps} = props;
    //                                 return (
    //                                     <Tooltip
    //                                         prefixCls="rc-slider-tooltip"
    //                                         overlay={value}
    //                                         visible={dragging}
    //                                         placement="top"
    //                                         key={index}
    //                                     >
    //                                         <Slider.Handle value={value} {...restProps} />
    //                                     </Tooltip>
    //                                 );
    //                             }}
    //                         />
    //                     </Col>
    //                     <Col xs={6} md={5}>
    //                         Min: {this.state.minComplexity}, max: {this.state.maxComplexity}
    //                     </Col>
    //                 </Row>
    //             </div>
    //             {/*<div className={"padding-top-25"}>*/}
    //             {/*    <Row className="show-grid">*/}
    //             {/*        <Col xsHidden md={2}>*/}
    //             {/*            Number of Files*/}
    //             {/*        </Col>*/}
    //             {/*        <Col xs={5} md={5}>*/}
    //             {/*            <Slider.Range*/}
    //             {/*                step={1}*/}
    //             {/*                defaultValue={[minNumberOfFiles, maxNumberOfFiles]}*/}
    //             {/*                onAfterChange={(value) => this.setState({*/}
    //             {/*                    minFiles: value[0],*/}
    //             {/*                    maxFiles: value[1]*/}
    //             {/*                })}*/}
    //             {/*                min={minNumberOfFiles}*/}
    //             {/*                max={maxNumberOfFiles}*/}
    //             {/*                marks={marksFiles}*/}
    //             {/*                handle={(props) => {*/}
    //             {/*                    // copied from rc-slider website*/}
    //             {/*                    const {value, dragging, index, ...restProps} = props;*/}
    //             {/*                    return (*/}
    //             {/*                        <Tooltip*/}
    //             {/*                            prefixCls="rc-slider-tooltip"*/}
    //             {/*                            overlay={value}*/}
    //             {/*                            visible={dragging}*/}
    //             {/*                            placement="top"*/}
    //             {/*                            key={index}*/}
    //             {/*                        >*/}
    //             {/*                            <Slider.Handle value={value} {...restProps} />*/}
    //             {/*                        </Tooltip>*/}
    //             {/*                    );*/}
    //             {/*                }}*/}
    //             {/*            />*/}
    //             {/*        </Col>*/}
    //             {/*        <Col xs={6} md={5}>*/}
    //             {/*            Min: {this.state.minSupport}, max: {this.state.maxSupport}*/}
    //             {/*        </Col>*/}
    //             {/*    </Row>*/}
    //             {/*</div>*/}
    //
    //             {this.state.minedRules.length === 0 ? null : (
    //                 <FilterComponent visitedFiles={this.state.visitedFiles}
    //                                  searchHistory={this.state.searchHistory}
    //                                  customFeatures={this.state.customFeatures}/>
    //             )}
    //         </div>
    //     )
    // }

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

    renderFeatureRulePad() {

        if (this.state.minedRules.length > 0 || this.state.featureRulePad.length === 0) return null;

        let mapped = this.state.featureRulePad.map((objEntries, i) => {
            let key = objEntries[0];
            /**
             * @type {{
             * elementFeatures: {element: string, featureIds: number[]}[],
             * rule: {grammarCompressed: string, rulePadStateCompressed: {guiElements, guiTree}}
             * }}
             */
            let groupObject = objEntries[1];

            return (
                <div key={i}>
                    <h4>{groupTitle[key] ? groupTitle[key] : key}</h4>
                    <div className={"generateRuleGui guiBoundingBox minedRuleBoundingBox"}>
                        <MinedRulePad key={new Date()} elementId={"0"} root
                                      rootTree={groupObject.rule.rulePadStateCompressed.guiTree}
                                      guiElements={groupObject.rule.rulePadStateCompressed.guiElements}
                                      styleClass={"rootContainer"}
                        />
                    </div>
                </div>
            )
        });

        return (
            <div>
                <div>{mapped}</div>
                <div>
                    <Button onClick={() => this.sendFeaturesForMiningRules()}>Approve</Button>
                </div>
            </div>
        )
    }


    /**
     * render each rule through either RulePad or simple rendering
     */
    renderMinedRulesRulePad_new() {
        if (this.state.minedRules.length === 0) return null;
        return this.state.minedRules.map((group, i) => {
            return (
                <div key={i}>
                    <h4>{groupTitle[group.group] ? groupTitle[group.group] : group.group}</h4>
                    {group.rules.map((rule, j) => {
                        return (
                            <div className={"generateRuleGui guiBoundingBox minedRuleBoundingBox"} key={j}>
                                <Row>
                                    <Col md={7}>
                                        <MinedRulePad key={new Date()} elementId={"0"} root
                                                      rootTree={rule.rulePadState.guiTree}
                                                      guiElements={rule.rulePadState.guiElements}
                                                      styleClass={"rootContainer"}
                                        />
                                    </Col>
                                    <Col md={5}>
                                        <h5><strong>
                                            Rule with {rule.featureIds.length} Attributes
                                        </strong></h5>
                                        <h5>{rule.grammar}</h5>
                                        <h5><strong>Support {rule.support}</strong></h5>
                                        <h5><strong>Utility {rule.utility}</strong></h5>
                                        <br/>
                                    </Col>
                                </Row>
                            </div>
                        )
                    })
                    }
                </div>
            )

        })
    }

    // /**
    //  * render each rule through either RulePad or simple rendering
    //  * @return {*}
    //  */
    // renderMinedRulesRulePad() {
    //     if (this.state.minedRules.length === 0) return null;
    //     return this.state.minedRules.map((group, i) => {
    //         /* {
    //                 primary: {attributes, grammar, support, utility, rulePadState: {guiTree: {}, guiElements: {}} },
    //                 cluster: cl.cluster,
    //             }
    //          */
    //         return (
    //             <div>
    //                 <h1>{group.fileType.replace("FeatureMap", "")}</h1>
    //                 {group.rules
    //                     .sort((rule_a, rule_b) => rule_b.primary.utility - rule_a.primary.utility)
    //                     .map((rule, j) => {
    //
    //                         let displayRule = rule.display === "p" ? rule.primary : rule.cluster[rule.display];
    //                         // if RulePad is unable to visualize the rule
    //                         if (Object.keys(displayRule.rulePadState.guiTree).length === 0) {
    //                             return (
    //                                 <div key={`${i}_${j}`} className={"minedFrequentItemSetRawDisplay"}>
    //                                     <h4>{displayRule.grammar}</h4>
    //                                     {displayRule.attributes.map((attr, k) => {
    //                                         return (
    //                                             <Row className={"attrRowContainer"} key={k}>
    //                                                 <Col className={"attrId"} md={1}>{attr}</Col>
    //                                             </Row>)
    //                                     })}
    //                                 </div>)
    //                         }
    //
    //                         // rendering RulePad
    //                         return (
    //                             <div className={"generateRuleGui guiBoundingBox minedRuleBoundingBox"}
    //                                  style={{minHeight: "400px"}}
    //                                  key={`${i}_${j}`}>
    //                                 <h5><strong>There are {rule.cluster.length} similar rules.</strong></h5>
    //                                 {rule.display === "p" ?
    //                                     (<IconContext.Provider value={{color: "grey"}}>
    //                                             <div style={{float: "left"}}>
    //                                                 <IoIosArrowDropleftCircle size={30}/>
    //                                             </div>
    //                                         </IconContext.Provider>
    //                                     )
    //                                     :
    //                                     (
    //                                         <div style={{float: "left"}}>
    //                                             <IoIosArrowDropleftCircle size={30} onClick={() => {
    //                                                 let newState = this.state.minedRules;
    //                                                 newState[i].rules[j].display === 0 ? newState[i].rules[j].display = "p" :
    //                                                     newState[i].rules[j].display -= 1
    //                                                 this.setState({minedRules: newState})
    //                                             }}/>
    //                                         </div>
    //                                     )
    //                                 }
    //                                 {rule.cluster.length !== 0 && rule.display !== rule.cluster.length - 1 ?
    //                                     (
    //                                         <div>
    //                                             <IoIosArrowDroprightCircle size={30} onClick={() => {
    //                                                 let newState = this.state.minedRules;
    //                                                 newState[i].rules[j].display === "p" ? newState[i].rules[j].display = 0 :
    //                                                     newState[i].rules[j].display += 1
    //                                                 this.setState({minedRules: newState})
    //                                             }}/>
    //                                         </div>
    //                                     )
    //                                     :
    //                                     (
    //                                         <IconContext.Provider value={{color: "grey"}}>
    //                                             <div>
    //                                                 <IoIosArrowDroprightCircle size={30}/>
    //                                             </div>
    //                                         </IconContext.Provider>
    //                                     )
    //                                 }
    //                                 <Row>
    //                                     <Col md={7}>
    //                                         <MinedRulePad key={new Date()} elementId={"0"} root
    //                                                       rootTree={displayRule.rulePadState.guiTree}
    //                                                       guiElements={displayRule.rulePadState.guiElements}
    //                                                       styleClass={"rootContainer"}
    //                                         />
    //
    //                                     </Col>
    //                                     <Col md={5}>
    //                                         <h4>{rule.display === "p" ? "Primary Rule" : `Similar Rule ${rule.display + 1}`}</h4>
    //                                         <h5><strong>
    //                                             Rule with {displayRule.attributes.length} Attributes
    //                                         </strong></h5>
    //                                         <h5>{displayRule.grammar}</h5>
    //                                         <h5><strong>Support {displayRule.support}</strong></h5>
    //                                         <h5><strong>Utility {displayRule.utility}</strong></h5>
    //                                         <br/>
    //                                     </Col>
    //                                 </Row>
    //                             </div>
    //                         )
    //                     })
    //                 }
    //             </div>
    //         )
    //     });
    // }


    /**
     * Find the groupings
     * Since the method is called after reduxStoreMessages.project_path_msg
     * the projectPath is not updated in the props yet.
     */
    preProcessGroupings() {
        let groupingMetaData = new createGroupingMetaData();
        formGroupings(this.props.xmlFiles, this.props.projectPath, groupingMetaData);
        console.log({groupingMetaData});
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
        Promise
            .all([combineFeatureSetToRulePadCompressed(featureMetaData)]) // combineFeatureSetToRulePad(featureMetaData)
            .then(() => {
                this.setState({
                    featureRulePad: Object.entries(featureMetaData.featureGroups.spec)
                        .concat(Object.entries(featureMetaData.featureGroups.usage)),
                    loadingStatus: false,
                });
                this.props.onUpdateFeatureMetaData(featureMetaData);
                console.log({featureMetaData})
            });

    }

    /**
     * after the user selected the features, the feature weights get updated and are sent to server
     */
    processSelectedFeaturesRulePad() {

    }

    /**
     * selected features are sent to the server for mining rules
     */
    sendFeaturesForMiningRules() {
        let messages = prepareMapsToSend(this.props.featureMetaData)
        for (let message of messages) {
            Utilities.sendToServer(this.props.ws, message.command, message.data);
        }
        this.setState({loadingStatus: true});
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onUpdateFeatureMetaData: (featureMetaData) => dispatch(updateFeatureMetaData(featureMetaData)),
        onUpdateGroupingMetaData: (groupingMetaData) => dispatch(updateGroupingMetaData(groupingMetaData)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(LearnDesignRulesComponent);