import {Skill, IndividualSoul} from "../individualsoul";
import {StatChange} from "../skills";
import {CONSTANTS} from "../constants";
import {BattleSoul, PlayerSoul, EnemySoul} from "./battleSoul";
import { MessageRenderer } from "./renderer";

class Battle {
    playerSouls: Array<PlayerSoul>;
    enemySouls: Array<EnemySoul>;
    souls: Array<PlayerSoul | EnemySoul>;
    battleOver: boolean;

    messageRenderer: MessageRenderer;

    constructor(playerSouls: Array<IndividualSoul>, enemySouls: Array<IndividualSoul>) {
        this.playerSouls = playerSouls.map(
            function (i) {
                return new PlayerSoul(i);
            }
        );

        this.enemySouls = enemySouls.map(
            function (i) {
                return new EnemySoul(i);
            }
        );

        this.souls = [...this.playerSouls, ...this.enemySouls];
        this.battleOver = false;

        this.messageRenderer = new MessageRenderer();
        const playerSoul = this.playerSouls[0];
        this.messageRenderer.renderSkills(playerSoul, this.createSkillClickHandler.bind(this));
    }

    static getName(battleSoul: BattleSoul): string {
        if (battleSoul instanceof PlayerSoul) {
            return "Your " + battleSoul.soul.name;
        }
        return "The opposing " + battleSoul.soul.name;
    }

    passTurn() {
       function compareSpeed(soulAbsA: BattleSoul, soulAbsB: BattleSoul)  {
            return soulAbsA.calculateStat(CONSTANTS.STATS.SPEED) -
                soulAbsB.calculateStat(CONSTANTS.STATS.SPEED);
       }
       const speed_order = this.souls.sort(compareSpeed);

       for (let i = 0; i < speed_order.length; i++) {
            this.useSkill(speed_order[i]);
            this.checkBattleOver();
            if (this.battleOver) {
                return;
            }
       }
    }

    checkBattleOver() {
        let player_lost:boolean = true;
        for (let i = 0; i < this.playerSouls.length; i++) {
            if (this.playerSouls[i].soul.currentHP> 0) {
                player_lost = false;
                break;
            }
        }
        if (player_lost) {
            this.messageRenderer.enqueueBlock(["u lose lol"]);
            this.battleOver = true;
        }

        let player_won:boolean = true;
        for (let i = 0; i < this.enemySouls.length; i++) {
            if (this.enemySouls[i].soul.currentHP > 0) {
                player_won = false;
                break;
            }
        }
        if (player_won) {
            this.messageRenderer.enqueueBlock(["u win!"]);
            this.battleOver = true;
        }
    }

    selectEnemySkills() {
        for (const i of this.enemySouls) {
            i.selected_skill = i.soul.skills[0];
            i.selected_target = [this.playerSouls[0]];
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

    createSkillClickHandler(playerSoul: PlayerSoul, whichSkill: number) {
        // from https://stackoverflow.com/questions/8941183/pass-multiple-arguments-along-with-an-event-object-to-an-event-handler
        return () => {
            // arrow function for `this` https://stackoverflow.com/a/73068955
            playerSoul.selected_skill = playerSoul.soul.skills[whichSkill];
            this.messageRenderer.temporaryHideSkills();
            this.selectPlayerTarget(playerSoul);
            this.selectEnemySkills();
            this.passTurn();
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
        const messages: [string | Function] = [Battle.getName(user) +
            " used " + skill.data.name];
        messages.push(() => {
            target.updateInfo();
        });

        switch (skill.data.meta.category) {
            case CONSTANTS.SKILLCATEGORIES.NORMALDAMAGE:
                if (skill.data.power !== null) {
                    const damage_num = user.calculateStat(CONSTANTS.STATS.OFFENSE) * skill.data.power;
                    const damage = Math.ceil(damage_num / target.calculateStat(CONSTANTS.STATS.DEFENSE));

                    target.soul.currentHP -= damage;
                    messages.push(Battle.getName(target) + " lost " + damage + " HP!");
                }
                break;

            case CONSTANTS.SKILLCATEGORIES.GLITCHDAMAGE:
                if (skill.data.power !== null) {
                    const damage_num = user.calculateStat(CONSTANTS.STATS.GLITCHOFFENSE) * skill.data.power;
                    const damage = Math.ceil(damage_num / target.calculateStat(CONSTANTS.STATS.GLITCHDEFENSE));

                    target.soul.currentHP -= damage;
                    messages.push(Battle.getName(target) + " lost " + damage + " HP!");
                }
                break;

            case CONSTANTS.SKILLCATEGORIES.STATUS:
                skill.data.stat_changes.forEach((statChange: StatChange) => {
                    if (statChange.stat === CONSTANTS.STATS.HP) {
                        console.error("Stat change for HP not allowed!")
                    }
                    else if (target.stat_changes[statChange.stat] === 6) {
                        messages.push(Battle.getName(target) + "'s " + statChange.stat + " couldn't go any higher!");
                    }
                    else if (target.stat_changes[statChange.stat] === -6) {
                        messages.push(Battle.getName(target) + "'s " + statChange.stat + " couldn't go any lower!");
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

                        messages.push(Battle.getName(target) + "'s " + statChange.stat + changeDesc);
                    }
                });
                break;
        }

        this.messageRenderer.enqueueBlock(messages);
    }
}

export {Battle};
