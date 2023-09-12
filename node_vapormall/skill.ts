import {CONSTANTS, StatDict} from "./data/constants";
import {SkillData, SKILL_LIST} from "./data/skills";

class Skill{
    data: SkillData;
    pp: number;

    constructor(skill_data: SkillData) {
        this.data = skill_data;
        this.pp = skill_data.max_pp;
    }

    getSkillButton(): HTMLButtonElement {
        const skillButton = document.createElement("button");
        skillButton.classList.add("skill-button", "skill-div");

        const style_class = "skill-" + this.data.type;
        skillButton.classList.add(style_class);

        const nameText = document.createTextNode(this.data.name);
        skillButton.append(nameText);
        skillButton.append(document.createElement("br"));

        const typeText = document.createElement("small");
        typeText.append(
            document.createTextNode(this.data.type + " ")
        );
        skillButton.append(typeText);

        const ppText = document.createElement("small");
        ppText.append(
            document.createTextNode(this.pp + "/" + this.data.max_pp)
        );
        skillButton.append(ppText);

        return skillButton;
    }

    getSkillTip(): HTMLDivElement {
        const skillTip = document.createElement("div");
        skillTip.classList.add("skill-tip", "skill-div", "hoverDiv");

        const nameText = document.createTextNode(this.data.name);
        skillTip.append(nameText);
        skillTip.append(document.createElement("br"));

        const typeText = document.createElement("small");
        typeText.append(
            document.createTextNode(this.data.type + " ")
        );
        skillTip.append(typeText);

        const categoryText = document.createElement("small");
        categoryText.append(
            document.createTextNode(this.data.meta.category + " ")
        );
        skillTip.append(categoryText);

        skillTip.append(
            document.createElement("hr")
        );

        if (this.data.power !== null) {
            const powerText = document.createElement("small");
            powerText.append(
                document.createTextNode("Power: " + this.data.power)
            );
            skillTip.append(powerText);

            skillTip.append(
                document.createElement("hr")
            )
        }

        const description = document.createElement("small");
        description.append(
            document.createTextNode(this.data.description)
        );
        skillTip.append(description);

        return skillTip;
    }
}

export {
    Skill
};