/**
 * Created by saharmehrpour on 9/8/17.
 */

import React, {Component} from 'react';
import '../App.css';

import Utilities from '../core/utilities';
import {Button, Collapse} from 'react-bootstrap';


class IndividualRuleList extends Component {

    constructor() {
        super();
        this.attachListener();

        this.state = {};
    }

    /**
     * subscribe for events
     */
    attachListener() {

    }

    render() {
        this.ruleI = this.props['ruleI'];
        this.ws = this.props['ws'];
        return (
            <div>
                <Button onClick={ () => this.setState({open: !this.state.open})} bsStyle={this.setButtonClass()}
                        bsSize="xsmall">
                    {this.buttonTextRender()}
                </Button>
                <Collapse in={this.state.open}>
                    <div>
                        {this.listRender(this.props['group'])}
                    </div>
                </Collapse>
            </div>
        );

    }

    /**
     * set the class of buttons for styling
     * @returns {*}
     */
    setButtonClass() {
        if (this.props['group'] === 'all')
            return "primary";
        if (this.props['group'] === 'satisfied')
            return "success";
        if (this.props['group'] === 'violated')
            return "danger";
    }

    /**
     * create a list div node for quantifier and satisfied result
     * @param group
     * @returns
     */
    listRender(group) {

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
            default:
                break

        }

        return list.map((d, i) => {
            return (
                <div className="snippetDiv" onClick={() => {
                    Utilities.sendToServer(this.ws, "XML_RESULT", d['xml'])
                }} key={i}>
                <pre className="link">
                    <div className="content" dangerouslySetInnerHTML={{__html: d['snippet']}}/>
                </pre>
                </div>
            )
        });
    }

    /**
     * render the tab headers
     */
    buttonTextRender() {
        // sum up the number of satisfied and violated
        let totalSatisfied = 0, totalMissing = 0;
        for (let i = 0; i < this.ruleI['xPathQueryResult'].length; i++) {
            totalSatisfied += this.ruleI['xPathQueryResult'][i]['data']['satisfied'];
            totalMissing += this.ruleI['xPathQueryResult'][i]['data']['violated']
        }

        switch (this.props['group']) {
            case 'all':
                return (<span> {totalSatisfied + totalMissing} Matches</span>);
            case 'satisfied':
                return (<span> {totalSatisfied} Satisfied</span>);
            case 'violated':
                return (<span>{totalMissing} Violated</span>);
            default:
                break;
        }
    }

}

export default IndividualRuleList;