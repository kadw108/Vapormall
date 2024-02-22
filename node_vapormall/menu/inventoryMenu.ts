import { GameState } from "../gameState";
import { PlayerSoul } from "../soul/individualSoul";
import { Manager } from "../manager";
import { RenderSoul } from "../soul/renderSoul";
import { ItemKey } from "../inventory";

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
        const inventoryDiv = document.getElementById("inventory");
        if (inventoryDiv === null) {
            console.error("Inventory menu is null!");
            return;
        }
        const inventoryGrid = document.createElement("div");
        inventoryGrid.id = "inventoryGrid";
        inventoryDiv.append(inventoryGrid);

        const itemList = document.createElement("div");
        itemList.id = "itemList"
        inventoryGrid.append(itemList);
        GameState.Inventory.Keys.forEach(key => {
            const infoDiv = this.itemDiv(key);
            itemList.append(infoDiv);
        });
        inventoryGrid.append(itemList);
    }

    private addDetailedInfoDiv(key: ItemKey) {
        const detailedInfoDiv = this.itemInfoDiv(key);
        const inventoryGrid = document.getElementById("inventoryGrid");
        inventoryGrid?.append(detailedInfoDiv);
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
        this.selected = null;
    }

    renderItem(itemKey: ItemKey) {
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

    private itemDiv(itemKey: ItemKey) {
        const infoDiv = this.renderItem(itemKey);

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
            }
        });

        return infoDiv;
    }

    private itemInfoDiv(itemKey: ItemKey) {
        const infoDiv = document.createElement("div");
        infoDiv.id = "itemInfoDiv";
        infoDiv.classList.add("menuPanel");

        const name = document.createElement("h6");
        name.innerText = itemKey.item.long_name;

        const description = document.createElement("p");
        description.innerText = itemKey.item.description;

        const useButtonContainer = document.createElement("div");
        useButtonContainer.id = "useButtonContainer";
        GameState.partySouls.forEach((playerSoul, i) => {
            const useButton = this.makeUseButton(playerSoul, itemKey);
            useButtonContainer.append(useButton);
        });

        infoDiv.append(
            name,
            description,
            useButtonContainer
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
            useButton.classList.add("noClick");
        }

        return useButton;
    }
}

export {
    InventoryMenu
};