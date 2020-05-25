/**
 * Created by saharmehrpour on 9/7/17.
 */


import React, {Component} from "react";
import {MdSave} from "react-icons/lib/md/index";
import ReactToolTip from "react-tooltip";

import "../../App.css";


import {SplitButton, MenuItem, Button} from "react-bootstrap";


export class ProjectHierarchy extends Component {

    constructor(props) {
        super(props);

        this.state = {dropDowns: [{itemData: props.projectHierarchy}]};
    }

    render() {
        return (
            <div>
                <div style={{display: "inline-block", paddingRight: "15px", marginLeft: "3px"}} data-tip={"React-tooltip"} data-for={"save"}>
                    <MdSave size={20} className={"MdSave"}
                             onClick={() => {
                                 let newPath = [];
                                 this.state.dropDowns.forEach(item => {
                                     item.itemData["properties"]["fileName"] ?
                                         newPath.push(item.itemData["properties"]["fileName"]) :
                                         newPath.push(item.itemData["properties"]["name"])
                                 });
                                 this.props["onSubmit"](newPath.join("/"));
                                 this.setState({dropDowns: [{itemData: this.props.projectHierarchy}]})
                             }}/>

                </div>
                <ReactToolTip place={"top"} type={"dark"} effect={"solid"} id={"save"} delayShow={300}>
                    <span>{"Specify folders/files on which the rule is applied on."}</span>
                </ReactToolTip>
                <div style={{display: "inline-block", verticalAlign: "middle"}}>
                    {this.renderDropDowns()}
                </div>
            </div>
        )
    }

    renderDropDowns() {
        return this.state.dropDowns.map((myData, i) => {
            let title = myData["itemData"]["properties"]["fileName"] ? myData["itemData"]["properties"]["fileName"] : myData["itemData"]["properties"]["name"];
            if (myData["itemData"].hasOwnProperty("children"))
                return (
                    <div key={i} style={{float: "left"}}>
                        <SplitButton bsStyle={"default"}
                                     title={title}
                                     id={"hierarchy"}
                                     onSelect={(evt) => this.updateDropDownList(evt)}
                                     onClick={() => {
                                         this.updateDropDownList(myData["itemData"]["properties"]["canonicalPath"])
                                     }}>

                            {/* filter directory state_children */}
                            {myData["itemData"]["children"]
                                .filter((d) => {
                                    return d["properties"]["isDirectory"]
                                })
                                .map((child, i) => {
                                    return (
                                        <MenuItem
                                            eventKey={child["properties"]["canonicalPath"]}
                                            key={i}>{child["properties"]["name"]}</MenuItem>
                                    )
                                })}

                            <MenuItem divider/>

                            {/* filter normal file state_children */}
                            {myData["itemData"]["children"]
                                .filter((d) => {
                                    return !d["properties"]["isDirectory"]
                                })
                                .map((child, i) => {
                                    return (
                                        <MenuItem
                                            eventKey={child["properties"]["canonicalPath"]}
                                            key={i}>{child["properties"]["fileName"] ? child["properties"]["fileName"] : child["properties"]["name"]}</MenuItem>
                                    )
                                })}
                        </SplitButton>
                    </div>
                );
            else
                return (
                    <div key={i} style={{float: "left"}}>
                        <Button onClick={() => {
                            this.dropDownOnSelect(myData["data"]["properties"]["canonicalPath"])
                        }}>
                            {title}
                        </Button>
                    </div>
                );

        })

    }

    /**
     * update the array for keeping the name of selected elements in drop-downs
     * @param canonicalPath: canonicalPath of the selected item
     */
    updateDropDownList(canonicalPath) {
        let parent = canonicalPath.slice(0);
        parent = parent.substring(0, parent.lastIndexOf("/"));

        // find the node of the parent
        let indexToKeep = 0;
        this.state.dropDowns.forEach((d, i) => {
            if (d["itemData"]["properties"]["canonicalPath"] === parent) indexToKeep = i;
        });

        // remove i+1 to end
        let clonedArray = this.state.dropDowns.slice(0);
        while (indexToKeep < clonedArray.length - 1)
            clonedArray.splice(indexToKeep + 1, clonedArray.length - indexToKeep - 1);

        // find the node of the new selection among state_children of the parent
        let newData = this.state.dropDowns[indexToKeep]["itemData"]["children"].filter((d, i) => d["properties"]["canonicalPath"] === canonicalPath);
        if (newData.length > 0)
            clonedArray.push({itemData: newData[0]});

        this.setState({dropDowns: clonedArray});
    }


    /**
     * onSelect method
     * @param evt: eventKey in MenuItem
     */
    dropDownOnSelect(evt) {
        let nameParent = evt.split(",");
        if (nameParent.length > 1)
            this.updateDropDownList(nameParent[0], nameParent[1]);
    }


}


export default ProjectHierarchy;