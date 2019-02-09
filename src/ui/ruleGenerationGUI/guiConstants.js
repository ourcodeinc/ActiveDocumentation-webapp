
export class GuiConstants {

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

const element_conditions = {
    annotation: {
        type: "text",
        pre: "@",
        post: "",
        placeholder: "annotation",
        unique: false,
        grammar: "annotation"
    },
    visibility: {
        type: "dropdown",
        pre: "",
        post: "",
        placeholder: "visibility",
        items: ["public", "private", "protected", "N/A"],
        grammar: "specifier"
    },
    memory: {
        type: "smallText",
        pre: "",
        post: "",
        placeholder: "static ?",
        unique: true,
        grammar: "specifier"
    },

    class_el: {
        type: "element",
        children: {
            top: "annotation",
            before_1: "memory",
            before_2: "visibility",
            before_3: "",
            after_1: "class_name",
            after_2: "class_implements",
            after_3: "class_extends",
            body: [
                "declaration_statement_el",
                "constructor_el",
                "function_el",
                "abstract_function_el"
            ]
        },
        grammar: "class",
        pre_before_1: "",
        pre_before_2: "",
        pre_before_3: "",
        pre_after_1: "class",
        pre_after_2: "",
        pre_after_3: "",
        post_after_3: "",
        pre_body: "{",
        post_body: "}",
        canBeSelected: true
    },
    class_name: {
        type: "text",
        pre: "",
        post: "",
        placeholder: "className",
        unique: true,
        grammar: "name"
    },
    class_implements: {
        type: "text",
        pre: "implements",
        post: "",
        placeholder: "interface",
        unique: true,
        grammar: "implementation"
    },
    class_extends: {
        type: "text",
        pre: "extends",
        post: "",
        placeholder: "base class",
        unique: true,
        grammar: "extension"
    },

    interface_el: {
        type: "element",
        children: {
            top: "annotation",
            before_1: "memory",
            before_2: "visibility",
            before_3: "",
            after_1: "interface_name",
            after_3: "interface_extends",
            body: []
        },
        grammar: "interface",
        pre_before_1: "",
        pre_before_2: "",
        pre_before_3: "",
        pre_after_1: "interface",
        pre_after_2: "",
        pre_after_3: "",
        post_after_3: "",
        pre_body: "{",
        post_body: "}",
        canBeSelected: true
    },
    interface_name: {
        type: "text",
        pre: "",
        post: "",
        placeholder: "interfaceName",
        unique: true,
        grammar: "name"
    },
    interface_extends: {
        type: "text",
        pre: "extends",
        post: "",
        placeholder: "base interface",
        unique: true,
        grammar: "extension"
    },

    function_el: {
        type: "element",
        children: {
            top: "annotation",
            before_1: "memory",
            before_2: "visibility",
            before_3: "function_return_type",
            after_1: "function_name",
            after_2: "parameter_el",
            after_3: "",
            body: [
                "declaration_statement_el",
                "function_expression_statement",
                "function_return_value"
            ]
        },
        grammar: "function",
        pre_before_1: "",
        pre_before_2: "",
        pre_before_3: "",
        pre_after_1: "",
        pre_after_2: "(",
        pre_after_3: ")",
        post_after_3: "",
        pre_body: "{",
        post_body: "}",
        canBeSelected: true
    },
    function_return_type: {
        type: "text",
        pre: "",
        post: "",
        placeholder: "return type",
        unique: true,
        grammar: "specifier"
    },
    function_name: {
        type: "text",
        pre: "",
        post: "",
        placeholder: "functionName",
        unique: true,
        grammar: "name"
    },
    function_expression_statement: {
        type: "wideText",
        pre: "",
        post: ";",
        placeholder: "expression statement inside function",
        unique: false,
        grammar: "expression statement"
    },
    function_return_value: {
        type: "wideText",
        pre: "return",
        post: ";",
        placeholder: "return statement of function",
        unique: false,
        grammar: "return value"
    },

    constructor_el: {
        type: "element",
        children: {
            top: "annotation",
            before_1: "",
            before_2: "visibility",
            before_3: "",
            after_1: "",
            after_2: "parameter_el",
            after_3: "",
            body: [
                "constructor_expression_statement",
                "declaration_statement_el"
            ]
        },
        grammar: "constructor",
        pre_before_1: "",
        pre_before_2: "",
        pre_before_3: "constructorName",
        pre_after_1: "",
        pre_after_2: "(",
        pre_after_3: ")",
        post_after_3: "",
        pre_body: "{",
        post_body: "}",
        canBeSelected: true
    },
    constructor_expression_statement: {
        type: "wideText",
        pre: "",
        post: ";",
        placeholder: "expression statement inside constructor",
        unique: false,
        grammar: "expression statement"
    },

    abstract_function_el: {
        type: "element",
        children: {
            top: "annotation",
            before_1: "memory",
            before_2: "visibility",
            before_3: "abstract_function_return_type",
            after_1: "abstract_function_name",
            after_2: "parameter_el",
            after_3: "",
            body: []
        },
        grammar: "abstract function",
        pre_before_1: "",
        pre_before_2: "",
        pre_before_3: "",
        pre_after_1: "",
        pre_after_2: "(",
        pre_after_3: ")",
        post_after_3: ";",
        pre_body: "",
        post_body: "",
        canBeSelected: true
    },
    abstract_function_return_type: {
        type: "text",
        pre: "",
        post: "",
        placeholder: "return type",
        unique: true,
        grammar: "specifier"
    },
    abstract_function_name: {
        type: "text",
        pre: "",
        post: "",
        placeholder: "abstractFunctionName",
        unique: true,
        grammar: "name"
    },

    declaration_statement_el: {
        type: "element",
        children: {
            top: "annotation",
            before_1: "memory",
            before_2: "visibility",
            before_3: "declaration_statement_name",
            after_1: "declaration_statement_initialization",
            after_2: "",
            after_3: "",
            body: []
        },
        grammar: "declaration statement",
        pre_before_1: "",
        pre_before_2: "",
        pre_before_3: "",
        pre_after_1: "=",
        pre_after_2: ";",
        pre_after_3: "",
        post_after_3: "",
        pre_body: "",
        post_body: "",
        canBeSelected: true
    },
    declaration_statement_type: {
        type: "text",
        pre: "",
        post: "",
        placeholder: "variable type",
        unique: true,
        grammar: "type"
    },
    declaration_statement_name: {
        type: "text",
        pre: "",
        post: "",
        placeholder: "variableName",
        unique: true,
        grammar: "name"
    },
    declaration_statement_initialization: {
        type: "text",
        pre: "",
        post: "",
        placeholder: "variableInitialization",
        unique: true,
        grammar: "initial value"
    },

    parameter_el: {
        type: "element",
        children: {
            top: "",
            before_1: "parameter_type",
            before_2: "",
            before_3: "",
            after_1: "parameter_name",
            after_2: "",
            after_3: "",
            body: []
        },
        grammar: "parameter",
        pre_before_1: "",
        pre_before_2: "",
        pre_before_3: "",
        pre_after_1: "",
        pre_after_2: "",
        pre_after_3: "",
        post_after_3: "",
        pre_body: "",
        post_body: "",
        canBeSelected: false
    },
    parameter_type: {
        type: "text",
        pre: "",
        post: "",
        placeholder: "parameter type",
        unique: true,
        grammar: "type"
    },
    parameter_name: {
        type: "text",
        pre: "",
        post: "",
        placeholder: "parameter name",
        unique: true,
        grammar: "name"
    },

};

export function getConditionByName(conditionName) {
    if (!element_conditions.hasOwnProperty(conditionName)) return {};
    return element_conditions[conditionName];

}

export function elementState(el_name) {
    if (!element_conditions.hasOwnProperty(el_name)) return {};

    switch (element_conditions[el_name].type) {
        case "element":
            let new_state = {
                conditionName: el_name,
                activeElement: false,
                selectedElement: false,
                children: {
                    top: [elementState(element_conditions[el_name].children.top)],
                    before_1: [elementState(element_conditions[el_name].children.before_1)],
                    before_2: [elementState(element_conditions[el_name].children.before_2)],
                    before_3: [elementState(element_conditions[el_name].children.before_3)],
                    after_1: [elementState(element_conditions[el_name].children.after_1)],
                    after_2: [elementState(element_conditions[el_name].children.after_2)],
                    after_3: [elementState(element_conditions[el_name].children.after_3)],
                    body: element_conditions[el_name].children.body.map(el => [elementState(el)])
                },
                texts: {}
            };
            new_state.texts = Object.assign({}, new_state.children);
            return new_state;

        case "text":
        case "wideText":
        case "smallText":
        case "dropdown":
            return {
                conditionName: el_name,
                activeElement: false,
                selectedElement: false,
                text: ""
            };

        default:
            return {};

    }

}

export function generateInitialElements(el_name, id) {

    switch (element_conditions[el_name].type) {
        case "element":
            console.log(`"${id}":{conditionName: "${el_name}",activeElement: false,selectedElement: false},`);
            ["top", "before_1", "before_2", "before_3", "after_1", "after_2", "after_3"].forEach((group, i) => {
                if (element_conditions[el_name].children[group] !== "")
                    generateInitialElements(element_conditions[el_name].children[group], `${id}.${i}.0`);
            });

            element_conditions[el_name].children["body"].forEach((subGroup, j) => {
                generateInitialElements(subGroup, `${id}.7.${j}`);
            });
            break;

        case "text":
        case "wideText":
        case "smallText":
        case "dropdown":
            console.log(`"${id}":{conditionName: "${el_name}",activeElement: false,selectedElement: false},`);
            break;

        default:
            return {};
    }
}

export function generateInitialElementTreeNodes(el_name, elem_id, parent_id) {
    if (!element_conditions.hasOwnProperty(el_name)) return {};

    switch (element_conditions[el_name].type) {
        case "element":
            let el = `"${elem_id}":{parentId:"${parent_id}",children:{top:[`;
            if (element_conditions[el_name].children.top !== "")
                el += `"${elem_id}.0.0"`;
            el += "],before_1:[";
            if (element_conditions[el_name].children.before_1 !== "")
                el += `"${elem_id}.1.0"`;
            el += "],before_2:[";
            if (element_conditions[el_name].children.before_2 !== "")
                el += `"${elem_id}.2.0"`;
            el += "],before_3:[";
            if (element_conditions[el_name].children.before_3 !== "")
                el += `"${elem_id}.3.0"`;
            el += "],after_1:[";
            if (element_conditions[el_name].children.after_1 !== "")
                el += `"${elem_id}.4.0"`;
            el += "],after_2:[";
            if (element_conditions[el_name].children.after_2 !== "")
                el += `"${elem_id}.5.0"`;
            el += "],after_3:[";
            if (element_conditions[el_name].children.after_3 !== "")
                el += `"${elem_id}.6.0"`;

            el += "],body:[";
            element_conditions[el_name].children.body.forEach((e, j) => el += `["${elem_id}.7.${j}"],`); // extra ,
            el += "]}},";
            console.log(el);
            return {
                nodeId: elem_id,
                children: {
                    top: [generateInitialElementTreeNodes(element_conditions[el_name].children.top, `${elem_id}.0.0`, elem_id)],
                    before_1: [generateInitialElementTreeNodes(element_conditions[el_name].children.before_1, `${elem_id}.1.0`, elem_id)],
                    before_2: [generateInitialElementTreeNodes(element_conditions[el_name].children.before_2, `${elem_id}.2.0`, elem_id)],
                    before_3: [generateInitialElementTreeNodes(element_conditions[el_name].children.before_3, `${elem_id}.3.0`, elem_id)],
                    after_1: [generateInitialElementTreeNodes(element_conditions[el_name].children.after_1, `${elem_id}.4.0`, elem_id)],
                    after_2: [generateInitialElementTreeNodes(element_conditions[el_name].children.after_2, `${elem_id}.5.0`, elem_id)],
                    after_3: [generateInitialElementTreeNodes(element_conditions[el_name].children.after_3, `${elem_id}.6.0`, elem_id)],
                    body: element_conditions[el_name].children.body.map((el, j) => [generateInitialElementTreeNodes(el, `${elem_id}.7.${j}`, elem_id)])
                }
            };

        case "text":
        case "wideText":
        case "smallText":
        case "dropdown":
            console.log(`"${elem_id}":{parentId:"${parent_id}",children:{}},`);
            return {nodeId: elem_id};

        default:
            return {};

    }
}

export function generateTreeForElement(el_name, id) {
    let result = {elements: [], trees: []};
    if (!element_conditions.hasOwnProperty(el_name)) return result;

    if (element_conditions[el_name].type === "element") {
        let node = {
            parentId: `${id}`,
            children: {
                top: [],
                before_1: [],
                before_2: [],
                before_3: [],
                after_1: [],
                after_2: [],
                after_3: [],
                body: []
            }
        };

        ["top", "before_1", "before_2", "before_3", "after_1", "after_2", "after_3"].forEach((group, i) => {
            if (element_conditions[el_name].children[group] !== "") {
                node.children[group].push(`${id}.${i}.0`);
                let newResult = generateTreeForElement(element_conditions[el_name].children[group], `${id}.${i}.0`);
                result.elements = result.elements.concat(newResult.elements);
                result.trees = result.trees.concat(newResult.trees);
            }
        });

        element_conditions[el_name].children.body.forEach((e, j) => {
            node.children.body.push([`${id}.7.${j}`]);
            let newResult = generateTreeForElement(element_conditions[el_name].children.body[j], `${id}.7.${j}`);
            result.elements = result.elements.concat(newResult.elements);
            result.trees = result.trees.concat(newResult.trees);
        });

        result.trees.push({id: `${id}`, node: node});
    }
    else {
        result.trees.push({id: `${id}`, node: {parentId: `${id}`, children: {}}});
    }

    result.elements.push(
        {
            id: `${id}`,
            node: {
                conditionName: el_name,
                activeElement: false,
                selectedElement: false
            }
        });
    return result;
}