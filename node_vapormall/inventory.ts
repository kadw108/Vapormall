import { Item, HEALING_ITEMS } from "./data/item";

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
            new ItemKey(HEALING_ITEMS.repair_module, 1),
            new ItemKey(HEALING_ITEMS.advanced_repair_module, 1),
            new ItemKey(HEALING_ITEMS.full_repair_module, 1),
        ];
    }

    addItem(newItem: Item) {
        this._keys.forEach(i => {
            if (i.item === newItem) {
                i.count++;
                return;
            }
        });

        this._keys.push(new ItemKey(newItem, 1));
    }

    removeItem(usedItem: Item) {
        this._keys.forEach((key, index) => {
            if (key.item === usedItem) {
                if (key.count > 1) {
                    key.count--;
                    return;
                }
                else if (key.count === 1) {
                    this._keys.splice(index, 1);
                    return;
                }
                else {
                    console.error("Inventory has 0 or less of an item!");
                    return;
                }
            }
        });

        console.error("Removing item that inventory does not have!");
    }
}

export {
    Inventory, ItemKey
};