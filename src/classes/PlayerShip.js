
import { registerUpdate } from "../states/update";
import { playerShip } from "../states/create";
import { KeyboardHandler } from "../ui/keyboard";
import { MiningLaser } from "./tools/miningLaser";
import { Navigator } from "./tools/navigator";
import { InventoryModule } from "./systems/modules/Inventory";
import { EngineModule } from "./systems/modules/Engine";

var isTouch = false;

export class PlayerShip {
    constructor(Game, x = 0, y = 0, texture = "") {
        this.Sprite = Game.physics.add.sprite(x, y, texture);
        this.Sprite.classInstance = this;
        this.Sprite.setOrigin(0.5);
        this.Sprite.setDrag(300);
        this.Sprite.setAngularDrag(400);
        this.Sprite.setMaxVelocity(200);

        var $this = this;

        this.textureName = texture.replace("_normal", "");
        this.wantAccelerate = false;
        this.desiredAngle = false// -1 left 0 none 1 right
        this.Speed = 100;
        this.rotationSpeed = 0.005;

        this.toolContainer = Game.add.container(0, 0);
        this.toolContainer.setDepth(9);

        this.tools = [];
        this.tools.push(new MiningLaser(Game, {
            toolContainer: this.toolContainer,
            ship: this
        }));
        this.tools.push(new Navigator(Game, {
            toolContainer: this.toolContainer,
            playerShip: this
        }));

        this.selectedTool = this.tools[0];
        this.selectedTool.selected = true;

        // Modules
        this.modules = [];

        this.Inventory = InventoryModule();
        this.modules.push({
            "type": "inventory",
            module: this.Inventory
        });

        this.Engine = new EngineModule();
        this.modules.push({
            "type": "engine",
            module: this.Engine
        });
        this.Speed = this.Engine.acceleration;
        this.Sprite.setDrag(this.Engine.maxDrag);
        this.Sprite.setAngularDrag(400);
        this.Sprite.setMaxVelocity(this.Engine.maxSpeed);
        this.rotationSpeed = this.Engine.rotation;

        // Update
        registerUpdate(function () {
            $this.update.apply($this, [Game]);
        });

        isTouch = yy.device.isTouch();
        return this;
    }

    toolButtonDown() {
        this.selectedTool.setActive(true);
    }
    toolButtonUp() {
        this.selectedTool.setActive(false);
    }
    selectTool(indexOrName) {
        this.selectedTool.selected = false;
        this.selectedTool = this.tools[indexOrName];
        this.selectedTool.selected = true;
    }

    update(Game) {
        moveHandler.apply(this, [Game]);
        this.move.apply(this, [Game]);
        this.toolContainer.setPosition(this.Sprite.x, this.Sprite.y);
        this.toolContainer.setAngle(this.Sprite.body.rotation);
        this.selectedTool.update();
    }

    accelerate(Game) {
        Game.physics.velocityFromRotation(
            this.Sprite.rotation, this.Speed, this.Sprite.body.acceleration
        );
    }
    move(Game) {
        // acc
        if (this.wantAccelerate === true) {
            this.accelerate.apply(this, [Game]);
            this.Sprite.setTexture(this.textureName + "_accelerate");

            this.selectedTool.onMove();

        } else {
            this.Sprite.setAcceleration(0);
            this.Sprite.setTexture(this.textureName + "_normal")
        }
        // only for ai and joystick
        if (this.desiredAngle !== false) {
            this.selectedTool.onMove();
            if (this.Sprite.rotation < this.desiredAngle) {
                if (Math.abs(this.Sprite.rotation - this.desiredAngle) > 3) {
                    this.Sprite.rotation -= this.rotationSpeed;
                } else {
                    this.Sprite.rotation += this.rotationSpeed;
                    if (this.Sprite.rotation > this.desiredAngle) {
                        // rotation success
                        this.Sprite.rotation = this.desiredAngle;
                        this.desiredAngle = false;
                    }
                }

            } else if (this.Sprite.rotation > this.desiredAngle) {
                if (Math.abs(this.Sprite.rotation - this.desiredAngle) > 3) {
                    this.Sprite.rotation += this.rotationSpeed;
                } else {
                    this.Sprite.rotation -= this.rotationSpeed;
                    if (this.Sprite.rotation < this.desiredAngle) {

                        this.Sprite.rotation = this.desiredAngle;
                        this.desiredAngle = false;
                    }
                }

            }
        } else {

        }
    }
}

function moveHandler(Game) { // PLayer


    if (KeyboardHandler.A.isDown) {
        this.desiredAngle = false;
        this.Sprite.rotation -= this.rotationSpeed;
        this.selectedTool.onMove();
    }
    else if (KeyboardHandler.D.isDown) {
        this.desiredAngle = false;
        this.Sprite.rotation += this.rotationSpeed;
        this.selectedTool.onMove();
    }

    if (KeyboardHandler.W.isDown) {
        this.wantAccelerate = true;
    } else if (KeyboardHandler.S.isDown) {
        this.wantAccelerate = false;
    }

    // this.desiredAngle = false; // since player controlled by keys, no need


}