import { PlayerSoul } from "./battleSoul";

enum DURATIONS {
    BETWEENBLOCKS = 2500,
    BETWEENLINES = 650,
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

    enqueueBlock(messages: Array<string|Function>) {
        const displayDelay = this.blocks * DURATIONS.BETWEENBLOCKS;
        setTimeout(() => {
            this.displayBlock(messages);
        }, displayDelay);

        this.blocks++;
    }

    displayBlock(messages: Array<string|Function>) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", "blackBg");
        this.messageContainer.append(messageDiv);

        let stringNum = 0;
        messages.forEach((item, i) => {

            const delay = stringNum * DURATIONS.BETWEENLINES;
            
            if (typeof item === "string") {
                setTimeout(() => {
                    messageDiv.append(
                        document.createTextNode(item)
                    );
                    messageDiv.append(
                        document.createElement("br")
                    );
                }, delay);

                stringNum++;
            }
            else {
                setTimeout(() => {
                    item();
                }, delay);
            }
        });

        setTimeout(() => {
            messageDiv.remove();
            this.blocks--;
        }, messages.length * DURATIONS.BETWEENLINES - 100);
    }

    renderSkills(playerSoul: PlayerSoul, handlerCreator: Function) {
        const skillButtons: Array<HTMLElement> = [];

        const skillDiv = document.createElement("div");
        skillDiv.id = "skillDiv";

        playerSoul.soul.skills.forEach((skill, i) => {
            const skillButton = skill.renderSkillButton();

            const style_class = "skill-" + skill.data.type;
            skillButton.classList.add(style_class);

            if (skill.pp > 0) {
                skillButton.addEventListener("click",
                    handlerCreator(playerSoul, i),
                    false);
            }
            else {
                skillButton.classList.add("noClick");
            }

            skillDiv?.append(skillButton);
        });
        document.getElementById("bottomhalf")?.append(skillDiv);
    }

    temporaryHideSkills() {
        const skillDiv = document.getElementById("skillDiv");
        skillDiv?.classList.add("hidden");

        setTimeout(() => {
            skillDiv?.classList.remove("hidden");
        }, DURATIONS.BETWEENBLOCKS * 2);
    }
}

export {
    MessageRenderer
};