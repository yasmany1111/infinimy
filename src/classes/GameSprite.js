export class GameSprite {
    constructor(Game, x = 0, y = 0, texture = "") {
        this.Sprite = Game.physics.add.sprite(x, y, texture);

        this.Sprite.setOrigin(0);
        this.Sprite.classInstance = this;

        return this;
    }
    onPointerDown(fn){
        var $this = this;
        this.Sprite.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
            fn($this)
            // setSelectedSprite($this.sprite);
        });
    }
    onPointerUp(fn){
        var $this = this;
        this.Sprite.setInteractive().on('pointerup', function (pointer, localX, localY, event) {
            fn($this)
            // setSelectedSprite($this.sprite);
        });
    }
}