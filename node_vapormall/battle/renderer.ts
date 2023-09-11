import { PlayerSoul } from "./battleSoul";
import { Skill } from "../skill";
import { capitalizeFirstLetter } from "../utility";

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

    constructor(skillHandlerCreator: Function) {
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

    renderSkills(playerSoul: PlayerSoul) {
        const skillButtons: Array<HTMLElement> = [];

        const skillContainer = document.createElement("div");
        skillContainer.id = "skillContainer";

        const prompt = document.createElement("p");
        prompt.textContent = "AGGRESSION PROTOCOL INITIATED.";
        skillContainer.append(prompt);

        playerSoul.soul.skills.forEach((skill, i) => {
            const skillWrapper = this.makeSkillWrapper(playerSoul, skill, i);
            skillContainer?.append(skillWrapper);
        });
        document.getElementById("bottomhalf")?.append(skillContainer);
    }

    makeSkillWrapper(playerSoul: PlayerSoul, skill: Skill, i: number) {
        const skillButton = skill.getSkillButton();

        if (skill.pp > 0) {
            skillButton.addEventListener("click",
                this.skillHandlerCreator(playerSoul, i),
                false);
        }
        else {
            skillButton.classList.add("noClick");
        }

        const skillTip = skill.getSkillTip();

        skillButton.onmouseover = function(){
            skillTip.style.display = "block";
        }
        skillButton.onmouseout = function(){
            skillTip.style.display = "none";
        }

        const skillWrapper = document.createElement("div");
        skillWrapper.classList.add("skill-wrapper");
        skillWrapper.append(skillButton);
        skillWrapper.append(skillTip);
        return skillWrapper;
    }

    temporaryHideSkills(playerSoul: PlayerSoul) {
        const skillContainer = document.getElementById("skillContainer");
        skillContainer?.remove();

        const timeout = setTimeout(() => {
            this.renderSkills(playerSoul);
        }, DURATIONS.BETWEENBLOCKS * 2);
        this.timeouts.push(timeout);
    }

    endBattle() {
        document.getElementById("endScreen")?.classList.remove("hidden");
    }

    /*
    clearAll() {
        this.timeouts.forEach((t) => {
            clearTimeout(t);
        });
    }
    */
}

export {
    MessageRenderer
};