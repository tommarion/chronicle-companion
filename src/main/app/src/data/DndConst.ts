import SidebarView from "./enum/SidebarView";
import MainContentView from "./enum/MainContentView";

export default class DndConst {
    static readonly STATS = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    static readonly SKILLS: DndSkillInterface[] = [
        {
            name: 'acrobatics',
            mod: 'dexterity'
        },
        {
            name: 'animal handling',
            mod: 'wisdom'
        },
        {
            name: 'arcana',
            mod: 'intelligence'
        },
        {
            name: 'athletics',
            mod: 'strength'
        },
        {
            name: 'deception',
            mod: 'charisma'
        },
        {
            name: 'history',
            mod: 'intelligence'
        },
        {
            name: 'insight',
            mod: 'wisdom'
        },
        {
            name: 'intimidation',
            mod: 'charisma'
        },
        {
            name: 'investigation',
            mod: 'intelligence'
        },
        {
            name: 'medicine',
            mod: 'wisdom'
        },
        {
            name: 'nature',
            mod: 'intelligence'
        },
        {
            name: 'perception',
            mod: 'wisdom'
        },
        {
            name: 'performance',
            mod: 'charisma'
        },
        {
            name: 'persuasion',
            mod: 'charisma'
        },
        {
            name: 'religion',
            mod: 'intelligence'
        },
        {
            name: 'slight of hand',
            mod: 'dexterity'
        },
        {
            name: 'stealth',
            mod: 'dexterity'
        },
        {
            name: 'survival',
            mod: 'wisdom'
        }
    ];

    static readonly NEW_CHARACTER: DndCharacterInterface = {
        id: null,
        name: null,
        level: 1,
        bio: {
            alias: null,
            race: null,
            class: [],
        },
        sheet: {
            stats: {
                strength: 1,
                dexterity: 1,
                constitution: 1,
                intelligence: 1,
                wisdom: 1,
                charisma: 30
            }
        },
        bioText: null
    };

    static readonly RACES = {
        'Players Handbook': ['aasimar',
            'dragonborn',
            'dwarf',
            'elf',
            'gnome',
            'half-elf',
            'halfling',
            'half-orc',
            'human',
            'tiefling'
        ],
        'Mordenkainen Presents: Monsters of the Multiverse': [
            'Aarakocra',
            'Aasimar',
            'Air Genasi',
            'Bugbear',
            'Centaur',
            'Changeling',
            'Deep Gnome',
            'Duergar',
            'Earth Genasi',
            'Eladrin',
            'Fairy',
            'Firbolg',
            'Fire Genasi',
            'Githyanki',
            'Githzerai',
            'Goblin',
            'Goliath',
            'Harengon',
            'Hobgoblin',
            'Kenku',
            'Kobold',
            'Lizardfolk',
            'Minotaur',
            'Orc',
            'Sea Elf',
            'Shadar-kai',
            'Shifter',
            'Tabaxi',
            'Tortle',
            'Triton',
            'Water Genasi',
            'Yuan-ti'
        ]
    }
    static readonly EXPANSION_CONTENT = [
        "Tasha's Cauldron of Everything",
        "Volo's Guide to Monsters",
        "Xanathar's Guide to Everything",
        "Mordenkainen Presents: Monsters of the Multiverse"
    ]

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
        {
            id: 'btn-chronicle_settings',
            view: SidebarView.SETTINGS,
            mainView: MainContentView.NULL,
            admin: false,
            tooltip: 'Settings'
        }
    ];
}