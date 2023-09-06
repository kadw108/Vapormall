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

        this.stats = {
            [CONSTANTS.STATS.HP]: 0,
            [CONSTANTS.STATS.OFFENSE]: 0,
            [CONSTANTS.STATS.DEFENSE]: 0,
            [CONSTANTS.STATS.GLITCHOFFENSE]: 0,
            [CONSTANTS.STATS.GLITCHDEFENSE]: 0,
            [CONSTANTS.STATS.SPEED]: 0
        }
        this.initializeStats();

        this.skills = [];
        this.initializeSkills();
    }

    initializeStats() {
        for (let key in this.stats) {
            const keyType = key as unknown as CONSTANTS.STATS;
            this.stats[keyType] = this.soul_species.stats[keyType];
        }
        
        // TODO level stuff

        this.currentHP = this.stats[CONSTANTS.STATS.HP];
    }

    initializeSkills() {
        for (let i = 0; i < this.soul_species.skills.length; i++) {
            const skill_wrapper = this.soul_species.skills[i];

            if (skill_wrapper.learned_at <= this.level) {
                this.skills.push(
                  new Skill(skill_wrapper.skill_meta)
                );
            }
        }
    }
}

export {
    Skill,
    IndividualSoul
};