import React from 'react';
// import ReactDOM from 'react-dom';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';

import { render } from 'react-dom'
import { Provider } from 'react-redux'

import store from './reduxStore';

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);