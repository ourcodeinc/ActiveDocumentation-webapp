/**
 * Created by saharmehrpour on 3/13/18.
 */

import React from 'react';
import '../../App.css';

import {FormControl, Row, Button} from 'react-bootstrap';
import Utilities from "../../core/utilities";

import * as d3 from "d3";
import PubSub from 'pubsub-js';


class DeclarationFragment extends React.Component {

    constructor(props) {
        super(props);
        // target assignedId ws callbackFromParent isConstraint constraintIndices root

        this.ws = props["ws"];

        this.state = props["state"];
        this.state.text = "";

        this.attachListener();
    }

    render() {
        return (
            <div id={this.props["assignedId"]}
                 className={(this.state.target === "") ? "" : "ruleGroupDiv " + this.state.target}>
                <Row style={{margin: "0"}}>
                    <div className={"rowItem"}>
                        <FormControl type="text" value={this.state.text}
                                     placeholder="Declaration"
                                     onChange={(e) => {
                                         this.setState({"text": e.target.value});
                                     }}/>
                    </div>
                    <div className={"rowItem"}>
                        <Button bsSize="small" onClick={() => this.requestXML()}>Confirm Declaration</Button>
                    </div>
                </Row>
            </div>
        )
    }

    /**
     * subscribe for events
     */
    attachListener() {

        // [expr xml]
        PubSub.subscribe('DECL_STMT_XML', (msg, data) => {
            this.xml = data[0];
            this.prepareXpath()
        });
    }


    /**
     * send the text of the text area to the server
     */
    requestXML() {

        console.log(this.ws);

        let node = d3.select(`#${this.props["assignedId"]}`).select("input").node();
        if (node !== null)
            Utilities.sendToServer(this.ws, "DECL_STMT", node.value);
        // it then receives the xml from the server
    }

    /**
     * compile and prepare the xpath
     */
    prepareXpath() {

        this.setState({xpath: this.traverseXml(this.xml)});
        this.sendDataBack();
    }


    /**
     * send the xpath data to the parent node
     */
    sendDataBack() {
        this.props["callbackFromParent"]();
    }


    /**
     * check validity of an xml and generate the xpath query
     * @param text
     * @returns {string}
     */
    traverseXml(text) {

        let exprValidation = "//src:unit[count(*)=1 and count(src:decl_stmt)=1]/src:decl_stmt/src:decl";
        let parser = new DOMParser();

        function nsResolver(prefix) {
            let ns = {'src': 'http://www.srcML.org/srcML/src'};
            return ns[prefix] || null;
        }

        // checks validity of the XML
        let xml = parser.parseFromString(text, "text/xml");
        if (!xml.evaluate) {
            console.log('error in xml.evaluate');
            return "";
        }

        let validNodes = xml.evaluate(exprValidation, xml, nsResolver, XPathResult.ANY_TYPE, null);
        let resultValidNode = validNodes.iterateNext(); // expr_stmt/expr
        if (!resultValidNode) {
            console.log("error");
            return "";
        }
        return this.traverseChildren(resultValidNode);
    }

    /**
     * traverse the state_children of a parent node to generate xpath query conditions
     * @param parentNode
     * @returns {string}
     */
    traverseChildren(parentNode) {
        let res = [];
        let children = parentNode.childNodes;
        for (let i = 0; i < children.length; i++) {

            if (children[i].nodeName === "#text") {
                if (children.length === 1)
                    res.push("text()=\"" + children[i].nodeValue + "\"");
            }
            else
                res.push(this.traverseChildren(children[i]));
        }
        return "src:" + parentNode.nodeName + "[" + res.join(' and ') + "]";
    }


}

export default DeclarationFragment;
