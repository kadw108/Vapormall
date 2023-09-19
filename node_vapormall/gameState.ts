import {IndividualSoul} from "./individualSoul";
import {StatChange} from "./data/skills";
import {CONSTANTS} from "./data/constants";

class GameState {
    private static partySouls: Array<IndividualSoul> = [];

    static getPartySouls() {
        return GameState.partySouls;
    }

    static addSoul(individualSoul: IndividualSoul) {
        GameState.partySouls.push(individualSoul);
    }

    static removeSoul(individualSoul: IndividualSoul) {
        GameState.partySouls.splice(
            this.partySouls.indexOf(individualSoul), 1
        )
    }
}

export {
    GameState
};