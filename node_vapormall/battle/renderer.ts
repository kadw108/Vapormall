import { FieldedPlayerSoul } from "./battleSoul";
import { PlayerSoul } from "../soul/individualSoul";
import { Skill } from "../soul/skill";
import { RenderSoul } from "../soul/renderSoul";

class Renderer { 

    skillHandlerCreator: Function;
    switchHandlerCreator: Function;

    constructor(skillHandlerCreator: Function, switchHandlerCreator: Function) {
        this.skillHandlerCreator = skillHandlerCreator;
        this.switchHandlerCreator = switchHandlerCreator;
    }

    renderSkills(playerSoul: FieldedPlayerSoul) {
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

    makeSkillWrapper(playerSoul: FieldedPlayerSoul, skill: Skill, i: number) {
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

    hideActions() {
        const bottomContent = document.getElementById("bottomContent");
        bottomContent!.innerHTML = "";
    }

    showActions(playerSoul: FieldedPlayerSoul, playerParty: Array<PlayerSoul>, playerSouls: Array<FieldedPlayerSoul>) {
        this.renderSkills(playerSoul);
        this.renderSwitch(playerParty, playerSouls);
    }

    renderSwitch(playerParty: Array<PlayerSoul>, playerSouls: Array<FieldedPlayerSoul>) {
        const switchContainer = document.createElement("div");
        switchContainer.id = "switchContainer";

        const prompt = document.createElement("p");
        prompt.textContent = "SWITCH ACTIVE PROCESS?";
        switchContainer.append(prompt);

        playerParty.forEach((playerSoul, i) => {
            const switchWrapper = this.makeSwitchWrapper(playerSoul, i, playerSouls);
            switchContainer?.append(switchWrapper);
        });
        document.getElementById("bottomContent")?.append(switchContainer);
    }

    makeSwitchWrapper(playerSoul: PlayerSoul, switchIn: number, playerSouls: Array<FieldedPlayerSoul>) {
        const switchContainer = RenderSoul.getSwitchContainer(playerSoul);
        const switchButton = switchContainer.getElementsByTagName("button")[0];

        let offField = true;
        playerSouls.forEach((s) => {
            if (s.soul === playerSoul) {
                offField = false;
            }
        })

        if (playerSoul.currentHP > 0 && offField) {
            switchButton.addEventListener("click",
                this.switchHandlerCreator(0, switchIn),
                false);
        }
        else {
            switchButton.classList.add("noClick");
        }

        return switchContainer;
    }
}

export {
    Renderer
};