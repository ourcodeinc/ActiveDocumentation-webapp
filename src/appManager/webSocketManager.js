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
        let filtered;

        PubSub.publish('NEW_WS', [ws]);

        ws.onopen = function () {
            PubSub.publish('NEW_CONNECTION', []);
        };


        if (!window.WebSocket) {
            alert("FATAL: WebSocket not natively supported. This demo will not work!");
        }

        ws.onmessage = function (e) {

            let message = JSON.parse(e.data);

            // if (message.command === 'PROJECT_HIERARCHY')
            //     console.log(message);

            switch (message.command) {

                // send initially on open
                case "XML":
                    xml.push(message.data);
                    break;

                // send initially on open, when the ruleJson.txt is changed, followed by VERIFY_RULES
                case "RULE_TABLE":
                    ruleTable = JSON.parse(message.data);
                    break;

                // send initially on open, when the tagJson.txt is changed, followed by VERIFY_RULES
                case "TAG_TABLE":
                    tagTable = JSON.parse(message.data);
                    break;

                case "PROJECT_HIERARCHY":
                    // received by projectHierarchy
                    PubSub.publish('PROJECT_HIERARCHY', [message.data]);
                    break;

                case "VERIFY_RULES":
                    // received by RuleExecutor
                    PubSub.publish('VERIFY_RULES', [xml, ruleTable, tagTable]);
                    break;

                // followed by CHECK_RULES_FOR_FILE
                case "UPDATE_XML":
                    filtered = xml.filter((d) => d.filePath === message.data['filePath']);
                    if (filtered.length === 0)
                        xml.push({'filePath': message.data['filePath'], 'xml': message.data['xml']});
                    else
                        filtered[0].xml = message.data['xml'];
                    break;

                // when the code changes, after UPDATE_XML
                case "CHECK_RULES_FOR_FILE":
                    let filePath = message.data;
                    // received by RuleExecutor
                    PubSub.publish('CHECK_RULES_FOR_FILE', [xml, ruleTable, filePath]);
                    PubSub.publish('UPDATE_HASH', ['codeChanged']);
                    break;

                // tagName and tag
                case "UPDATE_TAG":
                    let newTag = JSON.parse(message.data);
                    filtered = tagTable.filter((d) => d.tagName === newTag['tagName']);
                    if (filtered.length === 0)
                        tagTable.push(newTag);
                    else
                        tagTable.filter((d) => d.tagName === newTag['tagName'])[0].detail = newTag['detail'];

                    PubSub.publish('UPDATE_TAG', [tagTable, newTag]);
                    PubSub.publish('UPDATE_HASH', ['tag', newTag['tagName']]);
                    break;

                // Followed after sending MODIFIED_RULE
                // ruleIndex and rule
                case "UPDATE_RULE":
                    let newRule = JSON.parse(message.data['rule']);
                    PubSub.publish('UPDATE_RULE', [message.data['ruleIndex'], newRule]);
                    PubSub.publish('UPDATE_HASH', ['rule', message.data['ruleIndex']]);
                    break;

                // when the tagJson.txt changes, after TAG_TABLE
                case "UPDATE_TAG_TABLE":
                    PubSub.publish('UPDATE_TAG_TABLE', [tagTable]);
                    PubSub.publish('UPDATE_HASH', ['tagJsonChanged']);
                    break;

                // when the ruleJson.txt changes, after RULE_TABLE
                case "UPDATE_RULE_TABLE":
                    PubSub.publish('UPDATE_RULE_TABLE', [ruleTable]);
                    PubSub.publish('UPDATE_HASH', ['ruleJsonChanged']);
                    break;

                // after sending a piece of code EXPR_STMT
                case "EXPR_STMT_XML":
                    PubSub.publish('EXPR_STMT_XML', [message.data]);
                    break;

                // after sending a piece of code DECL_STMT
                case "DECL_STMT_XML":
                    PubSub.publish('DECL_STMT_XML', [message.data]);
                    break;

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