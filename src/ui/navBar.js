import React, {Component} from "react";
import "../App.css";
import {Nav, Navbar, Container} from "react-bootstrap";
import {HASH_CONSTANTS} from "./uiConstants";

export class NavBar extends Component {
    handleSelect(eventKey) {
        const hashRoutes = {
            1: `#/${HASH_CONSTANTS.INDEX}`,
            2: `#/${HASH_CONSTANTS.ALL_RULES}`,
            3: `#/${HASH_CONSTANTS.VIOLATED_RULES}`,
        };

        window.location.hash = hashRoutes[eventKey] || `#/${HASH_CONSTANTS.INDEX}`;
    }

    render() {
        return (
            <Navbar bg="dark" expand="lg" data-bs-theme="dark" fixed="top">
                <Container>
                    <Navbar.Brand href="#/index">
                        <img
                            src="/logo512.png"
                            alt="Logo"
                            className="navbar-icon grayscale"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto" onSelect={this.handleSelect}>
                            <Nav.Link eventKey="1">Table of Contents</Nav.Link>
                            <Nav.Link eventKey="2">All Rules</Nav.Link>
                            <Nav.Link eventKey="3">Violated Rules</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}

export default NavBar;
