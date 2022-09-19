import * as React from "react";
import {Component} from "react";
import {getBaseURL} from "../../js/common";
import '../../stylesheet/character.css';

type CharacterContentProps = {
    hidden: boolean
    id: string
}
type CharacterContentState = {
    characterData: CharacterSheetInterface
    triedFetching: boolean
}
export default class CharacterContent extends Component<CharacterContentProps, CharacterContentState> {
    constructor(props: CharacterContentProps) {
        super(props);
        this.state = {
            characterData: null,
            triedFetching: false
        }
    }
    render() {
        if (this.props.id &&
                (!this.state.characterData || this.state.characterData.id !== this.props.id)) {
            this.fetchCharacter();
        }
        let clan = this.state.characterData ?
            this.state.characterData.bio.clan ? this.state.characterData.bio.clan : this.state.characterData.bio.being :
            '';
        return (
            this.state.characterData ?
                <div id={"character__wrapper"} className={clan + (this.props.hidden ? ' hidden' : '')}>
                    <div id={'character-sheet__wrapper'}>
                        <div id={"character-bio"}>
                            <div className={"header characterName"}>{this.state.characterData.name}</div>
                            <div id={"clan"} className={"img"}/>
                            <div className={"btn btn_roll_as"}>Roll As</div>
                        </div>
                    </div>
                </div> :
                null
        );
    }

    fetchCharacterWithFetchAPI = () => {
        if (this.props.id && !this.state.triedFetching) {
            fetch(getBaseURL() + "character/" + this.props.id)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    this.setState({
                        ...this.state,
                        characterData: result
                    });
                })
                .catch(e => {
                    this.setState({
                        ...this.state,
                        triedFetching: true
                    });
                    console.error(e);
                });
        }
    };

    fetchCharacter = this.fetchCharacterWithFetchAPI;
}