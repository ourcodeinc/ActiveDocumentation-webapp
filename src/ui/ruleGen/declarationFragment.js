/**
 * Created by saharmehrpour on 3/13/18.
 */

import React from 'react';
import '../../App.css';

import {DropdownButton, FormControl, MenuItem} from 'react-bootstrap';
import {constants} from '../constants';


class DeclarationFragment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            "target": props["target"],
            "value": "",
            "follows": []
        }

    }

    render() {
        return (
            <div className={"ruleGroupDiv " + this.state.target}>
                <div style={{marginTop: "10px"}}><em>Declaration</em></div>
                {this.renderDeclaration()}
                {/*{this.renderFollows()}*/}
            </div>
        )
    }


    /**
     * render the 'follows' elements and constraints, drop down or a component
     */
    renderFollows() {
        if (this.state["follows"].length === 0)
            return (
                <div>
                    {constants.code_fragment["declaration"]["follows"].map((elem, index) => {
                        return (
                            <DropdownButton title={`follows`} id="dropdown-size-medium"
                                            key={index} className={this.state.target}>
                                {Object.keys(elem).map((key, i) => {
                                    return (
                                        <MenuItem eventKey={key} key={i}
                                                  onSelect={(evt) => {

                                                  }}
                                        >{elem[key].name}
                                        </MenuItem>);
                                })}
                            </DropdownButton>
                        )
                    })}
                </div>
            );

        else {
            console.log(this.state["follows"][0]);

        }
    }


    renderDeclaration() {
        return (
            <FormControl type="text" value={this.state["value"]}
                         placeholder="Enter text"
                         onChange={(e) => {
                             this.setState({"value": e.target.value});
                         }}/>
        );
    }


}

export default DeclarationFragment;
