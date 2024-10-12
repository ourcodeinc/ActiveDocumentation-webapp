import "@testing-library/jest-dom";
import {render, screen} from "@testing-library/react";
import App from "./App";
import WebSocketManager from "./websocket";

jest.mock("./websocket");

beforeEach(() => {
    WebSocketManager.mockClear();
});

describe("App Component", () => {
    it("should render App.js", () => {
        render(<App />);

        const heading = screen.getByText(/Contents/i);
        expect(heading).toBeInTheDocument();
    });

    it("sets up the WebSocket connection on mount", () => {
        const WebSocketManager = require("./websocket").default;
        const {unmount} = render(<App />);

        // Check if the WebSocketManager was instantiated
        expect(WebSocketManager).toHaveBeenCalledWith("ws://localhost:8887");

        // Clean up the component to check if close is called
        unmount();
        expect(WebSocketManager.mock.instances[0].close).toHaveBeenCalled();
    });
});
