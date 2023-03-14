import * as React from 'react';
import Util from "../../../util/Util";

export type CharacterBioProps = {
    bioText:    string
    data:       CharacterBio
    advantages: AdvantageFlawInterface[]
    flaws:      AdvantageFlawInterface[]
}
export default function CharacterBio(props: CharacterBioProps) {
    function getAdvantageFlaw(name: string, type: string, level: number) {
        return <li className={'flex'}>
            {name}
            <div className={'ad-flaw_details__wrapper'}>
                <div className={"level level" + (level)}></div>
                <span className={'subheader'}>{type}</span>
            </div>
        </li>
    }
    return (
        <div>
            <div id={'bio-text'}>
                <div className={"character_data"}>
                    {Object.entries(props.data).map(([key, value], index) => {
                        return value ? <div key={index}>
                            <div className={'right'}>{Util.CAMEL_TO_TEXT(key)}</div><div>{value}</div>
                        </div> : null;
                    })}
                </div>
                {props.bioText}
                {props.advantages || props.flaws ?
                <div id={'advantage-flaw__wrapper'} className={'flex'}>
                    {props.advantages && props.advantages.length > 0 ?
                    <div id={'advantages__wrapper'}>
                        <div className={'title'}>Advantages</div>
                        <ul>
                        {props.advantages.map((advantage) => {
                            return getAdvantageFlaw(advantage.name, advantage.type, advantage.level);
                        })}
                        </ul>
                    </div> : null}

                    {props.flaws && props.flaws.length > 0 ?
                    <div id={'flaws__wrapper'}>
                        <div className={'title'}>Flaws</div>
                        <ul>
                        {props.flaws.map((flaw) => {
                            return getAdvantageFlaw(flaw.name, flaw.type, flaw.level);
                        })}
                        </ul>
                    </div> : null}
                </div> : null}
            </div>
        </div>
    )
}