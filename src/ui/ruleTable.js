/**
 * Created by saharmehrpour on 9/6/17.
 */

import React, {Component, Fragment} from 'react';
import '../App.css';

import RulePanel from './rulePanel';
import {connect} from "react-redux";
import {Button} from "react-bootstrap";
import {MdPlaylistAdd} from "react-icons/lib/md/index";
import {changeEditMode} from "../actions";

class RuleTable extends Component {

    constructor(props) {
        super(props);
        this.state = props.newRule;
    }

    render() {
        return (
            <Fragment>
                {this.props.hash0 === "rules" ?
                    (!this.state.newRule ? (
                        <div style={{paddingBottom: '10px', clear: 'both'}}>
                            <Button onClick={() => this.props.onChangeEditMode()} style={{padding: "0 5px"}}>
                                <MdPlaylistAdd size={35}/>
                                Add a New Rule
                            </Button>
                        </div>
                    ) : (
                        <div style={{paddingBottom: "5px"}}>
                            <RulePanel key={new Date()} newRule
                                       cancelGeneratingNewRule={() => this.setState({newRule: false})}/>
                        </div>
                    ))
                    : null}
                <div key={new Date()}>
                    {this.props.rulesToDisplay.map((d, i) =>
                        (<div key={new Date().getTime() + i} style={{paddingBottom: "5px"}}>
                            <RulePanel ruleIndex={d.index} key={new Date()}/>
                        </div>)
                    )}
                </div>
                {this.props.hash0 !== "rules" && this.props.rulesToDisplay.length === 0 ? (
                    <div>
                        <h4>There are no rules to display.</h4>
                    </div>
                ) : null}
            </Fragment>
        );
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        if (nextProps.newRule !== this.state.newRule)
            this.setState({newRule: nextProps.newRule});
        else
            this.forceUpdate();
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
        rulesToDisplay: [],
        hash0: state.hash[0],
        message: state.message,
        newRule: state.newOrEditRule.isEditMode
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

function mapDispatchToProps(dispatch) {
    return {
        onChangeEditMode: () => dispatch(changeEditMode(-1, true))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RuleTable);
