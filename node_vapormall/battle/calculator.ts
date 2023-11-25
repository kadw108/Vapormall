import {Battle} from "./battle";
import {Skill} from "../soul/skill";
import {StatChange} from "../data/skills";
import {CONSTANTS} from "../data/constants";
import {BattleSoul, FieldedPlayerSoul, EnemySoul} from "./battleSoul";
import { IndividualSoul } from "../soul/individualSoul";

class Calculator {
    battle: Battle;
    
    constructor(battle: Battle) {
        this.battle = battle;
    }

    applySkillEffects(user: BattleSoul, skill: Skill, target: BattleSoul) {
        this.battle.messageTimer.addMessage(
            user.renderer.getName() + " used " + skill.data.name + "!"
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
                        this.battle.messageTimer.addMessage(
                            "It didn't affect " + target.renderer.getName() + "..."
                        );
                    }
                    else {
                        damage = this.capDamageToHP(
                            Math.ceil(damage * multiplier),
                            target.soul);

                        this.battle.messageTimer.addMessage(() => {
                            target.renderer.displayHP -= damage;
                            target.renderer.updateHP();
                        });

                        if (multiplier > 1) {
                            this.battle.messageTimer.addMessage("It's super effective!");
                        }
                        else if (multiplier < 1) {
                            this.battle.messageTimer.addMessage("It's not very effective...");
                        }

                        this.battle.messageTimer.addMessage(
                            target.renderer.getName() + " lost " + damage + " HP!"
                        );
                        target.soul.changeHP(-damage);
                        this.checkFaint(target);

                        if (skill.data.meta.drain !== 0) {
                            const drain = this.capDamageToHP(
                                Math.floor(damage * (skill.data.meta.drain/100)),
                                user.soul
                            );

                            this.battle.messageTimer.addMessage(() => {
                                user.renderer.displayHP += drain;
                                user.renderer.updateHP();
                            });

                            if (drain > 0) {
                                this.battle.messageTimer.addMessage(
                                    user.renderer.getName() + " drained " + drain + " HP!"
                                );
                            }
                            else if (drain < 0) {
                                this.battle.messageTimer.addMessage(
                                    user.renderer.getName() + " lost " + (-drain) + " HP from recoil!"
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
                        this.battle.messageTimer.addMessage(
                            target.renderer.getName() + "'s " + statChange.stat + " couldn't go any higher!"
                        );
                    }
                    else if (target.stat_changes[statChange.stat] === -6) {
                        this.battle.messageTimer.addMessage(
                            target.renderer.getName() + "'s " + statChange.stat + " couldn't go any lower!"
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

                        this.battle.messageTimer.addMessage(() => {
                            target.renderer.updateStats();
                        });
                        this.battle.messageTimer.addMessage(
                            target.renderer.getName() + "'s " + statChange.stat + changeDesc
                        );
                    }
                });
                break;
        }

        this.battle.messageTimer.endMessageBlock();
    }

    damageCalc(user: BattleSoul, skill: Skill, target: BattleSoul, isGlitch: boolean): number {
        if (isGlitch) {
            const damage_num = user.calculateStat(CONSTANTS.STATS.GLITCHATTACK) * skill.data.power!;
            const damage = Math.ceil(damage_num / target.calculateStat(CONSTANTS.STATS.GLITCHDEFENSE));
            return damage;
        }

        const damage_num = user.calculateStat(CONSTANTS.STATS.ATTACK) * skill.data.power!;
        const damage = Math.ceil(damage_num / target.calculateStat(CONSTANTS.STATS.DEFENSE));
        return damage;
    }

    capDamageToHP(damage: number, target: IndividualSoul): number {
        if (target.currentHP - damage < 0) {
            return target.currentHP;
        }
        return damage;
    }

    typeMultiplier(attackType: CONSTANTS.TYPES, defendType: CONSTANTS.TYPES): number {
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

    checkFaint(soul: BattleSoul): void {
        if (soul.soul.currentHP <= 0) { 

            this.battle.messageTimer.endMessageBlock();
            this.battle.messageTimer.addMessage(soul.renderer.getName() + " was destroyed!");

            this.battle.allSouls().filter((s) => {s === null || s.soul.name !== soul.soul.name});
            if (soul instanceof FieldedPlayerSoul) {
                this.battle.playerSoulDestroyed(
                    this.battle.playerSouls.indexOf(soul as FieldedPlayerSoul)
                );
            }
            else if (soul instanceof EnemySoul) {
                this.battle.enemySouls.splice(
                    this.battle.enemySouls.indexOf(soul as EnemySoul), 1);
            }

            this.battle.checkBattleOver();
        }
    }


}

export {
    Calculator
};