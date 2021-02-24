import React, {Component} from "react";

import axios from "axios";
import download  from "downloadjs";
import Cookies from "js-cookie";
import {saveAs} from 'file-saver';

function str2bytes (str) {
    var bytes = new Uint8Array(str.length);
    for (var i=0; i<str.length; i++) {
        bytes[i] = str.charCodeAt(i);
    }
    return bytes;
}

export default class Quiz extends Component {
    constructor(props) {
        super(props);
        
        this.onClickTagSearch = this.onClickTagSearch.bind(this);
        this.onClickDownloadFilesPackage = this.onClickDownloadFilesPackage.bind(this);
        this.onClickDownloadFile = this.onClickDownloadFile.bind(this);
        this.onChangeSingleFile = this.onChangeSingleFile.bind(this);

        this.tagsList = this.tagsList.bind(this);
        this.inFilesList = this.inFilesList.bind(this);
        this.outFilesList = this.outFilesList.bind(this);
        
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            task: [],

            id: '',
            author: '',
            title: '',
            desc: '',
            difficulty: '',
            contributors: [],
            tags: [],
            contributor: '',
            taskBody: '',
            inFiles: [],
            outFiles: [],
            cppCode: '',

            cppCodeFile: '',
            codeLabel: "Plik programu (.cpp)",

            isLogged: false,
            isActive: false,
            sessionID: '',

            counter: 0,
            domain: "astylestickers.com.pl",
        }
    }

    async componentDidMount(e) {
        await axios.get("/users?userName="+Cookies.get("userName")+"&api_key="+process.env.REACT_APP_API_KEY)
            .then(res => {
                this.setState({
                    isLogged: res.data[0].isLogged,
                    isActive: res.data[0].isActive,
                });
            })
        .catch(err => {
            this.setState({
                isLogged: false,
                isActive: false,
            });
        });

        await axios.get("/tasks/"+this.props.match.params.id+"?api_key="+process.env.REACT_APP_API_KEY)
            .then(res => {this.setState({task: res.data});})
        .catch(err => err);

        const {task} = this.state;
        this.setState({
            id: task._id,
            author: task.taskAuthor,
            title: task.taskTitle,
            desc: task.taskDesc,
            difficulty: task.taskDifficulty,
            contributors: task.contributors || null,
            tags: task.taskTags
        });

        axios.get("/tasks/render/"+this.props.match.params.id+"?api_key="+process.env.REACT_APP_API_KEY, {responseType: "blob"})
        .then(res => {
                const file = new Blob([res.data], {type: "application/pdf"});
                const pdf = URL.createObjectURL(file);

                this.setState({taskBody: pdf})
            })
        .catch(err => err);


        if(this.state.isLogged && this.state.isActive && (Cookies.get("token") != null)) {
            const contributor = task.contributors.filter(c => c.userName === Cookies.get("userName"));
            if(contributor.length > 0) {
                if(contributor[0].isCompiling && contributor[0].isRunning && contributor[0].isPassingTests) this.setState({contributor: contributor[0].userName});
            } else if(this.state.author === Cookies.get("userName")) this.setState({contributor: this.state.author});
        } else this.setState({contributor: -1})


        if(this.state.isLogged && this.state.isActive && (Cookies.get("token") != null)) {
            let inf = [...task.taskInFiles.map(a => {const temp = a.split('/'); return temp[temp.length-1]})];
            let out = [...task.taskOutFiles.map(a => {const temp = a.split('/'); return temp[temp.length-1]})];
            let cpp = task.taskCppCode.split('/'); cpp = cpp[cpp.length-1];

            this.setState({
                inFiles: inf,
                outFiles: out,
                cppCode: cpp
            });
        }
    }

    onClickTagSearch(e) {
        window.location = `/task/find?tag=${e.target.innerHTML.replace('#', '')}`;
    }

    async onClickDownloadFile(e) {
        e.persist();

        const {domain} = this.state;
        const file = {data: e.target.innerHTML.toString()};

        if(this.state.isLogged && this.state.isActive && (Cookies.get("token") != null)) {
            axios.post(`/tasks/${this.state.id}/download?api_key=${process.env.REACT_APP_API_KEY}`, file, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                .then(res => download(res.data, e.target.innerHTML))
            .catch(err => {
                if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                else console.log("Nope");
            });
        } else window.location = '/login';
    }

    async onClickDownloadFilesPackage(e) {
        e.persist();

        const {domain} = this.state;
        const file = {data: e.target.name.toString()};

        
        if(this.state.isLogged && this.state.isActive && (Cookies.get("token") != null)) {
            axios.post(`/tasks/${this.state.id}/download?api_key=${process.env.REACT_APP_API_KEY}`, file, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}, responseType: "blob"})
                .then(res => saveAs(res.data, `${file.data}-${this.props.match.params.id}.zip`))
            .catch(err => {
                if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                else console.log("Nope");
            });
        } else window.location = '/login';
    } 

    onChangeSingleFile(e) {
        if(e.target.files.length == 0) {
            switch(e.target.name) {
                case "cpp-codee": this.setState({cppCodeFile: '', codeLabel: "Wzorcowy kod (.cpp)"}); break;
                default: break;
            }
        }

        if(e.target.files.length > 0) {
            switch(e.target.name) {
                case "cpp-codee": this.setState({cppCodeFile: e.target.files[0], codeLabel: e.target.files[0].name}); break;
                default: break;
            }
        }
    }


    async onSubmit(e) {
        e.preventDefault();
        const {id, domain} = this.state;

        if(this.state.isLogged && this.state.isActive && (Cookies.get("token") != null)) {
            if(this.state.cppCodeFile != '') {
                const formData = new FormData();
                formData.append('file', this.state.cppCodeFile);
                formData.set('id', new File(["id"], this.state.id, {type: "text/plain"}));
                formData.set('user', new File(["user"], Cookies.get("userName"), {type: "text/plain"}));
                
                await axios.put("/tasks/upload?api_key="+process.env.REACT_APP_API_KEY, formData, {headers: {"Content-Type": "multipart/form-data", "Authorization": `JWT ${Cookies.get("token")}`}})
                    .then(res => {this.setState({counter: this.state.counter + 1});})
                .catch(async err => {
                    if(err.response.status == 403) {
                        axios.delete(`/tasks/remove/${id}/user?api_key=${process.env.REACT_APP_API_KEY}`, {
                            userName: Cookies.get("userName")}, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                            .then(res => res)
                        .catch(err => {
                            if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                            else console.log("Nope");
                        });
        
                        axios.delete(`/tasks/purge/${id}/user?api_key=${process.env.REACT_APP_API_KEY}`, {
                            userName: Cookies.get("userName")}, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                            .then(res => {this.setState({fileToLarge: true, fileToLargeName: this.state.taskLabel});})
                        .catch(err => {
                            if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                            else console.log("Nope");
                        });
                    } if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                    else console.log("Nope");
                }); this.setState({cppCodeFile: '', codeLabel: "Trwa kompilacja kodu..."});
            } else this.setState({cppCodeFile: '', codeLabel: "Muisz najpierw wybrać plik!"});


            await axios.post(`/tasks/compile/${id}?user=${Cookies.get("userName")}&api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                .then(res => {this.setState({compile: res.status, counter: this.state.counter + 1, cppCodeFile: '', codeLabel: "Trwa uruchamianie programu..."})})
            .catch(err => {
                if(err && err.response.status == 409) {
                    this.setState({cppCodeFile: '', codeLabel: "Kompilacja kodu nieudana!"});

                    axios.delete(`/tasks/remove/${id}/user?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                        .then(res => res)
                    .catch(err => {
                        if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                        else console.log("Nope");
                    });
                    
                    axios.delete(`/tasks/purge/${id}/user?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                        .then(res => {this.setState({compile: err.response.status})})
                    .catch(err => {
                        if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                        else console.log("Nope");
                    });
                } if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                else console.log("Nope");
            });

            if(this.state.compile === 200) {
                await axios.post(`/tasks/run/${id}?user=${Cookies.get("userName")}&api_key=${process.env.REACT_APP_API_KEY}`)
                    .then(res => {this.setState({run: res.status, counter: this.state.counter + 1, cppCodeFile: '', codeLabel: "Trwa testowanie wyników..."})})
                .catch(async err => {
                    if(err && err.response.status == 406) {
                        this.setState({cppCodeFile: '', codeLabel: "Nie udało się uruchomić programu!"});

                        axios.delete(`/tasks/remove/${id}/user?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                            .then(res => res)
                        .catch(err => {
                            if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                            else console.log("Nope");
                        });
                        
                        axios.delete(`/tasks/purge/${id}/user?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                            .then(res => {this.setState({compile: err.response.status})})
                        .catch(err => {
                            if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                            else console.log("Nope");
                        });
                    } if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                    else console.log("Nope");
                });
            }

            if(this.state.run == 200) {
                await axios.post(`/tasks/check/${id}?user=${Cookies.get("userName")}&api_key=${process.env.REACT_APP_API_KEY}`)
                    .then(res => {this.setState({check: res.status, counter: this.state.counter + 1, cppCodeFile: 'success', codeLabel: "Sukces! Zobacz ranking!", contributor: Cookies.get("userName")})})
                .catch(async err => {
                    if(err && err.response.status == 417) {
                        this.setState({cppCodeFile: '', codeLabel: "Program nie zaliczył testów!"});

                        axios.delete(`/tasks/remove/${id}/user?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                            .then(res => res)
                        .catch(err => {
                            if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                            else console.log("Nope");
                        });
                        
                        axios.delete(`/tasks/purge/${id}/user?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                            .then(res => {this.setState({compile: err.response.status})})
                        .catch(err => {
                            if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                            else console.log("Nope");
                        });
                    } if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                    else console.log("Nope");
                });
            }
            
            window.scrollTo(0, 0);
        } else window.location = '/login';
    }


    inFilesList() {
        if(this.state.inFiles.length > 2) {
            return <input type="button" name="infiles" className="btn btn-primary text-dark my-2" value="Pobierz pliki wejściowe" onClick={this.onClickDownloadFilesPackage} />
        } else {
            return this.state.inFiles.map(inf => {
                return <p className="text-dark p-0 m-0 my-1 mx-3" style={{fontWeight: "bold", cursor: "pointer"}} onClick={this.onClickDownloadFile}>{inf}</p>
            });
        }
    }

    outFilesList() {
        if(this.state.outFiles.length > 2) {
            return <input type="button" name="outfiles" className="btn btn-secondary my-2" value="Pobierz pliki wyjśćiowe" onClick={this.onClickDownloadFilesPackage} />
        } else {
            return this.state.outFiles.map(ouf => {
                return <p className="text-dark p-0 m-0 my-1 mx-3" style={{fontWeight: "bold", cursor: "pointer"}} onClick={this.onClickDownloadFile}>{ouf}</p>
            });
        }
    }

    tagsList() {
        return this.state.tags.map((tag, index) => {
            if(index <= 3) return <p className="mt-1 mx-2 text-center" style={{fontSize: "14pt", cursor: "pointer"}} name={tag} onClick={this.onClickTagSearch}>{`#${tag}`}</p>
        })
    }
    
    render() {
        if(this.state.isLogged && this.state.isActive && (Cookies.get("token") != null)) {
            if(this.state.cppCodeFile === "success") {
                return(
                    <main>
                        <form className="d-flex flex-column align-items-center mt-5 pt-5" style={{minHeight: "90.4vh"}} onSubmit={this.onSubmit}>
                            <div className="task-paper">
                                <h2 className="mt-4 text-dark">{this.state.author + " - " + this.state.title}</h2>
                                <div className="d-flex">
                                    {this.tagsList()}
                                </div>

                                <p className="mt-3 text-center" style={{fontSize: "18pt", width: "60%"}}>{this.state.desc}</p>
            
                                <div className="my-3 w-100 d-flex flex-column align-items-center">
                                    <h4 className="mx-0 px-0">Pliki do pobrania:</h4>
                                    <ul className="downloadable text-center">
                                        <p className="text-dark p-0 m-0 my-1" style={{fontWeight: "bold", cursor: "pointer"}} onClick={this.state.contributor === Cookies.get("userName") ? this.onClickDownloadFile : null} >
                                            {this.state.contributor === Cookies.get("userName") ? this.state.cppCode : "Aby zobaczyć wzorcowe pliki do pobrania, musisz najpierw wysłać swoje poprawne rozwiązanie!"}
                                        </p>
                                        
                                        <div className="d-flex flex-row">
                                            <div className="d-flex">
                                                {this.inFilesList()}
                                                {this.outFilesList()}
                                            </div>
                                        </div>
                                    </ul>
                                </div>
            
                                <input 
                                    className="d-none"
                                    type="button"
                                    accept=".cpp"
                                    name="cpp-code"
                                    id="cpp-code"
                                    onClick={() => {window.location = `/ranking/${this.state.id}`}}
                                />
                                <label for="cpp-code" className="d-flex align-items-center justify-content-center btn btn-primary text-dark py-2 mb-3">
                                    <p className="p-2 m-0 ">{this.state.codeLabel}</p>
                                </label>
                
                                <embed
                                    className="mt-4 mb-5"
                                    style={{height: "100vh", width: "80%", border: "1px solid grey", overflowY: "hidden"}}
                                    src={this.state.taskBody}
                                    id="displayFile"
                                    type="application/pdf"
                                />
                            </div>
                        </form>
                    </main>
                );
            } else {
                return(
                    <main>
                        <form className="d-flex flex-column align-items-center mt-5 pt-5" style={{minHeight: "90.4vh"}} onSubmit={this.onSubmit}>
                            <div className="task-paper">
                                <h2 className="mt-4 text-dark">{this.state.author + " - " + this.state.title}</h2>
                                <div className="d-flex">
                                    {this.tagsList()}
                                </div>

                                <input 
                                    className="d-none mt-3"
                                    type="button"
                                    name="cpp-code"
                                    id="cpp-code"
                                    onClick={() => {window.location = `/ranking/${this.state.id}`}}
                                />
                                <label for="cpp-code" className="d-flex align-items-center justify-content-center btn btn-warning text-dark py-2 mt-3 mb-3">
                                    <p className="px-3 m-0 ">Ranking</p>
                                </label>

                                <p className="mt-3 text-center" style={{fontSize: "18pt", width: "60%"}}>{this.state.desc}</p>

                                <div className="my-3 mb-4 w-100 d-flex flex-column align-items-center">
                                    <h4 className="mx-0 px-0">Pliki do pobrania:</h4>
                                    <ul className="downloadable text-center">
                                        <p className="text-dark p-0 m-0 my-1" style={{fontWeight: "bold", cursor: "pointer"}} onClick={this.state.contributor === Cookies.get("userName") ? this.onClickDownloadFile : null}>
                                            {this.state.contributor === Cookies.get("userName") ? this.state.cppCode : "Aby zobaczyć wzorcowe pliki programu do pobrania, musisz najpierw wysłać swoje poprawne rozwiązanie!"}
                                        </p>

                                        <div className="d-flex flex-column align-items-center my-3">
                                            <div className="d-flex flex-row">{this.inFilesList()}</div>
                                            <div className="d-flex flex-row">{this.outFilesList()}</div>
                                        </div>
                                    </ul>
                                </div>
            
                                <input 
                                    className="d-none"
                                    type="file"
                                    accept=".cpp"
                                    name="cpp-codee"
                                    id="cpp-codee"
                                    onChange={this.onChangeSingleFile}
                                />
                                <label htmlFor="cpp-codee" className="d-flex align-items-center justify-content-center btn btn-primary text-dark py-2 mb-3">
                                    <p className="p-2 m-0 ">{this.state.codeLabel}</p>
                                </label>
            
                                <input type="submit" className="btn btn-success text-dark" value="Wyślij rozwiązanie" />

                                <embed
                                    className="mt-4 mb-5"
                                    style={{height: "100vh", width: "80%", border: "1px solid grey", overflowY: "hidden"}}
                                    src={this.state.taskBody}
                                    id="displayFile"
                                    type="application/pdf"
                                />
                            </div>
                        </form>
                    </main>
                );
            }
        } else {
            return(
                <main>
                    <form className="d-flex flex-column align-items-center mt-5 pt-5" style={{minHeight: "90.4vh"}} onSubmit={this.onSubmit}>
                        <div className="task-paper">
                            <h2 className="mt-4 text-dark">{this.state.author + " - " + this.state.title}</h2>
                            <div className="d-flex">
                                {this.tagsList()}
                            </div>

                            <p className="mt-3 text-center" style={{fontSize: "18pt", width: "60%"}}>{this.state.desc}</p>

                            <p className="mt-3 mb-5 text-center">
                                Aby zobaczyć pobrać pliki wzorcowe lub 
                                wziąć udział w rozwiązaniu, musisz się najpierw zalogować!    
                            </p>

                            <input 
                                className="d-none"
                                type="button"
                                name="cpp-code"
                                id="cpp-code"
                                onClick={() => {window.location = `/ranking/${this.state.id}`}}
                            />
                            <label for="cpp-code" className="d-flex align-items-center justify-content-center btn btn-warning text-dark py-2 mb-3">
                                <p className="py-1 px-2 m-0 ">Ranking</p>
                            </label>

                            <embed
                                className="mt-4 mb-5"
                                style={{height: "100vh", width: "80%", border: "1px solid grey", overflowY: "hidden"}}
                                src={this.state.taskBody}
                                id="displayFile"
                                type="application/pdf"
                            />
                        </div>
                    </form>
                </main>
            );
        }
    }
}