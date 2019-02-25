export const LANGUAGE_FORMAT = {
    brackets: [
        ["{", "}", "delimiter.curly"],
        ["[", "]", "delimiter.square"],
        ["(", ")", "delimiter.parenthesis"]
    ],

    keywords: ["must"],

    operators: [],

    // operators
    symbols: /([.]{2})|([=><!:|+\-~*/%,;]+)/,

    tokenizer: {
        root: [
            { include: "@whitespace" },

            // variables
            [/[A-Z][\w_]*('*)/, "tag"], // variable.name

            [
                /[a-zA-Z_][\w_]*('*)/,
                {
                    cases: {
                        "@keywords": "keyword",
                        "@default": "identifier"
                    }
                }
            ],

            // delimiters
            [/[{}()[]]/, "@brackets"],
            [/\./, "delimiter"],

            // numbers
            [/[-+]?\d+\/[-+]?\d*[1-9]/, "number"],
            [/[-+]?\d+(\.\d+)?/, "number"],
            [
                /@symbols/,
                {
                    cases: {
                        "@operators": "keyword",
                        "@default": "symbols"
                    }
                }
            ],

            // strings
            [/"([^"\\]|\\.)*$/, "string.invalid"], // non-teminated string
            [/"/, "string", "@string"]
        ],

        whitespace: [
            [/[ \t\r\n]+/, "white"],
            [/%.*$/, "comment"],
            [/#.*$/, "comment"]
        ],

        string: [[/[^"]+/, "string"], [/"/, "string", "@pop"]]
    }
};

export const LANGUAGE_THEME = {
    base: 'vs', // can also be vs-dark or hc-black
    inherit: true, // can also be false to completely replace the builtin rules
    rules: [
        { token: "comment", foreground: "87a1c4" },
        { token: "number", foreground: "256fd1"},
        { token: "identifier", foreground: "586677" },
        { token: "keyword", foreground: "c98526"},
        { token: "string", foreground: "7c71f2"}
    ],
    colors: {
        "editorCursor.foreground": "#586677",
        "editor.lineHighlightBackground": "#f9fcff",
    }
};

export const EDITOR_OPTION = {
    selectOnLineNumbers: false,
    // suggest: {
    //     filterGraceful: false,
    //     snippetsPreventQuickSuggestions: false
    // },
    // quickSuggestions: false,
    lineNumbers: "off",
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    minimap: {enabled: false},
    fontSize: 13,
    // dragAndDrop: true,
    folding: false,
    wordWrap: "on",
    renderLineHighlight: "none",
    scrollBar: {vertical: "visible"}
};