/**
 * Created by saharmehrpour on 11/1/17.
 */

import React, {Component} from "react";
import "../App.css";
import {connect} from "react-redux";
import {Button} from "react-bootstrap";

import {mineRulesFromXmlFiles} from "../core/miningRules";
import {ignoreFile, updateMetaData} from "../actions";
import Utilities from "../core/utilities";


class MinedRules extends Component {

    constructor(props) {
        super(props);
        this.state = {
            support: 60,
            minedRules: []
        };
    }

    render() { //console.log(this.state.minedRules);
        return (
            <div>
                <div style={{paddingBottom: "10px"}}>
                    {"Support: "}<input type="text" value={this.state.support}
                                        onChange={(event) => this.setState({support: event.target.value})}/>
                </div>
                <Button onClick={() => this.mineRules()} style={{padding: "0 5px"}}>
                    Mine Rules Now!
                </Button>
                <div>
                    {this.state.minedRules.map((group, index) => {
                        return (
                            <div className={"minedFrequentItemSetContainer"} key={index}>{
                                group["attributes"].map((list, i) => {
                                    return (
                                        <div key={i} className={"minedFrequentItemSet"}>
                                            {list.map((attr, j) => {
                                                return (<div className={"attrRowContainer"} key={j}>
                                                    <div className={"attrId"}>{attr["id"]}</div>
                                                    <div className={"attrDesc"}>{attr["attr"]}</div>
                                                    <div className={"attrQuery"}>{attr["query"]}</div>
                                                </div>)
                                            })}

                                            <div className={"minedFrequentItemSetFiles"}>{
                                                group["files"].map((fileName, i) => {
                                                    return (<div key={i} className={"ruleLink"}
                                                                 onClick={() => {
                                                                     this.props.onIgnoreFile(true);
                                                                     Utilities.sendToServer(this.props.ws, "OPEN_FILE", fileName)
                                                                 }}
                                                    >{fileName}</div>)
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

    mineRules() {
        let metaData = {};
        mineRulesFromXmlFiles(this.props.xmlFiles, this.state.support, metaData, this.props.ws);
        this.props.onUpdateMetaData(metaData);
        this.setState({minedRules: []});
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.message === "UPDATE_MINED_RULES") {
            this.setState({minedRules: nextProps.minedRules})
        }
    }
}

function mapStateToProps(state) {
    return {
        message: state.message,
        ws: state.ws,
        xmlFiles: state.xmlFiles,
        metaData: state.minedRulesState.metaData,
        minedRules: state.minedRulesState.minedRules
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onIgnoreFile: (shouldIgnore) => dispatch(ignoreFile(shouldIgnore)),
        onUpdateMetaData: (metaData) => dispatch(updateMetaData(metaData))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MinedRules);