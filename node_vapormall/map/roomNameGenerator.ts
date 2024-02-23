import { capitalizeAllWords } from "../utility";

class RoomGen {
    // add number in front xor back of name with x chance, returns new name
    static addNumber(name: string): string {
        if (Math.random() < 0.1) {

            const randNum = Math.floor(Math.random() * 1000);

            if (Math.random() < 0.5) {
                return randNum + " " + name;
            }
            return name + " " + randNum;
        }
        return name;
    }

    static format(name: string): string {
        return capitalizeAllWords(name);
    }
}

export {
    RoomGen
};
