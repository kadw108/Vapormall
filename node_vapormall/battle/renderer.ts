import { FieldedPlayerSoul } from "./battleSoul";
import { Skill } from "../skill";
import { capitalizeFirstLetter } from "../utility";
import { GameState } from "../gameState";
import { IndividualSoul, PlayerSoul } from "../individualSoul";

enum DURATIONS {
    BETWEENBLOCKS = 3100,
    BETWEENLINES = 750,
}

class MessageRenderer {
    static readonly ENDBLOCK_STRING: string = "ENDBLOCK";

    messages: Array<string|Function>;

    blocks: number;
    messageContainer: HTMLElement;
    timeouts: Array<NodeJS.Timeout>;

    skillHandlerCreator: Function;
    switchHandlerCreator: Function;

    constructor(skillHandlerCreator: Function, switchHandlerCreator: Function) {
        const messageContainer = document.getElementById("messageContainer");
        if (messageContainer === null) {
            console.error("messageContainer is null! Cannot display messages!");
            return;
        }

        this.messages = [];

        this.messageContainer = messageContainer;
        this.blocks = 0;
        this.timeouts = [];

        this.skillHandlerCreator = skillHandlerCreator;
        this.switchHandlerCreator = switchHandlerCreator;
    }

    addMessage(message: string|Function) {
        this.messages.push(message);
    }

    endMessageBlock() {
        this.messages.push(MessageRenderer.ENDBLOCK_STRING);
    }

    displayMessages() {
        let startIndex = 0;
        this.messages.forEach((message, i) => {
            if (message === MessageRenderer.ENDBLOCK_STRING) {
               this.enqueueBlock(this.messages.slice(startIndex, i));
               startIndex = i + 1;
            }
        });
        this.enqueueBlock(this.messages.slice(startIndex, this.messages.length));

        this.messages = [];
    }

    private enqueueBlock(messages: Array<string|Function>) {
        const displayDelay = this.blocks * DURATIONS.BETWEENBLOCKS;

        const timeout = setTimeout(() => {
            this.displayBlock(messages);
        }, displayDelay);
        this.timeouts.push(timeout);

        this.blocks++;
    }

    private displayBlock(messages: Array<string|Function>) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", "blackBg");
        this.messageContainer.append(messageDiv);

        let stringNum = 0;
        messages.forEach((item, i) => {

            const delay = stringNum * DURATIONS.BETWEENLINES;
            
            if (typeof item === "string") {
                const timeout = setTimeout(() => {
                    messageDiv.append(
                        document.createTextNode(capitalizeFirstLetter(item))
                    );
                    messageDiv.append(
                        document.createElement("br")
                    );
                }, delay);
                this.timeouts.push(timeout);

                stringNum++;
            }
            else {
                const timeout = setTimeout(() => {
                    item();
                }, delay);
                this.timeouts.push(timeout);
            }
        });

        const timeout = setTimeout(() => {
            messageDiv.remove();
            this.blocks--;
        }, messages.length * DURATIONS.BETWEENLINES);
        this.timeouts.push(timeout);
    }

    renderSkills(playerSoul: FieldedPlayerSoul) {
        const skillContainer = document.createElement("div");
        skillContainer.id = "skillContainer";

        const prompt = document.createElement("p");
        prompt.textContent = "AGGRESSION PROTOCOL INITIATED.";
        skillContainer.append(prompt);

        playerSoul.soul.skills.forEach((skill, i) => {
            const skillWrapper = this.makeSkillWrapper(playerSoul, skill, i);
            skillContainer?.append(skillWrapper);
        });
        document.getElementById("bottomContainer")?.append(skillContainer);
    }

    makeSkillWrapper(playerSoul: FieldedPlayerSoul, skill: Skill, i: number) {
        const skillWrapper = skill.getSkillContainer();
        const skillButton = skillWrapper.getElementsByTagName("button")[0];

        if (skill.pp > 0) {
            skillButton.addEventListener("click",
                this.skillHandlerCreator(playerSoul, i),
                false);
        }
        else {
            skillButton.classList.add("noClick");
        }
        return skillWrapper;
    }

    hideActions() {
        const bottomContainer = document.getElementById("bottomContainer");
        bottomContainer?.remove();
    }

    showActions(playerSoul: FieldedPlayerSoul, playerParty: Array<PlayerSoul>, playerSouls: Array<FieldedPlayerSoul>) {
        const bottomContainer = document.createElement("div");
        bottomContainer.id = "bottomContainer";
        document.getElementById("bottomhalf")?.append(bottomContainer);

        this.renderSkills(playerSoul);
        this.renderSwitch(playerParty, playerSouls);
    }

    renderSwitch(playerParty: Array<PlayerSoul>, playerSouls: Array<FieldedPlayerSoul>) {
        const switchContainer = document.createElement("div");
        switchContainer.id = "switchContainer";

        const prompt = document.createElement("p");
        prompt.textContent = "SWITCH ACTIVE PROCESS?";
        switchContainer.append(prompt);

        playerParty.forEach((playerSoul, i) => {
            const switchWrapper = this.makeSwitchWrapper(playerSoul, i, playerSouls);
            switchContainer?.append(switchWrapper);
        });
        document.getElementById("bottomContainer")?.append(switchContainer);
    }

    makeSwitchWrapper(playerSoul: PlayerSoul, switchIn: number, playerSouls: Array<FieldedPlayerSoul>) {
        const switchContainer = playerSoul.getSwitchContainer();
        const switchButton = switchContainer.getElementsByTagName("button")[0];

        let offField = true;
        playerSouls.forEach((s) => {
            if (s.soul === playerSoul) {
                offField = false;
            }
        })

        if (playerSoul.currentHP > 0 && offField) {
            switchButton.addEventListener("click",
                this.switchHandlerCreator(0, switchIn),
                false);
        }
        else {
            switchButton.classList.add("noClick");
        }

        return switchContainer;
    }

    endBattle() {
        document.getElementById("endScreen")?.classList.remove("hidden");

        this.clearAll();
        this.blocks = 0;
        this.messages = [];
        this.timeouts = [];
    }

    clearAll() {
        this.timeouts.forEach((t) => {
            clearTimeout(t);
        });
    }
}

export {
    MessageRenderer
};