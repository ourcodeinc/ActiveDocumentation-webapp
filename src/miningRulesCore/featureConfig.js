export const MAX_GROUP_SIZE = 50; // when selecting related classes from groups, ignore groups with large sizes.
export const DOI_DISCARD_TIME = 900000; // 15 minutes in milliseconds
export const MIN_SUPPORT_FOR_MINING = 2; // minimum feature occurrences
export const MIN_FEATURE_COUNT_FOR_FILTER = 3; // minimum number of features in a rule.
export const MIN_SUPPORT_FOR_FILTER = 2; // minimum support for the itemSet
export const MIN_UTILITY_FOR_FILTER = 200; // minimum utility for the itemSet
export const MIN_WEIGHT_TO_INCLUDE_FILE = 2; // min weight of a feature to include its files in RulePad

// Constants for clustering similar itemSets
export const SIMILARITY_THRESHOLD = 15; // Threshold for similarity measure
export const BRANCHING_FACTOR = 50; // Branching factor for BIRCH tree
export const MAX_LEAF_ENTRIES = 15; // Maximum number of itemSets in a BIRCH tree node


/**
 * Used to update the weights of features upon generation in processing phase
 */
export const weightUpdateActions = {
    multiply: "multiply",
    add: "add",
    replace: "replace"
}
export const weightUpdateFactors = {
    focusedFile: 20,
    doiSearches: 10,
    doiVisited: 5
}
/**
 * Key should be the exact name used in spmf.jar, there is no check in the server.
 * @type {Object<String, {parameters: number[], key: string}>}
 */
export const allAlgorithms = {
    CHUI_MINER_DEFAULT: {
        key: "CHUI-Miner",
        parameters: [1000]
    },
    CHUI_MINER_RELAXED: {
        key: "CHUI-Miner",
        parameters: [500]
    },
    CHUI_MINER_MAX: {
        key: "CHUI-MinerMax",
        parameters: [400]
    },
    FP_MAX_DEFAULT: {
        key: "FPMax",
        parameters: [0.005]
    },
    FP_MAX_RELAXED: {
        key: "FPMax",
        parameters: [0.05]
    },
    FP_MAX_EXTRA_RELAXED: {
        key: "FPMax",
        parameters: [0.1]
    },
    FP_CLOSE: {  // Extracts many FIQs
        key: "FPClose",
        parameters: [0.02]
    }
}

/*  processing  */

// the prefix and postfix of files written for mining rules
export const attributeFileNames = {
    prefix: "AttributeEncoding_",
    weightedPrefix: "Weighted_AttributeEncoding_",
    postfix: "_File.txt",
    featureFile: "featureFile.txt",
}

/* pre-processing */

// used to group related files for faster mining rules
export const groupingCategories = {
    imports: {
        query: "//src:import/src:name",
        excludedValues: ["java.", "javax."]
    },
    packages: {
        query: "//src:package/src:name",
        excludedValues: []
    }
};

/* extracting features  */

// types of features prepareProperties from a codebase
export const featureTypes = {
    node: "node_is_selected",
    no_node: "no_node_is_selected",
    single_node_text: "select_a_single_node",
    single_node_text_ends_with: "single_node_text_ends_with",
    single_node_text_starts_with: "single_node_text_starts_with",
    single_node_and_children_text: "select_a_single_node_and_its_children",
    multiple_nodes_texts: "select_multiple_nodes",
    multiple_nodes_and_children_texts: "select_multiple_nodes_and_their_children",
};

// the set of nodes extracts from a selected scope (single element) in the IDE
export const focusElementType = [
    {
        nodeName: "class",
        mapFocusedElementToFeaturesKey: "class_spec_body",
        identifierXpath: "/src:class/src:name//text()",
        title: "class"
    },
    {
        nodeName: "constructor",
        mapFocusedElementToFeaturesKey: "constr_spec_body",
        identifierXpath: "/src:constructor/src:name//text()",
        title: "class constructor"
    },
    {
        nodeName: "function",
        mapFocusedElementToFeaturesKey: "func_spec_body",
        identifierXpath: "/src:function/src:name//text()",
        title: "class function"
    },
    {
        nodeName: "decl_stmt",
        mapFocusedElementToFeaturesKey: "field_spec",
        identifierXpath: "/src:decl_stmt/src:decl/src:name//text()",
        title: "class field"
    },
]

// used for readability
const nodeType = {
    class_node: "class_node",
    class_field_node: "class_field_node",
    class_constr_node: "class_constr_node",
    class_function_node: "class_function_node",
    class_subclass_node: "class_subclass_node",

    class_constr_call_constr_node: "class_constr_call_constr_node",
    class_constr_call_func_node: "class_constr_call_func_node",
    class_func_call_constr_node: "class_func_call_constr_node",
    class_func_call_func_node: "class_func_call_func_node",
    class_constr_call_field_node: "class_constr_call_field_node",
    class_func_call_field_node: "class_func_call_field_node",
    expr_call_constr_node: "expr_call_constr_node",
    decl_call_constr_node: "decl_call_constr_node",
    expr_call_func_node: "expr_call_func_node",
    decl_call_func_node: "decl_call_func_node",
    expr_call_field_node: "expr_call_field_node",
    decl_call_field_node: "decl_call_field_node",
}

// the keys used for elements in guiElements of RulePad
export const identifierKeysInRulePad = ["name"];

export const identifierFeatures = {
    class_identifier: ["class_name_ends_with", "class_name_starts_with", "class_name"],
    subclass_identifier: ["subclass_name_ends_with", "subclass_name_starts_with", "subclass_name"],
    field_identifier: ["field_name_ends_with", "field_name_starts_with", "field_name"],
    constr_identifier: ["constr_name"],
    func_identifier: ["func_name_ends_with", "func_name_starts_with", "func_name"],
}

// used for readability
export const featureSet = {
    class_spec: ["class_annotation", "class_vis", "class_specifier", "class_name",
        "class_name_ends_with", "class_name_starts_with",
        "class_extend", "class_extend_ends_with", "class_extend_starts_with",
        "class_impl", "class_impl_ends_with", "class_impl_starts_with",
        "class_no_constr", "class_no_func"],
    subclass_spec: ["subclass_annotation", "subclass_vis", "subclass_specifier",
        "subclass_name", "subclass_name_ends_with", "subclass_name_starts_with",
        "subclass_extend", "subclass_extend_ends_with", "subclass_extend_starts_with",
        "subclass_impl", "subclass_impl_ends_with", "subclass_impl_starts_with",
        "subclass_no_constr", "subclass_no_func"],
    field_spec: ["field_annotation", "field_vis", "field_specifier", "field_type",
        "field_name", "field_name_ends_with", "field_name_starts_with",
        // "field_type_name", the created feature would overlap with field_type and field_name
        "field_has_init"],
    constr_spec: ["constr_annotation", "constr_vis", "constr_name", "constr_empty_body",
        // "constr_param_type", "constr_param_name", "constr_param_name_ends_with", "constr_param_name_starts_with",
        // "constr_param_type_name"
    ],
    constr_spec_body: ["constr_annotation", "constr_vis", "constr_empty_body",
        // "constr_param_type", "constr_param_name", "constr_param_name_ends_with", "constr_param_name_starts_with",
        // "constr_param_type_name",
        "constr_call_constr", "constr_call_func", "constr_modify_field"],
    func_spec: ["func_annotation", "func_vis", "func_specifier", "func_type", "func_name",
        "func_name_ends_with", "func_name_starts_with",
        "func_no_param",
        "func_param_type", "func_param_name", //"func_param_name_ends_with", "func_param_name_starts_with",
        // "func_param_type_name"
    ],
    func_spec_body: ["func_annotation", "func_vis", "func_specifier", "func_type", "func_name",
        "func_name_ends_with", "func_name_starts_with",
        "func_no_param",
        "func_param_type", "func_param_name", //"func_param_name_ends_with","func_param_name_starts_with",
        // "func_param_type_name",
        "func_call_constr", "func_call_func", "func_modify_field"],
    expr_spec: [
        "expr_call_function", "expr_call_function_argument", "expr_assignment_caller", "expr_assignment_callee_value",
        "expr_assignment_callee_call_function", "expr_assignment_callee_call_function_argument"],
    decl_spec: ["decl_annotation", "decl_vis", "decl_specifier",
        // "decl_type", "decl_name",
        "decl_has_init", // "decl_type_name",
        "decl_name_ends_with", "decl_name_starts_with",
        "decl_call_function", "decl_call_function_argument", "decl_init_value"]
};

// used for readability
const elementType = {
    class: "class",
    field: "field",
    constructor: "constructor",
    function: "function",
    expression: "expression",
    declaration: "declaration"
}

const gui_element_ids = {
    class_element_id : "0",
    class_name_id : "0-4-0",

    class_decl_stmt_id : "0-7-0",
    class_decl_stmt_name_id : "0-7-0-4-0",

    constr_element_id : "0-7-1",
    constr_name_id : "0-7-1-4-0",
    constr_expr_stmt_id : "0-7-1-7-0",
    constr_decl_stmt_id : "0-7-1-7-1",

    func_element_id : "0-7-2",
    func_name_id : "0-7-2-4-0",
    func_decl_stmt_id : "0-7-2-7-0",
    func_expr_stmt_id : "0-7-2-7-1",

    subclass_element_id : "0-7-5",
    subclass_name_id : "0-7-5-4-0",
}

export const identifier_element_ids = [
    gui_element_ids.class_name_id, gui_element_ids.class_decl_stmt_name_id,
    gui_element_ids.constr_name_id, gui_element_ids.func_name_id, gui_element_ids.subclass_name_id
];

/**
 * key: key of the group used to access the object
 * desc: readable string used to describe the group for mining rules / not used anywhere yet
 * featureGroup: list of feature types in the group
 * @type {Object<string, {key: string, desc: string, headers: string[], mergeKeys: string[],
 *        categorizedFeatureSets: string[], rootId: string[]}>}
 */
export const featureGroupInformation = {
    field_spec_in_class: {
        key: "field_spec_in_class",
        desc: "Code snippets for fields in similar classes",
        headers: ["If a class has these properties:", "Then the class has these fields:"],
        mergeKeys: ["class", "declaration statement"],
        categorizedFeatureSets: [["class_identifier", "class_spec"], ["field_identifier", "field_spec"]],
        rootId: [gui_element_ids.class_element_id, gui_element_ids.class_decl_stmt_id],
    },
    constr_spec_in_class: {
        key: "constr_spec_in_class",
        desc: "Code snippets for constructors in similar classes",
        headers: ["If a class has these properties:", "Then the class has these constructors:"],
        mergeKeys: ["class", "constructor"],
        categorizedFeatureSets: [["class_identifier", "class_spec"], ["constr_identifier", "constr_spec"]],
        rootId: [gui_element_ids.class_element_id, gui_element_ids.constr_element_id],
    },
    func_spec_in_class: {
        key: "func_spec_in_class",
        desc: "Code snippets for functions in similar classes",
        headers: ["If a class has these properties:", "Then the class has these functions:"],
        mergeKeys: ["class", "function"],
        categorizedFeatureSets: [["class_identifier", "class_spec"], ["func_identifier", "func_spec"]],
        rootId: [gui_element_ids.class_element_id, gui_element_ids.func_element_id],
    },
    subclass_spec_in_class: {
        key: "subclass_spec_in_class",
        desc: "Code snippets for subclasses in similar classes",
        headers: ["If a class has these properties:", "Then the class has these subclasses:"],
        mergeKeys: ["class", "subclass"],
        categorizedFeatureSets: [["class_identifier", "class_spec"], ["subclass_identifier", "subclass_spec"]],
        rootId: [gui_element_ids.class_element_id, gui_element_ids.subclass_element_id],
    },

    expr_spec_in_constr_calling_constr_focused_element: {
        key: "expr_spec_in_constr_calling_constr_focused_element",
        desc: "Code snippets for declaration statements in constructors calling the target constructor",
        headers: ["If a constructor has these properties:", "Then the constructor has these declarations:"],
        mergeKeys: ["constructor", "expression statement"],
        categorizedFeatureSets: [["constr_identifier", "constr_spec"], []],
        rootId: [gui_element_ids.constr_element_id, gui_element_ids.constr_expr_stmt_id],
    },
    decl_spec_in_constr_calling_constr_focused_element: {
        key: "decl_spec_in_constr_calling_constr_focused_element",
        desc: "Code snippets for declaration statements in constructors calling the target constructor",
        headers: ["If a constructor has these properties:", "Then the constructor has these declarations:"],
        mergeKeys: ["constructor", "declaration statement"],
        categorizedFeatureSets: [["constr_identifier", "constr_spec"], []],
        rootId: [gui_element_ids.constr_element_id, gui_element_ids.constr_decl_stmt_id],
    },
    expr_spec_in_func_calling_constr_focused_element: {
        key: "expr_spec_in_func_calling_constr_focused_element",
        desc: "Code snippets for expression statements in functions calling the target constructor",
        headers: ["If a function has these properties:", "Then the function has these expressions:"],
        mergeKeys: ["function", "expression statement"],
        categorizedFeatureSets: [["func_identifier", "func_spec"], []],
        rootId: [gui_element_ids.func_element_id, gui_element_ids.func_expr_stmt_id],
    },
    decl_spec_in_func_calling_constr_focused_element: {
        key: "decl_spec_in_func_calling_constr_focused_element",
        desc: "Code snippets for declaration statements in functions calling the target constructor",
        headers: ["If a function has these properties:", "Then the function has these declarations:"],
        mergeKeys: ["function", "declaration statement"],
        categorizedFeatureSets: [["func_identifier", "func_spec"], []],
        rootId: [gui_element_ids.func_element_id, gui_element_ids.func_decl_stmt_id],
    },

    expr_spec_in_constr_calling_func_focused_element: {
        key: "expr_spec_in_constr_calling_func_focused_element",
        desc: "Code snippets for expression statements in constructors calling the target function",
        headers: ["If a constructor has these properties:", "Then the function has these expressions:"],
        mergeKeys: ["constructor", "expression statement"],
        categorizedFeatureSets: [["constr_identifier", "constr_spec"], []],
        rootId: [gui_element_ids.constr_element_id, gui_element_ids.constr_expr_stmt_id],
    },
    decl_spec_in_constr_calling_func_focused_element: {
        key: "decl_spec_in_constr_calling_func_focused_element",
        desc: "Code snippets for declaration statements in constructors calling the target function",
        headers: ["If a constructor has these properties:", "Then the function has these declarations:"],
        mergeKeys: ["constructor", "declaration statement"],
        categorizedFeatureSets: [["constr_identifier", "constr_spec"], []],
        rootId: [gui_element_ids.constr_element_id, gui_element_ids.constr_decl_stmt_id],
    },
    expr_spec_in_func_calling_func_focused_element: {
        key: "expr_spec_in_func_calling_func_focused_element",
        desc: "Code snippets for expression statements in functions calling the target function",
        headers: ["If a function has these properties:", "Then the function has these expressions:"],
        mergeKeys: ["function", "expression statement"],
        categorizedFeatureSets: [["func_identifier", "func_spec"], []],
        rootId: [gui_element_ids.func_element_id, gui_element_ids.func_expr_stmt_id],
    },
    decl_spec_in_func_calling_func_focused_element: {
        key: "decl_spec_in_func_calling_func_focused_element",
        desc: "Code snippets for declaration statements in functions calling the target function",
        headers: ["If a function has these properties:", "Then the function has these declarations:"],
        mergeKeys: ["function", "declaration statement"],
        categorizedFeatureSets: [["func_identifier", "func_spec"], []],
        rootId: [gui_element_ids.func_element_id, gui_element_ids.func_decl_stmt_id],
    },

    expr_spec_in_constr_reading_modifying_field_focused_element: {
        key: "expr_spec_in_constr_reading_modifying_field_focused_element",
        desc: "Code snippets for expression statements in constructors reading / modifying the target field",
        headers: ["If a constructor has these properties:", "Then the function has these expressions:"],
        mergeKeys: ["constructor", "expression statement"],
        categorizedFeatureSets: [["constr_identifier", "constr_spec"], []],
        rootId: [gui_element_ids.constr_element_id, gui_element_ids.constr_expr_stmt_id],
    },
    decl_spec_in_constr_reading_modifying_field_focused_element: {
        key: "decl_spec_in_constr_reading_modifying_field_focused_element",
        desc: "Code snippets for declaration statements in constructors reading / modifying the target field",
        headers: ["If a constructor has these properties:", "Then the constructor has these declarations:"],
        mergeKeys: ["constructor", "declaration statement"],
        categorizedFeatureSets: [["constr_identifier", "constr_spec"], []],
        rootId: [gui_element_ids.constr_element_id, gui_element_ids.constr_decl_stmt_id],
    },
    expr_spec_in_func_reading_modifying_field_focused_element: {
        key: "expr_spec_in_func_reading_modifying_field_focused_element",
        desc: "Code snippets for expression statements in functions reading / modifying the target field",
        headers: ["If a function has these properties:", "Then the function has these expressions:"],
        mergeKeys: ["function", "expression statement"],
        categorizedFeatureSets: [["func_identifier", "func_spec"], []],
        rootId: [gui_element_ids.func_element_id, gui_element_ids.func_expr_stmt_id],
    },
    decl_spec_in_func_reading_modifying_field_focused_element: {
        key: "decl_spec_in_func_reading_modifying_field_focused_element",
        desc: "Code snippets for declaration statements in functions reading / modifying the target field",
        headers: ["If a function has these properties:", "Then the function has these declarations:"],
        mergeKeys: ["function", "declaration statement"],
        categorizedFeatureSets: [["func_identifier", "func_spec"], []],
        rootId: [gui_element_ids.func_element_id, gui_element_ids.func_decl_stmt_id],
    }
};

/**
 * spec: features defining the specifications of the element
 * container: the containing element for with primary featureSet and other featureSets in contentGroups are prepareProperties
 * container.node: type of the container node. The information in defaultFeature is used to query the code
 * container.type: the string that is used to create the feature metadata
 * container.featureSet: the set of features prepareProperties in this group
 * container.featureQueryPrefix: "" or "/", a prefix added to the XPath of the container
 *
 * contentGroups: the group of features prepareProperties on the container nodes
 * contentGroups[i].groupId: used as a key in feature MetaData
 *
 * usage: the group of features defined to find the usages of the element
 */
export const mapFocusedElementToFeatures = {
    class_spec_body: {
        spec: [
            {
                container: {
                    node: nodeType.class_node,
                    type: elementType.class,
                    featureSet: featureSet.class_spec,
                    featureQueryPrefix: ""
                },
                contentGroups: [
                    {
                        node: nodeType.class_field_node,
                        type: elementType.field,
                        featureSet: featureSet.field_spec,
                        groupId: featureGroupInformation.field_spec_in_class.key
                    },
                    {
                        node: nodeType.class_constr_node,
                        type: elementType.constructor,
                        featureSet: featureSet.constr_spec,
                        groupId: featureGroupInformation.constr_spec_in_class.key
                    },
                    {
                        node: nodeType.class_function_node,
                        type: elementType.function,
                        featureSet: featureSet.func_spec,
                        groupId: featureGroupInformation.func_spec_in_class.key
                    },
                    {
                        node: nodeType.class_subclass_node,
                        type: elementType.class,
                        featureSet: featureSet.subclass_spec,
                        groupId: featureGroupInformation.subclass_spec_in_class.key
                    }
                ]
            }
        ],
        usage: []
    },
    constr_spec_body: {
        spec: [
            {
                container: {
                    node: nodeType.class_node,
                    type: elementType.class,
                    featureSet: featureSet.class_spec,
                },
                contentGroups: [
                    {
                        node: nodeType.class_constr_node,
                        type: elementType.constructor,
                        featureSet: featureSet.constr_spec_body,
                        groupId: featureGroupInformation.constr_spec_in_class.key
                    },
                ]
            }
        ],
        usage: [
            {
                container: {
                    node: nodeType.class_constr_call_constr_node,
                    type: elementType.constructor,
                    featureSet: featureSet.constr_spec,
                    featureQueryPrefix: "/"
                },
                contentGroups: [
                    {
                        node: nodeType.expr_call_constr_node,
                        type: elementType.expression,
                        featureSet: featureSet.expr_spec,
                        groupId: featureGroupInformation.expr_spec_in_constr_calling_constr_focused_element.key
                    },
                    {
                        node: nodeType.decl_call_constr_node,
                        type: elementType.declaration,
                        featureSet: featureSet.decl_spec,
                        groupId: featureGroupInformation.decl_spec_in_constr_calling_constr_focused_element.key
                    }
                ]
            },
            {
                container: {
                    node: nodeType.class_func_call_constr_node,
                    type: elementType.function,
                    featureSet: featureSet.func_spec,
                    featureQueryPrefix: "/"
                },
                contentGroups: [
                    {
                        node: nodeType.expr_call_constr_node,
                        type: elementType.expression,
                        featureSet: featureSet.expr_spec,
                        groupId: featureGroupInformation.expr_spec_in_func_calling_constr_focused_element.key
                    },
                    {
                        node: nodeType.decl_call_constr_node,
                        type: elementType.declaration,
                        featureSet: featureSet.decl_spec,
                        groupId: featureGroupInformation.decl_spec_in_func_calling_constr_focused_element.key
                    }
                ]
            }
        ]
    },
    func_spec_body: {
        spec: [
            {
                container: {
                    node: nodeType.class_node,
                    type: elementType.class,
                    featureSet: featureSet.class_spec,
                    featureQueryPrefix: "/"
                },
                contentGroups: [
                    {
                        node: nodeType.class_function_node,
                        type: elementType.function,
                        featureSet: featureSet.func_spec_body,
                        groupId: featureGroupInformation.func_spec_in_class.key
                    },
                ]
            }
        ],
        usage: [
            {
                container: {
                    node: nodeType.class_constr_call_func_node,
                    type: elementType.constructor,
                    featureSet: featureSet.constr_spec,
                    featureQueryPrefix: "/"
                },
                contentGroups: [
                    {
                        node: nodeType.expr_call_func_node,
                        type: elementType.expression,
                        featureSet: featureSet.expr_spec,
                        groupId: featureGroupInformation.expr_spec_in_constr_calling_func_focused_element.key
                    },
                    {
                        node: nodeType.decl_call_func_node,
                        type: elementType.declaration,
                        featureSet: featureSet.decl_spec,
                        groupId: featureGroupInformation.decl_spec_in_constr_calling_func_focused_element.key
                    }
                ]
            },
            {
                container: {
                    node: nodeType.class_func_call_func_node,
                    type: elementType.function,
                    featureSet: featureSet.func_spec,
                    featureQueryPrefix: "/"
                },
                contentGroups: [
                    {
                        node: nodeType.expr_call_func_node,
                        type: elementType.expression,
                        featureSet: featureSet.expr_spec,
                        groupId: featureGroupInformation.expr_spec_in_func_calling_func_focused_element.key
                    },
                    {
                        node: nodeType.decl_call_func_node,
                        type: elementType.declaration,
                        featureSet: featureSet.decl_spec,
                        groupId: featureGroupInformation.decl_spec_in_func_calling_func_focused_element.key
                    }
                ]
            }
        ]
    },
    field_spec: {
        spec: [
            {
                container: {
                    node: nodeType.class_node,
                    type: elementType.class,
                    featureSet: featureSet.class_spec,
                    featureQueryPrefix: "/"
                },
                contentGroups: [
                    {
                        node: nodeType.class_field_node,
                        type: elementType.field,
                        featureSet: featureSet.field_spec,
                        groupId: featureGroupInformation.field_spec_in_class.key
                    },
                ]
            }
        ],
        usage: [
            {
                container: {
                    node: nodeType.class_constr_call_field_node,
                    type: elementType.constructor,
                    featureSet: featureSet.constr_spec,
                    featureQueryPrefix: "/",
                },
                contentGroups: [
                    {
                        node: nodeType.expr_call_field_node,
                        type: elementType.expression,
                        featureSet: featureSet.expr_spec,
                        groupId: featureGroupInformation.expr_spec_in_constr_reading_modifying_field_focused_element.key
                    },
                    {
                        node: nodeType.decl_call_field_node,
                        type: elementType.declaration,
                        featureSet: featureSet.decl_spec,
                        groupId: featureGroupInformation.decl_spec_in_constr_reading_modifying_field_focused_element.key
                    }
                ]
            },
            {
                container: {
                    node: nodeType.class_func_call_field_node,
                    type: elementType.function,
                    featureSet: featureSet.func_spec,
                    featureQueryPrefix: "/"
                },
                contentGroups: [
                    {
                        node: nodeType.expr_call_field_node,
                        type: elementType.expression,
                        featureSet: featureSet.expr_spec,
                        groupId: featureGroupInformation.expr_spec_in_func_reading_modifying_field_focused_element.key
                    },
                    {
                        node: nodeType.decl_call_field_node,
                        type: elementType.declaration,
                        featureSet: featureSet.decl_spec,
                        groupId: featureGroupInformation.decl_spec_in_func_reading_modifying_field_focused_element.key
                    }
                ]
            }
        ]
    },
};

/**
 * general description of features
 * @type {Object.<string, {type: string, xpath:string, description:string, weight: number,
 * ?nodes: string[]|undefined,
 * FeatureObject: {key: string,
 *       withChildren: {key: string, value: {word: string, type: string}}|
 *                     {key: string, withChildren:{key: string, value: {word: string, type: string}}}}
 *   }>}
 * the key of the objects are used as the feature ID in the prepareProperties files
 * type: used to run the XPath query
 * XPath: used to extract features on code
 * description: used to label features in featureMetaData
 * <TEMP_?> are used as the key
 * weight: default value set as a utility of a feature
 * FeatureObject: object readable by rulePadTextualEditor/generateGuiTree.createGuiElementTree
 * key: the grammar keyword also defined in src/ui/RulePad/rulePadGraphicalEditor/graphicalEditorConstants.element_conditions
 */
export const defaultFeatures = {
    class_annotation: {
        type: featureTypes.single_node_text,
        xpath: "src:class/src:annotation/src:name/text()",
        description: "class with ( annotation \"<TEMP_0>\" )",
        weight: 5,
        FeatureObject: {
            key: "class",
            withChildren: {key: "annotation", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    class_vis: {
        type: featureTypes.single_node_text,
        xpath: "src:class/src:specifier[contains(\"public private protected\",text())]/text()",
        description: "class with ( visibility \"<TEMP_0>\" )",
        weight: 1,
        FeatureObject: {
            key: "class",
            withChildren: {key: "visibility", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    class_specifier: {
        type: featureTypes.single_node_text,
        xpath: "src:class/src:specifier" +
            "[not(contains(\"public private protected\",text()))]/text()",
        description: "class with ( specifier \"<TEMP_0>\" )",
        weight: 5,
        FeatureObject: {
            key: "class",
            withChildren: {key: "specifier", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    class_name: {
        type: featureTypes.single_node_text,
        xpath: "src:class/src:name/text()",
        description: "class with ( name \"<TEMP_0>\" )",
        weight: 50,
        FeatureObject: {
            key: "class",
            withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    class_name_ends_with: {
        type: featureTypes.single_node_text_ends_with,
        xpath: "src:class/src:name/text()",
        description: "class with ( name \"<TEMP_0>\" )",
        weight: 49,
        FeatureObject: {
            key: "class",
            withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    class_name_starts_with: {
        type: featureTypes.single_node_text_starts_with,
        xpath: "src:class/src:name/text()",
        description: "class with ( name \"<TEMP_0>\" )",
        weight: 48,
        FeatureObject: {
            key: "class",
            withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    class_extend: {
        type: featureTypes.single_node_text,
        xpath: "src:class/src:super/src:extends/src:name/text()",
        description: "class with ( extension of \"<TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "class",
            withChildren: {key: "extension", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    class_extend_ends_with: {
        type: featureTypes.single_node_text_ends_with,
        xpath: "src:class/src:super/src:extends/src:name/text()",
        description: "class with ( extension of \"<TEMP_0>\" )",
        weight: 9,
        FeatureObject: {
            key: "class",
            withChildren: {key: "extension", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    class_extend_starts_with: {
        type: featureTypes.single_node_text_starts_with,
        xpath: "src:class/src:super/src:extends/src:name/text()",
        description: "class with ( extension of \"<TEMP_0>\" )",
        weight: 8,
        FeatureObject: {
            key: "class",
            withChildren: {key: "extension", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    class_impl: {
        type: featureTypes.single_node_text,
        xpath: "src:class/src:super/src:implements/src:name/text()",
        description: "class with ( implementation of \"<TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "class",
            withChildren: {key: "implementation", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    class_impl_ends_with: {
        type: featureTypes.single_node_text_ends_with,
        xpath: "src:class/src:super/src:implements/src:name/text()",
        description: "class with ( implementation of \"<TEMP_0>\" )",
        weight: 9,
        FeatureObject: {
            key: "class",
            withChildren: {key: "implementation", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    class_impl_starts_with: {
        type: featureTypes.single_node_text_starts_with,
        xpath: "src:class/src:super/src:implements/src:name/text()",
        description: "class with ( implementation of \"<TEMP_0>\" )",
        weight: 8,
        FeatureObject: {
            key: "class",
            withChildren: {key: "implementation", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    class_no_constr: {
        type: featureTypes.no_node,
        xpath: "src:class[not(src:block/src:constructor)]",
        description: "class with ( \"No Constructor\" )",
        weight: 5,
        FeatureObject: {
            key: "class",
            withChildren: {key: "comment", value: {word: "No Constructor", type: "text"}}
        }
    },
    class_no_func: {
        type: featureTypes.no_node,
        xpath: "src:class[not(src:block/src:function)]",
        description: "class with ( \"No Function\" )",
        weight: 5,
        FeatureObject: {
            key: "class",
            withChildren: {key: "comment", value: {word: "No Function", type: "text"}}
        }
    },

    subclass_annotation: {
        type: featureTypes.single_node_text,
        xpath: "/src:class/src:block/src:class/src:annotation/src:name/text()",
        description: "subclass with ( annotation \"<TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "subclass",
            withChildren: {key: "annotation", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    subclass_vis: {
        type: featureTypes.single_node_text,
        xpath: "/src:class/src:block/src:class/src:specifier[contains(\"public private protected\",text())]/text()",
        description: "subclass with ( visibility \"<TEMP_0>\" )",
        weight: 5,
        FeatureObject: {
            key: "subclass",
            withChildren: {key: "visibility", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    subclass_specifier: {
        type: featureTypes.single_node_text,
        xpath: "/src:class/src:block/src:class/src:specifier" +
            "[not(contains(\"public private protected\",text()))]/text()",
        description: "subclass with ( specifier \"<TEMP_0>\" )",
        weight: 5,
        FeatureObject: {
            key: "subclass",
            withChildren: {key: "specifier", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    subclass_name: {
        type: featureTypes.single_node_text,
        xpath: "/src:class/src:block/src:class/src:name/text()",
        description: "subclass with ( name \"<TEMP_0>\" )",
        weight: 40,
        FeatureObject: {
            key: "subclass",
            withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    subclass_name_ends_with: {
        type: featureTypes.single_node_text_ends_with,
        xpath: "/src:class/src:block/src:class/src:name/text()",
        description: "subclass with ( name \"<TEMP_0>\" )",
        weight: 39,
        FeatureObject: {
            key: "subclass",
            withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    subclass_name_starts_with: {
        type: featureTypes.single_node_text_starts_with,
        xpath: "/src:class/src:block/src:class/src:name/text()",
        description: "subclass with ( name \"<TEMP_0>\" )",
        weight: 38,
        FeatureObject: {
            key: "subclass",
            withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    subclass_extend: {
        type: featureTypes.single_node_text,
        xpath: "/src:class/src:block/src:class/src:super/src:extends/src:name/text()",
        description: "subclass with ( extension of \"<TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "subclass",
            withChildren: {key: "extension", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    subclass_extend_ends_with: {
        type: featureTypes.single_node_text_ends_with,
        xpath: "/src:class/src:block/src:class/src:super/src:extends/src:name/text()",
        description: "subclass with ( extension of \"<TEMP_0>\" )",
        weight: 9,
        FeatureObject: {
            key: "subclass",
            withChildren: {key: "extension", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    subclass_extend_starts_with: {
        type: featureTypes.single_node_text_starts_with,
        xpath: "/src:class/src:block/src:class/src:super/src:extends/src:name/text()",
        description: "subclass with ( extension of \"<TEMP_0>\" )",
        weight: 8,
        FeatureObject: {
            key: "subclass",
            withChildren: {key: "extension", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    subclass_impl: {
        type: featureTypes.single_node_text,
        xpath: "/src:class/src:block/src:class/src:super/src:implements/src:name/text()",
        description: "subclass with ( implementation of \"<TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "subclass",
            withChildren: {key: "implementation", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    subclass_impl_ends_with: {
        type: featureTypes.single_node_text_ends_with,
        xpath: "/src:class/src:block/src:class/src:super/src:implements/src:name/text()",
        description: "subclass with ( implementation of \"<TEMP_0>\" )",
        weight: 9,
        FeatureObject: {
            key: "subclass",
            withChildren: {key: "implementation", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    subclass_impl_starts_with: {
        type: featureTypes.single_node_text_starts_with,
        xpath: "/src:class/src:block/src:class/src:super/src:implements/src:name/text()",
        description: "subclass with ( implementation of \"<TEMP_0>\" )",
        weight: 8,
        FeatureObject: {
            key: "subclass",
            withChildren: {key: "implementation", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    subclass_no_constr: {
        type: featureTypes.no_node,
        xpath: "/src:class/src:block/src:class[not(src:block/src:constructor)]",
        description: "subclass with ( \"No Constructor\" )",
        weight: 5,
        FeatureObject: {
            key: "subclass",
            withChildren: {key: "comment", value: {word: "No Constructor", type: "text"}}
        }
    },
    subclass_no_func: {
        type: featureTypes.no_node,
        xpath: "/src:class/src:block/src:class[not(src:block/src:function)]",
        description: "subclass with ( \"No Function\" )",
        weight: 5,
        FeatureObject: {
            key: "subclass",
            withChildren: {key: "comment", value: {word: "No Function", type: "text"}}
        }
    },


    constr_annotation: {
        type: featureTypes.single_node_text,
        xpath: "/src:constructor/src:annotation/src:name/text()",
        description: "constructor with ( annotation \"<TEMP_0>\" )",
        weight: 5,
        FeatureObject: {
            key: "constructor",
            withChildren: {key: "annotation", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    constr_name: {
        type: featureTypes.single_node_text,
        xpath: "/src:constructor/src:name/text()",
        description: "constructor with ( name \"<TEMP_0>\" )",
        weight: 40,
        FeatureObject: {
            key: "constructor",
            withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    constr_vis: {
        type: featureTypes.single_node_text,
        xpath: "/src:constructor/src:specifier[contains(\"public private protected\",text())]/text()",
        description: "constructor with ( visibility \"<TEMP_0>\" )",
        weight: 1,
        FeatureObject: {
            key: "constructor",
            withChildren: {key: "visibility", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    constr_empty_body: {
        type: featureTypes.no_node,
        xpath: "/src:constructor[not(src:block/*[not(self::src:comment)])]",
        description: "constructor with ( \"Empty Body\" )",
        weight: 5,
        FeatureObject: {
            key: "constructor",
            withChildren: {key: "comment", value: {word: "Empty Body", type: "text"}}
        }
    },
    constr_param_type: {
        type: featureTypes.single_node_and_children_text,
        xpath: "/src:constructor/src:parameter_list/" +
            "src:parameter/src:decl/src:type/src:name",
        description: "constructor with ( parameter with type  \"<TEMP_0>\" )",
        weight: 5,
        FeatureObject: {
            key: "constructor",
            withChildren: {
                key: "parameter", withChildren: {key: "type", value: {word: "<TEMP_0>", type: "text"}}
            }
        }
    },
    constr_param_name: {
        type: featureTypes.single_node_text,
        xpath: "/src:constructor/src:parameter_list/src:parameter/src:decl/src:name/text()",
        description: "constructor with ( parameter with name  \"<TEMP_0>\" )",
        weight: 30,
        FeatureObject: {
            key: "constructor",
            withChildren: {
                key: "parameter", withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
            }
        }
    },
    constr_param_name_ends_with: {
        type: featureTypes.single_node_text_ends_with,
        xpath: "/src:constructor/src:parameter_list/src:parameter/src:decl/src:name/text()",
        description: "constructor with ( parameter with name  \"<TEMP_0>\" )",
        weight: 29,
        FeatureObject: {
            key: "constructor",
            withChildren: {
                key: "parameter", withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
            }
        }
    },
    constr_param_name_starts_with: {
        type: featureTypes.single_node_text_starts_with,
        xpath: "/src:constructor/src:parameter_list/src:parameter/src:decl/src:name/text()",
        description: "constructor with ( parameter with name  \"<TEMP_0>\" )",
        weight: 28,
        FeatureObject: {
            key: "constructor",
            withChildren: {
                key: "parameter", withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
            }
        }
    },

    func_annotation: {
        type: featureTypes.single_node_text,
        xpath: "/src:function/src:annotation/src:name/text()",
        description: "function with ( annotation \"<TEMP_0>\" )",
        weight: 5,
        FeatureObject: {
            key: "function",
            withChildren: {key: "annotation", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    func_vis: {
        type: featureTypes.single_node_text,
        xpath: "/src:function/src:specifier[contains(\"public private protected\",text())]/text()",
        description: "function with ( visibility \"<TEMP_0>\" )",
        weight: 2,
        FeatureObject: {
            key: "function",
            withChildren: {key: "visibility", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    func_specifier: {
        type: featureTypes.single_node_text,
        xpath: "/src:function/src:specifier" +
            "[not(contains(\"public private protected\",text()))]/text()",
        description: "function with ( specifier \"<TEMP_0>\" )",
        weight: 5,
        FeatureObject: {
            key: "function",
            withChildren: {key: "specifier", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    func_type: {
        type: featureTypes.single_node_and_children_text,
        xpath: "/src:function/src:type/src:name",
        description: "function with ( type \"<TEMP_0>\" )",
        weight: 5,
        FeatureObject: {
            key: "function",
            withChildren: {key: "type", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    func_name: {
        type: featureTypes.single_node_text,
        xpath: "/src:function/src:name/text()",
        description: "function with ( name \"<TEMP_0>\" )",
        weight: 40,
        FeatureObject: {
            key: "function",
            withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    func_name_ends_with: {
        type: featureTypes.single_node_text_ends_with,
        xpath: "/src:function/src:name/text()",
        description: "function with ( name \"<TEMP_0>\" )",
        weight: 39,
        FeatureObject: {
            key: "function",
            withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    func_name_starts_with: {
        type: featureTypes.single_node_text_starts_with,
        xpath: "/src:function/src:name/text()",
        description: "function with ( name \"<TEMP_0>\" )",
        weight: 38,
        FeatureObject: {
            key: "function",
            withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    func_no_param: {
        type: featureTypes.no_node,
        xpath: "/src:function/src:parameter_list[not(src:parameter)]",
        description: "function with ( \"No Parameter\" )",
        weight: 5,
        FeatureObject: {
            key: "function",
            withChildren: {key: "comment", value: {word: "No Parameter", type: "text"}}
        }
    },
    func_param_type: {
        type: featureTypes.single_node_and_children_text,
        xpath: "/src:function/src:parameter_list/src:parameter/src:decl/src:type/src:name",
        description: "function with ( parameter with type  \"<TEMP_0>\" )",
        weight: 5,
        FeatureObject: {
            key: "function",
            withChildren: {
                key: "parameter", withChildren:
                    [{key: "type", value: {word: "<TEMP_0>", type: "text"}}]
            }
        }
    },
    func_param_name: {
        type: featureTypes.single_node_text,
        xpath: "/src:function/src:parameter_list/src:parameter/src:decl/src:name/text()",
        description: "function with ( parameter with name  \"<TEMP_0>\" )",
        weight: 35,
        FeatureObject: {
            key: "function",
            withChildren: {
                key: "parameter", withChildren:
                    [{key: "name", value: {word: "<TEMP_0>", type: "text"}}]
            }
        }
    },
    func_param_name_ends_with: {
        type: featureTypes.single_node_text_ends_with,
        xpath: "/src:function/src:parameter_list/src:parameter/src:decl/src:name/text()",
        description: "function with ( parameter with name  \"<TEMP_0>\" )",
        weight: 34,
        FeatureObject: {
            key: "function",
            withChildren: {
                key: "parameter", withChildren:
                    {key: "name", value: {word: "<TEMP_0>", type: "text"}}
            }
        }
    },
    func_param_name_starts_with: {
        type: featureTypes.single_node_text_starts_with,
        xpath: "/src:function/src:parameter_list/src:parameter/src:decl/src:name/text()",
        description: "function with ( parameter with name  \"<TEMP_0>\" )",
        weight: 33,
        FeatureObject: {
            key: "function",
            withChildren: {
                key: "parameter", withChildren:
                    {key: "name", value: {word: "<TEMP_0>", type: "text"}}
            }
        }
    },

    field_annotation: {
        type: featureTypes.single_node_text,
        xpath: "/src:decl_stmt/src:decl/src:annotation/src:name/text()",
        description: "declaration statement with ( annotation \"<TEMP_0>\" )",
        weight: 5,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {key: "annotation", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    field_vis: {
        type: featureTypes.single_node_text,
        xpath: "/src:decl_stmt/src:decl/src:specifier[contains(\"public private protected\",text())]/text()",
        description: "declaration statement with ( visibility \"<TEMP_0>\" )",
        weight: 1,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {key: "visibility", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    field_specifier: {
        type: featureTypes.single_node_text,
        xpath: "/src:decl_stmt/src:decl/src:specifier" +
            "[not(contains(\"public private protected\",text()))]/text()",
        description: "declaration statement with ( specifier \"<TEMP_0>\" )",
        weight: 5,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {key: "specifier", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    field_type: {
        type: featureTypes.single_node_and_children_text,
        xpath: "/src:decl_stmt/src:decl/src:type/src:name",
        description: "declaration statement with ( type \"<TEMP_0>\" )",
        weight: 5,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {key: "type", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    field_name: {
        type: featureTypes.single_node_text,
        xpath: "/src:decl_stmt/src:decl/src:name/text()",
        description: "declaration statement with ( name \"<TEMP_0>\" )",
        weight: 40,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    field_name_ends_with: {
        type: featureTypes.single_node_text_ends_with,
        xpath: "/src:decl_stmt/src:decl/src:name/text()",
        description: "declaration statement with ( name \"<TEMP_0>\" )",
        weight: 39,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    field_name_starts_with: {
        type: featureTypes.single_node_text_starts_with,
        xpath: "/src:decl_stmt/src:decl/src:name/text()",
        description: "declaration statement with ( name \"<TEMP_0>\" )",
        weight: 38,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    field_has_init: {
        type: featureTypes.no_node,
        xpath: "/src:decl_stmt/src:decl[src:init]",
        description: "declaration statement with ( \"Initialization\" )",
        weight: 5,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {key: "comment", value: {word: "Initialization", type: "text"}}
        }
    },

    constr_call_constr: {
        type: featureTypes.single_node_text,
        xpath: "/src:constructor/src:block//src:expr_stmt/src:expr/src:operator[text()=\"new\"]" +
            "/following-sibling::src:call/src:name/text()|" +
            "/src:constructor/src:block//src:decl_stmt/src:decl/src:init/src:expr/src:operator[text()=\"new\"]" +
            "/following-sibling::src:call/src:name/text()",
        description: "constructor with ( \"Calling Constructor: <TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "constructor",
            withChildren: {key: "comment", value: {word: "Calling Constructor: <TEMP_0>", type: "text"}}
        }
    },
    constr_call_func: {
        type: featureTypes.single_node_text,
        xpath: "/src:constructor/src:block//src:decl_stmt/src:decl/src:init/src:expr/src:call/src:name[not(src:name)]/text()|" +
            "/src:constructor/src:block//src:decl_stmt/src:decl/src:init/src:expr/src:call/src:name/src:name[last()]/text()|" +
            "/src:constructor/src:block//src:expr_stmt/src:expr/src:call/src:name[not(src:name)]/text()|" +
            "/src:constructor/src:block//src:expr_stmt/src:expr/src:call/src:name/src:name[last()]/text()",
        description: "constructor with ( \"Calling Function: <TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "constructor",
            withChildren: {key: "comment", value: {word: "Calling Function: <TEMP_0>", type: "text"}}
        }
    },
    constr_modify_field: {
        // xpath: "/src:constructor/src:block//src:expr_stmt/src:expr/src:operator[text()=\"=\"]" +
        //     "/preceding-sibling::src:name",
        // note: this Xpath query only returns the first element of a field, e.g., this.first.second.last = new_value
        type: featureTypes.single_node_text,
        xpath: "/src:constructor/src:block//src:expr_stmt/src:expr/src:operator[text()=\"=\"]" +
            "/preceding-sibling::src:name[src:name/text()=\"this\"]/src:name[position()=2]/text()",
        description: "constructor with ( \"Modifying Field: <TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "constructor",
            withChildren: {key: "comment", value: {word: "Modifying Field: <TEMP_0>", type: "text"}}
        }
    },

    func_call_constr: {
        type: featureTypes.single_node_text,
        xpath: "/src:function/src:block//src:expr_stmt/src:expr/src:operator[text()=\"new\"]" +
            "/following-sibling::src:call/src:name/text()|" +
            "/src:constructor/src:block//src:decl_stmt/src:decl/src:init/src:expr/src:operator[text()=\"new\"]" +
            "/following-sibling::src:call/src:name/text()",
        description: "function with ( \"Calling Constructor: <TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "function",
            withChildren: {key: "comment", value: {word: "Calling Constructor: <TEMP_0>", type: "text"}}
        }
    },
    func_call_func: {
        type: featureTypes.single_node_text,
        xpath: "/src:function/src:block//src:decl_stmt/src:decl/src:init/src:expr/src:call/src:name[not(src:name)]/text()|" +
            "/src:function/src:block//src:decl_stmt/src:decl/src:init/src:expr/src:call/src:name/src:name[last()]/text()|" +
            "/src:function/src:block//src:expr_stmt/src:expr/src:call/src:name[not(src:name)]/text()|" +
            "/src:function/src:block//src:expr_stmt/src:expr/src:call/src:name/src:name[last()]/text()",
        description: "function with ( \"Calling Function: <TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "function",
            withChildren: {key: "comment", value: {word: "Calling Function: <TEMP_0>", type: "text"}}
        }
    },
    func_modify_field: {
        // xpath: "/src:function/src:block//src:expr_stmt/src:expr/src:operator[text()=\"=\"]" +
        //     "/preceding-sibling::src:name",
        // note: this Xpath query only returns the first element of a field, e.g., this.first.second.last = new_value
        type: featureTypes.single_node_text,
        xpath: "/src:function/src:block//src:expr_stmt/src:expr/src:operator[text()=\"=\"]" +
            "/preceding-sibling::src:name[src:name/text()=\"this\"]/src:name[position()=2]/text()",
        description: "function with ( \"Modifying Field: <TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "function",
            withChildren: {key: "comment", value: {word: "Modifying Field: <TEMP_0>", type: "text"}}
        }
    },

    decl_annotation: {
        type: featureTypes.single_node_text,
        xpath: "/src:decl_stmt/src:decl/src:annotation/src:name/text()",
        description: "declaration statement with ( annotation \"<TEMP_0>\" )",
        weight: 5,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {key: "annotation", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    decl_vis: {
        type: featureTypes.single_node_text,
        xpath: "/src:decl_stmt/src:decl/src:specifier[contains(\"public private protected\",text())]/text()",
        description: "declaration statement with ( visibility \"<TEMP_0>\" )",
        weight: 1,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {key: "visibility", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    decl_specifier: {
        type: featureTypes.single_node_text,
        xpath: "/src:decl_stmt/src:decl/src:specifier" +
            "[not(contains(\"public private protected\",text()))]/text()",
        description: "declaration statement with ( specifier \"<TEMP_0>\" )",
        weight: 5,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {key: "specifier", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    decl_type: {
        type: featureTypes.single_node_and_children_text,
        xpath: "/src:decl_stmt/src:decl/src:type/src:name",
        description: "declaration statement with ( type \"<TEMP_0>\" )",
        weight: 5,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {key: "type", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    decl_name: {
        type: featureTypes.single_node_text,
        xpath: "/src:decl_stmt/src:decl/src:name/text()",
        description: "declaration statement with ( name \"<TEMP_0>\" )",
        weight: 40,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    decl_name_ends_with: {
        type: featureTypes.single_node_text_ends_with,
        xpath: "/src:decl_stmt/src:decl/src:name/text()",
        description: "declaration statement with ( name \"<TEMP_0>\" )",
        weight: 39,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    decl_name_starts_with: {
        type: featureTypes.single_node_text_starts_with,
        xpath: "/src:decl_stmt/src:decl/src:name/text()",
        description: "declaration statement with ( name \"<TEMP_0>\" )",
        weight: 38,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {key: "name", value: {word: "<TEMP_0>", type: "text"}}
        }
    },
    decl_has_init: {
        type: featureTypes.no_node,
        xpath: "/src:decl_stmt/src:decl[src:init]",
        description: "declaration statement with ( \"Initialization\" )",
        weight: 5,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {key: "comment", value: {word: "Initialization", type: "text"}}
        }
    },
    decl_call_function: {
        // xpath: "/src:decl_stmt/src:decl/src:init/src:expr/src:call/src:name",
        // note: this Xpath query only returns the function being called without its preceding identifiers or arguments
        type: featureTypes.single_node_text,
        xpath: "/src:decl_stmt/src:decl/src:init/src:expr/src:call/src:name[not(src:name)]/text()|" +
            "/src:decl_stmt/src:decl/src:init/src:expr/src:call/src:name/src:name[last()]/text()",
        description: "declaration statement with ( \"Initialized by Calling Function: <TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {
                key: "comment",
                value: {word: "Initialized by Calling Function: <TEMP_0>", type: "text"}
            }
        }
    },
    decl_call_function_argument: {
        // xpath: "/src:decl_stmt/src:decl/src:init/src:expr/src:call/src:argument_list/src:argument",
        // note: this Xpath query only returns the function being called without its preceding identifiers or arguments
        type: featureTypes.single_node_text,
        xpath: "/src:decl_stmt/src:decl/src:init/src:expr/src:call/src:argument_list" +
            "/src:argument/src:expr/src:literal/text()|" +
            "/src:decl_stmt/src:decl/src:init/src:expr/src:call/src:argument_list" +
            "/src:argument/src:expr/src:name[not(src:name)]/text()|" +
            "/src:decl_stmt/src:decl/src:init/src:expr/src:call/src:argument_list" +
            "/src:argument/src:expr/src:name/src:name[last()]/text()|" +
            "/src:decl_stmt/src:decl/src:init/src:expr/src:call/src:argument_list" +
            "/src:argument/src:expr/src:call/src:name[not(src:name)]/text()|" +
            "/src:decl_stmt/src:decl/src:init/src:expr/src:call/src:argument_list" +
            "/src:argument/src:expr/src:call/src:name/src:name[last()]/text()",
        description: "declaration statement with ( \"Initialized by Calling a Function With Argument: <TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {
                key: "comment",
                value: {word: "Initialized by Calling a Function With Argument: <TEMP_0>", type: "text"}
            }
        }
    },
    decl_init_value: {
        type: featureTypes.single_node_text,
        xpath: "/src:decl_stmt/src:decl/src:init/src:expr/src:literal/text()|" +
            "/src:decl_stmt/src:decl/src:init/src:expr/src:name[not(src:name)]/text()|" +
            "/src:decl_stmt/src:decl/src:init/src:expr/src:name/src:name[last()]/text()",
        description: "declaration statement with ( \"Initialized with: <TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "declaration statement",
            withChildren: {key: "comment", value: {word: "Initialized with: <TEMP_0>", type: "text"}}
        }
    },

    expr_call_function: {
        // xpath: "/src:expr_stmt/src:expr/*[position()=1 and self::src:call]/src:name",
        // note: this Xpath query only returns the function being called without its preceding identifiers or arguments
        type: featureTypes.single_node_text,
        xpath: "/src:expr_stmt/src:expr/*[position()=1 and self::src:call]/src:name[not(src:name)]/text()|" +
            "/src:expr_stmt/src:expr/*[position()=1 and self::src:call]/src:name/src:name[last()]/text()",
        description: "expression statement with ( \"Calling Function: <TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "expression statement",
            withChildren: {key: "comment", value: {word: "Calling Function: <TEMP_0>", type: "text"}}
        }
    },
    expr_call_function_argument: {
        // xpath: "/src:expr_stmt/src:expr/*[position()=1 and self::src:call]/src:argument_list/src:argument/src:expr",
        // note: this Xpath query only returns the function being called without its preceding identifiers or arguments
        type: featureTypes.single_node_text,
        xpath: "/src:expr_stmt/src:expr/*[position()=1 and self::src:call]/src:argument_list" +
            "/src:argument/src:expr/src:literal/text()|" +
            "/src:expr_stmt/src:expr/*[position()=1 and self::src:call]/src:argument_list" +
            "/src:argument/src:expr/src:name[not(src:name)]/text()|" +
            "/src:expr_stmt/src:expr/*[position()=1 and self::src:call]/src:argument_list" +
            "/src:argument/src:expr/src:name/src:name[last()]/text()|" +
            "/src:expr_stmt/src:expr/*[position()=1 and self::src:call]/src:argument_list" +
            "/src:argument/src:expr/src:call/src:name[not(src:name)]/text()|" +
            "/src:expr_stmt/src:expr/*[position()=1 and self::src:call]/src:argument_list" +
            "/src:argument/src:expr/src:call/src:name/src:name[last()]/text()",
        description: "expression statement with ( \"Calling a Function With Argument: <TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "expression statement",
            withChildren: {
                key: "comment",
                value: {word: "Calling a Function With Argument: <TEMP_0>", type: "text"}
            }
        }
    },
    expr_assignment_caller: {
        // xpath: "/src:expr_stmt/src:expr/src:name[position()=1]",
        // note: this Xpath query only returns the function being called without its preceding identifiers or arguments
        type: featureTypes.single_node_text,
        xpath: "/src:expr_stmt/src:expr/src:name[position()=1]/text()|/src:expr_stmt/src:expr/src:name[position()=1]/src:name[last()]/text()",
        description: "expression statement with ( \"Caller: <TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "expression statement",
            withChildren: {key: "comment", value: {word: "Caller: <TEMP_0>", type: "text"}}
        }
    },
    expr_assignment_callee_value: {
        // xpath: "/src:expr_stmt/src:expr/src:operator[text()="="]/following-sibling::*",
        // note: this Xpath query only returns the function being called without its preceding identifiers or arguments
        type: featureTypes.single_node_text,
        xpath: "/src:expr_stmt/src:expr/src:operator[text()=\"=\"]/following-sibling::src:name[not(src:name)]/text()|" +
            "/src:expr_stmt/src:expr/src:operator[text()=\"=\"]/following-sibling::src:name/src:name[last()]/text()|" +
            "/src:expr_stmt/src:expr/src:operator[text()=\"=\"]/following-sibling::src:literal/text()",
        description: "expression statement with ( \"Assigned Value: <TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "expression statement",
            withChildren: {key: "comment", value: {word: "Assigned Value: <TEMP_0>", type: "text"}}
        }
    },
    expr_assignment_callee_call_function: {
        // xpath: "/src:expr_stmt/src:expr/src:operator[text()=\"=\"]/following-sibling::src:call/src:name",
        // note: this Xpath query only returns the function being called without its preceding identifiers or arguments
        type: featureTypes.single_node_text,
        xpath: "/src:expr_stmt/src:expr/src:operator[text()=\"=\"]/following-sibling::src:call/src:name[not(src:name)]/text()|" +
            "/src:expr_stmt/src:expr/src:operator[text()=\"=\"]/following-sibling::src:call/src:name/src:name[last()]/text()",
        description: "expression statement with ( \"Initialized by Calling Function: <TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "expression statement",
            withChildren: {
                key: "comment",
                value: {word: "Initialized by Calling Function: <TEMP_0>", type: "text"}
            }
        }
    },
    expr_assignment_callee_call_function_argument: {
        // xpath: "/src:expr_stmt/src:expr/src:operator[text()=\"=\"]/following-sibling::src:call/src:argument_list/src:argument",
        // note: this Xpath query only returns the function being called without its preceding identifiers or arguments
        type: featureTypes.single_node_text,
        xpath: "/src:expr_stmt/src:expr/src:operator[text()=\"=\"]/following-sibling::src:call/" +
            "src:argument_list/src:argument/src:expr/src:literal/text()|" +
            "/src:expr_stmt/src:expr/src:operator[text()=\"=\"]/following-sibling::src:call/" +
            "src:argument_list/src:argument/src:expr/src:name[not(src:name)]/text()|" +
            "/src:expr_stmt/src:expr/src:operator[text()=\"=\"]/following-sibling::src:call/" +
            "src:argument_list/src:argument/src:expr/src:name/src:name[last()]/text()|" +
            "/src:expr_stmt/src:expr/src:operator[text()=\"=\"]/following-sibling::src:call/" +
            "src:argument_list/src:argument/src:expr/src:call/src:name[not(src:name)]/text()|" +
            "/src:expr_stmt/src:expr/src:operator[text()=\"=\"]/following-sibling::src:call/" +
            "src:argument_list/src:argument/src:expr/src:call/src:name/src:name[last()]/text()",
        description: "expression statement with ( \"Initialized by Calling a Function With Argument: <TEMP_0>\" )",
        weight: 10,
        FeatureObject: {
            key: "expression statement",
            withChildren: {
                key: "comment",
                value: {word: "Initialized by Calling a Function With Argument: <TEMP_0>", type: "text"}
            }
        }
    },

    /*
  nodes
   */
    class_node: {
        type: featureTypes.node,
        xpath: "/src:unit/src:class",
        description: "class",
    },
    class_field_node: {
        type: featureTypes.node,
        xpath: "/src:class/src:block/src:decl_stmt",
        description: "class with declaration statement",
    },
    class_constr_node: {
        type: featureTypes.node,
        xpath: "/src:class/src:block/src:constructor",
        description: "class with constructor",
    },
    class_function_node: {
        type: featureTypes.node,
        xpath: "/src:class/src:block/src:function",
        description: "class with function",
    },
    class_subclass_node: {
        type: featureTypes.node,
        xpath: "src:class",
        description: "class with subclass",
    },

    class_constr_call_constr_node: {
        type: featureTypes.node,
        xpath: "/src:class/src:block/src:constructor[src:block//src:expr_stmt/src:expr/src:operator[text()=\"new\"]" +
            "/following-sibling::src:call/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:block//src:decl_stmt/src:decl/src:init/src:expr/src:operator[text()=\"new\"]" +
            "/following-sibling::src:call/src:name/text()=\"<IDENTIFIER>\"]",
        description: "constructor with ( \"Calling Constructor: <IDENTIFIER>\" )",
    },
    class_constr_call_func_node: {
        type: featureTypes.node,
        xpath: "/src:class/src:block/src:constructor[src:block//src:decl_stmt/src:decl/src:init/src:expr/src:call" +
            "/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:block//src:decl_stmt/src:decl/src:init/src:expr/src:call/src:name" +
            "/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:block//src:expr_stmt/src:expr/src:call/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:block//src:expr_stmt/src:expr/src:call/src:name/src:name[last()]/text()=\"<IDENTIFIER>\"]",
        description: "constructor with ( \"Calling Function: <IDENTIFIER>\" )",
    },
    class_func_call_constr_node: {
        type: featureTypes.node,
        xpath: "/src:class/src:block/src:function[src:block//src:expr_stmt/src:expr/src:operator[text()=\"new\"]" +
            "/following-sibling::src:call/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:block//src:decl_stmt/src:decl/src:init/src:expr/src:operator[text()=\"new\"]" +
            "/following-sibling::src:call/src:name/text()=\"<IDENTIFIER>\"]",
        description: "function with ( \"Calling Constructor: <IDENTIFIER>\" )",
    },
    class_func_call_func_node: {
        type: featureTypes.node,
        xpath: "/src:class/src:block/src:function[src:block//src:decl_stmt/src:decl/src:init/src:expr/src:call" +
            "/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:block//src:decl_stmt/src:decl/src:init/src:expr/src:call/src:name" +
            "/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:block//src:expr_stmt/src:expr/src:call/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:block//src:expr_stmt/src:expr/src:call/src:name/src:name[last()]/text()=\"<IDENTIFIER>\"]",
        description: "function with ( \"Calling Function: <IDENTIFIER>\" )",
    },
    class_constr_call_field_node: {
        type: featureTypes.node,
        xpath: "/src:class/src:block/src:constructor[" +
            "src:block//src:expr_stmt/src:expr/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:block//src:expr_stmt/src:expr/src:name/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:block//src:expr_stmt/src:expr/src:call/src:argument_list/src:argument//src:name/text()=\"<IDENTIFIER>\" or " +
            "src:block//src:decl_stmt/src:decl/src:init/src:expr/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:block//src:decl_stmt/src:decl/src:init/src:expr/src:name/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:block//src:decl_stmt/src:decl/src:init/src:expr/src:call/src:argument_list/src:argument//src:name/text()=\"<IDENTIFIER>\"" +
            "]",
        description: "constructor with ( \"Calling Field <IDENTIFIER>\" )",
    },
    class_func_call_field_node: {
        type: featureTypes.node,
        xpath: "/src:class/src:block/src:function[" +
            "src:block//src:expr_stmt/src:expr/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:block//src:expr_stmt/src:expr/src:name/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:block//src:expr_stmt/src:expr/src:call/src:argument_list/src:argument//src:name/text()=\"<IDENTIFIER>\" or " +
            "src:block//src:decl_stmt/src:decl/src:init/src:expr/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:block//src:decl_stmt/src:decl/src:init/src:expr/src:name/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:block//src:decl_stmt/src:decl/src:init/src:expr/src:call/src:argument_list/src:argument//src:name/text()=\"<IDENTIFIER>\"" +
            "]",
        description: "function with ( \"Calling Field <IDENTIFIER>\" )",
    },
    expr_call_constr_node: {
        type: featureTypes.node,
        xpath: "//src:expr_stmt/src:expr/src:operator[text()=\"new\"]" +
            "/following-sibling::src:call/src:name/text()=\"<IDENTIFIER>\"",
        description: "expression statement with ( \"Calling Constructor: <IDENTIFIER>\" )",
    },
    decl_call_constr_node: {
        type: featureTypes.node,
        xpath: "//src:decl_stmt/src:decl/src:init/src:expr/src:operator[text()=\"new\"]" +
            "/following-sibling::src:call/src:name/text()=\"<IDENTIFIER>\"",
        description: "declaration statement with ( \"Calling Constructor: <IDENTIFIER>\" )",
    },
    expr_call_func_node: {
        type: featureTypes.node,
        xpath: "//src:expr_stmt[src:expr/src:call/src:name[text()=\"<IDENTIFIER>\" or " +
            "src:name/text()=\"<IDENTIFIER>\"]]",
        description: "expression statement with ( \"Calling Function: <IDENTIFIER>\" )",
    },
    decl_call_func_node: {
        type: featureTypes.node,
        xpath: "//src:decl_stmt[src:decl/src:init/src:expr/src:call/src:name[text()=\"<IDENTIFIER>\" or " +
            "src:name/text()=\"<IDENTIFIER>\"]]",
        description: "declaration statement with ( \"Calling Function: <IDENTIFIER>\" )",
    },
    expr_call_field_node: {
        type: featureTypes.node,
        xpath: "//src:expr_stmt[" +
            "src:expr/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:expr/src:name/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:expr/src:call/src:argument_list/src:argument//src:name/text()=\"<IDENTIFIER>\"" +
            "]",
        description: "expression statement with ( \"Calling Field <IDENTIFIER>\" )",
    },
    decl_call_field_node: {
        type: featureTypes.node,
        xpath: "//src:decl_stmt[src:decl/src:init/src:expr[" +
            "src:name/text()=\"<IDENTIFIER>\" or " +
            "src:name/src:name/text()=\"<IDENTIFIER>\" or " +
            "src:call/src:argument_list/src:argument//src:name/text()=\"<IDENTIFIER>\"" +
            "]]",
        description: "declaration statement with ( \"Calling Field <IDENTIFIER>\" )",
    },

}

/**
 * Used to generate XPath from the grammar
 * <TEMP_0> is going to be replaced with text()="some_value"
 * @type {{xpath: string, comment: string}[]}
 */
export const mapCommentsToXPath = [
    {comment: "No Constructor", xpath: "not(src:block/src:constructor)"},  // class_no_constr , subclass_no_constr
    {comment: "No Function", xpath: "not(src:block/src:function)"},  // class_no_func , subclass_no_func
    {comment: "Empty Body", xpath: "not(src:block/*[not(self::src:comment)])"}, // constr_empty_body
    {comment: "No Parameter", xpath: "src:parameter_list[not(src:parameter)]"}, // func_no_param
    {comment: "Initialization", xpath: "src:init"}, // field_has_init , decl_has_init
    {
        comment: "Calling Constructor: ", //   constr_call_constr , func_call_constr
        xpath: "src:block//src:expr_stmt/src:expr/src:operator[text()=\"new\"]" +
            "/following-sibling::src:call/src:name[<TEMP_0>]|" +
            "src:block//src:decl_stmt/src:decl/src:init/src:expr/src:operator[text()=\"new\"]" +
            "/following-sibling::src:call/src:name[<TEMP_0>]"
    },
    {
        comment: "Calling Function: ",  //      constr_call_func , func_call_func , expr_call_function
        xpath: "src:block//src:decl_stmt/src:decl/src:init/src:expr/src:call/src:name[not(src:name)][<TEMP_0>]|" +
            "src:block//src:decl_stmt/src:decl/src:init/src:expr/src:call/src:name/src:name[last()][<TEMP_0>]|" +
            "src:block//src:expr_stmt/src:expr/src:call/src:name[not(src:name)][<TEMP_0>]|" +
            "src:block//src:expr_stmt/src:expr/src:call/src:name/src:name[last()][<TEMP_0>]|" +
            "*[position()=1 and self::src:call]/src:name[not(src:name)][<TEMP_0>]|" +
            "*[position()=1 and self::src:call]/src:name/src:name[last()][<TEMP_0>]",
    },
    {
        comment: "Modifying Field: ",  //       constr_modify_field , func_modify_field
        xpath: "src:block//src:expr_stmt/src:expr/src:operator[text()=\"=\"]" +
            "/preceding-sibling::src:name[src:name/text()=\"this\"]/src:name[position()=2][<TEMP_0>]"
    },
    {
        comment: "Calling a Function With Argument: ",  //     expr_call_function_argument
        xpath: "*[position()=1 and self::src:call]/src:argument_list" +
            "/src:argument/src:expr/src:literal[<TEMP_0>]|" +
            "*[position()=1 and self::src:call]/src:argument_list" +
            "/src:argument/src:expr/src:name[not(src:name)][<TEMP_0>]|" +
            "*[position()=1 and self::src:call]/src:argument_list" +
            "/src:argument/src:expr/src:name/src:name[last()][<TEMP_0>]|" +
            "*[position()=1 and self::src:call]/src:argument_list" +
            "/src:argument/src:expr/src:call/src:name[not(src:name)][<TEMP_0>]|" +
            "*[position()=1 and self::src:call]/src:argument_list" +
            "/src:argument/src:expr/src:call/src:name/src:name[last()][<TEMP_0>]"
    },
    {
        comment: "Initialized by Calling Function: ",  //    decl_call_function , expr_assignment_callee_call_function
        xpath: "src:init/src:expr/src:call/src:name[not(src:name)][<TEMP_0>]|" +
            "src:init/src:expr/src:call/src:name/src:name[last()][<TEMP_0>]|" +
            "src:operator[text()=\"=\"]/following-sibling::src:call/src:name[not(src:name)][<TEMP_0>]|" +
            "src:operator[text()=\"=\"]/following-sibling::src:call/src:name/src:name[last()][<TEMP_0>]"
    },
    {  //   decl_call_function_argument , expr_assignment_callee_call_function_argument
        comment: "Initialized by Calling a Function With Argument: ",
        xpath: "src:init/src:expr/src:call/src:argument_list" +
            "/src:argument/src:expr/src:literal[<TEMP_0>]|" +
            "src:init/src:expr/src:call/src:argument_list" +
            "/src:argument/src:expr/src:name[not(src:name)][<TEMP_0>]|" +
            "src:init/src:expr/src:call/src:argument_list" +
            "/src:argument/src:expr/src:name/src:name[last()][<TEMP_0>]|" +
            "src:init/src:expr/src:call/src:argument_list" +
            "/src:argument/src:expr/src:call/src:name[not(src:name)][<TEMP_0>]|" +
            "src:init/src:expr/src:call/src:argument_list" +
            "/src:argument/src:expr/src:call/src:name/src:name[last()][<TEMP_0>]|" +
            "src:operator[text()=\"=\"]/following-sibling::src:call/" +
            "src:argument_list/src:argument/src:expr/src:literal[<TEMP_0>]|" +
            "src:operator[text()=\"=\"]/following-sibling::src:call/" +
            "src:argument_list/src:argument/src:expr/src:name[not(src:name)][<TEMP_0>]|" +
            "src:operator[text()=\"=\"]/following-sibling::src:call/" +
            "src:argument_list/src:argument/src:expr/src:name/src:name[last()][<TEMP_0>]|" +
            "src:operator[text()=\"=\"]/following-sibling::src:call/" +
            "src:argument_list/src:argument/src:expr/src:call/src:name[not(src:name)][<TEMP_0>]|" +
            "src:operator[text()=\"=\"]/following-sibling::src:call/" +
            "src:argument_list/src:argument/src:expr/src:call/src:name/src:name[last()][<TEMP_0>]",
    },
    {
        comment: "Initialized with: ", //         decl_init_value
        xpath: "src:init/src:expr/src:literal[<TEMP_0>]|" +
            "src:init/src:expr/src:name[not(src:name)][<TEMP_0>]|" +
            "src:init/src:expr/src:name/src:name[last()][<TEMP_0>]"
    },
    {
        comment: "Caller: ",  //                expr_assignment_caller
        xpath: "src:name[position()=1]/text()|/src:expr_stmt/src:expr/src:name[position()=1]/src:name[last()][<TEMP_0>]",
    },
    {
        comment: "Assigned Value: ",  //        expr_assignment_callee_value
        xpath: "src:operator[text()=\"=\"]/following-sibling::src:name[not(src:name)][<TEMP_0>]|" +
            "src:operator[text()=\"=\"]/following-sibling::src:name/src:name[last()][<TEMP_0>]|" +
            "src:operator[text()=\"=\"]/following-sibling::src:literal/[<TEMP_0>]",
    },
];

