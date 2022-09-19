import * as React from "react";
import {Component} from "react";
import '../../stylesheet/mainContent.css'
import CharacterContent from "../vampire/CharacterContent";
import NotesContent from "./NotesContent";
import MainContentView from "../../data/enum/MainContentView";

type MainContentProps = {
    sidebar: boolean
    rollType: string
    diceValueHandler: Function
    campaignId: string
    characterId: string
    view: MainContentView
}

class MainContent extends Component<MainContentProps, {}> {
    render() {
        console.log(this.props.view);
        return(
            <div id="reference__wrapper">
                <div id="story__wrapper" className={this.props.sidebar ? 'sidebar' : ''}>
                    <div id="story-content">
                        <NotesContent hidden={this.props.view !== MainContentView.NOTES}/>
                        <CharacterContent hidden={this.props.view !== MainContentView.CHARACTERS}
                                          id={this.props.characterId}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default MainContent