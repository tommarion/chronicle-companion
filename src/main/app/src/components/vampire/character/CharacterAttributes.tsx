import * as React from "react";

type CharacterAttributesProps = {
    attributes: CharacterSheetAttributesInterface
}

export default function CharacterAttributes(props: CharacterAttributesProps) {
    return (
        <div id={'attributes__wrapper'} className={'flex'}>
            <div>
                <div className={'subheader'}>physical</div>
                {Object.entries(props.attributes.physical).map(([key, value], index) => {
                    return <div key={index} className={'stat__wrapper'}>
                        <div className={'subheader'}>{key}</div>
                        <div className={"level level" + value}></div>
                    </div>
                })}
            </div>
            <div>
                <div className={'subheader'}>social</div>
                {Object.entries(props.attributes.social).map(([key, value], index) => {
                    return <div key={index} className={'stat__wrapper'}>
                        <div className={'subheader'}>{key}</div>
                        <div className={"level level" + value}></div>
                    </div>
                })}
            </div>
            <div>
                <div className={'subheader'}>mental</div>
                {Object.entries(props.attributes.mental).map(([key, value], index) => {
                    return <div key={index} className={'stat__wrapper'}>
                        <div className={'subheader'}>{key}</div>
                        <div className={"level level" + value}></div>
                    </div>
                })}
            </div>
        </div>
    );
}