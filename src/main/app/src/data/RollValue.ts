interface RollValue {
    player:     string
    alias:      string
    notify:     string
    timestamp:  string
    rollFor:    string
    rollWith?:  string
    roll: {
        regular:    number[]
        hunger:     number[]
        reroll:     boolean
    }
}