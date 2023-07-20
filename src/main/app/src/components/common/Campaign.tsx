import * as React from "react"
import {useEffect, useState} from "react"
import TopContainer from "./TopContainer"
import Sidebar from './Sidebar'
import '../../stylesheet/topContainer.css'
import MainContent from "./MainContent"
import SidebarView from "../../data/enum/SidebarView"
import MainContentView from "../../data/enum/MainContentView"
import GameType, {getGameType} from "../../data/enum/GameType"
import {CampaignInterface} from "../../data/CampaignInterface"
import SoundType from "../../data/enum/SoundType";
import {NoteContentType} from "../../data/enum/NoteContentType";
import {ClientData} from "../../data/ClientData";
import VampireFooter from "../vampire/VampireFooter";
import {getBaseURL} from "../../js/common";
import * as SockJS from "sockjs-client";
import VampireConst from "../../data/VampireConst";
import DndFooter from "../dnd/DndFooter";
import {isMobile} from "react-device-detect";

const Stomp = require('stompjs');

type CampaignProps = {
    id : string
    playSoundHandler: Function
    sidebarDefaultActive: boolean
}

type DicePool = {
    vampire: {
        pool: number
        hunger: number
    },
    dnd: Map<number, DndDieData>
}
export default function Campaign(props: CampaignProps) {
    const [campaignData, setCampaignData] = useState<CampaignInterface>(null);
    const [stompClient, setStompClient] = useState<ClientData>(null);
    const [online, setOnline] = useState<OnlineStatusInterface[]>(null);
    const [sidebarActive, setSidebarActive] = useState<boolean>(false);
    const [sidebarView, setSidebarView] = useState<SidebarView>(SidebarView.ROLL);
    const [mainContentView, setMainContentView] = useState<MainContentView>(MainContentView.NOTES);
    const [noteType, setNoteType] = useState<NoteContentType>(NoteContentType.SESSION);

    const [rollType, setRollType] = useState<string>(null);
    const [rollName, setRollName] = useState<string>("Rouse");
    const [rollAlias, setRollAlias] = useState<string>(null);
    const [rollAliasId, setRollAliasId] = useState<string>(null);

    const [notesBtnData, setNotesBtnData] = useState<NotesInterface[]>(null);
    const [sessionBtnData, setSessionBtnData] = useState<NotesInterface[]>(null);
    const [sessionIndex, setSessionIndex] = useState<number>(null);
    const [characterEditMode, setCharacterEditMode] = useState<boolean>(false);

    const [characterId, setCharacterId] = useState<string>(null);
    const [noteId, setNoteId] = useState<string>(null);
    const [locationId, setLocationId] = useState<string>(null);

    const [showSeenRolls, setShowSeenRolls] = useState<boolean>(true);

    const [dndCharacterData, setDndCharacterData] = useState<DndCharacterInterface>(null);
    const [vampireCharacterData, setVampireCharacterData] = useState<CharacterSheetInterface>(null);

    const [tooltip, setToolTip] = useState<TooltipData>(null);

    const [dice, setDice] = useState<DicePool>({
        vampire: {
            pool:   1,
            hunger: 1
        },
        dnd: new Map([[20, {value:1, modifier: 0}]])
    });

    const updateTooltip = (e: React.MouseEvent<HTMLDivElement>, text: string) => {
        if (isMobile) {
            return;
        }
        if (e === null) {
            setToolTip(null);
        } else {
            setToolTip({
                xPos: e.clientX + 15,
                yPos: e.clientY + 15,
                text: text
            });
        }
    }

    useEffect(() => {
        console.log( "fetching chronicle" );
        fetchChronicle();
        initStompClient();
    }, [props.id]);

    const fetchChronicle = () => {
        if (props.id) {
            sessionStorage.setItem('campaignId', props.id);
        }
        fetch(getBaseURL() + "campaign/" + props.id)
            .then(response => response.json())
            .then((result : CampaignInterface) => {
                setCampaignData(result);
                setNotesBtnData(result.notes);
                setSessionBtnData(result.sessions);
                setNoteId(result.sessions.length > 0 ? result.sessions[0].id : null);
                setSessionIndex(result.sessions.length > 0 ? result.sessions.length : null);
                handleRollName();
            })
            .catch(e => console.error(e));
    };

    const initStompClient = () => {
        let socket = new SockJS('/secured/');
        let stompClient = Stomp.over(socket as WebSocket);

        stompClient.connect({}, () => {
            let sessionId = stompClient.ws._transport.url;
            sessionId = sessionId.substring(0, sessionId.lastIndexOf('/'));
            sessionId = sessionId.substring(sessionId.lastIndexOf('/') + 1);

            stompClient.send('/socket/register', {},
                JSON.stringify({campaignId: sessionStorage.getItem('campaignId')}));
            stompClient.subscribe('/secured/campaign/' + props.id + '/online/update', () => {
                fetch(getBaseURL() + "campaign/" + props.id + '/online')
                    .then(response => response.json())
                    .then(result => setOnline(result))
                    .catch(e => console.error(e));
            });
            setStompClient({
                stompClient: stompClient,
                userSessionId: sessionId
            });
        });
    }

    const handleCharacterIdUpdate = (characterId: string) => {
        if (sidebarActive) {
            props.playSoundHandler(SoundType.SIDEBAR_CLOSE);
            setSidebarActive(false);
        }

        setCharacterId(characterId);
        setNoteId(null);
        setNoteType(null);
        setMainContentView(MainContentView.CHARACTERS);
    }

    const handleRollAliasUpdate = (alias: string, aliasId: string) => {
        setRollAlias(alias);
        setRollAliasId(aliasId);
        setSidebarActive(true);
        setSidebarView(SidebarView.ROLL);
    }

    const handleVampireDiceRollTypeChange = (type: string, name: string) => {
        console.log(type, name, vampireCharacterData);
        let diceUpdate = dice
        if (vampireCharacterData && type) {
            diceUpdate = {
                vampire: getVampireDiceValues(type.includes(' + ') ? type.split(' + ') : [type]),
                dnd: dice.dnd
            }
        }
        setRollType(type);
        setRollName(name);
        setDice(diceUpdate);
        setSidebarView(SidebarView.ROLL);
        setSidebarActive(true);
    }

    const getVampireDiceValues = (values : string[]) => {
        let pool = 0;
        let hunger = vampireCharacterData.sheet.trackers.hunger;
        if (values.length == 1) {
            if (values[0] == 'Rouse') {
                return {
                    pool:   hunger,
                    hunger: hunger
                }
            }
        }

        values.forEach((value) => {
            console.log(value);
            let attributeValue = getAttribute(value.toLowerCase());

            if (attributeValue) {
                pool += attributeValue
            } else if (VampireConst.SKILLS.includes(value.toLowerCase())) {
                let skillValue = vampireCharacterData.sheet.skills[value.toLowerCase() as keyof typeof this.state.characterData.sheet.skills]
                if (skillValue) {
                    pool += skillValue;
                }
            } else if (VampireConst.DISCIPLINE_POWERS.has(value)) {
                let disciplineValue = vampireCharacterData.disciplines.find(disc => disc.discipline == value);
                if (disciplineValue) {
                    pool += disciplineValue.level;
                }
            }
        });

        return {
            pool:   pool,
            hunger: hunger
        }
    }
    const getAttribute = (value: string) : number => {
        let attrArray = Object.entries(vampireCharacterData.sheet.attributes.physical);
        attrArray = attrArray.concat(Object.entries(vampireCharacterData.sheet.attributes.social));
        attrArray = attrArray.concat(Object.entries(vampireCharacterData.sheet.attributes.mental));
        let attrMap = new Map<string, number>(attrArray);
        if (attrMap.has(value)) {
            return attrMap.get(value);
        }
        return null;
    }

    const handleVampireRollValueUpdate = (pool: number, hunger: number) => {
        setDice({
            vampire: {
                pool: pool,
                hunger: hunger
            },
            dnd: dice.dnd
        });
    }

    const handleDndRollValueUpdate = (dndDice: Map<number, DndDieData>) => {
        setDice({
            vampire: dice.vampire,
            dnd: dndDice
        });
    }

    let handleRollValueUpdate: Function, handleDiceRollTypeChange: Function, footer: JSX.Element;
    if (campaignData) {
        switch (getGameType(campaignData.gameType)) {
            case GameType.DND:
                handleRollValueUpdate = handleDndRollValueUpdate;
                footer = <DndFooter/>;
                break;
            case GameType.VAMPIRE:
                handleRollValueUpdate = handleVampireRollValueUpdate;
                handleDiceRollTypeChange = handleVampireDiceRollTypeChange;
                footer = <VampireFooter/>;
        }
    }

    const handleRollName = () => {
        if (campaignData) {
            switch (getGameType(campaignData.gameType)) {
                case GameType.DND:
                    setRollName("Initiative");
                    break;
                case GameType.VAMPIRE:
                    setRollName("Rouse");
            }
        }
    }
    const handleContentViewUpdate = (sidebar: SidebarView, mainContent: MainContentView, active: boolean) => {
        if (mainContentView === MainContentView.RELATIONSHIP_MAP && !campaignData.relationshipMap) {
            return;
        }
        if (sidebar !== SidebarView.NULL) {
            setSidebarView(sidebar);
        }
        if (mainContent !== MainContentView.NULL) {
            setMainContentView(mainContent);
        }
        setSidebarActive(active);
    }

    const handleNoteIdUpdate = (note: string, session: number, type: NoteContentType) => {
        props.playSoundHandler(SoundType.SIDEBAR_CLOSE);
        setNoteId(note);
        setNoteType(type);
        setSessionIndex(session);
        setSidebarActive(false);
        setMainContentView(MainContentView.NOTES);
        setCharacterId(null);
        setVampireCharacterData(null);
        setLocationId(null);
    }

    const handleLocationIdUpdate = (location: string) => {
        setLocationId(location);
        setSidebarActive(false);
        setMainContentView(MainContentView.LOCATIONS);
        setCharacterId(null);
        setNoteId(null);
        setNoteType(null);
    }

    const handleNotesUpdate = (notes: NotesInterface[], sessions: NotesInterface[]) => {
        setNotesBtnData(notes);
        setSessionBtnData(sessions);
    }

    const handleAddCharacter = () => {
        setMainContentView(MainContentView.CHARACTERS);
        setSidebarActive(false);
        setCharacterId(null);
        setCharacterEditMode(true);
    }

    return (
        <>
            <TopContainer updateCharacterId={handleCharacterIdUpdate}
                          online={online}
                          sidebar={sidebarActive}
                          characterId={characterId}
            />
            <Sidebar active={sidebarActive}
                     defaultActive={props.sidebarDefaultActive}
                     gameType={campaignData ? getGameType(campaignData.gameType) : GameType.NULL}
                     view={sidebarView}
                     admin={campaignData ? campaignData.admin : false}
                     onDiceRollChange={handleDiceRollTypeChange}
                     onDiceValueUpdate={handleRollValueUpdate}
                     viewUpdate={handleContentViewUpdate}
                     dice={dice}
                     showSeenRolls={showSeenRolls}
                     rollAlias={rollAlias}
                     handleRollAliasUpdate={handleRollAliasUpdate}
                     handleNoteIdUpdate={handleNoteIdUpdate}
                     campaignId={campaignData ? campaignData.id : null}
                     characters={campaignData ? campaignData.characters : []}
                     notes={notesBtnData}
                     noteId={noteId}
                     sessions={sessionBtnData}
                     locationId={locationId}
                     handleLocationIdUpdate={handleLocationIdUpdate}
                     playSoundHandler={props.playSoundHandler}
                     rollType={rollType}
                     rollName={rollName}
                     handleNotesUpdate={handleNotesUpdate}
                     addCharacterHandler={handleAddCharacter}
                     stompClient={stompClient}
                     handleUpdateTooltip={updateTooltip}
            />
            <MainContent
                admin={campaignData ? campaignData.admin : false}
                gameType={GameType.VAMPIRE}
                sidebar={sidebarActive}
                rollType={rollType}
                diceValueHandler={handleRollValueUpdate}
                campaignId={campaignData ? campaignData.id : null}
                noteId={noteId}
                noteType={noteType}
                view={mainContentView}
                characterId={characterId}
                sessionIndex={sessionIndex}
                locationId={locationId}
                handleRollTypeClick={handleDiceRollTypeChange}
                handleRollAliasUpdate={handleRollAliasUpdate}
                rollAliasActive={rollAliasId != null && rollAliasId == characterId}
                characterEditMode={characterEditMode}
                handleCharacterSheet={(characterSheet: CharacterSheetInterface) => {
                    setVampireCharacterData(characterSheet)
                    console.log(characterSheet);
                }}
            />
            {tooltip ? <div style={{left: tooltip.xPos, top: tooltip.yPos}} className={'tooltip'}>{tooltip.text}</div> : null}
            {footer}
        </>
    );
}