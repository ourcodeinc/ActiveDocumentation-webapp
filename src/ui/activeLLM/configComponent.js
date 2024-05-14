import React, {useState} from "react";
import OpenAI from "openai";

const ConfigComponent = () => {
    const [apiKey, setApiKey] = useState(
        localStorage.getItem("OPENAI_API_KEY") || "",
    );
    const [errorMessage, setErrorMessage] = useState("");
    const [showForm, setShowForm] = useState(false);

    const handleApiKeyChange = async (e) => {
        const newApiKey = e.target.value;
        setApiKey(newApiKey);
        localStorage.setItem("OPENAI_API_KEY", newApiKey);
    };

    const handleOptInClick = () => {
        setShowForm(true);
    };

    const handleButtonClick = async () => {
        try {
            const openai = new OpenAI({
                apiKey,
                dangerouslyAllowBrowser: true,
            });

            const chatCompletion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: "Send me one english letter."}],
            });

            if (chatCompletion) {
                setErrorMessage("");
            }
        } catch (error) {
            setErrorMessage("Please enter a valid key.");
        }
    };

    const styles = {
        container: {
            textAlign: "center",
        },
        button: {
            backgroundColor: "#777",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "8px 16px",
            fontSize: "16px",
            cursor: "pointer",
            outline: "none",
            marginRight: "10px",
        },
        input: {
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #777",
            marginRight: "10px",
            color: "black",
        },
        label: {
            color: "white",
            fontWeight: "normal",
        },
        errorMessage: {
            color: "#777",
            marginTop: "10px",
        },
    };

    return (
        <div style={styles.container}>
            {!showForm && (
                <button style={styles.button} onClick={handleOptInClick}>
                    Opt-In to activeLLM
                </button>
            )}
            {showForm && (
                <div>
                    <label style={styles.label}>
                        API Key:
                        <input
                            style={styles.input}
                            type="text"
                            value={apiKey}
                            onChange={handleApiKeyChange}
                        />
                    </label>
                    <button style={styles.button} onClick={handleButtonClick}>
                        Submit
                    </button>
                    {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
                </div>
            )}
        </div>
    );
};
export default ConfigComponent;
