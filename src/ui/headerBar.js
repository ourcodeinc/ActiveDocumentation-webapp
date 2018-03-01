/**
 * Created by saharmehrpour on 9/7/17.
 */


import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
import '../App.css';
import Utilities from '../core/utilities';

import * as d3 from 'd3';
import PubSub from 'pubsub-js';
import {FormControl} from 'react-bootstrap';


export class HeaderBar extends Component {

    constructor() {
        super();
        this.attachListener();
        this.state = {title: "Active Documentation", content: ""};
    }

    render() {

        return (
            <div style={{paddingBottom: "30px"}} id="headerBar">
                <div className="headerDiv">
                    {this.renderHeader()}
                </div>
            </div>
        )
    }

    /**
     * subscribe for events
     */
    attachListener() {
        // [ruleIndex, rule]
        PubSub.subscribe('UPDATE_RULE', (msg, data) => {
            this.setState({hash: 'ruleChanged', title: data[0], content: ""});
        });

        // [hash, value]
        PubSub.subscribe('HASH', (msg, data) => {

            switch (data[0]) {
                case 'tag':
                    this.tag = this.tags.filter((d) => d['tagName'] === data[1])[0];
                    this.setState({hash: 'tag', title: data[1], content: this.tag['detail']});
                    break;
                case 'rule':
                    this.setState({hash: 'rule', title: data[1], content: ""});
                    break;
                case 'rules':
                    this.setState({hash: 'rules', title: "All Rules", content: ""});
                    break;
                case "tagJsonChanged":
                    this.setState({hash: 'tagJsonChanged', title: "tagJson.txt is changed.", content: ""});
                    break;
                case "ruleJsonChanged":
                    this.setState({hash: 'ruleJsonChanged', title: "ruleJson.txt is changed.", content: ""});
                    break;
                case "hierarchy":
                    this.setState({hash: 'hierarchy', title: "Project Hierarchy", content: ""});
                    break;
                case "index":
                    this.setState({hash: 'index', title: "Active Documentation", content: ""});
                    break;
                default:
                    //this.setState({hash: 'index', title: "Active Documentation", content: ""});
                    break;
            }
            this.updateTextareaLength();

        });

        // [ruleTable, filePath]
        PubSub.subscribe('DISPLAY_UPDATE_RULES_FOR_FILE', (msg, data) => {
            this.setState({hash: 'codeChanged', title: '', content: data[1]});
        });


        // [ws]
        PubSub.subscribe('NEW_WS', (msg, data) => {
            this.ws = data[0];
        });

        // called in RuleExecutor.checkRulesForAll() and RuleExecutor.checkRules_org()
        // [ruleTable, tagTable]
        PubSub.subscribe('DISPLAY_RULES', (msg, data) => {
            this.tags = data[1];
        });

        // [tagTable, newTag]
        PubSub.subscribe('UPDATE_TAG', (msg, data) => {
            this.tags = data[0];
            this.updateTextareaLength();
            // console.log(this.tags);
        });

        // [tagTable]
        PubSub.subscribe('UPDATE_TAG_TABLE', (msg, data) => {
            this.tags = data[0];
            this.updateTextareaLength();
        });
    }

    /**
     * update tag desc and send to server
     */
    updateTag() {
        let newDesc = document.getElementById('tag_desc').value;
        if (newDesc !== this.tag['detail']) {
            this.tag['detail'] = newDesc;
            Utilities.sendToServer(this.ws, "MODIFIED_TAG", this.tag);
        }
    }

    renderHeader() {
        switch (this.state.hash) {
            case 'tag':
                return (
                    <div>
                        <span className="text-16 primary">Rules related to tag: </span><br/>
                        <span className="text-24 important">{this.state.title}</span>
                        <FormControl componentClass="textarea" defaultValue={this.state.content}
                                     onBlur={() => this.updateTag()} key={new Date()}
                                     placeholder="Information about tag"/>
                    </div>
                );
            case 'rule':
                return (
                    <div>
                        <span className="text-16 primary">Rule Index: </span>
                        <span className="text-24 important">{this.state.title}</span>
                    </div>
                );
            case 'codeChanged':
                return (
                    <div>
                        <span className="text-16 primary">Code Changed in File:</span><br/>
                        <span className="text-24 important">{this.state.content}</span>

                    </div>
                );
            case 'ruleChanged':
                return (
                    <div>
                        <h3>Rule {this.state.title} is changed.</h3>
                    </div>
                );
            default:
                return (
                    <div>
                        <h3>{this.state.title}</h3>
                    </div>
                );
        }


    }


    /**
     * update the length of a text area to remove scroll
     */
    updateTextareaLength() {
        d3.select("#headerBar").selectAll("textarea")
            .each(function () {
                let el = this;
                el.style.cssText = 'height:0';
                el.style.cssText = 'overflow:hidden;height:' + el.scrollHeight + 'px';
            });
    }
}


export default HeaderBar;