import { CONSTANTS, StatDict } from "../data/constants";
import { IndividualSoul, PlayerSoul } from "./individualSoul";
import { capitalizeFirstLetter } from "../utility";

class RenderSoul {
    public static getNameText(individualSoul: IndividualSoul) {
        const nameText = document.createElement("h6");
        nameText.classList.add("big-text");
        nameText.innerText = individualSoul.name;
        if (individualSoul.name !== individualSoul.soul_species.name) {
            nameText.innerText += " (" + individualSoul.soul_species.name + ")";
        }
        return nameText;
    }

    public static getLevelText(individualSoul: IndividualSoul) {
        const levelText = document.createElement("small");
        levelText.innerText = "Lv " + individualSoul.level;
        return levelText;
    }

    public static getNameAndLevel(individualSoul: IndividualSoul) {
        const nameAndLevel = RenderSoul.getNameText(individualSoul);
        nameAndLevel.append(" ", RenderSoul.getLevelText(individualSoul));
        return nameAndLevel;
    }

    public static genTypeContainer(individualSoul: IndividualSoul) {
        const typeContainer = document.createElement("p");
        individualSoul.soul_species.types.forEach((type, i) => {
            typeContainer.innerText += type + "/";
        });
        return typeContainer;
    }

    public static getHPText(individualSoul: IndividualSoul) {
        return "HP: " + individualSoul.currentHP + "/" + individualSoul.stats[CONSTANTS.STATS.HP];
    }

    public static genStatText(individualSoul: IndividualSoul, dict: StatDict) {
        const statContainer = document.createElement("span");
        for (let key in individualSoul.stats) {
            if (key != "HP") {
                const keyType = key as unknown as CONSTANTS.STATS;
                const statName = capitalizeFirstLetter(CONSTANTS.STAT_ABBREVIATION[key]);

                const statSpan = document.createElement("span");
                if (dict[keyType] < individualSoul.stats[keyType]) {
                    statSpan.classList.add("red-text");
                }
                else if (dict[keyType] > individualSoul.stats[keyType]) {
                    statSpan.classList.add("green-text");
                }
                statSpan.classList.add("big-text");
                statSpan.innerText = "" + dict[keyType];

                const divider = document.createElement("span");
                divider.style.fontSize = "60%";
                divider.innerText = " / ";

                statContainer.append(
                    document.createTextNode(statName + " "),
                    statSpan,
                    divider
                );
            }
        }
        return statContainer;
    }

    public static genSkillInfo(individualSoul: IndividualSoul) {
        const skillDiv = document.createElement("div");
        skillDiv.classList.add("skillDiv");

        const skillList = document.createElement("ul");
        individualSoul.skills.forEach((skill) => {
            const item = document.createElement("li");
            item.innerText = skill.data.name;
            skillList.append(item);
        })

        skillDiv.append(
            document.createElement("hr"),
            skillList
        );

        return skillDiv;
    }

    public static genDetailedInfo(individualSoul: IndividualSoul) {
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("bottomhalf-tip", "outlineDiv", "hoverDiv");

        const hpText = document.createElement("p");
        hpText.classList.add("hp-text");
        hpText.innerText = RenderSoul.getHPText(individualSoul);

        infoDiv.append(
            RenderSoul.getNameAndLevel(individualSoul),
            RenderSoul.genTypeContainer(individualSoul),
            document.createElement("hr"),
            hpText,
            RenderSoul.genStatText(individualSoul, individualSoul.stats),
            RenderSoul.genSkillInfo(individualSoul)
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