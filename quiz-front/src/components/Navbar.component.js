/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 16/10/2020
// File: ./src/components/Navbar.component.js
/*-!INFO!-*/


import React, {Component} from "react";
import {Link} from "react-router-dom";
import Cookies from "js-cookie";

import axios from "axios";

import itcLogo from "../images/itc-logo.png";

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.onClickMenuToggle = this.onClickMenuToggle.bind(this);
        this.state = {
            hamburger: false, 
            // domain: "astylestickers.com.pl",
            domain: "oki.org.pl"
        };
    }

    onClickMenuToggle(e) {this.setState({hamburger: !this.state.hamburger});}

    button() {
        if(this.state.hamburger) {
            return(
                <button className="menu-toggler active" type="button" onClick={this.onClickMenuToggle}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            );
        } else {
            return(
                <button className="menu-toggler" type="button" onClick={this.onClickMenuToggle}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>  
            );
        }
    }

    menu() {
        const {domain} = this.state;

        if(this.state.hamburger && (Cookies.get("userName") != null || Cookies.get("token") != null)) {
            return(
                <section className="navbar-right active">
                    <div className="navbar-item"><Link to="/">Strona Główna</Link></div>
                    <div className="navbar-item"><Link to="/quiz/find/">Znajdź Quiz</Link></div>
                    <div className="navbar-item"><Link to="/quiz/add/">Stwórz Quiz</Link></div>
                    <div className="navbar-item"><a href="https://zadania.oki.org.pl">Zadania</a></div>
                    <div className="navbar-item" 
                        style={{cursor: "pointer"}}
                        onClick={async () => { 
                            const id = await axios.get("/users?userName="+Cookies.get("userName")+"&api_key="+process.env.REACT_APP_API_KEY).then(res => res.data[0]._id).catch(err => err);
    
                            Cookies.remove("userName", {domain});
                            Cookies.remove("token", {domain});
                            axios.put("/users/update/"+id+"?api_key="+process.env.REACT_APP_API_KEY, {isLogged: false})
                                .then(res => {
                                    if(res.status === 200) window.location = '/';
                                })
                            .catch(err => err);
                        }}>
                        Wyloguj
                    </div>
                </section>
            );
        } if(!this.state.hamburger && (Cookies.get("userName") != null || Cookies.get("token") != null)) {
            return(
                <section className="navbar-right">
                    <div className="navbar-item"><Link to="/">Strona Główna</Link></div>
                    <div className="navbar-item"><Link to="/quiz/find/">Znajdź Quiz</Link></div>
                    <div className="navbar-item"><Link to="/quiz/add/">Stwórz Quiz</Link></div>
                    <div className="navbar-item"><a href="https://zadania.oki.org.pl">Zadania</a></div>
                    <div className="navbar-item" 
                        style={{cursor: "pointer"}}
                        onClick={async () => { 
                            const id = await axios.get("/users?userName="+Cookies.get("userName")+"&api_key="+process.env.REACT_APP_API_KEY).then(res => res.data[0]._id).catch(err => err);

                            Cookies.remove("userName", {domain});
                            Cookies.remove("token", {domain});
                            axios.put("/users/update/"+id+"?api_key="+process.env.REACT_APP_API_KEY, {isLogged: false})
                                .then(res => {
                                    if(res.status === 200) window.location = '/';
                                })
                            .catch(err => err);
                        }}>
                        Wyloguj
                    </div>
                </section>
            );
        } if(this.state.hamburger && (Cookies.get("userName") == null || Cookies.get("token") == null)) {
            return(
                <section className="navbar-right active">
                    <div className="navbar-item"><Link to="/">Strona Główna</Link></div>
                    <div className="navbar-item"><Link to="/quiz/find/">Znajdź Quiz</Link></div>
                    <div className="navbar-item"><Link to="/quiz/add/">Stwórz Quiz</Link></div>
                    <div className="navbar-item"><a href="https://zadania.oki.org.pl">Zadania</a></div>
                    <div className="navbar-item"><Link to="/login">Logowanie</Link></div>
                </section>
            );
        } if(!this.state.hamburger && (Cookies.get("userName") == null || Cookies.get("token") == null)) {
            return(
                <section className="navbar-right">
                    <div className="navbar-item"><Link to="/">Strona Główna</Link></div>
                    <div className="navbar-item"><Link to="/quiz/find/">Znajdź Quiz</Link></div>
                    <div className="navbar-item"><Link to="/quiz/add/">Stwórz Quiz</Link></div>
                    <div className="navbar-item"><a href="https://zadania.oki.org.pl">Zadania</a></div>
                    <div className="navbar-item"><Link to="/login">Logowanie</Link></div>
                </section>
            );
        }
    }

    render() {
        if(Cookies.get("userName") != null) {
            return(
                <nav className="container-fluid navbar-bar navbar-top">
                    <section className="navbar-left">
                        {/* <Link to="/"><img src={itcLogo} alt="ITC-LOGO" /></Link> */}
                    </section>

                    {this.menu()}
                    {this.button()}
                </nav>
            );
        } else {
            return(
                <nav className="container-fluid navbar-bar navbar-top">
                    <section className="navbar-left">
                        {/* <Link to="/"><img src={itcLogo} alt="ITC-LOGO" /></Link> */}
                    </section>

                    {this.menu()}
                    {this.button()}
                </nav>
            );
        }
    }
}