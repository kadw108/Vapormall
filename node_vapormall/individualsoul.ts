import {SkillData, SKILL_LIST} from "./skills";
import {SoulSpecies, SOUL_LIST} from "./soul";

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

    hp: number;
    max_hp: number;
    offense: number;
    defense: number;
    glitch_offense: number;
    glitch_defense: number;
    speed: number;

    skills: Array<Skill>;

    constructor(soul_species: SoulSpecies, level: number) {
        this.soul_species = soul_species;
        this.name = soul_species.name;
        this.level = level;

        this.initializeStats();

        this.skills = [];
        this.initializeSkills();
    }

    initializeStats() {
        this.max_hp = this.soul_species.stats[0].starting_stat;
        this.hp = this.max_hp;
        this.offense = this.soul_species.stats[1].starting_stat;
        this.defense = this.soul_species.stats[2].starting_stat;
        this.glitch_offense = this.soul_species.stats[3].starting_stat;
        this.glitch_defense = this.soul_species.stats[4].starting_stat;
        this.speed = this.soul_species.stats[5].starting_stat;
        
        // TODO level stuff
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