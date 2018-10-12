/**
 * Created by saharmehrpour on 9/17/18.
 */

import React, {Component, Fragment} from 'react';

import {MenuItem, Dropdown} from 'react-bootstrap';
import MdAddBox from 'react-icons/lib/md/add-box';
import {RootCloseWrapper} from "react-overlays";
import {FaTag} from "react-icons/lib/fa/index";

class CustomDropDown extends Component {
    constructor(props) {
        super(props);

        if (!props.menuItems || !props.onSelectFunction)
            return new Error(`'menuItems' and 'onSelectFunction' are required in props`);

        this.state = {
            menuItems: props.menuItems,
            onSelectFunction: props.onSelectFunction,
            id: props.id ? props.id : "dropdown-custom-menu",
            open: false
        }
    }

    render() {
        return (
            <RootCloseWrapper onRootClose={() => this.setState({open: false})}>
                <Dropdown id={this.state.id} open={this.state.open}
                          onToggle={() => this.setState({open: !this.state.open})}>
                    <CustomToggle bsRole="toggle">
                        <FaTag size={25} className={"faTag"}/>
                    </CustomToggle>
                    <CustomMenu bsRole="menu">
                        {this.state.menuItems.map((el, i) =>
                            (<MenuItem eventKey={el} key={i}
                                       onSelect={this.state.onSelectFunction}
                            >{(() => el !== "New Tag" ? el :
                                <Fragment><MdAddBox size={20} className={"mdAddBox"}/> {el}</Fragment>)()}
                            </MenuItem>)
                        )}
                    </CustomMenu>
                </Dropdown>
            </RootCloseWrapper>
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

export default CustomDropDown;