import reducer from "./reduxReducer";
import {REDUX_STORE_ACTIONS, REDUX_STORE_MESSAGES} from "./reduxConstants";
import {REDUX_INITIAL_STATE} from "./reduxInitialState";

describe("Redux Reducer", () => {
    let initialState;

    beforeEach(() => {
        initialState = JSON.parse(JSON.stringify(REDUX_INITIAL_STATE));
    });

    describe("Default Behavior", () => {
        it("should return the initial state by default", () => {
            const action = {type: "UNKNOWN_ACTION"};
            expect(reducer(undefined, action)).toEqual(initialState);
        });

        it("should not mutate the original state when an unknown action is dispatched", () => {
            const action = {type: "UNKNOWN_ACTION"};
            const newState = reducer(initialState, action);
            expect(newState).toBe(initialState);
        });
    });

    describe("Handling ACTION_UPDATE_LOADING_GIF", () => {
        it("should update loadingGif when ACTION_UPDATE_LOADING_GIF is dispatched", () => {
            const action = {
                type: REDUX_STORE_ACTIONS.ACTION_UPDATE_LOADING_GIF,
                data: {
                    loadingGif: true,
                    loadingMessage: "New Loading Message",
                },
            };
            const expectedState = {
                ...initialState,
                loadingGif: true,
                loadingMessage: "New Loading Message",
                message: REDUX_STORE_MESSAGES.LOADING_GIF_STATUS_MSG,
            };
            expect(reducer(initialState, action)).toEqual(expectedState);
        });

        it("should update loadingMessage when ACTION_UPDATE_LOADING_GIF is dispatched with loadingMessage", () => {
            const action = {
                type: REDUX_STORE_ACTIONS.ACTION_UPDATE_LOADING_GIF,
                data: {
                    loadingGif: true,
                    loadingMessage: "New Loading Message",
                },
            };
            const expectedState = {
                ...initialState,
                loadingGif: true,
                loadingMessage: "New Loading Message",
                message: REDUX_STORE_MESSAGES.LOADING_GIF_STATUS_MSG,
            };
            expect(reducer(initialState, action)).toEqual(expectedState);
        });

        it("should not mutate the original state when handling ACTION_UPDATE_LOADING_GIF", () => {
            const action = {
                type: REDUX_STORE_ACTIONS.ACTION_UPDATE_LOADING_GIF,
                data: {
                    loadingGif: true,
                    loadingMessage: "New Loading Message",
                },
            };
            const newState = reducer(initialState, action);

            expect(newState).not.toBe(initialState);
            expect(initialState).toEqual(REDUX_INITIAL_STATE);
        });
    });
});
