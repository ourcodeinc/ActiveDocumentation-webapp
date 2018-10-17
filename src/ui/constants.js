export class constants {

    /* only used in ruleGeneration page */
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

    static guiXPathState = {
            activeTab: "quantifier",
            quantifier: {
                key: "",
                value: "",
                target: "follows",
                // xpath: "src:class",
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
                }
            },
            constraint: {
                key: "",
                value: "",
                target: "follows",
                xpath: "src:class",
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
                }
            },
            // quantifierXpath: "src:unit/src:class",
            // constraintXpath: "src:unit/src:class",
            quantifierGrammar: "",
            constraintGrammar: ""
    };
}
