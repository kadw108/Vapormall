import { capitalizeFirstLetter } from "../utility";

enum DURATIONS {
    BETWEENBLOCKS = 3100,
    BETWEENLINES = 750,
}

class MessageTimer { 
    private static readonly ENDBLOCK_STRING: string = "ENDBLOCK";

    messages: Array<string|Function>;
    blocks: number;
    timeouts: Array<NodeJS.Timeout>;

    messageContainer: HTMLElement;
    battleLog: HTMLElement;

    constructor() {
        this.messages = [];

        this.messageContainer = document.getElementById("messageContainer")!;
        this.blocks = 0;
        this.timeouts = [];

        this.battleLog = document.getElementById("battleLog")!;
        this.battleLog.innerHTML = "<p>BATTLE LOG</p>";
    }

    addMessage(message: string|Function) {
        this.messages.push(message);
    }

    endMessageBlock() {
        this.messages.push(MessageTimer.ENDBLOCK_STRING);
    }

    displayMessages(turnCount: number) {
        this.addTurnToLog(turnCount);

        let startIndex = 0;
        this.messages.forEach((message, i) => {
            if (message === MessageTimer.ENDBLOCK_STRING) {
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

    private getHTMLFromMessage(message: string, small: boolean): HTMLElement {

        const html = document.createElement("span");

        if (small) {
            html.style.setProperty("font-size", "90%");
        }
        else {
            html.style.setProperty("font-weight", "bold");
        }

        html.appendChild(
            document.createTextNode(capitalizeFirstLetter(message))
        );
        html.appendChild(
            document.createElement("br")
        );
        return html;
    }

    addTurnToLog(turnCount: number) {
        const html = document.createElement("h4");
        html.appendChild(
            document.createTextNode("TURN " + turnCount)
        );
        this.battleLog.append(html);
    }

    private displayBlock(messages: Array<string|Function>) {
        let displayDiv = false;

        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", "topMessage", "blackBg");

        const logDiv = document.createElement("div");
        logDiv.classList.add("message", "bottomMessage")

        let stringNum = 0;
        messages.forEach((item, i) => {

            const delay = stringNum * DURATIONS.BETWEENLINES;
            
            if (typeof item === "string") {
                displayDiv = true;

                let messageHTML: HTMLElement;
                if (i === 0) {
                    messageHTML = this.getHTMLFromMessage(item, false);
                }
                else {
                    messageHTML = this.getHTMLFromMessage(item, true);
                }

                const timeout = setTimeout(() => {
                    messageDiv.append(messageHTML);
                    logDiv.append(messageHTML.cloneNode(true));
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

        if (displayDiv) {
            this.messageContainer.append(messageDiv);
            this.battleLog.append(logDiv);
        }
    }

    endBattle() {
        document.getElementById("endScreen")!.classList.remove("hidden");

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
    MessageTimer
};