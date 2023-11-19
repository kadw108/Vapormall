import {IndividualSoul, PlayerSoul} from "./individualSoul";
import {Skill} from "./skill";
import {GameState} from "./gameState";
import {CONSTANTS} from "./data/constants";
import {SOUL_LIST} from "./data/soul";
import {Battle} from "./battle/battle";

class Manager {
    static startBattle(): Battle|null {
        const players = GameState.getPartySouls();
        const enemy1 = GameState.currentEnemy;

        if (enemy1 === null) {
            console.error("Battle with no enemy!");
            return null;
        }
       
        return new Battle(
            players, [enemy1]
        );
    }
}

export {
    Manager
};