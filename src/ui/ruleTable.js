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

    constructor(parent) {
        this.thisNode = d3.select(parent)
            .append('div'); // rule-table

        this.attachListener();
    }

    /**
     * subscribe for events
     */
    attachListener() {
        // [ws]
        PubSub.subscribe('NEW_WS', (msg, data) => {
            this.ws = data[0];
        });

        // [hash, value]
        PubSub.subscribe('HASH', (msg, data) => {
            d3.select(this.thisNode.node().parentNode).classed('hidden', () => {
                return (['rules', 'tag', 'codeChanged'].indexOf(data[0]) === -1 )
            });
        });

        // called in RuleExecutor.verifyRules() and RuleExecutor.checkRules()
        // [ruleTable, tagTable]
        PubSub.subscribe('DISPLAY_RULES', (msg, data) => {
            this.rules = data[0];
            this.tags = data[1];
            this.displayRules();
        });


        // [ruleTable, filePath]
        PubSub.subscribe('DISPLAY_UPDATE_RULES_FOR_FILE', (msg, data) => {
            this.rules = data[0];
        });

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
                <RulePanel ruleData={this.rules[i]} ws={this.ws}/>,
                ruleTableDiv.node()
            );
        }
    };

    // /**
    //  * remove all rulePanels
    //  */
    // clearAllRulePanels() {
    //     this.thisNode
    //         .selectAll('div')
    //         .remove();
    // }

}

/**
 * Factory method to create a new RuleTable instance
 * @param parent
 * @returns {RuleTable}
 */
export function create(parent) {
    return new RuleTable(parent);
}