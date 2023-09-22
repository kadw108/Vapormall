import {Skill} from "../skill";
import {IndividualSoul, PlayerSoul} from "../individualSoul";
import {StatDict, CONSTANTS } from "../data/constants";

abstract class BattleSoul {
    soul: IndividualSoul;
    selected_skill: Skill | null;
    selected_target: Array<BattleSoul> | null;

    infoContainer: HTMLElement;
    detailedInfoDiv: HTMLElement;

    displayHP: number;
    hpText: HTMLElement;
    modifiedStatInfoBox: HTMLElement;

    stat_changes: StatDict;

    index: number;

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

        this.infoContainer = this.genInfoContainer();
        document.getElementById("tophalf")?.append(this.infoContainer);

        this.index = 0;
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

        this.detailedInfoDiv = detailedInfoDiv;

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
        const infoDiv = this.soul.genDetailedInfo();
        infoDiv.classList.remove("bottomhalf-tip");
        infoDiv.classList.add("tophalf-tip");

        this.modifiedStatInfoBox = this.modifiedStatInfo();
        infoDiv.append(
            this.modifiedStatInfoBox
        );

        return infoDiv;
    }

    hasModifiers(): boolean {
        for (let key in this.soul.stats) {
            const keyType = key as unknown as CONSTANTS.STATS;
            if (this.stat_changes[keyType] !== 0) {
                return true;
            }
        }
        return false;
    }

    private modifiedStatInfo() {
        const statGroup = document.createElement("div");

        if (this.hasModifiers()) {
            const statModifiers = document.createElement("small");
            statModifiers.append(
                document.createElement("br"),
                document.createElement("br"),
                document.createTextNode("(After stat modifiers:)"),
                document.createElement("br")
            );

            statGroup.append(statModifiers);
            statGroup.append(
                this.soul.genStatText(this.modifiedStatDict())
            )
        }

        return statGroup;
    }

    modifiedStatDict(): StatDict {
        return {
            [CONSTANTS.STATS.HP]: this.soul.currentHP,
            [CONSTANTS.STATS.ATTACK]: this.calculateStat(CONSTANTS.STATS.ATTACK),
            [CONSTANTS.STATS.DEFENSE]: this.calculateStat(CONSTANTS.STATS.DEFENSE),
            [CONSTANTS.STATS.GLITCHATTACK]: this.calculateStat(CONSTANTS.STATS.GLITCHATTACK),
            [CONSTANTS.STATS.GLITCHDEFENSE]: this.calculateStat(CONSTANTS.STATS.GLITCHDEFENSE),
            [CONSTANTS.STATS.SPEED]: this.calculateStat(CONSTANTS.STATS.SPEED)
        };
    }


    updateHP() {
        this.hpText.innerHTML = this.getHPString();
    }

    updateStats() {
        this.modifiedStatInfoBox.remove();
        this.modifiedStatInfoBox = this.modifiedStatInfo();
        this.detailedInfoDiv.append(this.modifiedStatInfoBox);
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

    switchOut() {
        this.infoContainer.remove();
    }
}

class FieldedPlayerSoul extends BattleSoul {
    constructor(soul: PlayerSoul) {
        super(soul);
        this.infoContainer.classList.add("playerInfo", "soulInfo", "blackBg");
    }
}

class EnemySoul extends BattleSoul {
    constructor(soul: IndividualSoul) {
        super(soul);
        this.infoContainer.classList.add("enemyInfo", "soulInfo", "blackBg");
    }

    chooseMove(
        souls: Array<BattleSoul>,
        playerSouls: Array<FieldedPlayerSoul>,
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
    FieldedPlayerSoul,
    EnemySoul
}