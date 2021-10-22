from flask import Flask, jsonify, render_template, request, Response
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin

import numpy as np

app = Flask(__name__)

# Configure SQL connection
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chronicleCompanion.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'schrecknet'

db = SQLAlchemy(app)

socketio = SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

class Chronicles(db.Model, SerializerMixin):
	rowid = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String(50))
	enabled = db.Column(db.Integer)
	masquerade_violations = db.Column(db.Integer)
	relationship_map_link = db.Column(db.String(200))

class Chapters(db.Model, SerializerMixin):
	chronicle_id = db.Column(db.Integer, primary_key = True)
	number = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String(50))

class Scenes(db.Model, SerializerMixin):
	chronicle_id = db.Column(db.Integer, primary_key = True)
	chapter_id = db.Column(db.Integer, primary_key = True)
	number = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String(100))
	story = db.Column(db.String(5000))

class Characters(db.Model, SerializerMixin):
	chronicle_id = db.Column(db.Integer, primary_key = True)
	id = db.Column(db.Integer, primary_key = True)
	type = db.Column(db.String(5))
	name = db.Column(db.String(100))
	alias = db.Column(db.String(50))
	bio = db.Column(db.String(5000))
	clan = db.Column(db.String(15))
	generation = db.Column(db.Integer)
	blood_potency = db.Column(db.Integer)
	apparent_age = db.Column(db.String(50))
	embraced = db.Column(db.Integer)
	born = db.Column(db.Integer)
	inventory = db.Column(db.String(500))
	experience = db.Column(db.Integer)
	predator_type = db.Column(db.String(20))
	status = db.Column(db.String(50))

class Attributes(db.Model, SerializerMixin):
	character_id = db.Column(db.Integer, primary_key = True)
	strength = db.Column(db.Integer)
	dexterity = db.Column(db.Integer)
	stamina = db.Column(db.Integer)
	charisma = db.Column(db.Integer)
	manipulation = db.Column(db.Integer)
	composure = db.Column(db.Integer)
	intelligence = db.Column(db.Integer)
	wits = db.Column(db.Integer)
	resolve = db.Column(db.Integer)
	
class Skills(db.Model, SerializerMixin):
	character_id = db.Column(db.Integer, primary_key = True)
	athletics = db.Column(db.Integer)
	athletics_specialty = db.Column(db.String(20))
	brawl = db.Column(db.Integer)
	brawl_specialty = db.Column(db.String(20))
	craft = db.Column(db.Integer)
	craft_specialty = db.Column(db.String(20))
	drive = db.Column(db.Integer)
	drive_specialty = db.Column(db.String(20))
	firearms = db.Column(db.Integer)
	firearms_specialty = db.Column(db.String(20))
	melee = db.Column(db.Integer)
	melee_specialty = db.Column(db.String(20))
	larceny = db.Column(db.Integer)
	larceny_specialty = db.Column(db.String(20))
	stealth = db.Column(db.Integer)
	stealth_specialty = db.Column(db.String(20))
	survival = db.Column(db.Integer)
	survival_specialty = db.Column(db.String(20))
	animal_ken = db.Column(db.Integer)
	animal_ken_specialty = db.Column(db.String(20))
	etiquette = db.Column(db.Integer)
	etiquette_specialty = db.Column(db.String(20))
	insight = db.Column(db.Integer)
	insight_specialty = db.Column(db.String(20))
	intimidation = db.Column(db.Integer)
	intimidation_specialty = db.Column(db.String(20))
	leadership = db.Column(db.Integer)
	leadership_specialty = db.Column(db.String(20))
	performance = db.Column(db.Integer)
	performance_specialty = db.Column(db.String(20))
	persuasion = db.Column(db.Integer)
	persuasion_specialty = db.Column(db.String(20))
	streetwise = db.Column(db.Integer)
	streetwise_specialty = db.Column(db.String(20))
	subterfuge = db.Column(db.Integer)
	subterfuge_specialty = db.Column(db.String(20))
	academics = db.Column(db.Integer)
	academics_specialty = db.Column(db.String(20))
	awareness = db.Column(db.Integer)
	awareness_specialty = db.Column(db.String(20))
	finance = db.Column(db.Integer)
	finance_specialty = db.Column(db.String(20))
	investigation = db.Column(db.Integer)
	investigation_specialty = db.Column(db.String(20))
	medicine = db.Column(db.Integer)
	medicine_specialty = db.Column(db.String(20))
	occult = db.Column(db.Integer)
	occult_specialty = db.Column(db.String(20))
	politics = db.Column(db.Integer)
	politics_specialty = db.Column(db.String(20))
	science = db.Column(db.Integer)
	science_specialty = db.Column(db.String(20))
	technology = db.Column(db.Integer)
	technology_specialty = db.Column(db.String(20))

class Trackers(db.Model, SerializerMixin):
	character_id = db.Column(db.Integer, primary_key = True)
	health_superficial = db.Column(db.Integer)
	health_aggravated = db.Column(db.Integer)
	willpower_superficial = db.Column(db.Integer)
	willpower_aggravated = db.Column(db.Integer)
	humanity_max = db.Column(db.Integer)
	humanity_stains = db.Column(db.Integer)
	hunger = db.Column(db.Integer)

class Disciplines(db.Model, SerializerMixin):
	character_id = db.Column(db.Integer, primary_key = True)
	discipline = db.Column(db.String(20), primary_key = True)
	level = db.Column(db.Integer)
	powers = db.Column(db.String(500))

class Advantages(db.Model, SerializerMixin):
	character_id = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String(100), primary_key = True)
	level = db.Column(db.Integer, primary_key = True)

class Flaws(db.Model, SerializerMixin):
	character_id = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String(100), primary_key = True)
	level = db.Column(db.Integer, primary_key = True)

class Convictions(db.Model, SerializerMixin):
	character_id = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String(100), primary_key = True)

class Touchstones(db.Model, SerializerMixin):
	character_id = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String(100), primary_key = True)
	relationship = db.Column(db.String(100), primary_key = True)

class Locations(db.Model, SerializerMixin):
	rowid = db.Column(db.Integer, primary_key = True)
	chronicle_id = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String(50), primary_key = True)
	description = db.Column(db.String(1000))
	storyteller_notes = db.Column(db.String(1000))
	address = db.Column(db.String(50))
	visible_on_map = db.Column(db.Integer)

class Ghouls(db.Model, SerializerMixin):
	character_id = db.Column(db.Integer, primary_key = True)
	ghoul_character_id = db.Column(db.Integer, primary_key = True)

class Havens(db.Model, SerializerMixin):
	chronicle_id = db.Column(db.Integer, primary_key = True)
	character_id = db.Column(db.Integer, primary_key = True)
	location_id = db.Column(db.Integer, primary_key = True)

@app.route('/')
def index():
	# Get distinct Chronicle names from 'scenes' table
    chronicle_DTO = db.session.query(Chronicles).all()
    chronicle_list = []
    for chronicle in chronicle_DTO:
        chronicle_dict = {}
        chronicle_dict['name'] = chronicle.name
        chronicle_dict['id'] = chronicle.rowid
        chronicle_dict['enabled'] = chronicle.enabled == 1
        chronicle_list.append(chronicle_dict)

    return render_template('index.html', chronicles = chronicle_list)

# DATA ENDPOINTS

@app.route('/live/', methods= [ 'GET' ])
def liveness():
	return "{}"

# Get chronicle data
@app.route('/chronicle/<id>/', methods = [ 'GET' ])
def chronicle_data(id):

	chronicle_DTO = db.session.query(Chronicles).filter(Chronicles.rowid == id).one()
	chronicleData = {}
	chronicleData['id'] = id
	chronicleData['name'] = chronicle_DTO.name
	chronicleData['characters'] = character_data_by_chronicle(id)
	chronicleData['locations'] = location_data_by_chronicle(id)
	chronicleData['chapters'] = chapter_data_by_chronicle(id)
	chronicleData['embed_link'] = chronicle_DTO.relationship_map_link
	return chronicleData

@app.route('/chronicle/<id>/characters/', methods = [ 'GET'])
def character_data_by_chronicle(id):
    if id is None:
	    return Response("{\"message\":\"Invalid Chronicle ID value: " + id + "\'}", status=400)

    characters_DTO = db.session.query(Characters).filter(Characters.chronicle_id == id).all()
    characters_list = {
    	'pc' : {},
    	'npc' : {}
    }

    for character in characters_DTO:
    	characters_list[character.type][character.name] = character.to_dict()
    	character_sheet = build_character_sheet( character.id  )
    	characters_list[character.type][character.name]['sheet'] = character_sheet

    return characters_list

@app.route('/chronicle/<id>/characters/', methods = [ 'POST'])
def create_character(id):
	if id is None or id is 'undefined':
		return Response("{\"message\":\"Invalid Chronicle ID value: " + id + "\'}", status=400)

	data = request.get_json()

	character_id = db.session.query(Characters.name).filter(Characters.chronicle_id == id).count() + 1

	name_exists = db.session.query(Characters.id).filter(Characters.name == data['name']).count()

	if name_exists > 0:
		return Response("{\"message\":\"Character with this name already exists for this chronicle\"}", status=422)

	alias = None;
	if 'alias' in data:
		alias = data['alias']
	bio = None;
	if 'bio' in data:
		bio = data['bio']
	gen = None;
	if 'generation' in data:
		gen = data['generation']
	else:
		gen = 13;
	age = None;
	if 'age' in data:
		age = data['age']
	embraced = None;
	if 'embraced' in data:
		embraced = data['embraced']
	born = None;
	if 'born' in data:
		born = data['born']
	inv = None;
	if 'inventory' in data:
		inv = data['inventory']

	try:
		print("STARTING CHARACTER MODEL")
		character_model = Characters(chronicle_id=id, id=character_id, type=data['type'], name=data['name'], 
			alias=alias, bio=bio, clan=data['clan'], generation=gen, apparent_age=age, embraced=embraced, 
			born=born, inventory=inv, blood_potency=data['blood_potency'], experience=0)
		db.session.add(character_model)
		print("CHARACTER MODEL COMPLETE")
		attributes = data['attributes']
		attributes_model = Attributes(character_id=character_id, strength=attributes['strength'], dexterity=attributes['dexterity'],
			stamina=attributes['stamina'], charisma=attributes['charisma'], manipulation=attributes['manipulation'],
			composure=attributes['composure'], intelligence=attributes['intelligence'], wits=attributes['wits'],
			resolve=attributes['resolve'])
		db.session.add(attributes_model)

		print("ATTRIBUTES MODEL COMPLETE")

		skills = data['skills']
		skills_model = Skills(character_id=character_id);
		if 'athletics' in skills:
			skills_model.athletics=skills['athletics']
		if 'athletics_specialty' in skills:
			skills_model.athletics_specialty=skills['athletics_specialty']
		if 'brawl' in skills:
			skills_model.brawl=skills['brawl']
		if 'brawl_specialty' in skills:
			skills_model.brawl_specialty=skills['brawl_specialty']
		if 'craft' in skills:
			skills_model.craft=skills['craft']
		if 'craft_specialty' in skills:
			skills_model.craft_specialty=skills['craft_specialty']
		if 'drive' in skills:
			skills_model.drive=skills['drive']
		if 'drive_specialty' in skills:
			skills_model.drive_specialty=skills['drive_specialty']
		if 'firearms' in skills:
			skills_model.firearms=skills['firearms']
		if 'firearms_specialty' in skills:
			skills_model.firearms_specialty=skills['firearms_specialty']
		if 'melee' in skills:
			skills_model.melee=skills['melee']
		if 'melee_specialty' in skills:
			skills_model.melee_specialty=skills['melee_specialty']
		if 'larceny' in skills:
			skills_model.larceny=skills['larceny']
		if 'larceny_specialty' in skills:
			skills_model.larceny_specialty=skills['larceny_specialty']
		if 'stealth' in skills:
			skills_model.stealth=skills['stealth']
		if 'stealth_specialty' in skills:
			skills_model.stealth_specialty=skills['stealth_specialty']
		if 'survival' in skills:
			skills_model.survival=skills['survival']
		if 'survival_specialty' in skills:
			skills_model.survival_specialty=skills['survival_specialty']
		if 'animal_ken' in skills:
			skills_model.animal_ken=skills['animal_ken']
		if 'animal_ken_specialty' in skills:
			skills_model.animal_ken_specialty=skills['animal_ken_specialty']
		if 'etiquette' in skills:
			skills_model.etiquette=skills['etiquette']
		if 'etiquette_specialty' in skills:
			skills_model.etiquette_specialty=skills['etiquette_specialty']
		if 'insight' in skills:
			skills_model.insight=skills['insight']
		if 'insight_specialty' in skills:
			skills_model.insight_specialty=skills['insight_specialty']
		if 'intimidation' in skills:
			skills_model.intimidation=skills['intimidation']
		if 'intimidation_specialty' in skills:
			skills_model.intimidation_specialty=skills['intimidation_specialty']
		if 'leadership' in skills:
			skills_model.leadership=skills['leadership']
		if 'leadership_specialty' in skills:
			skills_model.leadership_specialty=skills['leadership_specialty']
		if 'performance' in skills:
			skills_model.performance=skills['performance']
		if 'performance_specialty' in skills:
			skills_model.performance_specialty=skills['performance_specialty']
		if 'persuasion' in skills:
			skills_model.persuasion=skills['persuasion']
		if 'persuasion_specialty' in skills:
			skills_model.persuasion_specialty=skills['persuasion_specialty']
		if 'streetwise' in skills:
			skills_model.streetwise=skills['streetwise']
		if 'streetwise_specialty' in skills:
			skills_model.streetwise_specialty=skills['streetwise_specialty']
		if 'subterfuge' in skills:
			skills_model.subterfuge=skills['subterfuge']
		if 'subterfuge_specialty' in skills:
			skills_model.subterfuge_specialty=skills['subterfuge_specialty']
		if 'academics' in skills:
			skills_model.academics=skills['academics']
		if 'academics_specialty' in skills:
			skills_model.academics_specialty=skills['academics_specialty']
		if 'awareness' in skills:
			skills_model.awareness=skills['awareness']
		if 'awareness_specialty' in skills:
			skills_model.awareness_specialty=skills['awareness_specialty']
		if 'finance' in skills:
			skills_model.finance=skills['finance']
		if 'finance_specialty' in skills:
			skills_model.finance_specialty=skills['finance_specialty']
		if 'investigation' in skills:
			skills_model.investigation=skills['investigation']
		if 'investigation_specialty' in skills:
			skills_model.investigation_specialty=skills['investigation_specialty']
		if 'medicine' in skills:
			skills_model.medicine=skills['medicine']
		if 'medicine_specialty' in skills:
			skills_model.medicine_specialty=skills['medicine_specialty']
		if 'occult' in skills:
			skills_model.occult=skills['occult']
		if 'occult_specialty' in skills:
			skills_model.occult_specialty=skills['occult_specialty']
		if 'politics' in skills:
			skills_model.politics=skills['politics']
		if 'politics_specialty' in skills:
			skills_model.politics_specialty=skills['politics_specialty']
		if 'science' in skills:
			skills_model.science=skills['science']
		if 'science_specialty' in skills:
			skills_model.science_specialty=skills['science_specialty']
		if 'technology' in skills:
			skills_model.technology=skills['technology']
		if 'technology_specialty' in skills:
			skills_model.technology_specialty=skills['technology_specialty']
		db.session.add(skills_model)

		print("SKILLS MODEL COMPLETE")
		trackersModel = Trackers(character_id=character_id, health_superficial=0, health_aggravated=0,
			willpower_superficial=0, willpower_aggravated=0, humanity_max=data['humanity'], humanity_stains=0, hunger=0)
		db.session.add(trackersModel)

		print("TRACKERS MODEL COMPLETE")
		for discipline in data['disciplines']:
			level = 0
			if 'level' in discipline:
				level = discipline['level']

			powers = None
			if 'powers' in discipline:
				powers = discipline['powers']
			elif 'rituals' in discipline:
				powers = discipline['rituals']

			disciplineModel = Disciplines(character_id=character_id, discipline=discipline['name'], level=level, powers=powers)
			db.session.add(disciplineModel)

		print("DISCIPLINES MODEL COMPLETE")
		for advantage in data['advantages']:
			advantage_model = Advantages(character_id=character_id, name=advantage['name'], level=advantage['level'])
			db.session.add(advantage_model)

		print("ADVANTAGES MODEL COMPLETE")
		for flaw in data['flaws']:
			flaw_model = Flaws(character_id=character_id, name=flaw['name'], level=flaw['level'])
			db.session.add(flaw_model)

		print("FLAWS MODEL COMPLETE")
		for conviction in data['convictions']:
			conviction_model = Convictions(character_id=character_id, name=conviction)
			db.session.add(conviction_model)

		print("CONVICTIONS MODEL COMPLETE")
		for touchstone in data['touchstones']:
			touchstone_model = Touchstones(character_id=character_id, name=touchstone)
			db.session.add(touchstone_model)

		print("TOUCHSTONES MODEL COMPLETE")

		db.session.commit()
	except Exception as e:
		print(str(e))
		print(e.__class__.__name__)
		return Response("{\"message\":\"There was an error saving character data in the database: " + e.__class__.__name__ + '-' + str( e ) + "\"}", status=500)

	return Response(chronicle_data(id), status=200)

@app.route('/chronicle/<id>/enable/', methods = [ 'GET' ])
def toggle_chronicle_enable(id):
	chronicle_DTO = db.session.query(Chronicles).filter(Chronicles.rowid == id).one()
	chronicle_DTO.enabled = 1
	db.session.commit()
	return chronicle_DTO.to_dict()

@app.route('/chronicle/<id>/disable/', methods = [ 'GET' ])
def toggle_chronicle_disable(id):
	chronicle_DTO = db.session.query(Chronicles).filter(Chronicles.rowid == id).one()
	chronicle_DTO.enabled = 0
	db.session.commit()
	return chronicle_DTO.to_dict()


@app.route('/character/<id>/', methods = [ 'GET' ])
def character_data_by_id(id):
    character = {}
    character_DTO = db.session.query(Characters).filter(Characters.id == id).one()
    character = character_DTO.to_dict()
    character_sheet = build_character_sheet(character_DTO.id)
    character['sheet'] = character_sheet
    character['havens'] = build_haven_list(id)
	
    return character

def build_character_sheet( id ):
	sheet = {}
	attributes = db.session.query(Attributes).filter(Attributes.character_id == id).first()

	if attributes is not None:
		attributes_dict = attributes.to_dict();
		sheet['attributes'] = {}
		sheet['attributes']['physical'] = {}
		sheet['attributes']['physical']['strength'] = attributes.strength
		sheet['attributes']['physical']['dexterity'] = attributes.dexterity
		sheet['attributes']['physical']['stamina'] = attributes.stamina
		sheet['attributes']['social'] = {}
		sheet['attributes']['social']['charisma'] = attributes.charisma
		sheet['attributes']['social']['manipulation'] = attributes.manipulation
		sheet['attributes']['social']['composure'] = attributes.composure
		sheet['attributes']['mental'] = {}
		sheet['attributes']['mental']['intelligence'] = attributes.intelligence
		sheet['attributes']['mental']['wits'] = attributes.wits
		sheet['attributes']['mental']['resolve'] = attributes.resolve
		attributes_dict
	else:
		sheet['attributes'] = None

	skills = db.session.query(Skills).filter(Skills.character_id == id).first()
	if skills is not None:
		sheet['skills'] = skills.to_dict()
	else:
		sheet['skills'] = None

	trackers = db.session.query(Trackers).filter(Trackers.character_id == id).first()
	if trackers is not None:
		sheet['trackers'] = trackers.to_dict()
	else:
		sheet['trackers'] = None

	disciplines = db.session.query(Disciplines).filter(Disciplines.character_id == id).all()
	if disciplines is not None:
		disciplines_list = []
		for discipline in disciplines:
			disciplines_list.append(discipline.to_dict())
		sheet['disciplines'] = disciplines_list
	else:
		sheet['disciplines'] = None

	advantages = db.session.query(Advantages).filter(Advantages.character_id == id).all()
	if advantages is not None:
		advantages_list = []
		for advantage in advantages:
			advantages_list.append(advantage.to_dict())
		sheet['advantages'] = advantages_list
	else:
		sheet['advantages'] = None

	flaws = db.session.query(Flaws).filter(Flaws.character_id == id).all()
	if flaws is not None:
		flaws_list = []
		for flaw in flaws:
			flaws_list.append(flaw.to_dict())
		sheet['flaws'] = flaws_list
	else:
		sheet['flaws'] = None

	convictions = db.session.query(Convictions).filter(Convictions.character_id == id).all()
	if convictions is not None:
		convictions_list = []
		for conviction in convictions:
			convictions_list.append(conviction.to_dict())
		sheet['convictions'] = convictions_list
	else:
		sheet['convictions'] = None

	touchstones = db.session.query(Touchstones).filter(Touchstones.character_id == id).all()
	if touchstones is not None:
		touchstones_list = []
		for touchstone in touchstones:
			touchstones_list.append(touchstone.to_dict())
		sheet['touchstones'] = touchstones_list
	else:
		sheet['touchstones'] = None

	return sheet

def build_haven_list(id):
	locations = db.session.query(Locations).join(Havens, Havens.location_id == Locations.rowid).filter(Havens.character_id == id).all()
	if locations is not None:
		locations_list = []
		for location in locations:
			location_obj = {
				'name' : location.name,
				'id' : location.rowid
			}
			locations_list.append(location_obj)
		return locations_list
	else:
		return None

@app.route('/chronicle/<id>/locations/', methods = [ 'GET' ])
def location_data_by_chronicle(id):
	location_DTO = db.session.query(Locations).filter(Locations.chronicle_id == id).all()
	locations_dict = {}
	for location in location_DTO:
		locations_dict[location.name] = location.to_dict()
	return locations_dict

@app.route('/chronicle/<id>/locations/', methods = [ 'POST'])
def create_location(id):
	if id is None or id is 'undefined':
		return Response("{\"message\":\"Invalid Chronicle ID value: " + id + "\'}", status=400)

	try:
		data = request.get_json()

		description = None
		if 'description' in data:
			description = data['description']

		storyteller_notes = None
		if 'storyteller_notes' in data:
			storyteller_notes = data['storyteller_notes']

		address = None
		if 'address' in data:
			address = data['address']

		location_model = Locations(chronicle_id=id, name=data['name'], description=description, storyteller_notes=storyteller_notes,
			address=address, visible_on_map=data['visible'])

		db.session.add(location_model)

		location_id = db.session.query(Locations.name).filter(Locations.chronicle_id == id).count()

		if 'haven' in data and data['haven']:
			havens_model = Havens(chronicle_id=id, character_id=data['haven'], location_id=location_id)
			db.session.add(havens_model)

		db.session.commit()
	except Exception as e:
		print(str(e))
		print(e.__class__.__name__)
		return Response("{\"message\":\"There was an error saving character data in the database: " + e.__class__.__name__ + '-' + str( e ) + "\"}", status=500)
	return chronicle_data(id)

@app.route('/chronicle/<id>/chapters/', methods = [ 'GET' ])
def chapter_data_by_chronicle(id):
	scenes_DTO = db.session.query(Scenes.chapter_id, Scenes.name, Scenes.story).filter(Scenes.chronicle_id == id).order_by(Scenes.number).all()
	chapters_DTO = db.session.query(Chapters.name).filter(Chapters.chronicle_id == id).order_by(Chapters.number).all()
	chapters_list = []
	for chapter in chapters_DTO:
		chapter_data = {}
		chapter_data['name'] = chapter.name
		chapter_data['scenes'] = []
		chapters_list.append(chapter_data)

	for scene in scenes_DTO:
		scene_dict = {}
		scene_dict['name'] = scene.name
		scene_dict['story'] = scene.story
		chapters_list[scene.chapter_id - 1]['scenes'].append(scene_dict)

	return chapters_list

@app.route('/roll/', methods = [ 'POST' ])
def roll_dice():
	data = request.get_json()
	if data['hunger'] > data['total']:
		return 'Hunger cannot be larger than total pool', 400
	results = {}
	results['player'] = data['player']
	results['notify'] = data['notify']
	results['timestamp'] = data['timestamp']
	results['roll'] = {}
	index = 0

	regular_pool = np.random.randint(1, 11, size=(1, int(data['total'])-int(data['hunger'])))
	hunger_pool = np.random.randint(1, 11, size=(1, int(data['hunger'])))

	results['roll']['regular'] = regular_pool.tolist()[0]
	results['roll']['hunger'] = hunger_pool.tolist()[0]

	if 'reroll' in data:
		results['roll']['regular'] = results['roll']['regular'] + data['reroll']['regular']
		results['roll']['hunger'] = results['roll']['hunger'] + data['reroll']['hunger']
		results['reroll'] = True

	if not results['notify'] == 'private':
		socketio.emit('roll results', results)

	return results['roll']

def handle_update_all(updated_data):
	socketio.emit('data updated', updated_data)

def handle_tracker_update(character_id, request):
	tracker = request['tracker']
	value = request['value']
	if request['remove']:
		value *= -1
	tracker_DTO = db.session.query(Trackers).filter(Trackers.character_id == character_id).one()
	
	if tracker == 'health':
		damage_type = request['damage_type']
		if damage_type == 'superficial':
			if tracker_DTO.health_superficial + value > 0:
				tracker_DTO.health_superficial += value
			else:
				tracker_DTO.health_superficial = 0
		if damage_type == 'aggravated':
			if tracker_DTO.health_aggravated + value > 0:
				tracker_DTO.health_aggravated += value
			else:
				tracker_DTO.health_aggravated = 0
	elif tracker == 'willpower':
		damage_type = request['damage_type']
		if damage_type == 'superficial':
			if tracker_DTO.willpower_superficial + value > 0:
				tracker_DTO.willpower_superficial += value
			else:
				tracker_DTO.willpower_superficial = 0
		if damage_type == 'aggravated':
			if tracker_DTO.willpower_aggravated + value > 0:
				tracker_DTO.willpower_aggravated += value
			else:
				tracker_DTO.willpower_aggravated = 0
	elif tracker == 'humanity':
		if tracker_DTO.humanity_stains + value > 0:
			tracker_DTO.humanity_stains += value
		else:
			tracker_DTO.humanity_stains = 0
	elif tracker == 'hunger':
		if tracker_DTO.hunger + value > 0:
			tracker_DTO.hunger += value
		else:
			tracker_DTO.hunger = 0

	db.session.commit()

def handle_notes_update(character_id, request):
	value = request['value']
	characters_DTO = db.session.query(Characters).filter(Characters.id == character_id).one()
	characters_DTO.notes = value
	db.session.commit()

@socketio.on('data update')
def handle_data_update(request, methods=[ 'POST' ]):
	if 'character_id' not in request or 'type' not in request:
		return
	character_id = request['character_id']
	request_type = str(request['type'])
	print('received event: ' + request_type)
	if request_type == 'tracker':
		handle_tracker_update( character_id, request)
	elif request_type == 'notes':
		handle_notes_update( character_id, request)
	handle_update_all(character_data_by_id(character_id))

@socketio.on('raise hand')
def handle_hand_raise(request, methods=[ 'POST' ]):
	print('hand raised: ' + str(request))
	socketio.emit('hand raised', request)

@socketio.on('acknowledge hand')
def handle_hand_raise(request, methods=[ 'POST' ]):
	print('hand acknowledged: ' + str(request))
	socketio.emit('hand acknowledged', request)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')

