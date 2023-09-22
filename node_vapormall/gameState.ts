import {PlayerSoul} from "./individualSoul";
import {StatChange} from "./data/skills";
import {CONSTANTS} from "./data/constants";

class GameState {
    private static partySouls: Array<PlayerSoul> = [];

    static getPartySouls() {
        return GameState.partySouls;
    }

    static addSoul(ownedSoul: PlayerSoul) {
        GameState.partySouls.push(ownedSoul);
    }

    static removeSoul(ownedSoul: PlayerSoul) {
        GameState.partySouls.splice(
            this.partySouls.indexOf(ownedSoul), 1
        )
    }
}

export {
    GameState
};