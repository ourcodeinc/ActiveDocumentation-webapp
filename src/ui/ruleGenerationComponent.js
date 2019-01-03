/**
 * Created by saharmehrpour on 2/23/18.
 */

import React, {Component} from 'react';
import {connect} from "react-redux";
import '../App.css';

import {Alert} from 'react-bootstrap';
import {Button, FormGroup, ButtonToolbar} from 'react-bootstrap';

import RuleGeneratorGui from './ruleGenerationGUI/ruleGeneratorGui';
import verifyTextBasedOnGrammar from "./ruleGenerationText/languageProcessing";
import {matchMessages, receiveGuiTree} from "../actions";
import {generateGuiTrees} from "./ruleGenerationText/generateGuiTree";
import RuleGeneratorText from "./ruleGenerationText/ruleGeneratorText";


class RuleGenerationComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            quantifierXPath: "",
            constraintXPath: "",
            error: "",
            showAlert: true,
            autoCompleteText: "",
            autoCompleteValidationState: null // error, success, warning, null
        };

        // should not be in state, it need to be changed after single use.
        // the component is updated after changing this value because the state is also changing
        // otherwise call this.forceUpdate()
        this.autoCompleteCaretPosition = -1;

        // received through react props.
        this.ruleIndex = props.ruleIndex;

        // existing rule
        if (this.ruleIndex !== -1) {
            let indices = props.rules.map(d => d.index);
            let arrayIndex = indices.indexOf(this.ruleIndex);
            if (arrayIndex === -1)
                console.log(`error: rule with index ${this.ruleIndex} is not found in the ruleTable.
                Only ${indices.toString()} are found as indices.`);
            else {
                this.ruleI = props.rules[arrayIndex];
                // updating the rule
                this.state.quantifierXPath = this.ruleI.rulePanelState.quantifierXPath;
                this.state.constraintXPath = this.ruleI.rulePanelState.constraintXPath;
                this.state.autoCompleteText = this.ruleI.rulePanelState.autoCompleteText;
            }
        }
        // new rule
        else
        {
            this.state.quantifierXPath = props.quantifierXPath;
            this.state.constraintXPath = props.constraintXPath;
            this.state.autoCompleteText = props.autoCompleteText;
        }


        // computing and setting the redux store for GUI tree will un-mount the rulePanel component
        // and as such, the edit mode is off and so a loop is created.
    }

    render() {
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
        );
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

}

function mapStateToProps(state) {
    return {
        rules: state.ruleTable,
        ws: state.ws,

        // for new rule
        autoCompleteText: state.newOrEditRule.autoCompleteText,
        quantifierXPath: state.newOrEditRule.quantifierXPath,
        constraintXPath: state.newOrEditRule.quantifierXPath,
        message: state.message,

        sentMessages: state.newOrEditRule.sentMessages,
        receivedMessages: state.newOrEditRule.receivedMessages
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onReceiveGuiTree: (ruleIndex, treeData, autoCompleteText, quantifierXPath, constraintXPath) => {
            dispatch(receiveGuiTree(ruleIndex, treeData, autoCompleteText, quantifierXPath, constraintXPath))
        },
        onMatchMessages: (ruleIndex, sentMessages, receivedMessages, quantifierXPath, constraintXPath) => {
            dispatch(matchMessages(ruleIndex, sentMessages, receivedMessages, quantifierXPath, constraintXPath))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RuleGenerationComponent);
