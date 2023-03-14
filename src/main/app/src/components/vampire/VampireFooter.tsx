import * as React from "react";
import {Component} from "react";
import '../../stylesheet/footer.css';

class VampireFooter extends Component<any, any> {
    render() {
        return(
            <footer>
                <div id="dark-pack-logo" className="img"></div>
                <div id="dark-pack-text">
                    <p>Portions of the materials are the copyrights and trademarks of Paradox Interactive AB, and are
                        used with permission. All rights reserved. For more information please visit <a
                            href="https://www.worldofdarkness.com">worldofdarkness.com</a></p>
                </div>
            </footer>
        );
    }
}

export default VampireFooter;