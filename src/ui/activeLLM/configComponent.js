import React, {useState, useEffect} from "react";
import OpenAI from "openai";

const ConfigComponent = () => {
    const [apiKey, setApiKey] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        const storedApiKey = localStorage.getItem("OPENAI_API_KEY");
        if (storedApiKey) {
            setShowSuccessMessage(true);
        }
    }, []);

    const handleApiKeyChange = (e) => {
        setApiKey(e.target.value);
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
                messages: [{role: "user", content: "Send me one English letter."}],
            });

            if (chatCompletion) {
                // Save API key to local storage only if validation is successful
                localStorage.setItem("OPENAI_API_KEY", apiKey);
                setErrorMessage("");
                setShowForm(false); // Hide the form
                setShowSuccessMessage(true); // Show success message
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
        successMessage: {
            color: "#4CAF50",
            fontWeight: "bold",
            marginTop: "10px",
        },
    };

    return (
        <div style={styles.container}>
            {!showSuccessMessage && !showForm && (
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
            {showSuccessMessage && (
                <p style={styles.successMessage}>Valid API Key Submitted!</p>
            )}
        </div>
    );
};

export default ConfigComponent;
