import {REDUX_STORE_ACTIONS} from "./reduxConstants";

/**
 * update the loadingGif property.
 * @param status {boolean}
 * @return {{data: {loadingGif}, type: string}}
 */
export const updateLoadingGif = (status) => {
    return {
        type: REDUX_STORE_ACTIONS.ACTION_UPDATE_LOADING_GIF,
        data: {
            loadingGif: status,
        },
    };
};
