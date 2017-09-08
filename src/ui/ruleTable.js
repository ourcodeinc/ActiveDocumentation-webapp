/**
 * Created by saharmehrpour on 9/6/17.
 */

import React from 'react';
import '../App.css';

import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import PubSub from 'pubsub-js';

import RulePanel from './rulePanel';

class RuleTable {

    thisNode;
    rules;


    constructor(parent) {
        this.thisNode = d3.select(parent)
            .append('div')
            .classed('container', true); // rule-table

        this.attachListener();
    }

    /**
     * Attach listeners
     */
    attachListener() {

        // [hash, value]
        PubSub.subscribe('HASH', (msg, data) => {
            d3.select(this.thisNode.node().parentNode).classed('hidden', data[0] !== 'rules');
        });

        // called in RuleExecutor.verifyRules() and RuleExecutor.checkRules()
        // [ruleTable, tagTable]
        PubSub.subscribe('DISPLAY_RULES', (msg, data) => {
            this.rules = data[0];
            this.tags = data[1];
            this.displayRules();
        });

        // // [ruleTable, newRule]
        // PubSub.subscribe('UPDATE_RULE', (msg, data) => {
        //     this.rules = data[0];
        //     // reset the table
        //     this.clearRuleTable();
        //     this.displayRules();
        // });
        //
        // // [ruleTable, filePath]
        // PubSub.subscribe('DISPLAY_UPDATE_RULES', (msg, data) => {
        //     this.rules = data[0];
        //     // reset the table
        //     this.updateDisplayRules(data[1]);
        // });

    }


    /**
     * display all rules
     */
    displayRules() {
        for (let i = 0; i < this.rules.length; i++) {
            let ruleTableDiv = this.thisNode
                .append('div')
                .classed('largePaddedDiv ruleContainer', true);

            ReactDOM.render(
                <RulePanel ruleData={this.rules[i]}/>,
                ruleTableDiv.node()
            );
        }
    };

}

/**
 * Factory method to create a new RuleTable instance
 * @param parent
 * @returns {RuleTable}
 */
export function create(parent) {
    return new RuleTable(parent);
}