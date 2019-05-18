export function EngineModule(options) {
    options = options || {};

    var engineModule = {
        "acceleration": 500,
        "rotation": 0.06,
        "maxSpeed": 1000,
        "maxDrag": 10000,
        getUsed: function () {
            return getCapacityUsed(inventorySystem)
        }
    };


    return engineModule;
}

export function EngineModule2(options) {
    options = options || {};

    var engineModule = {
        "acceleration": 200,
        "rotation": 0.008,
        "maxSpeed": 300,
        "maxDrag": 100,
        getUsed: function () {
            return getCapacityUsed(inventorySystem)
        }
    };


    return engineModule;
}