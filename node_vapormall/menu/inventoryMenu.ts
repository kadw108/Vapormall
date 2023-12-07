import { GameState } from "../gameState";
import { PlayerSoul } from "../soul/individualSoul";
import { CONSTANTS } from "../data/constants";
import { Manager } from "../manager";
import { RenderSoul } from "../soul/renderSoul";
import { Inventory, ItemKey } from "../inventory";

class InventoryMenu {
    constructor() {
        this.fillInventoryDiv();

        Manager.menuButton("inventoryButton", "inventory", "Inventory");
        const button = document.getElementById("inventoryButton");
        button?.addEventListener("click", () => {
            /*
            document.querySelectorAll(".detailedPartySoulDiv").forEach(div => {
                div.classList.add("hidden");
            });
            */
        });
    }

    fillInventoryDiv() {
        GameState.Inventory.Keys.forEach(key => {
            const infoDiv = this.itemDiv(key);
            const inventoryDiv = document.getElementById("inventory");
            inventoryDiv?.append(infoDiv);

            infoDiv.addEventListener("mouseenter", () => {
                const detailedInfoDiv = this.itemInfoDiv(key);
                const topHalf = document.getElementById("topHalf");
                topHalf?.append(detailedInfoDiv);
            });
            infoDiv.addEventListener("mouseleave", () => {
                const detailedInfoDiv = document.getElementById("itemInfoDiv");
                detailedInfoDiv?.remove();
            });

            /*
            const detailedInfoDiv = this.detailedPartySoulDiv(playerSoul);
            const topHalf = document.getElementById("topHalf");
            topHalf?.append(detailedInfoDiv);

            infoDiv.addEventListener("click", () => {
                if (detailedInfoDiv.classList.contains("hidden")) {
                    document.querySelectorAll(".detailedPartySoulDiv").forEach(div => {
                        div.classList.add("hidden");
                    })
                    detailedInfoDiv.classList.remove("hidden");
                }
                else {
                    detailedInfoDiv.classList.add("hidden");
                }
            });
            */
        });
    }

    itemDiv(itemKey: ItemKey) {
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("itemKeyDiv");

        const countText = document.createElement("small");
        countText.classList.add("countText");
        countText.innerText = "x" + itemKey.count;

        infoDiv.append(
            itemKey.item.name,
            countText
        );

        return infoDiv;
    }

    itemInfoDiv(itemKey: ItemKey) {
        const infoDiv = document.createElement("div");
        infoDiv.id = "itemInfoDiv";
        infoDiv.classList.add("menuPanel", "absoluteAlign");

        const name = document.createElement("h4");
        name.innerText = itemKey.item.long_name;

        const description = document.createElement("p");
        description.innerText = itemKey.item.description;

        infoDiv.append(
            name,
            description
        );

        return infoDiv;
    }
}

export {
    InventoryMenu
};