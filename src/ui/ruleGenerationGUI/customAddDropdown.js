/**
 * Created by saharmehrpour on 9/17/18.
 */

import React, {Component} from 'react';

import {MenuItem, Dropdown, DropdownButton} from 'react-bootstrap';
import MdAddBox from 'react-icons/lib/md/add-box';
import {RootCloseWrapper} from "react-overlays";


export class CustomAddDropDown extends Component {
    constructor(props) {
        super(props);

        if (!props.menuItemsText || !props.onSelectFunction || !props.menuItemsEvent)
            console.error(`'menuItemsEvent', 'menuItemsText' and 'onSelectFunction' are required in props`);

        this.state = {
            menuItemsText: props.menuItemsText,
            menuItemsEvent: props.menuItemsEvent,
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
                        <MdAddBox size={25} className={"mdAddBox"}/>
                    </CustomToggle>
                    <CustomMenu bsRole="menu">
                        {this.state.menuItemsEvent.map((el, i) =>
                            (<MenuItem eventKey={el} key={i}
                                       onSelect={this.state.onSelectFunction}
                            > {this.state.menuItemsText[i]}
                            </MenuItem>)
                        )}
                    </CustomMenu>
                </Dropdown>
            </RootCloseWrapper>
        )
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            menuItemsText: nextProps.menuItemsText,
            menuItemsEvent: nextProps.menuItemsEvent,
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

export class CustomFollowDropDown extends Component {

    constructor(props) {
        super(props);

        if (!props.menuItemsText || !props.onSelectFunction || !props.menuItemsEvent)
            console.error(`'menuItemsEvent', 'menuItemsText' and 'onSelectFunction' are required in props`);

        this.state = {
            menuItemsText: props.menuItemsText,
            menuItemsEvent: props.menuItemsEvent,
            onSelectFunction: props.onSelectFunction,
            id: props.id ? props.id : "dropdown-follow",
            open: false
        }
    }

    render() {
        return (<DropdownButton title={`follows`} className={this.state.target} id={this.state.id}>
                {this.state.menuItemsEvent.map((el, i) => {
                    return (
                        <MenuItem eventKey={el} key={i}
                                  onSelect={this.state.onSelectFunction}
                        >{this.state.menuItemsText[i]}
                        </MenuItem>);
                })}
            </DropdownButton>
        )
    }
}
