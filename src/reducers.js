const default_state = {
    ws: null,
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
    newOrEditRule: {
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
                key: "class",
                value: "",
                target: "follows",
                xpath: "src:class",
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

/**
 *
 * @param state
 * @param action
 * @returns {*} new state
 */
const reducer = (state = default_state, action) => {
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
            return Object.assign({}, state, {ruleTable: action["value"], message: "UPDATE_RULE_TABLE"});

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
            return Object.assign({}, state, {ignoreFile: action["value"], message: "IGNORE_FILE"});

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

        case "EDIT_NEW_RULE_FORM": //action["value"]
            return Object.assign({}, state, {
                newOrEditRule: {
                    ...state.newOrEditRule,
                    ...action["value"]
                }
            });

        case "EDIT_NEW_RULE_GRAMMAR_GUI_DATA":
            return Object.assign({}, state, {
                newOrEditRule: {
                    ...state.newOrEditRule,
                    ...action["value"]
                }
            });

        case "RECEIVE_GUI_TREE":
            return Object.assign({}, state, {
                newOrEditRule: {
                    ...state.newOrEditRule,
                    guiState: {
                        ...state.newOrEditRule.guiState,
                        ...action["value"]
                    }
                }
            });

        default:
            return state;
    }
};

export default reducer;