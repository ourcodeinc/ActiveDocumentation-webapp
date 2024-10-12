class WebSocketManager {
    /**
     * @param url {string} The WebSocket server URL to connect to.
     * To connect with the plugins, the url should be "ws://localhost:8887"
     */
    constructor(url) {
        this.ws = new WebSocket(url);

        // Set up event listeners
        this.ws.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            this.processReceivedMessage(newMessage);
        };

        this.ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        this.ws.onclose = () => {
            console.log("WebSocket connection closed");
        };
    }

    processReceivedMessage(newMessage) {
        console.log("Received:", newMessage);
        // todo
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

export default WebSocketManager;
