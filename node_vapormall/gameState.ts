import {PlayerSoul, IndividualSoul} from "./soul/individualSoul";
import {MallMap} from "./map/mallmap";

class GameState {
    public static partySouls: Array<PlayerSoul> = [];
    public static currentFloor: MallMap;

    // used to pass info from room.ejs to battle.ejs
    public static currentEnemy: IndividualSoul|null = null;

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