import { GameState } from "../gameState";
import {PlayerSoul} from "../individualSoul";

class Party {

    constructor() {
        this.fillPartyDiv();
    }

    partySoulDiv(playerSoul: PlayerSoul) {
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("partySoulDiv");

        const nameText = document.createElement("span");
        nameText.innerText = playerSoul.name;
        if (playerSoul.name !== playerSoul.soul_species.name) {
            nameText.innerText += " (" + playerSoul.soul_species.name + ")";
        }
        infoDiv.append(nameText);

        const levelText = document.createElement("small");
        levelText.innerText = "Lv " + playerSoul.level;
        levelText.style.marginLeft = "10px";
        infoDiv.append(levelText);
        infoDiv.append(document.createElement("br"));

        infoDiv.append(playerSoul.getHPText());

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

            infoDiv.onmouseover = function(){
                detailedInfoDiv.style.display = "block";
            }
            infoDiv.onmouseout = function(){
                detailedInfoDiv.style.display = "none";
            }

        });
    }

    detailedPartySoulDiv(playerSoul: PlayerSoul) {
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("menuPanel", "hidden", "absoluteAlign");

        const nameText = document.createElement("span");
        nameText.innerText = playerSoul.name;
        if (playerSoul.name !== playerSoul.soul_species.name) {
            nameText.innerText += " (" + playerSoul.soul_species.name + ")";
        }
        infoDiv.append(nameText);

        const levelText = document.createElement("small");
        levelText.innerText = "Lv " + playerSoul.level;
        levelText.style.marginLeft = "10px";
        infoDiv.append(levelText);
        infoDiv.append(document.createElement("br"));

        infoDiv.append(playerSoul.getHPText());

        return infoDiv;
    }
}

export {
    Party
};