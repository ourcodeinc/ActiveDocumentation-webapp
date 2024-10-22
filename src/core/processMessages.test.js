import {processReceivedMessage} from "./processMessages";
import {parseReceivedWebSocketMessage} from "./utilities";
import {WEBSOCKET_RECEIVED_MESSAGE} from "../webSocket/webSocketConstants";
import {updateLoadingGif} from "../redux/reduxActions";
import {LOADING_GIF_MESSAGES} from "../ui/uiConstants";
import {isValidRuleTable} from "./propTypes";

jest.mock("./utilities", () => ({
    parseReceivedWebSocketMessage: jest.fn(),
}));

jest.mock("../redux/reduxActions", () => ({
    updateLoadingGif: jest.fn(),
}));

jest.mock("./propTypes", () => ({
    isValidRuleTable: jest.fn(),
}));

describe("processReceivedMessage", () => {
    let dispatch;

    beforeEach(() => {
        dispatch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Handling WebSocket messages", () => {
        it("should do nothing for ENTER_CHAT_MSG", () => {
            parseReceivedWebSocketMessage.mockReturnValue({
                command: WEBSOCKET_RECEIVED_MESSAGE.ENTER_CHAT_MSG,
            });

            processReceivedMessage("someMessage", dispatch);
            expect(dispatch).not.toHaveBeenCalled();
        });

        it("should do nothing for LEFT_CHAT_MSG", () => {
            parseReceivedWebSocketMessage.mockReturnValue({
                command: WEBSOCKET_RECEIVED_MESSAGE.LEFT_CHAT_MSG,
            });

            processReceivedMessage("someMessage", dispatch);
            expect(dispatch).not.toHaveBeenCalled();
        });

        it("should dispatch loadingGif action for RULE_TABLE_MSG with valid rule table", () => {
            const validRuleTable = [
                {
                    index: 1,
                    title: "Rule 1",
                    description: "Description for rule 1",
                    tags: ["tag1", "tag2"],
                },
                {
                    index: 2,
                    title: "Rule 2",
                    description: "Description for rule 2",
                    tags: ["tag3"],
                },
            ];
            parseReceivedWebSocketMessage.mockReturnValue({
                command: WEBSOCKET_RECEIVED_MESSAGE.RULE_TABLE_MSG,
                data: validRuleTable,
            });
            isValidRuleTable.mockReturnValue(true);
            processReceivedMessage("someMessage", dispatch);

            expect(isValidRuleTable).toHaveBeenCalledWith(validRuleTable);
            expect(dispatch).toHaveBeenCalledWith(updateLoadingGif(true, LOADING_GIF_MESSAGES.LOADING_RULES));
        });

        it("should not dispatch loadingGif action for RULE_TABLE_MSG with invalid rule table", () => {
            const invalidRuleTable = [
                {
                    index: 1,
                    title: "Rule 1",
                    description: "Description for rule 1",
                    tags: ["tag1", "tag2"],
                },
                {
                    index: 2,
                    // Missing title, invalid rule object
                    description: "Description for rule 2",
                    tags: ["tag3"],
                },
            ];
            parseReceivedWebSocketMessage.mockReturnValue({
                command: WEBSOCKET_RECEIVED_MESSAGE.RULE_TABLE_MSG,
                data: invalidRuleTable,
            });
            isValidRuleTable.mockReturnValue(false);
            console.error = jest.fn();
            processReceivedMessage("someMessage", dispatch);

            expect(isValidRuleTable).toHaveBeenCalledWith(invalidRuleTable);
            expect(dispatch).not.toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith("WebSocketManager.js:", "The received ruleTable is not valid.");
        });

        it("should log an error for an empty command", () => {
            parseReceivedWebSocketMessage.mockReturnValue({
                command: "",
            });
            console.error = jest.fn();
            processReceivedMessage("someMessage", dispatch);

            expect(console.error).toHaveBeenCalledWith("WebSocketManager.js:", "The received message is empty or invalid");
        });
    });
});
