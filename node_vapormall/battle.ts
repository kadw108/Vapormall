import {Skill, IndividualSoul } from "./individualsoul";
import {CONSTANTS} from "./constants";

abstract class BattleSoul {
    soul: IndividualSoul;
    selected_skill: Skill | null;
    selected_target: Array<BattleSoul> | null;

    infoDiv: HTMLElement;
    hpText: HTMLElement;

    constructor(soul: IndividualSoul) {
        this.soul = soul;
        this.selected_skill = null;
        this.selected_target = null;

        this.infoDiv = document.createElement("div");
        const nameText = document.createTextNode(this.soul.name);
        this.infoDiv.append(nameText);
        this.infoDiv.append(document.createElement("br"));
        this.hpText = document.createElement("small");
        this.hpText.append(
            document.createTextNode(this.getHPString())
        );
        this.infoDiv.append(this.hpText);
        document.getElementById("tophalf")?.append(this.infoDiv);
    }

    useSkill(messageRenderer: MessageRenderer) {
        if (this.selected_skill === null) {
            console.error("Using null skill!");
            return;
        }
        if (this.selected_skill.pp <= 0) {
            console.error("Using skill with no pp!");
            return;
        }
        this.selected_skill.pp--;

        const messages = [Battle.getName(this) +
            " used " + this.selected_skill.data.name];

        const skill = this.selected_skill;
        switch (skill.data.meta.category) {
            case CONSTANTS.SKILLCATEGORIES.NORMALDAMAGE:
                if (skill.data.power !== null) {
                    const damage_num = this.soul.offense * skill.data.power;

                    if (this.selected_target !== null) {
                        for (let i = 0; i < this.selected_target.length; i++) {
                            const target = this.selected_target[i];
                            const damage = Math.ceil(damage_num / target.soul.defense);

                            target.soul.hp -= damage;
                            messages.push(Battle.getName(target) + " lost " + damage + " HP!");
                            messageRenderer.addBlock(messages);

                            target.updateInfo();
                        }
                    }
                    else {
                        console.error("No target for move!");
                    }
                }
                break;
            case CONSTANTS.SKILLCATEGORIES.GLITCHDAMAGE:
                break;
            case CONSTANTS.SKILLCATEGORIES.STATUS:
                break;
            default:
                console.log("SKILL HAS INVALID CATEGORY");
        }
    }

    updateInfo() {
        this.hpText.innerHTML = this.getHPString();
    }

    getHPString() {
        return "HP: " + this.soul.hp + "/" + this.soul.max_hp;
    }
}

class PlayerSoul extends BattleSoul {
    constructor(soul: IndividualSoul) {
        super(soul);
        this.infoDiv.classList.add("playerInfo", "soulInfo", "blackBg");
    }

    renderSkills(battle: Battle) {
        const skillDiv = document.createElement("div");
        skillDiv.id = "skillDiv";

        this.soul.skills.forEach((skill, i) => {
            const skillButton = skill.renderSkillButton();
            skillButton.addEventListener("click",
                battle.makeSkillClickHandler(this, i),
                false);
            skillDiv?.append(skillButton);
        });

        document.getElementById("bottomhalf")?.append(skillDiv);
    }

    hideSkills() {
        const skillDiv = document.getElementById("skillDiv");
        skillDiv?.remove();
    }
}

class EnemySoul extends BattleSoul {
    constructor(soul: IndividualSoul) {
        super(soul);
        this.infoDiv.classList.add("enemyInfo", "soulInfo", "blackBg");
    }
}

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
    }

    static getName(battleSoul: BattleSoul): string {
        if (battleSoul instanceof PlayerSoul) {
            return "Your " + battleSoul.soul.name;
        }
        return "The opposing " + battleSoul.soul.name;
    }

    render() {
        // render player actions
        const playerSoul = this.playerSouls[0];
        playerSoul.renderSkills(this);
    }

    passTurn() {
       function compareSpeed(soulAbsA: BattleSoul, soulAbsB: BattleSoul)  {
            return soulAbsA.soul.speed - soulAbsB.soul.speed;
       }
       const speed_order = this.souls.sort(compareSpeed);

       for (let i = 0; i < speed_order.length; i++) {
            speed_order[i].useSkill(this.messageRenderer);
            this.checkBattleOver();
            if (this.battleOver) {
                return;
            }
       }
    }

    checkBattleOver() {
        let player_lost:boolean = true;
        for (let i = 0; i < this.playerSouls.length; i++) {
            if (this.playerSouls[i].soul.hp > 0) {
                player_lost = false;
                break;
            }
        }
        if (player_lost) {
            this.messageRenderer.addBlock(["u lose lol"]);
            this.battleOver = true;
        }

        let player_won:boolean = true;
        for (let i = 0; i < this.enemySouls.length; i++) {
            if (this.enemySouls[i].soul.hp > 0) {
                player_won = false;
                break;
            }
        }
        if (player_won) {
            this.messageRenderer.addBlock(["u win!"]);
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

    makeSkillClickHandler(playerSoul: PlayerSoul, whichSkill: number) {
        // from https://stackoverflow.com/questions/8941183/pass-multiple-arguments-along-with-an-event-object-to-an-event-handler
        return () => {
            // arrow function for `this` https://stackoverflow.com/a/73068955
            playerSoul.hideSkills();
            playerSoul.selected_skill = playerSoul.soul.skills[whichSkill];
            this.selectPlayerTarget(playerSoul);
            this.selectEnemySkills();
            this.passTurn();

            setTimeout(() => {
                playerSoul.renderSkills(this);
            }, DURATIONS.BETWEENBLOCKS * 2);
        }
    }
}

enum DURATIONS {
    BETWEENBLOCKS = 3000,
    BETWEENLINES = 500,
    BLOCKDURATION = 1500
}

class MessageRenderer {
    blocks: number;
    messageContainer: HTMLElement;

    constructor() {
        const messageContainer = document.getElementById("messageContainer");
        if (messageContainer === null) {
            console.error("messageContainer is null! Cannot display messages!");
            return;
        }

        this.messageContainer = messageContainer;
        this.blocks = 0;
    }

    addBlock(messages: Array<string>) {
        const displayDelay = this.blocks * DURATIONS.BETWEENBLOCKS;
        setTimeout(() => {
            this.renderBlock(messages);
        }, displayDelay);

        this.blocks++;
    }

    renderBlock(messages: Array<string>) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", "blackBg");
        this.messageContainer.append(messageDiv);

        for (let i = 0; i < messages.length; i++) {
            setTimeout(() => {
                messageDiv.append(
                    document.createTextNode(messages[i])
                );
                messageDiv.append(
                    document.createElement("br")
                );
            }, i * DURATIONS.BETWEENLINES);
        }

        setTimeout(() => {
            messageDiv.remove();
            this.blocks--;
        }, DURATIONS.BLOCKDURATION);
    }
}

export {Battle};
