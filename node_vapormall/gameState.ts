import {PlayerSoul} from "./individualSoul";
import {MallMap} from "./map/mallmap";

class GameState {
    private static partySouls: Array<PlayerSoul> = [];

    private static currentFloor: MallMap;
    private static coordinates: [number, number];

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
        this.coordinates = this.currentFloor.centerCoord;

        this.currentFloor.mapArray[this.coordinates[0]][this.coordinates[1]].renderRoom();
    }
}

export {
    GameState
};