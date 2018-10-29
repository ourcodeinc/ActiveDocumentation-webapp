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
            autoCompleteText: props.autoCompleteText,
            showAlert: true,
            autoCompleteValidationState: null // error, success, warning, null
        };

        // should not be in state, it need to be changed after single use.
        // the component is updated after changing this value because the state is also changing
        // otherwise call this.forceUpdate()
        this.autoCompleteCaretPosition = -1;
    }

    render() {
        return (
            <div style={{paddingTop: '10px', clear: 'both'}}>
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
                <FormGroup validationState={this.state.autoCompleteValidationState}>
                    <RuleGeneratorText ref={(autoComplete) => this.autoComplete = autoComplete}
                                  defaultValue={this.state.autoCompleteText}
                                  onBlur={() => {
                                      if(this.shouldAlert) {
                                          verifyTextBasedOnGrammar(this.state.autoCompleteText)
                                              .then((data) => {
                                                  this.setState({
                                                      quantifierXPath: data.quantifierXPath,
                                                      constraintXPath: data.constraintXPath,
                                                      autoCompleteValidationState: null,
                                                      error: ""
                                                  });

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
                                      this.setState({autoCompleteText: text});
                                      this.onEditNewRuleForm()
                                  }}
                                  caretPosition={(() => {
                                      let newFocus = this.autoCompleteCaretPosition;
                                      this.autoCompleteCaretPosition = -1;
                                      return newFocus;
                                  })()}/>
                    <RuleGeneratorGui key={new Date()} className={"generateRuleGui"}/>
                </FormGroup>
            </div>
        );
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        this.setState({
            autoCompleteText: nextProps.autoCompleteText,
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
                    let grammarError = error.grammarErrors[0];
                    this.autoCompleteCaretPosition = error.grammarErrors[0].col;
                    this.setState({
                        error: {
                            errorType: "Grammar Error",
                            message: (grammarError.e.ctx? grammarError.e.ctx.constructor.name : "null")
                            + (grammarError.e.ctx && grammarError.e.ctx.parentCtx !== null ? (" in " + grammarError.e.ctx.parentCtx.constructor.name) : "")
                            + ", character " + error.grammarErrors[0].col,
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


    /***
     * This function calls a dispatcher for redux
     * to update the content of the form in the main state
     */
    onEditNewRuleForm() {
        this.props.onEditForm({
            autoCompleteText: this.state.autoCompleteText,
            quantifierXPath: this.props.quantifierXPath,
            constraintXPath: this.props.quantifierXPath
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
