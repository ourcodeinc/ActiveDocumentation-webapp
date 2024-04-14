import { config } from "./config";
import OpenAI from "openai";

export async function suggestFix(
  rule,
  example,
  violation,
  exampleFilePath,
  violationFilePath,
  setState,
) {
  // console.log("Rule: ", rule);
  // console.log("Example: ", example);
  // console.log("Snippet: ", snippet);
  // console.log("Example file path: ", exampleFilePath);
  // console.log("Violation file path: ", violationFilePath);

  const prompt = `Here is a design rule and its description: ${rule} 
    Here is a code example that follows this design rule: ${example}
    The example file path is ${exampleFilePath}
    Now, here is a code snippet that violates this design rule. ${violation} 
    The violated code's file path is ${violationFilePath}
    Suggest a fix to make this violation follow the given design rule? 
    Generate a short explanation and only the code needed to achieve the fix. 
    Be sure to maintain proper whitespace with \\t and \\n. 
    Give a brief explanation of your fix as well. Strictly output in JSON format. 
    The JSON should have the following format:{"code": "...", "explanation": "..."}`;

  try {
    const openai = new OpenAI({
      // NOTE: open config.js and add your api key there
      apiKey: config.OPENAI_API_KEY,
      // FIXME: this is not secure.
      dangerouslyAllowBrowser: true,
    });

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.75,
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
}
