import "@testing-library/jest-dom";
import {render, screen} from "@testing-library/react";
import {Provider} from "react-redux";
import configureStore from "redux-mock-store";
import App from "./App";
import WebSocketManager from "./webSocket/webSocketManager";
import {LOADING_GIF_MESSAGES} from "./ui/uiConstants";
import config from "./config";

jest.mock("./webSocket/webSocketManager");
const mockStore = configureStore([]);

beforeEach(() => {
    WebSocketManager.mockClear();
    WebSocketManager.prototype.close = jest.fn();
});

describe("App Component", () => {
    let reduxStore;

    beforeEach(() => {
        reduxStore = mockStore({
            loadingGif: false,
            loadingMessage: "",
        });
    });

    describe("Rendering Tests", () => {
        it("should render the App component", () => {
            render(
                <Provider store={reduxStore}>
                    <App />
                </Provider>,
            );

            const navElement = screen.getByTestId("navbar");
            expect(navElement).toBeInTheDocument();
        });

        it("shows the loading spinner when loadingGif is true", () => {
            reduxStore = mockStore({
                loadingGif: true,
                loadingMessage: "Loading Rules",
            });

            render(
                <Provider store={reduxStore}>
                    <App />
                </Provider>,
            );

            const loadingMessageElement = screen.getByText(/Loading Rules/i);
            expect(loadingMessageElement).toBeInTheDocument();
            expect(screen.getByTestId("loadingGif")).toBeVisible();
        });

        it("hides the loading spinner when loadingGif is false", () => {
            reduxStore = mockStore({
                loadingGif: false,
                loadingMessage: "",
            });

            render(
                <Provider store={reduxStore}>
                    <App />
                </Provider>,
            );

            const loadingElement = screen.queryByTestId("loadingGif");
            expect(loadingElement).toBeNull();
        });
    });

    describe("WebSocketManager Tests", () => {
        it("sets up the WebSocket connection on mount", () => {
            const {unmount} = render(
                <Provider store={reduxStore}>
                    <App />
                </Provider>,
            );

            expect(WebSocketManager).toHaveBeenCalledWith(`ws://localhost:${config.websocketPort}`, expect.any(Function));

            unmount();
            expect(WebSocketManager.mock.instances[0].close).toHaveBeenCalled();
        });

        it("calls WebSocketManager.close when component unmounts", () => {
            const {unmount} = render(
                <Provider store={reduxStore}>
                    <App />
                </Provider>,
            );

            unmount();
            expect(WebSocketManager.prototype.close).toHaveBeenCalled();
        });

        it("passes dispatch to WebSocketManager", () => {
            const reduxStore = mockStore({
                loadingGif: true,
                loadingMessage: LOADING_GIF_MESSAGES.LOADING_RULES,
            });

            render(
                <Provider store={reduxStore}>
                    <App />
                </Provider>,
            );

            expect(WebSocketManager).toHaveBeenCalledWith(`ws://localhost:${config.websocketPort}`, expect.any(Function));
        });
    });

    describe("Redux State Updates", () => {
        it("updates loadingGif and loadingMessage when redux props change", () => {
            const {rerender} = render(
                <Provider store={reduxStore}>
                    <App />
                </Provider>,
            );

            reduxStore = mockStore({
                loadingGif: true,
                loadingMessage: "New Loading Message",
            });

            rerender(
                <Provider store={reduxStore}>
                    <App />
                </Provider>,
            );

            const loadingMessageElement = screen.getByText("New Loading Message");
            expect(loadingMessageElement).toBeInTheDocument();
            expect(screen.getByTestId("loadingGif")).toBeVisible();
        });
    });
});
