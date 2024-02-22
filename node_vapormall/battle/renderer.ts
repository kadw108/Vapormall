import { FieldedPlayerSoul } from "./battleSoul";
import { FaintData } from "./battle";

import { PlayerSoul } from "../soul/individualSoul";
import { Skill } from "../soul/skill";
import { RenderSoul } from "../soul/renderSoul";

import { SwitchOut, UseSkill } from "./action";
import { BattleItemMenu } from "./battleItemMenu";

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

    private makeSkillWrapper(playerSoul: FieldedPlayerSoul, skill: Skill) {
        const skillWrapper = skill.getSkillContainer();
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

    private renderSkills(playerSoul: FieldedPlayerSoul) {
        const skillContainer = document.createElement("div");
        skillContainer.id = "skillContainer";

        const prompt = document.createElement("p");
        prompt.textContent = "AGGRESSION PROTOCOL INITIATED.";
        skillContainer.append(prompt);

        playerSoul.soul.skills.forEach((skill, i) => {
            const skillWrapper = this.makeSkillWrapper(playerSoul, skill);
            skillContainer?.append(skillWrapper);
        });
        document.getElementById("bottomContent")?.append(skillContainer);
    }

    private makeSwitchContainer(): [HTMLDivElement, HTMLParagraphElement] {
        const switchContainer = document.createElement("div");
        switchContainer.id = "switchContainer";

        const prompt = document.createElement("p");
        switchContainer.append(prompt);

        document.getElementById("bottomContent")?.append(switchContainer);

        return [switchContainer, prompt];
    }

    private makeSwitchWrapper(
        switchOutFainted: boolean,
        action: SwitchOut,
        playerSouls: Array<FieldedPlayerSoul | null>,
    ){
        const battleSoul = playerSouls[action.soulPartyIndex];
        if (battleSoul === null) {
            console.error("battleSoul is null ???");
            return;
        }

        const switchContainer = RenderSoul.getSwitchContainer(battleSoul.soul);
        const switchButton = switchContainer.getElementsByTagName("button")[0];

        let offField = true;
        playerSouls.forEach((s) => {
            if (s !== null && s.soul === battleSoul.soul) {
                offField = false;
            }
        })

        if (battleSoul.soul.currentHP > 0 && offField) {
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

    private renderSwitch(
        playerParty: Array<PlayerSoul>,
        playerSouls: Array<FieldedPlayerSoul | null>
    ){
        const switchContent = this.makeSwitchContainer();

        switchContent[1].textContent = "SWITCH ACTIVE PROCESS?";

        playerParty.forEach((playerSoul, i) => {
            const switchWrapper = this.makeSwitchWrapper(
                false,
                new SwitchOut(0, i), playerSouls);
            if (switchWrapper === undefined) {
                console.error("switchWrapper is undefined");
                return;
            }
            switchContent[0].append(switchWrapper);
        });
    }

    renderFaintSwitch(
        faintInfo: FaintData,
        playerParty: Array<PlayerSoul>,
        playerSouls: Array<FieldedPlayerSoul | null>
    ){
        const switchContent = this.makeSwitchContainer();

        switchContent[1].textContent = "PROCESS DESTROYED. MUST DEPLOY NEW PROCESS.";

        playerParty.forEach((playerSoul, i) => {
            const switchWrapper = this.makeSwitchWrapper(
                true,
                new SwitchOut(faintInfo.playerSoulsIndex, i),
                playerSouls
            );
            if (switchWrapper === undefined) {
                console.error("switchWrapper is undefined");
                return;
            }
            switchContent[0].append(switchWrapper);
        });
    }

    showActions(playerSoul: FieldedPlayerSoul, playerParty: Array<PlayerSoul>, playerSouls: Array<FieldedPlayerSoul | null>) {
        this.renderSkills(playerSoul);
        this.renderSwitch(playerParty, playerSouls);
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