import { Game } from "../main";
import { gameReference } from "../states/create";
import { generateTouchMenu } from "./touchMenu";

export function registerResize() {
    var timer = {};
    $(window).on("resize", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            executeResizeEvent();
        }, 500);

    });
}


export function executeResizeEvent() {
    Game.resize(window.innerWidth, window.innerHeight);
    Game.renderer.resize(window.innerWidth, window.innerHeight);
    gameReference.cameras.main.setSize(window.innerWidth, window.innerHeight);
    generateTouchMenu();
}


export function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}