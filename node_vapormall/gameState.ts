import {PlayerSoul, IndividualSoul} from "./soul/individualSoul";
import {MallMap} from "./map/mallmap";
import { Inventory } from "./inventory";
import { Room } from "./map/room";

class GameState {
    private static _partySouls: Array<PlayerSoul> = [];
    public static get partySouls() {
        return GameState._partySouls;
    }

    private static _currentFloor: MallMap;
    public static get currentFloor() {
        return GameState._currentFloor;
    }

    private static _inventory: Inventory = new Inventory();
    public static get Inventory() {
        return GameState._inventory;
    }

    private static _visitedRooms: Array<Room> = [];
    public static get VisitedRooms() {
        return GameState._visitedRooms;
    }
    public static addVisitedRoom(room: Room) {
        for (const r of GameState.VisitedRooms) {
            if (r.coord === room.coord) {
                return;
            }
        }
        GameState._visitedRooms.push(room);
    }

    // used to pass info from room.ejs to battle.ejs
    public static currentEnemy: IndividualSoul|null = null;

    static addSoul(ownedSoul: PlayerSoul) {
        GameState._partySouls.push(ownedSoul);
    }

    static removeSoul(ownedSoul: PlayerSoul) {
        GameState._partySouls.splice(
            GameState._partySouls.indexOf(ownedSoul), 1
        )
    }

    static generateFloor() {
        GameState._currentFloor = new MallMap();
    }
}

export {
    GameState
};