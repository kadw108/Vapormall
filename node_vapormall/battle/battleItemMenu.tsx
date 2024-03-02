import { ItemKey } from "../inventory";
import { Manager } from "../manager";
import { InventoryMenuAbstract } from "../menu/inventoryMenuAbstract";
import { PlayerSoul } from "../soul/individualSoul";
import { UseItem } from "./action";
import { FieldedPlayerSoul } from "./sim/battleSoul";

import { h } from "dom-chef";

class BattleItemMenu extends InventoryMenuAbstract {
    playerSoul: FieldedPlayerSoul;
    createActionHandler: Function;

    constructor(playerSoul: FieldedPlayerSoul, createActionHandler: Function) {
        super();

        const itemButton = (
            <button
                type="button"
                id="inventoryButton"
                className="itemMenuButton"
            >
                Inventory
            </button>
        );
        itemButton.addEventListener("click", () => {
            this.clearSelection();
        });
        const inventory = (
            <div id="inventory" className="hidden menuPanel absoluteAlign" />
        );

        document.getElementById("bottomContent")?.append(itemButton);
        document
            .getElementById("battleLog")
            ?.insertAdjacentElement("beforebegin", inventory);
        Manager.menuButton("inventoryButton", "inventory", "Inventory");

        this.playerSoul = playerSoul;
        this.createActionHandler = createActionHandler;
        this.selected = null;
        this.refreshMenu();
    }

    private addCloseButton() {
        const inventoryDiv = document.getElementById("inventory")!;
        const itemButton = (
            <button type="button" className="inventoryButton">
                Hide Inventory
            </button>
        );
        itemButton.addEventListener("click", () => {
            this.closeMenu();
        });
        inventoryDiv.append(itemButton);
    }

    private closeMenu() {
        const inventoryDiv = document.getElementById("inventory")!;
        inventoryDiv.classList.add("hidden");
        document.getElementById("inventoryButton")!.innerText = "Inventory";
        document
            .getElementById("bottomContent")!
            .classList.remove("hidden");

        document.querySelectorAll(".menuButton").forEach((element) => {
            if (element.id !== "inventoryButton") {
                element.classList.remove("hidden");
            }
        });
    }

    override fillInventoryDiv() {
        super.fillInventoryDiv();
        this.addCloseButton();
    }

    override createUseItemHandler(
        playerSoul: PlayerSoul,
        itemKey: ItemKey
    ): EventListenerOrEventListenerObject {
        const handler = (event: Event) => {
            const action = new UseItem(
                this.playerSoul.index,
                itemKey.item,
                playerSoul
            );
            const test = this.createActionHandler(action);
            console.log(test);

            this.closeMenu();
            test();
        };
        return handler;
    }
}

export { BattleItemMenu };
