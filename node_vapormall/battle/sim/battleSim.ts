import { IndividualSoul, PlayerSoul } from "../../soul/individualSoul";
import { CONSTANTS } from "../../data/constants";

import { BattleSoul, FieldedPlayerSoul, EnemySoul } from "./battleSoul";
import { Renderer } from "../renderer";
import { MessageTimer } from "../messageTimer";
import { Calculator } from "./calculator";
import { GameState } from "../../gameState";
import { Action, SwitchOut, UseSkill, UseItem } from "../action";
import { Inventory } from "../../inventory";

interface FaintData {
    soul: FieldedPlayerSoul;
    playerSoulsIndex: number;
}

class BattleSim {
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

    constructor(
        playerSouls: Array<PlayerSoul>,
        enemySouls: Array<IndividualSoul>
    ) {
        this.playerParty = playerSouls;
        this.enemyParty = enemySouls;

        this.playerSouls = [new FieldedPlayerSoul(this.playerParty[0])];
        this.enemySouls = [new EnemySoul(this.enemyParty[0])];

        this.battleOver = false;

        this.renderer = new Renderer(
            this.createActionHandler.bind(this),
            this.createSwitchFaintHandler.bind(this)
        );
        const playerSoul = this.playerSouls[0];
        this.renderer.showActions(
            playerSoul!,
            this.playerParty,
            this.playerSouls
        );
        this.calculator = new Calculator(this);
        this.messageTimer = new MessageTimer();

        this.playersFaintedThisTurn = [];

        this.turns = 0;
    }

    private getFieldedSoul(soul: IndividualSoul): BattleSoul | null {
        for (const battleSoul of this.allSouls()) {
            if (battleSoul !== null && battleSoul.soul === soul) {
                return battleSoul;
            }
        }
        return null;
    }

    changeHP(battleSoul: BattleSoul, amount: number) {
        this.messageTimer.addMessage(() => {
            battleSoul.renderer.displayHP += amount;
            battleSoul.renderer.updateHP();
        });
        battleSoul.soul.changeHP(amount);
        this.calculator.checkFaint(battleSoul);
    }

    private selectEnemySkills() {
        for (const i of this.enemySouls) {
            i.chooseMove(this.allSouls(), this.playerSouls, this.enemySouls);
        }
    }

    private selectPlayerTarget(playerSoul: FieldedPlayerSoul) {
        if (
            playerSoul.selectedAction === null ||
            !playerSoul.selectedAction.isUseSkill()
        ) {
            console.error("SELECTING TARGET FOR NULL PLAYER SKILL");
            return;
        }

        const selected_skill = (playerSoul.selectedAction as UseSkill).skill;
        switch (selected_skill.data.target) {
            case CONSTANTS.TARGETS.SELECTED:
            case CONSTANTS.TARGETS.OPPOSING:
                const j = 0;
                playerSoul.selectedTarget = [this.enemySouls[j]];
                break;
            case CONSTANTS.TARGETS.ALLIED:
                playerSoul.selectedTarget = this.playerSouls.filter(
                    (i) => i !== null
                ) as BattleSoul[];
                break;
            case CONSTANTS.TARGETS.ALL:
                playerSoul.selectedTarget = this.allSouls().filter(
                    (i) => i !== null
                ) as BattleSoul[];
                break;
            case CONSTANTS.TARGETS.SELF:
                playerSoul.selectedTarget = [playerSoul];
                break;
            case CONSTANTS.TARGETS.NONE:
                playerSoul.selectedTarget = [];
                break;
        }
    }

    private runItems() {
        for (const soul of this.allSouls()) {
            if (
                soul !== null &&
                soul.selectedAction !== null &&
                soul.selectedAction.isUseItem()
            ) {
                const item = (soul.selectedAction as UseItem).item;
                const target = (soul.selectedAction as UseItem).targetSoul;

                if (!GameState.Inventory.hasItem(item)) {
                    console.error("Using item player does not have!");
                    return;
                }

                this.messageTimer.addMessage(() => {
                    GameState.Inventory.removeItem(item);
                    item.effect(target);
                    item.inBattleEffect(this, target);
                });
                this.messageTimer.addMessage(
                    "You used " + item.long_name + " on " + target.name + "!"
                );
            }
        }
    }

    private runSkills() {
        function compareSpeed(
            soulAbsA: BattleSoul | null,
            soulAbsB: BattleSoul | null
        ) {
            if (soulAbsA === null || soulAbsB === null) {
                console.error("comparing speed with null souls");
                return 1;
            }
            return (
                soulAbsA.calculateStat(CONSTANTS.STATS.SPEED) -
                soulAbsB.calculateStat(CONSTANTS.STATS.SPEED)
            );
        }
        const speed_order = this.allSouls().sort(compareSpeed);

        for (let i = 0; i < speed_order.length; i++) {
            if (
                speed_order[i] !== null &&
                speed_order[i]?.selectedAction?.isUseSkill()
            ) {
                this.useSkill(speed_order[i]!);
            }
        }

        this.turns++;
    }

    private checkPartyDefeated(party: Array<IndividualSoul>): boolean {
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
        const playerDefeat = this.checkPartyDefeated(this.playerParty);
        if (playerDefeat || this.checkPartyDefeated(this.enemyParty)) {
            if (playerDefeat) {
                this.messageTimer.addMessage(() => {
                    this.messageTimer.clearAll();
                    // @ts-expect-error for story
                    story.showSnippet("Loss", false);
                });
            } else {
                const nextButton = document.getElementById("next");
                if (nextButton === null) {
                    console.error("next button not available!");
                } else {
                    nextButton.addEventListener(
                        "click",
                        () => {
                            this.victory();
                        },
                        false
                    );
                }
            }

            this.messageTimer.addMessage(() => {
                this.messageTimer.clearAll();
                this.renderer.showEndScreen();
            });
        }
    }

    victory() {
        // clear encounter
        GameState.currentFloor.currentRoom().info.encounter = [];
        GameState.currentEnemy = null;
        // @ts-expect-error for story
        const result = story.showSnippet("Room", false);
    }

    useSkill(user: BattleSoul) {
        const skill = (user.selectedAction as UseSkill).skill;
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
                if (user.selectedTarget !== null) {
                    user.selectedTarget.forEach((target) => {
                        this.calculator.applySkillEffects(user, skill, target);
                    });
                } else {
                    console.error("No target for move!");
                }
                break;
            case CONSTANTS.TARGETS.NONE:
                break;
        }
    }

    switchSoul(action: SwitchOut): FieldedPlayerSoul {
        const leaving = this.playerSouls[action.soulPartyIndex];
        const entering = new FieldedPlayerSoul(
            this.playerParty[action.switchInIndex]
        );

        if (leaving === null) {
            console.error("switching out null soul!");
            return entering;
        }

        leaving.removeUI();
        this.playerSouls[action.soulPartyIndex] = entering;
        this.messageTimer.addMessage(
            "Switching out " +
                leaving.renderer.getName() +
                " for " +
                entering.soul.name +
                "."
        );
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
        this.playersFaintedThisTurn.push({
            soul: this.playerSouls[destroyedSoul]!,
            playerSoulsIndex: destroyedSoul,
        });

        this.playerSouls[destroyedSoul] = null;
    }

    createActionHandler(action: Action) {
        // from https://stackoverflow.com/questions/8941183/pass-multiple-arguments-along-with-an-event-object-to-an-event-handler

        if (action.isSwitchOut()) {
            return () => {
                // arrow function for `this` https://stackoverflow.com/a/73068955
                this.renderer.hideActions();

                const switchInFieldedPlayerSoul = this.switchSoul(
                    action as SwitchOut
                );

                this.selectEnemySkills();
                this.runItems();
                this.runSkills();
                this.messageTimer.addMessage(
                    this.nextTurnChoices(switchInFieldedPlayerSoul)
                );
                this.messageTimer.addMessage(() => {
                    switchInFieldedPlayerSoul.selectedAction = null;
                });
                this.messageTimer.displayMessages(this.turns);
            };
        } else {
            return () => {
                this.renderer.hideActions();

                const battleSoul = this.playerSouls[action.soulPartyIndex];
                if (battleSoul === null) {
                    console.error("battleSoul is null ???");
                    return;
                }

                battleSoul.selectedAction = action;
                this.selectPlayerTarget(battleSoul);

                this.selectEnemySkills();
                this.runItems();
                this.runSkills();
                this.messageTimer.addMessage(this.nextTurnChoices(battleSoul));
                this.messageTimer.addMessage(() => {
                    battleSoul.selectedAction = null;
                });
                this.messageTimer.displayMessages(this.turns);
            };
        }
    }

    createSwitchFaintHandler(faint: FaintData, switchIn: number) {
        return () => {
            this.renderer.hideActions();

            const switchInFieldedPlayerSoul = this.switchSoulFainted(
                faint,
                switchIn
            );
            this.messageTimer.addMessage(
                this.nextTurnChoices(switchInFieldedPlayerSoul)
            );
            this.messageTimer.displayMessages(this.turns);
        };
    }

    nextTurnChoices(nextTurnPlayer: FieldedPlayerSoul) {
        for (let i = 0; i < this.playersFaintedThisTurn.length; i++) {
            if (this.playersFaintedThisTurn[i].soul === nextTurnPlayer) {
                return () => {
                    this.renderer.FaintSwitchMenu(
                        this.playersFaintedThisTurn[i],
                        this.playerParty,
                        this.playerSouls
                    );
                };
            }
        }

        return () => {
            this.renderer.showActions(
                nextTurnPlayer,
                this.playerParty,
                this.playerSouls
            );
        };
    }
}

export { BattleSim, FaintData };
