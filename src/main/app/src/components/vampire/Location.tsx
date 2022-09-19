import * as React from "react";
import {Component} from "react";

type LocationProps = {
    admin: boolean
    hidden: boolean
}
export default class Location extends Component<LocationProps, {}> {
    render() {
        return (
            <div id={'location__wrapper'} className={this.props.hidden ? 'hidden' : ''}>

            </div>
        );
    }
}