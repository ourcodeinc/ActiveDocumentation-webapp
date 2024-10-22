import "@testing-library/jest-dom";
import {render, screen, fireEvent} from "@testing-library/react";
import {Provider} from "react-redux";
import configureStore from "redux-mock-store";
import TableOfContents from "./tableOfContents";
import {HASH_CONSTANTS} from "./uiConstants";
import {CONFIG} from "../config";

// Create a mock store
const mockStore = configureStore([]);

describe("TableOfContents Component", () => {
    let store;

    beforeEach(() => {
        // Default state for the tests
        store = mockStore({
            ruleTable: [],
            tagTable: [],
        });
    });

    describe("Initial Rendering", () => {
        it("renders welcome message when no rules are present", () => {
            render(
                <Provider store={store}>
                    <TableOfContents />
                </Provider>,
            );

            const welcomeMessage = screen.getByText(/Welcome to the Rules Dashboard/i);
            expect(welcomeMessage).toBeInTheDocument();
        });

        it("does not render tags or rules if both are empty", () => {
            render(
                <Provider store={store}>
                    <TableOfContents />
                </Provider>,
            );

            expect(screen.queryByTestId("tags-header")).toBeNull();
            expect(screen.queryByTestId("rules-header")).toBeNull();
        });

        it("does not render tags or rules if tagTable is provided", () => {
            store = mockStore({
                ruleTable: [],
                tagTable: [{ID: 1, tagName: "Tag 1"}, {ID: 2, tagName: "Tag 2"}],
            });

            render(
                <Provider store={store}>
                    <TableOfContents />
                </Provider>,
            );

            expect(screen.queryByTestId("tags-header")).toBeNull();
            expect(screen.queryByTestId("rules-header")).toBeNull();
        });
    });

    describe("Rendering with Data", () => {
        it("renders rules when ruleTable is provided", () => {
            store = mockStore({
                ruleTable: [{title: "Rule 1"}, {title: "Rule 2"}],
                tagTable: [],
            });

            render(
                <Provider store={store}>
                    <TableOfContents />
                </Provider>,
            );

            const ruleList = screen.getByText("Rule 1");
            expect(ruleList).toBeInTheDocument();
            expect(screen.queryByTestId("tags-header")).toBeNull();
        });

        it("renders both tags and rules when both are provided", () => {
            store = mockStore({
                ruleTable: [{title: "Rule 1"}, {title: "Rule 2"}],
                tagTable: [{ID: 1, tagName: "Tag 1"}, {ID: 2, tagName: "Tag 2"}],
            });

            render(
                <Provider store={store}>
                    <TableOfContents />
                </Provider>,
            );

            expect(screen.getByText("Tag 1")).toBeInTheDocument();
            expect(screen.getByText("Rule 1")).toBeInTheDocument();
        });
    });

    describe("Interactions", () => {
        it("navigates to the correct tag page when a tag is clicked", () => {
            store = mockStore({
                ruleTable: [{title: "Rule 1"}, {title: "Rule 2"}],
                tagTable: [{ID: 1, tagName: "Tag 1"}],
            });

            render(
                <Provider store={store}>
                    <TableOfContents />
                </Provider>,
            );

            const tagItem = screen.getByText("Tag 1");
            fireEvent.click(tagItem);

            expect(window.location.hash).toBe(`#/${HASH_CONSTANTS.TAG}/1`);
        });

        it("navigates to the 'All Rules' page when 'Add a New Rule' is clicked", () => {
            store = mockStore({
                ruleTable: [],
                tagTable: [],
            });

            render(
                <Provider store={store}>
                    <TableOfContents />
                </Provider>,
            );

            const addButton = screen.getByRole("button", {name: /Add a New Rule/i});
            fireEvent.click(addButton);

            expect(window.location.hash).toBe(`#/${HASH_CONSTANTS.ALL_RULES}`);
        });
    });

    describe("Component Updates", () => {
        it("updates state when new ruleTable or tagTable props are received", () => {
            const {rerender} = render(
                <Provider store={store}>
                    <TableOfContents />
                </Provider>,
            );

            // Initially, no tags or rules should be rendered
            expect(screen.queryByText("Tag 1")).toBeNull();
            expect(screen.queryByText("Rule 1")).toBeNull();

            // Update store with new tagTable and ruleTable
            store = mockStore({
                ruleTable: [{title: "Rule 1"}],
                tagTable: [{ID: 1, tagName: "Tag 1"}],
            });

            rerender(
                <Provider store={store}>
                    <TableOfContents />
                </Provider>,
            );

            // Now the tags and rules should be rendered
            expect(screen.getByText("Tag 1")).toBeInTheDocument();
            expect(screen.getByText("Rule 1")).toBeInTheDocument();
        });
    });

    describe("Welcome Message and Links", () => {
        it("displays the installation link in the welcome message", () => {
            render(
                <Provider store={store}>
                    <TableOfContents />
                </Provider>,
            );

            const installLink = screen.getByText(/installation process/i);
            expect(installLink).toHaveAttribute("href", CONFIG.INSTALLATION_LINK);
        });
    });
});
