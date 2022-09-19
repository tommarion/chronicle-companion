import * as React from "react";
import {MouseEventHandler} from "react";
import SoundType from "../../data/enum/SoundType";

type BookProp = {
    name: string
    id: string
    characterName: string
    characterId: string
    gameType: string
    enabled: boolean
    opened: boolean
    onClick: MouseEventHandler
    onCharacterClick: any
}

class Book extends React.Component<BookProp, {}> {
    render() {
        let bookClass = "btn-book btn-";
        switch (this.props.gameType) {
            case 'dnd':
                bookClass += 'campaign';
                break;
            case 'vampire':
            case 'vtm':
                bookClass += 'chronicle';
                break;
        }
        if (this.props.opened) {
            bookClass += ' opened';
        }
        return (
            <div className="btn-book__wrapper">
                <div className={bookClass} onClick={this.props.onClick}>
                    <div className="book-page">
                        <div className={"btn btn-user" + (this.props.opened ? '' : ' hidden')}
                            onClick={this.props.onCharacterClick}>
                            Play as:<br/>
                            <span>{this.props.characterName}</span>
                        </div>
                    </div>
                    <div className="book-cover__wrapper">
                        <div className="book-cover">
                        </div>
                        <div className="book-cover-overlay">
                            <div>{this.props.name}</div>
                        </div>
                        <div className="book-cover-back"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Book;