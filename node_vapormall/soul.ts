import {CONSTANTS, StatDict} from "./constants";
import {SkillData, SKILL_LIST} from "./skills";

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
  stats: StatDict;
  sprites: Sprites;
  types: Array<CONSTANTS.TYPES>;
  skills: Array<SkillWrapper>;
}

const SOUL_LIST = {
    Adware: {
        name: "ADWARE",
        description: "Churning glut of incoherence.",
        stats: {
            [CONSTANTS.STATS.HP]: 20,
            [CONSTANTS.STATS.OFFENSE]: 3,
            [CONSTANTS.STATS.DEFENSE]: 10,
            [CONSTANTS.STATS.GLITCHOFFENSE]: 10,
            [CONSTANTS.STATS.GLITCHDEFENSE]: 7,
            [CONSTANTS.STATS.SPEED]: 8
        },
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
