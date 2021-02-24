import React, {Component} from "react";

import axios from "axios";
import Cookies from "js-cookie";

import QuizToShow from "./containers/QuizToShow.container";

export default class Expired extends Component {
    constructor(props) {
        super(props);

        this.onClickQuizRemove = this.onClickQuizRemove.bind(this);

        this.state = {expired: [], isAdmin: false}
    }


    async componentDidMount() {
        await axios.get("/quizes?isPublic=true&api_key="+process.env.REACT_APP_API_KEY)
            .then(res => {
                let temp = res.data.quizes.filter(q => q.quizEndDate < new Date().toISOString());
                if(temp.length > 1) temp = temp.sort((a, b) => a.lastTake < b.lastTake ? 1 : -1);

                this.setState({expired: temp});
            })
        .catch(err => err);

        axios.get(`/users?userName=${Cookies.get("userName")}&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => {this.setState({isAdmin: res.data[0].isAdmin});})
        .catch(err => err);
    }
    
    expiredList() {
        // return this.state.expired.map(currQuiz => {
        //     return <QuizToShow quiz={currQuiz} key={currQuiz._id} />
        // });

        return this.state.expired.map((currQuiz, index) => {
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

                this.setState({expired: temp, pageCount: res.data.pageCount});
            })
        .catch(err => err);
    }


    async previousPage(e) {
        let counter = parseInt(this.state.page);
        if(counter > 1) counter--;

        await axios.get(`/quizes?page=${counter}&isPublic=true&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => {
                let temp = res.data.quizes.filter(q => q.quizEndDate < new Date().toISOString());
                if(temp.length > 1) temp = temp.sort((a, b) => a.lastTake < b.lastTake ? 1 : -1);

                // let temp = res.data.quizes;
                // if(temp.length > 1) temp = temp.sort((a, b) => a.lastTake < b.lastTake ? 1 : -1);

                this.setState({expired: temp, page: counter});
            })
        .catch(err => err);

        window.history.replaceState("/quizes/completed/", "Quiz OKI", `/quizes/completed?page=${counter}`);
    }

    async nextPage(e) {
        let counter = parseInt(this.state.page);
        if(counter < this.state.pageCount) counter++;

        await axios.get(`/quizes?page=${counter}&isPublic=true&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => {
                let temp = res.data.quizes.filter(q => q.quizEndDate < new Date().toISOString());
                if(temp.length > 1) temp = temp.sort((a, b) => a.lastTake < b.lastTake ? 1 : -1);

                // let temp = res.data.quizes;
                // if(temp.length > 1) temp = temp.sort((a, b) => a.lastTake < b.lastTake ? 1 : -1);

                this.setState({expired: temp, page: counter});
            })
        .catch(err => err);

        window.history.replaceState("/quizes/completed/", "Quiz OKI", `/quizes/completed?page=${counter}`);
    }

    async changePage(e) {
        let counter = parseInt(e.target.innerHTML);
        await axios.get(`/quizes?page=${counter}&isPublic=true&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => {
                let temp = res.data.quizes.filter(q => q.quizEndDate < new Date().toISOString());
                if(temp.length > 1) temp = temp.sort((a, b) => a.lastTake < b.lastTake ? 1 : -1);

                // let temp = res.data.quizes;
                // if(temp.length > 1) temp = temp.sort((a, b) => a.lastTake < b.lastTake ? 1 : -1);

                this.setState({expired: temp, page: counter});
            })
        .catch(err => err);

        window.history.replaceState("/quizes/completed/", "Quiz OKI", `/quizes/completed?page=${counter}`);
    }


    pages() {
        if(this.state.pageCount > 1) {
            let ap = []
            if(this.state.page < 9) ap = this.state.allPages.slice(0, (this.state.page+9));
            else ap = this.state.allPages.slice(this.state.page - 1, (this.state.page+9));

            return ap.map(a => {
                return this.state.page == a+1 ? <p onClick={this.changePage} style={{borderTop: "3px solid black", color: "#fdd420", fontWeight: "bold"}}>{a+1}</p> : <p className="mx-3" onClick={this.changePage}>{a+1}</p>
            })
        }
    }


    render() {
        if(this.state.expired.length <= 0) {
            return(
                <main>
                    <div className="list-container">
                        <h3 className="mt-5 text-center mt-5">Nic tu jeszcze nie ma :c</h3>
                    </div>
                </main>
            );
        } else {
            return(
                <main>
                    <div className="list-container">
                        {this.expiredList()}
                    
                        <div className="d-flex justify-content-center mt-3 pagination">
                            {(this.state.page > 1) 
                                ? <p type="button" onClick={this.previousPage} style={{cursor: "pointer"}}>&#171; Poprzednia</p> 
                                : (this.state.pageCount > 1 
                                    ? <p onClick={() => {console.log("Nope")}} className="nohover" style={{cursor: "default", color: "grey"}}>&#171; Poprzednia</p> 
                                    : null)}
                            
                            {this.pages()}
                            
                            {(this.state.page < this.state.pageCount) 
                                ? <p onClick={this.nextPage} style={{cursor: "pointer"}}>Następna &#187;</p> 
                                : (this.state.pageCount > 1
                                    ? <p onClick={() => {console.log("Nope")}} className="nohover" style={{cursor: "default", color: "grey"}}>Następna &#187;</p>
                                    : null)}
                        </div>
                    </div>
                </main>
            );
        }
    }
}