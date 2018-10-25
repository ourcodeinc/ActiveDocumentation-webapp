
// xpath property is not used

export class GuiConstants {

    static code_fragment_old = {
        "class": {
            "top": {
                "annotation": {
                    buttonName: "Has annotation",
                    xpath: "src:annotation",
                    type: "annotation",
                    pre: "",
                    post: "",
                    grammar: "annotation"
                }
            },
            "before_1": {
                "specifier": {
                    buttonName: "Specifier is ...",
                    xpath: "src:specifier/text()=\"<NAME>\"",
                    placeholder: "specifier",
                    type: "text",
                    pre: "",
                    post: "",
                    grammar: "specifier where equal to"
                },
                "specifier not": {
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
                "name equal to": {
                    buttonName: "Name equals to ...",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "class name",
                    pre: "",
                    post: "",
                    grammar: "name where equal to"
                },
                "name not equal to": {
                    buttonName: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "class name",
                    pre: "",
                    post: "",
                    grammar: "name where not equal to"
                },
                "name include": {
                    buttonName: "Name include ...",
                    xpath: "src:name[contains(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "class name",
                    pre: "",
                    post: "",
                    grammar: "name where include"
                },
                "name not include": {
                    buttonName: "Name not include ...",
                    xpath: "src:name[not(contains(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "class name",
                    pre: "",
                    post: "",
                    grammar: "name where not include"
                },
                "name start with": {
                    buttonName: "Name starts with ...",
                    xpath: "src:name[starts-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "class name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "name not start with": {
                    buttonName: "Name not starts with ...",
                    xpath: "src:name[not(starts-with(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "class name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "name end with": {
                    buttonName: "Name ends with ...",
                    xpath: "src:name[ends-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "class name",
                    pre: "",
                    post: "",
                    grammar: "name where end with"
                },
                "name not end with": {
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
                "extend": {
                    buttonName: "Extends class named ...",
                    xpath: "src:super/src:extends/src:name/text()=\"<NAME>\"",
                    type: "text",
                    pre: "extends",
                    post: "",
                    grammar: "extension where equal to"
                },
                "extend not": {
                    buttonName: "Extends class not named ...",
                    xpath: "src:super/src:extends/src:name/text()!=\"<NAME>\"",
                    type: "text",
                    pre: "extends",
                    post: "",
                    grammar: "extension where not equal to"
                },
                "implement": {
                    buttonName: "Implements class named ...",
                    xpath: "src:super/src:implements/src:name/text()=\"<NAME>\"",
                    type: "text",
                    pre: "implements",
                    post: "",
                    grammar: "implementation where equal to"
                },
                "implement not": {
                    buttonName: "Implements class not named ...",
                    xpath: "src:super/src:implements/src:name/text()!=\"<NAME>\"",
                    type: "text",
                    pre: "implements",
                    post: "",
                    grammar: "implementation where not equal to"
                }
            },
            "within": {
                "function": {
                    buttonName: "Has function ...",
                    xpath: "src:block/src:function",
                    type: "function",
                    pre: "",
                    post: "",
                    grammar: "function"
                },
                "abstract function": {
                    buttonName: "Has abstractFunction ...",
                    xpath: "src:block/src:function_decl",
                    type: "abstract function",
                    pre: "",
                    post: "",
                    grammar: "abstract function"
                },
                "constructor": {
                    buttonName: "Has constructor ...",
                    xpath: "src:block/src:constructor",
                    type: "constructor",
                    pre: "",
                    post: "",
                    grammar: "constructor"
                },
                "declaration statement": {
                    buttonName: "Has declarationStatement ...",
                    xpath: "src:block/descendant-or-self::src:decl_stmt/src:decl",
                    type: "declaration statement",
                    pre: "",
                    post: "",
                    grammar: "declaration statement"
                },
                "class": {
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
                "abstract function": {
                    buttonName: "abstract function",
                    xpath: "src:block/src:function_decl",
                    child: "abstract function",
                    grammar: "abstract function"
                },
                "declaration statement": {
                    buttonName: "declaration statement",
                    xpath: "src:block/descendant-or-self::src:decl_stmt/src:decl",
                    child: "declaration statement",
                    grammar: "declaration statement"
                }
            }
        },
        "function": {
            "top": {
                "annotation": {
                    buttonName: "Has annotation",
                    xpath: "src:annotation",
                    type: "annotation",
                    pre: "",
                    post: "",
                    grammar: "annotation"
                }
            },
            "before_1": {
                "specifier": {
                    buttonName: "Specifier is ...",
                    xpath: "src:specifier/text()=\"<NAME>\"",
                    placeholder: "specifier",
                    type: "text",
                    pre: "",
                    post: "",
                    grammar: "specifier where equal to"
                },
                "specifier not": {
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
                "name equal to": {
                    buttonName: "Name equals to ...",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where equal to"
                },
                "name not equal to": {
                    buttonName: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where not equal to"
                },
                "name include": {
                    buttonName: "Name include ...",
                    xpath: "src:name[contains(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where include"
                },
                "name not include": {
                    buttonName: "Name not include ...",
                    xpath: "src:name[not(contains(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where not include"
                },
                "name start with": {
                    buttonName: "Name starts with ...",
                    xpath: "src:name[starts-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "name not start with": {
                    buttonName: "Name not starts with ...",
                    xpath: "src:name[not(starts-with(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "name end with": {
                    buttonName: "Name ends with ...",
                    xpath: "src:name[ends-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where end with"
                },
                "name not end with": {
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
                "parameter": {
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
                "return value": {
                    buttonName: "Return value/variable is ...",
                    xpath: "src:block/descendant-or-self::src:return/src:expr",
                    type: "return value",
                    pre: "",
                    post: "",
                    grammar: "return value where have expression statement"
                },
                "expression statement": {
                    buttonName: "Has expression statement ...",
                    xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr",
                    type: "expression statement",
                    pre: "",
                    post: "",
                    grammar: "expression statement"
                },
                "declaration statement": {
                    buttonName: "Has declarationStatement ...",
                    xpath: "src:block/descendant-or-self::src:decl_stmt",
                    type: "declaration statement",
                    pre: "",
                    post: "",
                    grammar: "declaration statement"
                }
            },
            "child": {
                "annotation": {
                    buttonName: "annotation", xpath: "src:annotation",
                    //child: "annotation",
                    grammar: "annotation"
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
                "expression statement": {
                    buttonName: "assignment expression",
                    xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr",
                    child: "expression statement",
                    grammar: "expression statement",
                },
                "declaration statement": {
                    buttonName: "declaration statement",
                    xpath: "src:block/descendant-or-self::src:decl_stmt/src:decl",
                    child: "declaration statement",
                    grammar: "declaration statement"
                },
                "return value": {
                    buttonName: "return value",
                    xpath: "src:block/descendant-or-self::src:return/src:expr",
                    child: "return value",
                    grammar: "return value"
                }
            }
        },
        "constructor": {
            "top": {
                "annotation": {
                    buttonName: "Has annotation",
                    xpath: "src:annotation",
                    type: "annotation",
                    pre: "",
                    post: "",
                    grammar: "annotation"
                }
            },
            "before_1": {
                "specifier": {
                    buttonName: "Specifier is ...",
                    xpath: "src:specifier/text()=\"<NAME>\"",
                    placeholder: "specifier",
                    type: "text",
                    pre: "",
                    post: "",
                    grammar: "specifier where equal to"
                },
                "specifier not": {
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
                "parameter": {
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
                "expression statement": {
                    buttonName: "Has assignment expression ...",
                    xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr",
                    type: "expression statement",
                    pre: "",
                    post: "",
                    grammar: "expression statement"
                },
                "declaration statement": {
                    buttonName: "Has declaration ...",
                    xpath: "src:block/descendant-or-self::src:decl_stmt",
                    type: "declaration statement",
                    pre: "",
                    post: "",
                    grammar: "declaration statement"
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
                "expression statement": {
                    buttonName: "assignment expression",
                    xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr",
                    child: "expression statement",
                    grammar: "expression statement",
                },
                "declaration statement": {
                    buttonName: "declaration statement",
                    xpath: "src:block/descendant-or-self::src:decl_stmt",
                    child: "declaration statement",
                    grammar: "declaration statement"
                }
            }
        },
        "abstract function": {
            "top": {
                "annotation": {
                    buttonName: "Has annotation",
                    xpath: "src:annotation",
                    type: "annotation",
                    pre: "",
                    post: "",
                    grammar: "annotation"
                }
            },
            "before_1": {
                "specifier": {
                    buttonName: "Specifier is ...",
                    xpath: "src:specifier/text()=\"<NAME>\"",
                    placeholder: "specifier",
                    type: "text",
                    pre: "",
                    post: "",
                    grammar: "specifier where equal to"
                },
                "specifier not": {
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
                "name equal to": {
                    buttonName: "Name equals to ...",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where equal to"
                },
                "name not equal to": {
                    buttonName: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where not equal to"
                },
                "name include": {
                    buttonName: "Name include ...",
                    xpath: "src:name[contains(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where include"
                },
                "name not include": {
                    buttonName: "Name not include ...",
                    xpath: "src:name[not(contains(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where not include"
                },
                "name start with": {
                    buttonName: "Name starts with ...",
                    xpath: "src:name[starts-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "name not start with": {
                    buttonName: "Name not starts with ...",
                    xpath: "src:name[not(starts-with(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "name end with": {
                    buttonName: "Name ends with ...",
                    xpath: "src:name[ends-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "function name",
                    pre: "",
                    post: "",
                    grammar: "name where end with"
                },
                "name not end with": {
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
                "parameter": {
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
        "expression statement": {
            "top": {},
            "before_1": {
                "name": {
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
                "call": {
                    buttonName: "method invoke",
                    xpath: "src:call",
                    type: "call",
                    pre: "",
                    post: "",
                    grammar: "call"
                }
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
                "name": {
                    buttonName: "name",
                    xpath: "",
                    type: "srcml",
                    pre: "",
                    post: "",
                    grammar: "name"
                },
                "call": {
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
        "return value": {
            "top": {},
            "before_1": {
                "name": {
                    buttonName: "name",
                    xpath: "",
                    type: "srcml",
                    pre: "",
                    post: "",
                    grammar: "name"
                },
                "call": {
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
        "declaration statement": {
            "top": {
                "annotation": {
                    buttonName: "Has annotation",
                    xpath: "src:annotation",
                    type: "annotation",
                    pre: "",
                    post: "",
                    grammar: "annotation"
                }
            },
            "before_1": {
                "specifier": {
                    buttonName: "Specifier is ...",
                    xpath: "src:specifier/text()=\"<NAME>\"",
                    placeholder: "specifier",
                    type: "text",
                    pre: "",
                    post: "",
                    grammar: "specifier where equal to"
                },
                "specifier not": {
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
                "type name": {
                    buttonName: "Type 'name' is ...",
                    xpath: "src:type//src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "type name",
                    pre: "",
                    post: "",
                    grammar: "type where equal to"
                },
                "type not name": {
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
                "name equal to": {
                    buttonName: "Name equals to ...",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where equal to"
                },
                "name not equal to": {
                    buttonName: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not equal to"
                },
                "name include": {
                    buttonName: "Name include ...",
                    xpath: "src:name[contains(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where include"
                },
                "name not include": {
                    buttonName: "Name not include ...",
                    xpath: "src:name[not(contains(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not include"
                },
                "name start with": {
                    buttonName: "Name starts with ...",
                    xpath: "src:name[starts-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "name not start with": {
                    buttonName: "Name not starts with ...",
                    xpath: "src:name[not(starts-with(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "name end with": {
                    buttonName: "Name ends with ...",
                    xpath: "src:name[ends-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where end with"
                },
                "name not end with": {
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
                "init value": {
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
                "type name": {
                    buttonName: "Type 'name' is ...",
                    xpath: "src:type//src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "type name",
                    pre: "",
                    post: "",
                    grammar: "type where equal to"
                },
                "type not name": {
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
                "name equal to": {
                    buttonName: "Name equals to ...",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where equal to"
                },
                "name not equal to": {
                    buttonName: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not equal to"
                },
                "name include": {
                    buttonName: "Name include ...",
                    xpath: "src:name[contains(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where include"
                },
                "name not include": {
                    buttonName: "Name not include ...",
                    xpath: "src:name[not(contains(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not include"
                },
                "name start with": {
                    buttonName: "Name starts with ...",
                    xpath: "src:name[starts-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "name not start with": {
                    buttonName: "Name not starts with ...",
                    xpath: "src:name[not(starts-with(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "name end with": {
                    buttonName: "Name ends with ...",
                    xpath: "src:name[ends-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where end with"
                },
                "name not end with": {
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
                "caller": {
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
                "argument": {
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
                "name equal to": {
                    buttonName: "Name equals to ...",
                    xpath: "src:name/text()=\"<NAME>\"",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where equal to"
                },
                "name not equal to": {
                    buttonName: "Name not equals to ...",
                    xpath: "src:name/text()!=\"<NAME>\"",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not equal to"
                },
                "name include": {
                    buttonName: "Name include ...",
                    xpath: "src:name[contains(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where include"
                },
                "name not include": {
                    buttonName: "Name not include ...",
                    xpath: "src:name[not(contains(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not include"
                },
                "name start with": {
                    buttonName: "Name starts with ...",
                    xpath: "src:name[starts-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "name not start with": {
                    buttonName: "Name not starts with ...",
                    xpath: "src:name[not(starts-with(text(),\"<NAME>\")]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where not start with"
                },
                "name end with": {
                    buttonName: "Name ends with ...",
                    xpath: "src:name[ends-with(text(),\"<NAME>\"]",
                    type: "text",
                    placeholder: "name",
                    pre: "",
                    post: "",
                    grammar: "name where end with"
                },
                "name not end with": {
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
                "argument": {
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

    static code_fragment = {
        "class": {
            "top": ["annotation"],
            "before_1": ["specifier", "specifier not"],
            "before_2": [],
            "after_1": [
                "name equal to",
                "name not equal to",
                "name include",
                "name not include",
                "name start with",
                "name not start with",
                "name end with",
                "name not end with"
            ],
            "after_2": [
                "extend",
                "extend not",
                "implement",
                "implement not"
            ],
            "within": [
                "function",
                "abstract function",
                "constructor",
                "declaration statement",
                "class"
            ],
            "child": [
                "annotation",
                "specifier",
                "name",
                "extend",
                "implement",
                "class",
                "function",
                "constructor",
                "abstract function",
                "declaration statement"
            ]
        },
        "function": {
            "top": ["annotation"],
            "before_1": ["specifier", "specifier not"],
            "before_2": [
                "name equal to",
                "name not equal to",
                "name include",
                "name not include",
                "name start with",
                "name not start with",
                "name end with",
                "name not end with"
            ],
            "after_1": ["parameter"],
            "after_2": [],
            "within": [
                "return value",
                "expression statement",
                "declaration statement"
            ],
            "child": [
                "annotation",
                "specifier",
                "name",
                "parameter",
                "expression statement",
                "declaration statement",
                "return value"
            ]
        },
        "constructor": {
            "top": ["annotation"],
            "before_1": ["specifier", "specifier not"],
            "before_2": [],
            "after_1": ["parameter"],
            "after_2": [],
            "within": [
                "expression statement",
                "declaration statement"
            ],
            "child": [
                "annotation",
                "specifier",
                "name",
                "parameter",
                "expression statement",
                "declaration statement"
            ]
        },
        "abstract function": {
            "top": ["annotation"],
            "before_1": ["specifier", "specifier not"],
            "before_2": [
                "name equal to",
                "name not equal to",
                "name include",
                "name not include",
                "name start with",
                "name not start with",
                "name end with",
                "name not end with"
            ],
            "after_1": ["parameter"],
            "after_2": [],
            "within": [],
            "child": [
                "annotation",
                "specifier",
                "name",
                "parameter"
            ]
        },
        "expression statement": {
            "top": [],
            "before_1": ["name"],
            "before_2": [],
            "after_1": ["call"],
            "after_2": [],
            "within": [],
            "child": ["call", "name"]
        },
        "expression": {
            "top": [],
            "before_1": ["name", "call"],
            "before_2": [],
            "after_1": [],
            "after_2": [],
            "within": [],
            "child": ["call", "name"]
        },
        "return value": {
            "top": [],
            "before_1": ["name", "call"],
            "before_2": [],
            "after_1": [],
            "after_2": [],
            "within": [],
            "child": ["call", "name"]
        },
        "declaration statement": {
            "top": ["annotation"],
            "before_1": ["specifier", "specifier not"],
            "before_2": ["type name", "type not name"],
            "after_1": [
                "name equal to",
                "name not equal to",
                "name include",
                "name not include",
                "name start with",
                "name not start with",
                "name end with",
                "name not end with"
            ],
            "after_2": ["init value"],
            "within": [],
            "child": [
                "annotation",
                "specifier",
                "type",
                "name",
                "init value"
            ]
        },
        // used for parameter in functions
        "declaration": {
            "top": [],
            "before_1": [],
            "before_2": ["type name", "type not name"],
            "after_1": [
                "name equal to",
                "name not equal to",
                "name include",
                "name not include",
                "name start with",
                "name not start with",
                "name end with",
                "name not end with"
            ],
            "after_2": [],
            "within": [],
            "child": ["type", "name"]
        },
        "call": {
            "top": [],
            "before_1": ["caller"],
            "before_2": [],
            "after_1": ["argument"],
            "after_2": [],
            "within": [],
            "child": ["argument", "name"]
        },
        "annotation": {
            "top": [],
            "before_1": [
                "name equal to",
                "name not equal to",
                "name include",
                "name not include",
                "name start with",
                "name not start with",
                "name end with",
                "name not end with"
            ],
            "before_2": [],
            "after_1": ["argument"],
            "after_2": [],
            "within": [],
            "child": ["name"]
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

    static gui_tree = {
        "annotation": {
            buttonName: "Has annotation",
            xpath: "src:annotation",
            type: "annotation",
            pre: "",
            post: "",
            grammar: "annotation"
        },
        "specifier": {
            buttonName: "Specifier is ...",
            xpath: "src:specifier/text()=\"<NAME>\"",
            placeholder: "specifier",
            type: "text",
            pre: "",
            post: "",
            grammar: "specifier where equal to"
        },
        "specifier not": {
            buttonName: "Specifier is not ...",
            xpath: "src:specifier/text()!=\"<NAME>\"",
            placeholder: "specifier",
            type: "text",
            pre: "",
            post: "",
            grammar: "specifier where not equal to"
        },
        "name equal to": {
            buttonName: "Name equals to ...",
            xpath: "src:name/text()=\"<NAME>\"",
            type: "text",
            placeholder: "class name",
            pre: "",
            post: "",
            grammar: "name where equal to"
        },
        "name not equal to": {
            buttonName: "Name not equals to ...",
            xpath: "src:name/text()!=\"<NAME>\"",
            type: "text",
            placeholder: "class name",
            pre: "",
            post: "",
            grammar: "name where not equal to"
        },
        "name include": {
            buttonName: "Name include ...",
            xpath: "src:name[contains(text(),\"<NAME>\"]",
            type: "text",
            placeholder: "class name",
            pre: "",
            post: "",
            grammar: "name where include"
        },
        "name not include": {
            buttonName: "Name not include ...",
            xpath: "src:name[not(contains(text(),\"<NAME>\")]",
            type: "text",
            placeholder: "class name",
            pre: "",
            post: "",
            grammar: "name where not include"
        },
        "name start with": {
            buttonName: "Name starts with ...",
            xpath: "src:name[starts-with(text(),\"<NAME>\"]",
            type: "text",
            placeholder: "class name",
            pre: "",
            post: "",
            grammar: "name where not start with"
        },
        "name not start with": {
            buttonName: "Name not starts with ...",
            xpath: "src:name[not(starts-with(text(),\"<NAME>\")]",
            type: "text",
            placeholder: "class name",
            pre: "",
            post: "",
            grammar: "name where not start with"
        },
        "name end with": {
            buttonName: "Name ends with ...",
            xpath: "src:name[ends-with(text(),\"<NAME>\"]",
            type: "text",
            placeholder: "class name",
            pre: "",
            post: "",
            grammar: "name where end with"
        },
        "name not end with": {
            buttonName: "Name not ends with ...",
            xpath: "src:name[not(ends-with(text(),\"<NAME>\")]",
            type: "text",
            placeholder: "class name",
            pre: "",
            post: "",
            grammar: "name where not end with"

        },
        "extend": {
            buttonName: "Extends class named ...",
            xpath: "src:super/src:extends/src:name/text()=\"<NAME>\"",
            type: "text",
            pre: "extends",
            post: "",
            grammar: "extension where equal to"
        },
        "extend not": {
            buttonName: "Extends class not named ...",
            xpath: "src:super/src:extends/src:name/text()!=\"<NAME>\"",
            type: "text",
            pre: "extends",
            post: "",
            grammar: "extension where not equal to"
        },
        "implement": {
            buttonName: "Implements class named ...",
            xpath: "src:super/src:implements/src:name/text()=\"<NAME>\"",
            type: "text",
            pre: "implements",
            post: "",
            grammar: "implementation where equal to"
        },
        "implement not": {
            buttonName: "Implements class not named ...",
            xpath: "src:super/src:implements/src:name/text()!=\"<NAME>\"",
            type: "text",
            pre: "implements",
            post: "",
            grammar: "implementation where not equal to"

        },
        "function": {
            buttonName: "Has function ...",
            xpath: "src:block/src:function",
            type: "function",
            pre: "",
            post: "",
            grammar: "function"
        },
        "abstract function": {
            buttonName: "Has abstractFunction ...",
            xpath: "src:block/src:function_decl",
            type: "abstract function",
            pre: "",
            post: "",
            grammar: "abstract function"
        },
        "constructor": {
            buttonName: "Has constructor ...",
            xpath: "src:block/src:constructor",
            type: "constructor",
            pre: "",
            post: "",
            grammar: "constructor"
        },
        "declaration statement": {
            buttonName: "Has declarationStatement ...",
            xpath: "src:block/descendant-or-self::src:decl_stmt/src:decl",
            type: "declaration statement",
            pre: "",
            post: "",
            grammar: "declaration statement"
        },
        "class": {
            buttonName: "Has subclass ...",
            xpath: "src:block/src:class",
            type: "class",
            pre: "",
            post: "",
            grammar: "class"
        },
        "parameter": {
            buttonName: "One of its parameter is ...",
            xpath: "src:parameter_list/src:parameter/src:decl",
            type: "declaration",
            pre: "",
            post: "",
            grammar: "parameter"
        },
        "return value": {
            buttonName: "Return value/variable is ...",
            xpath: "src:block/descendant-or-self::src:return/src:expr",
            type: "return value",
            pre: "",
            post: "",
            grammar: "return value where have expression statement"
        },
        "expression statement": {
            buttonName: "Has expression statement ...",
            xpath: "src:block/descendant-or-self::src:expr_stmt/src:expr",
            type: "expression statement",
            pre: "",
            post: "",
            grammar: "expression statement"
        },
        "name": {
            buttonName: "name",
            xpath: "",
            type: "srcml",
            pre: "",
            post: "",
            grammar: "name"
        },
        "call": {
            buttonName: "method invoke",
            xpath: "src:call",
            type: "call",
            pre: "",
            post: "",
            grammar: "call"
        },
        "type name": {
            buttonName: "Type 'name' is ...",
            xpath: "src:type//src:name/text()=\"<NAME>\"",
            type: "text",
            placeholder: "type name",
            pre: "",
            post: "",
            grammar: "type where equal to"
        },
        "type not name": {
            buttonName: "Type 'name' is not ...",
            xpath: "src:type//src:name/text()!=\"<NAME>\"",
            type: "text",
            placeholder: "type not named",
            pre: "",
            post: "",
            grammar: "type where not equal to"
        },
        "init value": {
            buttonName: "Has initialization ...",
            xpath: "src:init",
            type: "expression",
            pre: "",
            post: "",
            grammar: "initial value"
        },
        "caller": {
            buttonName: "The caller is",
            xpath: "src:name/text()=\"<NAME>\"",
            type: "text",
            pre: "",
            post: "",
            grammar: "caller where equals to"
        },
        "argument": {
            buttonName: "One of its argument is ...",
            xpath: "src:argument_list/src:argument/src:expr",
            type: "expression",
            pre: "",
            post: ",",
            grammar: "argument"
        },
        "type": {
            buttonName: "type",
            xpath: "src:type/src:name/text()",
            type: "text",
            pre: "",
            post: "",
            grammar: "type"
        }
    }

}
