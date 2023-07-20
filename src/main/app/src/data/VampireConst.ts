import SidebarView from "./enum/SidebarView";
import MainContentView from "./enum/MainContentView"

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
            admin: false,
            tooltip: 'Dice Rolls'
        },
        {
            id: 'btn-ref',
            view: SidebarView.REFERENCE,
            mainView: MainContentView.NULL,
            admin: false,
            tooltip: 'Rules Reference'
        },
        {
            id: 'btn-notes',
            view: SidebarView.NOTES,
            mainView: MainContentView.NULL,
            admin: false,
            tooltip: 'Session & General Notes'
        },
        {
            id: 'btn-character_sheets',
            view: SidebarView.CHARACTERS,
            mainView: MainContentView.NULL,
            admin: true,
            tooltip: 'Character Sheets'
        },
        {
            id: 'btn-locations',
            view: SidebarView.LOCATIONS,
            mainView: MainContentView.NULL,
            admin: false,
            tooltip: 'In-game Location'
        },
        {
            id: 'btn-maps',
            view: SidebarView.ENCOUNTERS,
            mainView: MainContentView.NULL,
            admin: false,
            tooltip: 'Encounter Maps'
        },
        {
            id: 'btn-sound_effects',
            view: SidebarView.SOUND_EFFECTS,
            mainView: MainContentView.NULL,
            admin: true,
            tooltip: 'Sound Effects & Background Music'
        },
        // {
        //     id: 'btn-relationship_map',
        //     view: SidebarView.NULL,
        //     mainView: MainContentView.RELATIONSHIP_MAP,
        //     admin: false,
        //     tooltip: 'Relationship Map'
        // },
        {
            id: 'btn-chronicle_settings',
            view: SidebarView.SETTINGS,
            mainView: MainContentView.NULL,
            admin: false,
            tooltip: 'Settings'
        }
    ];

    static readonly DISCIPLINE_POWERS = new Map<string, Map<string, DisciplinePowerInterface>>([
        [ "Animalism", new Map<string, DisciplinePowerInterface>([
            ["Bound Famulus", {
                description:"When Blood Bonding an animal, the vampire can make it a famulus, forming a mental link with it and facilitating the use of other Animalism powers. While this power alone does not allow two-way communication with the animal, it can follow simple verbal instructions such as “stay” and “come here.\" It attacks in defense of itself and its master but cannot otherwise be persuaded to fight something it would not normally attack.",
                cost:"The animal must be fed the user’s Blood on three separate nights, each of which requires a Rouse Check by the user. The amount of Blood needed to sustain the ghoulstate of the animal after this is negligible. Players starting with this power have completed this process and can chose a famulus for free.",
                system:"Without the use of Feral Whispers, below, giving commands to the animal requires a Charisma + Animal Ken roll (Difficulty 2); increase Difficulty for more complex orders. A vampire can only have one famulus, but can get a new one if the current one dies. A vampire can use Feral Whispers (Animalism 2) and Subsume the Spirit (Animalism 4) on their famulus for free."
            }],
            ["Sense the Beast", {
                dice_pool:"Resolve + Animalism",
                resist_pool:"Composure + Subterfuge",
                description: "The vampire can sense the Beast present in mortals, vampires, and other supernaturals, gaining a sense of their nature, hunger, and hostility.",
                system:"A win allows the user to sense the level of hostility in a target (whether the person is prepared to do harm or even determined to cause it) and determine whether they harbor a supernatural Beast, marking them as a vampire or werewolf. On a win, a critical gives the user information on the exact type of creature, as well as their Hunger or Rage level. This power can be used both actively and passively, warning the user of aggressive intent in their immediate vicinity."
            }]
        ])],
        [ "Protean", new Map<string, DisciplinePowerInterface>([
            ["Weight of the Feather", {
                dice_pool:"Wits + Survival",
                description:"The vampire can reduce their effective mass and density, making themselves almost weightless. This allows them to avoid triggering pressure sensors as well as avoiding major damage from falls, collisions, or being thrown. The power cannot be used for longer leaps, as the vampire’s strength is proportionally reduced.",
                system:"If the vampire has time to prepare, no roll is required. As a reaction, such as during a sudden fall, activating the power requires a Wits + Survival roll at Difficulty 3. As long as the power is in effect, the vampire is immune to damage from falls, collisions, and being thrown. The user also avoids triggering devices that rely on pressure, at the Storyteller’s discretion."
            }]
        ])]
    ]);


    static readonly SKILLS = ["athletics", "animal ken", "academics", "brawl", "etiquette", "awareness",
        "craft", "insight", "finance", "drive", "intimidation", "investigation", "firearms", "leadership",
        "medicine", "larceny", "performance", "occult", "melee", "persuasion", "politics", "stealth",
        "streetwise", "science", "survival", "subterfuge", "technology"];
}