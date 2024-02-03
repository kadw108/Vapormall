import { GameState } from "../gameState";
import { Manager } from "../manager";

class MapMenu {
    constructor() {
        this.refresh();

        Manager.menuButton("mapButton", "map", "Map");

        /*
        const mapButton = document.getElementById("mapButton");
        mapButton?.addEventListener("click", () => {
            document.querySelectorAll(".detailedPartySoulDiv").forEach(div => {
                div.classList.add("hidden");
            });
            document.querySelectorAll(".selected").forEach((element) => {
                element.classList.remove("selected");
            })
        });
        */
    }

    refresh() {
        const menu = document.getElementById("div");
        if (menu === null) {
            console.error("Map div is null!");
            return;
        }
        menu.innerHTML = "";
        this.drawMap();
    }

    drawMap() {
    }
}

export {
    MapMenu
};