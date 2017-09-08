/**
 * Created by saharmehrpour on 9/6/17.
 */

import * as d3 from 'd3';
import PubSub from 'pubsub-js';

class HashManager {

    history;
    clicked;
    activeHash;


    constructor() {
        this.history = [];
        this.clicked = false;
        this.activeHash = -1;

        this.attachListener();
        this.setupNavigationButtons();
    }

    attachListener() {
        // [hash, values]
        PubSub.subscribe('HASH', (msg, data) => {
            this.hashManager(data);
        });

        // [hash, values]
        PubSub.subscribe('UPDATE_HASH', (msg, data) => {
            window.location.hash = '#/' + data.join('/');
        });
    }

    /**
     * adding listeners to tabs on the nav bar
     */
    setupNavigationButtons() {
        let self = this;

        d3.select("#back_button").on("click", () => {
            if (self.activeHash > 0) {
                self.activeHash = self.activeHash - 1;
                self.clicked = true;

                window.location.hash = self.history[self.activeHash];
                d3.select(d3.select('#forward_button').node().parentNode).classed('disabled', false);
            }
            if (self.activeHash === 0) {
                d3.select(d3.select('#back_button').node().parentNode).classed('disabled', true);
            }
        });

        d3.select("#forward_button").on("click", () => {
            if (self.activeHash < self.history.length - 1) {
                self.activeHash = self.activeHash + 1;
                self.clicked = true;

                window.location.hash = self.history[self.activeHash];
                d3.select(d3.select('#back_button').node().parentNode).classed('disabled', false);
            }
            if (self.activeHash === self.history.length - 1) {
                d3.select(d3.select('#forward_button').node().parentNode).classed('disabled', true);
            }
        });
    };


    /**
     * up date the hash list and 'active hash'
     * @param hash
     */
    updateHistory = function (hash) {
        let self = this;

        if (!self.clicked) {
            if (self.history.length - 1 > self.activeHash) {
                for (let i = self.history.length - 1; i > self.activeHash; i--)
                    console.log(self.history.pop());
            }
            self.history.push(hash);
            self.activeHash += 1;
            d3.select(d3.select('#back_button').node().parentNode).classed('disabled', self.activeHash === 0);
            d3.select(d3.select('#forward_button').node().parentNode).classed('disabled', true);
        }
        self.clicked = false;

    };

    /**
     * This class updates the view based on changes in Hash address
     * @param hash[]
     */
    hashManager(hash) {
        let self = this;

        self.updateHistory('#/' + hash.join('/'));

        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

    };

}

/**
 * Factory method to create a new hashManager instance
 * @returns {HashManager}
 */
export function create() {
    return new HashManager();
}