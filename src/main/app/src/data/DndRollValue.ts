
interface DndRollValue {
    player:     string
    alias:      string
    notify:     string
    timestamp:  string
    rollFor:    string
    rollWith?:  string
    roll:       DndRollResultValue[]
}