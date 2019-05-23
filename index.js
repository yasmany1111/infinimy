import { main } from "./src/main.js";



(function (global) {
    if (global.infinimy !== undefined) {
        throw Error("myBundle variable already defined");
    }
    global.infinimy = main;
}).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}) 