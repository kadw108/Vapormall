import { BattleSoul } from "./battleSoul";

class Action {
    soulPartyIndex: number;
}

class UseItem extends Action {

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
    whichSkill: number;

    constructor(soulPartyIndex: number, whichSkill: number) {
        super();
        this.soulPartyIndex = soulPartyIndex;
        this.whichSkill = whichSkill;
    }
}

export {Action, UseItem, SwitchOut, UseSkill};