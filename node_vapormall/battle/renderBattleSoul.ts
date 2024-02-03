import { CONSTANTS } from "../data/constants";
import { RenderSoul } from "../soul/renderSoul";
import { BattleSoul, FieldedPlayerSoul } from "./battleSoul";

class RenderBattleSoul {

    battleSoul: BattleSoul;
    displayHP: number;

    infoContainer: HTMLElement;
    detailedInfoDiv: HTMLElement;
    modifiedStatInfoBox: HTMLElement;

    constructor(battleSoul: BattleSoul) {
        this.battleSoul = battleSoul;

        this.displayHP = this.battleSoul.soul.currentHP;

        this.infoContainer = this.genInfoContainer();
        document.getElementById("topHalf")?.append(this.infoContainer);
    }

    getName(): string {
        if (this.battleSoul instanceof FieldedPlayerSoul) {
            return "your " + this.battleSoul.soul.name;
        }
        return "the opposing " + this.battleSoul.soul.name;
    }

    getHPString() {
        return "HP: " + this.displayHP + "/" + this.battleSoul.soul.stats[CONSTANTS.STATS.HP];
    }

    genInfoDiv() {
        const infoDiv = document.createElement("div");
        const nameText = document.createTextNode(this.battleSoul.soul.name);

        const hpText = document.createElement("small");
        hpText.classList.add("hp-text");
        hpText.append(
            document.createTextNode(this.getHPString())
        );

        infoDiv.append(
            nameText,
            document.createElement("br"),
            RenderSoul.getLevelText(this.battleSoul.soul),
            document.createElement("br"),
            hpText
        );

        return infoDiv;
    }

    modifiedStatInfo() {
        const statGroup = document.createElement("div");

        if (this.battleSoul.hasModifiers()) {
            const statModifiers = document.createElement("small");
            statModifiers.append(
                document.createElement("br"),
                document.createElement("br"),
                document.createTextNode("(After stat modifiers:)"),
                document.createElement("br")
            );

            statGroup.append(
                statModifiers,
                RenderSoul.genStatText(this.battleSoul.soul, this.battleSoul.modifiedStatDict())
            );
        }

        return statGroup;
    }

    genDetailedInfo() {
        const infoDiv = RenderSoul.genDetailedInfo(this.battleSoul.soul);
        infoDiv.classList.remove("bottomhalf-tip");
        infoDiv.classList.add("topHalf-tip");

        this.modifiedStatInfoBox = this.modifiedStatInfo();
        infoDiv.append(
            this.modifiedStatInfoBox
        );

        return infoDiv;
    }

    genInfoContainer() {
        const infoDiv = this.genInfoDiv();
        const detailedInfoDiv = this.genDetailedInfo();

        const infoContainer = document.createElement("div");
        infoContainer.append(
            infoDiv,
            detailedInfoDiv
        );

        infoDiv.onmouseover = function(){
            detailedInfoDiv.style.display = "block";
        }
        infoDiv.onmouseout = function(){
            detailedInfoDiv.style.display = "none";
        }

        this.detailedInfoDiv = detailedInfoDiv;

        return infoContainer;
    }

    updateHP() {
        (this.infoContainer.getElementsByClassName("hp-text")[0] as HTMLElement).innerText = this.getHPString();
        (this.detailedInfoDiv.getElementsByClassName("hp-text")[0] as HTMLElement).innerText = this.getHPString();
    }

    updateStats() {
        this.modifiedStatInfoBox.remove();
        this.modifiedStatInfoBox = this.modifiedStatInfo();
        this.detailedInfoDiv.append(this.modifiedStatInfoBox);
    }
}

export {
    RenderBattleSoul
};