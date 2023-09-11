import {Skill, IndividualSoul} from "./individualSoul";
import {StatChange} from "./data/skills";
import {CONSTANTS} from "./data/constants";

class GameState {
    partySouls: Array<IndividualSoul>;

    constructor() {
        this.partySouls = [];
    }

    addSoul(individualSoul: IndividualSoul) {
        this.partySouls.push(individualSoul);
    }

    removeSoul(individualSoul: IndividualSoul) {
        this.partySouls.splice(
            this.partySouls.indexOf(individualSoul), 1
        )
    }
}

export {
    GameState
};