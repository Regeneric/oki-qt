import React, {Component} from "react";
import axios from "axios";

import RankingPlace from "./containers/RankingPlace.container";

export default class Ranking extends Component {
    constructor(props) {
        super(props);

        this.rankingList = this.rankingList.bind(this);

        this.state = {users: []};
    }

    async componentDidMount() {
        let usr = await axios.get("/quizes?_id="+this.props.match.params.id+"&api_key="+process.env.REACT_APP_API_KEY).then(res => res.data.quizes[0].contributors).catch(err => err);
            usr = usr.sort((a, b) => (a.time < b.time) ? -1 : 1);
            usr = usr.sort((a, b) => a.points < b.points ? 1 : -1);
            const unique = usr.filter((v, i, s) => s.map(x => x.userName).indexOf(v.userName) == i);

        this.setState({users: unique});
    }

    rankingList() {
        return this.state.users.map(cu => {
            return <RankingPlace user={cu} key={cu.userName} />
        });
    }

    render() {
        if(this.state.users.length <= 0) {
            return(
                <main>
                    <div className="mt-5 pt-5 d-flex justify-content-center">
                        <h1>Nic tu jeszcze nie ma :c</h1>
                    </div>
                </main>
            );
        } else {
            return(
                <main>
                    <div className="mt-5 pt-5">
                        {this.rankingList()}
                    </div>
                </main>
            );
        }
    }
}