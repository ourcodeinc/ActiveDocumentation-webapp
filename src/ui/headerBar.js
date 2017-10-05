/**
 * Created by saharmehrpour on 9/7/17.
 */


import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
import '../App.css';
import Utilities from '../core/utilities';

import * as d3 from 'd3';
import PubSub from 'pubsub-js';
import {Panel, PanelGroup, FormGroup, FormControl} from 'react-bootstrap';


export class HeaderBar extends Component {

    constructor() {
        super();
        this.attachListener();
        this.state = {title: "Active Documentation", content: ""};
    }

    render() {

        return (
            <div>
                <PanelGroup>
                    <Panel
                        header={<h3 className="text-center">{this.state.title}</h3>}
                        bsStyle="info" collapsible>

                        <FormGroup>
                            <FormControl componentClass="textarea" defaultValue={this.state.content} id="tag_desc"
                                         onBlur={() => this.updateTag()}/>
                        </FormGroup>
                    </Panel>
                </PanelGroup>
            </div>
        )
    }

    /**
     * subscribe for events
     */
    attachListener() {
        // [ruleIndex, rule]
        PubSub.subscribe('UPDATE_RULE', (msg, data) => {
            d3.select('#headerBar').classed('hidden', false);
            this.setState({title: `Rule ${data[0]} is changed.`});
        });

        // [hash, value]
        PubSub.subscribe('HASH', (msg, data) => {
            d3.select('#headerBar').classed('hidden', false);
            d3.select('#headerBar').selectAll('.panel-collapse').classed('in', false);

            switch (data[0]) {
                case 'tag':
                    this.tag = this.tags.filter((d) => {
                        return d['tagName'] === data[1]
                    })[0];

                    this.setState({title: `Tag: ${data[1]}`, content: this.tag['detail']});
                    document.getElementById('tag_desc').value = this.tag['detail'];
                    d3.select('#headerBar').selectAll('.panel-collapse').classed('in', true);
                    break;
                case 'rule':
                    this.setState({title: `Rule: ${data[1]}`, content: ""});
                    break;
                case 'rules':
                    this.setState({title: `All Rules`, content: ""});
                    break;
                case 'codeChanged':
                    break;
                case "tagJsonChanged":
                    this.setState({title: `tagJson.txt is changed.`, content: ""});
                    break;
                case "ruleJsonChanged":
                    this.setState({title: `ruleJson.txt is changed.`, content: ""});
                    break;
                default:
                    d3.select('#headerBar').classed('hidden', true);
                    break;
            }

        });

        // [ruleTable, filePath]
        PubSub.subscribe('DISPLAY_UPDATE_RULES_FOR_FILE', (msg, data) => {
            this.setState({title: 'Code Changed in File', content: data[1]});
            document.getElementById('tag_desc').value = data[1];
            d3.select('#headerBar').selectAll('.panel-collapse').classed('in', true);
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
            // console.log(this.tags);
        });

        // [tagTable]
        PubSub.subscribe('UPDATE_TAG_TABLE', (msg, data) => {
            this.tags = data[0];
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

}


export default HeaderBar;