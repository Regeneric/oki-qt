import React from "react";
import {Link} from "react-router-dom";

import axios from "axios";
import Cookies from "js-cookie";

// import ActiveQuizImg from "../images/active.png";
import ActiveQuizListImg from "../../../images/active_list.png";

const QuizToShow = props => {
    if(props.state.isAdmin === "true") {
        return(
            <section className="d-flex flex-column align-items-center p-2 py-4 mx-auto my-1 mt-4 quiz-card-show" style={{backgroundColor: props.bg, color: "black", borderRadius: "6px", fontWeight: props.fwl}}>
                <h2 style={{color: props.fg}}>{props.quiz.quizAuthor} - {props.quiz.quizCategory}</h2>
                <Link className="p-3 text-center" to={"/quiz/show/"+props.quiz._id} style={{color: props.fg}}>
                    {props.quiz.quizDesc.length > 320 
                        ? props.quiz.quizDesc.replace(/^(.{320}[^\s]*).*/, "$1")+"..." 
                        : props.quiz.quizDesc.replace(/^(.{320}[^\s]*).*/, "$1")}
                </Link>

                <div className="active-action-buttons">
                    <Link className="btn btn-primary text-dark action-button" to={"/quiz/show/"+props.quiz._id} style={{backgroundColor: props.btng}}>Weź udział</Link>
                    <Link className="btn btn-warning action-button" to={"/ranking/"+props.quiz._id}>Zobacz ranking</Link>
                    <Link className="btn btn-success action-button text-dark" to={"/quiz/edit/"+props.quiz._id}>Edytuj quiz</Link>
                    <button className="btn btn-danger action-button" onClick={() => props.onClickQuizRemove(props.quiz._id)}>Usuń quiz</button>
                </div>
            </section>
        );
    } else {
        if(props.quiz.quizStartDate > new Date().toISOString()) {
            return(
                <section>
    
                    <section className="d-flex flex-column align-items-center p-2 py-4 mx-auto my-1 mt-4 quiz-card-show" style={{backgroundColor: props.bg, color: "black", borderRadius: "6px", fontWeight: props.fwl}}>
                        <h2 style={{color: props.fg}}>{props.quiz.quizAuthor} - {props.quiz.quizCategory}</h2>
                        <Link className="p-3 text-center" to={"/quiz/show/"+props.quiz._id} style={{color: props.fg}}>
                            {props.quiz.quizDesc.length > 320 
                                ? props.quiz.quizDesc.replace(/^(.{320}[^\s]*).*/, "$1")+"..." 
                                : props.quiz.quizDesc.replace(/^(.{320}[^\s]*).*/, "$1")}
                        </Link>
                        
                        <div>
                            <Link className="btn btn-primary text-dark" to={"/quiz/show/"+props.quiz._id} style={{backgroundColor: props.btng}}>Weź udział</Link>
                            {/* <Link className="btn btn-warning ml-2" to={"/ranking/"+props.quiz._id}>Zobacz ranking</Link> */}
                        </div>
                        
                        <p className="mt-4" style={{color: props.fg}}>Ranking dostępny od dnia {props.quiz.quizStartDate.substring(0, 10)}</p>
                    </section>
                </section>
            );
        } if(props.quiz.quizEndDate < new Date().toISOString()) {
            return(
                <section className="d-flex flex-column align-items-center p-2 py-4 mx-auto my-1 mt-4 quiz-card-show" style={{backgroundColor: props.bg, color: "black", borderRadius: "6px", fontWeight: props.fwl}}>
                    <h2 style={{color: props.fg}}>{props.quiz.quizAuthor} - {props.quiz.quizCategory}</h2>
                    <Link className="p-3 text-center" to={"/ranking/"+props.quiz._id} style={{color: props.fg}}>
                        {props.quiz.quizDesc.length > 320 
                            ? props.quiz.quizDesc.replace(/^(.{320}[^\s]*).*/, "$1")+"..." 
                            : props.quiz.quizDesc.replace(/^(.{320}[^\s]*).*/, "$1")}
                    </Link>
    
                    <div>
                        {/* <Link className="btn btn-primary text-dark" to={"/quiz-show/"+props.quiz._id}>Weź udział</Link> */}
                        <Link className="btn btn-warning ml-2" to={"/ranking/"+props.quiz._id}>Zobacz ranking</Link>
                    </div>
                    
                    <p className="mt-4" style={{color: props.fg}}>Quiz zakończył się dnia {props.quiz.quizEndDate.substring(0, 10)}</p>
                </section>
            );
        } if( props.quiz.quizStartDate <= new Date().toISOString() && props.quiz.quizEndDate >= new Date().toISOString() && props.quiz.quizAuthor === Cookies.get("userName")) {
            return(
                <section className="d-flex flex-column align-items-center p-2 py-4 mx-auto my-1 mt-4 quiz-card-show" style={{backgroundColor: props.bg, color: "black", borderRadius: "6px", fontWeight: props.fwl}}>
                    <h2 style={{color: props.fg}}>{props.quiz.quizAuthor} - {props.quiz.quizCategory}</h2>
                    <Link className="p-3 text-center" to={"/quiz/show/"+props.quiz._id} style={{color: props.fg}}>
                        {props.quiz.quizDesc.length > 320 
                            ? props.quiz.quizDesc.replace(/^(.{320}[^\s]*).*/, "$1")+"..." 
                            : props.quiz.quizDesc.replace(/^(.{320}[^\s]*).*/, "$1")}
                    </Link>
    
                    <div className="active-action-buttons">
                        <Link className="btn btn-primary text-dark action-button" to={"/quiz/show/"+props.quiz._id} style={{backgroundColor: props.btng}}>Weź udział</Link>
                        <Link className="btn btn-warning action-button" to={"/ranking/"+props.quiz._id}>Zobacz ranking</Link>
                        <Link className="btn btn-success action-button text-dark" to={"/quiz/edit/"+props.quiz._id}>Edytuj quiz</Link>
                        <button className="btn btn-danger action-button" onClick={() => props.onClickQuizRemove(props.quiz._id)}>Usuń quiz</button>
                    </div>
                </section>
            );
        } else {
            return(
                <section className="d-flex flex-column align-items-center p-2 py-4 mx-auto my-1 mt-4 quiz-card-show" style={{backgroundColor: props.bg, color: "black", borderRadius: "6px", fontWeight: props.fwl}}>
                    <h2 style={{color: props.fg}}>{props.quiz.quizAuthor} - {props.quiz.quizCategory}</h2>
                    <Link className="p-3 text-center" to={"/quiz/show/"+props.quiz._id} style={{color: props.fg}}>
                        {props.quiz.quizDesc.length > 320 
                            ? props.quiz.quizDesc.replace(/^(.{320}[^\s]*).*/, "$1")+"..." 
                            : props.quiz.quizDesc.replace(/^(.{320}[^\s]*).*/, "$1")}
                    </Link>
    
                    <div className="active-action-buttons">
                        <Link className="btn btn-primary text-dark action-button" to={"/quiz/show/"+props.quiz._id} style={{backgroundColor: props.btng}}>Weź udział</Link>
                        <Link className="btn btn-warning action-button" to={"/ranking/"+props.quiz._id}>Zobacz ranking</Link>
                    </div>
                </section>
            );
        }
    }

}; export default QuizToShow;