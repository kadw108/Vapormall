import {CONSTANTS} from "./constants";
import {SkillData, SKILL_LIST} from "./skills";

interface StatWrapper {
  stat: CONSTANTS.STATS;
  starting_stat: number;
}

interface Sprites {
  front: string;
  back: string;
}

interface SkillWrapper {
  skill_meta: SkillData;
  learned_at: number;
}

interface SoulSpecies {
  name: string;
  description: string;
  stats: Array<StatWrapper>;
  sprites: Sprites;
  types: Array<CONSTANTS.TYPES>;
  skills: Array<SkillWrapper>;
}

const SOUL_LIST = {
    Adware: {
        name: "ADWARE",
        description: "Churning glut of incoherence.",
        stats: [
            {stat: CONSTANTS.STATS.HP, starting_stat: 20},
            {stat: CONSTANTS.STATS.OFFENSE, starting_stat: 3},
            {stat: CONSTANTS.STATS.DEFENSE, starting_stat: 10},
            {stat: CONSTANTS.STATS.GLITCHOFFENSE, starting_stat: 10},
            {stat: CONSTANTS.STATS.GLITCHDEFENSE, starting_stat: 7},
            {stat: CONSTANTS.STATS.SPEED, starting_stat: 8},
        ],
        sprites: {
            front: "temp.gif",
            back: "temp.gif",
        },
        types: [
            CONSTANTS.TYPES.ERROR
        ],
        skills: [
            {skill_meta: SKILL_LIST.basic_attack, learned_at: 0},
            {skill_meta: SKILL_LIST.dazzling_polish, learned_at: 0}
        ],
    }
};

export {SoulSpecies, SOUL_LIST};
