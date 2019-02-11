/**
 * Created by saharmehrpour on 2/23/18.
 */

import React, {Component, Fragment} from 'react';
import '../../App.css';
// import ReactTooltip from 'react-tooltip'

// import {Tabs, Tab, HelpBlock} from 'react-bootstrap';
import {connect} from "react-redux";
// import {FaQuestionCircle} from "react-icons/lib/fa/index";
import FaCheckCircle from 'react-icons/lib/fa/check-circle';
import FaConnectdevelop from 'react-icons/lib/fa/connectdevelop';
import MdStar from 'react-icons/lib/md/star';

import GuiComponent from "./guiComponent";
import {changeAutoCompleteTextFromGUI, changeGuiElement} from "../../actions";
import {getConditionByName} from "./guiConstants";


class RuleGeneratorGui extends Component {

    constructor(props) {
        super(props);

        this.ruleIndex = props.ruleIndex;

        // new rule
        this.state = {
            ws: props.ws,

            guiTree: props.guiTree,
            guiElements: props.guiElements,

            GuiGrammar: "",

            // local states
            activatedElements: false,
            connectedElements: false,
            selectedOneElement: false
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
            }
        }

    }

    render() {
        return (
            <Fragment>
                <div style={{clear: "both"}}>
                    <div style={{padding: "5px", float: "left"}}>
                        <FaCheckCircle size={20}
                                       className={"FaCheckCircle " + (this.state.activatedElements ? "has-success" : "has-error")}/>
                    </div>
                    <div style={{padding: "5px", float: "left"}}>
                        <FaConnectdevelop size={20}
                                          className={"FaConnectdevelop " + (this.state.connectedElements ? "has-success" : "has-error")}/>
                    </div>
                    <div style={{padding: "5px", float: "left"}}>
                        <MdStar size={20}
                                className={"MdStar " + (this.state.selectedOneElement ? "has-success" : "has-error")}/>
                    </div>
                </div>
                <div style={{clear: "both", marginTop: "20px"}} className={this.class}>
                    <div style={{marginTop: "10px", backgroundColor: "#FFF"}}>
                        <GuiComponent key={new Date()} ruleIndex={this.ruleIndex} elementId={"0"}
                                      rootTree={this.state.guiTree}
                                      guiElements={this.state.guiElements}
                                      onChangeGuiElement={(ruleIndex, jobs) => this.props.onChangeGuiElement(ruleIndex, jobs)}
                        />
                    </div>
                </div>
            </Fragment>
        );
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps, () => {
            // this.receiveStateData(nextProps);
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
        // this.receiveStateData(this.props);
        this.newReceiveStateData();
    }

    //
    // buildTreeForProcessing(nextProps, group) {
    //
    //     let guiElements = group === "quantifier" ? nextProps.quantifierGuiElements : nextProps.constraintGuiElements;
    //     let tree = group === "quantifier" ? nextProps.quantifierTree : nextProps.constraintTree;
    //
    //     if (!tree.selectedElementID || tree.selectedElementID === "" ||
    //         !guiElements[tree.selectedElementID].activeElement) {
    //         console.log("No element is selected as target.");
    //         return;
    //     }
    //
    //     // filter active element ids
    //     let activeIDs = Object.keys(tree).filter(elementId =>
    //         guiElements[elementId] && guiElements[elementId].activeElement
    //     );
    //
    //     let root = activeIDs.filter(elem_id => activeIDs.indexOf(tree[elem_id].parentId) === -1);
    //     if (root.length === 0) console.log("Activate at least one element.");
    //     if (root.length > 1) console.log("Connect elements.");
    //     if (root.length !== 1) return;
    //
    //
    //     let visitedNodeId = [];
    //
    //     let buildTreeFromNodeId = (nodeId) => {
    //         visitedNodeId.push(nodeId);
    //
    //         let nodeChildren = {};
    //         Object.keys(tree[nodeId].children).forEach(childGroup => {
    //             nodeChildren[childGroup] = [];
    //             if (childGroup !== "body")
    //                 tree[nodeId].children[childGroup].forEach(childId => {
    //                     if (visitedNodeId.indexOf(childId) !== -1) return;
    //                     if (childId === "" || !guiElements[childId].activeElement) return;
    //                     nodeChildren[childGroup].push(buildTreeFromNodeId(childId));
    //                 });
    //             else
    //                 tree[nodeId].children["body"].forEach((subGroup, i) => {
    //                     nodeChildren["body"].push([]);
    //                     subGroup.forEach(childId => {
    //                         if (visitedNodeId.indexOf(childId) !== -1) return;
    //                         if (childId === "" || !guiElements[childId].activeElement) return;
    //                         nodeChildren["body"][i].push(buildTreeFromNodeId(childId));
    //                     })
    //                 })
    //         });
    //
    //         return {
    //             nodeId: nodeId,
    //             properties: {
    //                 ...guiElements[nodeId],
    //                 elementGrammar: getConditionByName(guiElements[nodeId].conditionName).grammar,
    //             },
    //             parentNode: {},
    //             children: nodeChildren
    //         };
    //
    //     };
    //
    //     let buildBottomUpTreeFromNodeId = (nodeId) => {
    //         if (nodeId === "" || !guiElements[nodeId].activeElement) return {};
    //         visitedNodeId.push(nodeId);
    //
    //         let nodeChildren = {};
    //         Object.keys(tree[nodeId].children).forEach(childGroup => {
    //             nodeChildren[childGroup] = [];
    //             if (childGroup !== "body")
    //                 tree[nodeId].children[childGroup].forEach(childId => {
    //                     if (visitedNodeId.indexOf(childId) !== -1) return;
    //                     if (childId === "" || !guiElements[childId].activeElement) return;
    //                     nodeChildren[childGroup].push(buildTreeFromNodeId(childId));
    //                 });
    //             else
    //                 tree[nodeId].children["body"].forEach(subGroup => {
    //                     nodeChildren["body"].push();
    //                     subGroup.forEach(childId => {
    //                         if (visitedNodeId.indexOf(childId) !== -1) return;
    //                         if (childId === "" || !guiElements[childId].activeElement) return;
    //                         nodeChildren["body"].push(buildTreeFromNodeId(childId));
    //                     })
    //                 })
    //         });
    //
    //         return {
    //             nodeId: nodeId,
    //             properties: {
    //                 ...guiElements[nodeId],
    //                 elementGrammar: getConditionByName(guiElements[nodeId].conditionName).grammar,
    //             },
    //             parentNode: buildBottomUpTreeFromNodeId(tree[nodeId].parentId),
    //             children: nodeChildren
    //         };
    //     };
    //
    //     // reach root from selectedElementID
    //     return buildBottomUpTreeFromNodeId(tree.selectedElementID);
    // }
    //
    // /**
    //  * receive state data from the child nodes
    //  */
    // receiveStateData = (nextProps) => {
    //     let tree1 = this.buildTreeForProcessing(nextProps, "quantifier");
    //     let tree2 = this.buildTreeForProcessing(nextProps, "constraint");
    //
    //     if (!tree1 || !tree2) {
    //         // console.log(tree1, tree2);
    //         // console.log("Tree is not built yet.");
    //         return;
    //     }
    //
    //     let nodeQ = JSON.parse(JSON.stringify(tree1));
    //     let nodeC = JSON.parse(JSON.stringify(tree2));
    //
    //     if (nodeQ["properties"].conditionName !== nodeC["properties"].conditionName) {
    //         this.setState({GuiGrammar: "not equal target: " + nodeQ["properties"].conditionName + " , " + nodeC["properties"].conditionName});
    //         return;
    //     }
    //
    //     /*
    //      * check if two gui nodes are equal (same children and key)
    //      */
    //     function equalObject(obj1, obj2) {
    //         let object1 = JSON.parse(JSON.stringify(obj1));
    //         let object2 = JSON.parse(JSON.stringify(obj2));
    //         if (Object.entries(object1).length === 0 && Object.entries(object2).length === 0) return true;
    //         if (Object.entries(object1).length === 0 || Object.entries(object2).length === 0) return false;
    //
    //         if (object1["properties"].conditionName !== object2["properties"].conditionName) return false;
    //
    //         Object.keys(object1.children).forEach(childGroup => {
    //             if (object1.children[childGroup].length !== object2.children[childGroup].length) return false;
    //             else {
    //                 object1.children[childGroup].sort((a, b) => a["properties"].conditionName > b["properties"].conditionName ? 1 : a["properties"].conditionName < b["properties"].conditionName ? -1 : 0);
    //                 object2.children[childGroup].sort((a, b) => a["properties"].conditionName > b["properties"].conditionName ? 1 : a["properties"].conditionName < b["properties"].conditionName ? -1 : 0);
    //                 for (let i = 0; i < object1.children[childGroup].length; i++)
    //                     if (!equalObject(object1.children[childGroup][i], object2.children[childGroup][i])) return false
    //             }
    //         });
    //
    //         if (object1.properties.text) return object1.properties.text === object2.properties.text;
    //         if (object1.properties.value) return object1.properties.value === object2.properties.value;
    //         return true;
    //     }
    //
    //     /*
    //      * check if the main path of the query is the same and detect the type of the rule: "MustEqualTo" or "Must"
    //      * returns either "MustEqualTo" or the array of {group: "", element: {GUI node}} when the type is "Must"
    //      */
    //     function equalMainPath(obj1, obj2) {
    //         let object1 = JSON.parse(JSON.stringify(obj1));
    //         let object2 = JSON.parse(JSON.stringify(obj2));
    //
    //         if (!equalObject(object1.parentNode, object2.parentNode)) return "MustBeEqualTo";
    //
    //         let sortChildren = (a, b) => {
    //             if (!a["properties"].text && !b["properties"].text)
    //                 return a["properties"].conditionName > b["properties"].conditionName ? 1
    //                     : a["properties"].conditionName < b["properties"].conditionName ? -1
    //                         : 0;
    //             if (!a["properties"].text) return -1;
    //             if (!b["properties"].text) return 1;
    //             return a["properties"].text > b["properties"].text ? 1
    //                 : a["properties"].text < b["properties"].text ? -1
    //                     : 0;
    //         };
    //
    //         let addedConstraintIndex = []; // list of added constraints for "Must" case
    //         Object.keys(object1.children).forEach(childGroup => {
    //             if (object1.children[childGroup].length > object2.children[childGroup].length) return "MustBeEqualTo";
    //
    //             object1.children[childGroup].sort(sortChildren);
    //             object2.children[childGroup].sort(sortChildren);
    //
    //             // the index of the child of object2 where the previous child is matched with
    //             // a child from object1. Unmatched children from index 0 to currentIndex2 from
    //             // object2 are the diffs
    //             let currentIndex2 = 0;
    //             let countFound = 0;
    //
    //             for (let i = 0; i < object1.children[childGroup].length; i++) {
    //                 // object2 has no more child to match
    //                 if (currentIndex2 >= object2.children[childGroup].length) return "MustBeEqualTo";
    //                 for (let j = currentIndex2; j < object2.children[childGroup].length; j++) {
    //                     if (equalObject(object1.children[childGroup][i], object2.children[childGroup][j])) {
    //                         currentIndex2++;
    //                         countFound++;
    //                         break;
    //                     }
    //                     addedConstraintIndex.push({
    //                         childGroup: childGroup,
    //                         element: object2.children[childGroup][currentIndex2]
    //                     });
    //                     currentIndex2++;
    //                 }
    //                 // didn't find the matching element
    //                 if (countFound < i + 1) return "MustBeEqualTo";
    //             }
    //             // remaining indices must be added
    //             while (currentIndex2 < object2.children[childGroup].length) {
    //                 addedConstraintIndex.push({
    //                     childGroup: childGroup,
    //                     element: object2.children[childGroup][currentIndex2]
    //                 });
    //                 currentIndex2++;
    //             }
    //         });
    //         return addedConstraintIndex;
    //     }
    //
    //     let result = equalMainPath(nodeQ, nodeC);
    //     console.log("result:", result);
    //
    //     if (result === "MustBeEqualTo") {
    //         let grammarTextQ = this.buildGrammar(tree1);
    //         let grammarTextC = this.buildGrammar(tree2);
    //         console.log(grammarTextQ, "must be equal to", grammarTextC);
    //         this.setState({GuiGrammar: grammarTextQ.map(el => el.text).join(" ") + " must be equal to " + grammarTextC.map(el => el.text).join(" ")});
    //     }
    //     else {
    //         let tempChildren = {};
    //         // initializing the children fields
    //         Object.keys(tree1.children).forEach(childGroup => {
    //             tempChildren[childGroup] = []
    //         });
    //         result.forEach(res => tempChildren[res.childGroup].push(res.element));
    //         // the only differences must be for the leaf 'child'
    //         // so we only consider the leaf child
    //         let tempTree = {...nodeC, children: tempChildren, parentNode: {}};
    //         let grammarTextQ = this.buildGrammar(tree1);
    //         let grammarTextC = this.buildGrammar(tempTree, true);
    //
    //         console.log(grammarTextQ, "must", grammarTextC);
    //
    //         this.setState({GuiGrammar: grammarTextQ.map(el => el.text).join(" ") + " must " + grammarTextC.map(el => el.text).join(" ")});
    //     }
    // };

    newBuildTreeForProcessing = () => {

        let guiElements = JSON.parse(JSON.stringify(this.state.guiElements));
        let guiTree = JSON.parse(JSON.stringify(this.state.guiTree));

        // filter active element ids
        let activeIDs = Object.keys(guiTree).filter(elementId =>
            guiElements[elementId] && guiElements[elementId].activeElement
        );

        let forest = activeIDs.filter(elem_id => activeIDs.indexOf(guiTree[elem_id].parentId) === -1);
        if (forest.length === 0) {
            this.setState({
                activatedElements: false,
                connectedElements: false,
                selectedOneElement: this.state.guiTree.selectedElementID !== ""
            });
            return;
        }
        if (forest.length > 1) {
            this.setState({
                activatedElements: true,
                connectedElements: false,
                selectedOneElement: this.state.guiTree.selectedElementID !== ""
            });
            return;
        }
        if (forest.length !== 1) return;

        if (!guiTree.selectedElementID || guiTree.selectedElementID === "" ||
            !guiElements[guiTree.selectedElementID].activeElement) {
            // todo select a common parent of isConstraint elements from (activeElements && !isConstraint)
            this.setState({
                activatedElements: true,
                connectedElements: true,
                selectedOneElement: this.state.guiTree.selectedElementID !== ""
            });
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

            return {
                nodeId: nodeId,
                properties: {
                    ...guiElements[nodeId],
                    elementGrammar: getConditionByName(guiElements[nodeId].conditionName).grammar,
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


    newReceiveStateData = () => {

        let trees = this.newBuildTreeForProcessing();
        if (!trees) return;

        let quantifierTree = JSON.parse(JSON.stringify(trees.quantifierTree));
        let constraintTree = JSON.parse(JSON.stringify(trees.constraintTree));

        let grammarTextQ = this.buildGrammar(quantifierTree);
        let grammarTextC = this.buildGrammar(constraintTree, true);

        console.log(grammarTextQ, "must", grammarTextC);

        this.setState({
            activatedElements: true,
            connectedElements: true,
            selectedOneElement: true,
            GuiGrammar: grammarTextQ.map(el => el.text).join(" ") + " must " + grammarTextC.map(el => el.text).join(" ")
        }, () => this.props.onChangeAutoCompleteTextFromGUI(this.props.ruleIndex, this.state.GuiGrammar));

    };

    /**
     * traverse the children of a node to generate grammar text
     * @param rootNode
     * @param constraintQuery
     * @return {Array} of objects {text: "", id: ""}
     */
    buildGrammar(rootNode, constraintQuery = false) {
        let grammarObject = []; // {text: "", id: ""}

        // element name
        if (!constraintQuery)
            grammarObject.push({text: rootNode["properties"].elementGrammar, id: rootNode.nodeId});

        // text value
        if (rootNode["properties"].text) {
            grammarObject.push({text: "where equal to", id: ""});
            grammarObject.push({text: "\"" + rootNode["properties"].text + "\"", id: ""}); // todo process rootNode["properties"].text
        }

        // dropdown value
        if (rootNode["properties"].value) {
            grammarObject.push({text: "where equal to", id: ""});
            grammarObject.push({text: "\"" + rootNode["properties"].value + "\"", id: ""});
        }

        //children all children are 1D arrays even "body"
        let allChildren = [];
        Object.keys(rootNode.children).forEach(group => allChildren = allChildren.concat(rootNode.children[group]));
        if (allChildren.length > 0 && !constraintQuery) grammarObject.push({text: "where", id: ""});
        if (allChildren.length > 1 && !constraintQuery) grammarObject.push({text: "(", id: ""});
        for (let i = 0; i < allChildren.length; i++) {
            grammarObject.push({text: "have", id: ""});
            grammarObject = grammarObject.concat(this.buildGrammar(allChildren[i]));
            if (i < allChildren.length - 1) grammarObject.push({text: "and", id: ""});
        }
        if (allChildren.length > 1 && !constraintQuery) grammarObject.push({text: ")", id: ""});

        // parent
        if (Object.entries(rootNode.parentNode).length !== 0 && !constraintQuery) {
            grammarObject.push({text: "of", id: ""});
            grammarObject = grammarObject.concat(this.buildGrammar(rootNode.parentNode))
        }

        return grammarObject;
    }

}

function mapStateToProps(state) {
    return {
        rules: state.ruleTable,
        ws: state.ws,

        guiTree: state.newOrEditRule.guiState.guiTree,
        guiElements: state.newOrEditRule.guiState.guiElements,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onChangeGuiElement: (ruleIndex, jobs) => dispatch(changeGuiElement(ruleIndex, jobs)),
        onChangeAutoCompleteTextFromGUI: (ruleIndex, newText) => dispatch(changeAutoCompleteTextFromGUI(ruleIndex, newText))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RuleGeneratorGui);
