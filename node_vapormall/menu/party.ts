import { GameState } from "../gameState";
import { PlayerSoul } from "../individualSoul";
import { CONSTANTS } from "../data/constants";
import { Manager } from "../manager";

class Party {
    constructor() {
        this.fillPartyDiv();

        Manager.menuButton("partyButton", "party", "Party");
        const partyButton = document.getElementById("partyButton");
        partyButton?.addEventListener("click", () => {
            document.querySelectorAll(".detailedPartySoulDiv").forEach(div => {
                div.classList.add("hidden");
            });
        });
    }

    partySoulDiv(playerSoul: PlayerSoul) {
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("partySoulDiv");

        const levelText = playerSoul.getLevelText();
        levelText.style.marginLeft = "10px";

        infoDiv.append(
            playerSoul.getNameText(),
            levelText,
            document.createElement("br"),
            playerSoul.getHPText()
        );

        return infoDiv;
    }

    fillPartyDiv() {
        GameState.getPartySouls().forEach(playerSoul => {
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

    detailedPartySoulDiv(playerSoul: PlayerSoul) {
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("menuPanel", "hidden", "absoluteAlign", "detailedPartySoulDiv");

        const levelText = playerSoul.getLevelText();
        levelText.style.marginLeft = "10px";

        const typeContainer = playerSoul.genTypeContainer();
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
                statDiv.innerText = playerSoul.getHPText();
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
            playerSoul.getNameText(),
            levelText,
            typeContainer,
            divider,
            statContainer,
            skillContainer
        );

        return infoDiv;
    }
}

export {
    Party
};