import { FieldedPlayerSoul } from "./battleSoul";
import { FaintData } from "./battle";

import { PlayerSoul } from "../soul/individualSoul";
import { Skill } from "../soul/skill";
import { RenderSoul } from "../soul/renderSoul";

class Renderer { 

    skillHandlerCreator: Function;
    switchHandlerCreator: Function;
    switchFaintHandlerCreator: Function;

    constructor(
        skillHandlerCreator: Function,
        switchHandlerCreator: Function,
        switchFaintHandlerCreator: Function
    ) {
        this.skillHandlerCreator = skillHandlerCreator;
        this.switchHandlerCreator = switchHandlerCreator;
        this.switchFaintHandlerCreator = switchFaintHandlerCreator;
    }

    private makeSkillWrapper(playerSoul: FieldedPlayerSoul, skill: Skill, i: number) {
        const skillWrapper = skill.getSkillContainer();
        const skillButton = skillWrapper.getElementsByTagName("button")[0];

        if (skill.pp > 0) {
            skillButton.addEventListener("click",
                this.skillHandlerCreator(playerSoul, i),
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
            const skillWrapper = this.makeSkillWrapper(playerSoul, skill, i);
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
        switchOut: number | FaintData,
        playerSoul: PlayerSoul,
        switchIn: number,
        playerSouls: Array<FieldedPlayerSoul | null>,
    ){
        const switchContainer = RenderSoul.getSwitchContainer(playerSoul);
        const switchButton = switchContainer.getElementsByTagName("button")[0];

        let offField = true;
        playerSouls.forEach((s) => {
            if (s !== null && s.soul === playerSoul) {
                offField = false;
            }
        })

        if (playerSoul.currentHP > 0 && offField) {
            if (typeof switchOut === "number") {
                switchButton.addEventListener("click",
                    this.switchHandlerCreator(switchOut, switchIn),
                    false);
            }
            else {
                switchButton.addEventListener("click",
                    this.switchFaintHandlerCreator(switchOut, switchIn),
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
            const switchWrapper = this.makeSwitchWrapper(0, playerSoul, i, playerSouls);
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
            const switchWrapper = this.makeSwitchWrapper(faintInfo, playerSoul, i, playerSouls);
            switchContent[0].append(switchWrapper);
        });
    }

    showActions(playerSoul: FieldedPlayerSoul, playerParty: Array<PlayerSoul>, playerSouls: Array<FieldedPlayerSoul | null>) {
        this.renderSkills(playerSoul);
        this.renderSwitch(playerParty, playerSouls);
    }

    hideActions() {
        const bottomContent = document.getElementById("bottomContent");
        bottomContent!.innerHTML = "";
    }

    endBattle() {
        document.getElementById("endScreen")!.classList.remove("hidden");
    }
}

export {
    Renderer
};