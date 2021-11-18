const FILENAME = "app-settings.vtm";
const SETTINGS_DIR = "static/settings/";

const LEFT_CLICK = 'left-click';
const RIGHT_CLICK = 'right-click';

const CACHE_KEY_CHRONICLE = 'appSettings';

const DAMAGE_SUPERFICIAL = 'superficial';
const DAMAGE_AGGRAVATED = 'aggravated';
const DAMAGE_STAINS = 'stains';

const VALUE_TYPE_TRACKERS = 'tracker';

const MAX_HUNGER = 5;
const HUNGER_LEVEL = 'level';
const TRACKER_MAX = 'maxlevel';

const REROLL_SUCCESS 	= 'Re-roll Successes';
const REROLL_FAILURE 	= 'Re-roll Failures';
const REROLL_CRIT 		= 'Re-roll Crits';

ICON_MAP = {};

ICON_MAP[REROLL_SUCCESS] = 'icon_success';
ICON_MAP[REROLL_FAILURE] = 'icon_failure';
ICON_MAP[REROLL_CRIT] = 'icon_critical_success';

const STORYTELLER = 'Storyteller';

let user = '';

const CUSTOM = 'Custom Roll';
const ROUSE = 'Rouse';
const DEX_ATH = 'Dex + Athletics';
const STR_BRW = 'Strength + Brawl';
const WTS_AWR = 'Wits + Awareness';
const WILL = 'Willpower';
const KINDRED = 'Kindred';
const GHOUL = 'Ghoul';
const MORTAL = 'Mortal';
const WEREWOLF = 'Werewolf';
const TREMERE = 'Tremere';
const ANIMAL = 'Animal';

const BLOOD_SORCERY_RITUALS = 'Blood Sorcery Rituals';

const DISCIPLINE_OPTION_DEFAULT = 'Select Discipline';

const PREDATOR_TYPES = [ "Alleycat", "Bagger", "Blood Leech", "Cleaver", "Consensualist", "Farmer", "Osiris",
	"Sandman", "Scene Queen", "Siren" ];

for ( index in PREDATOR_TYPES ) {
	$( '#add_predator_type' ).append( '<option>' + PREDATOR_TYPES[index] + '</option>' );
}

const ENABLE = 'enable';
const DISABLE = 'disable';

const LIMITED_SHEET = [ 'Mortal', 'Ghoul', 'Animal', 'Hunter' ];

const CHARACTER_SKILLS = ["athletics", "animal ken", "academics", "brawl", "etiquette", "awareness", 
	"craft", "insight", "finance", "drive", "intimidation", "investigation", "firearms", "leadership", 
	"medicine", "larceny", "performance", "occult", "melee", "persuasion", "politics", "stealth",
	"streetwise", "science", "survival", "subterfuge", "technology"];
const CHARACTER_ATTRIBUTES = [
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

const TRACKERS = ["health", "willpower", "humanity", "hunger"];

const CLANS = [ "Brujah", "Gangrel", "Hecata", "Lasombra", "Malkavian", "Ministry", "Nosferatu", "Toreador", 
	"Tremere", "Tzimisce", "Ventrue", "Thin-blood", "Caitiff" ];

for (clan in CLANS) {
	$( '#character_clan' ).append( '<option>' + CLANS[clan] + '</option>' );
}

const DISCIPLINES = { 
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

const SETTINGS_MODE_APP = "app";
const SETTINGS_MODE_CHRONICLE = "chronicle";

base = window.location.href
if (base.includes('&')) {
	base = base.substring(0, base.indexOf('&'));
}
if (base.includes('?')) {
	base = base.substring(0, base.indexOf('?'));
}

var appSettings = {};
var chronicleSettingsFilename = "";
var chronicleSettings = {};

var settingsMode = SETTINGS_MODE_APP;

var authenticated = false;

function getUrlVariable( variable ) {
	loc = window.location.href;
	value = loc.substring( loc.indexOf( variable ) + variable.length );
	if (value.includes('&')) {
		value = value.substring( 0, value.indexOf('&'));
	}
	return value;
}

$( '#story__wrapper' ).addClass( navigator.platform );

