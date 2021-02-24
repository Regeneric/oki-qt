/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 03/10/2020
// File: ./src/components/Footer.component.js
/*-!INFO!-*/


import React, {Component} from "react";

export default class Footer extends Component {
    render() {
        return(
            <footer>
                <section className="copyright">
                    <a href="https://itcrowd.net.pl" target="_blank" rel="noopener noreferrer">IT Crowd</a> | Hubert Batkiewicz &copy; 2020
                </section>
            </footer>
        );
    }
}