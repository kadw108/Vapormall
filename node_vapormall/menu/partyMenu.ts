import { GameState } from "../gameState";
import { PlayerSoul } from "../soul/individualSoul";
import { CONSTANTS } from "../data/constants";
import { Manager } from "../manager";
import { RenderSoul } from "../soul/renderSoul";

class PartyMenu {
    constructor() {
        this.refresh();

        Manager.menuButton("partyButton", "party", "Party");
        const partyButton = document.getElementById("partyButton");
        partyButton?.addEventListener("click", () => {
            document.querySelectorAll(".detailedPartySoulDiv").forEach(div => {
                div.classList.add("hidden");
            });
        });
    }

    refresh() {
        const partyDiv = document.getElementById("party");
        if (partyDiv === null) {
            console.error("Party div is null!");
            return;
        }
        partyDiv.innerHTML = "";
        this.fillPartyDiv();
    }

    partySoulDiv(playerSoul: PlayerSoul) {
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("partySoulDiv");

        const levelText = RenderSoul.getLevelText(playerSoul);
        levelText.style.marginLeft = "10px";

        infoDiv.append(
            RenderSoul.getNameText(playerSoul),
            levelText,
            document.createElement("br"),
            RenderSoul.getHPText(playerSoul)
        );

        return infoDiv;
    }

    detailedPartySoulDiv(playerSoul: PlayerSoul) {
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("menuPanel", "hidden", "absoluteAlign", "detailedPartySoulDiv");

        const levelText = RenderSoul.getLevelText(playerSoul);
        levelText.style.marginLeft = "10px";

        const typeContainer = RenderSoul.genTypeContainer(playerSoul);
        typeContainer.style.marginLeft = "10px";

        const divider = document.createElement("hr");
        divider.style.color = "#4ad";
        divider.style.margin = "5px 0 10px 0";

        const statContainer = document.createElement("div");
        statContainer.classList.add("partyStatContainer", "partyContainer");
        for (let key in playerSoul.stats) {
            const keyType = key as unknown as CONSTANTS.STATS;
            const statDiv = document.createElement("div");

            if (key != "HP") {
                statDiv.innerText = key + " " + playerSoul.stats[keyType];
            }
            else {
                statDiv.innerText = RenderSoul.getHPText(playerSoul);
            }

            statContainer.append(statDiv);
        }

        const skillContainer = document.createElement("div");
        skillContainer.classList.add("partySkillContainer", "partyContainer");
        playerSoul.skills.forEach((skill, i) => {
            const skillWrapper = skill.getSkillContainer();
            skillContainer.append(skillWrapper);
        });

        infoDiv.append(
            RenderSoul.getNameText(playerSoul),
            levelText,
            typeContainer,
            divider,
            statContainer,
            skillContainer
        );

        return infoDiv;
    }

    fillPartyDiv() {
        GameState.partySouls.forEach(playerSoul => {
            const infoDiv = this.partySoulDiv(playerSoul);
            const partyDiv = document.getElementById("party");
            partyDiv?.append(infoDiv);

            const detailedInfoDiv = this.detailedPartySoulDiv(playerSoul);
            const topHalf = document.getElementById("topHalf");
            topHalf?.append(detailedInfoDiv);

            infoDiv.addEventListener("click", () => {
                if (detailedInfoDiv.classList.contains("hidden")) {
                    document.querySelectorAll(".detailedPartySoulDiv").forEach(div => {
                        div.classList.add("hidden");
                    })
                    detailedInfoDiv.classList.remove("hidden");
                }
                else {
                    detailedInfoDiv.classList.add("hidden");
                }
            });
        });
    }
}

export {
    PartyMenu
};