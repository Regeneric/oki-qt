import React, {Component} from "react";
import axios from "axios";

import TaskToShow from "./containers/TaskToShow.container";

export default class Active extends Component {
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
    
    activeList() {
        return this.state.active.map(currTask => {
            return <TaskToShow task={currTask} key={currTask._id} />
        });
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

        // if(this.state.tags.length <= 0) window.history.pushState("/task/find/", "Task OKI", `/task/find/`);
        window.history.replaceState("/tasks/active/", "Task OKI", `/tasks/active?page=${counter}`);
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

        window.history.replaceState("/tasks/active/", "Task OKI", `/tasks/active?page=${counter}`);
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

        window.history.replaceState("/tasks/active/", "Task OKI", `/tasks/active?page=${counter}`);
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
        if(this.state.active.length <= 0) {
            return(
                <main>
                    <div className="list-container">
                        <h3 className="mt-5 text-center">Nic tu jeszcze nie ma :c</h3>
                    </div>
                </main>
            );
        } else {
            return(
                <main>
                    <div className="list-container">
                        {this.activeList()}

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