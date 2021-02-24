import React, {Component} from "react";
import axios from "axios";
import Cookies from "js-cookie";

import TaskInputForm from "./containers/TaskInputForm.container";

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

export default class QuizAdd extends Component {
    constructor(props) {
        super(props);

        this.onChangeTaskTitle = this.onChangeTaskTitle.bind(this);
        this.onChangeTaskDesc = this.onChangeTaskDesc.bind(this);
        this.onChangeTags = this.onChangeTags.bind(this);
        this.onChangeDifficulty = this.onChangeDifficulty.bind(this);

        this.onChangeSingleFile = this.onChangeSingleFile.bind(this);
        this.onChangeMultipleFiles = this.onChangeMultipleFiles.bind(this); 

        this.onChangePublicTask = this.onChangePublicTask.bind(this);
        this.onChangeRunTime = this.onChangeRunTime.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            domain: "astylestickers.com.pl",

            taskMongoID: '',
            taskID: '',
            taskTitle: '',
            taskDesc: '',
            taskAuthor: Cookies.get("userName"),
            tags: [],
            difficultyLevel: '',
            taskBody: '',
            cppCode: '',
            inFiles: [],
            outFiles: [],
            runTime: '', 
            isPublic: true,

            buforLabel: '',
            taskLabel: "Treść zadania (.pdf)",
            codeLabel: "Wzorcowy kod (.cpp)",
            inFilesLabel: "Pliki wejściowe (.in)",
            outFilesLabel: "Pliki wyjściowe (.out)",

            isLoggedUser: false,
            isActiveUser: false,
            sessionID: '',

            fileToLarge: false,
            fileToLargeName: '',
            
            showBar: false,
            max: 0,
            counter: 0,

            compile: 0,
            run: 0,
            check: 0,
            status: '',
        }
    }

    async componentDidMount() {
        await axios.get("/users?userName="+Cookies.get("userName")+"&api_key="+process.env.REACT_APP_API_KEY)
            .then(res => {
                this.setState({
                    isLoggedUser: res.data[0].isLogged,
                    isActiveUser: res.data[0].isActive,
                });
            })
        .catch(err => {window.location = '/login';});
    }


    onChangeTaskTitle(e) {this.setState({taskTitle: e.target.value});}
    onChangeTaskDesc(e) {this.setState({taskDesc: e.target.value});}
    onChangeDifficulty(e) {this.setState({difficultyLevel: e.target.value});}
    onChangePublicTask(e) {this.setState({isPublic: e.target.checked});}
    onChangeRunTime(e) {this.setState({runTime: e.target.value});}

    onChangeSingleFile(e) {
        if(e.target.files.length == 0) {
            switch(e.target.name) {
                case "task-body": this.setState({taskBody: '', taskLabel: "Treść zadania (.pdf)"}); break;
                case "cpp-code": this.setState({cppCode: '', codeLabel: "Wzorcowy kod (.cpp)"}); break;
                default: break;
            }
        }

        if(e.target.files.length > 0) {
            // if(e.target.files[0].size > 4194304) alert(`Plik ${e.target.files[0].name} jest zbyt duży! Dozwolone są pliki o rozmiarze 4 MiB lub mniej!`);
            // else {
                switch(e.target.name) {
                    case "task-body": this.setState({taskBody: e.target.files[0], taskLabel: e.target.files[0].name}); break;
                    case "cpp-code": this.setState({cppCode: e.target.files[0], codeLabel: e.target.files[0].name}); break;
                    default: break;
                }
            // }
        }
    }
    onChangeMultipleFiles(e) {
        if(e.target.files.length == 0) {
            switch(e.target.name) {
                case "in-files": this.setState({inFiles: '', inFilesLabel: "Pliki wejściowe (.in)"}); break;
                case "out-files": this.setState({outFiles: '', outFilesLabel: "Pliki wyjściowe (.out)"}); break;
                default: break;
            }
        }

        if(e.target.files.length > 0) {
            let isOkk = true;
            // if(e.target.files.length > 1) {
            //     for(let i = 0; i != e.target.files.length; ++i) {
            //         if(e.target.files[i].size > 4194304) {
            //             alert(`Plik ${e.target.files[i].name} jest zbyt duży! Dozwolone są pliki o rozmiarze 4 MiB lub mniej!`);
                        
            //             switch(e.target.name) {
            //                 case "in-files": this.setState({inFiles: '', inFilesLabel: "Pliki wejściowe (.in)"}); break;
            //                 case "out-files": this.setState({outFiles: '', outFilesLabel: "Pliki wyjściowe (.out)"}); break;
            //                 default: break;
            //             } isOkk = false;
            //         } else isOkk = true;
            //     }
            // } else {
            //     if(e.target.files[0].size > 4194304) {
            //         alert(`Plik ${e.target.files[0].name} jest zbyt duży! Dozwolone są pliki o rozmiarze 4 MiB lub mniej!`);
                
            //         switch(e.target.name) {
            //             case "in-files": this.setState({inFiles: '', inFilesLabel: "Pliki wejściowe (.in)"}); break;
            //             case "out-files": this.setState({outFiles: '', outFilesLabel: "Pliki wyjściowe (.out)"}); break;
            //             default: break;
            //         } isOkk = false;
            //     } else isOkk = true;
            // }

            if(isOkk) {
                switch(e.target.name) {
                    case "in-files": this.setState({
                        inFiles: e.target.files, 
                        inFilesLabel: (e.target.files.length > 4 || e.target.files.length == 0) 
                                        ? `Wybrano ${e.target.files.length} plików` 
                                        : (e.target.files.length == 1 
                                                ? e.target.files[0].name 
                                                : `Wybrano ${e.target.files.length} pliki`)}
                        ); break;
                    case "out-files": this.setState({
                        outFiles: e.target.files, 
                        outFilesLabel: (e.target.files.length > 4 || e.target.files.length == 0) 
                                        ? `Wybrano ${e.target.files.length} plików` 
                                        : (e.target.files.length == 1 
                                                ? e.target.files[0].name 
                                                : `Wybrano ${e.target.files.length} pliki`)}
                        ); break;
                    default: break;
                }
            }
        }
    }


    onChangeTags(e) {
        let tags = e.target.value.split(' ');

        const tmp = [];
        tags.forEach(tag => {
            tmp.push(tag.escapeDiac().replace(/[^a-zA-Z ]/g, "").toLowerCase());
        }); tags = tmp;
 
        this.setState({tags: tags});
    }


    async onSubmit(e) {
        e.preventDefault();

        this.setState({
            compile: 0,
            run: 0,
            check: 0,
        });

        const {taskTitle, taskDesc, taskAuthor, tags, difficultyLevel, taskBody, cppCode, inFiles, outFiles, runTime, isPublic, domain} = this.state;
        const taskID = new Date().toISOString().substr(0, 10) + Math.floor(Math.random() * 10000);

        const isTitle = taskTitle.length > 0 ? true : alert("Musisz podać tytuł zadania!");
        const isDesc = taskDesc.length > 0 ? true : alert("Musisz napisać krótki opis!");
        const isTags = tags.length >= 3 ? true : alert("Musisz podać przynajmniej trzy tagi!"); 
        const isDifficulty = (difficultyLevel > 0 && difficultyLevel <= 5) ? true : alert("Musisz zmieścić się w przedzialen 1 do 5!");
        const isTask = taskBody !== undefined ? true : alert("Musisz dołączyć plik PDF z zadaniem!");
        const isCpp = cppCode !== undefined ? true : alert("Musisz podać wzorcowy kod zadania!");
        let isIn = inFiles.length > 0 ? true : alert("Musisz podać przynajmniej jeden plik wejściowy!");
        let isOut = outFiles.length > 0 ? true : alert("Musisz podać przynajmniej jeden plik wyjściowy!");
        const isRuntime = runTime.value != '' ? true : alert("Musisz podać czas wykonywania się kodu!");

        if(inFiles.length !== outFiles.length) {
            alert("Ilości plików wejściowych musi być taka sama, jak plików wyjściowych!");
            isIn = false; isOut = false; 
        }

        if(isTitle && isDesc && isTags && isDifficulty && isTask && isCpp && isIn && isOut && isRuntime) {
            if(this.state.isLoggedUser && this.state.isActiveUser) {      
                const task = {
                    taskID: taskID,
                    taskAuthor: taskAuthor,
                    taskTitle: taskTitle,
                    taskDesc: taskDesc,
                    taskTags: tags,
                    taskDifficulty: difficultyLevel,
                    taskBody: "./tasks/",
                    taskCppCode: "./tasks/",
                    taskInFiles: [],
                    taskOutFiles: [],
                    taskRunTime: runTime,
                    taskIsPublic: isPublic,
                    lastTake: null
                }; 

                // +6 becuase there's `task`, taskBody` and `cppCode` upload
                // and `compile`, `run` and `check` on program 
                this.setState({
                    max: this.state.inFiles.length + this.state.outFiles.length + 6,
                    showBar: true
                });


                await axios.post("/tasks/add?api_key="+process.env.REACT_APP_API_KEY, task, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                    .then(res => {this.setState({counter: this.state.counter + 1, taskMongoID: res.data._id});})
                .catch(err => {
                    if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                    else {this.setState({counter: 0})}
                });


                const formData = new FormData();
                formData.append('file', this.state.taskBody);
                formData.set('id', new File(["id"], taskID, {type: "text/plain"}));

                await axios.post("/tasks/upload?api_key="+process.env.REACT_APP_API_KEY, formData, {headers: {"Content-Type": "multipart/form-data", "Authorization": `JWT ${Cookies.get("token")}`}})
                    .then(res => {this.setState({counter: this.state.counter + 1});})
                .catch(async err => {
                    if(err && err.response.status == 403) {
                        axios.delete(`/tasks/remove/${this.state.taskMongoID}?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                            .then(res => {this.setState({fileToLarge: true, fileToLargeName: this.state.taskLabel, counter: 0});})
                        .catch(err => {
                            if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                            else console.log("Nope");
                        });
                    } if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                    else console.log("Nope");
                });

                formData.set('file', this.state.cppCode);
                await axios.post("/tasks/upload?api_key="+process.env.REACT_APP_API_KEY, formData, {headers: {"Content-Type": "multipart/form-data", "Authorization": `JWT ${Cookies.get("token")}`}})
                    .then(res => {this.setState({counter: this.state.counter + 1});})
                .catch(async err => {
                    if(err && err.response.status == 403) {
                        axios.delete(`/tasks/remove/${this.state.taskMongoID}?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                            .then(res => res)
                        .catch(err => {
                            if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                            else console.log("Nope");
                        });

                        axios.delete(`/tasks/purge/${this.state.taskMongoID}?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                            .then(res => {this.setState({fileToLarge: true, fileToLargeName: this.state.taskLabel, counter: 0});})
                        .catch(err => {
                            if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                            else console.log("Nope");
                        });
                    } if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                    else console.log("Nope");
                });


                for(let i = 0; i != this.state.inFiles.length; ++i) {
                    formData.set('file', this.state.inFiles[i]);
                    await axios.post("/tasks/upload?api_key="+process.env.REACT_APP_API_KEY, formData, {headers: {"Content-Type": "multipart/form-data", "Authorization": `JWT ${Cookies.get("token")}`}})
                        .then(res => {this.setState({counter: this.state.counter + 1});})
                    .catch(async err => {
                        if(err && err.response.status == 403) {
                            axios.delete(`/tasks/remove/${this.state.taskMongoID}?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                                .then(res => res)
                            .catch(err => {
                                if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                                else console.log("Nope");
                            });

                            axios.delete(`/tasks/purge/${this.state.taskMongoID}?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                                .then(res => {this.setState({fileToLarge: true, fileToLargeName: this.state.inFiles[i].name, counter: 0});})
                            .catch(err => {
                                if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                                else console.log("Nope");
                            });
                        } if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                        else console.log("Nope");
                    });
                }

                for(let i = 0; i != this.state.outFiles.length; ++i) {
                    formData.set('file', this.state.outFiles[i]);
                    await axios.post("/tasks/upload?api_key="+process.env.REACT_APP_API_KEY, formData, {headers: {"Content-Type": "multipart/form-data", "Authorization": `JWT ${Cookies.get("token")}`}})
                        .then(res => {this.setState({counter: this.state.counter + 1});})
                    .catch(async err => {
                        if(err && err.response.status == 403) {
                            axios.delete(`/tasks/remove/${this.state.taskMongoID}?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                                .then(res => res)
                            .catch(err => {
                                if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                                else console.log("Nope");
                            });

                            axios.delete(`/tasks/purge/${this.state.taskMongoID}?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                                .then(res => {this.setState({fileToLarge: true, fileToLargeName: this.state.outFiles[i].name, counter: 0});})
                            .catch(err => {
                                if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                                else console.log("Nope");
                            });
                        } if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                        else console.log("Nope");
                    });
                }

                console.log(axios.defaults.headers.common['Access-Control-Allow-Origin']);

                await axios.post(`/tasks/compile/${this.state.taskMongoID}?api_key=${process.env.REACT_APP_API_KEY}`)
                    .then(res => {console.log("res", res); this.setState({compile: res.status, counter: this.state.counter + 1})})
                .catch(async err => {
                    if(err && err.response.status == 409) {
                        axios.delete(`/tasks/remove/${this.state.taskMongoID}?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                            .then(res => res)
                        .catch(err => {
                            if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                            else console.log("Nope");
                        });
                        
                        axios.delete(`/tasks/purge/${this.state.taskMongoID}?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                            .then(res => {this.setState({compile: err.response.status, counter: 0})})
                        .catch(err => {
                            if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                            else console.log("Nope");
                        });
                    } if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                    if(err) console.log(err);
                    else console.log("Nope");
                });

                if(this.state.compile === 200) {
                    await axios.post(`/tasks/run/${this.state.taskMongoID}?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                        .then(res => {this.setState({run: res.status, counter: this.state.counter + 1})})
                    .catch(async err => {
                        if(err && err.response.status == 406) {
                            axios.delete(`/tasks/remove/${this.state.taskMongoID}?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                                .then(res => res)
                            .catch(err => {
                                if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                                else console.log("Nope");
                            });

                            axios.delete(`/tasks/purge/${this.state.taskMongoID}?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                                .then(res => {this.setState({run: err.response.status, counter: 0})})
                            .catch(err => {
                                if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                                else console.log("Nope");
                            });
                        } if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                        else console.log("Nope");
                    });
                }

                if(this.state.run === 200) {
                    await axios.post(`/tasks/check/${this.state.taskMongoID}?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                        .then(res => {this.setState({check: res.status, counter: this.state.counter + 1})})
                    .catch(async err => {
                        if(err && err.response.status == 417) {
                            axios.delete(`/tasks/remove/${this.state.taskMongoID}?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                                .then(res => res)
                            .catch(err => {
                                if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                                else console.log("Nope");
                            });

                            axios.delete(`/tasks/purge/${this.state.taskMongoID}?api_key=${process.env.REACT_APP_API_KEY}`, {headers: {"Authorization": `JWT ${Cookies.get("token")}`}})
                                .then(res => {this.setState({check: err.response.status, counter: 0})})
                            .catch(err => {
                                if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                                else console.log("Nope");
                            });
                        } if(err && err.response.status == 401) {Cookies.remove("token", {domain}); Cookies.remove("userName", {domain}); window.location = "/login";}
                        else console.log("Nope");
                    });
                }
                
                console.log(this.state.compile, this.state.run, this.state.check);
                if(this.state.compile == 200 && this.state.run == 200 && this.state.check == 202) {
                    this.setState({
                        taskID: '',
                        taskTitle: '',
                        taskDesc: '',
                        taskAuthor: Cookies.get("userName"),
                        tags: [],
                        difficultyLevel: 0,
                        taskBody: '',
                        cppCode: '',
                        inFiles: [],
                        outFiles: [],
                        runTime: 0, 
                        isPublic: true,
                        
                        showBar: false,
                        max: 0,
                        counter: 0,

                        status: "ok"
                    });

                    window.location = '/tasks/active';
                } else {
                    if(this.state.compile == 409) this.setState({buforLabel: this.state.codeLabel});

                    this.setState({
                        taskMongoID: '',

                        taskBody: '',
                        cppCode: '',
                        inFiles: [],
                        outFiles: [],

                        taskLabel: "Treść zadania (.pdf)",
                        codeLabel: "Wzorcowy kod (.cpp)",
                        inFilesLabel: "Pliki wejściowe (.in)",
                        outFilesLabel: "Pliki wyjściowe (.out)",
                    });
                }

            } else window.location = '/login/';
        }
    }


    render() {
        if(this.state.isLoggedUser && this.state.isActiveUser) {
            if(!this.state.fileToLarge && this.state.fileToLargeName === '' 
                && (this.state.compile === 0 || this.state.compile === 200)
                && (this.state.run === 0 || this.state.run === 200)
                && (this.state.check === 0 || this.state.check === 200)) {
                return(
                    <main>
                        <div className="d-flex flex-column align-items-center mt-5 pt-5" style={{minHeight: "90.4vh"}}>
                            <form className="mt-4 p-2 px-4 mb-4 task-input-form" onSubmit={this.onSubmit} style={{backgroundColor: "#575656", borderRadius: "6px"}}>
                                <TaskInputForm 
                                    state={this.state} 
                                    
                                    onChangeTitle={this.onChangeTaskTitle}
                                    onChangeTags={this.onChangeTags}
                                    onChangeDesc={this.onChangeTaskDesc}
                                    onChangeDifficulty={this.onChangeDifficulty}
                                    onChangeRunTime={this.onChangeRunTime}
                                    onChangeSingleFile={this.onChangeSingleFile}
                                    onChangeMultipleFiles={this.onChangeMultipleFiles}
                                    onChangePublic={this.onChangePublicTask}
                                />
                            
                                <button type="submit" className="btn btn-success mt-4 mb-3 text-dark">Dodaj zadanie</button>
        
                                {this.state.showBar ? <progress max={this.state.max} value={this.state.counter} style={{width: "100%"}}></progress> : null}
                            </form>
                        </div>
                    </main>
                );
            } if(this.state.compile == 409) {
                return(
                    <main>
                        <div className="d-flex flex-column align-items-center mt-5 pt-5" style={{minHeight: "90.4vh"}}>
                            <section className="mail-info">
                                Kompilacja pliku {this.state.buforLabel} zakończona niepowodzeniem!
                            </section>
                        
                            <form className="d-flex flex-column align-items-center mt-4 p-2 px-4 mb-4" onSubmit={this.onSubmit} style={{backgroundColor: "#575656", borderRadius: "6px"}}>
                                <TaskInputForm 
                                    state={this.state} 
                                    
                                    onChangeTitle={this.onChangeTaskTitle}
                                    onChangeTags={this.onChangeTags}
                                    onChangeDesc={this.onChangeTaskDesc}
                                    onChangeDifficulty={this.onChangeDifficulty}
                                    onChangeRunTime={this.onChangeRunTime}
                                    onChangeSingleFile={this.onChangeSingleFile}
                                    onChangeMultipleFiles={this.onChangeMultipleFiles}
                                    onChangePublic={this.onChangePublicTask}
                                />
                            
                                <button type="submit" className="btn btn-success mt-4 mb-3 text-dark">Dodaj zadanie</button>
        
                                {this.state.showBar ? <progress max={this.state.max} value={this.state.counter} style={{width: "100%"}}></progress> : null}
                            </form>
                        </div>
                    </main>
                );
            } if(this.state.run == 406) {
                return(
                    <main>
                        <div className="d-flex flex-column align-items-center mt-5 pt-5" style={{minHeight: "90.4vh"}}>
                            <section className="mail-info">
                                Nie udało się uruchomić programu z podanymi plikami wejściowymi!
                            </section>
                        
                            <form className="d-flex flex-column align-items-center mt-4 p-2 px-4 mb-4" onSubmit={this.onSubmit} style={{backgroundColor: "#575656", borderRadius: "6px"}}>
                                <TaskInputForm 
                                    state={this.state} 
                                    
                                    onChangeTitle={this.onChangeTaskTitle}
                                    onChangeTags={this.onChangeTags}
                                    onChangeDesc={this.onChangeTaskDesc}
                                    onChangeDifficulty={this.onChangeDifficulty}
                                    onChangeRunTime={this.onChangeRunTime}
                                    onChangeSingleFile={this.onChangeSingleFile}
                                    onChangeMultipleFiles={this.onChangeMultipleFiles}
                                    onChangePublic={this.onChangePublicTask}
                                />
                            
                                <button type="submit" className="btn btn-success mt-4 mb-3 text-dark">Dodaj zadanie</button>
        
                                {this.state.showBar ? <progress max={this.state.max} value={this.state.counter} style={{width: "100%"}}></progress> : null}
                            </form>
                        </div>
                    </main>
                );
            } if(this.state.check == 417) {
                return(
                    <main>
                        <div className="d-flex flex-column align-items-center mt-5 pt-5" style={{minHeight: "90.4vh"}}>
                            <section className="mail-info">
                                Program nie przeszedł testów! Pliki wyjściowe nie zgadzają się z oczekiwanym rezultatem!
                            </section>
                        
                            <form className="d-flex flex-column align-items-center mt-4 p-2 px-4 mb-4" onSubmit={this.onSubmit} style={{backgroundColor: "#575656", borderRadius: "6px"}}>
                                <TaskInputForm 
                                    state={this.state} 
                                    
                                    onChangeTitle={this.onChangeTaskTitle}
                                    onChangeTags={this.onChangeTags}
                                    onChangeDesc={this.onChangeTaskDesc}
                                    onChangeDifficulty={this.onChangeDifficulty}
                                    onChangeRunTime={this.onChangeRunTime}
                                    onChangeSingleFile={this.onChangeSingleFile}
                                    onChangeMultipleFiles={this.onChangeMultipleFiles}
                                    onChangePublic={this.onChangePublicTask}
                                />
                            
                                <button type="submit" className="btn btn-success mt-4 mb-3 text-dark">Dodaj zadanie</button>
        
                                {this.state.showBar ? <progress max={this.state.max} value={this.state.counter} style={{width: "100%"}}></progress> : null}
                            </form>
                        </div>
                    </main>
                );
            } else {
                return(
                    <main>
                        <div className="d-flex flex-column align-items-center list-container">
                            <section className="mail-info">
                                Plik {this.state.fileToLargeName} przekracza dopuszczalny rozmiar (4 MiB)!
                            </section>
                        
                            <form className="d-flex flex-column align-items-center mt-4 p-2 px-4 mb-4" onSubmit={this.onSubmit} style={{backgroundColor: "#575656", borderRadius: "6px"}}>
                                <TaskInputForm 
                                    state={this.state} 
                                    
                                    onChangeTitle={this.onChangeTaskTitle}
                                    onChangeTags={this.onChangeTags}
                                    onChangeDesc={this.onChangeTaskDesc}
                                    onChangeDifficulty={this.onChangeDifficulty}
                                    onChangeRunTime={this.onChangeRunTime}
                                    onChangeSingleFile={this.onChangeSingleFile}
                                    onChangeMultipleFiles={this.onChangeMultipleFiles}
                                    onChangePublic={this.onChangePublicTask}
                                />
                            
                                <button type="submit" className="btn btn-success mt-4 mb-3 text-dark">Dodaj zadanie</button>
        
                                {this.state.showBar ? <progress max={this.state.max} value={this.state.counter} style={{width: "100%"}}></progress> : null}
                            </form>
                        </div>
                    </main>
                );
            }
        } if(!this.state.isLoggedUser || !this.state.isActiveUser) {
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