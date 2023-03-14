import * as React from "react";
import {useState} from "react";
import SidebarView from "../../data/enum/SidebarView";
import Reference from "./Reference";
import GameType from "../../data/enum/GameType";
import Notes from "./Notes";
import Character from "../vampire/character/Character";
import SoundType from "../../data/enum/SoundType";
import Location from "./Location";
import {NoteContentType} from "../../data/enum/NoteContentType";
import VampireDiceRoll from "../vampire/dice/VampireDiceRoll";
import DndDiceRoll from "../dnd/dice/DndDiceRoll";
import VampireConst from "../../data/VampireConst";
import DndConst from "../../data/DndConst";
import Settings from "./Settings";
import {ClientData} from "../../data/ClientData";
import MainContentView from "../../data/enum/MainContentView";

type SidebarProps = {
    active:                 boolean
    defaultActive:          boolean
    gameType:               GameType
    view:                   SidebarView
    campaignId:             string
    admin:                  boolean
    rollType:               string
    rollName:               string
    onDiceRollChange:       Function
    onDiceValueUpdate:      Function
    viewUpdate:             Function
    dice: {
        vampire: {
            pool:                   number
            hunger:                 number
        }
        dnd:                    Map<number, DndDieData>
    }
    showSeenRolls:          boolean
    rollAlias:              string
    handleRollAliasUpdate:  Function
    characters:             CharacterInterface[]
    notes:                  NotesInterface[]
    noteId:                 string
    locationId:             string
    handleLocationIdUpdate: Function
    handleNoteIdUpdate:     Function
    sessions:               NotesInterface[]
    playSoundHandler:       Function
    handleNotesUpdate:      Function
    addCharacterHandler:    React.MouseEventHandler
    stompClient:            ClientData
}

type SidebarBtnType = {
    id:         string
    view:       SidebarView
    mainView:   MainContentView
    admin:      boolean
    tooltip:    string
}

export default function Sidebar(props: SidebarProps) {
    const [tooltip, setToolTip] = useState<TooltipData>(null);
    const [rollSeenIndex, setRollSeenIndex] = useState(0);
    const [rollCount, setRollCount] = useState(0);

    let diceComponent = <></>;
    let headerType = "";
    let sidebarButtons: SidebarBtnType[] = [];

    const updateTooltip = (e: React.MouseEvent<HTMLDivElement>, text: string) => {
        setToolTip({
            xPos: e.clientX + 15,
            yPos: e.clientY + 15,
            text: text
        })
    }

    const setRollCountData = (rollCountData: number) => {
        setRollCount(rollCountData);
    }
    const setRollSeenData = (seenIndex: number) => {
        setRollSeenIndex(seenIndex);
    }

    switch (props.gameType) {
        case GameType.DND:
            diceComponent = <DndDiceRoll
                hidden={props.view !== SidebarView.ROLL}
                onRollTypeChange={(rollType: string, rollName: string) =>
                    props.onDiceRollChange(rollType, rollName)}
                onDiceValueUpdate={(dndDice: Map<number, DndDieData>) =>
                    props.onDiceValueUpdate(dndDice)}
                campaignId={props.campaignId}
                playSoundHandler={() => props.playSoundHandler(SoundType.DICE)}
                showSeenRolls={props.showSeenRolls}
                rollAlias={props.rollAlias}
                dice={props.dice.dnd}
                handleRollAliasUpdate={(alias: string, aliasId: string) =>
                    props.handleRollAliasUpdate(alias, aliasId)}
                stompClient={props.stompClient}
                setRollCountData={setRollCountData}
                setRollSeenData={setRollSeenData}
            />;
            headerType = "Campaign";
            sidebarButtons = DndConst.SIDEBAR_BTNS;
            break;
        case GameType.VAMPIRE:
            diceComponent = <VampireDiceRoll
                hidden={props.view !== SidebarView.ROLL}
                onRollTypeChange={(rollType: string, rollName: string) =>
                    props.onDiceRollChange(rollType, rollName)}
                onDiceValueUpdate={(total: number, hunger: number) =>
                    props.onDiceValueUpdate(total, hunger)}
                dice={props.dice.vampire}
                campaignId={props.campaignId}
                playSoundHandler={() => props.playSoundHandler(SoundType.DICE)}
                showSeenRolls={props.showSeenRolls}
                rollAlias={props.rollAlias}
                handleRollAliasUpdate={(alias: string, aliasId: string) =>
                    props.handleRollAliasUpdate(alias, aliasId)}
                rollType={props.rollType}
                rollName={props.rollName}
                stompClient={props.stompClient}
                setRollCountData={setRollCountData}
                setRollSeenData={setRollSeenData}
            />;
            headerType = "Chronicle";
            sidebarButtons = VampireConst.SIDEBAR_BTNS;
            break;
    }

    let sidebarContent;
    switch(props.view) {
        case SidebarView.REFERENCE:
            sidebarContent = <Reference
                hidden={props.view !== SidebarView.REFERENCE}
                gameType={props.gameType}
            />
            break;
        case SidebarView.NOTES:
            sidebarContent = <Notes
                campaignId={props.campaignId}
                admin={props.admin}
                hidden={props.view !== SidebarView.NOTES}
                notes={props.notes}
                noteId={props.noteId}
                sessions={props.sessions}
                handleNoteIdUpdate={(noteId: string, sessionIndex: number, type: NoteContentType) =>
                    props.handleNoteIdUpdate(noteId, sessionIndex, type)}
                handleNotesUpdate={(notes: NotesInterface[], sessions: NotesInterface[]) =>
                    props.handleNotesUpdate(notes, sessions)}
            />
            break;
        case SidebarView.CHARACTERS:
            sidebarContent = <Character
                admin={props.admin}
                hidden={props.view !== SidebarView.CHARACTERS}
                characters={props.characters}
                addCharacterHandler={props.addCharacterHandler}
            />
            break;
        case SidebarView.LOCATIONS:
            sidebarContent = <Location
                admin={props.admin}
                campaignId={props.campaignId}
                locationId={props.locationId}
                handleLocationClick={props.handleLocationIdUpdate}
            />
            break;
        case SidebarView.SETTINGS:
            sidebarContent = <Settings admin={props.admin} campaignId={props.campaignId}/>
    }
    return(
            <>
                <div id="sidebar" className={props.active ? 'active' : ''}>
                    {sidebarButtons.map((btn, index) => {
                        let isActive = (props.active || props.defaultActive) &&
                            props.view === btn.view;
                        let showRollBadge = !isActive && btn.view === SidebarView.ROLL;
                        let rollBadgeNum = 0;
                        if (rollCount > 0) {
                            rollBadgeNum = rollCount - rollSeenIndex;
                        }
                        if (props.gameType == GameType.DND && btn.id === 'btn-relationship_map') {
                            return null;
                        }
                        return (!btn.admin || props.admin) ?
                            <div key={index} id={btn.id}
                                    className={"btn" + (isActive ? ' active' : '') +
                                        (showRollBadge && rollBadgeNum > 0 ? ' badge' : '')}
                                    data-badge={showRollBadge ? rollBadgeNum : null}
                                    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) =>
                                        updateTooltip(e, btn.tooltip)}
                                    onMouseMove={(e: React.MouseEvent<HTMLDivElement>) =>
                                        updateTooltip(e, btn.tooltip)}
                                    onMouseLeave={() => setToolTip(null)}
                                    onClick={() => {
                                        props.playSoundHandler(isActive ? SoundType.SIDEBAR_CLOSE :
                                            SoundType.SIDEBAR_OPEN)
                                        props.viewUpdate(btn.view, btn.mainView,
                                            isActive ? false : btn.view !== SidebarView.NULL);
                                    }}
                            ></div>
                            : null
                    })}
                </div>
                <div id="sidebar-content" className={props.active ? 'active' : ''}>
                    <div id="title__wrapper">
                        <span className="header">
                            {headerType}<br/>
                            Companion
                        </span>
                        <div id="version__wrapper">
                            <span className="sub-text" >v0.3</span>
                        </div>
                    </div>
                    {diceComponent}
                    {sidebarContent}
                </div>
                {tooltip ? <div style={{left: tooltip.xPos, top: tooltip.yPos}} className={'tooltip'}>{tooltip.text}</div> : null}
            </>
        );
}