import * as React from "react";
import {Component} from "react";

type NotesContentProps = {
    hidden: boolean
}
export default class NotesContent extends Component<NotesContentProps, any> {
    render() {
        return (
            <div id={'story-text__wrapper'} className={this.props.hidden ? 'hidden' : ''}>

            </div>
        );
    }
}