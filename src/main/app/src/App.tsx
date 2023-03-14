import * as React from 'react';
import {useEffect, useState} from 'react';
import './App.css';
import BookList from './components/common/BookList';
import Campaign from "./components/common/Campaign";
import AppView from './data/enum/AppView'
import SoundType from "./data/enum/SoundType";
import useSound from "use-sound";
import {getBaseURL} from "./js/common";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import Util from "./util/Util";
import ErrorPage from "./components/common/ErrorPage";

const diceRoll1File = require('./sound-effects/dice-roll_1.mp3')
const diceRoll2File = require('./sound-effects/dice-roll_2.mp3')
const diceRoll3File = require('./sound-effects/dice-roll_3.mp3')

const bookOpen1File = require('./sound-effects/book/book-open1.mp3')
const bookOpen2File = require('./sound-effects/book/book-open2.mp3')
const bookClose1File = require('./sound-effects/book/book-close1.mp3')

const sidebarOpenFile = require('./sound-effects/sidebar-close.mp3');
const sidebarCloseFile = require('./sound-effects/sidebar-open.mp3');

TimeAgo.addDefaultLocale(en)

export default function App() {

    const [campaignId, setCampaignId] = useState<string>(null);
    const [view, setView] = useState<AppView>(AppView.BOOKS);
    const [sidebarDefaultActive, setSidebarDefaultActive] = useState<boolean>(window.innerWidth >= 1100);

    const handleBookCharacterClick = (bookType: string, campaignId: string) => {
        bookView(bookType, campaignId);
        window.history.pushState('campaign', '', '?bookType=' + bookType + '&campaignId=' + campaignId)
    }

    const bookView = (bookType: string, campaignId: string) => {
        let appView;
        if (bookType) {
            document.body.classList.add(bookType);
            switch (bookType) {
                case "vampire":
                case 'vtm':
                    appView = AppView.CHRONICLE;
                    break;
                case 'dnd':
                default:
                    appView = AppView.CAMPAIGN;
                    break;
            }
        }
        setView(appView);
        setCampaignId(campaignId);
    }

    const handleNewBook = (bookType: string, campaignName: string) => {
        //create new book
        if (campaignName && campaignName !== '') {
            fetch(getBaseURL() + "campaigns/new", {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    gameType: bookType,
                    name: campaignName
                })
            }).then(response => response.text()
            ).then((campaignId) => {
                handleBookCharacterClick(bookType, campaignId)
            });
        } else {
            alert("Please enter a name for the new game (this can be changed later)");
        }
    }

    useEffect(() => {
        window.onpopstate = () => {
            console.log("POPSTATE");
            if (window.location.search !== '') {
                let searchStringVariables = Util.GET_SEARCH_STRING_VARIABLES();
                if (searchStringVariables) {
                    checkForBookPathVariable(searchStringVariables);
                }
            } else {
                setView(AppView.BOOKS);
                document.getElementsByTagName('body').item(0).className = '';
            }
        }

        if (window.location.search !== '') {
            let searchStringVariables = Util.GET_SEARCH_STRING_VARIABLES();
            if (searchStringVariables) {
                checkForBookPathVariable(searchStringVariables);
            }
        }
    },[]);

    const checkForBookPathVariable = (searchStringVariables: Map<string, string>) => {
        if (searchStringVariables.has('bookType') && searchStringVariables.has('campaignId')) {
            bookView(searchStringVariables.get('bookType'), searchStringVariables.get('campaignId'));
        }
    }

    const diceEffects = [
        useSound(diceRoll1File),
        useSound(diceRoll2File),
        useSound(diceRoll3File)
    ];

    const bookOpenEffects = [
        useSound(bookOpen1File,
            {volume: 0.25}),
        useSound(bookOpen2File,
            {volume: 0.25})
    ];

    const bookCloseEffects = [
      useSound(bookClose1File)
    ];

    const [sidebarOpen] = useSound(sidebarOpenFile,
        {volume: 0.25});
    const [sidebarClose] = useSound(sidebarCloseFile,
        {volume: 0.25});

    const handlePlaySound = (soundType: SoundType) => {
        let soundPair;
        switch(soundType) {
            case SoundType.BOOK_OPEN:
                soundPair = bookOpenEffects[Math.floor(Math.random() * bookOpenEffects.length)];
                break;
            case SoundType.BOOK_CLOSE:
                soundPair = bookCloseEffects[Math.floor(Math.random() * bookCloseEffects.length)];
                break;
            case SoundType.DICE:
                soundPair = diceEffects[Math.floor(Math.random() * diceEffects.length)];
                break;
            case SoundType.SIDEBAR_OPEN:
                soundPair = [sidebarOpen];
                break;
            case SoundType.SIDEBAR_CLOSE:
                soundPair = [sidebarClose];

        }

        soundPair[0]();
    }

    const resizeHandler = () => {
        console.log(sidebarDefaultActive);
        if (sidebarDefaultActive && window.innerWidth < 1100) {
            setSidebarDefaultActive(false);
        } else if (!sidebarDefaultActive && window.innerWidth >= 1100) {
            setSidebarDefaultActive(true);
        }
    }

    window.addEventListener("resize", resizeHandler);

    let internalContent;
    let containerClassMod = '';
    switch (view) {
        case AppView.BOOKS:
            internalContent =
                <BookList onClick={(bookType: string, campaignId: string) =>
                    handleBookCharacterClick(bookType, campaignId)}
                          playSoundHandler={(soundType: SoundType) =>
                              handlePlaySound(soundType)}
                          newBookClick={(bookType: string, campaignName: string) =>
                              handleNewBook(bookType, campaignName)}
                />;
            break;
        case AppView.CHRONICLE:
        case AppView.CAMPAIGN:
            internalContent =
                <Campaign id={campaignId}
                           playSoundHandler={(soundType: SoundType) =>
                               handlePlaySound(soundType)}
                           sidebarDefaultActive={sidebarDefaultActive}
                />
            containerClassMod = ' chronicle'
            break;
        default:
            console.log(view);
            internalContent = <ErrorPage/>;
    }
    return <div className={"container" + containerClassMod}>{internalContent}</div>;
}
