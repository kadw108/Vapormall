import { GameState } from "../gameState";
import { PlayerSoul } from "../soul/individualSoul";
import { CONSTANTS } from "../data/constants";
import { Manager } from "../manager";

import {h} from "dom-chef";

class PartyMenu {
    constructor() {
        this.refresh();

        Manager.menuButton("partyButton", "party", "Party");
        const partyButton = document.getElementById("partyButton");
        partyButton?.addEventListener("click", () => {
            document.querySelectorAll(".detailedPartySoulDiv").forEach(div => {
                div.classList.add("hidden");
            });
            document.querySelectorAll(".selected").forEach((element) => {
                element.classList.remove("selected");
            })
        });
    }

    private PartySoulDiv(soul: PlayerSoul) {
        return <div className="partySoulDiv">
            {soul.renderer.getNameAndLevel()}
            {soul.renderer.getHPText()}
        </div>
    }

    private DetailedPartySoulDiv(soul: PlayerSoul) {
        const typeContainer = soul.renderer.genTypeContainer();
        typeContainer.style.marginLeft = "10px";

        return (
            <div className = "menuPanel hidden absoluteAlign detailedPartySoulDiv">
                {soul.renderer.getNameAndLevel()}
                {typeContainer}

                <hr style={{color: "#4ad", margin: "5px 0 10px 0"}}/>

                <div className="partyStatContainer partyContainer">
                    {Object.keys(soul.stats).map((key) => {
                        const keyType = key as unknown as CONSTANTS.STATS;
                        if (key != "HP") {
                            return <div>{key} {soul.stats[keyType]}</div>;
                        }
                        else {
                            return <div>{soul.renderer.getHPText()}</div>;
                        }
                    })}
                </div>

                <div className="partySkillContainer partyContainer">
                    {soul.skills.map((skill) => skill.SkillContainer())}
                </div>
            </div>
        );
    }

    private refresh() {
        const partyDiv = document.getElementById("party");
        if (partyDiv === null) {
            console.error("Party div is null!");
            return;
        }
        partyDiv.innerHTML = "";
        this.fillPartyDiv();
    }

    private fillPartyDiv() {
        GameState.partySouls.forEach(playerSoul => {
            const infoDiv = this.PartySoulDiv(playerSoul);
            document.getElementById("party")?.append(infoDiv);

            const detailedInfoDiv = this.DetailedPartySoulDiv(playerSoul);
            document.getElementById("topHalf")?.append(detailedInfoDiv);

            infoDiv.addEventListener("click", () => {
                if (detailedInfoDiv.classList.contains("hidden")) {
                    document.querySelectorAll(".detailedPartySoulDiv").forEach(div => {
                        div.classList.add("hidden");
                    });
                    document.querySelector(".selected")?.classList.remove("selected");

                    detailedInfoDiv.classList.remove("hidden");
                    infoDiv.classList.add("selected");
                }
                else {
                    detailedInfoDiv.classList.add("hidden");
                    infoDiv.classList.remove("selected");
                }
            });
        });
    }
}

export {
    PartyMenu
};