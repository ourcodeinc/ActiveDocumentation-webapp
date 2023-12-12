import {initial_state, default_rulePanelState} from "./initialState";
import {reduxStoreActions, reduxStoreMessages} from "./reduxStoreConstants";
import {constantRuleIndex} from "./ui/uiConstants";
import {allAlgorithms} from "./miningRulesCore/featureConfig";


/**
 * using default_state as a default value surprisingly changes its value
 * Any incoming variable through arguments must be cloned and mutated,
 * Direct mutation doesn't work properly (UPDATE_RULE_TABLE)
 * @param state
 * @param action
 * @returns {*} new state
 */
const reducer = (state = JSON.parse(JSON.stringify(initial_state)), action) => {
    // console.log("reducer running", action);

    // Using Object.assign({}, state) has a flaw that it only does a shallow copy.
    // It means that nested properties are still going to be copied by reference.
    let copiedState = JSON.parse(JSON.stringify(state));
    let rules = [];

    switch (action.type) {
        case reduxStoreActions.action_update_loading_gif:
            return Object.assign({}, state, {
                loadingGif: action.data["loadingGif"]
            });

        case reduxStoreActions.action_hash:
            if (!state.hashManager.clickedOnButtons) {
                return Object.assign({}, state, {
                    currentHash: action.data["currentHash"],
                    message: reduxStoreMessages.hash_msg,
                    hashManager: {
                        history: [...state.hashManager.history, "#/" + action.data["currentHash"].join("/")],
                        activeHashIndex: state.hashManager.activeHashIndex + 1,
                        forwardDisable: "disabled",
                        backDisable: state.hashManager.activeHashIndex === 0 ? "disabled" : "",
                        clickedOnButtons: false
                    }
                });
            }
            return Object.assign({}, state, {
                currentHash: action.data["currentHash"],
                message: reduxStoreMessages.hash_msg,
                hashManager: {
                    history: state.hashManager.history,
                    activeHashIndex: state.hashManager.activeHashIndex,
                    forwardDisable: state.hashManager.forwardDisable,
                    backDisable: state.hashManager.backDisable,
                    clickedOnButtons: false
                }
            });

        case reduxStoreActions.action_new_ws:
            return Object.assign({}, state, {ws: action.data["ws"], message: reduxStoreMessages.ws_msg});

        case reduxStoreActions.action_update_xml_files:
            return Object.assign({}, state, {xmlFiles: action.data["xmlFiles"], message: reduxStoreMessages.update_xml_files_msg});

        case reduxStoreActions.action_update_tag_table:
            return Object.assign({}, state, {tagTable: action.data["tagTable"], message: reduxStoreMessages.update_tag_table_msg});

        case reduxStoreActions.action_update_rule_table:
            rules = JSON.parse(JSON.stringify(action.data["ruleTable"]));
            rules = rules.map(rule =>
                Object.assign({}, rule, {
                    rulePanelState: {
                        ...JSON.parse(JSON.stringify(default_rulePanelState)),
                        editMode: false,
                        title: rule.title,
                        description: rule.description,
                        ruleTags: rule.tags,
                        folderConstraint: rule.checkForFilesFoldersConstraints,
                        filesFolders: rule.checkForFilesFolders,
                        quantifierXPath: rule.quantifierXPathQuery[0],
                        constraintXPath: rule.constraintXPathQuery[0],
                        // autoCompleteText: rule.grammar,
                        autoCompleteArray: rule.grammar && rule.grammar !== "" ? rule.grammar.split(" ").map(word => {
                            return {id: "", text: word}
                        }) : []
                    }
                })
            );
            return Object.assign({}, state, {
                loadingGif: false,
                ruleTable: rules,
                message: reduxStoreMessages.update_rule_table_msg
            });

        case reduxStoreActions.action_update_rule:
            return Object.assign({}, state, {
                message: reduxStoreMessages.update_rule_msg
            });

        case reduxStoreActions.action_new_rule:
            return Object.assign({}, state, {
                rulePadState: {
                    ...JSON.parse(JSON.stringify(initial_state.rulePadState)),
                    isEditMode: false
                },
                message: reduxStoreMessages.new_rule_msg
            });

        case reduxStoreActions.action_new_tag:
            return Object.assign({}, state, {
                message: reduxStoreMessages.new_tag_msg
            });

        case reduxStoreActions.action_hierarchy_data:
            return Object.assign({}, state, {
                projectHierarchy: action.data["hierarchyData"],
                message: reduxStoreMessages.hierarchy_data_msg
            });

        case reduxStoreActions.action_project_path:
            return Object.assign({}, state, {
                projectPath: action.data["projectPath"],
                message: reduxStoreMessages.project_path_msg
            });

        /*
         file handling
          */

        case reduxStoreActions.action_ignore_file:
            let editCount = state.ruleTable.reduce((count, element) => count + element.rulePanelState.editMode ? 1 : 0, 0);
            if (state.rulePadState.isEditMode || editCount > 0) return Object.assign({}, state);
            return Object.assign({}, state, {ignoreFileChange: action.data["shouldIgnore"], message: reduxStoreMessages.ignore_file_msg});

        case reduxStoreActions.action_file_path_update:
            if (state.ignoreFileChange) return Object.assign({}, state, {message: reduxStoreMessages.file_path_update_msg});
            return Object.assign({}, state, {openFilePath: action.data["openFilePath"], message: reduxStoreMessages.file_path_update_msg});

        /*
         nav-bar navigation
          */

        case reduxStoreActions.action_click_forward:
            return Object.assign({}, state, {
                hashManager: {
                    history: state.hashManager.history,
                    activeHashIndex: state.hashManager.activeHashIndex + 1,
                    forwardDisable: state.hashManager.activeHashIndex === state.hashManager.history.length - 2 ? "disabled" : "",
                    backDisable: "",
                    clickedOnButtons: true
                },
                message: reduxStoreMessages.click_forward_msg
            });

        case reduxStoreActions.action_click_back:
            return Object.assign({}, state, {
                hashManager: {
                    history: state.hashManager.history,
                    activeHashIndex: state.hashManager.activeHashIndex - 1,
                    forwardDisable: "",
                    backDisable: state.hashManager.activeHashIndex === 1 ? "disabled" : "",
                    clickedOnButtons: true
                },
                message: reduxStoreMessages.click_back_msg
            });

        /*
            RulePad
         */

        case reduxStoreActions.action_update_display_edit_tutorial:
            return Object.assign({}, state, {
                displayEditRuleTutorial: action.data["shouldDisplay"],
                message: reduxStoreMessages.update_display_edit_tutorial_msg
            });

        case reduxStoreActions.action_clear_new_rule_form:
            return Object.assign({}, state, {
                rulePadState: {
                    ...JSON.parse(JSON.stringify(initial_state.rulePadState)),
                    isEditMode: true
                },
                message: reduxStoreMessages.clear_new_rule_form_msg
            });

        case reduxStoreActions.action_edit_rule_form:
            if (action.data["ruleIndex"] === constantRuleIndex.newRuleIndex) {
                return Object.assign({}, state, {
                    rulePadState: {
                        ...state.rulePadState,
                        title: action.data["title"],
                        description: action.data["description"],
                        ruleTags: action.data["ruleTags"],
                        folderConstraint: action.data["folderConstraint"],
                        filesFolders: action.data["filesFolders"]
                    },
                    message: reduxStoreMessages.edit_rule_form_msg
                });
            }
            else {
                rules = JSON.parse(JSON.stringify(state.ruleTable));
                rules = rules.map(d => {
                    let a = Object.assign({}, d);
                    if (a.index !== action.data["ruleIndex"]) return a;
                    a.rulePanelState.title = action.data["title"];
                    a.rulePanelState.description = action.data["description"];
                    a.rulePanelState.ruleTags = action.data["ruleTags"];
                    a.rulePanelState.folderConstraint = action.data["folderConstraint"];
                    a.rulePanelState.filesFolders = action.data["filesFolders"];
                    return a;
                });
                return Object.assign({}, state, {
                    ruleTable: rules,
                    message: reduxStoreMessages.edit_rule_form_msg
                });
            }

        case reduxStoreActions.action_change_edit_mode:
            if (action.data["ruleIndex"] >= 0) {
                let editCount_ = copiedState.ruleTable.reduce((count, element) => {
                    if (element.index !== action.data["ruleIndex"]) return count + element.rulePanelState.editMode ? 1 : 0;
                    return count + action.data["newEditMode"] ? 1 : 0;
                }, 0);

                rules = copiedState.ruleTable.map(d => {
                    let a = Object.assign({}, d);
                    if (a.index === action.data["ruleIndex"]) {
                        a.rulePanelState.editMode = action.data["newEditMode"];

                        // reset fields of the form after cancel editing
                        if (!action.data["newEditMode"])
                            a.rulePanelState = {
                                ...JSON.parse(JSON.stringify(default_rulePanelState)),
                                title: d.title,
                                description: d.description,
                                ruleTags: d.tags,
                                folderConstraint: d.checkForFilesFoldersConstraints,
                                filesFolders: d.checkForFilesFolders,
                                quantifierXPath: d.quantifierXPathQuery[0],
                                constraintXPath: d.constraintXPathQuery[0],
                                // autoCompleteText: d.grammar,
                                autoCompleteArray: d.grammar && d.grammar !== "" ? d.grammar.split(" ").map(word => {
                                    return {id: "", text: word}
                                }) : []
                            }
                    }
                    return a;
                });
                return Object.assign({}, state, {
                    ignoreFileChange: (state.rulePadState.isEditMode || editCount_ > 0),
                    ruleTable: rules,
                    message: reduxStoreMessages.change_edit_mode_msg
                });
            }
            else
                return Object.assign({}, state, {
                    ignoreFileChange: (action.data["newEditMode"] || state.ruleTable.reduce((count, element) => count + element.rulePanelState.editMode ? 1 : 0, 0) > 0),
                    rulePadState: {
                        ...state.rulePadState,
                        isEditMode: action.data["newEditMode"]
                    },
                    message: reduxStoreMessages.change_edit_mode_msg
                });

        case reduxStoreActions.action_receive_gui_tree:
            if (action.data["ruleIndex"] === constantRuleIndex.newRuleIndex) {
                return Object.assign({}, state, {
                    message: reduxStoreMessages.receive_gui_tree_msg,
                    rulePadState: {
                        ...state.rulePadState,
                        quantifierXPath: action.data["quantifierXPath"],
                        constraintXPath: action.data["constraintXPath"],
                        autoCompleteArray: action.data["autoCompleteArray"],
                        graphicalEditorState: {
                            ...state.rulePadState.graphicalEditorState,
                            ...action.data["newTreeData"]
                        }
                    }
                });
            }
            else {
                let rules = JSON.parse(JSON.stringify(state.ruleTable));
                rules = rules.map(d => {
                    let a = Object.assign({}, d);
                    if (a.index !== action.data["ruleIndex"]) return a;
                    a.rulePanelState.quantifierXPath = action.data["quantifierXPath"];
                    a.rulePanelState.constraintXPath = action.data["constraintXPath"];
                    a.rulePanelState.autoCompleteArray = action.data["autoCompleteArray"];
                    a.rulePanelState.graphicalEditorState = {
                        ...a.rulePanelState.graphicalEditorState,
                        ...action.data["newTreeData"]
                    };
                    return a;
                });
                return Object.assign({}, state, {
                    message: reduxStoreMessages.receive_gui_tree_msg,
                    ruleTable: rules
                });
            }

        case reduxStoreActions.action_send_expr_stmt_xml:
            return Object.assign({}, state, {
                sentXpathMessages: state.sentXpathMessages.concat([action.data["codeTextAndID"]]),
                message: reduxStoreMessages.send_expr_stmt_xml_msg
            });

        case reduxStoreActions.action_receive_expr_stmt_xml:
            return Object.assign({}, state, {
                receivedXpathMessages: state.receivedXpathMessages.concat([action.data["xmlData"]]),
                message: reduxStoreMessages.receive_expr_stmt_xml_msg
            });

        case reduxStoreActions.action_update_sent_received_messages:
            return Object.assign({}, state, {
                sentXpathMessages: action.data["sentMessages"],
                receivedXpathMessages: action.data["receivedMessages"],
                message: reduxStoreMessages.update_messages_msg
            });

        case reduxStoreActions.action_matched_messages:
            if (action.data["ruleIndex"] === constantRuleIndex.newRuleIndex) {
                return Object.assign({}, state, {
                    rulePadState: {
                        ...state.rulePadState,
                        quantifierXPath: action.data["quantifierXPath"],
                        constraintXPath: action.data["constraintXPath"],
                    },
                    sentXpathMessages: action.data["sentMessages"],
                    receivedXpathMessages: action.data["receivedMessages"],
                    message: reduxStoreMessages.matched_messages_msg
                });
            }
            else if (action.data["ruleIndex"] === constantRuleIndex.minedRuleIndex){
                return Object.assign({}, state, {
                    sentXpathMessages: action.data["sentMessages"],
                    receivedXpathMessages: action.data["receivedMessages"],
                    message: reduxStoreMessages.matched_messages_msg
                });
            }
            else {
                rules = JSON.parse(JSON.stringify(state.ruleTable));
                rules = rules.map(d => {
                    let a = Object.assign({}, d);
                    if (a.index !== action.data["ruleIndex"]) return a;
                    a.rulePanelState.quantifierXPath = action.data["quantifierXPath"];
                    a.rulePanelState.constraintXPath = action.data["constraintXPath"];
                    return a;
                });
                return Object.assign({}, state, {
                    message: reduxStoreMessages.matched_messages_msg,
                    ruleTable: rules,
                    sentXpathMessages: action.data["sentMessages"],
                    receivedXpathMessages: action.data["receivedMessages"],
                });
            }

        /*
          {
           type: "UPDATE_RULE_STATE",
           data: {ruleIndex: *, updatedRuleState: *}
          }
         */
        case reduxStoreActions.action_update_rule_state:
            if (action.data["ruleIndex"] !== constantRuleIndex.newRuleIndex &&
                action.data["ruleIndex"] !== constantRuleIndex.minedRuleIndex)
                copiedState.ruleTable = copiedState.ruleTable.map(rule => {
                    if (rule.index !== action.data["ruleIndex"]) return rule;
                    rule.rulePanelState = action.data["updatedRuleState"];
                    return rule;
                });
            else if (action.data["ruleIndex"] === constantRuleIndex.newRuleIndex)
                copiedState.rulePadState = action.data["updatedRuleState"];

            return Object.assign({}, state, {
                ruleTable: copiedState.ruleTable,
                rulePadState: copiedState.rulePadState,
                message: reduxStoreMessages.change_gui_element_msg
            });

        case reduxStoreActions.action_change_autocomplete_text:
            if (action.data["ruleIndex"] === constantRuleIndex.newRuleIndex) {
                return Object.assign({}, state, {
                    rulePadState: {
                        ...state.rulePadState,
                        autoCompleteArray: action.data["newAutoCompleteArray"]
                    },
                    message: reduxStoreMessages.change_autocomplete_text_msg
                });
            }
            else {
                let rules = JSON.parse(JSON.stringify(state.ruleTable));
                rules = rules.map(d => {
                    if (d.index !== action.data["ruleIndex"]) return d;
                    return Object.assign({}, d, {
                        rulePanelState: {
                            ...d.rulePanelState,
                            autoCompleteArray: action.data["newAutoCompleteArray"]
                        }
                    });
                });
                return Object.assign({}, state, {
                    ruleTable: rules,
                    message: reduxStoreMessages.change_autocomplete_text_msg
                });
            }

        case reduxStoreActions.action_update_xpath:
            if (action.data["ruleIndex"] === constantRuleIndex.newRuleIndex) {
                return Object.assign({}, state, {
                    rulePadState: {
                        ...state.rulePadState,
                        quantifierXPath: action.data["quantifierXPath"],
                        constraintXPath: action.data["constraintXPath"]
                    },
                    message: reduxStoreMessages.update_xpath_msg
                });
            }
            else {
                let rules = JSON.parse(JSON.stringify(state.ruleTable));
                rules = rules.map(d => {
                    let a = Object.assign({}, d);
                    if (a.index !== action.data["ruleIndex"]) return a;
                    a.rulePanelState.quantifierXPath = action.data["quantifierXPath"];
                    a.rulePanelState.constraintXPath = action.data["constraintXPath"];
                    return a;
                });
                return Object.assign({}, state, {
                    message: reduxStoreMessages.update_xpath_msg,
                    ruleTable: rules
                });
            }

            /*
                Mining Rules
             */

        case reduxStoreActions.action_update_feature_metadata:
            return Object.assign({}, state, {
                message: reduxStoreMessages.update_feature_metadata_msg,
                minedRulesState: {
                    ...state.minedRulesState,
                    featureMetaData: action.data["featureMetaData"],
                    minedRules: []
                }
            });

        case reduxStoreActions.action_update_grouping_metadata:
            return Object.assign({}, state, {
                message: reduxStoreMessages.update_grouping_metadata_msg,
                minedRulesState: {
                    ...state.minedRulesState,
                    groupingMetaData: action.data["groupingMetaData"],
                    minedRules: []
                }
            });

        case reduxStoreActions.action_update_focused_element_data:
            return Object.assign({}, state, {
                message: reduxStoreMessages.update_focused_element_identifiers,
                minedRulesState: {
                    ...state.minedRulesState,
                    focusedElementData: action.data["focusedElementData"],
                    selectedAlgorithm: allAlgorithms.CHUI_MINER_DEFAULT, // reset the algorithm
                }
            });

        case reduxStoreActions.action_update_doi_information:
            return Object.assign({}, state, {
                message: reduxStoreMessages.update_doi_information_msg,
                minedRulesState: {
                    ...state.minedRulesState,
                    doiInformation: action.data["doiInformation"]
                }
            });

        case reduxStoreActions.action_request_mine_rules_for_element:
            return Object.assign({}, state, {
                message: reduxStoreMessages.request_mine_rules_for_element_msg,
            });

        case reduxStoreActions.action_update_mined_rules:
            return Object.assign({}, state, {
                message: reduxStoreMessages.update_mined_rules_msg,
                minedRulesState: {
                    // ...JSON.parse(JSON.stringify(state.minedRulesState)),
                    ...state.minedRulesState,
                    minedRules: action.data["minedRules"]
                }
            });

        case reduxStoreActions.action_update_update_selected_algorithm:
            return Object.assign({}, state, {
               message: reduxStoreMessages.update_selected_algorithm_msg,
               minedRulesState: {
                   ...state.minedRulesState,
                   selectedAlgorithm: action.data["selectedAlgorithm"]
               }
            });

        default:
            return Object.assign({}, state);
    }
};

export default reducer;