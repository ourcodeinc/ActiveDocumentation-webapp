/**
 * Created by saharmehrpour on 9/6/17.
 */

import React, {Component, Fragment} from 'react';
import '../App.css';
import ReactTooltip from 'react-tooltip'

import Utilities from '../core/utilities';
import {
    Tab, Tabs, Badge, FormGroup, ControlLabel, Label, Collapse, FormControl, DropdownButton,
    MenuItem, Button, ButtonToolbar, Row, Col, HelpBlock, Modal
} from 'react-bootstrap';
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaCaretUp from 'react-icons/lib/fa/caret-up';
import MdEdit from 'react-icons/lib/md/edit';
import TiDelete from "react-icons/lib/ti/delete";
import {FaQuestionCircle} from "react-icons/lib/fa/index";

import {
    changeEditMode, clearNewRuleForm, editRuleForm, ignoreFile,
    submitNewRule, submitNewTag, updateRule
} from "../actions";
import RuleGenerationComponent from './ruleGenerationComponent';

import {connect} from "react-redux";
import CustomDropDown from "./customDropDown";

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
            openPanel: true,
            className: "rulePanelDiv" + (this.newRuleRequest ? " edit-bg" : ""),
            activeTab: 0,

            editMode: !!props["newRule"],

            // rule states
            title: props.title,
            description: props.description,
            ruleTags: props.ruleTags,
            folderConstraint: props.folderConstraint,
            filesFolders: props.filesFolders,
            tags: props.tags,

            // new tag states
            showNewTagModal: false,
            tagName: "",
            tagDetail: "",

            // error message
            showError: false,
            errorTitle: "",
            errorMessage: ""
        };


        // existing rule
        if (!this.newRuleRequest && this.ruleIndex !== -1) {
            let indices = props.rules.map(d => d.index);
            let arrayIndex = indices.indexOf(this.ruleIndex);
            if (arrayIndex === -1)
                console.log(`error: rule with index ${this.ruleIndex} is not found in the ruleTable.
                Only ${indices.toString()} are found as indices.`);
            else {
                this.ruleI = props.rules[arrayIndex];
                // updating the rule
                if (this.ruleI.rulePanelState.editMode) {
                    this.state.title = this.ruleI.rulePanelState.title;
                    this.state.description = this.ruleI.rulePanelState.description;
                    this.state.ruleTags = this.ruleI.rulePanelState.ruleTags;
                    this.state.folderConstraint = this.ruleI.rulePanelState.folderConstraint;
                    this.state.filesFolders = this.ruleI.rulePanelState.filesFolders;
                    this.state.tags = props.tags;

                    this.state.editMode = true;
                }
                // reading the rule
                else {
                    this.state.title = this.ruleI.title;
                    this.state.description = this.ruleI.description;
                    this.state.ruleTags = this.ruleI.tags;
                    this.state.folderConstraint = this.ruleI.ruleType.constraint;
                    this.state.filesFolders = this.ruleI.ruleType.checkFor;
                    this.state.tags = props.tags;

                    this.state.editMode = false;
                }
            }
        }
        // new rule
        else
            {
                this.state.title = props.title;
                this.state.description = props.description;
                this.state.ruleTags = props.ruleTags;
                this.state.folderConstraint = props.folderConstraint;
                this.state.filesFolders = props.filesFolders;
                this.state.tags = props.tags;

                this.state.editMode = true
            }
        

        this.caretClass = {
            true: {cursor: "pointer", color: "black"},
            false: {cursor: "pointer", color: "darkgrey"}
        };

        this.editIconClass = {
            true: {color: "#337ab7", cursor: "pointer"},
            false: {color: "black", cursor: "pointer"}
        };
    }

    render() {
        return (
            <div className={this.state.className}>
                <FormGroup>
                    <div style={{float: 'right'}}>
                        {!this.state.editMode ? (
                            <Fragment>
                                <FaCaretUp size={20} onClick={() => this.setState({openPanel: false})}
                                           style={this.caretClass[this.state.openPanel.toString()]}/>
                                <FaCaretDown size={20} onClick={() => this.setState({openPanel: true})}
                                             style={this.caretClass[(!this.state.openPanel).toString()]}/>
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
                                             style={{fontWeight: "bold",resize: "vertical"}}
                                             value={this.state.title}
                                             onChange={(e) => {
                                                 this.setState({title: e.target.value});
                                             }}
                                             onKeyUp={(e) => {
                                                 e.target.style.cssText = 'height:0';
                                                 e.target.style.cssText = 'overflow:hidden;height:' + e.target.scrollHeight + 'px';
                                             }}
                                             onBlur={() => this.onEditNewRuleForm()}/>
                            </FormGroup>
                            <FormGroup validationState={(this.state.description === "") ? "error" : "success"}>
                                <FormControl componentClass="textarea"
                                             style={{resize: "vertical"}}
                                             placeholder="Description, high level details about the rule. (Required)"
                                             value={this.state.description}
                                             onChange={(e) => {
                                                 this.setState({description: e.target.value})
                                             }}
                                             onKeyUp={(e) => {
                                                 e.target.style.cssText = 'height:0';
                                                 e.target.style.cssText = 'overflow:hidden;height:' + e.target.scrollHeight + 'px';
                                             }}
                                             onBlur={() => this.onEditNewRuleForm()}/>
                            </FormGroup>
                        </Fragment>
                    )}
                </FormGroup>
                <Collapse in={this.state.openPanel}>
                    <div>
                        <div style={{paddingTop: '10px', clear: 'both'}}>
                            {this.renderTags()}
                        </div>
                        {!this.state.editMode ? (
                            <div style={{paddingTop: '10px', clear: 'both'}}>
                                <Tabs animation={true} id={"rules_" + this.ruleIndex} activeKey={this.state.activeTab}
                                      onSelect={(key) => {
                                          if (this.state.activeTab === key)
                                              this.setState({activeTab: 0});
                                          else
                                              this.setState({activeTab: key});
                                      }}>
                                    <Tab eventKey={0} disabled>{}</Tab>
                                    <Tab eventKey={'satisfied'}
                                         title={this.renderTabHeader('satisfied')}>{this.renderListOfSnippets('satisfied')}</Tab>
                                    <Tab eventKey={'violated'}
                                         title={this.renderTabHeader('violated')}>{this.renderListOfSnippets('violated')}</Tab>
                                </Tabs>
                            </div>
                        ) : null}
                    </div>
                </Collapse>
                {!this.state.editMode ? null : (
                    <div style={{paddingTop: '10px', clear: 'both'}}>
                        {this.renderFileConstraints()}
                        <RuleGenerationComponent ruleIndex={this.ruleIndex}/>
                        <div>
                            <ButtonToolbar className={"submitButtons"}>
                                <Button bsStyle="primary"
                                        onClick={() => this.newRuleRequest ? this.onSubmitNewRule() : this.onSubmitUpdatedRule()}>
                                    Submit</Button>
                                <Button bsStyle="default" onClick={() => this.changeEditMode()}>Cancel</Button>
                                {!this.newRuleRequest ? null :
                                    <Button bsStyle="default"
                                            onClick={() => {
                                                this.props.onClearForm();
                                            }}>Clear Form</Button>}
                            </ButtonToolbar>
                        </div>
                    </div>
                )}
                {this.renderNewTagModalDialog()}
                {this.renderErrorInSubmission()}
            </div>
        );
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        // existing rule
        if (!this.newRuleRequest && this.ruleIndex !== -1)
        {
            let indices = nextProps.rules.map(d => d.index);
            let arrayIndex = indices.indexOf(this.ruleIndex);
            if (arrayIndex === -1)
                console.log(`error: rule with index ${this.ruleIndex} is not found in the ruleTable.
                Only ${indices.toString()} are found as indices.`);
            else {
                this.ruleI = nextProps.rules[arrayIndex];
                // updating the rule
                if (this.ruleI.rulePanelState.editMode) {
                    this.setState({
                        title: this.ruleI.rulePanelState.title,
                        description: this.ruleI.rulePanelState.description,
                        ruleTags: this.ruleI.rulePanelState.ruleTags,
                        folderConstraint: this.ruleI.rulePanelState.folderConstraint,
                        filesFolders: this.ruleI.rulePanelState.filesFolders,
                        tags: nextProps.tags,

                        editMode: true
                    });
                }
                // reading the rule
                else
                    this.setState({
                        title: this.ruleI.title,
                        description: this.ruleI.description,
                        ruleTags: this.ruleI.tags,
                        folderConstraint: this.ruleI.ruleType.constraint,
                        filesFolders: this.ruleI.ruleType.checkFor,
                        tags: nextProps.tags,

                        editMode: false
                    });
            }
        }
        // new rule
        else
            this.setState({
                title: nextProps.title,
                description: nextProps.description,
                ruleTags: nextProps.ruleTags,
                folderConstraint: nextProps.folderConstraint,
                filesFolders: nextProps.filesFolders,
                tags: nextProps.tags,

                editMode: true
            });
    }

    /**
     * set the states 'openPanel' and 'className' after mounting.
     */
    componentDidMount() {
        if (!this.props.codeChanged) {
            this.setState({
                className: "rulePanelDiv" + (this.newRuleRequest ? " edit-bg" : ""),
                openPanel: (() => {
                    if (this.props.filePath === "none") return true;
                    let file = this.ruleI['xPathQueryResult'].filter(d => d["filePath"] === this.props.filePath);
                    return (file.length > 0)
                })()
            });
            return;
        }

        let file = this.ruleI['xPathQueryResult'].filter(d => d["filePath"] === this.props.filePath);
        let ruleIfile = file.length !== 0 ? file[0]['data'] : {};
        if (ruleIfile['allChanged'] === 'greater' && ruleIfile['satisfiedChanged'] === ruleIfile['violatedChanged'] === 'none') {
            this.setState({openPanel: true, className: "rulePanelDiv blue-bg"});
            return;
        }
        if (ruleIfile['satisfiedChanged'] === 'greater') {
            this.setState({openPanel: true, className: "rulePanelDiv green-bg"});
            return;
        }
        if (ruleIfile['violatedChanged'] === 'greater') {
            this.setState({openPanel: true, className: "rulePanelDiv red-bg"});
            return;
        }
        if (file.length > 0) {
            this.setState({openPanel: true, className: "rulePanelDiv"});
            return;
        }

        if (ruleIfile['violated'] === 0) {
            this.setState({openPanel: false, className: "rulePanelDiv"});
            return;
        }
        this.setState({openPanel: false, className: "rulePanelDiv"});

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
    renderTabHeader(group) {
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
    renderTags() {
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
                                                  this.setState({tags}, this.onEditNewRuleForm);
                                              }}/>
                                </Label>
                            </div>)
                    })}
                    <CustomDropDown
                        menuItems={this.props.tags.map(d => d.tagName).filter(d => this.state.ruleTags.indexOf(d) === -1).concat(["New Tag"])}
                        onSelectFunction={(evt) => {
                            if (evt === "New Tag") {
                                this.setState({showNewTagModal: true})
                            }
                            else {
                                const tags = this.state.ruleTags;
                                tags.push(evt);
                                this.setState({tags}, this.onEditNewRuleForm)
                            }
                        }}/>
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
    renderListOfSnippets(group) {

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
     * render the drop down for the file/folder constraint
     */
    renderFileConstraints() {
        return (
            <div>
                <FormGroup
                    validationState={(this.state.folderConstraint === "" || (this.state.folderConstraint === "FOLDER" && this.state.filesFolders.length === 0)) ? "error" : "success"}>
                    <div style={{paddingBottom: "10px"}}>
                        <HelpBlock>
                            <ButtonToolbar>
                                <DropdownButton
                                    title={this.state.folderConstraint === "" ? "Select Restrictions on Files/Folders" : this.state.folderConstraint === "NONE" ? "Rule must be applied on ALL Files/Folders" : "Rule must be applied on Specific Files/Folders"}
                                    style={{color: (this.state.folderConstraint === "" || (this.state.folderConstraint === "FOLDER" && this.state.filesFolders.length === 0)) ? "#a94442" : "#3c763d"}} id={"drop_down"}>
                                    <MenuItem eventKey={"FOLDER"} onSelect={(evt) => {
                                        this.setState({folderConstraint: evt}, this.onEditNewRuleForm);
                                    }}>Rule must be applied on SPECIFIC Files/Folders
                                    </MenuItem>
                                    <MenuItem eventKey={"NONE"} onSelect={(evt) => {
                                        this.setState({folderConstraint: evt, filesFolders: []})
                                    }}>Rule must be applied on ALL Files/Folders
                                    </MenuItem>
                                </DropdownButton>
                                <Button disabled={this.state.folderConstraint !== "FOLDER"}
                                        onClick={() => {
                                            const filesFolders = this.state.filesFolders;
                                            filesFolders.push("");
                                            this.setState({filesFolders}, this.onEditNewRuleForm);
                                        }}
                                >Add files/folders
                                </Button>

                                <FaQuestionCircle size={20} className={"faQuestionCircle"}
                                                  data-class={"customTheme"}
                                                  data-tip={"<h4>Select how the rules are verified.</h4> " +
                                                  "<p><b><em>\"Rule must be applied on ALL Files/Folders\"</em></b></p> " +
                                                  "<p>If the rule must be verified on <b>All</b> files and folders.</p>" +
                                                  "<p><b><em>\"Rule must be applied on SPECIFIC Files/Folders\"</em></b></p> " +
                                                  "<p>If the rule is checked on <b>SPECIFIC</b> files/folders.<br/>" +
                                                  "If the restriction is set to \"Rule must be applied on Specific Files/Folders\", " +
                                                  "at least one folder/file must be specified.</p>" +
                                                  "<p><b><em>Add files/folders</em></b></p>" +
                                                  "<p>Folder and file paths are determined respective to the project directory. " +
                                                  "For example in project \"myProject\", for file path \".../myProject/src/someFile.java\", " +
                                                  "the relative path is \"src/someFile.java\"</p>"}/>
                                <ReactTooltip html={true} effect={"solid"} place={"right"}/>
                            </ButtonToolbar>

                        </HelpBlock>
                    </div>
                </FormGroup>
                <div>
                    {this.state.filesFolders.map((d, i) => {
                        return (
                            <Row key={i} style={{paddingBottom: "5px"}}>
                                <Col sm={11} md={10}>
                                    <FormGroup validationState={this.state.filesFolders[i] === "" ? "error" : "success"}>
                                        <FormControl id={"filesFolders_textarea_" + i} type="text"
                                                     placeholder="relative File/Folder path"
                                                     value={this.state.filesFolders[i]}
                                                     onChange={(e) => {
                                                         const filesFolders = this.state.filesFolders;
                                                         filesFolders[i] = e.target.value;
                                                         this.setState({filesFolders});
                                                     }}
                                                     onBlur={() => this.onEditNewRuleForm()}/>
                                    </FormGroup>
                                </Col>
                                <Col sm={1} md={1} style={{paddingTop: "5px"}}>
                                    <TiDelete size={25}
                                              className={"tiDelete"}
                                              onClick={() => {
                                                  const filesFolders = this.state.filesFolders;
                                                  filesFolders.splice(i, 1);
                                                  this.setState({filesFolders}, this.onEditNewRuleForm);
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
                    <Button onClick={()=>this.setState({showNewTagModal: false})}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
    }


    /**
     * render the modal for printing messages when errors appear for submission
     * @return {XML}
     */
    renderErrorInSubmission() {
        return (
            <Modal show={this.state.showError} onHide={()=>this.setState({showError: false})}
                   backdrop={"static"} keyboard={true}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.errorTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.errorMessage}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>this.setState({showError: false})}>OK</Button>
                </Modal.Footer>
            </Modal>
        )
    }


    /**
     * change edit mode, set the states
     */
    changeEditMode() {
        if (this.ruleI)
            this.setState({
                className: "rulePanelDiv" + (!this.state.editMode ? " edit-bg" : ""),
                openPanel: true
            });
        else
            this.props["cancelGeneratingNewRule"]();

        this.props.onChangeEditMode(this.ruleIndex, !this.state.editMode)
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
            quantifier: {detail: "", command: "src:unit/" + this.ruleI.rulePanelState.quantifierXPath},
            constraint: {detail: "", command: "src:unit/" + this.ruleI.rulePanelState.constraintXPath},
            grammar: this.ruleI.rulePanelState.autoCompleteText
        };

        if (this.props.numberOfSentMessages !== 0) {
            this.setState({
                errorTitle: "Error in Submitting the Rule",
                errorMessage: "Please wait for the server to respond to " + this.props.numberOfSentMessages + " sent messages for retrieving XPath. " +
                "If the error appeared by mistake, reset the form by 'clear' button.",
                showError: true
            });
            return;
        }

        if (rule.index === "" || rule.title === "" || rule.description === "") {
            this.setState({
                errorTitle: "Error in Submitting the updated Rule",
                errorMessage: "Make sure to enter 'title' and 'description' for the rule.",
                showError: true
            });
            return;
        }

        if (rule.ruleType.constraint === "" || (rule.ruleType.constraint === "FOLDER" && rule.ruleType.checkFor.length === 0)) {
            this.setState({
                errorTitle: "Error in Submitting the updated Rule",
                errorMessage: "Make sure to specify the folder 'restriction'. " +
                "If the constraint is set to 'Specific Files/Folders', at least one file/folder must be specified.",
                showError: true
            });
            return;
        }

        if (this.ruleI.rulePanelState.quantifierXPath === "" || this.ruleI.rulePanelState.constraintXPath === "") {
            this.setState({
                errorTitle: "Error in Submitting the updated Rule",
                errorMessage: "Please specify a valid design rule according to the grammar.",
                showError: true
            });
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
            quantifier: {detail: "", command: "src:unit/" + this.props.quantifierXPath},
            constraint: {detail: "", command: "src:unit/" + this.props.constraintXPath},
            grammar: this.props.autoCompleteText
        };

        if (this.props.numberOfSentMessages !== 0) {
            this.setState({
                errorTitle: "Error in Submitting the new Rule",
                errorMessage: "Please wait for the server to respond to " + this.props.numberOfSentMessages + " sent messages for retrieving XPath. " +
                "If the error appeared by mistake, reset the form by 'clear' button.",
                showError: true
            });
            return;
        }

        if (rule.index === "" || rule.title === "" || rule.description === "") {
            this.setState({
                errorTitle: "Error in Submitting the new Rule",
                errorMessage: "Make sure to enter 'title' and 'description' for the rule.",
                showError: true
            });
            return;
        }

        if (rule.ruleType.constraint === "" || (rule.ruleType.constraint === "FOLDER" && rule.ruleType.checkFor.length === 0)) {
            this.setState({
                errorTitle: "Error in Submitting the new Rule",
                errorMessage: "Make sure to specify the folder 'restriction'. " +
                "If the constraint is set to 'Specific Files/Folders', at least one file/folder must be specified.",
                showError: true
            });
            return;
        }

        if (rule.quantifierXPath === "" || rule.constraintXPath === "") {
            this.setState({
                errorTitle: "Error in Submitting the new Rule",
                errorMessage: "Please specify a valid design rule according to the grammar.",
                showError: true
            });
            return;
        }

        this.props.onSubmitNewRule(rule);
        Utilities.sendToServer(this.props.ws, "NEW_RULE", rule);
        this.changeEditMode();
    }

    /**
     * adding a new tag
     * In tagJson, the property is 'detail'
     */
    onSubmitNewTag () {
        if (this.state.tagName === "" || this.state.tagDetail === "") {
            this.setState({errorMessage: "Please specify non-empty name and description for the new tag.", showError: true});
            return;
        }
        if (this.state.tags.filter(tag => tag.tagName === this.state.tagName).length > 0) {
            this.setState({
                errorTitle: "Error in Submitting the new Tag",
                errorMessage: `"${this.state.tagName}" already exists with description "${this.state.tagDetail}'". 
                If the new tag is different, please select a different name.`,
                showError: true
            });
            return;
        }
        // todo it doesn't check for duplicate tags
        let tag = {tagName: this.state.tagName, detail: this.state.tagDetail};
        this.props.onSubmitNewTag(tag);
        Utilities.sendToServer(this.props.ws, "NEW_TAG", tag);
    }

    /***
     * This function calls a dispatcher for redux
     * to update the content of the form in the main state
     */
    onEditNewRuleForm() {
        this.props.onEditForm(
            this.ruleIndex,
            this.state.title,
            this.state.description,
            this.state.ruleTags,
            this.state.folderConstraint,
            this.state.filesFolders
        );
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
        ws: state.ws,

        // for new rule
        title: state.newOrEditRule.title,
        description: state.newOrEditRule.description,
        ruleTags: state.newOrEditRule.ruleTags,
        folderConstraint: state.newOrEditRule.folderConstraint,
        filesFolders: state.newOrEditRule.filesFolders,
        // used when submitting
        autoCompleteText: state.newOrEditRule.autoCompleteText,
        quantifierXPath: state.newOrEditRule.quantifierXPath,
        constraintXPath: state.newOrEditRule.constraintXPath,

        // for submitting the rule
        numberOfSentMessages: state.newOrEditRule.sentMessages.length,

    };
}

function mapDispatchToProps(dispatch) {
    return {
        onIgnoreFile: (shouldIgnore) => dispatch(ignoreFile(shouldIgnore)),
        onSubmitNewRule: (newRule) => dispatch(submitNewRule(newRule)),
        onUpdateRule: (updatedRule) => dispatch(updateRule(updatedRule)),
        onSubmitNewTag: (newTag) => dispatch(submitNewTag(newTag)),
        onClearForm: () => dispatch(clearNewRuleForm()),
        onChangeEditMode: (ruleIndex, newEditMode) => dispatch(changeEditMode(ruleIndex, newEditMode)),
        onEditForm: (ruleIndex, title, description, ruleTags, folderConstraint, filesFolders) => {
            dispatch(editRuleForm(ruleIndex, title, description, ruleTags, folderConstraint, filesFolders))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RulePanel);