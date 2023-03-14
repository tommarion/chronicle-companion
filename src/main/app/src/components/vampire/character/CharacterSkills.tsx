import * as React from "react";
import VampireConst from "../../../data/VampireConst";
import Util from "../../../util/Util";

type CharacterSkillsProps = {
    skills: Object
}

export default function CharacterSkills(props: CharacterSkillsProps) {
    let entries = new Map(Object.entries(props.skills));
    console.log(entries);
    return (
        <div id={"skills__wrapper"} className={'flex'}>
            {VampireConst.SKILLS.map((skill, index) => {
                return (
                    <div key={index} className={'skill__wrapper'}>
                        <div className={'subheader'}>{skill}</div>
                        {entries.get(skill + 'Specialty') ?
                            <div className={'subheader'}>
                                ({entries.get(skill + 'Specialty')})
                            </div> : null}
                        <div className={"level level" + (entries.get(Util.TEXT_TO_CAMEL(skill)))}></div>
                    </div>
                )
            })}
        </div>
    );
}