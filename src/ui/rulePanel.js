/**
 * Created by saharmehrpour on 9/6/17.
 */

import React from 'react';
import '../App.css';
import * as d3 from 'd3';

// import ReactDOM from 'react-dom';
import PubSub from 'pubsub-js';
import Utilities from '../core/utilities';
import {Tab, Tabs, Badge, FormGroup, ControlLabel, FormControl, Label, Collapse} from 'react-bootstrap';
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaCaretUp from 'react-icons/lib/fa/caret-up';

class RulePanel extends React.Component {

    constructor() {
        super();
        this.state = {open: true, class: "ruleDiv", activeTab: 0};
        this.caretClass = {
            true: {cursor: "pointer", color: "black"},
            false: {cursor: "pointer", color: "darkgrey"}
        };

        this.handleToggleTabs = this.handleToggleTabs.bind(this);
    }

    render() {
        this.ruleI = this.props['ruleData'];
        this.ws = this.props['ws'];
        this.codeChanged = this.props['codeChanged'];

        return (
            <div className={this.state.class} id={`rule_panel_${this.ruleI['index']}`}>
                <FormGroup>{/*onClick={() => this.setState({open: !this.state.open})}>*/}
                    <ControlLabel>Rule Description
                        {/*<Label bsStyle="default" onClick={() => PubSub.publish('UPDATE_HASH', ['rule', this.ruleI['index']])}>{this.ruleI['index']}</Label>*/}
                    </ControlLabel>
                    <div style={{float: 'right'}}>
                        (<a onClick={() => PubSub.publish('UPDATE_HASH', ['rule', this.ruleI['index']])}>view the rule and all snippets</a>)
                        <FaCaretUp size={20} onClick={() => this.setState({open: false})}
                                   style={this.caretClass[this.state.open.toString()]}/>
                        <FaCaretDown size={20} onClick={() => this.setState({open: true})}
                                     style={this.caretClass[(!this.state.open).toString()]}/>
                    </div>
                    <FormControl componentClass="textarea" defaultValue={this.ruleI['ruleDescription']}
                                 id={`rule_desc_${this.ruleI['index']}`}
                                 onBlur={() => this.updateRules(this.ruleI['index'])} placeholder="Rule Description"
                                 onKeyUp={() => {
                                     let el = document.getElementById(`rule_desc_${this.ruleI['index']}`);

                                     el.style.cssText = 'height:0';
                                     el.style.cssText = 'overflow:hidden;height:' + el.scrollHeight + 'px';
                                 }}/>
                </FormGroup>
                <Collapse in={this.state.open}>
                    <div>
                        <FormGroup>
                            <ControlLabel>Rule Detail</ControlLabel>
                            <FormControl componentClass="textarea" defaultValue={this.ruleI['detail']}
                                         id={`rule_detail_${this.ruleI['index']}`}
                                         onBlur={() => this.updateRules(this.ruleI['index'])}
                                         placeholder="Rule Detail"
                                         onKeyUp={() => {
                                             let el = document.getElementById(`rule_detail_${this.ruleI['index']}`);

                                             el.style.cssText = 'height:0';
                                             el.style.cssText = 'overflow:hidden;height:' + el.scrollHeight + 'px';
                                         }}/>
                        </FormGroup>
                        <div>{this.tagRender()}</div>
                        <div style={{paddingTop: 10 + 'px', clear: 'both'}}>
                            <Tabs animation={true} id={"rules_" + this.ruleI['index']} activeKey={this.state.activeTab}
                                  onSelect={this.handleToggleTabs}>
                                <Tab eventKey={0} disabled>{}</Tab>
                                <Tab eventKey={'all'} title={this.tabHeaderRender('all')}
                                     animation={true}>{this.listRender('all')}</Tab>
                                <Tab eventKey={'satisfied'}
                                     title={this.tabHeaderRender('satisfied')}>{this.listRender('satisfied')}</Tab>
                                <Tab eventKey={'violated'}
                                     title={this.tabHeaderRender('violated')}>{this.listRender('violated')}</Tab>
                            </Tabs>
                        </div>
                    </div>
                </Collapse>
            </div>
        );
    }

    /**
     * set the states 'open' and 'class' after mounting.
     */
    componentDidMount() {

        if (!this.codeChanged) {
            this.setState({open: true, class: "ruleDiv"});
            return;
        }

        let ruleIfile = this.ruleI['xPathQueryResult'][0]['data'];
        if (ruleIfile['allChanged'] === 'greater' && ruleIfile['satisfiedChanged'] === ruleIfile['violatedChanged'] === 'none') {
            this.setState({open: true, class: "ruleDiv blue-bg"});
            return;
        }
        if (ruleIfile['satisfiedChanged'] === 'greater') {
            this.setState({open: true, class: "ruleDiv green-bg"});
            return;
        }
        if (ruleIfile['violatedChanged'] === 'greater') {
            this.setState({open: true, class: "ruleDiv red-bg"});
            return;
        }
        // if (!ruleIfile['changed'] && ruleIfile['violated'] === 0 && ruleIfile['satisfied'] === 0) {
        //     this.setState({open: false, class: "ruleDiv"});
        //     return;
        // }
        if (ruleIfile['violated'] === 0) {
            this.setState({open: false, class: "ruleDiv"});
            return;
        }
        this.setState({open: true, class: "ruleDiv"});

        // fixed the height of text areas
        d3.select("#ruleResults").selectAll("textarea")
            .each(function () {
                let el = this;
                el.style.cssText = 'height:0';
                el.style.cssText = 'overflow:hidden;height:' + (el.scrollHeight + 5) + 'px';
            });

    }


    /**
     * render the tab headers
     * @param group
     */
    tabHeaderRender(group) {
        // sum up the number of satisfied and violated
        let totalSatisfied = 0, totalMissing = 0;
        for (let i = 0; i < this.ruleI['xPathQueryResult'].length; i++) {
            totalSatisfied += this.ruleI['xPathQueryResult'][i]['data']['satisfied'];
            totalMissing += this.ruleI['xPathQueryResult'][i]['data']['violated']
        }

        switch (group) {
            case 'all':
                return (
                    <span className="general_">Matches <Badge
                        className="forAll">{totalSatisfied + totalMissing}</Badge>
                    <Badge className="forFile hidden">{}</Badge></span>);
            case 'satisfied':
                return (
                    <span className="satisfied_">Satisfied <Badge
                        className="forAll">{totalSatisfied}</Badge>
                    <Badge className="forFile hidden">{}</Badge></span>);
            case 'violated':
                return (
                    <span className="violated_">Violated <Badge className="forAll">{totalMissing}</Badge>
                <Badge className="forFile hidden">{}</Badge></span>);
            default:
                break;
        }
    }

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
     * create a list div node for quantifier and satisfied result
     * @param group
     * @returns {Array}
     */
    listRender(group) {

        let self = this;

        let list = [];
        switch (group) {
            case 'all':
                for (let i = 0; i < this.ruleI['xPathQueryResult'].length; i++) {
                    list = list.concat(this.ruleI['xPathQueryResult'][i]['data']['quantifierResult'])
                }
                break;
            case 'satisfied':
                for (let i = 0; i < this.ruleI['xPathQueryResult'].length; i++) {
                    list = list.concat(this.ruleI['xPathQueryResult'][i]['data']['satisfiedResult'])
                }
                break;
            case 'violated':
                for (let i = 0; i < this.ruleI['xPathQueryResult'].length; i++) {
                    list = list.concat(this.ruleI['xPathQueryResult'][i]['data']['violatedResult'])
                }
                break;
            default:
                break;
        }

        return list.map((d, i) => {
            return (
                <div data-file-path={d['filePath']} className="partResultDiv" key={i}>
                        <pre className="link" onClick={() => {
                            Utilities.sendToServer(self.ws, "XML_RESULT", d['xml'])
                        }}>
                            <div className="content" dangerouslySetInnerHTML={{__html: d['snippet']}}/>
                        </pre>
                </div>
            )
        })

    };


    /**
     * update the rule and send to server
     */
    updateRules() {

        let newObj = Utilities.cloneJSON(this.ruleI);
        delete newObj['xPathQueryResult'];

        newObj['ruleDescription'] = document.getElementById(`rule_desc_${this.ruleI['index']}`).value;
        newObj['detail'] = document.getElementById(`rule_detail_${this.ruleI['index']}`).value;

        if (newObj['ruleDescription'] !== this.ruleI['ruleDescription'] || newObj['detail'] !== this.ruleI['detail'])
            Utilities.sendToServer(this.ws, "MODIFIED_RULE", newObj);
    };


    /**
     * toggle tabs
     * @param key
     */
    handleToggleTabs(key) {
        if (this.state.activeTab === key)
            this.setState({activeTab: 0});
        else
            this.setState({activeTab: key});
    }

}


export default RulePanel;