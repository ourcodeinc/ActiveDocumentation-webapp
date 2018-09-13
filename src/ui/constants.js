export class constants {

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

    static initial_state = {
        index: "",
        title: "",
        description: "",
        folderConstraint: "",
        filesFolders: [],
        tags: [],
        xPathState: {
            activeTab: "quantifier",
            quantifierDetail: "",
            ruleType: "",
            cRuleType: "",
            constraintDetail: "",
            quantifier: {
                q0: {
                    key: "",
                    value: "",
                    target: "follows",
                    children: {
                        "top": [],
                        "before": [],
                        "before_1": [],
                        "before_2": [],
                        "after": [],
                        "after_1": [],
                        "after_2": [],
                        "within": [],
                        "follows": {}
                    },
                    xpath: "src:class"
                },
                q1: {
                    key: "",
                    value: "",
                    target: "follows",
                    children: {
                        "top": [],
                        "before": [],
                        "before_1": [],
                        "before_2": [],
                        "after": [],
                        "after_1": [],
                        "after_2": [],
                        "within": [],
                        "follows": {}
                    },
                    xpath: "src:class"
                },
                q2: {
                    key: "",
                    value: "",
                    target: "follows",
                    children: {
                        "top": [],
                        "before": [],
                        "before_1": [],
                        "before_2": [],
                        "after": [],
                        "after_1": [],
                        "after_2": [],
                        "within": [],
                        "follows": {}
                    },
                    xpath: "src:class"
                }
            },
            constraint: {
                q0: {
                    key: "",
                    value: "",
                    target: "follows",
                    children: {
                        "top": [],
                        "before": [],
                        "before_1": [],
                        "before_2": [],
                        "after": [],
                        "after_1": [],
                        "after_2": [],
                        "within": [],
                        "follows": {}
                    },
                    xpath: "src:class"
                },
                q1: {
                    key: "",
                    value: "",
                    target: "follows",
                    children: {
                        "top": [],
                        "before": [],
                        "before_1": [],
                        "before_2": [],
                        "after": [],
                        "after_1": [],
                        "after_2": [],
                        "within": [],
                        "follows": {}
                    },
                    xpath: "src:class"
                },
                q2: {
                    key: "",
                    value: "",
                    target: "follows",
                    children: {
                        "top": [],
                        "before": [],
                        "before_1": [],
                        "before_2": [],
                        "after": [],
                        "after_1": [],
                        "after_2": [],
                        "within": [],
                        "follows": {}
                    },
                    xpath: "src:class"
                }
            },
            q0: "src:unit/src:class",
            q1: "src:unit/src:class",
            q2: "src:unit/src:class",
            c0: "src:unit/src:class",
            c1: "src:unit/src:class",
            c2: "src:unit/src:class"
        }
    };

    static grammar_code_fragment = {
        "Class": {
            OF: ["Annotation", "Name", "Function", "Constructor", "AbstractFunction", "Declaration", "Subclass"],
            WHERE: ["Specifier", "Annotation", "Name", "Extends", "Function", "Constructor", "AbstractFunction", "Declaration", "Subclass"]
        },
        "Function": {
            OF: ["Specifier", "Annotation", "Name", "Expression", "Declaration", "Return Value", "Parameter"],
            WHERE: ["Annotation", "Specifier", "Name", "Parameter", "Return Value", "Declaration", "Expression"],
            restrictions: [
                "WHERE"
            ]
        },
        "Constructor": {
            OF: ["Specifier", "Annotation", "Expression", "Declaration", "Parameter"],
            WHERE: ["Specifier", "Annotation", "Parameter", "Return Value", "Declaration", "Expression"],
            restrictions: [
                "WHERE"
            ]
        },
        "AbstractFunction": {
            OF: ["Specifier", "Annotation", "Name", "Parameter"],
            WHERE: ["Annotation", "Specifier", "Name", "Parameter"],
            restrictions: [
                "WHERE"
            ]
        },
        "Specifier": {
            OF: ["Name"],
            WHERE: ["Name"],
            restrictions: [
                ["its Specifier", ["IS", "IS NOT"], "textbox"]
            ]
        },
        "Annotation": {
            OF: ["Name"],
            WHERE: ["Name", "Argument"],
            restrictions: [
                [["HAS", "HAS NOT"], "Annotation", "textbox"],
                "WHERE"
            ]
        },
        "Declaration": {
            OF: ["Name", "Type"],
            WHERE: ["Name"],
            restrictions: [
                "WHERE"
            ]
        },
        "Subclass": {
            OF: ["Annotation", "Name", "Function", "Constructor", "AbstractFunction", "Declaration", "Subclass"],
            WHERE: ["Specifier", "Annotation", "Name", "Extends", "Function", "Constructor", "AbstractFunction", "Declaration", "Subclass"],
            restrictions: [
                "WHERE"
            ]
        },
        "Return Value": {
            OF: ["Name", "Type"],
            WHERE: [], // TODO
            restrictions: [
                ["its return Value", ["IS", "IS NOT"], "textbox"],
                "WHERE"
            ]
        },
        "Parameter": {
            OF: [],
            WHERE: [], // TODO
            restrictions: [
                ["its Number Of Parameter", ["IS", "IS Greater than", "IS Less than"], "textbox"],
                "WHERE"
            ]
        },
        "Expression": {
            OF: ["Name", "Type"],
            WHERE: [], // TODO
            restrictions: [
                "WHERE"
            ]
        },
        "Type": {
            OF: [],
            WHERE: [],
            restrictions: [
                ["its Name", ["IS", "IS NOT", "INCLUDE", "NOT INCLUDE"], "textbox"]
            ]
        },
        "Name": {
            OF: [],
            WHERE: [],
            restrictions: [
                ["its Name", ["IS", "IS NOT", "INCLUDE", "NOT INCLUDE"], "textbox"]
            ]
        },
        "Extends": {
            OF: [],
            WHERE: [],
            restrictions: [
                ["textbox"]
            ]
        },
        "Argument": {
            OF: [],
            WHERE: [],
            restrictions: [
                ["its Argument", ["IS", "IS NOT"], "textbox"]
            ]
        }
    };

    // autoComplete for rule generation

    static replace_phrase = {
        "function foo": "function where (has name where equals to \"foo\")",
        "bar function": "function where has name where equals to \"bar\""
    };

    static grammar = {
        "of": ["class", "function", "abstract function", "declaration statement",
            "parameter", "annotation", "type", "constructor", "argument", "extension"],
        "where": ["have", "equal to", "not", "include"],
        "have": ["class", "function", "abstract function", "declaration statement",
            "parameter", "annotation", "type", "constructor", "argument", "extension"],
        "not": ["include", "contain"],

        "name": ["must", "must be equal to", "where [not] include/equal to", "of"],
        "name of": ["class", "function", "abstract function", "type", "constructor", "argument", "extension"],

        "annotation": ["must", "must be equal to", "where have", "of"],
        "annotation where have": ["name", "argument"],
        "annotation of": ["class", "function", "constructor", "abstract function", "declaration statement"],

        "extension": ["must", "must be equal to", "where [not] equal to", "of class"],

        "function": ["must", "must be equal to", "where have", "of class"],
        "function where have": ["annotation", "specifier", "name", "parameter", "return value", "declaration statement", "expression statement"],
        "function of": ["class"],

        "abstract function": ["must", "must be equal to", "where have", "of class"],
        "abstract function where have": ["annotation", "specifier", "name", "parameter"],

        "constructor": ["must", "must be equal to", "where have", "of class"],
        "constructor where have": ["annotation", "specifier", "parameter", "return value", "declaration statement", "expression statement"],

        "parameter": ["must", "must be equal to", "where have", "of"],
        "parameter where have": ["name", "type"],
        "parameter of": ["function", "constructor", "abstract function"],

        "type": ["must", "must be equal to", "where [not] equal to", "of"],
        "type of": ["parameter", "declaration statement"],

        "specifier": ["must", "must be equal to", "where [not] equal to", "of"],
        "specifier of": ["function", "constructor", "abstract function", "declaration statement", "class"],

        "return value": ["must", "must be equal to", "where have", "of function"],
        "return value where have": ["calls", "name"],

        "declaration statement": ["must", "must be equal to", "where have", "of"],
        "declaration statement of": ["class", "function", "constructor"],
        "declaration statement where have": ["annotation", "specifier", "types", "name", "initial value"],

        "expression statement": ["must", "must be equal to", "where have", "of"],
        "expression statement where have": ["calls", "name"],
        "expression statement of": ["function", "constructor", "constructor"],

        "initial value": ["must", "must be equal to", "where have", "of declaration statement"],
        "initial value where have": ["calls", "name"],

        "argument": ["must", "must be equal to", "where have", "of call"],
        "argument where have": ["calls", "name"],

        "call": ["must", "must be equal to", "where have", "of"],
        "call where have": ["callers", "name"],
        "call of": ["argument", "return value", "expression statement", "initValue"],

        "caller": ["must", "must be equal to", "where have name [not] equal to", "of calls"],

        "value": ["must", "must be equal to", "where [not] equal to", "of"],
        "value of": ["argument", "return value", "expression statement", "initial value"],

        "class": ["must", "must be equal to", "where have", "of class"],
        "class where have": ["annotation", "specifier", "name", "extension", "function", "abstract function", "constructor", "declaration statement", "class", "return value"],

    };

    /**
     * phrase: {value: replace with, auto_complete: string ( what to add after the first word)}
     */
    static phrases = {
        "function foo": {
            value: "function where (has name where equals to \"foo\")",
            auto_complete: "foo"
        },
        "bar function": {
            value: "function where has name where equals to \"bar\"",
            auto_complete: "function"
        },
        "Command class": {
            value: "class where has name where equals to \"Command\"",
            auto_complete: "class"
        }
    };

    static templates = [
        "class where have function where have name where equal to <Name>",
        "class where have entity where have name equal to <Name>"
    ]

}




