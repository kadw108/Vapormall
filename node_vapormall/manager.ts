import {Skill, IndividualSoul} from "./individualSoul";
import {GameState} from "./gameState";
import {CONSTANTS} from "./data/constants";
import {SOUL_LIST} from "./data/soul";
import {Battle} from "./battle/battle";

class Manager {
    static startBattle(gameState: GameState) {
        const player1 = gameState.partySouls[0];
        const enemy1 = Manager.generateEnemy();
       
        return new Battle(
            [player1], [enemy1]
        );
    }

    static generateEnemy() {
        return new IndividualSoul(SOUL_LIST.Adware, 1);
    }
}

export {
    Manager
};