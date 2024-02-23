import { CONSTANTS, StatDict } from "../data/constants";
import { IndividualSoul, PlayerSoul } from "./individualSoul";
import { capitalizeFirstLetter } from "../utility";

import { h } from "dom-chef";
import { Skill } from "./skill";

class RenderIndividualSoul {
    soul: IndividualSoul;

    constructor(soul: IndividualSoul) {
        this.soul = soul;
    }

    public NameText(): JSX.Element {
        return (
            <h6 className="big-text">
                {this.soul.name + " "}
                {this.soul.name !== this.soul.soul_species.name &&
                    "(" + this.soul.soul_species.name + ")"}
            </h6>
        );
    }

    public getLevelText(): JSX.Element {
        return <small>Lv {this.soul.level}</small>;
    }

    public getNameAndLevel(): JSX.Element {
        const element = this.NameText();
        element.append(document.createTextNode(" "), this.getLevelText());
        return element;
    }

    public genTypeContainer(): JSX.Element {
        return (
            <p>
                {this.soul.soul_species.types.map((type: CONSTANTS.TYPES) => {
                    return type + "/";
                })}
            </p>
        );
    }

    public getHPText(): string {
        return (
            "HP: " +
            this.soul.currentHP +
            "/" +
            this.soul.stats[CONSTANTS.STATS.HP]
        );
    }

    public genStatText(dict: StatDict): JSX.Element {
        return (
            <span>
                {Object.keys(this.soul.stats)
                    .filter((i) => i !== "HP")
                    .map((key) => {
                        const keyType = key as unknown as CONSTANTS.STATS;
                        const statName = capitalizeFirstLetter(
                            CONSTANTS.STAT_ABBREVIATION[key]
                        );

                        const statSpan = (
                            <span className="big-text">{dict[keyType]}</span>
                        );
                        if (dict[keyType] < this.soul.stats[keyType]) {
                            statSpan.classList.add("red-text");
                        } else if (dict[keyType] > this.soul.stats[keyType]) {
                            statSpan.classList.add("green-text");
                        }

                        return (
                            <span>
                                {document.createTextNode(statName + " ")}
                                {statSpan}
                                <span style={{ fontSize: "60%" }}> / </span>
                            </span>
                        );
                    })}
            </span>
        );
    }

    public genSkillInfo(): JSX.Element {
        return (
            <div className="skillDiv">
                <hr />
                <ul>
                    {this.soul.skills.map((skill: Skill) => (
                        <li>{skill.data.name}</li>
                    ))}
                </ul>
            </div>
        );
    }

    public DetailedInfo(): JSX.Element {
        return (
            <div className="bottomhalf-tip outlineDiv hoverDiv">
                {this.getNameAndLevel()}
                {this.genTypeContainer()}
                <hr />
                <p className="hp-text">{this.getHPText()}</p>
                {this.genStatText(this.soul.stats)}
                {this.genSkillInfo()}
            </div>
        );
    }
}

class RenderPlayerSoul extends RenderIndividualSoul {
    soul: PlayerSoul;

    constructor(soul: PlayerSoul) {
        super(soul);
    }

    public getSwitchContainer(): JSX.Element {
        const switchButton = this.getSwitchButton();
        const detailedInfoDiv = this.DetailedInfo();

        const switchContainer = (
            <div className="choice-wrapper">
                {switchButton}
                {detailedInfoDiv}
            </div>
        );

        switchButton.onmouseover = function () {
            detailedInfoDiv.style.display = "block";
        };
        switchButton.onmouseout = function () {
            detailedInfoDiv.style.display = "none";
        };

        return switchContainer;
    }

    public getSwitchButton(): JSX.Element {
        return (
            <button type="button" className="outlineDiv">
                {this.soul.name}
            </button>
        );
    }
}

export { RenderIndividualSoul, RenderPlayerSoul };
