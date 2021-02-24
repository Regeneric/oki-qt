import React, {Component} from "react";

export default class NotFound extends Component {
    render() {
        return(
            <form className="d-flex flex-column align-items-center mt-5 pt-5 search-form" style={{height: "100vh"}} onSubmit={this.onSubmit}>
                <h2 className="mt-3 text-dark">Nie ma takiej strony :c</h2>
            </form>
        );
    }   
}