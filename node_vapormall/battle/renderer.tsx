import { FieldedPlayerSoul } from "./battleSoul";
import { FaintData } from "./battle";

import { PlayerSoul } from "../soul/individualSoul";
import { Skill } from "../soul/skill";
import { RenderSoul } from "../soul/renderSoul";

import { SwitchOut, UseSkill } from "./action";
import { BattleItemMenu } from "./battleItemMenu";

import {h} from "dom-chef";

class Renderer { 

    createActionHandler: Function;
    createSwitchFaintHandler: Function;

    constructor(
        actionHanderCreator: Function,
        createSwitchFaintHandler: Function,
    ) {
        this.createActionHandler = actionHanderCreator;
        this.createSwitchFaintHandler = createSwitchFaintHandler;
    }

    private SkillWrapper(
        props: {
            playerSoul: FieldedPlayerSoul,
            skill: Skill
        }
    ): JSX.Element {
        const skillWrapper = props.skill.SkillContainer();
        const skillButton = skillWrapper.getElementsByTagName("button")[0];

        if (props.skill.pp > 0) {
            const useSkill = new UseSkill(props.playerSoul.index, props.skill);
            skillButton.addEventListener("click",
                this.createActionHandler(useSkill),
                false);
        }
        else {
            skillButton.classList.add("noClick");
        }
        return skillWrapper;
    }

    private SkillMenu(props: {playerSoul: FieldedPlayerSoul}): JSX.Element {
        return (
            <div id="skillContainer">

                <p>AGGRESSION PROTOCOL INITIATED.</p>

                {props.playerSoul.soul.skills.map((skill) => {
                    <this.SkillWrapper playerSoul={props.playerSoul} skill={skill}/>
                })}
            </div>
        );
    }

    private SwitchWrapper(
        props: {
            switchOutFainted: boolean,
            action: SwitchOut,
            playerSouls: Array<FieldedPlayerSoul | null>,
        }
    ): JSX.Element {
        const battleSoul = props.playerSouls[props.action.soulPartyIndex];
        if (battleSoul === null) {
            console.error("battleSoul is null ???");
            return <div></div>;
        }

        const switchContainer = <RenderSoul.getSwitchContainer playerSoul={battleSoul.soul}/>;
        const switchButton = switchContainer.getElementsByTagName("button")[0];

        let offField = true;
        props.playerSouls.forEach((s) => {
            if (s !== null && s.soul === battleSoul.soul) {
                offField = false;
            }
        })

        if (battleSoul.soul.currentHP > 0 && offField) {
            if (!props.switchOutFainted) {
                switchButton.addEventListener("click",
                    this.createActionHandler(props.action),
                    false);
            }
            else {
                switchButton.addEventListener("click",
                    this.createSwitchFaintHandler(props.action.soulPartyIndex, props.action.switchInIndex),
                    false);
            }
        }
        else {
            switchButton.classList.add("noClick");
        }

        return switchContainer;
    }

    private SwitchMenu(
        props: {
            playerParty: Array<PlayerSoul>,
            playerSouls: Array<FieldedPlayerSoul | null>
        }
    ): JSX.Element {
        return <div id="switchContainer">
            <p>SWITCH ACTIVE PROCESS?</p>

            {props.playerParty.map((playerSoul, i) => {
                <this.SwitchWrapper
                    switchOutFainted = {false}
                    action = {new SwitchOut(0, i)}
                    playerSouls = {props.playerSouls}
                />
            })}
        </div>;
    }

    FaintSwitchMenu(
        props: {
            faintInfo: FaintData,
            playerParty: Array<PlayerSoul>,
            playerSouls: Array<FieldedPlayerSoul | null>
        }
    ): JSX.Element {
        return <div id="switchContainer">
            <p>PROCESS DESTROYED. MUST DEPLOY NEW PROCESS.</p>

            {props.playerParty.map((playerSoul, i) => {
                <this.SwitchWrapper
                    switchOutFainted = {true}
                    action = {new SwitchOut(props.faintInfo.playerSoulsIndex, i)}
                    playerSouls = {props.playerSouls}
                />
            })}
        </div>
    }

    showActions(
        playerSoul: FieldedPlayerSoul,
        playerParty: Array<PlayerSoul>,
        playerSouls: Array<FieldedPlayerSoul | null>
    ) {
        document.getElementById("bottomContent")?.append(
            <this.SkillMenu
                playerSoul={playerSoul}/>,

            <this.SwitchMenu
                playerParty={playerParty}
                playerSouls={playerSouls}/>
        );

        const battleItemMenu = new BattleItemMenu(
            playerSoul,
            this.createActionHandler,
        );
    }

    hideActions() {
        const bottomContent = document.getElementById("bottomContent");
        bottomContent!.innerHTML = "";
    }

    showEndScreen() {
        document.getElementById("endScreen")!.classList.remove("hidden");
    }
}

export {
    Renderer
};