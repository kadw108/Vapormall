import {IndividualSoul} from "./individualSoul";
import {Skill} from "./skill";
import {GameState} from "./gameState";
import {CONSTANTS} from "./data/constants";
import {SOUL_LIST} from "./data/soul";
import {Battle} from "./battle/battle";

class Manager {
    static startBattle() {
        const players = GameState.getPartySouls();
        const enemy1 = Manager.generateEnemy();
       
        return new Battle(
            players, [enemy1]
        );
    }

    static generateEnemy() {
        return new IndividualSoul(SOUL_LIST.Adware, 1);
    }
}

export {
    Manager
};