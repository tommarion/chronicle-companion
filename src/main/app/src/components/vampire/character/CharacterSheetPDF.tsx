import * as React from "react";
import {ForwardedRef} from "react";
import CharacterContent, {CharacterContentProps} from "./CharacterContent";

export const CharacterSheetPDF = React.forwardRef((props: CharacterContentProps, ref: ForwardedRef<any>) => {
    return (
        <div ref={ref} style={{overflow:"hidden"}}>

            <CharacterContent hidden={props.hidden} id={props.id}
                              rollClickFunction={props.rollClickFunction}
                              handleRollAliasUpdate={props.handleRollAliasUpdate}
                              rollAliasActive={props.rollAliasActive} editMode={props.editMode}
                              handleCharacterSheet={props.handleCharacterSheet}/>
        </div>
    );
});