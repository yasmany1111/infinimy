import { SectorSize, onSectorChange, CurrentSector } from "../sectors/manager";
import { registerUpdate20 } from "../states/update";
import { playerShip } from "../states/create";
import { showManagerMenu, selectTab } from "./managerMenu";
import { uiDimensions } from "../generalVariables";

export var mapState = 1; // 0 not visible, 1 miniTop, 2: full

export function mapIsVisible() {
    return true;
}

export function setMapState(st) {
    mapState = st;
    if (st === 0) {
        $(".gameMapContainer").css({
            "display": "none"
        });
    } else {
        $(".gameMapContainer").css({
            "display": "block"
        });
    }
    if (st === 1) {
        $(".gameMapContainer").css({
            width: "150px",
            "height": "150px"
        });
        aspectW = $(".gameMapContainer").width() / SectorSize;
        aspectH = $(".gameMapContainer").height() / SectorSize;
        updateStaticMap();
        $(".mapInfo").hide();
    } else if (st === 2) {
        $(".mapInfo").show();
        $(".gameMapContainer").css({
            width: "100%",
            "height": "100%"
        });
        aspectW = $(".gameMapContainer").width() / SectorSize;
        aspectH = $(".gameMapContainer").height() / SectorSize;
        updateStaticMap();
    }
}

var aspectW, aspectH, lastSector;


export function generateMapInterface() {
    $("#root").append(`
        <div class="gameMapContainer isLeft">
            <div class="mapObject mapPlayer"></div>
            <div class="mapInfo"></div>
        </div>
    `);


    yy.writeCSS(`
        .gameMapContainer {
            width: ${uiDimensions.map.width}px;
            height: ${uiDimensions.map.height}px;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10;
            position: absolute;
            bottom: 3px;
            display: block;
        }
        .gameMapContainer.isLeft {
            left: 3px;
        }
        .gameMapContainer.isRight {
            right: 3px;
        }

        .mapObject {
            position: absolute;
            width: 5px;
            height: 5px;
        }
        .staticMapObject {
            background: gray;
        }
        .mapPlayer {
            background: red;
            z-index: 10;
        }
        .mapInfo {
            position: absolute;
            top: 5px;
            left: 5px;
            color: white;
            z-index: 11;
        }
        .mapInfoPos {
            color: lime;
        }
        .sectorNumberInfo {
            color: pink;
        }
        .staticMapObjectPlanet {
            background: blue;
        }
    `);

    $(".gameMapContainer").click(function () {
        
    });
    aspectW = $(".gameMapContainer").width() / SectorSize;
    aspectH = $(".gameMapContainer").height() / SectorSize;

    updateMapContent();
}

function updateStaticMap(sector) {
    sector = sector || lastSector;

    if(sector===undefined){
        return;
    }

    $(".staticMapObject").remove();
    for (var i = 0; i < sector.staticAsteroids.length; i++) {
        var newAsteroid = sector.staticAsteroids[i];
        var asteroidInMap = $("<div></div>");
        asteroidInMap.addClass("mapObject").addClass("staticMapObject");
        asteroidInMap.css({
            top: newAsteroid.y * aspectH,
            left: newAsteroid.x * aspectW,
            width: newAsteroid.width * aspectW,
            height: newAsteroid.height * aspectH,
        });
        $(".gameMapContainer").append(asteroidInMap);
    }

    for (var i = 0; i < sector.staticPlanets.length; i++) {
        var newAsteroid = sector.staticPlanets[i];
        var asteroidInMap = $("<div></div>");
        asteroidInMap.addClass("mapObject").addClass("staticMapObject").addClass("staticMapObjectPlanet");
        asteroidInMap.css({
            top: newAsteroid.y * aspectH,
            left: newAsteroid.x * aspectW,
            width: newAsteroid.width * aspectW,
            height: newAsteroid.height * aspectH,
        });
        $(".gameMapContainer").append(asteroidInMap);
    }
    lastSector = sector;


}

export function updateMapContent() {
    registerUpdate20(function () {
        if (mapState !== 0) {
            $(".mapPlayer").css({
                width: playerShip.Sprite.width * aspectW,
                height: playerShip.Sprite.height * aspectH
            });
            $(".mapPlayer").css({
                left: playerShip.Sprite.x * aspectW,
                top: playerShip.Sprite.y * aspectH
            });

            if (mapState === 2) {
                $(".mapInfo").html(`
                x: <span class="mapInfoPos">${parseInt(playerShip.Sprite.x)}</span>, y: <span class="mapInfoPos">${parseInt(playerShip.Sprite.y)}</span>
                <br>
                <span class="sectorNumberInfo">${CurrentSector.x}</span>, <span class="sectorNumberInfo">${CurrentSector.y}</span>
                `);
            }

        }
    });
    onSectorChange(function (sector) {
        updateStaticMap(sector);
    });
}

export function showMapFullScreen(){
    showManagerMenu(); 
    selectTab(0);
}