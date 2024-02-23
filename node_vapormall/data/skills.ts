import { CONSTANTS } from "./constants";

interface StatChange {
    change: -3 | -2 | -1 | 1 | 2 | 3;
    stat: CONSTANTS.STATS;
    target: CONSTANTS.TARGETS;
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

interface Skills {
    [key: string]: SkillData;
}

const SKILL_LIST: Skills = {
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

    recoil: {
        name: "Recoil",
        description: "Restores half the damage dealt.",
        power: 12,
        max_pp: 15,
        priority: 0,
        stat_changes: [],
        target: CONSTANTS.TARGETS.SELECTED,
        type: CONSTANTS.TYPES.ERROR,
        meta: {
            category: CONSTANTS.SKILLCATEGORIES.NORMALDAMAGE,
            crit_rate: 0,
            drain: -33,
            healing: 0,
            max_hits: null,
            max_turns: null,
            min_hits: null,
            min_turns: null,
        },
    },

    drain: {
        name: "Drain",
        description: "Restores half the damage dealt.",
        power: 4,
        max_pp: 20,
        priority: 0,
        stat_changes: [],
        target: CONSTANTS.TARGETS.SELECTED,
        type: CONSTANTS.TYPES.TYPELESS,
        meta: {
            category: CONSTANTS.SKILLCATEGORIES.NORMALDAMAGE,
            crit_rate: 0,
            drain: 50,
            healing: 0,
            max_hits: null,
            max_turns: null,
            min_hits: null,
            min_turns: null,
        },
    },

    dazzling_polish: {
        name: "Dazzling Polish",
        description:
            "Polish simulated aesthetics for enhanced beauty. Raise Offense, Glitch Offense.",
        power: null,
        max_pp: 15,
        priority: 0,
        stat_changes: [
            {
                change: 1,
                stat: CONSTANTS.STATS.ATTACK,
                target: CONSTANTS.TARGETS.SELF,
            },
            {
                change: 1,
                stat: CONSTANTS.STATS.GLITCHATTACK,
                target: CONSTANTS.TARGETS.SELF,
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

export { SkillData, SKILL_LIST, StatChange };
