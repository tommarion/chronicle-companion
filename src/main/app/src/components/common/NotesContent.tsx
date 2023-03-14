import * as React from "react";
import NoteSpan from "./NoteSpan";
import {NoteContentType} from "../../data/enum/NoteContentType";
import {useEffect, useState} from "react";
import {getBaseURL} from "../../js/common";


type NotesContentProps = {
    id:             string
    campaignId:     string
}
export default function NotesContent(props: NotesContentProps) {
    const [notesContent, setNotesContent] = useState<NotesInterface>(null);
    const saveNote = (e: React.FocusEvent<HTMLSpanElement>) => {
        fetch(getBaseURL() + "campaign/" + props.campaignId + '/notes', {
            method: "put",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                campaignId: props.campaignId,
                sessionId: null,
                id: props.id,
                note: e.target.innerHTML.replace('&nbsp;', ' ')
            })
        }).then(() => {
            getNoteContent();
        });
    }
    const saveNoteName = (e: React.FocusEvent<HTMLInputElement>) => {
        console.log("Saving note name", e.target.value);
    }
    const checkTitle = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.innerHTML != notesContent.name &&
            e.target.innerHTML != '') {
            saveNoteName(e);
        }
    }
    const getNoteContent = () => {
        if (props.id) {
            fetch(getBaseURL() + 'notes/' + props.id)
                .then(response => response.json())
                .then(result => {
                    setNotesContent(result);
                })
                .catch(e => {
                    console.error(e);
                });
        }
    }
    useEffect(() => {
        getNoteContent();
    }, [props.id]);
    return (
        notesContent ?
        <div id={'story-text__wrapper'}>
            <div key={notesContent.name}>
                <input className={'notes-title'} onBlur={checkTitle} defaultValue={notesContent.name}/>
            </div>
            <NoteSpan note={notesContent.note} edit={notesContent.author===null}
                      type={NoteContentType.GENERAL} save={saveNote}></NoteSpan>
        </div> : null
    );
}