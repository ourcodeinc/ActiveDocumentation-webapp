import {parseJson, createDefaultObjectFromStructure, isValidInput} from "./utilities";
import {WEBSOCKET_RECEIVED_MESSAGE, WEBSOCKET_MESSAGE_STRUCTURE} from "../webSocket/webSocketConstants";
import {updateLoadingGif} from "../redux/reduxActions";
import {LOADING_GIF_MESSAGES} from "../ui/uiConstants";
import {validRules} from "./types";

/**
 * @param {string} receivedMessage
 */
export const processReceivedMessage = (receivedMessage, dispatch) => {
    const parsedMessage = parseReceivedWebSocketMessage(receivedMessage);
    switch (parsedMessage.command) {
        case WEBSOCKET_RECEIVED_MESSAGE.WEBSOCKET_CONNECTED_MSG:
            break;

        case WEBSOCKET_RECEIVED_MESSAGE.WEBSOCKET_DISCONNECTED_MSG:
            break;

        case WEBSOCKET_RECEIVED_MESSAGE.RULE_TABLE_MSG:
            console.log("processMessages.processReceivedMessage:", "Valid rules", validRules(parsedMessage.data));
            dispatch(updateLoadingGif(true, LOADING_GIF_MESSAGES.LOADING_RULES));
            break;

        case "":
            console.error("processMessages.processReceivedMessage:", "The received message is empty or invalid", receivedMessage);
            break;
    }
};


/**
 * parse the string format of the json message
 * @param {string} receivedMessage
 * @returns {{command: string, data: object}}
 */
export const parseReceivedWebSocketMessage = (receivedMessage) => {
    const defaultMessage = createDefaultObjectFromStructure(WEBSOCKET_MESSAGE_STRUCTURE);
    const message = parseJson(receivedMessage, "Received Message", defaultMessage);

    if (!message || !isValidInput(message, "object", WEBSOCKET_MESSAGE_STRUCTURE)) {
        console.log("processMessages.parseReceivedWebSocketMessage:", "Received an invalid WebSocket message.");
        return defaultMessage;
    }

    return message;
};
