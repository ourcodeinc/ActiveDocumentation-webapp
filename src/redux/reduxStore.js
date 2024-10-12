import {configureStore} from "@reduxjs/toolkit";
import reducer from "./reduxReducer";

const reduxStore = configureStore({
    reducer: reducer,
});

export default reduxStore;
