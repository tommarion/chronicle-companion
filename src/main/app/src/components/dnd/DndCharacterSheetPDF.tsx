import * as React from "react";
import {ForwardedRef} from "react";
import DndCharacterContent, {DndCharacterContentProps} from "./DndCharacterContent";

export const DndCharacterSheetPDF = React.forwardRef((props: DndCharacterContentProps, ref: ForwardedRef<any>) => {
    return (
        <div ref={ref} style={{overflow:"hidden"}}>
            <DndCharacterContent hidden={props.hidden} id={props.id}
                              handleRollAliasUpdate={(alias: string, aliasId: string) =>
                                  props.handleRollAliasUpdate(alias, aliasId)}
                              rollAliasActive={props.rollAliasActive} editMode={props.editMode}/>
        </div>
    );
});