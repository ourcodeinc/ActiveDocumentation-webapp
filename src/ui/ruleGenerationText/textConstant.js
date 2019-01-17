export class TextConstants {

    static keywords = [
        "name", "annotation", "extension", "implementation", "function", "abstract function", "constructor", "parameter", "type",
        "specifier", "return value", "declaration statement", "expression statement", "class", "interface", "initial value"];

    static connectors = ["where", "have", "must", "be", "equal", "to", "not", "and", "or", "include", "of", "(", ")", "start", "end", "with"];

    static autoComplete_suggestion = {
        "name": {
            whereClause: ["equal to", "not equal to", "include", "not include", "start with", "not start with", "end with", "not end with"],
            ofClause: ["class", "function", "abstract function", "type", "constructor", "extension"]
        },
        "annotation": {
            whereClause: ["equal to", "not equal to"],
            ofClause: ["class", "function", "constructor", "abstract function", "declaration statement"]
        },
        "extension": {
            whereClause: ["equal to", "not equal to"],
            ofClause: []
        },
        "implementation": {
            whereClause: ["equal to", "not equal to"],
            ofClause: []
        },
        "function": {
            whereHaveClause: ["annotation", "specifier", "name", "parameter", "return value", "declaration statement",
                "expression statement"],
            ofClause: ["class"]
        },
        "abstract function": {
            whereHaveClause: ["annotation", "specifier", "name", "parameter"],
            ofClause: ["class"]
        },
        "constructor": {
            whereHaveClause: ["annotation", "specifier", "parameter", "declaration statement", "expression statement"],
            ofClause: ["class"]
        },
        "parameter": {
            whereClause: ["equal to", "not equal to"],
            ofClause: ["function", "constructor", "abstract function"]
        },
        "type": {
            whereClause: ["equal to", "not equal to"],
            ofClause: ["parameter", "declaration statement"]
        },
        "specifier": {
            whereClause: ["equal to", "not equal to"],
            ofClause: ["function", "constructor", "abstract function", "declaration statement", "class"]
        },
        "return value": {
            whereClause: ["equal to", "not equal to"],
            ofClause: ["function"]
        },
        "declaration statement": {
            whereHaveClause: ["annotation", "specifier", "type", "name", "initial value"],
            ofClause: ["class", "function", "constructor"]
        },
        "expression statement": {
            whereClause: ["equal to", "not equal to"],
            ofClause: ["function", "constructor", "constructor"]
        },
        "initial value": {
            whereClause: ["equal to", "not equal to"],
            ofClause: ["declaration statement"]
        },
        "value": {
            whereClause: ["equal to", "not equal to"],
            ofClause: ["return value", "expression statement"]
        },
        "class": {
            whereHaveClause: ["annotation", "specifier", "name", "extension", "function", "abstract function",
                "constructor", "declaration statement", "class", "return value", "implementation"],
            ofClause: ["class"]
        },
        "interface": {
            whereHaveClause: ["annotation", "specifier", "name", "abstract function", "declaration statement", "interface"],
            ofClause: ["class", "interface"]
        }
    };

    /**
     * for each word, there are suggestions
     * @type [Array]
     */
    static defined_phrases = [
        {
            replaceWordWith: "function foo",
            value: "function where (has name where equal to \"foo\")"
        },
        {
            replaceWordWith: "bar function",
            value: "function where (has name where equal to \"bar\")"
        },
        {
            replaceWordWith: "Command class",
            value: "class where has name where equal to \"Command\""
        }
    ];

    static phrase_hash = {"function": [0, 1], "foo": [0], "bar": [1], "Command": [2], "class": [2]};


    static templates = [
        "function where ((have annotation and have specifier where equal to \"public\") or have name where equal to \"exe\") " +
        "must (((have specifier where equal to \"static\") and have name where not start with \"test\") or (have declaration statement))  ",
        "function where have name where start with \"str\" must have annotation ",
        "function must have name ",
        "abstract function must have annotation ",
        "constructor must have expression statement ",
        "class must be equal to class ",
        "class where have annotation must have name ",
        "class where (have function where have name where equal to \"execute\") or (have extension where equal to \"Command\") " +
        "must have annotation where equal to \"Subclass(index=true)\" "
    ];


    static error_messages = {
        100: "'where' must be used after a valid keyword.",
        101: "'have' must be used after a keyword and 'where'.",
        102: "'be' must be used after a valid keyword and 'must'.",
        103: "'must' should be used only once in the rule.",


        200: "'must' must be used as keyword + '… must …'.", // not used
        201: "'equal' must be used as  valid keyword + 'must be equal to', 'where equal to', 'where not equal to'.",
        202: "'to' must be used as valid keyword + 'where equal to', 'must be equal to'.",
        203: "'not' must be used as valid keyword + 'where not' + 'equal to' or 'include/start with/end with' only for 'name'.",
        204: "'and'/'or' must be used as valid keyword + 'where (…) and/or (…)', 'where … and/or …'.",
        205: "'include' must be used as valid keyword + 'where include', 'where not include'.",
        206: "'start' must be used as keyword + 'where start with', keyword + 'where not start with'.",
        207: "'end' must be used as keyword + 'where end with', keyword + 'where not end with'.",
        208: "'with' must be used as 'end with', keyword + 'start with'.",
        209: "')' must be used as keyword + 'where (…)', '((…) and/or (…))'.",
        210: "'(' must be used as valid keyword + 'where ( have', '((…) and/or (…))', 'must ( have'.",
        211: "Parenthesis must be paired.",
        212: "'of' must be used as keyword + 'of', keyword + 'where … of'.",


        300: "The word before 'where' is not a valid keyword.",
        301: "The word before 'equal' is not a valid keyword.", // not used
        302: "The keyword does not have a restriction defined by 'have'.",
        303: "'The keyword before the corresponding open parenthesis is not valid.",
        304: "The first word in the rule is not a valid keyword.",

        400: "The input text is not valid. See examples and grammar rules documentation."
    }

}
