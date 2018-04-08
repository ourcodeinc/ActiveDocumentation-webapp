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
                        return (<div className="largePaddedDiv ruleContainer" key={i}>
                            <RulePanel ruleData={d} ws={this.state.ws} key={new Date()} codeChanged={this.state.codeChanged}/>
                        </div>)
                    })
                }
            </div>
        );
    }

    /**
     * update the length of a text area to remove scroll
     */
    updateTextareaLength() {
        d3.select("#ruleResults").selectAll("textarea")
            .each(function () {
                let el = this;
                el.style.cssText = 'height:0';
                el.style.cssText = 'overflow:hidden;height:' + el.scrollHeight + 'px';
            });
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
                return (['rules', 'tag', 'codeChanged', 'rulesForFile'].indexOf(data[0]) === -1 )
            });

            if (data[0] === 'tag') {
                this.setState({
                    rulesToDisplay: this.rules.filter((d) => d['tags'].indexOf(data[1]) !== -1),
                    codeChanged: false
                })
            }
            if (data[0] === 'rules') {
                // console.log(this.rules.filter((d) => d['index'] === 123)[0]);
                this.setState({rulesToDisplay: this.rules, codeChanged: false});
            }

            this.updateTextareaLength();

        });

        // called in RuleExecutor.checkRulesForAll() and RuleExecutor.checkRules_org()
        // [ruleTable, tagTable]
        PubSub.subscribe('DISPLAY_RULES', (msg, data) => {
            this.rules = data[0];
        });

        // [ruleTable, filePath]
        PubSub.subscribe('DISPLAY_UPDATE_RULES_FOR_FILE', (msg, data) => {
            this.rules = data[0];
            this.setState({rulesToDisplay: this.findRuleSet(data[1]), codeChanged: true});
            this.updateTextareaLength();
        });

        // [filePath]
        PubSub.subscribe('SHOW_RULES_FOR_FILE', (msg, data) => {
            this.setState({rulesToDisplay: this.findRuleSet(data[0]), codeChanged: false});
            this.updateTextareaLength();
        });


    }

    findRuleSet(filePath) {
        return this.rules
        // .filter((d) => d['xPathQueryResult'].filter((d) => d['filePath'] === filePath).length !== 0)
            .filter((d) => {
                switch (d['ruleType']['constraint']) {
                    case 'NONE':
                        return true;
                    case 'SOME':
                    case 'FOLDER':
                        for (let j = 0; j < d['ruleType']['checkFor'].length; j++)
                            // Warning
                            // This can lead to error if there are two folder with similar sub-path
                            if (filePath.indexOf(d['ruleType']['checkFor'][j]) !== -1) return true;
                        return false;
                    case 'EXCEPT':
                        for (let j = 0; j < d['ruleType']['checkFor'].length; j++)
                            // Warning
                            // This can lead to error if there are two folder with similar sub-path
                            if (filePath.indexOf(d['ruleType']['checkFor'][j]) !== -1) return false;
                        return true;

                    case 'FOLDER EXCEPT':
                        for (let j = 0; j < d['ruleType']['checkFor'][0].length; j++)
                            // Warning
                            // This can lead to error if there are two folder with similar sub-path
                            if (filePath.indexOf(d['ruleType']['checkFor'][0][j]) !== -1) {
                                for (let i = 0; i < d['ruleType']['checkFor'][1].length; i++) {
                                    if (filePath.indexOf(d['ruleType']['checkFor'][j]) !== -1) return false;
                                }
                                return true;
                            }
                        return false;
                    case 'FOLDER SOME':
                        for (let j = 0; j < d['ruleType']['checkFor'][0].length; j++)
                            // Warning
                            // This can lead to error if there are two folder with similar sub-path
                            if (filePath.indexOf(d['ruleType']['checkFor'][0][j]) !== -1) {
                                for (let i = 0; i < d['ruleType']['checkFor'][1].length; i++) {
                                    if (filePath.indexOf(d['ruleType']['checkFor'][j]) !== -1) return true;
                                }
                                return false;
                            }
                        return false;
                    default:
                        return false;
                }

            })
            .map((rule) => {
                let thisRule = Utilities.cloneJSON(rule);

                thisRule['xPathQueryResult'] =
                    rule['xPathQueryResult']
                        .filter((d) => d['filePath'] === filePath || d['filePath'] === 'MIXED');

                thisRule['xPathQueryResult'].forEach((d) => {
                    if (d['filePath'] !== 'MIXED') return d;
                    return {
                        filePath: "MIXED",
                        data: {
                            quantifierResult: d['data']['quantifierResult'].filter((dd) => dd['filePath'] === filePath),
                            satisfied: d['data']['quantifierResult'].filter((dd) => dd['filePath'] === filePath).length,
                            satisfiedResult: d['data']['satisfiedResult'].filter((dd) => dd['filePath'] === filePath),
                            violated: d['data']['violatedResult'].filter((dd) => dd['filePath'] === filePath).length,
                            violatedResult: d['data']['violatedResult'].filter((dd) => dd['filePath'] === filePath)
                        }
                    };
                });

                return thisRule;
            })
    }


}


export default RuleTable;