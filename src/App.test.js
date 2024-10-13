import "@testing-library/jest-dom";
import {render, screen} from "@testing-library/react";
import {Provider} from "react-redux";
import configureStore from "redux-mock-store";
import App from "./App";
import WebSocketManager from "./websocket/webSocketManager";

jest.mock("./websocket");
const mockStore = configureStore([]);

beforeEach(() => {
    WebSocketManager.mockClear();
});

describe("App Component", () => {
    let reduxStore;

    beforeEach(() => {
        reduxStore = mockStore({
            loadingGif: false, // default state for loadingGif
        });
    });

    it("should render App.js", () => {
        render(
            <Provider store={reduxStore}>
                <App />
            </Provider>,
        );

        const heading = screen.getByText(/Contents/i);
        expect(heading).toBeInTheDocument();
    });

    it("sets up the WebSocket connection on mount", () => {
        const {unmount} = render(
            <Provider store={reduxStore}>
                <App />
            </Provider>,
        );

        // Check if the WebSocketManager was instantiated
        expect(WebSocketManager).toHaveBeenCalledWith("ws://localhost:8887", expect.any(Function));

        // Clean up the component to check if close is called
        unmount();
        expect(WebSocketManager.mock.instances[0].close).toHaveBeenCalled();
    });

    it("shows loading spinner when loadingGif is true", () => {
        reduxStore = mockStore({
            loadingGif: true,
        });

        render(
            <Provider store={reduxStore}>
                <App />
            </Provider>,
        );

        const loadingSpinner = screen.getByText(/Loading Files and Rules/i);
        expect(loadingSpinner).toBeInTheDocument();
        expect(screen.getByTestId("loadingGif")).not.toHaveClass("hidden");
    });

    it("hides loading spinner when loadingGif is false", () => {
        render(
            <Provider store={reduxStore}>
                <App />
            </Provider>,
        );
        expect(screen.getByTestId("loadingGif")).toHaveClass("hidden");
    });

    it("passes dispatch to WebSocketManager", () => {
        const mockStore = configureStore([]);
        const reduxStore = mockStore({
            loadingGif: true, // or any other initial state you need
        });

        const {unmount} = render(
            <Provider store={reduxStore}>
                <App />
            </Provider>,
        );

        // Check if WebSocketManager was instantiated with the correct arguments
        expect(WebSocketManager).toHaveBeenCalledWith("ws://localhost:8887", expect.any(Function));
        unmount();
    });
});
