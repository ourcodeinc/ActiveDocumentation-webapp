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
import MinedRulesComponent from "./ui/MiningRules/learnDesignRulesComponent";
import FeatureSelection from "./ui/MiningRules/featureSelection";

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

        this.state = {loading: false}
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
                             (["index", "tagJsonChanged", "ruleJsonChanged"].indexOf(this.props.currentHash[0]) === -1 ) ? "main container hidden" : "main container"
                         }>
                        <TableOfContents/>
                    </div>
                    <div id={"ruleResults"}
                         className={
                             (["rules", "tag", "codeChanged", "rulesForFile", "violatedRules"].indexOf(this.props.currentHash[0]) === -1 ) ? "main container hidden" : "main container"
                         }>
                        <RuleTable/>
                    </div>
                    <div id={"learnDesignRules"}
                         className={
                             (["learnDesignRules"].indexOf(this.props.currentHash[0]) === -1 ) ? "main container hidden" : "main container"
                         }>
                        <MinedRulesComponent/>
                    </div>
                    <div id={"featureSelection"}
                         className={
                             (["featureSelection"].indexOf(this.props.currentHash[0]) === -1 ) ? "main container hidden" : "main container"
                         }>
                        <FeatureSelection/>
                    </div>
                    <div style={{width: "100%", height: "100px"}}/>
                </div>
            </div>
        )
    }


    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({loading: nextProps.loading})
    }

    /**
     * render loading gif
     * @return {null}
     */
    renderLoading() {
        return this.state.loading ? (
            <div style={{
                padding: "20%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                position: "fixed",
                width: "100%",
                height: "100%",
                zIndex: "1",
                backgroundColor: "rgba(0,0,0,0.1)"
            }}>
                <div style={{
                    padding: "20%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 -5%",
                    overflow: "hidden"
                }}>
                    <div className="spinner"/>
                </div>
            </div>
        ) : null;
    }

}

// map state to props
function mapStateToProps(state) {
    return {
        currentHash: state.currentHash,
        loading: state.loadingRules
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