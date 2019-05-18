export function angleBetweenSprites(spriteOrigin, spriteDestiny, center) {
    if (center === true) {
        var angle = Phaser.Math.Angle.Between(spriteOrigin.x, spriteOrigin.y,
            spriteDestiny.x + (spriteDestiny.displayWidth/2), spriteDestiny.y + (spriteDestiny.displayHeight/2));
        return angle;
    } else {
        var angle = Phaser.Math.Angle.Between(spriteOrigin.x, spriteOrigin.y,
            spriteDestiny.x, spriteDestiny.y);
        return angle;
    }
}

export function angleToSprite(spriteOrigin, spriteDestiny, center) {
    center = center || true;
    if (center === true) {
        var angle = Phaser.Math.Angle.Between(spriteOrigin.x, spriteOrigin.y,
            spriteDestiny.x + (spriteDestiny.displayWidth/2), spriteDestiny.y + (spriteDestiny.displayHeight/2));
        return angle;
    } else {
        var angle = Phaser.Math.Angle.Between(spriteOrigin.x, spriteOrigin.y,
            spriteDestiny.x, spriteDestiny.y);
        return angle;
    }
}