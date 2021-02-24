import React, {Component} from "react";
import axios from "axios";

import TaskToShow from "./containers/TaskToShow.container";

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

        this.activeList = this.activeList.bind(this);
        this.onChangeTags = this.onChangeTags.bind(this);
        
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            tags: [],
            tasks: [],

            submited: false,
            completed: false
        }
    }

    async componentDidMount() {
        if(this.props.location.search.length > 5) {
            const tag = this.props.history.location.search.slice(5);
            axios.get(`/tasks/search/${tag}?api_key=${process.env.REACT_APP_API_KEY}`)
                .then(res => {this.setState({tasks: res.data})})
            .catch(err => err);
        }

        axios.get(`/tasks?page=1&api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => {this.setState({tasks: res.data.tasks, completed: true})})
        .catch(err => err);
    }

    onChangeTags(e) {
        let tags = e.target.value.split(' ');
        this.setState({tags: tags});
    }

    activeList() {
        return this.state.tasks.map(currTask => {
            return <TaskToShow task={currTask} key={currTask._id} />
        });
    }

    
    async onSubmit(e) {
        e.preventDefault();
        this.setState({submited: true});

        if(this.state.tags.length > 0) {
            let tags = this.state.tags;
                tags = tags.join('&');
                tags = tags.escapeDiac().replace(/[^a-zA-Z0-9&]/g, "").toLowerCase();
            
            while(tags[tags.length-1] === '&') tags = tags.substring(0, tags.length-1);

            if(this.state.tags.length <= 0) window.history.pushState("/task/find/", "Task OKI", `/task/find/`);
            else window.history.pushState("/task/find/", "Task OKI", `/task/find?tag=${tags}`);

            axios.get(`/tasks/search/${tags.split('&')}?api_key=${process.env.REACT_APP_API_KEY}`)
                .then(res => {this.setState({tasks: res.data, completed: true})})
            .catch(err => err);  
        }
    }


    render() {
        return(
            <form className="d-flex flex-column align-items-center mt-5 pt-5 search-form" style={{height: "100vh"}} onSubmit={this.onSubmit}>
                <h2 className="mt-3 text-dark">Wpisz interesujące Cię tagi!</h2>

                <div className="input-group mb-3 mt-3 w-25">
                    <input type="text" className="form-control" placeholder="Tagi..." onChange={this.onChangeTags} />
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">Szukaj</button>
                    </div>
                </div>
            
                {(this.state.tags.length <= 0 && this.state.submited) ? <p className="m-0 p-0 mt-4">Musisz podać jakąś frazę!</p> : null}
                {(this.state.tasks.length <= 0 && (this.state.submited && this.state.completed)) ? <p className="m-0 p-0 mt-4">Niestety nie mamy nic takiego w bazie :/</p> : null}
                {((this.state.tasks.length <= 0 && this.state.tags.length > 0) && (this.state.submited && !this.state.completed)) ? <p className="m-0 p-0 mt-4">Przeszukujemy naszą bazę...</p> : null}
                {(this.state.tasks.length > 0 && (!this.state.submited || !this.state.completed)) ? this.activeList() : this.activeList()}
            </form>
        );
    }   
}