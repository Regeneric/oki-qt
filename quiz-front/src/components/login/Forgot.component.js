import React, {Component} from "react";
import axios from "axios";

export default class Forgot extends Component {
    constructor(props) {
        super(props);

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onClickResetPassword = this.onClickResetPassword.bind(this);
    
        this.state = {
            email: '',
            resetOK: false,
            trigger: false,
        };
    }

    onChangeEmail(e) {this.setState({email: e.target.value})}

    onClickResetPassword(e) {
        e.target.value = "Proszę czekać...";

        axios.post("/users/forgot?api_key="+process.env.REACT_APP_API_KEY, {email: this.state.email, domain: "quiz"})
            .then(res => {
                if(res.status === 200) this.setState({resetOK: true});
                else this.setState({resetOK: false, trigger: true});
            })
        .catch(err => {
            alert("Nie istnieje konto z takim adresem email!");
            this.setState({email: ''});
        });
    
        if(this.state.trigger) e.target.value = "Resetuj hasło";
    }


    render() {
        if(!this.state.resetOK) {
            return(
                <main>
                    <div className="text-light text-center mx-auto" style={{marginTop:"130px"}}>
                        <div className="d-flex flex-column align-items-center mt-5 p-2 px-4 pb-3 reset-window" style={{backgroundColor: "#575656", borderRadius: "6px"}}>
                            <h4 className="mt-3">Podaj adres email swojego konta</h4>
                            <div className="form-inline mt-3">
                                <input type="text" className="form-control" placeholder="Email..." value={this.state.email} onChange={this.onChangeEmail} />
                                <input type="submit" className="btn btn-primary" onClick={this.onClickResetPassword} value="Resetuj hasło" />
                            </div>
                        </div>
                    </div>
                </main>
            );
        } else {
            return(
                <main>
                    <div className="d-flex justify-content-center align-items-center" style={{marginTop:"130px"}}>
                        <section className="w-25 text-light text-center mt-4 p-3 h-auto reset-window" style={{border: "1px solid grey", backgroundColor: "#53bdc1", fontWeight: "bold", borderRadius: "6px"}}>
                            Na adres {this.state.email} wysłano wiadomość z potwierdzeniem resetu hasła!
                        </section>
                    </div>
                </main>
            );
        }
    }
}