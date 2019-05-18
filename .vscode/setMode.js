/* eslint indent:0 */
var fs = require("fs-extra");

switch (process.argv[2]) {
    case "normal":
        fs.copy(".vscode/settings-normal.json", ".vscode/settings.json")
            .then(() => console.log("Ok!"))
            .catch(err => console.error(err));
        break;
    case "all":
        fs.copy(".vscode/settings-all.json", ".vscode/settings.json")
            .then(() => console.log("Ok!"))
            .catch(err => console.error(err));
        break;
}