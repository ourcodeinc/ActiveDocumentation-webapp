// action creator

import {reduxStoreActions} from "./reduxStoreConstants";

export const updateLoadingGif = (status) => {
    return {
        type: reduxStoreActions.action_update_loading_gif,
        data: {
            loadingGif: status
        }
    }
};

/**
 * If the hash is #/hash1/hash2
 * @param hash array of hashes ["hash1", "hash2"]
 * @return {{data: {currentHash: array}, type: string}}
 */
export const hashChange = (hash) => {
    return {
        type: reduxStoreActions.action_hash,
        data:
            {currentHash: hash}
    };
};

/**
 * @param ws
 * @return {{data: {ws: *}, type: string}}
 */
export const updateWS = (ws) => {
    return {
        type: reduxStoreActions.action_new_ws,
        data:
            {ws: ws}
    };
};

/**
 * @param xmlFiles
 * @return {{data: {xmlFiles: []}, type: string}}
 */
export const updateXmlFiles = (xmlFiles) => {
    return {
        type: reduxStoreActions.action_update_xml_files,
        data:
            {xmlFiles: xmlFiles}
    }
};

/**
 * @param newTagTable
 * @return {{data: {tagTable: []}, type: string}}
 */
export const updateTagTable = (newTagTable) => {
    return {
        type: reduxStoreActions.action_update_tag_table,
        data: {tagTable: newTagTable}
    };
};

/**
 * @param newRuleTable
 * @return {{data: {ruleTable: []}, type: string}}
 */
export const updateRuleTable = (newRuleTable) => {
    return {
        type: reduxStoreActions.action_update_rule_table,
        data: {ruleTable: newRuleTable}
    };
};


export const updateRule = () => {
    return {type: reduxStoreActions.action_update_rule};
};


export const submitNewRule = () => {
    return {type: reduxStoreActions.action_new_rule}
};


export const submitNewTag = () => {
    return {type: reduxStoreActions.action_new_tag}
};

/**
 * @param hierarchyData
 * @return {{data: {hierarchyData: *}, type: string}}
 */
export const updateProjectHierarchyData = (hierarchyData) => {
    return {
        type: reduxStoreActions.action_hierarchy_data,
        data: {hierarchyData: hierarchyData}
    };
};

/**
 * @param projectPath string
 * @return {{data: {projectPath: string}, type: string}}
 */
export const updateProjectPath = (projectPath) => {
    return {
        type: reduxStoreActions.action_project_path,
        data: {projectPath: projectPath}
    }
};

/*
    file Handling
 */

/**
 *
 * @param shouldIgnore boolean
 * @return {{data: {shouldIgnore: boolean}, type: string}}
 */
export const ignoreFileChange = (shouldIgnore) => {
    return {
        type: reduxStoreActions.action_ignore_file,
        data: {shouldIgnore: shouldIgnore}
    };
};


/**
 * @param filePath
 * @return {{data: {openFilePath: string}, type: string}}
 */
export const updateFilePath = (filePath) => {
    return {
        type: reduxStoreActions.action_file_path_update,
        data: {openFilePath: filePath}
    };
};


/*
    nav-bar navigation
 */


export const clickedOnForward = () => {
    return {type: reduxStoreActions.action_click_forward};
};

export const clickedOnBack = () => {
    return {type: reduxStoreActions.action_click_back};
};

/*
    RulePad
 */


/**
 * @param shouldDisplay boolean
 * @return {{data: {shouldDisplay: boolean}, type: string}}
 */
export const updateDisplayEditTutorial = (shouldDisplay) => {
    return {
        type: reduxStoreActions.action_update_display_edit_tutorial,
        data: {shouldDisplay: shouldDisplay}
    };
};


export const clearNewRuleForm = () => {
    return {type: reduxStoreActions.action_clear_new_rule_form}
};

/**
 * @param ruleIndex number
 * @param title string
 * @param description string
 * @param ruleTags array[string]
 * @param folderConstraint string
 * @param filesFolders array[string]
 * @return {{data: {ruleIndex: *, ruleTags: *, filesFolders: *, description: *, title: *, folderConstraint: *}, type: string}}
 */
export const editRuleForm = (ruleIndex, title, description, ruleTags, folderConstraint, filesFolders) => {
    return {
        type: reduxStoreActions.action_edit_rule_form,
        data: {
            ruleIndex: ruleIndex,
            title: title,
            description: description,
            ruleTags: ruleTags,
            folderConstraint: folderConstraint,
            filesFolders: filesFolders
        }
    }
};

/**
 * @param ruleIndex number
 * @param newEditMode boolean
 * @return {{data: {ruleIndex: *, newEditMode: *}, type: string}}
 */
export const changeEditMode = (ruleIndex, newEditMode) => {
    return {
        type: reduxStoreActions.action_change_edit_mode,
        data: {ruleIndex: ruleIndex, newEditMode: newEditMode}
    }
};

/**
 * @param ruleIndex number
 * @param newTreeData *
 * @param autoCompleteArray array[{id: "", word: ""}]
 * @param quantifierXPath string
 * @param constraintXPath string
 * @return {{data: {ruleIndex: *, newTreeData: *, quantifierXPath: *, constraintXPath: *, autoCompleteArray: *}, type: string}}
 */
export const receiveGuiTree = (ruleIndex, newTreeData, autoCompleteArray, quantifierXPath, constraintXPath) => {
    return {
        type: reduxStoreActions.action_receive_gui_tree,
        data: {
            ruleIndex: ruleIndex,
            newTreeData: newTreeData,
            autoCompleteArray: autoCompleteArray,
            quantifierXPath: quantifierXPath,
            constraintXPath: constraintXPath
        }
    };
};

export const sendExpressionStatementXML = (codeTextAndIDData) => {
    return {
        type: reduxStoreActions.action_send_expr_stmt_xml,
        data: {codeTextAndID: codeTextAndIDData}
    }
};

export const receiveExpressionStatementXML = (xmlData) => {
    return {
        type: reduxStoreActions.action_receive_expr_stmt_xml,
        data: {xmlData: xmlData}
    }
};

export const updateSentReceivedMessages = (sentMessages, receivedMessages) => {
    return {
        type: reduxStoreActions.action_update_sent_received_messages,
        data: {
            sentMessages: sentMessages,
            receivedMessages: receivedMessages
        }
    }
}

/**
 * messages are matched and XPaths are modified based on the received messages
 * @param ruleIndex number
 * @param sentMessages array[**]
 * @param receivedMessages array[**]
 * @param quantifierXPath string
 * @param constraintXPath string
 * @return {{data: {ruleIndex: *, receivedMessages: *, quantifierXPath: *, constraintXPath: *, sentMessages: *}, type: string}}
 */
export const matchMessages = (ruleIndex, sentMessages, receivedMessages, quantifierXPath, constraintXPath) => {
    return {
        type: reduxStoreActions.action_matched_messages,
        data: {
            ruleIndex: ruleIndex,
            sentMessages: sentMessages,
            receivedMessages: receivedMessages,
            quantifierXPath: quantifierXPath,
            constraintXPath: constraintXPath
        }
    }
};



/**
 * update the rule
 * @param ruleIndex number
 * @param updatedRuleState
 * @return {{type: string, data: {ruleIndex: *, updatedRuleState: *}}}
 */
export const changeRuleState = (ruleIndex, updatedRuleState) => {
    return {
        type: reduxStoreActions.action_update_rule_state,
        data: {
            ruleIndex: ruleIndex,
            updatedRuleState: updatedRuleState
        }
    };
};

/**
 * @param ruleIndex number
 * @param newAutoCompleteArray array[{id: "", word: ""}]
 * @return {{data: {newAutoCompleteArray: *, ruleIndex: *}, type: string}}
 */
export const changeAutoCompleteTextFromGUI = (ruleIndex, newAutoCompleteArray) => {
    return {
        type: reduxStoreActions.action_change_autocomplete_text,
        data: {
            ruleIndex: ruleIndex,
            newAutoCompleteArray: newAutoCompleteArray
        }
    };
};

export const updateXPaths = (ruleIndex, quantifierXPath, constraintXPath) => {
    return {
        type: reduxStoreActions.action_update_xpath,
        data: {
            ruleIndex: ruleIndex,
            quantifierXPath: quantifierXPath,
            constraintXPath: constraintXPath
        }
    }
};

/*
    Mining Rules
 */

/**
 * @param featureMetaData maps for extracting features (see createMetaDataMap())
 * @return {{data: {metaData: *}, type: string}}
 */
export const updateFeatureMetaData = (featureMetaData) => {
    return {
        type: reduxStoreActions.action_update_feature_metadata,
        data: {featureMetaData: featureMetaData}
    }
};

/**
 * @param groupingMetaData maps for grouping files
 * @return {{data: {groupingMetaData: *}, type: string}}
 */
export const updateGroupingMetaData = (groupingMetaData) => {
    return {
        type: reduxStoreActions.action_update_grouping_metadata,
        data: {groupingMetaData: groupingMetaData}
    }
}

/**
 * request to mine rules for a focused element
 * @param focusedElementData
 * @return {{data: {focusElementIdentifiers}, type: string}}
 */
export const updateFocusedElementData = (focusedElementData) => {
    return {
        type: reduxStoreActions.action_update_focused_element_data,
        data: {focusedElementData: focusedElementData}
    }
}

/**
 * update the doi information
 * @param doiInformation {{recentVisitedFiles: {timestamp: Date, filePath: string}[],
 * recentVisitedElements: {timestamp: Date, filePath: string, startOffset:number,
 * endOffset: number, visitedElement: string}[],
 * recentSearches: {timestamp: Date, filePath: string, keyword: string}[]}}
 * @return {{data: {doiInformation}, type: string}}
 */
export const updateDoiInformation = (doiInformation) => {
    return {
        type: reduxStoreActions.action_update_doi_information,
        data: {doiInformation}
    }
}

/**
 * request to start mining rules for a previously sent focused element
 * @return {{data: {}, type: string}}
 */
export const requestMineRulesForElement = () => {
    return {
        type: reduxStoreActions.action_request_mine_rules_for_element,
        data: {}
    }
}

/**
 * @param minedRules **
 * @return {{data: {minedRules: *}, type: string}}
 */
export const updatedMinedRules = (minedRules) => {
    return {
        type: reduxStoreActions.action_update_mined_rules,
        data: {minedRules: minedRules}
    }
};

/**
 * @param newAlgorithm {{parameters: number[], key: string}}
 * @return {{data: {selectedAlgorithm}, type: string}}
 */
export const updateSelectedAlgorithm = (newAlgorithm) => {
    return {
        type: reduxStoreActions.action_update_update_selected_algorithm,
        data: {selectedAlgorithm: newAlgorithm}
    }
}
