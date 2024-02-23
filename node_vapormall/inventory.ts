import { Item, ITEMS } from "./data/item";

class ItemKey {
    item: Item;
    count: number;

    constructor(property: Item, count: number) {
        this.item = property;
        this.count = count;
    }
}

class Inventory {
    private _keys: Array<ItemKey>;
    public get Keys() {
        return this._keys;
    }

    constructor() {
        this._keys = [
            new ItemKey(ITEMS.repair_module, 1),
            new ItemKey(ITEMS.advanced_repair_module, 1),
            new ItemKey(ITEMS.full_repair_module, 1),
        ];
    }

    addItem(newItem: Item): void {
        for (const i of this._keys) {
            if (i.item === newItem) {
                i.count++;
                return;
            }
        }

        this._keys.push(new ItemKey(newItem, 1));
    }

    // boolean is whether there is an item left or not
    removeItem(usedItem: Item): boolean {
        for (let i = 0; i < this.Keys.length; i++) {
            const key = this.Keys[i];

            if (key.item === usedItem) {
                if (key.count > 1) {
                    key.count--;
                    return true;
                } else if (key.count === 1) {
                    this._keys.splice(i, 1);
                    return false;
                }

                console.error("Inventory has 0 or less of an item!");
                return false;
            }
        }

        console.error("Removing item that inventory does not have!");
        return false;
    }

    hasItem(item: Item): boolean {
        return this._keys.some((i) => (i.item = item));
    }
}

export { Inventory, ItemKey };
