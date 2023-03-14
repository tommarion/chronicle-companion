import {SessionInterface} from "../../data/SessionInterface";
import * as React from "react";
import NoteSpan from "./NoteSpan";
import {NoteContentType} from "../../data/enum/NoteContentType";
import {useEffect, useRef, useState} from "react";
import {getBaseURL} from "../../js/common";
import DateUtil from "../../util/DateUtil";

type SessionContentProps = {
    id:             string
    admin:          boolean
    campaignId:     string
    sessionIndex:   number
}
export default function SessionContent(props: SessionContentProps) {
    const [sessionContent, setSessionContent] = useState<SessionInterface>(null);
    const saveSessionNote = (e: React.FocusEvent<HTMLSpanElement>, noteId: string) => {
        let noteText = e.target.innerHTML;
        if (noteText.substring(noteText.length-5) === "<br/>") {
            noteText = noteText.substring(0, noteText.length-5);
        }
        fetch(getBaseURL() + "campaign/" + props.campaignId + '/notes', {
            method: "put",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                campaignId: props.campaignId,
                sessionId: props.id,
                id: noteId,
                note: noteText.replace('&nbsp;', ' ')
            })
        }).then(() => {
            setSessionContent(null);
            getSessionContent();
            if (noteId === null) {
                e.target.innerHTML = "";
            }
        });
    }
    const deleteSessionNote = (noteId: string) => {
        if (window.confirm("Are you sure you'd like to remove this note? (This cannot be undone)")) {
            fetch(getBaseURL() + 'notes/' + noteId, {
                method: "delete",
                headers: {'Content-Type':'application/json'}
            }).then(() => {
                setSessionContent(null);
                getSessionContent();
            });
        }
    }
    const saveSessionName = (e: React.FocusEvent<HTMLInputElement>) => {
        let saveData = {
            campaignId: props.campaignId,
            sessionId: props.id,
            name: e.target.value
        }
        console.log("Saving session name", saveData);
    }

    const checkTitle = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.innerHTML != sessionContent.session.name &&
            e.target.innerHTML != '') {
            saveSessionName(e);
        }
    }
    useEffect(() => {
        if (props.id) {
            getSessionContent();
        }
    }, [props.id]);

    const getSessionContent = () => {
        fetch(getBaseURL() + "session/" + props.id + '/notes')
            .then(response => response.json())
            .then(result => {
                setSessionContent(result);
            })
            .catch(e => {
                console.error(e);
            });
    }
    const refs = useRef([]);
    return (
        sessionContent && sessionContent.session && sessionContent.notes ?
        <div id={'session__wrapper'}>
            <div key={sessionContent.session.name}>
                {props.admin ?
                    <input className={'notes-title'} disabled={!props.admin} onBlur={checkTitle}
                           defaultValue={sessionContent.session.name} placeholder={"Session " + props.sessionIndex}/> :
                    <div className={'notes-title'}>{sessionContent.session.name ? sessionContent.session.name :
                        "Session " + props.sessionIndex}</div>
                }

            </div>
            <div id={'session-notes__wrapper'}>
                <div className={'new-note'}>
                    <NoteSpan type={NoteContentType.SESSION} edit={true}
                              save={(e: React.FocusEvent<HTMLSpanElement>) => saveSessionNote(e, null)}></NoteSpan>
                </div>
                <hr/>
                <ul>
                    {sessionContent.notes.map((note: NotesInterface, index: number) => {
                        return <li key={index} className={note.author ? 'other-persons-note' : ''} onClick={() => {if (refs.current[index]) {refs.current[index].focus()}}}>
                            {note.author ? null :
                                <div className={'btn btn-delete_note'} onClick={() => deleteSessionNote(note.id)}></div>}
                            <div className={'note-details__wrapper flex'}>
                                <div className={'note-date sub-text'}>{DateUtil.FORMAT_DATE(note.date, false)}</div>

                                {note.author ? <div className={'note-author'}>{note.author}</div> : null}
                            </div>
                            <NoteSpan key={index} note={note.note} type={NoteContentType.SESSION} edit={note.author===null}
                                      save={(e: React.FocusEvent<HTMLSpanElement>) => saveSessionNote(e, note.id)}></NoteSpan>
                        </li>
                    })}
                </ul>
            </div>
        </div> : null
    );
}
