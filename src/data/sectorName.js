export var SectorNamesArray = [];

export function loadSectorNames() {
    return new Promise(function (resolve) {
        yy.http.get("assets/db/list_sector_names.txt").then(listTxt => {
            SectorNamesArray = listTxt.split("\n");
            resolve();
        });
    });
}

export function getRandomSectorName(seed) {
    return SectorNamesArray[yy.random.int(0, SectorNamesArray.length - 1)]
}