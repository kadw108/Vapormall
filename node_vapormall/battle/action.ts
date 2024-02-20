import { BattleSoul } from "./battleSoul";

class Action {
    battleSoul: BattleSoul;
    soulPartyIndex: number;
}

class UseItem extends Action {

}

class SwitchOut extends Action {
    switchInIndex: number;

    constructor(battleSoul: BattleSoul, soulPartyIndex: number, switchInIndex: number) {
        super();
        this.battleSoul = battleSoul;
        this.soulPartyIndex = soulPartyIndex;
        this.switchInIndex = switchInIndex;
    }
}

class UseSkill extends Action {
}

export {UseItem, SwitchOut, UseSkill};