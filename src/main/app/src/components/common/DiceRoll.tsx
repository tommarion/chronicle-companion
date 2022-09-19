import * as React from "react";
import {Component} from "react";
import * as Autocomplete from "react-autocomplete";
import VampireConst from "../../data/VampireConst"
import '../../stylesheet/dice.css'
import {getBaseURL} from "../../js/common";
import RollResult from "../vampire/dice/RollResult";
import SoundType from "../../data/enum/SoundType";
import RollNotifyType from "../../data/enum/RollNotifyType";

type DiceRollProps = {
    hidden: boolean
    campaignId: string
    onRollTypeChange: Function
    onDiceValueUpdate: Function
    dice: {
        pool: number,
        hunger: number
    }
    rolls: RollValue[]
    rollSeenIndex: number
    showSeenRolls: boolean
    rollAlias: string
    handleRollAliasUpdate: Function
}

type DiceRollState = {
    rollType: string
    includeHunger: boolean
    isPrivateRoll: boolean
}

class DiceRoll extends Component<DiceRollProps, DiceRollState> {
    constructor(props: DiceRollProps) {
        super(props);
        this.state = {
            rollType: 'Rouse',
            includeHunger: true,
            isPrivateRoll: false
        };
    }
    render () {
        let rollTypes =
            Array.from(VampireConst.ROLL_ACTION_REFERENCE.keys())
                .sort();
        return (
          <div id="dice-roll__wrapper" className={this.props.hidden ? 'hidden' : ''}>
            <div id={"btn__dice-roll__wrapper"}>
                <div id={"roll-type"}>
                    <Autocomplete
                        wrapperStyle={{
                            backgroundColor: '#5d000d',
                            padding: '5px'
                        }}
                        getItemValue={(action) => action}
                        items={rollTypes}
                        renderItem={(action, isHighlighted) =>
                            <div className={"roll-type-item" + (isHighlighted ? ' active' : '')}>
                                {action}
                            </div>}
                        value={this.state.rollType}
                        shouldItemRender={(item, value) =>
                            item.toLowerCase().includes(this.state.rollType.toLowerCase())}
                        onChange={(e) =>
                            this.setState({
                                rollType: e.target.value
                            })
                        }
                        onSelect={(val) => {
                            this.setState({
                                rollType: val
                            });
                            this.props.onRollTypeChange(
                                val && VampireConst.ROLL_ACTION_REFERENCE.has(val) &&
                                        VampireConst.ROLL_ACTION_REFERENCE.get(val) >= 0 ?
                                    VampireConst.ROLL_REFERENCE[VampireConst.ROLL_ACTION_REFERENCE.get(val)] :
                                    null
                            );
                        }}
                        selectOnBlur={true}
                        sortItems={(itemA, itemB, value) =>
                            itemA.toLowerCase().indexOf(this.state.rollType.toLowerCase()) -
                            itemB.toLowerCase().indexOf(this.state.rollType.toLowerCase())
                        }
                        menuStyle={{
                            position: 'fixed',
                            overflow: 'auto',
                            borderRadius: '3px',
                            backgroundColor: '#5d000d',
                            border: '2px solid',
                            marginTop: '5px',
                            maxHeight: 'calc(100% - 70px)',
                            zIndex: 200
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
                        value={this.props.dice.pool}
                        onChange={e => this.props.onDiceValueUpdate(e.target.value,
                            this.props.dice.hunger <= parseInt(e.target.value) ?
                                this.props.dice.hunger : e.target.value
                        )}
                    />
                    <input
                        id={"hunger-dice__input"}
                        type={"number"}
                        min={0}
                        max={5}
                        step={1}
                        value={this.props.dice.hunger}
                        disabled={!this.state.includeHunger}
                        onChange={e => this.props.onDiceValueUpdate(this.props.dice.pool >= parseInt(e.target.value) ?
                            this.props.dice.pool : e.target.value, e.target.value)}
                    />
                    <div
                        id={'hunger-dice__input-div'}
                        className={'checkbox btn' + (this.state.includeHunger ? ' selected' : '')}
                        onClick={() => this.setState({
                            ...this.state,
                            includeHunger: !this.state.includeHunger
                        })}
                    ></div>
                    <div id={"btn_roll-dice__wrapper"}>
                        <div
                            id={'btn_private-roll'}
                            className={'checkbox btn' + (this.state.isPrivateRoll ? ' selected' : '')}
                            onClick={() => this.setState({
                                ...this.state,
                                isPrivateRoll: !this.state.isPrivateRoll
                            })}
                        ></div>
                        <div
                            id={'btn_roll-dice'}
                            className={'btn'}
                            onClick={() => {
                                fetch(getBaseURL() + 'campaign/' + this.props.campaignId + '/roll', {
                                    method: 'post',
                                    headers: {'Content-Type':'application/json'},
                                    body: JSON.stringify({
                                        'total': this.props.dice.pool,
                                        'hunger': this.state.includeHunger ? this.props.dice.hunger : 0,
                                        'notify': this.state.isPrivateRoll ? RollNotifyType.PRIVATE :
                                            RollNotifyType.EVERYONE,
                                        'rollFor': this.state.rollType
                                    })
                                }).then((response) => {
                                    if (response.status === 200) {
                                        console.log('roll submitted');
                                    } else {
                                        console.error("Unexpected response from server, status: " + response.status);
                                    }
                                });
                            }}
                        ></div>
                    </div>
                </div>
            </div>
            <div id={"dice-roll__window"}>
                <div id={'rolling_as'}
                     className={'btn' + (this.props.rollAlias !== null ? ' open' : '')}
                     onClick={() => this.props.handleRollAliasUpdate(null)}
                >
                    Rolling as: <span className={'roller'}></span>
                </div>
                <div id={"private-roll"}
                     className={'btn' + (this.state.isPrivateRoll ? ' open' : '')}
                     onClick={() => this.setState({
                         ...this.state,
                         isPrivateRoll: false
                     })}
                >
                    Rolling Privately
                    <span className={"private-additional"}></span>
                </div>
                <div id={"clear_dice-results"}></div>
                <div id={'dice-results'}>
                    {this.props.rolls.slice(0).reverse().map((roll: RollValue, index: number) => {
                        let rollDOM =
                            <RollResult key={index} value={roll}/>;
                        if (index<this.props.rolls.length-1) {
                            rollDOM =
                                <>
                                    {rollDOM}
                                    <hr/>
                                </>;
                        }
                       return (
                           this.props.showSeenRolls || index >= this.props.rollSeenIndex ?
                               rollDOM : null
                       );
                    })}
                </div>
            </div>
          </div>
        );
    }
}

export default DiceRoll