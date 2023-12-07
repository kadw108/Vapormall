interface Item {
    name: string;
    long_name: string;
    sprite: string;
    description: string;
}

interface HealingItem extends Item {
    healHp: number;
    healPercent: number;
}

interface HealingItemList { [key: string]: HealingItem };

const HEALING_ITEMS : HealingItemList = {
    repair_module: {
        name: "Repair Module",
        long_name: "Repair Module",
        sprite: "temp.png",
        description: "Restores integrity of damaged process by 10.",
        healHp: 10,
        healPercent: -1
    },
    advanced_repair_module: {
        name: "Adv. Repair Module",
        long_name: "Advanced Repair Module",
        sprite: "temp.png",
        description: "Restores integrity of damaged process by 25.",
        healHp: 25,
        healPercent: -1
    },
    full_repair_module: {
        name: "Full Repair Module",
        long_name: "Full Repair Module",
        sprite: "temp.png",
        description: "Restores all integrity of damaged process.",
        healHp: -1,
        healPercent: 100
    }
}

export {Item, HEALING_ITEMS};