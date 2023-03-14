import {SessionInterface} from "./SessionInterface";

export interface CampaignInterface {
    id:                 string
    admin:              boolean
    characters:         CharacterInterface[]
    notes:              NotesInterface[]
    sessions:           NotesInterface[]
    sessionContent:     SessionInterface
    relationshipMap:    string
    gameType:           string
}