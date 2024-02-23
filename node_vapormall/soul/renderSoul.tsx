import { CONSTANTS, StatDict } from "../data/constants";
import { IndividualSoul, PlayerSoul } from "./individualSoul";
import { capitalizeFirstLetter } from "../utility";

import {h} from "dom-chef";
import { Skill } from "./skill";

class RenderSoul {
    public static NameText(soul: IndividualSoul): JSX.Element {
        return (
        <h6 className="big-text">{soul.name + " "}
            {
            soul.name !== soul.soul_species.name &&
                "(" + soul.soul_species.name + ")"
            }
        </h6>
        );
    }

    public static getLevelText(soul: IndividualSoul): JSX.Element {
        return <small>Lv {soul.level}</small>;
    }

    public static getNameAndLevel(soul: IndividualSoul): JSX.Element {
        const element = RenderSoul.NameText(soul);
        element.append(document.createTextNode(" "), RenderSoul.getLevelText(soul));
        return element;
    }

    public static genTypeContainer(soul: IndividualSoul): JSX.Element {
        return <p>
            {soul.soul_species.types.map((type: CONSTANTS.TYPES) => {
                return type + "/";
            })}
        </p>;
    }

    public static getHPText(soul: IndividualSoul): string {
        return "HP: " + soul.currentHP + "/" + soul.stats[CONSTANTS.STATS.HP];
    }

    public static genStatText(soul: IndividualSoul, dict: StatDict): JSX.Element {
        return <span>
            {Object.keys(soul.stats).filter((i) => i !== "HP").map((key) => {
                const keyType = key as unknown as CONSTANTS.STATS;
                const statName = capitalizeFirstLetter(CONSTANTS.STAT_ABBREVIATION[key]);

                const statSpan = <span className="big-text">{dict[keyType]}</span>;
                if (dict[keyType] < soul.stats[keyType]) {
                    statSpan.classList.add("red-text");
                }
                else if (dict[keyType] > soul.stats[keyType]) {
                    statSpan.classList.add("green-text");
                }

                return <span>
                    {document.createTextNode(statName + " ")}
                    {statSpan}
                    <span style={{fontSize: "60%"}}> / </span>
                </span>;
            })}
        </span>;
    }

    public static genSkillInfo(soul: IndividualSoul): JSX.Element {
        return (
            <div className="skillDiv">
                <hr/>
                <ul>
                    {soul.skills.map((skill: Skill) => <li>{skill.data.name}</li>)}
                </ul>
            </div>
        );
    }

    public static DetailedInfo(soul: IndividualSoul): JSX.Element {
        return (
            <div className="bottomhalf-tip outlineDiv hoverDiv">
                {RenderSoul.getNameAndLevel(soul)}
                {RenderSoul.genTypeContainer(soul)}
                <hr/>
                <p className="hp-text">{RenderSoul.getHPText(soul)}</p>
                {RenderSoul.genStatText(soul, soul.stats)}
                {RenderSoul.genSkillInfo(soul)}
            </div>
        );
    }

    public static getSwitchContainer(playerSoul: PlayerSoul): JSX.Element {
        const switchButton = RenderSoul.getSwitchButton(playerSoul);
        const detailedInfoDiv = RenderSoul.DetailedInfo(playerSoul);

        const switchContainer = <div className="choice-wrapper">
            {switchButton}
            {detailedInfoDiv}
        </div>;

        switchButton.onmouseover = function(){
            detailedInfoDiv.style.display = "block";
        }
        switchButton.onmouseout = function(){
            detailedInfoDiv.style.display = "none";
        }

        return switchContainer;
    }

    public static getSwitchButton(playerSoul: PlayerSoul): JSX.Element {
        return <button type="button" className="outlineDiv">
            {playerSoul.name}
        </button>
    }
}

export {
    RenderSoul
}