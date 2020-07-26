import {initial_state, default_rulePanelState} from "./initialState";
import {generateTreeForElement} from "./ui/RulePad/rulePadGraphicalEditor/graphicalEditorConstants";
import {reduxStoreActions, reduxStoreMessages} from "./reduxStoreConstants";


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
            if (action.data["ruleIndex"] !== -1) {
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
            else
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

        case reduxStoreActions.action_change_edit_mode:
            if (action.data["ruleIndex"] !== -1) {
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
            if (action.data["ruleIndex"] !== -1) {
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
            else
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

        case reduxStoreActions.action_send_expr_stmt_xml:
            return Object.assign({}, state, {
                rulePadState: {
                    ...state.rulePadState,
                    sentMessages: state.rulePadState.sentMessages.concat([action.data["codeTextAndID"]])
                },
                message: reduxStoreMessages.send_expr_stmt_xml_msg
            });

        case reduxStoreActions.action_receive_expr_stmt_xml:
            return Object.assign({}, state, {
                rulePadState: {
                    ...state.rulePadState,
                    receivedMessages: state.rulePadState.receivedMessages.concat([action.data["xmlData"]])
                },
                message: reduxStoreMessages.receive_expr_stmt_xml_msg
            });

        case reduxStoreActions.action_matched_messages:
            if (action.data["ruleIndex"] !== -1) {
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
                    rulePadState: {
                        ...state.rulePadState,
                        sentMessages: action.data["sentMessages"],
                        receivedMessages: action.data["receivedMessages"]
                    },
                });
            }
            else
                return Object.assign({}, state, {
                    rulePadState: {
                        ...state.rulePadState,
                        quantifierXPath: action.data["quantifierXPath"],
                        constraintXPath: action.data["constraintXPath"],
                        sentMessages: action.data["sentMessages"],
                        receivedMessages: action.data["receivedMessages"]
                    },
                    message: reduxStoreMessages.matched_messages_msg
                });

        /*
          {
            type: "CHANGE_GUI_ELEMENT",
            ruleIndex: ruleIndex,
            group: group, // quantifier or constraint
            tasks: tasks
          }
        */
        case reduxStoreActions.action_change_gui_element:
            // There can be several jobs.
            // All changes are done on a copy
            action.data["tasks"].forEach(job => {
                switch (job["task"]) {
                    // job = {elementId: "", task: "", value: `${childGroupName}`}
                    case "ADD_EXTRA":
                    case "REMOVE_EXTRA":
                        // general function for adding and removing extra fields
                        let processFunc = (array) => {
                            // for "body" value should be in form of `body,${index}`
                            let childGroup = job["value"].startsWith("body") ? "body" : job["value"];

                            let filterFunction = (array, id) => {
                                if (array.guiElements[id].activeElement)
                                    return true;
                                delete array.guiElements[id];

                                // if the newly removed element is a selected element, un-select it
                                if (array.guiTree.selectedElementID === id)
                                    array.guiTree.selectedElementID = "";

                                return false;
                            };

                            let childrenGroup = array.guiTree[job["elementId"]].children[childGroup];
                            if (job["value"].startsWith("body")) childrenGroup = array.guiTree[job["elementId"]].children[childGroup][+(job["value"].split(",")[1])];

                            let newElementConditionName = array.guiElements[childrenGroup[0]].conditionName;
                            if (job["task"] === "REMOVE_EXTRA") {
                                // remove all inactive elements
                                if (job["value"].startsWith("body"))
                                    array.guiTree[job["elementId"]].children[childGroup][+(job["value"].split(",")[1])] =
                                        array.guiTree[job["elementId"]].children[childGroup][+(job["value"].split(",")[1])].filter((id) => filterFunction(array, id));
                                else
                                    array.guiTree[job["elementId"]].children[childGroup] =
                                        array.guiTree[job["elementId"]].children[childGroup].filter((id) => filterFunction(array, id));
                            }
                            let newElementId = Math.floor(new Date().getTime() / 10).toString();
                            let newElementsData = generateTreeForElement(newElementConditionName, newElementId, job["elementId"]);
                            // updating the existing tree
                            if (job["value"].startsWith("body"))
                                array.guiTree[job["elementId"]].children[childGroup][+(job["value"].split(",")[1])].push(newElementId);
                            else
                                array.guiTree[job["elementId"]].children[childGroup].push(newElementId);
                            // adding new trees
                            newElementsData.trees.forEach(tree => array.guiTree[tree.id] = tree.node);
                            // adding new elements
                            newElementsData.elements.forEach(elem => array.guiElements[elem.id] = elem.node);

                            return array;
                        };


                        if (action.data["ruleIndex"] !== -1)
                            copiedState.ruleTable = copiedState.ruleTable.map(rule => {
                                if (rule.index !== action.data["ruleIndex"]) return rule;
                                rule.rulePanelState.graphicalEditorState = processFunc(rule.rulePanelState.graphicalEditorState);
                                return rule;
                            });
                        else
                            copiedState.rulePadState.graphicalEditorState = processFunc(copiedState.rulePadState.graphicalEditorState);

                        break;

                    // job = {elementId: "", task: "UPDATE_ELEMENT", value: {props: newValues}}
                    case "UPDATE_ELEMENT":
                        if (action.data["ruleIndex"] !== -1) {
                            copiedState.ruleTable = copiedState.ruleTable.map(rule => {
                                if (rule.index !== action.data["ruleIndex"]) return rule;
                                rule.rulePanelState.graphicalEditorState.guiElements[job["elementId"]] = {
                                    ...rule.rulePanelState.graphicalEditorState.guiElements[job["elementId"]],
                                    ...job["value"]
                                };

                                return rule;
                            });
                        }
                        else {
                            copiedState.rulePadState.graphicalEditorState.guiElements[job["elementId"]] = {
                                ...copiedState.rulePadState.graphicalEditorState.guiElements[job["elementId"]],
                                ...job["value"]
                            };
                        }
                        break;

                    // job = {elementId: "", task: "REMOVE_ELEMENT", value: {parentId: ""}}
                    case "REMOVE_ELEMENT":

                        // search in parent children and remove elementId
                        // toBeDeletedIDs=[] to be removed from ...graphicalEditorState.${group}.guiElements and ....graphicalEditorState["quantifier/constraint"]
                        // build a stack=[elementId] for going through tree of elementId
                        // while stack.size()>0
                        //  pop one newId, add it to storeIDs
                        //  add ids of children of the popped id tree to the stack
                        // delete toBeDeletedIDs from ...graphicalEditorState.${group}.guiElements and ....graphicalEditorState["quantifier/constraint"]
                        let processRemoveElement = (array) => {
                            let parentTree = array.guiTree[job["value"]["parentId"]];
                            Object.keys(parentTree.children).forEach(childGroup => {
                                if (childGroup !== "body")
                                    array.guiTree[job["value"]["parentId"]].children[childGroup] = parentTree.children[childGroup].filter(elemId => elemId !== job["elementId"]);
                                else
                                    array.guiTree[job["value"]["parentId"]].children["body"] = parentTree.children["body"].map(subGroup => {
                                        return subGroup.filter(elemId => elemId !== job["elementId"])
                                    });
                            });

                            let toBeDeletedIDs = [], stackIDs = [job["elementId"]];
                            while (stackIDs.length > 0) {
                                let tempId = stackIDs.pop();
                                toBeDeletedIDs.push(tempId);

                                let tempTree = array.guiTree[tempId];
                                let childrenIds = [];

                                Object.keys(tempTree.children).forEach(childGroup => {
                                    if (childGroup !== "body") childrenIds = childrenIds.concat(tempTree.children[childGroup]);
                                    else
                                        tempTree.children["body"].forEach(subGroup => {
                                            childrenIds = childrenIds.concat(subGroup)
                                        });
                                });
                                stackIDs = stackIDs.concat(childrenIds);
                            }

                            stackIDs.forEach(elemId => {
                                delete array.guiElements[elemId];
                                delete array.guiTree[elemId];

                                // if the newly removed element is a selected element, un-select it
                                if (array.guiTree.selectedElementID === elemId)
                                    array.guiTree.selectedElementID = "";
                            });

                            return array;
                        };

                        if (action.data["ruleIndex"] !== -1)
                            copiedState.ruleTable = copiedState.ruleTable.map(rule => {
                                if (rule.index !== action.data["ruleIndex"]) return rule;
                                rule.rulePanelState.graphicalEditorState = processRemoveElement(rule.rulePanelState.graphicalEditorState);
                                return rule;
                            });
                        else
                            copiedState.rulePadState.graphicalEditorState = processRemoveElement(copiedState.rulePadState.graphicalEditorState);

                        break;

                    // job = {elementId: "", task: "SELECT_ELEMENT", value: true/false}
                    case "SELECT_ELEMENT":
                        let processSelectElement = (array) => {
                            let oldSelectedElementId = array.guiTree.selectedElementID;
                            // if selectedElement exists update its state as well
                            if (array.guiElements.hasOwnProperty(oldSelectedElementId))
                                array.guiElements[oldSelectedElementId] = {
                                    ...array.guiElements[oldSelectedElementId],
                                    selectedElement: !job["value"]
                                };
                            array.guiTree.selectedElementID = job["elementId"];
                            if (array.guiElements.hasOwnProperty(job["elementId"]))
                                array.guiElements[job["elementId"]] = {
                                    ...array.guiElements[job["elementId"]],
                                    selectedElement: job["value"]
                                };
                            return array;
                        };

                        if (action.data["ruleIndex"] !== -1) {
                            copiedState.ruleTable = copiedState.ruleTable.map(rule => {
                                if (rule.index !== action.data["ruleIndex"]) return rule;
                                rule.rulePanelState.graphicalEditorState = processSelectElement(rule.rulePanelState.graphicalEditorState);
                                return rule;
                            });
                        }
                        else
                            copiedState.rulePadState.graphicalEditorState = processSelectElement(copiedState.rulePadState.graphicalEditorState);

                        break;

                    default:
                        break;
                }
            });

            return Object.assign({}, state, {
                ruleTable: copiedState.ruleTable,
                rulePadState: copiedState.rulePadState,
                message: reduxStoreMessages.change_gui_element_msg
            });

        case reduxStoreActions.action_change_autocomplete_text:
            if (action.data["ruleIndex"] !== -1) {
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
            else
                return Object.assign({}, state, {
                    rulePadState: {
                        ...state.rulePadState,
                        autoCompleteArray: action.data["newAutoCompleteArray"]
                    },
                    message: reduxStoreMessages.change_autocomplete_text_msg
                });

        case reduxStoreActions.action_update_xpath:
            if (action.data["ruleIndex"] !== -1) {
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
            else
                return Object.assign({}, state, {
                    rulePadState: {
                        ...state.rulePadState,
                        quantifierXPath: action.data["quantifierXPath"],
                        constraintXPath: action.data["constraintXPath"]
                    },
                    message: reduxStoreMessages.update_xpath_msg
                });

            /*
                Mining Rules
             */

        case reduxStoreActions.action_update_metadata:
            return Object.assign({}, state, {
                message: reduxStoreMessages.update_metadata_msg,
                minedRulesState: {
                    metaData: action.data["metaData"],
                    minedRules: []
                }
            });

        case reduxStoreActions.action_update_mined_rules:
            return Object.assign({}, state, {
                message: reduxStoreMessages.update_mined_rules_msg,
                minedRulesState: {
                    ...JSON.parse(JSON.stringify(state.minedRulesState)),
                    minedRules: action.data["minedRules"]
                }
            });

        case reduxStoreActions.action_update_feature_selection :
            return Object.assign({}, state, {
                message: reduxStoreMessages.update_feature_selection_msg,
                featureSelection: {
                    filePath: action.data["filePath"],
                    startOffset: action.data["startOffset"],
                    endOffset: action.data["endOffset"],
                    startLineOffset: action.data["startLineOffset"],
                    lineNumber: action.data["lineNumber"],
                    lineText: action.data["lineText"],
                    selectedText: action.data["selectedText"],
                    xpath: action.data["xpath"],
                    modifiedSelectedText: action.data["modifiedSelectedText"],
                    idMap: action.data["idMap"],
                    displayTextArray: action.data["displayTextArray"]
                }
            });

        case reduxStoreActions.action_reset_feature_selection:
            return Object.assign({}, state, {
                message: reduxStoreMessages.reset_feature_selection_msg,
                featureSelection: {
                    ...JSON.parse(JSON.stringify(initial_state.featureSelection))
                }
            });

        case reduxStoreActions.action_save_feature_selection:
            return Object.assign({}, state, {
                message: reduxStoreMessages.save_feature_selection_msg,
                featureSelection: {
                    ...JSON.parse(JSON.stringify(initial_state.featureSelection))
                },
                doiInformation: {
                    ...state.doiInformation,
                    customFeatures: state.doiInformation.customFeatures.concat([{
                        featureDescription: action.data["featureDescription"],
                        featureXpath: action.data["featureXpath"]
                    }])
                }
            });

        case reduxStoreActions.action_dangerous_mined_rules:
            return Object.assign({}, state, {
                message: reduxStoreMessages.update_mined_rules_msg,
                minedRulesState: {
                    metaData: action.data["metaData"],
                    minedRules: action.data["minedRules"]
                }
            });

        case reduxStoreActions.action_update_doi_information:
            return Object.assign({}, state, {
                message: reduxStoreMessages.update_doi_information_msg,
                doiInformation: {
                    ...state.doiInformation,
                    visitedFiles: action.data["visitedFiles"],
                    searchHistory: action.data["searchHistory"],
                    visitedElements: action.data["visitedElements"]
                }
            });

        default:
            return Object.assign({}, state);
    }
};

export default reducer;