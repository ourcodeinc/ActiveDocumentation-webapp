export const discard_time = 3000000; // 50 minutes in milliseconds
export const minOccurrence = 2;
export const minUtility = 500;
export const minSupport = 2;
export const algorithm = "CHUI-MinerMax"; // "CHUI-Miner" or "CHUI-MinerMax"


/*  processing  */

// the prefix and postfix of files written for mining rules
export const attributeFileNames = {
    prefix: "AttributeEncoding_",
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

// types of features extracted from a codebase
export const featureTypes = {
    node: "node_is_selected",
    no_node: "no_node_is_selected",
    single_node_text: "select_a_single_node",
    single_node_and_children_text: "select_a_single_node_and_its_children",
    multiple_nodes_texts: "select_multiple_nodes",
    multiple_nodes_and_children_texts: "select_multiple_nodes_and_their_children",
};

// the set of nodes extracts from a selected scope (single element) in the IDE
export const focusElementType = [
    {
        nodeName: "class",
        mapFocusedElementToFeaturesKey: "class_spec_body",
        identifierXpath: "/src:class/src:name/text()",
        title: "class"
    },
    {
        nodeName: "constructor",
        mapFocusedElementToFeaturesKey: "constr_spec_body",
        identifierXpath: "/src:constructor/src:name/text()",
        title: "class constructor"
    },
    {
        nodeName: "function",
        mapFocusedElementToFeaturesKey: "func_spec_body",
        identifierXpath: "/src:function/src:name/text()",
        title: "class function"
    },
    {
        nodeName: "decl_stmt",
        mapFocusedElementToFeaturesKey: "field_spec",
        identifierXpath: "/src:decl_stmt/src:decl/src:name/text()",
        title: "class field"
    },
]

// given an identifier:
// find node of constructor/function calling the identifier
const nodes = {
    class_node : "class_node",
    class_field_node : "class_field_node",
    class_constr_node : "class_constr_node",
    class_function_node : "class_function_node",
    class_subclass_node: "class_subclass_node",

    class_constr_call_constr_node : "class_constr_call_constr_node",
    class_constr_call_func_node : "class_constr_call_func_node",
    class_func_call_constr_node : "class_func_call_constr_node",
    class_func_call_func_node : "class_func_call_func_node",
    class_constr_call_field_node : "class_constr_call_field_node",
    class_func_call_field_node : "class_func_call_field_node",
    expr_call_constr_node : "expr_call_constr_node",
    decl_call_constr_node : "decl_call_constr_node",
    expr_call_func_node : "expr_call_func_node",
    decl_call_func_node : "decl_call_func_node",
    expr_call_field_node : "expr_call_field_node",
    decl_call_field_node : "decl_call_field_node",
}

const class_spec = ["class_annotation", "class_vis", "class_specifier", "class_name",
    "class_extend", "class_impl",
    "class_no_constr", "class_no_func"];

const subclass_spec = ["subclass_annotation", "subclass_vis", "subclass_specifier",
    "subclass_name", "subclass_extend", "subclass_impl",
    "subclass_no_constr", "subclass_no_func"];

const field_spec = ["decl_annotation", "decl_vis", "decl_specifier",
    // "decl_type", "decl_name",
    "decl_type_name", "decl_has_init"];

const constr_spec = ["constr_annotation", "constr_vis", "constr_empty_body",
    // "constr_param_type", "constr_param_name",
    "constr_param_type_name"
];

const constr_spec_body = ["constr_annotation", "constr_vis", "constr_empty_body",
    // "constr_param_type", "constr_param_name",
    "constr_param_type_name",
    "constr_call_constr", "constr_call_func", "constr_modify_field"
];

const func_spec = ["func_annotation", "func_vis", "func_specifier", "func_type", "func_name",
    "func_no_param", //"func_param_type", "func_param_name",
    "func_param_type_name"
];

const func_spec_body = ["func_annotation", "func_vis", "func_specifier", "func_type", "func_name",
    "func_no_param",
    // "func_param_type", "func_param_name",
    "func_param_type_name",
    "func_call_constr", "func_call_func", "func_modify_field"
];

const expr_spec = [
    "expr_call_function", "expr_call_function_argument", "expr_assignment_caller", "expr_assignment_callee_value",
    "expr_assignment_callee_call_function", "expr_assignment_callee_call_function_argument"
];

const decl_spec = ["decl_annotation", "decl_vis", "decl_specifier",
    // "decl_type", "decl_name",
    "decl_has_init", "decl_type_name",
    "decl_call_function", "decl_call_function_argument", "decl_init_value"
];

const mappedElementType = {
    class: "class",
    field: "field",
    constructor: "constructor",
    function: "function",
    expression: "expression",
    declaration: "declaration"
}

export const groupTitle = {
    class_fields_in_related_classes: "Features of class fields in related classes",
    constructors_in_related_classes: "Features of class constructors in related classes",
    functions_in_related_classes: "Features of class functions in related classes",
    subclasses_in_related_classes: "Features of subclasses in related classes",

    expression_statements_in_constructors_calling_constructors_focused_element:
        "Features of declaration statements statements in constructors calling the constructor (focused element)",
    declaration_statements_in_constructors_calling_constructors_focused_element:
        "Features of declaration statements statements in constructors calling the constructor (focused element)",
    expression_statements_in_functions_calling_constructors_focused_element: 
        "Features of expression statements in functions calling the constructor (focused element)",
    declaration_statements_in_functions_calling_constructors_focused_element:
        "Features of declaration statements in functions calling the constructor (focused element)",

    expression_statements_in_constructors_calling_functions_focused_element:
        "Features of declaration statements statements in constructors calling the function (focused element)",
    declaration_statements_in_constructors_calling_functions_focused_element:
        "Features of declaration statements statements in constructors calling the function (focused element)",
    expression_statements_in_functions_calling_functions_focused_element:
        "Features of expression statements in functions calling the function (focused element)",
    declaration_statements_in_functions_calling_functions_focused_element:
        "Features of declaration statements in functions calling the function (focused element)",

    expression_statements_in_constructors_reading_modifying_field_focused_element:
        "Features of expression statements in constructors reading/modifying the field (focused element)",
    declaration_statements_in_constructors_reading_modifying_field_focused_element:
        "Features of declaration statements statements in constructors reading/modifying the field (focused element)",
    expression_statements_in_functions_reading_modifying_field_focused_element:
        "Features of expression statements in functions reading/modifying the field (focused element)",
    declaration_statements_in_functions_reading_modifying_field_focused_element:
        "Features of declaration statements statements in functions reading/modifying the field (focused element)",
};

export const mapFocusedElementToFeatures = {
    class_spec_body: {
        spec: [
            {
                container: {
                    node: nodes.class_node,
                    type: mappedElementType.class,
                    featureSet: class_spec,
                    featureQueryPrefix: ""
                },
                content_groups: [
                    {
                        node: nodes.class_field_node,
                        type: mappedElementType.field,
                        featureSet: field_spec,
                        id: "class_fields_in_related_classes"
                    },
                    {
                        node: nodes.class_constr_node,
                        type: mappedElementType.constructor,
                        featureSet: constr_spec,
                        id: "constructors_in_related_classes"
                    },
                    {
                        node: nodes.class_function_node,
                        type: mappedElementType.function,
                        featureSet: func_spec,
                        id: "functions_in_related_classes"
                    }
                    ,
                    {
                        node: nodes.class_subclass_node,
                        type: mappedElementType.class,
                        featureSet: subclass_spec,
                        id: "subclasses_in_related_classes"
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
                    node: nodes.class_node,
                    type: mappedElementType.class,
                    featureSet: class_spec,
                },
                content_groups: [
                    {
                        node: nodes.class_constr_node,
                        type: mappedElementType.constructor,
                        featureSet: constr_spec_body,
                        id: "constructors_in_related_classes"
                    },
                ]
            }
        ],
        usage: [
            {
                container: {
                    node: nodes.class_constr_call_constr_node,
                    type: mappedElementType.constructor,
                    featureSet: constr_spec,
                    featureQueryPrefix: "/"
                },
                content_groups: [
                    {
                        node: nodes.expr_call_constr_node,
                        type: mappedElementType.expression,
                        featureSet: expr_spec,
                        id: "expression_statements_in_constructors_calling_constructors_focused_element"
                    },
                    {
                        node: nodes.decl_call_constr_node,
                        type: mappedElementType.declaration,
                        featureSet: decl_spec,
                        id: "declaration_statements_in_constructors_calling_constructors_focused_element"
                    }
                ]
            },
            {
                container: {
                    node: nodes.class_func_call_constr_node,
                    type: mappedElementType.function,
                    featureSet: func_spec,
                    featureQueryPrefix: "/"
                },
                content_groups: [
                    {
                        node: nodes.expr_call_constr_node,
                        type: mappedElementType.expression,
                        featureSet: expr_spec,
                        id: "expression_statements_in_functions_calling_constructors_focused_element"
                    },
                    {
                        node: nodes.decl_call_constr_node,
                        type: mappedElementType.declaration,
                        featureSet: decl_spec,
                        id: "declaration_statements_in_functions_calling_constructors_focused_element"
                    }
                ]
            }
        ]
    },
    func_spec_body: {
        spec: [
            {
                container: {
                    node: nodes.class_node,
                    type: mappedElementType.class,
                    featureSet: class_spec,
                    featureQueryPrefix: "/"
                },
                content_groups: [
                    {
                        node: nodes.class_function_node,
                        type: mappedElementType.function,
                        featureSet: func_spec_body,
                        id: "functions_in_related_classes"
                    },
                ]
            }
        ],
        usage: [
            {
                container: {
                    node: nodes.class_constr_call_func_node,
                    type: mappedElementType.constructor,
                    featureSet: constr_spec,
                    featureQueryPrefix: "/"
                },
                content_groups: [
                    {
                        node: nodes.expr_call_func_node,
                        type: mappedElementType.expression,
                        featureSet: expr_spec,
                        id: "expression_statements_in_constructors_calling_functions_focused_element"
                    },
                    {
                        node: nodes.decl_call_func_node,
                        type: mappedElementType.declaration,
                        featureSet: decl_spec,
                        id: "declaration_statements_in_constructors_calling_functions_focused_element"
                    }
                ]
            },
            {
                container: {
                    node: nodes.class_func_call_func_node,
                    type: mappedElementType.function,
                    featureSet: func_spec,
                    featureQueryPrefix: "/"
                },
                content_groups: [
                    {
                        node: nodes.expr_call_func_node,
                        type: mappedElementType.expression,
                        featureSet: expr_spec,
                        id: "expression_statements_in_functions_calling_functions_focused_element"
                    },
                    {
                        node: nodes.decl_call_func_node,
                        type: mappedElementType.declaration,
                        featureSet: decl_spec,
                        id: "declaration_statements_in_functions_calling_functions_focused_element"
                    }
                ]
            }
        ]
    },
    field_spec: {
        spec: [
            {
                container: {
                    node: nodes.class_node,
                    type: mappedElementType.class,
                    featureSet: class_spec,
                    featureQueryPrefix: "/"
                },
                content_groups: [
                    {
                        node: nodes.class_field_node,
                        type: mappedElementType.field,
                        featureSet: field_spec,
                        id: "class_fields_in_related_classes"
                    },
                ]
            }
        ],
        usage: [
            {
                container: {
                    node: nodes.class_constr_call_field_node,
                    type: mappedElementType.constructor,
                    featureSet: constr_spec,
                    featureQueryPrefix: "/",
                },
                content_groups: [
                    {
                        node: nodes.expr_call_field_node,
                        type: mappedElementType.expression,
                        featureSet: expr_spec,
                        id: "expression_statements_in_constructors_reading_modifying_field_focused_element"
                    },
                    {
                        node: nodes.decl_call_field_node,
                        type: mappedElementType.declaration,
                        featureSet: decl_spec,
                        id: "declaration_statements_in_constructors_reading_modifying_field_focused_element"
                    }
                ]
            },
            {
                container: {
                    node: nodes.class_func_call_field_node,
                    type: mappedElementType.function,
                    featureSet: func_spec,
                    featureQueryPrefix: "/"
                },
                content_groups: [
                    {
                        node: nodes.expr_call_field_node,
                        type: mappedElementType.expression,
                        featureSet: expr_spec,
                        id: "expression_statements_in_functions_reading_modifying_field_focused_element"
                    },
                    {
                        node: nodes.decl_call_field_node,
                        type: mappedElementType.declaration,
                        featureSet: decl_spec,
                        id: "declaration_statements_in_functions_reading_modifying_field_focused_element"
                    }
                ]
            }
        ]
    },
};


/**
 * @type {{id: string, text: string, priority: number}[]}
 */
export const breakFeatureDescription = [
    {id: "class", priority: 1, text: "class with "},
    {id: "constructor", priority: 2, text: "constructor with "},
    {id: "function", priority: 3, text: "function with "},
    {id: "subclass", priority: 4, text: "subclass with "},
    {id: "declaration statement", priority: 5, text: "declaration statement with "},
    {id: "expression statement", priority: 6, text: "expression statement with "},
];

// general description of features
// weight is a default value set as a utility of a feature
/**
 * @type {Object.<string, {type: string, xpath:string, description:string, weight: number,
 * nodeName: string[]|undefined, nodes: string[]|undefined}>}
 */
export const new_features = {
    class_annotation: {
        type: featureTypes.single_node_text,
        xpath: "/src:class/src:annotation/src:name/text()",
        description: "class with ( annotation \"<TEMP_0>\" )",
        weight: 5,
        nodeName: ["Annotation"]
    },
    class_vis: {
        type: featureTypes.single_node_text,
        xpath: "/src:class/src:specifier[contains(\"public private protected\",text())]/text()",
        description: "class with ( visibility \"<TEMP_0>\" )",
        weight: 1,
        nodeName: ["Visibility"]
    },
    class_specifier: {
        type: featureTypes.single_node_text,
        xpath: "/src:class/src:specifier" +
            "[not(contains(\"public private protected\",text()))]/text()",
        description: "class with ( specifier \"<TEMP_0>\" )",
        weight: 5,
        nodeName: ["Specifier"]
    },
    class_name: {
        type: featureTypes.single_node_text,
        xpath: "/src:class/src:name/text()",
        description: "class with ( name \"<TEMP_0>\" )",
        weight: 10,
        nodeName: ["Name"]
    },
    class_extend: {
        type: featureTypes.single_node_text,
        xpath: "/src:class/src:super/src:extends/src:name/text()",
        description: "class with ( extension of \"<TEMP_0>\" )",
        weight: 10,
        nodeName: ["Extension"]
    },
    class_impl: {
        type: featureTypes.single_node_text,
        xpath: "/src:class/src:super/src:implements/src:name/text()",
        description: "class with ( implementation of \"<TEMP_0>\" )",
        weight: 10,
        nodeName: ["Implementation"]
    },
    class_no_constr: {
        type: featureTypes.no_node,
        xpath: "/src:class[not(src:block/src:constructor)]",
        description: "class with ( \"No Constructor\" )",
        weight: 5,
    },
    class_no_func: {
        type: featureTypes.no_node,
        xpath: "/src:class[not(src:block/src:function)]",
        description: "class with ( \"No Function\" )",
        weight: 5,
    },

    subclass_annotation: {
        type: featureTypes.single_node_text,
        xpath: "/src:class/src:annotation/src:name/text()",
        description: "subclass with ( annotation \"<TEMP_0>\" )",
        weight: 10,
        nodeName: ["Annotation"]
    },
    subclass_vis: {
        type: featureTypes.single_node_text,
        xpath: "/src:class/src:specifier[contains(\"public private protected\",text())]/text()",
        description: "subclass with ( visibility \"<TEMP_0>\" )",
        weight: 5,
        nodeName: ["Visibility"]
    },
    subclass_specifier: {
        type: featureTypes.single_node_text,
        xpath: "/src:class/src:specifier" +
            "[not(contains(\"public private protected\",text()))]/text()",
        description: "subclass with ( specifier \"<TEMP_0>\" )",
        weight: 5,
        nodeName: ["Specifier"]
    },
    subclass_name: {
        type: featureTypes.single_node_text,
        xpath: "/src:class/src:name/text()",
        description: "subclass with ( name \"<TEMP_0>\" )",
        weight: 10,
        nodeName: ["Name"]
    },
    subclass_extend: {
        type: featureTypes.single_node_text,
        xpath: "/src:class/src:super/src:extends/src:name/text()",
        description: "subclass with ( extension of \"<TEMP_0>\" )",
        weight: 10,
        nodeName: ["Extension"]
    },
    subclass_impl: {
        type: featureTypes.single_node_text,
        xpath: "/src:class/src:super/src:implements/src:name/text()",
        description: "subclass with ( implementation of \"<TEMP_0>\" )",
        weight: 10,
        nodeName: ["Implementation"]
    },
    subclass_no_constr: {
        type: featureTypes.no_node,
        xpath: "/src:class[not(src:block/src:constructor)]",
        description: "subclass with ( \"No Constructor\" )",
        weight: 5,
    },
    subclass_no_func: {
        type: featureTypes.no_node,
        xpath: "/src:class[not(src:block/src:function)]",
        description: "subclass with ( \"No Function\" )",
        weight: 5,
    },


    constr_annotation: {
        type: featureTypes.single_node_text,
        xpath: "/src:constructor/src:annotation/src:name/text()",
        description: "constructor with ( annotation \"<TEMP_0>\" )",
        weight: 5,
        nodeName: ["Annotation"]
    },
    constr_vis: {
        type: featureTypes.single_node_text,
        xpath: "/src:constructor/src:specifier[contains(\"public private protected\",text())]/text()",
        description: "constructor with ( visibility \"<TEMP_0>\" )",
        weight: 1,
        nodeName: ["Visibility"]
    },
    constr_empty_body: {
        type: featureTypes.no_node,
        xpath: "/src:constructor[not(src:block/*[not(self::src:comment)])]",
        description: "constructor with ( \"Empty Body\" )",
        weight: 5,
    },
    // constr_param_type: {
    //     type: featureTypes.single_node_and_children_text,
    //     xpath: "/src:constructor/src:parameter_list/" +
    //         "src:parameter/src:decl/src:type/src:name",
    //     description: "constructor with ( parameter with type  \"<TEMP_0>\" )",
    //     weight: 5,
    //     nodeName: ["Type"]
    // },
    // constr_param_name: {
    //     type: featureTypes.single_node_text,
    //     xpath: "/src:constructor/src:parameter_list/src:parameter/src:decl/src:name/text()",
    //     description: "constructor with ( parameter with name  \"<TEMP_0>\" )",
    //     weight: 10,
    //     nodeName: ["Name"]
    // },
    constr_param_type_name: {
        type: featureTypes.multiple_nodes_texts,
        xpath: "/src:constructor/src:parameter_list/src:parameter",
        nodes: ["/src:parameter/src:decl/src:type/src:name/text()", "/src:parameter/src:decl/src:name/text()"],
        description: "constructor with ( parameter with ( type \"<TEMP_0>\" and name \"<TEMP_1>\" ) )",
        weight: 20,
        nodeName: ["type", "name"]
    },

    func_annotation: {
        type: featureTypes.single_node_text,
        xpath: "/src:function/src:annotation/src:name/text()",
        description: "function with ( annotation \"<TEMP_0>\") ",
        weight: 5,
        nodeName: ["Annotation"]
    },
    func_vis: {
        type: featureTypes.single_node_text,
        xpath: "/src:function/src:specifier[contains(\"public private protected\",text())]/text()",
        description: "function with ( visibility \"<TEMP_0>\" )",
        weight: 2,
        nodeName: ["Visibility"]
    },
    func_specifier: {
        type: featureTypes.single_node_text,
        xpath: "/src:function/src:specifier" +
            "[not(contains(\"public private protected\",text()))]/text()",
        description: "function with ( specifier \"<TEMP_0>\" )",
        weight: 5,
        nodeName: ["Specifier"]
    },
    func_type: {
        type: featureTypes.single_node_and_children_text,
        xpath: "/src:function/src:type/src:name",
        description: "function with ( type \"<TEMP_0>\" )",
        weight: 5,
        nodeName: ["Type"]
    },
    func_name: {
        type: featureTypes.single_node_text,
        xpath: "/src:function/src:name/text()",
        description: "function with ( name \"<TEMP_0>\" )",
        weight: 10,
        nodeName: ["Name"]
    },
    func_no_param: {
        type: featureTypes.no_node,
        xpath: "/src:function/src:parameter_list[not(src:parameter)]",
        description: "function with ( \"No Parameter\" )",
        weight: 5,
    },
    // func_param_type: {
    //     type: featureTypes.single_node_and_children_text,
    //     xpath: "/src:function/src:parameter_list/src:parameter/src:decl/src:type/src:name",
    //     description: "function with ( parameter with type  \"<TEMP_0>\" )",
    //     weight: 5,
    //     nodeName: ["Type"]
    // },
    // func_param_name: {
    //     type: featureTypes.single_node_text,
    //     xpath: "/src:function/src:parameter_list/src:parameter/src:decl/src:name/text()",
    //     description: "function with ( parameter with name  \"<TEMP_0>\" )",
    //     weight: 5,
    //     nodeName: ["Name"]
    // },
    func_param_type_name: {
        type: featureTypes.multiple_nodes_texts,
        xpath: "/src:function/src:parameter_list/src:parameter",
        nodes: ["/src:parameter/src:decl/src:type/src:name/text()", "/src:parameter/src:decl/src:name/text()"],
        description: "function with ( parameter with ( type \"<TEMP_0>\" and name \"<TEMP_1>\" ) )",
        weight: 20,
        nodeName: ["type", "name"]
    },

    decl_annotation: {
        type: featureTypes.single_node_text,
        xpath: "/src:decl_stmt/src:decl/src:annotation/src:name/text()",
        description: "declaration statement with ( annotation \"<TEMP_0>\" )",
        weight: 5,
        nodeName: ["Annotation"]
    },
    decl_vis: {
        type: featureTypes.single_node_text,
        xpath: "/src:decl_stmt/src:decl/src:specifier[contains(\"public private protected\",text())]/text()",
        description: "declaration statement with ( visibility \"<TEMP_0>\" )",
        weight: 1,
        nodeName: ["Visibility"]
    },
    decl_specifier: {
        type: featureTypes.single_node_text,
        xpath: "/src:decl_stmt/src:decl/src:specifier" +
            "[not(contains(\"public private protected\",text()))]/text()",
        description: "declaration statement with ( specifier \"<TEMP_0>\" )",
        weight: 5,
        nodeName: ["Specifier"]
    },
    // decl_type: {
    //     type: featureTypes.single_node_and_children_text,
    //     xpath: "/src:decl_stmt/src:decl/src:type/src:name",
    //     description: "declaration statement with ( type \"<TEMP_0>\" )",
    //     weight: 5,
    //     nodeName: ["Type"]
    // },
    // decl_name: {
    //     type: featureTypes.single_node_text,
    //     xpath: "/src:decl_stmt/src:decl/src:name/text()",
    //     description: "declaration statement with ( name \"<TEMP_0>\" )",
    //     weight: 5,
    //     nodeName: ["Name"]
    // },
    decl_type_name: {
        type: featureTypes.multiple_nodes_texts,
        xpath: "/src:decl_stmt/src:decl",
        nodes: ["/src:decl/src:type/src:name/text()", "/src:decl/src:name/text()"],
        description: "declaration statement with ( type \"<TEMP_0>\" and name \"<TEMP_1>\" )",
        weight: 20,
        nodeName: ["type", "name"]
    },
    decl_has_init: {
        type: featureTypes.no_node,
        xpath: "/src:decl_stmt/src:decl[src:init]",
        description: "declaration statement with ( \"Initialization\" )",
        weight: 5,
    },

    constr_call_constr: {
        type: featureTypes.single_node_text,
        xpath: "/src:constructor/src:block//src:expr_stmt/src:expr/src:operator[text()=\"new\"]" +
            "/following-sibling::src:call/src:name/text()|" +
            "/src:constructor/src:block//src:decl_stmt/src:decl/src:init/src:expr/src:operator[text()=\"new\"]" +
            "/following-sibling::src:call/src:name/text()",
        description: "constructor with ( \"Calling Constructor: <TEMP_0>\" )",
        weight: 10,
    },
    constr_call_func: {
        type: featureTypes.single_node_text,
        xpath: "/src:constructor/src:block//src:decl_stmt/src:decl/src:init/src:expr/src:call/src:name[not(src:name)]/text()|" +
            "/src:constructor/src:block//src:decl_stmt/src:decl/src:init/src:expr/src:call/src:name/src:name[last()]/text()|" +
            "/src:constructor/src:block//src:expr_stmt/src:expr/src:call/src:name[not(src:name)]/text()|" +
            "/src:constructor/src:block//src:expr_stmt/src:expr/src:call/src:name/src:name[last()]/text()",
        description: "constructor with ( \"Calling Function: <TEMP_0>\" )",
        weight: 10,
    },
    constr_modify_field: {
        // xpath: "/src:constructor/src:block//src:expr_stmt/src:expr/src:operator[text()=\"=\"]" +
        //     "/preceding-sibling::src:name",
        // note: this Xpath query only returns the first element of a field, e.g., this.first.second.last = new_value
        type: featureTypes.single_node_text,
        xpath: "/src:constructor/src:block//src:expr_stmt/src:expr/src:operator[text()=\"=\"]" +
            "/preceding-sibling::src:name[src:name/text()=\"this\"]/src:name[position()=2]/text()",
        description: "constructor with ( \"Modifying Field <TEMP_0>\" )",
        weight: 10,
    },

    func_call_constr: {
        type: featureTypes.single_node_text,
        xpath: "/src:function/src:block//src:expr_stmt/src:expr/src:operator[text()=\"new\"]" +
            "/following-sibling::src:call/src:name/text()|" +
            "/src:constructor/src:block//src:decl_stmt/src:decl/src:init/src:expr/src:operator[text()=\"new\"]" +
            "/following-sibling::src:call/src:name/text()",
        description: "function with ( \"Calling Constructor: <TEMP_0>\" )",
        weight: 10,
    },
    func_call_func: {
        type: featureTypes.single_node_text,
        xpath: "/src:function/src:block//src:decl_stmt/src:decl/src:init/src:expr/src:call/src:name[not(src:name)]/text()|" +
            "/src:function/src:block//src:decl_stmt/src:decl/src:init/src:expr/src:call/src:name/src:name[last()]/text()|" +
            "/src:function/src:block//src:expr_stmt/src:expr/src:call/src:name[not(src:name)]/text()|" +
            "/src:function/src:block//src:expr_stmt/src:expr/src:call/src:name/src:name[last()]/text()",
        description: "function with ( \"Calling Function: <TEMP_0>\" )",
        weight: 10,
    },
    func_modify_field: {
        // xpath: "/src:function/src:block//src:expr_stmt/src:expr/src:operator[text()=\"=\"]" +
        //     "/preceding-sibling::src:name",
        // note: this Xpath query only returns the first element of a field, e.g., this.first.second.last = new_value
        type: featureTypes.single_node_text,
        xpath: "/src:function/src:block//src:expr_stmt/src:expr/src:operator[text()=\"=\"]" +
            "/preceding-sibling::src:name[src:name/text()=\"this\"]/src:name[position()=2]/text()",
        description: "function with ( \"Modifying Field <TEMP_0>\" )",
        weight: 10,
    },

    decl_call_function: {
        // xpath: "/src:decl_stmt/src:decl/src:init/src:expr/src:call/src:name",
        // note: this Xpath query only returns the function being called without its preceding identifiers or arguments
        type: featureTypes.single_node_text,
        xpath: "/src:decl_stmt/src:decl/src:init/src:expr/src:call/src:name[not(src:name)]/text()|" +
            "/src:decl_stmt/src:decl/src:init/src:expr/src:call/src:name/src:name[last()]/text()",
        description: "declaration statement with ( \"Initialized by Calling Function: <TEMP_0>\" )",
        weight: 10,
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
        description: "declaration statement with ( \"Initialized by Calling a Function With Argument <TEMP_0>\" )",
        weight: 10,
    },
    decl_init_value: {
        type: featureTypes.single_node_text,
        xpath: "/src:decl_stmt/src:decl/src:init/src:expr/src:literal/text()|" +
            "/src:decl_stmt/src:decl/src:init/src:expr/src:name[not(src:name)]/text()|" +
            "/src:decl_stmt/src:decl/src:init/src:expr/src:name/src:name[last()]/text()",
        description: "declaration statement with ( \"Initialization <TEMP_0>\" )",
        weight: 10,
    },

    expr_call_function: {
        // xpath: "/src:expr_stmt/src:expr/*[position()=1 and self::src:call]/src:name",
        // note: this Xpath query only returns the function being called without its preceding identifiers or arguments
        type: featureTypes.single_node_text,
        xpath: "/src:expr_stmt/src:expr/*[position()=1 and self::src:call]/src:name[not(src:name)]/text()|" +
            "/src:expr_stmt/src:expr/*[position()=1 and self::src:call]/src:name/src:name[last()]/text()",
        description: "expression statement with ( \"Calling Function: <TEMP_0>\" )",
        weight: 10,
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
        description: "expression statement with ( \"Calling a Function With Argument <TEMP_0>\" )",
        weight: 10,
    },
    expr_assignment_caller: {
        // xpath: "/src:expr_stmt/src:expr/src:name[position()=1]",
        // note: this Xpath query only returns the function being called without its preceding identifiers or arguments
        type: featureTypes.single_node_text,
        xpath: "/src:expr_stmt/src:expr/src:name[position()=1]/text()|/src:expr_stmt/src:expr/src:name[position()=1]/src:name[last()]/text()",
        description: "expression statement with ( \"Caller <TEMP_0>\" )",
        weight: 10,
    },
    expr_assignment_callee_value: {
        // xpath: "/src:expr_stmt/src:expr/src:operator[text()="="]/following-sibling::*",
        // note: this Xpath query only returns the function being called without its preceding identifiers or arguments
        type: featureTypes.single_node_text,
        xpath: "/src:expr_stmt/src:expr/src:operator[text()=\"=\"]/following-sibling::src:name[not(src:name)]/text()|" +
            "/src:expr_stmt/src:expr/src:operator[text()=\"=\"]/following-sibling::src:name/src:name[last()]/text()|" +
            "/src:expr_stmt/src:expr/src:operator[text()=\"=\"]/following-sibling::src:literal/text()",
        description: "expression statement with ( \"Assigned Value <TEMP_0>\" )",
        weight: 10,
    },
    expr_assignment_callee_call_function: {
        // xpath: "/src:expr_stmt/src:expr/src:operator[text()=\"=\"]/following-sibling::src:call/src:name",
        // note: this Xpath query only returns the function being called without its preceding identifiers or arguments
        type: featureTypes.single_node_text,
        xpath: "/src:expr_stmt/src:expr/src:operator[text()=\"=\"]/following-sibling::src:call/src:name[not(src:name)]/text()|" +
            "/src:expr_stmt/src:expr/src:operator[text()=\"=\"]/following-sibling::src:call/src:name/src:name[last()]/text()",
        description: "expression statement with ( \"Initialized by Calling Function: <TEMP_0>\" )",
        weight: 10,
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
        description: "expression statement with ( \"Initialized by Calling a Function With Argument <TEMP_0>\" )",
        weight: 10,
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
        xpath: "/src:class/src:block/src:class",
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






// // general description of features
// // weight is a default value set as a utility of a feature
// export const old_features = {
//
//     "class_annotation": {
//         type: featureTypes.single_node_text,
//         xpath: "//src:class/src:annotation/src:name/text()",
//         description: "class with ( annotation \"<TEMP_0>\" )",
//         weight: 10,
//     },
//     "class_vis": {
//         type: featureTypes.single_node_text,
//         xpath: "//src:class/src:specifier[contains(\"public private protected\",text())]/text()",
//         description: "class with ( visibility \"<TEMP_0>\" )",
//         weight: 1,
//     },
//     "class_impl": {
//         type: featureTypes.single_node_text,
//         xpath: "//src:class/src:super/src:implements/src:name/text()",
//         description: "class with ( implementation of \"<TEMP_0>\" )",
//         weight: 10,
//     },
//     "class_extend": {
//         type: featureTypes.single_node_text,
//         xpath: "//src:class/src:super/src:extends/src:name/text()",
//         description: "class with ( extension of \"<TEMP_0>\" )",
//         weight: 10,
//     },
//
//
//     "class_decl_annotation": {
//         type: featureTypes.single_node_text,
//         xpath: "//src:class/src:block/src:decl_stmt/src:decl/src:annotation/src:name/text()",
//         description: "class with ( declaration statement with annotation \"<TEMP_0>\" )",
//         weight: 10,
//     },
//     "class_decl_name": {
//         type: featureTypes.single_node_text,
//         xpath: "//src:class/src:block/src:decl_stmt/src:decl/src:name/text()",
//         description: "class with ( declaration statement with name \"<TEMP_0>\" )",
//         weight: 10,
//     },
//     "class_decl_type": {
//         type: featureTypes.single_node_text,
//         xpath: "//src:class/src:block/src:decl_stmt/src:decl/src:type/src:name/text()",
//         description: "class with ( declaration statement with type \"<TEMP_0>\" )",
//         weight: 7,
//     },
//     "class_decl_type_decl_name": {
//         type: featureTypes.multiple_nodes_texts,
//         xpath: "//src:class/src:block/src:decl_stmt/src:decl",
//         nodes: ["/src:decl/src:type/src:name/text()", "/src:decl/src:name/text()"],
//         description: "class with ( declaration statement with ( type \"<TEMP_0>\" and name \"<TEMP_1>\" ) )",
//         weight: 20,
//     },
//     "class_no_constr": {
//         type: featureTypes.no_node,
//         xpath: "//src:class[not(src:block/src:constructor)]",
//         description: "class with ( \"no constructor\" )",
//         weight: 5,
//     },
//
//
//     "constr_annotation": {
//         type: featureTypes.single_node_text,
//         xpath: "/src:constructor/src:annotation/src:name/text()",
//         description: "constructor with ( annotation \"<TEMP_0>\" )",
//         weight: 10,
//     },
//     "constr_empty_body": {
//         type: featureTypes.no_node,
//         xpath: "/src:constructor[not(src:block/*[not(self::src:comment)])]",
//         description: "constructor with ( \"empty body\" )",
//         weight: 5,
//     },
//     "constr_param_type": {
//         type: featureTypes.single_node_text,
//         xpath: "/src:constructor/src:parameter_list/" +
//             "src:parameter/src:decl/src:type/src:name/text()",
//         description: "constructor with ( parameter with type  \"<TEMP_0>\" )",
//         weight: 10,
//     },
//     "constr_decl_name": {
//         type: featureTypes.single_node_text,
//         xpath: "/src:constructor/src:block//src:decl_stmt/src:decl/src:name/text()",
//         description: "constructor with ( declaration statement with name \"<TEMP_0>\" )",
//         weight: 5,
//     },
//     "constr_expr_new": {
//         type: featureTypes.single_node_text,
//         xpath: "/src:constructor/src:block/src:expr_stmt/" +
//             "src:expr[src:operator[text()=\"new\"]]/" +
//             "*[(self::src:call or self::src:name) and position()=4]/src:name/text()",
//         description: "constructor with ( expression statement \"new <TEMP_0>\" )",
//         weight: 10,
//     },
//     "constr_expr": {
//         type: featureTypes.single_node_text,
//         xpath: "/src:constructor/src:block/src:expr_stmt" +
//             "/src:expr[not(src:operator/text()=\"new\")]" +
//             "/*[(self::src:call or self::src:name) and position()=3]/src:name/text()",
//         description: "constructor with ( expression statement \"<TEMP_0>\" )",
//         weight: 10,
//     },
//
//
//     "func_annotation": {
//         type: featureTypes.single_node_text,
//         xpath: "/src:function/src:annotation/src:name/text()",
//         description: "function with ( annotation \"<TEMP_0>\") ",
//         weight: 10,
//     },
//     "func_vis": {
//         type: featureTypes.single_node_text,
//         xpath: "/src:function/src:specifier[contains(\"public private protected\",text())]/text()",
//         description: "function with ( visibility \"<TEMP_0>\" )",
//         weight: 1,
//     },
//     "func_specifier": {
//         type: featureTypes.single_node_text,
//         xpath: "/src:function/src:specifier" +
//             "[not(contains(\"public private protected\",text()))]/text()",
//         description: "function with ( specifier \"<TEMP_0>\" )",
//         weight: 5,
//     },
//     "func_type": {
//         type: featureTypes.single_node_text,
//         xpath: "/src:function/src:type/src:name/text()",
//         description: "function with ( type \"<TEMP_0>\" )",
//         weight: 5,
//     },
//     "func_name": {
//         type: featureTypes.single_node_text,
//         xpath: "/src:function/src:name/text()",
//         description: "function with ( name \"<TEMP_0>\" )",
//         weight: 10,
//     },
//     "func_no_param": {
//         type: featureTypes.no_node,
//         xpath: "/src:function/src:parameter_list[not(src:parameter)]",
//         description: "function with ( \"no parameter\" )",
//         weight: 10,
//     },
//     "func_param_type": {
//         type: featureTypes.single_node_text,
//         xpath: "/src:function/src:parameter_list/src:parameter/src:decl/src:type/src:name/text()",
//         description: "function with ( parameter with type  \"<TEMP_0>\" )",
//         weight: 10,
//     },
//     "func_expr_new": {
//         type: featureTypes.single_node_text,
//         xpath: "/src:function/src:block/src:expr_stmt/" +
//             "src:expr[src:operator[text()=\"new\"]]/" +
//             "*[(self::src:call or self::src:name) and position()=4]/src:name/text()",
//         description: "function with ( expression statement \"new <TEMP_0>\" )",
//         weight: 10,
//     },
//     "func_expr": {
//         type: featureTypes.single_node_text,
//         xpath: "/src:function/src:block/src:expr_stmt/src:expr[not(src:operator/text()=\"new\")]" +
//             "/*[(self::src:call or self::src:name) and position()=3]/src:name/text()",
//         description: "function with ( expression statement \"<TEMP_0>\" )",
//         weight: 10,
//     },
//     "func_modify_var": {
//         type: featureTypes.single_node_text,
//         xpath: "/src:function/src:block/src:expr_stmt/src:expr[src:name/src:name/text()=\"this\" " +
//             "and src:operator/text()=\"=\"]/src:name/src:name[position()=2]/text()",
//         description: "function with ( \"modifies member variable '<TEMP_0>'\" )",
//         weight: 10,
//     },
//     "func_return_new": {
//         type: featureTypes.single_node_text,
//         xpath: "/src:function/src:block//src:return/src:expr[src:operator/text()=\"new\"]" +
//             "/src:call/src:name/text()",
//         description: "function with ( return value \"new <TEMP_0>\" )",
//         weight: 10,
//     },
//     "func_return": {
//         type: featureTypes.single_node_text,
//         xpath: "/src:function/src:block//src:return/src:expr[not(src:operator/text()=\"new\")]" +
//             "/src:call/src:name/text()",
//         description: "function with ( return value \"<TEMP_0>\" )",
//         weight: 10,
//     }
// }
//