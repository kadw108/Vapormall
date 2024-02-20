import { Item } from "../data/item";
import { Skill } from "../soul/skill";
import { BattleSoul } from "./battleSoul";

class Action {
    soulPartyIndex: number;

    isUseItem() {
        return this.constructor.name === UseItem.name;
    }
    isSwitchOut() {
        return this.constructor.name === SwitchOut.name;
    }
    isUseSkill() {
        return this.constructor.name === UseSkill.name;
    }
}

class UseItem extends Action {
    item: Item;

    constructor(soulPartyIndex: number, item: Item) {
        super();
        this.item = item;
    }
}

class SwitchOut extends Action {
    switchInIndex: number;

    constructor(soulPartyIndex: number, switchInIndex: number) {
        super();
        this.soulPartyIndex = soulPartyIndex;
        this.switchInIndex = switchInIndex;
    }
}

class UseSkill extends Action {
    skill: Skill;

    constructor(soulPartyIndex: number, skill: Skill) {
        super();
        this.soulPartyIndex = soulPartyIndex;
        this.skill = skill;
    }
}

export {Action, UseItem, SwitchOut, UseSkill};