import React from "react";
import {Link} from "react-router-dom";

const LoginForm = props => {
    const toolTipsCSS = `#tooltip-login, #tooltip-password {
        visibility: hidden;
        background-color: #222;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px;
        overflow-wrap: break-word;
        position: fixed;
        z-index: 999;
        max-width: 385px;
    }`;

    return(
        <form name="login" className="login-container" onSubmit={props.onSubmit} style={{backgroundColor: "#575656", borderRadius: "6px"}}>
            <style>
                {toolTipsCSS}
            </style>
            
            <div className="input-group">
                <div className="input-group-prepend">
                    <div className="input-group-text my-1" id="login-info">
                        ?
                        <span id="tooltip-login">Login może zawierać jedynie litery, <wbr/>cyfry oraz znak '_'</span>
                    </div>
                </div>
                <input className="form form-control my-1" type="text" placeholder="Login..." 
                    onChange={props.onChangeLogin}
                />   
            </div>

            <div className="input-group mb-1">
                <div className="input-group-prepend">
                    <div className="input-group-text my-1" id="password-info">
                        ?
                        <span id="tooltip-password">Hasło musi posiadać jedną wielką literę, <wbr/> jedną cyfrę, jeden znak specjalny i łącznie <wbr/>mieć długość ośmiu znaków.</span>
                    </div>
                </div>
                <input className="form form-control my-1" type="password" placeholder="Hasło..." 
                    onChange={props.onChangePassword}
                />      
            </div>
        
            <div className="login-action-buttons">
                <button className="btn btn-primary mt-3 w-100 mr-2 text-dark" type="submit">{props.state.loginLabel}</button>
                <Link to="/login/forgot" className="btn btn-warning mt-3 w-100 ml-2">Zapomniałem hasła</Link>
            </div>
        </form>
    );
}; export default LoginForm;