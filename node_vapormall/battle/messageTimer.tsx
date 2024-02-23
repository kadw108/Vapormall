import { capitalizeFirstLetter } from "../utility";
import { h } from "dom-chef";

enum DURATIONS {
    BETWEENBLOCKS = 3100,
    BETWEENLINES = 750,
}

class MessageTimer {
    private static readonly ENDBLOCK_STRING: string = "ENDBLOCK";

    private messages: Array<string | Function>;
    private blocks: number;
    private timeouts: Array<NodeJS.Timeout>;

    private messageContainer: HTMLElement;
    private battleLog: HTMLElement;

    constructor() {
        this.messages = [];

        this.messageContainer = document.getElementById("messageContainer")!;
        this.blocks = 0;
        this.timeouts = [];

        this.battleLog = document.getElementById("battleLog")!;
        this.battleLog.innerHTML = "<p>BATTLE LOG</p>";
    }

    private enqueueBlock(messages: Array<string | Function>) {
        const displayDelay = this.blocks * DURATIONS.BETWEENBLOCKS;

        const timeout = setTimeout(() => {
            this.displayBlock(messages);
        }, displayDelay);
        this.timeouts.push(timeout);

        this.blocks++;
    }

    private getHTMLFromMessage(message: string, small: boolean): HTMLElement {
        const html = (
            <span>
                {capitalizeFirstLetter(message)}
                <br />
            </span>
        );

        if (small) {
            html.style.setProperty("font-size", "90%");
        } else {
            html.style.setProperty("font-weight", "bold");
        }

        return html;
    }

    private displayBlock(messages: Array<string | Function>) {
        let displayDiv = false;

        const messageDiv = <div className="message topMessage blackBg" />;
        const logDiv = <div className="message bottomMessage" />;

        let stringNum = 0;
        messages.forEach((item, i) => {
            const delay = stringNum * DURATIONS.BETWEENLINES;

            if (typeof item === "string") {
                displayDiv = true;

                let messageHTML: HTMLElement;
                if (i === 0) {
                    messageHTML = this.getHTMLFromMessage(item, false);
                } else {
                    messageHTML = this.getHTMLFromMessage(item, true);
                }

                const timeout = setTimeout(() => {
                    messageDiv.append(messageHTML);
                    logDiv.append(messageHTML.cloneNode(true));
                }, delay);
                this.timeouts.push(timeout);

                stringNum++;
            } else {
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

    addMessage(message: string | Function) {
        this.messages.push(message);
    }

    endMessageBlock() {
        this.messages.push(MessageTimer.ENDBLOCK_STRING);
    }

    removeLastMessage() {
        console.log(this.messages);
        console.log(this.timeouts);
        console.log(this.messages.length, this.timeouts.length);
        // clearTimeout(this.timeouts.pop());
        this.messages.pop();
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
        this.enqueueBlock(
            this.messages.slice(startIndex, this.messages.length)
        );

        this.messages = [];
    }

    addTurnToLog(turnCount: number) {
        this.battleLog.append(<h4>TURN {turnCount}</h4>);
    }

    clearAll() {
        this.timeouts.forEach((t) => {
            clearTimeout(t);
        });
        this.timeouts = [];
        this.blocks = 0;
        this.messages = [];
    }

    printMessages() {
        console.log(this.messages);
    }
}

export { MessageTimer };
