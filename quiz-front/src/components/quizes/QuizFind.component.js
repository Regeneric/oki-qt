import React, {Component} from "react";

import axios from "axios";
import Cookies from "js-cookie";

import QuizToShow from "./containers/QuizToShow.container";

String.prototype.escapeDiac = function() {
    return this.replace(/ą/g, 'a').replace(/Ą/g, 'A')
               .replace(/ć/g, 'c').replace(/Ć/g, 'C')
               .replace(/ę/g, 'e').replace(/Ę/g, 'E')
               .replace(/ł/g, 'l').replace(/Ł/g, 'L')
               .replace(/ń/g, 'n').replace(/Ń/g, 'N')
               .replace(/ó/g, 'o').replace(/Ó/g, 'O')
               .replace(/ś/g, 's').replace(/Ś/g, 'S')
               .replace(/ż/g, 'z').replace(/Ż/g, 'Z')
               .replace(/ź/g, 'z').replace(/Ź/g, 'Z');
}

export default class TaskFind extends Component {
    constructor(props) {
        super(props);

        this.onClickQuizRemove = this.onClickQuizRemove.bind(this);

        this.activeList = this.activeList.bind(this);
        this.onChangeTags = this.onChangeTags.bind(this);
        
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            tags: [],
            quizes: [],

            submited: false,
            completed: false,

            isAdmin: false,
        }
    }

    async componentDidMount() {
        if(this.props.location.search.length > 5) {
            const tag = this.props.history.location.search.slice(5);
            await axios.get(`/quizes/search/${tag}?api_key=${process.env.REACT_APP_API_KEY}`)
                .then(res => {this.setState({quizes: res.data})})
            .catch(err => err);
        }

        axios.get(`/users?userName=${Cookies.get("userName")}&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => {this.setState({isAdmin: res.data[0].isAdmin});})
        .catch(err => err);

        axios.get(`/quizes?page=1&isPublic=true&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => {
                let temp = res.data.quizes.filter(q => q.quizStartDate <= new Date().toISOString() && q.quizEndDate >= new Date().toISOString());
                if(temp.length > 1) temp = temp.sort((a, b) => a.lastTake < b.lastTake ? 1 : -1);

                this.setState({quizes: temp, pageCount: res.data.pageCount});
            })
        .catch(err => err);
    }

    onChangeTags(e) {
        let tags = e.target.value.split(' ');
        this.setState({tags: tags});
    }

    activeList() {
        // return this.state.quizes.map(currTask => {
        //     return <QuizToShow quiz={currTask} key={currTask._id} />
        // });
        
        return this.state.quizes.map((currQuiz, index) => {
            if(!(index&1)) return <QuizToShow state={this.state} quiz={currQuiz} key={currQuiz._id} onClickQuizRemove={this.onClickQuizRemove} 
                bg={"#78d7d6"} btng={"#f55072"} fg={"black"} btngd={"#dc3545"} ip={"left"} />
            else return <QuizToShow state={this.state} quiz={currQuiz} key={currQuiz._id} onClickQuizRemove={this.onClickQuizRemove} 
                bg={"#f55072"} btng={"#78d7d6"} fg={"white"} btngd={"#4d3ec2"} fwl={"bold"} ip={"right"} />
        });
    }

    async onClickQuizRemove(id) {
        if(window.confirm("Na pewno?") == true) {
            await axios.delete(`/quizes/remove/${id}?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                .then(res => res)
            .catch(err => err);
        } else alert("Wpis nie został usunięty.");

        let cp = this.props.history.location.search;
            cp = cp[cp.length-1];
        if(cp != null) this.setState({page: cp});

        axios.get(`/quizes?page=${cp}&isPublic=true&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => {
                let temp = res.data.quizes.filter(q => q.quizStartDate <= new Date().toISOString() && q.quizEndDate >= new Date().toISOString());
                if(temp.length > 1) temp = temp.sort((a, b) => a.lastTake < b.lastTake ? 1 : -1);

                this.setState({quizes: temp, pageCount: res.data.pageCount});
            })
        .catch(err => err);
    }

    
    async onSubmit(e) {
        e.preventDefault();
        this.setState({submited: true});

        if(this.state.tags.length > 0) {
            let tags = this.state.tags;
                tags = tags.join('&');
                tags = tags.escapeDiac().replace(/[^a-zA-Z0-9&]/g, "").toLowerCase();
            
            while(tags[tags.length-1] === '&') tags = tags.substring(0, tags.length-1);

            if(this.state.tags.length <= 0) window.history.pushState("/quiz/find/", "Quiz OKI", `/quiz/find/`);
            else window.history.pushState("/quiz/find/", "Quiz OKI", `/quiz/find?tag=${tags}`);

            await axios.get(`/quizes/search/${tags.split('&')}?api_key=${process.env.REACT_APP_API_KEY}`)
                .then(res => {this.setState({quizes: res.data, completed: true})})
            .catch(err => err);  
        }
    }


    render() {
        return(
            <main>
                <form className="d-flex flex-column align-items-center mb-4" style={{marginTop: "130px"}} onSubmit={this.onSubmit}>
                    <h2 className="mt-3 text-dark">Wpisz interesujące Cię tagi!</h2>

                    <div className="input-group mb-3 mt-3 w-25">
                        <input type="text" className="form-control" placeholder="Tagi..." onChange={this.onChangeTags} />
                        <div className="input-group-append">
                            <button className="btn btn-primary" type="submit">Szukaj</button>
                        </div>
                    </div>
                
                    
                    {(this.state.tags.length <= 0 && this.state.submited) ? <p className="m-0 p-0 mt-4">Musisz podać jakąś frazę!</p> : null}
                    {(this.state.quizes.length <= 0 && (this.state.submited && this.state.completed)) ? <p className="m-0 p-0 mt-4">Niestety nie mamy nic takiego w bazie :/</p> : null}
                    {((this.state.quizes.length <= 0 && this.state.tags.length > 0) && (this.state.submited && !this.state.completed)) ? <p className="m-0 p-0 mt-4">Przeszukujemy naszą bazę...</p> : null}
                    {(this.state.quizes.length > 0 && (!this.state.submited || !this.state.completed)) ? this.activeList() : this.activeList()}
                </form>
            </main>
        );
    }   
}