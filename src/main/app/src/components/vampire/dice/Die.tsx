import * as React from "react";
import {Component} from "react";
import {DieType} from "../../../data/enum/DieType";

type DieProps = {
    type: DieType
    value: number
}
export default class Die extends Component<DieProps, any> {
    render() {
        let dieClass;
        if (this.props.type === DieType.HUNGER && this.props.value === 1) {
            dieClass = 'icon_bestial-failure';
        } else if (this.props.value < 6 ) {
            dieClass = 'icon_failure';
        } else if (this.props.value === 10) {
            if (this.props.type === DieType.HUNGER) {
                dieClass = 'icon_critical_success_hunger';
            } else {
                dieClass = 'icon_critical_success';
            }
        } else {
            dieClass = 'icon_success';
        }
        return (
            <div className={'die' + (this.props.type === DieType.HUNGER ? ' hunger' : '')}>
                <span className={dieClass}></span>
            </div>
        );
    }
}