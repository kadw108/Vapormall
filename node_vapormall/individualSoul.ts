import {Skill} from "./skill";
import {SoulSpecies, SOUL_LIST} from "./data/soul";
import {CONSTANTS, StatDict} from "./data/constants";

class IndividualSoul {
    soul_species: SoulSpecies;
    name: string;
    level: number;

    currentHP: number;
    stats: StatDict;

    skills: Array<Skill>;

    constructor(soul_species: SoulSpecies, level: number) {
        this.soul_species = soul_species;
        this.name = soul_species.name;
        this.level = level;

        this.skills = [];
        this.stats = {
            [CONSTANTS.STATS.HP]: 0,
            [CONSTANTS.STATS.ATTACK]: 0,
            [CONSTANTS.STATS.DEFENSE]: 0,
            [CONSTANTS.STATS.GLITCHATTACK]: 0,
            [CONSTANTS.STATS.GLITCHDEFENSE]: 0,
            [CONSTANTS.STATS.SPEED]: 0
        }
        this.initializeStats();
        this.levelUpSimulate();

        this.currentHP = this.stats[CONSTANTS.STATS.HP];
    }

    initializeStats() {
        for (let key in this.stats) {
            const keyType = key as unknown as CONSTANTS.STATS;
            this.stats[keyType] = this.soul_species.stats[keyType];
        }
    }

    levelUpSimulate() {
        let newMoveSlot = 0;

        this.soul_species.levelUp
            .filter((levelUpChange) => {return levelUpChange.level <= this.level})
            .forEach((levelUpChange, i) => {
                if (levelUpChange.statChanges !== undefined) {
                    levelUpChange.statChanges.forEach((statChange) => {
                        this.stats[statChange.stat] += statChange.change;
                    });
                }

                if (levelUpChange.learnedSkills !== undefined) {
                    levelUpChange.learnedSkills.forEach((skillData) => {
                        this.skills[newMoveSlot] = new Skill(skillData);
                        newMoveSlot = ++newMoveSlot % 4;
                    });
                }
            });
    }

    changeHP(num: number) {
        this.currentHP = Math.min(this.stats[CONSTANTS.STATS.HP], this.currentHP + num);
        this.currentHP = Math.max(0, this.currentHP);
    }

    changeName(newName: string) {
        this.name = newName;
    }

    getSwitchButton() {
        const switchButton = document.createElement("button");
        switchButton.classList.add("outlineDiv");

        const nameText = document.createTextNode(this.name);
        switchButton.append(nameText);
        switchButton.append(document.createElement("br"));

        return switchButton;
    }
}

export {
    IndividualSoul
};