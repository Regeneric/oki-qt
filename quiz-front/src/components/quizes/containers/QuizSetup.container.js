import React from "react";

const QuizSetup = props => {
    if(props.state.quizID !== '' && !props.state.readyToRender) window.location = "/quiz/show/"+props.state.quizID;
    if(props.state.readyToRender && (props.state.quizCategory.length > 0 && props.state.quizDesc.length > 0)) {
        return(<span>{props.inputForm}</span>)
    } if(!props.state.quizUpdated) {
        return(
            <section className="my-3 text-center">
                <h2 className="mb-4 py-3 mb-0 text-light">Stwórz nowy quiz</h2>

                <div class="input-group mt-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text" id="login-info">
                            ?
                            <span id="tooltip-login">Kategoria</span>
                        </div>
                    </div>
                    <input 
                        className="form form-control"
                        type="text"
                        placeholder="Kategoria..."
                        value={props.state.quizCategory}
                        onChange={props.onChangeCategory}
                    />
                </div>
                
                <div className="d-flex">
                    <div class="input-group mt-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text" id="login-info">
                                ?
                                <span id="tooltip-login">Czas trwania (minuty)</span>
                            </div>
                        </div>
                        <input 
                            className="form form-control t1"
                            type="number"
                            placeholder="Czas trwania... (minuty)"
                            value={props.state.quizDuration}
                            onChange={props.onChangeDuration}
                        />
                    </div>

                    <div class="input-group mt-2 t2">
                        <div class="input-group-prepend">
                            <div class="input-group-text" id="login-info">
                                ?
                                <span id="tooltip-login">Ilość prób</span>
                            </div>
                        </div>
                        <input 
                            className="form form-control"
                            type="number"
                            placeholder="Ilość prób..."
                            value={props.state.takes}
                            onChange={props.onChangeTakes}
                        />
                    </div>
                </div>

                <div class="input-group mt-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text" id="login-info">
                            ?
                            <span id="tooltip-login">Krótki opis quizu</span>
                        </div>
                    </div>
                    <textarea 
                        className="form form-control"
                        type="text"
                        placeholder="Opis quizu..."
                        value={props.state.quizDesc}
                        onChange={props.onChangeDesc}
                    />
                </div>
    
                <section className="d-flex justify-content-between mt-2 quiz-setup-dates">
                    <div className="d-flex flex-column align-items-center">
                        <p className="text-light mt-3">Data rozpoczęcia</p>
                        <input className="form-control" type="date" onChange={props.onChangeStartDate} /> 
                    </div>

                    <div className="d-flex flex-column align-items-center">
                        <p className="text-light mt-3">Data zakończenia</p>
                        <input className="form-control" type="date" onChange={props.onChangeEndDate} /> 
                    </div>
                </section>   

                <section className="d-flex flex-column align-items-center">
                    <div className="d-flex flex-column align-items-center">
                        <p className="text-light mt-4">Quiz publiczny</p>
                        <input type="checkbox" checked={props.state.quizIsPublic} className="checkbox mb-3" onChange={props.onClickIsPublic} /> 
                    </div>

                    <button type="button" className="btn btn-primary mt-4" onClick={props.onClickReadyToRender}>Dalej</button>
                </section>
            </section>
        );
    } else return null;
}; export default QuizSetup;