import React, {Component} from "react";
import axios from "axios";

import QuizToShow from "./containers/QuizToShow.container";

export default class ComingSoon extends Component {
    constructor(props) {
        super(props);

        this.state = {comingSoon: []}
    }


    async componentDidMount() {
        await axios.get("/quizes?isPublic=true&api_key="+process.env.REACT_APP_API_KEY)
            .then(res => {
                const temp = res.data.filter(q => q.quizStartDate > new Date().toISOString());
                if(temp.length > 1) temp = temp.sort((a, b) => a.lastTake < b.lastTake ? 1 : -1);
                this.setState({comingSoon: temp});
            })
        .catch(err => err);
    }
    
    comingSoonList() {
        return this.state.comingSoon.map(currQuiz => {
            return <QuizToShow quiz={currQuiz} key={currQuiz._id} />
        });
    }


    render() {
        if(this.state.comingSoon.length <= 0) {
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
                        {this.comingSoonList()}
                    </div>
                </main>
            );
        }
    }
}