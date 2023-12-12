/**
 * featureInfo is a Map > featureDescription: {featureId, featureIndex (from features in featureConfig), nodes, weight}
 * featureInfoReverse is a Map > featureId: featureDescription
 * featureMap is a Map > featureId: array of identifiers
 * featureMapReverse is a Map > identifier: array of featureIds
 *
 * featureInfoContainers: {featureInfo, featureInfoReverse, featureMap, featureMapReverse}
 * featureCategories: {classType, constructorType, functionType}
 */

import {allAlgorithms} from "./miningRulesCore/featureConfig";

/**
  * @typedef {{element: string, featureIds: number[]}} elementFeatures
  *
  * @typedef {Object.<string, Object.<string, string[]>>} groupMappingType
  * @typedef {Object.<string, Object.<string, string[]>>} fileMappingType
  * @typedef {{groupMapping: groupMappingType, fileMapping: fileMappingType
  * }} groupingMetaDataType
  *
  * @typedef {{featureInfoContainers: {
  * featureInfo: Object.<string, {featureIndex: string, featureId: number
  *             , nodes: undefined|string[], weight: number}>,
  * featureInfoReverse: Object.<number, string>,
  * featureMap: Object.<number, string[]>,
  * featureMapReverse: Object.<string, number[]>},
  * featureGroups: {
  * spec: Object.<string, {elementFeatures: elementFeatures[], rule: {}}>,
  * usage: Object.<string, {elementFeatures: elementFeatures[], rule: {}}>}
  * }} featureMetaDataType
  *
  * @typedef {{identifier: string, mapFocusedElementToFeaturesKey: string
  *         , filePath: string}} focusedElementDataType
  *
  * @typedef {{recentVisitedFiles: {timestamp: Date, filePath: string}[],
  * recentVisitedElements: {timestamp: Date, filePath: string, startOffset:number,
  * endOffset: number, visitedElement: string}[],
  * recentSearches: {timestamp: Date, filePath: string, keyword: string}[]}} doiInformationType
  *
  * @typedef {{support:number, utility:number, featureIds: number[]}} initialFrequentItemSetType
  * @typedef  {{fileGroup: string, frequentItemSets: initialFrequentItemSetType[]}[]} initialParsedOutputType
  *
  * @typedef {{fileGroup: string, clusters:
  *               {key: string, withChildren: Array, selectedElement: boolean, isConstraint: boolean, _data_: {}}
  *           []}[]} builtObjectRulePadOutputType
  */


// the attributes of each element in the Graphical Editor of RulePad
const graphicalElementAttributes = {
    activeElement: false, // if the element has at least one child
    selectedElement: false, // if the element is the root of the XPath (unique)
    isConstraint: false // if the element is for the constraint query
};

export const initial_graphicalElements = {
    "0": {conditionName: "class_el", ...graphicalElementAttributes},
    "0-0-0": {conditionName: "annotation", ...graphicalElementAttributes},
    "0-1-0": {conditionName: "visibility", ...graphicalElementAttributes},
    "0-2-0": {conditionName: "specifier", ...graphicalElementAttributes},
    "0-4-0": {conditionName: "class_name", ...graphicalElementAttributes},
    "0-5-0": {conditionName: "class_implements", ...graphicalElementAttributes},
    "0-6-0": {conditionName: "class_extends", ...graphicalElementAttributes},
    "0-7-0": {conditionName: "declaration_statement_el", ...graphicalElementAttributes},
    "0-7-0-0-0": {conditionName: "annotation", ...graphicalElementAttributes},
    "0-7-0-1-0": {conditionName: "visibility", ...graphicalElementAttributes},
    "0-7-0-2-0": {conditionName: "specifier", ...graphicalElementAttributes},
    "0-7-0-3-0": {conditionName: "declaration_statement_type", ...graphicalElementAttributes},
    "0-7-0-4-0": {conditionName: "declaration_statement_name", ...graphicalElementAttributes},
    "0-7-0-5-0": {conditionName: "declaration_statement_initialization", ...graphicalElementAttributes},
    "0-7-0-7-0": {conditionName: "comment", ...graphicalElementAttributes},
    "0-7-1": {conditionName: "constructor_el", ...graphicalElementAttributes},
    "0-7-1-0-0": {conditionName: "annotation", ...graphicalElementAttributes},
    "0-7-1-2-0": {conditionName: "visibility", ...graphicalElementAttributes},
    "0-7-1-4-0": {conditionName: "constructor_name", ...graphicalElementAttributes},
    "0-7-1-5-0": {conditionName: "parameter_el", ...graphicalElementAttributes},
    "0-7-1-5-0-1-0": {conditionName: "parameter_type", ...graphicalElementAttributes},
    "0-7-1-5-0-4-0": {conditionName: "parameter_name", ...graphicalElementAttributes},
    "0-7-1-7-0": {conditionName: "constructor_expression_statement", ...graphicalElementAttributes},
    "0-7-1-7-0-0-0": {conditionName: "expression_el", ...graphicalElementAttributes},
    "0-7-1-7-0-7-0": {conditionName: "comment", ...graphicalElementAttributes},
    "0-7-1-7-1": {conditionName: "declaration_statement_el", ...graphicalElementAttributes},
    "0-7-1-7-1-0-0": {conditionName: "annotation", ...graphicalElementAttributes},
    "0-7-1-7-1-1-0": {conditionName: "visibility", ...graphicalElementAttributes},
    "0-7-1-7-1-2-0": {conditionName: "specifier", ...graphicalElementAttributes},
    "0-7-1-7-1-3-0": {conditionName: "declaration_statement_type", ...graphicalElementAttributes},
    "0-7-1-7-1-4-0": {conditionName: "declaration_statement_name", ...graphicalElementAttributes},
    "0-7-1-7-1-5-0": {conditionName: "declaration_statement_initialization", ...graphicalElementAttributes},
    "0-7-1-7-1-7-0": {conditionName: "comment", ...graphicalElementAttributes},
    "0-7-1-7-2": {conditionName: "comment", ...graphicalElementAttributes},
    "0-7-2": {conditionName: "function_el", ...graphicalElementAttributes},
    "0-7-2-0-0": {conditionName: "annotation", ...graphicalElementAttributes},
    "0-7-2-1-0": {conditionName: "visibility", ...graphicalElementAttributes},
    "0-7-2-2-0": {conditionName: "specifier", ...graphicalElementAttributes},
    "0-7-2-3-0": {conditionName: "function_return_type", ...graphicalElementAttributes},
    "0-7-2-4-0": {conditionName: "function_name", ...graphicalElementAttributes},
    "0-7-2-5-0": {conditionName: "parameter_el", ...graphicalElementAttributes},
    "0-7-2-5-0-1-0": {conditionName: "parameter_type", ...graphicalElementAttributes},
    "0-7-2-5-0-4-0": {conditionName: "parameter_name", ...graphicalElementAttributes},
    "0-7-2-7-0": {conditionName: "declaration_statement_el", ...graphicalElementAttributes},
    "0-7-2-7-0-0-0": {conditionName: "annotation", ...graphicalElementAttributes},
    "0-7-2-7-0-1-0": {conditionName: "visibility", ...graphicalElementAttributes},
    "0-7-2-7-0-2-0": {conditionName: "specifier", ...graphicalElementAttributes},
    "0-7-2-7-0-3-0": {conditionName: "declaration_statement_type", ...graphicalElementAttributes},
    "0-7-2-7-0-4-0": {conditionName: "declaration_statement_name", ...graphicalElementAttributes},
    "0-7-2-7-0-5-0": {conditionName: "declaration_statement_initialization", ...graphicalElementAttributes},
    "0-7-2-7-0-7-0": {conditionName: "comment", ...graphicalElementAttributes},
    "0-7-2-7-1": {conditionName: "function_expression_statement", ...graphicalElementAttributes},
    "0-7-2-7-1-0-0": {conditionName: "expression_el", ...graphicalElementAttributes},
    "0-7-2-7-1-7-0": {conditionName: "comment", ...graphicalElementAttributes},
    "0-7-2-7-2": {conditionName: "function_return_value", ...graphicalElementAttributes},
    "0-7-2-7-3": {conditionName: "comment", ...graphicalElementAttributes},
    "0-7-3": {conditionName: "abstract_function_el", ...graphicalElementAttributes},
    "0-7-3-0-0": {conditionName: "annotation", ...graphicalElementAttributes},
    "0-7-3-1-0": {conditionName: "visibility", ...graphicalElementAttributes},
    "0-7-3-2-0": {conditionName: "specifier", ...graphicalElementAttributes},
    "0-7-3-3-0": {conditionName: "abstract_function_return_type", ...graphicalElementAttributes},
    "0-7-3-4-0": {conditionName: "abstract_function_name", ...graphicalElementAttributes},
    "0-7-3-5-0": {conditionName: "parameter_el", ...graphicalElementAttributes},
    "0-7-3-5-0-1-0": {conditionName: "parameter_type", ...graphicalElementAttributes},
    "0-7-3-5-0-4-0": {conditionName: "parameter_name", ...graphicalElementAttributes},
    "0-7-4": {conditionName: "comment", ...graphicalElementAttributes},
    "0-7-5": {conditionName: "subclass_el", ...graphicalElementAttributes},
    "0-7-5-0-0": {conditionName: "annotation", ...graphicalElementAttributes},
    "0-7-5-1-0": {conditionName: "visibility", ...graphicalElementAttributes},
    "0-7-5-2-0": {conditionName: "specifier", ...graphicalElementAttributes},
    "0-7-5-4-0": {conditionName: "class_name", ...graphicalElementAttributes},
    "0-7-5-5-0": {conditionName: "class_implements", ...graphicalElementAttributes},
    "0-7-5-6-0": {conditionName: "class_extends", ...graphicalElementAttributes},
    "0-7-5-7-0": {conditionName: "declaration_statement_el", ...graphicalElementAttributes},
    "0-7-5-7-0-0-0": {conditionName: "annotation", ...graphicalElementAttributes},
    "0-7-5-7-0-1-0": {conditionName: "visibility", ...graphicalElementAttributes},
    "0-7-5-7-0-2-0": {conditionName: "specifier", ...graphicalElementAttributes},
    "0-7-5-7-0-3-0": {conditionName: "declaration_statement_type", ...graphicalElementAttributes},
    "0-7-5-7-0-4-0": {conditionName: "declaration_statement_name", ...graphicalElementAttributes},
    "0-7-5-7-0-5-0": {conditionName: "declaration_statement_initialization", ...graphicalElementAttributes},
    "0-7-5-7-0-7-0": {conditionName: "comment", ...graphicalElementAttributes},
    "0-7-5-7-1": {conditionName: "constructor_el", ...graphicalElementAttributes},
    "0-7-5-7-1-0-0": {conditionName: "annotation", ...graphicalElementAttributes},
    "0-7-5-7-1-2-0": {conditionName: "visibility", ...graphicalElementAttributes},
    "0-7-5-7-1-5-0": {conditionName: "parameter_el", ...graphicalElementAttributes},
    "0-7-5-7-1-5-0-1-0": {conditionName: "parameter_type", ...graphicalElementAttributes},
    "0-7-5-7-1-5-0-4-0": {conditionName: "parameter_name", ...graphicalElementAttributes},
    "0-7-5-7-1-7-0": {conditionName: "constructor_expression_statement", ...graphicalElementAttributes},
    "0-7-5-7-1-7-0-0-0": {conditionName: "expression_el", ...graphicalElementAttributes},
    "0-7-5-7-1-7-0-7-0": {conditionName: "comment", ...graphicalElementAttributes},
    "0-7-5-7-1-7-1": {conditionName: "declaration_statement_el", ...graphicalElementAttributes},
    "0-7-5-7-1-7-1-0-0": {conditionName: "annotation", ...graphicalElementAttributes},
    "0-7-5-7-1-7-1-1-0": {conditionName: "visibility", ...graphicalElementAttributes},
    "0-7-5-7-1-7-1-2-0": {conditionName: "specifier", ...graphicalElementAttributes},
    "0-7-5-7-1-7-1-3-0": {conditionName: "declaration_statement_type", ...graphicalElementAttributes},
    "0-7-5-7-1-7-1-4-0": {conditionName: "declaration_statement_name", ...graphicalElementAttributes},
    "0-7-5-7-1-7-1-5-0": {conditionName: "declaration_statement_initialization", ...graphicalElementAttributes},
    "0-7-5-7-1-7-1-7-0": {conditionName: "comment", ...graphicalElementAttributes},
    "0-7-5-7-1-7-2": {conditionName: "comment", ...graphicalElementAttributes},
    "0-7-5-7-2": {conditionName: "function_el", ...graphicalElementAttributes},
    "0-7-5-7-2-0-0": {conditionName: "annotation", ...graphicalElementAttributes},
    "0-7-5-7-2-1-0": {conditionName: "visibility", ...graphicalElementAttributes},
    "0-7-5-7-2-2-0": {conditionName: "specifier", ...graphicalElementAttributes},
    "0-7-5-7-2-3-0": {conditionName: "function_return_type", ...graphicalElementAttributes},
    "0-7-5-7-2-4-0": {conditionName: "function_name", ...graphicalElementAttributes},
    "0-7-5-7-2-5-0": {conditionName: "parameter_el", ...graphicalElementAttributes},
    "0-7-5-7-2-5-0-1-0": {conditionName: "parameter_type", ...graphicalElementAttributes},
    "0-7-5-7-2-5-0-4-0": {conditionName: "parameter_name", ...graphicalElementAttributes},
    "0-7-5-7-2-7-0": {conditionName: "declaration_statement_el", ...graphicalElementAttributes},
    "0-7-5-7-2-7-0-0-0": {conditionName: "annotation", ...graphicalElementAttributes},
    "0-7-5-7-2-7-0-1-0": {conditionName: "visibility", ...graphicalElementAttributes},
    "0-7-5-7-2-7-0-2-0": {conditionName: "specifier", ...graphicalElementAttributes},
    "0-7-5-7-2-7-0-3-0": {conditionName: "declaration_statement_type", ...graphicalElementAttributes},
    "0-7-5-7-2-7-0-4-0": {conditionName: "declaration_statement_name", ...graphicalElementAttributes},
    "0-7-5-7-2-7-0-5-0": {conditionName: "declaration_statement_initialization", ...graphicalElementAttributes},
    "0-7-5-7-2-7-0-7-0": {conditionName: "comment", ...graphicalElementAttributes},
    "0-7-5-7-2-7-1": {conditionName: "function_expression_statement", ...graphicalElementAttributes},
    "0-7-5-7-2-7-1-0-0": {conditionName: "expression_el", ...graphicalElementAttributes},
    "0-7-5-7-2-7-1-7-0": {conditionName: "comment", ...graphicalElementAttributes},
    "0-7-5-7-2-7-2": {conditionName: "function_return_value", ...graphicalElementAttributes},
    "0-7-5-7-2-7-3": {conditionName: "comment", ...graphicalElementAttributes},
    "0-7-5-7-3": {conditionName: "abstract_function_el", ...graphicalElementAttributes},
    "0-7-5-7-3-0-0": {conditionName: "annotation", ...graphicalElementAttributes},
    "0-7-5-7-3-1-0": {conditionName: "visibility", ...graphicalElementAttributes},
    "0-7-5-7-3-2-0": {conditionName: "specifier", ...graphicalElementAttributes},
    "0-7-5-7-3-3-0": {conditionName: "abstract_function_return_type", ...graphicalElementAttributes},
    "0-7-5-7-3-4-0": {conditionName: "abstract_function_name", ...graphicalElementAttributes},
    "0-7-5-7-3-5-0": {conditionName: "parameter_el", ...graphicalElementAttributes},
    "0-7-5-7-3-5-0-1-0": {conditionName: "parameter_type", ...graphicalElementAttributes},
    "0-7-5-7-3-5-0-4-0": {conditionName: "parameter_name", ...graphicalElementAttributes},
    "0-7-5-7-4": {conditionName: "comment", ...graphicalElementAttributes},
};

export const initial_graphicalElementTree = {
    selectedElementID: "",
    "0": {
        parentId: "",
        children: {
            top: ["0-0-0"],
            before_1: ["0-1-0"],
            before_2: ["0-2-0"],
            before_3: [],
            after_1: ["0-4-0"],
            after_2: ["0-5-0"],
            after_3: ["0-6-0"],
            body: [["0-7-0"], ["0-7-1"], ["0-7-2"], ["0-7-3"], ["0-7-4"], ["0-7-5"]]
        }
    },
    "0-0-0": {parentId: "0", children: {}},
    "0-1-0": {parentId: "0", children: {}},
    "0-2-0": {parentId: "0", children: {}},
    "0-4-0": {parentId: "0", children: {}},
    "0-5-0": {parentId: "0", children: {}},
    "0-6-0": {parentId: "0", children: {}},
    "0-7-0": {
        parentId: "0",
        children: {
            top: ["0-7-0-0-0"],
            before_1: ["0-7-0-1-0"],
            before_2: ["0-7-0-2-0"],
            before_3: ["0-7-0-3-0"],
            after_1: ["0-7-0-4-0"],
            after_2: ["0-7-0-5-0"],
            after_3: [],
            body: [["0-7-0-7-0"]]
        }
    },
    "0-7-0-0-0": {parentId: "0-7-0", children: {}},
    "0-7-0-1-0": {parentId: "0-7-0", children: {}},
    "0-7-0-2-0": {parentId: "0-7-0", children: {}},
    "0-7-0-3-0": {parentId: "0-7-0", children: {}},
    "0-7-0-4-0": {parentId: "0-7-0", children: {}},
    "0-7-0-5-0": {parentId: "0-7-0", children: {}},
    "0-7-0-7-0": {parentId: "0-7-0", children: {}},
    "0-7-1": {
        parentId: "0",
        children: {
            top: ["0-7-1-0-0"],
            before_1: [],
            before_2: ["0-7-1-2-0"],
            before_3: [],
            after_1: ["0-7-1-4-0"],
            after_2: ["0-7-1-5-0"],
            after_3: [],
            body: [["0-7-1-7-0"], ["0-7-1-7-1"],["0-7-1-7-2"]]
        }
    },
    "0-7-1-0-0": {parentId: "0-7-1", children: {}},
    "0-7-1-2-0": {parentId: "0-7-1", children: {}},
    "0-7-1-4-0": {parentId: "0-7-1", children: {}},
    "0-7-1-5-0": {
        parentId: "0-7-1",
        children: {
            top: [],
            before_1: ["0-7-1-5-0-1-0"],
            before_2: [],
            before_3: [],
            after_1: ["0-7-1-5-0-4-0"],
            after_2: [],
            after_3: [],
            body: []
        }
    },
    "0-7-1-5-0-1-0": {parentId: "0-7-1-5-0", children: {}},
    "0-7-1-5-0-4-0": {parentId: "0-7-1-5-0", children: {}},
    "0-7-1-7-0": {
        parentId: "0-7-1",
        children: {
            top: ["0-7-1-7-0-0-0"],
            before_1: [],
            before_2: [],
            before_3: [],
            after_1: [],
            after_2: [],
            after_3: [],
            body: [["0-7-1-7-0-7-0"]]
        }
    },
    "0-7-1-7-0-0-0": {parentId: "0-7-1-7-0", children: {}},
    "0-7-1-7-0-7-0": {parentId: "0-7-1-7-0", children: {}},
    "0-7-1-7-1": {
        parentId: "0-7-1",
        children: {
            top: ["0-7-1-7-1-0-0"],
            before_1: ["0-7-1-7-1-1-0"],
            before_2: ["0-7-1-7-1-2-0"],
            before_3: ["0-7-1-7-1-3-0"],
            after_1: ["0-7-1-7-1-4-0"],
            after_2: ["0-7-1-7-1-5-0"],
            after_3: [],
            body: [["0-7-1-7-1-7-0"]]
        }
    },
    "0-7-1-7-1-0-0": {parentId: "0-7-1-7-1", children: {}},
    "0-7-1-7-1-1-0": {parentId: "0-7-1-7-1", children: {}},
    "0-7-1-7-1-2-0": {parentId: "0-7-1-7-1", children: {}},
    "0-7-1-7-1-3-0": {parentId: "0-7-1-7-1", children: {}},
    "0-7-1-7-1-4-0": {parentId: "0-7-1-7-1", children: {}},
    "0-7-1-7-1-5-0": {parentId: "0-7-1-7-1", children: {}},
    "0-7-1-7-1-7-0": {parentId: "0-7-1-7-1", children: {}},
    "0-7-1-7-2": {parentId:"0-7-1", children: {}},
    "0-7-2": {
        parentId: "0",
        children: {
            top: ["0-7-2-0-0"],
            before_1: ["0-7-2-1-0"],
            before_2: ["0-7-2-2-0"],
            before_3: ["0-7-2-3-0"],
            after_1: ["0-7-2-4-0"],
            after_2: ["0-7-2-5-0"],
            after_3: [],
            body: [["0-7-2-7-0"], ["0-7-2-7-1"], ["0-7-2-7-2"],["0-7-2-7-3"]]
        }
    },
    "0-7-2-0-0": {parentId: "0-7-2", children: {}},
    "0-7-2-1-0": {parentId: "0-7-2", children: {}},
    "0-7-2-2-0": {parentId: "0-7-2", children: {}},
    "0-7-2-3-0": {parentId: "0-7-2", children: {}},
    "0-7-2-4-0": {parentId: "0-7-2", children: {}},
    "0-7-2-5-0": {
        parentId: "0-7-2",
        children: {
            top: [],
            before_1: ["0-7-2-5-0-1-0"],
            before_2: [],
            before_3: [],
            after_1: ["0-7-2-5-0-4-0"],
            after_2: [],
            after_3: [],
            body: []
        }
    },
    "0-7-2-5-0-1-0": {parentId: "0-7-2-5-0", children: {}},
    "0-7-2-5-0-4-0": {parentId: "0-7-2-5-0", children: {}},
    "0-7-2-7-0": {
        parentId: "0-7-2",
        children: {
            top: ["0-7-2-7-0-0-0"],
            before_1: ["0-7-2-7-0-1-0"],
            before_2: ["0-7-2-7-0-2-0"],
            before_3: ["0-7-2-7-0-3-0"],
            after_1: ["0-7-2-7-0-4-0"],
            after_2: ["0-7-2-7-0-5-0"],
            after_3: [],
            body: [["0-7-2-7-0-7-0"]]
        }
    },
    "0-7-2-7-0-0-0": {parentId: "0-7-2-7-0", children: {}},
    "0-7-2-7-0-1-0": {parentId: "0-7-2-7-0", children: {}},
    "0-7-2-7-0-2-0": {parentId: "0-7-2-7-0", children: {}},
    "0-7-2-7-0-3-0": {parentId: "0-7-2-7-0", children: {}},
    "0-7-2-7-0-4-0": {parentId: "0-7-2-7-0", children: {}},
    "0-7-2-7-0-5-0": {parentId: "0-7-2-7-0", children: {}},
    "0-7-2-7-0-7-0": {parentId: "0-7-2-7-0", children: {}},
    "0-7-2-7-1": {
        parentId: "0-7-2",
        children: {
            top: ["0-7-2-7-1-0-0"],
            before_1: [],
            before_2: [],
            before_3: [],
            after_1: [],
            after_2: [],
            after_3: [],
            body: [["0-7-2-7-1-7-0"]]
        }
    },
    "0-7-2-7-1-0-0": {parentId: "0-7-2-7-1", children: {}},
    "0-7-2-7-1-7-0": {parentId: "0-7-2-7-1", children: {}},
    "0-7-2-7-2": {parentId: "0-7-2", children: {}},
    "0-7-2-7-3": {parentId: "0-7-2", children: {}},
    "0-7-3": {
        parentId: "0",
        children: {
            top: ["0-7-3-0-0"],
            before_1: ["0-7-3-1-0"],
            before_2: ["0-7-3-2-0"],
            before_3: ["0-7-3-3-0"],
            after_1: ["0-7-3-4-0"],
            after_2: ["0-7-3-5-0"],
            after_3: [],
            body: []
        }
    },
    "0-7-3-0-0": {parentId: "0-7-3", children: {}},
    "0-7-3-1-0": {parentId: "0-7-3", children: {}},
    "0-7-3-2-0": {parentId: "0-7-3", children: {}},
    "0-7-3-3-0": {parentId: "0-7-3", children: {}},
    "0-7-3-4-0": {parentId: "0-7-3", children: {}},
    "0-7-3-5-0": {
        parentId: "0-7-3",
        children: {
            top: [],
            before_1: ["0-7-3-5-0-1-0"],
            before_2: [],
            before_3: [],
            after_1: ["0-7-3-5-0-4-0"],
            after_2: [],
            after_3: [],
            body: []
        }
    },
    "0-7-3-5-0-1-0": {parentId: "0-7-3-5-0", children: {}},
    "0-7-3-5-0-4-0": {parentId: "0-7-3-5-0", children: {}},
    "0-7-4": {parentId: "0", children: {}},
    "0-7-5": {parentId: "0", children: {
            top: ["0-7-5-0-0"],
            before_1: ["0-7-5-1-0"],
            before_2: ["0-7-5-2-0"],
            before_3: [],
            after_1: ["0-7-5-4-0"],
            after_2: ["0-7-5-5-0"],
            after_3: ["0-7-5-6-0"],
            body: [["0-7-5-7-0"], ["0-7-5-7-1"], ["0-7-5-7-2"], ["0-7-5-7-3"], ["0-7-5-7-4"]]
        }},


    "0-7-5-0-0": {parentId: "0-7-5", children: {}},
    "0-7-5-1-0": {parentId: "0-7-5", children: {}},
    "0-7-5-2-0": {parentId: "0-7-5", children: {}},
    "0-7-5-4-0": {parentId: "0-7-5", children: {}},
    "0-7-5-5-0": {parentId: "0-7-5", children: {}},
    "0-7-5-6-0": {parentId: "0-7-5", children: {}},
    "0-7-5-7-0": {
        parentId: "0-7-5",
        children: {
            top: ["0-7-5-7-0-0-0"],
            before_1: ["0-7-5-7-0-1-0"],
            before_2: ["0-7-5-7-0-2-0"],
            before_3: ["0-7-5-7-0-3-0"],
            after_1: ["0-7-5-7-0-4-0"],
            after_2: ["0-7-5-7-0-5-0"],
            after_3: [],
            body: [["0-7-5-7-0-7-0"]]
        }
    },
    "0-7-5-7-0-0-0": {parentId: "0-7-5-7-0", children: {}},
    "0-7-5-7-0-1-0": {parentId: "0-7-5-7-0", children: {}},
    "0-7-5-7-0-2-0": {parentId: "0-7-5-7-0", children: {}},
    "0-7-5-7-0-3-0": {parentId: "0-7-5-7-0", children: {}},
    "0-7-5-7-0-4-0": {parentId: "0-7-5-7-0", children: {}},
    "0-7-5-7-0-5-0": {parentId: "0-7-5-7-0", children: {}},
    "0-7-5-7-0-7-0": {parentId: "0-7-5-7-0", children: {}},
    "0-7-5-7-1": {
        parentId: "0-7-5",
        children: {
            top: ["0-7-5-7-1-0-0"],
            before_1: [],
            before_2: ["0-7-5-7-1-2-0"],
            before_3: [],
            after_1: [],
            after_2: ["0-7-5-7-1-5-0"],
            after_3: [],
            body: [["0-7-5-7-1-7-0"], ["0-7-5-7-1-7-1"],["0-7-5-7-1-7-2"]]
        }
    },
    "0-7-5-7-1-0-0": {parentId: "0-7-5-7-1", children: {}},
    "0-7-5-7-1-2-0": {parentId: "0-7-5-7-1", children: {}},
    "0-7-5-7-1-5-0": {
        parentId: "0-7-5-7-1",
        children: {
            top: [],
            before_1: ["0-7-5-7-1-5-0-1-0"],
            before_2: [],
            before_3: [],
            after_1: ["0-7-5-7-1-5-0-4-0"],
            after_2: [],
            after_3: [],
            body: []
        }
    },
    "0-7-5-7-1-5-0-1-0": {parentId: "0-7-5-7-1-5-0", children: {}},
    "0-7-5-7-1-5-0-4-0": {parentId: "0-7-5-7-1-5-0", children: {}},
    "0-7-5-7-1-7-0": {
        parentId: "0-7-5-7-1",
        children: {
            top: ["0-7-5-7-1-7-0-0-0"],
            before_1: [],
            before_2: [],
            before_3: [],
            after_1: [],
            after_2: [],
            after_3: [],
            body: [["0-7-5-7-1-7-0-7-0"]]
        }
    },
    "0-7-5-7-1-7-0-0-0": {parentId: "0-7-5-7-1-7-0", children: {}},
    "0-7-5-7-1-7-0-7-0": {parentId: "0-7-5-7-1-7-0", children: {}},
    "0-7-5-7-1-7-1": {
        parentId: "0-7-5-7-1",
        children: {
            top: ["0-7-5-7-1-7-1-0-0"],
            before_1: ["0-7-5-7-1-7-1-1-0"],
            before_2: ["0-7-5-7-1-7-1-2-0"],
            before_3: ["0-7-5-7-1-7-1-3-0"],
            after_1: ["0-7-5-7-1-7-1-4-0"],
            after_2: ["0-7-5-7-1-7-1-5-0"],
            after_3: [],
            body: [["0-7-5-7-1-7-1-7-0"]]
        }
    },
    "0-7-5-7-1-7-1-0-0": {parentId: "0-7-5-7-1-7-1", children: {}},
    "0-7-5-7-1-7-1-1-0": {parentId: "0-7-5-7-1-7-1", children: {}},
    "0-7-5-7-1-7-1-2-0": {parentId: "0-7-5-7-1-7-1", children: {}},
    "0-7-5-7-1-7-1-3-0": {parentId: "0-7-5-7-1-7-1", children: {}},
    "0-7-5-7-1-7-1-4-0": {parentId: "0-7-5-7-1-7-1", children: {}},
    "0-7-5-7-1-7-1-5-0": {parentId: "0-7-5-7-1-7-1", children: {}},
    "0-7-5-7-1-7-1-7-0": {parentId: "0-7-5-7-1-7-1", children: {}},
    "0-7-5-7-1-7-2": {parentId:"0-7-5-7-1", children: {}},
    "0-7-5-7-2": {
        parentId: "0-7-5",
        children: {
            top: ["0-7-5-7-2-0-0"],
            before_1: ["0-7-5-7-2-1-0"],
            before_2: ["0-7-5-7-2-2-0"],
            before_3: ["0-7-5-7-2-3-0"],
            after_1: ["0-7-5-7-2-4-0"],
            after_2: ["0-7-5-7-2-5-0"],
            after_3: [],
            body: [["0-7-5-7-2-7-0"], ["0-7-5-7-2-7-1"], ["0-7-5-7-2-7-2"],["0-7-5-7-2-7-3"]]
        }
    },
    "0-7-5-7-2-0-0": {parentId: "0-7-5-7-2", children: {}},
    "0-7-5-7-2-1-0": {parentId: "0-7-5-7-2", children: {}},
    "0-7-5-7-2-2-0": {parentId: "0-7-5-7-2", children: {}},
    "0-7-5-7-2-3-0": {parentId: "0-7-5-7-2", children: {}},
    "0-7-5-7-2-4-0": {parentId: "0-7-5-7-2", children: {}},
    "0-7-5-7-2-5-0": {
        parentId: "0-7-5-7-2",
        children: {
            top: [],
            before_1: ["0-7-5-7-2-5-0-1-0"],
            before_2: [],
            before_3: [],
            after_1: ["0-7-5-7-2-5-0-4-0"],
            after_2: [],
            after_3: [],
            body: []
        }
    },
    "0-7-5-7-2-5-0-1-0": {parentId: "0-7-5-7-2-5-0", children: {}},
    "0-7-5-7-2-5-0-4-0": {parentId: "0-7-5-7-2-5-0", children: {}},
    "0-7-5-7-2-7-0": {
        parentId: "0-7-5-7-2",
        children: {
            top: ["0-7-5-7-2-7-0-0-0"],
            before_1: ["0-7-5-7-2-7-0-1-0"],
            before_2: ["0-7-5-7-2-7-0-2-0"],
            before_3: ["0-7-5-7-2-7-0-3-0"],
            after_1: ["0-7-5-7-2-7-0-4-0"],
            after_2: ["0-7-5-7-2-7-0-5-0"],
            after_3: [],
            body: [["0-7-5-7-2-7-0-7-0"]]
        }
    },
    "0-7-5-7-2-7-0-0-0": {parentId: "0-7-5-7-2-7-0", children: {}},
    "0-7-5-7-2-7-0-1-0": {parentId: "0-7-5-7-2-7-0", children: {}},
    "0-7-5-7-2-7-0-2-0": {parentId: "0-7-5-7-2-7-0", children: {}},
    "0-7-5-7-2-7-0-3-0": {parentId: "0-7-5-7-2-7-0", children: {}},
    "0-7-5-7-2-7-0-4-0": {parentId: "0-7-5-7-2-7-0", children: {}},
    "0-7-5-7-2-7-0-5-0": {parentId: "0-7-5-7-2-7-0", children: {}},
    "0-7-5-7-2-7-0-7-0": {parentId: "0-7-5-7-2-7-0", children: {}},
    "0-7-5-7-2-7-1": {
        parentId: "0-7-5-7-2",
        children: {
            top: ["0-7-5-7-2-7-1-0-0"],
            before_1: [],
            before_2: [],
            before_3: [],
            after_1: [],
            after_2: [],
            after_3: [],
            body: [["0-7-5-7-2-7-1-7-0"]]
        }
    },
    "0-7-5-7-2-7-1-0-0": {parentId: "0-7-5-7-2-7-1", children: {}},
    "0-7-5-7-2-7-1-7-0": {parentId: "0-7-5-7-2-7-1", children: {}},
    "0-7-5-7-2-7-2": {parentId: "0-7-5-7-2", children: {}},
    "0-7-5-7-2-7-3": {parentId: "0-7-5-7-2", children: {}},
    "0-7-5-7-3": {
        parentId: "0-7-5",
        children: {
            top: ["0-7-5-7-3-0-0"],
            before_1: ["0-7-5-7-3-1-0"],
            before_2: ["0-7-5-7-3-2-0"],
            before_3: ["0-7-5-7-3-3-0"],
            after_1: ["0-7-5-7-3-4-0"],
            after_2: ["0-7-5-7-3-5-0"],
            after_3: [],
            body: []
        }
    },
    "0-7-5-7-3-0-0": {parentId: "0-7-5-7-3", children: {}},
    "0-7-5-7-3-1-0": {parentId: "0-7-5-7-3", children: {}},
    "0-7-5-7-3-2-0": {parentId: "0-7-5-7-3", children: {}},
    "0-7-5-7-3-3-0": {parentId: "0-7-5-7-3", children: {}},
    "0-7-5-7-3-4-0": {parentId: "0-7-5-7-3", children: {}},
    "0-7-5-7-3-5-0": {
        parentId: "0-7-5-7-3",
        children: {
            top: [],
            before_1: ["0-7-5-7-3-5-0-1-0"],
            before_2: [],
            before_3: [],
            after_1: ["0-7-5-7-3-5-0-4-0"],
            after_2: [],
            after_3: [],
            body: []
        }
    },
    "0-7-5-7-3-5-0-1-0": {parentId: "0-7-5-7-3-5-0", children: {}},
    "0-7-5-7-3-5-0-4-0": {parentId: "0-7-5-7-3-5-0", children: {}},
    "0-7-5-7-4": {parentId: "0-7-5", children: {}},
};

export const initial_state = {
    ws: null,

    /*
    index: "1",
    title: "",
    description: "",
    tags: [],
    grammar: "",
    checkForFilesFolders: [""],
    checkForFilesFoldersConstraints: "INCLUDE", // or EXCLUDE
    processFilesFolders: "WITHIN",
    quantifierXPathQuery: [],
    constraintXPathQuery: [],

    quantifierQueryType: "",
    constraintQueryType: "",

    rulePanelState: {
        editMode: false,
        title: "",
        description: "",
        ruleTags: [],
        folderConstraint: "",
        filesFolders: [],
        constraintXPath: "",
        quantifierXPath: "",
        autoCompleteArray: [],
        graphicalEditorState: {guiTree: {...initial_graphicalElementTree}, guiElements: {...initial_graphicalElements}, ruleType: ""}
    },
    xPathQueryResult: [
        {
            data: {
                quantifierResult: [{filePath: "", snippet: "", xml: {fileName: "", xml: ""}}],
                satisfied: 0,
                satisfiedResult: [],
                violated: 0,
                violatedResult: []
            },
            filePath: ""
        }
     ]
     */
    ruleTable: [],
    tagTable: [],
    xmlFiles: [],
    projectHierarchy: {},
    projectPath: "",
    currentHash: ["index"],
    ignoreFileChange: false, // ignore the file switching in the IDE
    displayEditRuleTutorial: true, // display the tour guide for edit rule
    message: "init",
    openFilePath: "",
    hashManager: {
        history: ["#/index"],
        activeHashIndex: 0,
        forwardDisable: "disabled",
        backDisable: "disabled",
        clickedOnButtons: false
    },
    loadingGif: false,

    rulePadState: {
        isEditMode: false,
        title: "",
        description: "",
        ruleTags: [],
        folderConstraint: "",
        filesFolders: [],

        autoCompleteArray: [],
        quantifierXPath: "", // only produced by autoComplete grammar
        constraintXPath: "", // only produced by autoComplete grammar

        graphicalEditorState: {
            ruleType: "", // "Must" or "MustBeEqualTo"
            guiTree: {...initial_graphicalElementTree},
            guiElements: {...initial_graphicalElements}
        }
    },

    sentXpathMessages: [],
    receivedXpathMessages: [],

    // mining Rules
    minedRulesState: {
        // see miningRulesCore/extractFeatures/createFeatureMetaDataMap()
        featureMetaData: {
            featureInfoContainers: {
                featureInfo: {},
                featureInfoReverse: {},
                featureMap: {},
                featureMapReverse: {}
            },
            featureGroups: {spec: {}, usage: {}}
        },
        groupingMetaData: {
            groupMapping: {},
            fileMapping:{}
        },
        focusedElementData: {
            filePath: "",
            identifier: "",
            mapFocusedElementToFeaturesKey: ""
        },
        doiInformation: {
            recentVisitedFiles: [],
            recentSearches: [],
            recentVisitedElements: []
        },
        selectedAlgorithm: allAlgorithms.CHUI_MINER_DEFAULT,
        minedRules: [],
    }

};

// used for editing existing rule
export const default_rulePanelState = {
    editMode: false, // default must be false unless a new rule is being generated: !!props["newRule"]

    title: "",
    description: "",
    ruleTags: [],
    folderConstraint: "",
    filesFolders: [],

    autoCompleteArray: [],
    quantifierXPath: "", // only produced by autoComplete grammar
    constraintXPath: "", // only produced by autoComplete grammar

    graphicalEditorState: {
        ruleType: "", // "Must" or "MustBeEqualTo"
        guiTree: {...initial_graphicalElementTree},
        guiElements: {...initial_graphicalElements}
    }
};
