import {IndividualSoul} from "../individualSoul";
import {Skill} from "../skill";
import {StatChange} from "../data/skills";
import {CONSTANTS} from "../data/constants";
import {BattleSoul, PlayerSoul, EnemySoul} from "./battleSoul";
import { MessageRenderer } from "./renderer";

class Battle {
    playerSouls: Array<PlayerSoul>;
    enemySouls: Array<EnemySoul>;
    souls: Array<PlayerSoul | EnemySoul>;
    battleOver: boolean;

    playerParty: Array<IndividualSoul>;
    enemyParty: Array<IndividualSoul>;

    messageRenderer: MessageRenderer;
    calcuator: Calculator;

    constructor(playerSouls: Array<IndividualSoul>, enemySouls: Array<IndividualSoul>) {
        this.playerParty = playerSouls;
        this.enemyParty = enemySouls;

        this.playerSouls = [new PlayerSoul(this.playerParty[0])];
        this.enemySouls = [new EnemySoul(this.enemyParty[0])];

        this.souls = [...this.playerSouls, ...this.enemySouls];
        this.battleOver = false;

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
                        this.applySkillEffects(user, skill, target);
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

    applySkillEffects(user: BattleSoul, skill: Skill, target: BattleSoul) {
        this.messageRenderer.addMessage(
            Battle.getName(user) + " used " + skill.data.name + "!"
        );

        switch (skill.data.meta.category) {
            case CONSTANTS.SKILLCATEGORIES.NORMALDAMAGE:
            case CONSTANTS.SKILLCATEGORIES.GLITCHDAMAGE:
                if (skill.data.power !== null) {
                    let damage = this.damageCalc(user, skill, target, 
                        skill.data.meta.category === CONSTANTS.SKILLCATEGORIES.GLITCHDAMAGE
                    );

                    let multiplier = 1;
                    target.soul.soul_species.types.forEach((type) => {
                        multiplier *= this.typeMultiplier(skill.data.type, type);
                    })

                    if (multiplier === 0) {
                        this.messageRenderer.addMessage(
                            "It didn't affect " + Battle.getName(target) + "..."
                        );
                    }
                    else {
                        damage = Math.ceil(damage * multiplier);

                        this.messageRenderer.addMessage(() => {
                            target.displayHP -= damage;
                            target.updateHP();
                        });

                        if (multiplier > 1) {
                            this.messageRenderer.addMessage("It's super effective!");
                        }
                        else if (multiplier < 1) {
                            this.messageRenderer.addMessage("It's not very effective...");
                        }

                        this.messageRenderer.addMessage(
                            Battle.getName(target) + " lost " + damage + " HP!"
                        );
                        target.soul.changeHP(-damage);
                        this.checkFaint(target);

                        if (skill.data.meta.drain !== 0) {
                            const drain = Math.floor(damage * (skill.data.meta.drain/100));

                            this.messageRenderer.addMessage(() => {
                                user.displayHP += drain;
                                user.updateHP();
                            });

                            if (drain > 0) {
                                this.messageRenderer.addMessage(
                                    Battle.getName(user) + " drained " + drain + " HP!"
                                );
                            }
                            else if (drain < 0) {
                                this.messageRenderer.addMessage(
                                    Battle.getName(user) + " lost " + (-drain) + " HP from recoil!"
                                );
                            }
                            user.soul.changeHP(drain);
                            this.checkFaint(user);
                        }
                    }
                }
                break;

            case CONSTANTS.SKILLCATEGORIES.STATUS:
                skill.data.stat_changes.forEach((statChange: StatChange) => {
                    if (statChange.stat === CONSTANTS.STATS.HP) {
                        console.error("Stat change for HP not allowed!")
                    }
                    else if (target.stat_changes[statChange.stat] === 6) {
                        this.messageRenderer.addMessage(
                            Battle.getName(target) + "'s " + statChange.stat + " couldn't go any higher!"
                        );
                    }
                    else if (target.stat_changes[statChange.stat] === -6) {
                        this.messageRenderer.addMessage(
                            Battle.getName(target) + "'s " + statChange.stat + " couldn't go any lower!"
                        );
                    }
                    else {
                        target.stat_changes[statChange.stat] += statChange.change;

                        let changeDesc = " ";
                        if (statChange.change > 0) {
                            changeDesc += "rose";
                        }
                        else {
                            changeDesc += "fell";
                        }
                        if (statChange.change > 1) {
                            changeDesc += " " + Math.abs(statChange.change) + " stages!";
                        }
                        else {
                            changeDesc += " " + Math.abs(statChange.change) + " stage!";
                        }

                        this.messageRenderer.addMessage(() => {
                            target.updateStats();
                        });
                        this.messageRenderer.addMessage(
                            Battle.getName(target) + "'s " + statChange.stat + changeDesc
                        );
                    }
                });
                break;
        }

        this.messageRenderer.endMessageBlock();
    }

    checkFaint(soul: BattleSoul) {
        if (soul.soul.currentHP <= 0) { 

            this.messageRenderer.endMessageBlock();
            this.messageRenderer.addMessage(Battle.getName(soul) + " was destroyed!");

            this.souls.filter((s) => {s.soul.name !== soul.soul.name});
            if (soul instanceof PlayerSoul) {
                this.playerSouls.splice(
                    this.playerSouls.indexOf(soul as PlayerSoul), 1);
            }
            else if (soul instanceof EnemySoul) {
                this.enemySouls.splice(
                    this.enemySouls.indexOf(soul as EnemySoul), 1);
            }

            this.checkBattleOver();
        }
    }

    damageCalc(user: BattleSoul, skill: Skill, target: BattleSoul, isGlitch: boolean) {
        if (isGlitch) {
            const damage_num = user.calculateStat(CONSTANTS.STATS.GLITCHATTACK) * skill.data.power!;
            const damage = Math.ceil(damage_num / target.calculateStat(CONSTANTS.STATS.GLITCHDEFENSE));
            return damage;
        }

        const damage_num = user.calculateStat(CONSTANTS.STATS.ATTACK) * skill.data.power!;
        const damage = Math.ceil(damage_num / target.calculateStat(CONSTANTS.STATS.DEFENSE));
        return damage;
    }

    typeMultiplier(attackType: CONSTANTS.TYPES, defendType: CONSTANTS.TYPES) {
        switch (attackType) {
            case CONSTANTS.TYPES.TYPELESS:
                if (defendType === CONSTANTS.TYPES.ERROR) {
                    return 0;
                }
                break;
            case CONSTANTS.TYPES.SWEET:
                if (defendType === CONSTANTS.TYPES.CORPORATE) {
                    return 2;
                }
                if (defendType === CONSTANTS.TYPES.EDGE) {
                    return 0.5;
                }
                break;
            case CONSTANTS.TYPES.EDGE:
                if (defendType === CONSTANTS.TYPES.SWEET) {
                    return 2;
                }
                if (defendType === CONSTANTS.TYPES.SANGFROID) {
                    return 0.5;
                }
                break;
            case CONSTANTS.TYPES.CORPORATE:
                if (defendType === CONSTANTS.TYPES.SANGFROID) {
                    return 2;
                }
                if (defendType === CONSTANTS.TYPES.SWEET) {
                    return 0.5;
                }
                break;
            case CONSTANTS.TYPES.SANGFROID:
                if (defendType === CONSTANTS.TYPES.EDGE) {
                    return 2;
                }
                if (defendType === CONSTANTS.TYPES.CORPORATE) {
                    return 0.5;
                }
                break;
        }

        return 1;
    }

    switchSoul(switchOut: number, switchIn: number): PlayerSoul {
        const leaving = this.playerSouls[switchOut];
        const entering = new PlayerSoul(this.playerParty[switchIn]);

        /* this.messageRenderer.temporaryHideSkills(entering); */

        leaving.switchOut();
        this.playerSouls[switchOut] = entering;
        this.messageRenderer.addMessage("Switching out " + Battle.getName(leaving) + " for " + entering.soul.name);

        return entering;
    }

    createSkillClickHandler(playerSoul: PlayerSoul, whichSkill: number) {
        // from https://stackoverflow.com/questions/8941183/pass-multiple-arguments-along-with-an-event-object-to-an-event-handler
        return () => {
            // arrow function for `this` https://stackoverflow.com/a/73068955
            playerSoul.selected_skill = playerSoul.soul.skills[whichSkill];
            this.messageRenderer.hideActions();
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
