/**
 * Created by saharmehrpour on 9/6/17.
 */


import React, {Component} from 'react';
import '../App.css';
import FaArrowLeft from 'react-icons/lib/fa/arrow-left';
import FaArrowRight from 'react-icons/lib/fa/arrow-right';
import {Nav, Navbar, NavItem} from "react-bootstrap";

// import ReactDOM from 'react-dom';

export class NavBar extends Component {

    render() {
        return (
            <Navbar inverse collapseOnSelect
                    style={{backgroundColor: "transparent", backgroundImage: "none", border: "none"}}>
                <Navbar.Header>
                    <Nav>
                        <NavItem eventKey={1} className="disabled" id="back_button">
                            <FaArrowLeft size={20}/>
                        </NavItem>
                        <NavItem eventKey={2} className="disabled" id="forward_button">
                            <FaArrowRight size={20}/>
                        </NavItem>
                    </Nav>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav
                        onSelect={key => {window.location.hash = (key === 1) ? "#/index" : (key === 2) ? "#/rules" : (key === 3) ? "#/genRule" : "#/index"}}>
                        <NavItem eventKey={1}>
                            Table of Content
                        </NavItem>
                        <NavItem eventKey={2}>
                            Rules
                        </NavItem>
                        <NavItem eventKey={3}>
                            Generate Rules
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }

}


export default NavBar;