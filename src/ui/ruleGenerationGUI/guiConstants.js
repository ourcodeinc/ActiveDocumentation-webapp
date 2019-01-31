
export class GuiConstants {

    static base_elements = ["class", "interface", "function", "abstract function", "constructor"]

    static code_fragment = {
        "class": {
            "top": ["annotation equal to", "annotation not equal to"],
            "before_1": ["specifier equal to", "specifier not equal to"],
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
                "extension equal to",
                "extension not equal to",
                "implementation equal to",
                "implementation not equal to"
            ],
            "within": [
                "function",
                "abstract function",
                "constructor",
                "declaration statement",
                "class",
                "interface"
            ],
            "child": [
                "annotation",
                "specifier",
                "name",
                "extension",
                "implementation",
                "class",
                "function",
                "constructor",
                "abstract function",
                "declaration statement",
                "interface"
            ]
        },
        "function": {
            "top": ["annotation equal to", "annotation not equal to"],
            "before_1": ["specifier equal to", "specifier not equal to"],
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
            "after_1": ["parameter equal to", "parameter not equal to"],
            "after_2": [],
            "within": [
                "return value equal to",
                "return value not equal to",
                "expression statement equal to",
                "expression statement not equal to",
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
            "top": ["annotation equal to", "annotation not equal to"],
            "before_1": ["specifier equal to", "specifier not equal to"],
            "before_2": [],
            "after_1": ["parameter equal to", "parameter not equal to"],
            "after_2": [],
            "within": [
                "expression statement equal to",
                "expression statement not equal to",
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
            "top": ["annotation equal to", "annotation not equal to"],
            "before_1": ["specifier equal to", "specifier not equal to"],
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
            "after_1": ["parameter equal to", "parameter not equal to"],
            "after_2": [],
            "within": [],
            "child": [
                "annotation",
                "specifier",
                "name",
                "parameter"
            ]
        },
        "declaration statement": {
            "top": ["annotation equal to", "annotation not equal to"],
            "before_1": ["specifier equal to", "specifier not equal to"],
            "before_2": ["type equal to", "type not equal to"],
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
            "after_2": ["initial value equal to", "initial value not equal to"],
            "within": [],
            "child": [
                "annotation",
                "specifier",
                "type",
                "name",
                "initial value"
            ]
        },
        "interface": {
            "top": ["annotation equal to", "annotation not equal to"],
            "before_1": ["specifier equal to", "specifier not equal to"],
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
            "after_2": [],
            "within": [
                "abstract function",
                "declaration statement",
                "interface"
            ],
            "child": [
                "annotation",
                "specifier",
                "name",
                "interface",
                "abstract function",
                "declaration statement",
                "interface"
            ]
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
        "class": {
            buttonName: "Have subclass ...",
            type: "class",
            pre: "",
            post: "",
            grammar: "class"
        },
        "interface": {
            buttonName: "Have interface ...",
            type: "interface",
            pre: "",
            post: "",
            grammar: "interface"
        },
        "function": {
            buttonName: "Have function ...",
            type: "function",
            pre: "",
            post: "",
            grammar: "function"
        },
        "abstract function": {
            buttonName: "Have abstract function ...",
            type: "abstract function",
            pre: "",
            post: "",
            grammar: "abstract function"
        },
        "constructor": {
            buttonName: "Have constructor ...",
            type: "constructor",
            pre: "",
            post: "",
            grammar: "constructor"
        },
        "declaration statement": {
            buttonName: "Have declaration statement ...",
            type: "declaration statement",
            pre: "",
            post: "",
            grammar: "declaration statement"
        },

        "annotation": {
            buttonName: "Annotation",
            type: "text",
            placeholder: "annotation",
            pre: "@",
            post: "",
            grammar: "annotation"
        },
        "annotation equal to": {
            buttonName: "Have annotation equal to ...",
            type: "text",
            placeholder: "annotation",
            pre: "@",
            post: "",
            grammar: "annotation where equal to"
        },
        "annotation not equal to": {
            buttonName: "Have annotation not equal to ...",
            type: "text",
            placeholder: "annotation",
            pre: "@",
            post: "",
            grammar: "annotation where not equal to"
        },

        "specifier": {
            buttonName: "Specifier",
            placeholder: "specifier",
            type: "text",
            pre: "",
            post: "",
            grammar: "specifier"
        },
        "specifier equal to": {
            buttonName: "Have specifier equal to ...",
            placeholder: "specifier",
            type: "text",
            pre: "",
            post: "",
            grammar: "specifier where equal to"
        },
        "specifier not equal to": {
            buttonName: "Have specifier not equal to ...",
            placeholder: "specifier",
            type: "text",
            pre: "",
            post: "",
            grammar: "specifier where not equal to"
        },

        "name": {
            buttonName: "Name",
            type: "text",
            placeholder: "name",
            pre: "",
            post: "",
            grammar: "name"
        },
        "name equal to": {
            buttonName: "Have name equal to ...",
            type: "text",
            placeholder: "name",
            pre: "",
            post: "",
            grammar: "name where equal to"
        },
        "name not equal to": {
            buttonName: "Have name not equal to ...",
            type: "text",
            placeholder: "name",
            pre: "",
            post: "",
            grammar: "name where not equal to"
        },
        "name include": {
            buttonName: "Have name include ...",
            type: "text",
            placeholder: "name",
            pre: "",
            post: "",
            grammar: "name where include"
        },
        "name not include": {
            buttonName: "Have name not include ...",
            type: "text",
            placeholder: "name",
            pre: "",
            post: "",
            grammar: "name where not include"
        },
        "name start with": {
            buttonName: "Have name starts with ...",
            type: "text",
            placeholder: "name",
            pre: "",
            post: "",
            grammar: "name where start with"
        },
        "name not start with": {
            buttonName: "Have name not starts with ...",
            type: "text",
            placeholder: "name",
            pre: "",
            post: "",
            grammar: "name where not start with"
        },
        "name end with": {
            buttonName: "Have name ends with ...",
            type: "text",
            placeholder: "name",
            pre: "",
            post: "",
            grammar: "name where end with"
        },
        "name not end with": {
            buttonName: "Have name not ends with ...",
            type: "text",
            placeholder: "name",
            pre: "",
            post: "",
            grammar: "name where not end with"

        },

        "extension": {
            buttonName: "Extension",
            type: "text",
            placeholder: "extension",
            pre: "extends",
            post: "",
            grammar: "extension"
        },
        "extension equal to": {
            buttonName: "Have extension equal to ...",
            type: "text",
            placeholder: "parent class",
            pre: "extends",
            post: "",
            grammar: "extension where equal to"
        },
        "extension not equal to": {
            buttonName: "Have extension not equal to ...",
            type: "text",
            placeholder: "parent class",
            pre: "extends",
            post: "",
            grammar: "extension where not equal to"
        },

        "implementation": {
            buttonName: "Implementation",
            type: "text",
            placeholder: "implement",
            pre: "implements",
            post: "",
            grammar: "implementation"
        },
        "implementation equal to": {
            buttonName: "Have implement equal to ...",
            type: "text",
            placeholder: "implemented class",
            pre: "implements",
            post: "",
            grammar: "implementation where equal to"
        },
        "implementation not equal to": {
            buttonName: "Have implement not equal to ...",
            type: "text",
            placeholder: "implemented class",
            pre: "implements",
            post: "",
            grammar: "implementation where not equal to"

        },

        "parameter": {
            buttonName: "Parameter",
            type: "text",
            placeholder: "parameter",
            pre: "",
            post: "",
            grammar: "parameter"
        },
        "parameter equal to": {
            buttonName: "Have parameter equal to ...",
            type: "text",
            placeholder: "parameter",
            pre: "",
            post: "",
            grammar: "parameter where equal to"
        },
        "parameter not equal to": {
            buttonName: "Have parameter not equal to ...",
            type: "text",
            placeholder: "parameter",
            pre: "",
            post: "",
            grammar: "parameter where not equal to"
        },

        "expression statement": {
            buttonName: "Expression statement",
            type: "wideText",
            placeholder: "expression statement",
            pre: "",
            post: ";",
            grammar: "expression statement"
        },
        "expression statement equal to": {
            buttonName: "Have expression statement equal to ...",
            type: "wideText",
            placeholder: "expression statement",
            pre: "",
            post: ";",
            grammar: "expression statement where equal to"
        },
        "expression statement not equal to": {
            buttonName: "Have expression statement not equal to ...",
            type: "wideText",
            placeholder: "expression statement",
            pre: "",
            post: ";",
            grammar: "expression statement where not equal to"
        },

        "type": {
            buttonName: "Type",
            type: "text",
            placeholder: "type",
            pre: "",
            post: "",
            grammar: "type"
        },
        "type equal to": {
            buttonName: "Have type equal to ...",
            type: "text",
            placeholder: "type",
            pre: "",
            post: "",
            grammar: "type where equal to"
        },
        "type not equal to": {
            buttonName: "Have type not equal to ...",
            type: "text",
            placeholder: "type",
            pre: "",
            post: "",
            grammar: "type where not equal to"
        },

        "initial value": {
            buttonName: "Initialization",
            type: "text",
            placeholder: "initial value/expression",
            pre: "",
            post: "",
            grammar: "initial value"
        },
        "initial value equal to": {
            buttonName: "Have initialization equal to ...",
            type: "text",
            placeholder: "initial value/expression",
            pre: "",
            post: "",
            grammar: "initial value where equal to"
        },
        "initial value not equal to": {
            buttonName: "Have initialization not equal to...",
            type: "text",
            placeholder: "initial value/expression",
            pre: "",
            post: "",
            grammar: "initial value where not equal to"
        },

        "return value": {
            buttonName: "Return value/expression",
            type: "wideText",
            placeholder: "return expression/value",
            pre: "",
            post: "",
            grammar: "return value"
        },
        "return value equal to": {
            buttonName: "Have return Value equal to ...",
            type: "wideText",
            placeholder: "Return Value is ...",
            pre: "return",
            post: "",
            grammar: "return value where equal to"
        },
        "return value not equal to": {
            buttonName: "Have return Value not equal to ...",
            type: "wideText",
            placeholder: "Return Value is not ...",
            pre: "return",
            post: "",
            grammar: "return value where not equal to"
        }
    }

}
