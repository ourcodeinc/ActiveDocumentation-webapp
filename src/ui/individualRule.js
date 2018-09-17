/**
 * Created by saharmehrpour on 9/6/17.
 */

import React, {Component} from 'react';
import '../App.css';

import {Button, ButtonToolbar, DropdownButton, MenuItem} from 'react-bootstrap';
import {FormControl, Label, FormGroup} from 'react-bootstrap';
import {Row, Col} from 'react-bootstrap';
import TiDelete from 'react-icons/lib/ti/delete';

import IndividualRuleList from './individualRuleList';
// import Utilities from '../core/utilities';
import {connect} from "react-redux";
// import {updateRule} from "../actions";
import AutoComplete from "./grammarRuleGen/autoComplete";


class IndividualRule extends Component {

    constructor() {
        super();

        this.state = {
            title: "",
            description: "",
            availableTags: [],
            tags: [],
            folderConstraint: "",
            filesFolders: [],
            autoCompleteText: ""
        };
    }

    render() {
        return (
            <div>
                {!this.props.ruleI ? null : this.renderForm()}

                <div>
                    {!this.props.ruleI ? null : (
                        <IndividualRuleList ruleI={this.props.ruleI} ws={this.props.ws} group="all"/>
                    )}
                </div>
                <div>
                    <div className="largePaddedDiv">
                        {!this.props.ruleI ? null : (
                            <IndividualRuleList ruleI={this.props.ruleI} ws={this.props.ws} group="satisfied"/>
                        )}
                    </div>
                    <div className="largePaddedDiv">
                        {!this.props.ruleI ? null : (
                            <IndividualRuleList ruleI={this.props.ruleI} ws={this.props.ws} group="violated"/>
                        )}
                    </div>
                </div>

                <div>
                    <div style={{width: 200, float: "left", paddingRight: "5px"}}>
                        <Button bsStyle="primary" block onClick={() => this.onSubmitUpdatedRule()}>Submit</Button>
                    </div>
                    <div style={{width: 200, float: "left"}}>
                        <Button bsStyle="default" block onClick={() => this.resetForm()}>Reset</Button>
                    </div>
                </div>
            </div>
        );
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        if (nextProps.ruleI !== this.props.ruleI && nextProps.ruleI !== null)
            this.setState({
                title: nextProps.ruleI.title,
                description: nextProps.ruleI.description,
                availableTags: nextProps.tags.filter(d => nextProps.ruleI.tags.indexOf(d.tagName) !== -1),
                tags: nextProps.ruleI.tags,
                folderConstraint: nextProps.ruleI.ruleType.constraint,
                filesFolders: nextProps.ruleI.ruleType.checkFor,
                autoCompleteText: nextProps.ruleI.grammar ? nextProps.ruleI.grammar : ""
            });
        else
            this.setState({autoCompleteText: nextProps.autoCompleteText});
    }

    /**
     * update the length of a text area to remove scroll
     */
    updateTextareaLength() {
        let elements = document.getElementById("individualRule").getElementsByTagName("textarea");
        Array.from(elements).forEach((el) => {
            el.style.cssText = 'height:0';
            el.style.cssText = 'overflow:hidden;height:' + el.scrollHeight + 'px';
        });
    }


    /**
     * render the form about rule title, description, tags, files, etc.
     * @returns {XML}
     */
    renderForm() {
        return (
            <div>
                <FormGroup validationState={(this.state.title === "") ? "error" : "success"}>
                    <div style={{padding: "10px 5px"}}>
                        <h4>Rule Title</h4>
                        <FormControl componentClass="textarea" placeholder="Title"
                                     value={this.state.title}
                                     onChange={(e) => {
                                         this.setState({title: e.target.value})
                                     }}
                                     onKeyUp={(e) => {
                                         e.target.style.cssText = 'height:auto; padding:0';
                                         e.target.style.cssText = 'height:' + this.scrollHeight + 'px';
                                     }}/>
                    </div>
                </FormGroup>
                <FormGroup>
                    <div style={{padding: "10px 5px"}}>
                        <h4>Rule Description</h4>
                        <FormControl componentClass="textarea" placeholder="Description"
                                     value={this.state.description}
                                     onChange={(e) => {
                                         this.setState({description: e.target.value})
                                     }}
                                     onKeyUp={(e) => {
                                         e.target.style.cssText = 'height:auto; padding:0';
                                         e.target.style.cssText = 'height:' + this.scrollHeight + 'px';
                                     }}/>
                    </div>
                </FormGroup>
                <FormGroup>
                    <div style={{padding: "10px 5px", clear: "both"}}>
                        <h4>Rule Tags</h4>
                        <div>{this.renderTags()}</div>
                    </div>
                </FormGroup>
                <FormGroup
                    validationState={(this.state.folderConstraint === "" || (this.state.folderConstraint === "FOLDER" && this.state.filesFolders.length === 0)) ? "error" : "success"}>
                    <div style={{padding: "10px 5px", clear: "both"}}>
                        <h4>Files/Folders</h4>
                        <div>{this.renderFileConstraints()}</div>
                    </div>
                </FormGroup>
                <FormGroup>
                    <h4>Design Rule</h4>
                    <AutoComplete ref={(autoComplete) => this.autoComplete = autoComplete}
                                  defaultValue={this.state.autoCompleteText}
                                  onBlur={() => console.log("onBlur")}
                                  onUpdateText={() => console.log("onUpdateText")}/>
                </FormGroup>
            </div>
        );
    }

    /**
     * create a dropdown for tags
     */
    renderTags() {
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
        )
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

        // let rule = {
        //     index: +this.state.index,
        //     title: this.state.title,
        //     description: this.state.description,
        //     tags: this.state.tags,
        //     ruleType: {
        //         constraint: this.state.folderConstraint,
        //         checkFor: this.state.filesFolders.filter((d) => d !== ""),
        //         type: "WITHIN"
        //     },
        //     quantifier: {},
        //     constraint: {},
        //     grammar: this.state.autoCompleteText
        // };
        //
        // rule.quantifier = {detail: "", command: "src:unit/" + this.state.quantifierXPath};
        // rule.constraint = {detail: "", command: "src:unit/" + this.state.constraintXPath};
        //
        //
        // if (rule.index === "" || rule.title === "" || rule.description === "") {
        //     console.log("empty fields");
        //     return;
        // }
        //
        // if (rule.ruleType.constraint === "" || (rule.ruleType.constraint === "FOLDER" && rule.ruleType.checkFor.length === 0)) {
        //     console.log("folder constraints are not specified");
        //     return;
        // }
        //
        // if (this.state.quantifierXPath === "" || this.state.constraintXPath === "") {
        //     console.log("XPaths are not specified");
        //     return;
        // }
        //
        // this.props.onSubmitNewRule(rule);
        // Utilities.sendToServer(this.props.ws, "NEW_RULE", rule);
        // this.clearForm();
        // window.location.hash = "#/rule/" + rule.index;

    }

    /**
     * reset the fields to ruleI values
     */
    resetForm() {
        this.setState({
            title: this.props.ruleI.title,
            description: this.props.ruleI.description,
            availableTags: this.props.tags.filter(d => this.props.ruleI.tags.indexOf(d.tagName) !== -1),
            tags: this.props.ruleI.tags,
            folderConstraint: this.props.ruleI.ruleType.constraint,
            filesFolders: this.props.ruleI.ruleType.checkFor,
            autoCompleteText: this.props.ruleI.grammar ? this.props.ruleI.grammar : ""
        });
    }
}

// map state to props
function mapStateToProps(state) {
    return {
        rules: state.ruleTable,
        ws: state.ws,
        tags: state.tagTable,
        ruleI: state.hash[0] === "rule" ? state.ruleTable.filter((d) => +d.index === +state.hash[1])[0] : null
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onUpdateRule: (props) => {
            //todo
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndividualRule);
