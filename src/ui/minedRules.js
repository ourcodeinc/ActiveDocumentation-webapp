/**
 * Created by saharmehrpour on 11/1/17.
 */

import React, {Component} from 'react';
import '../App.css';
import {connect} from 'react-redux';
import {Button} from "react-bootstrap";
import {mineRulesFromXmlFiles} from "../core/miningRules";


class MinedRules extends Component {

    // constructor() {
    //     super();
    //
    // }

    render() {
        return (
            <div>
                <p>
                    Mined Design Rules. Boilerplate
                </p>
                <Button onClick={()=>this.mineRules()} style={{padding: "0 5px"}}>
                    Mine Rules Now!
                </Button>
            </div>
        )
    }

    mineRules() {
        // let minedRules =
            mineRulesFromXmlFiles(this.props.xmlFiles);
        // todo display rules
    }
}

function mapStateToProps(state) {
    return {
        xmlFiles: state['xmlFiles']
    }
}


export default connect(mapStateToProps, null)(MinedRules);