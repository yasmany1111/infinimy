import { playerShip, gameReference } from "../states/create";
import { angleBetweenSprites } from "../api/angle";
import { assistantSpeak } from "../api/assistant";
import { showOverlayOver } from "../api/overlayInfo";

var SelectedSprite = null;
var selectionTimer = undefined;
var selectionDesire = 0;
export function setSelectedSprite(obj) {
    // on down

    SelectedSprite = obj;
    onDown(SelectedSprite);

    selectionDesire = 0;
    selectionTimer = setTimeout(function () {
        // on hold 500ms
        selectionDesire = 1;
    }, 500);
    // SelectedSprite.Sprite.destroy();
    // SelectedSprite.Sprite.memoryReference.destroy = true;
}

function onDown() {

}

function onHold() {
    switch (SelectedSprite.Sprite.memoryReference.type) {
        case "asteroid":
            var resources = "";
            for (var i = 0; i < SelectedSprite.Sprite.memoryReference.minerals.length; i++) {
                var cMineral = SelectedSprite.Sprite.memoryReference.minerals[i];
                resources += `
                    <div style="margin-left: 5px;">${cMineral.mineral.name}</div>
                    <div style="margin-left: 5px;">${cMineral.amount}</div>
                    <br>
                `;
            }
            showOverlayOver({
                content: `
                    <div>Asteroid</div>
                    <div>Resources: </div>
                    <div>${resources}</div>
                `
            });
            break;
    }
    assistantSpeak(SelectedSprite.Sprite.memoryReference.type);
}


export function pointerUp(obj) {
    switch (selectionDesire) {
        case 0:
            playerShip.desiredAngle = angleBetweenSprites(playerShip.Sprite, SelectedSprite.Sprite, true);
            break;
        case 1:
            onHold();
            break;
    }
    clearTimeout(selectionTimer);
    selectionDesire = 0;
}

export function globalPointerUp() {
}


function getCenter(x, y, w, h) {
    return {
        x: x + w / 2,
        y: y + h / 2
    }
}

export function getSelectedSprite() {
    return SelectedSprite;
}