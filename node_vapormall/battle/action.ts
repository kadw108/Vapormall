import { Item } from "../data/item";
import { IndividualSoul } from "../soul/individualSoul";
import { Skill } from "../soul/skill";

class Action {
    soulPartyIndex: number;

    constructor(soulPartyIndex: number) {
        this.soulPartyIndex = soulPartyIndex;
    }

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
    targetSoul: IndividualSoul;

    constructor(
        soulPartyIndex: number,
        item: Item,
        targetSoul: IndividualSoul
    ) {
        super(soulPartyIndex);
        this.item = item;
        this.targetSoul = targetSoul;
    }
}

class SwitchOut extends Action {
    switchInIndex: number;

    constructor(soulPartyIndex: number, switchInIndex: number) {
        super(soulPartyIndex);
        this.switchInIndex = switchInIndex;
    }
}

class UseSkill extends Action {
    skill: Skill;

    constructor(soulPartyIndex: number, skill: Skill) {
        super(soulPartyIndex);
        this.skill = skill;
    }
}

export { Action, UseItem, SwitchOut, UseSkill };
