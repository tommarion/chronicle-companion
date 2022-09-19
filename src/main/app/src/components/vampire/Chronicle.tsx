import * as React from "react"
import {Component, useEffect, useState} from "react"
import {getBaseURL} from "../../js/common"
import TopContainer from "../common/TopContainer"
import Sidebar from '../common/Sidebar'
import AppView from "../../data/enum/AppView"
import '../../stylesheet/topContainer.css'
import * as SockJS from 'sockjs-client'
import {Client, Message} from "stompjs"
import MainContent from "../common/MainContent"
import Footer from "../common/Footer"
import SidebarView from "../../data/enum/SidebarView"
import MainContentView from "../../data/enum/MainContentView"
import GameType from "../../data/enum/GameType"
import {CampaignInterface} from "../../data/CampaignInterface"
import SoundType from "../../data/enum/SoundType";

const Stomp = require('stompjs');

type ChronicleProps = {
    id : string
    playSoundHandler: Function
    sidebarDefaultActive: boolean
}

export default function Chronicle(props: ChronicleProps) {
    const [isFetching, setIsFetching] = useState(false);
    const [campaignData, setCampaignData] = useState(null);
    const [stompClient, setStompClient] = useState(null);
    const [online, setOnline] = useState(null);
    const [dice, setDice] = useState({pool: 1, hunger: 1});
    const [rollType, setRollType] = useState('Rouse');
    const [rolls, setRolls] = useState([]);
    const [rollsSeenIndex, setRollsSeenIndex] = useState(0);
    const [showSeenRolls, setShowSeenRolls] = useState(true);
    const [rollAlias, setRollAlias] = useState(null);
    const [isSidebarActive, setIsSidebarActive] = useState(false);
    const [sidebarView, setSidebarView] = useState(SidebarView.ROLL);
    const [mainContentView, setMainContentView] = useState(MainContentView.NOTES);

    const [noteId, setNoteId] = useState(null);
    const [characterId, setCharacterId] = useState(null);

    const handleDiceRollTypeChange = (rollType: string): void => {
        setRollType(rollType);
    }

    const handleRollValueUpdate = (pool: number, hunger: number): void => {
        setDice({
            pool: pool,
            hunger: hunger
        });
    }

    const handleContentViewUpdate = (sidebarView: SidebarView,
                            mainContentView: MainContentView,
                            sidebarActive: boolean): void => {
        let currentSidebarView = this.state.sidebarView;
        let currentMainContentView = this.state.mainContentView;
        let currentRollSeenIndex = this.state.rollSeenIndex;

        setSidebarView(sidebarView === SidebarView.NULL ? currentSidebarView : sidebarView);
        setMainContentView(mainContentView === MainContentView.NULL ? currentMainContentView : mainContentView);
        setIsSidebarActive(sidebarActive);
        setRollsSeenIndex(sidebarView === SidebarView.ROLL || currentSidebarView === SidebarView.ROLL ?
                this.state.rolls.length : currentRollSeenIndex);
    }

    const handleCharacterIdUpdate = (characterId: string): void => {
        setCharacterId(characterId);
        setIsSidebarActive(false);
        setMainContentView(MainContentView.CHARACTERS);
    }

    const handleRollAliasUpdate = (alias: string): void => {
        setRollAlias(alias);
    }

    const handleDiceResults = (message: Message) => {
        props.playSoundHandler(SoundType.DICE)
        let diceRoll = JSON.parse(message.body);
        setRolls(rolls.concat(diceRoll));
        setRollsSeenIndex(isSidebarActive || props.sidebarDefaultActive ?
            rolls.length + 1 : rollsSeenIndex);
    }

    const initStompClient = () => {
        let socket = new SockJS('/secured/');
        let stompClient = Stomp.over(socket as WebSocket);
        stompClient.connect({}, () => {
            let sessionId = stompClient.ws._transport.url;
            sessionId = sessionId.substring(0, sessionId.lastIndexOf('/'));
            sessionId = sessionId.substring(sessionId.lastIndexOf('/') + 1);
            stompClient.send('/socket/register', {},
                JSON.stringify({campaignId:sessionStorage.getItem('campaignId')}));
            stompClient.subscribe('/secured/online/update', () => {
                fetch(getBaseURL() + "campaign/" + props.id + '/online')
                    .then(response => response.json())
                    .then(result => {
                        setOnline(result);
                        setIsFetching(false);
                    })
                    .catch(e => {
                        console.error(e);
                        setIsFetching(false);
                    });
            });
            stompClient.subscribe('/secured/roll/results', (message: Message) => {
                props.playSoundHandler(SoundType.DICE)
                let diceRoll = JSON.parse(message.body);
                setRolls(rolls.concat(diceRoll));
                setRollsSeenIndex(isSidebarActive || props.sidebarDefaultActive ?
                    rolls.length + 1 : rollsSeenIndex);
            });
            stompClient.subscribe('/secured/user/' + sessionId + '/roll/results', handleDiceResults);
        });
        return stompClient;
    }

    useEffect(()=>{
        if (stompClient === null) {
            setStompClient(initStompClient());
        }
        setIsFetching(true);
        if (props.id) {
            sessionStorage.setItem('campaignId', props.id);
        }
        if (campaignData === null) {
            fetch(getBaseURL() + "vampire/chronicle/" + props.id)
                .then(response => response.json())
                .then(result => {
                    setCampaignData(result);
                    setIsFetching(false);
                })
                .catch(e => {
                    console.error(e);
                    setIsFetching(false);
                });
        }
    },[initStompClient, props.id])

    return (
            <>
                <TopContainer appView={AppView.CHRONICLE}
                              updateCharacterId={(characterId: string) => handleCharacterIdUpdate(characterId)}
                              online={online}
                              sidebar={isSidebarActive}
                              characterId={characterId}
                />
                <Sidebar active={isSidebarActive}
                         defaultActive={props.sidebarDefaultActive}
                         gameType={GameType.VAMPIRE}
                         view={sidebarView}
                         admin={campaignData ? campaignData.admin : false}
                         onDiceRollChange={(rollType: string) => handleDiceRollTypeChange(rollType)}
                         onDiceValueUpdate={(total: number, hunger: number) =>
                             handleRollValueUpdate(total, hunger)}
                         viewUpdate={(sidebarView: SidebarView, mainContentView: MainContentView,
                                      sidebarActive: boolean) =>
                             handleContentViewUpdate(sidebarView, mainContentView, sidebarActive)}
                         dice={dice}
                         rollSeenIndex={rollsSeenIndex}
                         showSeenRolls={showSeenRolls}
                         rollAlias={rollAlias}
                         handleRollAliasUpdate={(alias: string) => handleRollAliasUpdate(alias)}
                         campaignId={campaignData ? campaignData.id : null}
                         rolls={rolls}
                         characters={campaignData ? campaignData.characters : []}
                         notes={campaignData ? campaignData.notes : null}
                         sessions={campaignData ? campaignData.sessions : null}
                />
                <MainContent
                    sidebar={isSidebarActive}
                    rollType={rollType}
                    diceValueHandler={handleRollValueUpdate}
                    campaignId={campaignData ? campaignData.id : null}
                    view={mainContentView}
                    characterId={characterId}
                />
                <Footer gameType={GameType.VAMPIRE}/>
            </>
        );
}

// type ChronicleState = {
//     isFetching: boolean
//     campaignData: CampaignInterface
//     stompClient: Client
//     online: OnlineStatusInterface[]
//     rollType?: string
//     dice: {
//         pool: number,
//         hunger: number
//     }
//     rolls: RollValue[],
//     sidebarView: SidebarView
//     mainContentView: MainContentView
//     characterId: string
//     noteId: string
//     sidebarActive: boolean
//     rollSeenIndex: number
//     showSeenRolls: boolean
//     rollAlias: string
// }
// class Chronicle extends Component<ChronicleProps, ChronicleState> {
//
//     constructor(props : ChronicleProps) {
//         super(props);
//         this.state = {
//             isFetching: false,
//             campaignData: null,
//             stompClient: this.initStompClient(this),
//             online: null,
//             dice: {
//                 pool: 1,
//                 hunger: 1
//             },
//             rolls: [],
//             sidebarView: SidebarView.ROLL,
//             mainContentView: MainContentView.NOTES,
//             characterId: null,
//             noteId: null,
//             sidebarActive: false,
//             rollSeenIndex: 0,
//             showSeenRolls: true,
//             rollAlias: null
//         }
//     }
//
//     componentDidMount() {
//         this.fetchChronicle();
//     }
//
//     render() {
//         return (
//             <>
//                 <TopContainer appView={AppView.CHRONICLE}
//                               updateCharacterId={(characterId: string) => this.handleCharacterIdUpdate(characterId)}
//                               online={this.state.online}
//                               sidebar={this.state.sidebarActive}
//                               characterId={this.state.characterId}
//                 />
//                 <Sidebar active={this.state.sidebarActive}
//                          defaultActive={this.props.sidebarDefaultActive}
//                          gameType={GameType.VAMPIRE}
//                          view={this.state.sidebarView}
//                          admin={this.state.campaignData ? this.state.campaignData.admin : false}
//                          onDiceRollChange={(rollType: string) => this.handleDiceRollTypeChange(rollType)}
//                          onDiceValueUpdate={(total: number, hunger: number) =>
//                              this.handleRollValueUpdate(total, hunger)}
//                          viewUpdate={(sidebarView: SidebarView, mainContentView: MainContentView,
//                                       sidebarActive: boolean) =>
//                              this.handleContentViewUpdate(sidebarView, mainContentView, sidebarActive)}
//                          dice={this.state.dice}
//                          rollSeenIndex={this.state.rollSeenIndex}
//                          showSeenRolls={this.state.showSeenRolls}
//                          rollAlias={this.state.rollAlias}
//                          handleRollAliasUpdate={(alias: string) => this.handleRollAliasUpdate(alias)}
//                          campaignId={this.state.campaignData ? this.state.campaignData.id : null}
//                          rolls={this.state.rolls}
//                          characters={this.state.campaignData ? this.state.campaignData.characters : []}
//                          notes={this.state.campaignData ? this.state.campaignData.notes : null}
//                          sessions={this.state.campaignData ? this.state.campaignData.sessions : null}
//                 />
//                 <MainContent
//                     sidebar={this.state.sidebarActive}
//                     rollType={this.state.rollType}
//                     diceValueHandler={this.handleRollValueUpdate}
//                     campaignId={this.state.campaignData ? this.state.campaignData.id : null}
//                     view={this.state.mainContentView}
//                     characterId={this.state.characterId}
//                 />
//                 <Footer gameType={GameType.VAMPIRE}/>
//             </>
//         );
//     }
//
//     fetchChronicleWithFetchAPI = () => {
//         this.setState({...this.state, isFetching: true});
//         if (this.props.id) {
//             sessionStorage.setItem('campaignId', this.props.id);
//         }
//         fetch(getBaseURL() + "vampire/chronicle/" + this.props.id)
//             .then(response => response.json())
//             .then(result => this.setState({...this.state, campaignData: result, isFetching: false}))
//             .catch(e => {
//                 console.error(e);
//                 this.setState({...this.state, isFetching: false});
//             });
//     };
//
//     fetchChronicle = this.fetchChronicleWithFetchAPI;
//
//     handleDiceRollTypeChange(rollType: string) {
//         this.setState({
//             ...this.state,
//             rollType: rollType
//         })
//     }
//
//     handleRollValueUpdate(pool: number, hunger: number): void {
//         this.setState({
//             ...this.state,
//             dice: {
//                 pool: pool,
//                 hunger: hunger
//             }
//         })
//     }
//
//     handleContentViewUpdate(sidebarView: SidebarView,
//                             mainContentView: MainContentView,
//                             sidebarActive: boolean): void {
//         let currentSidebarView = this.state.sidebarView;
//         let currentMainContentView = this.state.mainContentView;
//         let currentRollSeenIndex = this.state.rollSeenIndex;
//         this.setState({
//             ...this.state,
//             sidebarView: sidebarView === SidebarView.NULL ? currentSidebarView : sidebarView,
//             mainContentView: mainContentView === MainContentView.NULL ? currentMainContentView : mainContentView,
//             sidebarActive: sidebarActive,
//             rollSeenIndex: sidebarView === SidebarView.ROLL || currentSidebarView === SidebarView.ROLL ?
//                 this.state.rolls.length : currentRollSeenIndex
//         });
//     }
//
//     handleCharacterIdUpdate(characterId: string): void {
//         this.setState({
//             ...this.state,
//             characterId: characterId,
//             sidebarActive: false,
//             mainContentView: MainContentView.CHARACTERS
//         })
//     }
//
//     handleRollAliasUpdate(alias: string): void {
//         this.setState({
//             ...this.state,
//             rollAlias: alias
//         });
//     }
//
//     initStompClient(self: Chronicle): Client {
//         let socket = new SockJS('/secured/');
//         let stompClient = Stomp.over(socket as WebSocket);
//         stompClient.connect({}, () => {
//             let sessionId = stompClient.ws._transport.url;
//             sessionId = sessionId.substring(0, sessionId.lastIndexOf('/'));
//             sessionId = sessionId.substring(sessionId.lastIndexOf('/') + 1);
//             stompClient.send('/socket/register', {},
//                 JSON.stringify({campaignId:sessionStorage.getItem('campaignId')}));
//             stompClient.subscribe('/secured/online/update', () => {
//                 fetch(getBaseURL() + "campaign/" + self.props.id + '/online')
//                     .then(response => response.json())
//                     .then(result => self.setState({...self.state, online: result, isFetching: false}))
//                     .catch(e => {
//                         console.error(e);
//                         self.setState({...self.state, isFetching: false});
//                     });
//             });
//             stompClient.subscribe('/secured/roll/results', (message: Message) => {
//                 this.props.playSoundHandler(SoundType.DICE)
//                 let diceRoll = JSON.parse(message.body);
//                 self.setState({
//                     ...self.state,
//                     rolls: self.state.rolls.concat(diceRoll),
//                     rollSeenIndex: self.state.sidebarActive || self.props.sidebarDefaultActive ?
//                         self.state.rolls.length + 1 : self.state.rollSeenIndex
//                 });
//             });
//             console.log('/secured/user/' + sessionId + '/roll/results');
//             stompClient.subscribe('/secured/user/' + sessionId + '/roll/results',
//                 (message: Message) => self.handleDiceResults(message, self));
//         });
//         return stompClient;
//     }
//
//     handleDiceResults(message: Message, self: Chronicle) {
//         self.props.playSoundHandler(SoundType.DICE)
//         let diceRoll = JSON.parse(message.body);
//         self.setState({
//             ...self.state,
//             rolls: self.state.rolls.concat(diceRoll),
//             rollSeenIndex: self.state.sidebarActive || self.props.sidebarDefaultActive ?
//                 self.state.rolls.length + 1 : self.state.rollSeenIndex
//         });
//     }
// }
//
// export default Chronicle;