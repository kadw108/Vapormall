import { Manager } from "../manager";
import { InventoryMenuAbstract } from "../menu/inventoryMenuAbstract";

class BattleItemMenu extends InventoryMenuAbstract {
    constructor() {
        super();

        const itemButton = document.createElement("button");
        itemButton.type = "button";
        itemButton.classList.add("itemMenuButton");
        itemButton.id = "inventoryButton";
        itemButton.innerText = "Inventory";

        const inventory = document.createElement("div");
        inventory.id = "inventory";
        inventory.classList.add("hidden", "menuPanel", "absoluteAlign");

        document.getElementById("bottomContent")?.append(itemButton);
        document.getElementById("battleLog")?.insertAdjacentElement("beforebegin", inventory);

        Manager.menuButton("inventoryButton", "inventory", "Inventory");
        const button = document.getElementById("inventoryButton");
        button?.addEventListener("click", () => {
            this.clearSelection();
        });

        this.selected = null;
        this.refreshMenu();
    }

    addCloseButton() {
        const inventoryDiv = document.getElementById("inventory")!;
        const itemButton = document.createElement("button");
        itemButton.type = "button";
        itemButton.classList.add("inventoryButton");
        itemButton.innerText = "Hide Inventory";
        itemButton.addEventListener("click", () => {
            inventoryDiv.classList.add("hidden");
            document.getElementById("inventoryButton")!.innerText = "Inventory";
            document.getElementById("bottomContent")!.classList.remove("hidden");

            document.querySelectorAll(".menuButton").forEach(element => {
                if (element.id !== "inventoryButton") {
                    element.classList.remove("hidden");
                }
            });
        });
        inventoryDiv.append(itemButton);
    }

    override fillInventoryDiv() {
        super.fillInventoryDiv();
        this.addCloseButton();
    }
}

export {
    BattleItemMenu
};