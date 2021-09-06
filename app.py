from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin

import numpy as np

app = Flask(__name__)

# Configure SQL connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chronicleCompanion.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'schrecknet'

db = SQLAlchemy(app)

socketio = SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

class Chronicles(db.Model, SerializerMixin):
	name = db.Column(db.String(100))
	number = db.Column(db.Integer, primary_key = True)

class Chapters(db.Model, SerializerMixin):
	chronicle_id = db.Column(db.Integer, primary_key = True)
	number = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String(100))

class Scenes(db.Model, SerializerMixin):
	chronicle_id = db.Column(db.Integer, primary_key = True)
	chapter_id = db.Column(db.Integer, primary_key = True)
	number = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String(100))
	story = db.Column(db.String(100))
	notes = db.Column(db.String(1000))

class Characters(db.Model, SerializerMixin):
	chronicle_id = db.Column(db.Integer)
	chronicle = db.Column(db.String(100), primary_key = True)
	name = db.Column(db.String(100), primary_key = True)
	description = db.Column(db.String(1000))
	notes = db.Column(db.String(500))
	id = db.Column(db.Integer)
	aka = db.Column(db.String(50))
	bio = db.Column(db.String(2000))
	apparent_age = db.Column(db.String(50))
	clan = db.Column(db.String(15))
	type = db.Column(db.String(5))

class Attributes(db.Model, SerializerMixin):
	id = db.Column(db.Integer, primary_key = True)
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
	id = db.Column(db.Integer, primary_key = True)
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
	id = db.Column(db.Integer, primary_key = True)
	health_superficial = db.Column(db.Integer)
	health_aggravated = db.Column(db.Integer)
	willpower_superficial = db.Column(db.Integer)
	willpower_aggravated = db.Column(db.Integer)
	humanity_max = db.Column(db.Integer)
	humanity_stains = db.Column(db.Integer)
	hunger = db.Column(db.Integer)

class Locations(db.Model, SerializerMixin):
	chronicle_id = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String(50), primary_key = True)
	description = db.Column(db.String(1000))
	address = db.Column(db.String(50))
	area = db.Column(db.String(250))
	notes = db.Column(db.String(1000))


@app.route('/')
def index():
	# Get distinct Chronicle names from 'scenes' table
    chronicle_DTO = db.session.query(Chronicles).all()
    chronicle_list = []
    for chronicle in chronicle_DTO:
        chronicle_dict = {}
        chronicle_dict['name'] = chronicle.name
        chronicle_dict['id'] = chronicle.number
        chronicle_list.append(chronicle_dict)

    return render_template('index.html', chronicles = chronicle_list)

# DATA ENDPOINTS

# Get chronicle data
@app.route('/chronicle/<id>/', methods = [ 'GET' ])
def chronicle_data(id):
	chronicleData = {}
	chronicleData['characters'] = character_data_by_chronicle(id)
	chronicleData['locations'] = location_data_by_chronicle(id)
	chronicleData['chapters'] = chapter_data_by_chronicle(id)
	return chronicleData

@app.route('/chronicle/<id>/characters/', methods = [ 'GET'])
def character_data_by_chronicle(id):
    if id is None:
	    return None;

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

@app.route('/character/<id>/', methods = [ 'GET' ])
def character_data_by_id(id):
    character = {}
    character_DTO = db.session.query(Characters).filter(Characters.id == id).one()
    character = character_DTO.to_dict()
    character_sheet = build_character_sheet( character_DTO.id )
    character['sheet'] = character_sheet
	
    return character

def build_character_sheet( id ):
	sheet = {}
	attributes = db.session.query(Attributes).filter(Attributes.id == id).first()

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

	skills = db.session.query(Skills).filter(Skills.id == id).first()
	if skills is not None:
		sheet['skills'] = skills.to_dict()
	else:
		sheet['skills'] = None

	trackers = db.session.query(Trackers).filter(Trackers.id == id).first()
	if trackers is not None:
		sheet['trackers'] = trackers.to_dict()
	else:
		sheet['trackers'] = None

	return sheet

@app.route('/chronicle/<id>/locations/', methods = [ 'GET' ])
def location_data_by_chronicle(id):
	location_DTO = db.session.query(Locations).filter(Locations.chronicle_id == id).all()
	locations_dict = {}
	for location in location_DTO:
		locations_dict[location.name] = location.to_dict()
	return locations_dict

@app.route('/chronicle/<id>/chapters/', methods = [ 'GET' ])
def chapter_data_by_chronicle(id):
	scenes_DTO = db.session.query(Scenes.chapter_id, Scenes.name, Scenes.story, Scenes.notes).filter(Scenes.chronicle_id == id).order_by(Scenes.number).all()
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
		scene_dict['notes'] = scene.notes
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

def handle_tracker_update(request):
	print(str(request))
	tracker = request['tracker']
	value = request['value']
	if request['remove']:
		value *= -1
	character_id = request['character_id']
	tracker_DTO = db.session.query(Trackers).filter(Trackers.id == character_id).one()
	
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

	handle_update_all(character_data_by_id(character_id))

@socketio.on('data update')
def handle_data_update(request, methods=[ 'POST' ]):
	request_type = str(request['type'])
	print('received event: ' + request_type)
	if request_type == 'tracker':
		handle_tracker_update(request)
	handle_update_all({"updated_data":"none"})

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

