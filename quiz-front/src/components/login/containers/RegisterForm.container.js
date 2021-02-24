import React from "react";

const RegisterForm = props => {
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
        <form name="register" className="login-container" onSubmit={props.onSubmit} style={{backgroundColor: "#575656", borderRadius: "6px"}}>
            <style>
                {toolTipsCSS}
            </style>

            <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text" id="login-info">
                        ?
                        <span id="tooltip-login">Login może zawierać jedynie litery, <wbr/>cyfry oraz znak '_'</span>
                    </div>
                </div>
                <input className="form form-control" type="text" placeholder="Login..." 
                    onChange={props.onChangeLogin}
                    value={props.state.userName}
                />  
            </div>

            <div class="input-group my-1">
                <div class="input-group-prepend">
                    <div class="input-group-text" id="login-info">
                        ?
                        <span id="tooltip-login">Adres email</span>
                    </div>
                </div>
                <input className="form form-control" type="text" placeholder="Email..." 
                    onChange={props.onChangeEmail}
                    value={props.state.email}
                /> 
            </div>

            <div className="my-2"></div>

            <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text my-1" id="password-info">
                        ?
                        <span id="tooltip-password">Hasło musi posiadać jedną wielką literę, <wbr/> jedną cyfrę, jeden znak specjalny i łącznie <wbr/>mieć długość ośmiu znaków.</span>
                    </div>
                </div>
                <input className="form form-control my-1" type="password" placeholder="Hasło..." 
                    onChange={props.onChangePassword}
                    value={props.state.password}
                />    
            </div>

            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <div class="input-group-text" id="password-info">
                        ?
                        <span id="tooltip-password">Hasło musi posiadać jedną wielką literę, <wbr/> jedną cyfrę, jeden znak specjalny i łącznie <wbr/>mieć długość ośmiu znaków.</span>
                    </div>
                </div>
                <input className="form form-control" type="password" placeholder="Powtórz hasło..." 
                    onChange={props.onChangePasswordConf}
                    value={props.state.confirmPassword}
                /> 
            </div>

            <div className="my-2"></div>

            <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text" id="password-info">
                        ?
                        <span id="tooltip-password">Twoje imię</span>
                    </div>
                </div>
                <input className="form form-control" type="text" placeholder="Imię..." 
                    onChange={props.onChangeFirstName}
                    value={props.state.firstName}
                />   
            </div>

            <div class="input-group my-1">
                <div class="input-group-prepend">
                    <div class="input-group-text" id="login-info">
                        ?
                        <span id="tooltip-login">Data urodzenia</span>
                    </div>
                </div>
                <input className="form form-control" type="date" placeholder="Data urodzenia..." 
                    onChange={props.onChangeBirthDate}
                    value={props.state.birthDate}
                />
            </div>
        
            <div class="input-group my-1">
                <div class="input-group-prepend">
                    <div class="input-group-text" id="login-info">
                        ?
                        <span id="tooltip-login">Skąd jesteś?</span>
                    </div>
                </div>
                <input className="form form-control" type="text" placeholder="Miasto..." 
                    onChange={props.onChangeCity}
                    value={props.state.city}
                />
            </div>
    
            <button className="btn btn-primary mt-3 w-100 text-dark" type="submit">Zarejestruj się</button>
        </form>
    );
}; export default RegisterForm;