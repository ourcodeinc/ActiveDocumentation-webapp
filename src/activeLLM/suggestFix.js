import { config } from "./config";
import OpenAI from "openai";

// creates a fix for a code snippet that violates a certain design rule
export async function suggestFix(rule, snippet, setState) {

    console.log(snippet)

    const prompt = `Here is a design rule and its description. ${rule} Now, 
    here is a code snippet that violates this design rule. ${snippet} Suggest 
    a fix to make this violation follow the given design rule? Generate code, 
    with the surrounding code included, to make this violation follow the given 
    design rule. Be sure to maintain proper whitespace with \\t and \\n. 
    Give a brief explanation of your fix as well. Strictly output in JSON format. 
    The JSON should have the following format:{"code": "...", "explanation": "..."}`

    try {
        const openai = new OpenAI({
            // NOTE: open config.js and add your api key there 
            apiKey: config.OPENAI_API_KEY,
            // FIXME: no .env, need to allow browser`
            dangerouslyAllowBrowser: true,
        });

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const suggestedSnippet = chatCompletion.choices[0].message.content;
        const stripped = suggestedSnippet.replace(/^`json|`json$/g, "").trim();
        const parsedJSON = JSON.parse(stripped);

        // sets the relevant state in the React component that made the request
        // see ../ui/rulePanel.js for more details
        setState({ suggestedSnippet: parsedJSON["code"] });
        setState({ snippetExplanation: parsedJSON["explanation"] });

    } catch (error) {
        console.log(error);
    }
};

