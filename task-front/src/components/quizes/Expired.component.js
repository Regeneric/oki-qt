import React, {Component} from "react";
import axios from "axios";

import QuizToShow from "./containers/QuizToShow.container";

export default class Expired extends Component {
    constructor(props) {
        super(props);

        this.state = {expired: []}
    }


    async componentDidMount() {
        await axios.get("/quizes?isPublic=true&api_key="+process.env.REACT_APP_API_KEY)
            .then(res => {
                let temp = res.data.filter(q => q.quizEndDate < new Date().toISOString());
                if(temp.length > 1) temp = temp.sort((a, b) => a.lastTake < b.lastTake ? 1 : -1);

                this.setState({expired: temp});
            })
        .catch(err => err);
    }
    
    expiredList() {
        return this.state.expired.map(currQuiz => {
            return <QuizToShow quiz={currQuiz} key={currQuiz._id} />
        });
    }


    render() {
        if(this.state.expired.length <= 0) {
            return(
                <main>
                    <div className="list-container">
                        <h3 className="mt-5 text-center">Nic tu jeszcze nie ma :c</h3>
                    </div>
                </main>
            );
        } else {
            return(
                <main>
                    <div className="list-container">
                        {this.expiredList()}
                    </div>
                </main>
            );
        }
    }
}