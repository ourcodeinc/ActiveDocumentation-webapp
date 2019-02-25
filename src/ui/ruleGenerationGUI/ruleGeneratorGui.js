/**
 * Created by saharmehrpour on 2/23/18.
 */

import React, {Component} from 'react';
import '../../App.css';

import {connect} from "react-redux";

import GuiComponent from "./guiComponent";
import {changeAutoCompleteTextFromGUI, changeGuiElement} from "../../actions";
import {getConditionByName} from "./guiConstants";
import {autoComplete_suggestion} from "../ruleGenerationText/textConstant";


class RuleGeneratorGui extends Component {

    constructor(props) {
        super(props);

        this.ruleIndex = props.ruleIndex;

        // new rule
        this.state = {
            ws: props.ws,

            guiTree: props.guiTree,
            guiElements: props.guiElements,
            autoCompleteArray: props.autoCompleteArray,
        };

        this.class = props["className"] ? props["className"] : "generateRuleGui";

        // existing rule
        if (this.ruleIndex !== -1) {
            let indices = props.rules.map(d => d.index);
            let arrayIndex = indices.indexOf(this.ruleIndex);
            if (arrayIndex === -1)
                console.log(`error: rule with index ${this.ruleIndex} is not found in the ruleTable.
                Only ${indices.toString()} are found as indices.`);
            else {
                this.ruleI = props.rules[arrayIndex];
                // updating the rule
                this.state.guiTree = this.ruleI.rulePanelState.guiState.guiTree;
                this.state.guiElements = this.ruleI.rulePanelState.guiState.guiElements;
                this.state.autoCompleteArray = this.ruleI.rulePanelState.autoCompleteArray;
            }
        }

    }

    render() {
        return (
            <div style={{clear: "both", marginTop: "20px"}} className={this.class}>
                <GuiComponent key={new Date()} ruleIndex={this.ruleIndex} elementId={"0"} root
                              rootTree={this.state.guiTree}
                              guiElements={this.state.guiElements}
                              onChangeGuiElement={(ruleIndex, jobs) => this.props.onChangeGuiElement(ruleIndex, jobs)}
                />
            </div>
        );
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps, () => {
            this.newReceiveStateData();
        });
    }

    /**
     * when the new props is received through redux state
     * the componentWillReceiveProps() is not triggered as this
     * component is unmounted and mounted again by its parent
     * this function ensures that the required functions are called.
     */
    componentDidMount() {
        this.newReceiveStateData();
    }

    newBuildTreeForProcessing = () => {

        let guiElements = JSON.parse(JSON.stringify(this.state.guiElements));
        let guiTree = JSON.parse(JSON.stringify(this.state.guiTree));


        // check connectivity of elements
        let activateJobs = this.connectElements(guiElements, guiTree);
        if (activateJobs.jobs.length !== 0) {
            this.props.onChangeGuiElement(this.ruleIndex, activateJobs.jobs);
            return;
        }

        // check the selected element
        let selectJobs = this.lowestCommonAncestor(guiElements, guiTree);
        if (selectJobs.jobs.length !== 0) {
            this.props.onChangeGuiElement(this.ruleIndex, selectJobs.jobs);
            return;
        }
        if (selectJobs.error) {
            this.props["onError"](true);
            return;
        }

        let visitedNodeId = [];

        let buildTreeFromNodeId = (nodeId, group) => {
            visitedNodeId.push(nodeId);

            let nodeChildren = {};
            Object.keys(guiTree[nodeId].children).forEach(childGroup => {
                nodeChildren[childGroup] = [];
                if (childGroup !== "body")
                    guiTree[nodeId].children[childGroup].forEach(childId => {
                        if (visitedNodeId.indexOf(childId) !== -1) return null;
                        if (childId === "" || !guiElements[childId].activeElement) return null;
                        if (group === "quantifier" && guiElements[childId].isConstraint) return null;
                        let newSubTree = buildTreeFromNodeId(childId, group);
                        if (newSubTree) nodeChildren[childGroup].push(newSubTree)
                    });
                else
                    guiTree[nodeId].children["body"].forEach((subGroup, i) => {
                        subGroup.forEach(childId => {
                            if (visitedNodeId.indexOf(childId) !== -1) return null;
                            if (childId === "" || !guiElements[childId].activeElement) return null;
                            if (group === "quantifier" && guiElements[childId].isConstraint) return null;
                            let newSubTree = buildTreeFromNodeId(childId, group);
                            if (newSubTree) nodeChildren["body"].push(newSubTree)
                        })
                    })
            });

            let conditionByName = getConditionByName(guiElements[nodeId].conditionName);
            return {
                nodeId: nodeId,
                properties: {
                    ...guiElements[nodeId],
                    elementGrammar: conditionByName.grammar,
                    elementPlaceholder: conditionByName.required ? (conditionByName.required + conditionByName.placeholder) : ""
                },
                parentNode: {},
                children: nodeChildren
            };

        };

        let buildBottomUpTreeFromNodeId = (nodeId, group) => {
            if (nodeId === "" || !guiElements[nodeId].activeElement) return {};
            visitedNodeId.push(nodeId);

            //children all children are 1D arrays even "body"
            let nodeChildren = {};
            Object.keys(guiTree[nodeId].children).forEach(childGroup => {
                nodeChildren[childGroup] = [];
                if (childGroup !== "body")
                    guiTree[nodeId].children[childGroup].forEach(childId => {
                        if (visitedNodeId.indexOf(childId) !== -1) return;
                        if (childId === "" || !guiElements[childId].activeElement) return;
                        if (guiElements[childId].isConstraint && group === "quantifier") return;
                        let newSubTree = buildTreeFromNodeId(childId, group);
                        if (newSubTree) nodeChildren[childGroup].push(newSubTree);
                    });
                else
                    guiTree[nodeId].children["body"].forEach((subGroup) => {
                        subGroup.forEach(childId => {
                            if (visitedNodeId.indexOf(childId) !== -1) return;
                            if (childId === "" || !guiElements[childId].activeElement) return;
                            if (guiElements[childId].isConstraint && group === "quantifier") return;
                            let newSubTree = buildTreeFromNodeId(childId, group);
                            if (newSubTree) nodeChildren["body"].push(newSubTree);
                        })
                    })
            });

            return {
                nodeId: nodeId,
                properties: {
                    ...guiElements[nodeId],
                    elementGrammar: getConditionByName(guiElements[nodeId].conditionName).grammar,
                },
                parentNode: buildBottomUpTreeFromNodeId(guiTree[nodeId].parentId),
                children: nodeChildren
            };
        };
        // reach root from selectedElementID
        return {
            quantifierTree: buildBottomUpTreeFromNodeId(guiTree.selectedElementID, "quantifier"),
            constraintTree: buildBottomUpTreeFromNodeId(guiTree.selectedElementID, "constraint")
        };
    };


    /**
     * process the data received from GUI
     */
    newReceiveStateData = () => {

        let trees = this.newBuildTreeForProcessing();
        if (!trees) return;

        let quantifierTree = JSON.parse(JSON.stringify(trees.quantifierTree));
        let constraintTree = JSON.parse(JSON.stringify(trees.constraintTree));

        let grammarTextQ = this.buildGrammarTree(quantifierTree);
        let grammarTextC = this.buildGrammarTree(constraintTree, true);

        let guiArray = grammarTextQ.concat([{text: "must", id: ""}, {text: "have", id: ""}]).concat(grammarTextC);

        let filteredTextArray = this.state.autoCompleteArray
            .filter(d => d.text !== "(" && d.text !== ")" && d.text !== "or" && d.text !== "and" && d.text !== "");
        let perms = this.computeAllPermutations(guiArray);

        if (perms.length === 0 || filteredTextArray.length !== perms[0].length) {
            // return the trivial one from GUI.
            let grammarTrivialTextQ = this.buildTrivialGrammar(quantifierTree);
            let grammarTrivialTextC = this.buildTrivialGrammar(constraintTree, true);

            let trivialGuiArray = grammarTrivialTextQ
                .concat([{text: "must", id: ""}, {text: "have", id: ""}])
                .concat(grammarTrivialTextC);

            this.props.onChangeAutoCompleteTextFromGUI(this.props.ruleIndex, trivialGuiArray);
            this.props["onError"](false);

            return;
        }

        // look for match in permutation
        // function with annotation and parameter
        // function with parameter and annotation
        let found = true,
            isIdentical = true, // prevents react render loops
            foundOption;
        for (let i = 0; i < perms.length; i++) {
            found = true;
            isIdentical = true;
            for (let j = 0; j < perms[i].length; j++) {
                if (perms[i][j].text !== filteredTextArray[j].text) {
                    found = false;
                    break;
                }
                if (perms[i][j].id !== filteredTextArray[j].id)
                    isIdentical = false;
            }
            if (found) {
                foundOption = perms[i];
                break;
            }
        }
        if (!found) {
            // return the trivial one from GUI.
            let grammarTrivialTextQ = this.buildTrivialGrammar(quantifierTree);
            let grammarTrivialTextC = this.buildTrivialGrammar(constraintTree, true);

            let trivialGuiArray = grammarTrivialTextQ
                .concat([{text: "must", id: ""}, {text: "have", id: ""}])
                .concat(grammarTrivialTextC);

            this.props.onChangeAutoCompleteTextFromGUI(this.props.ruleIndex, trivialGuiArray)
            this.props["onError"](false);

            return;
        }

        // match ids with textArray and foundOption
        let foundOptionIndex = 0;
        let matchedIds = this.state.autoCompleteArray.map(d => {
            if (d.text === "(" || d.text === ")" || d.text === "or" || d.text === "and" || d.text === "") return d;
            foundOptionIndex++;
            return {text: d.text, id: foundOption[foundOptionIndex - 1].id};
        });

        if (!isIdentical) this.props.onChangeAutoCompleteTextFromGUI(this.props.ruleIndex, matchedIds);
        this.props["onError"](false);

    };

    /**
     * traverse the children of a node to generate grammar text
     * @param rootNode
     * @param constraintQuery
     * @return {Array} of objects {text: "", id: ""}
     */
    buildGrammarTree(rootNode, constraintQuery = false) {
        // console.log(rootNode);
        let grammarObject = []; // {text: "", id: ""}

        // element name
        if (!constraintQuery)
            rootNode["properties"].elementGrammar.split(" ").forEach(part =>
                grammarObject.push({text: part, id: rootNode.nodeId}));

        // text value
        if (rootNode["properties"].text) {
            if (autoComplete_suggestion[rootNode["properties"].elementGrammar].preWord)
                grammarObject.push({
                    text: autoComplete_suggestion[rootNode["properties"].elementGrammar].preWord,
                    id: rootNode.nodeId
                });
            grammarObject.push({text: "\"" + rootNode["properties"].text + "\"", id: rootNode.nodeId});
        }

        if (rootNode["properties"].elementPlaceholder && !rootNode["properties"].text) {
            rootNode["properties"].elementPlaceholder.split(" ").forEach(w => {
                grammarObject.push({text: w, id: rootNode.nodeId});
            });
        }

        // dropdown value
        if (rootNode["properties"].value) {
            grammarObject.push({text: "\"" + rootNode["properties"].value + "\"", id: rootNode.nodeId});
        }

        //children all children are 1D arrays even "body"
        let allChildren = [];
        let tempArray = {id: "permutation", children: []};
        Object.keys(rootNode.children).forEach(group => allChildren = allChildren.concat(rootNode.children[group]));
        if (allChildren.length > 0 && !constraintQuery) grammarObject.push({text: "with", id: ""});
        for (let i = 0; i < allChildren.length; i++)
            tempArray.children.push(this.buildGrammarTree(allChildren[i]));

        if (allChildren.length > 0) grammarObject = grammarObject.concat(tempArray);

        // parent
        if (Object.entries(rootNode.parentNode).length !== 0 && !constraintQuery) {
            grammarObject.push({text: "of", id: ""});
            grammarObject = grammarObject.concat(this.buildGrammarTree(rootNode.parentNode))
        }

        return grammarObject;
    }

    /**
     * traverse the children of a node to generate grammar text
     * @param rootNode
     * @param constraintQuery
     * @return {Array} of objects {text: "", id: ""}
     */
    buildTrivialGrammar(rootNode, constraintQuery = false) {
        // console.log(rootNode);
        let grammarObject = []; // {text: "", id: ""}

        // element name
        if (!constraintQuery)
            rootNode["properties"].elementGrammar.split(" ").forEach(part =>
                grammarObject.push({text: part, id: rootNode.nodeId}));

        // text value
        if (rootNode["properties"].text) {
            if (autoComplete_suggestion[rootNode["properties"].elementGrammar].preWord)
                grammarObject.push({
                    text: autoComplete_suggestion[rootNode["properties"].elementGrammar].preWord,
                    id: rootNode.nodeId
                });
            grammarObject.push({text: "\"" + rootNode["properties"].text + "\"", id: rootNode.nodeId});
        }

        if (rootNode["properties"].elementPlaceholder && !rootNode["properties"].text) {
            rootNode["properties"].elementPlaceholder.split(" ").forEach(w => {
                grammarObject.push({text: w, id: rootNode.nodeId});
            });
        }

        // dropdown value
        if (rootNode["properties"].value) {
            grammarObject.push({text: "\"" + rootNode["properties"].value + "\"", id: rootNode.nodeId});
        }

        //children all children are 1D arrays even "body"
        let allChildren = [];
        Object.keys(rootNode.children).forEach(group => allChildren = allChildren.concat(rootNode.children[group]));
        if (allChildren.length > 0 && !constraintQuery) grammarObject.push({text: "with", id: ""});
        if (allChildren.length > 1 && !constraintQuery) grammarObject.push({text: "(", id: ""});
        for (let i = 0; i < allChildren.length; i++) {
            grammarObject = grammarObject.concat(this.buildTrivialGrammar(allChildren[i]));
            if (i < allChildren.length - 1) grammarObject.push({text: "and", id: ""});
        }
        if (allChildren.length > 1 && !constraintQuery) grammarObject.push({text: ")", id: ""});

        // parent
        if (Object.entries(rootNode.parentNode).length !== 0 && !constraintQuery) {
            grammarObject.push({text: "of", id: ""});
            grammarObject = grammarObject.concat(this.buildTrivialGrammar(rootNode.parentNode))
        }

        return grammarObject;
    }

    /**
     * given the produced grammar tree, returns all permutations of the GUI output
     * e.g.
     * function with name/annotation
     * function with annotation/name
     * The output doesn't have and/or and parenthesis
     * @param grammarArrayFromGui
     */
    computeAllPermutations(grammarArrayFromGui) {

        // compute all permutation for [0, ..., indicesLength]
        function createPermutedIndices(indicesLength) {
            let permArr = [], usedChars = [];
            let arr = Array.apply(null, {length: indicesLength}).map(Number.call, Number);

            function permute(input) {
                let i, ch;
                for (i = 0; i < input.length; i++) {
                    ch = input.splice(i, 1)[0];
                    usedChars.push(ch);
                    if (input.length === 0) {
                        permArr.push(usedChars.slice());
                    }
                    permute(input);
                    input.splice(i, 0, ch);
                    usedChars.pop();
                }
                return permArr
            }

            return permute(arr);
        }

        // reorder nodes elements based on permutation
        function computePermutedChildren(nodes, permutation) {
            if (nodes.length !== permutation.length) return nodes;
            let perm = [];
            for (let i = 0; i < permutation.length; i++) {
                perm.push(nodes[permutation[i]]);
            }
            return perm;
        }

        // for the given element, compute all possible permutations of its children
        // returns 2D array
        function computePermutation(el) {
            let array = [[]];
            for (let i = 0; i < el.length; i++) {
                for (let j = 0; j < el[i].length; j++) {
                    if (el[i][j].id !== "permutation")
                        array.forEach(a => a.push(el[i][j]));
                    else {
                        let temp = [];
                        let copiedPre = JSON.parse(JSON.stringify(array));
                        createPermutedIndices(el[i][j].children.length).forEach(p => {
                            let permutedChildren = computePermutation(computePermutedChildren(el[i][j].children, p));
                            copiedPre.forEach(cp => {
                                permutedChildren.forEach(pch => {
                                    temp.push(cp.concat(pch))
                                })
                            })
                        });
                        array = temp;
                    }
                }
            }
            return array;
        }

        return computePermutation(grammarArrayFromGui.map(d => [d]));
    }


    /**
     * If there are multiple elements in the GUI, this method makes sure they are connected
     * @param guiElements
     * @param guiTree
     * @returns {{jobs: Array}}
     */
    connectElements(guiElements, guiTree) {

        let jobs = [];

        // for each active element, find the path from root to the node.
        let treePaths = Object.keys(guiElements)
            .filter(id => guiElements[id].activeElement)
            .map(id => {
                let path = [id];
                let tempID = id;
                while (guiTree[tempID].parentId !== "") {
                    path.push(guiTree[tempID].parentId);
                    tempID = guiTree[tempID].parentId;
                }
                return path.reverse(); // return root to node path
            });

        // activate the elements between root and the node
        treePaths.forEach(path => {
            for (let i = 0; i < path.length; i++) {
                if (!guiElements[path[i]].activeElement)
                    jobs.push({
                        elementId: path[i],
                        task: "UPDATE_ELEMENT",
                        value: {activeElement: true}
                    });
            }
        });

        return {jobs: jobs};
    }

    /**
     *
     * @param guiElements
     * @param guiTree
     * @returns {{jobs: Array, error: boolean}} array of jobs for "CHANGE_GUI_ELEMENT"
     */
    lowestCommonAncestor(guiElements, guiTree) {
        let jobs = [];
        // lowest common ancestor elementId
        let lcaID = "", lcaIndex;
        // element ids we need to find their common ancestor
        let elementIDs = Object.keys(guiElements).filter(id => guiElements[id].isConstraint);

        if (elementIDs.length === 0) return {jobs: [], error: true};


        // for each element, find the path from root to the node.
        let treePaths = elementIDs.map(id => {
            let path = [id];
            let tempID = id;
            while (guiTree[tempID].parentId !== "") {
                path.push(guiTree[tempID].parentId);
                tempID = guiTree[tempID].parentId;
            }
            return path.reverse(); // return root to node path
        });

        if (elementIDs.length > 1) {
            // find LCA
            lcaIndex = -1;
            let isCommon = true;
            while (isCommon) {
                for (let i = 1; i < treePaths.length; i++) {
                    // if we reached one of the elements
                    // or their parents are different
                    // or we already reached the nominated one
                    if (treePaths[i].length <= lcaIndex + 1 || treePaths[i - 1].length <= lcaIndex + 1 ||
                        treePaths[i][lcaIndex + 1] !== treePaths[i - 1][lcaIndex + 1] ||
                        treePaths[i][lcaIndex] === guiTree.selectedElementID ||
                        !getConditionByName(guiElements[treePaths[i][lcaIndex + 1]].conditionName).canBeSelected) {
                        isCommon = false;
                        break;
                    }
                }
                if (isCommon) lcaIndex++;
            }
            // if there is no common ancestor return error >>> this should not happen
            if (lcaIndex === -1) return {jobs: [], error: true};
            lcaID = treePaths[0][lcaIndex];
        }

        else if (elementIDs.length === 1) {
            lcaIndex = treePaths[0].length - 1;
            lcaID = elementIDs[0];
            // find ancestor that can be selected
            while (!getConditionByName(guiElements[lcaID].conditionName).canBeSelected && guiTree[lcaID].parentId !== "") {
                lcaID = guiTree[lcaID].parentId;
                lcaIndex--;
            }
            // if no ancestor can be selected, return error >>> should not happen based on guiConstants
            if (!getConditionByName(guiElements[lcaID].conditionName).canBeSelected && guiTree[lcaID].parentId === "")
                return {jobs: [], error: true};
        }

        // activate the elements between LCA and the node
        treePaths.forEach(path => {
            for (let i = lcaIndex; i < path.length; i++) {
                if (i > lcaIndex && !guiElements[path[i]].isConstraint)
                    jobs.push({
                        elementId: path[i],
                        task: "UPDATE_ELEMENT",
                        value: {isConstraint: true}
                    });
            }
        });

        // update the selected element if changed
        if (guiTree.selectedElementID !== lcaID)
            jobs.push({elementId: lcaID, task: "SELECT_ELEMENT", value: true});

        return {jobs: jobs, error: false};
    };


}

function mapStateToProps(state) {
    return {
        rules: state.ruleTable,
        ws: state.ws,

        guiTree: state.newOrEditRule.guiState.guiTree,
        guiElements: state.newOrEditRule.guiState.guiElements,
        autoCompleteArray: state.newOrEditRule.autoCompleteArray,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onChangeGuiElement: (ruleIndex, jobs) => dispatch(changeGuiElement(ruleIndex, jobs)),
        onChangeAutoCompleteTextFromGUI: (ruleIndex, newAutoCompleteArray) => dispatch(changeAutoCompleteTextFromGUI(ruleIndex, newAutoCompleteArray))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RuleGeneratorGui);
