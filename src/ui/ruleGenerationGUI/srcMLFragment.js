/**
 * Created by saharmehrpour on 3/13/18.
 */

import React from 'react';

import {Button} from 'react-bootstrap';
import MdDelete from 'react-icons/lib/md/delete';
import TiDelete from 'react-icons/lib/ti/delete';

import Utilities from "../../core/utilities";
import {GuiConstants} from './guiConstants';
import {CustomFollowDropDown} from "./customAddFollowDropDown";


class SrcMLFragment extends React.Component {


    constructor(props) {
        super(props);
        // target assignedId ws callbackFromParent isConstraint constraintIndices root

        this.ws = props["ws"];

        this.state = props["state"];
        this.state.text = "";

        this.waiting = false; // substitute for one-to-one send and receive
    }

    render() {
        return (
            <div className={(this.state.target === "") ? "divBorder rowItem" : "rowItem divBorder " + this.state.target}>
                <div className={"rowGroup"}>
                    <div className={"rowItem"} style={{marginTop: "2px"}}>
                        <input type={"text"} className={"inputText"}
                                     value={this.state.children["within"].length !== 0 ? this.state.children["within"][0].value : ""}
                                     placeholder={this.props["placeholder"]}
                                     onChange={(e) => {
                                         const children = this.state.children;
                                         if (children["within"].length === 0)
                                             children["within"].push({
                                                 key: "expr",
                                                 value: "",
                                                 target: this.state.target,
                                                 children: JSON.parse(JSON.stringify(GuiConstants.state_children)),
                                                 xpath: ""
                                             });
                                         children["within"][0].value = e.target.value;
                                         this.setState({children});
                                     }}/>
                    </div>
                    <div className={"rowItem"}>
                        <Button bsSize="small" onClick={() => this.requestXML()}>Confirm Expression</Button>
                    </div>
                    {(this.props["removeFunction"]) ?
                        <div className={"removeIcon"}>
                            <TiDelete size={20}
                                      className={"tiDelete"}
                                      onClick={() => this.props["removeFunction"]()}/>
                        </div> : ""}
                </div>
            </div>
        )
    }


    /**
     * send the text of the text area to the server
     */
    requestXML() {

        let node = //d3.select(`#${this.props["assignedId"]}`).select("input").node();
        document.getElementById(this.props["assignedId"]).getElementsByTagName("input")[0];
        if (node !== null && node.value !== "") {
            Utilities.sendToServer(this.ws, "EXPR_STMT", node.value);
            this.waiting = true;
        }
        // it then receives the xml from the server
    }

    /**
     * prepare the xpath from the received xml
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
    sendDataBack() {
        this.props["callbackFromParent"]();

    }


    /**
     * check validity of an xml and generate the xpath query
     * @param text
     * @returns {string}
     */
    traverseXml(text) {

        let exprValidation = "//src:unit[count(*)=1 and count(src:expr_stmt)=1]/src:expr_stmt/src:expr/*[self::src:name or self::src:literal]";
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
     * @deprecated
     */
    renderFollows() {
        if (!this.state.children["follows"].hasOwnProperty("key"))
            return (
                <div>
                    <CustomFollowDropDown
                        menuItemsText={Object.keys(GuiConstants.code_fragment["expression"]["follows"])
                            .map(key => GuiConstants.code_fragment["expression"]["follows"][key]["buttonName"])}
                        menuItemsEvent={Object.keys(GuiConstants.code_fragment["expression"]["follows"])
                            .map(key => key)}
                        target={this.state.target}
                        onSelectFunction={(evt) => {
                            const children = this.state.children;
                            children.follows = {
                                key: evt,
                                value: GuiConstants.code_fragment["expression"]["follows"][evt],
                                target: this.state.target !== "" ? this.state.target : "default",
                                children: JSON.parse(JSON.stringify(GuiConstants.state_children)),
                                xpath: GuiConstants.code_fragment["expression"]["follows"][evt]["xpath"],
                                grammar: GuiConstants.code_fragment["expression"]["follows"][evt]["grammar"]
                            };
                            this.setState({children});
                            this.sendDataBack();
                        }}
                    />
                </div>
            );

        else {
            return (
                <div className={(this.state.target === "") ? "" : "ruleGroupDiv " + this.state.target + " exprDiv"}>
                    <div style={{float: 'right'}}>
                        <MdDelete size={20}
                                  style={{cursor: "pointer", marginTop: "8px", color: "grey"}}
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
                                        <em>The expression and the output is in form of the following formats (but not
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
                                        <em>The expression and the output is in form of the following formats (but not
                                            limited to):</em><br/>
                                        <code><b>Name</b>.Name = MethodCall();<br/></code>
                                        <code>Name.<b>Name</b> = MethodCall();<br/></code>
                                        <code>Name = <b>Name</b>.Name;<br/></code>
                                        <code>Name = Name.<b>Name</b>;</code>
                                    </div>);
                            case "chainCall":
                                return (
                                    <div>
                                        <em>The expression and the output is in form of the following formats (but not
                                            limited to):</em><br/>
                                        <code><b>MethodCall</b>(); <br/></code>
                                        <code><b>Name.MethodCall</b>(); <br/></code>
                                        <code>Name = <b>MethodCall()</b>;<br/></code>
                                        <code>Name.Name = <b>MethodCall()</b>; </code>
                                    </div>);
                            default:
                                return (<div/>)
                        }
                    })()}
                </div>
            )
        }
    }

}

export default SrcMLFragment;
