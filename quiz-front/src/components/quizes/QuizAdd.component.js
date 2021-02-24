import React, {Component} from "react";

import axios from "axios";
import Cookies from "js-cookie";

import Question from "./containers/Question.container";

import QuizSetup from "./containers/QuizSetup.container";
import QuizInputForm from "./containers/QuizInputForm.container";

export default class QuizAdd extends Component {
    constructor(props) {
        super(props);

        this.onChangeQuestion = this.onChangeQuestion.bind(this);
        this.onChangeAnswer = this.onChangeAnswer.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);

        this.onChangePublicQuestion = this.onChangePublicQuestion.bind(this);
        
        this.onClickAddQuestion = this.onClickAddQuestion.bind(this);
        this.onClickDeleteQuestion = this.onClickDeleteQuestion.bind(this);
        this.onChangeQuestionOpen = this.onChangeQuestionOpen.bind(this);

        this.markAnswer = this.markAnswer.bind(this);
        this.quizButton = this.quizButton.bind(this);


        this.onChangeQuizDesc = this.onChangeQuizDesc.bind(this);
        this.onChangeQuizCategory = this.onChangeQuizCategory.bind(this);
        this.onChangeQuizDuration = this.onChangeQuizDuration.bind(this);
        this.onChangeQuizStartDate = this.onChangeQuizStartDate.bind(this);
        this.onChangeQuizEndDate = this.onChangeQuizEndDate.bind(this);
        this.onChangeQuizTakes = this.onChangeQuizTakes.bind(this);
        this.onClickQuizIsActive = this.onClickQuizIsActive.bind(this); 
        this.onClickQuizIsPublic = this.onClickQuizIsPublic.bind(this);
        this.onClickReadyToRender = this.onClickReadyToRender.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            author: '',
            category: '',
            isPublic: true,
            question: '',
                anA: '',
                anB: '',
                anC: '',
                anD: '',
            questions: [],
            isQuestionOpen: false,
            
            publicQuestions: [],
            publicCategory: '',
            publicQuestion: '',
            publicQuestionObj: '',

            quizID: '',
            quizAuthor: Cookies.get("userName"),
            quizCategory: '',
            quizDuration: '',
            quizStartDate: '',
            quizEndDate: '',
            quizIsActive: true,
            quizDesc: '',
            quizIsPublic: true,
            takes: '',
            quizUpdated: false,

            readyToRender: false,

            isLoggedUser: false,
            isActiveUser: false,

            domain: "itcrowd.net.pl",
        }
    }

    async componentDidMount() {
        await axios.get("/users?userName="+Cookies.get("userName")+"&api_key="+process.env.REACT_APP_API_KEY)
            .then(res => {
                this.setState({
                    isLoggedUser: res.data[0].isLogged,
                    isActiveUser: res.data[0].isActive,
                    sessionID: res.data[0].roomID
                });
            })
        .catch(err => {window.location = '/login';});

        if(!this.state.isLoggedUser || !this.state.isActiveUser) window.location = '/login';
        if(this.state.isLoggedUser && this.state.isActiveUser && (Cookies.get("token") != null)) {
            await axios.get("/questions?isPublic=true&api_key="+process.env.REACT_APP_API_KEY)
                .then(res => {this.setState({publicQuestions: res.data})})
            .catch(err => err);
        } else window.location = '/login';
    }


    onChangeQuestion(e) {this.setState({question: e.target.value});}

    onChangeAnswer(e) {
        switch(e.target.name) {
            case "a": this.setState({anA: e.target.value}); break;
            case "b": this.setState({anB: e.target.value}); break;
            case "c": this.setState({anC: e.target.value}); break;
            case "d": this.setState({anD: e.target.value}); break;
            default: break;
        }
    }

    onChangeCategory(e) {this.setState({category: e.target.value});}

    onChangePublicQuestion(e) {
        const question = this.state.publicQuestions.filter(pq => pq.qstBody.replace(/^(.{45}[^\s]*).*/, "$1") === e.target.value);
        this.setState({publicQuestionObj: question[0]});
    }


    onClickAddQuestion(e) {
        switch(e.target.name) {
            case "new": 
                if(this.state.question.length > 0 && !this.state.isQuestionOpen) {
                    if((this.state.anA.length > 0 && this.state.anB.length > 0) && this.state.category.length > 0) {
                        const question = {
                            id: Math.floor(Math.random() * 10000) + new Date().toISOString(),
                            category: this.state.category,
                            isPublic: this.state.quizIsPublic,
                            text: this.state.question,
                                anA: this.state.anA,
                                anB: this.state.anB,
                                anC: this.state.anC,
                                anD: this.state.anD,
                            correct: new Set(),
                            author: Cookies.get("userName"),
                            new: true,
                            isOpen: this.state.isQuestionOpen,
                        };
                        
                        const arr = [question, ...this.state.questions];
                        this.setState({
                            questions: arr,
                            
                            question: '',
                                anA: '',
                                anB: '',
                                anC: '',
                                anD: '',
                        });
                    }
                } if(this.state.question.length > 0 && this.state.isQuestionOpen) {
                    if(this.state.anA.length > 0 && this.state.category.length > 0) {
                        const question = {
                            id: Math.floor(Math.random() * 10000) + new Date().toISOString(),
                            category: this.state.category,
                            isPublic: this.state.quizIsPublic,
                            text: this.state.question,
                                anA: this.state.anA,
                                anB: this.state.anB,
                                anC: this.state.anC,
                                anD: this.state.anD,
                            correct: new Set(),
                            author: Cookies.get("userName"),
                            new: true,
                            isOpen: this.state.isQuestionOpen,
                        };
                        
                        const arr = [question, ...this.state.questions];
                        this.setState({
                            questions: arr,
                            
                            question: '',
                                anA: '',
                                anB: '',
                                anC: '',
                                anD: '',
                        });
                    }
                }
            break;

            case "exist": 
                const {publicQuestionObj} = this.state;

                if(publicQuestionObj) {
                    const question = {
                        id: publicQuestionObj.id,
                        category: publicQuestionObj.qstCategory,
                        isPublic: publicQuestionObj.isPublic,
                        text: publicQuestionObj.qstBody,
                            anA: publicQuestionObj.qstAnA,
                            anB: publicQuestionObj.qstAnB,
                            anC: publicQuestionObj.qstAnC,
                            anD: publicQuestionObj.qstAnD,
                        correct: publicQuestionObj.correctAnswers,
                        author: publicQuestionObj.qstAuthor,
                        new: true,
                        isOpen: publicQuestionObj.isOpen,
                    };
                
                    const arr = [...this.state.questions, question];
                    const unique = arr.filter((v, i, s) => s.map(x => x.text).indexOf(v.text) == i);

                    this.setState({
                        questions: unique,
                        
                        question: '',
                            anA: '',
                            anB: '',
                            anC: '',
                            anD: '',
                    });
                }
            break;
            default: break;
        }
    }

    onClickDeleteQuestion(id) {
        const {questions} = this.state;
        const arr = questions.filter(q => q.id !== id);
        
        this.setState({questions: arr});
    }

    onChangeQuestionOpen(e) {this.setState({isQuestionOpen: !this.state.isQuestionOpen});}


    markAnswer(id, answer, e) {
        const {questions} = this.state;

        const single = [...questions].filter(q => q.id === id);
        single[0].correct = new Set(single[0].correct);

        single[0].correct.add(answer);
        if(e) if(!e.target.checked && single[0].correct.has(e.target.name)) single[0].correct.delete(e.target.name);

        const index = questions.map(q => q.id).indexOf(id);
        const arr = questions;
        arr[index] = single[0];
        
        this.setState({questions: arr});
    }


    quizButton() {
        if(this.state.questions.length > 0) return <button type="submit" className="btn btn-success mb-3">Stwórz quiz</button>
    }


    onChangeQuizDesc(e) {this.setState({quizDesc: e.target.value});}
    onChangeQuizCategory(e) {this.setState({quizCategory: e.target.value});}
    onChangeQuizDuration(e) {this.setState({quizDuration: e.target.value});}
    onChangeQuizStartDate(e) {this.setState({quizStartDate: e.target.value});}
    onChangeQuizEndDate(e) {this.setState({quizEndDate: e.target.value});}
    onChangeQuizTakes(e) {this.setState({takes: e.target.value});}
    onClickQuizIsActive(e) {this.setState({quizIsActive: !this.state.quizIsActive});}
    onClickQuizIsPublic(e) {this.setState({quizIsPublic: !this.state.quizIsPublic});}

    onClickReadyToRender(e) {
        if(this.state.quizStartDate < new Date().toISOString().substring(0, 10) || this.state.quizEndDate <= new Date().toISOString().substring(0, 10)) {
            alert("Wprowadź poprawną datę quizu!");
        } else {
            if(this.state.quizDesc.length > 0 && this.state.quizCategory.length > 0) {
                this.setState({readyToRender: true});
            }
        }
    }


    async onSubmit(e) {
        e.preventDefault();

        const {questions, domain} = this.state;
        questions.forEach(async q => {
            const question = {
                id: q.id,
                qstAuthor: q.author,
                qstBody: q.text,
                    qstAnA: q.anA,
                    qstAnB: q.anB || null,
                    qstAnC: q.anC || null,
                    qstAnD: q.anD || null,
                qstCategory: q.category,
                correctAnswers: Array.from(q.correct),
                isPublic: q.isPublic,
                isOpen: q.isOpen,
            };

            await axios.post(`/questions/add?api_key=${process.env.REACT_APP_API_KEY}`, question, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                .then(res => res)
            .catch(err => {
                if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                else console.log("Nope");
            });
        }); 

        let tmp = new Array();
        questions.forEach(q => {
            const question = {
                id: q.id,
                author: q.author,
                text: q.text,
                    anA: q.anA,
                    anB: q.anB,
                    anC: q.anC || null,
                    anD: q.anD || null,
                category: q.category,
                correct: Array.from(q.correct),
                isPublic: q.isPublic,
                isOpen: q.isOpen
            };

            tmp = [...tmp, question];
        });

        const {quizAuthor, quizCategory, quizDuration, quizStartDate, quizEndDate, quizDesc, quizIsActive, quizIsPublic, takes} = this.state;

        const qst = tmp.map(q => q.new === true ? {...q, new: false} : q);
        const quiz = {
            quizAuthor: quizAuthor,
            quizDesc: quizDesc,
            quizQuestions: qst,
            quizCategory: quizCategory,
            quizDuration: quizDuration,
            quizStartDate: quizStartDate,
            quizEndDate: quizEndDate,
            isActive: quizIsActive,
            isPublic: quizIsPublic,
            takes: takes
        }; await axios.post(`/quizes/add?api_key=${process.env.REACT_APP_API_KEY}`, quiz, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
            .then(res => {console.log(res.data._id); this.setState({quizID: res.data._id});})
        .catch(err => {
            if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
            else console.log("Nope");
        });

        const uid = await axios.get("/users?userName="+Cookies.get("userName")+"&api_key="+process.env.REACT_APP_API_KEY).then(res => res.data[0]._id).catch(err => err);
        const quizes = await axios.get("/users?userName="+Cookies.get("userName")+"&api_key="+process.env.REACT_APP_API_KEY).then(res => res.data[0].quizes).catch(err => err);

        await axios.put("/users/update/"+uid+"?api_key="+process.env.REACT_APP_API_KEY, {quizes: [...quizes, this.state.quizID]}).then(res => res).catch(err => err);


        this.setState({
            category: '',
            isPublic: '',
            question: '',
                anA: '',
                anB: '',
                anC: '',
                anD: '',
            questions: [],
            
            publicQuestions: '',
            publicCategory: '',
            publicQuestion: '',
            publicQuestionObj: '',

            // quizID: '',
            quizCategory: '',
            quizDuration: '',
            quizStartDate: '',
            quizEndDate: '',
            quizDesc: '',
            quizIsActive: true,
            // quizIsPublic: true,
            takes: '',
            quizUpdated: true,

            readyToRender: false,
        });
    }


    questionsList() {
        return this.state.questions.map(qc => {
            if(qc.new) return <Question key={qc.id} question={qc} page={"make"} markAnswer={this.markAnswer} deleteQuestion={this.onClickDeleteQuestion} faColor="red" cursor="pointer" />
            else return <Question key={qc.id} question={qc} page={"make"} markAnswer={this.markAnswer} deleteQuestion={this.onClickDeleteQuestion} faColor="grey" cursor="default" />
        });
    }


    render() {
        if(this.state.isLoggedUser && this.state.isActiveUser && (Cookies.get("token") != null)) {
            return(
                <main>
                    <div className="d-flex flex-column align-items-center list-container" style={{minHeight: "90.4vh"}}>
                        <form className="d-flex flex-column align-items-center mt-4 p-2 px-4 mb-4 new-quiz-form" onSubmit={this.onSubmit} style={{backgroundColor: "#575656", borderRadius: "6px"}}>
                            <QuizSetup 
                                inputForm={
                                    <QuizInputForm 
                                        state={this.state} 
                                        
                                        onChangeCategory={this.onChangeCategory} 
                                        onChangeQuestion={this.onChangeQuestion}
                                        onChangePublicQuestion={this.onChangePublicQuestion}
                                        onChangeAnswer={this.onChangeAnswer}
                                        onChangeQuestionOpen={this.onChangeQuestionOpen}
                                        onClickAddQuestion={this.onClickAddQuestion}
                                    />}
                                state={this.state}
                                    
                                onChangeCategory={this.onChangeQuizCategory} 
                                onChangeDuration={this.onChangeQuizDuration}
                                onChangeStartDate={this.onChangeQuizStartDate}
                                onChangeEndDate={this.onChangeQuizEndDate}
                                onChangeTakes={this.onChangeQuizTakes}
                                onChangeDesc={this.onChangeQuizDesc}
                                onClickIsActive={this.onClickQuizIsActive}
                                onClickIsPublic={this.onClickQuizIsPublic} 
                                onClickReadyToRender={this.onClickReadyToRender}
                            />
                        
                            {this.questionsList()}
                            {this.quizButton()}
                        </form>
                    </div>
                </main>
            );
        } if(!this.state.isLoggedUser || !this.state.isActiveUser || (Cookies.get("userName") != null)) {
            return(
                <main>
                    <div className="d-flex flex-column align-items-center list-container">
                        <h2 className="mt-3 text-dark">Następuje przekierowanie na stronę logowania...</h2>
                    </div>
                </main>
            );
        }
    }
}