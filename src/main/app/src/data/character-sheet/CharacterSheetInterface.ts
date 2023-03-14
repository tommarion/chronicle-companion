interface CharacterSheetInterface {
    id:             string
    bio:            CharacterBio
    bioText:        string
    sheet:          CharacterSheetStatsInterface
    disciplines:    DisciplineInterface[]
    name:           string
}