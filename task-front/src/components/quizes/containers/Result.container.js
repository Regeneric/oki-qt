import React from "react";
import {Link} from "react-router-dom";

const Result = props => {
    if(props.state.renderDialog && props.state.quiz.quizStartDate <= new Date().toISOString()) {
        return(
            <div className="text-light p-3 mt-4 d-flex justify-content-between align-items-center" 
                style={{border: "none", backgroundColor: "#333444", boxShadow: "2px 2px 2px black", width: "50vw"}}
            >
                <div>
                    <span className="mr-4">Zdobyte punkty: </span> {props.state.points} / {props.state.questions.length}
                </div>

                <div className="btn btn-success">
                    <Link to={"/ranking/"+props.id}>Zobacz ranking</Link>
                </div>
            </div>
        );
    } if(props.state.renderDialog && props.state.quiz.quizStartDate > new Date().toISOString()) {
        return(
            <div className="text-light p-3 mt-4 d-flex justify-content-between align-items-center" 
                style={{border: "none", backgroundColor: "#333444", boxShadow: "2px 2px 2px black", width: "50vw"}}
            >
                <div>
                    <span className="mr-4">Zdobyte punkty: </span> {props.state.points} / {props.state.questions.length}
                </div>

                <p className="m-0">Ranking dostępny od dnia {props.state.quiz.quizStartDate.substring(0, 10)}</p>
            </div>
        );
    } else return null;
}; export default Result;