/**
 * Created by saharmehrpour on 3/29/18.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import '../../App.css';

class CustomMenu extends React.Component {
    // constructor(props, context) {
    //     super(props, context);
    // }

    focusNext() {
        const input = ReactDOM.findDOMNode(this.input);

        if (input) {
            input.focus();
        }
    }

    render() {
        const {children} = this.props;

        return (
            <div className="dropdown-menu">
                {React.Children.toArray(children)}
            </div>
        );
    }
}

export default CustomMenu;
