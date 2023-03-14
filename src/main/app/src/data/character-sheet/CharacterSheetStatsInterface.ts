interface CharacterSheetStatsInterface {
    attributes: CharacterSheetAttributesInterface
    skills:     any
    trackers:   CharacterTrackersInterface
    advantages: AdvantageFlawInterface[]
    flaws:      AdvantageFlawInterface[]
}