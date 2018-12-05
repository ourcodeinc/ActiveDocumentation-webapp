/**
 * Created by saharmehrpour on 2/23/18.
 */

import React, {Component} from 'react';
import {connect} from "react-redux";
import '../App.css';

import {Alert} from 'react-bootstrap';
import {Button, FormGroup, ButtonToolbar} from 'react-bootstrap';

import RuleGeneratorGui from './ruleGenerationGUI/ruleGeneratorGui';
// import AutoComplete from "./ruleGenerationText/autoComplete";
import verifyTextBasedOnGrammar from "./ruleGenerationText/languageProcessing";
import {editNewRuleGrammarGuiData, receiveGuiTree} from "../actions";
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
            autoCompleteValidationState: null // error, success, warning, null
        };

        // should not be in state, it need to be changed after single use.
        // the component is updated after changing this value because the state is also changing
        // otherwise call this.forceUpdate()
        this.autoCompleteCaretPosition = -1;

        // can't be part of state, because after clicking on auto-complete suggestion
        // and then out of its container, the setState() in onUpdateText doesn't update the text instantly.
        // props is a read-only element
        this.autoCompleteText = props.autoCompleteText;
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
                    <RuleGeneratorText defaultValue={this.autoCompleteText}
                                  onBlur={() => {
                                      if(this.shouldAlert) {
                                          verifyTextBasedOnGrammar(this.autoCompleteText)
                                              .then((data) => {
                                                  this.setState({
                                                      quantifierXPath: data.quantifierXPath,
                                                      constraintXPath: data.constraintXPath,
                                                      autoCompleteValidationState: null,
                                                      error: ""
                                                  });
                                                  this.onEditNewRuleForm();
                                                  // compute and dispatch gui tree for quantifier and constraint
                                                  generateGuiTrees(data.grammarTree)
                                                      .then((data) => this.props.onReceiveGuiTree(data));
                                              })
                                              .catch((error) => this.processLanguageProcessingError(error));
                                          this.shouldAlert = false;
                                      }
                                  }}
                                  onUpdateText={(text) => {
                                      this.shouldAlert = true;
                                      this.autoCompleteText = text;
                                      this.onEditNewRuleForm()
                                  }}
                                  caretPosition={(() => {
                                      let newFocus = this.autoCompleteCaretPosition;
                                      this.autoCompleteCaretPosition = -1;
                                      return newFocus;
                                  })()}/>
                    <RuleGeneratorGui className={"generateRuleGui"}/>
                </FormGroup>
            </div>
        );
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        this.autoCompleteText = nextProps.autoCompleteText;
        this.setState({
            quantifierXPath: nextProps.quantifierXPath,
            constraintXPath: nextProps.quantifierXPath,
            error: nextProps.message === "CLEAR_NEW_RULE_FORM" ? "" : this.state.error
        });
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


    /***
     * This function calls a dispatcher for redux
     * to update the content of the form in the main state
     */
    onEditNewRuleForm() {
        this.props.onEditForm({
            autoCompleteText: this.autoCompleteText,
            quantifierXPath: this.state.quantifierXPath,
            constraintXPath: this.state.quantifierXPath
        });
    }

}

function mapStateToProps(state) {
    return {
        ws: state.ws,

        autoCompleteText: state.newOrEditRule.autoCompleteText,
        quantifierXPath: state.newOrEditRule.quantifierXPath,
        constraintXPath: state.newOrEditRule.quantifierXPath,
        message: state.message
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onEditForm: (data) => {
            dispatch(editNewRuleGrammarGuiData(data))
        },
        onReceiveGuiTree: (data) => {
            dispatch(receiveGuiTree(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RuleGenerationComponent);
