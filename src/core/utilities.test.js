import {parseJson, createDefaultObjectFromStructure, isValidInput, isTypedCorrectly} from "./utilities";

describe("Utilities Functions", () => {
    beforeEach(() => {
        console.log = jest.fn();
        console.error = jest.fn();
    });

    describe("parseJson", () => {
        it("should parse a valid JSON string", () => {
            const jsonString = "{\"key\":\"value\"}";
            const result = parseJson(jsonString, "testData");
            expect(result).toEqual({key: "value"});
        });

        it("should return default value for an invalid JSON string", () => {
            const invalidJsonString = "{\"key\":value}"; // Invalid JSON
            const result = parseJson(invalidJsonString, "testData", {default: "value"});
            expect(result).toEqual({default: "value"});
        });

        it("should log an error message when parsing fails", () => {
            console.log = jest.fn();
            const invalidJsonString = "{\"key\":value}";
            parseJson(invalidJsonString, "testData");
            expect(console.log).toHaveBeenCalled();
        });
    });

    describe("createDefaultObjectFromStructure", () => {
        it("should create an object with default values based on the structure", () => {
            const structure = {
                name: "string",
                age: "number",
                active: "boolean",
                settings: "object",
                addresses: "array",
                hubbies: "plain object",
                unknown: "unknown",
            };
            const result = createDefaultObjectFromStructure(structure);
            expect(result).toEqual({
                name: "",
                age: 0,
                active: false,
                settings: {},
                addresses: [],
                hubbies: {},
                unknown: null,
            });
        });

        it("should return an empty object for an empty structure", () => {
            const result = createDefaultObjectFromStructure({});
            expect(result).toEqual({});
        });
    });

    describe("isTypedCorrectly", () => {
        test("should return false for null input", () => {
            expect(isTypedCorrectly(null, "plain object")).toBe(false);
        });

        test("should return true for a plain object", () => {
            expect(isTypedCorrectly({}, "plain object")).toBe(true);
        });

        test("should return false for an array when expecting a plain object", () => {
            expect(isTypedCorrectly([], "plain object")).toBe(false);
        });

        test("should return true for an array when expecting \"array\"", () => {
            expect(isTypedCorrectly([], "array")).toBe(true);
        });

        test("should return true for a string when expecting \"string\"", () => {
            expect(isTypedCorrectly("hello", "string")).toBe(true);
        });

        test("should return false for a number when expecting \"string\"", () => {
            expect(isTypedCorrectly(123, "string")).toBe(false);
        });

        test("should return true for a number when expecting \"number\"", () => {
            expect(isTypedCorrectly(123, "number")).toBe(true);
        });

        test("should return false for an object when expecting \"array\"", () => {
            expect(isTypedCorrectly({}, "array")).toBe(false);
        });
    });

    describe("isValidInput", () => {
        test("should return false for null input", () => {
            expect(isValidInput(null, "plain object", {})).toBe(false);
        });

        test("should return false for input that is not a plain object", () => {
            expect(isValidInput([], "plain object", {})).toBe(false);
        });

        test("should return false if input is a plain object but structure is missing properties", () => {
            const input = {name: "Alice"};
            const structure = {name: "string", age: "number"}; // "age" is missing
            expect(isValidInput(input, "plain object", structure)).toBe(false);
        });

        test("should return false if input has incorrect property type", () => {
            const input = {name: "Alice", age: "notANumber"}; // "age" should be a number
            const structure = {name: "string", age: "number"};
            expect(isValidInput(input, "plain object", structure)).toBe(false);
        });

        test("should return true if input is a plain object and matches structure", () => {
            const input = {name: "Alice", age: 30};
            const structure = {name: "string", age: "number"};
            expect(isValidInput(input, "plain object", structure)).toBe(true);
        });

        test("should log an error for invalid or missing properties", () => {
            const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

            const input = {name: "Alice"};
            const structure = {name: "string", age: "number"}; // "age" is missing

            expect(isValidInput(input, "plain object", structure)).toBe(false);
            expect(consoleLogSpy).toHaveBeenCalled();

            consoleLogSpy.mockRestore();
        });
    });
});
