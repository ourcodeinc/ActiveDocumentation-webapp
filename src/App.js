import "./App.css";
import {Component} from "react";
import WebSocketManager from "./websocket";

class App extends Component {
    constructor(props) {
        super(props);
        this.websocketManager = null;
    }

    render() {
        return (
            <div className="App">
                Contents
            </div>
        );
    }

    componentDidMount() {
        this.websocketManager = new WebSocketManager("ws://localhost:8887");
    }

    componentWillUnmount() {
        if (this.websocketManager) {
            this.websocketManager.close();
        }
    }
}

export default App;
