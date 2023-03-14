import * as React from "react";

type DieProps = {
    type:   number
    value:  number
}
export default function Die(props: DieProps) {
    return (
        <div>
            {props.value}
        </div>
    );
}