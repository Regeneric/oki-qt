/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 02/10/2020
// File: ./src/index.js
/*-!INFO!-*/


import React from 'react';
import ReactDOM from 'react-dom';
import axios from "axios";

import MainView from "./MainView";

// Here's the address for the backend server
axios.defaults.baseURL = "---";
// axios.defaults.withCredentials = true;
// axios.defaults.crossDomain = true;

ReactDOM.render(
  <MainView />,
  document.querySelector("#root")
);
