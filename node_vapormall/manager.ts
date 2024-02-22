import {GameState} from "./gameState";
import {Battle} from "./battle/battle";

class Manager {
    static startBattle(): Battle|null {
        const players = GameState.partySouls;
        const enemy1 = GameState.currentEnemy;

        if (enemy1 === null) {
            console.error("Battle with no enemy!");
            return null;
        }
       
        return new Battle(
            players, [enemy1]
        );
    }

    static menuButton(buttonId: string, menuId: string, menuName: string) {
        const button = document.getElementById(buttonId);
        const menu = document.getElementById(menuId);

        if (button === null) {
            console.error("menuButton running for null button! (id: " + buttonId + ")");
            return;
        }
        if (menu === null) {
            console.error("menuButton running for null menu! (id: " + menuId + ")");
            return;
        }

        console.log(button, menu);

        if (button.getAttribute("listener-added") === "true") {
            return;
        }
        button.addEventListener("click",
            () => {
                if (button.innerText === menuName) {
                    menu.classList.remove("hidden");
                    document.getElementById("bottomContent")!.classList.add("hidden");
                    button.innerText = "Hide " + menuName;

                    // hide all other menuButtons so you can't have 2+ menus open at once
                    document.querySelectorAll(".menuButton").forEach(element => {
                        if (element.id !== buttonId) {
                            element.classList.add("hidden");
                        }
                    });
                }
                else {
                    menu.classList.add("hidden");
                    document.getElementById("bottomContent")!.classList.remove("hidden");
                    button.innerText = menuName;

                    document.querySelectorAll(".menuButton").forEach(element => {
                        if (element.id !== buttonId) {
                            element.classList.remove("hidden");
                        }
                    });
                }
            }
        );
        button.setAttribute("listener-added", "true");
    }
}

export {
    Manager
};