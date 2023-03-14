import * as React from "react";
import {useEffect, useState} from "react";
import '../../stylesheet/dndCharacter.css';
import {CharacterContentView} from "../../data/enum/CharacterContentView";
import DndConst from "../../data/DndConst";
import {getBaseURL} from "../../js/common";

export type DndCharacterContentProps = {
    hidden:                 boolean
    id:                     string
    handleRollAliasUpdate:  Function
    rollAliasActive:        boolean
    editMode:               boolean
}
export default function DndCharacterContent(props: DndCharacterContentProps) {
    const [view, setView] = useState<CharacterContentView[]>([CharacterContentView.SHEET]);
    const [characterContent, setCharacterContent] = useState<DndCharacterInterface>(null)
    const [editMode, setEditMode] = useState<boolean>(props.editMode);
    const [statsObj, setStatsObj] = useState(JSON.parse(JSON.stringify(characterContent ?
        characterContent.sheet.stats :
        DndConst.NEW_CHARACTER.sheet.stats)));

    const determineStatMod = (statValue: number, modifier: number = 0) => {
        let modValue = (Math.floor(statValue/2) - 5) + modifier;
        return (modValue > 0 ? '+' : '') + modValue;
    }
    const determineProficiencyBonus = (levelValue: number) => {
        let modValue = Math.floor((levelValue-1)/4) +2
        return (modValue > 0 ? '+' : '') + modValue;
    }

    const statBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        let updatedStatsObj = JSON.parse(JSON.stringify(statsObj));
        console.log(e.currentTarget);
        updatedStatsObj[e.currentTarget.parentElement.querySelector('.stat-title').innerHTML] =
            e.currentTarget.innerHTML;
        setStatsObj(updatedStatsObj);
    }

    const getCharacterContent = () => {
        if (props.id) {
            fetch(getBaseURL() + 'character/' + props.id)
                .then(response => response.json())
                .then(result => {
                    setCharacterContent(result);
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
        <div id={'character__wrapper'} className={(props.hidden ? ' hidden' : '')}>
            <div id={'character-main-details'}>
                <div className={'flex'}>
                    <div>
                        <div id='character-name' contentEditable={props.editMode}>
                            {characterContent && characterContent.name ? characterContent.name : 'Name'}
                        </div>
                        <div id='character-level' contentEditable={props.editMode}>
                            {characterContent ? characterContent.level : 'Level'}
                        </div>
                        <div id='character-race' contentEditable={props.editMode}>
                            {characterContent && characterContent.bio && characterContent.bio.race ? characterContent.bio.race : 'Race'}
                        </div>
                    </div>
                    <div>
                        {characterContent ? characterContent.bio.class.map((classObj) =>
                            <div id='character-class' contentEditable={props.editMode}>
                                <div>{classObj.name}</div>
                                <div>{classObj.level}</div>
                                <div>{classObj.subclass}</div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
            <div className={'flex'}>
                <div id={'left-pane'}>
                    <div id='stats__wrapper' className={'flex'}>
                        {DndConst.STATS.map((stat) => <div className={'stat__wrapper'}>
                                <div className={'stat-title'}>{stat}</div>
                                <div className={'stat-value'}
                                     contentEditable={props.editMode}
                                     onBlur={statBlur}>{statsObj[stat]}</div>
                                <div className={'stat-modifier'}>
                                    <div>{determineStatMod(statsObj[stat])}</div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={'flex'}>
                        <div id={'left-sub-left-pane'}>
                            <div id={'skills__wrapper'} className={'table'}>
                                <div className={'skills-header row'}>
                                    <div>Prof</div>
                                    <div>Mod</div>
                                    <div>Skill</div>
                                    <div>Bonus</div>
                                </div>
                                {DndConst.SKILLS.map((skill) =>
                                    <div className={'skill__wrapper row'}>
                                        <div className={'skill-proficiency'}></div>
                                        <div className={'skill-mod'}>
                                            {skill.mod.substring(0, 3)}
                                        </div>
                                        <div className={'skill-name'}>
                                            {skill.name}
                                        </div>
                                        <div className={'skill-bonus'}>{determineStatMod(statsObj[skill.mod])}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div id={'left-sub-right-pane'} className={'flex'}>
                            <div id={'saving-throws__wrapper'}>
                                <div className={'saving-throw-header'}>Saving Throws</div>
                                <div className={'flex'}>
                                    {DndConst.STATS.map((stat) =>
                                        <div className={'saving-throw__wrapper'}>
                                            <div className={'flex'}>
                                                <div className={'saving-throw-name'}>
                                                    {stat.substring(0, 3)}
                                                </div>
                                                <div className={'saving-throw-mod'}>
                                                    {determineStatMod(statsObj[stat])}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div id={'equipment__wrapper'}>

                            </div>
                        </div>
                    </div>
                </div>
                <div id={'right-pane'} className={'flex'}>
                    <div id={'right-pane-top'} className={'flex'}>
                        <div id={'initiative__wrapper'}>
                            Initiative
                            <div id={'initiative'}>
                                {determineStatMod(statsObj['dexterity'])}
                            </div>
                        </div>
                        <div id={'proficiency-bonus__wrapper'}>
                            Proficiency
                            <div id={'proficiency-bonus'}>
                                {characterContent ? determineProficiencyBonus(characterContent.level) : 0}
                            </div>
                            Bonus
                        </div>
                        <div id={'armor-class__wrapper'}>
                            Armor
                            <div id={'armor-class'}>
                                {determineStatMod(statsObj['dexterity'], 10)}
                            </div>
                            Class
                        </div>
                        <div id={'speed__wrapper'}>
                            Speed
                            <div id={'speed'}></div>
                        </div>
                        <div id={'hit-dice__wrapper'}>
                            Hit
                            <div id={'hit-dice'}></div>
                            Dice
                        </div>
                        <div id={'hit-points__wrapper'} className={'double-width'}>
                            Hit Points
                            <div id={'hit-points'}></div>
                        </div>
                    </div>
                    <div id='explorer'>
                        <div id='explorer-menu' className='flex'>
                            <div className={'btn'}>Actions</div>
                            <div className={'btn'}>Spells</div>
                            <div className={'btn'}>Features & Traits</div>
                            <div className={'btn'}>Description</div>
                        </div>
                    </div>
                </div>
            </div>
            {props.editMode ?
                <div id={'save-character'} className={'btn'}>Save</div>
                : null}
        </div>
    );
}