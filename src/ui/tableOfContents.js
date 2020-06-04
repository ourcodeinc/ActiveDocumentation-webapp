/**
 * Created by saharmehrpour on 9/5/17.
 */

import React, {Component} from "react";
import "../App.css";
import {connect} from "react-redux";
import {Button} from "react-bootstrap";
import {MdPlaylistAdd} from "react-icons/lib/md/index";

import {changeEditMode} from "../actions";

class TableOfContents extends Component {

    render() {
        return (
            <div>
                <div className={"well well-sm"}>
                    <h4>Tags</h4>
                </div>
                <ul className={"list-inline"} id={"tags_list"}>
                    {this.props.tags.map((tag, i) =>
                        (<li key={i}
                             onClick={() =>
                                 window.location.hash = "#/tag/" + tag["tagName"]
                             }>{tag["tagName"]}</li>)
                    )}
                </ul>

                <div className={"well well-sm"}>
                    <h4>Rules</h4>
                </div>
                <div className={"ist-inline"}>
                    <table>
                        <tbody>
                        {this.props.rules.map((rule, i) =>
                            <tr key={i}>
                                <td className={"list-group-item"}>{rule["title"]}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <div style={{padding: "10px 0 10px 0", clear: "both"}}>
                        <Button style={{padding: "0 5px"}}
                                onClick={() => {
                                    window.location.hash = "#/rules";
                                    this.props.onAddNewRule()
                                }}>
                            <MdPlaylistAdd size={35}/>
                            Add a New Rule
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

}

function mapStateToProps(state) {
    return {
        rules: state.ruleTable,
        tags: state.tagTable,
        currentHash: state.currentHash
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onAddNewRule: () => dispatch(changeEditMode(-1, true))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableOfContents);