import {parseJson} from "./core/utilities";
import {WEBSOCKET_RECEIVED_MESSAGE} from "./core/websocketConstants";
import {updateLoadingGif} from "./redux/reduxActions";


class WebSocketManager {
    /**
     * @param url {string} The WebSocket server URL to connect to.
     * To connect with the plugins, the url should be "ws://localhost:8887"
     * @param dispatch for dispatching redux actions
     */
    constructor(url, dispatch) {
        this.ws = new WebSocket(url);
        this.dispatch = dispatch;

        this.ws.onmessage = async (event) => {
            /**
             * @type {{command: string, data: {}}}
             */
            const newMessage = parseJson(event.data, "the received message", {command: ""});
            this.processReceivedMessage(newMessage);
        };

        this.ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        this.ws.onopen = () => {
            console.log("WebSocket connection opened");
        };

        this.ws.onclose = () => {
            console.log("WebSocket connection closed");
        };
    }

    /**
     * @param newMessage {{command: string, data: {}}}
     */
    processReceivedMessage(newMessage) {
        console.log("Received:", newMessage);
        switch (newMessage.command) {
            case WEBSOCKET_RECEIVED_MESSAGE.ENTER_CHAT_MSG:
                this.dispatch(updateLoadingGif(true));
                break;

            case WEBSOCKET_RECEIVED_MESSAGE.LEFT_CHAT_MSG:
                break;

            case "":
                console.error("The received message is empty or invalid");
                break;
        }
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

export default WebSocketManager;
