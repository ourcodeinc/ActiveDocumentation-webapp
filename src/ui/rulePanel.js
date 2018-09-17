/**
 * Created by saharmehrpour on 9/6/17.
 */

import React, {Component, Fragment} from 'react';
import '../App.css';
import * as d3 from 'd3';

import Utilities from '../core/utilities';
import {
    Tab, Tabs, Badge, FormGroup, ControlLabel, Label, Collapse, FormControl, DropdownButton,
    MenuItem, Button, ButtonToolbar, Row, Col
} from 'react-bootstrap';
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaCaretUp from 'react-icons/lib/fa/caret-up';
import MdEdit from 'react-icons/lib/md/edit';
import TiDelete from "react-icons/lib/ti/delete";

import {ignoreFile} from "../actions";
import AutoComplete from "./grammarRuleGen/autoComplete";

import {connect} from "react-redux";

class RulePanel extends Component {

    constructor(props) {
        super(props);
        this.ruleIndex = props["ruleIndex"];
        this.ruleI = null;

        this.state = {
            open: true, class: "ruleDiv", activeTab: 0, editMode: false,
            // ruleI states
            title: "",
            description: "",
            availableTags: [],
            tags: [],
            folderConstraint: "",
            filesFolders: [],
            autoCompleteText: ""
        };

        this.caretClass = {
            true: {cursor: "pointer", color: "black"},
            false: {cursor: "pointer", color: "darkgrey"}
        };

        this.handleToggleTabs = this.handleToggleTabs.bind(this);
    }

    render() {
        this.ruleI = this.props.rules.filter((d) => d.index === this.ruleIndex)[0]; // can throws error?
        return (
            <div className={this.state.class}>
                <FormGroup>
                    <div style={{float: 'right'}}>
                        <MdEdit size={20} onClick={() => this.changeEditMode()}/>
                        <FaCaretUp size={20} onClick={() => this.setState({open: false})}
                                   style={this.caretClass[this.state.open.toString()]}/>
                        <FaCaretDown size={20} onClick={() => this.setState({open: true})}
                                     style={this.caretClass[(!this.state.open).toString()]}/>
                    </div>
                    {!this.state.editMode ? (
                        <Fragment>
                            <ControlLabel>{this.ruleI["title"]}</ControlLabel>
                            <p>{this.ruleI["description"]}</p>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <FormControl componentClass="textarea" placeholder="Title"
                                         style={{fontWeight: "bold"}}
                                         value={this.state.title}
                                         onChange={(e) => {
                                             this.setState({title: e.target.value})
                                         }}
                                         onKeyUp={(e) => {
                                             e.target.style.cssText = 'height:auto; padding:0';
                                             e.target.style.cssText = 'height:' + this.scrollHeight + 'px';
                                         }}/>
                            <FormControl componentClass="textarea" placeholder="Description"
                                         value={this.state.description}
                                         onChange={(e) => {
                                             this.setState({description: e.target.value})
                                         }}
                                         onKeyUp={(e) => {
                                             e.target.style.cssText = 'height:auto; padding:0';
                                             e.target.style.cssText = 'height:' + this.scrollHeight + 'px';
                                         }}/>
                            <AutoComplete ref={(autoComplete) => this.autoComplete = autoComplete}
                                          defaultValue={this.state.autoCompleteText}
                                          onBlur={() => console.log("onBlur")}
                                          onUpdateText={() => console.log("onUpdateText")}/>

                            <div>{this.renderFileConstraints()}</div>

                        </Fragment>
                    )}
                </FormGroup>
                <Collapse in={this.state.open}>
                    <div>
                        <div>{this.tagRender()}</div>
                        {!this.state.editMode ? (
                            <div style={{paddingTop: '10px', clear: 'both'}}>
                                <Tabs animation={true} id={"rules_" + this.ruleIndex} activeKey={this.state.activeTab}
                                      onSelect={this.handleToggleTabs}>
                                    <Tab eventKey={0} disabled>{}</Tab>
                                    <Tab eventKey={'satisfied'}
                                         title={this.tabHeaderRender('satisfied')}>{this.listRender('satisfied')}</Tab>
                                    <Tab eventKey={'violated'}
                                         title={this.tabHeaderRender('violated')}>{this.listRender('violated')}</Tab>
                                </Tabs>
                            </div>
                        ) : null}
                    </div>
                </Collapse>
                {this.state.editMode ? (
                    <div>
                        <div style={{width: 200, float: "left", paddingRight: "5px"}}>
                            <Button bsStyle="primary" block onClick={() => this.onSubmitUpdatedRule()}>Submit</Button>
                        </div>
                        <div style={{width: 200, float: "left"}}>
                            <Button bsStyle="default" block onClick={() => this.changeEditMode()}>Cancel</Button>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        this.setState({
            title: this.ruleI.title,
            description: this.ruleI.description,
            availableTags: nextProps.tags.filter(d => this.ruleI.tags.indexOf(d.tagName) === -1),
            tags: this.ruleI.tags,
            folderConstraint: this.ruleI.ruleType.constraint,
            filesFolders: this.ruleI.ruleType.checkFor,
            autoCompleteText: this.ruleI.grammar ? this.ruleI.grammar : ""
        });

    }

    /**
     * set the states 'open' and 'class' after mounting.
     */
    componentDidMount() {
        if (!this.props.codeChanged) {
            this.setState({
                class: "ruleDiv",
                open: (() => {
                    if (this.props.filePath === "none") return true;
                    let file = this.ruleI['xPathQueryResult'].filter(d => d["filePath"] === this.props.filePath);
                    return (file.length > 0)
                    //     return file[0]['data'].violated !== 0 || file[0]['data'].satisfied !== 0;
                    // return false;
                })()
            });
            return;
        }

        let file = this.ruleI['xPathQueryResult'].filter(d => d["filePath"] === this.props.filePath);
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
        let file = this.ruleI['xPathQueryResult'].filter(d => d["filePath"] === this.props.filePath);
        if (file.length > 0) {
            fileSatisfied = file[0]['data']['satisfied'];
            fileViolated = file[0]['data']['violated'];
        }

        switch (group) {
            case 'all':
                return (
                    <span className="general_">Matches
                        {this.props.filePath !== "none" ? (
                            <Fragment>
                                <Badge className="forAll">{fileSatisfied + fileViolated}</Badge>
                                <span style={{color: "#777"}}>out of</span>
                                <Badge className="forAll">{totalSatisfied + totalViolated}</Badge>
                            </Fragment>
                        ) : (
                            <Badge className="forAll">{totalSatisfied + totalViolated}</Badge>
                        )}
                        <Badge className="forFile hidden">{}</Badge>
                    </span>);
            case 'satisfied':
                return (
                    <span className="satisfied_">Examples
                        {this.props.filePath !== "none" ? (
                            <Fragment>
                                <Badge className="forAll">{fileSatisfied}</Badge>
                                <span style={{color: "#777"}}>out of</span>
                                <Badge className="forAll">{totalSatisfied}</Badge>
                            </Fragment>
                            ):(
                            <Badge className="forAll">{totalSatisfied}</Badge>
                        )}
                        <Badge className="forFile hidden">{}</Badge>
                    </span>);
            case 'violated':
                return (
                    <span className="violated_">Violated
                        {this.props.filePath !== "none" ? (
                            <Fragment>
                                <Badge className="forAll">{fileViolated}</Badge>
                                <span style={{color: "#777"}}>out of</span>
                                <Badge className="forAll">{totalViolated}</Badge>
                            </Fragment>
                        ):(
                            <Badge className="forAll">{totalViolated}</Badge>
                        )}
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
        if (this.state.editMode)
            return (
                <div>
                    <div style={{paddingBottom: "10px"}}>
                        <DropdownButton title={"Select Tags"} id={"drop_down"}>
                            {this.state.availableTags.map((el, i) => {
                                if (this.state.tags.indexOf(el.tagName) === -1)
                                    return (
                                        <MenuItem eventKey={el.tagName} key={i}
                                                  onSelect={(evt) => {
                                                      const tags = this.state.tags;
                                                      tags.push(evt);
                                                      this.setState({tags})
                                                  }}
                                        >{el.tagName}
                                        </MenuItem>);
                                return (null);
                            })}
                        </DropdownButton>
                    </div>
                    <div>
                        {this.state.tags.map((d, i) => {
                            return (
                                <div style={{float: "left", margin: "0 15px 10px 0"}} key={i}>
                                    <Label>{d}</Label>
                                    <TiDelete size={23}
                                              className={"tiDelete"}
                                              onClick={() => {
                                                  const tags = this.state.tags;
                                                  tags.splice(i, 1);
                                                  this.setState({tags});
                                              }}/>
                                </div>)
                        })}
                    </div>
                </div>
            );
        return this.ruleI["tags"].map((d, i) => {
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
        let file = this.ruleI['xPathQueryResult'].filter(d => d["filePath"] === this.props.filePath);

        switch (group) {
            case 'all':
                if (this.props.filePath !== "none") {
                    if (file.length > 0)
                        fileList = file[0]['data']['quantifierResult'];
                }
                for (let i = 0; i < this.ruleI['xPathQueryResult'].length; i++) {
                    if (this.ruleI['xPathQueryResult'][i]["filePath"] === this.props.filePath) continue;
                    otherFilesList = otherFilesList.concat(this.ruleI['xPathQueryResult'][i]['data']['quantifierResult'])
                }
                break;
            case 'satisfied':
                if (this.props.filePath !== "none") {
                    if (file.length > 0)
                        fileList = file[0]['data']['satisfiedResult'];
                }
                for (let i = 0; i < this.ruleI['xPathQueryResult'].length; i++) {
                    if (this.ruleI['xPathQueryResult'][i]["filePath"] === this.props.filePath) continue;
                    otherFilesList = otherFilesList.concat(this.ruleI['xPathQueryResult'][i]['data']['satisfiedResult'])
                }
                break;
            case 'violated':
                if (this.props.filePath !== "none") {
                    if (file.length > 0)
                        fileList = file[0]['data']['violatedResult'];
                }
                for (let i = 0; i < this.ruleI['xPathQueryResult'].length; i++) {
                    if (this.ruleI['xPathQueryResult'][i]["filePath"] === this.props.filePath) continue;
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
                {this.props.filePath !== "none" ? (
                    <Fragment>
                        <h4>{headerText + " for this file"}</h4>
                        <div>{returnList(fileList)}</div>
                        <h4>{headerText + " for other files"}</h4>
                    </Fragment>
                ) : null}
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

        newObj['title'] = this.state.title;
        newObj['description'] = this.state.description;

        if (this.state.title !== this.ruleI['title'] || this.state.description !== this.ruleI['description'])
            Utilities.sendToServer(this.props.ws, "MODIFIED_RULE", newObj);
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


    /**
     * change edit mode, set the states
     */
    changeEditMode() {
        this.setState({
            editMode: !this.state.editMode,
            title: this.ruleI.title,
            description: this.ruleI.description,
            availableTags: this.props.tags.filter(d => this.ruleI.tags.indexOf(d.tagName) === -1),
            tags: this.ruleI.tags,
            folderConstraint: this.ruleI.ruleType.constraint,
            filesFolders: this.ruleI.ruleType.checkFor,
            autoCompleteText: this.ruleI.grammar ? this.ruleI.grammar : ""
        })
    }


    /**
     * render the drop down for the file/folder constraint
     */
    renderFileConstraints() {
        return (
            <div>
                <div style={{paddingBottom: "10px"}}>
                    <em>{"Restriction:   "}</em>
                    <ButtonToolbar>
                        <DropdownButton
                            title={this.state.folderConstraint === "" ? "Select" : this.state.folderConstraint}
                            className={this.state.target} id={"drop_down"}>
                            <MenuItem eventKey={"FOLDER"} onSelect={(evt) => {
                                this.setState({folderConstraint: evt})
                            }}>FOLDER
                            </MenuItem>
                            <MenuItem eventKey={"NONE"} onSelect={(evt) => {
                                this.setState({folderConstraint: evt})
                            }}>NONE
                            </MenuItem>
                        </DropdownButton>
                        <Button onClick={() => {
                            const filesFolders = this.state.filesFolders;
                            filesFolders.push("");
                            this.setState({filesFolders});
                        }}>Add files/folders
                        </Button>
                    </ButtonToolbar>
                </div>
                <div>
                    {this.state.filesFolders.map((d, i) => {
                        return (
                            <Row key={i} style={{paddingBottom: "5px"}}>
                                <Col sm={11} md={10}>
                                    <FormControl id={"filesFolders_textarea_" + i} type="text" defaultValue={d}
                                                 placeholder="relative File/Folder path"
                                                 onBlur={(e) => {
                                                     const filesFolders = this.state.filesFolders;
                                                     filesFolders[i] = e.target.value;
                                                     this.setState({filesFolders});
                                                 }}/>
                                </Col>
                                <Col sm={1} md={1} style={{paddingTop: "5px"}}>
                                    <TiDelete size={25}
                                              className={"tiDelete"}
                                              onClick={() => {
                                                  const filesFolders = this.state.filesFolders;
                                                  filesFolders.splice(i, 1);
                                                  this.setState({filesFolders});
                                              }}/>
                                </Col>
                            </Row>
                        )
                    })}
                </div>
            </div>
        )
    }

    /**
     * submit the new rule
     */
    onSubmitUpdatedRule() {
        // todo
    }
}

// map state to props
function mapStateToProps(state) {
    return {
        rules: state.ruleTable,
        tags: state.tagTable,
        codeChanged: state.hash[0] === "codeChanged",
        filePath: ["rulesForFile", "codeChanged"].indexOf(state.hash[0]) !== -1 ?
            ('/Users/saharmehrpour/Documents/Workspace/' + state.filePath) : "none",
        ws: state.ws
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onIgnoreFile: (value) => {
            dispatch(ignoreFile(value));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RulePanel);