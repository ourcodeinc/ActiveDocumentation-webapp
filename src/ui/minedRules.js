/**
 * Created by saharmehrpour on 11/1/17.
 */

import React, {Component} from "react";
import "../App.css";
import {connect} from "react-redux";
import {Button, Row, Col} from "react-bootstrap";
import Slider from "rc-slider";
import Tooltip from "rc-tooltip";
import "rc-slider/assets/index.css";
import "three-dots"


import {mineRulesFromXmlFiles} from "../core/miningRules";
import {ignoreFile, updateMetaData} from "../actions";
import Utilities from "../core/utilities";


class MinedRules extends Component {

    constructor(props) {
        super(props);
        this.state = {
            support: 60,
            minedRules: [],
            displayedMinedRules: [],
            loading: false, // for loading icons when mining rules
            minComplexity: 0,
            maxComplexity: 100
        };
    }

    render() {
        // console.log(this.state);
        return (
            <div>
                {this.renderButtonsAndSliders()}
                {this.state.loading ? (
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
                ) : null}
                <div>
                    {this.state.displayedMinedRules.map((group, index) => {
                        return (
                            <div className={"minedFrequentItemSetContainer"} key={index}>{
                                group["attributes"].map((list, i) => {
                                    return (
                                        <div key={i} className={"minedFrequentItemSet"}>
                                            <h4 style={{backgroundColor: "lightgrey", padding: "5px"}}>Number of Attributes: {list.length}</h4>
                                            {list.map((attr, j) => {
                                                return (<div className={"attrRowContainer"} key={j}>
                                                    <div className={"attrId"}>{attr["id"]}</div>
                                                    <div className={"attrDesc"}>{attr["attr"]}</div>
                                                    <div className={"attrQuery"}>{attr["query"]}</div>
                                                </div>)
                                            })}
                                            <h4 style={{backgroundColor: "lightgrey", padding: "5px"}}>Number of Files: {group["files"].length}</h4>
                                            <div className={"minedFrequentItemSetFiles"}>{
                                                group["files"].map((fileName, i) => {
                                                    return (<div key={i} className={"ruleLink"}
                                                                 onClick={() => {
                                                                     this.props.onIgnoreFile(true);
                                                                     Utilities.sendToServer(this.props.ws, "OPEN_FILE", fileName)
                                                                 }}
                                                    >{fileName.replace(this.props.projectPath.slice, "")
                                                        .replace(this.props.projectPath.slice(1), "")}</div>)
                                                })}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            </div>)
                    })}
                </div>
            </div>
        )
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.message === "UPDATE_MINED_RULES") {
            // calculate the max and min number of attributes in mined rules
            let min = Infinity;
            let max = -1*Infinity;
            nextProps.minedRules.forEach(group => {
                group["attributes"].forEach(list => {
                    min = Math.min(list.length, min);
                    max = Math.max(list.length, max);
                })
            });

            this.setState({
                minedRules: nextProps.minedRules,
                displayedMinedRules: nextProps.minedRules,
                loading: false,
                minComplexity: min,
                maxComplexity: max
            })
        }
    }


    /**
     * render the buttons and the sliders
     * @return {*}
     */
    renderButtonsAndSliders() {
        // create marks for support slider
        let marksSupport = {};
        for (let i=10; i<=100; i+=10)
            marksSupport[i] = i;

        // calculate the max and min number of attributes in mined rules
        let minNumberOfAttributes = Infinity;
        let maxNumberOfAttributes = -1*Infinity;
        this.state.minedRules.forEach(group => {
            group["attributes"].forEach(list => {
                minNumberOfAttributes = Math.min(list.length, minNumberOfAttributes);
                maxNumberOfAttributes = Math.max(list.length, maxNumberOfAttributes);
                })
            });

        // create marks for complexity slider IF there are mined rules
        let marksComplexity = {};
        if (this.state.minedRules.length > 0) {
            for (let i = minNumberOfAttributes; i <= maxNumberOfAttributes; i += Math.floor((maxNumberOfAttributes - minNumberOfAttributes) / 8))
                marksComplexity[i] = i;
        }

        return (
            <div>
                <div>
                    <Row className="show-grid">
                        <Col xsHidden md={1}>
                            Support
                        </Col>
                        <Col xs={5} md={5}>
                            <Slider
                                defaultValue={60}
                                min={10}
                                max={100}
                                marks={marksSupport}
                                included={false}
                                onChange={(value) => this.setState({support: value})}
                                handle={(props) => {
                                    // copied from rc-slider website
                                    const { value, dragging, index, ...restProps } = props;
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
                            {this.state.support}%
                        </Col>
                        <Col xs={6} md={5}>
                            <div style={{float: "right"}}>
                                <Button onClick={() => this.mineRules()} style={{padding: "0 5px"}}>
                                    Mine Rules Now!
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>

                {this.state.minedRules.length > 0 ? (
                    <div style={{paddingTop: "25px"}}>
                        <Row className="show-grid">
                            <Col xsHidden md={1}>
                                Complexity
                            </Col>
                            <Col xs={5} md={5}>
                                <Slider.Range
                                    step={1}
                                    defaultValue={[minNumberOfAttributes, maxNumberOfAttributes]}
                                    onAfterChange={(value)=> this.setState({minComplexity: value[0], maxComplexity: value[1]})}
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
                            <Col xs={1} md={1}>
                                Min: {this.state.minComplexity}, max: {this.state.maxComplexity}
                            </Col>
                            <Col xs={6} md={5}>
                                <div style={{float: "right"}}>
                                    <Button onClick={() => this.filterRules()} style={{padding: "0 5px"}}>
                                        Update Complexity of Rules Now!
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                ) : null}
            </div>
        )
    }

    /**
     * send command to mine rules
     */
    mineRules() {
        let metaData = {};
        mineRulesFromXmlFiles(this.props.xmlFiles, this.state.support, metaData, this.props.ws);
        this.props.onUpdateMetaData(metaData);
        this.setState({minedRules: [], displayedMinedRules: [], loading: true});
    }

    /**
     * filter mined rules based on complexity
     */
    filterRules() {
        let newDisplayedList = this.state.minedRules.filter((group) => {
            let fil = group["attributes"].filter((list) => {
                return (list.length >= this.state.minComplexity && list.length <= this.state.maxComplexity)
            });
            return fil.length !== 0
        });

        this.setState({displayedMinedRules: newDisplayedList})
    }

}

function mapStateToProps(state) {
    // copied from headerBar.js
    let path = "";
    try {
        path = state["projectHierarchy"]["properties"]["canonicalPath"];
    } catch (e) {
    }
    return {
        message: state.message,
        ws: state.ws,
        xmlFiles: state.xmlFiles,
        metaData: state.minedRulesState.metaData,
        minedRules: state.minedRulesState.minedRules,
        projectPath: path
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onIgnoreFile: (shouldIgnore) => dispatch(ignoreFile(shouldIgnore)),
        onUpdateMetaData: (metaData) => dispatch(updateMetaData(metaData))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MinedRules);