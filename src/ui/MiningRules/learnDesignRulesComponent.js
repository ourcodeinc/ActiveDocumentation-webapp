/**
 * Created by saharmehrpour on 11/1/17.
 */

import React, {Component} from "react";
import "../../App.css";
import {connect} from "react-redux";
import {Button, Col, Row} from "react-bootstrap";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import Tooltip from "rc-tooltip/es";

import {mineRulesFromXmlFiles} from "../../miningRulesCore/miningRules";
import {ignoreFileChange, updateMetaData} from "../../actions";
import {verifyPartialTextBasedOnGrammar} from "../../core/languageProcessing";
import {generateGuiTrees} from "../RulePad/rulePadTextualEditor/generateGuiTree";
import Utilities from "../../core/utilities";
import {webSocketSendMessage} from "../../core/coreConstants";
import {reduxStoreMessages} from "../../reduxStoreConstants";
import MinedRulePad from "./minedRulePad";
import FilterComponent from "./filterComponent";



class LearnDesignRulesComponent extends Component {

    constructor(props) {
        super(props);

        this.fpMaxSupport = 60; // default support value

        this.state = {
            minedRules: [],

            loading: false, // for loading icons when mining rules
            doiLoading: false, // for fetching doi information

            minComplexity: 0,
            maxComplexity: 100,
            minFiles: 1,
            maxFiles: 10,

            // DOI information

            visitedFiles:[],
            searchHistory: [],
            visitedElements: [],
            customFeatures: []
        };
    }

    render() {
        return (
            <div className={"learningDesignRulesComponent overlayContainer"}>
                <div className={"mainDiv-overlay"}>

                {this.renderDefaultView()}
                {this.renderButtonsAndSliders()}
                {this.state.minedRules.length === 0 ? null : (
                    <FilterComponent visitedFiles={this.state.visitedFiles}
                                     searchHistory={this.state.searchHistory}
                                     customFeatures={this.state.customFeatures}/>
                )}
                <div className={"minedRulesComponent"}>
                    {this.renderMinedRulePad()}
                </div>
                </div>
                {this.renderLoading()}
                {this.renderDoiLoading()}
            </div>
        )
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.message === reduxStoreMessages.update_mined_rules_msg) {
            // calculate the max and min number of attributes in mined rules
            let minAttr = Infinity;
            let maxAttr = -1 * Infinity;
            nextProps.minedRules.forEach(group => {
                group["attributes"].forEach(list => {
                    minAttr = Math.min(list.length, minAttr);
                    maxAttr = Math.max(list.length, maxAttr);
                })
            });

            // calculate the max and min number of files in mined rules
            let minFiles = Infinity;
            let maxFiles = -1 * Infinity;
            nextProps.minedRules.forEach(group => {
                minFiles = Math.min(group["files"].length, minFiles);
                maxFiles = Math.max(group["files"].length, maxFiles);
            });

            Promise.all(this.processRawMinedRulesPromises(nextProps.minedRules))
                .then(processedMinedRules => {
                    this.setState({
                        minedRules: processedMinedRules,
                        loading: false,
                        minComplexity: minAttr,
                        maxComplexity: maxAttr,
                        minFiles: minFiles,
                        maxFiles: maxFiles
                    })
                })

        } else if (nextProps.message === reduxStoreMessages.update_doi_information_msg) {
            this.setState({
                visitedFiles: nextProps.visitedFiles,
                searchHistory: nextProps.searchHistory,
                visitedElements: nextProps.visitedElements,

                loading: true,
                doiLoading: false
            }, () => this.doMineRules())

        } else if (nextProps.message === reduxStoreMessages.save_feature_selection_msg) {
            this.setState({
                customFeatures: nextProps.customFeatures
            })
        }
    }

    /**
     * render the initial views
     * @return {null|*}
     */
    renderDefaultView() {
        if (this.state.minedRules.length > 0)
            return (
                <div>
                    {this.renderLoading()}
                    {this.renderDoiLoading()}

                    <Button onClick={() => this.doRequestMineRules()}>Search Again</Button>
                </div>
            );
        return (
            <div>
                {this.renderLoading()}
                {this.renderDoiLoading()}

                <Button disabled={false} onClick={() => this.doRequestMineRules()}>Find Design Rules In Code</Button>
                <Button onClick={() => this.ShowMinedRules()}>Show Mined Rules</Button>
            </div>
        )
    }


    /**
     * render loading gif
     * @return {null}
     */
    renderLoading() {
        return this.state.loading ? (
            <div className={"overlay loadingMinedRulesContainer"}>
                <div className={"loadingMinedRules"}><h3>Mining Design Rules</h3></div>
                <div>
                    <div className="spinner"/>
                </div>
            </div>
        ) : null;
    }

    /**
     * render loading gif for loading DOI information
     * @return {null}
     */
    renderDoiLoading() {
        return this.state.doiLoading ? (
            <div className={"overlay loadingMinedRulesContainer"}>
                <div className={"loadingMinedRules"}><h3>Fetching DOI Information</h3></div>
                <div>
                    <div className="spinner"/>
                </div>
            </div>
        ) : null;
    }

    /**
     * render the buttons and the sliders
     * @return {*}
     */
    renderButtonsAndSliders() {
        // calculate the max and min number of attributes in mined rules
        let minNumberOfAttributes = Infinity;
        let maxNumberOfAttributes = -1 * Infinity;
        this.state.minedRules.forEach(group => {
            group["rules"].forEach(obj => {
                minNumberOfAttributes = Math.min(obj["attributes"].length, minNumberOfAttributes);
                maxNumberOfAttributes = Math.max(obj["attributes"].length, maxNumberOfAttributes);
            })
        });

        // create marks for complexity slider IF there are mined rules
        let marksComplexity = {};
        if (this.state.minedRules.length > 0) {
            for (let i = minNumberOfAttributes; i <= maxNumberOfAttributes;
                 i += Math.max(Math.floor((maxNumberOfAttributes - minNumberOfAttributes) / 8), 1))
                marksComplexity[i] = i;
        }
        marksComplexity[maxNumberOfAttributes] = maxNumberOfAttributes;

        // calculate the max and min number of files in mined rules
        let minNumberOfFiles = Infinity;
        let maxNumberOfFiles = -1 * Infinity;
        this.state.minedRules.forEach(group => {
            minNumberOfFiles = Math.min(group["files"].length, minNumberOfFiles);
            maxNumberOfFiles = Math.max(group["files"].length, maxNumberOfFiles);
        });

        // create marks for file slider IF there are mined rules
        let marksFiles = {};
        if (this.state.minedRules.length > 0) {
            for (let i = minNumberOfFiles; i <= maxNumberOfFiles;
                 i += Math.max(Math.floor((maxNumberOfFiles - minNumberOfFiles) / 8), 1))
                marksFiles[i] = i;
        }
        marksFiles[maxNumberOfFiles] = maxNumberOfFiles;

        if (this.state.minedRules.length === 0) return null;

        return (
            <div className={"padding-bottom-25"}>
                <div className={"padding-bottom-25"}>
                    <Row className="show-grid">
                        <Col xsHidden md={2}>
                            Complexity
                        </Col>
                        <Col xs={5} md={5}>
                            <Slider.Range
                                step={1}
                                defaultValue={[minNumberOfAttributes, maxNumberOfAttributes]}
                                onAfterChange={(value) => this.setState({
                                    minComplexity: value[0],
                                    maxComplexity: value[1]
                                })}
                                min={minNumberOfAttributes}
                                max={maxNumberOfAttributes}
                                marks={marksComplexity}
                                handle={(props) => {
                                    // copied from rc-slider website
                                    const {value, dragging, index, ...restProps} = props;
                                    return (
                                        <Tooltip
                                            prefixCls="rc-slider-tooltip"
                                            overlay={value}
                                            visible={dragging}
                                            placement="top"
                                            key={index}
                                        >
                                            <Slider.Handle value={value} {...restProps} />
                                        </Tooltip>
                                    );
                                }}
                            />
                        </Col>
                        <Col xs={6} md={5}>
                            Min: {this.state.minComplexity}, max: {this.state.maxComplexity}
                        </Col>
                    </Row>
                </div>
                <div className={"padding-top-25"}>
                    <Row className="show-grid">
                        <Col xsHidden md={2}>
                            Number of Files
                        </Col>
                        <Col xs={5} md={5}>
                            <Slider.Range
                                step={1}
                                defaultValue={[minNumberOfFiles, maxNumberOfFiles]}
                                onAfterChange={(value) => this.setState({
                                    minFiles: value[0],
                                    maxFiles: value[1]
                                })}
                                min={minNumberOfFiles}
                                max={maxNumberOfFiles}
                                marks={marksFiles}
                                handle={(props) => {
                                    // copied from rc-slider website
                                    const {value, dragging, index, ...restProps} = props;
                                    return (
                                        <Tooltip
                                            prefixCls="rc-slider-tooltip"
                                            overlay={value}
                                            visible={dragging}
                                            placement="top"
                                            key={index}
                                        >
                                            <Slider.Handle value={value} {...restProps} />
                                        </Tooltip>
                                    );
                                }}
                            />
                        </Col>
                        <Col xs={6} md={5}>
                            Min: {this.state.minFiles}, max: {this.state.maxFiles}
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }

    /**
     * render each rule through either RulePad or simple rendering
     * @return {*}
     */
    renderMinedRulePad() {
        return this.state.minedRules.map((group, i) => {
                if (group["files"].length < this.state.minFiles || group["files"].length > this.state.maxFiles)
                    return null;

                return group["rules"].map((rule, j) => {
                        if (rule["attributes"].length < this.state.minComplexity || rule["attributes"].length > this.state.maxComplexity)
                            return null;

                        // if RulePad is unable to visualize the rule
                        if (Object.keys(rule.rulePadState.guiTree).length === 0) {
                            return (
                                <div key={`${i}_${j}`} className={"minedFrequentItemSetRawDisplay"}>
                                    <h4>{rule["grammar"]}</h4>
                                    {rule["attributes"].map((attr, j) => {
                                        return (
                                            <Row className={"attrRowContainer"} key={j}>
                                                <Col className={"attrId"} md={1}>{attr["id"]}</Col>
                                                <Col className={"attrDesc"} md={9}>{attr["attr"]}</Col>
                                                {/*<div className={"attrQuery"}>{attr["query"]}</div>*/}
                                            </Row>)
                                    })}
                                    <h4 style={{backgroundColor: "lightgrey", padding: "5px"}}>Number of
                                        Files: {group["files"].length}</h4>
                                </div>)
                        }

                        // rendering RulePad
                        return (
                            <div className={"generateRuleGui guiBoundingBox minedRuleBoundingBox"} key={`${i}_${j}`}>
                                <Row>
                                    <Col md={7}>
                                        <MinedRulePad key={new Date()} elementId={"0"} root
                                                      rootTree={rule.rulePadState.guiTree}
                                                      guiElements={rule.rulePadState.guiElements}
                                                      styleClass={"rootContainer"}
                                        />
                                        <div style={{paddingTop: "10px"}}>
                                            {rule["nonDisplayableAttr"].map((attr, j) => {
                                                return (
                                                    <Row className={"attrRowContainer"} key={j}>
                                                        <Col className={"attrId"} md={1}>{attr["id"]}</Col>
                                                        <Col className={"attrDesc"} md={9}>{attr["attr"]}</Col>
                                                        {/*<div className={"attrQuery"}>{attr["query"]}</div>*/}
                                                    </Row>)
                                            })}
                                        </div>
                                    </Col>
                                    <Col md={5}>
                                        <h5><strong>
                                            Rule with {rule["displayableAttr"].length} out
                                            of {rule["attributes"].length} Attributes
                                        </strong></h5>
                                        {rule["grammar"]}

                                        <h5><strong>
                                            {group["files"].length > 10 ? "10 out of " : ""}
                                            {group["files"].length} Matches in Code
                                        </strong></h5>
                                        {group["files"].filter((d, j) => j < 10).map((fileName, i) => (
                                            <div key={i} className={"ruleLink"}
                                                 onClick={() => {
                                                     this.props.onIgnoreFile(true);
                                                     Utilities.sendToServer(this.props.ws, webSocketSendMessage.open_file_mined_rules, fileName)
                                                 }}>
                                                {fileName
                                                    .replace(this.props.projectPath.slice(0), "")
                                                    .replace(this.props.projectPath.slice(1), "")}
                                            </div>
                                        ))}
                                    </Col>
                                </Row>

                            </div>
                        )
                    }
                )
            }
        );
    }

    /**
     * send command to mine rules
     */
    doRequestMineRules() {
        this.setState({minedRules: [], doiLoading: true});
        Utilities.sendToServer(this.props.ws, webSocketSendMessage.send_doi_information_msg, "")
    }

    doMineRules() {
        let metaData = {};
        mineRulesFromXmlFiles(this.props.xmlFiles, metaData, this.props.ws,
            this.fpMaxSupport, [], this.state.searchHistory, []);
        this.props.onUpdateMetaData(metaData);
    }

    /**
     * request for reading the existing data from file
     */
    ShowMinedRules() {
        this.setState({minedRules: [], loading: true});
        Utilities.sendToServer(this.props.ws, webSocketSendMessage.dangerous_read_mined_rules_msg);
    }

    /**
     * compute the GUI states of received mined itemSets
     * @param rawRules
     * [{
     *    attributes: [
     *          [{id: "", attr:"", query: ""}, {id: "", attr:"", query: ""}] ,
     *          [{id: "", attr:"", query: ""}, {id: "", attr:"", query: ""}]
     *          ]
     *    files: ["file1", "file2]
     * }]
     * returns array of Promises
     * [{
     *     rules: [
     *         {
     *              attributes: [],
     *              grammar: "",
     *              displayableAttr:[],
     *              nonDisplayableAttr: [],
     *              rulePadState: {guiTree: {}, guiElements: {}}
     *         },
     *         {
     *              attributes: [],
     *              grammar: "",
     *              displayableAttr:[],
     *              nonDisplayableAttr: [],
     *              rulePadState: {guiTree: {}, guiElements: {}}
     *         }
     *     ],
     *     files: ["file1", "file2]
     * }]
     */
    processRawMinedRulesPromises(rawRules) {
        return rawRules.map(group => {
            return Promise.all(group["attributes"].map(attrArray => {
                let arrayDisplayable = [], arrayNonDisplayable = [];
                for (let attr of attrArray) {
                    if (attr["attr"].startsWith("class with"))
                        arrayDisplayable.push(attr["attr"].substring(10));
                    else
                        arrayNonDisplayable.push(attr);
                }


                let text = "class with " + arrayDisplayable.join(" and");
                text = text.replace(/ {2}/g, " ")
                    .replace(/\)/g, " )")
                    .replace(/\( /g, "(")
                    .replace(/\) /g, ")")
                    .replace(/ {2}/g, " ");

                return this.grammarTextToRulePadGUI(text)
                    .then(rulePadState => {
                        return {
                            attributes: attrArray,
                            grammar: text,
                            displayableAttr: arrayDisplayable,
                            nonDisplayableAttr: arrayNonDisplayable, // subset of attributes
                            rulePadState: rulePadState // {guiTree: {}, guiElements: {}}
                        }
                    });
            })).then(rules => {
                return {
                    rules: rules,
                    files: group["files"]
                }
            })

        })
    }


    /**
     * @param grammarText
     * @return {Promise<T | {guiTree: {}, guiElements: {}}>|Promise<{guiTree: {}, guiElements: {}}>}
     */
    grammarTextToRulePadGUI(grammarText) {
        // the "classes" token must have an space at the end
        let result = verifyPartialTextBasedOnGrammar(grammarText + " ");
        if (result.error) {
            console.log("error happened in parsing");//, grammarText);//, result.listOfErrors);
            console.log(result.listOfErrors);
            return Promise.resolve({guiTree: {}, guiElements: {}});
        }

        return generateGuiTrees(result.grammarTree)
            .then((tree) => {
                return {guiTree: tree.guiTree, guiElements: tree.guiElements}
            })
            .catch((error) => {
                console.error("error happened in creating the guiTree", grammarText, error);
                return {guiTree: {}, guiElements: {}}
            });
    }

}

function mapStateToProps(state) {

    let search = Object.keys(state.doiInformation.searchHistory)
        .map(key => state.doiInformation.searchHistory[key])
        .flat();
    let visited = state.doiInformation.visitedElements
        .map(d => {
            return d.xpathQueries.map(dd => {
                return {
                    featureDescription: dd.featureDescription,
                    featureXpath: dd.featureXpath,
                    srcmlXpath: dd.srcmlXpath
                }
            })
        })
        .flat();
    let files = Object.keys(state.doiInformation.visitedFiles).map(d => {
        return {
            fileName: d.substring(d.lastIndexOf("/")+1, d.length),
            count: state.doiInformation.visitedFiles[d]
        }
    });

    return {
        message: state.message,
        ws: state.ws,
        xmlFiles: state.xmlFiles,
        metaData: state.minedRulesState.metaData,
        minedRules: state.minedRulesState.minedRules,
        projectPath: state.projectPath,
        customFeatures: state.doiInformation.customFeatures,
        visitedFiles: files,
        searchHistory: search,
        visitedElements: visited
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onIgnoreFile: (shouldIgnore) => dispatch(ignoreFileChange(shouldIgnore)),
        onUpdateMetaData: (metaData) => dispatch(updateMetaData(metaData))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(LearnDesignRulesComponent);