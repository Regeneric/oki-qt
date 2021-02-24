import React, {Component} from "react";
import axios from "axios";

export default class Confirm extends Component {
    constructor(props) {
        super(props);

        this.state = {active: false}
    }

    async componentDidMount() {
        axios.put("/users/update/"+this.props.match.params.id+"?api_key="+process.env.REACT_APP_API_KEY, {isActive: true})
            .then(res => {
                this.setState({active: true});
            })
        .catch(err => err);

        setTimeout(() => {window.location = '/login'}, 2500);
    }

    render() {
        if(this.state.active) {
            return(
                <div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
                    <section className="w-25 text-light text-center mt-4 p-3 h-auto" style={{border: "1px solid grey", backgroundColor: "#53bdc1", fontWeight: "bold", borderRadius: "6px"}}>
                        Konto zostało aktywowane! Zaraz zostaniesz przekierowany...
                    </section>
                </div>
            );
        }
        else {
            return(
                <div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
                    <section className="w-25 text-light text-center mt-4 p-3 h-auto" style={{border: "1px solid grey", backgroundColor: "#53bdc1", fontWeight: "bold", borderRadius: "6px"}}>
                        Trwa aktywacja konta! Proszę czekać...
                    </section>
                </div>
            );
        }
    }
}