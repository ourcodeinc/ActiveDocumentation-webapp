import {REDUX_STORE_ACTIONS, REDUX_STORE_MESSAGES} from "./reduxConstants";
import {REDUX_INITIAL_STATE} from "./reduxInitialState";

/**
 * using default_state as a default value surprisingly changes its value
 * Any incoming variable through arguments must be cloned and mutated,
 * Direct mutation doesn't work properly (UPDATE_RULE_TABLE)
 * @param state
 * @param action
 * @returns {*} new state
 */
const reducer = (state = JSON.parse(JSON.stringify(REDUX_INITIAL_STATE)), action) => {
    switch (action.type) {
        case REDUX_STORE_ACTIONS.ACTION_UPDATE_LOADING_GIF:
            return Object.assign({}, state, {
                message: REDUX_STORE_MESSAGES.LOADING_GIF_STATUS_MSG,
                loadingGif: action.data["loadingGif"],
                loadingMessage: action.data["loadingMessage"],
            });
        default:
            return state;
    }
};

export default reducer;
