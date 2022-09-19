import * as React from 'react';
import './App.css';
import BookList from './components/common/BookList';
import Chronicle from './components/vampire/Chronicle'
import AppView from './data/enum/AppView'
import SoundType from "./data/enum/SoundType";
import {useState} from "react";
import useSound from "use-sound";

const diceRoll1File = require('./sound-effects/dice-roll_1.mp3')
const diceRoll2File = require('./sound-effects/dice-roll_2.mp3')
const diceRoll3File = require('./sound-effects/dice-roll_3.mp3')

const bookOpen1File = require('./sound-effects/book/book-open1.mp3')
const bookOpen2File = require('./sound-effects/book/book-open2.mp3')
const bookClose1File = require('./sound-effects/book/book-close1.mp3')

export default function App() {

    window.addEventListener("resize", () => resizeHandler);
    const [campaignId, setCampaignId] = useState(null);
    const [view, setView] = useState(AppView.BOOKS);
    const [sidebarDefaultActive, setSidebarDefaultActive] = useState(false);

    const handleBookCharacterClick = (bookType: string, campaignId: string) => {
        let appView;
        if (bookType) {
            document.body.classList.add(bookType);
            switch (bookType) {
                case "vampire":
                case 'vtm':
                    appView = AppView.CHRONICLE;
                    break;
                case 'dnd':
                    appView = AppView.CAMPAIGN;
                    break;
            }
        }
        setView(appView);
        setCampaignId(campaignId);
    }

    const diceEffects = [
        useSound(diceRoll1File),
        useSound(diceRoll2File),
        useSound(diceRoll3File)
    ];

    const bookOpenEffects = [
        useSound(bookOpen1File),
        useSound(bookOpen2File)
    ];

    const bookCloseEffects = [
      useSound(bookClose1File)
    ];

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
        }

        soundPair[0]();
    }

    const resizeHandler = () => {
        if (sidebarDefaultActive && window.innerWidth < 1100) {
            console.log("HERE")
            setSidebarDefaultActive(false);
        } else if (!sidebarDefaultActive && window.innerWidth >= 1100) {
            console.log("HERE2")
            setSidebarDefaultActive(true);
        }
    }

    let internalContent;
    let containerClassMod = '';
    switch (view) {
        case AppView.BOOKS:
            internalContent =
                <BookList onClick={(bookType: string, campaignId: string) =>
                    handleBookCharacterClick(bookType, campaignId)}
                          playSoundHandler={(soundType: SoundType) =>
                              handlePlaySound(soundType)}
                />;
            break;
        case AppView.CHRONICLE:
            internalContent =
                <Chronicle id={campaignId}
                           playSoundHandler={(soundType: SoundType) =>
                               handlePlaySound(soundType)}
                           sidebarDefaultActive={sidebarDefaultActive}
                />
            containerClassMod = ' chronicle'
            break;
        default:
            console.log(view);
            internalContent = <div className="somethingelse"></div>;
    }
    return <div className={"container" + containerClassMod}>{internalContent}</div>;
}
