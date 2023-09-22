import {OwnedSoul} from "./individualSoul";
import {StatChange} from "./data/skills";
import {CONSTANTS} from "./data/constants";

class GameState {
    private static partySouls: Array<OwnedSoul> = [];

    static getPartySouls() {
        return GameState.partySouls;
    }

    static addSoul(ownedSoul: OwnedSoul) {
        GameState.partySouls.push(ownedSoul);
    }

    static removeSoul(ownedSoul: OwnedSoul) {
        GameState.partySouls.splice(
            this.partySouls.indexOf(ownedSoul), 1
        )
    }
}

export {
    GameState
};