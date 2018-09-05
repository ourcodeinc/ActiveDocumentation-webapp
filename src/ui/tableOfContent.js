/**
 * Created by saharmehrpour on 9/5/17.
 */

import React, {Component} from 'react';
import '../App.css';

// import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import PubSub from 'pubsub-js';


class TableOfContent extends Component {

    constructor() {
        super();

        this.state = {
            tags: [],
            rules: [],
            selectedAlphabet: "All"
        };

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.attachListener();
    }

    render() {
        return (
            <div ref={this.setWrapperRef}>
                <div className={"well well-sm"}>
                    <h4>Tags</h4>
                </div>
                <div className={"list-inline"} id={"alphabet_index"}>{this.createAlphabetIndex()}</div>
                <hr className={"bottomBorder"}/>
                <ul className={"list-inline"} id={"tags_list"}>
                    {this.state.tags.map((tag, i) =>
                        (<li key={i}
                             style={{display: this.selectAlphabet(tag)}}
                             onClick={(d) => {
                                 PubSub.publish('UPDATE_HASH', ['tag', d]);
                             }}>{tag['tagName']}</li>)
                    )}
                </ul>

                <div className={"well well-sm"}>
                    <h4>Rules</h4>
                </div>
                <div className={"ist-inline"}>
                    {this.state.rules.map((rule, i) =>
                        <tr key={i}>
                            <td><a className={"list-group-item"} onClick={() => {
                                PubSub.publish('UPDATE_HASH', ['rule', rule.index]);
                            }}>
                                {rule.index}
                            </a></td>
                            <td><a className={"list-group-item"} onClick={() => {
                                PubSub.publish('UPDATE_HASH', ['rule', rule.index]);
                            }}>
                                {rule['title']}
                            </a></td>
                        </tr>
                    )}
                </div>
            </div>
        )
    }

    setWrapperRef(node) {
        this.thisNode = node;
    }

    /**
     * subscribe for events
     */
    attachListener() {

        // [hash, value]
        PubSub.subscribe('HASH', (msg, data) => {
            d3.select(this.thisNode).classed('hidden', () =>
                data[0] !== 'index' && data[0] !== 'tagJsonChanged' && data[0] !== 'ruleJsonChanged'
            );
        });


        // called in RuleExecutor.checkRulesForAll() and RuleExecutor.checkRules_org()
        // [ruleTable, tagTable]
        PubSub.subscribe('DISPLAY_RULES', (msg, data) => {
            this.setState({tags: data[1], rules: data[0]});
        });

        // [ruleIndex, rule]
        PubSub.subscribe('UPDATE_RULE', (msg, data) => {

            let oldRules = this.state.rules.slice();

            let oldRule = oldRules.filter((d) => d['index'] === +data[0])[0];
            oldRule['title'] = data[1]['title'];
            oldRule['detail'] = data[1]['detail'];

            this.setState({rules: oldRules})
        });

        // [tagTable, newTag]
        PubSub.subscribe('UPDATE_TAG', (msg, data) => {
            this.setState({tags: data[0]});

        });

        // [tagTable]
        PubSub.subscribe('UPDATE_TAG_TABLE', (msg, data) => {
            this.setState({tags: data[0]});
        });

        // [ruleTable]
        PubSub.subscribe('UPDATE_RULE_TABLE', (msg, data) => {
            this.setState({rules: data[0]});
        });

        // [ruleIndex, rule]
        PubSub.subscribe('NEW_RULE', (msg, data) => {
            this.setState({rules: this.state.rules.push(data[0])});
        });
    }


    selectAlphabet(tag) {
        if (this.state.selectedAlphabet === "All") {
            return "block";
        }
        if (tag["tagName"].charAt(0).toUpperCase() === this.state.selectedAlphabet)
            return "block";
        return "none";
    }


    /**
     * This function creates an alphabet list on top
     */
    createAlphabetIndex() {

        let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        alphabet.push('All');

        return alphabet.map((d, i) => {
            return (
                <li key={i}
                    className={d === this.state.selectedAlphabet ? "selected" : ""}
                    onClick={() => this.setState({selectedAlphabet: d})}>
                    {d}
                </li>
            )
        });

    };


}

export default TableOfContent;