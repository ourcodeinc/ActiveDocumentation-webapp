import WebSocketManager from "./websocket";

describe("WebSocketManager", () => {
    let mockWebSocket;
    const mockUrl = "ws://localhost:8887";
    let instance;

    beforeEach(() => {
        mockWebSocket = {
            onmessage: null,
            onerror: null,
            onclose: jest.fn(),
            close: jest.fn(),
            send: jest.fn(),
        };
        global.WebSocket = jest.fn(() => mockWebSocket);

        instance = new WebSocketManager(mockUrl);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should instantiate a WebSocket with the given URL", () => {
        expect(WebSocket).toHaveBeenCalledWith(mockUrl);
    });

    it("should handle incoming WebSocket messages and call processReceivedMessage", () => {
        const mockMessage = {data: JSON.stringify({text: "Hello, world!"})};
        const spyProcessMessage = jest.spyOn(instance, "processReceivedMessage");

        // Simulate receiving a message
        instance.ws.onmessage(mockMessage);

        expect(spyProcessMessage).toHaveBeenCalledWith({text: "Hello, world!"});
    });

    it("should log errors when the WebSocket encounters an error", () => {
        const mockError = {message: "Connection error"};
        console.error = jest.fn();

        // Simulate a WebSocket error
        instance.ws.onerror(mockError);

        expect(console.error).toHaveBeenCalledWith("WebSocket error:", mockError);
    });

    it("should log a message when the WebSocket connection closes", () => {
        console.log = jest.fn();

        // Simulate WebSocket closing
        instance.ws.onclose();

        expect(console.log).toHaveBeenCalledWith("WebSocket connection closed");
    });

    it("should close the WebSocket connection when close() is called", () => {
        instance.close();
        expect(instance.ws.close).toHaveBeenCalled();
    });
});
