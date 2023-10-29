import {PlayerSoul} from "./individualSoul";
import {MallMap} from "./map/mallmap";

class GameState {
    private static partySouls: Array<PlayerSoul> = [];
    private static currentFloor: MallMap;

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

    static generateFloor() {
        this.currentFloor = new MallMap();
    }
}

export {
    GameState
};