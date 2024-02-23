import { GameState } from "../gameState";
import { PlayerSoul } from "../soul/individualSoul";
import { RenderSoul } from "../soul/renderSoul";
import { ItemKey } from "../inventory";
import { Item } from "../data/item";

import {h} from "dom-chef";

abstract class InventoryMenuAbstract {

    selected: HTMLElement|null;

    refreshMenu() {
        const inventoryDiv = document.getElementById("inventory");
        if (inventoryDiv === null) {
            console.error("Inventory menu is null!");
            return;
        }
        inventoryDiv.innerHTML = "";
        this.fillInventoryDiv();
    }

    fillInventoryDiv() {
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

    addDetailedInfoDiv(key: ItemKey) {
        const detailedInfoDiv = this.ItemInfoDiv(key);
        const inventoryGrid = document.getElementById("inventoryGrid");
        inventoryGrid?.append(detailedInfoDiv);
    }

    removeDetailedInfoDiv() {
        document.getElementById("itemInfoDiv")?.remove();
    }

    clearSelection() {
        this.selected?.classList.remove("selected");
        this.removeDetailedInfoDiv();
        this.selected = null;
    }

    RenderItem(itemKey: ItemKey) {
        return <div className="itemKeyDiv">
            {itemKey.item.name}
            <small className="countText">x{itemKey.count}</small>
        </div>;
    }

    itemDiv(itemKey: ItemKey) {
        const infoDiv = this.RenderItem(itemKey);

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

    ItemInfoDiv(itemKey: ItemKey) {
        return (
        <div id = "itemInfoDiv" className="menuPanel">
            <h6>{itemKey.item.long_name}</h6>
            <p>{itemKey.item.description}</p>
            <div id="useButtonContainer">
                {GameState.partySouls.map((playerSoul, i) => {
                    return this.makeUseButton(playerSoul, itemKey);
                })}
            </div>
        </div>
        );
    }

    makeUseButton(
        playerSoul: PlayerSoul,
        itemKey: ItemKey,
    ){
        const useButton = RenderSoul.getSwitchContainer(playerSoul);

        if (itemKey.item.soulCanUse(playerSoul)) {
            useButton.addEventListener("click",
                this.createUseItemHandler(playerSoul, itemKey),
                false);
        }
        else {
            useButton.classList.add("noClick");
        }

        return useButton;
    }

    displayUseMessage(
        playerSoul: PlayerSoul,
        item: Item,
    ) {
        const useMessageDiv = document.createElement("div");
        useMessageDiv.id = "useMessageDiv";
        useMessageDiv.classList.add("menuPanel", "absoluteAlign");
        const useMessage = item.useMessage.replace("[target]", playerSoul.name);
        useMessageDiv.innerText = useMessage;

        document.getElementById("topHalf")?.append(useMessageDiv);
    }

    abstract createUseItemHandler(playerSoul: PlayerSoul, itemKey: ItemKey): EventListenerOrEventListenerObject;
}

export {
    InventoryMenuAbstract
};