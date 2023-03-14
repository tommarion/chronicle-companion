import * as React from "react";
import GameType from "../../data/enum/GameType";
import {useEffect, useState} from "react";
import {GoDice} from "../../js/godice";
import Util from "../../util/Util";

type GoDiceWrapperProps = {
    gameType: GameType
    rollDice: Function
}

type DieStatusValue = {
    die:        any
    isRolling:  boolean
    value?:     number
    color?:     number
    battery?:   number
    ledColor?:  number[]
}

type DieRollStatusValue = {
    isRolling:  boolean
    value?:     number
}

type tooltipData = {
    data:   string
    xPos:   number
    yPos:   number
}

export default function GoDiceWrapper(props: GoDiceWrapperProps) {
    const [connectedDice, setConnectedDice] = useState<Map<string, DieStatusValue>>(new Map());
    const [rolling, setRolling] = useState<Map<string, DieRollStatusValue>>(new Map());
    const [tooltip, setTooltip] = useState<TooltipData>(null);

    const pairGoDice = () => {
        const newDice = new GoDice();
        newDice.requestDevice();
    }

    // @ts-ignore
    GoDice.prototype.onDiceConnected = (diceId, diceInstance) => {
        diceInstance.setDieType(GoDice.diceTypes.D20);
        let ledColor = Util.GET_RANDOM_COLOR()
        setConnectedDice(new Map(connectedDice.set(diceId, {
            die:        diceInstance,
            isRolling:  false,
            ledColor:   ledColor
        })));
        diceInstance.getDiceColor();
    }

    // @ts-ignore
    GoDice.prototype.onDiceColor = (dieId, dieColor) => {
        setConnectedDice(new Map(connectedDice.set(dieId, {
            ...connectedDice.get(dieId),
            color: dieColor,
        })));
        connectedDice.get(dieId).die.getBatteryLevel();
    }

    // @ts-ignore
    GoDice.prototype.onRollStart = (diceId) => {
        setConnectedDice(new Map(connectedDice.set(diceId, {
            ...connectedDice.get(diceId),
            isRolling:  true,
            value:      null,
        })));
        setRolling(new Map(rolling.set(diceId, { isRolling: true })));
        connectedDice.get(diceId).die.getBatteryLevel();
    }

    // @ts-ignore
    GoDice.prototype.onTiltStable = (diceId, xyzArray, value) => {
        setConnectedDice(new Map(connectedDice.set(diceId, {
            ...connectedDice.get(diceId),
            isRolling: false,
            value: value,
        })));
        connectedDice.get(diceId).die.pulseLed(1, 30, 20, connectedDice.get(diceId).ledColor);
        setRolling(new Map(rolling.set(diceId, { isRolling: false, value: value })));
        connectedDice.get(diceId).die.getBatteryLevel();
    }

    // @ts-ignore
    GoDice.prototype.onBatteryLevel = (diceId: string, batteryLevel: number) => {
        let diceInfo = connectedDice.get(diceId);
        setConnectedDice(new Map(connectedDice.set(diceId, {
            ...diceInfo,
            battery: batteryLevel
        })));
    }

    useEffect(() => {
        let values: number[] = [];
        for (let [rollId, die] of rolling) {
            if (die.isRolling)  {
                return;
            }
            values.push(die.value);
        }
        if (values.length > 0) {
            setRolling(new Map());
            props.rollDice([{diceType: 20, results: values}]);
        }
    }, [rolling]);

    const handleDiceBtnClick = (dieId: string) => {
        let dieInfo = connectedDice.get(dieId);
        if (dieInfo.battery >= 30) {
            dieInfo.die.pulseLed(3, 20, 10, dieInfo.ledColor);
        } else {
            alert("Battery too low for LED");
        }
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, battery: number) => {
        setTooltip({text: battery + "%", xPos: e.clientX + 10, yPos: e.clientY + 10});
    }

    const handleMouseLeave = () => {
        setTooltip(null);
    }

    return (
        <div id={'go-dice__wrapper'} className={'flex'}>
            <div id={'go-dice_btn'} onClick={pairGoDice}></div>
            <div id={'go-dice-dice__wrapper'} className={'flex'}>
                {Array.from(connectedDice.keys()).map((key) => {
                    let rollingClass = connectedDice.get(key).isRolling ? ' rolling' : '';
                    let batteryClass = connectedDice.get(key).battery ? Math.round(connectedDice.get(key).battery / 33) : '';
                    let ledColor = connectedDice.get(key).ledColor;
                    let ledColorStr = "rgb(" + ledColor[0] + "," + ledColor[1] + "," + ledColor[2] + ")";
                    return <div className={'go-dice_info color' + (connectedDice.get(key).color) + (rollingClass) +
                        ' battery' + (batteryClass)} onClick={() => handleDiceBtnClick(key)}
                                style={{boxShadow: '0 0 5px ' + ledColorStr}}
                                onMouseEnter={(e) => handleMouseEnter(e, connectedDice.get(key).battery)}
                                onMouseMove={(e) => handleMouseEnter(e, connectedDice.get(key).battery)}
                                onMouseLeave={handleMouseLeave}>
                        <span>{connectedDice.get(key).isRolling ? '' :
                            connectedDice.get(key).value ? connectedDice.get(key).value : ''}</span>
                    </div>
                })}
            </div>
            {tooltip ? <div className={'tooltip'} style={{top:tooltip.yPos, left:tooltip.xPos}}>{tooltip.text}</div> : null}
        </div>
    )
}