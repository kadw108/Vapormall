import { GameState } from "../gameState";
import { ItemKey } from "../inventory";
import { Manager } from "../manager";
import { PlayerSoul } from "../soul/individualSoul";
import { InventoryMenuAbstract } from "./inventoryMenuAbstract";

class InventoryMenu extends InventoryMenuAbstract {

    constructor() {
        super();

        this.refreshMenu();

        Manager.menuButton("inventoryButton", "inventory", "Inventory");
        const button = document.getElementById("inventoryButton");
        button?.addEventListener("click", () => {
            this.clearSelection();
        });

        this.selected = null;
    }

    override createUseItemHandler(playerSoul: PlayerSoul, itemKey: ItemKey): EventListenerOrEventListenerObject {
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
    };
}

export {
    InventoryMenu
};