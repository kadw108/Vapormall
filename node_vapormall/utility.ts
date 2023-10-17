export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function popIndex(array: Array<any>, index: number): any {
    return array.splice(index, 1)[0];
}

export function randIndex(array: Array<any>): number {
    return Math.floor(Math.random() * array.length);
}

export function randItem(array: Array<any>): any {
    return array[randIndex(array)];
}

export function capitalizeAllWords(string: string) {
    return string
        .split(" ")
        .map((x) => {return capitalizeFirstLetter(x)})
        .join(" ");
}

export function randomInterval(length: number) {
    const start = Math.floor(Math.random() * length);
    const array = [];

    let i = start;
    for (let j = 0; j < length; j++) {
        array.push(i);
        i = (i + 1) % length;
    }

    return array;
}