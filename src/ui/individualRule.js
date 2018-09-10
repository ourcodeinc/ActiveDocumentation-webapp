/**
 * Created by saharmehrpour on 9/6/17.
 */

import React, {Component} from 'react';
import '../App.css';

import IndividualRuleList from './individualRuleList';
import {FormControl, Label} from 'react-bootstrap';
import Utilities from '../core/utilities';
import {connect} from "react-redux";
import {updateIndividualRuleDescription, updateIndividualRuleTitle, updateRule} from "../actions";

class IndividualRule extends Component {

    render() {
        return (
            <div>
                <div className="tableRow">
                    <div className="tableCell labelCell"><h4>Rule Title</h4></div>
                    <div className="tableCell infoCell">
                        <FormControl componentClass="textarea" placeholder="Title" //id="indi_title_textarea"
                                     onBlur={() => this.props.onUpdateRule(this.props)}
                                     value={this.props.individualRuleTitle}
                                     onChange={(e) => this.props.onChangeTitle(e.target.value)}
                        />
                    </div>
                </div>
                <div className="tableRow">
                    <div className="tableCell labelCell"><h4>Rule Description</h4></div>
                    <div className="tableCell infoCell">
                        <FormControl componentClass="textarea" placeholder="Description" id="indi_description_textarea"
                                     onBlur={() => this.props.onUpdateRule(this.props)}
                                     onKeyUp={() => {
                                         let el = document.getElementById("indi_description_textarea");

                                         el.style.cssText = 'height:auto; padding:0';
                                         el.style.cssText = 'height:' + (25 + el.scrollHeight) + 'px';
                                     }}
                                     value={this.props.individualRuleDescription}
                                     onChange={(e) => this.props.onChangeDescription(e.target.value)}
                        />
                    </div>
                </div>
                <div className="tableRow">
                    <div className="tableCell labelCell"><h4>Rule Tags</h4></div>
                    <div id="indi_tags_div" className="tableCell infoCell">
                        {!this.props.ruleI ? null : this.props.ruleI['tags'].map((d, i) =>
                            (<div className="buttonDiv" key={i}>
                                <Label
                                    onClick={() => window.location.hash = "#/tag/" + d.replace(/\//g, '%2F')}>{d}</Label>
                            </div>)
                        )}
                    </div>
                </div>
                <div className="tableRow">
                    <div className="tableCell labelCell"><h4>Matches</h4></div>
                    <div id="indi_all_div" className="tableCell infoCell">
                        {!this.props.ruleI ? null : (
                            <IndividualRuleList ruleI={this.props.ruleI} ws={this.props.ws} group="all"/>
                        )}
                    </div>
                </div>
                <div className="tableRow">
                    <div className="tableCell labelCell"><h4>Rule Verified</h4></div>
                    <div className="tableCell infoCell">
                        <div id="indi_satisfied_div" className="largePaddedDiv">
                            {!this.props.ruleI ? null : (
                                <IndividualRuleList ruleI={this.props.ruleI} ws={this.props.ws} group="satisfied"/>
                            )}
                        </div>
                        <div id="indi_violated_div" className="largePaddedDiv">
                            {!this.props.ruleI ? null : (
                                <IndividualRuleList ruleI={this.props.ruleI} ws={this.props.ws} group="violated"/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextProps) === JSON.stringify(this.props));
    }

    /**
     * update the length of a text area to remove scroll
     */
    updateTextareaLength() {
        let elements = document.getElementById("individualRule").getElementsByTagName("textarea");
        Array.from(elements).forEach( (el) => {
            el.style.cssText = 'height:0';
            el.style.cssText = 'overflow:hidden;height:' + el.scrollHeight + 'px';
        });
    }
}

// map state to props
function mapStateToProps(state) {

    let props = {
        rules: state.ruleTable,
        codeChanged: false,
        filePath: "none",
        ws: state.ws,
        ignoreFile: state.ignoreFile,

    };

    if (state.hash[0] === "rule") {
        props.ruleI = props.rules.filter((d) => +d.index === +state.hash[1])[0];
        props.individualRuleTitle = state.individualRule.title === "" ? props.ruleI.title : state.individualRule.title;
        props.individualRuleDescription = state.individualRule.description === "" ? props.ruleI.description : state.individualRule.description;
    }

    return props;
}

function mapDispatchToProps(dispatch) {
    return {
        onUpdateRule: (props) => {
            if (props.individualRuleTitle !== props.ruleI['title'] || props.individualRuleDescription !== props.ruleI['description']) {
                let newObj = Utilities.cloneJSON(props.ruleI);
                newObj['title'] = props.individualRuleTitle;
                newObj['description'] = props.individualRuleDescription;
                delete newObj['xPathQueryResult'];
                Utilities.sendToServer(props.ws, "MODIFIED_RULE", newObj);

                /* Same object will throw errors as the removed attribute is either present in both ot neither */
                let modifiedObj = Utilities.cloneJSON(props.ruleI);
                modifiedObj['title'] = props.individualRuleTitle;
                modifiedObj['description'] = props.individualRuleDescription;
                dispatch(updateRule(modifiedObj));
            }
        },
        onChangeTitle: (text) => {
            dispatch(updateIndividualRuleTitle(text))
        },
        onChangeDescription: (text) => {
            dispatch(updateIndividualRuleDescription(text))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndividualRule);
