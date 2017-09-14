import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import PubSub from 'pubsub-js';

import * as webSocketManager from './webSocketManager';
import * as hashManager from './hashManager';

import * as ruleExecutor from './core/ruleExecutor';

import * as tableOfContent from './ui/tableOfContent';
import * as ruleTable from './ui/ruleTable';
import IndividualRule from './ui/individualRule';
import NavBar from './ui/navBar';
import HeaderBar from './ui/headerBar';

class App {

    thisNode;

    constructor(parent) {
        this.thisNode = d3.select(parent);
    }

    init() {

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

    build(){

        // ---- UI

        this.thisNode.append('nav')
            .classed('navbar navbar-inverse',true)
            .attr('id','navBar');
        ReactDOM.render(
            React.createElement(NavBar),
            document.getElementById('navBar')
        );

        // main div - all div are within this div
        const main = this.thisNode.append('div');

        main.append('div')
            .classed('main container hidden',true)
            .attr('id','headerBar');
        ReactDOM.render(
            React.createElement(HeaderBar),
            document.getElementById('headerBar')
        );
        const tableOfContentDiv = main.append('div')
            .classed('main container', true)
            .attr('id', 'tableOfContent');
        tableOfContent.create(tableOfContentDiv.node());

        const ruleTableDiv = main.append('div')
            .classed('main container hidden', true)
            .attr('id', 'ruleResults');
        ruleTable.create(ruleTableDiv.node());


        main.append('nav')
            .classed('main container hidden',true)
            .attr('id','individualRule');
        ReactDOM.render(
            React.createElement(IndividualRule),
            document.getElementById('individualRule')
        );


        // ----

        ruleExecutor.create();
        webSocketManager.create();
        hashManager.create();

        window.location.hash = "#/index";
    }


}

/**
 * Factory method to create a new app instance
 * @param parent
 * @returns {App}
 */
export function create(parent) {
    return new App(parent);
}