import { sceneBackground, playerShip } from "./create";

var update10Count = 0;
var update20Count = 0;

var updateAt20 = [{
    name: "aslab",
    fn: function () {

    }
}];
var updateAt10 = [];
var updateDefault = [];

export function update() {
    //var pStart = performance.now();
    update10Count++;
    update20Count++;
    for (var i = 0; i < updateDefault.length; i++) {
        updateDefault[i].fn(this);
    }

    if (update10Count === 10) {
        update10Count = 0;
        for (var i = 0; i < updateAt10.length; i++) {
            updateAt10[i].fn(this);
        }
    }
    if (update20Count === 20) {
        update20Count = 0;
        for (var i = 0; i < updateAt20.length; i++) {
            updateAt20[i].fn(this);
        }
    }
    return;
    var pEnd = performance.now() - pStart;
    if (pEnd > 0.4) {
        $("#debug_free1").css("color", "red");
    } else {
        $("#debug_free1").css("color", "lime");
    }
    $("#debug_free1").html(roundUsing(Math.floor, pEnd, 3));
}

var count = 0;
export function registerUpdate(fn) {
    updateDefault.push({
        name: count++,
        fn: fn
    });
}
export function registerUpdate10(fn) {
    updateAt10.push({
        name: count++,
        fn: fn
    });
}
export function registerUpdate20(fn) {
    updateAt20.push({
        name: count++,
        fn: fn
    });
}

function roundUsing(func, number, prec) {
    var tempnumber = number * Math.pow(10, prec);
    tempnumber = func(tempnumber);
    return tempnumber / Math.pow(10, prec);
}