import React, {Component} from "react";
import axios from "axios";
import Cookies from "js-cookie";

import LoginForm from "./containers/LoginForm.container";
import RegisterForm from "./containers/RegisterForm.container";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.onClickFormChange = this.onClickFormChange.bind(this);
        
        this.onChangeLogin = this.onChangeLogin.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangePasswordConf = this.onChangePasswordConf.bind(this);

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeBirthDate = this.onChangeBirthDate.bind(this);
        this.onChangeCity = this.onChangeCity.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            // domain: "astylestickers.com.pl",
            domain: "oki.org.pl",

            loginLabel: "Zaloguj się",
            login: true,
            register: false,

            logged: false,
            registered: false,

            userName: '',
            password: '',
            confirmPassword: '',
            
            email: '',
            firstName: '',
            birthDate: new Date(),
            city: '',

            wt: '',
            et: '',
            st: ''
        }
    }

    onClickFormChange(e) {
        if(e.target.name === "login") this.setState({login: true, register: false});
        else this.setState({login: false, register: true});
    }

    onChangeLogin(e) {this.setState({userName: e.target.value})}
    onChangePassword(e) {this.setState({password: e.target.value})}
    onChangePasswordConf(e) {this.setState({confirmPassword: e.target.value})}

    onChangeEmail(e) {this.setState({email: e.target.value})}
    onChangeFirstName(e) {this.setState({firstName: e.target.value})}
    onChangeBirthDate(e) {this.setState({birthDate: e.target.value})}
    onChangeCity(e) {this.setState({city: e.target.value})}

    async onSubmit(e) {
        e.preventDefault();

        if(e.target.name === "register") {
            let userTest = false, emailTest = false, passTest = false, passSame = false;

            const userRegex = new RegExp("^[a-zA-Z0-9_]{2,}[a-zA-Z]+[0-9]*$");
            if(userRegex.test(this.state.userName)) userTest = true;
            else {
                this.setState({wt: "Login musi mieć minimum trzy znaki!"});

                this.setState({
                    userName: '',
                    password: '',
                    confirmPassword: ''
                });
            }

            const emailRegex = /\S+@\S+\.\S+/;
            if(emailRegex.test(this.state.email)) emailTest = true;
            else {
                this.setState({wt: "Podaj prawidłowy adres email!"});

                this.setState({
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
            }

            const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
            if(passwordRegex.test(this.state.password) && passwordRegex.test(this.state.confirmPassword)) passTest = true;
            else {
                this.setState({wt: "Hasło musi składać się z co najmniej jednej małej litery, jednej dużej, jednej cyfry, jednego znaku specjalnego i mieć długość przynajmniej ośmiu znaków!"});

                this.setState({
                    password: '',
                    confirmPassword: ''
                });
            }

            if(this.state.password === this.state.confirmPassword) passSame = true;
            else {
                this.setState({wt: "Hasła nie są jednakowe!"});

                this.setState({
                    password: '',
                    confirmPassword: ''
                });
            }

            let isUserNameFree = false;
            isUserNameFree = await axios.get("/users?userName="+this.state.userName+"&api_key="+process.env.REACT_APP_API_KEY)
                .then(res => res.data[0].userName.length > 0 ? false : true)
            .catch(err => isUserNameFree = true);

            if(!isUserNameFree) {
                this.setState({wt: "Nazwa użytkownika jest już zajeta!"});

                this.setState({
                    userName: '',
                    password: '',
                    confirmPassword: ''
                });
            }
            
            let isUserEmailFree = false;
            isUserEmailFree = await axios.get("/users?email="+this.state.email+"&api_key="+process.env.REACT_APP_API_KEY)
                .then(res => res.data[0].email.length > 0 ? false : true)
            .catch(err => isUserEmailFree = true);

            if(!isUserEmailFree) {
                this.setState({et: "Pod danym adresem email istnieje już konto!"});

                this.setState({
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
            }


            if(userTest && emailTest && passTest && passSame && isUserNameFree && isUserEmailFree) {
                const user = {
                    userName: this.state.userName,
                    email: this.state.email,
                    firstName: this.state.firstName,
                    password: this.state.password,
                    confirmPassword: this.state.confirmPassword,
                    birthDate: this.state.birthDate,
                    city: this.state.city,
                    isLogged: false,
                    roomID: "NONE",
                    isActive: false,
                    domain: "quiz",
                };
    
                axios.post("/users/add?api_key="+process.env.REACT_APP_API_KEY, user)
                    .then(res => res)
                .catch(err => err);
    
                this.setState({
                    userName: '',
                    password: '',
                    confirmPassword: '',
                    city: '',
                    birthDate: '',
                    firstName: '',
    
                    register: false,
                    registered: true,
    
                    login: true,

                    et: '',
                    wt: '',
                    st: ''
                });
            }

        } else {
            this.setState({loginLabel: "Logowanie..."});
            const user = {
                userName: this.state.userName,
                password: this.state.password
            }; 

            const isActive = await axios.get("/users?userName="+this.state.userName+"&api_key="+process.env.REACT_APP_API_KEY).then(res => res.data[0].isActive).catch(err => {this.setState({password: '', et: "Hasło lub login nieprawidłowe!", loginLabel: "Jeszcz raz?"});})
            const email = await axios.get("/users?userName="+this.state.userName+"&api_key="+process.env.REACT_APP_API_KEY).then(res => res.data[0].email).catch(err => {this.setState({password: '', et: "Hasło lub login nieprawidłowe!", loginLabel: "Jeszcz raz?"});})

            axios.post("/users/check?api_key="+process.env.REACT_APP_API_KEY, user)
                .then(async res => {
                    if(isActive) {
                        await axios.put("/users/update/"+res.data.id+"?api_key="+process.env.REACT_APP_API_KEY, {isLogged: true});

                        Cookies.set("token", res.data.token, {domain: this.state.domain, secure: true, expires: 1, samesite: "strict"});
                        Cookies.set("userName", this.state.userName, {domain: this.state.domain, secure: true, expires: 1, samesite: "strict"});

                        this.setState({logged: true, et: '', wt: '', st: "Zalogowano pomyślnie!"});
                        if(this.state.logged) window.location = '/';
                    } else this.setState({login: true, register: false, registered: true, email: email});
                })
            .catch(err => {
                if(err && err.response.status == 401) this.setState({password: '', et: "Hasło lub login nieprawidłowe!", loginLabel: "Jeszcz raz?"});
                if(err && err.response.status == 403) this.setState({login: true, register: false, registered: true, email: email, loginLabel: "Najpierw aktywuj konto!"});
            });
        }
    }

    render() {
        if(this.state.login && !this.state.registered) {
            return(
                <main>
                    <section className="form-container">
                        {this.state.et.length > 0 ? <div class="btn btn-danger text-bold w-100 em" style={{position: "fixed", top: "82px"}} disabled>{this.state.et}</div> : null}
                        {this.state.wt.length > 0 ? <div class="btn btn-warning w-100 wm" style={{position: "fixed", top: "82px"}} disabled>{this.state.wt}</div> : null}
                        {this.state.st.length > 0 ? <div class="btn btn-success w-100 sm" style={{position: "fixed", top: "82px"}} disabled>{this.state.st}</div> : null}

                        <div className="action-buttons">
                            <input className="login-button" name="login" type="button" value="Logowanie" 
                                style={{backgroundColor: "#d9dada"}}
                                onClick={this.onClickFormChange}
                                required 
                            />

                            <input className="login-button" name="register" type="button" value="Rejestracja" 
                                style={{backgroundColor: "#e9476a"}}
                                onClick={this.onClickFormChange} 
                                required
                            />
                        </div>
        
                        <LoginForm
                            state={this.state}

                            onChangeLogin={this.onChangeLogin}
                            onChangePassword={this.onChangePassword}
                            
                            onSubmit={this.onSubmit}
                        />
                    </section>
                </main>
            );
        } if(this.state.login && this.state.registered) {
            return(
                <main>
                    <section className="form-container">
                        {this.state.et.length > 0 ? <div class="btn btn-danger text-bold w-100 em" style={{position: "fixed", top: "82px"}} disabled>{this.state.et}</div> : null}
                        {this.state.wt.length > 0 ? <div class="btn btn-warning w-100 wm" style={{position: "fixed", top: "82px"}} disabled>{this.state.wt}</div> : null}
                        {this.state.st.length > 0 ? <div class="btn btn-success w-100 sm" style={{position: "fixed", top: "82px"}} disabled>{this.state.st}</div> : null}

                        <div className="action-buttons">
                            <input className="login-button" name="login" type="button" value="Logowanie" 
                                style={{backgroundColor: "#d9dada"}}
                                onClick={this.onClickFormChange}
                                required 
                            />

                            <input className="login-button" name="register" type="button" value="Rejestracja" 
                                style={{backgroundColor: "#e9476a"}}
                                onClick={this.onClickFormChange} 
                                required
                            />
                        </div>
        
                        <LoginForm
                            state={this.state}

                            onChangeLogin={this.onChangeLogin}
                            onChangePassword={this.onChangePassword}
                            
                            onSubmit={this.onSubmit}
                        />

                        <section className="mail-info">
                            Na adres {this.state.email} została wysłana wiadomość z potwierdzeniem rejestracji!
                        </section>
                    </section>
                </main>
            );
        } else {
            return(
                <main>
                    <section className="form-container">
                        {this.state.et.length > 0 ? <div class="btn btn-danger text-bold w-100 em" style={{position: "fixed", top: "82px"}} disabled>{this.state.et}</div> : null}
                        {this.state.wt.length > 0 ? <div class="btn btn-warning w-100 wm" style={{position: "fixed", top: "82px"}} disabled>{this.state.wt}</div> : null}
                        {this.state.st.length > 0 ? <div class="btn btn-success w-100 sm" style={{position: "fixed", top: "82px"}} disabled>{this.state.st}</div> : null}

                        <div className="action-buttons">
                            <input className="login-button" name="login" type="button" value="Logowanie" 
                                style={{backgroundColor: "#e9476a"}}
                                onClick={this.onClickFormChange}
                                required 
                            />

                            <input className="login-button" name="register" type="button" value="Rejestracja" 
                                style={{backgroundColor: "#d9dada"}}
                                onClick={this.onClickFormChange} 
                                required
                            />
                        </div>
        
                        <RegisterForm 
                            state={this.state}

                            onChangeLogin={this.onChangeLogin}
                            onChangeEmail={this.onChangeEmail}

                            onChangePassword={this.onChangePassword}
                            onChangePasswordConf={this.onChangePasswordConf}

                            onChangeFirstName={this.onChangeFirstName}
                            onChangeBirthDate={this.onChangeBirthDate}
                            onChangeCity={this.onChangeCity}

                            onSubmit={this.onSubmit}
                        />
                    </section>
                </main>
            );
        }
    }
}