import { GameState } from "../gameState";
import { ItemKey } from "../inventory";
import { Manager } from "../manager";
import { PlayerSoul } from "../soul/individualSoul";
import { RenderSoul } from "../soul/renderSoul";

class BattleItemMenu {

    selected: HTMLDivElement|null;
    selectedItemKey: ItemKey|null;

    constructor() {
        this.selected = null;
    }

    private clearSelection() {
        this.selected?.classList.remove("selected");
        this.selected = null;
        this.selectedItemKey = null;
    }

    private makeUseButton(
        playerSoul: PlayerSoul
    ){
        const useButton = RenderSoul.getSwitchContainer(playerSoul);
        if (this.selectedItemKey !== null &&
            this.selectedItemKey.item.soulCanUse(playerSoul)) {
                useButton.addEventListener("click",
                    (event) => {
                        if (this.selectedItemKey !== null) {
                            /*
                            this.selectedItemKey.item.itemEffect(playerSoul);
                            const itemRemains = GameState.Inventory.removeItem(itemKey.item);
                            if (!itemRemains) {
                                this.clearSelection();
                            }

                            this.refreshMenu();
                            */
                        }
                    },
                    false
                );
        }
        else {
            // useButton.classList.add("noClick");
        }

        return useButton;
    }

    private renderItems(
        playerParty: Array<PlayerSoul>,
    ){
        const itemButton = document.createElement("button");
        itemButton.type = "button";
        itemButton.classList.add("menuButton");
        itemButton.id = "itemButton";
        itemButton.innerText = "Item Menu";

        const itemContainer = document.createElement("div");
        itemContainer.id = "itemContainer";
        itemContainer.classList.add("hidden", "menuPanel", "absoluteAlign");

        const partyList = document.createElement("div");
        partyList.id = "partyList";
        playerParty.forEach((playerSoul, i) => {
            const useButton = this.makeUseButton(playerSoul);
            partyList.append(useButton);
        });

        const itemList = document.createElement("div");
        itemList.id = "itemList"
        GameState.Inventory.Keys.forEach((itemKey) => {
            const infoDiv = GameState.Inventory.renderItem(itemKey);
            itemList.append(infoDiv);
        });

        document.getElementById("bottomContent")?.append(itemButton);
        document.getElementById("battleLog")?.insertAdjacentElement("beforebegin", itemContainer);

        Manager.menuButton("menuButton", "itemContainer", "Item Menu");
    }
}

export {
    BattleItemMenu
};