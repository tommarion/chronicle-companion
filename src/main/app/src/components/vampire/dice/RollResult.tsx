import Die from "./Die";
import * as React from "react";
import {Component} from "react";
import {DieType} from '../../../data/enum/DieType'
import DateUtil from "../../../util/DateUtil";

type RollResultProps = {
    value: RollValue
}
export default class RollResult extends Component<RollResultProps, any>{
    render() {
        let rollOutcome;
        if (this.props.value.rollFor === "Rouse") {
            if (this.props.value.roll.hunger[0] < 6) {
                rollOutcome = "Gained Hunger";
            } else {
                rollOutcome = "Hunger Remains"
            }
        } else {
            let successes = 0;
            let critFails = 0;
            let critSuccessHunger = 0;
            let critSuccess = 0;
            for (let index in this.props.value.roll.hunger) {
                if (this.props.value.roll.hunger[index] === 1) {
                    critFails++;
                } else if (this.props.value.roll.hunger[index] === 10) {
                    critSuccessHunger++;
                } else if (this.props.value.roll.hunger[index] >= 6) {
                    successes++;
                }
            }
            for (let index in this.props.value.roll.regular) {
                if (this.props.value.roll.regular[index] === 10) {
                    critSuccess++;
                } else if (this.props.value.roll.regular[index] >= 6) {
                    successes++;
                }
            }
            let messyCrit = false;
            if (critSuccessHunger > 1) {
                messyCrit = true;
            }
            let crit = (critSuccessHunger + critSuccess) > 1 && !messyCrit;
            successes += Math.floor((critSuccessHunger + critSuccess) / 2) * 4;
            successes += (critSuccessHunger + critSuccess) % 2;
            if (successes === 0 && critFails > 0) {
                rollOutcome = 'Bestial Failure!';
            } else {
                rollOutcome = successes + ' success';
                if (successes !== 1) {
                    rollOutcome += 'es';
                }
                if (crit) {
                    rollOutcome += ' - CRIT!';
                } else if (messyCrit) {
                    rollOutcome += ' - MESSY CRIT!';
                }
            }
        }
        return(
            <div className={'dice-roll'}>
                <span>{this.props.value.alias ?
                    this.props.value.alias : this.props.value.player}</span>
                <br/>
                <div className={"roll_for"}>{this.props.value.rollFor}</div>
                <span>{DateUtil.formatDate(this.props.value.timestamp, true)}</span>
                <div className={"dice-result flex"}>
                    {this.props.value.roll.regular.map(die =>
                        <Die
                            type={DieType.REGULAR}
                            value={die}
                        />
                    )}
                    {this.props.value.roll.hunger.map(die =>
                        <Die
                            type={DieType.HUNGER}
                            value={die}
                        />
                    )}
                </div>
                <div className={'dice-result__tooltip'}>
                    {rollOutcome}
                </div>
            </div>
        );
    }
}