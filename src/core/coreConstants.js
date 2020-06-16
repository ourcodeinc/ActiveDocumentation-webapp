export const webSocketSendMessage = {
    modified_rule_msg: "MODIFIED_RULE",
    modified_tag_msg: "MODIFIED_TAG",
    snippet_xml_msg: "XML_RESULT",
    code_to_xml_msg: "EXPR_STMT",
    new_rule_msg: "NEW_RULE",
    new_tag_msg: "NEW_TAG",

    learn_rules_metadata_msg: "LEARN_RULES_META_DATA",
    learn_rules_file_location_msg: "LEARN_RULES_FILE_LOCATIONS",
    learn_rules_databases_msg: "LEARN_RULES_DATABASES",
    execute_tnr_msg: "EXECUTE_TNR",
    execute_fp_max_msg: "EXECUTE_FP_MAX",
    open_file_mined_rules: "OPEN_FILE",
    dangerous_read_mined_rules_msg: "DANGEROUS_READ_MINED_RULES"

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

    tnr_output_msg: "EXECUTE_TNR",
    fp_max_output_msg: "FP_MAX_OUTPUT",
    feature_selection_msg: "FEATURE_SELECTION",
    dangerous_read_mined_rules_msg: "DANGEROUS_READ_MINED_RULES",

    enter_chat_msg: "ENTER",
    left_chat_msg: "LEFT"
};