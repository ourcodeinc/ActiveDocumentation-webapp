// action creator

export const hashChange = (hash) => {
    return {type: "HASH", value: hash};
};

export const updateWS = (ws) => {
    return {type: "NEW_WS", value: ws};
};

export const updateTagTable = (newTagTable) => {
    return {type: "UPDATE_TAG_TABLE", value: newTagTable};
};

export const updateRuleTable = (newRuleTable) => {
    return {type: "UPDATE_RULE_TABLE", ruleTable: newRuleTable};
};

export const updateRule = (updatedRule) => {
    return {type: "UPDATE_RULE", updatedRule: updatedRule};
};

export const ignoreFile = (shouldIgnore) => {
    return {type: "IGNORE_FILE", shouldIgnore: shouldIgnore};
};

export const clickedOnForward = () => {
    return {type: "CLICKED_ON_FORWARD"};
};

export const clickedOnBack = () => {
    return {type: "CLICKED_ON_BACK"};
};

export const updateFilePath = (filePath) => {
    return {type: "FILE_PATH", value: filePath};
};

export const submitNewRule = (newRuleProps) => {
    return {type: "SUBMIT_NEW_RULE", value: newRuleProps}
};

export const submitNewTag = (newTagProps) => {
    return {type: "SUBMIT_NEW_TAG", value: newTagProps}
};

export const clearNewRuleForm = () => {
    return {type: "CLEAR_NEW_RULE_FORM"}
};

export const editRuleForm = (ruleIndex, title, description, ruleTags, folderConstraint, filesFolders) => {
    return {
        type: "EDIT_RULE_FORM",
        ruleIndex: ruleIndex,
        title: title,
        description: description,
        ruleTags: ruleTags,
        folderConstraint: folderConstraint,
        filesFolders: filesFolders
    }
};

export const changeEditMode = (ruleIndex, newEditMode) => {
    return {type: "CHANGE_EDIT_MODE", ruleIndex: ruleIndex, newEditMode: newEditMode}
};

export const receiveGuiTree = (ruleIndex, newTreeData, autoCompleteText, quantifierXPath, constraintXPath) => {
    return {
        type: "RECEIVE_GUI_TREE",
        ruleIndex: ruleIndex,
        newTreeData: newTreeData,
        autoCompleteText: autoCompleteText,
        quantifierXPath: quantifierXPath,
        constraintXPath: constraintXPath
    };
};

export const sendExpressionStatementXML = (codeTextAndIDData) => {
    return {type: "SEND_EXPR_STMT_XML", codeTextAndID: codeTextAndIDData}
};

export const receiveExpressionStatementXML = (xmlData) => {
    return {type: "RECEIVE_EXPR_STMT_XML", xmlData: xmlData}
};

// messages are matched and XPaths are modified based on the received messages
export const matchMessages = (ruleIndex, sentMessages, receivedMessages, quantifierXPath, constraintXPath) => {
    return {
        type: "MATCHED_MESSAGES",
        ruleIndex: ruleIndex,
        sentMessages: sentMessages,
        receivedMessages: receivedMessages,
        quantifierXPath: quantifierXPath,
        constraintXPath: constraintXPath
    }
};


// changing the GUI tab
export const changeActiveTab = (ruleIndex, newTab) => {
    return {
        type: "CHANGE_ACTIVE_TAB",
        ruleIndex: ruleIndex,
        newTab: newTab
    }
};

// tasks is an array of form [{elementId: "", task: "ADD_EXTRA/REMOVE_EXTRA/UPDATE_ELEMENT", value}]
// for add/remove we have the children group name as value
// for update we have an object {prop: newValue}
// group is either quantifier or constraint
export const changeGuiElement = (ruleIndex, group, tasks) => {
    return {
        type: "CHANGE_GUI_ELEMENT",
        ruleIndex: ruleIndex,
        group: group,
        tasks: tasks
    }
};