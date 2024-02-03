import { GameState } from "../gameState";
import { PlayerSoul } from "../soul/individualSoul";
import { CONSTANTS } from "../data/constants";
import { Manager } from "../manager";
import { RenderSoul } from "../soul/renderSoul";
import { Inventory, ItemKey } from "../inventory";
import { Item } from "../data/item";

class InventoryMenu {

    selected: HTMLDivElement|null;

    constructor() {
        this.refreshMenu();

        Manager.menuButton("inventoryButton", "inventory", "Inventory");
        const button = document.getElementById("inventoryButton");
        button?.addEventListener("click", () => {
            this.clearSelection();
        });

        this.selected = null;
    }

    private refreshMenu() {
        const inventoryDiv = document.getElementById("inventory");
        if (inventoryDiv === null) {
            console.error("Inventory menu is null!");
            return;
        }
        inventoryDiv.innerHTML = "";
        this.fillInventoryDiv();
    }

    private fillInventoryDiv() {
        GameState.Inventory.Keys.forEach(key => {
            const infoDiv = this.itemDiv(key);
            const inventoryDiv = document.getElementById("inventory");
            inventoryDiv?.append(infoDiv);
        });
    }

    private addDetailedInfoDiv(key: ItemKey) {
        const detailedInfoDiv = this.itemInfoDiv(key);
        const topHalf = document.getElementById("topHalf");
        topHalf?.append(detailedInfoDiv);
    }

    private removeDetailedInfoDiv() {
        document.getElementById("itemInfoDiv")?.remove();
    }

    private removeUseMenu() {
        document.getElementById("itemUseMenu")?.remove();
    }

    private clearSelection() {
        this.selected?.classList.remove("selected");
        this.removeDetailedInfoDiv();
        this.removeUseMenu();
    }

    private itemDiv(itemKey: ItemKey) {
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("itemKeyDiv");

        const countText = document.createElement("small");
        countText.classList.add("countText");
        countText.innerText = "x" + itemKey.count;

        infoDiv.append(
            itemKey.item.name,
            countText
        );

        infoDiv.addEventListener("mouseenter", () => {
            if (this.selected === null) {
                this.addDetailedInfoDiv(itemKey);
            }
        });
        infoDiv.addEventListener("mouseleave", () => {
            if (this.selected === null) {
                this.removeDetailedInfoDiv();
            }
        });

        infoDiv.addEventListener("click", () => {
            if (this.selected === infoDiv) {
                this.selected.classList.remove("selected");
                document.getElementById("itemInfoDiv")?.classList.remove("selected");
                this.selected = null;

                this.removeUseMenu();
            }
            else {
                if (this.selected !== null) {
                    this.clearSelection();
                    this.addDetailedInfoDiv(itemKey);
                }

                this.selected = infoDiv;
                this.selected.classList.add("selected");
                document.getElementById("itemInfoDiv")?.classList.add("selected");

                const useMenu = this.useMenu(itemKey);
                const topHalf = document.getElementById("topHalf");
                topHalf?.append(useMenu);
            }
        });

        return infoDiv;
    }

    private itemInfoDiv(itemKey: ItemKey) {
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

    private makeUseButton(
        playerSoul: PlayerSoul,
        itemKey: ItemKey,
    ){
        const useButton = RenderSoul.getSwitchContainer(playerSoul);

        if (itemKey.item.soulCanUse(playerSoul)) {
            useButton.addEventListener("click",
                (event) => {
                    itemKey.item.itemEffect(playerSoul);
                    const itemRemains = GameState.Inventory.removeItem(itemKey.item);
                    if (!itemRemains) {
                        this.clearSelection();
                    }

                    this.refreshMenu();
                },
                false);
        }
        else {
            // useButton.classList.add("noClick");
        }

        return useButton;
    }

    private useMenu(itemKey: ItemKey) {
        const useMenu = document.createElement("div");
        useMenu.id = "itemUseMenu";
        useMenu.classList.add("menuPanel", "absoluteAlign", "selected");

        const name = document.createElement("h4");
        name.innerText = "Use " + itemKey.item.long_name;

        const useButtonContainer = document.createElement("div");
        useButtonContainer.id = "useButtonContainer";

        GameState.partySouls.forEach((playerSoul, i) => {
            const useButton = this.makeUseButton(playerSoul, itemKey);
            useButtonContainer.append(useButton);
        });

        useMenu.append(
            name,
            useButtonContainer
        );

        return useMenu;
    }
}

export {
    InventoryMenu
};