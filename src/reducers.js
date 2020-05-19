import {initial_state, default_rulePanelState} from "./initialState";
import {generateTreeForElement} from "./ui/rulePadGraphicalEditor/graphicalEditorConstants";


/*

    List of messages:


    HASH
    NEW_WS
    UPDATE_XML_FILES
    UPDATE_TAG_TABLE
    UPDATE_RULE_TABLE
    UPDATE_RULE

    NEW_RULE
    NEW_TAG

    HIERARCHY_DATA

    IGNORE_FILE

    UPDATE_DISPLAY_EDIT_TUTORIAL

    FILE_PATH_UPDATED

    CLICKED_ON_FORWARD
    CLICKED_ON_BACK

    CLEAR_NEW_RULE_FORM
    EDIT_RULE_FORM
    CHANGE_EDIT_MODE

    RECEIVE_GUI_TREE

    SEND_EXPR_STMT_XML
    RECEIVE_EXPR_STMT_XML
    MATCHED_MESSAGES

    CHANGE_GUI_ELEMENT
        ADD_EXTRA
        REMOVE_EXTRA
        UPDATE_ELEMENT
        REMOVE_ELEMENT
        SELECT_ELEMENT

    CHANGE_AUTOCOMPLETE_TEXT_FROM_GUI
    UPDATE_XPATHS

    UPDATE_META_DATA
    UPDATE_MINED_RULES

    UPDATE_FEATURE_SELECTION
    DANGEROUS_MINED_RULES

    RESET_FEATURE_SELECTION
    SAVE_FEATURE_SELECTION

 */



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

    switch (action.type) {
        case "HASH":
            if (!state.hashManager.clicked) {
                return Object.assign({}, state, {
                    hash: action.data["hash"],
                    message: "HASH",
                    hashManager: {
                        history: [...state.hashManager.history, "#/" + action.data["hash"].join("/")],
                        clicked: false,
                        activeHash: state.hashManager.activeHash + 1,
                        forwardDisable: "disabled",
                        backDisable: state.hashManager.activeHash === 0 ? "disabled" : ""
                    }
                });
            }
            return Object.assign({}, state, {
                hash: action.data["hash"],
                message: "HASH",
                hashManager: {
                    history: state.hashManager.history,
                    clicked: false,
                    activeHash: state.hashManager.activeHash,
                    forwardDisable: state.hashManager.forwardDisable,
                    backDisable: state.hashManager.backDisable
                }
            });

        case "NEW_WS":
            return Object.assign({}, state, {ws: action.data["ws"], message: "NEW_WS"});

        case "UPDATE_XML_FILES":
            return Object.assign({}, state, {xmlFiles: action.data["xmlFiles"], message: "UPDATE_XML_FILES"});

        case "UPDATE_TAG_TABLE":
            return Object.assign({}, state, {tagTable: action.data["tagTable"], message: "UPDATE_TAG_TABLE"});

        case "UPDATE_RULE_TABLE":
            let rules = JSON.parse(JSON.stringify(action.data["ruleTable"]));
            rules = rules.map(rule =>
                Object.assign({}, rule, {
                    rulePanelState: {
                        ...JSON.parse(JSON.stringify(default_rulePanelState)),
                        editMode: false,
                        title: rule.title,
                        description: rule.description,
                        ruleTags: rule.tags,
                        folderConstraint: rule.ruleType.constraint,
                        filesFolders: rule.ruleType.checkFor,
                        quantifierXPath: rule.quantifier.command,
                        constraintXPath: rule.constraint.command,
                        // autoCompleteText: rule.grammar,
                        autoCompleteArray: rule.grammar && rule.grammar !== "" ? rule.grammar.split(" ").map(word => {
                            return {id: "", text: word}
                        }) : []
                    }
                })
            );
            return Object.assign({}, state, {
                ruleTable: rules,
                message: "UPDATE_RULE_TABLE"
            });

        case "UPDATE_RULE":
            return Object.assign({}, state, {
                message: "UPDATE_RULE"
            });

        case "SUBMIT_NEW_RULE":
            return Object.assign({}, state, {
                newOrEditRule: {
                    ...JSON.parse(JSON.stringify(initial_state.newOrEditRule)),
                    isEditMode: false
                },
                message: "NEW_RULE"
            });

        case "SUBMIT_NEW_TAG":
            return Object.assign({}, state, {
                message: "NEW_TAG"
            });

        case "HIERARCHY_DATA":
            return Object.assign({}, state, {
                projectHierarchy: action.data["hierarchyData"],
                message: "HIERARCHY_DATA"
            });

        /*
         file handling
          */

        case "IGNORE_FILE":
            let editCount = state.ruleTable.reduce((count, element) => count + element.rulePanelState.editMode ? 1 : 0, 0);
            if (state.newOrEditRule.isEditMode || editCount > 0) return Object.assign({}, state);
            return Object.assign({}, state, {ignoreFile: action.data["shouldIgnore"], message: "IGNORE_FILE"});

        case "UPDATE_DISPLAY_EDIT_TUTORIAL":
            return Object.assign({}, state, {
                displayEditRuleTutorial: action.data["shouldDisplay"],
                message: "UPDATE_DISPLAY_EDIT_TUTORIAL"
            });

        case "FILE_PATH":
            if (state.ignoreFile) return Object.assign({}, state, {message: "FILE_PATH_UPDATED"});
            return Object.assign({}, state, {filePath: action.data["filePath"], message: "FILE_PATH_UPDATED"});

        /*
         nav-bar navigation
          */

        case "CLICKED_ON_FORWARD":
            return Object.assign({}, state, {
                hashManager: {
                    history: state.hashManager.history,
                    clicked: true,
                    activeHash: state.hashManager.activeHash + 1,
                    forwardDisable: state.hashManager.activeHash === state.hashManager.history.length - 2 ? "disabled" : "",
                    backDisable: ""
                },
                message: "CLICKED_ON_FORWARD"
            });

        case "CLICKED_ON_BACK":
            return Object.assign({}, state, {
                hashManager: {
                    history: state.hashManager.history,
                    clicked: true,
                    activeHash: state.hashManager.activeHash - 1,
                    forwardDisable: "",
                    backDisable: state.hashManager.activeHash === 1 ? "disabled" : ""
                },
                message: "CLICKED_ON_BACK"
            });

        /*
            RulePad
         */

        case "CLEAR_NEW_RULE_FORM":
            return Object.assign({}, state, {
                newOrEditRule: {
                    ...JSON.parse(JSON.stringify(initial_state.newOrEditRule)),
                    isEditMode: true
                },
                message: "CLEAR_NEW_RULE_FORM"
            });

        case "EDIT_RULE_FORM":
            if (action.data["ruleIndex"] !== -1) {
                let rules = JSON.parse(JSON.stringify(state.ruleTable));
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
                    message: "EDIT_RULE_FORM"
                });
            }
            else
                return Object.assign({}, state, {
                    newOrEditRule: {
                        ...state.newOrEditRule,
                        title: action.data["title"],
                        description: action.data["description"],
                        ruleTags: action.data["ruleTags"],
                        folderConstraint: action.data["folderConstraint"],
                        filesFolders: action.data["filesFolders"]
                    },
                    message: "EDIT_RULE_FORM"
                });

        case "CHANGE_EDIT_MODE":
            if (action.data["ruleIndex"] !== -1) {
                let editCount = copiedState.ruleTable.reduce((count, element) => {
                    if (element.index !== action.data["ruleIndex"]) return count + element.rulePanelState.editMode ? 1 : 0;
                    return count + action.data["newEditMode"] ? 1 : 0;
                }, 0);

                let rules = copiedState.ruleTable.map(d => {
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
                                folderConstraint: d.ruleType.constraint,
                                filesFolders: d.ruleType.checkFor,
                                quantifierXPath: d.quantifier.command,
                                constraintXPath: d.constraint.command,
                                // autoCompleteText: d.grammar,
                                autoCompleteArray: d.grammar && d.grammar !== "" ? d.grammar.split(" ").map(word => {
                                    return {id: "", text: word}
                                }) : []
                            }
                    }
                    return a;
                });
                return Object.assign({}, state, {
                    ignoreFile: (state.newOrEditRule.isEditMode || editCount > 0),
                    ruleTable: rules,
                    message: "CHANGE_EDIT_MODE"
                });
            }
            else
                return Object.assign({}, state, {
                    ignoreFile: (action.data["newEditMode"] || state.ruleTable.reduce((count, element) => count + element.rulePanelState.editMode ? 1 : 0, 0) > 0),
                    newOrEditRule: {
                        ...state.newOrEditRule,
                        isEditMode: action.data["newEditMode"]
                    },
                    message: "CHANGE_EDIT_MODE"
                });

        case "RECEIVE_GUI_TREE":
            if (action.data["ruleIndex"] !== -1) {
                let rules = JSON.parse(JSON.stringify(state.ruleTable));
                rules = rules.map(d => {
                    let a = Object.assign({}, d);
                    if (a.index !== action.data["ruleIndex"]) return a;
                    a.rulePanelState.quantifierXPath = action.data["quantifierXPath"];
                    a.rulePanelState.constraintXPath = action.data["constraintXPath"];
                    a.rulePanelState.autoCompleteArray = action.data["autoCompleteArray"];
                    a.rulePanelState.guiState = {
                        ...a.rulePanelState.guiState,
                        ...action.data["newTreeData"]
                    };
                    return a;
                });
                return Object.assign({}, state, {
                    message: "RECEIVE_GUI_TREE",
                    ruleTable: rules
                });
            }
            else
                return Object.assign({}, state, {
                    message: "RECEIVE_GUI_TREE",
                    newOrEditRule: {
                        ...state.newOrEditRule,
                        quantifierXPath: action.data["quantifierXPath"],
                        constraintXPath: action.data["constraintXPath"],
                        autoCompleteArray: action.data["autoCompleteArray"],
                        guiState: {
                            ...state.newOrEditRule.guiState,
                            ...action.data["newTreeData"]
                        }
                    }
                });

        case "SEND_EXPR_STMT_XML":
            return Object.assign({}, state, {
                newOrEditRule: {
                    ...state.newOrEditRule,
                    sentMessages: state.newOrEditRule.sentMessages.concat([action.data["codeTextAndID"]])
                },
                message: "SEND_EXPR_STMT_XML"
            });

        case "RECEIVE_EXPR_STMT_XML":
            return Object.assign({}, state, {
                newOrEditRule: {
                    ...state.newOrEditRule,
                    receivedMessages: state.newOrEditRule.receivedMessages.concat([action.data["xmlData"]])
                },
                message: "RECEIVE_EXPR_STMT_XML"
            });

        case "MATCHED_MESSAGES":
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
                    message: "MATCHED_MESSAGES",
                    ruleTable: rules,
                    newOrEditRule: {
                        ...state.newOrEditRule,
                        sentMessages: action.data["sentMessages"],
                        receivedMessages: action.data["receivedMessages"]
                    },
                });
            }
            else
                return Object.assign({}, state, {
                    newOrEditRule: {
                        ...state.newOrEditRule,
                        quantifierXPath: action.data["quantifierXPath"],
                        constraintXPath: action.data["constraintXPath"],
                        sentMessages: action.data["sentMessages"],
                        receivedMessages: action.data["receivedMessages"]
                    },
                    message: "MATCHED_MESSAGES"
                });

        /*
          {
            type: "CHANGE_GUI_ELEMENT",
            ruleIndex: ruleIndex,
            group: group, // quantifier or constraint
            tasks: tasks
          }
        */
        case "CHANGE_GUI_ELEMENT":
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
                                rule.rulePanelState.guiState = processFunc(rule.rulePanelState.guiState);
                                return rule;
                            });
                        else
                            copiedState.newOrEditRule.guiState = processFunc(copiedState.newOrEditRule.guiState);

                        break;

                    // job = {elementId: "", task: "UPDATE_ELEMENT", value: {props: newValues}}
                    case "UPDATE_ELEMENT":
                        if (action.data["ruleIndex"] !== -1) {
                            copiedState.ruleTable = copiedState.ruleTable.map(rule => {
                                if (rule.index !== action.data["ruleIndex"]) return rule;
                                rule.rulePanelState.guiState.guiElements[job["elementId"]] = {
                                    ...rule.rulePanelState.guiState.guiElements[job["elementId"]],
                                    ...job["value"]
                                };

                                return rule;
                            });
                        }
                        else {
                            copiedState.newOrEditRule.guiState.guiElements[job["elementId"]] = {
                                ...copiedState.newOrEditRule.guiState.guiElements[job["elementId"]],
                                ...job["value"]
                            };
                        }
                        break;

                    // job = {elementId: "", task: "REMOVE_ELEMENT", value: {parentId: ""}}
                    case "REMOVE_ELEMENT":

                        // search in parent children and remove elementId
                        // toBeDeletedIDs=[] to be removed from ...guiState.${group}.guiElements and ....guiState["quantifier/constraint"]
                        // build a stack=[elementId] for going through tree of elementId
                        // while stack.size()>0
                        //  pop one newId, add it to storeIDs
                        //  add ids of children of the popped id tree to the stack
                        // delete toBeDeletedIDs from ...guiState.${group}.guiElements and ....guiState["quantifier/constraint"]
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
                                rule.rulePanelState.guiState = processRemoveElement(rule.rulePanelState.guiState);
                                return rule;
                            });
                        else
                            copiedState.newOrEditRule.guiState = processRemoveElement(copiedState.newOrEditRule.guiState);

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
                                rule.rulePanelState.guiState = processSelectElement(rule.rulePanelState.guiState);
                                return rule;
                            });
                        }
                        else
                            copiedState.newOrEditRule.guiState = processSelectElement(copiedState.newOrEditRule.guiState);

                        break;

                    default:
                        break;
                }
            });

            return Object.assign({}, state, {
                ruleTable: copiedState.ruleTable,
                newOrEditRule: copiedState.newOrEditRule,
                message: "CHANGE_GUI_ELEMENT"
            });

        case "CHANGE_AUTOCOMPLETE_TEXT_FROM_GUI":
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
                    message: "CHANGE_AUTOCOMPLETE_TEXT_FROM_GUI"
                });
            }
            else
                return Object.assign({}, state, {
                    newOrEditRule: {
                        ...state.newOrEditRule,
                        autoCompleteArray: action.data["newAutoCompleteArray"]
                    },
                    message: "CHANGE_AUTOCOMPLETE_TEXT_FROM_GUI"
                });

        case "UPDATE_XPATHS":
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
                    message: "UPDATE_XPATHS",
                    ruleTable: rules
                });
            }
            else
                return Object.assign({}, state, {
                    newOrEditRule: {
                        ...state.newOrEditRule,
                        quantifierXPath: action.data["quantifierXPath"],
                        constraintXPath: action.data["constraintXPath"]
                    },
                    message: "UPDATE_XPATHS"
                });



            /*
                Mining Rules
             */


        case "UPDATE_META_DATA":
            return Object.assign({}, state, {
                message: "UPDATE_META_DATA",
                minedRulesState: {
                    metaData: action.data["metaData"],
                    minedRules: []
                }
            });

        case "UPDATE_MINED_RULES":
            return Object.assign({}, state, {
                message: "UPDATE_MINED_RULES",
                minedRulesState: {
                    ...JSON.parse(JSON.stringify(state.minedRulesState)),
                    minedRules: action.data["minedRules"]
                }
            });

        case "UPDATE_FEATURE_SELECTION" :
            return Object.assign({}, state, {
                message: "UPDATE_FEATURE_SELECTION",
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

        case "DANGEROUS_MINED_RULES":
            return Object.assign({}, state, {
                message: "UPDATE_MINED_RULES",
                minedRulesState: {
                    metaData: action.data["metaData"],
                    minedRules: action.data["minedRules"]
                }
            });

        case "RESET_FEATURE_SELECTION":
            return Object.assign({}, state, {
                message: "RESET_FEATURE_SELECTION",
                featureSelection: {
                    ...JSON.parse(JSON.stringify(initial_state.featureSelection))
                }
            });

        case "SAVE_FEATURE_SELECTION":
            return Object.assign({}, state, {
                message: "SAVE_FEATURE_SELECTION",
                featureSelection: {
                    ...JSON.parse(JSON.stringify(initial_state.featureSelection))
                },
                customFeatures: state.customFeatures.concat([{
                    featureDescription: action.data["featureDescription"],
                    featureXpath: action.data["featureXpath"]
                }])
            });


        default:
            return Object.assign({}, state);
    }
};

export default reducer;