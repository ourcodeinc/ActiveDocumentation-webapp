import "./App.css";
import {Component} from "react";
import WebSocketManager from "./websocket/webSocketManager";
import {connect} from "react-redux";
import config from "./config";

class App extends Component {
    constructor(props) {
        super(props);
        this.websocketManager = null;
    }

    render() {
        return (
            <div className="App">
                {this.renderLoading()}
                Contents
                <button onClick={()=>{
                    this.websocketManager.ws.send("{command:\"msg\",data:\"Hello from React!\"}");
                }}>Send</button>
            </div>
        );
    }

    componentDidMount() {
        this.websocketManager = new WebSocketManager(`ws://localhost:${config.websocketPort}`, this.props.dispatch);
    }

    componentWillUnmount() {
        if (this.websocketManager) {
            this.websocketManager.close();
        }
    }

    renderLoading() {
        const loadingTitle = "Loading Files and Rules";
        return (<div id={"loadingGif"} data-testid="loadingGif"
            className={(this.props.loadingGif ? "" : "hidden")}>
            <div className={"overlayLoading"}>
                <div className={"spinnerContainer"}>
                    <div className={"loadingTitle"}>
                        <h3>{loadingTitle}</h3>
                    </div>
                    <div className="spinner"/>
                </div>
            </div>
        </div>);
    }
}

function mapStateToProps(reduxState) {
    return {
        loadingGif: reduxState.loadingGif,
    };
}

export default connect(mapStateToProps, null)(App);
