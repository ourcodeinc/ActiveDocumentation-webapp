import WebSocketManager from "./webSocketManager";
import {updateLoadingGif} from "../redux/reduxActions";

describe("WebSocketManager", () => {
    let mockWebSocket;
    const mockUrl = "ws://localhost:8887";
    const mockDispatch = jest.fn();
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

        instance = new WebSocketManager(mockUrl, mockDispatch);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should instantiate a WebSocket with the given URL", () => {
        expect(WebSocket).toHaveBeenCalledWith(mockUrl);
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

    it("should log a message when the WebSocket connection opens", () => {
        console.log = jest.fn();

        // Simulate the WebSocket opening
        instance.ws.onopen();

        expect(console.log).toHaveBeenCalledWith("WebSocket connection opened");
    });

    it("should handle invalid JSON messages gracefully", () => {
        const invalidMessage = {data: "{Invalid JSON"};

        // Spy on console.error to ensure errors are logged
        console.error = jest.fn();

        // Simulate receiving an invalid message
        instance.ws.onmessage(invalidMessage);

        expect(console.error)
            .toHaveBeenCalledWith("The received message is empty or invalid");
    });

    it("should handle empty messages", () => {
        const emptyMessage = {data: JSON.stringify({})};

        // Simulate receiving an empty message
        instance.ws.onmessage(emptyMessage);

        // Check that processReceivedMessage was called with an empty command
        expect(mockDispatch).not.toHaveBeenCalled(); // Ensure nothing is dispatched
    });

    it("should handle incoming WebSocket messages and call processReceivedMessage", () => {
        const mockMessage = {data: JSON.stringify(
            {command: "ENTER", data: {}},
        )};
        const spyProcessMessage = jest.spyOn(instance, "processReceivedMessage");

        // Simulate receiving a message
        instance.ws.onmessage(mockMessage);

        expect(spyProcessMessage).toHaveBeenCalledWith(expect.objectContaining({
            command: "ENTER",
        }));
    });

    it("should dispatch updateLoadingGif action when receiving ENTER", () => {
        const mockMessage = {data: JSON.stringify(
            {command: "ENTER", data: {}},
        )};

        // Simulate receiving a message
        instance.ws.onmessage(mockMessage);

        // Check if the mockDispatch was called
        expect(mockDispatch).toHaveBeenCalled();

        // Check if the specific action was dispatched
        expect(mockDispatch).toHaveBeenCalledWith(updateLoadingGif(true));
    });


    it("should not dispatch any action for LEFT", () => {
        const mockMessage = {data: JSON.stringify(
            {command: "LEFT", data: {}},
        )};

        // Simulate receiving a message
        instance.ws.onmessage(mockMessage);

        expect(mockDispatch).not.toHaveBeenCalled();
    });
});
