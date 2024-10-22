import {isValidInput, isTypedCorrectly} from "./utilities";

const ruleStructure = {
    index: "string",
    title: "string",
    description: "string",
    tags: "array",
};

/**
 * Checks if an object is a valid Rule.
 * @param {any} input - The object to check.
 * @returns {boolean} - True if the object matches the Rule structure, otherwise false.
 */
export const isValidRuleType = (input) => {
    if (!isValidInput(input, "plain object", ruleStructure)) {
        return false;
    }
    // Additional checks for arrays
    return Array.isArray(input.tags) && input.tags.every((tag) => typeof tag === "string");
};

/**
 * Checks if the given object is a valid ruleTable; array of rule objects
 * @param {any} input
 * @returns {boolean}
 */
export const isValidRuleTable = (input) => {
    if (!isTypedCorrectly(input, "array")) {
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
    if (!isTypedCorrectly(input, "array")) {
        return [];
    }
    return input.filter((rule) => isValidRuleType(rule));
};
