import * as React from "react";
import {useRef} from "react";
import '../../stylesheet/mainContent.css'
import NotesContent from "./NotesContent";
import MainContentView from "../../data/enum/MainContentView";
import {NoteContentType} from "../../data/enum/NoteContentType";
import SessionContent from "./SessionContent";
import {CharacterSheetPDF} from "../vampire/character/CharacterSheetPDF";
import GameType from "../../data/enum/GameType";
import {DndCharacterSheetPDF} from "../dnd/DndCharacterSheetPDF";
import ReactToPrint from "react-to-print";
import RealWorldLocation from "../leaflet/RealWorldLocation";
import FantasyLocation from "../leaflet/FantasyLocation";

type MainContentProps = {
    admin:                  boolean
    gameType:               GameType
    sidebar:                boolean
    rollType:               string
    diceValueHandler:       Function
    campaignId:             string
    characterId:            string
    noteId:                 string
    sessionIndex:           number
    noteType:               NoteContentType
    locationId:             string
    view:                   MainContentView
    handleRollTypeClick:    Function
    handleRollAliasUpdate:  Function
    rollAliasActive:        boolean
    characterEditMode:      boolean
    handleCharacterSheet:   Function
}

export default function MainContent(props: MainContentProps) {
    const componentRef = useRef();

    let characterContent, locationContent;

    switch (props.gameType) {
        case GameType.VAMPIRE:
            characterContent = <CharacterSheetPDF
                ref={componentRef}
                hidden={props.view !== MainContentView.CHARACTERS}
                id={props.characterId}
                rollClickFunction={props.handleRollTypeClick}
                handleRollAliasUpdate={props.handleRollAliasUpdate}
                rollAliasActive={props.rollAliasActive}
                editMode={props.characterEditMode}
                handleCharacterSheet={props.handleCharacterSheet}
            />;
            locationContent = <RealWorldLocation
                locationId={props.locationId}
            />;
            break;
        case GameType.DND:
            characterContent = <DndCharacterSheetPDF
                ref={componentRef}
                hidden={props.view !== MainContentView.CHARACTERS}
                id={props.characterId}
                handleRollAliasUpdate={(alias: string, aliasId: string) =>
                    props.handleRollAliasUpdate(alias, aliasId)}
                rollAliasActive={props.rollAliasActive}
                editMode={props.characterEditMode}
            />;
            locationContent = <FantasyLocation

            />
            break;
    }
    let mainContent;
    switch (props.view) {
        case MainContentView.NOTES:
            if (props.noteType === NoteContentType.SESSION) {
                mainContent = <SessionContent
                    id={props.noteId}
                    admin={props.admin}
                    campaignId={props.campaignId}
                    sessionIndex={props.sessionIndex} />
            } else {
                mainContent = <NotesContent
                    campaignId={props.campaignId}
                    id={props.noteId} />
            }
            break;
        case MainContentView.CHARACTERS:
            mainContent =
                <div>
                {characterContent}
            <ReactToPrint
                trigger={() =>
                    <button className={"btn__pdf-export" +
                        (props.view !== MainContentView.CHARACTERS ? ' hidden' : '')}>Export to PDF</button>}
                content={() => componentRef.current} />
                </div>;
            break;
        case MainContentView.LOCATIONS:
            mainContent = locationContent;
            break;
    }

    return (
        <div id="reference__wrapper">
            <div id="story__wrapper" className={props.sidebar ? 'sidebar' : ''}>
                <div id="story-content">
                    {mainContent}
                </div>
            </div>
        </div>
    )
}