import {parseReceivedWebSocketMessage} from "./utilities";
import {WEBSOCKET_RECEIVED_MESSAGE} from "../webSocket/webSocketConstants";
import {updateLoadingGif} from "../redux/reduxActions";
import {LOADING_GIF_MESSAGES} from "../ui/uiConstants";
import {isValidRuleTable} from "./propTypes";

/**
 * @param {string} receivedMessage
 */
export const processReceivedMessage = (receivedMessage, dispatch) => {
    const parsedMessage = parseReceivedWebSocketMessage(receivedMessage);
    switch (parsedMessage.command) {
        case WEBSOCKET_RECEIVED_MESSAGE.ENTER_CHAT_MSG:
            break;

        case WEBSOCKET_RECEIVED_MESSAGE.LEFT_CHAT_MSG:
            break;

        case WEBSOCKET_RECEIVED_MESSAGE.RULE_TABLE_MSG:
            if (!isValidRuleTable(parsedMessage.data)) {
                console.error("WebSocketManager.js:", "The received ruleTable is not valid.");
                break;
            }
            dispatch(updateLoadingGif(true, LOADING_GIF_MESSAGES.LOADING_RULES));
            break;

        case "":
            console.error("WebSocketManager.js:", "The received message is empty or invalid");
            break;
    }
};
