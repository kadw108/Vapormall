import {Battle} from "./battle";
import {Skill} from "../skill";
import {StatChange} from "../data/skills";
import {CONSTANTS} from "../data/constants";
import {BattleSoul, PlayerSoul, EnemySoul} from "./battleSoul";

class BattleCalculator {
    battle: Battle;
    
    constructor(battle: Battle) {
        this.battle = battle;
    }

    applySkillEffects(user: BattleSoul, skill: Skill, target: BattleSoul) {
        this.battle.messageRenderer.addMessage(
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
                        this.battle.messageRenderer.addMessage(
                            "It didn't affect " + Battle.getName(target) + "..."
                        );
                    }
                    else {
                        damage = Math.ceil(damage * multiplier);

                        this.battle.messageRenderer.addMessage(() => {
                            target.displayHP -= damage;
                            target.updateHP();
                        });

                        if (multiplier > 1) {
                            this.battle.messageRenderer.addMessage("It's super effective!");
                        }
                        else if (multiplier < 1) {
                            this.battle.messageRenderer.addMessage("It's not very effective...");
                        }

                        this.battle.messageRenderer.addMessage(
                            Battle.getName(target) + " lost " + damage + " HP!"
                        );
                        target.soul.changeHP(-damage);
                        this.checkFaint(target);

                        if (skill.data.meta.drain !== 0) {
                            const drain = Math.floor(damage * (skill.data.meta.drain/100));

                            this.battle.messageRenderer.addMessage(() => {
                                user.displayHP += drain;
                                user.updateHP();
                            });

                            if (drain > 0) {
                                this.battle.messageRenderer.addMessage(
                                    Battle.getName(user) + " drained " + drain + " HP!"
                                );
                            }
                            else if (drain < 0) {
                                this.battle.messageRenderer.addMessage(
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
                        this.battle.messageRenderer.addMessage(
                            Battle.getName(target) + "'s " + statChange.stat + " couldn't go any higher!"
                        );
                    }
                    else if (target.stat_changes[statChange.stat] === -6) {
                        this.battle.messageRenderer.addMessage(
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

                        this.battle.messageRenderer.addMessage(() => {
                            target.updateStats();
                        });
                        this.battle.messageRenderer.addMessage(
                            Battle.getName(target) + "'s " + statChange.stat + changeDesc
                        );
                    }
                });
                break;
        }

        this.battle.messageRenderer.endMessageBlock();
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

    checkFaint(soul: BattleSoul) {
        if (soul.soul.currentHP <= 0) { 

            this.battle.messageRenderer.endMessageBlock();
            this.battle.messageRenderer.addMessage(Battle.getName(soul) + " was destroyed!");

            this.battle.souls.filter((s) => {s.soul.name !== soul.soul.name});
            if (soul instanceof PlayerSoul) {
                this.battle.playerSouls.splice(
                    this.battle.playerSouls.indexOf(soul as PlayerSoul), 1);
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
    BattleCalculator
};