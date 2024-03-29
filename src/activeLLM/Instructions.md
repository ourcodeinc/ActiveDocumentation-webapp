# Activating the LLM features in this project

## config.js

In this directory (activeLLM) create a file called config.js

By default this is not present, you must opt-in to LLM features

Add the following to **config.js** to opt-in 

```js
export const config = {
    // NOTE: insert your openai api key below
    OPENAI_API_KEY: "YOUR-API-KEY",
}
```

