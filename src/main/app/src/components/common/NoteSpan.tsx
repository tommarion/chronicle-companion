import parse from "html-react-parser";
import * as React from "react";
import {NoteContentType} from "../../data/enum/NoteContentType";
import '../../stylesheet/notes.css';
import {useState} from "react";

type NotesSpanProps = {
    note?:      string
    edit:       boolean
    type:       NoteContentType
    save:       React.FocusEventHandler<HTMLSpanElement>
}
export default function NoteSpan(props: NotesSpanProps) {
    const [note, setNote] = useState<string>(props.note);
    const checkValue = (e: React.FocusEvent<HTMLSpanElement>) => {
        if (props.edit && e.target.innerHTML != note && e.target.innerHTML != (note + '&nbsp;') &&
                e.target.innerHTML != '') {
            console.log(note, e.target.innerHTML);
            props.save(e);
        }
    }

    const parseForTag = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        // let key = e.key;
        // if (key === '#' || key == '@') {
        //     setNote(e.currentTarget.innerHTML.substring(0, e.currentTarget.innerHTML.length-2) +
        //         renderToString(<span className={'tag-text'} contentEditable={true}>{key}</span>));
        //     let childNodes = e.currentTarget.childNodes;
        //     console.log(childNodes, childNodes.length);
        //     setCursorPosition( childNodes[childNodes.length-1], 1 );
        // }
    }
    function setCursorPosition( span: ChildNode, position: number ) {
        console.log(span);
        let range = document.createRange()
        let sel = window.getSelection()

        range.setStart(span, position)
        range.collapse(true)

        sel.removeAllRanges()
        sel.addRange(range)
    }
    let noteValue = note;
    // When there's a tag at the end of the note content, you can't add text after it (only inside the tag)
    if (noteValue && noteValue.substring(noteValue.length-7) === '</span>') {
        noteValue += '&nbsp;';
    } else {
    }
    return (
        <span role={"textbox"} contentEditable={props.edit} className={"note_span"}
              onBlur={checkValue} onKeyUpCapture={parseForTag}>{noteValue ? parse(noteValue) : ''}</span>
    )
}