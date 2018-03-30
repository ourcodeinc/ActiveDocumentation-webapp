/**
 * Created by saharmehrpour on 3/13/18.
 */

import React from 'react';
import '../../App.css';

import {Dropdown, MenuItem} from 'react-bootstrap';
import MdAddBox from 'react-icons/lib/md/add-box';
import TiDelete from 'react-icons/lib/ti/delete';

import {constants} from '../constants';

import CustomToggle from "./customToggle";
import CustomMenu from "./customMenu";
import CallFragment from "./callFragment";

class ChainCallFragment extends React.Component {


    constructor(props) {
        super(props);
        // target assignedId ws callbackFromParent isConstraint constraintIndices root

        this.ws = props["ws"];

        this.state = props["state"];
        this.state.text = JSON.parse(JSON.stringify(this.state.children));

    }

    render() {
        return (
            <div id={this.props["assignedId"]}
                 className={(this.state.target === "") ? "rowItem divBorder" : "rowItem ruleGroupDiv " + this.state.target}>
                <div className={"rowGroup"}>
                    <div className={"rowItem"}>{this.renderGroup("before")}</div>
                    {(this.props["removeFunction"]) ?
                        <div className={"removeIcon"}>
                            <TiDelete size={25}
                                      className={"tiDelete"}
                                      onClick={() => this.props["removeFunction"]()}/>
                        </div> : ""}
                </div>
            </div>
        )
    }


    /**
     * render groups: top, before, after, within
     */
    renderGroup(group) {
        return (
            <div className={"rowItem"} id={`${this.props["assignedId"]}-${group}`}>
                {this.state.children[group].map((cons, i) => {
                    return (
                        <div className={"rowItem"} key={i}>
                            {(constants.code_fragment["chainCall"][group][cons["key"]]["pre"] === "") ? "" :
                                <div className={"rowItem inlineText"}>
                                    <b>{constants.code_fragment["chainCall"][group][cons["key"]]["pre"]}</b>
                                </div>
                            }
                            <div className={group === "within" ? "" : "rowItem"}
                                 style={(this.state.children[group][i].value.type === 'text') ? {paddingTop: "5px"} : {}}>
                                {this.switchMethod(group, i, cons)}
                            </div>
                            {(constants.code_fragment["chainCall"][group][cons["key"]]["post"] === "") ? "" :
                                <div className={group === "within" ? "inlineText" : "rowItem inlineText"}>
                                    <b>{constants.code_fragment["chainCall"][group][cons["key"]]["post"]}</b>
                                </div>
                            }
                        </div>
                    )
                })}

                <Dropdown id="dropdown-size-medium">
                    <CustomToggle bsRole="toggle">
                        <MdAddBox size={25} className={"mdAddBox"}/>
                    </CustomToggle>
                    <CustomMenu bsRole="menu">
                        {Object.keys(constants.code_fragment["chainCall"][group]).map((key, i) => {
                            return (
                                <MenuItem eventKey={key} key={i}
                                          onSelect={(evt) => {
                                              this.state.children[group].push({
                                                  key: evt,
                                                  value: constants.code_fragment["chainCall"][group][evt],
                                                  target: "",
                                                  children: JSON.parse(JSON.stringify(constants.state_children)),
                                                  xpath: constants.code_fragment["chainCall"][group][evt]["xpath"]
                                              });
                                              this.sendDataBack();
                                              this.forceUpdate();
                                          }}
                                >{constants.code_fragment["chainCall"][group][key].name}
                                </MenuItem>);
                        })}
                    </CustomMenu>
                </Dropdown>

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
            case "call":
                return (<CallFragment ws={this.ws} state={this.state.children[group][i]}
                                      assignedId={this.props["assignedId"] + "_call_" + i}
                                      callbackFromParent={this.sendDataBack}
                                      removeFunction={removeFunction}/>);
            default:
                return (<div/>)

        }
    }

    /**
     * send the xpath data to the parent node
     */
    sendDataBack = () => {
        this.props["callbackFromParent"]();
    };

    /**
     * update the text of constraints
     * @param group
     * @param i
     */
    updateXpathText(group, i) {
        const children = this.state.children;
        children[group][i].xpath = this.state.children[group][i].value["xpath"].replace('<NAME>', this.state.children[group][i].text);
        this.setState({children});
        this.sendDataBack();
    }

    /**
     * update the text of constraints
     * @param group
     * @param i
     */
    updateXpathNumber(group, i) {
        const children = this.state.children;
        children[group][i].xpath = this.state.children[group][i].value["xpath"].replace('<COUNT>', this.state.children[group][i].text);
        this.setState({children});
        this.sendDataBack();
    }

}

export default ChainCallFragment;
