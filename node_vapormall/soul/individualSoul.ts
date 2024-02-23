import {Skill} from "./skill";
import {SoulSpecies, SOUL_LIST} from "../data/soul";
import {CONSTANTS, StatDict} from "../data/constants";
import { RenderIndividualSoul, RenderPlayerSoul } from "./renderIndividualSoul";

/*
Individual soul of a particular species
*/
class IndividualSoul {
    soul_species: SoulSpecies;
    name: string;
    level: number;

    currentHP: number;
    stats: StatDict;

    skills: Array<Skill>;

    renderer: RenderIndividualSoul;

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

        this.renderer = new RenderIndividualSoul(this);
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
}

/*
Individual soul owned/captured by the player
(distinct from FieldedPlayerSoul which represents a player soul on the combat field)
(can be souls in player's party but not on the field during a battle)
*/
class PlayerSoul extends IndividualSoul {
    renderer: RenderPlayerSoul;

    private constructor(soul_species: SoulSpecies, level: number) {
        super(soul_species, level);
    }

    // https://stackoverflow.com/questions/45502366/best-practice-way-of-converting-from-one-type-to-another-in-typescript
    // doesn't work, whatever, manual mapping is the way
    public static createPlayerSoul(individualSoul: IndividualSoul): PlayerSoul {
        const newSoul = new PlayerSoul(individualSoul.soul_species, individualSoul.level);
        const returnSoul = Object.assign(newSoul, individualSoul);

        // Can't put it into the constructor because of the weird
        // way new PlayerSouls are created - Object.assign doesn't copy over methods or
        // something?
        returnSoul.renderer = new RenderPlayerSoul(returnSoul);

        return returnSoul;
    }
}

export {
    IndividualSoul,
    PlayerSoul
};