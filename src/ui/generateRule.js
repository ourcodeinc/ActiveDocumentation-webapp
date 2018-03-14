/**
 * Created by saharmehrpour on 2/23/18.
 */

import React from 'react';
import '../App.css';

import * as d3 from 'd3';
import PubSub from 'pubsub-js';
import {DropdownButton, MenuItem, ControlLabel} from 'react-bootstrap'; //ControlLabel, FormGroup, FormControl, HelpBlock, FormControl
import {constants} from './constants';
import ChainItem from './chainItem';
import ClassFragment from './ruleGen/classFragment';


class GenerateRule extends React.Component {

    constructor() {
        super();
        this.attachListener();

        this.xpath = "src:unit/src:class";

        // this.state = {
        //     list: [{ // for hierarchical view
        //         key: "class",
        //         constraints: [] // [{title: "Name equals to ...", value: "MyClassName", id: "NAME_EQUALS_TO"}]
        //     }]
        // };

    }

    render() {
        return (
            <div>
                {/*<form>{this.renderItemsInList()}</form>*/}
                <form><ClassFragment target={"follows"} assignedId={"class_0"}
                                     callbackFromParent={this.receiveXpathData} isConstraint={false}/></form>
                <p id={"generated_xpath"}>{this.xpath}</p>
            </div>
        );
    }

    /**
     * subscribe for events
     */
    attachListener() {

        // [hash value]
        PubSub.subscribe('HASH', (msg, data) => {
            if (data[0] === 'genRule')
                d3.select('#generateRule').classed('hidden', false);
            else
                d3.select('#generateRule').classed('hidden', true);

        });

    }

    /**
     * render the main chain of items
     * @returns {XML}
     */
    renderItemsInList() {
        return (
            <div>
                {this.state.list.map((item, index) => {
                    if (item.key !== "end")
                        return (<ChainItem constraintData={item} key={index}
                                           callbackFromParent={this.receiveXpathData}/>);
                    return (<ControlLabel>{item.text}</ControlLabel>)
                })}
                {this.renderFollows()}
            </div>

        )
    }


    renderFollows() {
        if (this.state.list[this.state.list.length - 1].key !== "end")
            return (<DropdownButton title={"Select what to follow"} id="dropdown-size-medium" bsStyle="info">
                {Object.keys(constants.srcMLdata[this.state.list[this.state.list.length - 1].key].follows).map((key, i) => {
                    return (
                        <MenuItem eventKey={key} key={i}
                                  onSelect={(evt) => {
                                      let follows = constants.srcMLdata[this.state.list[this.state.list.length - 1].key].follows[evt];
                                      if (follows.follows === "") // no more follow ups
                                          this.state.list.push({
                                              key: "end",
                                              text: follows.xpath
                                          });
                                      else
                                          this.state.list.push({
                                              key: follows.follows,
                                              constraints: []
                                          });

                                      console.log(this.state.list);

                                      this.setState({list: this.state.list})
                                  }}
                        >{key}
                        </MenuItem>);
                })}
            </DropdownButton>)
    }


    /**
     * receive xpath data from the child nodes
     * @param xpathData
     */
    receiveXpathData = (xpathData) => {
        this.xpath = "src:unit/src:class" + xpathData;
        d3.select("#generated_xpath").text(this.xpath);
    };


}

export default GenerateRule;
