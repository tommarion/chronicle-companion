import * as React from "react";

type CharacterLimitedAttributesProps = {
    attributes: CharacterSheetAttributesInterface
}

export default function CharacterLimitedAttributes(props: CharacterLimitedAttributesProps) {
    return (
        <div id={'attributes__wrapper'} className={'flex'}>
            {Object.entries(props.attributes).map(([key, value], index) => {
                return <div>
                    <div key={index}>{key}</div>
                    <div className={"level level" + value}></div>
                </div>
            })}
        </div>
    );
}