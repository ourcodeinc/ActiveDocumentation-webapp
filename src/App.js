import "./App.css";
import {Component} from "react";
import {connect} from "react-redux";
import WebSocketManager from "./webSocket/webSocketManager";
import {CONFIG} from "./config";
import NavBar from "./ui/navBar";
import HeaderBar from "./ui/headerBar";
import TableOfContents from "./ui/tableOfContents";
import {HASH_CONSTANTS} from "./ui/uiConstants";

class App extends Component {
    constructor(props) {
        super(props);

        if (window.Prototype) {
            delete Array.prototype.toJSON;
        }

        if (!window.WebSocket) {
            alert("FATAL: WebSocket not natively supported. ActiveDocumentation will not work.");
        }

        window.location.hash = "#/" + HASH_CONSTANTS.INDEX;

        this.state = {
            loadingGif: props.loadingGif,
            loadingMessage: props.loadingMessage,
            webSocketManager: null,
            hash: HASH_CONSTANTS.INDEX,
        };
    }

    handleHashChange = () => {
        const hashes = window.location.hash.split("/").slice(1);
        this.setState({
            hash: hashes[0] ?? HASH_CONSTANTS.INDEX,
        });
    }

    componentDidMount() {
        const webSocketManager = new WebSocketManager(`ws://localhost:${CONFIG.WEBSOCKET_PORT}`, this.props.dispatch);
        window.addEventListener("hashchange", this.handleHashChange);
        this.setState({webSocketManager});
    }

    componentWillUnmount() {
        window.removeEventListener("hashchange", this.handleHashChange);
        if (this.state.webSocketManager) {
            this.state.webSocketManager.close();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.loadingGif !== this.props.loadingGif ||
            prevProps.loadingMessage !== this.props.loadingMessage) {
            this.setState({
                loadingGif: this.props.loadingGif,
                loadingMessage: this.props.loadingMessage,
            });
        }
    }

    render() {
        return (
            <div className="App">
                {this.renderLoading()}
                <nav className="navbar navbar-inverse" id="navBar" data-testid="navbar">
                    <NavBar />
                </nav>
                <div>
                    <div className="main container">
                        <HeaderBar id="headerBar" webSocketManager={this.state.webSocketManager} />
                        {this.renderMainContents()}
                    </div>
                    <div style={{width: "100%", height: "100px"}} />
                </div>
            </div>
        );
    }

    renderLoading() {
        if (!this.state.loadingGif) return null;
        return (<div id="loadingGif" data-testid="loadingGif">
            <div className="overlayLoading">
                <div className="spinnerContainer">
                    <div className="loadingTitle">
                        <h3>{this.state.loadingMessage}</h3>
                    </div>
                    <div className="spinner" />
                </div>
            </div>
        </div>);
    }

    renderMainContents() {
        switch (this.state.hash) {
            case HASH_CONSTANTS.INDEX:
                return (
                    <div id={"tableOfContent"} data-testid="tableOfContent"
                        className={(this.state.hash === HASH_CONSTANTS.INDEX) ? "text-align-left" : "text-align-left hidden"}>
                        <TableOfContents/>
                    </div>
                );
            default:
                return null;
        }
    }
}

function mapStateToProps(reduxState) {
    return {
        loadingGif: reduxState.loadingGif,
        loadingMessage: reduxState.loadingMessage,
    };
}

export default connect(mapStateToProps, null)(App);
