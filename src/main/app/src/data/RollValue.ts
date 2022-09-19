interface RollValue {
    player: string
    alias: string
    notify: string
    timestamp: string
    rollFor: string
    roll: {
        regular: number[]
        hunger: number[]
        reroll: boolean
    }
}