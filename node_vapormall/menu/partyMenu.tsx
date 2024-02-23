import { GameState } from "../gameState";
import { PlayerSoul } from "../soul/individualSoul";
import { CONSTANTS } from "../data/constants";
import { Manager } from "../manager";
import { RenderSoul } from "../soul/renderSoul";

import {h} from "dom-chef";

class PartyMenu {
    constructor() {
        this.refresh();

        Manager.menuButton("partyButton", "party", "Party");
        const partyButton = document.getElementById("partyButton");
        partyButton?.addEventListener("click", () => {
            document.querySelectorAll(".detailedPartySoulDiv").forEach(div => {
                div.classList.add("hidden");
            });
            document.querySelectorAll(".selected").forEach((element) => {
                element.classList.remove("selected");
            })
        });
    }

    private PartySoulDiv(props: {soul: PlayerSoul}) {
        return <div className="partySoulDiv">
            <RenderSoul.getNameAndLevel soul={props.soul}/>
            {RenderSoul.getHPText(props.soul)}
        </div>
    }

    private DetailedPartySoulDiv(props: {soul: PlayerSoul}) {
        console.log("????", props);

        const typeContainer = <RenderSoul.genTypeContainer soul={props.soul}/>;
        typeContainer.style.marginLeft = "10px";

        return (
            <div className = "menuPanel hidden absoluteAlign detailedPartySoulDiv">
                <RenderSoul.getNameAndLevel soul={props.soul}/>
                {typeContainer}

                <hr style={{color: "#4ad", margin: "5px 0 10px 0"}}/>

                <div className="partyStatContainer partyContainer">
                    {Object.keys(props.soul.stats).map((key) => {
                        const keyType = key as unknown as CONSTANTS.STATS;
                        if (key != "HP") {
                            return <div>{key} {props.soul.stats[keyType]}</div>;
                        }
                        else {
                            return <div>{RenderSoul.getHPText(props.soul)}</div>;
                        }
                    })}
                </div>

                <div className="partySkillContainer partyContainer">
                    {props.soul.skills.map((skill) => {
                        return <skill.SkillContainer/>
                    })}
                </div>
            </div>
        );
    }

    private refresh() {
        const partyDiv = document.getElementById("party");
        if (partyDiv === null) {
            console.error("Party div is null!");
            return;
        }
        partyDiv.innerHTML = "";
        this.fillPartyDiv();
    }

    private fillPartyDiv() {
        console.log(PlayerSoul);

        GameState.partySouls.forEach(playerSoul => {
            /*
            const infoDiv = <this.PartySoulDiv soul={playerSoul}/>;
            document.getElementById("party")?.append(infoDiv);
            */
            const infoDiv = <div/>;

            const detailedInfoDiv = <this.DetailedPartySoulDiv soul={{playerSoul}}/>;
            document.getElementById("topHalf")?.append(detailedInfoDiv);

            infoDiv.addEventListener("click", () => {
                if (detailedInfoDiv.classList.contains("hidden")) {
                    document.querySelectorAll(".detailedPartySoulDiv").forEach(div => {
                        div.classList.add("hidden");
                    });
                    document.querySelector(".selected")?.classList.remove("selected");

                    detailedInfoDiv.classList.remove("hidden");
                    infoDiv.classList.add("selected");
                }
                else {
                    detailedInfoDiv.classList.add("hidden");
                    infoDiv.classList.remove("selected");
                }
            });
        });
    }
}

export {
    PartyMenu
};