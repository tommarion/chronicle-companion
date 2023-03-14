import * as React from "react";
import DateUtil from "../../util/DateUtil";
import {NoteContentType} from "../../data/enum/NoteContentType";
import {getBaseURL} from "../../js/common";

type NotesProps = {
    campaignId:         string
    admin:              boolean
    hidden:             boolean
    notes:              NotesInterface[]
    noteId:             string
    sessions:           NotesInterface[]
    handleNoteIdUpdate: Function
    handleNotesUpdate:  Function
}

export default function Notes(props: NotesProps) {
    return (
        <div id={"notes__wrapper"} className={props.hidden ? 'hidden' : ''}>
            <div id={"notes-btns__wrapper"}>
                <div id={"general__wrapper"}>
                    <div id={"general_notes__wrapper"}>
                        <div id={'add_general'} className={'btn'}>+</div>
                        <div className={"title"}>General Notes</div>
                        {props.notes === null || props.notes.length === 0 ?
                            <div className={'header'}>No Notes Yet!</div> :
                            props.notes.map((note, index) =>
                                <div key={index} className={"btn btn-note" +
                                    (note.id === props.noteId ? ' active' : '')}
                                     onClick={note.id === props.noteId ? null :
                                         () => props.handleNoteIdUpdate(note.id, null, NoteContentType.GENERAL)}
                                >
                                    <div>{note.name}</div>
                                    <div className={'subheader'}>
                                        {DateUtil.FORMAT_DATE(note.date, false)}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>

                <div id={"sessions__wrapper"}>
                    <div id={'session_notes__wrapper'}>
                        {props.admin ?
                            <div id={'start_session'} className={'btn'}
                                 onClick={() => {
                                     if(window.confirm("Are you sure you would like to start a new session?")) {
                                         fetch(getBaseURL() + "campaign/" + props.campaignId + '/sessions', {
                                             method: 'put',
                                             headers: {'Content-Type': 'application/json'},
                                         })
                                             .then(response => response.json())
                                             .then((result: NotesResponse) => {
                                                 console.log(result);
                                                 props.handleNotesUpdate(result.notes, result.sessions);
                                             })
                                             .catch(e => {
                                                 console.error("Unable to create session...", e);
                                             });
                                     }
                                 }}>+</div>
                            : null
                        }
                        <div className={"title"}>Session Notes</div>
                        {props.sessions === null || props.sessions.length == 0 ?
                            <div className={'header'}>No Sessions Yet!</div> :
                            props.sessions.map((session, index) =>
                                <div key={index} className={"btn btn-note" +
                                    (session.id === props.noteId ? ' active' : '')}
                                     onClick={session.id === props.noteId ? null :
                                         () => props.handleNoteIdUpdate(session.id, props.sessions.length - index,
                                             NoteContentType.SESSION)}>
                                    <div>{session.name ?
                                        session.name : 'Session ' + (props.sessions.length - index)}</div>
                                    <div className={'subheader'}>
                                        {DateUtil.FORMAT_DATE(session.date, false)}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
