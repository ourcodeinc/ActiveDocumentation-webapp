/**
 * Created by saharmehrpour on 9/6/17.
 */

import React from 'react';
import '../App.css';

// import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import PubSub from 'pubsub-js';
import Utilities from '../core/utilities';

import RulePanel from './rulePanel';

class RuleTable extends React.Component {

    constructor() {
        super();

        this.attachListener();
        this.state = {rulesToDisplay: [], codeChanged: false};
    }

    render() {
        return (
            <div>
                {
                    this.state.rulesToDisplay.map((d, i) => {
                        return (<div className="largePaddedDiv ruleContainer">
                            <RulePanel ruleData={d} ws={this.state.ws} key={i} codeChanged={this.state.codeChanged}/>
                        </div>)
                    })
                }
            </div>
        );
    }


    /**
     * subscribe for events
     */
    attachListener() {
        // [ws]
        PubSub.subscribe('NEW_WS', (msg, data) => {
            this.setState({ws: data[0]})
        });

        // [hash, value]
        PubSub.subscribe('HASH', (msg, data) => {

            d3.select('#ruleResults').classed('hidden', () => {
                return (['rules', 'tag', 'codeChanged'].indexOf(data[0]) === -1 )
            });

            if (data[0] === 'tag') {
                this.setState({
                    rulesToDisplay: this.rules.filter((d) => d['tags'].indexOf(data[1]) !== -1),
                    codeChanged: false
                })
            }
            if (data[0] === 'rules') {
                this.setState({rulesToDisplay: this.rules, codeChanged: false});
            }
        });

        // called in RuleExecutor.verifyRules() and RuleExecutor.checkRules()
        // [ruleTable, tagTable]
        PubSub.subscribe('DISPLAY_RULES', (msg, data) => {
            this.rules = data[0];
        });


        // [ruleTable, filePath]
        PubSub.subscribe('DISPLAY_UPDATE_RULES_FOR_FILE', (msg, data) => {
            this.rules = data[0];
            this.setState({rulesToDisplay: this.findRuleSet(data[1]), codeChanged: true});
        });

    }

    findRuleSet(filePath) {
        return this.rules.map((rule) => {
            let thisRule = Utilities.cloneJSON(rule);
            thisRule['xPathQueryResult'] = rule['xPathQueryResult'].filter((d) => d['filePath'] === filePath)
            return thisRule;
        })
    }


}


export default RuleTable;