/**
 * Created by saharmehrpour on 11/1/17.
 */

import React, {Component} from 'react';
import '../App.css';
import {connect} from 'react-redux';
import {Button} from "react-bootstrap";

import {mineRulesFromXmlFiles} from "../core/miningRules";
import {updateMetaData} from "../actions";


class MinedRules extends Component {

    constructor(props) {
        super(props);
        this.state = {
            support: 60,
            minedRules: ""
        };
    }

    render() {
        return (
            <div>
                <p>
                    Mined Design Rules. Boilerplate
                </p>
                <div style={{paddingBottom: "10px"}}>
                    {"Support: "}<input type="text" value={this.state.support}
                                        onChange={(event) => this.setState({support: event.target.value})}/>
                </div>
                <Button onClick={() => this.mineRules()} style={{padding: "0 5px"}}>
                    Mine Rules Now!
                </Button>
                <div>
                    {(typeof this.state.minedRules === "object") ?
                        (this.state.minedRules.map((d, index) => {
                            return <div key={index}>
                                {d.split("\n").map((dd, i) => {
                                    return <div key={i}>{dd}</div>
                                })}
                            </div>
                        }))
                        : this.state.minedRules.split("\n").map((dd, i) => {
                            return <div key={i}>{dd}</div>
                        })
                    }
                </div>
            </div>
        )
    }

    mineRules() {
        let metaData = {};
        mineRulesFromXmlFiles(this.props.xmlFiles, this.state.support, metaData, this.props.ws);
        this.props.onUpdateMetaData(metaData);
        this.setState({minedRules: ""});
    }

    componentWillReceiveProps(nextProps) {
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
        onUpdateMetaData: (metaData) => dispatch(updateMetaData(metaData))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MinedRules);