import SidebarView from "./enum/SidebarView";
import MainContentView from "./enum/MainContentView"
import UIfx from 'uifx'
const diceRoll1 = require('../sound-effects/dice-roll_1.mp3')
const diceRoll2 = require('../sound-effects/dice-roll_2.mp3')
const diceRoll3 = require('../sound-effects/dice-roll_3.mp3')

export default class VampireConst {
    static readonly ROLL_ACTION_REFERENCE = new Map<string, number>([
        ['Camouflage in Nature' 				, 0],
        ['Urban Camouflage' 					, 2],
        ['Create Hidden Compartment' 			, 3],
        ['Order Hidden Compartment Made' 		, 4],
        ['Clean Up Murder Scene' 				, 5],
        ['Create Explosive' 					, 6],
        ['Crafting Bomb with Explosive' 		, 7],
        ['Blowing Safe with Bomb' 				, 8],
        ['Demolishing Building with Bomb' 		, 9],
        ['Throwing' 							, 10],
        ['Perceive Something in the Moment' 	, 1],
        ['Notice' 								, 1],
        ['Perceive Something and Identify' 		, 11],
        ['Search' 								, 11],
        ['Perceive Something while Distracted' 	, 12],
        ['Tracking' 							, 13],
        ['Driving Quick Maneuvers' 				, 14],
        ['Driving Rough Weather' 				, 15],
        ['Vehicle Chase'						, 15],
        ['Climbing / Falling'					, 10],
        ['Lifting'								, 16],
        ['Lifting Sustained'					, 17],
        ['Picking Lock'							, 18],
        ['Dodging Laser Sensor'					, 18],
        ['Cracking a Safe'						, 19],
        ['Bypassing Alarm Circuit'				, 19],
        ['Noticing Hidden Camera'				, 20],
        ['Breaking a Lock'						, 21],
        ['Setting up Security System'			, 19],
        ['Disable or Hack Electronic System'	, 7],
        ['Short Sprint'							, 10],
        ['Long Sprint'							, 17],
        ['Shadowing'							, 1],
        ['Notice Shadower' 						, 23],
        ['Remain Hidden After Noticed Shadowing', 24],
        ['Pickpocketing'						, 18],
        ['Sneaking'								, 25],
        ['Convince Others to Relax'				, 26],
        ['Scam'									, 27],
        ['Identify Scam'						, 28],
        ['Fast-talk'							, 29],
        ['Resist Fast-talker'					, 30],
        ['Interrogation'						, 31],
        ['Resist Interrogation'					, 32],
        ['Torture'								, 33],
        ['Resist Torture'						, 34],
        ['Intimidation'							, 35],
        ['Resist Intimidation'					, 34],
        ['Violent Intimidation (& Resist)'		, 36],
        ['Public Speaking'						, 37],
        ['Prepare Public Speech'				, 38],
        ['Courting'								, 39],
        ['Flirting'								, 26],
        ['Seducing'								, 40],
        ['Gun - Shootout'						, 41],
        ['Gun - While In Motion'				, 42],
        ['Gun - Sniping / Careful'				, 43],
        ['Dodging'								, 10],
        ['Punching / Kicking / Blocking'		, 44],
        ['Bashing'								, 44],
        ['Arial / Falling Attack'				, 45],
        ['Knife - Stabbing / Slashing'			, 46],
        ['Sword - Stabbing / Slashing'			, 47],
        ['Rouse'								, -1],
        ['Willpower'							, -1],
        ['Remorse'								, -1],
        ['Frenzy'								, -1]
    ]);
    static readonly ROLL_REFERENCE = [
        'Intelligence + Survival', 			// 0
        'Wits + Awareness',
        'Intelligence + Streetwise',
        'Intelligence + Craft',
        'Intelligence + Academics',
        'Resolve + Larceny',				// 5
        'Intelligence + Science',
        'Intelligence + Technology',
        'Intelligence + Larceny',
        'Intelligence + Science',
        'Dexterity + Athletics',			// 10
        'Intelligence + Awareness',
        'Resolve + Awareness',
        'Wits + Survival',
        'Dexterity + Drive',
        'Wits + Drive',						// 15
        'Strength + Athletics',
        'Stamina + Athletics',
        'Dexterity + Larceny',
        'Intelligence + Larceny',
        'Wits + Larceny',					// 20
        'Strength + Larceny',
        'Wits + Athletics',
        'Resolve + Streetwise',
        'Wits + Stealth',
        'Dexterity + Stealth',				// 25
        'Charisma + Insight',
        'Manipulation + Subterfuge',
        'Wits + Insight',
        'Charisma + Subterfuge',
        'Composure + Insight',				// 30
        'Manipulation + Insight',
        'Wits + Composure',
        'Manipulation + Interrogation',
        'Composure + Resolve',
        'Manipulation + Intimidation',		// 35
        'Strength + Intimidation',
        'Charisma + Performance',
        'Intelligence + Insight',
        'Composure + Etiquette',
        'Wits + Subterfuge',				//40
        'Composure + Firearms',
        'Dexterity + Firearms',
        'Stamina + Firearms',
        'Strength + Brawl',
        'Dexterity + Brawl',				// 45
        'Dexterity + Melee',
        'Strength + Melee',
    ];

    static readonly SIDEBAR_BTNS = [
        {
            id: 'btn-roll',
            view: SidebarView.ROLL,
            mainView: MainContentView.NULL,
            admin: false
        },
        {
            id: 'btn-ref',
            view: SidebarView.REFERENCE,
            mainView: MainContentView.NULL,
            admin: false
        },
        {
            id: 'btn-notes',
            view: SidebarView.NOTES,
            mainView: MainContentView.NULL,
            admin: false
        },
        {
            id: 'btn-character_sheets',
            view: SidebarView.CHARACTERS,
            mainView: MainContentView.NULL,
            admin: false
        },
        {
            id: 'btn-locations',
            view: SidebarView.LOCATIONS,
            mainView: MainContentView.NULL,
            admin: false
        },
        {
            id: 'btn-maps',
            view: SidebarView.ENCOUNTERS,
            mainView: MainContentView.NULL,
            admin: false
        },
        {
            id: 'btn-sound_effects',
            view: SidebarView.SOUND_EFFECTS,
            mainView: MainContentView.NULL,
            admin: true
        },
        {
            id: 'btn-relationship_map',
            view: SidebarView.NULL,
            mainView: MainContentView.RELATIONSHIP_MAP,
            admin: false
        },
        {
            id: 'btn-chronicle_settings',
            view: SidebarView.SETTINGS,
            mainView: MainContentView.NULL,
            admin: false
        }
    ];
}