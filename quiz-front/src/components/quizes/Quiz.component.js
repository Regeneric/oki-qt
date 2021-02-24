import React, {Component} from "react";
import axios from "axios";
import Cookies from "js-cookie";

import Question from "./containers/Question.container";
import Result from "./containers/Result.container";

export default class Quiz extends Component {
    constructor(props) {
        super(props);

        this.markAnswer = this.markAnswer.bind(this);
        this.markAnswerOpen = this.markAnswerOpen.bind(this);
        this.resultDialog = this.resultDialog.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            quiz: [],

            id: '',
            author: '',
            category: '',
            desc: '',
            duration: '',
            questions: [],
            takes: 0,
            contributors: [],
            openAns: [],

            renderDialog: false,
            points: 0,

            isLogged: false,
            isActive: false,
            sessionID: '',

            minutes: 0,
            seconds: 0,

            domain: "itcrowd.net.pl"
        }
    }

    async componentDidMount(e) {
        await axios.get("/users?userName="+Cookies.get("userName")+"&api_key="+process.env.REACT_APP_API_KEY)
            .then(res => {
                this.setState({
                    isLogged: res.data[0].isLogged,
                    isActive: res.data[0].isActive,
                    sessionID: res.data[0].roomID,
                });
            })
        .catch(err => {window.location = '/login';});

        if(this.state.isLogged && this.state.isActive && (Cookies.get("token") != null)) {
            await axios.get("/quizes/"+this.props.match.params.id+"?api_key="+process.env.REACT_APP_API_KEY)
                .then(res => {this.setState({quiz: res.data});})
            .catch(err => err);

            const {quiz} = this.state;
            this.setState({
                id: quiz._id,
                author: quiz.quizAuthor,
                category: quiz.quizCategory,
                desc: quiz.quizDesc,
                duration: quiz.quizDuration,
                questions: quiz.quizQuestions,
                contributors: quiz.contributors,
                takes: quiz.takes,
                minutes: (window.sessionStorage.getItem(Cookies.get("userName")+"minutes"+quiz._id) > 0) 
                            ? window.sessionStorage.getItem(Cookies.get("userName")+"minutes"+quiz._id) 
                            : quiz.quizDuration,

                seconds: (window.sessionStorage.getItem(Cookies.get("userName")+"seconds"+quiz._id) > 0) 
                            ? window.sessionStorage.getItem(Cookies.get("userName")+"seconds"+quiz._id) 
                            : 0,
            });
        } else window.location = '/login';


        this.myInterval = setInterval(() => {
            const {id, seconds, minutes} = this.state;
            
            window.sessionStorage.setItem(Cookies.get("userName")+"minutes"+id, minutes);
            window.sessionStorage.setItem(Cookies.get("userName")+"seconds"+id, seconds);

            if(seconds > 0) this.setState(({seconds}) => ({seconds: seconds - 1}))
            if(seconds === 0) {
                if(minutes === 0) clearInterval(this.myInterval)
                else {
                    this.setState(({minutes}) => ({
                        minutes: minutes - 1,
                        seconds: 59
                    }));
                }
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }

    markAnswer(id, answer, e) {
        const {questions} = this.state;

        const single = [...questions].filter(q => q.id === id);
        single[0].checked = new Set(single[0].checked);

        single[0].checked.add(answer);
        if(e) if(!e.target.checked && single[0].checked.has(e.target.name)) single[0].checked.delete(e.target.name);

        const index = questions.map(q => q.id).indexOf(id);
        const arr = questions;
        arr[index] = single[0];
        
        this.setState({questions: arr});
    }

    markAnswerOpen(id, answer, e) {
        this.setState({openAns: {
            id: id,
            answer: e.target.value
        }});
    }

    async onSubmit(e) {
        e.preventDefault();

        const {questions, openAns, domain} = this.state;

        let trimmed = new Array();
        questions.forEach(q => {
            const question = {
                id: q.id,
                qstBody: q.text,
                    qstAnA: q.anA,
                    qstAnB: q.anB,
                    qstAnC: q.anC || null,
                    qstAnD: q.anD || null,
                qstCategory: q.category,
                checked: q.checked ? Array.from(q.checked) : null,
                isPublic: q.isPublic,
                isOpen: q.isOpen,
                openAns: openAns
            }; trimmed.push(question);
        });

        const current = this.state.contributors.length > 0 ? this.state.contributors.filter(c => c.userName === Cookies.get("userName")) : 0;

        if(current.length > this.state.takes-1) alert("Przekroczyłeś limit prób!");
        else {
            await axios.post("/answers/check?api_key="+process.env.REACT_APP_API_KEY, trimmed)
                .then(res => {
                    let cnt = 0;
                    res.data.forEach(d => d.isCorrect ? cnt++ : cnt);
                    this.setState({points: cnt, renderDialog: true})
                })
            .catch(err => err);
        }


        let con = new Array();
        if(typeof current != "number") {
            if(current.length <= this.state.takes-1) {
                con = [...this.state.contributors, {userName: Cookies.get("userName"), points: this.state.points, time: `${window.sessionStorage.getItem(Cookies.get("userName")+"minutes"+this.props.match.params.id)}:${window.sessionStorage.getItem(Cookies.get("userName")+"seconds"+this.props.match.params.id)}`}];
            }
        } else con = [{userName: Cookies.get("userName"), points: this.state.points, time: `${window.sessionStorage.getItem(Cookies.get("userName")+"minutes"+this.props.match.params.id)}:${window.sessionStorage.getItem(Cookies.get("userName")+"seconds"+this.props.match.params.id)}`}];

        const quizObj = {
            lastTake: new Date(),
            contributors: con.length > 0 ? con : this.state.contributors
        };

        axios.put(`/quizes/update/${this.props.match.params.id}?api_key=${process.env.REACT_APP_API_KEY}`, quizObj, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
            .then(res => res)
        .catch(err => {
            if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
            else console.log("Nope");
        });
        
        this.setState({
            minutes: 0,
            seconds: 0
        });
        
        window.sessionStorage.removeItem(Cookies.get("userName")+"minutes"+this.props.match.params.id);
        window.sessionStorage.removeItem(Cookies.get("userName")+"seconds"+this.props.match.params.id);

        window.scrollTo(0, 0);
    }


    questionsList() {
        if(this.state.isLogged && this.state.isActive && (Cookies.get("token") != null)) {
            return this.state.questions.map(q => (
                <Question key={q._id} question={q} markAnswer={this.markAnswer} markAnswerOpen={this.markAnswerOpen} page="take" showResult={this.state.renderDialog} />
            ));
        } else return null;
    }

    resultDialog() {
        if(this.state.isLogged && this.state.isActive && (Cookies.get("token") != null)) {
            return <Result state={this.state} id={this.props.match.params.id} />
        } else return null;
    }

    quizButton() {
        if(this.state.isLogged && this.state.isActive && (Cookies.get("token") != null)) {
            if(!this.state.renderDialog) return <button type="submit" name="quiz-end" className="btn btn-primary mt-2 mb-4">Zakończ quiz</button>
            else return null;
        } else return null;
    }


    render() {
        if(this.state.isLogged && this.state.isActive && (Cookies.get("token") != null)) {
            return(
                <div className="d-flex flex-column align-items-center mt-5 pt-5" style={{minHeight: "90.4vh"}}>
                    <h2 className="mt-3 text-dark">{this.state.author + " - " + this.state.category}</h2>

                    <div className="d-flex">
                        {this.state.minutes === 0 && this.state.seconds === 0 && this.state.renderDialog === true
                            ? <h4>Time's up!</h4>
                            : <h4>{this.state.minutes}:{this.state.seconds < 10 ? `0${this.state.seconds}` : this.state.seconds}</h4>
                        }
                    </div>

                    <form className="d-flex flex-column align-items-center w-100" onSubmit={this.onSubmit}>
    
                        {this.resultDialog()}
    
                        {this.questionsList()}
                        
                        {this.quizButton()}
                    </form>
                </div>
            );
        } else {
            return(
                <div className="d-flex flex-column align-items-center mt-5 pt-5" style={{minHeight: "86vh"}}>
                    <h2 className="mt-3 text-dark">Następuje przekierowanie na stronę logowania...</h2>
                </div>
            );
        }
    }
}