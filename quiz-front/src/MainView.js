/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 16/10/2020
// File: ./src/MainView.js
/*-!INFO!-*/

import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./css/style.css";
import "./css/grid.css";
import "./css/media.css";

import Navbar from "./components/Navbar.component";
import NotFound from "./components/NotFound.component";
import Footer from "./components/Footer.component"

import MainPage from "./components/MainPage.component";

import Active from "./components/quizes/Active.component";
import ComingSoon from "./components/quizes/ComingSoon.component";
import Expired from "./components/quizes/Expired.component";

import Quiz from "./components/quizes/Quiz.component";
import QuizAdd from "./components/quizes/QuizAdd.component";
import QuizEdit from "./components/quizes/QuizEdit.component";
import QuizFind from "./components/quizes/QuizFind.component"

import Ranking from "./components/quizes/Ranking.component";

import Login from "./components/login/Login.component";
import Confirm from "./components/login/Confirm.component";
import Forgot from "./components/login/Forgot.component";
import Reset from "./components/login/Reset.component";

function MainView() {
    return(
        <Router>
            <Navbar />
            <Switch>
                <Route exact path="/" component={MainPage} />
            
                <Route path="/quizes/active/" component={Active} />
                <Route path="/quizes/coming-soon/" component={ComingSoon} />
                <Route path="/quizes/completed/" component={Expired} />

                <Route exact path="/quiz/show/:id" component={Quiz} />
                <Route exact path="/quiz/add/" component={QuizAdd} />
                <Route exact path="/quiz/edit/:id" component={QuizEdit} />
                <Route exact path="/quiz/find/" component={QuizFind} />

                <Route exact path="/ranking/:id" component={Ranking} />

                <Route exact path="/login/" component={Login} />
                <Route path="/login/forgot/" component={Forgot} />
                
                <Route exact path="/reset/:id/:unique" component={Reset} />
                <Route exact path="/confirm/:id" component={Confirm} />

                <Route component={NotFound} />
            </Switch>
            {/* <Footer /> */}
        </Router>
    );
}; export default MainView;