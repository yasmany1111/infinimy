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
})({"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
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

},{}],"node_modules/regenerator-runtime/runtime-module.js":[function(require,module,exports) {
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

},{"./runtime":"node_modules/regenerator-runtime/runtime.js"}],"node_modules/@babel/runtime/regenerator/index.js":[function(require,module,exports) {
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":"node_modules/regenerator-runtime/runtime-module.js"}],"node_modules/@babel/runtime/helpers/asyncToGenerator.js":[function(require,module,exports) {
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
},{}],"src/states/preload.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preload = preload;

function preload() {
  this.load.image("background_space_1", "assets/background/space_1.jpg");
  this.load.image("background_space_2", "assets/background/space_2.jpg"); // Asteroid

  for (var i = 0; i < 7; i++) {
    this.load.image("body_asteroid_" + i, "assets/sprite/galaxy_body/asteroid/" + i + ".png");
  } // Planet


  for (var i = 0; i < 9; i++) {
    this.load.image("body_planet_" + i, "assets/sprite/galaxy_body/planet/Planet" + i + ".png");
  } // Station


  for (var i = 0; i < 1; i++) {
    this.load.image("station_red_" + i, "assets/sprite/station/red_" + i + ".png");
  }

  this.load.image("tool_laser_1", "assets/sprite/tools/laser_beam_red.png");
  this.load.image("ship_1_normal", "assets/sprite/ship/built/ship_1_normal.png");
  this.load.image("ship_1_accelerate", "assets/sprite/ship/built/ship_1_accelerate.png");
}
},{}],"src/states/update.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = update;
exports.registerUpdate = registerUpdate;
exports.registerUpdate10 = registerUpdate10;
exports.registerUpdate20 = registerUpdate20;

var _create = require("./create");

var update10Count = 0;
var update20Count = 0;
var updateAt20 = [{
  name: "aslab",
  fn: function fn() {}
}];
var updateAt10 = [];
var updateDefault = [];

function update() {
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

function registerUpdate(fn) {
  updateDefault.push({
    name: count++,
    fn: fn
  });
}

function registerUpdate10(fn) {
  updateAt10.push({
    name: count++,
    fn: fn
  });
}

function registerUpdate20(fn) {
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
},{"./create":"src/states/create.js"}],"src/ui/keyboard.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerKeyboardEvents = registerKeyboardEvents;
exports.KeyboardHandler = void 0;
var KeyboardHandler;
exports.KeyboardHandler = KeyboardHandler;

function registerKeyboardEvents() {
  var key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  var key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  var key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  var key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  exports.KeyboardHandler = KeyboardHandler = {
    W: key_W,
    S: key_S,
    A: key_A,
    D: key_D
  };
}
},{}],"src/data/sectorName.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadSectorNames = loadSectorNames;
exports.getRandomSectorName = getRandomSectorName;
exports.SectorNamesArray = void 0;
var SectorNamesArray = [];
exports.SectorNamesArray = SectorNamesArray;

function loadSectorNames() {
  return new Promise(function (resolve) {
    yy.http.get("assets/db/list_sector_names.txt").then(function (listTxt) {
      exports.SectorNamesArray = SectorNamesArray = listTxt.split("\n");
      resolve();
    });
  });
}

function getRandomSectorName(seed) {
  return SectorNamesArray[yy.random.int(0, SectorNamesArray.length - 1)];
}
},{}],"src/classes/items/Minerals.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Minerals = void 0;
var Minerals = [{
  name: "iron",
  mass: 3,
  rarity: 1000
}, {
  name: "copper",
  mass: 3,
  rarity: 1000
}, {
  name: "uranium",
  mass: 10,
  rarity: 50
}, {
  name: "gold",
  mass: 8,
  rarity: 50
}, {
  name: "silver",
  mass: 6,
  rarity: 50
}, {
  name: "platinum",
  mass: 14,
  rarity: 50
}];
exports.Minerals = Minerals;
},{}],"src/sectors/generator.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateNewSector = generateNewSector;

var _sectorName = require("../data/sectorName");

var _Minerals = require("../classes/items/Minerals");

var demoSector = {
  // stored in [x][y]
  x: 0,
  y: 0,
  name: "pandora 1 xxxxxxxxx",
  staticAsteroids: []
};

function generateNewSector(options) {
  var sectorObject = {
    name: options.name || (0, _sectorName.getRandomSectorName)(),
    x: options.x,
    y: options.y
  };
  sectorObject.staticAsteroids = generateAsteroids(sectorObject);
  sectorObject.staticPlanets = generatePlanets(sectorObject);
  return sectorObject;
}

function generateAsteroids(sectorObject) {
  var numberOfAttempts = yy.random.int(0, 100);
  var startPos = 0;
  var endPos = 1024 * 6 - 700;
  var resultObjectCont = [];
  var asteroidDemo = {
    x: 0,
    y: 0,
    width: 500,
    height: 700,
    sceneReference: undefined
  };

  for (var i = 0; i < numberOfAttempts; i++) {
    var posX = yy.random.int(startPos, endPos);
    var posY = yy.random.int(startPos, endPos);
    var aspect = yy.random.int(1, 10) / 10;
    var width = 500 * aspect;
    var height = 700 * aspect;
    var textureNumber = yy.random.int(0, 7);
    var minerals = [];

    for (var c = 0; c < _Minerals.Minerals.length; c++) {
      var cMineral = _Minerals.Minerals[c];

      if (yy.random.chance(cMineral.rarity, 1000)) {
        minerals.push({
          mineral: cMineral,
          amount: yy.random.int(1, 500)
        });
      }
    }

    var obj = {
      x: posX,
      y: posY,
      width: width,
      height: height,
      texture: "body_asteroid_" + textureNumber,
      "type": "asteroid",
      "minerals": minerals
    };

    if (checkCollision(obj, resultObjectCont) === false) {
      resultObjectCont.push(obj);
    }
  }

  return resultObjectCont;
}

function generatePlanets(sectorObject) {
  var numberOfAttempts = yy.random.int(0, 5);
  var startPos = 0;
  var endPos = 1024 * 6 - 300; //

  var resultObjectCont = [];
  var planetDemo = {
    x: 0,
    y: 0,
    width: 150,
    height: 150,
    sceneReference: undefined
  };

  for (var i = 0; i < numberOfAttempts; i++) {
    var newPlanet = createPlanet({
      x: yy.random.int(startPos, endPos),
      y: yy.random.int(startPos, endPos),
      aspect: yy.random.int(5, 20) / 10,
      width: 150,
      height: 150,
      texture: "body_planet_" + yy.random.int(0, 9),
      hasStation: yy.random.chance(100)
    });

    if (checkCollision(newPlanet, resultObjectCont) === false) {
      if (checkCollision(newPlanet, sectorObject.staticAsteroids) === false) {
        resultObjectCont.push(newPlanet);
      }
    }
  }

  return resultObjectCont;
}

function checkCollision(currentObject, currentArray) {
  var collides = false;
  var objX = currentObject.x;
  var objY = currentObject.y;
  var objWidth = currentObject.width;
  var objHeight = currentObject.height;

  for (var i = 0; i < currentArray.length; i++) {
    if (Phaser.Geom.Intersects.RectangleToRectangle(new Phaser.Geom.Rectangle(objX, objY, objWidth, objHeight), new Phaser.Geom.Rectangle(currentArray[i].x, currentArray[i].y, currentArray[i].width, currentArray[i].height))) {
      collides = true;
    }
  }

  return collides;
}

function createPlanet(options) {
  var obj = {
    "type": "planet",
    hasStation: options.hasStation,
    //
    x: options.x || 0,
    y: options.y || 0,
    width: options.width * options.aspect || 150,
    height: options.height * options.aspect || 150,
    texture: options.texture || "body_planet_0"
  };

  if (options.hasStation) {
    var newStation = {
      x: obj.x,
      y: obj.y - 230,
      texture: "station_red_0"
    };
    obj.station = newStation;
  }

  return obj;
}
},{"../data/sectorName":"src/data/sectorName.js","../classes/items/Minerals":"src/classes/items/Minerals.js"}],"src/api/angle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.angleBetweenSprites = angleBetweenSprites;
exports.angleToSprite = angleToSprite;

function angleBetweenSprites(spriteOrigin, spriteDestiny, center) {
  if (center === true) {
    var angle = Phaser.Math.Angle.Between(spriteOrigin.x, spriteOrigin.y, spriteDestiny.x + spriteDestiny.displayWidth / 2, spriteDestiny.y + spriteDestiny.displayHeight / 2);
    return angle;
  } else {
    var angle = Phaser.Math.Angle.Between(spriteOrigin.x, spriteOrigin.y, spriteDestiny.x, spriteDestiny.y);
    return angle;
  }
}

function angleToSprite(spriteOrigin, spriteDestiny, center) {
  center = center || true;

  if (center === true) {
    var angle = Phaser.Math.Angle.Between(spriteOrigin.x, spriteOrigin.y, spriteDestiny.x + spriteDestiny.displayWidth / 2, spriteDestiny.y + spriteDestiny.displayHeight / 2);
    return angle;
  } else {
    var angle = Phaser.Math.Angle.Between(spriteOrigin.x, spriteOrigin.y, spriteDestiny.x, spriteDestiny.y);
    return angle;
  }
}
},{}],"src/api/assistant.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assistantSpeak = assistantSpeak;

function assistantSpeak(what) {
  responsiveVoice.speak(what);
}
},{}],"src/api/overlayInfo.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showOverlayOver = showOverlayOver;
var overlayCounter = 0;

function showOverlayOver(options) {
  overlayCounter += 1;
  options = options || {};
  options.remove = true;

  if (options.remove) {
    $(".quickOverlay").remove();
  }

  $("#root").append("\n        <div class=\"quickOverlay\" id=\"quickOverlay".concat(overlayCounter, "\">\n            <div class=\"quickOverlayCloseContainer\">X</div>\n            <div class=\"quickOverlayData\">\n                ").concat(options.content, "\n            </div>\n            \n        </div>\n    "));
  var qo = $("#quickOverlay" + overlayCounter);
  qo.find(".quickOverlayCloseContainer").click(function () {
    qo.remove();
  });
}
},{}],"src/ui/interactiveSprites.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSelectedSprite = setSelectedSprite;
exports.pointerUp = pointerUp;
exports.globalPointerUp = globalPointerUp;
exports.getSelectedSprite = getSelectedSprite;

var _create = require("../states/create");

var _angle = require("../api/angle");

var _assistant = require("../api/assistant");

var _overlayInfo = require("../api/overlayInfo");

var SelectedSprite = null;
var selectionTimer = undefined;
var selectionDesire = 0;

function setSelectedSprite(obj) {
  // on down
  SelectedSprite = obj;
  onDown(SelectedSprite);
  selectionDesire = 0;
  selectionTimer = setTimeout(function () {
    // on hold 500ms
    selectionDesire = 1;
  }, 500); // SelectedSprite.Sprite.destroy();
  // SelectedSprite.Sprite.memoryReference.destroy = true;
}

function onDown() {}

function onHold() {
  switch (SelectedSprite.Sprite.memoryReference.type) {
    case "asteroid":
      var resources = "";

      for (var i = 0; i < SelectedSprite.Sprite.memoryReference.minerals.length; i++) {
        var cMineral = SelectedSprite.Sprite.memoryReference.minerals[i];
        resources += "\n                    <div style=\"margin-left: 5px;\">".concat(cMineral.mineral.name, "</div>\n                    <div style=\"margin-left: 5px;\">").concat(cMineral.amount, "</div>\n                    <br>\n                ");
      }

      (0, _overlayInfo.showOverlayOver)({
        content: "\n                    <div>Asteroid</div>\n                    <div>Resources: </div>\n                    <div>".concat(resources, "</div>\n                ")
      });
      break;
  }

  (0, _assistant.assistantSpeak)(SelectedSprite.Sprite.memoryReference.type);
}

function pointerUp(obj) {
  switch (selectionDesire) {
    case 0:
      _create.playerShip.desiredAngle = (0, _angle.angleBetweenSprites)(_create.playerShip.Sprite, SelectedSprite.Sprite, true);
      break;

    case 1:
      onHold();
      break;
  }

  clearTimeout(selectionTimer);
  selectionDesire = 0;
}

function globalPointerUp() {}

function getCenter(x, y, w, h) {
  return {
    x: x + w / 2,
    y: y + h / 2
  };
}

function getSelectedSprite() {
  return SelectedSprite;
}
},{"../states/create":"src/states/create.js","../api/angle":"src/api/angle.js","../api/assistant":"src/api/assistant.js","../api/overlayInfo":"src/api/overlayInfo.js"}],"src/classes/GameSprite.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameSprite = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GameSprite =
/*#__PURE__*/
function () {
  function GameSprite(Game) {
    var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var texture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";

    _classCallCheck(this, GameSprite);

    this.Sprite = Game.physics.add.sprite(x, y, texture);
    this.Sprite.setOrigin(0);
    this.Sprite.classInstance = this;
    return this;
  }

  _createClass(GameSprite, [{
    key: "onPointerDown",
    value: function onPointerDown(fn) {
      var $this = this;
      this.Sprite.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
        fn($this); // setSelectedSprite($this.sprite);
      });
    }
  }, {
    key: "onPointerUp",
    value: function onPointerUp(fn) {
      var $this = this;
      this.Sprite.setInteractive().on('pointerup', function (pointer, localX, localY, event) {
        fn($this); // setSelectedSprite($this.sprite);
      });
    }
  }]);

  return GameSprite;
}();

exports.GameSprite = GameSprite;
},{}],"src/sectors/manager.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSectorManager = registerSectorManager;
exports.generateAndLoadSector = generateAndLoadSector;
exports.onSectorChange = onSectorChange;
exports.getCurrentSector = getCurrentSector;
exports.SectorSize = exports.CurrentSector = void 0;

var _update = require("../states/update");

var _create = require("../states/create");

var _generator = require("./generator");

var _interactiveSprites = require("../ui/interactiveSprites");

var _GameSprite = require("../classes/GameSprite");

/* READONLY */
var CurrentSector = {
  x: 0,
  y: 0 // 6000x6000

};
exports.CurrentSector = CurrentSector;
var SectorSize = 1024 * 6;
exports.SectorSize = SectorSize;
var sectorChangeEvents = [];
var SectorsInMemory = {}; // SectorsInMemory[x][y]

function registerSectorManager(Game) {
  (0, _update.registerUpdate20)(function () {
    var posX = _create.playerShip.Sprite.x;
    var posY = _create.playerShip.Sprite.y; // LEFT

    if (posX < 0) {
      // go left, -1
      generateAndLoadSector(CurrentSector.x - 1, CurrentSector.y, Game);
      _create.playerShip.Sprite.x = SectorSize - 100;
    } // RIGHT


    if (posX > SectorSize) {
      // go right, +1
      generateAndLoadSector(CurrentSector.x + 1, CurrentSector.y, Game);
      _create.playerShip.Sprite.x = 100;
    } // TOP


    if (posY < 0) {
      // go top, +1
      generateAndLoadSector(CurrentSector.x, CurrentSector.y - 1, Game);
      _create.playerShip.Sprite.y = SectorSize - 100;
    } // Down


    if (posY > SectorSize) {
      // go bot, -1
      generateAndLoadSector(CurrentSector.x, CurrentSector.y + 1, Game);
      _create.playerShip.Sprite.y = 100;
    }
  });
}

function destroyCurrentSectorData() {
  var cSector = SectorsInMemory[CurrentSector.x][CurrentSector.y];

  for (var i = 0; i < cSector.staticAsteroids.length; i++) {
    var cAsteroid = cSector.staticAsteroids[i];
    if (cAsteroid.sceneReference !== undefined) cAsteroid.sceneReference.Sprite.destroy();
  }

  for (var i = 0; i < cSector.staticPlanets.length; i++) {
    var cPlanet = cSector.staticPlanets[i];
    if (cPlanet.sceneReference !== undefined) cPlanet.sceneReference.Sprite.destroy();
    if (cPlanet.station !== undefined) if (cPlanet.station.sceneReference !== undefined) cPlanet.station.sceneReference.Sprite.destroy();
  }
}

function loadSectorData(x, y) {
  destroyCurrentSectorData();

  for (var i = 0; i < SectorsInMemory[x][y].staticAsteroids.length; i++) {
    var nAsteroid = SectorsInMemory[x][y].staticAsteroids[i];

    if (nAsteroid.destroy !== true) {
      var sAsteroid = new _GameSprite.GameSprite(this, nAsteroid.x, nAsteroid.y, nAsteroid.texture);
      sAsteroid.Sprite.displayWidth = nAsteroid.width;
      sAsteroid.Sprite.displayHeight = nAsteroid.height;
      sAsteroid.Sprite.setDepth(3);
      sAsteroid.Sprite.setOrigin(0);
      sAsteroid.Sprite.memoryReference = nAsteroid;
      nAsteroid.sceneReference = sAsteroid;
      sAsteroid.onPointerDown(function (Sprite) {
        (0, _interactiveSprites.setSelectedSprite)(Sprite);
      });
      sAsteroid.onPointerUp(function (Sprite) {
        (0, _interactiveSprites.pointerUp)(Sprite);
      });
    } //this.physics.add.overlap(playerShip.Sprite, sAsteroid.Sprite, function () {
    // console.log("touching bitches");
    //});

  }

  for (var i = 0; i < SectorsInMemory[x][y].staticPlanets.length; i++) {
    var nPlanet = SectorsInMemory[x][y].staticPlanets[i];

    if (nPlanet.destroy !== true) {
      var spritePlanet = new _GameSprite.GameSprite(this, nPlanet.x, nPlanet.y, nPlanet.texture);
      spritePlanet.Sprite.displayWidth = nPlanet.width;
      spritePlanet.Sprite.displayHeight = nPlanet.height;
      spritePlanet.Sprite.setDepth(3);
      spritePlanet.Sprite.setOrigin(0);
      spritePlanet.Sprite.memoryReference = nPlanet;
      nPlanet.sceneReference = spritePlanet;
      spritePlanet.onPointerDown(function (Sprite) {
        (0, _interactiveSprites.setSelectedSprite)(Sprite);
      });
      spritePlanet.onPointerUp(function (Sprite) {
        (0, _interactiveSprites.pointerUp)(Sprite);
      });

      if (nPlanet.hasStation) {
        var spriteStation = new _GameSprite.GameSprite(this, nPlanet.station.x, nPlanet.station.y, nPlanet.station.texture);
        spriteStation.Sprite.displayWidth = nPlanet.width / 2;
        spriteStation.Sprite.displayHeight = nPlanet.height / 2;
        spriteStation.Sprite.setDepth(3);
        spriteStation.Sprite.setOrigin(0);
        spriteStation.Sprite.x = nPlanet.x + nPlanet.width / 2 / 2;
        spriteStation.Sprite.y = nPlanet.y - nPlanet.height / 2;
        nPlanet.station.sceneReference = spriteStation;
      }
    } //this.physics.add.overlap(playerShip.Sprite, sAsteroid.Sprite, function () {
    // console.log("touching bitches");
    //});

  }
}

function generateAndLoadSector(x, y, Game) {
  if (SectorsInMemory[x] === undefined) {
    SectorsInMemory[x] = {};
  }

  if (SectorsInMemory[x][y] === undefined) {
    SectorsInMemory[x][y] = (0, _generator.generateNewSector)({
      x: x,
      y: y
    });
  }

  loadSectorData.apply(Game, [x, y]);
  exports.CurrentSector = CurrentSector = SectorsInMemory[x][y];

  for (var i = 0; i < sectorChangeEvents.length; i++) {
    sectorChangeEvents[i].apply(Game, [CurrentSector]);
  }
}

function onSectorChange(newFn) {
  sectorChangeEvents.push(newFn);
}

function getCurrentSector() {
  return SectorsInMemory[CurrentSector.x][CurrentSector.y];
}
},{"../states/update":"src/states/update.js","../states/create":"src/states/create.js","./generator":"src/sectors/generator.js","../ui/interactiveSprites":"src/ui/interactiveSprites.js","../classes/GameSprite":"src/classes/GameSprite.js"}],"src/classes/tools/miningLaser.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MiningLaser = MiningLaser;

var _manager = require("../../sectors/manager");

function MiningLaser(Game, options) {
  var returnLaser = {
    active: false,
    selected: false
  };
  var laserSprite = Game.physics.add.sprite(40, 0, "tool_laser_1");
  var laserPhysiscs = Game.physics.add.sprite(40, 0, "");
  laserSprite.displayWidth = 100;
  laserSprite.displayHeight = 20;
  laserSprite.body.enable = false;
  laserSprite.visible = false;
  laserPhysiscs.visible = false;
  options.toolContainer.add(laserSprite);
  options.toolContainer.add(laserPhysiscs);
  returnLaser.sprite = laserSprite;
  var hitAsteroid = false;
  var miningInerval = 0;

  returnLaser.update = function () {
    if (returnLaser.active) {
      if (hitAsteroid === false) {
        laserPhysiscs.x += 5;

        if (laserPhysiscs.x > 40 + 40) {
          laserPhysiscs.x = 40;
        }
      } else {
        // active and hitting asteroid...
        miningInerval++;

        if (miningInerval > 30) {
          console.log(hitAsteroid.classInstance);

          if (yy.random.chance(50)) {
            options.ship.Inventory.addItem("iron", 1);
          }

          miningInerval = 0;
        }
      }
    }
  };

  function checkIfAsteroidInRange() {} // real mining should be only por player
  // ai should go to a position where minng is always true (laft top bopt etc)
  // and simulated by timing events


  (0, _manager.onSectorChange)(function (Game) {
    var cSector = (0, _manager.getCurrentSector)();

    for (var i = 0; i < cSector.staticAsteroids.length; i++) {
      var asteroid = cSector.staticAsteroids[i];
      this.physics.add.overlap(laserPhysiscs, asteroid.sceneReference.Sprite, function (a, b) {
        hitAsteroid = b;
      });
    }
  });

  returnLaser.setActive = function (state) {
    laserSprite.visible = state;
    returnLaser.active = state;

    if (state) {}
  };

  returnLaser.onMove = function () {
    hitAsteroid = false;
  };

  return returnLaser;
}
},{"../../sectors/manager":"src/sectors/manager.js"}],"src/classes/tools/navigator.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Navigator = Navigator;

function Navigator(Game, options) {
  var returnNavigator = {
    active: false
  };
  var lastPointer = {
    x: 0,
    y: 0
  };
  var playerShip = options.playerShip;
  Game.input.on('pointermove', function (pointer) {
    lastPointer = pointer;
  }, this);

  returnNavigator.update = function () {
    var angle = Phaser.Math.Angle.Between(playerShip.Sprite.x, playerShip.Sprite.y, lastPointer.x + Game.cameras.main.scrollX, lastPointer.y + Game.cameras.main.scrollY);
    playerShip.desiredAngle = angle;

    if (playerShip.desiredAngle === playerShip.Sprite.rotation) {
      playerShip.desiredAngle = false;
    }
  };

  returnNavigator.setActive = function (state) {
    returnNavigator.active = state;
  };

  returnNavigator.onMove = function () {};

  return returnNavigator;
}
},{}],"src/classes/systems/modules/Inventory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InventoryModule = InventoryModule;

function InventoryModule(options) {
  options = options || {};
  var inventorySystem = {
    items: [],
    capacity: options.capacity || 500,
    getUsed: function getUsed() {
      return getCapacityUsed(inventorySystem);
    }
  };

  inventorySystem.addItem = function (name, amount, mass, force) {
    addItem(inventorySystem, name, amount, mass, force);
  };

  inventorySystem.getItem = function (name) {
    return findItemStack(inventorySystem, name);
  };

  return inventorySystem;
}

function getCapacityUsed(inventory) {
  var capacityUsed = 0;

  for (var i = 0; i < inventory.items.length; i++) {
    capacityUsed += inventory.items[i].mass * inventory.items[i].amount;
  }

  return capacityUsed;
}

function fits(inventory, amount, mass) {
  var capacityUsed = 0;

  for (var i = 0; i < inventory.items.length; i++) {
    capacityUsed += inventory.items[i].mass * inventory.items[i].amount;
  }

  if (capacityUsed + amount * mass <= inventory.capacity) {
    return true;
  } else {
    return false;
  }
}

function findItemStack(inventory, name) {
  var ret = undefined;

  for (var i = 0; i < inventory.items.length; i++) {
    if (inventory.items[i].name === name) {
      ret = inventory.items[i];
    }
  }

  return ret;
}

function addItem(inventory, name, amount, mass, force) {
  mass = mass || 1;
  amount = amount || 1;
  force = force || false;

  if (amount > 0) {
    // add
    var stack = findItemStack(inventory, name);

    if (stack === undefined) {
      stack = {
        name: name,
        amount: 0,
        mass: mass || 1
      };
      inventory.items.push(stack);
    }

    if (fits(inventory, amount, mass)) {
      stack.amount += amount;
    } else {
      if (force) {
        stack.amount += amount;
      }
    }
  } else if (amount < 0) {
    // subsrtract
    var stack = findItemStack(inventory, name);

    if (stack === undefined) {
      return false;
    }

    if (stack.amount >= amount) {
      stack.amount += amount;
    } else {
      if (force) {
        stack.amount += amount;
      }
    }
  }

  emptyStackClear(inventory);
}

function emptyStackClear(inventory) {
  var inventoryItems = [];

  for (var i = 0; i < inventory.items.length; i++) {
    if (inventory.items[i].amount > 0) {
      inventoryItems.push(inventory.items[i]);
    }
  }

  inventory.items = inventoryItems;
}
},{}],"src/classes/systems/modules/Engine.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EngineModule = EngineModule;
exports.EngineModule2 = EngineModule2;

function EngineModule(options) {
  options = options || {};
  var engineModule = {
    "acceleration": 500,
    "rotation": 0.06,
    "maxSpeed": 1000,
    "maxDrag": 10000,
    getUsed: function getUsed() {
      return getCapacityUsed(inventorySystem);
    }
  };
  return engineModule;
}

function EngineModule2(options) {
  options = options || {};
  var engineModule = {
    "acceleration": 200,
    "rotation": 0.008,
    "maxSpeed": 300,
    "maxDrag": 100,
    getUsed: function getUsed() {
      return getCapacityUsed(inventorySystem);
    }
  };
  return engineModule;
}
},{}],"src/classes/PlayerShip.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlayerShip = void 0;

var _update = require("../states/update");

var _create = require("../states/create");

var _keyboard = require("../ui/keyboard");

var _miningLaser = require("./tools/miningLaser");

var _navigator = require("./tools/navigator");

var _Inventory = require("./systems/modules/Inventory");

var _Engine = require("./systems/modules/Engine");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var isTouch = false;

var PlayerShip =
/*#__PURE__*/
function () {
  function PlayerShip(Game) {
    var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var texture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";

    _classCallCheck(this, PlayerShip);

    this.Sprite = Game.physics.add.sprite(x, y, texture);
    this.Sprite.classInstance = this;
    this.Sprite.setOrigin(0.5);
    this.Sprite.setDrag(300);
    this.Sprite.setAngularDrag(400);
    this.Sprite.setMaxVelocity(200);
    var $this = this;
    this.textureName = texture.replace("_normal", "");
    this.wantAccelerate = false;
    this.desiredAngle = false; // -1 left 0 none 1 right

    this.Speed = 100;
    this.rotationSpeed = 0.005;
    this.toolContainer = Game.add.container(0, 0);
    this.toolContainer.setDepth(9);
    this.tools = [];
    this.tools.push(new _miningLaser.MiningLaser(Game, {
      toolContainer: this.toolContainer,
      ship: this
    }));
    this.tools.push(new _navigator.Navigator(Game, {
      toolContainer: this.toolContainer,
      playerShip: this
    }));
    this.selectedTool = this.tools[0];
    this.selectedTool.selected = true; // Modules

    this.modules = [];
    this.Inventory = (0, _Inventory.InventoryModule)();
    this.modules.push({
      "type": "inventory",
      module: this.Inventory
    });
    this.Engine = new _Engine.EngineModule();
    this.modules.push({
      "type": "engine",
      module: this.Engine
    });
    this.Speed = this.Engine.acceleration;
    this.Sprite.setDrag(this.Engine.maxDrag);
    this.Sprite.setAngularDrag(400);
    this.Sprite.setMaxVelocity(this.Engine.maxSpeed);
    this.rotationSpeed = this.Engine.rotation; // Update

    (0, _update.registerUpdate)(function () {
      $this.update.apply($this, [Game]);
    });
    isTouch = yy.device.isTouch();
    return this;
  }

  _createClass(PlayerShip, [{
    key: "toolButtonDown",
    value: function toolButtonDown() {
      this.selectedTool.setActive(true);
    }
  }, {
    key: "toolButtonUp",
    value: function toolButtonUp() {
      this.selectedTool.setActive(false);
    }
  }, {
    key: "selectTool",
    value: function selectTool(indexOrName) {
      this.selectedTool.selected = false;
      this.selectedTool = this.tools[indexOrName];
      this.selectedTool.selected = true;
    }
  }, {
    key: "update",
    value: function update(Game) {
      moveHandler.apply(this, [Game]);
      this.move.apply(this, [Game]);
      this.toolContainer.setPosition(this.Sprite.x, this.Sprite.y);
      this.toolContainer.setAngle(this.Sprite.body.rotation);
      this.selectedTool.update();
    }
  }, {
    key: "accelerate",
    value: function accelerate(Game) {
      Game.physics.velocityFromRotation(this.Sprite.rotation, this.Speed, this.Sprite.body.acceleration);
    }
  }, {
    key: "move",
    value: function move(Game) {
      // acc
      if (this.wantAccelerate === true) {
        this.accelerate.apply(this, [Game]);
        this.Sprite.setTexture(this.textureName + "_accelerate");
        this.selectedTool.onMove();
      } else {
        this.Sprite.setAcceleration(0);
        this.Sprite.setTexture(this.textureName + "_normal");
      } // only for ai and joystick


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
      } else {}
    }
  }]);

  return PlayerShip;
}();

exports.PlayerShip = PlayerShip;

function moveHandler(Game) {
  // PLayer
  if (_keyboard.KeyboardHandler.A.isDown) {
    this.desiredAngle = false;
    this.Sprite.rotation -= this.rotationSpeed;
    this.selectedTool.onMove();
  } else if (_keyboard.KeyboardHandler.D.isDown) {
    this.desiredAngle = false;
    this.Sprite.rotation += this.rotationSpeed;
    this.selectedTool.onMove();
  }

  if (_keyboard.KeyboardHandler.W.isDown) {
    this.wantAccelerate = true;
  } else if (_keyboard.KeyboardHandler.S.isDown) {
    this.wantAccelerate = false;
  } // this.desiredAngle = false; // since player controlled by keys, no need

}
},{"../states/update":"src/states/update.js","../states/create":"src/states/create.js","../ui/keyboard":"src/ui/keyboard.js","./tools/miningLaser":"src/classes/tools/miningLaser.js","./tools/navigator":"src/classes/tools/navigator.js","./systems/modules/Inventory":"src/classes/systems/modules/Inventory.js","./systems/modules/Engine":"src/classes/systems/modules/Engine.js"}],"src/ui/debugger.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateTopDebugger = generateTopDebugger;

var _update = require("../states/update");

var _create = require("../states/create");

var _manager = require("../sectors/manager");

var _main = require("../main");

function generateTopDebugger() {
  var debugDisplay = $("<div></div>").attr("id", "debugDisplay").appendTo($("#root")).css({
    "display": "none",
    "z-index": 5,
    "color": "white",
    "position": "absolute",
    "top": "0px",
    "right": "0px",
    "background": " rgba(0, 0, 0, 0.5)",
    "padding": "5px"
  }).html("\n            <span style=\"color: lime\" id=\"debug_PlayerX\"></span>x, <span style=\"color: lime\" id=\"debug_PlayerY\"></span>y\n            <br>\n            <span style=\"color: purple\" id=\"debug_PlayerSectorX\"></span>x, <span style=\"color: purple\" id=\"debug_PlayerSectorY\"></span>y\n            &nbsp;&nbsp;<span style=\"color: #de26de\" id=\"debug_PlayerSectorName\"></span>\n            <br>\n            <span style=\"color: lime\" id=\"debug_PointerX\"></span>x, <span style=\"color: lime\" id=\"debug_PointerY\"></span>y\n            <br>\n            <span style=\"color: lime\" id=\"debug_free1\"></span><span id=\"debug_free1_type\"></span>\n            <br>\n            <span style=\"color: lime\" id=\"debug_free2\"></span><span id=\"debug_free2_type\"></span>\n        ");
  ;
  window.i_debug = {};

  window.i_debug.inertiaToggle = function () {
    _create.playerShip.toggleInertiaDampeners();
  };

  window.i_debug.logGame = function () {
    console.log((0, _main.getGameReference)());
    console.log(_create.gameReference);
  };

  window.i_debug.logPlayer = function () {
    console.log(_create.playerShip);
  };

  (0, _update.registerUpdate20)(function (Game) {
    return;
    var playerX = parseInt(_create.playerShip.Sprite.x);
    var playerY = parseInt(_create.playerShip.Sprite.y);
    $("#debug_PlayerX").html(playerX);
    $("#debug_PlayerY").html(playerY);
    $("#debug_PlayerSectorX").html(_manager.CurrentSector.x);
    $("#debug_PlayerSectorY").html(_manager.CurrentSector.y);
    $("#debug_PlayerSectorName").html(_manager.CurrentSector.name);
  });

  _create.gameReference.input.on('pointermove', function (pointer) {
    return;
    var x = pointer.x;
    var y = pointer.y;
    $("#debug_PointerX").html(x);
    $("#debug_PointerY").html(y);
  }, this);
}
},{"../states/update":"src/states/update.js","../states/create":"src/states/create.js","../sectors/manager":"src/sectors/manager.js","../main":"src/main.js"}],"src/states/create.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.gameReference = exports.cursors = exports.sceneBackground = exports.playerShip = void 0;

var _PlayerShip = require("../classes/PlayerShip");

var _manager = require("../sectors/manager");

var _keyboard = require("../ui/keyboard");

var _debugger = require("../ui/debugger");

var _overlayInfo = require("../api/overlayInfo");

var playerShip, sceneBackground;
exports.sceneBackground = sceneBackground;
exports.playerShip = playerShip;
var cursors;
exports.cursors = cursors;
var gameReference;
exports.gameReference = gameReference;

function create() {
  exports.gameReference = gameReference = this; //SceneBackground = this.add.tileSprite(0, 0, 4000, 4000, 'background_space_2')//.setScrollFactor(0);
  // SceneBackground = this.add.image(0, 0, 'background_space_2').setScrollFactor(0);

  var cuadricula = 6;

  for (var x = -1; x < cuadricula + 1; x++) {
    for (var y = -1; y < cuadricula + 1; y++) {
      this.add.image(x * 1024, y * 1024, 'background_space_2').setOrigin(0);
    }
  }
  /**
   * 0 0 : 1024 0
   * 1024 0 : 
   */


  exports.cursors = cursors = this.input.keyboard.createCursorKeys();
  exports.playerShip = playerShip = new _PlayerShip.PlayerShip(this, 10, 10, "ship_1_normal");
  playerShip.Sprite.displayWidth = 128 / 3.3;
  playerShip.Sprite.displayHeight = 117 / 3.3;
  playerShip.Sprite.setDepth(10);
  this.cameras.main.startFollow(playerShip.Sprite);
  (0, _manager.generateAndLoadSector)(0, 0, this);
  (0, _manager.registerSectorManager)(this);

  _keyboard.registerKeyboardEvents.apply(this);

  (0, _debugger.generateTopDebugger)();
  playerShip.Inventory.addItem("combustible nuclear", 1, 10, true);
  (0, _overlayInfo.showOverlayOver)({
    info1: "Asteroid",
    info2: "Resources: <br> iron: 10"
  });
}
},{"../classes/PlayerShip":"src/classes/PlayerShip.js","../sectors/manager":"src/sectors/manager.js","../ui/keyboard":"src/ui/keyboard.js","../ui/debugger":"src/ui/debugger.js","../api/overlayInfo":"src/api/overlayInfo.js"}],"src/generalVariables.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAP_STATE = exports.uiDimensions = void 0;
var uiDimensions = {
  map: {
    width: 150,
    height: 150,
    type: "px"
  }
};
exports.uiDimensions = uiDimensions;
var MAP_STATE = {
  NOT_VISIBLE: 0,
  DEFAULT: 1,
  FULL_SCREEN: 2
};
exports.MAP_STATE = MAP_STATE;
},{}],"src/ui/virtualJoystick.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateVirtualJoystick = generateVirtualJoystick;

var _create = require("../states/create");

var _generalVariables = require("../generalVariables");

function generateVirtualJoystick() {
  var joystick = yy.yengine.ui.VirtualJoystick({
    parent: $("body"),
    zIndex: 15,
    height: _generalVariables.uiDimensions.map.height + 3,
    width: _generalVariables.uiDimensions.map.width + 3,
    onMove: function onMove(evt, data) {
      if (data.direction !== undefined) {
        _create.playerShip.desiredAngle = data.yRad;

        if (Math.abs(_create.playerShip.desiredAngle - _create.playerShip.Sprite.rotation) <= 0.5) {
          _create.playerShip.wantAccelerate = true;
        } else {
          _create.playerShip.wantAccelerate = false;
        }
      }
    },
    onEnd: function onEnd() {
      _create.playerShip.wantAccelerate = false;
      _create.playerShip.desiredAngle = false;
    }
  });
}
},{"../states/create":"src/states/create.js","../generalVariables":"src/generalVariables.js"}],"src/api/sliderRequest.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestSliderInput = requestSliderInput;

function requestSliderInput(options) {
  options = options || {};
  var min = options.min || 0;
  var max = options.max || 10;
  var text = options.text || "Value";
  return new Promise(function (resolve, reject) {
    var resolveValue = 0;
    $(".sliderInputScreen").remove();
    $("#root").append("\n            <div class=\"interactionBlackScreen sliderInputScreen\" style=\"background: black;z-index:25;\">\n                <div class=\"cancelSliderRequest\">X</div>\n                <div class=\"sliderRequestText\">".concat(text, "</div>\n                <div style=\"clear:both;padding-top:30px\">\n                    <input type=\"range\" min=\"").concat(min, "\" max=\"").concat(max, "\" value=\"0\">\n                    <br>\n                    <span class=\"sliderRequestText\" style=\"color:white;\" id=\"requestRangeValue\">0</span>\n                    <br>\n                    <button id=\"acceptValueRequest\">Accept</button>\n                </div>\n            </div>\n        "));
    $('input[type="range"]').rangeslider({
      polyfill: false,
      // Default CSS classes
      rangeClass: 'rangeslider',
      disabledClass: 'rangeslider--disabled',
      horizontalClass: 'rangeslider--horizontal',
      verticalClass: 'rangeslider--vertical',
      fillClass: 'rangeslider__fill',
      handleClass: 'rangeslider__handle',
      // Callback function
      onInit: function onInit() {
        $('input[type="range"]').val(0).change();
        $("#requestRangeValue").html("0");
        resolveValue = 0;
      },
      // Callback function
      onSlide: function onSlide(position, value) {
        $("#requestRangeValue").html(value);
        resolveValue = value;
      },
      // Callback function
      onSlideEnd: function onSlideEnd(position, value) {}
    });
    $(".cancelSliderRequest").click(function () {
      reject();
      $(".sliderInputScreen").remove();
    });
    $("#acceptValueRequest").click(function () {
      resolve(resolveValue);
      $(".sliderInputScreen").remove();
    });
  });
}
},{}],"src/ui/managerMenu.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectTab = selectTab;
exports.generateManagerMenu = generateManagerMenu;
exports.showManagerMenu = showManagerMenu;
exports.hideManagerMenu = hideManagerMenu;
exports.updateInventoryScreen = updateInventoryScreen;
exports.selectedTab = void 0;

var _map = require("./map");

var _create = require("../states/create");

var _sliderRequest = require("../api/sliderRequest");

var selectedTab = 0;
exports.selectedTab = selectedTab;

function selectTab(index) {
  $(".managerMenuContentTab").css({
    "display": "none"
  });
  $($(".managerMenuContentTab")[index]).css({
    "display": "block"
  });

  switch (index) {
    case 0:
      (0, _map.setMapState)(2);
      break;

    case 1:
      updateInventoryScreen();
      break;
  }

  $(".scrollmenu > a").removeClass("selected");
  $($(".scrollmenu > a")[index + 1]).addClass("selected");
}

function generateManagerMenu() {
  $("#root").append("\n    \n        <div class=\"managerMenuContainer\">\n            <div class=\"managerMenuTopBar\">\n                <div class=\"scrollmenu\">\n                    <a id=\"closeManagerMenu\">X</a>\n                    <a id=\"selectMapTab\">Map</a>\n                    <a id=\"selectInventoryTab\">Inventory</a>\n                    <a id=\"selectModulesTab\">Modules</a>\n                    <a>Universe</a>\n                    <a>Market</a>\n                    <a>Ship</a>\n                    <a>Economy</a>\n                </div>\n            </div>\n            <div class=\"managerMenuContent\">\n                <div class=\"managerMenuContentTab mapTab\"></div>\n                <div class=\"managerMenuContentTab inventoryTab\"></div>\n                <div class=\"managerMenuContentTab modulesTab\"></div>\n            </div>\n        </div>\n\n    ");
  $("#closeManagerMenu").click(function () {
    hideManagerMenu();
  });
  $("#selectMapTab").click(function () {
    selectTab(0);
  });
  $("#selectInventoryTab").click(function () {
    selectTab(1);
  });
  hideManagerMenu();
}

function showManagerMenu(wh) {
  $(".managerMenuContainer").css({
    "display": "block"
  });
  $(".gameMapContainer").appendTo($(".mapTab"));
}

function hideManagerMenu() {
  $(".managerMenuContainer").css({
    "display": "none"
  });
  $(".gameMapContainer").appendTo($("#root"));
  (0, _map.setMapState)(1);
}

function updateInventoryScreen() {
  $(".inventoryTab").html("\n        <div style=\"color:white;height:40px;line-height:40px;\">".concat(_create.playerShip.Inventory.getUsed(), "/").concat(_create.playerShip.Inventory.capacity, "</div>\n        <div id=\"inventoryTableContainer\"></div>\n    "));
  var table = new Tabulator("#inventoryTableContainer", {
    height: "calc(100% - 40px)",
    layout: "fitDataFill",
    responsiveLayout: "collapse",
    responsiveLayoutCollapseStartOpen: false,
    columns: [{
      formatter: "responsiveCollapse",
      width: 30,
      minWidth: 30,
      align: "center",
      resizable: false,
      headerSort: false
    }, {
      title: "Item",
      field: "name",
      responsive: 0
    }, {
      title: "Amount",
      field: "amount",
      sorter: "number",
      align: "right"
    }, {
      title: "Mass",
      field: "mass",
      sorter: "number"
    }, //
    {
      title: "Mass per unit",
      field: "massPerUnit",
      sorter: "number"
    }],
    rowClick: function rowClick(e, row) {
      if (!$(e.target).hasClass("tabulator-responsive-collapse-toggle-close")) {
        if (!$(e.target).hasClass("tabulator-responsive-collapse-toggle-open")) {
          if (!$(e.target).hasClass("tabulator-responsive-collapse-toggle")) {
            console.log(row._row.data.name.toLowerCase());
            showItemInteractions(row._row.data.name.toLowerCase(), _create.playerShip.Inventory);
          }
        }
      }
    }
  });
  var tabledata = [];

  for (var i = 0; i < _create.playerShip.Inventory.items.length; i++) {
    var item = _create.playerShip.Inventory.items[i];
    var nm = item.name;
    tabledata.push({
      name: nm.capitalize(),
      amount: item.amount,
      mass: item.mass * item.amount,
      massPerUnit: item.mass,
      collapsed: true
    });
  }

  table.setData(tabledata);
}

function showItemInteractions(item, inventorySystem) {
  $("#root").append("\n        <div id=\"itemInteractionScreen\" class=\"interactionBlackScreen\">\n            <div>\n                <div class=\"closeInteractionAction\">X</div>\n                <span class=\"itemInteractionName\">XXXX</span>\n            </div>\n            <div>\n                <div class=\"itemInteractionAction\">Drop</div>\n                <div class=\"itemInteractionAction\">Sniff</div>\n            </div>\n        </div>\n    ");
  $(".itemInteractionName").html(item.capitalize());
  $(".closeInteractionAction").click(function () {
    $("#itemInteractionScreen").remove();
  });
  $(".itemInteractionAction:eq(0)").click(function () {
    // Drop option
    (0, _sliderRequest.requestSliderInput)({
      text: "Dropping algo muy largo probando 1 2 3 largfo largo" + item,
      min: 0,
      max: inventorySystem.getItem(item).amount
    }).then(function (amount) {
      if (amount !== 0) {
        inventorySystem.addItem(item, -amount);
      }

      updateInventoryScreen();
      $("#itemInteractionScreen").remove();
    });
  });
}
},{"./map":"src/ui/map.js","../states/create":"src/states/create.js","../api/sliderRequest":"src/api/sliderRequest.js"}],"src/ui/map.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapIsVisible = mapIsVisible;
exports.setMapState = setMapState;
exports.generateMapInterface = generateMapInterface;
exports.updateMapContent = updateMapContent;
exports.showMapFullScreen = showMapFullScreen;
exports.mapState = void 0;

var _manager = require("../sectors/manager");

var _update = require("../states/update");

var _create = require("../states/create");

var _managerMenu = require("./managerMenu");

var _generalVariables = require("../generalVariables");

var mapState = 1; // 0 not visible, 1 miniTop, 2: full

exports.mapState = mapState;

function mapIsVisible() {
  return true;
}

function setMapState(st) {
  exports.mapState = mapState = st;

  if (st === 0) {
    $(".gameMapContainer").css({
      "display": "none"
    });
  } else {
    $(".gameMapContainer").css({
      "display": "block"
    });
  }

  if (st === 1) {
    $(".gameMapContainer").css({
      width: "150px",
      "height": "150px"
    });
    aspectW = $(".gameMapContainer").width() / _manager.SectorSize;
    aspectH = $(".gameMapContainer").height() / _manager.SectorSize;
    updateStaticMap();
    $(".mapInfo").hide();
  } else if (st === 2) {
    $(".mapInfo").show();
    $(".gameMapContainer").css({
      width: "100%",
      "height": "100%"
    });
    aspectW = $(".gameMapContainer").width() / _manager.SectorSize;
    aspectH = $(".gameMapContainer").height() / _manager.SectorSize;
    updateStaticMap();
  }
}

var aspectW, aspectH, lastSector;

function generateMapInterface() {
  $("#root").append("\n        <div class=\"gameMapContainer isLeft\">\n            <div class=\"mapObject mapPlayer\"></div>\n            <div class=\"mapInfo\"></div>\n        </div>\n    ");
  yy.writeCSS("\n        .gameMapContainer {\n            width: ".concat(_generalVariables.uiDimensions.map.width, "px;\n            height: ").concat(_generalVariables.uiDimensions.map.height, "px;\n            background: rgba(0, 0, 0, 0.5);\n            z-index: 10;\n            position: absolute;\n            bottom: 3px;\n            display: block;\n        }\n        .gameMapContainer.isLeft {\n            left: 3px;\n        }\n        .gameMapContainer.isRight {\n            right: 3px;\n        }\n\n        .mapObject {\n            position: absolute;\n            width: 5px;\n            height: 5px;\n        }\n        .staticMapObject {\n            background: gray;\n        }\n        .mapPlayer {\n            background: red;\n            z-index: 10;\n        }\n        .mapInfo {\n            position: absolute;\n            top: 5px;\n            left: 5px;\n            color: white;\n            z-index: 11;\n        }\n        .mapInfoPos {\n            color: lime;\n        }\n        .sectorNumberInfo {\n            color: pink;\n        }\n        .staticMapObjectPlanet {\n            background: blue;\n        }\n    "));
  $(".gameMapContainer").click(function () {});
  aspectW = $(".gameMapContainer").width() / _manager.SectorSize;
  aspectH = $(".gameMapContainer").height() / _manager.SectorSize;
  updateMapContent();
}

function updateStaticMap(sector) {
  sector = sector || lastSector;

  if (sector === undefined) {
    return;
  }

  $(".staticMapObject").remove();

  for (var i = 0; i < sector.staticAsteroids.length; i++) {
    var newAsteroid = sector.staticAsteroids[i];
    var asteroidInMap = $("<div></div>");
    asteroidInMap.addClass("mapObject").addClass("staticMapObject");
    asteroidInMap.css({
      top: newAsteroid.y * aspectH,
      left: newAsteroid.x * aspectW,
      width: newAsteroid.width * aspectW,
      height: newAsteroid.height * aspectH
    });
    $(".gameMapContainer").append(asteroidInMap);
  }

  for (var i = 0; i < sector.staticPlanets.length; i++) {
    var newAsteroid = sector.staticPlanets[i];
    var asteroidInMap = $("<div></div>");
    asteroidInMap.addClass("mapObject").addClass("staticMapObject").addClass("staticMapObjectPlanet");
    asteroidInMap.css({
      top: newAsteroid.y * aspectH,
      left: newAsteroid.x * aspectW,
      width: newAsteroid.width * aspectW,
      height: newAsteroid.height * aspectH
    });
    $(".gameMapContainer").append(asteroidInMap);
  }

  lastSector = sector;
}

function updateMapContent() {
  (0, _update.registerUpdate20)(function () {
    if (mapState !== 0) {
      $(".mapPlayer").css({
        width: _create.playerShip.Sprite.width * aspectW,
        height: _create.playerShip.Sprite.height * aspectH
      });
      $(".mapPlayer").css({
        left: _create.playerShip.Sprite.x * aspectW,
        top: _create.playerShip.Sprite.y * aspectH
      });

      if (mapState === 2) {
        $(".mapInfo").html("\n                x: <span class=\"mapInfoPos\">".concat(parseInt(_create.playerShip.Sprite.x), "</span>, y: <span class=\"mapInfoPos\">").concat(parseInt(_create.playerShip.Sprite.y), "</span>\n                <br>\n                <span class=\"sectorNumberInfo\">").concat(_manager.CurrentSector.x, "</span>, <span class=\"sectorNumberInfo\">").concat(_manager.CurrentSector.y, "</span>\n                "));
      }
    }
  });
  (0, _manager.onSectorChange)(function (sector) {
    updateStaticMap(sector);
  });
}

function showMapFullScreen() {
  (0, _managerMenu.showManagerMenu)();
  (0, _managerMenu.selectTab)(0);
}
},{"../sectors/manager":"src/sectors/manager.js","../states/update":"src/states/update.js","../states/create":"src/states/create.js","./managerMenu":"src/ui/managerMenu.js","../generalVariables":"src/generalVariables.js"}],"src/ui/touchMenu.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateTouchMenu = generateTouchMenu;

var _create = require("../states/create");

var _resizer = require("./resizer");

var _map = require("./map");

var _managerMenu = require("./managerMenu");

var _generalVariables = require("../generalVariables");

function generateTouchMenu() {
  $("#toolsCogs").remove();

  window.oncontextmenu = function () {
    return false;
  };

  var left = $("<div></div>").attr("id", "toolsCogs").appendTo($("#root")).css({
    "z-index": "5",
    "color": "white",
    "position": "absolute",
    "bottom": "0px",
    "right": "0px",
    "width": "80px",
    "height": "60px",
    "text-algin": "center",
    "line-height": "60px"
  }).html("\n        <i style=\"font-size: 40px;text-algin: center;line-height:60px;height:60px;padding-left: 10px;\" class=\"fas fa-cogs\"></i>\n\n        ");
  var centerZone = $("<div><i style='width:100%;height:100%' class='fas fa-anchor'></i></div>").appendTo($("#root")).css({
    "z-index": "5",
    "color": "white",
    "position": "absolute",
    "bottom": "5px",
    "left": "160px",
    "width": "calc(100% - 280px)",
    "height": "60px",
    "background": "rgba(0, 0, 255, 0)"
  });
  var hammerTool = new Hammer(centerZone[0]);
  hammerTool.on("press", function (e) {
    _create.playerShip.toolButtonDown.apply(_create.playerShip);
  });
  hammerTool.on("pressup panend", function (e) {
    _create.playerShip.toolButtonUp.apply(_create.playerShip);
  });
  yy.ui.touchUI({
    container: "body",
    initiator: "#toolsCogs",
    styleClass: "touchUI_style",
    effectClass: "touchUI_active",
    colWidth: 50,
    threshold: 50,
    direction: "right",
    onStart: function onStart() {
      $("#toolsCogs").hide();
    },
    onEnd: function onEnd() {
      $("#toolsCogs").show();
    },
    centerLine: true,
    items: [{
      content: "<i class=\"fas fa-bug\"></i>",
      click: function click() {// $("#debugDisplay").toggle();
      },
      items: [{
        content: '<i class="fas fa-redo"></i>',
        click: function click() {
          window.location.reload();
        }
      }, {
        content: '<i class="fas fa-desktop"></i>',
        click: function click() {
          (0, _resizer.toggleFullScreen)();
          setTimeout(function () {
            (0, _resizer.executeResizeEvent)();
          }, 1000);
        }
      }]
    }, {
      content: '<i class="fas fa-suitcase"></i>',
      click: function click() {
        (0, _managerMenu.showManagerMenu)();
        (0, _managerMenu.selectTab)(1);
      }
    }, {
      content: '<i class="fas fa-map"></i>',
      click: function click() {
        (0, _map.showMapFullScreen)();
      }
    }, {
      content: "<i class=\"fas fa-wrench\"></i>",
      items: [{
        content: '<i class="fas fa-long-arrow-alt-up"></i>',
        click: function click() {
          _create.playerShip.selectTool.apply(_create.playerShip, [0]);
        }
      }, {
        content: '<i class="fas fa-map-pin"></i>',
        click: function click() {
          _create.playerShip.selectTool.apply(_create.playerShip, [1]);
        },
        items: [{
          content: '<i class="fas fa-long-arrow-alt-up"></i>',
          click: function click() {
            _create.playerShip.Sprite.setMaxVelocity(20000);
          }
        }]
      }, {
        content: '<i class="fas fa-arrows-alt"></i>',
        click: function click() {
          _create.playerShip.toggleInertiaDampeners();
        }
      }]
    }]
  });
  var midScreen = window.innerWidth / 2 - 50;
  var midScreen2 = window.innerHeight / 2 - 50;
  yy.writeCSS("\n        .touchUI_style {\n            color: white;\n            font-size: 35px;\n        }\n        .touchUI_active {\n            transform: translateX(-25px)\n        }\n        .touchUI_active_ {\n            left: ".concat(midScreen, "px !important;\n        }\n    "));
  setTimeout(function () {// $("#debugDisplay").toggle();
  }, 500);
}
},{"../states/create":"src/states/create.js","./resizer":"src/ui/resizer.js","./map":"src/ui/map.js","./managerMenu":"src/ui/managerMenu.js","../generalVariables":"src/generalVariables.js"}],"src/ui/resizer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerResize = registerResize;
exports.executeResizeEvent = executeResizeEvent;
exports.toggleFullScreen = toggleFullScreen;

var _main = require("../main");

var _create = require("../states/create");

var _touchMenu = require("./touchMenu");

function registerResize() {
  var timer = {};
  $(window).on("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      executeResizeEvent();
    }, 500);
  });
}

function executeResizeEvent() {
  _main.Game.resize(window.innerWidth, window.innerHeight);

  _main.Game.renderer.resize(window.innerWidth, window.innerHeight);

  _create.gameReference.cameras.main.setSize(window.innerWidth, window.innerHeight);

  (0, _touchMenu.generateTouchMenu)();
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
},{"../main":"src/main.js","../states/create":"src/states/create.js","./touchMenu":"src/ui/touchMenu.js"}],"src/main.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = main;
exports.getGameReference = getGameReference;
exports.Game = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _preload = require("./states/preload");

var _create = require("./states/create");

var _update = require("./states/update");

var _virtualJoystick = require("./ui/virtualJoystick");

var _sectorName = require("./data/sectorName");

var _resizer = require("./ui/resizer");

var _map = require("./ui/map");

var _managerMenu = require("./ui/managerMenu");

var _interactiveSprites = require("./ui/interactiveSprites");

var _touchMenu = require("./ui/touchMenu");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Game;
exports.Game = Game;
var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  parent: "root",
  autoResize: true,
  height: window.innerHeight,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: {
        y: 0
      }
    }
  },
  scene: {
    preload: _preload.preload,
    create: _create.create,
    update: _update.update
  }
};

if (window.location.host === "yasmany1111.github.io") {
  config.physics.arcade.debug = false;
}

var gameRef;

function loadGameData(_x) {
  return _loadGameData.apply(this, arguments);
}

function _loadGameData() {
  _loadGameData = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(callback) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _sectorName.loadSectorNames)();

          case 2:
            return _context.abrupt("return", "");

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _loadGameData.apply(this, arguments);
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function main() {
  return _main.apply(this, arguments);
}

function _main() {
  _main = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3() {
    var startActualGame, _startActualGame;

    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _startActualGame = function _ref2() {
              _startActualGame = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee2() {
                return _regenerator.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        exports.Game = Game = new Phaser.Game(config);
                        Game.shared = {};
                        gameRef = Game; // UI

                        _context2.next = 5;
                        return loadGameData();

                      case 5:
                        (0, _virtualJoystick.generateVirtualJoystick)();
                        (0, _touchMenu.generateTouchMenu)();
                        (0, _map.generateMapInterface)();
                        (0, _managerMenu.generateManagerMenu)();
                        (0, _resizer.registerResize)();

                      case 10:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, this);
              }));
              return _startActualGame.apply(this, arguments);
            };

            startActualGame = function _ref() {
              return _startActualGame.apply(this, arguments);
            };

            $("#root").css("overflow", "hidden");
            $("#root").addClass("no-select");
            $("body").css("overflow", "hidden");
            $("html").css("overflow", "hidden");
            $("body").append("\n        <div id=\"gameMenuInitiatorContainer\" style=\"z-index:10000;\">\n            <button id=\"gameStartButton\">Start</button>\n        </div>\n    ");
            $("#gameMenuInitiatorContainer").click(function () {
              try {
                $("#gameMenuInitiatorContainer").remove();
                var audio = new Audio('assets/audio/star_wars.mp3');
                audio.loop = true;
                audio.volume = 0.2;
                audio.play();
                responsiveVoice.speak("The republic has been torn to pieces, whatever is left of it's remains is under a heavy martial law. You, captain hook, as a former colony survey pilot for the governor of Aquilea, has been left out with the Esmerald IV ship. Your task is to find a proper planet for colonization, and aid it so it can grow into a new civilization");
                startActualGame();
              } catch (ex) {
                alert(ex.message);
              }
            });
            $("#root").on("mouseup touchend", function () {
              (0, _interactiveSprites.globalPointerUp)();
            });
            yy.writeCSS("\n        #gameMenuInitiatorContainer {\n            width: 100%;\n            height: 100%;\n            background: blue;\n            position: absolute;\n            top: 0;\n            left: 0;\n        }\n    ");

            if (window.location.host !== "yasmany1111.github.io" && yy.device.info().os !== "iOS") {
              startActualGame();
              $("#gameMenuInitiatorContainer").remove();
            }

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _main.apply(this, arguments);
}

function getGameReference() {
  return gameRef;
}
},{"@babel/runtime/regenerator":"node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"node_modules/@babel/runtime/helpers/asyncToGenerator.js","./states/preload":"src/states/preload.js","./states/create":"src/states/create.js","./states/update":"src/states/update.js","./ui/virtualJoystick":"src/ui/virtualJoystick.js","./data/sectorName":"src/data/sectorName.js","./ui/resizer":"src/ui/resizer.js","./ui/map":"src/ui/map.js","./ui/managerMenu":"src/ui/managerMenu.js","./ui/interactiveSprites":"src/ui/interactiveSprites.js","./ui/touchMenu":"src/ui/touchMenu.js"}],"index.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

var _main = require("./src/main.js");

(function (global) {
  if (global.infinimy !== undefined) {
    throw Error("myBundle variable already defined");
  }

  global.infinimy = _main.main;
}).call(void 0, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});
},{"./src/main.js":"src/main.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "41635" + '/');

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
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/infinimy.game.map