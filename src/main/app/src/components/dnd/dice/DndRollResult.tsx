import * as React from "react";
import ReactTimeAgo from "react-time-ago";
import Die from "./Die";

type RollResultProps = {
    value: DndRollValue
}
export default function DndRollResult(props: RollResultProps){
    return(
        <div className={'dice-roll'}>
            <div className={'right subheader'}>
                <ReactTimeAgo date={new Date(props.value.timestamp)}
                              locale={"en-US"} updateInterval={5000} timeStyle={
                    {steps:[
                            {
                                formatAs: 'now'
                            },
                            {
                                minTime: 5,
                                // "second" labels are used for formatting the output.
                                formatAs: 'second'
                            },
                            {
                                // This step is effective starting from 59.5 seconds.
                                minTime: 60,
                                // "minute" labels are used for formatting the output.
                                formatAs: 'minute'
                            },
                            {
                                // This step is effective starting from 59.5 minutes.
                                minTime: 60 * 60,
                                // "hour" labels are used for formatting the output.
                                formatAs: 'hour'
                            }],
                        labels:[]}}></ReactTimeAgo>
            </div>
            <div className={'title'}>{props.value.alias ?
                props.value.alias: props.value.player}</div>
            {props.value.alias ?
                <div className={'subheader'}>({props.value.player})</div>: null}
            <div className={"roll_for"}>{props.value.rollFor}</div>
            {props.value.rollWith ?
                <div className={"roll_for subheader"}>{props.value.rollWith}</div> : null}
            <div className={"dice-result flex"}>
                {props.value.roll.map((roll) => {
                    return <div className={'center subheader'}>
                        <div className={'subheader'}>D{roll.diceType}</div>
                        {roll.results ? roll.results.map((value) => {
                            return <Die type={roll.diceType} value={value}/>
                        }) : null}
                    </div>
                })}
            </div>
        </div>
    );
}