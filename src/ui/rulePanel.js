/**
 * Created by saharmehrpour on 9/6/17.
 */

import React, {Component, Fragment} from 'react';
import '../App.css';
import ReactTooltip from 'react-tooltip'

import Utilities from '../core/utilities';
import {
    Tab, Tabs, Badge, FormGroup, ControlLabel, Label, Collapse, FormControl, DropdownButton,
    MenuItem, Button, ButtonToolbar, Row, Col, HelpBlock, Alert, Modal
} from 'react-bootstrap';
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaCaretUp from 'react-icons/lib/fa/caret-up';
import MdEdit from 'react-icons/lib/md/edit';
import TiDelete from "react-icons/lib/ti/delete";
import {FaQuestionCircle} from "react-icons/lib/fa/index";

import {ignoreFile, submitNewRule, submitNewTag, updateRule} from "../actions";
import AutoComplete from "./grammarRuleGen/autoComplete";
import verifyTextBasedOnGrammar from "./grammarRuleGen/languageProcessing";

import {connect} from "react-redux";
import CustomDropdown from "./customDropdown";

class RulePanel extends Component {

    constructor(props) {
        super(props);
        this.ruleIndex = props["ruleIndex"] !== undefined ? props["ruleIndex"] : -1;
        this.ruleI = null;
        this.newRuleRequest = !!props["newRule"];

        if (this.newRuleRequest && !props["cancelGeneratingNewRule"])
            return new Error(`'cancelGeneratingNewRule' is required in props when creating a new rule.`);

        // should not be in state, it need to be changed after single use.
        // the component is updated after changing this value because the state is also changing
        // otherwise call this.forceUpdate()
        this.autoCompleteCaretPosition = -1;
        this.shouldAlert = true;

        this.state = {
            open: true,
            className: "rulePanelDiv" + (this.newRuleRequest ? " edit-bg" : ""),
            activeTab: 0,
            editMode: !!props["newRule"], // default must be false unless a new rule is being generated,
            showAlert: true,
            error: "",
            showNewTagModal: false,
            // ruleI states
            title: "",
            description: "",
            ruleTags: [],
            tags: [],
            folderConstraint: "",
            filesFolders: [],
            autoCompleteText: "",
            quantifierXPath: "",
            constraintXPath: "",
            // new tag states
            tagName: "",
            tagDetail: ""
        };

        this.caretClass = {
            true: {cursor: "pointer", color: "black"},
            false: {cursor: "pointer", color: "darkgrey"}
        };

        this.editIconClass = {
            true: {color: "#337ab7", cursor: "pointer"},
            false: {color: "black", cursor: "pointer"}
        };

        this.handleToggleTabs = this.handleToggleTabs.bind(this);
    }

    render() {
        if (!this.newRuleRequest) {
            try {
                this.ruleI = this.props.rules.filter((d) => d.index === this.ruleIndex)[0];
            }
            catch (e) {
                console.log(`There is no rule with index ${this.ruleIndex}`);
                this.ruleI = null;
            }
        }
        else this.ruleI = null;

        return (
            <div className={this.state.className}>
                <FormGroup>
                    <div style={{float: 'right'}}>
                        {!this.state.editMode ? (
                            <Fragment>
                                <FaCaretUp size={20} onClick={() => this.setState({open: false})}
                                           style={this.caretClass[this.state.open.toString()]}/>
                                <FaCaretDown size={20} onClick={() => this.setState({open: true})}
                                             style={this.caretClass[(!this.state.open).toString()]}/>
                            </Fragment>
                        ) : null}
                        <MdEdit size={20} style={this.editIconClass[this.state.editMode.toString()]}
                                onClick={() => this.changeEditMode()}/>
                    </div>
                    {!this.state.editMode ? (
                        <Fragment>
                            <ControlLabel>{this.ruleI["title"]}</ControlLabel>
                            <p>{this.ruleI["description"]}</p>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <FormGroup validationState={(this.state.title === "") ? "error" : "success"}>
                                <FormControl componentClass="textarea" placeholder="Rule title. (Required)"
                                             style={{fontWeight: "bold"}}
                                             value={this.state.title}
                                             onChange={(e) => {
                                                 this.setState({title: e.target.value})
                                             }}
                                             onKeyUp={(e) => {
                                                 e.target.style.cssText = 'height:auto; padding:0';
                                                 e.target.style.cssText = 'height:' + this.scrollHeight + 'px';
                                             }}/>
                            </FormGroup>
                            <FormGroup validationState={(this.state.description === "") ? "error" : "success"}>
                                <FormControl componentClass="textarea"
                                             placeholder="Description, high level details about the rule. (Required)"
                                             value={this.state.description}
                                             onChange={(e) => {
                                                 this.setState({description: e.target.value})
                                             }}
                                             onKeyUp={(e) => {
                                                 e.target.style.cssText = 'height:auto; padding:0';
                                                 e.target.style.cssText = 'height:' + this.scrollHeight + 'px';
                                             }}/>
                            </FormGroup>
                        </Fragment>
                    )}
                </FormGroup>
                <Collapse in={this.state.open}>
                    <div>
                        <div style={{paddingTop: '10px', clear: 'both'}}>
                            {this.tagRender()}
                        </div>
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
                    <div style={{paddingTop: '10px', clear: 'both'}}>
                        <FormGroup
                            validationState={(this.state.folderConstraint === "" || (this.state.folderConstraint === "FOLDER" && this.state.filesFolders.length === 0)) ? "error" : "success"}>
                            <div>{this.renderFileConstraints()}</div>
                        </FormGroup>
                        {this.state.error === "" ? null : !this.state.showAlert ? null : (
                            <Alert bsStyle={this.state.error.alertType}>
                                <h4>{this.state.error.errorType}</h4>
                                <h6>{this.state.error.message}</h6>
                                <ButtonToolbar>
                                    <Button onClick={() => this.setState({error: ""})}>Got it!</Button>
                                    <Button onClick={() => this.setState({showAlert: false})}>Hide Alerts</Button>
                                </ButtonToolbar>
                            </Alert>
                        )}
                        {this.state.showAlert ? null : (
                            <div style={{paddingBottom: "10px"}}>
                                <Button onClick={() => this.setState({showAlert: true})}>Show Alerts</Button>
                            </div>
                        )}
                        <AutoComplete ref={(autoComplete) => this.autoComplete = autoComplete}
                                      defaultValue={this.state.autoCompleteText}
                                      onBlur={() => {
                                          if(this.shouldAlert) {
                                              verifyTextBasedOnGrammar(this.state.autoCompleteText)
                                                  .then((data) => this.setState(data))
                                                  .catch((error) => this.processLanguageProcessingError(error));
                                              this.shouldAlert = false;
                                          }
                                      }}
                                      onUpdateText={(text) => {
                                          this.shouldAlert = true;
                                          this.setState({autoCompleteText: text})
                                      }}
                                      caretPosition={(() => {
                                          let newFocus = this.autoCompleteCaretPosition;
                                          this.autoCompleteCaretPosition = -1;
                                          return newFocus;
                                      })()}/>
                        <div>
                            <ButtonToolbar className={"submitButtons"}>
                                <Button bsStyle="primary"
                                        onClick={() => this.newRuleRequest ? this.onSubmitNewRule() : this.onSubmitUpdatedRule()}>
                                    Submit</Button>
                                <Button bsStyle="default" onClick={() => this.changeEditMode()}>Cancel</Button>
                            </ButtonToolbar>
                        </div>
                    </div>
                ) : null}
                {this.renderNewTagModalDialog()}
            </div>
        );
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        if (this.ruleI)
            this.setState({
                title: this.ruleI.title,
                description: this.ruleI.description,
                tags: nextProps.tags,
                ruleTags: this.ruleI.tags,
                folderConstraint: this.ruleI.ruleType.constraint,
                filesFolders: this.ruleI.ruleType.checkFor,
                autoCompleteText: this.ruleI.grammar ? this.ruleI.grammar : "",
                quantifierXPath: this.ruleI.quantifier.command,
                constraintXPath: this.ruleI.constraint.command
            });
        this.setState({tags: nextProps.tags});

    }

    /**
     * set the states 'open' and 'className' after mounting.
     */
    componentDidMount() {
        if (!this.props.codeChanged) {
            this.setState({
                className: "rulePanelDiv" + (this.newRuleRequest ? " edit-bg" : ""),
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
            this.setState({open: true, className: "rulePanelDiv blue-bg"});
            return;
        }
        if (ruleIfile['satisfiedChanged'] === 'greater') {
            this.setState({open: true, className: "rulePanelDiv green-bg"});
            return;
        }
        if (ruleIfile['violatedChanged'] === 'greater') {
            this.setState({open: true, className: "rulePanelDiv red-bg"});
            return;
        }
        // if (!ruleIfile['changed'] && ruleIfile['violated'] === 0 && ruleIfile['satisfied'] === 0) {
        //     this.setState({open: false, className: "rulePanelDiv"});
        //     return;
        // }

        if (file.length > 0) {
            this.setState({open: true, className: "rulePanelDiv"});
            return;
        }

        if (ruleIfile['violated'] === 0) {
            this.setState({open: false, className: "rulePanelDiv"});
            return;
        }
        this.setState({open: false, className: "rulePanelDiv"});

        // fixed the height of text areas
        let els = document.getElementsByTagName("textarea");
        for (let i = 0; i < els.length; i++) {
            els[i].style.cssText = 'height:0';
            els[i].style.cssText = 'overflow:hidden;height:' + (els[i].scrollHeight + 5) + 'px';
        }
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
                    <span className="rulePanelGeneralTab">Matches
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
                    <span className="rulePanelSatisfiedTab">Examples
                        {this.props.filePath !== "none" ? (
                            <Fragment>
                                <Badge className="forAll">{fileSatisfied}</Badge>
                                <span style={{color: "#777"}}>out of</span>
                                <Badge className="forAll">{totalSatisfied}</Badge>
                            </Fragment>
                        ) : (
                            <Badge className="forAll">{totalSatisfied}</Badge>
                        )}
                        <Badge className="forFile hidden">{}</Badge>
                    </span>);
            case 'violated':
                return (
                    <span className="rulePanelViolatedTab">Violated
                        {this.props.filePath !== "none" ? (
                            <Fragment>
                                <Badge className="forAll">{fileViolated}</Badge>
                                <span style={{color: "#777"}}>out of</span>
                                <Badge className="forAll">{totalViolated}</Badge>
                            </Fragment>
                        ) : (
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
                    {this.state.ruleTags.map((d, i) => {
                        return (
                            <div className={"tagLabel"} key={i}>
                                <Label style={{paddingRight: "1px"}}>{d}
                                    <TiDelete size={23}
                                              className={"tiDelete"}
                                              onClick={() => {
                                                  const tags = this.state.ruleTags;
                                                  tags.splice(i, 1);
                                                  this.setState({tags});
                                              }}/>
                                </Label>
                            </div>)
                    })}
                    <CustomDropdown
                        menuItems={this.props.tags.map(d => d.tagName).filter(d => this.state.ruleTags.indexOf(d) === -1).concat(["New Tag"])}
                        onSelectFunction={(evt) => {
                            if (evt === "New Tag") {
                                this.setState({showNewTagModal: true})
                            }
                            else {
                                const tags = this.state.ruleTags;
                                tags.push(evt);
                                this.setState({tags})
                            }
                        }}/>
                    <FaQuestionCircle size={20} className={"faQuestionCircle"}
                                      data-class={"customTheme"}
                                      data-tip={"<h5>Select tags associated with the rule.</h5>"}/>
                    <ReactTooltip html={true} effect={"solid"} place={"right"}/>
                </div>
            );
        return this.ruleI["tags"].map((d, i) => {
            return (
                <div className="buttonDiv" key={i}>
                    <Label onClick={() => window.location.hash = '#/tag/' + d.replace(/\//g, '%2F')}>{d}</Label>
                </div>)
        });
    }

    /**
     * create a list div node for quantifier and satisfied result and wrap them in a div
     * @param group
     * @returns {XML}
     */
    listRender(group) {

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
                    <div data-file-path={d['filePath']} className="snippetDiv" key={i}>
                                <pre className="link" onClick={() => {
                                    this.props.onIgnoreFile(true);
                                    // PubSub.publish("IGNORE_FILE", [true]);
                                    Utilities.sendToServer(this.props.ws, "XML_RESULT", d['xml'])
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
        if (this.ruleI)
            this.setState({
                className: "rulePanelDiv" + (!this.state.editMode ? " edit-bg" : ""),
                open: true,
                editMode: !this.state.editMode,
                title: this.ruleI.title,
                description: this.ruleI.description,
                ruleTags: this.ruleI.tags,
                folderConstraint: this.ruleI.ruleType.constraint,
                filesFolders: this.ruleI.ruleType.checkFor,
                autoCompleteText: this.ruleI.grammar ? this.ruleI.grammar : "",
                quantifierXPath: this.ruleI.quantifier.command,
                constraintXPath: this.ruleI.constraint.command
            });
        // generating newRule
        else {
            this.props["cancelGeneratingNewRule"]();
        }
    }


    /**
     * render the drop down for the file/folder constraint
     */
    renderFileConstraints() {
        return (
            <div>
                <div style={{paddingBottom: "10px"}}>
                    <HelpBlock><em>{"Restriction:   "}</em>
                        <FaQuestionCircle size={20} className={"faQuestionCircle"}
                                          data-class={"customTheme"}
                                          data-tip={"<h4>Select how the rules are verified.</h4> " +
                                          "<p><span>\"No Restriction\"</span> " +
                                          "if the rule must be verified on <em>all</em> files and folders.</p>" +
                                          "<p><span>\"Specific Files/Folders\"</span> " +
                                          "if the rule is checked on <em>specific</em> files/folders.<br/>" +
                                          "If the restriction is set to \"Specific Files/Folders\", " +
                                          "at least one folder/file must be specified.</p>" +
                                          "<p>Folder and file paths are determined respective to the project directory. " +
                                          "For example in project \"myProject\", for file path \"Users/Documents/myProject/src/someFile.java\", it suffices to list \"src/someFile.java\"</p>"}/>
                        <ReactTooltip html={true} effect={"solid"} place={"right"}/>
                    </HelpBlock>
                    <ButtonToolbar>
                        <DropdownButton
                            title={this.state.folderConstraint === "" ? "Select" : this.state.folderConstraint === "NONE" ? "No Restriction" : "Specific Files/Folders"}
                            className={this.state.target} id={"drop_down"}>
                            <MenuItem eventKey={"FOLDER"} onSelect={(evt) => {
                                this.setState({folderConstraint: evt})
                            }}>Specific Files/Folders
                            </MenuItem>
                            <MenuItem eventKey={"NONE"} onSelect={(evt) => {
                                this.setState({folderConstraint: evt, filesFolders: []})
                            }}>No Restriction
                            </MenuItem>
                        </DropdownButton>
                        <Button disabled={this.state.folderConstraint === "NONE"}
                                onClick={() => {
                                    const filesFolders = this.state.filesFolders;
                                    filesFolders.push("");
                                    this.setState({filesFolders});
                                }}
                        >Add files/folders
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
     * submit the updated rule (with the given Index)
     */
    onSubmitUpdatedRule() {

        let rule = {
            index: this.ruleIndex,
            title: this.state.title,
            description: this.state.description,
            tags: this.state.ruleTags,
            ruleType: {
                constraint: this.state.folderConstraint,
                checkFor: this.state.filesFolders.filter((d) => d !== ""),
                type: "WITHIN"
            },
            quantifier: {},
            constraint: {},
            grammar: this.state.autoCompleteText
        };

        rule.quantifier = {detail: this.ruleI.quantifier.detail, command: "src:unit/" + this.state.quantifierXPath};
        rule.constraint = {detail: this.ruleI.constraint.detail, command: "src:unit/" + this.state.constraintXPath};

        if (rule.index === "" || rule.title === "" || rule.description === "") {
            console.log("empty fields");
            return;
        }

        if (rule.ruleType.constraint === "" || (rule.ruleType.constraint === "FOLDER" && rule.ruleType.checkFor.length === 0)) {
            console.log("folder constraints are not specified");
            return;
        }

        if (this.state.quantifierXPath === "" || this.state.constraintXPath === "") {
            console.log("XPaths are not specified");
            return;
        }

        let isChanged = (rule.title !== this.ruleI.title) ||
            (rule.description !== this.ruleI.description) ||
            (JSON.stringify(rule.tags) !== JSON.stringify(this.ruleI.tags)) ||
            (rule.ruleType.constraint !== this.ruleI.ruleType.constraint) ||
            (JSON.stringify(rule.ruleType.checkFor) !== JSON.stringify(this.ruleI.ruleType.checkFor)) ||
            (rule.grammar !== this.ruleI.grammar) ||
            (rule.constraint.command !== this.ruleI.constraint.command) ||
            (rule.quantifier.command !== this.ruleI.quantifier.command);

        if (isChanged) {
            this.props.onUpdateRule(rule);
            Utilities.sendToServer(this.props.ws, "MODIFIED_RULE", rule);
        }
        this.changeEditMode();
    }

    /**
     * submit a new rule
     */
    onSubmitNewRule() {
        let rule = {
            index: Math.floor(new Date().getTime() / 1000),
            title: this.state.title,
            description: this.state.description,
            tags: this.state.ruleTags,
            ruleType: {
                constraint: this.state.folderConstraint,
                checkFor: this.state.filesFolders.filter((d) => d !== ""),
                type: "WITHIN"
            },
            quantifier: {},
            constraint: {},
            grammar: this.state.autoCompleteText
        };

        rule.quantifier = {detail: "", command: "src:unit/" + this.state.quantifierXPath};
        rule.constraint = {detail: "", command: "src:unit/" + this.state.constraintXPath};


        if (rule.index === "" || rule.title === "" || rule.description === "") {
            console.log("empty fields");
            return;
        }

        if (rule.ruleType.constraint === "" || (rule.ruleType.constraint === "FOLDER" && rule.ruleType.checkFor.length === 0)) {
            console.log("folder constraints are not specified");
            return;
        }

        if (this.state.quantifierXPath === "" || this.state.constraintXPath === "") {
            console.log("XPaths are not specified");
            return;
        }

        this.props.onSubmitNewRule(rule);
        Utilities.sendToServer(this.props.ws, "NEW_RULE", rule);
        this.changeEditMode();
    }

    /**
     * process the error received by running verifyTextBasedOnGrammar on autoComplete text
     * @param error
     */
    processLanguageProcessingError(error) {
        switch (error) {
            case "EMPTY_FIELD":
                this.setState({
                    error: {
                        errorType: "Empty Field",
                        message: "The design rule input must not be empty.",
                        alertType: "warning"
                    }
                });
                break;
            case "NO_INPUT_AFTER_REPLACING_PHRASES":
                this.setState({
                    error: {
                        errorType: "Incorrect Input",
                        message: "The used phrases are incorrect. Try using different phrases.",
                        alertType: "danger"
                    }
                });
                break;
            case "NO_INPUT_AFTER_LEMMATIZATION":
                this.setState({
                    error: {
                        errorType: "Incorrect Input",
                        message: "The words used in the design rule are not compatible with CoreNLP library.",
                        alertType: "danger"
                    }
                });
                break;
            /**
             * {grammarErrors: [{rec, sym, line, col, msg, e}]}
             * or
             * {xpathTraverseErrors: errorMessage}
             */
            default:
                if (error.grammarErrors) {
                    this.autoCompleteCaretPosition = error.grammarErrors[0].col;
                    let errorMessage = "";

                    for (let i = 0; i < error.grammarErrors.length; i++) {
                        let grammarError = error.grammarErrors[i];
                        try {
                            let contextName = grammarError.e.ctx.constructor.name;
                            switch (contextName) {
                                case "DesignRuleContext":
                                    errorMessage += "Use AutoComplete suggestions. ";
                                    break;
                                default:
                                    errorMessage += "For defining conditions, you need to follow formats like: "
                                        + "\"class where have name\", \"class where (( have name and have annotation ) or have function)\". ";

                            }
                        }
                        catch (e) {
                            console.error("no contextName", e);
                        }

                        try {
                            let offendingText = grammarError.e.offendingToken.text;
                            switch (offendingText) {
                                case "<EOF>":
                                    errorMessage += "The design rule is incomplete. You can use suggestions in  AutoComplete. ";
                                    break;

                                default:
                                    errorMessage += "The use of word \"" + offendingText + "\" is not correct. Possible causes are missed words or typos"
                            }
                        }
                        catch (e) {
                            console.error("no offendingText", e);
                        }
                    }

                    this.setState({
                        error: {
                            errorType: "Grammar Error",
                            message: errorMessage,
                            alertType: "danger"
                        }
                    });
                }
                else
                    this.setState({
                        error: {
                            errorType: "error",
                            message: "",
                            alertType: "danger"
                        }
                    });
                break;
        }
    }


    /**
     * render the dialog for adding a new tag
     * it is displayed when the 'New Tag' is clicked on
     * @returns {XML}
     */
    renderNewTagModalDialog() {
        return (
            <Modal show={this.state.showNewTagModal} onHide={()=>this.setState({showNewTagModal: false})}
                   backdrop={"static"} keyboard={true}>
                <Modal.Header closeButton>
                    <Modal.Title>New Tag</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup validationState={(this.state.tagName === "") ? "error" : "success"}>
                        <FormControl type="text" placeholder="Tag name. (Required)"
                                     style={{fontWeight: "bold"}}
                                     value={this.state.tagName}
                                     onChange={(e) => {
                                         this.setState({tagName: e.target.value})
                                     }}
                                     onKeyUp={(e) => {
                                         e.target.style.cssText = 'height:auto; padding:0';
                                         e.target.style.cssText = 'height:' + this.scrollHeight + 'px';
                                     }}/>
                    </FormGroup>
                    <FormGroup validationState={(this.state.tagDetail === "") ? "error" : "success"}>
                        <FormControl componentClass="textarea"
                                     placeholder="Description, high level details about the tag. (Required)"
                                     value={this.state.tagDetail}
                                     onChange={(e) => {
                                         this.setState({tagDetail: e.target.value})
                                     }}
                                     onKeyUp={(e) => {
                                         e.target.style.cssText = 'height:auto; padding:0';
                                         e.target.style.cssText = 'height:' + this.scrollHeight + 'px';
                                     }}/>
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={() => this.onSubmitNewTag()}>Save</Button>
                    <Button onClick={()=>this.setState({showNewTagModal: false})}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    /**
     * adding a new tag
     * In tagJson, the property is 'detail'
     */
    onSubmitNewTag () {
        let tag = {tagName: this.state.tagName, detail: this.state.tagDetail};
        this.props.onSubmitNewTag(tag);
        Utilities.sendToServer(this.props.ws, "NEW_TAG", tag);
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
        },
        onSubmitNewRule: (newRule) => {
            dispatch(submitNewRule(newRule))
        },
        onUpdateRule: (updatedRule) => {
            dispatch(updateRule(updatedRule));
        },
        onSubmitNewTag: (newTag) => {
            dispatch(submitNewTag(newTag))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RulePanel);