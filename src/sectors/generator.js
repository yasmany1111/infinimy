import { getRandomSectorName } from "../data/sectorName";
import { Minerals } from "../classes/items/Minerals";

var demoSector = { // stored in [x][y]
    x: 0,
    y: 0,
    name: "pandora 1 xxxxxxxxx",
    staticAsteroids: []
};


export function generateNewSector(options) {

    var sectorObject = {
        name: options.name || getRandomSectorName(),
        x: options.x,
        y: options.y
    };
    sectorObject.staticAsteroids = generateAsteroids(sectorObject);
    sectorObject.staticPlanets = generatePlanets(sectorObject);

    return sectorObject;
}

function generateAsteroids(sectorObject) {
    var numberOfAttempts = yy.random.int(0, 100);
    var startPos = 0;
    var endPos = 1024 * 6 - 700;

    var resultObjectCont = [];
    var asteroidDemo = {
        x: 0,
        y: 0,
        width: 500,
        height: 700,
        sceneReference: undefined
    }
    for (var i = 0; i < numberOfAttempts; i++) {
        var posX = yy.random.int(startPos, endPos);
        var posY = yy.random.int(startPos, endPos);
        var aspect = yy.random.int(1, 10) / 10;
        var width = 500 * (aspect);
        var height = 700 * (aspect);
        var textureNumber = yy.random.int(0, 7);

        var minerals = [];

        for (var c = 0; c < Minerals.length; c++) {
            var cMineral = Minerals[c];
            if (yy.random.chance(cMineral.rarity, 1000)) {
                minerals.push({
                    mineral: cMineral,
                    amount: yy.random.int(1, 500)
                });
            }
        }

        var obj = {
            x: posX,
            y: posY,
            width: width,
            height: height,
            texture: "body_asteroid_" + textureNumber,
            "type": "asteroid",
            "minerals": minerals
        };
        if (checkCollision(obj, resultObjectCont) === false) {
            resultObjectCont.push(obj);
        }
    }

    return resultObjectCont;
}

function generatePlanets(sectorObject) {
    var numberOfAttempts = yy.random.int(0, 5);
    var startPos = 0;
    var endPos = 1024 * 6 - 300;

    //

    var resultObjectCont = [];
    var planetDemo = {
        x: 0,
        y: 0,
        width: 150,
        height: 150,
        sceneReference: undefined
    }
    for (var i = 0; i < numberOfAttempts; i++) {

        var newPlanet = createPlanet({
            x: yy.random.int(startPos, endPos),
            y: yy.random.int(startPos, endPos),
            aspect: yy.random.int(5, 20) / 10,
            width: 150,
            height: 150,
            texture: "body_planet_" + yy.random.int(0, 9),
            hasStation: yy.random.chance(100)
        });

        if (checkCollision(newPlanet, resultObjectCont) === false) {
            if (checkCollision(newPlanet, sectorObject.staticAsteroids) === false) {
                resultObjectCont.push(newPlanet);
            }
        }
    }

    return resultObjectCont;
}
function checkCollision(currentObject, currentArray) {
    var collides = false;

    var objX = currentObject.x;
    var objY = currentObject.y;

    var objWidth = currentObject.width;
    var objHeight = currentObject.height;





    for (var i = 0; i < currentArray.length; i++) {
        if (Phaser.Geom.Intersects.RectangleToRectangle(
            new Phaser.Geom.Rectangle(objX, objY, objWidth, objHeight),
            new Phaser.Geom.Rectangle(currentArray[i].x, currentArray[i].y, currentArray[i].width, currentArray[i].height)
        )) {
            collides = true;
        }
    }

    return collides;
}


function createPlanet(options) {
    var obj = {
        "type": "planet",
        hasStation: options.hasStation,
        //
        x: options.x || 0,
        y: options.y || 0,
        width: options.width * options.aspect || 150,
        height: options.height * options.aspect || 150,
        texture: options.texture || "body_planet_0"
    };

    if (options.hasStation) {
        var newStation = {
            x: obj.x,
            y: obj.y - 230,
            texture: "station_red_0"
        };
        obj.station = newStation;
    }

    return obj;
}