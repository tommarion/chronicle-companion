import * as React from "react";
import {ChangeEvent, MouseEventHandler, useState} from "react";
import DateUtil from "../../util/DateUtil";

type BookProps = {
    name:               string
    id:                 string
    hover:              boolean
    characterName:      string
    characterId:        string
    gameType:           string
    sessions:           number
    lastPlayed:         string
    players:            CharacterInterface[]
    enabled:            boolean
    opened:             boolean
    onClick:            MouseEventHandler
    onCharacterClick?:  MouseEventHandler
    newBookClick?:      Function
}

const GAMETYPES : Map<string, string> = new Map<string,string>([
    ['dnd', "Dungeons & Dragons 5e"],
    ['sr', "Shadow Run 5e"],
    // ['call', "Call of Cthulhu"],
    ['vtm', "Vampire: the Masquerade V5"],
    // ['were', "Werewolf: the Apocalypse W5"],
    // ['hun', "Hunter: the Reckoning H5"],
    // ['wra', "Wraith: the Oblivion"],
    // ['mag', "Mage: the Ascension"],
    // ['pat', "Pathfinder"],
    // ['star', "Starfinder"],
    // ['cyb', "Cyberpunk"],
    ['sev', "7th Sea Second Edition"],
    ['fate', "FATE Core"],
    ['gen', "Genesys"],
    ['sw', "Star Wars RPG"],
    ['sav', "Savage Worlds"]
]);

export default function Book(props: BookProps) {
    const [gameType, setGameType] = useState<string>(props.gameType);
    const [createCampaignName, setCreateCampaignName] = useState<string>(null);
    let bookClass = "btn-book btn-";
    switch (gameType) {
        case 'vampire':
        case 'vtm':
            bookClass += 'chronicle';
            break;
        case 'dnd':
            bookClass += 'campaign';
            break;
        case 'sev':
            bookClass += 'adventure';
            break;
        case 'fate':
            bookClass += 'fate';
            break;
        case 'sav':
            bookClass += 'savage';
            break;
        case 'gen':
            bookClass += 'genesys';
            break;
        case 'sw':
            bookClass += 'starwars';
            break;
        case 'sr':
            bookClass += 'shadowrun';
            break;
    }
    if (props.opened) {
        bookClass += ' opened';
    }
    if (props.hover) {
        bookClass += ' hover';
    }
    return (
        <div className="btn-book__wrapper">
            <div className={bookClass} onClick={props.onClick}>
                <div className="book-page">
                    {props.id ?
                        <div>
                            <div className={'players__wrapper'}>
                                {props.players.length === 0 ? "No Players Yet!" :
                                    props.players.map((player) =>
                                        <div>{player.id} as {player.name}</div>)
                                }
                            </div>
                            <div className={"btn btn-user" + (props.opened ? '' : ' hidden')}
                                 onClick={props.onCharacterClick}>
                                Play as:<br/>
                                <span>{props.characterName}</span>
                            </div>
                            <div className={'game-details'}>
                                <div>Sessions: {props.sessions}</div>
                                <div>Last Played: {props.sessions === 0 ? "N/A" :
                                    DateUtil.FORMAT_DATE(props.lastPlayed, false)}</div>
                            </div>
                        </div> :
                        <div id={'new-game__wrapper'} className={(props.opened ? '' : ' hidden')}>
                            <div className={"select__wrapper"}>
                                <select onClick={(e)=> e.stopPropagation()} onChange={(e) => setGameType(e.target.value)}>
                                    {Array.from(GAMETYPES.keys()).map((value) => <option value={value}>{GAMETYPES.get(value)}</option>)}
                                </select>
                            </div>
                            <textarea onClick={(e) => e.stopPropagation()}
                                      placeholder={"Campaign Name"}
                                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                          setCreateCampaignName(e.target.value)}></textarea>
                            <div className={"btn"}
                                 onClick={(e) => {
                                     e.stopPropagation();
                                     props.newBookClick(gameType, createCampaignName)
                                 }}>Create</div>
                        </div>
                    }
                </div>
                <div className="book-cover__wrapper">
                    <div className="book-cover">
                    </div>
                    <div className="book-cover-overlay">
                        <div>{props.name}</div>
                    </div>
                    <div className="book-cover-back"></div>
                </div>
            </div>
        </div>
    );
}