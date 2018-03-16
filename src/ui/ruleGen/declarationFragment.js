/**
 * Created by saharmehrpour on 3/13/18.
 */

import React from 'react';
import '../../App.css';

import {FormControl} from 'react-bootstrap';

// import {constants} from '../constants';


class DeclarationFragment extends React.Component {

    constructor(props) {
        super(props);

        this.xpath = {
            "root": props["root"],
            "xpathConstraint": [],
            "xpathFollows": "",
            "xpathFollowNodes": ""
        };

        this.state = {
            "target": props["target"],
            "value": "",
            "follows": []
        }

    }

    render() {
        return (
            <div className={(this.state.target === "") ? "" : "ruleGroupDiv " + this.state.target}>
                {/*<div style={{marginTop: "10px"}}><em>Declaration</em></div>*/}
                <FormControl type="text" value={this.state["value"]}
                             placeholder="Declaration"
                             onChange={(e) => {
                                 this.setState({"value": e.target.value});
                             }}/>
            </div>
        )
    }


    /**
     * compile and prepare the xpath
     */
    prepareXpath() {

        // TODO
        this.sendDataBack();
    }


    /**
     * send the xpath data to the parent node
     */
    sendDataBack() {

        let cons = this.xpath.xpathConstraint.join(' and ');

        let xpathData = this.xpath.root;
        xpathData = (cons === "") ? xpathData : xpathData + "[" + cons + "]";
        xpathData = (this.xpath.xpathFollows === "") ? xpathData : xpathData + "/" + this.xpath.xpathFollows;
        xpathData = xpathData + this.xpath.xpathFollowNodes;

        if (this.props["isConstraint"])
            this.props["callbackFromParent"](xpathData, this.props["constraintIndices"]);
        else
            this.props["callbackFromParent"](xpathData);

    }


}

export default DeclarationFragment;
