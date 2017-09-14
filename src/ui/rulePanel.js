/**
 * Created by saharmehrpour on 9/6/17.
 */

import React from 'react';
import '../App.css';

import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import PubSub from 'pubsub-js';
import Utilities from '../core/utilities';
import {Tab, Tabs, Badge, FormGroup, ControlLabel, FormControl, Label, Collapse} from 'react-bootstrap';


class RulePanel extends React.Component {

    constructor() {
        super();
        this.attachListener();
        this.state = {open: true};
    }

    render() {
        this.ruleI = this.props['ruleData'];
        this.ws = this.props['ws'];

        return (
            <div className="ruleDiv" id={`rule_panel_${this.ruleI['index']}`}>
                <FormGroup onClick={ () => this.setState({open: !this.state.open})}>
                    <ControlLabel>Rule Description</ControlLabel>
                    <FormControl componentClass="textarea" defaultValue={this.ruleI['ruleDescription']}
                                 id={`rule_desc_${this.ruleI['index']}`}
                                 onBlur={() => this.updateRules(this.ruleI['index'])}/>
                </FormGroup>
                <Collapse in={this.state.open}>
                    <div onClick={() => {
                        d3.select(`#rules_${this.ruleI['index']}`)
                            .selectAll('.active').classed('active', false);
                    }}>
                        <FormGroup>
                            <ControlLabel>Rule Detail</ControlLabel>
                            <FormControl componentClass="textarea" defaultValue={this.ruleI['detail']}
                                         id={`rule_detail_${this.ruleI['index']}`}
                                         onBlur={() => this.updateRules(this.ruleI['index'])}/>
                        </FormGroup>
                        <div>{this.tagRender()}</div>
                        <div style={{paddingTop: 10 + 'px', clear: 'both'}}>
                            <Tabs animation={true} id={"rules_" + this.ruleI['index']}>
                                <Tab eventKey={0} disabled>{}</Tab>
                                <Tab eventKey={1} title={this.tabHeaderRender('all')}
                                     animation={true}>{this.listRender('all')}</Tab>
                                <Tab eventKey={2}
                                     title={this.tabHeaderRender('satisfied')}>{this.listRender('satisfied')}</Tab>
                                <Tab eventKey={3}
                                     title={this.tabHeaderRender('violated')}>{this.listRender('violated')}</Tab>
                            </Tabs>
                        </div>
                    </div>
                </Collapse>
            </div>
        );
    }

    /**
     * subscribe for events
     */
    attachListener() {
        // [ruleIndex, rule]
        PubSub.subscribe('UPDATE_RULE', (msg, data) => {
            if (this.ruleI['index'] === +data[0]) {
                this.ruleI = data[1];
                this.updateFields();
                d3.select(`#rule_panel_${this.ruleI['index']}`)
                    .classed('red-bg', true);
            }
            else {
                d3.select(`#rule_panel_${this.ruleI['index']}`)
                    .classed('red-bg', false);
            }
        });

        // [hash, value]
        PubSub.subscribe('HASH', (msg, data) => {
            this.resetStyling();
            if (data[0] !== 'codeChanged')
                this.resetFile();
            if (data[0] === 'tag') {
                d3.select(d3.select(`#rule_panel_${this.ruleI['index']}`).node().parentNode)
                    .classed('hidden', () => {
                        return this.ruleI['tags'].indexOf(data[1]) === -1
                    });
            }
        });

        // [ruleTable, filePath]
        PubSub.subscribe('DISPLAY_UPDATE_RULES_FOR_FILE', (msg, data) => {
            this.filePath = data[1];
            this.ruleI = data[0].filter((d) => d['index'] === this.ruleI['index'])[0];
            this.displayUpdateForFile();
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
        return this.ruleI['tags'].map((d) => {
            return (
                <div className="buttonDiv">
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

        return list.map((d) => {
            return (
                <div data-file-path={d['filePath']} className="partResultDiv" onClick={() => {
                    Utilities.sendToServer(self.ws, "XML_RESULT", d['xml'])
                }}>
                        <pre className="link">
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
     * update fields upon update
     */
    updateFields() {
        document.getElementById(`rule_desc_${this.ruleI['index']}`).value = this.ruleI['ruleDescription'];
        document.getElementById(`rule_detail_${this.ruleI['index']}`).value = this.ruleI['detail'];

    }

    /**
     * reset settings
     */
    resetStyling() {

        d3.select(d3.select(`#rule_panel_${this.ruleI['index']}`).node().parentNode)
            .classed('hidden', false);

        // hide all open tabs
        d3.select(`#rules_${this.ruleI['index']}`)
            .selectAll('.active').classed('active', false);

    }

    /**
     * reset changes made by code modification in a file
     */
    resetFile() {
        // hide all forFile badges in Tabs
        d3.select(`#rules_${this.ruleI['index']}`)
            .selectAll('.forFile').classed('hidden', true);
        d3.select(`#rules_${this.ruleI['index']}`)
            .selectAll('.forAll').classed('hidden', false);
        d3.selectAll('.partResultDiv')
            .classed('hidden', false);

        d3.select(`#rule_panel_${this.ruleI['index']}`)
            .classed('red-bg', false)
            .classed('blue-bg', false)
            .classed('green-bg', false)
            .classed('hidden', false);

        this.setState({open: false});
    }

    /**
     * display the changes in the rule after modification in code
     */
    displayUpdateForFile() {
        let self = this;
        let ruleIfile = this.ruleI['xPathQueryResult'].filter((d) => d['filePath'] === this.filePath)[0]['data'];

        // update background

        let thisRuleDiv = d3.select(`#rule_panel_${this.ruleI['index']}`)
            .classed('blue-bg', () => ruleIfile['allChanged'] === 'greater' && ruleIfile['satisfiedChanged'] === ruleIfile['violatedChanged'] === 'none')
            .classed('green-bg', () => ruleIfile['satisfiedChanged'] === 'greater')
            .classed('red-bg', () => ruleIfile['violatedChanged'] === 'greater')
            // no result for the file AND unchanged
            .classed('hidden', () => !ruleIfile['changed'] && ruleIfile['violated'] === 0 && ruleIfile['satisfied'] === 0);

        if (!thisRuleDiv.classed('blue-bg') && !thisRuleDiv.classed('green-bg') && !thisRuleDiv.classed('red-bg'))
            this.setState({open: false});
        else
            this.setState({open: true});

        // update badges

        d3.select(`#rules_${this.ruleI['index']}`)
            .selectAll('.forAll').classed('hidden', true);

        d3.select(`#rules_${this.ruleI['index']}`)
            .select('.general_')
            .select('.forFile')
            .classed('hidden', false)
            .text(ruleIfile['satisfied'] + ruleIfile['violated']);

        d3.select(`#rules_${this.ruleI['index']}`)
            .select('.satisfied_')
            .select('.forFile')
            .classed('hidden', false)
            .text(ruleIfile['satisfied']);

        d3.select(`#rules_${this.ruleI['index']}`)
            .select('.violated_')
            .select('.forFile')
            .classed('hidden', false)
            .text(ruleIfile['violated']);

        // update and display relative snippet

        d3.select(`#rules_${this.ruleI['index']}`)
            .selectAll('.partResultDiv')
            .classed('hidden', true);

        /*  quantifier - All */

        let quantifierDiv = d3.select(`#rules_${this.ruleI['index']}`)
            .select(`#rules_${this.ruleI['index']}-pane-1`);

        quantifierDiv
            .selectAll('.partResultDiv')
            .filter(function () {
                return d3.select(this).attr('data-file-path') === self.filePath;
            }).remove();


        let list = ruleIfile['quantifierResult'];
        for (let i = 0; i < list.length; i++) {
            let div = quantifierDiv.append('div')
                .attr('data-file-path', list[i]['filePath'])
                .classed('partResultDiv', true)
                .on('click', () => {
                    Utilities.sendToServer(self.ws, "XML_RESULT", list[i]['xml'])
                });

            ReactDOM.render(
                (<pre className="link">
                    <div className="content" dangerouslySetInnerHTML={{__html: list[i]['snippet']}}/>
                </pre>), div.node());
        }

        /*  satisfied  */

        let satisfiedDiv = d3.select(`#rules_${this.ruleI['index']}`)
            .select(`#rules_${this.ruleI['index']}-pane-2`);

        satisfiedDiv
            .selectAll('.partResultDiv')
            .filter(function () {
                return d3.select(this).attr('data-file-path') === self.filePath;
            }).remove();

        let listS = ruleIfile['satisfiedResult'];
        for (let i = 0; i < listS.length; i++) {
            let div = satisfiedDiv.append('div')
                .attr('data-file-path', listS[i]['filePath'])
                .classed('partResultDiv', true)
                .on('click', () => {
                    Utilities.sendToServer(self.ws, "XML_RESULT", listS[i]['xml'])
                });

            ReactDOM.render(
                (<pre className="link">
                    <div className="content" dangerouslySetInnerHTML={{__html: listS[i]['snippet']}}/>
                </pre>), div.node());
        }


        /*  violated  */

        let violatedDiv = d3.select(`#rules_${this.ruleI['index']}`)
            .select(`#rules_${this.ruleI['index']}-pane-3`);

        violatedDiv
            .selectAll('.partResultDiv')
            .filter(function () {
                return d3.select(this).attr('data-file-path') === self.filePath;
            }).remove();

        let listV = ruleIfile['violatedResult'];

        for (let i = 0; i < listV.length; i++) {
            let div = violatedDiv.append('div')
                .attr('data-file-path', listV[i]['filePath'])
                .classed('partResultDiv', true)
                .on('click', () => {
                    Utilities.sendToServer(self.ws, "XML_RESULT", listV[i]['xml'])
                });

            ReactDOM.render(
                (<pre className="link">
                    <div className="content" dangerouslySetInnerHTML={{__html: listV[i]['snippet']}}/>
                </pre>), div.node());
        }
    }
}


export default RulePanel;