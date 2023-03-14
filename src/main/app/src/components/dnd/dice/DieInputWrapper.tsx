import * as React from "react";

type DieInputWrapperProps = {
    campaignId:     string
    dice:           Map<number, DndDieData>
    dieValueUpdate: React.FormEventHandler<HTMLDivElement>
    handleDiceRoll: React.MouseEventHandler<HTMLDivElement>
}

export default function DieInputWrapper(props: DieInputWrapperProps) {
    return (
        <div className={'die-input__wrapper flex'}>
            {Array.from(props.dice.keys()).map((key) => {
                return <div className={"die-data__wrapper"}>
                    <input type={'number'} name={'value'} disabled={true} value={props.dice.get(key).value}/>
                    {props.dice.get(key).modifier != 0 ?
                        <input type={'text'} name={'modifier'} disabled={true}
                               value={(props.dice.get(key).modifier > 0 ? '+' : '') + props.dice.get(key).modifier}
                               className={(props.dice.get(key).modifier > 0 ? 'positive' : 'negative')}/> :
                        null}
                    <div className={"die-type__wrapper"}>
                        <label>D</label><input type={'number'} name={'type'} disabled={true} value={key}/>
                    </div>
                </div>
            })}
            <div id={'btn_roll-dice'} className={'btn'}
                 onClick={props.handleDiceRoll}></div>
        </div>
    )
}