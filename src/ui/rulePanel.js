/**
 * Created by saharmehrpour on 9/6/17.
 */

import React, {Component} from 'react';
import '../App.css';
import * as d3 from 'd3';

import Utilities from '../core/utilities';
import {Tab, Tabs, Badge, FormGroup, ControlLabel, Label, Collapse} from 'react-bootstrap';
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaCaretUp from 'react-icons/lib/fa/caret-up';
import {ignoreFile} from "../actions";
import {connect} from "react-redux";

class RulePanel extends Component {

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
        this.filePath = this.props['filePath'];

        return (
            <div className={this.state.class} id={`rule_panel_${this.ruleI['index']}`}>
                <FormGroup>
                    <div style={{float: 'right'}}>
                        (<a onClick={() => window.location.hash = '#/rule/' + this.ruleI['index']}>view the rule
                            and all snippets</a>)
                        <FaCaretUp size={20} onClick={() => this.setState({open: false})}
                                   style={this.caretClass[this.state.open.toString()]}/>
                        <FaCaretDown size={20} onClick={() => this.setState({open: true})}
                                     style={this.caretClass[(!this.state.open).toString()]}/>
                    </div>
                    <ControlLabel>{this.ruleI['title']}</ControlLabel>
                    <p>{this.ruleI['description']}</p>
                </FormGroup>
                <Collapse in={this.state.open}>
                    <div>
                        <div>{this.tagRender()}</div>
                        <div style={{paddingTop: 10 + 'px', clear: 'both'}}>
                            <Tabs animation={true} id={"rules_" + this.ruleI['index']} activeKey={this.state.activeTab}
                                  onSelect={this.handleToggleTabs}>
                                <Tab eventKey={0} disabled>{}</Tab>
                                {/*<Tab eventKey={'all'} title={this.tabHeaderRender('all')}*/}
                                {/*animation={true}>{this.listRender('all')}</Tab>*/}
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
            this.setState({
                class: "ruleDiv",
                open: (() => {
                    if (this.filePath === "none") return true;
                    let file = this.ruleI['xPathQueryResult'].filter(d => d["filePath"] === this.filePath);
                    return (file.length > 0)
                    //     return file[0]['data'].violated !== 0 || file[0]['data'].satisfied !== 0;
                    // return false;
                })()
            });
            return;
        }

        let file = this.ruleI['xPathQueryResult'].filter(d => d["filePath"] === this.filePath);
        let ruleIfile = file.length !== 0 ? file[0]['data'] : {};
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

        if (file.length > 0) {
            this.setState({open: true, class: "ruleDiv"});
            return;
        }

        if (ruleIfile['violated'] === 0) {
            this.setState({open: false, class: "ruleDiv"});
            return;
        }
        this.setState({open: false, class: "ruleDiv"});

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
        let totalSatisfied = 0, totalViolated = 0;
        for (let i = 0; i < this.ruleI['xPathQueryResult'].length; i++) {
            totalSatisfied += this.ruleI['xPathQueryResult'][i]['data']['satisfied'];
            totalViolated += this.ruleI['xPathQueryResult'][i]['data']['violated']
        }

        let fileSatisfied = 0, fileViolated = 0;
        let file = this.ruleI['xPathQueryResult'].filter(d => d["filePath"] === this.filePath);
        if (file.length > 0) {
            fileSatisfied = file[0]['data']['satisfied'];
            fileViolated = file[0]['data']['violated'];
        }

        switch (group) {
            case 'all':
                return (
                    <span className="general_">Matches
                        {(() => {
                            if (this.filePath !== "none")
                                return (<Badge className="forAll">{fileSatisfied + fileViolated}</Badge>);
                            return (<Badge className="forAll">{totalSatisfied + totalViolated}</Badge>)
                        })()}
                        {(() => {
                            if (this.filePath !== "none") return (<span style={{color: "#777"}}>out of</span>)
                        })()}
                        {(() => {
                            if (this.filePath !== "none")
                                return (<Badge className="forAll">{totalSatisfied + totalViolated}</Badge>)
                        })()}
                        <Badge className="forFile hidden">{}</Badge>
                    </span>);
            case 'satisfied':
                return (
                    <span className="satisfied_">Examples
                        {(() => {
                            if (this.filePath !== "none")
                                return (<Badge className="forAll">{fileSatisfied}</Badge>);
                            return (<Badge className="forAll">{totalSatisfied}</Badge>)
                        })()}
                        {(() => {
                            if (this.filePath !== "none") return (<span style={{color: "#777"}}>out of</span>)
                        })()}
                        {(() => {
                            if (this.filePath !== "none")
                                return (<Badge className="forAll">{totalSatisfied}</Badge>)
                        })()}
                        <Badge className="forFile hidden">{}</Badge>
                    </span>);
            case 'violated':
                return (
                    <span className="violated_">Violated
                        {(() => {
                            if (this.filePath !== "none")
                                return (<Badge className="forAll">{fileViolated}</Badge>);
                            return (<Badge className="forAll">{totalViolated}</Badge>)
                        })()}
                        {(() => {
                            if (this.filePath !== "none") return (<span style={{color: "#777"}}>out of</span>)
                        })()}
                        {(() => {
                            if (this.filePath !== "none")
                                return (<Badge className="forAll">{totalViolated}</Badge>)
                        })()}
                        <Badge className="forFile hidden">{}</Badge>
                    </span>);
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
                    <Label onClick={() =>
                        // PubSub.publish('UPDATE_HASH', ['tag', d])
                        window.location.hash = '#/tag/' + d.replace(/\//g, '%2F')
                    }>{d}</Label>
                </div>)
        });
    }

    /**
     * create a list div node for quantifier and satisfied result and wrap them in a div
     * @param group
     * @returns {XML}
     */
    listRender(group) {

        let self = this;

        let otherFilesList = [], fileList = [];
        let file = this.ruleI['xPathQueryResult'].filter(d => d["filePath"] === this.filePath);

        switch (group) {
            case 'all':
                if (this.filePath !== "none") {
                    if (file.length > 0)
                        fileList = file[0]['data']['quantifierResult'];
                }
                for (let i = 0; i < this.ruleI['xPathQueryResult'].length; i++) {
                    if (this.ruleI['xPathQueryResult'][i]["filePath"] === this.filePath) continue;
                    otherFilesList = otherFilesList.concat(this.ruleI['xPathQueryResult'][i]['data']['quantifierResult'])
                }
                break;
            case 'satisfied':
                if (this.filePath !== "none") {
                    if (file.length > 0)
                        fileList = file[0]['data']['satisfiedResult'];
                }
                for (let i = 0; i < this.ruleI['xPathQueryResult'].length; i++) {
                    if (this.ruleI['xPathQueryResult'][i]["filePath"] === this.filePath) continue;
                    otherFilesList = otherFilesList.concat(this.ruleI['xPathQueryResult'][i]['data']['satisfiedResult'])
                }
                break;
            case 'violated':
                if (this.filePath !== "none") {
                    if (file.length > 0)
                        fileList = file[0]['data']['violatedResult'];
                }
                for (let i = 0; i < this.ruleI['xPathQueryResult'].length; i++) {
                    if (this.ruleI['xPathQueryResult'][i]["filePath"] === this.filePath) continue;
                    otherFilesList = otherFilesList.concat(this.ruleI['xPathQueryResult'][i]['data']['violatedResult'])
                }
                break;
            default:
                break;
        }

        let returnList = (list) => {
            if (list.length === 0)
                return (<h5>No snippet</h5>);
            return list.map((d, i) => {
                return (
                    <div data-file-path={d['filePath']} className="partResultDiv" key={i}>
                                <pre className="link" onClick={() => {
                                    this.props.onIgnoreFile(true);
                                    // PubSub.publish("IGNORE_FILE", [true]);
                                    Utilities.sendToServer(self.ws, "XML_RESULT", d['xml'])
                                }}>
                                    <div className="content" dangerouslySetInnerHTML={{__html: d['snippet']}}/>
                                </pre>
                    </div>
                )
            })
        };

        let headerText = group === "all" ? "Matches" : group === "satisfied" ? "Example Snippet" : "Violated snippet";

        return (
            <div>
                {(() => {
                    if (this.filePath !== "none") return (<h4>{headerText + " for this file"}</h4>)
                })()}
                {(() => {
                    if (this.filePath !== "none") return (<div>{returnList(fileList)}</div>)
                })()}
                {(() => {
                    if (this.filePath !== "none") return (<h4>{headerText + " for other files"}</h4>)
                })()}
                <div>{returnList(otherFilesList)}</div>
            </div>
        )
    }


    /**
     * update the rule and send to server
     */
    updateRules() {

        let newObj = Utilities.cloneJSON(this.ruleI);
        delete newObj['xPathQueryResult'];

        newObj['title'] = document.getElementById(`rule_title_${this.ruleI['index']}`).value;
        newObj['description'] = document.getElementById(`rule_description_${this.ruleI['index']}`).value;

        if (newObj['title'] !== this.ruleI['title'] || newObj['description'] !== this.ruleI['description'])
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

function mapDispatchToProps(dispatch) {
    return {
        onIgnoreFile: (value) => {
            dispatch(ignoreFile(value));
        }
    }
}

export default connect(null, mapDispatchToProps)(RulePanel);