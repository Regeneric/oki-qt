import React, {Component} from "react";
import {Link} from "react-router-dom";

import axios from "axios";

export default class MainPage extends Component {
    constructor(props) {
        super(props);

        this.changePage = this.changePage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
    
        this.pages = this.pages.bind(this);

        this.state = {
            active: [],
            page: 1,
            pageCount: 0,
            allPages: []
        }
    }

    async componentDidMount() {
        let cp = this.props.history.location.search;
            cp = cp[cp.length-1];
        if(cp != null) this.setState({page: cp});

        await axios.get(`/tasks?page=${cp}&taskIsPublic=true&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => {
                let temp = res.data.tasks;
                if(temp.length > 1) temp = temp.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);

                this.setState({active: temp, pageCount: res.data.pageCount});
            })
        .catch(err => err);

        const allPages = [...Array(this.state.pageCount).keys()];
        this.setState({allPages});
    }


    async previousPage(e) {
        let counter = parseInt(this.state.page);
        if(counter > 1) counter--;

        await axios.get(`/tasks?page=${counter}&taskIsPublic=true&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => {
                let temp = res.data.tasks;
                if(temp.length > 1) temp = temp.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);

                this.setState({active: temp, page: counter});
            })
        .catch(err => err);

        window.history.replaceState("/", "Task OKI", `?page=${counter}`);
    }

    async nextPage(e) {
        let counter = parseInt(this.state.page);
        if(counter < this.state.pageCount) counter++;

        await axios.get(`/tasks?page=${counter}&taskIsPublic=true&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => {
                let temp = res.data.tasks;
                if(temp.length > 1) temp = temp.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);

                this.setState({active: temp, page: counter});
            })
        .catch(err => err);

        window.history.replaceState("/", "Task OKI", `?page=${counter}`);
    }

    async changePage(e) {
        let counter = parseInt(e.target.innerHTML);
        await axios.get(`/tasks?page=${counter}&taskIsPublic=true&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => {
                let temp = res.data.tasks;
                if(temp.length > 1) temp = temp.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);

                this.setState({active: temp, page: counter});
            })
        .catch(err => err);

        window.history.replaceState("/", "Task OKI", `?page=${counter}`);
    }


    pages() {
        console.log(this.state.pageCount);
        if(this.state.pageCount > 1) {
            let ap = []
            if(this.state.page < 9) ap = this.state.allPages.slice(0, (this.state.page+9));
            else ap = this.state.allPages.slice(this.state.page - 1, (this.state.page+9));

            return ap.map(a => {
                return this.state.page == a+1 ? <p onClick={this.changePage} style={{borderTop: "3px solid black", color: "#fdd420", fontWeight: "bold"}}>{a+1}</p> : <p className="mx-3" onClick={this.changePage}>{a+1}</p>
            })
        }
    }

    tasksTable() {
        return this.state.active.map(ct => {
            return (
                <tr>
                    <td><Link to={`/task/show/${ct._id}`}><p>{ct.taskAuthor}</p></Link></td>
                    <td><Link to={`/task/show/${ct._id}`}><p>{ct.taskTitle}</p></Link></td>
                    <td><Link to={`/task/show/${ct._id}`}><p>{ct.taskDesc}</p></Link></td>
                    <td><Link to={`/task/find?tags=${ct.taskTags.join('&')}`}><p>{ct.taskTags[0]} {ct.taskTags[1]} {ct.taskTags[2]}</p></Link></td>
                    <td><Link to={`/task/show/${ct._id}`}><p>{ct.taskDifficulty}/5</p></Link></td>
                    <td><Link to={`/task/show/${ct._id}`}><p>{ct.contributors.length}</p></Link></td>
                </tr>
            );
        });
    }

    render() {
        if(this.state.active.length <= 0) {
            return(
                <main>
                    <div className="list-container">
                        <h3 className="text-center mt-5">Nic tu jeszcze nie ma :c</h3>
                    </div>
                </main>
            );
        } else {
            return(
                <main>
                    <div className="content-container">
                        <table className="task-table">
                            <thead>
                                <tr>
                                    <th><p>Autor</p></th>
                                    <th><p>Tytuł</p></th>
                                    <th><p>Opis</p></th>
                                    <th><p>Tagi</p></th>
                                    <th><p>Poziom trudności</p></th>
                                    <th><p>Uczestnicy</p></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.tasksTable()}
                            </tbody>
                        </table>
                    
                    
                        <div className="d-flex justify-content-center mt-3 pagination text-dark">
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
                    
                    
                    
                        {/* <div className="quiz-card">
                            <Link to="/tasks/active/">
                                <img className="quiz-img" src={ActiveQuizImg}></img>
                                <div className="quiz-meta" id="active">
                                    <span className="text-dark">Aktywne Obecnie</span>
                                </div>
                            </Link>
                        </div>
    
                        <div className="quiz-card">
                            <Link to="/tasks/coming-soon/">
                                <div className="quiz-meta" id="coming">
                                    <span className="text-dark">Przyszłe</span>
                                </div>
                                <img className="quiz-img" src={ComingSoonQuizImg}></img>
                            </Link>
                        </div>   
    
                        <div className="quiz-card">
                            <Link to="/tasks/completed/">
                                <img className="quiz-img" src={DoneQuizImg}></img>
                                <div className="quiz-meta" id="expired">
                                    <span className="text-dark">Zakończone</span>
                                </div>
                            </Link>
                        </div>    */}
                    </div>
                </main>
            );   
        }
    }
}