import { onSectorChange, getCurrentSector } from "../../sectors/manager";

export function MiningLaser(Game, options) {
    var returnLaser = {
        active: false,
        selected: false
    };
    var laserSprite = Game.physics.add.sprite(40, 0, "tool_laser_1");
    var laserPhysiscs = Game.physics.add.sprite(40, 0, "");
    laserSprite.displayWidth = 100;
    laserSprite.displayHeight = 20;
    laserSprite.body.enable = false;
    laserSprite.visible = false;
    laserPhysiscs.visible = false;
    options.toolContainer.add(laserSprite);
    options.toolContainer.add(laserPhysiscs);
    returnLaser.sprite = laserSprite;

    var hitAsteroid = false;

    var miningInerval = 0;
    returnLaser.update = function () {
        if (returnLaser.active) {
            if (hitAsteroid === false) {
                laserPhysiscs.x += 5;
                if (laserPhysiscs.x > 40 + 40) {
                    laserPhysiscs.x = 40;
                }
            } else {
                // active and hitting asteroid...
                miningInerval++;
                if (miningInerval > 30) {
                    console.log(hitAsteroid.classInstance);
                    if (yy.random.chance(50)) {
                        options.ship.Inventory.addItem("iron", 1);
                    }
                    miningInerval = 0;
                }
            }
        }
    }

    function checkIfAsteroidInRange() {

    }

    // real mining should be only por player
    // ai should go to a position where minng is always true (laft top bopt etc)
    // and simulated by timing events
    onSectorChange(function (Game) {
        var cSector = getCurrentSector();
        for (var i = 0; i < cSector.staticAsteroids.length; i++) {
            var asteroid = cSector.staticAsteroids[i];
            this.physics.add.overlap(laserPhysiscs, asteroid.sceneReference.Sprite, function (a, b) {
                hitAsteroid = b;
            });
        }
    });

    returnLaser.setActive = function (state) {
        laserSprite.visible = state;
        returnLaser.active = state;
        if (state) {

        }
    }
    returnLaser.onMove = function () {
        hitAsteroid = false;
    }
    return returnLaser;
}