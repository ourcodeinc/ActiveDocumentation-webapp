/**
 * Created by saharmehrpour on 9/5/17.
 */

import React, {Component} from 'react';
import '../App.css';
import {connect} from 'react-redux';


class TableOfContent extends Component {

    constructor() {
        super();

        this.state = {
            selectedAlphabet: "All"
        };

        this.setWrapperRef = this.setWrapperRef.bind(this);
    }

    render() {
        return (
            <div ref={this.setWrapperRef}>
                <div className={"well well-sm"}>
                    <h4>Tags</h4>
                </div>
                <div className={"list-inline"} id={"alphabet_index"}>{this.createAlphabetIndex()}</div>
                <hr className={"bottomBorder"}/>
                <ul className={"list-inline"} id={"tags_list"}>
                    {this.props.tags.map((tag, i) =>
                        (<li key={i}
                             style={{display: this.selectAlphabet(tag)}}
                             onClick={(d) =>
                                 window.location.hash = '#/tag/' + tag['tagName']
                             }>{tag['tagName']}</li>)
                    )}
                </ul>

                <div className={"well well-sm"}>
                    <h4>Rules</h4>
                </div>
                <div className={"ist-inline"}>
                    <table><tbody>
                    {this.props.rules.map((rule, i) =>
                        <tr key={i}>
                            <td><a className={"list-group-item"}>
                                {rule.index}
                            </a></td>
                            <td><a className={"list-group-item"}>
                                {rule['title']}
                            </a></td>
                        </tr>
                    )}
                    </tbody></table>
                </div>
            </div>
        )
    }

    setWrapperRef(node) {
        this.thisNode = node;
    }

    selectAlphabet(tag) {
        if (this.state.selectedAlphabet === "All") {
            return "block";
        }
        if (tag["tagName"].charAt(0).toUpperCase() === this.state.selectedAlphabet)
            return "block";
        return "none";
    }


    /**
     * This function creates an alphabet list on top
     */
    createAlphabetIndex() {

        let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        alphabet.push('All');

        return alphabet.map((d, i) => {
            return (
                <li key={i}
                    className={d === this.state.selectedAlphabet ? "selected" : ""}
                    onClick={() => this.setState({selectedAlphabet: d})}>
                    {d}
                </li>
            )
        });

    };


}

function mapStateToProps(state) {
    return {
        rules: state["ruleTable"],
        tags: state["tagTable"],
        hash: state["hash"]
    }
}

export default connect(mapStateToProps, null)(TableOfContent);