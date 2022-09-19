import * as React from "react";
import {Component} from "react";
import DateUtil from "../../util/DateUtil";

type NotesProps = {
    admin: boolean
    hidden: boolean
    notes: NotesInterface[]
    sessions: NotesInterface[]
}
export default class Notes extends Component<NotesProps, any> {
    render() {
        return(
            <div id={"notes__wrapper"} className={this.props.hidden ? 'hidden' : ''}>
                <div id={"notes-btns__wrapper"}>
                    <div id={"general__wrapper"}>
                        <div className={"header"}>General Notes</div>
                        <div id={"general_notes__wrapper"}>
                            {this.props.notes === null ?
                                <div>No Notes Yet!</div> :
                                this.props.notes.map((note, index) =>
                                    <div key={index} className={"btn btn-note"}>
                                        <div>{note.name}</div>
                                        <div>{DateUtil.formatDate(note.date, false)}</div>
                                    </div>
                                )
                            }
                        </div>
                        <div id={'add_general__wrapper'}>
                            <div id={'add_general'} className={'btn'}>Add Note</div>
                        </div>
                    </div>

                    <div id={"sessions__wrapper"}>
                        <div className={"header"}>Session Notes</div>
                        <div id={'session_notes__wrapper'}>
                            {this.props.sessions === null ?
                                <div>No Sessions Yet!</div> :
                                this.props.sessions.map((note, index) =>
                                    <div key={index} className={"btn btn-note"}>
                                        <div>{note.name ? note.name : 'Session ' + (this.props.sessions.length - index)}</div>
                                        <div>{DateUtil.formatDate(note.date, false)}</div>
                                    </div>
                                )
                            }
                        </div>
                        {this.props.admin ?
                            <div id={'start_session__wrapper'}>
                                <div id={'start_session'} className={'btn'}>Start Session</div>
                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}