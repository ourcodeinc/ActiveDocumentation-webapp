/**
 * Created by saharmehrpour on 9/5/17.
 */

// import React from 'react';
import PubSub from 'pubsub-js';

class WebSocketManager {


    constructor() {


        let xml = []; // object of `filePath` and `xml`
        let ruleTable = []; // retrieved from ruleJson.txt
        let tagTable = []; // retrieved from tagJson.txt
        let ws = new WebSocket("ws://localhost:8887");
        // let filtered;

        PubSub.publish('NEW_WS', [ws]);

        ws.onopen = function () {
            PubSub.publish('NEW_CONNECTION', []);
        };


        if (!window.WebSocket) {
            alert("FATAL: WebSocket not natively supported. This demo will not work!");
        }

        ws.onmessage = function (e) {

            let message = JSON.parse(e.data);

            switch (message.command) {

                // send initially on open
                case "XML":
                    xml.push(message.data);
                    break;

                // send initially on open, when the ruleJson.txt is changed, followed by VERIFY_RULES
                case "RULE_TABLE":
                    eval(message.data);
                    break;

                // send initially on open, when the tagJson.txt is changed, followed by VERIFY_RULES
                case "TAG_TABLE":
                    eval(message.data);
                    break;

                case "VERIFY_RULES":
                    // received by RuleExecutor.verifyRules()
                    PubSub.publish('VERIFY_RULES', [xml, ruleTable, tagTable]);
                    break;

                // // followed by CHECK_RULES_FOR_FILE
                // case "UPDATE_XML":
                //     filtered = xml.filter((d) => d.filePath === message.data['filePath']);
                //     if (filtered.length === 0)
                //         xml.push({'filePath': message.data['filePath'], 'xml': message.data['xml']});
                //     else
                //         filtered[0].xml = message.data['xml'];
                //     break;
                //
                // // when the code changes, after UPDATE_XML
                // case "CHECK_RULES_FOR_FILE":
                //     // received by checkRules()
                //     PubSub.publish('CHECK_RULES_FOR_FILE', [xml, ruleTable, message.data]);
                //     //window.location.hash = "#/codeChanged";
                //     PubSub.publish('HASH', ['codeChanged']);
                //     break;
                //
                // // tagName and tag
                // case "UPDATE_TAG":
                //     let newTag = JSON.parse(message.data);
                //     filtered = tagTable.filter((d) => d.tagName === newTag['tagName']);
                //     if (filtered.length === 0)
                //         tagTable.push(newTag);
                //     else
                //         filtered[0].detail = newTag['detail'];
                //
                //     PubSub.publish('UPDATE_TAG', [tagTable, newTag]);
                //     //window.location.hash = `#/tag/${newTag['tagName']}`;
                //     PubSub.publish('HASH', ['tag', newTag['tagName']]);
                //     break;
                //
                // // ruleIndex and rule
                // case "UPDATE_RULE":
                //     let newRule = JSON.parse(message.data['rule']);
                //     filtered = ruleTable.filter((d) => d.index === +message.data['ruleIndex']);
                //     if (filtered.length === 0)
                //         ruleTable.push(newRule);
                //     else
                //         filtered[0] = newRule;
                //
                //     PubSub.publish('UPDATE_RULE', [ruleTable, newRule]);
                //     break;

                case "ENTER":
                case "LEFT":
                default:
            }
        };
    }

}

/**
 * Factory method to create a new WebSocketManager instance
 * @returns {WebSocketManager}
 */
export function create() {
    return new WebSocketManager();
}