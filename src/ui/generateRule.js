/**
 * Created by saharmehrpour on 2/23/18.
 */

import React from 'react';
import '../App.css';

import * as d3 from 'd3';
import PubSub from 'pubsub-js';
import {FormControl, ControlLabel, FormGroup, HelpBlock} from 'react-bootstrap';


class GenerateRule extends React.Component {

    constructor() {
        super();
        this.attachListener();

        this.state = {value:""};
    }

    render() {
        return (
            <div>
                <form>
                    <FormGroup
                        controlId="formBasicText"
                        validationState={this.getValidationState()}>
                        <ControlLabel>Working example with validation</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.value}
                            placeholder="Enter text"
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>Validation is based on string length.</HelpBlock>
                    </FormGroup>
                </form>
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
     * examples
     */
    getValidationState() {
        const length = this.state.value.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }
}

export default GenerateRule;
