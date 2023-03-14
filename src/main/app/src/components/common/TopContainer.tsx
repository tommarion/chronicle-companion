import * as React from "react";
import {Component} from "react";
import AppView from '../../data/enum/AppView';
import '../../stylesheet/toolbars.css';
import '../../stylesheet/buttons.css';
import '../../stylesheet/sidebar.css';

type TopContainerProps = {
    sidebar: boolean
    online: OnlineStatusInterface[]
    updateCharacterId: Function
    characterId: string
}

type TopContainerState = {
}

class TopContainer extends Component<TopContainerProps, TopContainerState> {
    render () {
        return (
            <div id='top-container' className={this.props.sidebar ? 'sidebar' : ''}>
                <div id="pc__btns__wrapper">
                    {this.props.online ?
                        this.props.online.map((online , index) => {
                            return(
                                <div key={index} className={"btn btn-character" +
                                        (online.id === this.props.characterId ? ' active' : '')}
                                     onClick={online.id === this.props.characterId ||
                                     online.id === 'GM' || online.id === 'DM' || online.id === 'Storyteller' ?
                                         null : () => this.props.updateCharacterId(online.id)}
                                >
                                    <div className={"online-status " + (online.status ? "online" : "offline")}></div>
                                    <div className="name">{online.name}</div>
                                </div>
                            )
                        })
                    : 'No characters tied to accounts yet!'}
                </div>
            </div>
        );
    }
}

export default TopContainer;