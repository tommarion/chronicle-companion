import * as React from "react";
import VampireConst from "../../../data/VampireConst"
import {useState} from "react";

export type DisciplineProps = {
    disciplines:        DisciplineInterface[]
    rollClickFunction:  Function
}
export default function Disciplines(props: DisciplineProps) {
    const [activePower, setActivePower] = useState<string>(null);

    function getPowerDetails(discipline: string, power : string) {
        let rollData : DisciplinePowerInterface = {
            description: "No info uploaded for this yet!"
        }
        if (VampireConst.DISCIPLINE_POWERS.has(discipline) &&
            VampireConst.DISCIPLINE_POWERS.get(discipline).has(power)) {
                rollData = VampireConst.DISCIPLINE_POWERS.get(discipline).get(power);
        }
        return <div className={"subheader"}>
            <span><b>Description:</b> {rollData.description}</span>
            {rollData.cost ? <><br/><br/><span><b>Cost:</b> {rollData.cost}</span></> : null}
            {rollData.dice_pool ? <><br/><br/><div className={'table'}><div className={'row'}><div><b>Dice Pool:</b></div>
                <div><button onClick={(e) =>
                {e.stopPropagation();props.rollClickFunction(rollData.dice_pool, power)}}>{rollData.dice_pool}</button></div></div>
                    {rollData.resist_pool ? <div className={'row'}><div><b>Resist Pool:</b></div>
                    <div><button onClick={(e) =>
                    {e.stopPropagation(); props.rollClickFunction(rollData.resist_pool, power)}}>{rollData.resist_pool}</button></div></div> : null}
                </div></>
                : <br/>}
            {rollData.system ? <><br/><span><b>System:</b> {rollData.system}</span></> : null}
        </div>;
    }
    return (
        <>
            {props.disciplines.map((discipline) => {
                return <div>
                    <div className={"flex"}>
                        <div className={"title"}>{discipline.discipline}</div>
                        <div className={"level level" + (discipline.level)}></div>
                    </div>
                    <ul>
                        {discipline.powers.map((power) => {
                            return <li className={power == activePower ? 'active' : ''}
                                       onClick={() => setActivePower(power == activePower ? null : power)}>
                                <span>{power}</span>
                                {getPowerDetails(discipline.discipline, power)}
                            </li>;
                        })}
                    </ul>
                </div>;
            })}
        </>
    );
}