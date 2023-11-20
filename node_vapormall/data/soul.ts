import {CONSTANTS, StatDict} from "./constants";
import {SkillData, SKILL_LIST} from "./skills";

interface Sprites {
  front: string;
  back: string;
}

interface LevelUpStatChange {
  stat: CONSTANTS.STATS;
  change: number;
}

interface LevelUpChange {
  level: number;
  statChanges?: Array<LevelUpStatChange>;
  learnedSkills?: Array<SkillData>;
}

interface SoulSpecies {
  name: string;
  description: string;
  stats: StatDict;
  sprites: Sprites;
  types: Array<CONSTANTS.TYPES>;
  levelUp: Array<LevelUpChange>;
}

const SOUL_LIST = {
    Adware: {
        name: "ADWARE",
        description: "Churning glut of incoherence.",
        stats: {
            [CONSTANTS.STATS.HP]: 15,
            [CONSTANTS.STATS.ATTACK]: 10,
            [CONSTANTS.STATS.DEFENSE]: 10,
            [CONSTANTS.STATS.GLITCHATTACK]: 10,
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
        levelUp: [
            {
              level: 1,
              learnedSkills: [
                SKILL_LIST.basic_attack,
                SKILL_LIST.recoil
              ]
            },
            {
              level: 2,
              statChanges: [
                {stat: CONSTANTS.STATS.SPEED, change: 6}
              ],
              learnedSkills: [
                SKILL_LIST.dazzling_polish
              ]
            },
            {
              level: 3,
              statChanges: [
                {stat: CONSTANTS.STATS.DEFENSE, change: 6}
              ]
            },
            {
              level: 4,
              statChanges: [
                {stat: CONSTANTS.STATS.HP, change: 15}
              ],
              learnedSkills: [
                SKILL_LIST.drain
              ]
            },
            {
              level: 5,
              statChanges: [
                {stat: CONSTANTS.STATS.GLITCHDEFENSE, change: 3},
                {stat: CONSTANTS.STATS.DEFENSE, change: 3},
              ]
            },
            {
              level: 6,
              statChanges: [
                {stat: CONSTANTS.STATS.ATTACK, change: 6},
                {stat: CONSTANTS.STATS.GLITCHATTACK, change: 6},
              ]
            },
            {
              level: 7,
              statChanges: [
                {stat: CONSTANTS.STATS.ATTACK, change: 6},
                {stat: CONSTANTS.STATS.GLITCHATTACK, change: 6},
              ]
            },
            {
              level: 8,
              statChanges: [
                {stat: CONSTANTS.STATS.HP, change: 20},
              ]
            }
        ],
    }
};

export {SoulSpecies, SOUL_LIST};
