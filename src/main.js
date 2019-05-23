import { preload } from "./states/preload";
import { create } from "./states/create";
import { update } from "./states/update";
import { generateVirtualJoystick } from "./ui/virtualJoystick";
import { loadSectorNames } from "./data/sectorName";
import { registerResize } from "./ui/resizer";
import { generateMapInterface } from "./ui/map";
import { generateManagerMenu } from "./ui/managerMenu";
import { globalPointerUp } from "./ui/interactiveSprites";
import { generateTouchMenu } from "./ui/touchMenu";


export var Game;
var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    parent: "root",
    autoResize: true,
    height: window.innerHeight,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
if (window.location.host === "yasmany1111.github.io") {

    config.physics.arcade.debug = false;
}


var gameRef;

async function loadGameData(callback) {
    await loadSectorNames();

    return "";
}
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
export async function main() {

    $("#root").css("overflow", "hidden");
    $("#root").addClass("no-select");
    $("body").css("overflow", "hidden");
    $("html").css("overflow", "hidden");

    $("body").append(`
        <div id="gameMenuInitiatorContainer" style="z-index:10000;">
            <button id="gameStartButton">Start</button>
        </div>
    `);

    async function startActualGame() {
        Game = new Phaser.Game(config);
        Game.shared = {};
        gameRef = Game;
        // UI
        await loadGameData();
        generateVirtualJoystick();
        generateTouchMenu();
        generateMapInterface();
        generateManagerMenu();
        registerResize();

    }
    $("#gameMenuInitiatorContainer").click(function () {
        try {
            $("#gameMenuInitiatorContainer").remove();
            var audio = new Audio('assets/audio/star_wars.mp3');
            audio.loop = true;
            audio.volume = 0.2;
            audio.play();
            responsiveVoice.speak("The republic has been torn to pieces, whatever is left of it's remains is under a heavy martial law. You, captain hook, as a former colony survey pilot for the governor of Aquilea, has been left out with the Esmerald IV ship. Your task is to find a proper planet for colonization, and aid it so it can grow into a new civilization");

            startActualGame();
        } catch (ex) { alert(ex.message); }

    });




    $("#root").on("mouseup touchend", function () {
        globalPointerUp();
    });


    yy.writeCSS(`
        #gameMenuInitiatorContainer {
            width: 100%;
            height: 100%;
            background: blue;
            position: absolute;
            top: 0;
            left: 0;
        }
    `);
    if (window.location.host !== "yasmany1111.github.io" && yy.device.info().os !== "iOS") {

        startActualGame();
        $("#gameMenuInitiatorContainer").remove();
    }
}

export function getGameReference() {
    return gameRef;
}


