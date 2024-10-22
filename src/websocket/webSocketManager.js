import {processReceivedMessage} from "../core/processMessages";

class WebSocketManager {
    /**
     * @param {string} url The WebSocket server URL to connect to.
     * To connect with the plugins, the url should be "ws://localhost:8887"
     * @param dispatch for dispatching redux actions
     * @param onReady callback function to notify the ready state
     */
    constructor(url, dispatch, onReady) {
        this.webSocket = new WebSocket(url);
        this.dispatch = dispatch;
        this.onReady = onReady;

        this.webSocket.onmessage = async (event) => {
            console.log("WebSocketManager.js:", "WebSocket received a message:", event.data);
            processReceivedMessage(event.data, this.dispatch);
        };

        this.webSocket.onerror = (error) => {
            console.error("WebSocketManager.js:", "WebSocket error:", error);
        };

        this.webSocket.onopen = () => {
            console.log("WebSocketManager.js:", "WebSocket connection opened");
            if (this.onReady) {
                this.onReady();
            }
        };

        this.webSocket.onclose = () => {
            console.log("WebSocketManager.js:", "WebSocket connection closed");
        };
    }

    close() {
        if (this.webSocket) {
            this.webSocket.close();
        }
    }

    /**
     * sends the message to the IDE
     * @param {command: string, data: {}} message
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
