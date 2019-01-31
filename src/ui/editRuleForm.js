/**
 * Created by saharmehrpour on 2/23/18.
 */

import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import '../App.css';
import ReactTooltip from 'react-tooltip'
import {
    Alert, DropdownButton, HelpBlock, MenuItem,
    Button, FormGroup, ButtonToolbar, Label, FormControl,
    Row, Col, Modal
} from 'react-bootstrap';
import MdEdit from 'react-icons/lib/md/edit';
import TiDelete from "react-icons/lib/ti/delete";
import {FaQuestionCircle} from "react-icons/lib/fa/index";

import RuleGeneratorGui from './ruleGenerationGUI/ruleGeneratorGui';
import verifyTextBasedOnGrammar from "./ruleGenerationText/languageProcessing";
import {matchMessages, receiveGuiTree, clearNewRuleForm,
    editRuleForm, submitNewRule, submitNewTag, updateRule
} from "../actions";
import {generateGuiTrees} from "./ruleGenerationText/generateGuiTree";
import RuleGeneratorText from "./ruleGenerationText/ruleGeneratorText";
import CustomDropDown from "./customDropDown";
import Utilities from '../core/utilities';


class EditRuleForm extends Component {

    constructor(props) {
        super(props);

        this.ruleIndex = props["ruleIndex"] !== undefined ? props["ruleIndex"] : -1;
        this.ruleI = null;
        this.newRuleRequest = this.ruleIndex === -1;

        if (!props["changeEditMode"])
            console.error(`'changeEditMode' is required in props when creating/editing a rule.`);

        // should not be in state, it need to be changed after single use.
        // the component is updated after changing this value because the state is also changing
        // otherwise call this.forceUpdate()
        this.autoCompleteCaretPosition = -1;
        this.shouldAlert = true;

        this.state = {
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
            errorMessage: "",

            quantifierXPath: "",
            constraintXPath: "",
            error: "",
            showAlert: true,
            autoCompleteText: "",
            autoCompleteValidationState: null // error, success, warning, null
        };

        // existing rule
        if (this.ruleIndex !== -1) {
            let indices = props.rules.map(d => d.index);
            let arrayIndex = indices.indexOf(this.ruleIndex);
            if (arrayIndex === -1)
                console.log(`error: rule with index ${this.ruleIndex} is not found in the ruleTable.
                Only ${indices.toString()} are found as indices.`);
            else {
                this.ruleI = props.rules[arrayIndex];
                this.state.title = this.ruleI.rulePanelState.title;
                this.state.description = this.ruleI.rulePanelState.description;
                this.state.ruleTags = this.ruleI.rulePanelState.ruleTags;
                this.state.folderConstraint = this.ruleI.rulePanelState.folderConstraint;
                this.state.filesFolders = this.ruleI.rulePanelState.filesFolders;
                this.state.tags = props.tags;
                // updating the rule
                this.state.quantifierXPath = this.ruleI.rulePanelState.quantifierXPath;
                this.state.constraintXPath = this.ruleI.rulePanelState.constraintXPath;
                this.state.autoCompleteText = this.ruleI.rulePanelState.autoCompleteText;
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

            this.state.quantifierXPath = props.quantifierXPath;
            this.state.constraintXPath = props.constraintXPath;
            this.state.autoCompleteText = props.autoCompleteText;
        }

        // computing and setting the redux store for GUI tree will un-mount the rulePanel component
        // and as such, the edit mode is off and so a loop is created.
    }

    render() {
        return (
            <div className={"rulePanelDiv edit-bg"}>
                <FormGroup>
                    <div style={{float: 'right'}}>
                        <MdEdit size={20} style={{color: "#337ab7", cursor: "pointer"}}
                                onClick={() => this.changeEditMode()}/>
                    </div>
                    {this.renderTitleAndDescription()}
                </FormGroup>
                <div style={{paddingTop: '10px', clear: 'both'}}>
                    {this.renderTags()}
                </div>
                <div style={{paddingTop: '10px', clear: 'both'}}>
                    {this.renderFileConstraints()}
                    {this.renderAlerts()}
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

                {this.renderNewTagModalDialog()}
                {this.renderErrorInSubmission()}
            </div>
        );
    }

    /**
     * render the textareas for title and description
     */
    renderTitleAndDescription() {
        return (
            <Fragment>
                <FormGroup validationState={(this.state.title === "") ? "error" : "success"}>
                    <FormControl componentClass="textarea" placeholder="Rule title. (Required)"
                                 style={{fontWeight: "bold", resize: "vertical"}}
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
        )
    }


    /**
     * render tag badges
     */
    renderTags() {
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
                                        this.setState({folderConstraint: evt, filesFolders: []}, this.onEditNewRuleForm)
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
     * render alerts for errors in textual design rules.
     */
    renderAlerts() {
        return (
            <div style={{paddingTop: '10px', clear: 'both'}}>
                {this.state.error === "" ? null : !this.state.showAlert ? null : (
                    <Alert bsStyle={this.state.error.alertType}>
                        <h4>{this.state.error.errorType}</h4>
                        <h6>{this.state.error.message}</h6>
                        <h6 style={{fontWeight: "bold"}}>{this.state.error.inputText}</h6>
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
                <FormGroup validationState={this.state.autoCompleteValidationState}>
                    <RuleGeneratorText defaultValue={this.state.autoCompleteText}
                                       onBlur={() => {
                                           if (this.shouldAlert) {
                                               verifyTextBasedOnGrammar(this.state.autoCompleteText)
                                                   .then((data) => {
                                                       if (this._mounted)
                                                           this.setState({
                                                               quantifierXPath: data.quantifierXPath,
                                                               constraintXPath: data.constraintXPath,
                                                               autoCompleteValidationState: null,
                                                               error: ""
                                                           });
                                                       // compute and dispatch gui tree for quantifier and constraint
                                                       generateGuiTrees(data.grammarTree)
                                                           .then((tree) => this.props.onReceiveGuiTree(this.ruleIndex, tree, this.state.autoCompleteText, data.quantifierXPath, data.constraintXPath));
                                                   })
                                                   .catch((error) => this.processLanguageProcessingError(error));
                                               this.shouldAlert = false;
                                           }
                                       }}
                                       onUpdateText={(text) => {
                                           this.shouldAlert = true;
                                           this.setState({autoCompleteText: text});
                                       }}
                                       caretPosition={(() => {
                                           let newFocus = this.autoCompleteCaretPosition;
                                           this.autoCompleteCaretPosition = -1;
                                           return newFocus;
                                       })()}/>
                    <RuleGeneratorGui ruleIndex={this.ruleIndex} className={"generateRuleGui"}/>
                </FormGroup>
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

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        if (nextProps.message === "RECEIVE_EXPR_STMT_XML") {

            this.matchSentAndReceivedMessages(nextProps);
        }

        else {
            if(nextProps.ruleIndex !== this.ruleIndex) {
                this.ruleIndex = nextProps.ruleIndex;
                let indices = nextProps.rules.map(d => d.index);
                let arrayIndex = indices.indexOf(this.ruleIndex);
                if (arrayIndex === -1)
                    console.log(`error: rule with index ${this.ruleIndex} is not found in the ruleTable.
                Only ${indices.toString()} are found as indices.`);
                else
                    this.ruleI = nextProps.rules[arrayIndex];
            }

            // existing rule
            if (this.ruleIndex !== -1) {
                this.setState({
                    autoCompleteText: this.ruleI.rulePanelState.autoCompleteText,
                    quantifierXPath: this.ruleI.rulePanelState.quantifierXPath,
                    constraintXPath: this.ruleI.rulePanelState.constraintXPath,
                    error: nextProps.message === "CLEAR_NEW_RULE_FORM" ? "" : this.state.error
                });
            }
            // new rule
            else
            {
                this.setState({
                    autoCompleteText: nextProps.autoCompleteText,
                    quantifierXPath: nextProps.quantifierXPath,
                    constraintXPath: nextProps.constraintXPath,
                    error: nextProps.message === "CLEAR_NEW_RULE_FORM" ? "" : this.state.error
                });
            }
        }
    }

    // _mounted is added to remove the warning caused by setting states
    // in Promise.then() function in onBlur
    componentDidMount() {
        this._mounted = true
    }

    componentWillUnmount() {
        this._mounted = false
    }


    /**
     * Match nextProps.sentMessages and nextProps.receivedMessages using messageIDs, update XPaths
     * and send actions to update store
     */
    matchSentAndReceivedMessages(nextProps) {
        let sentMessages = nextProps.sentMessages.map(a => ({...a})); // clone
        let receivedMessages = nextProps.receivedMessages.map(a => ({...a})); // clone
        let quantifierXPath = this.state.quantifierXPath.slice(0);
        let constraintXPath = this.state.constraintXPath.slice(0);

        sentMessages.sort((a, b) => a["messageID"] - b["messageID"]);
        receivedMessages.forEach(a => a["messageID"] = +a["messageID"]);
        receivedMessages.sort((a, b) => a["messageID"] - b["messageID"]);

        let matchedIndices = {sent: [], received: []};

        let otherIndex = 0;
        for (let index = 0; index < sentMessages.length; index++) {
            if (otherIndex >= receivedMessages.length) break;
            for (let j = otherIndex; j < receivedMessages.length; j++) {
                // matched messages
                if (+sentMessages[index]["messageID"] === +receivedMessages[j]["messageID"]) {
                    let resultXPath = this.traverseReceivedXml(receivedMessages[j]["xmlText"]);
                    // replace all occurrences of textAndXPath.originalText
                    let copiedQXPath = quantifierXPath.split("'" + sentMessages[index]["codeText"] + "'");
                    quantifierXPath = copiedQXPath.join(resultXPath);
                    let copiedCXPath = constraintXPath.split("'" + sentMessages[index]["codeText"] + "'");
                    constraintXPath = copiedCXPath.join(resultXPath);

                    matchedIndices.sent.push(index);
                    matchedIndices.received.push(j);

                    otherIndex = j + 1;
                    break;
                }
            }
        }

        // remove matched messages from list of messages
        for (let i = matchedIndices.sent.length - 1; i >= 0; i--)
            sentMessages.splice(matchedIndices.sent[i], 1);
        for (let i = matchedIndices.received.length - 1; i >= 0; i--)
            receivedMessages.splice(matchedIndices.received[i], 1);

        // at least one message is responded
        if (matchedIndices.sent.length > 0)
            this.props.onMatchMessages(this.ruleIndex, sentMessages, receivedMessages, quantifierXPath, constraintXPath);
    }


    /**
     * check validity of an xml and generate the xpath query
     * @param text
     * @returns string xpath
     * derived from the originalText
     */
    traverseReceivedXml(text) {

        let exprValidation = "//src:unit[count(src:expr_stmt)=1]/src:expr_stmt/src:expr";
        let parser = new DOMParser();

        function nsResolver(prefix) {
            let ns = {'src': 'http://www.srcML.org/srcML/src'};
            return ns[prefix] || null;
        }

        // checks validity of the XML
        let xml = parser.parseFromString(text, "text/xml");
        if (!xml.evaluate) {
            console.log("error in xml.evaluate");
            return "";
        }


        let validNodes = xml.evaluate(exprValidation, xml, nsResolver, XPathResult.ANY_TYPE, null);
        let resultValidNode = validNodes.iterateNext(); // expr_stmt/expr
        if (!resultValidNode) {
            console.log("error");
            return "";
        }

        /**
         * recursive function
         * traverse the state_children of a parent node to generate xpath query conditions
         * @param parentNode
         * @returns string
         */
        let traverseChildren = (parentNode) => {
            let res = [];
            let children = parentNode.childNodes;
            for (let i = 0; i < children.length; i++) {

                if (children[i].nodeName === "#text") {
                    if (children.length === 1)
                        res.push("text()=\"" + children[i].nodeValue + "\"");
                }
                else {
                    res.push(traverseChildren(children[i]));
                }
            }
            return "src:" + parentNode.nodeName + "[" + res.join(' and ') + "]";
        };

        // result xpath: 'src:expr[....]' where 'src:expr[' and the final ']' is extra.
        let resultXPath = traverseChildren(resultValidNode);
        resultXPath = resultXPath.substring(9, resultXPath.length - 1);
        return resultXPath;
    }


    /**
     * process the error received by running verifyTextBasedOnGrammar on autoComplete text
     * @param error
     */
    processLanguageProcessingError(error) {
        console.log(error);
        switch (error) {
            case "EMPTY_FIELD":
                this.setState({
                    error: {
                        errorType: "Empty Field",
                        message: "The design rule input must not be empty",
                        inputText: "",
                        alertType: "warning"
                    }
                });
                break;
            case "NO_INPUT_AFTER_REPLACING_PHRASES":
                this.setState({
                    error: {
                        errorType: "Incorrect Input",
                        message: "The used phrases are incorrect. Try using different phrases.",
                        inputText: "",
                        alertType: "danger"
                    }
                });
                break;
            case "NO_INPUT_AFTER_LEMMATIZATION":
                this.setState({
                    error: {
                        errorType: "Incorrect Input",
                        message: "The words used in the design rule are not compatible with CoreNLP library.",
                        inputText: "",
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
                    let grammarError = error.grammarErrors[0];
                    this.autoCompleteCaretPosition = error.grammarErrors[0].col;
                    this.setState({
                        error: {
                            errorType: "Grammar Error",
                            message: "The input text after the following sub-text is NOT according to the grammar:",
                            inputText: "\"" + error.inputText.slice(0, grammarError.col) + "\"",
                            alertType: "danger"
                        }
                    });
                }
                else
                    this.setState({
                        error: {
                            errorType: "error",
                            message: "",
                            inputText: "",
                            alertType: "danger"
                        }
                    });
                break;
        }
    }


    /**
     * change edit mode, set the states
     */
    changeEditMode() {
        this.props["changeEditMode"]();
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

function mapStateToProps(state) {
    return {
        rules: state.ruleTable,
        tags: state.tagTable,
        ws: state.ws,

        // for new rule
        title: state.newOrEditRule.title,
        description: state.newOrEditRule.description,
        ruleTags: state.newOrEditRule.ruleTags,
        folderConstraint: state.newOrEditRule.folderConstraint,
        filesFolders: state.newOrEditRule.filesFolders,

        autoCompleteText: state.newOrEditRule.autoCompleteText,
        quantifierXPath: state.newOrEditRule.quantifierXPath,
        constraintXPath: state.newOrEditRule.quantifierXPath,
        message: state.message,

        sentMessages: state.newOrEditRule.sentMessages,
        receivedMessages: state.newOrEditRule.receivedMessages,
        // for submitting the rule
        numberOfSentMessages: state.newOrEditRule.sentMessages.length
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onSubmitNewRule: (newRule) => dispatch(submitNewRule(newRule)),
        onUpdateRule: (updatedRule) => dispatch(updateRule(updatedRule)),
        onSubmitNewTag: (newTag) => dispatch(submitNewTag(newTag)),
        onClearForm: () => dispatch(clearNewRuleForm()),
        onEditForm: (ruleIndex, title, description, ruleTags, folderConstraint, filesFolders) => {
            dispatch(editRuleForm(ruleIndex, title, description, ruleTags, folderConstraint, filesFolders))
        },
        onReceiveGuiTree: (ruleIndex, treeData, autoCompleteText, quantifierXPath, constraintXPath) => {
            dispatch(receiveGuiTree(ruleIndex, treeData, autoCompleteText, quantifierXPath, constraintXPath))
        },
        onMatchMessages: (ruleIndex, sentMessages, receivedMessages, quantifierXPath, constraintXPath) => {
            dispatch(matchMessages(ruleIndex, sentMessages, receivedMessages, quantifierXPath, constraintXPath))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditRuleForm);
