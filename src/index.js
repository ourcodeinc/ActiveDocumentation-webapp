// import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';

import {create} from './App';

// ReactDOM.render(<App />, document.getElementById('root'));

const parent = document.querySelector('#root');
create(parent).init();

registerServiceWorker();
