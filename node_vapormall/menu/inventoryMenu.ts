import { GameState } from "../gameState";
import { PlayerSoul } from "../soul/individualSoul";
import { Manager } from "../manager";
import { RenderSoul } from "../soul/renderSoul";
import { ItemKey } from "../inventory";
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
}

export {
    InventoryMenu
};