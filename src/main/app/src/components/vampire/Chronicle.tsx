// import * as React from "react"
// import {Component} from "react"
// import {getBaseURL} from "../../js/common"
// import TopContainer from "../common/TopContainer"
// import Sidebar from '../common/Sidebar'
// import '../../stylesheet/topContainer.css'
// import * as SockJS from 'sockjs-client'
// import {Message} from "stompjs"
// import MainContent from "../common/MainContent"
// import SidebarView from "../../data/enum/SidebarView"
// import MainContentView from "../../data/enum/MainContentView"
// import GameType from "../../data/enum/GameType"
// import {CampaignInterface} from "../../data/CampaignInterface"
// import SoundType from "../../data/enum/SoundType";
// import {NoteContentType} from "../../data/enum/NoteContentType";
// import VampireConst from "../../data/VampireConst";
//
// import {SessionInterface} from "../../data/SessionInterface";
// import VampireFooter from "./VampireFooter";
// import {ClientData} from "../../data/ClientData";
//
//
// const Stomp = require('stompjs');
//
// type ChronicleProps = {
//     id : string
//     playSoundHandler: Function
//     sidebarDefaultActive: boolean
// }
//
// type ChronicleState = {
//     isFetching:         boolean
//     campaignData:       CampaignInterface
//     stompClient:        ClientData
//     online:             OnlineStatusInterface[]
//     rollType?:          string
//     rollName?:          string
//     dice: {
//         pool:               number,
//         hunger:             number
//     }
//     rolls:              RollValue[],
//     sidebarView:        SidebarView
//     mainContentView:    MainContentView
//     characterId:        string
//     characterData:      CharacterSheetInterface
//     noteId:             string
//     sessionIndex:       number
//     sessionContent:     SessionInterface
//     noteType:           NoteContentType
//     noteContent:        NotesInterface
//     locationId:         string
//     sidebarActive:      boolean
//     rollSeenIndex:      number
//     showSeenRolls:      boolean
//     rollAlias:          string
//     rollAliasId:        string
//     notesData:          NotesInterface[]
//     sessionData:        NotesInterface[]
//     characterEditMode:  boolean
// }
// class Chronicle extends Component<ChronicleProps, ChronicleState> {
//
//     constructor(props : ChronicleProps) {
//         super(props);
//         this.state = {
//             isFetching: false,
//             campaignData: null,
//             stompClient: null,
//             online: null,
//             dice: {
//                 pool: 1,
//                 hunger: 1
//             },
//             rolls: [],
//             sidebarView: SidebarView.ROLL,
//             mainContentView: MainContentView.NOTES,
//             characterId: null,
//             characterData: null,
//             noteId: null,
//             sessionIndex: null,
//             sessionContent: null,
//             noteType: NoteContentType.SESSION,
//             noteContent: null,
//             locationId: null,
//             sidebarActive: false,
//             rollSeenIndex: 0,
//             showSeenRolls: true,
//             rollAlias: null,
//             rollAliasId: null,
//             rollType: null,
//             rollName: 'Rouse',
//             notesData: null,
//             sessionData: null,
//             characterEditMode: false
//         }
//     }
//
//     componentDidMount() {
//         console.log( "fetching chronicle" );
//         this.fetchChronicle();
//         this.initStompClient(this);
//     }
//
//     render() {
//         console.log(this.state.rollAlias, this.state.characterId);
//         return (
//             <>
//                 <TopContainer updateCharacterId={(characterId: string) => this.handleCharacterIdUpdate(characterId)}
//                               online={this.state.online}
//                               sidebar={this.state.sidebarActive}
//                               characterId={this.state.characterId}
//                 />
//                 <Sidebar active={this.state.sidebarActive}
//                          defaultActive={this.props.sidebarDefaultActive}
//                          gameType={GameType.VAMPIRE}
//                          view={this.state.sidebarView}
//                          admin={this.state.campaignData ? this.state.campaignData.admin : false}
//                          onDiceRollChange={(rollType: string, rollName: string) =>
//                              this.handleDiceRollTypeChange(rollType, rollName)}
//                          onDiceValueUpdate={(total: number, hunger: number) =>
//                              this.handleRollValueUpdate(total, hunger)}
//                          viewUpdate={(sidebarView: SidebarView, mainContentView: MainContentView,
//                                       sidebarActive: boolean) =>
//                              this.handleContentViewUpdate(sidebarView, mainContentView, sidebarActive)}
//                          dice={this.state.dice}
//                          showSeenRolls={this.state.showSeenRolls}
//                          rollAlias={this.state.rollAlias}
//                          handleRollAliasUpdate={(alias: string, aliasId: string) =>
//                              this.handleRollAliasUpdate(alias, aliasId)}
//                          handleNoteIdUpdate={(noteId: string, sessionIndex: number, type: NoteContentType) =>
//                              this.handleNoteIdUpdate(noteId, sessionIndex, type)}
//                          campaignId={this.state.campaignData ? this.state.campaignData.id : null}
//                          characters={this.state.campaignData ? this.state.campaignData.characters : []}
//                          notes={this.state.notesData}
//                          noteId={this.state.noteId}
//                          sessions={this.state.sessionData}
//                          locationId={this.state.locationId}
//                          handleLocationIdUpdate={(locationId: string) => this.handleLocationIdUpdate(locationId)}
//                          playSoundHandler={(soundType: SoundType) => this.props.playSoundHandler(soundType)}
//                          rollType={this.state.rollType}
//                          rollName={this.state.rollName}
//                          handleNotesUpdate={(notes: NotesInterface[], sessions: NotesInterface[]) =>
//                              this.handleNotesUpdate(notes, sessions)}
//                          addCharacterHandler={this.handleAddCharacter}
//                          stompClient={this.state.stompClient}
//                 />
//                 <MainContent
//                     admin={this.state.campaignData ? this.state.campaignData.admin : false}
//                     gameType={GameType.VAMPIRE}
//                     sidebar={this.state.sidebarActive}
//                     rollType={this.state.rollType}
//                     diceValueHandler={this.handleRollValueUpdate}
//                     campaignId={this.state.campaignData ? this.state.campaignData.id : null}
//                     noteId={this.state.noteId}
//                     noteType={this.state.noteType}
//                     view={this.state.mainContentView}
//                     characterId={this.state.characterId}
//                     sessionIndex={this.state.sessionIndex}
//                     locationId={this.state.locationId}
//                     handleRollTypeClick={(type: string, name: string) =>
//                         this.handleDiceRollTypeChange(type, name)}
//                     handleRollAliasUpdate={(alias: string, aliasId: string) =>
//                         this.handleRollAliasUpdate(alias, aliasId)}
//                     rollAliasActive={this.state.rollAliasId != null && this.state.rollAliasId == this.state.characterId}
//                     characterEditMode={this.state.characterEditMode}
//                 />
//                 <VampireFooter/>
//             </>
//         );
//     }
//
//     fetchChronicleWithFetchAPI = () => {
//         this.setState({...this.state, isFetching: true});
//         if (this.props.id) {
//             sessionStorage.setItem('campaignId', this.props.id);
//         }
//         fetch(getBaseURL() + "campaign/" + this.props.id)
//             .then(response => response.json())
//             .then((result : CampaignInterface) => {
//                 this.setState({
//                     ...this.state,
//                     campaignData: result,
//                     isFetching: false,
//                     notesData: result.notes,
//                     sessionData: result.sessions,
//                     sessionContent: result.sessionContent,
//                     noteId: result.sessions.length > 0 ? result.sessions[0].id : null,
//                     sessionIndex: result.sessions.length > 0 ? result.sessions.length : null
//                 });
//             })
//             .catch(e => {
//                 console.error(e);
//                 this.setState({...this.state, isFetching: false});
//             });
//
//     };
//
//     fetchChronicle = this.fetchChronicleWithFetchAPI;
//
//     handleDiceRollTypeChange(rollType: string, rollName: string) {
//         console.log(rollType);
//         let diceUpdate = this.state.dice;
//         if (this.state.characterData && rollType && rollType.includes(' + ')) {
//             diceUpdate = this.getDiceValues(rollType.split(' + '))
//         }
//         this.setState({
//             ...this.state,
//             rollType:       rollType,
//             rollName:       rollName,
//             dice:           diceUpdate,
//             sidebarView:    SidebarView.ROLL,
//             sidebarActive:  true
//         })
//     }
//
//     getDiceValues(values : string[]) {
//         let pool = 0;
//         let hunger = this.state.characterData.sheet.trackers.hunger;
//         if (values.length == 1) {
//             if (values[0] == 'Rouse') {
//                 return {
//                     pool:   hunger,
//                     hunger: hunger
//                 }
//             }
//         }
//
//         values.forEach((value) => {
//             console.log(value);
//             let attributeValue = this.getAttribute(value.toLowerCase());
//
//             if (attributeValue) {
//                 pool += attributeValue
//             } else if (VampireConst.SKILLS.includes(value.toLowerCase())) {
//                 let skillValue = this.state.characterData.sheet.skills[value.toLowerCase() as keyof typeof this.state.characterData.sheet.skills]
//                 if (skillValue) {
//                     pool += skillValue;
//                 }
//             } else if (VampireConst.DISCIPLINE_POWERS.has(value)) {
//                 let disciplineValue = this.state.characterData.disciplines.find(disc => disc.discipline == value);
//                 if (disciplineValue) {
//                     pool += disciplineValue.level;
//                 }
//             }
//         });
//
//         return {
//             pool:   pool,
//             hunger: hunger
//         }
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
//     handleLocationIdUpdate(locationId: string) {
//         this.setState({
//             ...this.state,
//             locationId: locationId,
//             sidebarActive: false,
//             mainContentView: MainContentView.LOCATIONS
//         });
//     }
//
//     handleContentViewUpdate(sidebarView: SidebarView,
//                             mainContentView: MainContentView,
//                             sidebarActive: boolean): void {
//         if (mainContentView === MainContentView.RELATIONSHIP_MAP && !this.state.campaignData.relationshipMap) {
//             return;
//         }
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
//         if (this.state.sidebarActive) {
//             this.props.playSoundHandler(SoundType.SIDEBAR_CLOSE);
//         }
//         fetch(getBaseURL() + "character/" + characterId)
//             .then(response => response.json())
//             .then(result => {
//                 console.log(result);
//                 this.setState({
//                     ...this.state,
//                     characterId: characterId,
//                     characterData: result,
//                     noteId: null,
//                     noteType: null,
//                     sidebarActive: false,
//                     mainContentView: MainContentView.CHARACTERS
//                 });
//             })
//             .catch(e => {
//                 console.error(e);
//             });
//     }
//
//     handleNoteIdUpdate(noteId: string, sessionIndex: number, type: NoteContentType): void {
//         this.props.playSoundHandler(SoundType.SIDEBAR_CLOSE);
//         this.setState({
//             ...this.state,
//             characterId:        null,
//             noteId:             noteId,
//             noteType:           type,
//             sessionIndex:       sessionIndex,
//             sidebarActive:      false,
//             mainContentView:    MainContentView.NOTES,
//         });
//     }
//
//     handleRollAliasUpdate(alias: string, aliasId: string): void {
//         let updatedAlias = this.state.rollAlias === alias ? null : alias;
//         this.setState({
//             ...this.state,
//             rollAlias:      updatedAlias,
//             rollAliasId:    updatedAlias ? aliasId : null,
//             sidebarActive:  true,
//             sidebarView:    SidebarView.ROLL
//         });
//     }
//
//     initStompClient(self: Chronicle) {
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
//             });
//             console.log('/secured/user/' + sessionId + '/roll/results');
//             stompClient.subscribe('/secured/user/' + sessionId + '/roll/results',
//                 (message: Message) => self.handleDiceResults(message, self));
//
//             self.setState({
//                 ...self.state,
//                 stompClient: {
//                     stompClient: stompClient,
//                     userSessionId: sessionId
//                 }
//             });
//         });
//
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
//
//     getAttribute(value: string): number {
//         let attrArray = Object.entries(this.state.characterData.sheet.attributes.physical);
//         attrArray = attrArray.concat(Object.entries(this.state.characterData.sheet.attributes.social));
//         attrArray = attrArray.concat(Object.entries(this.state.characterData.sheet.attributes.mental));
//         let attrMap = new Map(attrArray);
//         if (attrMap.has(value)) {
//             return attrMap.get(value);
//         }
//         return null;
//     }
//
//
//
//     handleNotesUpdate(notes: NotesInterface[], sessions: NotesInterface[]) {
//         this.setState({
//             ...this.state,
//             notesData:          notes,
//             sessionData:        sessions,
//             noteId:             sessions.length > 0 ? sessions[0].id : null,
//             noteType:           NoteContentType.SESSION,
//             sessionIndex:       0,
//             sidebarActive:      false,
//             mainContentView:    MainContentView.NOTES
//         });
//     }
//
//     handleAddCharacter = () => {
//         this.setState({
//             ...this.state,
//             mainContentView:    MainContentView.CHARACTERS,
//             noteId:             null,
//             sessionIndex:       null,
//             sidebarActive:      false,
//             characterId:        null,
//             characterData:      null,
//             characterEditMode:  true
//         })
//     }
// }
//
// export default Chronicle;