import {Skill, IndividualSoul } from "../individualsoul";
import {StatDict, CONSTANTS } from "../constants";

abstract class BattleSoul {
    soul: IndividualSoul;
    selected_skill: Skill | null;
    selected_target: Array<BattleSoul> | null;

    infoDiv: HTMLElement;
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
        return "HP: " + this.soul.currentHP + "/" + this.soul.stats[CONSTANTS.STATS.HP];
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
}

export {
    BattleSoul,
    PlayerSoul,
    EnemySoul
}