const default_state = {
    ws: null,

    /*
    index: 1545798262
    title: ""
    description: ""
    tags: []
    grammar: ""
    ruleType: {constraint: "NONE", checkFor: [], type: "WITHIN"}
    quantifier: {detail: "", command: ""}
    constraint: {detail: "", command: ""}
    rulePanelState: {
        editMode: false
        title: ""
        description: ""
        ruleTags: []
        folderConstraint: ""
        filesFolders: []
        constraintXPath: ""
        quantifierXPath: ""
        autoCompleteText: ""
        activeTab: 0
        guiState: {activeTab: "quantifier", quantifier: {…}, constraint: {…}, ruleType: ""}
    }
    xPathQueryResult: []
     */
    ruleTable: [],
    tagTable: [],
    xml: [],
    hash: ["index"],
    ignoreFile: false,
    message: "init",
    filePath: "",
    hashManager: {
        history: ["#/index"],
        clicked: false,
        activeHash: 0,
        forwardDisable: "disabled",
        backDisable: "disabled"
    },
    // used for new rule form
    newOrEditRule: {
        title: "",
        description: "",
        ruleTags: [],
        folderConstraint: "",
        filesFolders: [],

        autoCompleteText: "",
        quantifierXPath: "", // only produced by autoComplete grammar
        constraintXPath: "", // only produced by autoComplete grammar
        sentMessages: [],
        receivedMessages: [],

        guiState: {
            activeTab: "quantifier",
            quantifier: {
                key: "class",
                value: "",
                target: "follows",
                children: {
                    "top": [],
                    "before": [],
                    "before_1": [],
                    "before_2": [],
                    "after": [],
                    "after_1": [],
                    "after_2": [],
                    "within": [],
                    "child": {}
                }
            },
            constraint: {
                key: "",
                value: "",
                target: "follows",
                children: {
                    "top": [],
                    "before": [],
                    "before_1": [],
                    "before_2": [],
                    "after": [],
                    "after_1": [],
                    "after_2": [],
                    "within": [],
                    "child": {}
                }
            },
            ruleType: "" // "Must" or "MustBeEqualTo"
        }
    }

};

// used for editing existing rule
const default_rulePanelState = {
    editMode: false, // default must be false unless a new rule is being generated: !!props["newRule"]

    title: "",
    description: "",
    ruleTags: [],
    folderConstraint: "",
    filesFolders: [],

    autoCompleteText: "",
    quantifierXPath: "", // only produced by autoComplete grammar
    constraintXPath: "", // only produced by autoComplete grammar

    guiState: {
        activeTab: "quantifier",
        quantifier: {
            key: "class",
            value: "",
            target: "follows",
            children: {
                "top": [],
                "before": [],
                "before_1": [],
                "before_2": [],
                "after": [],
                "after_1": [],
                "after_2": [],
                "within": [],
                "child": {}
            }
        },
        constraint: {
            key: "",
            value: "",
            target: "follows",
            children: {
                "top": [],
                "before": [],
                "before_1": [],
                "before_2": [],
                "after": [],
                "after_1": [],
                "after_2": [],
                "within": [],
                "child": {}
            }
        },
        ruleType: "" // "Must" or "MustBeEqualTo"
    }
};

/**
 * using default_state as a default value surprisingly changes its value
 * Any incoming variable through arguments must be cloned and mutated,
 * Direct mutation doesn't work properly (UPDATE_RULE_TABLE)
 * @param state
 * @param action
 * @returns {*} new state
 */
const reducer = (state = JSON.parse(JSON.stringify(default_state)), action) => {
    // console.log('reducer running', action);
    // let tempRuleTable = [];

    switch (action.type) {
        case "HASH":
            if (!state.hashManager.clicked) {
                return Object.assign({}, state, {
                    hash: action["value"],
                    message: "HASH",
                    hashManager: {
                        history: [...state.hashManager.history, "#/" + action["value"].join("/")],
                        clicked: false,
                        activeHash: state.hashManager.activeHash + 1,
                        forwardDisable: "disabled",
                        backDisable: state.hashManager.activeHash === 0
                    },
                    individualRule: {
                        title: "",
                        description: ""
                    }
                });
            }
            return Object.assign({}, state, {
                hash: action["value"],
                message: "HASH",
                hashManager: {
                    history: state.hashManager.history,
                    clicked: false,
                    activeHash: state.hashManager.activeHash,
                    forwardDisable: state.hashManager.forwardDisable,
                    backDisable: state.hashManager.backDisable
                },
                individualRule: {
                    title: "",
                    description: ""
                }
            });

        case "NEW_WS":
            return Object.assign({}, state, {ws: action["value"], message: "NEW_WS"});

        case "UPDATE_TAG_TABLE":
            return Object.assign({}, state, {tagTable: action["value"], message: "UPDATE_TAG_TABLE"});

        case "UPDATE_RULE_TABLE":
            let rules = JSON.parse(JSON.stringify(action["ruleTable"]));
            rules = rules.map(d => {
                let a =  Object.assign({}, d);
                return Object.assign({}, d, {
                    rulePanelState: {
                        ...default_rulePanelState,
                        title: a.title,
                        description: a.description,
                        ruleTags: a.tags,
                        folderConstraint: a.ruleType.constraint,
                        filesFolders: a.ruleType.checkFor,
                        quantifierXPath: a.quantifier.command,
                        constraintXPath: a.constraint.command,
                        autoCompleteText: a.grammar
                    }
                });
            });
            return Object.assign({}, state, {
                ruleTable: rules,
                message: "UPDATE_RULE_TABLE"
            });

        case "UPDATE_RULE":
            return Object.assign({}, state, {
                // ruleTable: tempRuleTable,
                message: "UPDATE_RULE"
            });

        case "SUBMIT_NEW_RULE":
            return Object.assign({}, state, {
                message: "NEW_RULE"
            });

        case "SUBMIT_NEW_TAG":
            return Object.assign({}, state, {
                message: "NEW_TAG"
            });

        case "IGNORE_FILE":
            return Object.assign({}, state, {ignoreFile: action["shouldIgnore"], message: "IGNORE_FILE"});

        case "CLICKED_ON_FORWARD":
            return Object.assign({}, state, {
                hashManager: {
                    history: state.hashManager.history,
                    clicked: true,
                    activeHash: state.hashManager.activeHash + 1,
                    forwardDisable: state.hashManager.activeHash === state.hashManager.history.length - 2 ? "disabled" : "",
                    backDisable: ""
                }
            });

        case "CLICKED_ON_BACK":
            return Object.assign({}, state, {
                hashManager: {
                    history: state.hashManager.history,
                    clicked: true,
                    activeHash: state.hashManager.activeHash - 1,
                    forwardDisable: "",
                    backDisable: state.hashManager.activeHash === 1 ? "disabled" : ""
                }
            });

        case "FILE_PATH":
            if (state.ignoreFile) return Object.assign({}, state, {message: "FILE_PATH_UPDATED"});
            return Object.assign({}, state, {filePath: action["value"], message: "FILE_PATH_UPDATED"});

        case "CLEAR_NEW_RULE_FORM":
            return Object.assign({}, state, {
                newOrEditRule: {
                    ...default_state.newOrEditRule
                },
                message: "CLEAR_NEW_RULE_FORM"
            });

        case "EDIT_RULE_FORM":
            if (action["ruleIndex"] !== -1) {
                let rules = JSON.parse(JSON.stringify(state.ruleTable));
                rules = rules.map(d => {
                    let a = Object.assign({}, d);
                    if (a.index !== action["ruleIndex"]) return a;
                    a.rulePanelState.title = action["title"];
                    a.rulePanelState.description = action["description"];
                    a.rulePanelState.tags = action["ruleTags"];
                    a.rulePanelState.folderConstraint = action["folderConstraint"];
                    a.rulePanelState.filesFolders = action["filesFolders"];
                    return a;
                });
                return Object.assign({}, state, {
                    ruleTable: rules
                });
            }
            else
                return Object.assign({}, state, {
                    newOrEditRule: {
                        ...state.newOrEditRule,
                        title: action["title"],
                        description: action["description"],
                        ruleTags: action["ruleTags"],
                        folderConstraint: action["folderConstraint"],
                        filesFolders: action["filesFolders"]
                    }
                });

        case "CHANGE_EDIT_MODE":
            if (action["ruleIndex"] !== -1) {
                // deep copy, slice(0) and array.map() doesn't work
                let rules = JSON.parse(JSON.stringify(state.ruleTable));
                rules = rules.map(d => {
                    let a = Object.assign({}, d);
                    if (a.index === action["ruleIndex"]) {
                        a.rulePanelState.editMode = action["newEditMode"];

                        // reset fields of the form after cancel editing
                        if (!action["newEditMode"])
                            a.rulePanelState = {
                                ...default_rulePanelState,
                                title: d.title,
                                description: d.description,
                                ruleTags: d.tags,
                                folderConstraint: d.ruleType.constraint,
                                filesFolders: d.ruleType.checkFor,
                                quantifierXPath: d.quantifier.command,
                                constraintXPath: d.constraint.command,
                                autoCompleteText: d.grammar
                            }
                    }
                    return a;
                });
                return Object.assign({}, state, {
                    ruleTable: rules
                });
            }
            else
                return state;

        case "RECEIVE_GUI_TREE":
            if (action["ruleIndex"] !== -1) {
                let rules = JSON.parse(JSON.stringify(state.ruleTable));
                rules = rules.map(d => {
                    let a = Object.assign({}, d);
                    if (a.index !== action["ruleIndex"]) return a;
                    a.rulePanelState.quantifierXPath = action["quantifierXPath"];
                    a.rulePanelState.constraintXPath = action["constraintXPath"];
                    a.rulePanelState.autoCompleteText = action["autoCompleteText"];
                    a.rulePanelState.guiState = {
                        ...a.rulePanelState.guiState,
                        ...action["newTreeData"]
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
                        quantifierXPath: action["quantifierXPath"],
                        constraintXPath: action["constraintXPath"],
                        autoCompleteText: action["autoCompleteText"],
                        guiState: {
                            ...state.newOrEditRule.guiState,
                            ...action["newTreeData"]
                        }
                    }
                });

        case "SEND_EXPR_STMT_XML":
            return Object.assign({}, state, {
                newOrEditRule: {
                    ...state.newOrEditRule,
                    sentMessages: state.newOrEditRule.sentMessages.concat([action["codeTextAndID"]])
                },
                message: "SEND_EXPR_STMT_XML"
            });

        case "RECEIVE_EXPR_STMT_XML":
            return Object.assign({}, state, {
                newOrEditRule: {
                    ...state.newOrEditRule,
                    receivedMessages: state.newOrEditRule.receivedMessages.concat([action["xmlData"]])
                },
                message: "RECEIVE_EXPR_STMT_XML"
            });

        case "MATCHED_MESSAGES":
            if (action["ruleIndex"] !== -1) {
                let rules = JSON.parse(JSON.stringify(state.ruleTable));
                rules = rules.map(d => {
                    let a = Object.assign({}, d);
                    if (a.index !== action["ruleIndex"]) return a;
                    a.rulePanelState.quantifierXPath = action["quantifierXPath"];
                    a.rulePanelState.constraintXPath = action["constraintXPath"];
                    return a;
                });
                return Object.assign({}, state, {
                    message: "MATCHED_MESSAGES",
                    ruleTable: rules,
                    newOrEditRule: {
                        ...state.newOrEditRule,
                        sentMessages: action["sentMessages"],
                        receivedMessages: action["receivedMessages"]
                    },
                });
            }
            else
                return Object.assign({}, state, {
                    newOrEditRule: {
                        ...state.newOrEditRule,
                        quantifierXPath: action["quantifierXPath"],
                        constraintXPath: action["constraintXPath"],
                        sentMessages: action["sentMessages"],
                        receivedMessages: action["receivedMessages"]
                    },
                    message: "MATCHED_MESSAGES"
                });

        case "CLEAR_MESSAGE_LISTS":
            return Object.assign({}, state, {
                newOrEditRule: {
                    ...state.newOrEditRule,
                    sentMessages: [],
                    receivedMessages: []
                },
                message: "CLEAR_MESSAGE_LISTS"
            });

        default:
            return state;
    }
};

export default reducer;