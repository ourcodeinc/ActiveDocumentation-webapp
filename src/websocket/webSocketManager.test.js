import WebSocketManager from "./webSocketManager";
import {processReceivedMessage} from "../core/processMessages"; // Ensure this import is included at the top of your test file

// Add a mock for processReceivedMessage
jest.mock("../core/processMessages", () => ({
    processReceivedMessage: jest.fn(),
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
            readyState: 0, // WebSocket.CONNECTING Default state
        };
        global.WebSocket = jest.fn(() => mockWebSocket);
        instance = new WebSocketManager(mockUrl, mockDispatch);
    });

    afterEach(() => {
        jest.clearAllMocks();
        instance = null;
        WebSocketManager.instance = null;
    });

    describe("suite 1: ", () => {
        afterAll(() => {
            if (instance && instance.webSocket) {
                instance.webSocket.close();
            }
            delete global.WebSocket;
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

                expect(console.error).toHaveBeenCalled();
            });
        });

        describe("WebSocket Message Processing", () => {
            it("should handle incoming WebSocket messages and call processReceivedMessage", () => {
                const mockMessage = {data: JSON.stringify({command: "ENTER", data: {}})};
                console.log = jest.fn();
                instance.webSocket.onmessage(mockMessage);

                expect(processReceivedMessage).toHaveBeenCalledWith(mockMessage.data, mockDispatch);
            });
        });

        describe("WebSocket Close Method", () => {
            it("should close the WebSocket connection when close() is called", () => {
                instance.close();
                expect(instance.webSocket.close).toHaveBeenCalled();
            });
        });
    });


    describe("Suite 2", () => {
        afterAll(() => {
            if (instance && instance.webSocket) {
                instance.webSocket.close();
            }
            delete global.WebSocket;
            instance = null;
        });

        describe("WebSocketManager Singleton", () => {
            it("should return the same instance on multiple instantiations", () => {
                const instance1 = new WebSocketManager(mockUrl, mockDispatch);
                expect(instance).toBe(instance1,
                    "Expected both WebSocketManager instances to be the same, but they are different.");
            });

            it("should not create a new WebSocket on subsequent instantiations", () => {
                const instance1 = new WebSocketManager(mockUrl, mockDispatch);
                expect(WebSocket).toHaveBeenCalledTimes(1, "Expected WebSocket to not be created again, but it was.");
                expect(instance).toBe(instance1,
                    "Expected both WebSocketManager instances to be the same, but they are different.");
            });
        });
    });

    describe("Suite 3", () => {
        afterAll(() => {
            if (instance && instance.webSocket) {
                instance.webSocket.close();
            }
            delete global.WebSocket;
            instance = null;
        });

        describe("WebSocket Send Method", () => {
            it("should send a message when WebSocket is open", () => {
                const mockMessage = {command: "ENTER", data: {}};
                instance.isReady = jest.fn().mockReturnValue(true);

                console.error = jest.fn();
                console.log = jest.fn();

                console.log("WebSocket readyState before send:", instance.webSocket.readyState);
                instance.send(mockMessage);
                expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify(mockMessage));
                expect(console.log).toHaveBeenCalled();
            });

            it("should not send a message when WebSocket is not open", () => {
                const mockMessage = {command: "ENTER", data: {}};
                instance.isReady = jest.fn().mockReturnValue(false);
                console.error = jest.fn();
                console.log = jest.fn();

                instance.send(mockMessage);

                expect(mockWebSocket.send).not.toHaveBeenCalled();
                expect(console.error).toHaveBeenCalled();
            });
        });
    });

    describe("Suite 4", () => {
        afterAll(() => {
            if (instance && instance.webSocket) {
                instance.webSocket.close();
            }
            delete global.WebSocket;
            instance = null;
        });

        describe("WebSocket Ready State Check", () => {
            it("should return true when WebSocket is open", () => {
                mockWebSocket.readyState = WebSocket.OPEN; // WebSocket.OPEN
                expect(instance.webSocket).not.toBe(null);
                expect(instance.webSocket.readyState === 1);
                expect(instance.isReady()).toBe(true);
            });

            it("should return false when WebSocket is not open", () => {
                mockWebSocket.readyState = 3; // WebSocket.CLOSED
                instance = new WebSocketManager(mockUrl, mockDispatch);
                instance.webSocket = mockWebSocket;
                expect(instance.isReady()).toBe(false);
            });
        });
    });
});
