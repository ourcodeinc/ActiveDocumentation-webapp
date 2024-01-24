import React, {Component} from "react";
import "./App.css";
import "./index.css";

import {connect} from "react-redux";

import WebSocketManager from "./core/webSocketManager";
import {hashChange} from "./actions";

import TableOfContents from "./ui/tableOfContents";
import RuleTable from "./ui/ruleTable";
import NavBar from "./ui/navBar";
import HeaderBar from "./ui/headerBar";
import MinedRulesComponent from "./ui/MiningRules/minedRulesComponent";
import {hashConst} from "./ui/uiConstants";

class App extends Component {

    constructor(props) {
        super(props);
        /**
         * https://stackoverflow.com/questions/710586/json-stringify-array-bizarreness-with-prototype-js
         */
        if (window.Prototype) {
            delete Array.prototype.toJSON;
        }

        if (!window.WebSocket) {
            alert("FATAL: WebSocket not natively supported. This demo will not work!");
        }

        if ("onhashchange" in window) { // event supported?
            window.onhashchange = function () {
                let hash = window.location.hash.split("/");
                hash.splice(0, 1); // remove #
                props.onHashChange(hash);
            }
        }
        else { // event not supported:
            let storedHash = window.location.hash;
            window.setInterval(function () {
                if (window.location.hash !== storedHash) {
                    storedHash = window.location.hash;
                    let hash = storedHash.split("/");
                    hash.splice(0, 1); // remove #
                    props.onHashChange(hash);
                }
            }, 100);
        }

        window.location.hash = "#/index";

        this.state = {loadingGif: false}
    }

    render() {
        return (
            <div>
                <WebSocketManager/>
                {this.renderLoading()}
                <nav className={"navbar navbar-inverse"} id={"navBar"}>
                    <NavBar/>
                </nav>
                <div>
                    <div className={"main container"} id={"headerBar"}>
                        <HeaderBar/>
                    </div>
                    <div id={"tableOfContent"}
                         className={
                             ([hashConst.index, hashConst.tagJsonChanged, hashConst.ruleJsonChanged].indexOf(this.props.currentHash[0]) === -1 ) ? "main container hidden" : "main container"
                         }>
                        <TableOfContents/>
                    </div>
                    <div id={"ruleResults"}
                         className={
                             ([hashConst.rules, hashConst.tag, hashConst.codeChanged, hashConst.rulesForFile, hashConst.violatedRules].indexOf(this.props.currentHash[0]) === -1 ) ? "main container hidden" : "main container"
                         }>
                        <RuleTable/>
                    </div>
                    <div id={"learnDesignRules"}
                         className={
                             ([hashConst.learnDesignRules].indexOf(this.props.currentHash[0]) === -1 ) ? "main container hidden" : "main container"
                         }>
                        <MinedRulesComponent/>
                    </div>
                    <div style={{width: "100%", height: "100px"}}/>
                </div>
            </div>
        )
    }

    static getDerivedStateFromProps(props, state) {
        if (props.loadingGif !== state.loadingGif)
            return {loadingGif: props.loadingGif};
        return null;
    }

    renderLoading() {
        return (<div id={"loadingGif"}
             className={(this.state.loadingGif ? "" : "hidden")}>
            <div className={"overlayLoading"}>
                <div className={"spinnerContainer"}>
                    <div className={"loadingTitle"}>
                        <h3>{"Loading Rules and Preprocessing"}</h3>
                    </div>
                    <div className="spinner"/>
                </div>
            </div>
        </div>);
    }

}

// map state to props
function mapStateToProps(state) {
    return {
        currentHash: state.currentHash,
        loadingGif: state.loadingGif
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onHashChange: (hash) => {
            dispatch(hashChange(hash));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);