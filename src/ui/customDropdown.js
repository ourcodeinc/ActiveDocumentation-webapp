/**
 * Created by saharmehrpour on 9/17/18.
 */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {MenuItem, Dropdown} from 'react-bootstrap';
import MdAddBox from 'react-icons/lib/md/add-box';

class CustomDropdown extends Component {
    constructor(props) {
        super(props);

        if (!props.menuItems || !props.onSelectFunction)
            return new Error(`'menuItems' and 'onSelectFunction' are required in props`);

        this.state = {
            menuItems: props.menuItems,
            onSelectFunction: props.onSelectFunction,
            id: props.id ? props.id : "dropdown-custom-menu"
        }
    }

    render() {
        return (
            <Dropdown id={this.state.id}>
                <CustomToggle bsRole="toggle">
                    <MdAddBox size={25} className={"mdAddBox"}/>
                </CustomToggle>
                <CustomMenu bsRole="menu">
                    {this.state.menuItems.map((el, i) =>
                        (<MenuItem eventKey={el} key={i}
                                   onSelect={this.state.onSelectFunction}
                        >{el}
                        </MenuItem>)
                    )}
                </CustomMenu>
            </Dropdown>
        )
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            menuItems: nextProps.menuItems,
            onSelectFunction: nextProps.onSelectFunction,
            id: nextProps.id ? nextProps.id : "dropdown-custom-menu"
        });

    }
}

class CustomMenu extends Component {

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

class CustomToggle extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        this.props.onClick(e);
    }

    render() {
        return (
            <a href="" onClick={this.handleClick}>
                {this.props.children}
            </a>
        );
    }
}

export default CustomDropdown;