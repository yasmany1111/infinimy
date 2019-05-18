export function InventoryModule(options) {
    options = options || {};

    var inventorySystem = {
        items: [],
        capacity: options.capacity || 500,
        getUsed: function () {
            return getCapacityUsed(inventorySystem)
        }
    };
    inventorySystem.addItem = function (name, amount, mass, force) {
        addItem(inventorySystem, name, amount, mass, force);
    }
    inventorySystem.getItem = function (name) {
        return findItemStack(inventorySystem, name);
    }
    return inventorySystem;
}

function getCapacityUsed(inventory) {
    var capacityUsed = 0;


    for (var i = 0; i < inventory.items.length; i++) {
        capacityUsed += inventory.items[i].mass * inventory.items[i].amount;
    }
    return capacityUsed;
}

function fits(inventory, amount, mass) {
    var capacityUsed = 0;


    for (var i = 0; i < inventory.items.length; i++) {
        capacityUsed += inventory.items[i].mass * inventory.items[i].amount;
    }

    if (capacityUsed + (amount * mass) <= inventory.capacity) {
        return true;
    } else {
        return false;
    }
}

function findItemStack(inventory, name) {
    var ret = undefined;
    for (var i = 0; i < inventory.items.length; i++) {
        if (inventory.items[i].name === name) {
            ret = inventory.items[i];
        }
    }

    return ret;
}

function addItem(inventory, name, amount, mass, force) {
    mass = mass || 1;
    amount = amount || 1;
    force = force || false;
    if (amount > 0) {
        // add
        var stack = findItemStack(inventory, name);
        if (stack === undefined) {
            stack = {
                name: name,
                amount: 0,
                mass: mass || 1
            };
            inventory.items.push(stack);

        }
        if (fits(inventory, amount, mass)) {
            stack.amount += amount;
        } else {
            if (force) {
                stack.amount += amount;
            }
        }

    } else if (amount < 0) {
        // subsrtract
        var stack = findItemStack(inventory, name);

        if (stack === undefined) {
            return false;
        }
        if (stack.amount >= amount) {
            stack.amount += amount;
        } else {
            if (force) {
                stack.amount += amount;
            }
        }
    }

    emptyStackClear(inventory);
}

function emptyStackClear(inventory) {
    var inventoryItems = [];
    for (var i = 0; i < inventory.items.length; i++) {
        if (inventory.items[i].amount > 0) {
            inventoryItems.push(inventory.items[i]);
        }
    }

    inventory.items = inventoryItems;
}