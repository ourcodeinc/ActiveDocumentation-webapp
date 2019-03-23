
const element_conditions = {
    annotation: {
        type: "text",
        pre: "@",
        post: "",
        placeholder: "annotation",
        unique: true,
        grammar: "annotation",
        wordValidation: "combinatorial"
    },
    visibility: {
        type: "dropdown",
        pre: "",
        post: "",
        placeholder: "visibility",
        items: ["public", "private", "protected", "N/A"],
        grammar: "visibility"
    },
    specifier: {
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
            before_1: "visibility",
            before_2: "specifier",
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
        grammar: "name",
        wordValidation: "word"
    },
    class_implements: {
        type: "text",
        pre: "implements",
        post: "",
        placeholder: "Interface",
        unique: true,
        grammar: "implementation",
        required: "of ",
        wordValidation: "word"
    },
    class_extends: {
        type: "text",
        pre: "extends",
        post: "",
        placeholder: "Superclass",
        unique: true,
        grammar: "extension",
        required: "of ",
        wordValidation: "word"
    },

    interface_el: {
        type: "element",
        children: {
            top: "annotation",
            before_1: "visibility",
            before_2: "specifier",
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
        grammar: "name",
        wordValidation: "word"
    },
    interface_extends: {
        type: "text",
        pre: "extends",
        post: "",
        placeholder: "base interface",
        unique: true,
        grammar: "extension",
        wordValidation: "word"
    },

    function_el: {
        type: "element",
        children: {
            top: "annotation",
            before_1: "visibility",
            before_2: "specifier",
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
        grammar: "type",
        wordValidation: "both"
    },
    function_name: {
        type: "text",
        pre: "",
        post: "",
        placeholder: "functionName",
        unique: true,
        grammar: "name",
        wordValidation: "word"
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
            before_1: "visibility",
            before_2: "specifier",
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
        grammar: "type",
        wordValidation: "both"
    },
    abstract_function_name: {
        type: "text",
        pre: "",
        post: "",
        placeholder: "abstractFunctionName",
        unique: true,
        grammar: "name",
        wordValidation: "word"
    },

    declaration_statement_el: {
        type: "element",
        children: {
            top: "annotation",
            before_1: "visibility",
            before_2: "specifier",
            before_3: "declaration_statement_type",
            after_1: "declaration_statement_name",
            after_2: "declaration_statement_initialization",
            after_3: "",
            body: []
        },
        grammar: "declaration statement",
        pre_before_1: "",
        pre_before_2: "",
        pre_before_3: "",
        pre_after_1: "",
        pre_after_2: "=",
        pre_after_3: ";",
        post_after_3: "",
        pre_body: "",
        post_body: "",
        canBeSelected: true
    },
    declaration_statement_type: {
        type: "text",
        pre: "",
        post: "",
        placeholder: "variableType",
        unique: true,
        grammar: "type",
        wordValidation: "both"
    },
    declaration_statement_name: {
        type: "text",
        pre: "",
        post: "",
        placeholder: "variableName",
        unique: true,
        grammar: "name",
        wordValidation: "word"
    },
    declaration_statement_initialization: {
        type: "text",
        pre: "",
        post: "",
        placeholder: "variableInitialization",
        unique: true,
        grammar: "initial value",
        wordValidation: "combinatorial"
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
        grammar: "type",
        wordValidation: "both"
    },
    parameter_name: {
        type: "text",
        pre: "",
        post: "",
        placeholder: "parameter name",
        unique: true,
        grammar: "name",
        wordValidation: "word"
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
    // ...element_attributes is the set of common attributes for each element
    switch (element_conditions[el_name].type) {
        case "element":
            console.log(`"${id}":{conditionName: "${el_name}", ...element_attributes},`);
            ["top", "before_1", "before_2", "before_3", "after_1", "after_2", "after_3"].forEach((group, i) => {
                if (element_conditions[el_name].children[group] !== "")
                    generateInitialElements(element_conditions[el_name].children[group], `${id}-${i}-0`);
            });

            element_conditions[el_name].children["body"].forEach((subGroup, j) => {
                generateInitialElements(subGroup, `${id}-7-${j}`);
            });
            break;

        // leaves, no children
        case "text":
        case "wideText":
        case "smallText":
        case "dropdown":
            console.log(`"${id}":{conditionName: "${el_name}", ...element_attributes},`);
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
                el += `"${elem_id}-0-0"`;
            el += "],before_1:[";
            if (element_conditions[el_name].children.before_1 !== "")
                el += `"${elem_id}-1-0"`;
            el += "],before_2:[";
            if (element_conditions[el_name].children.before_2 !== "")
                el += `"${elem_id}-2-0"`;
            el += "],before_3:[";
            if (element_conditions[el_name].children.before_3 !== "")
                el += `"${elem_id}-3-0"`;
            el += "],after_1:[";
            if (element_conditions[el_name].children.after_1 !== "")
                el += `"${elem_id}-4-0"`;
            el += "],after_2:[";
            if (element_conditions[el_name].children.after_2 !== "")
                el += `"${elem_id}-5-0"`;
            el += "],after_3:[";
            if (element_conditions[el_name].children.after_3 !== "")
                el += `"${elem_id}-6-0"`;

            el += "],body:[";
            element_conditions[el_name].children.body.forEach((e, j) => el += `["${elem_id}-7-${j}"],`); // extra ,
            el += "]}},";
            console.log(el);
            return {
                nodeId: elem_id,
                children: {
                    top: [generateInitialElementTreeNodes(element_conditions[el_name].children.top, `${elem_id}-0-0`, elem_id)],
                    before_1: [generateInitialElementTreeNodes(element_conditions[el_name].children.before_1, `${elem_id}-1-0`, elem_id)],
                    before_2: [generateInitialElementTreeNodes(element_conditions[el_name].children.before_2, `${elem_id}-2-0`, elem_id)],
                    before_3: [generateInitialElementTreeNodes(element_conditions[el_name].children.before_3, `${elem_id}-3-0`, elem_id)],
                    after_1: [generateInitialElementTreeNodes(element_conditions[el_name].children.after_1, `${elem_id}-4-0`, elem_id)],
                    after_2: [generateInitialElementTreeNodes(element_conditions[el_name].children.after_2, `${elem_id}-5-0`, elem_id)],
                    after_3: [generateInitialElementTreeNodes(element_conditions[el_name].children.after_3, `${elem_id}-6-0`, elem_id)],
                    body: element_conditions[el_name].children.body.map((el, j) => [generateInitialElementTreeNodes(el, `${elem_id}-7-${j}`, elem_id)])
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

export function generateTreeForElement(el_name, elemId, parentId) {
    let result = {elements: [], trees: []};
    if (!element_conditions.hasOwnProperty(el_name)) return result;

    if (element_conditions[el_name].type === "element") {
        let node = {
            parentId: `${parentId}`,
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
                node.children[group].push(`${elemId}-${i}-0`);
                let newResult = generateTreeForElement(element_conditions[el_name].children[group], `${elemId}-${i}-0`, elemId);
                result.elements = result.elements.concat(newResult.elements);
                result.trees = result.trees.concat(newResult.trees);
            }
        });

        element_conditions[el_name].children.body.forEach((e, j) => {
            node.children.body.push([`${elemId}-7-${j}`]);
            let newResult = generateTreeForElement(element_conditions[el_name].children.body[j], `${elemId}-7-${j}`, elemId);
            result.elements = result.elements.concat(newResult.elements);
            result.trees = result.trees.concat(newResult.trees);
        });

        result.trees.push({id: `${elemId}`, node: node});
    }
    else {
        result.trees.push({id: `${elemId}`, node: {parentId: `${parentId}`, children: {}}});
    }

    result.elements.push(
        {
            id: `${elemId}`,
            node: {
                conditionName: el_name,
                activeElement: false,
                selectedElement: false
            }
        });
    return result;
}