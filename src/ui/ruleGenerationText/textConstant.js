export class TextConstants {

    static keywords = [
        "name", "annotation", "extension", "implementation", "function", "abstract function", "constructor", "parameter", "type",
        "specifier", "return value", "declaration statement", "expression statement", "initial value", "argument",
        "call", "caller", "class", "interface"];

    static connectors = ["where", "have", "must", "be", "equal", "to", "not", "and", "or", "include", "of", "(", ")", "start", "end", "with"];

    static autoComplete_suggestion = {
        "name": {
            whereClause: ["equal to", "not equal to", "include", "not include", "start with", "not start with", "end with", "not end with"],
            ofClause: ["class", "function", "abstract function", "type", "constructor", "argument", "extension"]
        },
        "annotation": {
            whereHaveClause: ["name", "argument"],
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
            whereHaveClause: ["annotation", "specifier", "parameter", "return value", "declaration statement",
                "expression statement"],
            ofClause: ["class"]
        },
        "parameter": {
            whereHaveClause: ["name", "type"],
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
            whereHaveClause: ["calls", "name"],
            ofClause: ["function"]
        },
        "declaration statement": {
            whereHaveClause: ["annotation", "specifier", "types", "name", "initial value"],
            ofClause: ["class", "function", "constructor"]
        },
        "expression statement": {
            whereHaveClause: ["calls", "name"],
            ofClause: ["function", "constructor", "constructor"]
        },
        "initial value": {
            whereHaveClause: ["calls", "name"],
            ofClause: ["declaration statement"]
        },
        "argument": {
            whereHaveClause: ["calls", "name"],
            ofClause: ["call"]
        },
        "call": {
            whereHaveClause: ["callers", "name"],
            ofClause: ["argument", "return value", "expression statement", "initial value"]
        },
        "caller": {
            whereHaveClause: ["name equal to", "name not equal to"],
            ofClause: ["calls"]
        },
        "value": {
            whereClause: ["equal to", "not equal to"],
            ofClause: ["argument", "return value", "expression statement", "initial value"]
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
        "function must have name",
        "abstract function must have annotation",
        "constructor must have expression statement",
        "class must be equal to class",
        "class where have annotation must have name"
    ]

}
