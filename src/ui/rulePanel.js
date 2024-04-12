/**
 * Created by saharmehrpour on 9/6/17.
 */

import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "../App.css";
import {
  Tab,
  Tabs,
  Badge,
  FormGroup,
  ControlLabel,
  Label,
  Collapse,
} from "react-bootstrap";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

import { changeEditMode, ignoreFileChange } from "../actions";
import Utilities from "../core/utilities";
import RulePad from "./RulePad/rulePad";
import { reduxStoreMessages } from "../reduxStoreConstants";
import { webSocketSendMessage } from "../core/coreConstants";
import { relatives } from "../core/ruleExecutorConstants";
import { hashConst, none_filePath } from "./uiConstants";

import { suggestFix } from "../activeLLM/suggestFix";
import { config } from "../activeLLM/config";

class RulePanel extends Component {
  constructor(props) {
    super(props);
    this.ruleIndex = props.ruleIndex !== undefined ? props.ruleIndex : -1;
    /**
     * @type {null|{index:number, title:string, description:string, tags:[], grammar:string,
     * checkForFilesFolders:[string], checkForFilesFoldersConstraints:"INCLUDE"|"EXCLUDE"|"NONE",
     * processFilesFolders:"WITHIN",
     * quantifierXPathQuery:[], constraintXPathQuery:[], quantifierQueryType:string, constraintQueryType:string,
     * rulePanelState:{editMode:boolean, title:string, description:string, ruleTags:[], folderConstraint:string,
     * filesFolders:[],
     * constraintXPath:string, quantifierXPath:string, autoCompleteArray:[],
     * graphicalEditorState:{guiTree:{}, guiElements:{}, ruleType:string}},
     * xPathQueryResult:[{
     * data:{quantifierResult:[{filePath:string,snippet:string,xml:{fileName:string,
     * xml:string}}],
     * satisfied:number, satisfiedResult:[], violated:number, violatedResult:[]
     * changed:boolean,violatedChanged:string,satisfiedChanged:string,allChanged:string},
     * filePath:string
     * }]}}
     */
    this.ruleI = null;
    this.newRuleRequest = this.ruleIndex === -1;

    this.state = {
      openPanel: true,
      className: "rulePanelDiv" + (this.newRuleRequest ? " edit-bg" : ""),
      activeTab: 0,

      editMode: this.newRuleRequest,

      title: "",
      description: "",
      ruleTags: [],
      folderConstraint: "",
      filesFolders: [],
      tags: [],

      filePath: none_filePath,
    };

    // existing rule
    if (!this.newRuleRequest && this.ruleIndex !== -1) {
      let indices = props.rules.map((d) => d.index);
      let arrayIndex = indices.indexOf(this.ruleIndex);
      if (arrayIndex === -1)
        console.log(`error: rule with index ${this.ruleIndex} is not found in the ruleTable.
                Only ${indices.toString()} are found as indices.`);
      else {
        this.ruleI = props.rules[arrayIndex];
        this.state.title = this.ruleI.title;
        this.state.description = this.ruleI.description;
        this.state.ruleTags = this.ruleI.tags;
        this.state.folderConstraint =
          this.ruleI.checkForFilesFoldersConstraints;
        this.state.filesFolders = this.ruleI.checkForFilesFolders;
        this.state.tagTable = props.tagTable;

        this.state.editMode = this.ruleI.rulePanelState.editMode;
      }
    }

    this.caretClass = {
      true: { cursor: "pointer", color: "black" },
      false: { cursor: "pointer", color: "darkgrey" },
    };

    this.editIconClass = {
      true: { color: "#337ab7", cursor: "pointer" },
      false: { color: "black", cursor: "pointer" },
    };
  }

  render() {
    if (!this.ruleI && !this.state.editMode) return null;
    if (this.state.editMode)
      return (
        <RulePad
          ruleIndex={this.ruleIndex}
          changeEditMode={() => this.changeEditMode()}
        />
      );
    return (
      <div className={this.state.className}>
        <FormGroup>
          <div style={{ float: "right" }}>
            <FaCaretUp
              size={20}
              onClick={() => this.setState({ openPanel: false })}
              style={this.caretClass[this.state.openPanel.toString()]}
              className={"react-icons"}
            />
            <FaCaretDown
              size={20}
              onClick={() => this.setState({ openPanel: true })}
              style={this.caretClass[(!this.state.openPanel).toString()]}
              className={"react-icons"}
            />
            <MdEdit
              size={20}
              style={this.editIconClass[this.state.editMode.toString()]}
              onClick={() => this.changeEditMode()}
              className={"react-icons"}
            />
          </div>
          <ControlLabel>{this.state.title}</ControlLabel>
          <p>{this.state.description}</p>
        </FormGroup>
        <Collapse in={this.state.openPanel}>
          <div>
            <div style={{ paddingTop: "10px", clear: "both" }}>
              {this.renderTags()}
            </div>
            <div style={{ paddingTop: "10px", clear: "both" }}>
              <Tabs
                animation={true}
                id={"rules_" + this.ruleIndex}
                activeKey={this.state.activeTab}
                onSelect={(key) => {
                  if (this.state.activeTab === key)
                    this.setState({ activeTab: 0 });
                  else this.setState({ activeTab: key });
                }}
              >
                <Tab eventKey={0} disabled>
                  {}
                </Tab>
                <Tab
                  eventKey={"satisfied"}
                  title={this.renderTabHeader("satisfied")}
                >
                  {this.renderListOfSnippets("satisfied")}
                </Tab>
                <Tab
                  eventKey={"violated"}
                  title={this.renderTabHeader("violated")}
                >
                  {this.renderListOfSnippets("violated")}
                </Tab>
              </Tabs>
            </div>
          </div>
        </Collapse>
      </div>
    );
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let newState = {};
    this.ruleIndex =
      nextProps.ruleIndex !== undefined ? nextProps.ruleIndex : -1;
    let arrayIndex = nextProps.rules
      .map((d) => d.index)
      .indexOf(this.ruleIndex);
    if (this.ruleIndex >= 0) {
      if (arrayIndex === -1)
        console.log(`error: rule with index ${this.ruleIndex} is not found in the ruleTable.
                Only ${nextProps.rules.map((d) => d.index).toString()} are found as indices.`);
      else {
        this.ruleI = nextProps.rules[arrayIndex];
        newState = {
          title: this.ruleI.title,
          description: this.ruleI.description,
          ruleTags: this.ruleI.tags,
          folderConstraint: this.ruleI.checkForFilesFoldersConstraints,
          filesFolders: this.ruleI.checkForFilesFolders,
          editMode: false,
        };
      }
    }

    if (nextProps.message === reduxStoreMessages.hash_msg) {
      let panelState = this.newUpdateStateUponCodeChange(
        nextProps.codeChanged,
        nextProps.filePath,
      );
      this.setState({
        ...panelState,
        ...newState,
        filePath: nextProps.filePath,
      });
    } else if (nextProps.message === reduxStoreMessages.file_path_update_msg)
      this.setState({ ...newState, filePath: nextProps.filePath });
    else if (nextProps.message === reduxStoreMessages.change_edit_mode_msg) {
      let indices = nextProps.rules.map((d) => d.index);
      let arrayIndex = indices.indexOf(this.ruleIndex);
      if (this.ruleIndex !== -1) {
        if (arrayIndex === -1)
          console.log(`error: rule with index ${this.ruleIndex} is not found in the ruleTable.
                Only ${indices.toString()} are found as indices.`);
        else {
          this.ruleI = nextProps.rules[arrayIndex];
          newState.editMode = this.ruleI.rulePanelState.editMode;
          this.setState({ ...newState, filePath: nextProps.filePath });
        }
      }
    }

    // existing rule
    else if (
      nextProps.message === reduxStoreMessages.update_rule_table_msg &&
      this.ruleIndex !== -1
    ) {
      if (arrayIndex !== -1) {
        if (this.ruleI.rulePanelState.editMode && !this.state.editMode) {
          newState.editMode = true;
          this.setState({ ...newState, filePath: nextProps.filePath });
        } else {
          let panelState = this.newUpdateStateUponCodeChange(
            nextProps.codeChanged,
            nextProps.filePath,
          );
          this.setState({
            ...newState,
            ...panelState,
            filePath: nextProps.filePath,
          });
        }
      }
    }
  }

  /**
   * set the states "openPanel" and "className" after mounting.
   */
  componentDidMount() {
    let panelState = this.newUpdateStateUponCodeChange(
      this.props.codeChanged,
      this.state.filePath,
    );
    this.setState(panelState);
  }

  /**
   * render the tab headers
   * @param group
   */
  renderTabHeader(group) {
    // sum up the number of satisfied and violated
    let totalSatisfied = 0,
      totalViolated = 0;
    for (let i = 0; i < this.ruleI.xPathQueryResult.length; i++) {
      totalSatisfied += this.ruleI.xPathQueryResult[i].data.satisfied;
      totalViolated += this.ruleI.xPathQueryResult[i].data.violated;
    }

    let fileSatisfied = 0,
      fileViolated = 0;
    let file = this.ruleI.xPathQueryResult.filter(
      (d) => d.filePath === this.state.filePath,
    );
    if (file.length > 0) {
      fileSatisfied = file[0].data.satisfied;
      fileViolated = file[0].data.violated;
    }

    switch (group) {
      case "all":
        return (
          <span className="rulePanelGeneralTab">
            Matches
            {this.state.filePath !== none_filePath ? (
              <Fragment>
                <Badge className="forAll">{fileSatisfied + fileViolated}</Badge>
                <span style={{ color: "#777" }}>out of</span>
                <Badge className="forAll">
                  {totalSatisfied + totalViolated}
                </Badge>
              </Fragment>
            ) : (
              <Badge className="forAll">{totalSatisfied + totalViolated}</Badge>
            )}
            <Badge className="forFile hidden">{}</Badge>
          </span>
        );
      case "satisfied":
        return (
          <span className="rulePanelSatisfiedTab">
            Examples
            {this.state.filePath !== none_filePath ? (
              <Fragment>
                <Badge className="forAll">{fileSatisfied}</Badge>
                <span style={{ color: "#777" }}>out of</span>
                <Badge className="forAll">{totalSatisfied}</Badge>
              </Fragment>
            ) : (
              <Badge className="forAll">{totalSatisfied}</Badge>
            )}
            <Badge className="forFile hidden">{}</Badge>
          </span>
        );
      case "violated":
        return (
          <span className="rulePanelViolatedTab">
            Violated
            {this.state.filePath !== none_filePath ? (
              <Fragment>
                <Badge className="forAll">{fileViolated}</Badge>
                <span style={{ color: "#777" }}>out of</span>
                <Badge className="forAll">{totalViolated}</Badge>
              </Fragment>
            ) : (
              <Badge className="forAll">{totalViolated}</Badge>
            )}
            <Badge className="forFile hidden">{}</Badge>
          </span>
        );
      default:
        break;
    }
  }

  /**
   * render tag badges
   */
  renderTags() {
    return this.ruleI.tags.map((d, i) => {
      let tagFilter = this.state.tagTable.filter((tt) => tt.tagName === d);
      if (tagFilter.length !== 1) {
        return (
          <div className="buttonDiv" key={i}>
            <Label>{d}</Label>
          </div>
        );
      }
      return (
        <div className="buttonDiv" key={i}>
          <Label
            onClick={() =>
              (window.location.hash = `#/${hashConst.tag}/${tagFilter[0].ID}`)
            }
          >
            {d}
          </Label>
        </div>
      );
    });
  }

  /**
   * create a list div node for quantifier and satisfied result and wrap them in a div
   * @param group {string}
   */
  renderListOfSnippets(group) {
    let otherFilesList = [],
      fileList = [];

    let file = this.ruleI.xPathQueryResult.filter(
      (d) => d.filePath === this.state.filePath,
    );

    let exampleSnippet = null;
    let exampleFoundInOpenFile = false;

    switch (group) {
      case "all":
        if (this.state.filePath !== none_filePath) {
          if (file.length > 0) fileList = file[0].data.quantifierResult;
        }
        for (let i = 0; i < this.ruleI.xPathQueryResult.length; i++) {
          if (this.ruleI.xPathQueryResult[i].filePath === this.state.filePath)
            continue;
          otherFilesList = otherFilesList.concat(
            this.ruleI.xPathQueryResult[i].data.quantifierResult,
          );
        }
        break;
      case "satisfied":
        if (this.state.filePath !== none_filePath) {
          if (file.length > 0) fileList = file[0].data.satisfiedResult;
        }

        for (let i = 0; i < this.ruleI.xPathQueryResult.length; i++) {
          if (this.ruleI.xPathQueryResult[i].filePath === this.state.filePath)
            continue;
          otherFilesList = otherFilesList.concat(
            this.ruleI.xPathQueryResult[i].data.satisfiedResult,
          );
        }
        break;
      case "violated":
        if (this.state.filePath !== none_filePath) {
          if (file.length > 0) fileList = file[0].data.violatedResult;
        }
        for (let i = 0; i < this.ruleI.xPathQueryResult.length; i++) {
          // NOTE: added example snippet
          if (
            exampleSnippet == null &&
            this.ruleI.xPathQueryResult[i].data.satisfiedResult.length > 0
          ) {
            try {
              exampleSnippet =
                this.ruleI.xPathQueryResult[i].data.satisfiedResult[0]
                  .surroundingNodes;
            } catch (e) {
              console.log(e);
            }
          }
          if (this.ruleI.xPathQueryResult[i].filePath === this.state.filePath) {
            // NOTE: added example snippet
            if (
              (exampleSnippet == null || !exampleFoundInOpenFile) &&
              this.ruleI.xPathQueryResult[i].data.satisfiedResult.length > 0
            ) {
              try {
                exampleSnippet =
                  this.ruleI.xPathQueryResult[i].data.satisfiedResult[0]
                    .surroundingNodes;
                exampleFoundInOpenFile = true;
              } catch (e) {
                console.log(e);
              }
              continue;
            }
          }
          otherFilesList = otherFilesList.concat(
            this.ruleI.xPathQueryResult[i].data.violatedResult,
          );
        }
        break;
      default:
        break;
    }

    let returnList = (list) => {
      if (list.length === 0) return <h5>No snippet</h5>;
      return list.map((d, i) => {
        return (
          <SnippetView
            key={i}
            d={d}
            snippetGroup={group}
            exampleSnippet={exampleSnippet}
            description={this.state.description}
            ws={this.props.ws}
            onIgnoreFile={this.props.onIgnoreFile}
          />
        );
      });
    };

    let headerText =
      group === "all"
        ? "Matches"
        : group === "satisfied"
          ? "Example Snippet"
          : "Violated snippet";

    return (
      <div>
        {this.state.filePath !== none_filePath ? (
          <Fragment>
            <h4>{headerText + " for this file"}</h4>
            <div>{returnList(fileList)}</div>
            <h4>{headerText + " for other files"}</h4>
          </Fragment>
        ) : null}
        <div>{returnList(otherFilesList)}</div>
      </div>
    );
  }

  /**
   * compute the className and state of the panel after the code is changed
   * @param codeChanged
   * @param filePath path of the open file
   * @returns {*}
   */
  newUpdateStateUponCodeChange(codeChanged, filePath) {
    if (!codeChanged) {
      let open;
      if (filePath === none_filePath) open = true;
      else
        open =
          this.ruleI.xPathQueryResult.filter((d) => d.filePath === filePath)
            .length > 0;
      return {
        className: "rulePanelDiv" + (this.newRuleRequest ? " edit-bg" : ""),
        openPanel: open,
      };
    }

    let file = this.ruleI.xPathQueryResult.filter(
      (d) => d.filePath === filePath,
    );
    let ruleIFile = file.length !== 0 ? file[0].data : {};
    if (
      ruleIFile.allChanged === relatives.greater &&
      ruleIFile.satisfiedChanged === relatives.none &&
      ruleIFile.violatedChanged === relatives.none
    ) {
      return { openPanel: true, className: "rulePanelDiv blue-bg" };
    }
    if (ruleIFile.satisfiedChanged === relatives.greater)
      return { openPanel: true, className: "rulePanelDiv green-bg" };

    if (ruleIFile.violatedChanged === relatives.greater)
      return { openPanel: true, className: "rulePanelDiv red-bg" };

    if (file.length > 0) return { openPanel: true, className: "rulePanelDiv" };

    if (ruleIFile.violated === 0)
      return { openPanel: false, className: "rulePanelDiv" };

    return { openPanel: false, className: "rulePanelDiv" };
  }

  /**
   * change edit mode, set the states
   */
  changeEditMode() {
    this.props.onChangeEditMode(this.ruleIndex, !this.state.editMode);
  }
}

// map state to props
function mapStateToProps(state) {
  return {
    rules: state.ruleTable,
    tagTable: state.tagTable,
    codeChanged: state.currentHash[0] === hashConst.codeChanged,
    filePath:
      [hashConst.rulesForFile, hashConst.codeChanged].indexOf(
        state.currentHash[0],
      ) !== -1
        ? state.openFilePath
        : none_filePath,
    ws: state.ws,
    message: state.message,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onIgnoreFile: (shouldIgnore) => dispatch(ignoreFileChange(shouldIgnore)),
    onChangeEditMode: (ruleIndex, newEditMode) =>
      dispatch(changeEditMode(ruleIndex, newEditMode)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RulePanel);

class SnippetView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snippetGroup: props.snippetGroup,
      d: props.d,
      description: props.description,
      exampleSnippet: props.exampleSnippet,
      suggestedSnippet: null,
      suggestionCreated: false,
      snippetExplanation: null,
    };
  }

  render() {
    function removeAnnotations(xmlString) {
      // removes srcml tags
      xmlString = xmlString.replace(/<[^>]*>/g, "");
      // replaces &lt; with <
      xmlString = xmlString.replace(/&lt;/g, "<");
      // replaces &gt; with >
      xmlString = xmlString.replace(/&gt;/g, ">");
      // replaces &amp; with &
      xmlString = xmlString.replace(/&amp;/g, "&");
      // removes empty lines
      // xmlString = xmlString.replace(/[\n\r]+/g, "\n");
      // removes tab spaces
      // xmlString = xmlString.replace(/[\t]+/g, "");
      // removes leading spaces
      // xmlString = xmlString.replace(/[\s]{2,}/g, "");

      return xmlString;
    }

    /* Handle Click for the "Suggest A Fix" button */
    const handleSuggestion = async (rule, example, snippet) => {
      // parse the passed in snippet
      const parsedSnippet = removeAnnotations(snippet);
      const parsedExample = removeAnnotations(example);
      if (!this.state.suggestionCreated) {
        suggestFix(
          rule,
          parsedExample,
          parsedSnippet,
          this.setState.bind(this),
        );
        this.setState({ suggestionCreated: true });
      }
    };

    const titleStyle = {
      color: "#333",
      fontSize: "1em",
      width: "100%",
      fontWeight: "bold",
      wordWrap: "break-word",
    };

    const codeStyle = {
      color: "#333",
      fontSize: "0.9em",
      width: "100%",
      wordWrap: "break-word",
      whiteSpace: "pre-wrap",
    };

    const explanationStyle = {
      color: "#333",
      fontSize: "0.9em",
      width: "100%",
      wordWrap: "break-word",
      whiteSpace: "pre-wrap",
      textDecoration: "indent",
    };

    const buttonStyle = {
      marginTop: "5px",
      marginRight: "5px",
      backgroundColor: "#777",
      color: "white",
      border: "none",
      borderRadius: "5px",
      padding: "5px 7.5px",
      cursor: "pointer",
      outline: "none",
    };

    const buttonParent = {
      position: "absolute",
      top: "0",
      right: "0",
      zIndex: "1",
    };

    return (
      <section>
        <div
          data-file-path={this.state.d.filePath}
          className="snippetDiv"
          style={{
            position: "relative",
          }}
        >
          <pre
            className="link"
            onClick={() => {
              this.props.onIgnoreFile(true);
              Utilities.sendToServer(
                this.props.ws,
                webSocketSendMessage.snippet_xml_msg,
                this.state.d.xml,
              );
            }}
          >
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: this.state.d.snippet }}
            />
            <div style={buttonParent}>
              {this.state.snippetGroup === "violated" &&
                config.OPENAI_API_KEY != "" &&
                !this.state.suggestedSnippet && (
                  <button
                    onClick={() =>
                      handleSuggestion(
                        this.state.description,
                        this.state.exampleSnippet,
                        this.state.d.surroundingNodes,
                      )
                    }
                    style={buttonStyle}
                  >
                    Fix ✨
                  </button>
                )}
            </div>

            {this.state.suggestedSnippet && (
              <div>
                <p style={titleStyle}>Suggested Snippet:</p>
                <pre
                  className="content"
                  style={codeStyle}
                  dangerouslySetInnerHTML={{
                    __html: this.state.suggestedSnippet,
                  }}
                />
                <p style={titleStyle}>Explanation:</p>
                <pre
                  className="content"
                  style={explanationStyle}
                  dangerouslySetInnerHTML={{
                    __html: this.state.snippetExplanation,
                  }}
                />
                <button
                  // send the suggested fix and the explanation to to plugin
                  onClick={() => {
                    this.props.onIgnoreFile(true);
                    Utilities.sendToServer(
                      this.props.ws,
                      // filter string "convertedJava" which is the displayed snippet (short)
                      // send {filepath: ..., convertedJava: ...}
                      webSocketSendMessage.snippet_xml_msg,
                      this.state.d.xml,
                    );
                  }}
                  style={buttonStyle}
                >
                  Accept Fix
                </button>
              </div>
            )}
          </pre>
        </div>
      </section>
    );
  }
}
