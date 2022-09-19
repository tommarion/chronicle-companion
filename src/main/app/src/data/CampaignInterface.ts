export interface CampaignInterface {
    id: string
    admin: boolean
    characters: CharacterInterface[]
    notes: NotesInterface[]
    sessions: NotesInterface[]
}