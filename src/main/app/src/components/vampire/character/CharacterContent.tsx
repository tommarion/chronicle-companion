import * as React from "react";
import {useEffect, useState} from "react";
import '../../../stylesheet/character.css';
import CharacterBio from "./CharacterBio";
import {CharacterContentView} from "../../../data/enum/CharacterContentView";
import CharacterAttributes from "./CharacterAttributes";
import CharacterLimitedAttributes from "./CharacterLimitedAttributes";
import CharacterSkills from "./CharacterSkills";
import Disciplines from "./Disciplines";
import CharacterTrackers from "./CharacterTrackers";
import {getBaseURL} from "../../../js/common";

export type CharacterContentProps = {
    hidden:                 boolean
    id:                     string
    rollClickFunction:      Function
    handleRollAliasUpdate:  Function
    rollAliasActive:        boolean
    editMode:               boolean
    handleCharacterSheet:   Function
}
export default function CharacterContent(props: CharacterContentProps) {
    const [characterContent, setCharacterContent] = useState<CharacterSheetInterface>(null);
    const [view, setView] = useState<CharacterContentView[]>([CharacterContentView.SHEET]);
    const [editMode, setEditMode] = useState<boolean>(props.editMode);

    let clan = characterContent ? characterContent.bio.clan ?
            characterContent.bio.clan : characterContent.bio.being : '';

    const getCharacterContent = () => {
        if (props.id) {
            fetch(getBaseURL() + 'character/' + props.id)
                .then(response => response.json())
                .then(result => {
                    setCharacterContent(result);
                    props.handleCharacterSheet(result);
                })
                .catch(e => {
                    console.error(e);
                });
        }
    }

    useEffect(() => {
        getCharacterContent();
    }, [props.id]);
    
    return (
        characterContent ?
            <div id={"character__wrapper"} className={clan + (props.hidden ? ' hidden' : '')}>
                <div id={'character-sheet__wrapper'}>
                    <div id={"character-bio"}>

                        <div className={"header characterName"}>{characterContent.name}</div>
                        <div id={"clan"} className={"img"}/>
                        <div className={"btn btn_roll_as" + (props.rollAliasActive ? ' active' : '')}
                             onClick={() => props.handleRollAliasUpdate(characterContent.name, characterContent.id)}>Roll As</div>

                        <div id={'character-sheet_menu__wrapper'}>
                            <div id={'character-sheet_menu'} className={'flex'}>
                                <div className={"btn" + (view.includes(CharacterContentView.BIO) ? ' active' : '')}
                                     onClick={() => {
                                         view.includes(CharacterContentView.BIO) ?
                                             view.length > 1 ?
                                                 setView(view.filter(v => v !== CharacterContentView.BIO)) :
                                                 setView(view) :
                                             setView(view.concat(CharacterContentView.BIO))
                                     }}
                                >Bio</div>
                                <div className={"btn" + (view.includes(CharacterContentView.DISCIPLINES) ? ' active' : '')}
                                     onClick={() => {
                                         view.includes(CharacterContentView.DISCIPLINES) ?
                                             view.length > 1 ?
                                                 setView(view.filter(v => v !== CharacterContentView.DISCIPLINES)) :
                                                 setView(view) :
                                             setView(view.concat(CharacterContentView.DISCIPLINES))
                                     }}
                                >Disciplines</div>
                                <div className={"btn" + (view.includes(CharacterContentView.SHEET) ? ' active' : '')}
                                     onClick={() => {
                                         view.includes(CharacterContentView.SHEET) ?
                                             view.length > 1 ?
                                                 setView(view.filter(v => v !== CharacterContentView.SHEET)) :
                                                 setView(view) :
                                            setView(view.concat(CharacterContentView.SHEET))
                                     }}
                                >Sheet</div>
                            </div>
                        </div>
                        <div id={'character-content__wrapper'}>
                            <div id='character-bio__wrapper'
                                 className={view.includes(CharacterContentView.BIO) ? '' : 'hidden'}>
                                <CharacterBio bioText={characterContent.bioText}
                                              data={characterContent.bio}
                                              advantages={characterContent.sheet.advantages}
                                              flaws={characterContent.sheet.flaws} ></CharacterBio>
                            </div>

                            <div id='disciplines__wrapper'
                                 className={"flex" + (view.includes(CharacterContentView.DISCIPLINES) ? '' : ' hidden')}>
                                {characterContent.disciplines ?
                                    <Disciplines disciplines={characterContent.disciplines}
                                    rollClickFunction={(type : string, name: string) => props.rollClickFunction(type, name)}></Disciplines> : null
                                }
                            </div>

                            <div id={"sheet__wrapper-content"}
                                 className={(view.includes(CharacterContentView.SHEET) ? '' : ' hidden')}>
                                <div id={"sheet__wrapper"}
                                     className={"center grid"}>
                                    {characterContent.sheet.attributes.mentalValue ?
                                        <CharacterLimitedAttributes attributes={characterContent.sheet.attributes}/> :
                                        <CharacterAttributes attributes={characterContent.sheet.attributes}/>}
                                    <CharacterSkills skills={characterContent.sheet.skills}/>
                                    <CharacterTrackers attributes={characterContent.sheet.attributes}
                                                       trackers={characterContent.sheet.trackers} ></CharacterTrackers>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> :
            null
    );
}