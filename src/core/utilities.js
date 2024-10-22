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
        console.log("utilities.parseJson:", `Failed to parse ${dataName}`);
        return defaultValue;
    }
};


/**
 * Creates an object with default values based on the provided structure.
 * @param {Object} structure - The structure of the object where keys are property names and values are expected types.
 * @returns {Object} An object with default values corresponding to the structure.
 */
export const createDefaultObjectFromStructure = (structure) => {
    const defaultObject = {};
    for (const [key, type] of Object.entries(structure)) {
        switch (type) {
            case "string":
                defaultObject[key] = "";
                break;
            case "object":
            case "plain object":
                defaultObject[key] = {};
                break;
            case "array":
                defaultObject[key] = [];
                break;
            case "number":
                defaultObject[key] = 0;
                break;
            case "boolean":
                defaultObject[key] = false;
                break;
            default:
                defaultObject[key] = null; // If the type is unknown, default to null
                break;
        }
    }
    return defaultObject;
};

/**
 * Checks whether the message has the intended structure
 * @param {any} input
 * @param {string} type Intended type of the input, can be "plain object"
 * @param {object} structure The structure of the object where keys are property names and values are expected types.
 * @returns {boolean}
 */
export const isValidInput = (input, type, structure) => {
    if (!isTypedCorrectly(input, type)) {
        return false;
    }
    for (const [key, type] of Object.entries(structure)) {
        if (!input.hasOwnProperty(key) || !isTypedCorrectly(input[key], type)) {
            console.log("utilities.isValidInput:", `Invalid or missing property: ${key}. Expected type: ${type}`);
            return false;
        }
    }
    return true;
};


/**
 * Checks if the given input has the intended type
 * @param {any} input
 * @param {string} type
 * @returns {boolean}
 */
export const isTypedCorrectly = (input, type) => {
    if (input === null) {
        return false;
    }
    switch (type) {
        case "plain object":
            return typeof input === "object" && input.constructor === Object;
        case "array":
            return Array.isArray(input);
        default:
            return typeof input === type;
    }
};
