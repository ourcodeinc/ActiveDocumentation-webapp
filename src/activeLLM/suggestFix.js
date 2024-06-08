import OpenAI from "openai";

export async function suggestFix(
    rule,
    example,
    violation,
    exampleFilePath,
    violationFilePath,
    setState,
) {

    const prompt = `Here is a design rule and its description: ${rule}
    Here is a code example that follows this design rule: ${example}
    The example file path is ${exampleFilePath}
    Now, here is a code snippet that violates this design rule: ${violation}
    The violated code's file path is ${violationFilePath}
    Can you suggest a fix to make this violation follow the given design rule?
    Generate code with surrounding code included that follows the design rule.
    Be sure to maintain proper whitespace with \\t and \\n.
    Give a brief explanation of your fix as well.
    Ensure to include the fileName of where to insert the fix in the format Example.java.
    Strictly output in JSON format. The JSON should have the following format:{"code": "...", "explanation": "...", "fileName": "..."}`;

    //the following prompt is an older version. It is commented out because the one used right now is more 
    //concise and produces better output
    /*const prompt = `Here is a design rule and its description: ${rule} 
    Here is a code example that follows this design rule: ${example}
    The example file path is ${exampleFilePath}
    Now, here is a code snippet that violates this design rule. ${violation} 
    The violated code's file path is ${violationFilePath}
    Suggest a fix to make this violation follow the given design rule? 
    Generate code with surrounding code included that follows the design rule. 
    Be sure to maintain proper whitespace with \\t and \\n. 
    Give a brief explanation of your fix as well. Strictly output in JSON format. 
    Ensure that you include the fileName where the fix should be inserted at. 
    This should just be in the format Example.java
    The JSON should have the following format:{"code": "...", "explanation": "...", "fileName": "..."}`;*/

    let attempt = 1;
    let success = false;

    while (attempt <= 3 && !success) {
        try {
            // Read the API key from localStorage
            const apiKey = localStorage.getItem("OPENAI_API_KEY");

            // Create a new OpenAI instance with the API key from localStorage
            const openai = new OpenAI({
                apiKey,
                dangerouslyAllowBrowser: true,
            });

            const chatCompletion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                temperature: 0.75,
                messages: [{role: "user", content: prompt}],
            });

            const suggestedSnippet = chatCompletion.choices[0].message.content;
            const stripped = suggestedSnippet.replace(/^`json|`json$/g, "").trim();
            const parsedJSON = JSON.parse(stripped);

            // sets the relevant state in the React component that made the request
            // see ../ui/rulePanel.js for more details
            setState({suggestedSnippet: parsedJSON["code"]});
            setState({snippetExplanation: parsedJSON["explanation"]});
            setState({suggestionFileName: parsedJSON["fileName"]});

            const llmModifiedFileContent = {
                command: "LLM_MODIFIED_FILE_CONTENT",
                data: {
                    filePath: `${violationFilePath}`,
                    fileToChange: `${parsedJSON["fileName"]}`,
                    modifiedFileContent: `${parsedJSON["code"]}`,
                    explanation: `${parsedJSON["explanation"]}`,
                },
            };

            // set the modified content state, will be sent plugin
            setState({llmModifiedFileContent: llmModifiedFileContent});

            success = true;
        } catch (error) {
            console.log(error);
            success = false;
            attempt++;
        }
    }
}
