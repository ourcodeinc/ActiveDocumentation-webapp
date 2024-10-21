import "@testing-library/jest-dom";
import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import NavBar from "./navBar";
import {HASH_CONSTANTS} from "./uiConstants";

describe("NavBar Component", () => {
    beforeEach(() => {
        window.location.hash = "";
    });

    it("renders the NavBar component", () => {
        render(<NavBar />);

        const tocLink = screen.getByText(/Table of Contents/i);
        const allRulesLink = screen.getByText(/All Rules/i);
        const violatedRulesLink = screen.getByText(/Violated Rules/i);

        expect(tocLink).toBeInTheDocument();
        expect(allRulesLink).toBeInTheDocument();
        expect(violatedRulesLink).toBeInTheDocument();
    });

    it("updates the window location hash when a nav item is selected", () => {
        render(<NavBar />);

        fireEvent.click(screen.getByText(/All Rules/i));
        expect(window.location.hash).toBe(`#/${HASH_CONSTANTS.ALL_RULES}`);

        fireEvent.click(screen.getByText(/Violated Rules/i));
        expect(window.location.hash).toBe(`#/${HASH_CONSTANTS.VIOLATED_RULES}`);

        fireEvent.click(screen.getByText(/Table of Contents/i));
        expect(window.location.hash).toBe(`#/${HASH_CONSTANTS.INDEX}`);
    });
});
