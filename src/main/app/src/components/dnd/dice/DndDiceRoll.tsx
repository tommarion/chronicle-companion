import * as React from "react";
import {useEffect, useState} from "react";
import '../../../stylesheet/dice.css'
import '../../../stylesheet/dndDice.css'
import DieInputWrapper from "./DieInputWrapper";
import DndRollResult from "./DndRollResult";
import RollNotifyType from "../../../data/enum/RollNotifyType";
import {getBaseURL} from "../../../js/common";
import GoDiceWrapper from "../../common/GoDiceWrapper";
import GameType from "../../../data/enum/GameType";
import {Message} from "stompjs";
import SoundType from "../../../data/enum/SoundType";
import {ClientData} from "../../../data/ClientData";

type DiceRollProps = {
    hidden:                 boolean
    campaignId:             string
    onRollTypeChange:       Function
    onDiceValueUpdate:      Function
    showSeenRolls:          boolean
    rollAlias:              string
    handleRollAliasUpdate:  Function
    stompClient:            ClientData
    playSoundHandler:       Function
    setRollCountData:       Function
    setRollSeenData:        Function
    dice:                   Map<number, DndDieData>
}

export default function DndDiceRoll(props: DiceRollProps) {
    const [isPrivateRoll, setIsPrivateRoll] = useState<boolean>(false);
    // const [dice, setDice] = useState<Map<number,DndDieData>>(new Map([[20, {value:1, modifier:0}]]));
    const [rolls, setRolls] = useState<DndRollValue[]>([]);
    const [rollsSeen, setRollsSeen] = useState(rolls.length);

    const handleDiceInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value == '') {
            return;
        }
        let diceInput = parseDiceInputText(e.target.value);
        if (diceInput) {
            props.onDiceValueUpdate(diceInput);
        }
    }

    const captureEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            let diceInput = parseDiceInputText(e.currentTarget.value);
            if (diceInput) {
                props.onDiceValueUpdate(diceInput);
                handleDiceRoll();
            }
            e.currentTarget.blur();
        }
    }

    const parseDiceInputText = (inputValue: string) => {
        let diceMap = new Map<number, DndDieData>;
        let delim = ' ';
        if (!inputValue.includes(delim)) {
            delim = ',';
        }
        try {
            let dice = inputValue.split(delim);
            for (let index in dice) {
                let pairDelim = 'd';
                if (!dice[index].includes(pairDelim)) {
                    pairDelim = 'D';
                }
                let valuePair = dice[index].split(pairDelim);
                let diceType = valuePair[1];
                let modifier = 0;
                if (diceType.includes('+')) {
                    modifier = parseInt(diceType.substring(diceType.indexOf('+')));
                    diceType = diceType.substring(0, diceType.indexOf('+'));
                } else if (diceType.includes('-')) {
                    modifier = parseInt(diceType.substring(diceType.indexOf('-')));
                    diceType = diceType.substring(0, diceType.indexOf('-'));
                }
                diceMap.set(parseInt(diceType), {
                    value: parseInt(valuePair[0]),
                    modifier: modifier
                });
            }
            return diceMap;
        } catch (e) {
            alert("There was a problem with your dice string. Check the value and try again.");
            console.log(e);
            return null;
        }
    }

    const handleDieValueUpdate = (e: React.FormEvent<HTMLDivElement>) => {
        let updatedDiceMap = new Map();
        e.currentTarget.childNodes.forEach((child: HTMLDivElement) => {
            let typeElem: HTMLInputElement = child.querySelector('input[name=type]');
            let value: HTMLInputElement = child.querySelector('input[name=value]');
            let modifier: HTMLInputElement = child.querySelector('input[name=modifier]');
            updatedDiceMap.set(parseInt(typeElem.value), {
                value: parseInt(value.value),
                modifier: modifier ? parseInt(modifier.value) : 0
            });
        })
        props.onDiceValueUpdate(updatedDiceMap);
    }

    const handleDiceRoll = () => {
        fetch(getBaseURL() + 'dnd/campaign/' + props.campaignId + '/roll', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                notify: isPrivateRoll ? RollNotifyType.PRIVATE :
                    RollNotifyType.EVERYONE,
                alias: props.rollAlias,
                diceMap: getDiceListFromMap(props.dice)
            })
        }).then((response) => {
            if (response.status === 200) {
                console.log('roll submitted');
            } else {
                console.error("Unexpected response from server, status: " + response.status);
            }
        })
    }

    const handleGoDiceRoll = (roll: GoDiceRoll[]) => {
        console.log(roll);
        console.log(JSON.stringify({
            notify: isPrivateRoll ? RollNotifyType.PRIVATE :
                RollNotifyType.EVERYONE,
            alias: props.rollAlias,
            roll: roll
        }));
        fetch(getBaseURL() + 'dnd/campaign/' + props.campaignId + '/godice/roll', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                notify: isPrivateRoll ? RollNotifyType.PRIVATE :
                    RollNotifyType.EVERYONE,
                alias: props.rollAlias,
                roll: roll
            })
        }).then((response) => {
            if (response.status === 200) {
                console.log('roll submitted');
            } else {
                console.error("Unexpected response from server, status: " + response.status);
            }
        })
    }

    const getDiceListFromMap = (map: Map<number, DndDieData>) => {
        let list: any[] = [];
        map.forEach((value, key) => {
            list.push({
                type: key,
                value: value.value,
                modifier: value.modifier
            });
        })
        return list;
    }

    useEffect(() => {
        if (props.stompClient) {
            props.stompClient.stompClient.unsubscribe('/secured/campaign/' + props.campaignId + '/roll/results');
            props.stompClient.stompClient.unsubscribe('/secured/user/' + props.stompClient.userSessionId +
                + '/campaign/' + props.campaignId + '/roll/results');
            props.stompClient.stompClient.subscribe('/secured/campaign/' + props.campaignId + '/roll/results',
                (message: Message) => handleDiceResults(message));
            props.stompClient.stompClient.subscribe('/secured/user/' + props.stompClient.userSessionId +
                + '/campaign/' + props.campaignId + '/roll/results', (message: Message) => handleDiceResults(message));
            console.log(props.stompClient.stompClient.subscriptions);
        }
    }, [props.stompClient]);

    const handleDiceResults = (message: Message) => {
        props.playSoundHandler();
        updateRollData(JSON.parse(message.body));
    }

    const updateRollData = (diceRoll: DndRollValue) => {
        setRolls(prevRolls => {
            let updatedRolls = [...prevRolls, diceRoll];

            if (!props.hidden) {
                setRollsSeen(updatedRolls.length + 1);
                props.setRollSeenData(rollsSeen);
            }
            props.setRollCountData(updatedRolls.length);

            return updatedRolls;
        });
    }

    useEffect(() => {
        if (!props.hidden) {
            setRollsSeen(prevState => {
                props.setRollSeenData(prevState);
                return prevState
            });
        }
    }, [props.hidden]);
    return (
        <div id="dice-roll__wrapper" className={props.hidden ? 'hidden' : ''}>
            <div id={"btn__dice-roll__wrapper"}>
                <input id='dice-roll__input' type={'text'} placeholder={"Enter Roll (ex. 2d20)"}
                       onBlur={handleDiceInputBlur} onKeyUp={captureEnter}/>
                <DieInputWrapper dice={props.dice} campaignId={props.campaignId}
                                 dieValueUpdate={handleDieValueUpdate}
                                 handleDiceRoll={handleDiceRoll}/>
            </div>
            <div id={"dice-roll__window"}>
                <div id={'rolling_as'}
                     className={'btn' + (props.rollAlias !== null ? ' open' : '')}
                     onClick={() => props.handleRollAliasUpdate(null, null)}
                >
                    Rolling as: <span className={'roller'}>{props.rollAlias}</span>
                </div>
                <div id={"private-roll"}
                     className={'btn' + (isPrivateRoll ? ' open' : '')}
                     onClick={() => setIsPrivateRoll(false)}
                >
                    Rolling Privately
                    <span className={"private-additional"}></span>
                </div>
                <div id={"clear_dice-results"}></div>
                <GoDiceWrapper gameType={GameType.DND} rollDice={handleGoDiceRoll}/>
                <div id={'dice-results'}>
                    {rolls.slice(0).reverse().map((roll: DndRollValue, index: number) => {
                        let rollDOM =
                            <DndRollResult key={index} value={roll}/>;
                        if (index<rolls.length-1) {
                            rollDOM =
                                <>
                                    {rollDOM}
                                    <hr/>
                                </>;
                        }
                       return (
                           props.showSeenRolls || index >= rollsSeen ?
                               rollDOM : null
                       );
                    })}
                </div>
            </div>
      </div>
    );
}