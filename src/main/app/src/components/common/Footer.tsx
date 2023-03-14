import * as React from "react";
import GameType from "../../data/enum/GameType";
import VampireFooter from "../vampire/VampireFooter";
import DndFooter from "../dnd/DndFooter";

type FooterProps = {
    gameType: GameType
}

export default function Footer(props: FooterProps) {
    switch (props.gameType) {
        case GameType.VAMPIRE:
            return <VampireFooter/>
        case GameType.DND:
            return <DndFooter/>
        case GameType.GEN:
    }
}