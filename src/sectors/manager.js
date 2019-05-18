import { registerUpdate20 } from "../states/update";
import { playerShip } from "../states/create";
import { generateNewSector } from "./generator";
import { setSelectedSprite, pointerUp } from "../ui/interactiveSprites";
import { GameSprite } from "../classes/GameSprite";

export /* READONLY */ var CurrentSector = {
    x: 0,
    y: 0 // 6000x6000
};

export var SectorSize = 1024 * 6;

var sectorChangeEvents = [];

var SectorsInMemory = {}; // SectorsInMemory[x][y]

export function registerSectorManager(Game) {
    registerUpdate20(function () {
        var posX = playerShip.Sprite.x;
        var posY = playerShip.Sprite.y;

        // LEFT
        if (posX < 0) {
            // go left, -1

            generateAndLoadSector(CurrentSector.x - 1, CurrentSector.y, Game);
            playerShip.Sprite.x = SectorSize - 100;
        }
        // RIGHT
        if (posX > SectorSize) {
            // go right, +1

            generateAndLoadSector(CurrentSector.x + 1, CurrentSector.y, Game);
            playerShip.Sprite.x = 100;
        }
        // TOP
        if (posY < 0) {
            // go top, +1

            generateAndLoadSector(CurrentSector.x, CurrentSector.y - 1, Game);
            playerShip.Sprite.y = SectorSize - 100;
        }
        // Down
        if (posY > SectorSize) {
            // go bot, -1

            generateAndLoadSector(CurrentSector.x, CurrentSector.y + 1, Game);
            playerShip.Sprite.y = 100;
        }
    });
}

function destroyCurrentSectorData() {
    var cSector = SectorsInMemory[CurrentSector.x][CurrentSector.y];

    for (var i = 0; i < cSector.staticAsteroids.length; i++) {
        var cAsteroid = cSector.staticAsteroids[i];
        if (cAsteroid.sceneReference !== undefined)
            cAsteroid.sceneReference.Sprite.destroy();
    }
    for (var i = 0; i < cSector.staticPlanets.length; i++) {
        var cPlanet = cSector.staticPlanets[i];
        if (cPlanet.sceneReference !== undefined)
            cPlanet.sceneReference.Sprite.destroy();
        if (cPlanet.station !== undefined)
            if (cPlanet.station.sceneReference !== undefined)
                cPlanet.station.sceneReference.Sprite.destroy();
    }
}

function loadSectorData(x, y) {
    destroyCurrentSectorData();

    for (var i = 0; i < SectorsInMemory[x][y].staticAsteroids.length; i++) {
        var nAsteroid = SectorsInMemory[x][y].staticAsteroids[i];
        if (nAsteroid.destroy !== true) {
            var sAsteroid = new GameSprite(this, nAsteroid.x, nAsteroid.y, nAsteroid.texture);
            sAsteroid.Sprite.displayWidth = nAsteroid.width;
            sAsteroid.Sprite.displayHeight = nAsteroid.height;
            sAsteroid.Sprite.setDepth(3);
            sAsteroid.Sprite.setOrigin(0);
            sAsteroid.Sprite.memoryReference = nAsteroid;
            nAsteroid.sceneReference = sAsteroid;

            sAsteroid.onPointerDown(function (Sprite) {
                setSelectedSprite(Sprite);
            });
            sAsteroid.onPointerUp(function (Sprite) {
                pointerUp(Sprite);
            });
        }
        //this.physics.add.overlap(playerShip.Sprite, sAsteroid.Sprite, function () {
        // console.log("touching bitches");
        //});
    }
    for (var i = 0; i < SectorsInMemory[x][y].staticPlanets.length; i++) {
        var nPlanet = SectorsInMemory[x][y].staticPlanets[i];
        if (nPlanet.destroy !== true) {
            var spritePlanet = new GameSprite(this, nPlanet.x, nPlanet.y, nPlanet.texture);
            spritePlanet.Sprite.displayWidth = nPlanet.width;
            spritePlanet.Sprite.displayHeight = nPlanet.height;
            spritePlanet.Sprite.setDepth(3);
            spritePlanet.Sprite.setOrigin(0);
            spritePlanet.Sprite.memoryReference = nPlanet;
            nPlanet.sceneReference = spritePlanet;

            spritePlanet.onPointerDown(function (Sprite) {
                setSelectedSprite(Sprite);
            });
            spritePlanet.onPointerUp(function (Sprite) {
                pointerUp(Sprite);
            });

            if (nPlanet.hasStation) {
                var spriteStation = new GameSprite(this, nPlanet.station.x, nPlanet.station.y, nPlanet.station.texture);
                spriteStation.Sprite.displayWidth = nPlanet.width / 2;
                spriteStation.Sprite.displayHeight = nPlanet.height / 2;
                spriteStation.Sprite.setDepth(3);
                spriteStation.Sprite.setOrigin(0);
                spriteStation.Sprite.x = nPlanet.x + (nPlanet.width / 2 / 2);
                spriteStation.Sprite.y = nPlanet.y - (nPlanet.height / 2);
                nPlanet.station.sceneReference = spriteStation;
            }
        }
        //this.physics.add.overlap(playerShip.Sprite, sAsteroid.Sprite, function () {
        // console.log("touching bitches");
        //});
    }
}

export function generateAndLoadSector(x, y, Game) {
    if (SectorsInMemory[x] === undefined) {
        SectorsInMemory[x] = {};
    }
    if (SectorsInMemory[x][y] === undefined) {
        SectorsInMemory[x][y] = generateNewSector({
            x: x,
            y: y
        });
    }

    loadSectorData.apply(Game, [x, y]);
    CurrentSector = SectorsInMemory[x][y];
    for (var i = 0; i < sectorChangeEvents.length; i++) {
        sectorChangeEvents[i].apply(Game, [CurrentSector]);
    }
}

export function onSectorChange(newFn) {
    sectorChangeEvents.push(newFn);
}

export function getCurrentSector() {
    return SectorsInMemory[CurrentSector.x][CurrentSector.y];
}