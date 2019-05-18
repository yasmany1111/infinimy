import { PlayerShip } from "../classes/PlayerShip";
import { registerSectorManager, generateAndLoadSector } from "../sectors/manager";
import { registerKeyboardEvents } from "../ui/keyboard";
import { generateTopDebugger } from "../ui/debugger";
import { showOverlayOver } from "../api/overlayInfo";

export var playerShip, sceneBackground;
export var cursors;
export var gameReference;



export function create() {
    gameReference = this;
    //SceneBackground = this.add.tileSprite(0, 0, 4000, 4000, 'background_space_2')//.setScrollFactor(0);
    // SceneBackground = this.add.image(0, 0, 'background_space_2').setScrollFactor(0);

    var cuadricula = 6;

    for (var x = -1; x < cuadricula + 1; x++) {
        for (var y = -1; y < cuadricula + 1; y++) {
            this.add.image(x * 1024, y * 1024, 'background_space_2').setOrigin(0);
        }
    }
    /**
     * 0 0 : 1024 0
     * 1024 0 : 
     */
    cursors = this.input.keyboard.createCursorKeys();

    playerShip = new PlayerShip(this, 10, 10, "ship_1_normal");
    playerShip.Sprite.displayWidth = 128 / 3.3;
    playerShip.Sprite.displayHeight = 117 / 3.3;
    playerShip.Sprite.setDepth(10);

    this.cameras.main.startFollow(playerShip.Sprite);

    generateAndLoadSector(0, 0, this);
    registerSectorManager(this);
    registerKeyboardEvents.apply(this);






    generateTopDebugger();

    playerShip.Inventory.addItem("combustible nuclear", 1, 10, true);

    showOverlayOver({
        info1: "Asteroid",
        info2: "Resources: <br> iron: 10"
    });
}