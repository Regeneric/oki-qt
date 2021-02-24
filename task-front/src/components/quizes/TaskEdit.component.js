import React, {Component} from "react";
import axios from "axios";

import Question from "./containers/Question.container";
import TaskInputForm from "./containers/TaskInputForm.container";

export default class QuizEdit extends Component {
    constructor(props) {
        super(props);

        this.onChangeQuestion = this.onChangeQuestion.bind(this);
        this.onChangeAnswer = this.onChangeAnswer.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);

        this.onChangePublicQuestion = this.onChangePublicQuestion.bind(this);
        this.onClickAddQuestion = this.onClickAddQuestion.bind(this);
        this.onClickDeleteQuestion = this.onClickDeleteQuestion.bind(this);

        this.markAnswer = this.markAnswer.bind(this);
        this.quizButton = this.quizButton.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            category: '',
            isPublic: '',
            question: '',
                anA: '',
                anB: '',
                anC: '',
                anD: '',
            questions: [],
            
            publicQuestions: [],
            publicCategory: '',
            publicQuestion: '',
            publicQuestionObj: '',

            quiz: '',
            quizAuthor: '',
            takes: 0,

            isLoggedUser: false,
            isActiveUser: false,
            sessionID: ''
        }
    }

    async componentDidMount() {
        await axios.get("/users?userName="+window.sessionStorage.getItem("userName")+"&api_key="+process.env.REACT_APP_API_KEY)
            .then(res => {
                this.setState({
                    isLoggedUser: res.data[0].isLogged,
                    isActiveUser: res.data[0].isActive,
                    sessionID: res.data[0].roomID,
                });
            })
        .catch(err => {window.location = '/login';});

        await axios.get("/quizes?_id="+this.props.match.params.id+"&api_key="+process.env.REACT_APP_API_KEY)
            .then(res => {
                this.setState({
                    quizAuthor: res.data[0].quizAuthor,
                    isPublic: res.data[0].isPublic
                });
            })
        .catch(err => {window.location = '/login';});


        if(this.state.quizAuthor === window.sessionStorage.getItem("userName")) {
            if(this.state.isLoggedUser && this.state.isActiveUser && (window.sessionStorage.getItem("sessionID") === this.state.sessionID)) {
                await axios.get("/questions?isPublic=true&api_key="+process.env.REACT_APP_API_KEY)
                    .then(res => {this.setState({publicQuestions: res.data})})
                .catch(err => err);

                await axios.get("/quizes?_id="+this.props.match.params.id+"&api_key="+process.env.REACT_APP_API_KEY)
                    .then(res => {this.setState({
                        quiz: res.data[0],
                        questions: res.data[0].quizQuestions,
                        takes: res.data[0].takes
                    })})
                .catch(err => err);
            } else window.location = '/login';
        } else window.location = '/quiz/show/'+this.props.match.params.id;
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
                if(this.state.question.length > 0 && 
                    (this.state.anA.length > 0 && this.state.anB.length > 0) && 
                    this.state.category.length > 0) {
        
                    const question = {
                        id: Math.floor(Math.random() * 10000) + new Date().toISOString(),
                        category: this.state.category,
                        isPublic: this.state.isPublic,
                        text: this.state.question,
                            anA: this.state.anA,
                            anB: this.state.anB,
                            anC: this.state.anC,
                            anD: this.state.anD,
                        correct: new Set(),
                        author: window.sessionStorage.getItem("userName"),
                        new: true
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
                        new: true
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
            break;
            default: break;
        }
    }

    onClickDeleteQuestion(id, isNew) {
        if(isNew) {
            const {questions} = this.state;
            const arr = questions.filter(q => q.id !== id);
            
            this.setState({questions: arr});
        } else console.log("Nope");
    }


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
        if(this.state.questions.length > 0) return <button type="submit" className="btn btn-success mb-3">Aktualizuj quiz</button>
    }


    async onSubmit(e) {
        e.preventDefault();
        const {questions} = this.state;

        questions.forEach(async q => {
            const question = {
                id: q.id,
                qstAuthor: q.author,
                qstBody: q.text,
                    qstAnA: q.anA,
                    qstAnB: q.anB,
                    qstAnC: q.anC || null,
                    qstAnD: q.anD || null,
                qstCategory: q.category,
                correctAnswers: Array.from(q.correct),
                isPublic: q.isPublic,
            };

            await axios.get("/questions?id="+q.id+"&api_key="+process.env.REACT_APP_API_KEY)
                .then(res => {
                    axios.put("/questions/update/"+res.data[0]._id+"?api_key="+process.env.REACT_APP_API_KEY, question)
                        .then(res => res)
                    .catch(err => err);
                })
            .catch(err => {
                axios.post("/questions/add?api_key="+process.env.REACT_APP_API_KEY, question)
                    .then(res => res)
                .catch(err => err);
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
            };

            tmp = [...tmp, question];
        });

        const qst = tmp.map(q => q.new === true ? {...q, new: false} : q);

        const quiz = {
            quizQuestions: qst,
            takes: this.state.takes+3
        }; await axios.put("/quizes/update/"+this.props.match.params.id+"?api_key="+process.env.REACT_APP_API_KEY, quiz).then(res => res).catch(err => err);


        this.setState({
            question: '',
                anA: '',
                anB: '',
                anC: '',
                anD: '',
            questions: [],
            
            publicQuestions: [],
            publicCategory: '',
            publicQuestion: '',
            publicQuestionObj: '',

            quiz: '',
            quizAuthor: '',

            isLoggedUser: false,
            isActiveUser: false,
        });

        window.location = '/quiz/show/'+this.props.match.params.id;
    }


    questionsList() {
        if(this.state.questions.length > 0) {
            return this.state.questions.map(qc => {
                if(qc.new) return <Question key={qc.id} question={qc} page={"make"} markAnswer={this.markAnswer} deleteQuestion={this.onClickDeleteQuestion} faColor="red" cursor="pointer" />
                else return <Question key={qc.id} question={qc} page={"make"} markAnswer={this.markAnswer} deleteQuestion={this.onClickDeleteQuestion} faColor="grey" cursor="default" />
            });
        }
    }


    render() {
        if(this.state.isLoggedUser && this.state.isActiveUser && (this.state.quizAuthor === window.sessionStorage.getItem("userName")) && (this.state.sessionID === window.sessionStorage.getItem("sessionID"))) {
            return(
                <main>
                    <div className="d-flex flex-column align-items-center list-container">
                        <form className="d-flex flex-column align-items-center mt-4 p-2 px-4 mb-4" onSubmit={this.onSubmit} style={{backgroundColor: "#575656", borderRadius: "6px"}}>
                            <h2 className="mt-4 mb-0 text-light">Stwórz nowy quiz</h2>
                            <TaskInputForm 
                                state={this.state} 
                                
                                onChangeCategory={this.onChangeCategory} 
                                onChangeQuestion={this.onChangeQuestion}
                                onChangePublicQuestion={this.onChangePublicQuestion}
                                onChangeAnswer={this.onChangeAnswer}
                                onClickAddQuestion={this.onClickAddQuestion}
                            />
                        
                            {this.questionsList()}
                            {this.quizButton()}
                        </form>
                    </div>
                </main>
            );
        } if(!this.state.isLoggedUser || !this.state.isActiveUser || (this.state.quizAuthor !== window.sessionStorage.getItem("userName")) || (this.state.sessionID !== window.sessionStorage.getItem("sessionID"))) {
            return(
                <main>
                    <div className="d-flex flex-column align-items-center list-container">
                        <h2 className="mt-3 text-dark">Następuje przekierowanie na stronę logowania...</h2>
                    </div>
                </main>
            );
        } else return null;
    }
}