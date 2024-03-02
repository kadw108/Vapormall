import { IndividualSoul, PlayerSoul } from "../../soul/individualSoul";
import { StatDict, CONSTANTS } from "../../data/constants";
import { RenderBattleSoul } from "../renderBattleSoul";
import { Action, UseSkill } from "../action";

abstract class BattleSoul {
    soul: IndividualSoul;
    selectedAction: Action | null;
    selectedTarget: Array<BattleSoul> | null;

    statChanges: StatDict;

    index: number;

    renderer: RenderBattleSoul;

    constructor(soul: IndividualSoul) {
        this.soul = soul;
        this.selectedAction = null;
        this.selectedTarget = null;

        this.statChanges = {
            [CONSTANTS.STATS.HP]: 0, // not allowed to change hp
            [CONSTANTS.STATS.ATTACK]: 0,
            [CONSTANTS.STATS.DEFENSE]: 0,
            [CONSTANTS.STATS.GLITCHATTACK]: 0,
            [CONSTANTS.STATS.GLITCHDEFENSE]: 0,
            [CONSTANTS.STATS.SPEED]: 0,
        };

        this.index = 0;

        this.renderer = new RenderBattleSoul(this);
    }

    hasModifiers(): boolean {
        for (let key in this.soul.stats) {
            const keyType = key as unknown as CONSTANTS.STATS;
            if (this.statChanges[keyType] !== 0) {
                return true;
            }
        }
        return false;
    }

    modifiedStatDict(): StatDict {
        return {
            [CONSTANTS.STATS.HP]: this.soul.currentHP,
            [CONSTANTS.STATS.ATTACK]: this.calculateStat(
                CONSTANTS.STATS.ATTACK
            ),
            [CONSTANTS.STATS.DEFENSE]: this.calculateStat(
                CONSTANTS.STATS.DEFENSE
            ),
            [CONSTANTS.STATS.GLITCHATTACK]: this.calculateStat(
                CONSTANTS.STATS.GLITCHATTACK
            ),
            [CONSTANTS.STATS.GLITCHDEFENSE]: this.calculateStat(
                CONSTANTS.STATS.GLITCHDEFENSE
            ),
            [CONSTANTS.STATS.SPEED]: this.calculateStat(CONSTANTS.STATS.SPEED),
        };
    }

    calculateStat(stat: CONSTANTS.STATS) {
        if (stat === CONSTANTS.STATS.HP) {
            return this.soul.stats[stat];
        }

        const base = this.soul.stats[stat];

        let modifier;
        if (this.statChanges[stat] > 0) {
            modifier = (2 + this.statChanges[stat]) / 2;
        } else {
            modifier = 2 / (2 - this.statChanges[stat]);
        }

        return Math.max(Math.floor(base * modifier), 1);
    }

    removeUI() {
        this.renderer.infoContainer.remove();
    }
}

class FieldedPlayerSoul extends BattleSoul {
    constructor(soul: PlayerSoul) {
        super(soul);
        this.renderer.infoContainer.classList.add(
            "playerInfo",
            "soulInfo",
            "blackBg"
        );
    }
}

class EnemySoul extends BattleSoul {
    constructor(soul: IndividualSoul) {
        super(soul);
        this.renderer.infoContainer.classList.add(
            "enemyInfo",
            "soulInfo",
            "blackBg"
        );
    }

    chooseMove(
        souls: Array<BattleSoul | null>,
        playerSouls: Array<FieldedPlayerSoul | null>,
        enemySouls: Array<EnemySoul>
    ) {
        // const randomSkill = Math.floor(Math.random() * this.soul.skills.length);
        const randomSkill = 1;
        const selected_skill = this.soul.skills[randomSkill];
        this.selectedAction = new UseSkill(this.index, selected_skill);

        switch (selected_skill.data.target) {
            case CONSTANTS.TARGETS.SELECTED:
            case CONSTANTS.TARGETS.OPPOSING:
                let randomTarget = Math.floor(
                    Math.random() * playerSouls.length
                );
                while (playerSouls[randomTarget] === null) {
                    randomTarget++;

                    if (randomTarget > 500) {
                        console.error("null player skill !!");
                    }
                }
                this.selectedTarget = [playerSouls[randomTarget]!];
                break;

            case CONSTANTS.TARGETS.ALLIED:
            case CONSTANTS.TARGETS.ALLY:
            case CONSTANTS.TARGETS.SELF:
                this.selectedTarget = [this];
                break;

            case CONSTANTS.TARGETS.ALL:
            case CONSTANTS.TARGETS.NONE:
                break;
        }
    }
}

export { BattleSoul, FieldedPlayerSoul, EnemySoul };
