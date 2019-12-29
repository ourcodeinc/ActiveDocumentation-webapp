/**
* Created by saharmehrpour on 12/29/17.
*/

import React, {Component} from 'react';
import '../App.css';
import {connect} from 'react-redux';

class FeatureSelection extends Component {

    render () {
        return (
            <div>
                <p>{this.props.filePath}</p>
                <p>starting offset: {this.props.startIndex}</p>
                <p>ending offset: {this.props.endIndex}</p>
                <p>{this.props.xpath}</p>
                <p>{this.props.selectedText}</p>
            </div>
        )
    }

}

function mapStateToProps(state) {
    return {
        message: state.message,
        filePath: state.featureSelection.filePath,
        startIndex: state.featureSelection.startIndex,
        endIndex: state.featureSelection.endIndex,
        xpath: state.featureSelection.xpath,
        selectedText: state.featureSelection.selectedText
    }
}

// function mapDispatchToProps(dispatch) {
//     return {
//     }
// }


export default connect(mapStateToProps, null)(FeatureSelection);