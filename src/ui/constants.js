export class constants {

    static srcMLdata = {

        "class": {
            constraints: {
                "NONE": {name: "No condition", xpath: "", type: ""},
                "NAME_EQUALS_TO": {name: "Name equals to ...", xpath: "src:name/text()=\"<NAME>\"", type: "text"},
                "NAME_NOT_EQUALS_TO": {
                    name: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text"
                },
                "HAS_SUPERCLASS_NAMED": {
                    name: "Has a super class named ...",
                    xpath: "src:super/src:extends/src:name/text()=\"<NAME>\"",
                    type: "text"
                },
                "HAS_ANNOTATION_NAMED": {
                    name: "Has annotation named ...",
                    xpath: "src:annotation[src:name/text()=\"<NAME>\"]",
                    type: "text"
                },
                "NOT_HAVE_ANNOTATION_NAMED": {
                    name: "Doesn't have annotation named ...",
                    xpath: "not(src:annotation[src:name/text()=\"<NAME>\"])",
                    type: "text"
                },
                "HAS_ANNOTATION_W_ARGUMENT_NAMED": {
                    name: "Has annotation with argument ...",
                    xpath: "src:annotation[src:name/text()=\"<NAME>\" and src:argument_list[<PROPERTY>]]",
                    type: "text",
                    // follows: "argument_list"
                },
                // "HAS_METHOD": {name: "Has method named ...", xpath: "src:block/src:<METHOD>[<PROPERTY>]", follows: "class"},
                "HAS_FUNCTION": {
                    name: "Has function ...",
                    xpath: "src:block/src:function[<PROPERTY>]",
                    type: "function"
                },
                "HAS_FUNCTION_DECL": {
                    name: "Has abstractFunction ...",
                    xpath: "src:block/src:function_decl[<PROPERTY>]",
                    type: "function_decl"
                },
                "HAS_CONSTRUCTOR": {
                    name: "Has constructor ...",
                    xpath: "src:block/src:constructor[<PROPERTY>]",
                    type: "constructor"
                },
                "HAS_DECLARATION": {
                    name: "Has declaration ...",
                    xpath: "src:block/descendant-or-self::src:decl_stmt/src:decl[<PROPERTY>]",
                    type: "decl"
                }
            },
            follows: {
                "name": {xpath: "src:name/text()", follows: ""},
                "subclass": {xpath: "src:block/src:class", follows: "class"},
                // "METHOD": {xpath: "src:<METHOD>", follows: "method"},
                "function": {xpath: "src:function", follows: "function"},
                "constructor": {xpath: "src:constructor", follows: "constructor"},
                "function_decl": {xpath: "src:function_decl", follows: "function_decl"},
                "expressions": {xpath: "src:expr_stmt/src:expr", follows: "expr"},
                "declarations": {xpath: "src:decl_stmt/src:decl", follows: "decl"}
            }
        },
        "function": {
            constraints: {
                "NONE": {name: "No condition", xpath: "", type: ""},
                "SPECIFIER": {name: "Specifier is ...", xpath: "src:specifier/text()=\"<NAME>\"", type: "text"},
                "NAME_EQUALS_TO": {name: "Name equals to ...", xpath: "src:name/text()=\"<NAME>\"", type: "text"},
                "NAME_NOT_EQUALS_TO": {
                    name: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text"
                },
                "RETURN_VALUE_IS_EXPR": {
                    name: "Return value/expression is ...",
                    text: "src:block/descendant-or-self::src:return/src:expr[<PROPERTY>]",
                    type: "expr"
                },
                "HAS_EXPRESSION": {
                    name: "Has expression ...",
                    text: "src:block/descendant-or-self::src:expr_stmt/src:expr[<PROPERTY>]",
                    type: "expr"
                },
                "OWNER_CLASS": {
                    name: "Its owner class is ...",
                    xpath: "ancestor::src:class[<PROPERTY>]",
                    type: "class"
                },
                "NUMBER_OF_PARAMETERS": {
                    name: "Its number of parameter is ...",
                    xpath: "count(src:parameter_list/src:parameter)<COUNT>",
                    type: "text"
                }
            },
            follows: {
                "name": {xpath: "src:name/text()", follows: ""},
                "ancestor_class": {xpath: "ancestor::src:class", follows: "class"},
                "expressions": {xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr", follows: "expr"},
                "declarations": {xpath: "src:block/descendant-or-self::src:decl_stmt/src:decl", follows: "decl"},
                "specifier": {xpath: "src:specifier/text()", follows: ""},
                "return_expr": {xpath: "src:block/descendant-or-self::src:return/src:expr", follows: "expr"},
                "parameter": {xpath: "src:parameter_list/src:parameter/src:decl", follows: "expr"}
            }
        },
        "constructor": {
            constraints: {
                "NONE": {name: "No condition", xpath: "", type: ""},
                "SPECIFIER": {name: "Its specifier is", xpath: "src:specifier/text()=\"<NAME>\"", type: "text"},
                "NAME_EQUALS_TO": {name: "Name equals to ...", xpath: "src:name/text()=\"<NAME>\"", type: "text"},
                "NAME_NOT_EQUALS_TO": {
                    name: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text"
                },
                "HAS_EXPRESSION": {
                    name: "Has expression ...",
                    xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr[<PROPERTY>]",
                    type: "expr"
                },
                // "OWNER_CLASS": {name: "Its owner class is", xpath: "ancestor::src:class[<PROPERTY>]", type: "class"},
                "NUMBER_OF_PARAMETERS": {
                    name: "The quantity of its parameter is",
                    xpath: "count(src:parameter_list/src:parameter)<COUNT>",
                    type: "text"
                }
            },
            follows: {
                "name": {xpath: "src:name/text()", follows: ""},
                "ancestor_class": {xpath: "ancestor::src:class", follows: "class"},
                "expressions": {xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr", follows: "expr"},
                "declarations": {xpath: "src:block/descendant-or-self::src:decl_stmt/src:decl", follows: "decl"},
                "specifier": {xpath: "src:specifier/text()", follows: ""},
                "parameter": {xpath: "src:parameter_list/src:parameter/src:decl", follows: "decl"}
            }
        },
        "function_decl": {
            constraints: {
                "NONE": {name: "No condition", xpath: "", type: ""},
                "SPECIFIER": {name: "Its specifier is", xpath: "src:specifier/text()=\"<NAME>\"", type: "text"},
                "NAME_EQUALS_TO": {name: "Name equals to ...", xpath: "src:name/text()=\"<NAME>\"", type: "text"},
                "NAME_NOT_EQUALS_TO": {
                    name: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text"
                },
                "OWNER_CLASS": {name: "Its owner class is", xpath: "ancestor::src:class[<PROPERTY>]", type: "class"},
                "NUMBER_OF_PARAMETERS": {
                    name: "The quantity of its parameter is",
                    xpath: "count(src:parameter_list/src:parameter)<COUNT>",
                    type: "text"
                }
            },
            follows: {
                "name": {xpath: "src:name/text()", follows: ""},
                "ancestor_class": {xpath: "ancestor::src:class", follows: "class"},
                "specifier": {xpath: "src:specifier/text()", follows: ""},
                "parameter": {xpath: "src:parameter_list/src:parameter/src:decl", follows: "decl"}
            }
        },
        "expr": {
            constraints: {
                "OPERATOR": {xpath: "src:operator/text()=\"<NAME>\"", type: "text"},
                "CALL": {xpath: "src:call[<PROPERTY>]", type: "call"},
                "SIDE_NAMES_EQUALS_TO": {xpath: "src:name/src:name/text()=\"<NAME>\"", type: "text"}
            },
            follows: {
                "name": {xpath: "src:name/text()", follows: ""},
                "name/name": {xpath: "src:name/src:name/text()", follows: ""},
                "call": {xpath: "src:call", follows: "call"},
            }
        },
        "decl": {
            constraints: {},
            follows: {}
        },
        "call": {
            constraints: {},
            follows: {}
        },

    };

    static default_data = {
        "general": {title: "Select class condition", value: ""},
        "class": {title: "Select class condition", value: ""},
        "function": {title: "Select function condition", value: ""},
        "constructor": {title: "Select constructor condition", value: ""},
        "function_decl": {title: "Select function_decl condition", value: ""},
        "expr": {title: "Select expressions condition", value: ""},
        "decl": {title: "Select declarations condition", value: ""}

    };

    static code_fragment = {
        "class": {
            "top": {
                "HAS_ANNOTATION": {
                    name: "Has annotation",
                    xpath: "src:annotation",
                    type: "annotation"
                }
            },
            "before": {},
            "after_1": {
                "NAME_EQUALS_TO": {
                    name: "Name equals to ...",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "className",
                    pre: "",
                    post: ""
                },
                "NAME_NOT_EQUALS_TO": {
                    name: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "className",
                    pre: "",
                    post: ""
                }
            },
            "after_2": {
                "HAS_SUPERCLASS_NAMED": {
                    name: "Extends class named ...",
                    xpath: "src:super/src:extends/src:name/text()=\"<NAME>\"",
                    type: "text",
                    pre: "extends",
                    post: ""
                }
            },
            "within": {
                "HAS_FUNCTION": {
                    name: "Has function ...",
                    xpath: "src:block/src:function",
                    type: "function"
                },
                "HAS_FUNCTION_DECL": {
                    name: "Has abstract function ...",
                    xpath: "src:block/src:function_decl",
                    type: "abstractFunction"
                },
                "HAS_CONSTRUCTOR": {
                    name: "Has constructor ...",
                    xpath: "src:block/src:constructor",
                    type: "constructor"
                },
                "HAS_DECLARATION_STMT": {
                    name: "Has declaration statement ...",
                    xpath: "src:block/descendant-or-self::src:decl_stmt/src:decl",
                    type: "declarationStatement"
                },
                "HAS_SUBCLASS": {
                    name: "Has subclass ...",
                    xpath: "src:block/src:class",
                    type: "class"
                }
            },
            "follows": {
                "name": {name: "name", xpath: "src:name/text()", follows: ""},
                "subclass": {name: "subclass", xpath: "src:block/src:class", follows: "class"},
                "function": {name: "function", xpath: "src:block/src:function", follows: "function"},
                "constructor": {name: "constructor", xpath: "src:block/src:constructor", follows: "constructor"},
                "abstractFunction": {
                    name: "abstractFunction",
                    xpath: "src:block/src:function_decl",
                    follows: "abstractFunction"
                },
                "declarationStatement": {
                    name: "declaration statement",
                    xpath: "src:block/descendant-or-self::src:decl_stmt/src:decl",
                    follows: "declarationStatement"
                }
            }
        },
        "function": {
            "top": {
                "HAS_ANNOTATION": {
                    name: "Has annotation",
                    xpath: "src:annotation",
                    type: "annotation"
                }
            },
            "before_1": {
                "SPECIFIER": {
                    name: "Specifier is ...",
                    xpath: "src:specifier/text()=\"<NAME>\"",
                    placeholder: "specifier",
                    type: "text",
                    pre: "",
                    post: ""
                }
            },
            "before_2": {
                "NAME_EQUALS_TO": {
                    name: "Name equals to ...",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "functionName",
                    pre: "",
                    post: ""
                },
                "NAME_NOT_EQUALS_TO": {
                    name: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "functionName",
                    pre: "",
                    post: ""
                }

            },
            "after": {
                "NUMBER_OF_PARAMETERS": {
                    name: "Its number of parameter is ...",
                    xpath: "count(src:parameter_list/src:parameter)=<COUNT>",
                    type: "number",
                    placeholder: "0",
                    pre: "#Parameters=",
                    post: ""
                },
                "HAS_PARAMETER": {
                    name: "One of its parameter is ...",
                    xpath: "src:parameter_list/src:parameter",
                    type: "declaration",
                    pre: "",
                    post: ""
                }
            },
            "within": {
                "RETURN_VALUE_IS_EXPR": {
                    name: "Return value/expression is ...",
                    xpath: "src:block/descendant-or-self::src:return/src:expr",
                    type: "expression",
                    pre: "return",
                    post: ""
                },
                "HAS_EXPRESSION": {
                    name: "Has expression ...",
                    xpath: "src:block/descendant-or-self::src:expr_stmt",
                    type: "expression",
                    pre: "",
                    post: ""
                },
                "HAS_DECLARATION": {
                    name: "Has declaration statement ...",
                    xpath: "src:block/descendant-or-self::src:decl_stmt",
                    type: "declarationStatement",
                    pre: "",
                    post: ""
                }
            },
            "follows": {
                "name": {name: "name", xpath: "src:name/text()", follows: "name"},
                "expression": {
                    name: "expression",
                    xpath: "src:block/descendant-or-self::src:expr_stmt",
                    follows: "expression"
                },
                "declarationStatement": {
                    name: "declaration statement",
                    xpath: "src:block/descendant-or-self::src:decl_stmt/src:decl",
                    follows: "declarationStatement"
                },
                "return_expr": {
                    name: "return expression",
                    xpath: "src:block/descendant-or-self::src:return/src:expr",
                    follows: "expression"
                },
                "parameter": {
                    name: "function parameter",
                    xpath: "src:parameter_list/src:parameter/src:decl",
                    follows: "parameter"
                }
            }
        },
        "constructor": {
            "top": {
                "HAS_ANNOTATION": {
                    name: "Has annotation",
                    xpath: "src:annotation",
                    type: "annotation"
                }
            },
            "before_1": {
                "SPECIFIER": {
                    name: "Specifier is ...",
                    xpath: "src:specifier/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "specifier",
                    pre: "",
                    post: ""
                }
            },
            "before_2": {},
            "after": {
                "NUMBER_OF_PARAMETERS": {
                    name: "Its number of parameter is ...",
                    xpath: "count(src:parameter_list/src:parameter)=<COUNT>",
                    placeholder: "0",
                    type: "number",
                    pre: "",
                    post: ""
                },
                "HAS_PARAMETER": {
                    name: "One of its parameter is ...",
                    xpath: "src:parameter_list/src:parameter/src:decl",
                    type: "declaration",
                    pre: "",
                    post: ""
                }
            },
            "within": {
                "HAS_EXPRESSION": {
                    name: "Has expression ...",
                    xpath: "src:block/descendant-or-self::src:expr_stmt",
                    type: "expression",
                    pre: "",
                    post: ""
                },
                "HAS_DECLARATION": {
                    name: "Has declaration ...",
                    xpath: "src:block/descendant-or-self::src:decl_stmt",
                    type: "declaration",
                    pre: "",
                    post: ""
                }
            },
            "follows": {
                "expression": {
                    name: "expression",
                    xpath: "src:block/descendant-or-self::src:expr_stmt",
                    follows: "expression"
                },
                "declaration": {
                    name: "declaration",
                    xpath: "src:block/descendant-or-self::src:decl_stmt",
                    follows: "declaration"
                },
                "parameter": {
                    name: "function parameter",
                    xpath: "src:parameter_list/src:parameter/src:decl",
                    follows: "expression"
                }
            }
        },
        "abstractFunction": {
            "top": {
                "HAS_ANNOTATION": {
                    name: "Has annotation",
                    xpath: "src:annotation",
                    type: "annotation"
                }
            },
            "before_1": {
                "SPECIFIER": {
                    name: "Its specifier is",
                    xpath: "src:specifier/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "specifier",
                    pre: "", post: ""
                },

            },
            "before_2": {
                "NAME_EQUALS_TO": {
                    name: "Name equals to ...",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "functionName",
                    pre: "", post: ""
                },
                "NAME_NOT_EQUALS_TO": {
                    name: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "functionName",
                    pre: "", post: ""
                }
            },
            "after": {
                "NUMBER_OF_PARAMETERS": {
                    name: "Its number of parameter is ...",
                    xpath: "count(src:parameter_list/src:parameter)=<COUNT>",
                    type: "number",
                    placeholder: "0",
                    pre: "",
                    post: ""
                },
                "HAS_PARAMETER": {
                    name: "One of its parameter is ...",
                    xpath: "src:parameter_list/src:parameter/src:decl",
                    type: "declaration",
                    pre: "",
                    post: ""
                }
            },
            "within": {},
            "follows": {
                "name": {name: "name", xpath: "src:name/text()", follows: "name"},
                "parameter": {
                    name: "parameter",
                    xpath: "src:parameter_list/src:parameter/src:decl",
                    follows: "parameter"
                }
            }

        },
        "expressionStatement": {
            "top": {},
            "before": {},
            "after": {},
            "within": {},
            "follows": {
                "name": {name: "name", xpath: "src:name/text()", follows: ""},
                "name/name": {name: "name/name", xpath: "src:name/src:name/text()", follows: ""},
                "call": {name: "call", xpath: "src:call", follows: "call"}
            }

        },
        "expression": {
            "top": {},
            "before": {},
            "after": {},
            "within": {},
            "follows": {
                "name": {name: "name", xpath: "src:name/text()", follows: ""},
                "name/name": {name: "name/name", xpath: "src:name/src:name/text()", follows: ""},
                "call": {name: "call", xpath: "src:call", follows: "call"}
            }

        },
        "declarationStatement": {
            "top": {
                "HAS_ANNOTATION": {
                    name: "Has annotation",
                    xpath: "src:annotation",
                    type: "annotation"
                }
            },
            "before_1": {
                "SPECIFIER": {
                    name: "Specifier is ...",
                    xpath: "src:type/src:specifier/text()=\"<NAME>\"",
                    placeholder: "specifier",
                    type: "text",
                    pre: "",
                    post: ""
                }
            },
            "before_2": {
                "TYPE_EQUALS_TO": {
                    name: "Type is ...",
                    xpath: "src:type/src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "type",
                    pre: "",
                    post: ""
                }
            },
            "after": {
                "NAME_EQUALS_TO": {
                    name: "Name equals to ...",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: ""
                },
                "NAME_NOT_EQUALS_TO": {
                    name: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: ""
                }
            },
            "within": {
                "HAS_INIT": {
                    name: "Has initialization ...",
                    xpath: "src:init",
                    type: "expression",
                    pre: "",
                    post: ""
                }
            },
            "follows": {
                "type": {name: "type", xpath: "src:type/src:name/text()", follows: ""},
                "name": {name: "name", xpath: "src:name/text()", follows: ""},
                "initialization expression": {
                    name: "initialization expression",
                    xpath: "src:init/src:expr",
                    follows: "expression"
                }
            }

        },
        "declaration": {
            "top": {},
            "before_1": {
                "SPECIFIER": {
                    name: "Specifier is ...",
                    xpath: "src:type/src:specifier/text()=\"<NAME>\"",
                    placeholder: "specifier",
                    type: "text",
                    pre: "",
                    post: ""
                }
            },
            "before_2": {
                "TYPE_EQUALS_TO": {
                    name: "Name equals to ...",
                    xpath: "src:type/src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "functionName",
                    pre: "",
                    post: ""
                }
            },
            "after": {
                "NAME_EQUALS_TO": {
                    name: "Name equals to ...",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "functionName",
                    pre: "",
                    post: ""
                },
                "NAME_NOT_EQUALS_TO": {
                    name: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "functionName",
                    pre: "",
                    post: ""
                }
            },
            "within": {},
            "follows": {
                "type": {name: "type", xpath: "src:type/src:name/text()", follows: ""},
                "name": {name: "name", xpath: "src:name/text()", follows: ""}
            }

        },
        "call": {
            "top": {},
            "before": {
                "CALLER_IS": {
                    name: "The caller is",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "caller",
                    pre: "", post: ""
                }
            },
            "after": {
                "NUMBER_OF_ARGUMENTS": {
                    name: "Its number of arguments is ...",
                    xpath: "count(src:argument_list/src:argument)=<COUNT>",
                    type: "number",
                    placeholder: "0",
                    pre: "",
                    post: ""
                },
                "HAS_ARGUMENT": {
                    name: "One of its argument is ...",
                    xpath: "src:argument_list/src:argument/src:expr",
                    type: "expression",
                    placeholder: "argument",
                    pre: "",
                    post: ""
                }
            },
            "within": {},
            "follows": {
                "name": {name: "name", xpath: "src:name/text()", follows: ""},
                "argument": {name: "argument", xpath: "src:argument_list/src:argument/src:expr", follows: "expression"}
            }

        },
        "annotation": {
            "top": {},
            "before": {
                "NAME_EQUALS_TO": {
                    name: "Name equals to ...",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "annotationName",
                    pre: "",
                    post: ""
                },
                "NAME_NOT_EQUALS_TO": {
                    name: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "annotationName",
                    pre: "",
                    post: ""
                }
            },
            "after": {
                "HAS_ARGUMENT": {
                    name: "It has argument ...",
                    xpath: "src:argument_list/src:argument",
                    type: "expression",
                    pre: "",
                    post: ""
                }

            },
            "within": {},
            "follows": {}

        }
    };

    static state_children = {
        "top": [],
        "before": [],
        "before_1": [],
        "before_2": [],
        "after": [],
        "after_1": [],
        "after_2": [],
        "within": [],
        "follows": {}
    }
}




