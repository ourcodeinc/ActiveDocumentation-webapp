import "@testing-library/jest-dom";
import React from "react";
import {render, screen, act} from "@testing-library/react";
import HeaderBar from "./headerBar";
import {HASH_CONSTANTS} from "./uiConstants";

jest.mock("react-tooltip", () => {
    return {
        Tooltip: ({id, children}) => <div role="tooltip" aria-labelledby={id}>{children}</div>,
    };
});

describe("HeaderBar Component", () => {
    let mockWebSocketManager;

    beforeEach(() => {
        mockWebSocketManager = {
            isReady: jest.fn(),
        };
    });

    describe("Rendering", () => {
        it("renders header when hash is INDEX", () => {
            window.location.hash = "#/" + HASH_CONSTANTS.INDEX;
            render(<HeaderBar webSocketManager={mockWebSocketManager} />);

            const heading = screen.getByText(/ActiveDocumentation/i);
            expect(heading).toBeInTheDocument();
        });

        it("renders header when hash is ALL_RULES", () => {
            window.location.hash = "#/" + HASH_CONSTANTS.ALL_RULES;
            render(<HeaderBar webSocketManager={mockWebSocketManager} />);

            expect(screen.getByRole("heading", {name: /All Rules/i})).toBeInTheDocument();
            expect(screen.getByRole("tooltip")).toBeInTheDocument();
        });


        it("renders header when hash is VIOLATED_RULES", () => {
            window.location.hash = "#/" + HASH_CONSTANTS.VIOLATED_RULES; // Set the hash for the test
            render(<HeaderBar webSocketManager={mockWebSocketManager} />);

            const heading = screen.getByText(/Violated Rules/i);
            expect(heading).toBeInTheDocument();
            expect(screen.getByRole("tooltip")).toBeInTheDocument(); // Tooltip should be rendered
        });

        it("renders header when hash is unknown", () => {
            window.location.hash = "#/unknown"; // Set the hash for the test
            render(<HeaderBar webSocketManager={mockWebSocketManager} />);

            const heading = screen.getByText(/unknown/i);
            expect(heading).toBeInTheDocument();
        });
    });

    describe("WebSocket Error Message", () => {
        it("shows error message when WebSocket is not ready", () => {
            mockWebSocketManager.isReady.mockReturnValue(false);
            render(<HeaderBar webSocketManager={mockWebSocketManager} />);

            const errorMessage = screen.getByText(/The tool is not connected to the IDE/i);
            expect(errorMessage).toBeInTheDocument();
        });

        it("does not show error message when WebSocket is ready", () => {
            mockWebSocketManager.isReady.mockReturnValue(true);
            render(<HeaderBar webSocketManager={mockWebSocketManager} />);

            const errorMessage = screen.queryByText(/The tool is not connected to the IDE/i);
            expect(errorMessage).not.toBeInTheDocument();
        });
    });

    describe("Hash Change Handling", () => {
        it("updates state on hash change", () => {
            window.location.hash = "#/" + HASH_CONSTANTS.INDEX;
            render(<HeaderBar webSocketManager={mockWebSocketManager} />);
            expect(screen.getByText(/ActiveDocumentation/i)).toBeInTheDocument();

            act(() => {
                window.location.hash = "#/" + HASH_CONSTANTS.ALL_RULES;
                window.dispatchEvent(new HashChangeEvent("hashchange"));
            });

            expect(screen.getByText(/All Rules/i)).toBeInTheDocument();
        });
    });

    describe("Lifecycle Methods", () => {
        it("adds and removes hashchange event listener on mount and unmount", () => {
            const addEventListenerSpy = jest.spyOn(window, "addEventListener");
            const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
            const {unmount} = render(<HeaderBar webSocketManager={mockWebSocketManager} />);

            expect(addEventListenerSpy).toHaveBeenCalledWith("hashchange", expect.any(Function));

            unmount();
            expect(removeEventListenerSpy).toHaveBeenCalledWith("hashchange", expect.any(Function));
        });
    });
});
