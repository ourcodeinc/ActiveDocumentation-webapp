
// xpath property is not used

export class GuiConstants {

    static code_fragment = {
        "class": {
            "top": {
                "ANNOTATION": {
                    buttonName: "Has annotation",
                    xpath: "src:annotation",
                    type: "annotation",
                    pre: "",
                    post: "",
                    grammar: "annotation"
                }
            },
            "before_1": {
                "SPECIFIER_EQUALS_TO": {
                    buttonName: "Specifier is ...",
                    xpath: "src:specifier/text()=\"<NAME>\"",
                    placeholder: "specifier",
                    type: "text",
                    pre: "",
                    post: "",
                    grammar: "specifier where equal to"
                },
                "SPECIFIER_NOT_EQUALS_TO": {
                    buttonName: "Specifier is not ...",
                    xpath: "src:specifier/text()!=\"<NAME>\"",
                    placeholder: "specifier",
                    type: "text",
                    pre: "",
                    post: "",
                    grammar: "specifier where not equal to"
                }
            },
            "before_2": {},
            "after_1": {
                "NAME_EQUALS_TO": {
                    buttonName: "Name equals to ...",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "class name",
                    pre: "",
                    post: "",
                    grammar: "name where equal to"
                },
                "NAME_NOT_EQUALS_TO": {
                    buttonName: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "class name",
                    pre: "",
                    post: "",
                    grammar: "name where not equal to"
                },
                "NAME_INCLUDES": {
                    buttonName: "Name include ...",
                    xpath: "src:name[contains(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "class name",
                    pre: "",
                    post: "",
                    grammar: "name where include"
                },
                "NAME_NOT_INCLUDES": {
                    buttonName: "Name not include ...",
                    xpath: "src:name[not(contains(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "class name",
                    pre: "",
                    post: "",
                    grammar: "name where not include"
                },
                "NAME_STARTS_WITH": {
                    buttonName: "Name starts with ...",
                    xpath: "src:name[starts-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "class name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "NAME_NOT_STARTS_WITH": {
                    buttonName: "Name not starts with ...",
                    xpath: "src:name[not(starts-with(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "class name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "NAME_ENDS_WITH": {
                    buttonName: "Name ends with ...",
                    xpath: "src:name[ends-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "class name",
                    pre: "",
                    post: "",
                    grammar: "name where end with"
                },
                "NAME_NOT_ENDS_WITH": {
                    buttonName: "Name not ends with ...",
                    xpath: "src:name[not(ends-with(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "class name",
                    pre: "",
                    post: "",
                    grammar: "name where not end with"
                }
            },
            "after_2": {
                "SUPERCLASS_NAMED": {
                    buttonName: "Extends class named ...",
                    xpath: "src:super/src:extends/src:name/text()=\"<NAME>\"",
                    type: "text",
                    pre: "extends",
                    post: "",
                    grammar: "extension where equal to"
                },
                "SUPERCLASS_NOT_NAMED": {
                    buttonName: "Extends class not named ...",
                    xpath: "src:super/src:extends/src:name/text()!=\"<NAME>\"",
                    type: "text",
                    pre: "extends",
                    post: "",
                    grammar: "extension where not equal to"
                },
                "INTERFACE_NAMED": {
                    buttonName: "Implements class named ...",
                    xpath: "src:super/src:implements/src:name/text()=\"<NAME>\"",
                    type: "text",
                    pre: "implements",
                    post: "",
                    grammar: "implementation where equal to"
                },
                "INTERFACE_NOT_NAMED": {
                    buttonName: "Implements class not named ...",
                    xpath: "src:super/src:implements/src:name/text()!=\"<NAME>\"",
                    type: "text",
                    pre: "implements",
                    post: "",
                    grammar: "implementation where not equal to"
                }
            },
            "within": {
                "FUNCTION": {
                    buttonName: "Has function ...",
                    xpath: "src:block/src:function",
                    type: "function",
                    pre: "",
                    post: "",
                    grammar: "function"
                },
                "FUNCTION_DECL": {
                    buttonName: "Has abstractFunction ...",
                    xpath: "src:block/src:function_decl",
                    type: "abstractFunction",
                    pre: "",
                    post: "",
                    grammar: "abstractFunction"
                },
                "CONSTRUCTOR": {
                    buttonName: "Has constructor ...",
                    xpath: "src:block/src:constructor",
                    type: "constructor",
                    pre: "",
                    post: "",
                    grammar: "constructor"
                },
                "DECLARATION_STMT": {
                    buttonName: "Has declarationStatement ...",
                    xpath: "src:block/descendant-or-self::src:decl_stmt/src:decl",
                    type: "declarationStatement",
                    pre: "",
                    post: "",
                    grammar: "declarationStatement"
                },
                "SUBCLASS": {
                    buttonName: "Has subclass ...",
                    xpath: "src:block/src:class",
                    type: "class",
                    pre: "",
                    post: "",
                    grammar: "class"
                }
            },
            "child": {
                "annotation": {
                    buttonName: "annotation", xpath: "src:annotation",
                    child: "annotation", grammar: "annotation"
                },
                "specifier": {
                    buttonName: "specifier", xpath: "src:specifier/text()",
                    child: "", grammar: "specifier"
                },
                "name": {
                    buttonName: "name", xpath: "src:name/text()",
                    child: "", grammar: "name"
                },
                "extend": {
                    buttonName: "extension", xpath: "src:super/src:extends/src:name/text()",
                    child: "", grammar: "extension"
                },
                "implement": {
                    buttonName: "implementation", xpath: "src:super/src:implements/src:name/text()",
                    child: "", grammar: "implementation"
                },
                "class": {
                    buttonName: "subclass", xpath: "src:block/src:class",
                    child: "class", grammar: "class"
                },
                "function": {
                    buttonName: "function", xpath: "src:block/src:function",
                    child: "function", grammar: "function"
                },
                "constructor": {
                    buttonName: "constructor", xpath: "src:block/src:constructor",
                    child: "constructor", grammar: "constructor"
                },
                "abstractFunction": {
                    buttonName: "abstractFunction",
                    xpath: "src:block/src:function_decl",
                    child: "abstractFunction",
                    grammar: "abstractFunction"
                },
                "declarationStatement": {
                    buttonName: "declarationStatement",
                    xpath: "src:block/descendant-or-self::src:decl_stmt/src:decl",
                    child: "declarationStatement",
                    grammar: "declarationStatement"
                }
            }
        },
        "function": {
            "top": {
                "ANNOTATION": {
                    buttonName: "Has annotation",
                    xpath: "src:annotation",
                    type: "annotation",
                    pre: "",
                    post: "",
                    grammar: "annotation"
                }
            },
            "before_1": {
                "SPECIFIER_EQUALS_TO": {
                    buttonName: "Specifier is ...",
                    xpath: "src:specifier/text()=\"<NAME>\"",
                    placeholder: "specifier",
                    type: "text",
                    pre: "",
                    post: "",
                    grammar: "specifier where equal to"
                },
                "SPECIFIER_NOT_EQUALS_TO": {
                    buttonName: "Specifier is not ...",
                    xpath: "src:specifier/text()!=\"<NAME>\"",
                    placeholder: "specifier",
                    type: "text",
                    pre: "",
                    post: "",
                    grammar: "specifier where not equal to"
                }
            },
            "before_2": {
                "NAME_EQUALS_TO": {
                    buttonName: "Name equals to ...",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where equal to"
                },
                "NAME_NOT_EQUALS_TO": {
                    buttonName: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where not equal to"
                },
                "NAME_INCLUDES": {
                    buttonName: "Name include ...",
                    xpath: "src:name[contains(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where include"
                },
                "NAME_NOT_INCLUDES": {
                    buttonName: "Name not include ...",
                    xpath: "src:name[not(contains(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where not include"
                },
                "NAME_STARTS_WITH": {
                    buttonName: "Name starts with ...",
                    xpath: "src:name[starts-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "NAME_NOT_STARTS_WITH": {
                    buttonName: "Name not starts with ...",
                    xpath: "src:name[not(starts-with(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "NAME_ENDS_WITH": {
                    buttonName: "Name ends with ...",
                    xpath: "src:name[ends-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where end with"
                },
                "NAME_NOT_ENDS_WITH": {
                    buttonName: "Name not ends with ...",
                    xpath: "src:name[not(ends-with(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where not end with"
                }
            },
            "after_1": {
                "PARAMETER": {
                    buttonName: "One of its parameter is ...",
                    xpath: "src:parameter_list/src:parameter/src:decl",
                    type: "declaration",
                    pre: "",
                    post: "",
                    grammar: "parameter"
                }
            },
            "after_2": {},
            "within": {
                "RETURN_VALUE": {
                    buttonName: "Return value/variable is ...",
                    xpath: "src:block/descendant-or-self::src:return/src:expr",
                    type: "returnValue",
                    pre: "",
                    post: "",
                    grammar: "return value where have expression statement"
                },
                "EXPRESSION_STATEMENT": {
                    buttonName: "Has expression statement ...",
                    xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr",
                    type: "expressionStatement",
                    pre: "",
                    post: "",
                    grammar: "expression statement"
                },
                "DECLARATION_STATEMENT": {
                    buttonName: "Has declarationStatement ...",
                    xpath: "src:block/descendant-or-self::src:decl_stmt",
                    type: "declarationStatement",
                    pre: "",
                    post: "",
                    grammar: "declarationStatement"
                }
            },
            "child": {
                "annotation": {
                    buttonName: "annotation", xpath: "src:annotation",
                    child: "annotation", grammar: "annotation"
                },
                "specifier": {
                    buttonName: "specifier", xpath: "src:specifier/text()",
                    child: "", grammar: "specifier"
                },
                "name": {
                    buttonName: "name", xpath: "src:name/text()",
                    child: "", grammar: "name"
                },
                "parameter": {
                    buttonName: "function parameter",
                    xpath: "src:parameter_list/src:parameter/src:decl",
                    child: "parameter",
                    grammar: "parameter"
                },
                "expressionStatement": {
                    buttonName: "assignment expression",
                    xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr",
                    child: "expressionStatement",
                    grammar: "expression statement",
                },
                "declarationStatement": {
                    buttonName: "declaration statement",
                    xpath: "src:block/descendant-or-self::src:decl_stmt/src:decl",
                    child: "declarationStatement",
                    grammar: "declarationStatement"
                },
                "returnValue": {
                    buttonName: "return value",
                    xpath: "src:block/descendant-or-self::src:return/src:expr",
                    child: "returnValue",
                    grammar: "return value"
                }
            }
        },
        "constructor": {
            "top": {
                "ANNOTATION": {
                    buttonName: "Has annotation",
                    xpath: "src:annotation",
                    type: "annotation",
                    pre: "",
                    post: "",
                    grammar: "annotation"
                }
            },
            "before_1": {
                "SPECIFIER_EQUALS_TO": {
                    buttonName: "Specifier is ...",
                    xpath: "src:specifier/text()=\"<NAME>\"",
                    placeholder: "specifier",
                    type: "text",
                    pre: "",
                    post: "",
                    grammar: "specifier where equal to"
                },
                "SPECIFIER_NOT_EQUALS_TO": {
                    buttonName: "Specifier is not ...",
                    xpath: "src:specifier/text()!=\"<NAME>\"",
                    placeholder: "specifier",
                    type: "text",
                    pre: "",
                    post: "",
                    grammar: "specifier where not equal to"
                }
            },
            "before_2": {},
            "after_1": {
                "PARAMETER": {
                    buttonName: "One of its parameter is ...",
                    xpath: "src:parameter_list/src:parameter/src:decl",
                    type: "declaration",
                    pre: "",
                    post: "",
                    grammar: "parameter"
                }
            },
            "after_2": {},
            "within": {
                "EXPRESSION_STATEMENT": {
                    buttonName: "Has assignment expression ...",
                    xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr",
                    type: "expressionStatement",
                    pre: "",
                    post: "",
                    grammar: "expression statement"
                },
                "DECLARATION_STATEMENT": {
                    buttonName: "Has declaration ...",
                    xpath: "src:block/descendant-or-self::src:decl_stmt",
                    type: "declarationStatement",
                    pre: "",
                    post: "",
                    grammar: "declarationStatement"
                }
            },
            "child": {
                "annotation": {
                    buttonName: "annotation", xpath: "src:annotation",
                    child: "annotation", grammar: "annotation"
                },
                "specifier": {
                    buttonName: "specifier", xpath: "src:specifier/text()",
                    child: "", grammar: "specifier"
                },
                "name": {
                    buttonName: "name", xpath: "src:name/text()",
                    child: "", grammar: "name"
                },
                "parameter": {
                    buttonName: "function parameter",
                    xpath: "src:parameter_list/src:parameter/src:decl",
                    child: "parameter",
                    grammar: "parameter"
                },
                "expressionStatement": {
                    buttonName: "assignment expression",
                    xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr",
                    child: "expressionStatement",
                    grammar: "expression statement",
                },
                "declarationStatement": {
                    buttonName: "declarationStatement",
                    xpath: "src:block/descendant-or-self::src:decl_stmt",
                    child: "declarationStatement",
                    grammar: "annotation"
                }
            }
        },
        "abstractFunction": {
            "top": {
                "ANNOTATION": {
                    buttonName: "Has annotation",
                    xpath: "src:annotation",
                    type: "annotation",
                    pre: "",
                    post: "",
                    grammar: "annotation"
                }
            },
            "before_1": {
                "SPECIFIER_EQUALS_TO": {
                    buttonName: "Specifier is ...",
                    xpath: "src:specifier/text()=\"<NAME>\"",
                    placeholder: "specifier",
                    type: "text",
                    pre: "",
                    post: "",
                    grammar: "specifier where equal to"
                },
                "SPECIFIER_NOT_EQUALS_TO": {
                    buttonName: "Specifier is not ...",
                    xpath: "src:specifier/text()!=\"<NAME>\"",
                    placeholder: "specifier",
                    type: "text",
                    pre: "",
                    post: "",
                    grammar: "specifier where not equal to"
                }
            },
            "before_2": {
                "NAME_EQUALS_TO": {
                    buttonName: "Name equals to ...",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where equal to"
                },
                "NAME_NOT_EQUALS_TO": {
                    buttonName: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where not equal to"
                },
                "NAME_INCLUDES": {
                    buttonName: "Name include ...",
                    xpath: "src:name[contains(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where include"
                },
                "NAME_NOT_INCLUDES": {
                    buttonName: "Name not include ...",
                    xpath: "src:name[not(contains(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where not include"
                },
                "NAME_STARTS_WITH": {
                    buttonName: "Name starts with ...",
                    xpath: "src:name[starts-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "NAME_NOT_STARTS_WITH": {
                    buttonName: "Name not starts with ...",
                    xpath: "src:name[not(starts-with(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "NAME_ENDS_WITH": {
                    buttonName: "Name ends with ...",
                    xpath: "src:name[ends-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where end with"
                },
                "NAME_NOT_ENDS_WITH": {
                    buttonName: "Name not ends with ...",
                    xpath: "src:name[not(ends-with(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where not end with"
                }
            },
            "after_1": {
                "PARAMETER": {
                    buttonName: "One of its parameter is ...",
                    xpath: "src:parameter_list/src:parameter/src:decl",
                    type: "declaration",
                    pre: "",
                    post: "",
                    grammar: "parameter"
                }
            },
            "after_2": {},
            "within": {},
            "child": {
                "annotation": {
                    buttonName: "annotation", xpath: "src:annotation",
                    child: "annotation", grammar: "annotation"
                },
                "specifier": {
                    buttonName: "specifier", xpath: "src:specifier/text()",
                    child: "", grammar: "specifier"
                },
                "name": {
                    buttonName: "name",
                    xpath: "src:name/text()",
                    child: "name",
                    grammar: "name"
                },
                "parameter": {
                    buttonName: "parameter",
                    xpath: "src:parameter_list/src:parameter/src:decl",
                    child: "parameter",
                    grammar: "parameter"
                }
            }
        },
        "expressionStatement": {
            "top": {},
            "before_1": {
                "NAME": {
                    buttonName: "name",
                    xpath: "",
                    type: "srcml",
                    pre: "",
                    post: "",
                    grammar: "name"
                }
            },
            "before_2": {},
            "after_1": {
                "CALL": {
                    buttonName: "method invoke",
                    xpath: "src:call",
                    type: "call",
                    pre: "",
                    post: "",
                    grammar: "call"
                },
                // "NAME/LITERAL": {
                //     buttonName: "value/variable",
                //     xpath: "",
                //     type: "srcml",
                //     pre: "",
                //     post: "",
                //     grammar: "NOT IN GRAMMAR"
                // }
            },
            "after_2": {},
            "within": {},
            "child": {
                "call": {
                    buttonName: "method invoke",
                    xpath: "src:call",
                    child: "call",
                    grammar: "call"
                },
                "name": {
                    buttonName: "name", xpath: "src:name/text()", child: "",
                    grammar: "name"
                }
            }
        },
        "expression": {
            "top": {},
            "before_1": {
                "NAME": {
                    buttonName: "name",
                    xpath: "",
                    type: "srcml",
                    pre: "",
                    post: "",
                    grammar: "name"
                },
                "CALL": {
                    buttonName: "method invoke",
                    xpath: "src:call",
                    type: "call",
                    pre: "",
                    post: "",
                    grammar: "call"
                }
            },
            "before_2": {},
            "after_1": {},
            "after_2": {},
            "within": {},
            "child": {
                "call": {
                    buttonName: "method invoke",
                    xpath: "src:call",
                    child: "call",
                    grammar: "call"
                },
                "name": {
                    buttonName: "name", xpath: "src:name/text()", child: "",
                    grammar: "name"
                }
            }
        },
        "returnValue": {
            "top": {},
            "before_1": {
                "NAME": {
                    buttonName: "name",
                    xpath: "",
                    type: "srcml",
                    pre: "",
                    post: "",
                    grammar: "name"
                },
                "CALL": {
                    buttonName: "method invoke",
                    xpath: "src:call",
                    type: "call",
                    pre: "",
                    post: "",
                    grammar: "call"
                }
            },
            "before_2": {},
            "after_1": {},
            "after_2": {},
            "within": {},
            "child": {
                "call": {
                    buttonName: "method invoke",
                    xpath: "src:call",
                    child: "call",
                    grammar: "call"
                },
                "name": {
                    buttonName: "name",
                    xpath: "src:name/text()",
                    child: "",
                    grammar: "name"
                }
            }
        },
        "declarationStatement": {
            "top": {
                "ANNOTATION": {
                    buttonName: "Has annotation",
                    xpath: "src:annotation",
                    type: "annotation",
                    pre: "",
                    post: "",
                    grammar: "annotation"
                }
            },
            "before_1": {
                "SPECIFIER_EQUALS_TO": {
                    buttonName: "Specifier is ...",
                    xpath: "src:specifier/text()=\"<NAME>\"",
                    placeholder: "specifier",
                    type: "text",
                    pre: "",
                    post: "",
                    grammar: "specifier where equal to"
                },
                "SPECIFIER_NOT_EQUALS_TO": {
                    buttonName: "Specifier is not ...",
                    xpath: "src:specifier/text()!=\"<NAME>\"",
                    placeholder: "specifier",
                    type: "text",
                    pre: "",
                    post: "",
                    grammar: "specifier where not equal to"
                }
            },
            "before_2": {
                "TYPE_NAMED": {
                    buttonName: "Type 'name' is ...",
                    xpath: "src:type//src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "type name",
                    pre: "",
                    post: "",
                    grammar: "type where equal to"
                },
                "TYPE_NOT_NAMED": {
                    buttonName: "Type 'name' is not ...",
                    xpath: "src:type//src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "type not named",
                    pre: "",
                    post: "",
                    grammar: "type where not equal to"
                }
                // "TYPE_NAME_NAME": {
                //     buttonName: "Type 'name'< > is ...",
                //     xpath: "src:type/src:name/src:name/text()=\"<NAME>\"",
                //     type: "text",
                //     placeholder: "type name< >",
                //     pre: "",
                //     post: "",
                //     grammar: "type where have name where equal to"
                // }
            },
            "after_1": {
                "NAME_EQUALS_TO": {
                    buttonName: "Name equals to ...",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where equal to"
                },
                "NAME_NOT_EQUALS_TO": {
                    buttonName: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not equal to"
                },
                "NAME_INCLUDES": {
                    buttonName: "Name include ...",
                    xpath: "src:name[contains(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where include"
                },
                "NAME_NOT_INCLUDES": {
                    buttonName: "Name not include ...",
                    xpath: "src:name[not(contains(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not include"
                },
                "NAME_STARTS_WITH": {
                    buttonName: "Name starts with ...",
                    xpath: "src:name[starts-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "NAME_NOT_STARTS_WITH": {
                    buttonName: "Name not starts with ...",
                    xpath: "src:name[not(starts-with(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "NAME_ENDS_WITH": {
                    buttonName: "Name ends with ...",
                    xpath: "src:name[ends-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where end with"
                },
                "NAME_NOT_ENDS_WITH": {
                    buttonName: "Name not ends with ...",
                    xpath: "src:name[not(ends-with(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not end with"
                }
            },
            "after_2": {
                "INIT_VALUE": {
                    buttonName: "Has initialization ...",
                    xpath: "src:init",
                    type: "expression",
                    pre: "",
                    post: "",
                    grammar: "initial value"
                }
            },
            "within": {},
            "child": {
                "annotation": {
                    buttonName: "annotation", xpath: "src:annotation",
                    child: "annotation", grammar: "annotation"
                },
                "specifier": {
                    buttonName: "specifier", xpath: "src:specifier/text()",
                    child: "", grammar: "specifier"
                },

                "type": {name: "type",
                    xpath: "src:type/src:name/text()", child: "",
                    grammar: "type"
                },
                "name": {
                    buttonName: "name", xpath: "src:name/text()", child: "",
                    grammar: "name"
                },
                "expression": {
                    buttonName: "initialization expression",
                    xpath: "src:init/src:expr",
                    child: "expression",
                    grammar: "initial value"
                }
            }
        },
        // used for parameter in functions
        "declaration": {
            "top": {},
            "before_1": {},
            "before_2": {
                "TYPE_NAMED": {
                    buttonName: "Type 'name' is ...",
                    xpath: "src:type//src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "type name",
                    pre: "",
                    post: "",
                    grammar: "type where equal to"
                },
                "TYPE_NOT_NAMED": {
                    buttonName: "Type 'name' is not ...",
                    xpath: "src:type//src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "type not named",
                    pre: "",
                    post: "",
                    grammar: "type where not equal to"
                }
            },
            "after_1": {
                "NAME_EQUALS_TO": {
                    buttonName: "Name equals to ...",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where equal to"
                },
                "NAME_NOT_EQUALS_TO": {
                    buttonName: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not equal to"
                },
                "NAME_INCLUDES": {
                    buttonName: "Name include ...",
                    xpath: "src:name[contains(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where include"
                },
                "NAME_NOT_INCLUDES": {
                    buttonName: "Name not include ...",
                    xpath: "src:name[not(contains(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not include"
                },
                "NAME_STARTS_WITH": {
                    buttonName: "Name starts with ...",
                    xpath: "src:name[starts-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "NAME_NOT_STARTS_WITH": {
                    buttonName: "Name not starts with ...",
                    xpath: "src:name[not(starts-with(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "NAME_ENDS_WITH": {
                    buttonName: "Name ends with ...",
                    xpath: "src:name[ends-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where end with"
                },
                "NAME_NOT_ENDS_WITH": {
                    buttonName: "Name not ends with ...",
                    xpath: "src:name[not(ends-with(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not end with"
                }
            },
            "after_2": {},
            "within": {},
            "child": {
                "type": {
                    buttonName: "type",
                    xpath: "src:type/src:name/text()",
                    child: "",
                    grammar: "type"
                },
                "name": {
                    buttonName: "name",
                    xpath: "src:name/text()",
                    child: "",
                    grammar: "name"
                }
            }
        },
        "call": {
            "top": {},
            "before_1": {
                "CALLER_IS": {
                    buttonName: "The caller is",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    pre: "",
                    post: "",
                    grammar: "caller where equals to"
                }
            },
            "before_2": {},
            "after_1": {
                "ARGUMENT": {
                    buttonName: "One of its argument is ...",
                    xpath: "src:argument_list/src:argument/src:expr",
                    type: "expression",
                    pre: "",
                    post: ",",
                    grammar: "argument"
                }
            },
            "after_2": {},
            "within": {},
            "child": {
                "expression": {
                    buttonName: "argument",
                    xpath: "src:argument_list/src:argument/src:expr",
                    child: "expression",
                    grammar: "argument"
                },
                "name": {
                    buttonName: "caller",
                    xpath: "src:name/text()",
                    child: "",
                    grammar: "caller"
                }
            }
        },
        "annotation": {
            "top": {},
            "before_1": {
                "NAME_EQUALS_TO": {
                    buttonName: "Name equals to ...",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where equal to"
                },
                "NAME_NOT_EQUALS_TO": {
                    buttonName: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not equal to"
                },
                "NAME_INCLUDES": {
                    buttonName: "Name include ...",
                    xpath: "src:name[contains(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where include"
                },
                "NAME_NOT_INCLUDES": {
                    buttonName: "Name not include ...",
                    xpath: "src:name[not(contains(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not include"
                },
                "NAME_STARTS_WITH": {
                    buttonName: "Name starts with ...",
                    xpath: "src:name[starts-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "NAME_NOT_STARTS_WITH": {
                    buttonName: "Name not starts with ...",
                    xpath: "src:name[not(starts-with(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "NAME_ENDS_WITH": {
                    buttonName: "Name ends with ...",
                    xpath: "src:name[ends-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where end with"
                },
                "NAME_NOT_ENDS_WITH": {
                    buttonName: "Name not ends with ...",
                    xpath: "src:name[not(ends-with(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not end with"
                }
            },
            "before_2": {},
            "after_1": {
                "ARGUMENT": {
                    buttonName: "It has argument ...",
                    xpath: "src:argument_list/src:argument/src:expr",
                    type: "expression",
                    pre: "",
                    post: ",",
                    grammar: "argument"
                }

            },
            "after_2": {},
            "within": {},
            "child": {
                "name": {
                    buttonName: "name", xpath: "src:name/text()",
                    child: "", grammar: "name"
                }
            }
        }
    };

    static state_children = {
        "top": [],
        "before_1": [],
        "before_2": [],
        "after_1": [],
        "after_2": [],
        "within": [],
        "child": {}
    };

}
