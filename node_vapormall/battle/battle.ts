import {IndividualSoul} from "../individualSoul";
import {Skill} from "../skill";
import {StatChange} from "../data/skills";
import {CONSTANTS} from "../data/constants";

import {BattleSoul, PlayerSoul, EnemySoul} from "./battleSoul";
import { MessageRenderer } from "./renderer";
import { BattleCalculator } from "./battleCalculator";

class Battle {
    playerSouls: Array<PlayerSoul>;
    enemySouls: Array<EnemySoul>;
    souls: Array<PlayerSoul | EnemySoul>;
    battleOver: boolean;

    playerParty: Array<IndividualSoul>;
    enemyParty: Array<IndividualSoul>;

    messageRenderer: MessageRenderer;
    battleCalculator: BattleCalculator;

    constructor(playerSouls: Array<IndividualSoul>, enemySouls: Array<IndividualSoul>) {
        this.playerParty = playerSouls;
        this.enemyParty = enemySouls;

        this.playerSouls = [new PlayerSoul(this.playerParty[0])];
        this.enemySouls = [new EnemySoul(this.enemyParty[0])];

        this.souls = [...this.playerSouls, ...this.enemySouls];
        this.battleOver = false;

        this.battleCalculator = new BattleCalculator(this);
        this.messageRenderer = new MessageRenderer(this.createSkillClickHandler.bind(this), this.createSwitchClickHandler.bind(this));
        const playerSoul = this.playerSouls[0];
        this.messageRenderer.renderSkills(playerSoul);
        this.messageRenderer.renderSwitch(this.playerParty);
    }

    static getName(battleSoul: BattleSoul): string {
        if (battleSoul instanceof PlayerSoul) {
            return "your " + battleSoul.soul.name;
        }
        return "the opposing " + battleSoul.soul.name;
    }

    passTurn() {
       function compareSpeed(soulAbsA: BattleSoul, soulAbsB: BattleSoul)  {
            return soulAbsA.calculateStat(CONSTANTS.STATS.SPEED) -
                soulAbsB.calculateStat(CONSTANTS.STATS.SPEED);
       }
       const speed_order = this.souls.sort(compareSpeed);

       for (let i = 0; i < speed_order.length; i++) {
            this.useSkill(speed_order[i]);
       }
    }

    checkBattleOver() {
        if (this.playerSouls.length === 0 || this.enemySouls.length === 0) {
            this.messageRenderer.endMessageBlock();

            if (this.playerSouls.length === 0) {
                // TODO
            }

            this.messageRenderer.addMessage(
                () => {
                    this.messageRenderer.endBattle();
                }
            );
        }
    }

    selectEnemySkills() {
        for (const i of this.enemySouls) {
            i.chooseMove(this.souls, this.playerSouls, this.enemySouls);
        }
    }

    selectPlayerTarget(playerSoul: PlayerSoul) {
        if (playerSoul.selected_skill === null) {
            console.error("SELECTING TARGET FOR NULL PLAYER SKILL");
            return;
        }
        switch (playerSoul.selected_skill.data.target)  {
            case CONSTANTS.TARGETS.SELECTED:
            case CONSTANTS.TARGETS.OPPOSING:
                const j = 0;
                playerSoul.selected_target = [this.enemySouls[j]];
                break;
            case CONSTANTS.TARGETS.ALLIED:
                playerSoul.selected_target = this.playerSouls;
                break;
            case CONSTANTS.TARGETS.ALLY:
                break;
            case CONSTANTS.TARGETS.ALL:
                playerSoul.selected_target = this.souls;
                break;
            case CONSTANTS.TARGETS.SELF:
                playerSoul.selected_target = [playerSoul];
                break;
            case CONSTANTS.TARGETS.NONE:
                playerSoul.selected_target = [];
                break;
            }
    }

    useSkill(user: BattleSoul) {
        const skill = user.selected_skill;
        if (skill === null) {
            console.error("Using null skill!");
            return;
        }
        if (skill.pp <= 0) {
            console.error("Using skill with no pp!");
            return;
        }
        skill.pp--;

        switch (skill.data.target) {
            case CONSTANTS.TARGETS.SELECTED:
            case CONSTANTS.TARGETS.OPPOSING:
            case CONSTANTS.TARGETS.ALLIED:
            case CONSTANTS.TARGETS.ALLY:
            case CONSTANTS.TARGETS.ALL:
            case CONSTANTS.TARGETS.SELF:
                if (user.selected_target !== null) {
                    user.selected_target.forEach((target) => {
                        this.battleCalculator.applySkillEffects(user, skill, target);
                    });
                }
                else {
                    console.error("No target for move!");
                }
                break;
            case CONSTANTS.TARGETS.NONE:
                break;
        }
    }

    switchSoul(switchOut: number, switchIn: number): PlayerSoul {
        const leaving = this.playerSouls[switchOut];
        const entering = new PlayerSoul(this.playerParty[switchIn]);

        leaving.switchOut();
        this.playerSouls[switchOut] = entering;
        this.messageRenderer.addMessage("Switching out " + Battle.getName(leaving) + " for " + entering.soul.name);

        return entering;
    }

    createSkillClickHandler(playerSoul: PlayerSoul, whichSkill: number) {
        // from https://stackoverflow.com/questions/8941183/pass-multiple-arguments-along-with-an-event-object-to-an-event-handler
        return () => {
            // arrow function for `this` https://stackoverflow.com/a/73068955
            this.messageRenderer.hideActions();

            playerSoul.selected_skill = playerSoul.soul.skills[whichSkill];
            this.selectPlayerTarget(playerSoul);

            this.selectEnemySkills();
            this.passTurn();
            this.messageRenderer.queueShowActions(playerSoul, this.playerParty);
            this.messageRenderer.displayMessages();
        }
    }

    createSwitchClickHandler(switchOut: number, switchIn: number) {
        // from https://stackoverflow.com/questions/8941183/pass-multiple-arguments-along-with-an-event-object-to-an-event-handler
        return () => {
            // arrow function for `this` https://stackoverflow.com/a/73068955
            this.messageRenderer.hideActions();

            const switchInPlayerSoul = this.switchSoul(switchOut, switchIn);

            this.selectEnemySkills();
            this.passTurn();
            this.messageRenderer.queueShowActions(switchInPlayerSoul, this.playerParty);
            this.messageRenderer.displayMessages();
        }
    }
}

export {Battle};
