import { CONSTANTS } from "../data/constants";
import { BattleSoul, FieldedPlayerSoul } from "./battleSoul";

import {h} from "dom-chef";

class RenderBattleSoul {

    battleSoul: BattleSoul;
    displayHP: number;

    infoContainer: HTMLElement;
    detailedInfoDiv: HTMLElement;
    ModifiedStatInfoBox: HTMLElement;

    constructor(battleSoul: BattleSoul) {
        this.battleSoul = battleSoul;

        this.displayHP = this.battleSoul.soul.currentHP;

        this.infoContainer = this.InfoContainer();
        document.getElementById("topHalf")?.append(this.infoContainer);
    }

    getName(): string {
        if (this.battleSoul instanceof FieldedPlayerSoul) {
            return "your " + this.battleSoul.soul.name;
        }
        return "the opposing " + this.battleSoul.soul.name;
    }

    getHPString(): string {
        return "HP: " + this.displayHP + "/" + this.battleSoul.soul.stats[CONSTANTS.STATS.HP];
    }

    InfoDiv(): JSX.Element {
        return <div>
            {this.battleSoul.soul.name}
            <br/>
            {this.battleSoul.soul.renderer.getLevelText()}
            <br/>
            <small className="hp-text">{this.getHPString()}</small>
        </div>;
    }

    ModifiedStatInfo(): JSX.Element {
        return <div>
            {this.battleSoul.hasModifiers() &&
            <small>
                <br/><br/>(After stat modifiers:)<br/>
            </small>}

            {this.battleSoul.soul.renderer.genStatText(
                this.battleSoul.modifiedStatDict()
            )}
        </div>;
    }

    DetailedInfo(): JSX.Element {
        const infoDiv = this.battleSoul.soul.renderer.DetailedInfo();
        infoDiv.classList.remove("bottomhalf-tip");
        infoDiv.classList.add("topHalf-tip");

        const skillDiv = infoDiv.querySelector(".skillDiv");
        skillDiv?.insertAdjacentElement(
            "beforebegin",
            this.ModifiedStatInfo()
        );

        return infoDiv;
    }

    InfoContainer(): JSX.Element {
        const infoDiv = this.InfoDiv();
        const detailedInfoDiv = this.DetailedInfo();

        infoDiv.onmouseover = function(){
            detailedInfoDiv.style.display = "block";
        }
        infoDiv.onmouseout = function(){
            detailedInfoDiv.style.display = "none";
        }

        this.detailedInfoDiv = detailedInfoDiv;

        return <div>
            {infoDiv}{detailedInfoDiv}
        </div>;
    }

    updateHP() {
        (this.infoContainer.getElementsByClassName("hp-text")[0] as HTMLElement).innerText = this.getHPString();
        (this.detailedInfoDiv.getElementsByClassName("hp-text")[0] as HTMLElement).innerText = this.getHPString();
    }

    updateStats() {
        this.ModifiedStatInfoBox.remove();
        this.ModifiedStatInfoBox = this.ModifiedStatInfo();
        this.detailedInfoDiv.append(this.ModifiedStatInfoBox);
    }
}

export {
    RenderBattleSoul
};