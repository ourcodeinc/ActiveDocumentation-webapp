import WebSocketManager from "./webSocketManager";
import {updateLoadingGif} from "../redux/reduxActions";

jest.mock("../redux/reduxActions", () => ({
    updateLoadingGif: jest.fn(),
}));

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
            readyState: WebSocket.CONNECTING, // Default state
        };
        global.WebSocket = jest.fn(() => mockWebSocket);

        instance = new WebSocketManager(mockUrl, mockDispatch);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("WebSocket Initialization", () => {
        it("should instantiate a WebSocket with the given URL", () => {
            expect(WebSocket).toHaveBeenCalledWith(mockUrl);
        });

        it("should log a message when the WebSocket connection opens", () => {
            console.log = jest.fn();
            instance.webSocket.onopen();

            expect(console.log).toHaveBeenCalledWith("WebSocketManager.js:", "WebSocket connection opened");
        });

        it("should log a message when the WebSocket connection closes", () => {
            console.log = jest.fn();
            instance.webSocket.onclose();

            expect(console.log).toHaveBeenCalledWith("WebSocketManager.js:", "WebSocket connection closed");
        });
    });

    describe("WebSocket Error Handling", () => {
        it("should log errors when the WebSocket encounters an error", () => {
            const mockError = {message: "Connection error"};
            console.error = jest.fn();
            instance.webSocket.onerror(mockError);

            expect(console.error).toHaveBeenCalledWith("WebSocketManager.js:", "WebSocket error:", mockError);
        });
    });

    describe("WebSocket Message Processing", () => {
        it("should handle invalid JSON messages gracefully", () => {
            const invalidMessage = {data: "{Invalid JSON"};
            console.error = jest.fn();
            instance.webSocket.onmessage(invalidMessage);

            expect(console.error)
                .toHaveBeenCalledWith("WebSocketManager.js:", "The received message is empty or invalid");
        });

        it("should handle empty messages", () => {
            const emptyMessage = {data: JSON.stringify({})};
            instance.webSocket.onmessage(emptyMessage);

            expect(mockDispatch).not.toHaveBeenCalled();
        });

        it("should handle incoming WebSocket messages and call processReceivedMessage", () => {
            const mockMessage = {data: JSON.stringify(
                {command: "ENTER", data: {}},
            )};
            const spyProcessMessage = jest.spyOn(instance, "processReceivedMessage");
            instance.webSocket.onmessage(mockMessage);

            expect(spyProcessMessage).toHaveBeenCalledWith(mockMessage.data);
        });

        it("should dispatch updateLoadingGif action when receiving ENTER", () => {
            const mockMessage = {data: JSON.stringify(
                {command: "ENTER", data: {}},
            )};
            instance.webSocket.onmessage(mockMessage);

            expect(mockDispatch).toHaveBeenCalled();
            expect(mockDispatch).toHaveBeenCalledWith(updateLoadingGif(true));
        });

        it("should not dispatch any action for LEFT", () => {
            const mockMessage = {data: JSON.stringify(
                {command: "LEFT", data: {}},
            )};
            instance.webSocket.onmessage(mockMessage);

            expect(mockDispatch).not.toHaveBeenCalled();
        });
    });

    describe("WebSocket Close Method", () => {
        it("should close the WebSocket connection when close() is called", () => {
            instance.close();
            expect(instance.webSocket.close).toHaveBeenCalled();
        });
    });

    describe("WebSocket Send Method", () => {
        it("should send a message when WebSocket is open", () => {
            const mockMessage = {command: "ENTER", data: {}};
            mockWebSocket.readyState = WebSocket.OPEN;

            instance.send(mockMessage);

            expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify(mockMessage));
            expect(console.log).toHaveBeenCalledWith("WebSocketManager.js:", "Message sent:", mockMessage);
        });

        it("should not send a message when WebSocket is not open", () => {
            const mockMessage = {command: "ENTER", data: {}};
            mockWebSocket.readyState = 3; // WebSocket.CLOSED is not working
            console.error = jest.fn();

            instance.send(mockMessage);

            expect(mockWebSocket.send).not.toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith("WebSocketManager.js:", "WebSocket is not open. Message not sent:", mockMessage);
        });
    });

    describe("WebSocket Ready State Check", () => {
        it("should return true when WebSocket is open", () => {
            mockWebSocket.readyState = WebSocket.OPEN;
            expect(instance.isReady()).toBe(true);
        });

        it("should return false when WebSocket is not open", () => {
            mockWebSocket.readyState = 3; // WebSocket.CLOSED is not working
            instance = new WebSocketManager(mockUrl, mockDispatch);
            instance.webSocket = mockWebSocket;
            expect(instance.isReady()).toBe(false);
        });
    });
});
