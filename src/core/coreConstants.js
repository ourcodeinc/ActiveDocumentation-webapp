export const webSocketSendMessage = {
    modified_rule_msg: "MODIFIED_RULE",
    modified_tag_msg: "MODIFIED_TAG",
    snippet_xml_msg: "XML_RESULT",
    converted_java_snippet_msg: "CONVERTED_JAVA_SNIPPET",
    code_to_xml_msg: "EXPR_STMT",
    new_rule_msg: "NEW_RULE",
    new_tag_msg: "NEW_TAG",

    open_file_msg: "OPEN_FILE",

    refresh_learn_design_rules_directory_msg: "REFRESH_LEARNING_DR_DIRECTORY",
    learn_design_rules_databases_msg: "LEARN_DESIGN_RULES_DATABASE",
    learn_design_rules_features_msg: "LEARN_DESIGN_RULES_FEATURES",
    learn_design_rules_helper_files_msg: "LEARN_DESIGN_RULES_HELPER_FILES",
    mine_design_rules_msg: "MINE_DESIGN_RULES"

};

export const webSocketReceiveMessage = {
    xml_files_msg: "XML",
    rule_table_msg: "RULE_TABLE",
    tag_table_msg: "TAG_TABLE",
    project_hierarchy_msg: "PROJECT_HIERARCHY",
    project_path_msg: "PROJECT_PATH",
    verify_rules_msg: "VERIFY_RULES",
    update_xml_file_msg: "UPDATE_XML",
    check_rules_for_file_msg: "CHECK_RULES_FOR_FILE",
    update_tag_msg: "UPDATE_TAG",
    failed_update_tag_msg: "FAILED_UPDATE_TAG",
    update_rule_msg: "UPDATE_RULE",
    failed_update_rule_msg: "FAILED_UPDATE_RULE",
    xml_from_code_msg: "EXPR_STMT_XML",
    new_rule_msg: "NEW_RULE",
    failed_new_rule_msg: "FAILED_NEW_RULE",
    new_tag_msg: "NEW_TAG",
    failed_new_tag_msg: "FAILED_NEW_TAG",
    file_change_in_ide_msg: "FILE_CHANGE",

    element_info_for_mine_rules: "ELEMENT_INFO_FOR_MINE_RULES",
    doi_information: "DOI_INFORMATION",
    request_mine_rules_for_element: "MINE_RULES_FOR_ELEMENT",
    mined_design_rules: "MINED_DESIGN_RULES",

    enter_chat_msg: "ENTER",
    left_chat_msg: "LEFT"
};

export const defaultXML = "<unit xmlns=\"http://www.srcML.org/srcML/src\" revision=\"0.9.5\" language=\"Java\">\n" +
    "</unit>";

export const nsResolver = (prefix) => {
    let ns = {"src": "http://www.srcML.org/srcML/src"};
    return ns[prefix] || null;
}