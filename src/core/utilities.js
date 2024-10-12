/**
 * a method to parse strings
 * @param stringJson
 * @param dataName
 * @param defaultValue
 * @return {any}
 */
export const parseJson = (stringJson, dataName, defaultValue) => {
    try {
        return JSON.parse(stringJson);
    } catch (e) {
        console.log(`Failed to parse ${dataName}`);
        return defaultValue;
    }
};
