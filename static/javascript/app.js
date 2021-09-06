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

const ROUSE = 'Rouse';
const DEX_ATH = 'Dex + Athletics';
const STR_BRW = 'Strength + Brawl';
const WTS_AWR = 'Wits + Awareness';
const WILL = 'Willpower';

const CHARACTER_SKILLS = ["athletics", "animal ken", "academics", "brawl", "etiquette", "awareness", 
	"craft", "insight", "finance", "drive", "intimidation", "investigation", "firearms", "leadership", 
	"medicine", "melee", "performance", "occult", "larceny", "persuasion", "politics", "stealth",
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

function getUrlVariable( variable ) {
	loc = window.location.href;
	value = loc.substring( loc.indexOf( variable ) + variable.length );
	if (value.includes('&')) {
		value = value.substring( 0, value.indexOf('&'));
	}
	return value;
}

