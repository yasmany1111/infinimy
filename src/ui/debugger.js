import { registerUpdate20 } from "../states/update";
import { playerShip, gameReference } from "../states/create";
import { CurrentSector } from "../sectors/manager";
import { getGameReference, Game } from "../main";

export function generateTopDebugger() {
    var debugDisplay = $("<div></div>")
        .attr("id", "debugDisplay")
        .appendTo($("#root"))
        .css({
            "display":"none",
            "z-index": 5,
            "color": "white",
            "position": "absolute",
            "top": "0px",
            "right": "0px",
            "background": " rgba(0, 0, 0, 0.5)",
            "padding": "5px"
        }).html(`
            <span style="color: lime" id="debug_PlayerX"></span>x, <span style="color: lime" id="debug_PlayerY"></span>y
            <br>
            <span style="color: purple" id="debug_PlayerSectorX"></span>x, <span style="color: purple" id="debug_PlayerSectorY"></span>y
            &nbsp;&nbsp;<span style="color: #de26de" id="debug_PlayerSectorName"></span>
            <br>
            <span style="color: lime" id="debug_PointerX"></span>x, <span style="color: lime" id="debug_PointerY"></span>y
            <br>
            <span style="color: lime" id="debug_free1"></span><span id="debug_free1_type"></span>
            <br>
            <span style="color: lime" id="debug_free2"></span><span id="debug_free2_type"></span>
        `);;
    window.i_debug = {};
    window.i_debug.inertiaToggle = function () {
        playerShip.toggleInertiaDampeners();
    }
    window.i_debug.logGame = function () {
        console.log(getGameReference());
        console.log(gameReference);
    }
    window.i_debug.logPlayer = function () {
        console.log(playerShip);
    }

    registerUpdate20(function (Game) {
        return;
        var playerX = parseInt(playerShip.Sprite.x);
        var playerY = parseInt(playerShip.Sprite.y);
        $("#debug_PlayerX").html(playerX);
        $("#debug_PlayerY").html(playerY);


        $("#debug_PlayerSectorX").html(CurrentSector.x);
        $("#debug_PlayerSectorY").html(CurrentSector.y);
        $("#debug_PlayerSectorName").html(CurrentSector.name);
    });
    gameReference.input.on('pointermove', function (pointer) {
        return;
        var x = pointer.x;
        var y = pointer.y;

        $("#debug_PointerX").html(x);
        $("#debug_PointerY").html(y);
    }, this);
}