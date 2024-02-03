import { CONSTANTS, StatDict } from "../data/constants";
import { IndividualSoul, PlayerSoul } from "./individualSoul";

class RenderSoul {
    public static getNameText(individualSoul: IndividualSoul) {
        const nameText = document.createElement("span");
        nameText.innerText = individualSoul.name;
        if (individualSoul.name !== individualSoul.soul_species.name) {
            nameText.innerText += " (" + individualSoul.soul_species.name + ")";
        }
        return nameText;
    }

    public static genTypeContainer(individualSoul: IndividualSoul) {
        const typeContainer = document.createElement("small");
        individualSoul.soul_species.types.forEach((type, i) => {
            typeContainer.innerText += type + "/";
        });
        return typeContainer;
    }

    public static getLevelText(individualSoul: IndividualSoul) {
        const levelText = document.createElement("small");
        levelText.innerText = "Lv " + individualSoul.level;
        return levelText;
    }

    public static getHPText(individualSoul: IndividualSoul) {
        return "HP: " + individualSoul.currentHP + "/" + individualSoul.stats[CONSTANTS.STATS.HP];
    }

    public static genStatText(individualSoul: IndividualSoul, dict: StatDict) {
        const statContainer = document.createElement("small");
        for (let key in individualSoul.stats) {
            if (key != "HP") {
                const keyType = key as unknown as CONSTANTS.STATS;

                const statSpan = document.createElement("span");
                if (dict[keyType] < individualSoul.stats[keyType]) {
                    statSpan.classList.add("red-text");
                }
                else if (dict[keyType] > individualSoul.stats[keyType]) {
                    statSpan.classList.add("green-text");
                }
                statSpan.innerText = "" + dict[keyType];

                statContainer.append(
                    document.createTextNode(key + " "),
                    statSpan,
                    document.createTextNode(" / ")
                );
            }
        }
        return statContainer;
    }

    public static genDetailedInfo(individualSoul: IndividualSoul) {
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("bottomhalf-tip", "outlineDiv", "hoverDiv");

        const hpText = document.createElement("small");
        hpText.classList.add("hp-text");
        hpText.innerText = RenderSoul.getHPText(individualSoul);

        infoDiv.append(
            RenderSoul.getNameText(individualSoul),
            document.createElement("br"),
            RenderSoul.genTypeContainer(individualSoul),
            document.createElement("hr"),
            hpText,
            document.createElement("br"),
            RenderSoul.genStatText(individualSoul, individualSoul.stats)
        );

        return infoDiv;
    }

    public static getSwitchContainer(playerSoul: PlayerSoul) {
        const switchButton = RenderSoul.getSwitchButton(playerSoul);
        const detailedInfoDiv = RenderSoul.genDetailedInfo(playerSoul);

        const switchContainer = document.createElement("div");
        switchContainer.classList.add("choice-wrapper");
        switchContainer.append(
            switchButton,
            detailedInfoDiv
        );

        switchButton.onmouseover = function(){
            detailedInfoDiv.style.display = "block";
        }
        switchButton.onmouseout = function(){
            detailedInfoDiv.style.display = "none";
        }

        return switchContainer;
    }

    public static getSwitchButton(playerSoul: PlayerSoul) {
        const switchButton = document.createElement("button");
        switchButton.classList.add("outlineDiv");

        const nameText = document.createTextNode(playerSoul.name);
        switchButton.append(
            nameText,
            document.createElement("br")
        );

        return switchButton;
    }
}

export {
    RenderSoul
}