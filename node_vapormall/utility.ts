export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function popIndex(array: Array<any>, index: number) {
    return array.splice(index, 1)[0];
}