export class constants {

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
                "expressionStatement": {
                    name: "expression",
                    xpath: "src:block/descendant-or-self::src:expr_stmt",
                    follows: "expressionStatement"
                },
                "declarationStatement": {
                    name: "declaration statement",
                    xpath: "src:block/descendant-or-self::src:decl_stmt/src:decl",
                    follows: "declarationStatement"
                },
                "return_expr": {
                    name: "return expression",
                    xpath: "src:block/descendant-or-self::src:return/src:expr",
                    follows: "expressionStatement"
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
                    type: "expressionStatement",
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
                    follows: "expressionStatement"
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
            "before": {
                "name": {name: "name", xpath: "", follows: "expression"}
            },
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
                "HAS_INIT": {
                    name: "Has initialization ...",
                    xpath: "src:init",
                    type: "expressionStatement",
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
                    follows: "expressionStatement"
                }
            }

        },
        "declaration": {
            "top": {},
            "before_1": {},
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
                    xpath: "",
                    type: "expression",
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
                "name/name": {name: "name/name", xpath: "src:name/src:name/text()", follows: ""},
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




