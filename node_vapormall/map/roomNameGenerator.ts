import { randItem, capitalizeAllWords } from "../utility";
import { Room } from "./room";

interface RoomNoun {
    word: string;
    descriptions: Array<string>;
}

class RoomInfo {
    name: string;
    description: string;

    constructor() {
        const clothing: Array<RoomNoun> = [
            {word: "dress", descriptions: [
                "Velvet sundresses sway in the digital breeze.",
                "Pleated skirts and petticoats. Perfume seeps into simulated nasal ducts."
            ]},
            {word: "suit", descriptions: [
                "Double-breasted. Rows of gleaming silver buttons untarnished by time.",
                "Pinstripe black and white. Urbane flair."
            ]}
        ]

        const places = [
            "lounge", "suite", "court", "plaza", "aisle", "outlet", "store", "boutique"
        ]

        const randNoun = randItem(clothing);
        this.description = randItem(randNoun.descriptions);
        this.name = randNoun.word + " " + randItem(places);

        this.name = this.addNumber(this.name);
        this.name = this.format(this.name);
    }

    // add number in front xor back of name with x chance, returns new name
    addNumber(name: string): string {
        if (Math.random() < 0.1) {

            const randNum = Math.floor(Math.random() * 1000);

            if (Math.random() < 0.5) {
                return randNum + " " + name;
            }
            return name + " " + randNum;
        }
        return name;
    }

    format(name: string): string {
        return capitalizeAllWords(name);
    }
}

export {
    RoomInfo
};
