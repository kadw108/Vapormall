import {Skill, IndividualSoul } from "../individualsoul";
import {StatDict, CONSTANTS } from "../constants";

abstract class BattleSoul {
    soul: IndividualSoul;
    selected_skill: Skill | null;
    selected_target: Array<BattleSoul> | null;

    infoDiv: HTMLElement;
    displayHP: number;
    hpText: HTMLElement;

    stat_changes: StatDict;

    constructor(soul: IndividualSoul) {
        this.soul = soul;
        this.selected_skill = null;
        this.selected_target = null;

        this.infoDiv = document.createElement("div");
        const nameText = document.createTextNode(this.soul.name);
        this.infoDiv.append(nameText);
        this.infoDiv.append(document.createElement("br"));

        this.displayHP = this.soul.currentHP;
        this.hpText = document.createElement("small");
        this.hpText.append(
            document.createTextNode(this.getHPString())
        );
        this.infoDiv.append(this.hpText);
        document.getElementById("tophalf")?.append(this.infoDiv);

        this.stat_changes = {
            [CONSTANTS.STATS.HP]: -1, // not allowed to change hp
            [CONSTANTS.STATS.OFFENSE]: 0,
            [CONSTANTS.STATS.DEFENSE]: 0,
            [CONSTANTS.STATS.GLITCHOFFENSE]: 0,
            [CONSTANTS.STATS.GLITCHDEFENSE]: 0,
            [CONSTANTS.STATS.SPEED]: 0,
        }
    }

    updateInfo() {
        this.hpText.innerHTML = this.getHPString();
    }

    getHPString() {
        return "HP: " + this.displayHP + "/" + this.soul.stats[CONSTANTS.STATS.HP];
    }

    calculateStat(stat: CONSTANTS.STATS) {
        const base = this.soul.stats[stat];

        let modifier;
        if (this.stat_changes[stat] > 0) {
            modifier = (2 + this.stat_changes[stat]) / 2;
        }
        else {
            modifier = 2 / (2 - this.stat_changes[stat]);
        }

        return Math.max(Math.floor(base * modifier), 1);
    }
}

class PlayerSoul extends BattleSoul {
    constructor(soul: IndividualSoul) {
        super(soul);
        this.infoDiv.classList.add("playerInfo", "soulInfo", "blackBg");
    }

}

class EnemySoul extends BattleSoul {
    constructor(soul: IndividualSoul) {
        super(soul);
        this.infoDiv.classList.add("enemyInfo", "soulInfo", "blackBg");
    }

    chooseMove(
        souls: Array<BattleSoul>,
        playerSouls: Array<PlayerSoul>,
        enemySouls: Array<EnemySoul>
    ) {
        console.log(this.soul.skills);

        const randomSkill = Math.floor(Math.random() * this.soul.skills.length);
        this.selected_skill = this.soul.skills[randomSkill];

        switch (this.selected_skill.data.target) {
            case CONSTANTS.TARGETS.SELECTED:
            case CONSTANTS.TARGETS.OPPOSING:
                const randomTarget = Math.floor(Math.random() * playerSouls.length);
                this.selected_target = [playerSouls[randomTarget]];
                break;

            case CONSTANTS.TARGETS.ALLIED:
            case CONSTANTS.TARGETS.ALLY:
            case CONSTANTS.TARGETS.SELF:
                this.selected_target = [this];
                break;

            case CONSTANTS.TARGETS.ALL:
            case CONSTANTS.TARGETS.NONE:
                break;
        }
    } 
}

export {
    BattleSoul,
    PlayerSoul,
    EnemySoul
}