import { PlayerSoul } from "./battleSoul";
import { capitalizeFirstLetter } from "../utility";

enum DURATIONS {
    BETWEENBLOCKS = 3100,
    BETWEENLINES = 750,
}

class MessageRenderer {
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

        this.messageContainer = messageContainer;
        this.blocks = 0;
        this.timeouts = [];

        this.skillHandlerCreator = skillHandlerCreator;
    }

    enqueueBlock(messages: Array<string|Function>) {
        console.log("block enqueued");
        console.log(messages);
        console.log(this.blocks);

        const displayDelay = this.blocks * DURATIONS.BETWEENBLOCKS;

        const timeout = setTimeout(() => {
            this.displayBlock(messages);
        }, displayDelay);
        this.timeouts.push(timeout);

        this.blocks++;
    }

    displayBlock(messages: Array<string|Function>) {
        console.log("block displaying...");
        console.log(messages);
        console.log(this.blocks);

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

        const skillDiv = document.createElement("div");
        skillDiv.id = "skillDiv";

        playerSoul.soul.skills.forEach((skill, i) => {
            const skillButton = skill.renderSkillButton();

            const style_class = "skill-" + skill.data.type;
            skillButton.classList.add(style_class);

            if (skill.pp > 0) {
                skillButton.addEventListener("click",
                    this.skillHandlerCreator(playerSoul, i),
                    false);
            }
            else {
                skillButton.classList.add("noClick");
            }

            skillDiv?.append(skillButton);
        });
        document.getElementById("bottomhalf")?.append(skillDiv);
    }

    temporaryHideSkills(playerSoul: PlayerSoul) {
        const skillDiv = document.getElementById("skillDiv");
        skillDiv?.remove();

        const timeout = setTimeout(() => {
            this.renderSkills(playerSoul);
        }, DURATIONS.BETWEENBLOCKS * 2);
        this.timeouts.push(timeout);
    }

    endBattle() {
        document.getElementById("endScreen")?.classList.remove("hidden");
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