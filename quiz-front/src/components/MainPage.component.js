import React, {Component} from "react";
import {Link} from "react-router-dom";

import ActiveQuizImg from "../images/active.png";
import ComingSoonQuizImg from "../images/coming-soon.png";
import DoneQuizImg from "../images/done.png"

export default class MainPage extends Component {
    constructor(props) {super(props);}

    render() {
        return(
            <main>
                <div className="content-container">
                    <div className="quiz-card">
                        <Link to="/quizes/active/">
                            <img className="quiz-img" src={ActiveQuizImg}></img>
                            <div className="quiz-meta" id="active">
                                <span className="text-dark">Aktywne Obecnie</span>
                            </div>
                        </Link>
                    </div>

                    <div className="quiz-card">
                        <Link to="/quizes/coming-soon/">
                            <div className="quiz-meta" id="coming">
                                <span className="text-dark">Przyszłe</span>
                            </div>
                            <img className="quiz-img" src={ComingSoonQuizImg}></img>
                        </Link>
                    </div>   

                    <div className="quiz-card">
                        <Link to="/quizes/completed/">
                            <img className="quiz-img" src={DoneQuizImg}></img>
                            <div className="quiz-meta" id="expired">
                                <span className="text-dark">Zakończone</span>
                            </div>
                        </Link>
                    </div>   
                </div>
            </main>
        );
    }
}