import {SkillData, SKILL_LIST} from "./skills";
import {SoulSpecies, SOUL_LIST} from "./soul";
import {CONSTANTS, StatDict} from "./constants";

class Skill{
    data: SkillData;
    pp: number;

    constructor(skill_data: SkillData) {
        this.data = skill_data;
        this.pp = skill_data.max_pp;
    }

    renderSkillButton(): HTMLButtonElement {
        const skillButton = document.createElement("button");
        skillButton.classList.add("skill-button");

        const nameText = document.createTextNode(this.data.name);
        skillButton.append(nameText);
        skillButton.append(document.createElement("br"));

        const typeText = document.createElement("small");
        typeText.append(
            document.createTextNode(this.data.type + " ")
        );
        skillButton.append(typeText);

        const ppText = document.createElement("small");
        ppText.append(
            document.createTextNode(this.pp + "/" + this.data.max_pp)
        );
        skillButton.append(ppText);

        return skillButton;
    }
}

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
            [CONSTANTS.STATS.OFFENSE]: 0,
            [CONSTANTS.STATS.DEFENSE]: 0,
            [CONSTANTS.STATS.GLITCHOFFENSE]: 0,
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
        this.currentHP = Math.min(this.currentHP, this.currentHP + num);
        this.currentHP = Math.max(0, this.currentHP);
    }
}

export {
    Skill,
    IndividualSoul
};