/**
 * a method to parse strings
 * @param {string} stringJson
 * @param {string} dataName
 * @param {any} defaultValue
 * @return {any}
 */
export const parseJson = (stringJson, dataName, defaultValue = null) => {
    try {
        return JSON.parse(stringJson);
    } catch (e) {
        console.log(`Failed to parse ${dataName}`);
        return defaultValue;
    }
};

/**
 * parse the string format of the json message
 * @param {string} receivedMessage
 * @returns {{command: string, data: {}}}
 */
export const parseReceivedWebSocketMessage = (receivedMessage) => {
    const message = parseJson(receivedMessage, "Received Message", {command: "", data: {}});
    if (!message) {
        return {command: "", data: {}};
    }
    if (!message.data) {
        return {command: message.command, data: {}};
    }
    return message;
};
