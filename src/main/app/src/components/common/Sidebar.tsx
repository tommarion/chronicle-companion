import * as React from "react";
import {Component} from "react";
import DiceRoll from "./DiceRoll";
import SidebarView from "../../data/enum/SidebarView";
import Reference from "./Reference";
import GameType from "../../data/enum/GameType";
import VampireConst from "../../data/VampireConst";
import Notes from "./Notes";
import Character from "../vampire/Character";
import SoundType from "../../data/enum/SoundType";
import Location from "../vampire/Location";

type SidebarProps = {
    active: boolean
    defaultActive: boolean
    gameType: GameType
    view: SidebarView
    campaignId: string
    admin: boolean
    onDiceRollChange: Function
    onDiceValueUpdate: Function
    viewUpdate: Function
    dice: {
        pool: number
        hunger: number
    }
    rolls: RollValue[]
    rollSeenIndex: number
    showSeenRolls: boolean
    rollAlias: string
    handleRollAliasUpdate: Function
    characters: CharacterInterface[]
    notes: NotesInterface[]
    sessions: NotesInterface[]
}

class Sidebar extends Component<SidebarProps, {}> {
    render() {
        let sidebarButtons = VampireConst.SIDEBAR_BTNS;

        return(
            <>
                <div id="sidebar" className={this.props.active ? 'active' : ''}>
                    {sidebarButtons.map((btn, index) => {
                        let isActive = (this.props.active || this.props.defaultActive) &&
                            this.props.view === btn.view;
                        let showRollBadge = !isActive && btn.view === SidebarView.ROLL;
                        let rollBadgeNum = this.props.rolls.length - this.props.rollSeenIndex;
                        return (!btn.admin || this.props.admin) ?
                            <div key={index} id={btn.id}
                                    className={"btn" + (isActive ? ' active' : '') +
                                        (showRollBadge && rollBadgeNum > 0 ? ' badge' : '')}
                                    data-badge={showRollBadge ? rollBadgeNum : null}
                                    onClick={() => this.props.viewUpdate(btn.view, btn.mainView,
                                            isActive ? false : btn.view !== SidebarView.NULL)}
                            ></div>
                            : null
                    })}
                </div>
                <div id="sidebar-content" className={this.props.active ? 'active' : ''}>
                    <DiceRoll
                        hidden={this.props.view !== SidebarView.ROLL}
                        onRollTypeChange={(rollType: string) => this.props.onDiceRollChange(rollType)}
                        onDiceValueUpdate={(total: number, hunger: number) =>
                            this.props.onDiceValueUpdate(total, hunger)}
                        dice={this.props.dice}
                        campaignId={this.props.campaignId}
                        rolls={this.props.rolls}
                        rollSeenIndex={this.props.rollSeenIndex}
                        showSeenRolls={this.props.showSeenRolls}
                        rollAlias={this.props.rollAlias}
                        handleRollAliasUpdate={(alias: string) => this.props.handleRollAliasUpdate(alias)}
                    />
                    <Reference
                        hidden={this.props.view !== SidebarView.REFERENCE}
                        gameType={this.props.gameType}
                    />
                    <Notes
                        admin={this.props.admin}
                        hidden={this.props.view !== SidebarView.NOTES}
                        notes={this.props.notes}
                        sessions={this.props.sessions}
                    />
                    <Character
                        admin={this.props.admin}
                        hidden={this.props.view !== SidebarView.CHARACTERS}
                        characters={this.props.characters}
                    />
                    <Location
                        admin={this.props.admin}
                        hidden={this.props.view !== SidebarView.LOCATIONS}
                    />
                </div>
            </>
        );
    }
}

export default Sidebar