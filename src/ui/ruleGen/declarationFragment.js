/**
 * Created by saharmehrpour on 3/13/18.
 */

import React from 'react';
import '../../App.css';

import {FormControl, Row, Button, DropdownButton, MenuItem} from 'react-bootstrap';
import MdDelete from 'react-icons/lib/md/delete';

import Utilities from "../../core/utilities";
import {constants} from '../constants';

import * as d3 from "d3";
import PubSub from 'pubsub-js';
import ExpressionFragment from "./expressionFragment";


class DeclarationFragment extends React.Component {

    constructor(props) {
        super(props);
        // target assignedId ws callbackFromParent isConstraint constraintIndices root

        this.ws = props["ws"];

        this.state = props["state"];
        this.state.text = "";

        this.waiting = false; // substitute for one-to-one send and receive

        this.attachListener();
    }

    render() {
        return (
            <div id={this.props["assignedId"]}
                 className={(this.state.target === "") ? "" : "ruleGroupDiv " + this.state.target}>
                <Row style={{margin: "0"}}>
                    <div className={"rowItem"}>
                        <FormControl type="text"
                                     value={this.state.children["within"].length !== 0 ? this.state.children["within"][0].value : ""}
                                     placeholder={this.props["category"]}
                                     onChange={(e) => {
                                         const children = this.state.children["within"];
                                         if (children.length === 0)
                                             children.push({
                                                 key: "decl",
                                                 value: "",
                                                 target: this.state.target,
                                                 children: JSON.parse(JSON.stringify(constants.state_children)),
                                                 xpath: ""
                                             });
                                         const child = children[0];
                                         child.value = e.target.value;
                                         this.setState({child});
                                     }}/>
                    </div>
                    <div className={"rowItem"}>
                        <Button bsSize="small"
                                onClick={() => this.requestXML()}>Confirm {this.props["category"]}</Button>
                    </div>
                    {this.renderFollows()}
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
            if(this.waiting) {
                this.xml = data[0];
                this.prepareXpath();
                this.waiting = false;
            }
        });
    }


    /**
     * send the text of the text area to the server
     */
    requestXML() {

        // console.log(this.ws);

        let node = d3.select(`#${this.props["assignedId"]}`).select("input").node();
        if (node !== null) {
            if (node.value[node.value.length - 1] !== ';')
                Utilities.sendToServer(this.ws, "DECL_STMT", node.value + ';');
            else
                Utilities.sendToServer(this.ws, "DECL_STMT", node.value);
            this.waiting = true;
        }
        // it then receives the xml from the server
    }

    /**
     * compile and prepare the xpath
     */
    prepareXpath() {
        const child = this.state.children["within"][0];
        child.xpath = this.traverseXml(this.xml);
        this.setState({child});
        this.sendDataBack();
    }


    /**
     * send the xpath data to the parent node
     */
    sendDataBack = () => {
        this.props["callbackFromParent"]();
    };


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

    /**
     * render the 'follows' elements and constraints, drop down or a component
     */
    renderFollows() {
        if (!this.state.children["follows"].hasOwnProperty("key"))
            return (
                <div>
                    <DropdownButton title={`follows`} id={"drop_down"} className={this.state.target}>
                        {Object.keys(constants.code_fragment[this.props["category"]]["follows"]).map((key, i) => {
                            return (
                                <MenuItem eventKey={key} key={i}
                                          onSelect={(evt) => {
                                              const children = this.state.children;
                                              children.follows = {
                                                  key: evt,
                                                  value: constants.code_fragment[this.props["category"]]["follows"][evt],
                                                  target: this.state.target,
                                                  children: JSON.parse(JSON.stringify(constants.state_children)),
                                                  xpath: constants.code_fragment[this.props["category"]]["follows"][evt].xpath
                                              };
                                              this.setState({children});
                                              this.sendDataBack();
                                          }}
                                >{constants.code_fragment[this.props["category"]]["follows"][key].name}
                                </MenuItem>);
                        })}
                    </DropdownButton>
                </div>
            );

        else {
            return (
                <div className={(this.state.target === "") ? "" : "ruleGroupDiv " + this.state.target + " exprDiv"}
                     style={this.state.children["follows"].key === "initialization expression" ? {border: "none"} : {}}>
                    <div style={{float: 'right'}}><MdDelete size={25}
                                                            style={{cursor: "pointer", marginTop: "8px"}}
                                                            onClick={() => {
                                                                const children = this.state.children;
                                                                children["follows"] = {};
                                                                this.setState({children});
                                                                this.sendDataBack();
                                                            }}/></div>
                    {(() => {
                        switch (this.state.children["follows"].key) {
                            case "name":
                                return (
                                    <div>
                                        <em>The declaration and the output is in form of the following formats (but not
                                            limited to):</em><br/>
                                        <code><b>Name</b> = MethodCall();<br/></code>
                                        <code><b>Name</b> = Name;<br/></code>
                                        <code><b>Name.Name</b> = Name<br/></code>
                                        <code><b>Name.Name</b> = Name.Name<br/></code>
                                        <code>Name = <b>Name;</b><br/></code>
                                        <code>Name = <b>Name.Name;</b></code>
                                    </div>);
                            case "name/name":
                                return (
                                    <div>
                                        <em>The declaration and the output is in form of the following formats (but not
                                            limited to):</em><br/>
                                        <code><b>Name</b>.Name = MethodCall();<br/></code>
                                        <code>Name.<b>Name</b> = MethodCall();<br/></code>
                                        <code>Name = <b>Name</b>.Name;<br/></code>
                                        <code>Name = Name.<b>Name</b>;</code>
                                    </div>);
                            case "initialization expression":
                                return (
                                    <div>
                                        <em>The initialization expression is in the form:</em><br/>
                                        <div style={{marginTop: "15px"}}>
                                            <ExpressionFragment ws={this.ws} state={this.state.children["follows"]}
                                                                assignedId={this.props["assignedID"] + "_expr_follows"}
                                                                callbackFromParent={this.sendDataBack}/>
                                        </div>
                                    </div>);
                            default:
                                return (<div>{this.state.children["follows"].key}</div>)
                        }
                    })()}
                </div>
            )
        }
    }

}

export default DeclarationFragment;
