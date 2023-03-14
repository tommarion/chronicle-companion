import * as React from "react";

type CharacterProps = {
    admin:                  boolean
    hidden:                 boolean
    characters:             CharacterInterface[]
    addCharacterHandler:    React.MouseEventHandler
}

export default function Character(props: CharacterProps) {
        return (
            <div id={'character-sheets__wrapper'} className={props.hidden ? 'hidden' : ''}>
                <div id={'npc__btns'}>
                    <div id={'npc__btns__wrapper'}>
                        {props.admin ?
                            <div id={'add-character'} className={'btn'}
                                 onClick={props.addCharacterHandler}>+</div> :
                            null
                        }
                        <div className="title">NPCs</div>
                        {props.characters ?
                            props.characters.map((character, index) =>
                                <div key={index} className={'btn btn-character'}>
                                    <div className={'name'}>{character.name}</div>
                                </div>
                            ) :
                            <div className={'center'}>No Characters Yet!</div>
                        }
                    </div>
                </div>
            </div>
        );
}

// export default class Character extends Component<CharacterProps, {}>{
//     render() {
//         return (
//             <div id={'character-sheets__wrapper'} className={this.props.hidden ? 'hidden' : ''}>
//                 <div id={'npc__btns'}>
//                     <div className={"header"}>NPCs</div>
//                     <div id={'npc__btns__wrapper'}>
//                         {this.props.characters ?
//                             this.props.characters.map((character, index) =>
//                                 <div key={index} className={'btn btn-character'}>
//                                     <div className={'name'}>{character.name}</div>
//                                 </div>
//                             ) :
//                             <div>No Characters Yet!</div>
//                         }
//                     </div>
//                     {this.props.admin ?
//                         <div id={'add-character__wrapper'}>
//                             <div id={'add-character'} className={'btn'}>Add Character</div>
//                         </div> :
//                         null
//                     }
//
//                 </div>
//             </div>
//         );
//     }
// }