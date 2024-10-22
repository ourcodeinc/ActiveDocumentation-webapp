/**
 * @typedef {Object} Rule
 * @property {string} index
 * @property {string} title
 * @property {string} description
 * @property {string[]} tags
 */

/**
 * Checks if an object is a valid Rule.
 * @param {any} obj - The object to check.
 * @returns {boolean} - True if the object matches the Rule structure, otherwise false.
 */
export const isValidRuleType = (input) => {
    return (
        typeof input === "object" &&
        input !== null &&
        typeof input.index === "string" &&
        typeof input.title === "string" &&
        typeof input.description === "string" &&
        Array.isArray(input.tags) &&
        input.tags.every((tag) => typeof tag === "string")
    );
};

/**
 * Checks if the given object is a valid ruleTable; array of rule objects
 * @param {any} input
 * @returns {boolean}
 */
export const isValidRuleTable = (input) => {
    if (!Array.isArray(input)) {
        return false;
    }
    return input.every((rule) => isValidRuleType(rule));
};

/**
 * Returns valid rules from the input
 * @param {any} input
 * @returns {Rule[]}
 */
export const validRules = (input) => {
    if (!Array.isArray(input)) {
        return [];
    }
    return input.filter((rule) => isValidRuleType(rule));
};
