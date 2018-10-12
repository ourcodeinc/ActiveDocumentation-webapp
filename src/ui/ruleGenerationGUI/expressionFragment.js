/**
 * Created by saharmehrpour on 3/13/18.
 */

import React from 'react';

import {Row} from 'react-bootstrap';
import TiDelete from 'react-icons/lib/ti/delete';

import {GuiConstants} from './guiConstants';
import SrcMLFragment from "./srcMLFragment";
import CallFragment from "./chainCallFragment";
import {CustomAddDropDown} from "./customAddDropdown";

class ExpressionFragment extends React.Component {


    constructor(props) {
        super(props);

        this.ws = props["ws"];
        this.state = props["state"];
    }

    render() {
        return (
            <div id={this.props["assignedId"]}
                 className={(this.state.target === "") ? "divBorder" : "ruleGroupDiv " + this.state.target}>
                {(this.props["removeFunction"]) ?
                    <div className={"innerRemoveIcon"}>
                        <TiDelete size={25}
                                  className={"tiDelete"}
                                  onClick={() => this.props["removeFunction"]()}/>
                    </div> : ""}
                <Row style={{margin: "0"}}>
                    <div className={"rowItem"}>
                        {this.renderGroup("before")}
                    </div>
                    <div className={"rowItem inlineText"}><b>=</b></div>
                    <div className={"rowItem"}>
                        {this.renderGroup("after")}
                    </div>
                </Row>
            </div>
        )
    }

    /**
     * send the xpath data to the parent node
     */
    sendDataBack = () => {
        this.props["callbackFromParent"]();
    };

    /**
     * render groups: top, before, after, within
     */
    renderGroup(group) {
        return (
            <div className={"rowItem"} id={`${this.props["assignedId"]}-${group}`}>
                {this.state.children[group].map((cons, i) => {
                    return (
                        <div className={"rowItem"} key={i}>
                            {(GuiConstants.code_fragment["expression"][group][cons["key"]]["pre"] === "") ? "" :
                                <div className={"rowItem inlineText"}>
                                    <b>{GuiConstants.code_fragment["expression"][group][cons["key"]]["pre"]}</b>
                                </div>
                            }
                            <div className={group === "within" ? "" : "rowItem"}>
                                {this.switchMethod(group, i, cons)}
                            </div>
                            {(GuiConstants.code_fragment["expression"][group][cons["key"]]["post"] === "") ? "" :
                                <div className={group === "within" ? "inlineText" : "rowItem inlineText"}>
                                    <b>{GuiConstants.code_fragment["expression"][group][cons["key"]]["post"]}</b>
                                </div>
                            }
                        </div>
                    )
                })}

                {(() => {
                    if (this.state.children[group].length === 0) return (
                        <CustomAddDropDown
                            menuItemsText={Object.keys(GuiConstants.code_fragment["expression"][group]).map(key => GuiConstants.code_fragment["expression"][group][key].name)}
                            menuItemsEvent={Object.keys(GuiConstants.code_fragment["expression"][group]).map(key => key)}
                            onSelectFunction={(evt) => {
                                this.state.children[group].push({
                                    key: evt,
                                    value: GuiConstants.code_fragment["expression"][group][evt],
                                    target: "",
                                    children: JSON.parse(JSON.stringify(GuiConstants.state_children)),
                                    xpath: GuiConstants.code_fragment["expression"][group][evt]["xpath"]
                                });
                                this.sendDataBack();
                                this.forceUpdate();
                            }}/>)
                })()}
            </div>
        )
    }


    /**
     * switch method for rendering within constraints
     * @param group
     * @param i index of each constraint object
     * @param cons
     * @returns {XML}
     */
    switchMethod(group, i, cons) {
        let type = this.state.children[group][i].value.type;
        let removeFunction = () => {
            const children = this.state.children;
            children[group].splice(i, 1);
            this.setState({children});
            this.sendDataBack();
        };
        switch (type) {
            case "chainCall":
                return (<CallFragment ws={this.ws} state={this.state.children[group][i]}
                                      assignedId={this.props["assignedId"] + "_call"}
                                      callbackFromParent={this.sendDataBack}
                                      removeFunction={removeFunction}/>);
            case "srcml":
                return (
                    <SrcMLFragment ws={this.ws} state={this.state.children[group][i]} placeholder={"Name or Literal"}
                                   assignedId={this.props["assignedId"] + "_name_" + group + "_" + i}
                                   callbackFromParent={this.sendDataBack}
                                   removeFunction={removeFunction}/>);
            default:
                return (<div/>);
        }
    }

}

export default ExpressionFragment;
