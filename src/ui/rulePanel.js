/**
 * Created by saharmehrpour on 9/6/17.
 */

import React from 'react';
import '../App.css';

// import ReactDOM from 'react-dom';
// import * as d3 from 'd3';
import PubSub from 'pubsub-js';
import Utilities from '../core/utilities';
import {Tab, Tabs, Badge, FormGroup, ControlLabel, FormControl, Label} from 'react-bootstrap';


class RulePanel extends React.Component {

    constructor() {
        super();
    }

    render() {
        this.ruleI = this.props['ruleData'];
        return (
            <div className="ruleDiv">
                <FormGroup>
                    <ControlLabel>Rule Description</ControlLabel>
                    <FormControl componentClass="textarea" value={this.ruleI['ruleDescription']}
                                 onChange={() => this.updateRules(this.ruleI['index'])}/>
                    <ControlLabel>Rule Detail</ControlLabel>
                    <FormControl componentClass="textarea" value={this.ruleI['detail']}
                                 onChange={() => this.updateRules(this.ruleI['index'])}/>
                </FormGroup>
                <div>{this.tagRender()}</div>
                <div style={{paddingTop: 10 + 'px', clear: 'both'}}>
                    <Tabs animation={true} id={"rules_" + this.ruleI['index']}>
                        <Tab eventKey={1} title={this.tabHeaderRender('all')}
                             animation={true}>{this.listRender('all')}</Tab>
                        <Tab eventKey={2}
                             title={this.tabHeaderRender('satisfied')}>{this.listRender('satisfied')}</Tab>
                        <Tab eventKey={3} title={this.tabHeaderRender('violated')}>{this.listRender('violated')}</Tab>
                    </Tabs>
                </div>
            </div>
        );
    }

    // /**
    //  * Attach listeners
    //  */
    // attachListener() {
    //
    //
    // }

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
                return (<span className="general_">Matches <Badge>{totalSatisfied + totalMissing}</Badge></span>);
            case 'satisfied':
                return (<span className="satisfied_">Satisfied <Badge>{totalSatisfied}</Badge></span>);
            case 'violated':
                return (<span className="violated_">Violated <Badge>{totalMissing}</Badge></span>);
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
     * @returns {}
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
            case 'quantifierChanged':
                list = this.ruleI['quantifierResult'];
                break;
            case 'satisfiedChanged':
                list = this.ruleI['satisfiedResult'];
                break;
            case 'violatedChanged':
                list = this.ruleI['violatedResult'];
                break;
            default:
                break;
        }

        return list.map((d, i) => {
            return (
                <div className="partResultDiv">
                <pre className="link" onClick={Utilities.sendToServer(self.ws, "XML_RESULT", d['xml'])}>
                    <div className="content" dangerouslySetInnerHTML={{__html: d['snippet']}}/>
                </pre>
                </div>
            )
        });

    };

}


export default RulePanel;