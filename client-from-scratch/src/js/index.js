import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import AppRoutes from './routes';  
import store from "../js/store/index";

// import { AUTH_USER } from './constants/action-types';

// const token = cookie.load('token');

// if (token) {  
//   store.dispatch({ type: AUTH_USER });
// }

ReactDOM.render(  
  <Provider store={store}>
    <AppRoutes />
  </Provider>,
  document.getElementById("app")
);