/**
 * Created by saharmehrpour on 2/23/18.
 */

import React, {Component} from 'react';
import {connect} from "react-redux";
import '../App.css';

import {Alert} from 'react-bootstrap';
import {Button, FormGroup, ButtonToolbar} from 'react-bootstrap';

import RuleGeneratorGui from './ruleGenerationGUI/ruleGeneratorGui';
import Utilities from "../core/utilities";
import {constants} from "./constants";
import AutoComplete from "./ruleGenerationText/autoComplete";
import verifyTextBasedOnGrammar from "./ruleGenerationText/languageProcessing";
import {editNewRuleForm} from "../actions";


class RuleGenerationComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            xPathState: Utilities.cloneJSON(constants.guiXPathState),
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
                    <AutoComplete ref={(autoComplete) => this.autoComplete = autoComplete}
                                  defaultValue={this.state.autoCompleteText}
                                  onBlur={() => {
                                      if(this.shouldAlert) {
                                          verifyTextBasedOnGrammar(this.state.autoCompleteText)
                                              .then((data) => this.setState({...data, ...{autoCompleteValidationState: null}}))
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
                    <RuleGeneratorGui key={new Date()} state={this.state["xPathState"]} className={"generateRuleGui"}/>
                </FormGroup>
                quantifierGrammar: {this.state["xPathState"].quantifierGrammar}
            </div>
        );
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        this.setState({
            autoCompleteText: nextProps.autoCompleteText,
            quantifierXPath: nextProps.quantifierXPath,
            constraintXPath: nextProps.quantifierXPath
        });
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
                            message: grammarError.e.ctx.constructor.name
                            + (grammarError.e.ctx.parentCtx !== null ? (" in " + grammarError.e.ctx.parentCtx.constructor.name) : "")
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
            title: this.props.title,
            description: this.props.description,
            ruleTags: this.props.ruleTags,
            folderConstraint: this.props.folderConstraint,
            filesFolders: this.props.filesFolders,
            autoCompleteText: this.state.autoCompleteText,
            quantifierXPath: this.props.quantifierXPath,
            constraintXPath: this.props.quantifierXPath
        });
    }

}

function mapStateToProps(state) {
    return {
        ws: state.ws,

        title: state.newOrEditRule.title,
        description: state.newOrEditRule.description,
        ruleTags: state.newOrEditRule.ruleTags,
        folderConstraint: state.newOrEditRule.folderConstraint,
        filesFolders: state.newOrEditRule.filesFolders,
        autoCompleteText: state.newOrEditRule.autoCompleteText,
        quantifierXPath: state.newOrEditRule.quantifierXPath,
        constraintXPath: state.newOrEditRule.quantifierXPath
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onEditForm: (formContents) => {
            dispatch(editNewRuleForm(formContents))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RuleGenerationComponent);
