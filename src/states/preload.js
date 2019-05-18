export function preload() {
    this.load.image("background_space_1", "assets/background/space_1.jpg");
    this.load.image("background_space_2", "assets/background/space_2.jpg");

    // Asteroid
    for (var i = 0; i < 7; i++) {
        this.load.image("body_asteroid_" + i, "assets/sprite/galaxy_body/asteroid/" + i + ".png");
    }
    // Planet
    for (var i = 0; i < 9; i++) {
        this.load.image("body_planet_" + i, "assets/sprite/galaxy_body/planet/Planet" + i + ".png");
    }
    // Station
    for (var i = 0; i < 1; i++) {
        this.load.image("station_red_" + i, "assets/sprite/station/red_" + i + ".png");
    }

    this.load.image("tool_laser_1", "assets/sprite/tools/laser_beam_red.png");


    this.load.image("ship_1_normal", "assets/sprite/ship/built/ship_1_normal.png");
    this.load.image("ship_1_accelerate", "assets/sprite/ship/built/ship_1_accelerate.png");
}