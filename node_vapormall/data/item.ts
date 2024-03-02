import { IndividualSoul } from "../soul/individualSoul";
import { CONSTANTS } from "../data/constants";
import { BattleSim } from "../battle/sim/battleSim";
import { BattleSoul } from "../battle/sim/battleSoul";

interface Item {
    name: string;
    long_name: string;
    sprite: string;
    description: string;
    soulCanUse: Function;
    effect: Function;
    inBattleEffect: Function;
    useMessage: string;
}

interface ItemList {
    [key: string]: Item;
}

function hpOverZero(soul: IndividualSoul): boolean {
    return (
        soul.currentHP !== soul.stats[CONSTANTS.STATS.HP] && soul.currentHP > 0
    );
}

function makeHealHPFunction(healAmount: number, healPercent: number): Function {
    return (soul: IndividualSoul) => {
        soul.changeHP(healAmount);
        soul.changeHP(
            Math.ceil(soul.stats[CONSTANTS.STATS.HP] * healPercent * 0.01)
        );
    };
}
function makeBattleHealHPFunction(healAmount: number, healPercent: number): Function {
    return (battleSim: BattleSim, battleSoul: BattleSoul) => {
        const realHealAmount = healAmount + Math.ceil(battleSoul.soul.stats[CONSTANTS.STATS.HP] * healPercent * 0.01);
        battleSim.changeHP(battleSoul, realHealAmount);
    }
}

const ITEMS: ItemList = {
    repair_module: {
        name: "Repair Module",
        long_name: "Repair Module",
        sprite: "temp.png",
        description: "Restores integrity of damaged process by 10.",
        soulCanUse: hpOverZero,
        effect: makeHealHPFunction(10, 0),
        inBattleEffect: makeBattleHealHPFunction(10, 0),
        useMessage: "[target] was healed.",
    },
    advanced_repair_module: {
        name: "Adv. Repair Module",
        long_name: "Advanced Repair Module",
        sprite: "temp.png",
        description: "Restores integrity of damaged process by 25.",
        soulCanUse: hpOverZero,
        effect: makeHealHPFunction(25, 0),
        inBattleEffect: makeBattleHealHPFunction(25, 0),
        useMessage: "[target] was healed.",
    },
    full_repair_module: {
        name: "Full Repair Module",
        long_name: "Full Repair Module",
        sprite: "temp.png",
        description: "Restores all integrity of damaged process.",
        soulCanUse: hpOverZero,
        effect: makeHealHPFunction(0, 100),
        inBattleEffect: makeBattleHealHPFunction(0, 100),
        useMessage: "[target] was healed.",
    },
};

export { Item, ITEMS };
