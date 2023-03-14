enum GameType {
    VAMPIRE, DND, GEN, NULL
}
export default GameType;

export function getGameType(gameType: string): GameType {
    switch (gameType) {
        case "dnd":
            return GameType.DND;
        case "vampire":
        case "vtm":
            return GameType.VAMPIRE;
        case "gen":
            return GameType.GEN;
    }
}