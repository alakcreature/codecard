import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import "./index.css";
import App from "./App";
import { hydrate, render } from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  faUser,
  faBell,
  faInfo,
  faPen,
  faLink,
  faHeart,
  faCircle,
  faArrowUp,
  faAngleUp,
  faArrowDown,
  faAngleDown,
  faCameraRetro,
  faAngleDoubleDown,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import * as serviceWorker from "./serviceWorker";

library.add(
  fab,
  faUser,
  faBell,
  faInfo,
  faPen,
  faLink,
  faHeart,
  faCircle,
  faArrowUp,
  faAngleUp,
  faArrowDown,
  faAngleDown,
  faCameraRetro,
  faAngleDoubleDown,
  faArrowRightFromBracket
);

// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>
//   ,
//   document.getElementById('root')
// );

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(
    <Provider store={store}>
      <App />
    </Provider>,
    rootElement
  );
} else {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    rootElement
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
