import { playerShip } from "../states/create";
import { uiDimensions } from "../generalVariables";

export function generateVirtualJoystick() {

    var joystick = yy.yengine.ui.VirtualJoystick({
        parent: $("body"),
        zIndex: 15,
        height: uiDimensions.map.height + 3,
        width: uiDimensions.map.width + 3,
        onMove: function (evt, data) {
            if (data.direction !== undefined) {
                playerShip.desiredAngle = data.yRad;

                if (Math.abs(playerShip.desiredAngle - playerShip.Sprite.rotation) <= 0.5) {
                    playerShip.wantAccelerate = true;
                } else {
                    playerShip.wantAccelerate = false;
                }
            }
        },
        onEnd: function () {
            playerShip.wantAccelerate = false;
            playerShip.desiredAngle = false;
        }
    });
}