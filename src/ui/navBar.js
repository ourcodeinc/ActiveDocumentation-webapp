/**
 * Created by saharmehrpour on 9/6/17.
 */


import React, {Component} from "react";
import "../App.css";
import {Nav, Navbar, NavItem} from "react-bootstrap";
import {connect} from "react-redux";
import {hashConst} from "./uiConstants";
import {featureConfig} from "../config";

export class NavBar extends Component {
    render() {
        return (
            <Navbar inverse collapseOnSelect style={{backgroundColor: "transparent", backgroundImage: "none", border: "none"}}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#/index">
                            <img src="/OurCode-icon.png" alt="Logo" className="navbar-icon grayscale"/>
                        </a>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav
                        onSelect={(key) => {
                            if (key > 0) {
                                window.location.hash = (key === 1) ? `#/${hashConst.index}` : (key === 2) ? `#/${hashConst.rules}` :
                                    (key === 3) ? `#/${hashConst.violatedRules}` : (key === 4) ? `#/${hashConst.learnDesignRules}` : `#/${hashConst.index}`;
                            }
                        }}>

                        <NavItem eventKey={1}>
                            {"Table of Contents"}
                        </NavItem>
                        <NavItem eventKey={2}>
                            {"All Rules"}
                        </NavItem>
                        <NavItem eventKey={3}>
                            {"Violated Rules"}
                        </NavItem>
                        <NavItem eventKey={4} disabled={!featureConfig.MiningRules}>
                            {"Learn Design Rules"} {featureConfig.MiningRules? "": " (Disabled)"}
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

// map state to props
function mapStateToProps(state) {
    return {
        history: state.hashManager.history,
        activeHashIndex: state.hashManager.activeHashIndex,
        forwardDisable: state.hashManager.forwardDisable,
        backDisable: state.hashManager.backDisable,
    };
}

export default connect(mapStateToProps)(NavBar);
