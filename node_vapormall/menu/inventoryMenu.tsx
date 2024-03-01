import { Item } from "../data/item";
import { GameState } from "../gameState";
import { ItemKey } from "../inventory";
import { Manager } from "../manager";
import { PlayerSoul } from "../soul/individualSoul";
import { InventoryMenuAbstract } from "./inventoryMenuAbstract";

import { h } from "dom-chef";

class InventoryMenu extends InventoryMenuAbstract {
    constructor() {
        super();

        this.refreshMenu();

        Manager.menuButton("inventoryButton", "inventory", "Inventory");
        const button = document.getElementById("inventoryButton");
        button?.addEventListener("click", () => {
            this.clearSelection();
            document.getElementById("useMessageDiv")?.remove();
        });

        this.selected = null;
    }

    override createUseItemHandler(
        playerSoul: PlayerSoul,
        itemKey: ItemKey
    ): EventListenerOrEventListenerObject {
        const handler = (event: Event) => {
            itemKey.item.itemEffect(playerSoul);
            const itemRemains = GameState.Inventory.removeItem(itemKey.item);
            if (!itemRemains) {
                this.clearSelection();
            }

            this.refreshMenu();

            this.displayUseMessage(playerSoul, itemKey.item);
        };
        return handler;
    }

    displayUseMessage(playerSoul: PlayerSoul, item: Item) {
        const closeButton = (
            <button type="button" className="closeButton">
                X
            </button>
        );

        const useMessage = item.useMessage.replace("[target]", playerSoul.name);
        const useMessageDiv = (
            <div id="useMessageDiv" className="menuPanel absoluteAlign">
                {closeButton}
                <div>{useMessage}</div>
            </div>
        );

        closeButton.addEventListener("click", () => {
            useMessageDiv.remove();
        });

        document.getElementById("useMessageDiv")?.remove();
        document.getElementById("topHalf")?.append(useMessageDiv);
    }
}

export { InventoryMenu };
