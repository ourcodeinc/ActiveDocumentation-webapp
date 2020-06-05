/**
 * Created by saharmehrpour on 9/6/17.
 */


import React, {Component} from "react";
import "../App.css";
import FaArrowLeft from "react-icons/lib/fa/arrow-left";
import FaArrowRight from "react-icons/lib/fa/arrow-right";
import {Nav, Navbar, NavItem} from "react-bootstrap";
import {connect} from "react-redux";
import {clickedOnBack, clickedOnForward} from "../actions";


export class NavBar extends Component {

    render() {
        return (
            <Navbar inverse collapseOnSelect
                    style={{backgroundColor: "transparent", backgroundImage: "none", border: "none"}}>
                <Navbar.Toggle/>
                <Navbar.Collapse>
                    <Nav
                        onSelect={key => {
                            if (key > 0)
                                window.location.hash = (key === 1) ? "#/index" : (key === 2) ? "#/rules"
                                    : (key === 3) ? "#/violatedRules" : (key === 4) ? "#/minedRules" : "#/index"
                        }}>
                        <NavItem eventKey={-1} className={this.props.backDisable} onClick={() => this.props.backClick(this.props)}>
                            <FaArrowLeft size={20}/>
                        </NavItem>
                        <NavItem eventKey={-2} className={this.props.forwardDisable} onClick={() => this.props.forwardClick(this.props)}>
                            <FaArrowRight size={20}/>
                        </NavItem>

                        <NavItem eventKey={1}>
                            Table of Contents
                        </NavItem>
                        <NavItem eventKey={2}>
                            All Rules
                        </NavItem>
                        <NavItem eventKey={3}>
                            Violated Rules
                        </NavItem>
                        <NavItem eventKey={4}>
                            Mined Design Rules
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }

}

// map state to props
function mapStateToProps(state) {
    return {
        history: state.hashManager.history,
        activeHashIndex: state.hashManager.activeHashIndex,
        forwardDisable: state.hashManager.forwardDisable,
        backDisable: state.hashManager.backDisable
    };
}

function mapDispatchToProps(dispatch) {
    return {
        backClick: (props) => {
            if (props.activeHashIndex > 0) {
                dispatch(clickedOnBack());
                window.location.hash = props.history[props.activeHashIndex - 1];
            }
        },
        forwardClick: (props) => {
            if (props.activeHashIndex < props.history.length - 1) {
                dispatch(clickedOnForward());
                window.location.hash = props.history[props.activeHashIndex + 1];
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);