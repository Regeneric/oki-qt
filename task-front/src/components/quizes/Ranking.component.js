import React, {Component} from "react";
import axios from "axios";
import download  from "downloadjs";
import Cookies from "js-cookie";

import RankingPlace from "./containers/RankingPlace.container";

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

export default class Ranking extends Component {
    constructor(props) {
        super(props);

        this.onClickDownloadFile = this.onClickDownloadFile.bind(this);
        this.rankingList = this.rankingList.bind(this);

        this.state = {
            author: '',
            title: '',
            users: [],
            
            canDownload: false,
            isLogged: false,
            isActive: false,
            sessionID: '',
        };
    }

    async componentDidMount() {
        await axios.get("/users?userName="+Cookies.get("userName")+"&api_key="+process.env.REACT_APP_API_KEY)
            .then(res => {
                this.setState({
                    isLogged: res.data[0].isLogged,
                    isActive: res.data[0].isActive
                });
            })
        .catch(err => err);

        let usr = await axios.get("/tasks/"+this.props.match.params.id+"?api_key="+process.env.REACT_APP_API_KEY).then(res => res.data).catch(err => err);
            usr.contributors = usr.contributors.sort((a, b) => a.fileSize < b.fileSize ? -1 : 1);
            usr.contributors = usr.contributors.sort((a, b) => a.isPassingTests && !b.isPassingTests ? -1 : 1);
            const unique = usr.contributors.filter((v, i, s) => s.map(x => x.userName).indexOf(v.userName) == i);

        this.setState({title: usr.taskTitle.escapeDiac().replace(/[^a-zA-Z]/g, "").toLowerCase(), users: unique, author: usr.taskAuthor});
    }

    async onClickDownloadFile(e) {
        e.persist();
        const file = {data: e.target.innerHTML.toString() || "taskCppCode"};

        if(this.state.isLogged && this.state.isActive && (Cookies.get("token") != null)) {
            axios.post(`/tasks/${this.props.match.params.id}/download?user=${e.target.name}&api_key=${process.env.REACT_APP_API_KEY}`, file, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                .then(res => download(res.data, `${e.target.name}-${this.state.title}.cpp`))
            .catch(err => {
                if(err && err.response.status == 401) {Cookies.remove("token"); Cookies.remove("userName"); window.location = "/login";}
                else console.log("Nope");
            });
        } else window.location = '/login';
    }

    rankingList() {
        if(this.state.isLogged && this.state.isActive && (Cookies.get("token") != null)) {
            const contributor = this.state.users.filter(c => c.userName === Cookies.get("userName"));
            
            let canDownload = false;
            if(contributor.length > 0) {
                if((contributor[0].isCompiling && contributor[0].isRunning && contributor[0].isPassingTests)) canDownload = true;
            } 
            else if(this.state.author === Cookies.get("userName")) canDownload = true;

            return this.state.users.map(cu => {
                return <RankingPlace user={cu} key={cu.userName} quizTile={this.state.title} 
                    onClickDownloadFile={this.onClickDownloadFile}
                    isDisabled={canDownload ? false : true}
                />
            });
        } else {
            return this.state.users.map(cu => {
                return <RankingPlace user={cu} key={cu.userName} quizTile={this.state.title} 
                    onClickDownloadFile={() => {alert("Aby móc pobrać rozwiązania, musisz się najpierw zalogować!")}}
                    isDisabled={true}
                />
            });
        }
    }

    render() {
        if(this.state.users.length <= 0) {
            return(
                <main>
                    <div className="mt-5 pt-5 d-flex justify-content-center">
                        <h1>Nic tu jeszcze nie ma :c</h1>
                    </div>
                </main>
            );
        } else {
            return(
                <main>
                    <div className="mt-5 pt-5">
                        {this.rankingList()}
                    </div>
                </main>
            );
        }
    }
}