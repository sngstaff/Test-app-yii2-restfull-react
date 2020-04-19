import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { App } from "./components/app";

ReactDOM.render(
    <Router history = { history }>
        <App history = { history } />
    </Router>,
    document.getElementById("root")
);