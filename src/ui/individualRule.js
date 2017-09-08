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
        // this.ruleI = this.props['ruleData'];
        return (
            <div>
                <div className="tableRow">
                    <div className="tableCell labelCell"><h4>Rule Description</h4></div>
                    <div className="tableCell infoCell">
                        <FormControl id="indi_desc_textarea" componentClass="textarea" placeholder="Description"
                                     onChange={() => {
                                     } }/>
                    </div>
                </div>
                <div className="tableRow">
                    <div className="tableCell labelCell"><h4>Rule Detail</h4></div>
                    <div className="tableCell infoCell">
                        <FormControl id="indi_detail_textarea" componentClass="textarea" placeholder="Detail"
                                     onChange={() => {
                                     } }/>
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
     * Attach listeners
     */
    attachListener() {
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

        // called in RuleExecutor.verifyRules() and RuleExecutor.checkRules()
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

        d3.select('#indi_desc_textarea').text(this.ruleI['ruleDescription']);
        d3.select('#indi_detail_textarea').text(this.ruleI['detail']);

        ReactDOM.render(
            (<div>{this.tagRender()}</div>),
            document.getElementById('indi_tags_div'));

        ReactDOM.render(
            (<IndividualRuleList ruleI={this.ruleI} group="all"/>),
            document.getElementById("indi_all_div"));

        ReactDOM.render(
            (<IndividualRuleList ruleI={this.ruleI} group="satisfied"/>),
            document.getElementById("indi_satisfied_div"));
        ReactDOM.render(
            (<IndividualRuleList ruleI={this.ruleI} group="violated"/>),
            document.getElementById("indi_violated_div"));
    };


    /**
     * render tag badges
     */
    tagRender() {
        return this.ruleI['tags'].map((d) => {
            return (
                <div className="buttonDiv">
                    <Label onClick={() => PubSub.publish('UPDATE_HASH', ['tag', d])}>{d}</Label>
                </div>)
        });
    }

    // /**
    //  * update the rule and send to server
    //  */
    // updateRules = function () {
    //
    //     for (let i = 0; i < this.rules.length; i++) {
    //         if (this.rules[i]['index'] === this.ruleI['index']) {
    //
    //             let newObj = this.cloneJSON(this.rules[i]);
    //             delete newObj['xPathQueryResult'];
    //
    //             this.rules[i].ruleDescription = document.getElementById(`ruleDescription`).value;
    //             this.rules[i].detail = document.getElementById(`ruleDetail`).value;
    //             Utilities.sendToServer(this.ws, "MODIFIED_RULE", newObj);
    //
    //             return;
    //         }
    //     }
    //
    //     console.log('failed');
    //
    // };


}

export default IndividualRule;
