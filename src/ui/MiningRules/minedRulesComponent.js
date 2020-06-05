/**
 * Created by saharmehrpour on 11/1/17.
 */

import React, {Component, Fragment} from "react";
import "../../App.css";
import {connect} from "react-redux";
import {Button, Row, Col, ButtonGroup} from "react-bootstrap";
import Slider from "rc-slider";
import Tooltip from "rc-tooltip";
import "rc-slider/assets/index.css";
import "three-dots"


import {mineRulesFromXmlFiles} from "../../miningRulesCore/miningRules";
import {ignoreFileChange, updateMetaData} from "../../actions";
import MinedRulePad from "./minedRulePad";
import {verifyPartialTextBasedOnGrammar} from "../../core/languageProcessing";
import {generateGuiTrees} from "../RulePad/rulePadTextualEditor/generateGuiTree";
import Utilities from "../../core/utilities";
import {webSocketSendMessage} from "../../core/coreConstants";


class MinedRulesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            algorithm: "FP_MAX", // FP_MAX or TNR

            fpMaxSupport: 60,
            tnrConfidence: 60,
            tnrK: 20,
            tnrDelta: 2,

            minedRules: [],
            displayedMinedRules: [],
            loading: false, // for loading icons when mining rules

            minComplexity: 0,
            maxComplexity: 100,

            minFiles: 1,
            maxFiles: 10
        };
    }

    render() {
        return (
            <div className={"minedRulesComponent"}>
                {this.renderButtonsAndSliders()}
                {this.renderLoading()}
                {this.renderMinedRulePad()}
            </div>
        )
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.message === "UPDATE_MINED_RULES") {
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
                        displayedMinedRules: processedMinedRules,
                        loading: false,
                        minComplexity: minAttr,
                        maxComplexity: maxAttr,
                        minFiles: minFiles,
                        maxFiles: maxFiles
                    })
                })
        }
    }


    /**
     * render the buttons and the sliders
     * @return {*}
     */
    renderButtonsAndSliders() {
        // create marks for fpMaxSupport slider
        let marksHundred = {};
        for (let i = 10; i <= 100; i += 10)
            marksHundred[i] = i;

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
            for (let i = minNumberOfAttributes; i <= maxNumberOfAttributes; i += Math.floor((maxNumberOfAttributes - minNumberOfAttributes) / 8))
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
            for (let i = minNumberOfFiles; i <= maxNumberOfFiles; i += Math.floor((maxNumberOfFiles - minNumberOfFiles) / 8))
                marksFiles[i] = i;
        }
        marksFiles[maxNumberOfFiles] = maxNumberOfFiles;

        return (
            <div>
                <div>
                    <Row className="show-grid" style={{padding: "20px 0"}}>
                        <ButtonGroup>
                            <Button onClick={() => this.setState({algorithm: "FP_MAX"})}
                                    active={this.state.algorithm === "FP_MAX"}>FP_MAX</Button>
                            <Button onClick={() => this.setState({algorithm: "TNR"})}
                                    active={this.state.algorithm === "TNR"}>TNR</Button>
                            <Button onClick={() => this.setState({algorithm: "NONE"})}
                                    active={this.state.algorithm === "TNR"}>View Existing Mined Rules</Button>
                        </ButtonGroup>
                    </Row>
                    {this.state.algorithm === "FP_MAX" ? (
                        <Row className="show-grid">
                            <Col xsHidden md={2}>
                                FP_Max Support
                            </Col>
                            <Col xs={5} md={5}>
                                <Slider
                                    defaultValue={60}
                                    min={10}
                                    max={100}
                                    marks={marksHundred}
                                    included={false}
                                    onChange={(value) => this.setState({fpMaxSupport: value})}
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
                            <Col xs={1} md={1}>
                                {this.state.fpMaxSupport}%
                            </Col>
                            <Col xs={6} md={4}>
                                <div style={{float: "right"}}>
                                    <Button onClick={() => this.doMineRules("FP_MAX")} style={{padding: "0 5px"}}>
                                        Mine Rules - FPMax
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    ) : this.state.algorithm === "TNR" ? (
                        <Fragment>
                            <Row className="show-grid"  style={{padding: "20px 0"}}>
                                <Col xsHidden md={2}>
                                    TNR Confidence
                                </Col>
                                <Col xs={5} md={5}>
                                    <Slider
                                        defaultValue={60}
                                        min={10}
                                        max={100}
                                        marks={marksHundred}
                                        included={false}
                                        onChange={(value) => this.setState({tnrConfidence: value})}
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
                                <Col xs={1} md={1}>
                                    {this.state.tnrConfidence}%
                                </Col>
                                <Col xs={6} md={4}>
                                    <div style={{float: "right"}}>
                                        <Button disabled onClick={() => this.doMineRules("TNR")} style={{padding: "0 5px"}}>
                                            Mine Rules - TNR
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="show-grid">
                                <Col xsHidden md={2}>
                                    TNR K
                                </Col>
                                <Col xs={5} md={5}>
                                    <input type={"text"} value={this.state.tnrK} onChange={(value) => this.setState({tnrK: value})}/>
                                </Col>
                                <Col xs={1} md={1}>
                                    {this.state.tnrK}
                                </Col>
                            </Row>
                            <Row className="show-grid">
                                <Col xsHidden md={2}>
                                    TNR Delta
                                </Col>
                                <Col xs={5} md={5}>
                                    <input type={"text"} value={this.state.tnrDelta} onChange={(value) => this.setState({tnrDelta: value})}/>
                                </Col>
                                <Col xs={1} md={1}>
                                    {this.state.tnrDelta}
                                </Col>
                            </Row>
                        </Fragment>
                    ) : (
                        <Button onClick={() => this.ShowMinedRules()} style={{padding: "0 5px", color: "red"}}>
                            Show Mined Rules (Dangerous!)
                        </Button>
                    )}


                </div>

                {this.state.minedRules.length > 0 ? (
                    <Fragment>
                        <div style={{paddingTop: "25px"}}>
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
                        <div style={{paddingTop: "25px"}}>
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
                    </Fragment>
                ) : null}
            </div>
        )
    }

    /**
     * render loading gif
     * @return {null}
     */
    renderLoading() {
        return this.state.loading ? (
            <div style={{
                padding: "20%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 -5%",
                overflow: "hidden"
            }}>
                <div className="dot-elastic"/>
            </div>
        ) : null;
    }


    /**
     * render each rule through either RulePad or simple rendering
     * @return {*}
     */
    renderMinedRulePad() {
        return this.state.displayedMinedRules.map((group, i) => {
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
                                            Rule with {rule["displayableAttr"].length} out of {rule["attributes"].length} Attributes
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
                                                    .replace(this.props.projectPath.slice, "")
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
     * @param algorithm FP_MAX or TNR
     */
    doMineRules(algorithm) {
        let metaData = {};
        this.setState({minedRules: [], displayedMinedRules: [], loading: true});
        mineRulesFromXmlFiles(this.props.xmlFiles, metaData, this.props.ws, algorithm,
            this.state.fpMaxSupport,
            this.state.tnrConfidence, this.state.tnrK, this.state.tnrDelta);
        this.props.onUpdateMetaData(metaData);
    }

    /**
     * request for reading the existing data from file
     */
    ShowMinedRules() {
        this.setState({minedRules: [], displayedMinedRules: [], loading: true});
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
    return {
        message: state.message,
        ws: state.ws,
        xmlFiles: state.xmlFiles,
        metaData: state.minedRulesState.metaData,
        minedRules: state.minedRulesState.minedRules,
        projectPath: state.projectPath,
        customFeatures: state.customFeatures // custom features received from feature selection
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onIgnoreFile: (shouldIgnore) => dispatch(ignoreFileChange(shouldIgnore)),
        onUpdateMetaData: (metaData) => dispatch(updateMetaData(metaData))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MinedRulesComponent);