export var KeyboardHandler;

export function registerKeyboardEvents() {
    var key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    var key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    var key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    var key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    KeyboardHandler = {
        W: key_W,
        S: key_S,
        A: key_A,
        D: key_D
    };
}

