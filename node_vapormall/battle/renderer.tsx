import { FieldedPlayerSoul } from "./battleSoul";
import { FaintData } from "./battle";

import { PlayerSoul } from "../soul/individualSoul";
import { Skill } from "../soul/skill";
import { RenderSoul } from "../soul/renderSoul";

import { SwitchOut, UseSkill } from "./action";
import { BattleItemMenu } from "./battleItemMenu";

import {h} from "dom-chef";

class Renderer { 

    createActionHandler: Function;
    createSwitchFaintHandler: Function;

    constructor(
        actionHanderCreator: Function,
        createSwitchFaintHandler: Function,
    ) {
        this.createActionHandler = actionHanderCreator;
        this.createSwitchFaintHandler = createSwitchFaintHandler;
    }

    private SkillWrapper(
        playerSoul: FieldedPlayerSoul,
        skill: Skill
    ): JSX.Element {
        const skillWrapper = skill.SkillContainer();
        const skillButton = skillWrapper.getElementsByTagName("button")[0];

        if (skill.pp > 0) {
            const useSkill = new UseSkill(playerSoul.index, skill);
            skillButton.addEventListener("click",
                this.createActionHandler(useSkill),
                false);
        }
        else {
            skillButton.classList.add("noClick");
        }
        return skillWrapper;
    }

    private SkillMenu(playerSoul: FieldedPlayerSoul): JSX.Element {
        return (
            <div id="skillContainer">

                <p>AGGRESSION PROTOCOL INITIATED.</p>

                {playerSoul.soul.skills.map((skill) => {
                    return this.SkillWrapper(playerSoul, skill);
                })}
            </div>
        );
    }

    private SwitchWrapper(
        switchOutFainted: boolean,
        action: SwitchOut,
        playerSouls: Array<FieldedPlayerSoul | null>,
        playerParty: Array<PlayerSoul>
    ): JSX.Element {
        const switchInSoul = playerParty[action.switchInIndex];
        const switchContainer = RenderSoul.getSwitchContainer(switchInSoul);
        const switchButton = switchContainer.getElementsByTagName("button")[0];

        let offField = true;
        playerSouls.forEach((s) => {
            if (s !== null && s.soul === switchInSoul) {
                offField = false;
            }
        })

        if (switchInSoul.currentHP > 0 && offField) {
            if (!switchOutFainted) {
                switchButton.addEventListener("click",
                    this.createActionHandler(action),
                    false);
            }
            else {
                switchButton.addEventListener("click",
                    this.createSwitchFaintHandler(action.soulPartyIndex, action.switchInIndex),
                    false);
            }
        }
        else {
            switchButton.classList.add("noClick");
        }

        return switchContainer;
    }

    private SwitchMenu(
        playerParty: Array<PlayerSoul>,
        playerSouls: Array<FieldedPlayerSoul | null>
    ): JSX.Element {
        return <div id="switchContainer">
            <p>SWITCH ACTIVE PROCESS?</p>

            {playerParty.map((playerSoul, i) => {
                return this.SwitchWrapper(
                    false,
                    new SwitchOut(0, i),
                    playerSouls,
                    playerParty
                );
            })}
        </div>;
    }

    FaintSwitchMenu(
        faintInfo: FaintData,
        playerParty: Array<PlayerSoul>,
        playerSouls: Array<FieldedPlayerSoul | null>
    ): JSX.Element {
        return <div id="switchContainer">
            <p>PROCESS DESTROYED. MUST DEPLOY NEW PROCESS.</p>

            {playerParty.map((playerSoul, i) => {
                return this.SwitchWrapper(
                    true,
                    new SwitchOut(faintInfo.playerSoulsIndex, i),
                    playerSouls,
                    playerParty
                );
            })}
        </div>
    }

    showActions(
        playerSoul: FieldedPlayerSoul,
        playerParty: Array<PlayerSoul>,
        playerSouls: Array<FieldedPlayerSoul | null>
    ) {
        document.getElementById("bottomContent")?.append(
            this.SkillMenu(playerSoul),
            this.SwitchMenu(playerParty, playerSouls)
        );

        const battleItemMenu = new BattleItemMenu(
            playerSoul,
            this.createActionHandler,
        );
    }

    hideActions() {
        const bottomContent = document.getElementById("bottomContent");
        bottomContent!.innerHTML = "";
    }

    showEndScreen() {
        document.getElementById("endScreen")!.classList.remove("hidden");
    }
}

export {
    Renderer
};