import { setDiceHandlers } from './dice.js';
import { loadAppData } from './files.js';
import { getAccount, getToken } from '../common/cache.js';

const FILENAME = "app-settings.vtm";
const SETTINGS_DIR = "static/settings/";

export const LEFT_CLICK = 'left-click';
export const RIGHT_CLICK = 'right-click';

export const DAMAGE_SUPERFICIAL = 'superficial';
export const DAMAGE_AGGRAVATED = 'aggravated';
export const DAMAGE_STAINS = 'stains';

export const VALUE_TYPE_TRACKERS = 'tracker';

export const MAX_HUNGER = 5;
export const HUNGER_LEVEL = 'level';
export const TRACKER_MAX = 'maxlevel';

export const REROLL_SUCCESS 	= 'Re-roll Successes';
export const REROLL_FAILURE 	= 'Re-roll Failures';
export const REROLL_CRIT 		= 'Re-roll Crits';

export const ICON_MAP = {
	REROLL_SUCCESS: 'icon_success',
	REROLL_FAILURE: 'icon_failure',
	REROLL_CRIT: 'icon_critical_success'
};

export const STORYTELLER = 'Storyteller';
export const DM = 'DM';
export const GM = 'GM';

export const CUSTOM = 'Custom Roll';
export const ROUSE = 'Rouse';
export const DEX_ATH = 'Dexterity + Athletics';
export const STR_BRW = 'Strength + Brawl';
export const WTS_AWR = 'Wits + Awareness';
export const CHA_PER = 'Charisma + Persuasion';
export const MAN_ITD = 'Manipulation + Intimidation';
export const MAN_SUB = 'Manipulation + Subterfuge';
export const WILL = 'Willpower';
export const REMORSE = 'Remorse';
export const FRENZY = 'Frenzy';

export const KINDRED = 'Kindred';
export const GHOUL = 'Ghoul';
export const MORTAL = 'Mortal';
export const WEREWOLF = 'Werewolf';
export const TREMERE = 'Tremere';
export const ANIMAL = 'Animal';

export const BLOOD_SORCERY_RITUALS = 'Blood Sorcery Rituals';

export const DISCIPLINE_OPTION_DEFAULT = 'Select Discipline';

export const ENABLE = 'enable';
export const DISABLE = 'disable';

export const LIMITED_SHEET = [ 'Mortal', 'Ghoul', 'Animal', 'Hunter' ];


// Crazy bloat, load this stuff from files

export const PREDATOR_TYPES = [ "Alleycat", "Bagger", "Blood Leech", "Cleaver", "Consensualist", "Farmer", "Osiris",
	"Sandman", "Scene Queen", "Siren" ];

export const CHARACTER_SKILLS = ["athletics", "animal ken", "academics", "brawl", "etiquette", "awareness", 
	"craft", "insight", "finance", "drive", "intimidation", "investigation", "firearms", "leadership", 
	"medicine", "larceny", "performance", "occult", "melee", "persuasion", "politics", "stealth",
	"streetwise", "science", "survival", "subterfuge", "technology"];
export const CHARACTER_ATTRIBUTES = [
	{
		"type" : "physical",
		"attributes" : ["strength", "dexterity", "stamina"]
	},
	{
		"type" : "social",
		"attributes" : ["charisma", "manipulation", "composure"]
	},
	{
		"type": "mental",
		"attributes" : ["intelligence", "wits", "resolve"]
	}
];

export const TRACKERS = ["health", "willpower", "humanity", "hunger"];

export const CLANS = [ "Brujah", "Gangrel", "Hecata", "Lasombra", "Malkavian", "Ministry", "Nosferatu", "Toreador", 
	"Tremere", "Tzimisce", "Ventrue", "Thin-blood", "Caitiff" ];

for ( let clan in CLANS) {

	$( '#character_clan' ).append( '<option>' + CLANS[clan] + '</option>' );
	$( '#randomize_clan' ).append( '<option>' + CLANS[clan] + '</option>' );
}
export var DISCIPLINES = { 
	"Animalism" : [
		[{
			"name" : "Bound Famulus",
			"description" : "",
			"rouse" : "",
			"roll" : "",
			"resist" : ""
		}, {
			"name" : "Sense the Beast"
		}],
		[{
			"name" : "Feral Whispers"
		}, {
			"name" : "Atavism"
		}],
		[{
			"name" : "Animal Succulence"
		}, {
			"name" : "Quell the Beast"
		}, {
			"name" : "Unliving Hive",
			"amalgam" : {
				"name" : "Obfuscate",
				"level" : 2
			}
		}],
		[{
			"name" : "Subsume the Spirit"
		}],
		[{
			"name" : "Animal Dominion"
		},{
			"name" : "Drawing out the Beast"
		}]
	], 
	"Auspex" : [
		[{
			"name" : "Heightened Senses"
		},{
			"name" : "Sense the Unseen"
		}],
		[{
			"name" : "Premonition"
		}, {
			"name" : "Obeah",
			"amalgam" : {
				"name" : "Fortitude",
				"level" : 1
			}
		}, {
			"name" : "Unerring Pursuit",
			"amalgam" : {
				"name" : "Dominate",
				"level" : 1
			}
		}],
		[{
			"name" : "Scry the Soul"
		}, {
			"name" : "Share the Senses"
		}],
		[{
			"name" : "Spirit's Touch"
		}],
		[{
			"name" : "Clairvoyance"
		}, {
			"name" : "Possession",
			"amalgam" : {
				"name" : "Dominate",
				"level" : 3
			}
		}, {
			"name" : "Telepathy"
		}, {
			"name" : "Unburdening the Bestial Soul",
			"amalgam" : {
				"name" : "Dominate",
				"level" : 3
			},
			"requirement" : {
				"discipline" : "Auspex",
				"level" : 2,
				"name" : "Obeah"
			}
		}]
	],
	"Blood Sorcery" : [
		[{
			"name" : "Corrosive Vitae"
		}, {
			"name" : "A Taste for Blood"
		}, {
			"name" : "Shape of the Sanguine Sacrament"
		}],
		[{
			"name" : "Extinguish Vitae"
		}],
		[{
			"name" : "Blood of Potency"
		}, {
			"name" : "Scorpion's Touch"
		}],
		[{
			"name" : "Theft of Vitae"
		}],
		[{
			"name" : "Baal's Caress"
		}, {
			"name" : "Cauldron of Blood"
		}]
	],
	"Blood Sorcery Rituals" : [
		[ "Blood Walk", "Bloody Message", "Clinging of the Insect", "Coax the Garden", "Craft Bloodstone", "Dampen the Fear", 
			"Herd Ward", "Letter Ward", "Unseen Underground", "Wake with Evening's Freshness", "Ward Against Ghouls"],
		[ "Calling the Aura's Remnant", "Communicate with Kindred Sire", "Eyes of Babel", "Illumate the Trail of Prey", "Ishtar's Touch",
			"Truth of Blood", "Ward Against Spirits", "Warding Circle Against Ghouls" ],
		[ "Bladed Hands", "Dagon's Call", "Deflection of Wooden Doom", "Essence of Air", "Eyes of the Past", "Fire in the Blood",
			"Firewalker", "Gentle Mind", "Haunted House", "Illusion of Peaceful Death", "Illusion of Perfection", "Once with the Blade",
			"Sanguine Watcher", "Sleep of Judas", "The Unseen Change", "Ward Against Lupines", "Warding Circle Against Spirits" ],
		[ "Defense of the Sacred Haven", "Eyes of the Nighthawk", "Incorporeal Passage", "Innocence of the Child's Heart", "Protean Curse",
			"Rending the Sweet Earth", "Ward Against Cainites", "Warding Circle Against Lupines", "Web of Hunger" ],
		[ "Creatio Ignis", "Eden's Bounty", "Escape to True Sanctuary", "Heart of Stone", "Shaft of Belated Dissolution", 
			"The Ritual of Transferring the Soul", "Warding Circle Against Cainites" ]
	],
	"Celerity" : [
		[{
			"name" : "Cat's Grace"
		}, {
			"name" : "Rapid Reflexes"
		}],
		[{
			"name" : "Fleetness"
		}],
		[{
			"name" : "Blink"
		}, {
			"name" : "Traversal"
		}],
		[{
			"name" : "Draught of Elegance"
		}, {
			"name" : "Unerring Aim"
		}],
		[{
			"name" : "Lightning Strike"
		}, {
			"name" : "Split Second"
		}]
	],
	"Dominate" : [
		[{
			"name" : "Cloud Memory"
		}, {
			"name" : "Compel"
		}],
		[{
			"name" : "Mesmerize"
		}, {
			"name" : "Dementation",
			"amalgam" : {
				"name" : "Obfuscate",
				"level" : 2
			}
		}, {
			"name" : "Slavish Devotion",
			"amalgam" : {
				"name" : "Presence",
				"level" : 1
			}
		}, {
			"name" : "Domitor's Favor"
		}],
		[{
			"name" : "Forgetful Mind"
		}, {
			"name" : "Submerged Directive"
		}],
		[, {
			"name" : "Ancestral Dominion",
			"amalgam" : {
				"name" : "Blood Sorcery",
				"level" : 3
			}
		}, {
			"name" : "Rationalize"
		}],
		[, {
			"name" : "Mass Manipulation"
		}, {
			"name" : "Terminal Decree"
		}]
	],
	"Fortitude" : [
		[{
			"name" : "Resilience"
		}, {
			"name" : "Unswayable Mind"
		}],
		[{
			"name" : "Toughness"
		}, {
			"name" : "Enduring Beasts",
			"amalgam" : {
				"name" : "Animalism",
				"level" : 1
			}
		}, {
			"name" : "Obdurate",
			"amalgam" : {
				"name" : "Potence",
				"level" : 2
			}
		}, {
			"name" : "Valeren",
			"amalgam" : {
				"name" : "Auspex",
				"level" : 1
			}
		}],
		[{
			"name" : "Defy Bane"
		}, {
			"name" : "Fortify the Inner Facade"
		}],
		[{
			"name" : "Draught of Endurance"
		}, {
			"name" : "Shatter",
			"requirement" : {
				"discipline" : "Fortitude",
				"level" : 2,
				"name" : "toughness"
			}
		}],
		[{
			"name" : "Flesh of Marble"
		}, {
			"name" : "Prowess of Pain"
		}]
	],
	"Obfuscate" : [
		[{
			"name" : "Cloak of Shadows"
		}, {
			"name" : "Silence of Death"
		}],
		[{
			"name" : "Unseen Passage"
		}, {
			"name" : "Chimerstry",
			"amalgam" : {
				"name" : "Presence",
				"level" : 1
			}
		}, {
			"name" : "Ventriloquism",
			"amalgam" : {
				"name" : "Auspex",
				"level" : 2
			}
		}],
		[{
			"name" : "Ghost in the Machine"
		}, {
			"name" : "Mask of a Thousand Faces"
		}, {
			"name" : "Fata Morgana",
			"amalgam" : {
				"name" : "Presence",
				"level" : 2
			}
		}, {
			"name" : "Mental Maze",
			"amalgam" : {
				"name" : "Dominate",
				"level" : 1
			}
		}],
		[{
			"name" : "Conceal",
			"amalgam" : {
				"name" : "Auspex",
				"level" : 3
			}
		}, {
			"name" : "Vanish",
			"requirement": {
				"discipline" : "Obfuscate",
				"level" : 1,
				"name" : "Cloak of Shadows"
			}
		}],
		[{
			"name" : "Cloak the Gathering"
		}, {
			"name" : "Imposter's Guise"
		}]
	], 
	"Oblivion" : [
		[{
			"name" : "Cloak of Shadows"
		}, {
			"name" : "Silence of Death"
		}],
		[{
			"name" : "Unseen Passage"
		}, {
			"name" : "Chimerstry",
			"amalgam" : {
				"name" : "Presence",
				"level" : 1
			}
		}, {
			"name" : "Ventriloquism",
			"amalgam" : {
				"name" : "Auspex",
				"level" : 2
			}
		}],
		[{
			"name" : "Ghost in the Machine"
		}, {
			"name" : "Mask of a Thousand Faces"
		}, {
			"name" : "Fata Morgana",
			"amalgam" : {
				"name" : "Presence",
				"level" : 2
			}
		}, {
			"name" : "Mental Maze",
			"amalgam" : {
				"name" : "Dominate",
				"level" : 1
			}
		}],
		[{
			"name" : "Conceal",
			"amalgam" : {
				"name" : "Auspex",
				"level" : 3
			}
		}, {
			"name" : "Vanish",
			"requirement": {
				"discipline" : "Obfuscate",
				"level" : 1,
				"name" : "Cloak of Shadows"
			}
		}],
		[{
			"name" : "Cloak the Gathering"
		}, {
			"name" : "Imposter's Guise"
		}]
	], 
	"Potence" : [
		[{
			"name" : "Lethal Body"
		}, {
			"name" : "Soaring Leap"
		}],
		[{
			"name" : "Prowess"
		}],
		[{
			"name" : "Brutal Feed"
		}, {
			"name" : "Spark of Rage"
		}, {
			"name" : "Uncanny Grip"
		}],
		[{
			"name" : "Draught of Might"
		}],
		[{
			"name" : "Earthshock"
		}, {
			"name" : "Fist of Caine"
		}]
	],
	"Presence" : [
		[{
			"name" : "Awe"
		}, {
			"name" : "Daunt"
		}, {
			"name" : "Eyes of the Serpent",
			"amalgam" : {
				"name" : "Protean",
				"level" : 1
			}
		}],
		[{
			"name" : "Lingering Kiss"
		}],
		[{
			"name" : "Dread Gaze"
		}, {
			"name" : "Entrancement"
		}, {
			"name" : "True Love's Face"
		}],
		[{
			"name" : "Irresistible Voice",
			"amalgam" : {
				"name" : "Dominate",
				"level" : 1
			}
		}, {
			"name" : "Summon"
		}, {
			"name" : "Magnum Opus",
			"amalgam" : {
				"name" : "Auspex",
				"level" : 3
			}
		}],
		[{
			"name" : "Majesty"
		}, {
			"name" : "Star Magnetism"
		}]
	],
	"Protean" : [
		[{
			"name" : "Eyes of the Beast"
		}, {
			"name" : "Weight of the Feather"
		}],
		[{
			"name" : "Feral Weapons"
		}, {
			"name" : "Vicissitude",
			"amalgam" : {
				"name" : "Dominate",
				"level" : 2
			}
		}],
		[{
			"name" : "Earth Meld"
		}, {
			"name" : "Shapechange"
		}, {
			"name" : "Fleshcrafting",
			"amalgam" : {
				"name" : "Dominate",
				"level" : 2
			},
			"requirement" : {
				"discipline" : "Protean",
				"level" : 2,
				"name" : "Vicissitude"
			}
		}, {
			"name" : "Visceral Absorption",
			"amalgam" : {
				"name" : "Blood Sorcery",
				"level" : 2
			}
		}],
		[{
			"name" : "Metamorphosis"
		}, {
			"name" : "Horrid Form",
			"amalgam" : {
				"name" : "Dominate",
				"level" : 2
			},
			"requirement" : {
				"discipline" : "Protean",
				"level" : 2,
				"name" : "Vicissitude"
			}
		}],
		[{
			"name" : "Mist Form"
		}, {
			"name" : "The Unfettered Heart"
		}, {
			"name" : "One with the Land",
			"amalgam" : {
				"name" : "Animalism",
				"level" : 2
			}
		}, {
			"name" : "Heart of Darkness",
			"amalgam" : {
				"name" : "Fortitude",
				"level" : 2
			}
		}]
	],
	"Thin-Blood Alchemy" : [
		[{
			"name" : "Far Reach"
		}, {
			"name" : "Haze"
		}],
		[{
			"name" : "Counterfeit level 1 Disciplines"
		}, {
			"name" : "Envelop"
		}],
		[{
			"name" : "Counterfeit level 2 Disciplines"
		}, {
			"name" : "Defractionate"
		}, {
			"name" : "Profane Hieros Gamos"
		}, {
			"name" : "Concoct Ashe"
		}, {
			"name" : "Chemically Induced Flashback",
			"requirement" : {
				"discipline" : "Thin-Blood Alchemy",
				"level" : 3,
				"name" : "Concoct Ashe"
			}
		}],
		[{
			"name" : "Counterfeit level 3 Disciplines"
		}, {
			"name" : "Airborne Momentum"
		}, {
			"name" : "Discipline Channeling",
			"requirement" : {
				"discipline" : "Thin-Blood Alchemy",
				"level" : 3,
				"name" : "Concoct Ashe"
			}
		}],
		[{
			"name" : "Counterfeit level 4 Disciplines"
		}, {
			"name" : "Awaken the Sleeper"
		}]
	]
};
function setDisciplines( data ) {
	DISCIPLINES = data;
}
export const ROLL_ACTION_REFERENCE = {
	'Camoflauge in Nature' 					: 0,
	'Urban Camouflage' 						: 2,
	'Create Hidden Compartment' 			: 3,
	'Order Hidden Compartment Made' 		: 4,
	'Clean Up Murder Scene' 				: 5,
	'Create Explosive' 						: 6,
	'Crafting Bomb with Explosive' 			: 7,
	'Blowing Safe with Bomb' 				: 8,
	'Demolishing Building with Bomb' 		: 9,
	'Throwing' 								: 10,
	'Percieve Something in the Moment' 		: 1,
	'Notice' 								: 1,
	'Percieve Something and Identify' 		: 11,
	'Search' 								: 11,
	'Percieve Something while Distracted' 	: 12,
	'Tracking' 								: 13,
	'Driving Quick Maneuvers' 				: 14,
	'Driving Rough Weather' 				: 15,
	'Vehicle Chase'							: 15,
	'Climbing / Falling'					: 10,
	'Lifting'								: 16,
	'Lifting Sustained'						: 17,
	'Picking Lock'							: 18,
	'Dodging Laser Sensor'					: 18,
	'Cracking a Safe'						: 19,
	'Bypassing Alarm Circuit'				: 19,
	'Noticing Hidden Camera'				: 20,
	'Breaking a Lock'						: 21,
	'Setting up Security System'			: 19,
	'Disable or Hack Electronic System'		: 7,
	'Short Sprint'							: 10,
	'Long Sprint'							: 17,
	'Shadowing'								: 1,
	'Notice Shadower' 						: 23,
	'Remain Hidden After Noticed Shadowing' : 24,
	'Pickpocketing'							: 18,
	'Sneaking'								: 25,
	'Convince Others to Relax'				: 26,
	'Scam'									: 27,
	'Identify Scam'							: 28,
	'Fast-talk'								: 29,
	'Resist Fast-talker'					: 30,
	'Interrogation'							: 31,
	'Resist Interrogation'					: 32,
	'Torture'								: 33,
	'Resist Torture'						: 34,
	'Intimidation'							: 35,
	'Resist Intimidation'					: 34,
	'Violent Intimidation (& Resist)'		: 36,
	'Public Speaking'						: 37,
	'Prepare Public Speech'					: 38,
	'Courting'								: 39,
	'Flirting'								: 26,
	'Seducing'								: 40,
	'Gun - Shootout'						: 41,
	'Gun - While In Motion'					: 42,
	'Gun - Sniping / Careful'				: 43,
	'Dodging'								: 10,
	'Punching / Kicking / Blocking'			: 44,
	'Bashing'								: 44,
	'Arial / Falling Attack'				: 45,
	'Knife - Stabbing / Slashing'			: 46,
	'Sword - Stabbing / Slashing'			: 47,
	'Rouse'									: null,
	'Willpower'								: null,
	'Remorse'								: null,
	'Frenzy'								: null
};

export const ROLL_REFERENCE = [
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

export const EXPERIENCE_VALUES = {
	"attribute" : 5,
	"skill" : 3,
	"specialty" : 3,
	"clan discipline" : 5,
	"non-clan discipline" : 7,
	"caitiff discipline" : 6,
	"blood-sorcery ritual": 3,
	"thin-blood formula" : 3,
	"advantange" : 3,
	"blood potency" : 10
}

export const CLAN_DISCIPLINES = {
	"Brujah" : [ "Celerity", "Potence", "Presence" ],
	"Gangrel": [ "Animalism", "Fortitude", "Protean" ],
	"Hecata" : [ "Auspex", "Fortitude", "Oblivion" ],
	"Lasombra" : [ "Dominate", "Potence", "Oblivion" ],
	"Malkavian" : [ "Auspex", "Dominate", "Obfuscate" ],
	"Ministry" : [ "Obfuscate", "Presence", "Protean" ],
	"Nosferatu" : [ "Animalism", "Obfuscate", "Potence" ],
	"Toreador" : [ "Auspex", "Celerity", "Presence" ], 
	"Tremere" : [ "Auspex", "Blood Sorcery", "Dominate" ],
	"Tzimisce" : [ "Animalism", "Dominate", "Protean" ],
	"Ventrue" : [ "Dominate", "Fortitude", "Presence" ],
	'Thin-blood' : [ "Thin-Blood Alchemy" ],
	'Caitiff' : [ 'Animalism', 'Auspex', 'Blood Sorcery', 'Celerity', 'Dominate', 'Fortitude', 'Obfuscate', 'Oblivion', 'Presence', 'Potence', 'Protean' ]
}

export const SETTINGS_MODE_CHRONICLE = 'chronicle';
export var rollType = 'Custom';
export var rerollType = 'Custom';

function setRollType( type ) {
	rollType = type;
}
function setRerollType( type ) {
	rerollType = type;
}

function getUrlVariable( variable ) {
	let loc = window.location.href;
	let value = loc.substring( loc.indexOf( variable ) + variable.length );
	if ( value.includes('&') ) {
		value = value.substring( 0, value.indexOf('&') );
	}
	return value;
}

$( '#chronicles__wrapper' ).addClass( navigator.platform );


$( '.sound-effect.siren' ).each(function(){
	$( this )[0].volume = 0.25;
});

setDiceHandlers();
loadAppData();


for ( let index in PREDATOR_TYPES ) {
	$( '#add_predator_type' ).append( '<option>' + PREDATOR_TYPES[index] + '</option>' );
}
$( '#pass-login__input, #user-login__input' ).on( 'keyup', function( e ) {
	if ( e.key == 'Enter' || e.keyCode == 13 ) {
		$( '#login_submit' ).trigger( 'click' );
	}
});

export const CACHE_KEY_CHRONICLE = 'chronicleSettings';
export const CACHE_KEY_ACCOUNT = 'accountSettings';
export const CACHE_KEY_PLAYER = 'playerSettings';
export const CACHE_KEY_TOKEN = 'token';

export { setRollType, setRerollType, setDisciplines, getUrlVariable };

