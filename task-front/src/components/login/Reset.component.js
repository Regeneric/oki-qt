import React, {Component} from "react";
import axios from "axios";

export default class Reset extends Component {
    constructor(props) {
        super(props);

        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    
        this.state = {
            password: '',
            confirmPassword: '',

            canChange: false
        };
    }

    async componentDidMount() {
        await axios.get(`/users/${this.props.match.params.id}?api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => {
                if(res.data.unique === this.props.match.params["unique"] && res.data.unique !== -1) this.setState({canChange: true});
            })
        .catch(err => err);
    }

    onChangePassword(e) {
        switch(e.target.name) {
            case "pass": this.setState({password: e.target.value}); break;
            case "pass-conf": this.setState({confirmPassword: e.target.value}); break;
        }
    }

    async onSubmit(e) {
        e.preventDefault();

        let passTest = false, passSame = false;

        const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        if(passwordRegex.test(this.state.password) && passwordRegex.test(this.state.confirmPassword)) passTest = true;
        else {
            alert("Hasło musi składać się z co najmniej jednej małej litery, jednej dużej, jednej cyfry, jednego znaku specjalnego i mieć długość przynajmniej ośmiu znaków!");

            this.setState({
                password: '',
                confirmPassword: ''
            });
        }

        if(this.state.password === this.state.confirmPassword) passSame = true;
        else {
            alert("Hasła nie są jednakowe!");

            this.setState({
                password: '',
                confirmPassword: ''
            });
        }

        if(passTest && passSame) {
            axios.put("/users/update/"+this.props.match.params.id+"?api_key="+process.env.REACT_APP_API_KEY, {password: this.state.password, confirmPassword: this.state.confirmPassword, expiresIn: new Date().toISOString().substr(0, 10)})
                .then(res => {
                    if(res.status === 200) window.location = '/login';
                    else window.location = '/login/forgot';
                })
            .catch(err => {
                if(err.response.status === 403) alert("Nie masz uprawnień do zmiany hasła!");
            });
        }
    }


    render() {
        if(this.state.canChange) {
            return(
                <div className="mt-5 pt-5 text-light text-center d-flex flex-column align-items-center" style={{height: "90vh"}}>
                    <form name="login" className="d-flex flex-column w-25 mt-5 p-2 px-4 pb-3" onSubmit={this.onSubmit} style={{backgroundColor: "#575656", borderRadius: "6px"}}>
                        <input className="form form-control my-1" type="password" placeholder="Nowe hasło..." 
                            name="pass"
                            onChange={this.onChangePassword}
                            value={this.state.password}
                        />
                        <input className="form form-control my-1" type="password" placeholder="Powtórz nowe hasło..." 
                            name="pass-conf"
                            onChange={this.onChangePassword}
                            value={this.state.confirmPassword}
                        />
                    
                        <button className="btn btn-primary mt-3 w-100 mr-2" type="submit">Resetuj hasło</button>
                    </form>
                </div>
            );
        } else {
            return(
                <div className="mt-5 pt-5 text-light text-center d-flex flex-column align-items-center" style={{height: "90vh"}}>
                    <form className="d-flex flex-column w-25 mt-5 px-4 p-3" style={{backgroundColor: "#575656", borderRadius: "6px"}}>
                        <h2>Nie masz uprawnień do resetu tego hasła!</h2>
                    </form>
                </div>
            );
        }
    }
}