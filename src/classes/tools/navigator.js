export function Navigator(Game, options) {
    var returnNavigator = {
        active: false
    };
    var lastPointer = { x: 0, y: 0 };
    var playerShip = options.playerShip;
    Game.input.on('pointermove', function (pointer) {
        lastPointer = pointer;
    }, this);

    returnNavigator.update = function () {
        var angle = Phaser.Math.Angle.Between(playerShip.Sprite.x, playerShip.Sprite.y,
            lastPointer.x + Game.cameras.main.scrollX, lastPointer.y + Game.cameras.main.scrollY);
        playerShip.desiredAngle = angle;
        if (playerShip.desiredAngle === playerShip.Sprite.rotation) {
            playerShip.desiredAngle = false;
        }

    }


    returnNavigator.setActive = function (state) {
        returnNavigator.active = state;
    }
    returnNavigator.onMove = function () { };
    return returnNavigator;
}