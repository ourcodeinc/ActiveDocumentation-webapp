/**
 * Created by saharmehrpour on 9/6/17.
 */

import React, {Component} from 'react';
import '../App.css';

import RulePanel from './rulePanel';
import {connect} from "react-redux";

class RuleTable extends Component {

    constructor(props) {
        super(props);
        this.state = {rulesToDisplay: props.rulesToDisplay};
    }

    render() {
        return (
            <div key={new Date()}>
                {
                    this.state.rulesToDisplay.map((d, i) => {
                        return (<div className="largePaddedDiv ruleContainer" key={i}>
                            <RulePanel ruleIndex={d.index} key={new Date()}/>
                        </div>)
                    })
                }
            </div>
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextProps)=== JSON.stringify(this.props));
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.rulesToDisplay) !== JSON.stringify(this.state.rulesToDisplay))
            this.setState({rulesToDisplay: nextProps.rulesToDisplay});
    }

}

// map state to props
function mapStateToProps(state) {

    let props = {
        rules: state.ruleTable,
        tags: state.tagTable,
        codeChanged: false,
        filePath: "none",
        ws: state.ws,
        ignoreFile: state.ignoreFile,
        rulesToDisplay: []
    };


    if (state.hash[0] === "tag")
        props.rulesToDisplay = state.ruleTable.filter((d) => d['tags'].indexOf(state.hash[1]) !== -1);

    else if (state.hash[0] === "rules")
        props.rulesToDisplay = state.ruleTable;

    else if (state.hash[0] === "violatedRules")
        props.rulesToDisplay = state.ruleTable.filter(d => d['xPathQueryResult'].map(dd => dd['data'].violated).reduce((a, b) => a + b) !== 0);

    else if (state.hash[0] === 'rulesForFile') {
        props.rulesToDisplay = state.ruleTable;
        props.filePath = '/Users/saharmehrpour/Documents/Workspace/' + state.filePath
    }

    if (state.hash[0] === "codeChanged") {
        props.codeChanged = true;
        props.rulesToDisplay = state.ruleTable;
        props.filePath = '/Users/saharmehrpour/Documents/Workspace/' + state.filePath;
        props["date"] = new Date() // for update
    }

    return props;
}

export default connect(mapStateToProps, null)(RuleTable);
