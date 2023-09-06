import {CONSTANTS} from "./constants";

interface StatChange {
  change: number;
  stat: CONSTANTS.STATS;
}

interface SkillData {
  name: string;
  description: string;
  power: number | null;
  max_pp: number;
  priority: number;
  stat_changes: Array<StatChange>;
  target: CONSTANTS.TARGETS;
  type: CONSTANTS.TYPES;
  meta: {
    category: CONSTANTS.SKILLCATEGORIES;
    crit_rate: number;  
    drain: number;
    healing: number;
    max_hits: number | null;
    max_turns: number | null;
    min_hits: number | null;
    min_turns: number | null;
  };
}

interface Skills { [key: string]: SkillData };

const SKILL_LIST : Skills = {
    basic_attack: {
        name: "Attack",
        description: "Basic attack.",
        power: 4,
        max_pp: 30,
        priority: 0,
        stat_changes: [],
        target: CONSTANTS.TARGETS.SELECTED,
        type: CONSTANTS.TYPES.TYPELESS,
        meta: {
            category: CONSTANTS.SKILLCATEGORIES.NORMALDAMAGE,
            crit_rate: 0,
            drain: 0,
            healing: 0,
            max_hits: null,
            max_turns: null,
            min_hits: null,
            min_turns: null,
        },
    },

    dazzling_polish: {
        name: "Dazzling Polish",
        description: "Polish simulated aesthetics for enhanced beauty. Raise Offense, Glitch Offense.",
        power: null,
        max_pp: 15,
        priority: 0, 
        stat_changes: [
            {
                change: 1,
                stat: CONSTANTS.STATS.OFFENSE
            },
            {
                change: 1,
                stat: CONSTANTS.STATS.GLITCHOFFENSE
            },
        ],
        target: CONSTANTS.TARGETS.SELF,
        type: CONSTANTS.TYPES.SWEET,
        meta: {
            category: CONSTANTS.SKILLCATEGORIES.STATUS,
            crit_rate: 0,
            drain: 0,
            healing: 0,
            max_hits: null,
            max_turns: null,
            min_hits: null,
            min_turns: null,
        },
    },
};

export {SkillData, SKILL_LIST};
