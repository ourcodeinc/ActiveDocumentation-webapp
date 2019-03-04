import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux'

import store from './reduxStore';
import configureMonaco from './configureMonaco';
// import {generateInitialElements, generateInitialElementTreeNodes} from "./ui/ruleGenerationGUI/guiConstants";

configureMonaco();

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();

// generateInitialElements("class_el", "0");
// generateInitialElementTreeNodes("class_el", "0", "");