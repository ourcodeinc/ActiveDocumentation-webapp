/**
 * Created by saharmehrpour on 9/5/17.
 */

// import React from 'react';
import '../App.css';

// import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import PubSub from 'pubsub-js';


class TableOfContent {

    thisNode;

    alphabetIndex;
    tags_list;
    rules_list;

    tags;
    rules;

    constructor(parent) {
        this.thisNode = d3.select(parent)
            .append('div')
            .classed('container', true);

        // add elements
        this.thisNode.append('div')
            .classed('well well-sm', true)
            .append('h4')
            .text('Tags');

        this.alphabetIndex = this.thisNode.append('div')
            .classed('list-inline', true)
            .attr('id', 'alphabet_index');

        this.thisNode.append('hr')
            .classed('bottomBorder', true);

        this.tags_list = this.thisNode.append('ul')
            .classed('list-inline', true)
            .attr('id', 'tags_list');

        this.thisNode.append('div')
            .classed('well well-sm', true)
            .append('h4')
            .text('Rules');

        this.rules_list = this.thisNode.append('div')
            .classed('list-inline', true)
            .attr('id', 'rules_list');

        this.createAlphabetIndex();

        this.attachListener();
    }

    /**
     * Attach listeners
     */
    attachListener() {

        // [hash, value]
        PubSub.subscribe('HASH', (msg, data) => {
            d3.select(this.thisNode.node().parentNode).classed('hidden', data[0] !== 'index');
        });


        // called in RuleExecutor.verifyRules() and RuleExecutor.checkRules()
        // [ruleTable, tagTable]
        PubSub.subscribe('DISPLAY_RULES', (msg, data) => {
            this.rules = data[0];
            this.tags = data[1];
            this.displayTableOfContent();
        });

        // // [tagTable, newTag]
        // PubSub.subscribe('UPDATE_TAG', (msg, data) => {
        //     this.tags = data[0];            // reset the table
        //     this.clearTableOfContent();
        //     this.displayTableOfContent();
        // });
        //
        // // [ruleTable, newRule]
        // PubSub.subscribe('UPDATE_RULE', (msg, data) => {
        //     this.rules = data[0];
        //     // reset the table
        //     this.clearTableOfContent();
        //     this.displayTableOfContent();
        // });

    }


    /**
     * This function creates an alphabet list on top
     */
    createAlphabetIndex() {
        let self = this;

        let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        alphabet.push('All');

        this.alphabetIndex
            .selectAll("li")
            .data(alphabet)
            .enter()
            .append("li")
            .html(function (d) {
                return d;
            })
            .classed("selected", function (d) {
                return d === 'All';
            })
            .on("click", function (d) {
                self.alphabetIndex
                    .selectAll("li")
                    .classed("selected", false);
                d3.select(this)
                    .classed("selected", true);

                self.tags_list
                    .selectAll("li")
                    .style("display", function (g) {
                        if (d === "All") {
                            return null;
                        }
                        if (g.charAt(0).toUpperCase() === d)
                            return null;
                        return "none";
                    });

            });
    };

    /**
     * display the list of rules and list aof tags
     */
    displayTableOfContent() {

        // tag list
        let tagList = this.tags.map(function (d) {
            return d['tagName']
        });
        let uniqueTags = [...new Set(tagList)];
        uniqueTags.sort(function (a, b) {
            return d3.ascending(a, b);
        });


        this.tags_list.selectAll("li")
            .data(uniqueTags)
            .enter()
            .append('li')
            .html((d) => d)
            .on("click", (d) => {
                PubSub.publish('UPDATE_HASH', ['tag', d]);
            });

        this.rules_list.selectAll("a")
            .data(this.rules)
            .enter()
            .append('a')
            .classed('list-group-item', true)
            .html((d) => d['ruleDescription'])
            .on("click", (d) => {
                PubSub.publish('UPDATE_HASH', ['rule', d.index]);
            });

    };


}

/**
 * Factory method to create a new tableOfContent instance
 * @param parent
 * @returns {TableOfContent}
 */
export function create(parent) {
    return new TableOfContent(parent);
}