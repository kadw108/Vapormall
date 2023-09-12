import {Skill} from "../skill";
import {IndividualSoul } from "../individualSoul";
import {StatDict, CONSTANTS } from "../data/constants";

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

        this.stat_changes = {
            [CONSTANTS.STATS.HP]: 0, // not allowed to change hp
            [CONSTANTS.STATS.ATTACK]: 0,
            [CONSTANTS.STATS.DEFENSE]: 0,
            [CONSTANTS.STATS.GLITCHATTACK]: 0,
            [CONSTANTS.STATS.GLITCHDEFENSE]: 0,
            [CONSTANTS.STATS.SPEED]: 0,
        }

        this.displayHP = this.soul.currentHP;
        this.hpText = document.createElement("small");
        this.hpText.append(
            document.createTextNode(this.getHPString())
        );

        this.infoDiv = this.genInfoContainer();
        document.getElementById("tophalf")?.append(this.infoDiv);
    }

    genInfoContainer() {
        const infoDiv = this.genInfoDiv();
        const detailedInfoDiv = this.genDetailedInfo();

        const infoContainer = document.createElement("div");
        infoContainer.append(infoDiv);
        infoContainer.append(detailedInfoDiv);

        infoDiv.onmouseover = function(){
            detailedInfoDiv.style.display = "block";
        }
        infoDiv.onmouseout = function(){
            detailedInfoDiv.style.display = "none";
        }

        return infoContainer;
    }

    genInfoDiv() {
        const infoDiv = document.createElement("div");

        const nameText = document.createTextNode(this.soul.name);
        infoDiv.append(nameText);

        infoDiv.append(document.createElement("br"));

        infoDiv.append(this.hpText);

        return infoDiv;
    }

    genDetailedInfo() {
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("soul-tip", "skill-div", "hoverDiv");

        const nameText = document.createTextNode(this.soul.name);
        infoDiv.append(
            nameText,
            document.createElement("br")
        );

        const typeContainer = document.createElement("small");
        this.soul.soul_species.types.forEach((type, i) => {
            typeContainer.innerText += type + "/";
        });
        infoDiv.append(typeContainer);

        infoDiv.append(
            document.createElement("hr")
        );

        const statContainer = document.createElement("small");
        for (let key in this.soul.stats) {
            const keyType = key as unknown as CONSTANTS.STATS;
            statContainer.innerText +=
                key + " " +
                this.soul.stats[keyType] + " / ";
        }
        infoDiv.append(statContainer);

        let has_modifiers = false;
        for (let key in this.soul.stats) {
            const keyType = key as unknown as CONSTANTS.STATS;
            if (this.stat_changes[keyType] !== 0) {
                has_modifiers = true;
            }
        }

        if (has_modifiers) {

            const statModifiers = document.createElement("small");
            statModifiers.append(
                document.createElement("br"),
                document.createElement("br"),
                document.createTextNode("(After stat modifiers:)"),
                document.createElement("br")
            );
            infoDiv.append(statModifiers);

            const statContainerModified = document.createElement("small");
            for (let key in this.soul.stats) {
                const keyType = key as unknown as CONSTANTS.STATS;
                statContainerModified.innerText +=
                    key + " " +
                    this.calculateStat(keyType) +
                    " / ";
            }
            infoDiv.append(statContainerModified);
        }

        return infoDiv;
    }

    updateInfo() {
        this.hpText.innerHTML = this.getHPString();
    }

    getHPString() {
        return "HP: " + this.displayHP + "/" + this.soul.stats[CONSTANTS.STATS.HP];
    }

    calculateStat(stat: CONSTANTS.STATS) {
        if (stat === CONSTANTS.STATS.HP) {
            return this.soul.stats[stat];
        }

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