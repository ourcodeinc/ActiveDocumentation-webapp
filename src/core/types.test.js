import {isValidRuleType, isValidRuleTable, validRules} from "./types";

describe("PropTypes Validation", () => {
    beforeEach(() => {
        console.log = jest.fn();
        console.error = jest.fn();
    });

    describe("isValidRuleType", () => {
        it("should return true for a valid rule object", () => {
            const validRule = {
                index: "1",
                title: "Valid Rule",
                description: "This is a valid rule.",
                tags: ["tag1", "tag2"],
            };

            expect(isValidRuleType(validRule)).toBe(true);
        });

        it("should return false for an invalid rule object (missing required title)", () => {
            const invalidRule = {
                index: "1",
                // Title is missing
                description: "This is an invalid rule.",
                tags: ["tag1"],
            };

            expect(isValidRuleType(invalidRule)).toBe(false);
        });

        it("should return false for an invalid rule object (wrong type for index)", () => {
            const invalidRule = {
                index: 1, // Should be a string
                title: "Valid Rule",
                description: "This rule has the wrong type for index.",
                tags: ["tag1"],
            };

            expect(isValidRuleType(invalidRule)).toBe(false);
        });
    });

    describe("isValidRuleTable", () => {
        it("should return true for a valid array of rule objects", () => {
            const validRuleTable = [
                {
                    index: "1",
                    title: "Rule 1",
                    description: "Description for rule 1",
                    tags: ["tag1", "tag2"],
                },
                {
                    index: "2",
                    title: "Rule 2",
                    description: "Description for rule 2",
                    tags: ["tag3"],
                },
            ];

            const result = isValidRuleTable(validRuleTable);
            expect(result).toBe(true);
        });

        it("should return false for an invalid array (contains invalid rule object)", () => {
            const invalidRuleTable = [
                {
                    index: 1,
                    title: "Rule 1",
                },
                {
                    index: "2",
                    title: "Rule 2",
                    description: "Description for rule 2",
                    tags: ["tag3"],
                },
            ];

            const result = isValidRuleTable(invalidRuleTable);
            expect(result).toBe(false);
        });

        it("should return false for a non-array input", () => {
            const invalidRuleTable = {
                index: "1",
                title: "Rule 1",
                description: "Description for rule 1",
                tags: ["tag1", "tag2"],
            };

            const result = isValidRuleTable(invalidRuleTable);
            expect(result).toBe(false);
        });
    });

    describe("validRules", () => {
        it("should return an empty array for an empty input array", () => {
            const result = validRules([]);
            expect(result).toEqual([]);
        });

        it("should return false for non-array input", () => {
            const result = validRules("not an array");
            expect(result).toEqual([]);
        });

        it("should return only valid rules from the input", () => {
            const input = [
                {index: "1", title: "Rule 1", description: "First rule", tags: ["tag1"]},
                {index: "2", title: "Rule 2", description: "Second rule", tags: ["tag2", "tag3"]},
                {index: "3", title: "Rule 3", description: "Third rule", tags: "not an array"}, // Invalid rule
                {index: "4", title: "Rule 4", tags: []}, // Invalid rule
            ];
            const result = validRules(input);
            expect(result).toEqual([
                {index: "1", title: "Rule 1", description: "First rule", tags: ["tag1"]},
                {index: "2", title: "Rule 2", description: "Second rule", tags: ["tag2", "tag3"]},
            ]);
        });

        it("should return an empty array if no valid rules are found", () => {
            const input = [
                {index: "1", title: "Invalid Rule", description: "No tags", tags: "not an array"},
                {index: "2", title: "Invalid Rule 2", tags: null}, // Invalid rule
            ];
            const result = validRules(input);
            expect(result).toEqual([]);
        });

        it("should handle deeply nested structures and return only valid rules", () => {
            const input = [
                {index: "1", title: "Nested Valid Rule", description: "Valid rule", tags: ["tag1"]},
                {index: "2", title: "Invalid Nested Rule", details: {extra: "info"}}, // Invalid rule
                {index: "3", title: "Another Valid Rule", description: "Another valid rule", tags: ["tag2"]},
            ];
            const result = validRules(input);
            expect(result).toEqual([
                {index: "1", title: "Nested Valid Rule", description: "Valid rule", tags: ["tag1"]},
                {index: "3", title: "Another Valid Rule", description: "Another valid rule", tags: ["tag2"]},
            ]);
        });
    });
});
