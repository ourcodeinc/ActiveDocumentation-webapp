import {processReceivedMessage, parseReceivedWebSocketMessage} from "./processMessages";
import {createDefaultObjectFromStructure} from "./utilities";
import {WEBSOCKET_MESSAGE_STRUCTURE, WEBSOCKET_RECEIVED_MESSAGE} from "../webSocket/webSocketConstants";
import {LOADING_GIF_MESSAGES} from "../ui/uiConstants";
import {updateLoadingGif} from "../redux/reduxActions";
import {validRules} from "./types";

jest.mock("../redux/reduxActions", () => ({
    updateLoadingGif: jest.fn(),
}));

jest.mock("./types", () => ({
    validRules: jest.fn(),
}));

describe("parseReceivedWebSocketMessage", () => {
    beforeEach(() => {
        console.log = jest.fn();
        console.error = jest.fn();
    });

    it("should return a parsed message for a valid WebSocket message", () => {
        const validMessage = JSON.stringify({
            command: "WEBSOCKET_CONNECTED_MSG",
            data: {},
        });

        const result = parseReceivedWebSocketMessage(validMessage);
        expect(result).toEqual({
            command: "WEBSOCKET_CONNECTED_MSG",
            data: {},
        });
    });

    it("should return default message for an invalid JSON string", () => {
        const invalidJsonMessage = "{\"command\": \"WEBSOCKET_CONNECTED_MSG\", data:}"; // Invalid JSON

        const defaultMessage = createDefaultObjectFromStructure(WEBSOCKET_MESSAGE_STRUCTURE);
        const result = parseReceivedWebSocketMessage(invalidJsonMessage);

        expect(result).toEqual(defaultMessage);
    });

    it("should return default message for a valid JSON but invalid structure", () => {
        const invalidStructureMessage = JSON.stringify({
            command: "WEBSOCKET_CONNECTED_MSG",
            invalidField: "Invalid data",
        });

        const defaultMessage = createDefaultObjectFromStructure(WEBSOCKET_MESSAGE_STRUCTURE);
        const result = parseReceivedWebSocketMessage(invalidStructureMessage);

        expect(result).toEqual(defaultMessage);
    });

    it("should return the default message if input is null", () => {
        const result = parseReceivedWebSocketMessage(null);

        const defaultMessage = createDefaultObjectFromStructure(WEBSOCKET_MESSAGE_STRUCTURE);
        expect(result).toEqual(defaultMessage);
    });

    it("should return the default message if input is an empty string", () => {
        const result = parseReceivedWebSocketMessage("");

        const defaultMessage = createDefaultObjectFromStructure(WEBSOCKET_MESSAGE_STRUCTURE);
        expect(result).toEqual(defaultMessage);
    });
});


describe("processReceivedMessage", () => {
    const dispatch = jest.fn();

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(jest.fn());
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(jest.fn());

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(require("./processMessages"), "parseReceivedWebSocketMessage").mockImplementation(jest.fn());
    });

    afterAll(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
        jest.resetAllMocks();
    });

    it("should handle WEBSOCKET_CONNECTED_MSG", () => {
        const message = JSON.stringify({
            command: WEBSOCKET_RECEIVED_MESSAGE.WEBSOCKET_CONNECTED_MSG,
        });
        parseReceivedWebSocketMessage.mockReturnValueOnce(JSON.parse(message));
        processReceivedMessage(message, dispatch);

        expect(dispatch).not.toHaveBeenCalled();
    });

    it("should handle WEBSOCKET_DISCONNECTED_MSG", () => {
        const message = JSON.stringify({
            command: WEBSOCKET_RECEIVED_MESSAGE.WEBSOCKET_DISCONNECTED_MSG,
        });
        parseReceivedWebSocketMessage.mockReturnValueOnce(JSON.parse(message));
        processReceivedMessage(message, dispatch);

        expect(dispatch).not.toHaveBeenCalled();
    });

    it("should dispatch updateLoadingGif for valid RULE_TABLE_MSG", () => {
        const validMessage = JSON.stringify({
            command: WEBSOCKET_RECEIVED_MESSAGE.RULE_TABLE_MSG,
            data: {someProperties: []},
        });
        parseReceivedWebSocketMessage.mockReturnValueOnce(JSON.parse(validMessage));
        validRules.mockReturnValueOnce([]);
        processReceivedMessage(validMessage, dispatch);

        expect(dispatch).toHaveBeenCalledWith(updateLoadingGif(true, LOADING_GIF_MESSAGES.LOADING_RULES));
    });

    it("should log an error for empty or invalid command", () => {
        const invalidMessage = JSON.stringify({
            command: "",
        });
        parseReceivedWebSocketMessage.mockReturnValueOnce(JSON.parse(invalidMessage));
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        processReceivedMessage(invalidMessage, dispatch);

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });
});
