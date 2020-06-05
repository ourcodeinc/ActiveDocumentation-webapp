// action creator

/**
 * If the hash is #/hash1/hash2
 * @param hash array of hashes ["hash1", "hash2"]
 * @return {{data: {hash: array}, type: string}}
 */
export const hashChange = (hash) => {
    return {
        type: "HASH",
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
        type: "NEW_WS",
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
        type: "UPDATE_XML_FILES",
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
        type: "UPDATE_TAG_TABLE",
        data: {tagTable: newTagTable}
    };
};

/**
 * @param newRuleTable
 * @return {{data: {ruleTable: []}, type: string}}
 */
export const updateRuleTable = (newRuleTable) => {
    return {
        type: "UPDATE_RULE_TABLE",
        data: {ruleTable: newRuleTable}
    };
};


export const updateRule = () => {
    return {type: "UPDATE_RULE"};
};


export const submitNewRule = () => {
    return {type: "SUBMIT_NEW_RULE"}
};


export const submitNewTag = () => {
    return {type: "SUBMIT_NEW_TAG"}
};

/**
 * @param hierarchyData
 * @return {{data: {hierarchyData: *}, type: string}}
 */
export const updateProjectHierarchyData = (hierarchyData) => {
    return {
        type: "HIERARCHY_DATA",
        data: {hierarchyData: hierarchyData}
    };
};

/**
 * @param projectPath string
 * @return {{data: {projectPath: string}, type: string}}
 */
export const updateProjectPath = (projectPath) => {
    return {
        type: "PROJECT_PATH",
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
        type: "IGNORE_FILE_CHANGE",
        data: {shouldIgnore: shouldIgnore}
    };
};

/**
 * @param shouldDisplay boolean
 * @return {{data: {shouldDisplay: boolean}, type: string}}
 */
export const updateDisplayEditTutorial = (shouldDisplay) => {
    return {
        type: "UPDATE_DISPLAY_EDIT_TUTORIAL",
        data: {shouldDisplay: shouldDisplay}
    };
};

/**
 * @param filePath
 * @return {{data: {openFilePath: string}, type: string}}
 */
export const updateFilePath = (filePath) => {
    return {
        type: "FILE_PATH_UPDATED",
        data: {openFilePath: filePath}
    };
};


/*
    nav-bar navigation
 */


export const clickedOnForward = () => {
    return {type: "CLICKED_ON_FORWARD"};
};

export const clickedOnBack = () => {
    return {type: "CLICKED_ON_BACK"};
};

/*
    RulePad
 */


export const clearNewRuleForm = () => {
    return {type: "CLEAR_NEW_RULE_FORM"}
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
        type: "EDIT_RULE_FORM",
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
        type: "CHANGE_EDIT_MODE",
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
        type: "RECEIVE_GUI_TREE",
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
        type: "SEND_EXPR_STMT_XML",
        data: {codeTextAndID: codeTextAndIDData}
    }
};

export const receiveExpressionStatementXML = (xmlData) => {
    return {
        type: "RECEIVE_EXPR_STMT_XML",
        data: {xmlData: xmlData}
    }
};

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
        type: "MATCHED_MESSAGES",
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
 * tasks is an array of form [{elementId: "", task: "ADD_EXTRA/REMOVE_EXTRA/UPDATE_ELEMENT", value}]
 * for add/remove we have the children group name as value
 * for update we have an object {prop: newValue}
 * @param ruleIndex number
 * @param tasks array [**]
 * @return {{ruleIndex: *, type: string, tasks: *}}
 */
export const changeGuiElement = (ruleIndex, tasks) => {
    return {
        type: "CHANGE_GUI_ELEMENT",
        data: {
            ruleIndex: ruleIndex,
            tasks: tasks
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
        type: "CHANGE_AUTOCOMPLETE_TEXT_FROM_GUI",
        data: {
            ruleIndex: ruleIndex,
            newAutoCompleteArray: newAutoCompleteArray
        }
    };
};

export const updateXPaths = (ruleIndex, quantifierXPath, constraintXPath) => {
    return {
        type: "UPDATE_XPATHS",
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
 * @param metaData **
 * @return {{data: {metaData: *}, type: string}}
 */
export const updateMetaData = (metaData) => {
    return {
        type: "UPDATE_META_DATA",
        data: {metaData: metaData}
    }
};

/**
 * @param minedRules **
 * @return {{data: {minedRules: *}, type: string}}
 */
export const updatedMinedRules = (minedRules) => {
    return {
        type: "UPDATE_MINED_RULES",
        data: {minedRules: minedRules}
    }
};


// not recommended
/**
 * @param metaData **
 * @param minedRules **
 * @return {{data: {metaData: *, minedRules: *}, type: string}}
 */
export const updateDangerousMinedRules = (metaData, minedRules) => {
    return {
        type: "DANGEROUS_MINED_RULES",
        data: {
            metaData: metaData,
            minedRules: minedRules
        }
    }
};

/**
 *
 * @param dataObject filePath, startOffset, endOffset, startLineOffset, lineNumber, lineText, selectedText,
 *         xpath, modifiedSelectedText, idMap, displayTextArray
 * @return {{data, type: string}}
 */
export const updateFeatureSelection = (dataObject) => {
    return {
        type: "UPDATE_FEATURE_SELECTION",
        data: {...dataObject}
    }
};

export const updateResetFeatureSelection = () => {
    return {
        type: "RESET_FEATURE_SELECTION"
    }
};

/**
 * @param featureDescription string
 * @param featureXpath string
 * @return {{data: {featureDescription: *, featureXpath: *}, type: string}}
 */
export const updateSaveFeatureSelection = (featureDescription, featureXpath) => {
    return {
        type: "SAVE_FEATURE_SELECTION",
        data: {featureDescription, featureXpath}
    }
};

