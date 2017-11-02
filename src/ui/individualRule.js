/**
 * Created by saharmehrpour on 9/6/17.
 */

import React from 'react';
import '../App.css';

import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import PubSub from 'pubsub-js';

import IndividualRuleList from './individualRuleList';
import {FormControl, Label} from 'react-bootstrap';
import Utilities from '../core/utilities';

class IndividualRule extends React.Component {

    // thisNode;
    rules;
    ruleI;
    ws;

    constructor() {
        super();
        this.attachListener();

        this.state = {};
    }

    render() {
        return (
            <div>
                <div className="tableRow">
                    <div className="tableCell labelCell"><h4>Rule Description</h4></div>
                    <div className="tableCell infoCell">
                        <FormControl id="indi_desc_textarea" componentClass="textarea" placeholder="Description"
                                     onBlur={() => this.updateRules()}/>
                    </div>
                </div>
                <div className="tableRow">
                    <div className="tableCell labelCell"><h4>Rule Detail</h4></div>
                    <div className="tableCell infoCell">
                        <FormControl id="indi_detail_textarea" componentClass="textarea" placeholder="Detail"
                                     onBlur={() => this.updateRules()}/>
                    </div>
                </div>
                <div className="tableRow">
                    <div className="tableCell labelCell"><h4>Rule Tags</h4></div>
                    <div id="indi_tags_div" className="tableCell infoCell"></div>
                </div>
                <div className="tableRow">
                    <div className="tableCell labelCell"><h4>Matches</h4></div>
                    <div id="indi_all_div" className="tableCell infoCell"></div>
                </div>
                <div className="tableRow">
                    <div className="tableCell labelCell"><h4>Rule Verified</h4></div>
                    <div className="tableCell infoCell">
                        <div id="indi_satisfied_div" className="largePaddedDiv"></div>
                        <div id="indi_violated_div" className="largePaddedDiv"></div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * subscribe for events
     */
    attachListener() {
        // [ws]
        PubSub.subscribe('NEW_WS', (msg, data) => {
            this.ws = data[0];
        });

        // [hash value]
        PubSub.subscribe('HASH', (msg, data) => {
            if (data[0] === 'rule') {
                this.ruleI = this.rules.filter((d) => d.index === +data[1])[0];
                this.displayRule();
                d3.select('#individualRule').classed('hidden', false);
            }
            else {
                d3.select('#individualRule').classed('hidden', true);
            }
        });

        // [ruleIndex, rule]
        PubSub.subscribe('UPDATE_RULE', (msg, data) => {
            let oldRule = this.rules.filter((d) => d['index'] === +data[0])[0];
            oldRule['ruleDescription'] = data[1]['ruleDescription'];
            oldRule['detail'] = data[1]['detail'];
        });

        // called in RuleExecutor.checkRulesForAll() and RuleExecutor.checkRules_org()
        // [ruleTable, tagTable]
        PubSub.subscribe('DISPLAY_RULES', (msg, data) => {
            this.rules = data[0];
            this.tags = data[1];
        });


    }


    /**
     * display a specific rule
     */
    displayRule() {

        document.getElementById('indi_desc_textarea').value = this.ruleI['ruleDescription'];
        document.getElementById('indi_detail_textarea').value = this.ruleI['detail'];

        ReactDOM.render(
            (<div>{this.tagRender()}</div>),
            document.getElementById('indi_tags_div'));

        ReactDOM.render(
            (<IndividualRuleList ruleI={this.ruleI} ws={this.ws} group="all"/>),
            document.getElementById("indi_all_div"));

        ReactDOM.render(
            (<IndividualRuleList ruleI={this.ruleI} ws={this.ws} group="satisfied"/>),
            document.getElementById("indi_satisfied_div"));
        ReactDOM.render(
            (<IndividualRuleList ruleI={this.ruleI} ws={this.ws} group="violated"/>),
            document.getElementById("indi_violated_div"));
    };


    /**
     * render tag badges
     */
    tagRender() {
        return this.ruleI['tags'].map((d, i) => {
            return (
                <div className="buttonDiv" key={i}>
                    <Label onClick={() => PubSub.publish('UPDATE_HASH', ['tag', d])}>{d}</Label>
                </div>)
        });
    }

    /**
     * update the rule and send to server
     */
    updateRules = function () {

        let newObj = Utilities.cloneJSON(this.ruleI);
        delete newObj['xPathQueryResult'];

        newObj['ruleDescription'] = document.getElementById(`indi_desc_textarea`).value;
        newObj['detail'] = document.getElementById(`indi_detail_textarea`).value;

        if (newObj['ruleDescription'] !== this.ruleI['ruleDescription'] || newObj['detail'] !== this.ruleI['detail'])
            Utilities.sendToServer(this.ws, "MODIFIED_RULE", newObj);

    };


}

export default IndividualRule;
