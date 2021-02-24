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

axios.defaults.crossDomain = true;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = "https://zadania.oki.org.pl";
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

// axios.defaults.headers.common['Accept'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true;


ReactDOM.render(
  <MainView />,
  document.querySelector("#root")
);
