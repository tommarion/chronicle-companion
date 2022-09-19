import * as React from "react";
import {Component} from "react";
import GameType from "../../data/enum/GameType";

type ReferenceProps = {
    gameType: GameType
    hidden: boolean
}
export default class Reference extends Component<ReferenceProps, {}> {
    render() {
        return (
            <div className={this.props.hidden ? 'hidden' : ''}></div>
        );
    }
}