import * as React from "react";
import {useEffect, useState} from "react";
import * as Autocomplete from "react-autocomplete";
import VampireConst from "../../../data/VampireConst"
import '../../../stylesheet/dice.css'
import {getBaseURL} from "../../../js/common";
import RollResult from "../../vampire/dice/RollResult";
import RollNotifyType from "../../../data/enum/RollNotifyType";
import {Message} from "stompjs";
import {ClientData} from "../../../data/ClientData";

type DiceRollProps = {
    hidden:                 boolean
    campaignId:             string
    rollType:               string
    rollName:               string
    onRollTypeChange:       Function
    onDiceValueUpdate:      Function
    dice: {
        pool:                   number
        hunger:                 number
    }
    showSeenRolls:          boolean
    rollAlias:              string
    handleRollAliasUpdate:  Function
    stompClient:            ClientData
    playSoundHandler:       Function
    setRollCountData:       Function
    setRollSeenData:        Function
}

export default function VampireDiceRoll(props: DiceRollProps) {
    const [includeHunger, setIncludeHunger] = useState<boolean>(true);
    const [isPrivateRoll, setIsPrivateRoll] = useState<boolean>(false);
    const [rolls, setRolls] = useState<RollValue[]>([]);
    const [rollsSeen, setRollsSeen] = useState(rolls.length);

    let rollTypes = Array.from(VampireConst.ROLL_ACTION_REFERENCE.keys()).sort();

    const handleDiceRoll = () => {
        fetch(getBaseURL() + 'vampire/campaign/' + props.campaignId + '/roll', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                'total': props.dice.pool,
                'hunger': includeHunger ? props.dice.hunger : 0,
                'notify': isPrivateRoll ? RollNotifyType.PRIVATE :
                    RollNotifyType.EVERYONE,
                'rollFor': props.rollName,
                'rollWith': props.rollType,
                'alias': props.rollAlias
            })
        }).then((response) => {
            if (response.status === 200) {
                console.log('roll submitted');
            } else {
                console.error("Unexpected response from server, status: " + response.status);
            }
        });
    }

    useEffect(() => {
        if (props.stompClient) {
            props.stompClient.stompClient.unsubscribe('/secured/roll/results');
            props.stompClient.stompClient.unsubscribe('/secured/user/' + props.stompClient.userSessionId +
                '/roll/results');
            props.stompClient.stompClient.subscribe('/secured/roll/results', (message: Message) =>
                handleDiceResults(message));
            props.stompClient.stompClient.subscribe('/secured/user/' + props.stompClient.userSessionId +
                '/roll/results', (message: Message) => handleDiceResults(message));
            console.log(props.stompClient.stompClient.subscriptions);
        }
    }, [props.stompClient]);

    const handleDiceResults = (message: Message) => {
        props.playSoundHandler();
        updateRollData(JSON.parse(message.body));
    }

    const updateRollData = (diceRoll: RollValue) => {
        setRolls(prevRolls => {
            let updatedRolls = [...prevRolls, diceRoll];

            if (!props.hidden) {
                setRollsSeen(updatedRolls.length + 1);
                props.setRollSeenData(rollsSeen);
            } else {
                setPrevRollsSeen();
            }
            props.setRollCountData(updatedRolls.length);

            return updatedRolls;
        });
    }
    useEffect(() => {
        if (!props.hidden) {
        }
        setPrevRollsSeen();
    }, [props.hidden]);

    const setPrevRollsSeen = () => {
        setRollsSeen(prevState => {
            props.setRollSeenData(prevState);
            return prevState
        });
    }

    return (
        <div id="dice-roll__wrapper" className={props.hidden ? 'hidden' : ''}>
            <div id={"btn__dice-roll__wrapper"}>
                <div id={"roll-type"}>
                    <Autocomplete
                        wrapperStyle={{
                            backgroundColor: '#5d000d',
                            padding: '5px',
                            borderRadius: '3px'
                        }}
                        getItemValue={(action) => action}
                        items={rollTypes}
                        renderItem={(action, isHighlighted) =>
                            <div className={"roll-type-item" + (isHighlighted ? ' active' : '')}>
                                {action}
                            </div>}
                        value={props.rollName}
                        shouldItemRender={(item, value) =>
                            item.toLowerCase().includes(props.rollName.toLowerCase())}
                        onChange={(e) =>
                            props.onRollTypeChange(null, e.target.value)
                        }
                        onSelect={(val) => {
                            props.onRollTypeChange(
                                val && VampireConst.ROLL_ACTION_REFERENCE.has(val) &&
                                        VampireConst.ROLL_ACTION_REFERENCE.get(val) >= 0 ?
                                    VampireConst.ROLL_REFERENCE[VampireConst.ROLL_ACTION_REFERENCE.get(val)] :
                                    null, val
                            );
                        }}
                        selectOnBlur={true}
                        sortItems={(itemA, itemB, value) =>
                            itemA.toLowerCase().indexOf(props.rollName.toLowerCase()) -
                            itemB.toLowerCase().indexOf(props.rollName.toLowerCase())
                        }
                        menuStyle={{
                            position:           'fixed',
                            overflow:           'auto',
                            borderRadius:       '3px',
                            backgroundColor:    '#5d000d',
                            border:             '2px solid',
                            marginTop:          '5px',
                            maxHeight:          'calc(100% - 70px)',
                            zIndex:             200
                        }}
                    />
                </div>
                <div className={"flex"}>
                    <input
                        id={"dice-pool__input"}
                        type={"number"}
                        min={1}
                        max={25}
                        step={1}
                        value={props.dice.pool}
                        onChange={e => props.onDiceValueUpdate(e.target.value,
                            props.dice.hunger <= parseInt(e.target.value) ?
                                props.dice.hunger : e.target.value
                        )}
                    />
                    <input
                        id={"hunger-dice__input"}
                        type={"number"}
                        min={0}
                        max={5}
                        step={1}
                        value={props.dice.hunger}
                        disabled={!includeHunger}
                        onChange={e => props.onDiceValueUpdate(props.dice.pool >= parseInt(e.target.value) ?
                            props.dice.pool : e.target.value, e.target.value)}
                    />
                    <div
                        id={'hunger-dice__input-div'}
                        className={'checkbox btn' + (includeHunger ? ' selected' : '')}
                        onClick={() => setIncludeHunger(!includeHunger)}
                    ></div>
                    <div id={"btn_roll-dice__wrapper"} className={'flex'}>
                        <div
                            id={'btn_private-roll'}
                            className={'checkbox btn' + (isPrivateRoll ? ' selected' : '')}
                            onClick={() => setIsPrivateRoll(!isPrivateRoll)}
                        ></div>
                        <div
                            id={'btn_roll-dice'}
                            className={'btn'}
                            onClick={handleDiceRoll}
                        ></div>
                    </div>
                </div>
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
                <div id={'dice-results'}>
                    {rolls ? rolls.slice(0).reverse().map((roll: RollValue, index: number) => {
                        let rollDOM =
                            <RollResult key={index} value={roll}/>;
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
                    }) : null}
                </div>
            </div>
      </div>
    );
}