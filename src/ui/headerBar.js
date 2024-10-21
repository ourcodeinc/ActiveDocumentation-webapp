import React, {Component} from "react";
import "../App.css";
import {GoAlert} from "react-icons/go";
import {HASH_CONSTANTS} from "./uiConstants";
import {FaInfoCircle} from "react-icons/fa";
import {Tooltip} from "react-tooltip";

export class HeaderBar extends Component {
    constructor(props) {
        super(props);

        const hash = window.location.hash.split("/").slice(1);
        this.state = {
            hash: hash,
            webSocketManager: props.webSocketManager ?? null,
        };
    }

    componentDidMount() {
        window.addEventListener("hashchange", this.handleHashChange);
    }

    componentWillUnmount() {
        window.removeEventListener("hashchange", this.handleHashChange);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.webSocketManager !== this.props.webSocketManager) {
            this.setState({
                webSocketManager: this.props.webSocketManager ?? null,
            });
        }
    }

    handleHashChange = () => {
        const hash = window.location.hash.split("/").slice(1);
        this.setState({
            hash: hash,
        });
    }

    render() {
        return (
            <div className="headerBar" id="headerBar">
                {this.renderWebSocketMessage()}
                {this.renderHeader()}
            </div>
        );
    }

    renderWebSocketMessage() {
        if (this.state.webSocketManager && this.state.webSocketManager.isReady()) return null;
        return (
            <div className="webSocketError" data-testid="headerBar">
                <GoAlert size={25} className="react-icons" />
                {"The tool is not connected to the IDE. Please check your IDE. Then refresh the page."}
            </div>
        );
    }

    renderHeader() {
        switch (this.state.hash[0]) {
            case HASH_CONSTANTS.INDEX:
                return (
                    <div className="pageInfo">
                        <h3>{"ActiveDocumentation"}</h3>
                    </div>
                );
            case HASH_CONSTANTS.ALL_RULES:
                return (
                    <div className="pageInfo">
                        <h3>{"All Rules"}</h3>
                        <FaInfoCircle className="infoIcon" data-tooltip-content="View and manage all documentated rules." data-tooltip-id="allRules-tooltip" />
                        <Tooltip id="allRules-tooltip" place="right" />
                    </div>
                );
            case HASH_CONSTANTS.VIOLATED_RULES:
                return (
                    <div className="pageInfo">
                        <h3>{"Violated Rules"}</h3>
                        <FaInfoCircle className="infoIcon" data-tooltip-content="View and manage violated documentated rules." data-tooltip-id="violatedRules-tooltip" />
                        <Tooltip id="violatedRules-tooltip" place="right" />
                    </div>
                );
            default:
                return (
                    <div>
                        <h3>{this.state.hash[0]}</h3>
                    </div>
                );
        }
    }
}

export default HeaderBar;
