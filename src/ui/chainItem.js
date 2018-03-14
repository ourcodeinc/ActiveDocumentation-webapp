/**
 * Created by saharmehrpour on 2/23/18.
 */

import React from 'react';
import '../App.css';

import {FormControl, ControlLabel, FormGroup, DropdownButton, MenuItem, Col, Row} from 'react-bootstrap'; //FormControl, HelpBlock,
import {constants} from './constants';


class ChainItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            item: props['constraintData']
        };

    }

    render() {

        console.log(constants.srcMLdata[this.state.item.key].constraints);

        return (
            <div className={"ruleGroupDiv"}>
                <FormGroup controlId="formBasicText">
                    <Row>
                        <Col xs={2}>
                            <ControlLabel>{this.state.item.key}</ControlLabel><br/>
                        </Col>
                        <Col xs={10}>
                            <div>
                                {this.state.item.constraints.map((cons, index) => {
                                    return (
                                        <div key={index}>
                                            <DropdownButton title={cons.title} id="dropdown-size-medium">
                                                {Object.keys(constants.srcMLdata[this.state.item.key].constraints).map((key, i) => {
                                                    return (
                                                        <MenuItem eventKey={key} key={i}
                                                                  onSelect={(evt) => this.updateMenuItem(evt, cons)}
                                                        >{constants.srcMLdata[this.state.item.key]["constraints"][key].name}
                                                        </MenuItem>);
                                                })}
                                            </DropdownButton>
                                            {this.renderConstraint(cons)}
                                        </div>);
                                })}
                                <div key={-1}>
                                    <DropdownButton title={constants.default_data[this.state.item.key].title}
                                                    id="dropdown-size-medium">
                                        {Object.keys(constants.srcMLdata[this.state.item.key].constraints).map((key, i) => {
                                            return (
                                                <MenuItem eventKey={key} key={i}
                                                          onSelect={(evt) => this.addMenuItem(evt)}>
                                                    {constants.srcMLdata[this.state.item.key]["constraints"][key].name}
                                                </MenuItem>);
                                        })}
                                    </DropdownButton>
                                    <ControlLabel>{constants.default_data[this.state.item.key].value}</ControlLabel>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </FormGroup>
            </div>
        );
    }


    renderConstraint(cons) {
        let consType = constants.srcMLdata[this.state.item.key]["constraints"][cons.id].type;

        if (consType === "text")
            return (
                <FormControl
                    type="text"
                    value={cons.value}
                    placeholder="Enter text"
                    onChange={(e) => {
                        cons.value = e.target.value;
                        this.setState({item: this.state.item})
                    }}
                />
            );
        if (consType === "")
            return;
        cons.value = {key: consType, constraints: []};
        return (<ChainItem constraintData={cons.value} callbackFromParent={this.props["callbackFromParent"]}/>);
    }

    /**
     * add a new constraint
     * @param evt
     */
    addMenuItem(evt) {
        this.state.item.constraints.push({
            title: constants.srcMLdata[this.state.item.key]["constraints"][evt].name,
            value: constants.srcMLdata[this.state.item.key]["constraints"][evt].xpath,
            id: evt
        });

        this.props["callbackFromParent"](evt);

        this.setState({list: this.state.list});
    }

    /**
     * update the existing constraint
     * @param evt
     * @param cons
     */
    updateMenuItem(evt, cons) {
        cons.title = constants.srcMLdata[this.state.item.key]["constraints"][evt].name;
        cons.value = constants.srcMLdata[this.state.item.key]["constraints"][evt].xpath;
        cons.id = evt;

        this.setState({list: this.state.list});
    }

}

export default ChainItem;
