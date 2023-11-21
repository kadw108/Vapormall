import {IndividualSoul, PlayerSoul} from "../soul/individualSoul";
import {CONSTANTS} from "../data/constants";

import {BattleSoul, FieldedPlayerSoul, EnemySoul} from "./battleSoul";
import { Renderer } from "./renderer";
import { MessageTimer } from "./messageTimer";
import { Calculator } from "./calculator";
import { GameState } from "../gameState";

class Battle {
    playerParty: Array<PlayerSoul>;
    enemyParty: Array<IndividualSoul>;

    playerSouls: Array<FieldedPlayerSoul>;
    enemySouls: Array<EnemySoul>;
    battleOver: boolean;

    renderer: Renderer;
    calculator: Calculator;
    messageTimer: MessageTimer;

    turns: number;

    constructor(playerSouls: Array<PlayerSoul>, enemySouls: Array<IndividualSoul>) {
        this.playerParty = playerSouls;
        this.enemyParty = enemySouls;

        this.playerSouls = [new FieldedPlayerSoul(this.playerParty[0])];
        this.enemySouls = [new EnemySoul(this.enemyParty[0])];

        this.battleOver = false;

        this.renderer = new Renderer(this.createSkillClickHandler.bind(this), this.createSwitchClickHandler.bind(this));
        const playerSoul = this.playerSouls[0];
        this.renderer.renderSkills(playerSoul);
        this.renderer.renderSwitch(this.playerParty, this.playerSouls);
        this.calculator = new Calculator(this);
        this.messageTimer = new MessageTimer();

        this.turns = 0;
    }

    static getName(battleSoul: BattleSoul): string {
        if (battleSoul instanceof FieldedPlayerSoul) {
            return "your " + battleSoul.soul.name;
        }
        return "the opposing " + battleSoul.soul.name;
    }

    allSouls() {
        return [...this.playerSouls, ...this.enemySouls];
    }

    passTurn() {
       function compareSpeed(soulAbsA: BattleSoul, soulAbsB: BattleSoul)  {
            return soulAbsA.calculateStat(CONSTANTS.STATS.SPEED) -
                soulAbsB.calculateStat(CONSTANTS.STATS.SPEED);
       }
       const speed_order = this.allSouls().sort(compareSpeed);

       for (let i = 0; i < speed_order.length; i++) {
            this.useSkill(speed_order[i]);
       }

       this.turns++;
    }

    checkBattleOver() {
        if (this.playerSouls.length === 0 || this.enemySouls.length === 0) {

            if (this.playerSouls.length === 0) {
                // TODO
            }
            else {
               const nextButton = document.getElementById("next");
               if (nextButton === null) {
                    console.error("next button not available!");
               }
               else {
                nextButton.addEventListener("click",
                        () => {
                            this.victory()
                        },
                        false);
               }
            }

            this.messageTimer.addMessage(
                () => {
                    this.messageTimer.endBattle();
                }
            );
        }
    }

    victory() {
        // clear encounter
        GameState.currentFloor.currentRoom().info.encounter = [];
        GameState.currentEnemy = null;
        const result = story.showSnippet("Room", false);
    }

    selectEnemySkills() {
        for (const i of this.enemySouls) {
            i.chooseMove(this.allSouls(), this.playerSouls, this.enemySouls);
        }
    }

    selectPlayerTarget(playerSoul: FieldedPlayerSoul) {
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
            case CONSTANTS.TARGETS.ALL:
                playerSoul.selected_target = this.allSouls();
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
            console.log("Using null skill!");
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
                        this.calculator.applySkillEffects(user, skill, target);
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

    switchSoul(switchOut: number, switchIn: number): FieldedPlayerSoul {
        const leaving = this.playerSouls[switchOut];
        const entering = new FieldedPlayerSoul(this.playerParty[switchIn]);

        leaving.switchOut();
        this.playerSouls[switchOut] = entering;
        this.messageTimer.addMessage("Switching out " + Battle.getName(leaving) + " for " + entering.soul.name + ".");
        this.messageTimer.endMessageBlock();

        return entering;
    }

    createSkillClickHandler(playerSoul: FieldedPlayerSoul, whichSkill: number) {
        // from https://stackoverflow.com/questions/8941183/pass-multiple-arguments-along-with-an-event-object-to-an-event-handler
        return () => {
            // arrow function for `this` https://stackoverflow.com/a/73068955
            this.renderer.hideActions();

            playerSoul.selected_skill = playerSoul.soul.skills[whichSkill];
            this.selectPlayerTarget(playerSoul);

            this.selectEnemySkills();
            this.passTurn();
            this.messageTimer.addMessage(
                () => {
                    this.renderer.showActions(playerSoul, this.playerParty, this.playerSouls);
                    playerSoul.selected_skill = null;
                }
            );
            this.messageTimer.displayMessages(this.turns);

        }
    }

    createSwitchClickHandler(switchOut: number, switchIn: number) {
        // from https://stackoverflow.com/questions/8941183/pass-multiple-arguments-along-with-an-event-object-to-an-event-handler
        return () => {
            // arrow function for `this` https://stackoverflow.com/a/73068955
            this.renderer.hideActions();

            const switchInFieldedPlayerSoul = this.switchSoul(switchOut, switchIn);

            this.selectEnemySkills();
            this.passTurn();
            this.messageTimer.addMessage(
                () => {
                    this.renderer.showActions(switchInFieldedPlayerSoul, this.playerParty, this.playerSouls);
                }
            );
            this.messageTimer.displayMessages(this.turns);
        }
    }
}

export {Battle};
