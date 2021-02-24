import React from "react";

const RankingPlace = props => {
    if(!props.user.isCompiling) {
        return(
            <section className="d-flex flex-row justify-content-between align-items-center p-2 mx-auto my-1 mt-2 w-50" style={{backgroundColor: "#d91636", color: "black", borderRadius: "6px"}}>
                <h4 className="mx-3 my-0" style={{fontSize: "12pt"}}>{props.user.userName}</h4>
    
                <div className="d-flex align-items-center">
                    <h6 className="mx-3 my-0 text-center" style={{fontSize: "10pt"}}>Kompilacja: &nbsp; {props.user.isCompiling ? "OK" : "NIE"}</h6>
                    <h6 className="mx-3 my-0 text-center" style={{fontSize: "10pt"}}>Uruchamia się: &nbsp; {props.user.isRunning ? "OK" : "NIE"}</h6>
                    <h6 className="mx-3 my-0 text-center" style={{fontSize: "10pt"}}>Testy: &nbsp; {props.user.isPassingTests ? "OK" : "NIE"}</h6>
                    <h6 className="mx-3 my-0 text-center" style={{fontSize: "10pt"}}>Rozmiar pliku: &nbsp; {props.user.fileSize}B</h6>
                </div>
            </section>
        );
    } if(props.user.isCompiling && !props.user.isRunning) {
        return(
            <section className="d-flex flex-row justify-content-between align-items-center p-2 mx-auto my-1 mt-2 w-50" style={{backgroundColor: "#ff9500", color: "black", borderRadius: "6px"}}>
                <h4 className="mx-3 my-0" style={{fontSize: "12pt"}}>{props.user.userName}</h4>
    
                <div className="d-flex align-items-center">
                    <h6 className="mx-3 my-0 text-center" style={{fontSize: "10pt"}}>Kompilacja: &nbsp; {props.user.isCompiling ? "OK" : "NIE"}</h6>
                    <h6 className="mx-3 my-0 text-center" style={{fontSize: "10pt"}}>Uruchamia się: &nbsp; {props.user.isRunning ? "OK" : "NIE"}</h6>
                    <h6 className="mx-3 my-0 text-center" style={{fontSize: "10pt"}}>Testy: &nbsp; {props.user.isPassingTests ? "OK" : "NIE"}</h6>
                    <h6 className="mx-3 my-0 text-center" style={{fontSize: "10pt"}}>Rozmiar pliku: &nbsp; {props.user.fileSize}B</h6>
                </div>
            </section>
        );
    } if(props.user.isCompiling && props.user.isRunning && !props.user.isPassingTests) {
        return(
            <section className="d-flex flex-row justify-content-between align-items-center p-2 mx-auto my-1 mt-2 w-50" style={{backgroundColor: "#fdd400", color: "black", borderRadius: "6px"}}>
                <h4 className="mx-3 my-0" style={{fontSize: "12pt"}}>{props.user.userName}</h4>
    
                <div className="d-flex align-items-center">
                    <h6 className="mx-3 my-0 text-center" style={{fontSize: "10pt"}}>Kompilacja: &nbsp; {props.user.isCompiling ? "OK" : "NIE"}</h6>
                    <h6 className="mx-3 my-0 text-center" style={{fontSize: "10pt"}}>Uruchamia się: &nbsp; {props.user.isRunning ? "OK" : "NIE"}</h6>
                    <h6 className="mx-3 my-0 text-center" style={{fontSize: "10pt"}}>Testy: &nbsp; {props.user.isPassingTests ? "OK" : "NIE"}</h6>
                    <h6 className="mx-3 my-0 text-center" style={{fontSize: "10pt"}}>Rozmiar pliku: &nbsp; {props.user.fileSize}B</h6>
                </div>
            </section>
        );
    } else {
        return(
            <section className="d-flex flex-row justify-content-between align-items-center p-2 mx-auto my-1 mt-2 w-50" style={{backgroundColor: "#00b82e", color: "black", borderRadius: "6px"}}>
                <h4 className="mx-3 my-0" style={{fontSize: "12pt"}}>{props.user.userName}</h4>
                <input type="button" 
                    style={{fontSize: "10pt"}}
                    className="btn btn-success text-dark" 
                    value="Pobierz rozwiązanie" 
                    name={props.user.userName}
                    onClick={props.onClickDownloadFile}
                    disabled={props.isDisabled}    
                />
    
                <div className="d-flex align-items-center">
                    <h6 className="mx-3 my-0 text-center" style={{fontSize: "10pt"}}>Kompilacja: &nbsp; {props.user.isCompiling ? "OK" : "NIE"}</h6>
                    <h6 className="mx-3 my-0 text-center" style={{fontSize: "10pt"}}>Uruchamia się: &nbsp; {props.user.isRunning ? "OK" : "NIE"}</h6>
                    <h6 className="mx-3 my-0 text-center" style={{fontSize: "10pt"}}>Testy: &nbsp; {props.user.isPassingTests ? "OK" : "NIE"}</h6>
                    <h6 className="mx-3 my-0 text-center" style={{fontSize: "10pt"}}>Rozmiar pliku: &nbsp; {props.user.fileSize}B</h6>
                </div>
            </section>
        );
    }

}; export default RankingPlace;