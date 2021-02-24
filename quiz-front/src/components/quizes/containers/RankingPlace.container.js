import React from "react";

const RankingPlace = props => {
    const points = (props.user.points === 1) ? props.user.points+" punkt" : ((props.user.points > 1 && props.user.points < 5) ? props.user.points+" punkty" : props.user.points+" punktów");
    
    let timeSplited = new Array();
    if(props.user.time != null) timeSplited = props.user.time.split(':');

    let minutes = 0, seconds = 0;
    if(timeSplited[0] < 10 || timeSplited[0] === 0) minutes = '0'+timeSplited[0]; else minutes = timeSplited[0];
    if(timeSplited[1] < 10 || timeSplited[1] === 0) seconds = '0'+timeSplited[1]; else seconds = timeSplited[1];
    if(timeSplited.length <= 0) {minutes = "00"; seconds = "00";}

    return(
            <section className="d-flex flex-row justify-content-around align-items-center p-2 py-2 mx-auto my-1 mt-2 ranking-section" style={{backgroundColor: "#393634", color: "white", borderRadius: "6px"}}>
                <h5 className="text-left ranking-item ranking-username m-0">{props.user.userName}</h5>
                <h6 className="text-center ranking-item m-0 p-0">{points}</h6>
                <h6 className="text-left ranking-item ranking-time m-0 pr-2">Czas: &nbsp; {minutes}:{seconds}</h6>
            </section>
    );

}; export default RankingPlace;