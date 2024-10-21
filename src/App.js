import "./App.css";
import {Component} from "react";
import {connect} from "react-redux";
import WebSocketManager from "./webSocket/webSocketManager";
import config from "./config";
import NavBar from "./ui/navBar";
import HeaderBar from "./ui/headerBar";

class App extends Component {
    constructor(props) {
        super(props);

        if (window.Prototype) {
            delete Array.prototype.toJSON;
        }

        if (!window.WebSocket) {
            alert("FATAL: WebSocket not natively supported. ActiveDocumentation will not work.");
        }

        window.location.hash = "#/index";

        this.state = {
            loadingGif: props.loadingGif,
            loadingMessage: props.loadingMessage,
            webSocketManager: null,
        };
    }

    componentDidMount() {
        const webSocketManager = new WebSocketManager(`ws://localhost:${config.websocketPort}`, this.props.dispatch);
        this.setState({webSocketManager});
    }

    componentWillUnmount() {
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
                <div className="main container">
                    <HeaderBar id="headerBar" webSocketManager={this.state.webSocketManager} />
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
}

function mapStateToProps(reduxState) {
    return {
        loadingGif: reduxState.loadingGif,
        loadingMessage: reduxState.loadingMessage,
    };
}

export default connect(mapStateToProps, null)(App);
