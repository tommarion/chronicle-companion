import * as React from "react";
import {Component} from "react";

type CharacterProps = {
    admin: boolean
    hidden: boolean
    characters: CharacterInterface[]
}
export default class Character extends Component<CharacterProps, {}>{
    render() {
        return (
            <div id={'character-sheets__wrapper'} className={this.props.hidden ? 'hidden' : ''}>
                <div id={'npc__btns'}>
                    <div className={"header"}>NPCs</div>
                    <div id={'npc__btns__wrapper'}>
                        {this.props.characters ?
                            this.props.characters.map((character, index) =>
                                <div key={index} className={'btn btn-character'}>
                                    <div className={'name'}>{character.name}</div>
                                </div>
                            ) :
                            <div>No Characters Yet!</div>
                        }
                    </div>
                    {this.props.admin ?
                        <div id={'add-character__wrapper'}>
                            <div id={'add-character'} className={'btn'}>Add Character</div>
                        </div> :
                        null
                    }

                </div>
            </div>
        );
    }
}