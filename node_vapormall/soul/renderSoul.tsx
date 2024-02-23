import { CONSTANTS, StatDict } from "../data/constants";
import { IndividualSoul, PlayerSoul } from "./individualSoul";
import { capitalizeFirstLetter } from "../utility";

import {h} from "dom-chef";
import { Skill } from "./skill";
import { ReactNode } from "react";

class RenderSoul {
    public static NameText(props: {soul: IndividualSoul, children: ReactNode}): JSX.Element {
        return (
        <h6 className="big-text">{props.soul.name}
            {
            props.soul.name !== props.soul.soul_species.name &&
                "(" + props.soul.soul_species.name + ")"
            }
        </h6>
        );
    }

    public static getLevelText(props: {soul: IndividualSoul}): JSX.Element {
        return <small>Lv {props.soul.level}</small>;
    }

    public static getNameAndLevel(props: {soul: IndividualSoul}): JSX.Element {
        return <RenderSoul.NameText soul={props.soul}>
            <RenderSoul.getLevelText soul={props.soul}/>
        </RenderSoul.NameText>;
    }

    public static genTypeContainer(props: {soul: IndividualSoul}): JSX.Element {
        return <p>
            {props.soul.soul_species.types.map((type: CONSTANTS.TYPES) => {
                return type + "/";
            })}
        </p>;
    }

    public static getHPText(soul: IndividualSoul): string {
        return "HP: " + soul.currentHP + "/" + soul.stats[CONSTANTS.STATS.HP];
    }

    public static genStatText(props: {soul: IndividualSoul, dict: StatDict}): JSX.Element {
        return <span>
            {Object.keys(props.soul.stats).map((key) => {
                const keyType = key as unknown as CONSTANTS.STATS;
                const statName = capitalizeFirstLetter(CONSTANTS.STAT_ABBREVIATION[key]);

                const statSpan = <span className="big-text">{props.dict[keyType]}</span>;

                if (props.dict[keyType] < props.soul.stats[keyType]) {
                    statSpan.classList.add("red-text");
                }
                else if (props.dict[keyType] > props.soul.stats[keyType]) {
                    statSpan.classList.add("green-text");
                }

                const divider = <span style={{fontSize: "60%"}}> / </span>;

                return (
                    document.createTextNode(statName + " "),
                    statSpan,
                    divider
                );
            })}
        </span>;
    }

    public static genSkillInfo(props: {soul: IndividualSoul}): JSX.Element {
        return (
            <div className="skillDiv">
                <hr/>
                <ul>
                    {props.soul.skills.map((skill: Skill) => {
                        return <li>{skill.data.name}</li>
                    })}
                </ul>
            </div>
        );
    }

    public static DetailedInfo(props: {soul: IndividualSoul}): JSX.Element {
        return (
            <div className="bottomhalf-tip outlineDiv hoverDiv">
                <RenderSoul.getNameAndLevel soul={props.soul}/>
                <RenderSoul.genTypeContainer soul={props.soul}/>
                <hr/>
                <p className="hp-text">{RenderSoul.getHPText(props.soul)}</p>
                <RenderSoul.genStatText soul={props.soul} dict={props.soul.stats}/>
                <RenderSoul.genSkillInfo soul={props.soul}/>
            </div>
        );
    }

    public static getSwitchContainer(props: {playerSoul: PlayerSoul}): JSX.Element {
        const switchButton = <RenderSoul.getSwitchButton playerSoul={props.playerSoul}/>;
        const detailedInfoDiv = <RenderSoul.DetailedInfo soul={props.playerSoul}/>;

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

    public static getSwitchButton(props: {playerSoul: PlayerSoul}): JSX.Element {
        return <button type="button" className="outlineDiv">
            {props.playerSoul.name}
        </button>
    }
}

export {
    RenderSoul
}