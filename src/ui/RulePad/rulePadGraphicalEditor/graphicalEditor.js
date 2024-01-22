/**
 * Created by saharmehrpour on 2/23/18.
 */

import React, {Component} from "react";
import "../../../App.css";

import {connect} from "react-redux";

import GraphicalComponent from "./graphicalComponent";
import {changeAutoCompleteTextFromGUI, changeRuleState} from "../../../actions";
import {generateTreeForElement, getConditionByName} from "./graphicalEditorConstants";
import {autoComplete_suggestion, skip_words_from_TE} from "../rulePadTextualEditor/textualEditorConstant";
import {constantRuleIndex} from "../../uiConstants";
import {shouldIgnoreInfrequent} from "../../../miningRulesCore/postProcessing";


class GraphicalEditor extends Component {

    constructor(props) {
        super(props);

        this.ruleIndex = props.ruleIndex;
        this.canBeStarredIDs = [];

        // new rule
        this.state = {
            ws: props.ws,

            guiTree: props.guiTree,
            guiElements: props.guiElements,
            autoCompleteArray: props.autoCompleteArray,
        };

        this.class = (props["className"] ? props["className"] : "generateRuleGui") + " guiBoundingBox";

        // existing rule
        if (this.ruleIndex >= 0) {
            let indices = props.rules.map(d => d.index);
            let arrayIndex = indices.indexOf(this.ruleIndex);
            if (arrayIndex === -1)
                console.log(`error: rule with index ${this.ruleIndex} is not found in the ruleTable.
                Only ${indices.toString()} are found as indices.`);
            else {
                this.ruleI = props.rules[arrayIndex];
                // updating the rule
                this.state.guiTree = this.ruleI.rulePanelState.graphicalEditorState.guiTree;
                this.state.guiElements = this.ruleI.rulePanelState.graphicalEditorState.guiElements;
                this.state.autoCompleteArray = this.ruleI.rulePanelState.autoCompleteArray;
            }
        }
    }

    render() {
        return (
            <div className={this.class}>
                <GraphicalComponent key={new Date()} ruleIndex={this.ruleIndex} elementId={"0"} root
                                    rootTree={this.state.guiTree}
                                    canBeStarredIDs={this.canBeStarredIDs}
                                    guiElements={this.state.guiElements}
                                    changeGuiElementJobs={(ruleIndex, jobs) => this.processJobsBeforeSubmit(jobs)}
                />
            </div>
        );
    }

    //componentDidUpdate doesn't work
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.ruleIndex >= 0) {
            let indices = nextProps.rules.map(d => d.index);
            let arrayIndex = indices.indexOf(this.ruleIndex);
            if (arrayIndex === -1)
                console.log(`error: rule with index ${this.ruleIndex} is not found in the ruleTable.
                Only ${indices.toString()} are found as indices.`);
            else {
                this.ruleI = nextProps.rules[arrayIndex];

                this.setState(
                    {
                        ws: nextProps.ws,
                        guiTree: this.ruleI.rulePanelState.graphicalEditorState.guiTree,
                        guiElements: this.ruleI.rulePanelState.graphicalEditorState.guiElements,
                        autoCompleteArray: this.ruleI.rulePanelState.autoCompleteArray
                    }, this.receiveStateData);
            }
        }
        else if (this.ruleIndex === constantRuleIndex.newRuleIndex) {
            this.setState(nextProps, this.receiveStateData);
        }
    }

    /**
     * when the new props is received through redux state
     * the componentWillReceiveProps() is not triggered as this
     * component is unmounted and mounted again by its parent
     * this function ensures that the required functions are called.
     */
    componentDidMount() {
        this.receiveStateData();
    }

    buildTreeForProcessing = () => {

        let guiElements = JSON.parse(JSON.stringify(this.state.guiElements));
        let guiTree = JSON.parse(JSON.stringify(this.state.guiTree));


        // check connectivity of elements
        let activateJobs = this.connectElements(guiElements, guiTree);
        if (activateJobs.jobs.length !== 0) {
            console.log("error: not connected", activateJobs.jobs);
            // this.props.onChangeGuiElement(this.ruleIndex, activateJobs.jobs);
            return;
        }

        // check the selected element
        let selectJobs = this.lowestCommonAncestor(guiElements, guiTree);
        if (selectJobs.jobs.length !== 0) {
            console.log("error: not EoI", selectJobs.jobs);
            // this.props.onChangeGuiElement(this.ruleIndex, selectJobs.jobs);
            return;
        }
        if (selectJobs.error) {
            this.props["onError"](true);
            return;
        }

        // reach root from selectedElementID
        return {
            quantifierTree: buildFromGUI (guiTree, guiElements, guiTree.selectedElementID, "quantifier"),
            constraintTree: buildFromGUI (guiTree, guiElements, guiTree.selectedElementID, "constraint")
        };
    };


    /**
     * process the data received from GUI
     */
    receiveStateData = () => {
        let trees = this.buildTreeForProcessing();
        if (!trees || Object.keys(trees.quantifierTree).length === 0 || Object.keys(trees.constraintTree).length === 0) {
            if (Object.keys(this.state.guiElements).filter(id => this.state.guiElements[id].activeElement).length === 0)
                this.canBeStarredIDs = [];
            this.props["onFilledGUI"](Object.keys(this.state.guiElements).filter(id => this.state.guiElements[id].activeElement).length !== 0);
            return;
        }

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
            let grammarTrivialTextQ = buildTrivialGrammar(quantifierTree);
            let grammarTrivialTextC = buildTrivialGrammar(constraintTree, true);

            let trivialGuiArray = grammarTrivialTextQ
                .concat([{text: "must", id: ""}, {text: "have", id: ""}])
                .concat(grammarTrivialTextC);

            this.props.onChangeAutoCompleteTextFromGUI(this.props.ruleIndex, trivialGuiArray);
            this.props["onError"](false);
            this.props["onFilledGUI"](true);
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
            let grammarTrivialTextQ = buildTrivialGrammar(quantifierTree);
            let grammarTrivialTextC = buildTrivialGrammar(constraintTree, true);

            let trivialGuiArray = grammarTrivialTextQ
                .concat([{text: "must", id: ""}, {text: "have", id: ""}])
                .concat(grammarTrivialTextC);

            this.props.onChangeAutoCompleteTextFromGUI(this.props.ruleIndex, trivialGuiArray);
            this.props["onError"](false);
            this.props["onFilledGUI"](true);
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
        this.props["onFilledGUI"](true);
    };

    /**
     * traverse the children of a node to generate grammar text
     * @param rootNode
     * @param constraintQuery
     * @return {Array} of objects {text: "", id: ""}
     */
    buildGrammarTree(rootNode, constraintQuery = false) {
        let grammarObject = []; // {text: "", id: ""}

        // element name
        if (!constraintQuery) {
            if (!skip_words_from_TE.includes(rootNode["properties"].elementGrammar))
                rootNode["properties"].elementGrammar.split(" ").forEach(part =>
                    grammarObject.push({text: part, id: rootNode.nodeId}));
        }

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
        return this.lowestCommonAncestor(guiElements, guiTree, "activeElement");
    }


    /**
     * when adding new elements, constraints should not contains non-constraint
     * @param guiElements
     * @param guiTree
     * @returns {{jobs: Array}}
     */
    makeConstraint(guiElements, guiTree) {
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
            for (let i = 1; i < path.length; i++) {
                if (guiElements[path[i - 1]].isConstraint && !guiElements[path[i]].isConstraint)
                    jobs.push({
                        elementId: path[i],
                        task: "UPDATE_ELEMENT",
                        value: {isConstraint: true}
                    });
            }
        });
        return {jobs: jobs};
    }

    /**
     * find the lowest common ancestor to activate
     * @param guiElements
     * @param guiTree
     * @param property {'isConstraint' | 'activeElement'}
     * @returns {{jobs: Array, error: boolean}} array of jobs for "CHANGE_GUI_ELEMENT"
     */
    lowestCommonAncestor(guiElements, guiTree, property = "isConstraint") {
        let jobs = [];
        // lowest common ancestor elementId
        let lcaID = "", lcaIndex;
        // element ids we need to find their common ancestor
        let elementIDs = Object.keys(guiElements).filter(id => guiElements[id][property]);

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
            let lcaIndexNominated = -1;
            let isCommon = true;
            while (isCommon) {
                for (let i = 0; i < treePaths.length; i++) {
                    // if we already reached the nominated one
                    if (treePaths[i][lcaIndex] === guiTree.selectedElementID) {
                        lcaIndexNominated = lcaIndex;
                    }
                    // if we reached one of the elements
                    // or their parents are different
                    // or reached a node that can't be selected
                    if (treePaths[i].length <= lcaIndex + 1 ||
                        (i !== treePaths.length - 1 && (treePaths[i + 1].length <= lcaIndex + 1 || treePaths[i][lcaIndex + 1] !== treePaths[i + 1][lcaIndex + 1])) ||
                        (i === treePaths.length - 1 && treePaths[i][lcaIndex + 1] !== treePaths[i - 1][lcaIndex + 1]) ||
                        // treePaths[i][lcaIndex] === guiTree.selectedElementID ||
                        !getConditionByName(guiElements[treePaths[i][lcaIndex + 1]].conditionName).canBeSelected) {
                        isCommon = false;
                        break;
                    }
                }
                if (isCommon) lcaIndex++;
            }
            // if there is no common ancestor return error >>> this should not happen
            if (lcaIndex === -1) return {jobs: [], error: true};
            if (property === "isConstraint") {
                this.canBeStarredIDs = treePaths[0].slice(0, lcaIndex + 1);
            }
            if (lcaIndexNominated !== -1) lcaIndex = lcaIndexNominated;
            lcaID = treePaths[0][lcaIndex];
        } else if (elementIDs.length === 1) {
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
            if (property === "isConstraint") {
                this.canBeStarredIDs = [lcaID];
                if (elementIDs[0] === lcaID && guiTree[lcaID].parentId !== "")
                    this.canBeStarredIDs.push(guiTree[lcaID].parentId)
            }
        }

        let value = {};
        value[property] = true;
        // activate the elements between LCA and the node
        treePaths.forEach(path => {
            for (let i = lcaIndex; i < path.length; i++) {
                if (i > lcaIndex && !guiElements[path[i]][property])
                    jobs.push({
                        elementId: path[i],
                        task: "UPDATE_ELEMENT",
                        value
                    });
            }
        });

        // update the selected element if changed
        if (property === "isConstraint" && this.canBeStarredIDs.indexOf(guiTree.selectedElementID) === -1)
            jobs.push({elementId: lcaID, task: "SELECT_ELEMENT", value: true});

        else if (property === "activeElement" && lcaID !== guiTree.selectedElementID)
            jobs.push({elementId: lcaID, task: "SELECT_ELEMENT", value: true});

        return {jobs: jobs, error: false};
    };


    /**
     * process received jobs from GUI components similar to the reducer
     * and add more if necessary
     */
    processJobsBeforeSubmit(jobs) {

        let guiElements = JSON.parse(JSON.stringify(this.state.guiElements));
        let guiTree = JSON.parse(JSON.stringify(this.state.guiTree));

        // simulating the reducer
        let applyJobs = (tasks) => {
            tasks.forEach(job => {
                switch (job["task"]) {
                    // job = {elementId: "", task: "", value: `${childGroupName}`}
                    case "ADD_EXTRA":
                    case "REMOVE_EXTRA":
                        // general function for adding and removing extra fields

                        // for "body" value should be in form of `body,${index}`
                        let childGroup = job["value"].startsWith("body") ? "body" : job["value"];

                        let filterFunction = (id) => {
                            if (guiElements[id].activeElement)
                                return true;
                            delete guiElements[id];

                            // if the newly removed element is a selected element, un-select it
                            if (guiTree.selectedElementID === id)
                                guiTree.selectedElementID = "";

                            return false;
                        };

                        let childrenGroup = guiTree[job["elementId"]].children[childGroup];
                        if (job["value"].startsWith("body")) childrenGroup = guiTree[job["elementId"]].children[childGroup][+(job["value"].split(",")[1])];

                        let newElementConditionName = guiElements[childrenGroup[0]].conditionName;
                        if (job["task"] === "REMOVE_EXTRA") {
                            // remove all inactive elements
                            if (job["value"].startsWith("body"))
                                guiTree[job["elementId"]].children[childGroup][+(job["value"].split(",")[1])] =
                                    guiTree[job["elementId"]].children[childGroup][+(job["value"].split(",")[1])].filter((id) => filterFunction(id));
                            else
                                guiTree[job["elementId"]].children[childGroup] =
                                    guiTree[job["elementId"]].children[childGroup].filter((id) => filterFunction(id));
                        }
                        let newElementId = Math.floor(new Date().getTime() / 10).toString();
                        let newElementsData = generateTreeForElement(newElementConditionName, newElementId, job["elementId"]);
                        // updating the existing tree
                        if (job["value"].startsWith("body"))
                            guiTree[job["elementId"]].children[childGroup][+(job["value"].split(",")[1])].push(newElementId);
                        else
                            guiTree[job["elementId"]].children[childGroup].push(newElementId);
                        // adding new trees
                        newElementsData.trees.forEach(tree => guiTree[tree.id] = tree.node);
                        // adding new elements
                        newElementsData.elements.forEach(elem => guiElements[elem.id] = elem.node);


                        break;

                    // job = {elementId: "", task: "UPDATE_ELEMENT", value: {props: newValues}}
                    case "UPDATE_ELEMENT":
                        guiElements[job["elementId"]] = {
                            ...guiElements[job["elementId"]],
                            ...job["value"]
                        };

                        // if the newly inactive element is a selected element, un-select it
                        // if (guiTree.selectedElementID === job["elementId"] && !guiElements[job["elementId"]].activeElement)
                        //     guiTree.selectedElementID = "";

                        break;

                    // job = {elementId: "", task: "REMOVE_ELEMENT", value: {parentId: ""}}
                    case "REMOVE_ELEMENT":

                        // search in parent children and remove elementId
                        // toBeDeletedIDs=[] to be removed from ...graphicalEditorState.${group}.guiElements and ....graphicalEditorState["quantifier/constraint"]
                        // build a stack=[elementId] for going through tree of elementId
                        // while stack.size()>0
                        //  pop one newId, add it to storeIDs
                        //  add ids of children of the popped id tree to the stack
                        // delete toBeDeletedIDs from ...graphicalEditorState.${group}.guiElements and ....graphicalEditorState["quantifier/constraint"]

                        let parentTree = guiTree[job["value"]["parentId"]];
                        Object.keys(parentTree.children).forEach(childGroup => {
                            if (childGroup !== "body")
                                guiTree[job["value"]["parentId"]].children[childGroup] = parentTree.children[childGroup].filter(elemId => elemId !== job["elementId"]);
                            else
                                guiTree[job["value"]["parentId"]].children["body"] = parentTree.children["body"].map(subGroup => {
                                    return subGroup.filter(elemId => elemId !== job["elementId"])
                                });
                        });

                        let stackIDs = [job["elementId"]];
                        while (stackIDs.length > 0) {
                            let tempId = stackIDs.pop();

                            let tempTree = guiTree[tempId];
                            let childrenIds = [];

                            Object.keys(tempTree.children).forEach(childGroup => {
                                if (childGroup !== "body") childrenIds = childrenIds.concat(tempTree.children[childGroup]);
                                else
                                    tempTree.children["body"].forEach(subGroup => {
                                        childrenIds = childrenIds.concat(subGroup)
                                    });
                            });
                            stackIDs = stackIDs.concat(childrenIds);
                        }

                        stackIDs.forEach(elemId => {
                            delete guiElements[elemId];
                            delete guiTree[elemId];

                            // if the newly removed element is a selected element, un-select it
                            if (guiTree.selectedElementID === elemId)
                                guiTree.selectedElementID = "";
                        });

                        break;

                    // job = {elementId: "", task: "SELECT_ELEMENT", value: true/false}
                    case "SELECT_ELEMENT":
                        let oldSelectedElementId = guiTree.selectedElementID;
                        // if selectedElement exists update its state as well
                        if (guiElements.hasOwnProperty(oldSelectedElementId))
                            guiElements[oldSelectedElementId] = {
                                ...guiElements[oldSelectedElementId],
                                selectedElement: !job["value"]
                            };
                        guiTree.selectedElementID = job["elementId"];
                        if (guiElements.hasOwnProperty(job["elementId"]))
                            guiElements[job["elementId"]] = {
                                ...guiElements[job["elementId"]],
                                selectedElement: job["value"],
                                isConstraint: job["value"] ? false : guiElements[job["elementId"]].isConstraint
                            };
                        break;
                    default:
                        break;
                }
            });
        };

        applyJobs(jobs);

        // check connectivity of elements
        let activateJobs = this.connectElements(guiElements, guiTree);
        applyJobs(activateJobs.jobs);
        jobs = jobs.concat(activateJobs.jobs);

        let constraintJobs = this.makeConstraint(guiElements, guiTree);
        applyJobs(constraintJobs.jobs);
        jobs = jobs.concat(constraintJobs.jobs);

        // check the selected element
        let selectJobs = this.lowestCommonAncestor(guiElements, guiTree);
        jobs = jobs.concat(selectJobs.jobs);

        let ruleState = this.props.rulePadState;
        if (this.ruleIndex >= 0) {
            let rules = this.props.rules.filter(rule => rule.index === this.ruleIndex)
            if (rules.length === 1)
                ruleState = rules[0].rulePanelState;
        }
        ruleState = this.applyTasks(jobs, ruleState);
        this.props.onChangeRuleState(this.ruleIndex, ruleState);
    }

    applyTasks(tasks, ruleState) {
        // general function for adding and removing extra fields
        let processFunc = (array, job) => {
            // for "body" value should be in form of `body,${index}`
            let childGroup = job["value"].startsWith("body") ? "body" : job["value"];

            let filterFunction = (array, id) => {
                if (array.guiElements[id].activeElement)
                    return true;
                delete array.guiElements[id];

                // if the newly removed element is a selected element, un-select it
                if (array.guiTree.selectedElementID === id)
                    array.guiTree.selectedElementID = "";

                return false;
            };

            let childrenGroup = array.guiTree[job["elementId"]].children[childGroup];
            if (job["value"].startsWith("body")) childrenGroup = array.guiTree[job["elementId"]].children[childGroup][+(job["value"].split(",")[1])];

            let newElementConditionName = array.guiElements[childrenGroup[0]].conditionName;
            if (job["task"] === "REMOVE_EXTRA") {
                // remove all inactive elements
                if (job["value"].startsWith("body"))
                    array.guiTree[job["elementId"]].children[childGroup][+(job["value"].split(",")[1])] =
                        array.guiTree[job["elementId"]].children[childGroup][+(job["value"].split(",")[1])].filter((id) => filterFunction(array, id));
                else
                    array.guiTree[job["elementId"]].children[childGroup] =
                        array.guiTree[job["elementId"]].children[childGroup].filter((id) => filterFunction(array, id));
            }
            let newElementId = Math.floor(new Date().getTime() / 10).toString();
            let newElementsData = generateTreeForElement(newElementConditionName, newElementId, job["elementId"]);
            // updating the existing tree
            if (job["value"].startsWith("body"))
                array.guiTree[job["elementId"]].children[childGroup][+(job["value"].split(",")[1])].push(newElementId);
            else
                array.guiTree[job["elementId"]].children[childGroup].push(newElementId);
            // adding new trees
            newElementsData.trees.forEach(tree => array.guiTree[tree.id] = tree.node);
            // adding new elements
            newElementsData.elements.forEach(elem => array.guiElements[elem.id] = elem.node);

            return array;
        };

        // search in parent children and remove elementId
        // toBeDeletedIDs=[] to be removed from ...graphicalEditorState.${group}.guiElements and ....graphicalEditorState["quantifier/constraint"]
        // build a stack=[elementId] for going through tree of elementId
        // while stack.size()>0
        //  pop one newId, add it to storeIDs
        //  add ids of children of the popped id tree to the stack
        // delete toBeDeletedIDs from ...graphicalEditorState.${group}.guiElements and ....graphicalEditorState["quantifier/constraint"]
        let processRemoveElement = (array, job) => {
            let parentTree = array.guiTree[job["value"]["parentId"]];
            Object.keys(parentTree.children).forEach(childGroup => {
                if (childGroup !== "body")
                    array.guiTree[job["value"]["parentId"]].children[childGroup] = parentTree.children[childGroup].filter(elemId => elemId !== job["elementId"]);
                else
                    array.guiTree[job["value"]["parentId"]].children["body"] = parentTree.children["body"].map(subGroup => {
                        return subGroup.filter(elemId => elemId !== job["elementId"])
                    });
            });

            let stackIDs = [job["elementId"]];
            while (stackIDs.length > 0) {
                let tempId = stackIDs.pop();

                let tempTree = array.guiTree[tempId];
                let childrenIds = [];

                Object.keys(tempTree.children).forEach(childGroup => {
                    if (childGroup !== "body") childrenIds = childrenIds.concat(tempTree.children[childGroup]);
                    else
                        tempTree.children["body"].forEach(subGroup => {
                            childrenIds = childrenIds.concat(subGroup)
                        });
                });
                stackIDs = stackIDs.concat(childrenIds);
            }

            stackIDs.forEach(elemId => {
                delete array.guiElements[elemId];
                delete array.guiTree[elemId];

                // if the newly removed element is a selected element, un-select it
                if (array.guiTree.selectedElementID === elemId)
                    array.guiTree.selectedElementID = "";
            });

            return array;
        };

        let processSelectElement = (array, job) => {
            let oldSelectedElementId = array.guiTree.selectedElementID;
            // if selectedElement exists update its state as well
            if (array.guiElements.hasOwnProperty(oldSelectedElementId))
                array.guiElements[oldSelectedElementId] = {
                    ...array.guiElements[oldSelectedElementId],
                    selectedElement: !job["value"]
                };
            array.guiTree.selectedElementID = job["elementId"];
            if (array.guiElements.hasOwnProperty(job["elementId"]))
                array.guiElements[job["elementId"]] = {
                    ...array.guiElements[job["elementId"]],
                    selectedElement: job["value"]
                };
            return array;
        };
        tasks.forEach(job => {
            switch (job["task"]) {
                // job = {elementId: "", task: "", value: `${childGroupName}`}
                case "ADD_EXTRA":
                case "REMOVE_EXTRA":
                    ruleState.graphicalEditorState = processFunc(ruleState.graphicalEditorState, job);
                    break;

                // job = {elementId: "", task: "UPDATE_ELEMENT", value: {props: newValues}}
                case "UPDATE_ELEMENT":
                    ruleState.graphicalEditorState.guiElements[job["elementId"]] = {
                        ...ruleState.graphicalEditorState.guiElements[job["elementId"]],
                        ...job["value"]
                    };
                    break;

                // job = {elementId: "", task: "REMOVE_ELEMENT", value: {parentId: ""}}
                case "REMOVE_ELEMENT":
                    ruleState.graphicalEditorState = processRemoveElement(ruleState.graphicalEditorState, job);
                    break;

                // job = {elementId: "", task: "SELECT_ELEMENT", value: true/false}
                case "SELECT_ELEMENT":
                    ruleState.graphicalEditorState = processSelectElement(ruleState.graphicalEditorState, job);
                    break;

                default:
                    break;
            }
        });
        return ruleState
    }
}

/**
 * create tree from GUI nodes
 * @param guiTree
 * @param guiElements
 * @param nodeId
 * @param group {"quantifier"|"constraint"}
 * @param forMiningRules
 * @return {any}
 */
export function buildFromGUI (guiTree, guiElements, nodeId, group="quantifier",
                              forMiningRules=false) {
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
                guiTree[nodeId].children["body"].forEach((subGroup) => {
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
                    if (forMiningRules && shouldIgnoreInfrequent(guiElements[childId])) return;
                    let newSubTree = buildTreeFromNodeId(childId, group);
                    if (newSubTree) nodeChildren[childGroup].push(newSubTree);
                });
            else
                guiTree[nodeId].children["body"].forEach((subGroup) => {
                    subGroup.forEach(childId => {
                        if (visitedNodeId.indexOf(childId) !== -1) return;
                        if (childId === "" || !guiElements[childId].activeElement) return;
                        if (guiElements[childId].isConstraint && group === "quantifier") return;
                        if (forMiningRules && shouldIgnoreInfrequent(guiElements[childId])) return;
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

    return buildBottomUpTreeFromNodeId(nodeId, group);
}

/**
 * traverse the children of a node to generate grammar text
 * @param rootNode
 * @param constraintQuery
 * @return {Array} of objects {text: "", id: ""}
 */
export function buildTrivialGrammar(rootNode, constraintQuery = false) {
    let grammarObject = []; // {text: "", id: ""}

    // element name
    if (!constraintQuery) {
        if (!skip_words_from_TE.includes(rootNode["properties"].elementGrammar))
            rootNode["properties"].elementGrammar.split(" ").forEach(part =>
                grammarObject.push({text: part, id: rootNode.nodeId}));
    }

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
        grammarObject = grammarObject.concat(buildTrivialGrammar(allChildren[i]));
        if (i < allChildren.length - 1) grammarObject.push({text: "and", id: ""});
    }
    if (allChildren.length > 1 && !constraintQuery) grammarObject.push({text: ")", id: ""});

    // parent
    if (Object.entries(rootNode.parentNode).length !== 0 && !constraintQuery) {
        grammarObject.push({text: "of", id: ""});
        grammarObject = grammarObject.concat(buildTrivialGrammar(rootNode.parentNode))
    }

    return grammarObject;
}

function mapStateToProps(state) {
    return {
        rules: state.ruleTable,
        ws: state.ws,

        rulePadState: state.rulePadState,
        guiTree: state.rulePadState.graphicalEditorState.guiTree,
        guiElements: state.rulePadState.graphicalEditorState.guiElements,
        autoCompleteArray: state.rulePadState.autoCompleteArray,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onChangeRuleState: (ruleIndex, ruleState) => dispatch(changeRuleState(ruleIndex, ruleState)),
        onChangeAutoCompleteTextFromGUI: (ruleIndex, newAutoCompleteArray) => dispatch(changeAutoCompleteTextFromGUI(ruleIndex, newAutoCompleteArray))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphicalEditor);
