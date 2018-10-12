export class GuiConstants {

    static code_fragment = {
        "class": {
            "top": {
                "HAS_ANNOTATION": {
                    name: "Has annotation",
                    xpath: "src:annotation",
                    type: "annotation",
                    pre: "",
                    post: ""
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
                },
                "HAS_INTERFACE_NAMED": {
                    name: "Implements class named ...",
                    xpath: "src:super/src:implements/src:name/text()=\"<NAME>\"",
                    type: "text",
                    pre: "implements",
                    post: ""
                }
            },
            "within": {
                "HAS_FUNCTION": {
                    name: "Has function ...",
                    xpath: "src:block/src:function",
                    type: "function",
                    pre: "",
                    post: ""
                },
                "HAS_FUNCTION_DECL": {
                    name: "Has abstract function ...",
                    xpath: "src:block/src:function_decl",
                    type: "abstractFunction",
                    pre: "",
                    post: ""
                },
                "HAS_CONSTRUCTOR": {
                    name: "Has constructor ...",
                    xpath: "src:block/src:constructor",
                    type: "constructor",
                    pre: "",
                    post: ""
                },
                "HAS_DECLARATION_STMT": {
                    name: "Has declaration statement ...",
                    xpath: "src:block/descendant-or-self::src:decl_stmt/src:decl",
                    type: "declarationStatement",
                    pre: "",
                    post: ""
                },
                "HAS_SUBCLASS": {
                    name: "Has subclass ...",
                    xpath: "src:block/src:class",
                    type: "class",
                    pre: "",
                    post: ""
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
                    type: "annotation",
                    pre: "",
                    post: ""
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
                    xpath: "src:parameter_list/src:parameter/src:decl",
                    type: "declaration",
                    pre: "",
                    post: ""
                }
            },
            "within": {
                "RETURN_VALUE_IS_VARIABLE": {
                    name: "Return value/variable is ...",
                    xpath: "src:block/descendant-or-self::src:return/src:expr",
                    type: "srcml",
                    pre: "return",
                    post: ""
                },
                "RETURN_VALUE_IS_METHOD_CALL": {
                    name: "Return expression is a method chainCall ...",
                    xpath: "src:block/descendant-or-self::src:return/src:expr",
                    type: "chainCall",
                    pre: "return",
                    post: ""
                },
                "HAS_ASSIGN_EXPRESSION": {
                    name: "Has assignment expression ...",
                    xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr",
                    type: "expression",
                    pre: "",
                    post: ""
                },
                "HAS_INVOKE_EXPRESSION": {
                    name: "Has method invoke expression ...",
                    xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr",
                    type: "chainCall",
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
                    name: "assignment expression",
                    xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr",
                    follows: "expression"
                },
                "chainCall": {
                    name: "method chainCall expression",
                    xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr",
                    follows: "chainCall"
                },
                "declarationStatement": {
                    name: "declaration statement",
                    xpath: "src:block/descendant-or-self::src:decl_stmt/src:decl",
                    follows: "declarationStatement"
                },
                "return_value": {
                    name: "return value/variable",
                    xpath: "src:block/descendant-or-self::src:return/src:expr",
                    follows: "srcml"
                },
                "return_method_call": {
                    name: "return method chainCall",
                    xpath: "src:block/descendant-or-self::src:return/src:expr",
                    follows: "chainCall"
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
                    type: "annotation",
                    pre: "",
                    post: ""
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
                "HAS_ASSIGN_EXPRESSION": {
                    name: "Has assignment expression ...",
                    xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr",
                    type: "expression",
                    pre: "",
                    post: ""
                },
                "HAS_INVOKE_EXPRESSION": {
                    name: "Has method invoke expression ...",
                    xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr",
                    type: "chainCall",
                    pre: "",
                    post: ""
                },
                "HAS_DECLARATION": {
                    name: "Has declaration ...",
                    xpath: "src:block/descendant-or-self::src:decl_stmt",
                    type: "declarationStatement",
                    pre: "",
                    post: ""
                }
            },
            "follows": {
                "expression": {
                    name: "assignment expression",
                    xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr",
                    follows: "expression"
                },
                "chainCall": {
                    name: "method chainCall expression",
                    xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr",
                    follows: "chainCall"
                },
                "declarationStatement": {
                    name: "declaration statement",
                    xpath: "src:block/descendant-or-self::src:decl_stmt",
                    follows: "declarationStatement"
                },
                "parameter": {
                    name: "function parameter",
                    xpath: "src:parameter_list/src:parameter/src:decl",
                    follows: "parameter"
                }
            }
        },
        "abstractFunction": {
            "top": {
                "HAS_ANNOTATION": {
                    name: "Has annotation",
                    xpath: "src:annotation",
                    type: "annotation",
                    pre: "",
                    post: ""
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
        "expression": {
            "top": {},
            "before": {
                "NAME": {
                    name: "name", xpath: "", type: "srcml",
                    pre: "",
                    post: ""
                }
            },
            "after": {
                "CALL": {
                    name: "method invoke", xpath: "src:chainCall", type: "chainCall",
                    pre: "",
                    post: ""
                },
                "NAME/LITERAL": {
                    name: "value/variable", xpath: "", type: "srcml",
                    pre: "",
                    post: ""
                }
            },
            "within": {},
            "follows": {
                "name": {name: "name", xpath: "src:name/text()", follows: ""},
                "name/name": {name: "name/name", xpath: "src:name/src:name/text()", follows: ""},
                "chainCall": {name: "chainCall", xpath: "src:chainCall", follows: "chainCall"}
            }
        },
        "call": {
            "top": {},
            "before": {
                "CALLER_IS": {
                    name: "The caller is",
                    xpath: "",
                    type: "srcml",
                    pre: "",
                    post: ""
                }
            },
            "after": {
                "NUMBER_OF_ARGUMENTS": {
                    name: "Its number of arguments is ...",
                    xpath: "count(src:argument_list/src:argument)=<COUNT>",
                    type: "number",
                    placeholder: "0",
                    pre: "#arguments=",
                    post: ""
                },
                "HAS_CALL_ARGUMENT": {
                    name: "One of its argument calls ...",
                    xpath: "src:argument_list/src:argument/src:expr/src:chainCall",
                    type: "chainCall",
                    placeholder: "argument",
                    pre: "",
                    post: ","
                },
                "HAS_NAME_ARGUMENT": {
                    name: "One of its argument is variable or name ...",
                    xpath: "src:argument_list/src:argument/src:expr",
                    type: "srcml",
                    placeholder: "argument",
                    pre: "",
                    post: ","
                }
            },
            "within": {},
            "follows": {
                "name": {name: "name", xpath: "src:name/text()", follows: ""},
                "name/name": {name: "name/name", xpath: "src:name/src:name/text()", follows: ""},
                "argument": {name: "argument", xpath: "src:argument_list/src:argument/src:expr", follows: "expression"}
            }

        },
        "chainCall": {
            "top": {},
            "before": {
                "CALL": {
                    name: "The called method is ...",
                    xpath: "src:call",
                    type: "call",
                    pre: "",
                    post: "."
                }
            },
            "within": {},
            "follows": {}

        },
        "declarationStatement": {
            "top": {
                "HAS_ANNOTATION": {
                    name: "Has annotation",
                    xpath: "src:annotation",
                    type: "annotation",
                    pre: "",
                    post: ""
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
                "TYPE_NAME": {
                    name: "Type 'name' is ...",
                    xpath: "src:type/src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "type name",
                    pre: "",
                    post: ""
                },
                "TYPE_NAME_NAME": {
                    name: "Type 'name'< > is ...",
                    xpath: "src:type/src:name/src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "type name< >",
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
                "HAS_INIT_NAME_LITERAL": {
                    name: "Has initialization by value or name ...",
                    xpath: "src:init",
                    type: "srcml",
                    pre: "",
                    post: ""
                },
                "HAS_INIT_CALL": {
                    name: "Has initialization by method chainCall ...",
                    xpath: "src:init",
                    type: "chainCall",
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
            "before_1": {},
            "before_2": {
                "TYPE_EQUALS_TO": {
                    name: "Type equals to ...",
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
                    placeholder: "parameterName",
                    pre: "",
                    post: ""
                },
                "NAME_NOT_EQUALS_TO": {
                    name: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "parameterName",
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
                    xpath: "src:argument_list/src:argument/src:expr",
                    type: "expression", // TODO change to srcml
                    pre: "",
                    post: ","
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
    };

}
