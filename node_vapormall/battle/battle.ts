import {IndividualSoul, PlayerSoul} from "../soul/individualSoul";
import {CONSTANTS} from "../data/constants";

import {BattleSoul, FieldedPlayerSoul, EnemySoul} from "./battleSoul";
import { Renderer } from "./renderer";
import { MessageTimer } from "./messageTimer";
import { Calculator } from "./calculator";
import { GameState } from "../gameState";

interface FaintData {
  soul: FieldedPlayerSoul;
  playerSoulsIndex: number;
}

class Battle {
    readonly playerParty: Array<PlayerSoul>;
    readonly enemyParty: Array<IndividualSoul>;

    playerSouls: Array<FieldedPlayerSoul | null>;
    enemySouls: Array<EnemySoul>;
    battleOver: boolean;

    renderer: Renderer;
    calculator: Calculator;
    messageTimer: MessageTimer;

    playersFaintedThisTurn: Array<FaintData>;

    turns: number;

    constructor(playerSouls: Array<PlayerSoul>, enemySouls: Array<IndividualSoul>) {
        this.playerParty = playerSouls;
        this.enemyParty = enemySouls;

        this.playerSouls = [new FieldedPlayerSoul(this.playerParty[0])];
        this.enemySouls = [new EnemySoul(this.enemyParty[0])];

        this.battleOver = false;

        this.renderer = new Renderer(
            this.createSkillClickHandler.bind(this),
            this.createSwitchClickHandler.bind(this),
            this.createSwitchFaintClickHandler.bind(this));
        const playerSoul = this.playerSouls[0];
        this.renderer.showActions(playerSoul!, this.playerParty, this.playerSouls);
        this.calculator = new Calculator(this);
        this.messageTimer = new MessageTimer();

        this.playersFaintedThisTurn = [];

        this.turns = 0;
    }

    private selectEnemySkills() {
        for (const i of this.enemySouls) {
            i.chooseMove(this.allSouls(), this.playerSouls, this.enemySouls);
        }
    }

    private selectPlayerTarget(playerSoul: FieldedPlayerSoul) {
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
                playerSoul.selected_target = this.playerSouls.filter((i) => i !== null) as BattleSoul[];
                break;
            case CONSTANTS.TARGETS.ALL:
                playerSoul.selected_target = this.allSouls().filter((i) => i !== null) as BattleSoul[];
                break;
            case CONSTANTS.TARGETS.SELF:
                playerSoul.selected_target = [playerSoul];
                break;
            case CONSTANTS.TARGETS.NONE:
                playerSoul.selected_target = [];
                break;
            }
    }

    private passTurn() {
       function compareSpeed(soulAbsA: BattleSoul | null, soulAbsB: BattleSoul | null)  {
            if (soulAbsA === null || soulAbsB === null) {
                console.error("comparing speed with null souls");
                return 1;
            }
            return soulAbsA.calculateStat(CONSTANTS.STATS.SPEED) -
                soulAbsB.calculateStat(CONSTANTS.STATS.SPEED);
       }
       const speed_order = this.allSouls().sort(compareSpeed);

       for (let i = 0; i < speed_order.length; i++) {
            if (speed_order[i] !== null) {
                this.useSkill(speed_order[i]!);
            }
       }

       this.turns++;
    }

    private partyDefeated(party: Array<IndividualSoul>): boolean {
        for (let i = 0; i < party.length; i++) {
            if (party[i].currentHP > 0) {
                return false;
            }
        }
        return true;
    }

    allSouls() {
        return [...this.playerSouls, ...this.enemySouls];
    }

    checkBattleOver() {
        const playerDefeat = this.partyDefeated(this.playerParty);
        if (playerDefeat || this.partyDefeated(this.enemyParty)) {

            if (playerDefeat) {
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
                    this.messageTimer.clearAll();
                    this.renderer.endBattle();
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

        if (leaving === null) {
            console.error("switching out null soul!");
            return entering;
        }

        leaving.removeUI();
        this.playerSouls[switchOut] = entering;
        this.messageTimer.addMessage("Switching out " + leaving.renderer.getName() + " for " + entering.soul.name + ".");
        this.messageTimer.endMessageBlock();

        return entering;
    }

    switchSoulFainted(faint: FaintData, switchIn: number): FieldedPlayerSoul {
        const entering = new FieldedPlayerSoul(this.playerParty[switchIn]);

        faint.soul.removeUI();
        this.playerSouls[faint.playerSoulsIndex] = entering;

        return entering;
    }

    playerSoulDestroyed(destroyedSoul: number) {
        if (this.playerSouls[destroyedSoul] === null) {
            console.error("fainted soul is already fainted");
        }
        this.playersFaintedThisTurn.push(
            {soul: this.playerSouls[destroyedSoul]!, playerSoulsIndex: destroyedSoul});

        this.playerSouls[destroyedSoul] = null;
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
                this.nextTurnChoices(playerSoul)
            );
            this.messageTimer.addMessage(
                () => {
                    playerSoul.selected_skill = null;
                }
            )
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
                this.nextTurnChoices(switchInFieldedPlayerSoul)
            );
            this.messageTimer.displayMessages(this.turns);
        }
    }

    createSwitchFaintClickHandler(faint: FaintData, switchIn: number) {
        return () => {
            this.renderer.hideActions();

            const switchInFieldedPlayerSoul = this.switchSoulFainted(faint, switchIn);
            this.messageTimer.addMessage(
                this.nextTurnChoices(switchInFieldedPlayerSoul)
            );
            this.messageTimer.displayMessages(this.turns);
        }
    }

    nextTurnChoices(nextTurnPlayer: FieldedPlayerSoul) {
        for (let i = 0; i < this.playersFaintedThisTurn.length; i++) {
            if (this.playersFaintedThisTurn[i].soul === nextTurnPlayer) {
                return () => {
                    this.renderer.renderFaintSwitch(
                        this.playersFaintedThisTurn[i],
                        this.playerParty,
                        this.playerSouls);
                };
            }
        }

        return () => {
            this.renderer.showActions(nextTurnPlayer, this.playerParty, this.playerSouls);
        };
    }
}

export {
    Battle,
    FaintData
};
