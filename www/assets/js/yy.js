// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var global = arguments[3];
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() {
    return this || (typeof self === "object" && self);
  })() || Function("return this")()
);

},{}],"../node_modules/regenerator-runtime/runtime-module.js":[function(require,module,exports) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() {
  return this || (typeof self === "object" && self);
})() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = require("./runtime");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

},{"./runtime":"../node_modules/regenerator-runtime/runtime.js"}],"../node_modules/@babel/runtime/regenerator/index.js":[function(require,module,exports) {
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":"../node_modules/regenerator-runtime/runtime-module.js"}],"../node_modules/@babel/runtime/helpers/typeof.js":[function(require,module,exports) {
function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
},{}],"../node_modules/@babel/runtime/helpers/asyncToGenerator.js":[function(require,module,exports) {
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
},{}],"events/ready.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ready = ready;

function ready(callback, timeout) {
  var cCallback;
  var tTimeout;

  if (callback === undefined) {// only as promise or empty event
  }

  return new Promise(function (resolve, reject) {
    if (typeof callback === "number") {
      setTimeout(function () {
        resolve();
      }, callback);
    }

    if (typeof timeout === "number") {
      setTimeout(function () {
        resolve();

        if (typeof callback === "function") {
          callback();
        }
      }, timeout);
    }

    if (document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll) {
      if (typeof callback === "function") {
        callback();
      }

      resolve();
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        if (typeof callback === "function") {
          callback();
        }

        resolve();
      });
    }
  });
}
},{}],"loader.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contains = contains;
exports.isURL = isURL;
exports.loadScript = loadScript;
exports.loadCSS = loadCSS;
exports.writeCSS = writeCSS;
exports.http = exports.cdnList = void 0;
// This module IS standalone
var cdnList = {
  "ace": "https://cdnjs.cloudflare.com/ajax/libs/ace/1.3.3/ace.js",
  "jquery": "https://code.jquery.com/jquery-3.3.1.min.js",
  "phaser": "https://cdn.jsdelivr.net/npm/phaser@3.11.0/dist/phaser.min.js",
  "firebase": "https://www.gstatic.com/firebasejs/5.4.2/firebase.js",
  "mdl-icons.css": "https://fonts.googleapis.com/icon?family=Material+Icons",
  "mdl.css": "https://code.getmdl.io/1.3.0/material.indigo-pink.min.css",
  "mdl": "https://code.getmdl.io/1.3.0/material.min.js",
  "vue": "https://cdn.jsdelivr.net/npm/vue/dist/vue.js",
  "hammer": "https://yasmany1111.github.io/lib/hammer.min.js",
  "brython": "http://yasmany1111.github.io/lib/brython.js",
  "brython_std": "http://yasmany1111.github.io/lib/brython_stdlib.js",
  "hybrid": "https://unpkg.com/hybrids@1.5.0/dist/hybrids.js",
  "hybrids": "https://unpkg.com/hybrids@1.5.0/dist/hybrids.js",
  "animate": "css:https://yasmany1111.github.io/lib/animate.css",
  "socket_io": "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js",
  "nipplejs": "https://yasmany1111.github.io/lib/nipplejs.min.js"
};
exports.cdnList = cdnList;
var loadedScripts = [];
var http;
/**
 * Utility Functions
 */

exports.http = http;

function contains(arr, item) {
  var i;

  for (i = 0; i < arr.length; i++) {
    if (arr[i] === item) {
      return true;
    }
  }

  return false;
}

function isURL(str) {
  var pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
  "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
  "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
  "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
  "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
  "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator

  return pattern.test(str);
}
/**
 * Loader Functions
 */


function loadScript(url, callback) {
  var doAsync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var prom; // Multiple

  if (Array.isArray(url)) {
    prom = [];
    url.forEach(function (item) {
      if (!contains(loadedScripts, url)) {
        prom.push(loadScript(item));
      }
    });
    return new Promise(function (resolve, reject) {
      Promise.all(prom).then(function () {
        if (typeof callback === "function") {
          callback();
        }

        resolve();
      });
    });
  }

  return new Promise(function (resolve, reject) {
    if (url.length > 4) {
      if (url.substr(0, 4) === "css:") {
        // loadCss
        loadCSS(url.substr(4));
        resolve();
        return;
      }
    }

    var tmpState = false,
        brotherTag = document.getElementsByTagName("script")[0],
        scriptTag = document.createElement("script");

    if (brotherTag === undefined) {
      if (document.getElementsByTagName("body")[0] !== undefined) {
        brotherTag = document.getElementsByTagName("body")[0];
      }
    }

    scriptTag.type = "text/javascript";

    if (typeof callback === "string") {
      scriptTag.type = callback;
    }

    scriptTag.src = url;
    scriptTag.async = doAsync;

    scriptTag.onload = scriptTag.onreadystatechange = function () {
      if (!tmpState && (!this.readyState || this.readyState === "complete")) {
        tmpState = true;

        if (typeof callback === "function") {
          callback();
        }

        resolve(this);
        loadedScripts.push(url);
      }
    };

    scriptTag.onerror = scriptTag.onabort = reject;
    brotherTag.parentNode.insertBefore(scriptTag, brotherTag);
  });
}

function loadCSS(url, callback) {
  return new Promise(function (resolve) {
    var head = document.getElementsByTagName("head")[0],
        link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    head.appendChild(link);

    if (typeof callback === "function") {
      callback(link);
    } //setTimeout(function () {


    resolve(link); // }, 500);
  });
}

function writeCSS(css, id) {
  if (id === undefined) {
    var head = document.getElementsByTagName("head")[0];
    var s = document.createElement("style");
    s.setAttribute("type", "text/css");

    if (s.styleSheet) {
      s.styleSheet.cssText = css;
    } else {
      s.appendChild(document.createTextNode(css));
    }

    head.appendChild(s);
  } else {
    if (document.querySelector("#yy_style_" + id) === null) {
      var head = document.getElementsByTagName("head")[0];
      var s = document.createElement("style");
      s.setAttribute("id", "yy_style_" + id);
      s.setAttribute("type", "text/css");

      if (s.styleSheet) {
        s.styleSheet.cssText = css;
      } else {
        s.appendChild(document.createTextNode(css));
      }

      head.appendChild(s);
    }
  }
}
/**
 * Resources Functions
 */


function httpGet(location, callback) {
  var _async = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", location, _async);

    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);

          if (typeof callback === "function") {
            callback(xhr.responseText);
          }
        } else {
          reject(xhr.statusText);

          if (typeof callback === "function") {
            callback(null);
            throw Error(xhr);
          }
        }
      }
    };

    xhr.onerror = function (e) {
      reject(xhr.statusText);
    };

    xhr.send(null);
  });
}

function httpPost(location) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var callback = arguments.length > 2 ? arguments[2] : undefined;
  var callback2 = arguments.length > 3 ? arguments[3] : undefined;
  return new Promise(function (resolve, reject) {
    // Post handlers
    function executePost() {
      function doPost(location) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var callback = arguments.length > 2 ? arguments[2] : undefined;
        $.post(location, data, function (result) {
          if (callback) {
            callback(result);
          }

          resolve(result);
        });
      }

      if (window["__%939dsajfg"] === undefined) {
        window["__%939dsajfg"] = {};
      }
      /* global $ */


      if (data.yason !== false) {
        switch (data.yason) {
          default:
          case "autolog":
            if (data.user === undefined) {
              if (window["__%939dsajfg"].user === undefined) {
                data.user = window["__%939dsajfg"].user = prompt();
              } else {
                data.user = window["__%939dsajfg"].user;
              }
            }

            if (data.password === undefined) {
              if (window["__%939dsajfg"].password === undefined) {
                data.password = window["__%939dsajfg"].password = prompt();
              } else {
                data.password = window["__%939dsajfg"].password;
              }
            }

            break;

          case "relogin":
          case "reset":
            if (data.user === undefined) {
              data.user = window["__%939dsajfg"].user = prompt();
            } else {
              window["__%939dsajfg"].user = data.user;
            }

            if (data.password === undefined) {
              data.password = window["__%939dsajfg"].password = prompt();
            } else {
              window["__%939dsajfg"].password = data.password;
            }

            break;

          case "erase":
          case "remove":
            window["__%939dsajfg"].user = undefined;
            window["__%939dsajfg"].password = undefined;
            break;

          case "force":
            data.user = window["__%939dsajfg"].user = prompt();
            data.password = window["__%939dsajfg"].password = prompt();
            break;
        }
      }

      doPost(location, data, callback);
    } // Dependency check


    if (window.jQuery === undefined) {
      loadScript(cdnList.jquery).then(function () {
        executePost();
      });
    } else {
      executePost();
    }
  });
}

exports.http = http = {
  get: httpGet,
  post: httpPost
};
},{}],"utils/device.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.info = info;
exports.device = void 0;
// This module IS standalone

/* eslint max-len: 0 vars-on-top:0 */

/* eslint newline-after-var:0 brace-style:0*/

/* eslint no-unneeded-ternary:0 */
// Deprecated
var device;
exports.device = device;

function info() {
  var width, height, output;
  var unknown = "Unknown"; // screen

  var screenSize = "";

  if (screen.width) {
    width = screen.width ? screen.width : "";
    height = screen.height ? screen.height : "";
    screenSize = {
      "width": width,
      "height": height
    };
  } // browser


  var nVer = navigator.appVersion;
  var nAgt = navigator.userAgent;
  var browser = navigator.appName;
  var version = "" + parseFloat(navigator.appVersion);
  var majorVersion = parseInt(navigator.appVersion, 10);
  var nameOffset, verOffset, ix; // Opera

  if ((verOffset = nAgt.indexOf("Opera")) !== -1) {
    browser = "Opera";
    version = nAgt.substring(verOffset + 6);

    if ((verOffset = nAgt.indexOf("Version")) !== -1) {
      version = nAgt.substring(verOffset + 8);
    }
  } // MSIE
  else if ((verOffset = nAgt.indexOf("MSIE")) !== -1) {
      browser = "Microsoft Internet Explorer";
      version = nAgt.substring(verOffset + 5);
    } else if (browser === "Netscape" && nAgt.indexOf("Trident/") !== -1) {
      browser = "Microsoft Internet Explorer";
      version = nAgt.substring(verOffset + 5);

      if ((verOffset = nAgt.indexOf("rv:")) !== -1) {
        version = nAgt.substring(verOffset + 3);
      }
    } // Chrome
    else if ((verOffset = nAgt.indexOf("Chrome")) !== -1) {
        browser = "Chrome";
        version = nAgt.substring(verOffset + 7);
      } // Safari
      else if ((verOffset = nAgt.indexOf("Safari")) !== -1) {
          browser = "Safari";
          version = nAgt.substring(verOffset + 7);

          if ((verOffset = nAgt.indexOf("Version")) !== -1) {
            version = nAgt.substring(verOffset + 8);
          } // Chrome on iPad identifies itself as Safari. Actual results do not match what Google claims
          //  at: https://developers.google.com/chrome/mobile/docs/user-agent?hl=ja
          //  No mention of chrome in the user agent string. However it does mention CriOS, which presumably
          //  can be keyed on to detect it.


          if (nAgt.indexOf("CriOS") !== -1) {
            // Chrome on iPad spoofing Safari...correct it.
            browser = "Chrome"; // Don"t believe there is a way to grab the accurate version number, so leaving that for now.
          }
        } // Firefox
        else if ((verOffset = nAgt.indexOf("Firefox")) !== -1) {
            browser = "Firefox";
            version = nAgt.substring(verOffset + 8);
          } // Other browsers
          else if ((nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/"))) {
              browser = nAgt.substring(nameOffset, verOffset);
              version = nAgt.substring(verOffset + 1);

              if (browser.toLowerCase() === browser.toUpperCase()) {
                browser = navigator.appName;
              }
            } // trim the version string


  if ((ix = version.indexOf(";")) !== -1) version = version.substring(0, ix);
  if ((ix = version.indexOf(" ")) !== -1) version = version.substring(0, ix);
  if ((ix = version.indexOf(")")) !== -1) version = version.substring(0, ix);
  majorVersion = parseInt("" + version, 10);

  if (isNaN(majorVersion)) {
    version = "" + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
  } // mobile version


  var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer); // cookie

  var cookieEnabled = navigator.cookieEnabled ? true : false;

  if (typeof navigator.cookieEnabled === "undefined" && !cookieEnabled) {
    document.cookie = "testcookie";
    cookieEnabled = document.cookie.indexOf("testcookie") !== -1 ? true : false;
  } // system


  var os = unknown;
  var clientStrings = [{
    s: "Windows 3.11",
    r: /Win16/
  }, {
    s: "Windows 95",
    r: /(Windows 95|Win95|Windows_95)/
  }, {
    s: "Windows ME",
    r: /(Win 9x 4.90|Windows ME)/
  }, {
    s: "Windows 98",
    r: /(Windows 98|Win98)/
  }, {
    s: "Windows CE",
    r: /Windows CE/
  }, {
    s: "Windows 2000",
    r: /(Windows NT 5.0|Windows 2000)/
  }, {
    s: "Windows XP",
    r: /(Windows NT 5.1|Windows XP)/
  }, {
    s: "Windows Server 2003",
    r: /Windows NT 5.2/
  }, {
    s: "Windows Vista",
    r: /Windows NT 6.0/
  }, {
    s: "Windows 7",
    r: /(Windows 7|Windows NT 6.1)/
  }, {
    s: "Windows 8.1",
    r: /(Windows 8.1|Windows NT 6.3)/
  }, {
    s: "Windows 8",
    r: /(Windows 8|Windows NT 6.2)/
  }, {
    s: "Windows NT 4.0",
    r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
  }, {
    s: "Windows ME",
    r: /Windows ME/
  }, {
    s: "Android",
    r: /Android/
  }, {
    s: "Open BSD",
    r: /OpenBSD/
  }, {
    s: "Sun OS",
    r: /SunOS/
  }, {
    s: "Linux",
    r: /(Linux|X11)/
  }, {
    s: "iOS",
    r: /(iPhone|iPad|iPod)/
  }, {
    s: "Mac OS X",
    r: /Mac OS X/
  }, {
    s: "Mac OS",
    r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
  }, {
    s: "QNX",
    r: /QNX/
  }, {
    s: "UNIX",
    r: /UNIX/
  }, {
    s: "BeOS",
    r: /BeOS/
  }, {
    s: "OS/2",
    r: /OS\/2/
  }, {
    s: "Search Bot",
    r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
  }];

  for (var id in clientStrings) {
    var cs = clientStrings[id];

    if (cs.r.test(nAgt)) {
      os = cs.s;
      break;
    }
  }

  var osVersion = unknown;

  if (/Windows/.test(os)) {
    osVersion = /Windows (.*)/.exec(os)[1];
    os = "Windows";
  }

  switch (os) {
    case "Mac OS X":
      osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
      break;

    case "Android":
      osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
      break;

    case "iOS":
      osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
      osVersion = osVersion[1] + "." + osVersion[2] + "." + (osVersion[3] | 0);
      break;
  }

  output = {
    screen: screenSize,
    browser: browser,
    browserVersion: version,
    mobile: mobile,
    os: os,
    osVersion: osVersion,
    cookies: cookieEnabled
  };
  return output;
}

function isTouch() {
  if ("ontouchstart" in document.documentElement) {
    return true;
  } else {
    return false;
  }
}

function getOrientation() {
  if (window.innerHeight > window.innerWidth) {
    return "portrait";
  } else {
    return "landscape";
  }
}

exports.device = device = {
  info: info,
  isTouch: isTouch,
  orientation: getOrientation
};
},{}],"utils/application.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyWebAppStyle = applyWebAppStyle;

var _loader = require("../loader");

var _device = require("./device");

var _ready = require("../events/ready");

var appliedAlready = false;

function applyWebAppStyle() {
  return new Promise(function (resolve) {
    if (!appliedAlready) {
      (0, _loader.writeCSS)("\n            html, body, #root, .root {\n                overflow   :auto;\n                margin: 0px;\n                padding: 0px;\n                width: 100%;\n                height: 100%;\n                overscroll-behavior-y: contain;\n            }\n            div:focus {\n                outline: none;\n            }\n            .noselect, .no-select {\n                -webkit-touch-callout: none;\n                -webkit-user-select: none;\n                -khtml-user-select: none;\n                -moz-user-select: none;\n                -ms-user-select: none;\n                user-select: none;\n            }");

      if (_device.device.info().os === "iOS") {
        (0, _loader.writeCSS)("\n                    #root, .root{\n                        position: absolute;\n                        top: 0px;\n                        z-index: 2;\n                    }\n                ");
      } //


      if (window.jQuery === undefined) {
        (0, _loader.loadScript)(_loader.cdnList.jquery).then(function () {
          if ($("#root")[0] === undefined) {
            $("body").append("<div id=\"root\"></div>");
            resolve();
          }
        });
      } else {
        if ($("#root")[0] === undefined) {
          $("body").append("<div id=\"root\"></div>");
          resolve();
        }
      }

      appliedAlready = true;
    } else {
      (0, _ready.ready)().then(function () {
        resolve();
      });
    }
  });
}
},{"../loader":"loader.js","./device":"utils/device.js","../events/ready":"events/ready.js"}],"utils/random.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomFloat = randomFloat;
exports.randomInt = randomInt;
exports.chance = chance;
exports.randomUnique = randomUnique;
exports.random = void 0;
// This module IS standalone
var random;
/**
 * Get a random floating point number between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {float} a random floating point number
 */

exports.random = random;

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
/**
 * Get a random integer between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {int} a random integer
 */


function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
/**
 * @param {number} possibility - Chance
 * @param {number} over - Optional maximum
 */


function chance(possibility, over) {
  var result = randomInt(0, over || 100);
  if (result <= possibility) return true;else return false;
}

function randomUnique() {
  return parseInt(Math.random() + new Date().getTime(), 10).toString().replace(".", "");
}

exports.random = random = {
  chance: chance,
  float: randomFloat,
  int: randomInt,
  unique: randomUnique
};
},{}],"utils/registry.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registry = registry;
exports.temporal = temporal;

function registry(regName, regData) {
  var tmpReg; // First check if the registry exist

  if (localStorage.getItem("__yyRegistryData") === null || localStorage.getItem("__yyRegistryData") === undefined) {
    localStorage.setItem("__yyRegistryData", JSON.stringify({}));
  }

  if (regData === undefined) {
    // Want data
    return JSON.parse(localStorage.getItem("__yyRegistryData"))[regName];
  } else {
    // set data
    tmpReg = JSON.parse(localStorage.getItem("__yyRegistryData"));
    tmpReg[regName] = regData;
    return localStorage.setItem("__yyRegistryData", JSON.stringify(tmpReg));
  }
}

function temporal(tmpName, tmpData) {
  // First check if the tmp exist
  if (yy.__yy_tmpData === undefined) {
    yy.__yy_tmpData = {};
  }

  if (tmpData === undefined) {
    // Want data
    return yy.__yy_tmpData[tmpName];
  } else {
    // set data
    yy.__yy_tmpData[tmpName] = tmpData;
    return yy.__yy_tmpData[tmpName];
  }
}
},{}],"plugins/youtube/loadDependencies.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadGoogleAPI = loadGoogleAPI;
exports.loadYouTubeApi = loadYouTubeApi;
exports.loadYoutubeIFrameApi = loadYoutubeIFrameApi;

var _loader = require("../../loader");

/* global gapi*/
var youtubeLoaded = false;
var gapiLoaded = false;
var youtubeIFrameLoaded = false;
/**
 *
 * @param {string} apiKey The apikey provided by Google
 * @param {function} callback
 */

function loadGoogleAPI(apiKey) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  // Defaults
  return new Promise(function (resolve, reject) {
    if (gapiLoaded === true) {
      // We have loaded the api already
      callback(gapi);
      resolve(gapi);
    } else {
      // ?onload=handleClientLoad for callback alternative
      (0, _loader.loadScript)("https://apis.google.com/js/client.js").then(function () {
        gapi.load("client:auth2", function firstGapiLoad() {
          gapi.client.init({
            "apiKey": apiKey
          }).then(function () {
            gapiLoaded = true;
            callback(gapi);
            resolve(gapi);
          });
        });
      });
    }
  });
}
/**
 *
 * @param {string} apiKey The apikey provided by Google
 * @param {function} callback
 */


function loadYouTubeApi(apiKey) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  // Defaults
  return new Promise(function (resolve, reject) {
    if (youtubeLoaded === true) {
      callback(gapi);
      resolve(gapi);
    } else {
      loadGoogleAPI(apiKey, callback).then(function (g) {
        gapi.client.load("youtube", "v3", function () {
          youtubeLoaded = true;
          callback(gapi);
          resolve(gapi);
        });
      });
    }
  });
}

function loadYoutubeIFrameApi(apiKey) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  // Defaults
  return new Promise(function (resolve, reject) {
    if (youtubeIFrameLoaded === true) {
      callback();
      resolve();
    } else {
      (0, _loader.loadScript)(_loader.cdnList.jquery).then(function () {
        window.onYouTubeIframeAPIReady = function () {
          resolve();
          callback();
        };

        youtubeIFrameLoaded = true;
        return (0, _loader.loadScript)("https://youtube.com/iframe_api", function () {});
      });
    }
  });
}
},{"../../loader":"loader.js"}],"plugins/youtube/Search.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchVideo = searchVideo;
exports.searchFirst = searchFirst;
exports.setAPIKey = setAPIKey;

var _loadDependencies = require("./loadDependencies");

/* global gapi*/
// For test purpose only
var currentAPIKey = "AIzaSyD3WZynSikvYFlzEXP79f4H4rfiJZxlWhQ";

function searchVideo(keyword) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  var apiKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : currentAPIKey;
  return new Promise(function (resolve, reject) {
    (0, _loadDependencies.loadYouTubeApi)(apiKey, callback).then(function loaded(g) {
      var request = gapi.client.youtube.search.list({
        q: keyword,
        part: "snippet"
      });
      request.execute(function (response) {
        resolve(response);
      });
    });
  });
}

function searchFirst(keyword) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  var apiKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : currentAPIKey;
  return new Promise(function (resolve, reject) {
    searchVideo(keyword, callback, apiKey).then(function (response) {
      resolve(response.items[0].id.videoId);
    });
  });
}

function setAPIKey(key) {
  currentAPIKey = key;
}
},{"./loadDependencies":"plugins/youtube/loadDependencies.js"}],"plugins/Ace.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Editor = Editor;
exports.AceExport = void 0;

var _loader = require("../loader");

var _random = require("../utils/random");

/* eslint no-unreachable:0 */

/* global ace */
var AceExport;
exports.AceExport = AceExport;

function Editor() {
  var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (instance) {};
  return new Promise(function (resolve, reject) {
    (0, _loader.loadScript)(_loader.cdnList.ace).then(function () {
      var valueHasBeenSetByCode = false; // Load jquery and ace

      var editorInstance, instanceContainer, randomAssignedID, editorReturnObject; // Name to be applied to container

      randomAssignedID = "_instance_" + (0, _random.randomUnique)(); // Create container and append it to body

      instanceContainer = document.createElement("div");
      instanceContainer.style.width = "100%";
      instanceContainer.style.height = "100%";
      instanceContainer.setAttribute("id", randomAssignedID);
      document.body.appendChild(instanceContainer); // Creating editor instance

      editorInstance = ace.edit(randomAssignedID);
      editorInstance.$blockScrolling = 2e308; // fix bugs

      editorInstance.setOptions({
        fontSize: "15px"
      });
      editorReturnObject = {
        container: instanceContainer,
        editor: editorInstance
      }; // Extending

      editorReturnObject.appendTo = function (parent) {
        if (typeof parent === "string") {
          document.querySelectorAll(parent)[0].appendChild(instanceContainer);
        } else {
          parent.appendChild(instanceContainer);
        }
      };

      editorReturnObject.resize = function () {
        editorInstance.resize();
      };

      editorReturnObject.setTheme = function (theme) {
        editorInstance.setTheme("ace/theme/" + theme);
        return editorReturnObject;
      };

      editorReturnObject.setMode = function (mode) {
        editorInstance.session.setMode("ace/mode/" + mode);
        return editorReturnObject;
      };

      editorReturnObject.addKeyBind = function (name, bind, fn) {
        editorInstance.commands.addCommand({
          name: name,
          bindKey: {
            win: bind,
            mac: bind
          },
          exec: function exec(editor, e) {
            return fn(editorReturnObject, e);
          }
        });
        return editorReturnObject;
      }; //


      editorReturnObject.val = function (value) {
        if (value !== void 0) {
          valueHasBeenSetByCode = true;
          editorInstance.setValue(value, -1);
        }

        return editorInstance.getValue();
      };

      editorReturnObject.on = function (eventName, callback) {
        switch (eventName) {
          case "keyDown":
          case "keydown":
            return editorInstance.on("input", function (info) {
              if (valueHasBeenSetByCode === false) {
                callback(info);
              }

              valueHasBeenSetByCode = false;
            });
            break;
        }

        ;
        return false;
      };

      resolve(editorReturnObject);
      return callback(editorReturnObject);
    });
  });
}

exports.AceExport = AceExport = {
  Editor: Editor
};
},{"../loader":"loader.js","../utils/random":"utils/random.js"}],"plugins/Youtube/loadDependencies.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadGoogleAPI = loadGoogleAPI;
exports.loadYouTubeApi = loadYouTubeApi;
exports.loadYoutubeIFrameApi = loadYoutubeIFrameApi;

var _loader = require("../../loader");

/* global gapi*/
var youtubeLoaded = false;
var gapiLoaded = false;
var youtubeIFrameLoaded = false;
/**
 *
 * @param {string} apiKey The apikey provided by Google
 * @param {function} callback
 */

function loadGoogleAPI(apiKey) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  // Defaults
  return new Promise(function (resolve, reject) {
    if (gapiLoaded === true) {
      // We have loaded the api already
      callback(gapi);
      resolve(gapi);
    } else {
      // ?onload=handleClientLoad for callback alternative
      (0, _loader.loadScript)("https://apis.google.com/js/client.js").then(function () {
        gapi.load("client:auth2", function firstGapiLoad() {
          gapi.client.init({
            "apiKey": apiKey
          }).then(function () {
            gapiLoaded = true;
            callback(gapi);
            resolve(gapi);
          });
        });
      });
    }
  });
}
/**
 *
 * @param {string} apiKey The apikey provided by Google
 * @param {function} callback
 */


function loadYouTubeApi(apiKey) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  // Defaults
  return new Promise(function (resolve, reject) {
    if (youtubeLoaded === true) {
      callback(gapi);
      resolve(gapi);
    } else {
      loadGoogleAPI(apiKey, callback).then(function (g) {
        gapi.client.load("youtube", "v3", function () {
          youtubeLoaded = true;
          callback(gapi);
          resolve(gapi);
        });
      });
    }
  });
}

function loadYoutubeIFrameApi(apiKey) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  // Defaults
  return new Promise(function (resolve, reject) {
    if (youtubeIFrameLoaded === true) {
      callback();
      resolve();
    } else {
      (0, _loader.loadScript)(_loader.cdnList.jquery).then(function () {
        window.onYouTubeIframeAPIReady = function () {
          resolve();
          callback();
        };

        youtubeIFrameLoaded = true;
        return (0, _loader.loadScript)("https://youtube.com/iframe_api", function () {});
      });
    }
  });
}
},{"../../loader":"loader.js"}],"plugins/Youtube/Player.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = Player;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _loadDependencies = require("./loadDependencies");

var _random = require("../../utils/random");

var _loader = require("../../loader");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Player() {
  return _Player.apply(this, arguments);
}

function _Player() {
  _Player = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2() {
    var options,
        youtubeContainer,
        _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
            _context2.next = 3;
            return (0, _loadDependencies.loadYoutubeIFrameApi)();

          case 3:
            _context2.next = 5;
            return (0, _loader.loadScript)(_loader.cdnList.jquery);

          case 5:
            youtubeContainer = $("<div></div>").attr("id", "_yy_youtubeContainer" + (0, _random.randomUnique)());
            youtubeContainer.appendTo(options.parent || $("body"));
            return _context2.abrupt("return", new Promise(function (resolve) {
              var firstTimeLoad = true;
              var PlayerClass = {
                instance: undefined,
                container: undefined,
                _internStateChange: function _internStateChange() {},
                _internReady: function _internReady() {},
                // Handlers
                loadVideoById: function () {
                  var _loadVideoById = (0, _asyncToGenerator2.default)(
                  /*#__PURE__*/
                  _regenerator.default.mark(function _callee(id) {
                    var seconds,
                        _args = arguments;
                    return _regenerator.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            seconds = _args.length > 1 && _args[1] !== undefined ? _args[1] : 0;

                            PlayerClass._internStateChange = function (ev) {
                              if (ev.data === 1) {
                                // First tiome playing vid after load, so go second 0
                                // Usually helpul in long videos, where time is autosaved
                                PlayerClass.instance.seekTo(seconds);

                                PlayerClass._internStateChange = function () {};
                              }
                            };

                            PlayerClass.instance.loadVideoById(id);

                          case 3:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, this);
                  }));

                  return function loadVideoById(_x) {
                    return _loadVideoById.apply(this, arguments);
                  };
                }(),
                appendTo: function appendTo(whom) {
                  return new Promise(function (resolve) {
                    PlayerClass.container.appendTo($(whom));

                    PlayerClass._internReady = function () {
                      PlayerClass._internReady = function (ev) {};

                      resolve();
                    };
                  });
                },
                seekTo: function seekTo(where) {
                  playerInstance.seekTo(where);
                },
                hide: function hide() {
                  PlayerClass.container.css({
                    "position": "absolute",
                    "top": 0,
                    "left": 0,
                    "opacity": 0,
                    "z-index": -1
                  });
                },
                show: function show() {
                  PlayerClass.container.css({
                    "position": "relative",
                    "opacity": 1,
                    "z-index": 0
                  });
                },
                pause: function pause() {
                  playerInstance.pauseVideo();
                },
                play: function play() {
                  playerInstance.playVideo();
                },
                stop: function stop() {
                  playerInstance.stopVideo();
                },
                setVolume: function setVolume(v) {
                  playerInstance.setVolume(v);
                }
              };
              var playerInstance = new YT.Player(youtubeContainer.attr("id"), {
                height: options.height || "100%",
                width: options.width || "100%",
                playerVars: {
                  'autoplay': 0
                },
                events: {
                  "onReady": function onReady(event) {
                    // The intern ready is used for the appendTo() function
                    PlayerClass._internReady(); // Check if first time, to resolve


                    if (firstTimeLoad) {
                      firstTimeLoad = false;
                      PlayerClass.instance = playerInstance;
                      PlayerClass.container = $("#" + youtubeContainer.attr("id"));
                      resolve(PlayerClass);
                    }

                    if (options.onReady) {
                      options.onReady(event, PlayerClass);
                    }
                  },
                  "onStateChange": function onStateChange(event) {
                    PlayerClass._internStateChange(event);

                    if (options.onStateChange) {
                      options.onStateChange(event);
                    }
                  }
                }
              });
            }));

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _Player.apply(this, arguments);
}
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","./loadDependencies":"plugins/Youtube/loadDependencies.js","../../utils/random":"utils/random.js","../../loader":"loader.js"}],"yapi/console.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConsole = createConsole;
exports.log = log;
exports.clear = clear;

var _loader = require("../loader");

function createConsole() {
  if ($("#_yapiConsoleContainer").length === 0) {
    $("body").append("\n            <div id=\"_yapiConsoleContainer\" style=\"width: 600px;\n                                                    height: 300px; \n                                                    max-height: 50%;\n                                                    max-width: 70%;\n                                                    background: rgba(0, 0, 0, 0.5);\n                                                    color: lime;\n                                                    position: absolute;\n                                                    z-index: 500;\n                                                    right: 0px;\n                                                    top: 0px;\n                                                    padding: 10px;\">\n            </div>\n        ");
  }
}

function log(wh) {
  $("#_yapiConsoleContainer").prepend("<div>" + wh + "</div>");
  console.log(wh);
}

function clear() {
  $("#_yapiConsoleContainer").html("");
}
},{"../loader":"loader.js"}],"yapi/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.yapi = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _loader = require("../loader");

var _console = require("./console");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var yapi = {};
exports.yapi = yapi;

function runDemo() {
  return _runDemo.apply(this, arguments);
}

function _runDemo() {
  _runDemo = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _loader.loadScript)(_loader.cdnList.jquery);

          case 2:
            $("#root").html("");

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _runDemo.apply(this, arguments);
}

function attemptConversion(_x, _x2) {
  return _attemptConversion.apply(this, arguments);
}

function _attemptConversion() {
  _attemptConversion = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(code, language) {
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _attemptConversion.apply(this, arguments);
}

exports.yapi = yapi = {
  runDemo: runDemo,
  console: {
    create: _console.createConsole,
    log: _console.log,
    clear: _console.clear
  }
};
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","../loader":"loader.js","./console":"yapi/console.js"}],"ui/modal.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.simpleModal = simpleModal;

function simpleModal(options) {
  return;
  options = options || {};
  var message = options.message || "Hello World";
  var typeOfMessage = options.type || "yes_no";
  var fontSize = options.fontSize || "18px";
  var background = options.background || "rgba(0,0,0,0.8)";
  var textColor = options.textColor || "white";
  var View = yy.View;
  var messageContainer = View("background: " + background, "color: " + textColor, "min-height: 20px", "max-height: 100%", "max-width: 500px", "float: left", "position: fixed", "padding-left: 20px", "padding-right: 20px", "padding-top: 15px", "padding-bottom: 15px", "top: 30px", "left: 30px", "z-index: 50", "border-radius: 30px");

  if (window.innerWidth <= 600) {
    messageContainer.apply("max-width: calc(100% - 20px)", "top: 20px", "left: 0", "margin-left: 10px", "margin-right: 10px");
  }

  var messageText = View("font-size: " + fontSize.replace("px", "") + "px");
  messageText.$element.html(message);
  var messageButtons = View("padding-top: 20px", "padding-bottom: 10px", "float: hidden", "height: auto");

  var animationEnd = function (el) {
    var animations = {
      animation: 'animationend',
      OAnimation: 'oAnimationEnd',
      MozAnimation: 'mozAnimationEnd',
      WebkitAnimation: 'webkitAnimationEnd'
    };

    for (var t in animations) {
      if (el.style[t] !== undefined) {
        return animations[t];
      }
    }
  }(document.createElement('div'));

  switch (typeOfMessage) {
    case "yes_no":
      var yesButton = View("padding-left: 35px", "padding-right: 35px", "padding-bottom: 15px", "padding-top: 15px", "float: left", "background: #224800", "cursor: pointer", "setContent(Yes)", function onClick() {
        if (options.yes) {
          options.yes();
        }

        $(messageContainer.$element).addClass("bounceOutLeft");
        $(messageContainer.$element).one(animationEnd, function () {
          messageContainer.remove();
        });
      });
      var noButton = View("padding-left: 35px", "padding-right: 35px", "padding-bottom: 15px", "padding-top: 15px", "cursor: pointer", "float: right", "background: #a03e0d", "setContent(No)", function onClick() {
        if (options.no) {
          options.no();
        }

        $(messageContainer.$element).addClass("bounceOutLeft");
        $(messageContainer.$element).one(animationEnd, function () {
          messageContainer.remove();
        });
      });
      messageButtons.append(yesButton).append(noButton);
      break;
  } // Effects


  messageContainer.append(messageText).append(messageButtons);
  messageContainer.$element.appendTo($("body"));
  messageContainer.$element.addClass('animated bounceInLeft');
}
},{}],"ui/touchUI.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.touchUI = touchUI;

/* eslint-disable */
function touchUI(options) {
  options = options || {};

  if (window.Hammer === undefined) {
    throw Error("Hammer lib required");
  }

  if (window.jQuery === undefined) {
    throw Error("jQuery lib required");
  }

  var itemList = options.items || [];
  var $initiatorElement = $(options.initiator || document.getElementsByTagName("body")[0]);
  console.log($initiatorElement);
  var $containerElement = $(options.container || document.getElementsByTagName("body")[0]);
  var $instanceContainer = $("<div id=\"instanceContainer\"></div>");
  options.threshold = options.threshold || 100;
  var colWidth = options.colWidth || 50;
  options.styleClass = options.styleClass || "no-active";
  options.effectClass = options.effectClass || "active";
  options.direction = options.direction || "left";
  $instanceContainer.css({
    "position": "absolute",
    "top": 0,
    "left": 0,
    "backgorund": "lime",
    "z-index": "1"
  });

  if (options.direction === "right") {
    $instanceContainer.css({
      "right": 0
    });
  } else {
    $instanceContainer.css({
      "left": 0
    });
  }

  $instanceContainer.appendTo($containerElement);
  var firstColumn = null;

  function generateRecursive(columnName, posLeft, items) {
    // col
    var numberOfItems = items.length;
    var eachElementHeight = $containerElement.height() / numberOfItems;
    var $column = $("<div class=\"column\" id=\"column_".concat(columnName, "\"></div>"));
    $column.appendTo($instanceContainer);
    $column.css({
      "z-index": "10"
    });
    var returnColumn = {
      name: "rnd",
      element: $column,
      elementHeight: eachElementHeight,
      items: [],
      width: colWidth,
      posLeft: posLeft
    };

    for (var i = 0; i < numberOfItems; i++) {
      var item = items[i];
      var $element = $("\n                    <div class=\"touchElement\" id=\"touchMenuElement_".concat(i, "\"></div>\n                "));
      $($element).css({
        "transition": "all 0.3s",
        "text-align": "center",
        "top": i * eachElementHeight + "px",
        "height": eachElementHeight + "px",
        "position": "absolute",
        "z-index": "10",
        "width": colWidth //,
        //"left": posLeft

      });
      $element.addClass(options.styleClass);

      switch (options.direction) {
        case "left":
          $element.css("left", posLeft);
          break;

        case "right":
          $element.css("right", posLeft);
          break;
      }

      if (options.centerLine) {
        $element.css("line-height", eachElementHeight + "px");
      }

      item.$element = $element;
      returnColumn.items.push(item);
      $column.append($element);
      $element.html(item.content);
      $column.hide();
    }

    return returnColumn;
  }

  firstColumn = generateRecursive("main", 0, itemList);
  firstColumn.isFirst = true;
  firstColumn.parentCol = {
    posLeft: 0
  }; //

  var activeColumn = null;
  var allButFirst = [];
  var itemPosition = null;
  var relativePosition = 0;
  var startPosition = null;
  var hammertime = new Hammer($initiatorElement[0]);
  hammertime.get("pan").set({
    direction: Hammer.DIRECTION_ALL
  });
  hammertime.on('panstart', function (ev) {
    activeColumn = firstColumn;
    startPosition = ev.srcEvent.x;
    lastChangeX = startPosition;
    firstColumn.element.show();
    $instanceContainer.show();

    if (options.onStart) {
      options.onStart();
    }
  });
  var lastPosition = 0;
  var lastChangeX = 0;
  hammertime.on('pan', function (ev) {
    var direction = 0;
    var leftPosition = parseInt((ev.srcEvent.x - startPosition) / options.threshold);
    var relativeDistance = ev.srcEvent.x - lastChangeX;

    if (relativeDistance <= -options.threshold) {
      if (options.direction === "left") {
        direction = -1;
      } else {
        direction = 1;
      }
    } else if (relativeDistance >= options.threshold) {
      if (options.direction === "left") {
        direction = 1;
      } else {
        direction = -1;
      }
    }

    if (direction === -1) {
      //   console.log("Left");
      if (activeColumn.isFirst === true) {} else {
        activeColumn.element.hide();
        activeColumn = activeColumn.parentCol;
      }

      lastChangeX = ev.srcEvent.x;
    } else if (direction === 1) {
      // console.log("Right");
      if (activeColumn.items[itemPosition].items !== undefined) {
        var memCol = activeColumn; //console.log(memCol.posLeft);
        // console.log(memCol.parentCol.posLeft + colWidth);

        activeColumn = generateRecursive("", memCol.posLeft + colWidth, activeColumn.items[itemPosition].items);
        activeColumn.parentCol = memCol;
        activeColumn.element.show();
        lastChangeX = ev.srcEvent.x;
        allButFirst.push(activeColumn.element);
      }
    }

    var elementHeight = activeColumn.elementHeight;
    itemPosition = parseInt(ev.srcEvent.y / elementHeight + 1) - 1;
    lastPosition = leftPosition; // efects

    $(".touchElement").removeClass(options.effectClass);

    try {
      //activeColumn.items[itemPosition].$element.css("background", "lime");
      activeColumn.items[itemPosition].$element.addClass(options.effectClass);
    } catch (ex) {}

    if (relativePosition <= 0) relativePosition = 0; //console.log(itemPosition, leftPosition);
  });
  hammertime.on('panend', function (ev) {
    //console.log(activeColumn.items[itemPosition].content);
    if (activeColumn.items[itemPosition]) {
      if (activeColumn.items[itemPosition].click) {
        activeColumn.items[itemPosition].click();
      }
    }

    $instanceContainer.hide();
    $(".column").hide();
    activeColumn = firstColumn;
    relativePosition = 0;

    for (var i = 0; i < allButFirst.length; i++) {
      allButFirst[i].remove();
    }

    if (options.onEnd) {
      options.onEnd();
    }
  });
  return this;
}
},{}],"ui/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ui = ui;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _modal = require("./modal");

var _touchUI = require("./touchUI");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ui(parametter1) {
  switch ((0, _typeof2.default)(parametter1)) {
    case "string":
      console.log(parametter1);
      break;
  }
}

ui.modal = _modal.simpleModal;
ui.touchUI = _touchUI.touchUI;
},{"@babel/runtime/helpers/typeof":"../node_modules/@babel/runtime/helpers/typeof.js","./modal":"ui/modal.js","./touchUI":"ui/touchUI.js"}],"html/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.html = html;

function html(htmlContent, objData) {
  var returnObj = {};

  returnObj.to = returnObj.appendTo = function (who) {
    document.querySelector(who).innerHTML += htmlContent;
    returnObj.app = new Vue(objData);
    return returnObj;
  };

  return returnObj;
}
},{}],"yengine/Game.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Game = Game;

function Game(options) {
  options = options || {};
  var update0Registred = [{
    id: 0,
    enabled: true,
    fn: function fn(updateObject) {}
  }];
  var update20Registred = [];
  var update40Registred = [];
  var update60Registred = [];
  var config = {
    type: options.type || Phaser.AUTO,
    width: options.width || window.innerWidth,
    parent: options.parent || "root",
    autoResize: options.autoResize || true,
    height: options.height || window.innerHeight,
    physics: {
      default: "arcade",
      arcade: {
        debug: options.debug || true,
        gravity: options.gravity || {
          y: 0
        }
      }
    },
    scene: {
      preload: function preload() {
        options.preload.apply(this);
      },
      create: function create() {
        _create.apply(this);

        options.create.apply(this);
      },
      update: function update() {
        for (var i = 0; i < update0Registred.length; i++) {
          if (update0Registred[i].enabled) {
            update0Registred[i].fn.apply(this);
          }
        }

        options.update.apply(this);
      }
    }
  };
  var gameObject = new Phaser.Game(config);
  return {
    GameInstance: gameObject,
    registerUpdate: function registerUpdate(updateFn, extra) {
      update0Registred.push({
        fn: updateFn,
        enabled: true
      });
    }
  };
}

function update() {}

function _create() {}
},{}],"yengine/Sprite.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sprite = Sprite;
var spriteCreationCount = 0;

function Sprite(game, options) {
  spriteCreationCount++;
  var spriteObject = game.physics.add.sprite(0, 0, options.texture);
  spriteObject.setOrigin(0.5);
  spriteObject.x = 0;
  spriteObject.y = 0;
  spriteObject.displayWidth = 20;
  spriteObject.displayHeight = 20;
  spriteObject.width = 20;
  spriteObject.height = 20;

  spriteObject.onUpdate = function (callback, identifier) {};

  spriteObject.onPointerDown = function (callback, identifier) {
    onPointerDown(spriteObject, callback, identifier);
  };

  spriteObject.onInteract = function (callback, type) {
    if (yy.device.isTouch()) {
      var selectionDesire = 0;
      var selectionTimer = {};
      spriteObject.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
        clearTimeout(selectionTimer);
        selectionTimer = setTimeout(function () {
          // on hold 500ms
          selectionDesire = 1;
        }, 500);
      });
      spriteObject.setInteractive().on('pointerup', function (pointer, localX, localY, event) {
        if (selectionDesire === 1) {
          callback.apply(spriteObject, [1, pointer, localX, localY, event]);
        } else {
          callback.apply(spriteObject, [0, pointer, localX, localY, event]);
        }

        clearTimeout(selectionTimer);
        selectionDesire = 0;
      });
    }
  };

  spriteObject.resize = function (w, h) {
    spriteObject.displayWidth = w;
    spriteObject.displayHeight = h;
    spriteObject.width = w;
    spriteObject.height = h;
  };

  spriteObject.cameraFollow = function () {
    game.cameras.main.startFollow(spriteObject);
  };

  spriteObject.ydata = {};
  console.log(spriteObject.ydata);
  return spriteObject;
}

function onPointerDown(sprite, callback, identifier) {
  if (sprite._yengine_onPinterDown === undefined) {
    sprite._yengine_onPinterDown = [];
  }

  sprite.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
    callback.apply(sprite, [pointer, localX, localY, event]);
  });
}

function offPointerDown(sprite, event, identifier) {}
},{}],"yengine/ui/VirtualJoystick.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VirtualJoystick = VirtualJoystick;

function VirtualJoystick(options) {
  options = options || {};
  var joystickArea = $("<div></div>").attr("class", "virtualJoystickArea").appendTo(options.parent || $("#root")).css({
    "z-index": options.zIndex || 10,
    "color": "white",
    "position": "absolute",
    "width": options.width || "100px",
    "height": options.height || "100px",
    "background": "rgba(0, 0, 0, 0)"
  });

  switch (options.position) {
    default:
    case "left-bottom":
      joystickArea.css({
        "left": 0,
        "bottom": 0
      });
      break;

    case "right-bottom":
      joystickArea.css({
        "right": 0,
        "bottom": 0
      });
      break;

    case "left-top":
      joystickArea.css({
        "left": 0,
        "top": 0
      });
      break;

    case "right-top":
      joystickArea.css({
        "right": 0,
        "top": 0
      });
      break;
  }

  var staticNipple = nipplejs.create({
    zone: joystickArea[0],
    mode: options.mode || 'dynamic',
    color: options.color || 'white'
  }); // Joystick
  // if (yy.device.isTouch()) {

  staticNipple.on('move', function (evt, data) {
    if (data.direction !== undefined) {
      var rad = data.angle.radian;

      if (rad < 3) {
        data.yRad = -rad;
      } else {
        data.yRad = 6 - rad;
      }

      if (options.onMove) {
        options.onMove(evt, data);
      }
    }
  });
  staticNipple.on('end', function (evt, data) {
    if (options.onEnd) {
      options.onEnd(evt, data);
    }
  });
  staticNipple.on('start', function (evt, data) {
    if (options.onStart) {
      options.onStart(evt, data);
    }
  }); // }
}
},{}],"yengine/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.yengine = void 0;

var _Game = require("./Game");

var _Sprite = require("./Sprite");

var _VirtualJoystick = require("./ui/VirtualJoystick");

var yengine = {
  Game: _Game.Game,
  Sprite: _Sprite.Sprite,
  ui: {
    VirtualJoystick: _VirtualJoystick.VirtualJoystick
  }
};
exports.yengine = yengine;
},{"./Game":"yengine/Game.js","./Sprite":"yengine/Sprite.js","./ui/VirtualJoystick":"yengine/ui/VirtualJoystick.js"}],"yy.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ready = require("./events/ready");

var _loader = require("./loader");

var _application = require("./utils/application");

var _device = require("./utils/device");

var _random = require("./utils/random");

var _registry = require("./utils/registry");

var _Search = require("./plugins/youtube/Search");

var _Ace = require("./plugins/Ace");

var _Player = require("./plugins/Youtube/Player");

var _yapi = require("./yapi");

var _ui = require("./ui");

var _html = require("./html");

var _yengine = require("./yengine");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function yy() {
  return _yy.apply(this, arguments);
} // Preload


function _yy() {
  _yy = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var readyCallback,
        wantedCallback,
        i,
        arg,
        callArray,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            readyCallback = function readyCallback(cb) {
              if (yy.iosDebug === true && yy.device.info().os == "iOS") {
                try {
                  cb();
                } catch (ex) {
                  alert(ex);
                }
              } else {
                cb();
              }
            };

            wantedCallback = null;
            i = 0;

          case 3:
            if (!(i < _args.length)) {
              _context.next = 35;
              break;
            }

            arg = _args[i];
            callArray = [];
            _context.t0 = (0, _typeof2.default)(arg);
            _context.next = _context.t0 === "function" ? 9 : _context.t0 === "object" ? 19 : _context.t0 === "string" ? 23 : 32;
            break;

          case 9:
            if (!(wantedCallback === null)) {
              _context.next = 13;
              break;
            }

            wantedCallback = arg;
            _context.next = 18;
            break;

          case 13:
            _context.t1 = callArray;
            _context.next = 16;
            return arg();

          case 16:
            _context.t2 = _context.sent;

            _context.t1.push.call(_context.t1, _context.t2);

          case 18:
            return _context.abrupt("break", 32);

          case 19:
            if (!Array.isArray(arg)) {
              _context.next = 22;
              break;
            }

            _context.next = 22;
            return (0, _loader.loadScript)(arg);

          case 22:
            return _context.abrupt("break", 32);

          case 23:
            if (!(arg.length > 4)) {
              _context.next = 29;
              break;
            }

            if (!(arg.substr(0, 4) === "css:")) {
              _context.next = 27;
              break;
            }

            _context.next = 27;
            return (0, _loader.loadCSS)(arg.substr(4));

          case 27:
            _context.next = 31;
            break;

          case 29:
            _context.next = 31;
            return (0, _loader.loadScript)(arg);

          case 31:
            return _context.abrupt("break", 32);

          case 32:
            i++;
            _context.next = 3;
            break;

          case 35:
            // endfor
            (0, _ready.ready)().then(function () {
              if (readyCallback !== null) {
                if (yy.createRoot === true) {
                  (0, _application.applyWebAppStyle)().then(function () {
                    // readyCallback(wantedCallback);
                    readyCallback(function () {
                      wantedCallback.apply(window, callArray);
                    });
                  });
                }
              } else {
                if (yy.createRoot === true) {
                  (0, _application.applyWebAppStyle)();
                }
              }
            });

          case 36:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _yy.apply(this, arguments);
}

yy.createRoot = true;
yy.iosDebug = true;
yy.ready = _ready.ready;
yy.loadScript = yy.load = _loader.loadScript;
yy.cdn = _loader.cdnList;
yy.loadCSS = _loader.loadCSS;
yy.writeCSS = _loader.writeCSS;
yy.http = _loader.http;
yy.ui = _ui.ui;
yy.html = _html.html; // yy.registerElements = registerElements;

yy.applyWebAppStyle = _application.applyWebAppStyle;
yy.device = _device.device;
yy.random = _random.random;
yy.registry = yy.reg = yy.memory = yy.mem = _registry.registry;
yy.tmp = _registry.temporal;
yy.Youtube = {
  search: {
    video: _Search.searchVideo,
    first: _Search.searchFirst,
    setAPIKey: _Search.setAPIKey
  },
  Player: _Player.Player
};
yy.Ace = _Ace.AceExport;
yy.yengine = _yengine.yengine;

yy.ms = function () {
  var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, ms);
  });
};

yy.seconds = function () {
  var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, ms * 1000);
  });
};

yy.version = "1.2.5";
yy.yapi = _yapi.yapi;
(function (global) {
  //  if (global.yy !== undefined) {
  // throw Error("yy variable already defined");
  //}
  global.yy = yy;

  yy.getGlobal = yy.global = function () {
    return global;
  };
}).call(void 0, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/typeof":"../node_modules/@babel/runtime/helpers/typeof.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","./events/ready":"events/ready.js","./loader":"loader.js","./utils/application":"utils/application.js","./utils/device":"utils/device.js","./utils/random":"utils/random.js","./utils/registry":"utils/registry.js","./plugins/youtube/Search":"plugins/youtube/Search.js","./plugins/Ace":"plugins/Ace.js","./plugins/Youtube/Player":"plugins/Youtube/Player.js","./yapi":"yapi/index.js","./ui":"ui/index.js","./html":"html/index.js","./yengine":"yengine/index.js"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51157" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","yy.js"], null)
//# sourceMappingURL=/yy.map