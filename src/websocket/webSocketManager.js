import {parseJson} from "../core/utilities";
import {WEBSOCKET_RECEIVED_MESSAGE} from "./webSocketConstants";
import {updateLoadingGif} from "../redux/reduxActions";
import {LOADING_GIF_MESSAGES} from "../ui/uiConstants";

class WebSocketManager {
    /**
     * @param url {string} The WebSocket server URL to connect to.
     * To connect with the plugins, the url should be "ws://localhost:8887"
     * @param dispatch for dispatching redux actions
     */
    constructor(url, dispatch) {
        this.webSocket = new WebSocket(url);
        this.dispatch = dispatch;

        this.webSocket.onmessage = async (event) => {
            this.processReceivedMessage(event.data);
        };

        this.webSocket.onerror = (error) => {
            console.error("WebSocketManager.js:", "WebSocket error:", error);
        };

        this.webSocket.onopen = () => {
            console.log("WebSocketManager.js:", "WebSocket connection opened");
        };

        this.webSocket.onclose = () => {
            console.log("WebSocketManager.js:", "WebSocket connection closed");
        };
    }

    /**
     * @param receivedMessage {string}
     */
    processReceivedMessage(receivedMessage) {
        console.log("WebSocketManager.js:", "Received:", receivedMessage);
        const newMessage = parseJson(receivedMessage, "Received Message", {command: "", data: {}});
        switch (newMessage.command) {
            case WEBSOCKET_RECEIVED_MESSAGE.ENTER_CHAT_MSG:
                this.dispatch(updateLoadingGif(true, LOADING_GIF_MESSAGES.LOADING_RULES));
                break;

            case WEBSOCKET_RECEIVED_MESSAGE.LEFT_CHAT_MSG:
                break;

            case "":
                console.error("WebSocketManager.js:", "The received message is empty or invalid");
                break;
        }
    }

    close() {
        if (this.webSocket) {
            this.webSocket.close();
        }
    }

    /**
     * sends the message to the IDE
     * @param message {command: string, data: {}}
     */
    send(message) {
        if (this.isReady()) {
            this.webSocket.send(JSON.stringify(message));
            console.log("WebSocketManager.js:", "Message sent:", message);
        } else {
            console.error("WebSocketManager.js:", "WebSocket is not open. Message not sent:", message);
        }
    }

    isReady() {
        return (this.webSocket && this.webSocket.readyState === WebSocket.OPEN);
    }
}

export default WebSocketManager;
