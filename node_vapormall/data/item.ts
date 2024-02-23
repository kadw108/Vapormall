import { IndividualSoul } from "../soul/individualSoul";
import { CONSTANTS } from "../data/constants";

interface Item {
    name: string;
    long_name: string;
    sprite: string;
    description: string;
    soulCanUse: Function;
    itemEffect: Function;
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
    return (playerSoul: IndividualSoul) => {
        playerSoul.changeHP(healAmount);
        playerSoul.changeHP(
            Math.ceil(playerSoul.stats[CONSTANTS.STATS.HP] * healPercent * 0.01)
        );
    };
}

const ITEMS: ItemList = {
    repair_module: {
        name: "Repair Module",
        long_name: "Repair Module",
        sprite: "temp.png",
        description: "Restores integrity of damaged process by 10.",
        soulCanUse: hpOverZero,
        itemEffect: makeHealHPFunction(10, 0),
        useMessage: "[target] was healed.",
    },
    advanced_repair_module: {
        name: "Adv. Repair Module",
        long_name: "Advanced Repair Module",
        sprite: "temp.png",
        description: "Restores integrity of damaged process by 25.",
        soulCanUse: hpOverZero,
        itemEffect: makeHealHPFunction(25, 0),
        useMessage: "[target] was healed.",
    },
    full_repair_module: {
        name: "Full Repair Module",
        long_name: "Full Repair Module",
        sprite: "temp.png",
        description: "Restores all integrity of damaged process.",
        soulCanUse: hpOverZero,
        itemEffect: makeHealHPFunction(0, 100),
        useMessage: "[target] was healed.",
    },
};

export { Item, ITEMS };
