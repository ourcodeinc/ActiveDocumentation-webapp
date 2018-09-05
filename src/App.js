import React, {Component} from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import './index.css';

import PubSub from 'pubsub-js';

import * as webSocketManager from './appManager/webSocketManager';
import * as hashManager from './appManager/hashManager';

import * as ruleExecutor from './core/ruleExecutor';

import TableOfContent from './ui/tableOfContent';
import RuleTable from './ui/ruleTable';
// import IndividualRule from './ui/individualRule';
import NavBar from './ui/navBar';
import HeaderBar from './ui/headerBar';
import GenerateRule from './ui/generateRule';
// import ProjectHierarchy from './ui/projectHierarchy';

class App extends Component {

    constructor() {
        super();
        /**
         * https://stackoverflow.com/questions/710586/json-stringify-array-bizarreness-with-prototype-js
         */
        if(window.Prototype) {
            delete Array.prototype.toJSON;
        }

        if (!window.WebSocket) {
            alert("FATAL: WebSocket not natively supported. This demo will not work!");
        }

        if ("onhashchange" in window) { // event supported?
            window.onhashchange = function () {
                let hash = window.location.hash.split('/');
                hash.splice(0, 1); // remove #
                PubSub.publish('HASH', hash);
            }
        }
        else { // event not supported:
            let storedHash = window.location.hash;
            window.setInterval(function () {
                if (window.location.hash !== storedHash) {
                    storedHash = window.location.hash;
                    let hash = storedHash.split('/');
                    hash.splice(0, 1); // remove #
                    PubSub.publish('HASH', hash);
                }
            }, 100);
        }

        return this.build();
    }

    render() {
        return (
            <div>
                <nav className={"navbar navbar-inverse"} id={"navBar"}>
                    <NavBar/>
                </nav>
                <div>
                    <div className={"main container"} id={"headerBar"}>
                        <HeaderBar/>
                    </div>
                    <div className={"main container"} id={"tableOfContent"}>
                        <TableOfContent/>
                    </div>
                    <div className={"main container hidden"} id={"ruleResults"}>
                        <RuleTable/>
                    </div>
                    <div className={"main container hidden"} id={"generateRule"}>
                        <GenerateRule/>
                    </div>
                    {/*<div className={"main container hidden"} id={"projectHierarchy"}>*/}
                        {/*<ProjectHierarchy/>*/}
                    {/*</div>*/}
                    <div style={{width: "100%", height: "100px"}}/>
                </div>
            </div>
        )
    }

    build() {
        ruleExecutor.create();
        webSocketManager.create();
        hashManager.create();

        window.location.hash = "#/index";
        // window.location.hash = "#/genRule";

    }


}

export default App;