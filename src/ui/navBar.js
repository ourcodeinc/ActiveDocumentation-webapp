/**
 * Created by saharmehrpour on 9/6/17.
 */


import React, {Component} from 'react';
import '../App.css';

// import ReactDOM from 'react-dom';

export class NavBar extends Component {

    render() {
        return (
            <div className="container-fluid">
                <ul className="nav navbar-nav">
                    <li className="disabled"><a id="back_button">Previous</a></li>
                    <li className="disabled"><a id="forward_button">Next</a></li>
                </ul>
                <ul className="nav navbar-nav navbar-right">
                    <li><a href="#/index">Table of Content</a></li>
                    <li><a href="#/rules">Rules</a></li>
                    <li className="disabled"><a>Generate Rules</a></li>
                </ul>
            </div>
        )
    }

}


export default NavBar;