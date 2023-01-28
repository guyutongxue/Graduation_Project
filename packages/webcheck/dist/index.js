import require$$0 from 'stream';
import require$$0$1 from 'crypto';
import require$$3 from 'util';
import require$$0$2 from 'http';
import require$$1 from 'url';
import require$$0$3 from 'https';
import require$$0$4 from 'net';
import require$$4$1 from 'tls';
import require$$0$5 from 'zlib';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var promiseExports = {};
var promise$1 = {
  get exports(){ return promiseExports; },
  set exports(v){ promiseExports = v; },
};

var libExports$1 = {};
var lib$1 = {
  get exports(){ return libExports$1; },
  set exports(v){ libExports$1 = v; },
};

var jaysonExports = {};
var jayson$4 = {
  get exports(){ return jaysonExports; },
  set exports(v){ jaysonExports = v; },
};

var libExports = {};
var lib = {
  get exports(){ return libExports; },
  set exports(v){ libExports = v; },
};

var eventsExports = {};
var events = {
  get exports(){ return eventsExports; },
  set exports(v){ eventsExports = v; },
};

var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  };

var ReflectOwnKeys;
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}
events.exports = EventEmitter;
eventsExports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    }
    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

var utilsExports$1 = {};
var utils$2 = {
  get exports(){ return utilsExports$1; },
  set exports(v){ utilsExports$1 = v; },
};

var JSONStream = {};

/*global Buffer*/

// Named constants with unique integer values
var C = {};
// Tokens
var LEFT_BRACE    = C.LEFT_BRACE    = 0x1;
var RIGHT_BRACE   = C.RIGHT_BRACE   = 0x2;
var LEFT_BRACKET  = C.LEFT_BRACKET  = 0x3;
var RIGHT_BRACKET = C.RIGHT_BRACKET = 0x4;
var COLON         = C.COLON         = 0x5;
var COMMA         = C.COMMA         = 0x6;
var TRUE          = C.TRUE          = 0x7;
var FALSE         = C.FALSE         = 0x8;
var NULL          = C.NULL          = 0x9;
var STRING        = C.STRING        = 0xa;
var NUMBER        = C.NUMBER        = 0xb;
// Tokenizer States
var START   = C.START   = 0x11;
var STOP    = C.STOP    = 0x12;
var TRUE1   = C.TRUE1   = 0x21;
var TRUE2   = C.TRUE2   = 0x22;
var TRUE3   = C.TRUE3   = 0x23;
var FALSE1  = C.FALSE1  = 0x31;
var FALSE2  = C.FALSE2  = 0x32;
var FALSE3  = C.FALSE3  = 0x33;
var FALSE4  = C.FALSE4  = 0x34;
var NULL1   = C.NULL1   = 0x41;
var NULL2   = C.NULL2   = 0x42;
var NULL3   = C.NULL3   = 0x43;
var NUMBER1 = C.NUMBER1 = 0x51;
var NUMBER3 = C.NUMBER3 = 0x53;
var STRING1 = C.STRING1 = 0x61;
var STRING2 = C.STRING2 = 0x62;
var STRING3 = C.STRING3 = 0x63;
var STRING4 = C.STRING4 = 0x64;
var STRING5 = C.STRING5 = 0x65;
var STRING6 = C.STRING6 = 0x66;
// Parser States
var VALUE   = C.VALUE   = 0x71;
var KEY     = C.KEY     = 0x72;
// Parser Modes
var OBJECT  = C.OBJECT  = 0x81;
var ARRAY   = C.ARRAY   = 0x82;
// Character constants
var BACK_SLASH =      "\\".charCodeAt(0);
var FORWARD_SLASH =   "\/".charCodeAt(0);
var BACKSPACE =       "\b".charCodeAt(0);
var FORM_FEED =       "\f".charCodeAt(0);
var NEWLINE =         "\n".charCodeAt(0);
var CARRIAGE_RETURN = "\r".charCodeAt(0);
var TAB =             "\t".charCodeAt(0);

var STRING_BUFFER_SIZE = 64 * 1024;

function Parser$1() {
  this.tState = START;
  this.value = undefined;

  this.string = undefined; // string data
  this.stringBuffer = Buffer.alloc ? Buffer.alloc(STRING_BUFFER_SIZE) : new Buffer(STRING_BUFFER_SIZE);
  this.stringBufferOffset = 0;
  this.unicode = undefined; // unicode escapes
  this.highSurrogate = undefined;

  this.key = undefined;
  this.mode = undefined;
  this.stack = [];
  this.state = VALUE;
  this.bytes_remaining = 0; // number of bytes remaining in multi byte utf8 char to read after split boundary
  this.bytes_in_sequence = 0; // bytes in multi byte utf8 char to read
  this.temp_buffs = { "2": new Buffer(2), "3": new Buffer(3), "4": new Buffer(4) }; // for rebuilding chars split before boundary is reached

  // Stream offset
  this.offset = -1;
}

// Slow code to string converter (only used when throwing syntax errors)
Parser$1.toknam = function (code) {
  var keys = Object.keys(C);
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    if (C[key] === code) { return key; }
  }
  return code && ("0x" + code.toString(16));
};

var proto = Parser$1.prototype;
proto.onError = function (err) { throw err; };
proto.charError = function (buffer, i) {
  this.tState = STOP;
  this.onError(new Error("Unexpected " + JSON.stringify(String.fromCharCode(buffer[i])) + " at position " + i + " in state " + Parser$1.toknam(this.tState)));
};
proto.appendStringChar = function (char) {
  if (this.stringBufferOffset >= STRING_BUFFER_SIZE) {
    this.string += this.stringBuffer.toString('utf8');
    this.stringBufferOffset = 0;
  }

  this.stringBuffer[this.stringBufferOffset++] = char;
};
proto.appendStringBuf = function (buf, start, end) {
  var size = buf.length;
  if (typeof start === 'number') {
    if (typeof end === 'number') {
      if (end < 0) {
        // adding a negative end decreeses the size
        size = buf.length - start + end;
      } else {
        size = end - start;
      }
    } else {
      size = buf.length - start;
    }
  }

  if (size < 0) {
    size = 0;
  }

  if (this.stringBufferOffset + size > STRING_BUFFER_SIZE) {
    this.string += this.stringBuffer.toString('utf8', 0, this.stringBufferOffset);
    this.stringBufferOffset = 0;
  }

  buf.copy(this.stringBuffer, this.stringBufferOffset, start, end);
  this.stringBufferOffset += size;
};
proto.write = function (buffer) {
  if (typeof buffer === "string") buffer = new Buffer(buffer);
  var n;
  for (var i = 0, l = buffer.length; i < l; i++) {
    if (this.tState === START){
      n = buffer[i];
      this.offset++;
      if(n === 0x7b){ this.onToken(LEFT_BRACE, "{"); // {
      }else if(n === 0x7d){ this.onToken(RIGHT_BRACE, "}"); // }
      }else if(n === 0x5b){ this.onToken(LEFT_BRACKET, "["); // [
      }else if(n === 0x5d){ this.onToken(RIGHT_BRACKET, "]"); // ]
      }else if(n === 0x3a){ this.onToken(COLON, ":");  // :
      }else if(n === 0x2c){ this.onToken(COMMA, ","); // ,
      }else if(n === 0x74){ this.tState = TRUE1;  // t
      }else if(n === 0x66){ this.tState = FALSE1;  // f
      }else if(n === 0x6e){ this.tState = NULL1; // n
      }else if(n === 0x22){ // "
        this.string = "";
        this.stringBufferOffset = 0;
        this.tState = STRING1;
      }else if(n === 0x2d){ this.string = "-"; this.tState = NUMBER1; // -
      }else {
        if (n >= 0x30 && n < 0x40) { // 1-9
          this.string = String.fromCharCode(n); this.tState = NUMBER3;
        } else if (n === 0x20 || n === 0x09 || n === 0x0a || n === 0x0d) ; else {
          return this.charError(buffer, i);
        }
      }
    }else if (this.tState === STRING1){ // After open quote
      n = buffer[i]; // get current byte from buffer
      // check for carry over of a multi byte char split between data chunks
      // & fill temp buffer it with start of this data chunk up to the boundary limit set in the last iteration
      if (this.bytes_remaining > 0) {
        for (var j = 0; j < this.bytes_remaining; j++) {
          this.temp_buffs[this.bytes_in_sequence][this.bytes_in_sequence - this.bytes_remaining + j] = buffer[j];
        }

        this.appendStringBuf(this.temp_buffs[this.bytes_in_sequence]);
        this.bytes_in_sequence = this.bytes_remaining = 0;
        i = i + j - 1;
      } else if (this.bytes_remaining === 0 && n >= 128) { // else if no remainder bytes carried over, parse multi byte (>=128) chars one at a time
        if (n <= 193 || n > 244) {
          return this.onError(new Error("Invalid UTF-8 character at position " + i + " in state " + Parser$1.toknam(this.tState)));
        }
        if ((n >= 194) && (n <= 223)) this.bytes_in_sequence = 2;
        if ((n >= 224) && (n <= 239)) this.bytes_in_sequence = 3;
        if ((n >= 240) && (n <= 244)) this.bytes_in_sequence = 4;
        if ((this.bytes_in_sequence + i) > buffer.length) { // if bytes needed to complete char fall outside buffer length, we have a boundary split
          for (var k = 0; k <= (buffer.length - 1 - i); k++) {
            this.temp_buffs[this.bytes_in_sequence][k] = buffer[i + k]; // fill temp buffer of correct size with bytes available in this chunk
          }
          this.bytes_remaining = (i + this.bytes_in_sequence) - buffer.length;
          i = buffer.length - 1;
        } else {
          this.appendStringBuf(buffer, i, i + this.bytes_in_sequence);
          i = i + this.bytes_in_sequence - 1;
        }
      } else if (n === 0x22) {
        this.tState = START;
        this.string += this.stringBuffer.toString('utf8', 0, this.stringBufferOffset);
        this.stringBufferOffset = 0;
        this.onToken(STRING, this.string);
        this.offset += Buffer.byteLength(this.string, 'utf8') + 1;
        this.string = undefined;
      }
      else if (n === 0x5c) {
        this.tState = STRING2;
      }
      else if (n >= 0x20) { this.appendStringChar(n); }
      else {
          return this.charError(buffer, i);
      }
    }else if (this.tState === STRING2){ // After backslash
      n = buffer[i];
      if(n === 0x22){ this.appendStringChar(n); this.tState = STRING1;
      }else if(n === 0x5c){ this.appendStringChar(BACK_SLASH); this.tState = STRING1;
      }else if(n === 0x2f){ this.appendStringChar(FORWARD_SLASH); this.tState = STRING1;
      }else if(n === 0x62){ this.appendStringChar(BACKSPACE); this.tState = STRING1;
      }else if(n === 0x66){ this.appendStringChar(FORM_FEED); this.tState = STRING1;
      }else if(n === 0x6e){ this.appendStringChar(NEWLINE); this.tState = STRING1;
      }else if(n === 0x72){ this.appendStringChar(CARRIAGE_RETURN); this.tState = STRING1;
      }else if(n === 0x74){ this.appendStringChar(TAB); this.tState = STRING1;
      }else if(n === 0x75){ this.unicode = ""; this.tState = STRING3;
      }else {
        return this.charError(buffer, i);
      }
    }else if (this.tState === STRING3 || this.tState === STRING4 || this.tState === STRING5 || this.tState === STRING6){ // unicode hex codes
      n = buffer[i];
      // 0-9 A-F a-f
      if ((n >= 0x30 && n < 0x40) || (n > 0x40 && n <= 0x46) || (n > 0x60 && n <= 0x66)) {
        this.unicode += String.fromCharCode(n);
        if (this.tState++ === STRING6) {
          var intVal = parseInt(this.unicode, 16);
          this.unicode = undefined;
          if (this.highSurrogate !== undefined && intVal >= 0xDC00 && intVal < (0xDFFF + 1)) { //<56320,57343> - lowSurrogate
            this.appendStringBuf(new Buffer(String.fromCharCode(this.highSurrogate, intVal)));
            this.highSurrogate = undefined;
          } else if (this.highSurrogate === undefined && intVal >= 0xD800 && intVal < (0xDBFF + 1)) { //<55296,56319> - highSurrogate
            this.highSurrogate = intVal;
          } else {
            if (this.highSurrogate !== undefined) {
              this.appendStringBuf(new Buffer(String.fromCharCode(this.highSurrogate)));
              this.highSurrogate = undefined;
            }
            this.appendStringBuf(new Buffer(String.fromCharCode(intVal)));
          }
          this.tState = STRING1;
        }
      } else {
        return this.charError(buffer, i);
      }
    } else if (this.tState === NUMBER1 || this.tState === NUMBER3) {
        n = buffer[i];

        switch (n) {
          case 0x30: // 0
          case 0x31: // 1
          case 0x32: // 2
          case 0x33: // 3
          case 0x34: // 4
          case 0x35: // 5
          case 0x36: // 6
          case 0x37: // 7
          case 0x38: // 8
          case 0x39: // 9
          case 0x2e: // .
          case 0x65: // e
          case 0x45: // E
          case 0x2b: // +
          case 0x2d: // -
            this.string += String.fromCharCode(n);
            this.tState = NUMBER3;
            break;
          default:
            this.tState = START;
            var result = Number(this.string);

            if (isNaN(result)){
              return this.charError(buffer, i);
            }

            if ((this.string.match(/[0-9]+/) == this.string) && (result.toString() != this.string)) {
              // Long string of digits which is an ID string and not valid and/or safe JavaScript integer Number
              this.onToken(STRING, this.string);
            } else {
              this.onToken(NUMBER, result);
            }

            this.offset += this.string.length - 1;
            this.string = undefined;
            i--;
            break;
        }
    }else if (this.tState === TRUE1){ // r
      if (buffer[i] === 0x72) { this.tState = TRUE2; }
      else { return this.charError(buffer, i); }
    }else if (this.tState === TRUE2){ // u
      if (buffer[i] === 0x75) { this.tState = TRUE3; }
      else { return this.charError(buffer, i); }
    }else if (this.tState === TRUE3){ // e
      if (buffer[i] === 0x65) { this.tState = START; this.onToken(TRUE, true); this.offset+= 3; }
      else { return this.charError(buffer, i); }
    }else if (this.tState === FALSE1){ // a
      if (buffer[i] === 0x61) { this.tState = FALSE2; }
      else { return this.charError(buffer, i); }
    }else if (this.tState === FALSE2){ // l
      if (buffer[i] === 0x6c) { this.tState = FALSE3; }
      else { return this.charError(buffer, i); }
    }else if (this.tState === FALSE3){ // s
      if (buffer[i] === 0x73) { this.tState = FALSE4; }
      else { return this.charError(buffer, i); }
    }else if (this.tState === FALSE4){ // e
      if (buffer[i] === 0x65) { this.tState = START; this.onToken(FALSE, false); this.offset+= 4; }
      else { return this.charError(buffer, i); }
    }else if (this.tState === NULL1){ // u
      if (buffer[i] === 0x75) { this.tState = NULL2; }
      else { return this.charError(buffer, i); }
    }else if (this.tState === NULL2){ // l
      if (buffer[i] === 0x6c) { this.tState = NULL3; }
      else { return this.charError(buffer, i); }
    }else if (this.tState === NULL3){ // l
      if (buffer[i] === 0x6c) { this.tState = START; this.onToken(NULL, null); this.offset += 3; }
      else { return this.charError(buffer, i); }
    }
  }
};
proto.onToken = function (token, value) {
  // Override this to get events
};

proto.parseError = function (token, value) {
  this.tState = STOP;
  this.onError(new Error("Unexpected " + Parser$1.toknam(token) + (value ? ("(" + JSON.stringify(value) + ")") : "") + " in state " + Parser$1.toknam(this.state)));
};
proto.push = function () {
  this.stack.push({value: this.value, key: this.key, mode: this.mode});
};
proto.pop = function () {
  var value = this.value;
  var parent = this.stack.pop();
  this.value = parent.value;
  this.key = parent.key;
  this.mode = parent.mode;
  this.emit(value);
  if (!this.mode) { this.state = VALUE; }
};
proto.emit = function (value) {
  if (this.mode) { this.state = COMMA; }
  this.onValue(value);
};
proto.onValue = function (value) {
  // Override me
};
proto.onToken = function (token, value) {
  if(this.state === VALUE){
    if(token === STRING || token === NUMBER || token === TRUE || token === FALSE || token === NULL){
      if (this.value) {
        this.value[this.key] = value;
      }
      this.emit(value);
    }else if(token === LEFT_BRACE){
      this.push();
      if (this.value) {
        this.value = this.value[this.key] = {};
      } else {
        this.value = {};
      }
      this.key = undefined;
      this.state = KEY;
      this.mode = OBJECT;
    }else if(token === LEFT_BRACKET){
      this.push();
      if (this.value) {
        this.value = this.value[this.key] = [];
      } else {
        this.value = [];
      }
      this.key = 0;
      this.mode = ARRAY;
      this.state = VALUE;
    }else if(token === RIGHT_BRACE){
      if (this.mode === OBJECT) {
        this.pop();
      } else {
        return this.parseError(token, value);
      }
    }else if(token === RIGHT_BRACKET){
      if (this.mode === ARRAY) {
        this.pop();
      } else {
        return this.parseError(token, value);
      }
    }else {
      return this.parseError(token, value);
    }
  }else if(this.state === KEY){
    if (token === STRING) {
      this.key = value;
      this.state = COLON;
    } else if (token === RIGHT_BRACE) {
      this.pop();
    } else {
      return this.parseError(token, value);
    }
  }else if(this.state === COLON){
    if (token === COLON) { this.state = VALUE; }
    else { return this.parseError(token, value); }
  }else if(this.state === COMMA){
    if (token === COMMA) {
      if (this.mode === ARRAY) { this.key++; this.state = VALUE; }
      else if (this.mode === OBJECT) { this.state = KEY; }

    } else if (token === RIGHT_BRACKET && this.mode === ARRAY || token === RIGHT_BRACE && this.mode === OBJECT) {
      this.pop();
    } else {
      return this.parseError(token, value);
    }
  }else {
    return this.parseError(token, value);
  }
};

Parser$1.C = C;

var jsonparse = Parser$1;

var throughExports = {};
var through$1 = {
  get exports(){ return throughExports; },
  set exports(v){ throughExports = v; },
};

(function (module, exports) {
	var Stream = require$$0;

	// through
	//
	// a stream that does nothing but re-emit the input.
	// useful for aggregating a series of changing but not ending streams into one stream)

	module.exports = through;
	through.through = through;

	//create a readable writable stream.

	function through (write, end, opts) {
	  write = write || function (data) { this.queue(data); };
	  end = end || function () { this.queue(null); };

	  var ended = false, destroyed = false, buffer = [], _ended = false;
	  var stream = new Stream();
	  stream.readable = stream.writable = true;
	  stream.paused = false;

	//  stream.autoPause   = !(opts && opts.autoPause   === false)
	  stream.autoDestroy = !(opts && opts.autoDestroy === false);

	  stream.write = function (data) {
	    write.call(this, data);
	    return !stream.paused
	  };

	  function drain() {
	    while(buffer.length && !stream.paused) {
	      var data = buffer.shift();
	      if(null === data)
	        return stream.emit('end')
	      else
	        stream.emit('data', data);
	    }
	  }

	  stream.queue = stream.push = function (data) {
	//    console.error(ended)
	    if(_ended) return stream
	    if(data === null) _ended = true;
	    buffer.push(data);
	    drain();
	    return stream
	  };

	  //this will be registered as the first 'end' listener
	  //must call destroy next tick, to make sure we're after any
	  //stream piped from here.
	  //this is only a problem if end is not emitted synchronously.
	  //a nicer way to do this is to make sure this is the last listener for 'end'

	  stream.on('end', function () {
	    stream.readable = false;
	    if(!stream.writable && stream.autoDestroy)
	      process.nextTick(function () {
	        stream.destroy();
	      });
	  });

	  function _end () {
	    stream.writable = false;
	    end.call(stream);
	    if(!stream.readable && stream.autoDestroy)
	      stream.destroy();
	  }

	  stream.end = function (data) {
	    if(ended) return
	    ended = true;
	    if(arguments.length) stream.write(data);
	    _end(); // will emit or queue
	    return stream
	  };

	  stream.destroy = function () {
	    if(destroyed) return
	    destroyed = true;
	    ended = true;
	    buffer.length = 0;
	    stream.writable = stream.readable = false;
	    stream.emit('close');
	    return stream
	  };

	  stream.pause = function () {
	    if(stream.paused) return
	    stream.paused = true;
	    return stream
	  };

	  stream.resume = function () {
	    if(stream.paused) {
	      stream.paused = false;
	      stream.emit('resume');
	    }
	    drain();
	    //may have become paused again,
	    //as drain emits 'data'.
	    if(!stream.paused)
	      stream.emit('drain');
	    return stream
	  };
	  return stream
	}
} (through$1));

var Parser = jsonparse
  , through = throughExports;

var bufferFrom = Buffer.from && Buffer.from !== Uint8Array.from;

/*

  the value of this.stack that creationix's jsonparse has is weird.

  it makes this code ugly, but his problem is way harder that mine,
  so i'll forgive him.

*/

JSONStream.parse = function (path, map) {
  var header, footer;
  var parser = new Parser();
  var stream = through(function (chunk) {
    if('string' === typeof chunk)
      chunk = bufferFrom ? Buffer.from(chunk) : new Buffer(chunk);
    parser.write(chunk);
  },
  function (data) {
    if(data)
      stream.write(data);
    if (header)
        stream.emit('header', header);
    if (footer)
      stream.emit('footer', footer);
    stream.queue(null);
  });

  if('string' === typeof path)
    path = path.split('.').map(function (e) {
      if (e === '$*')
        return {emitKey: true}
      else if (e === '*')
        return true
      else if (e === '') // '..'.split('.') returns an empty string
        return {recurse: true}
      else
        return e
    });
  if(!path || !path.length)
    path = null;

  parser.onValue = function (value) {
    if (!this.root)
      stream.root = value;

    if(! path) return

    var i = 0; // iterates on path
    var j  = 0; // iterates on stack
    var emitKey = false;
    var emitPath = false;
    while (i < path.length) {
      var key = path[i];
      var c;
      j++;

      if (key && !key.recurse) {
        c = (j === this.stack.length) ? this : this.stack[j];
        if (!c) return
        if (! check(key, c.key)) {
          setHeaderFooter(c.key, value);
          return
        }
        emitKey = !!key.emitKey;
        emitPath = !!key.emitPath;
        i++;
      } else {
        i++;
        var nextKey = path[i];
        if (! nextKey) return
        while (true) {
          c = (j === this.stack.length) ? this : this.stack[j];
          if (!c) return
          if (check(nextKey, c.key)) {
            i++;
            if (!Object.isFrozen(this.stack[j]))
              this.stack[j].value = null;
            break
          } else {
            setHeaderFooter(c.key, value);
          }
          j++;
        }
      }

    }

    // emit header
    if (header) {
      stream.emit('header', header);
      header = false;
    }
    if (j !== this.stack.length) return
    var actualPath = this.stack.slice(1).map(function(element) { return element.key }).concat([this.key]);
    var data = value;
    if(null != data)
      if(null != (data = map ? map(data, actualPath) : data)) {
        if (emitKey || emitPath) {
          data = { value: data };
          if (emitKey)
            data["key"] = this.key;
          if (emitPath)
            data["path"] = actualPath;
        }

        stream.queue(data);
      }
    if (this.value) delete this.value[this.key];
    for(var k in this.stack)
      if (!Object.isFrozen(this.stack[k]))
        this.stack[k].value = null;
  };
  parser._onToken = parser.onToken;

  parser.onToken = function (token, value) {
    parser._onToken(token, value);
    if (this.stack.length === 0) {
      if (stream.root) {
        if(!path)
          stream.queue(stream.root);
        stream.root = null;
      }
    }
  };

  parser.onError = function (err) {
    if(err.message.indexOf("at position") > -1)
      err.message = "Invalid JSON (" + err.message + ")";
    stream.emit('error', err);
  };

  return stream

  function setHeaderFooter(key, value) {
    // header has not been emitted yet
    if (header !== false) {
      header = header || {};
      header[key] = value;
    }

    // footer has not been emitted yet but header has
    if (footer !== false && header === false) {
      footer = footer || {};
      footer[key] = value;
    }
  }
};

function check (x, y) {
  if ('string' === typeof x)
    return y == x
  else if (x && 'function' === typeof x.exec)
    return x.exec(y)
  else if ('boolean' === typeof x || 'object' === typeof x)
    return x
  else if ('function' === typeof x)
    return x(y)
  return false
}

JSONStream.stringify = function (op, sep, cl, indent) {
  indent = indent || 0;
  if (op === false){
    op = '';
    sep = '\n';
    cl = '';
  } else if (op == null) {

    op = '[\n';
    sep = '\n,\n';
    cl = '\n]\n';

  }

  //else, what ever you like

  var stream
    , first = true
    , anyData = false;
  stream = through(function (data) {
    anyData = true;
    try {
      var json = JSON.stringify(data, null, indent);
    } catch (err) {
      return stream.emit('error', err)
    }
    if(first) { first = false ; stream.queue(op + json);}
    else stream.queue(sep + json);
  },
  function (data) {
    if(!anyData)
      stream.queue(op);
    stream.queue(cl);
    stream.queue(null);
  });

  return stream
};

JSONStream.stringifyObject = function (op, sep, cl, indent) {
  indent = indent || 0;
  if (op === false){
    op = '';
    sep = '\n';
    cl = '';
  } else if (op == null) {

    op = '{\n';
    sep = '\n,\n';
    cl = '\n}\n';

  }

  //else, what ever you like

  var first = true;
  var anyData = false;
  var stream = through(function (data) {
    anyData = true;
    var json = JSON.stringify(data[0]) + ':' + JSON.stringify(data[1], null, indent);
    if(first) { first = false ; this.queue(op + json);}
    else this.queue(sep + json);
  },
  function (data) {
    if(!anyData) this.queue(op);
    this.queue(cl);

    this.queue(null);
  });

  return stream
};

var stringifyExports = {};
var stringify$2 = {
  get exports(){ return stringifyExports; },
  set exports(v){ stringifyExports = v; },
};

(function (module, exports) {
	exports = module.exports = stringify;
	exports.getSerialize = serializer;

	function stringify(obj, replacer, spaces, cycleReplacer) {
	  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
	}

	function serializer(replacer, cycleReplacer) {
	  var stack = [], keys = [];

	  if (cycleReplacer == null) cycleReplacer = function(key, value) {
	    if (stack[0] === value) return "[Circular ~]"
	    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
	  };

	  return function(key, value) {
	    if (stack.length > 0) {
	      var thisPos = stack.indexOf(this);
	      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
	      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
	      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value);
	    }
	    else stack.push(value);

	    return replacer == null ? value : replacer.call(this, key, value)
	  }
	}
} (stringify$2, stringifyExports));

var dist = {};

var v1$1 = {};

var rng$1 = {};

Object.defineProperty(rng$1, "__esModule", {
  value: true
});
rng$1.default = rng;

var _crypto$2 = _interopRequireDefault$b(require$$0$1);

function _interopRequireDefault$b(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto$2.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

var stringify$1 = {};

var validate$1 = {};

var regex = {};

Object.defineProperty(regex, "__esModule", {
  value: true
});
regex.default = void 0;
var _default$c = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
regex.default = _default$c;

Object.defineProperty(validate$1, "__esModule", {
  value: true
});
validate$1.default = void 0;

var _regex = _interopRequireDefault$a(regex);

function _interopRequireDefault$a(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default$b = validate;
validate$1.default = _default$b;

Object.defineProperty(stringify$1, "__esModule", {
  value: true
});
stringify$1.default = void 0;

var _validate$2 = _interopRequireDefault$9(validate$1);

function _interopRequireDefault$9(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate$2.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default$a = stringify;
stringify$1.default = _default$a;

Object.defineProperty(v1$1, "__esModule", {
  value: true
});
v1$1.default = void 0;

var _rng$1 = _interopRequireDefault$8(rng$1);

var _stringify$2 = _interopRequireDefault$8(stringify$1);

function _interopRequireDefault$8(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng$1.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify$2.default)(b);
}

var _default$9 = v1;
v1$1.default = _default$9;

var v3$1 = {};

var v35 = {};

var parse$1 = {};

Object.defineProperty(parse$1, "__esModule", {
  value: true
});
parse$1.default = void 0;

var _validate$1 = _interopRequireDefault$7(validate$1);

function _interopRequireDefault$7(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate$1.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default$8 = parse;
parse$1.default = _default$8;

Object.defineProperty(v35, "__esModule", {
  value: true
});
v35.default = _default$7;
v35.URL = v35.DNS = void 0;

var _stringify$1 = _interopRequireDefault$6(stringify$1);

var _parse = _interopRequireDefault$6(parse$1);

function _interopRequireDefault$6(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
v35.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
v35.URL = URL;

function _default$7(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify$1.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

var md5$1 = {};

Object.defineProperty(md5$1, "__esModule", {
  value: true
});
md5$1.default = void 0;

var _crypto$1 = _interopRequireDefault$5(require$$0$1);

function _interopRequireDefault$5(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto$1.default.createHash('md5').update(bytes).digest();
}

var _default$6 = md5;
md5$1.default = _default$6;

Object.defineProperty(v3$1, "__esModule", {
  value: true
});
v3$1.default = void 0;

var _v$1 = _interopRequireDefault$4(v35);

var _md = _interopRequireDefault$4(md5$1);

function _interopRequireDefault$4(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v$1.default)('v3', 0x30, _md.default);
var _default$5 = v3;
v3$1.default = _default$5;

var v4$1 = {};

Object.defineProperty(v4$1, "__esModule", {
  value: true
});
v4$1.default = void 0;

var _rng = _interopRequireDefault$3(rng$1);

var _stringify = _interopRequireDefault$3(stringify$1);

function _interopRequireDefault$3(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default$4 = v4;
v4$1.default = _default$4;

var v5$1 = {};

var sha1$1 = {};

Object.defineProperty(sha1$1, "__esModule", {
  value: true
});
sha1$1.default = void 0;

var _crypto = _interopRequireDefault$2(require$$0$1);

function _interopRequireDefault$2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default$3 = sha1;
sha1$1.default = _default$3;

Object.defineProperty(v5$1, "__esModule", {
  value: true
});
v5$1.default = void 0;

var _v = _interopRequireDefault$1(v35);

var _sha = _interopRequireDefault$1(sha1$1);

function _interopRequireDefault$1(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default$2 = v5;
v5$1.default = _default$2;

var nil = {};

Object.defineProperty(nil, "__esModule", {
  value: true
});
nil.default = void 0;
var _default$1 = '00000000-0000-0000-0000-000000000000';
nil.default = _default$1;

var version$2 = {};

Object.defineProperty(version$2, "__esModule", {
  value: true
});
version$2.default = void 0;

var _validate = _interopRequireDefault(validate$1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version$1(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version$1;
version$2.default = _default;

(function (exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	Object.defineProperty(exports, "v1", {
	  enumerable: true,
	  get: function () {
	    return _v.default;
	  }
	});
	Object.defineProperty(exports, "v3", {
	  enumerable: true,
	  get: function () {
	    return _v2.default;
	  }
	});
	Object.defineProperty(exports, "v4", {
	  enumerable: true,
	  get: function () {
	    return _v3.default;
	  }
	});
	Object.defineProperty(exports, "v5", {
	  enumerable: true,
	  get: function () {
	    return _v4.default;
	  }
	});
	Object.defineProperty(exports, "NIL", {
	  enumerable: true,
	  get: function () {
	    return _nil.default;
	  }
	});
	Object.defineProperty(exports, "version", {
	  enumerable: true,
	  get: function () {
	    return _version.default;
	  }
	});
	Object.defineProperty(exports, "validate", {
	  enumerable: true,
	  get: function () {
	    return _validate.default;
	  }
	});
	Object.defineProperty(exports, "stringify", {
	  enumerable: true,
	  get: function () {
	    return _stringify.default;
	  }
	});
	Object.defineProperty(exports, "parse", {
	  enumerable: true,
	  get: function () {
	    return _parse.default;
	  }
	});

	var _v = _interopRequireDefault(v1$1);

	var _v2 = _interopRequireDefault(v3$1);

	var _v3 = _interopRequireDefault(v4$1);

	var _v4 = _interopRequireDefault(v5$1);

	var _nil = _interopRequireDefault(nil);

	var _version = _interopRequireDefault(version$2);

	var _validate = _interopRequireDefault(validate$1);

	var _stringify = _interopRequireDefault(stringify$1);

	var _parse = _interopRequireDefault(parse$1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
} (dist));

const uuid = dist.v4;

/**
 *  Generates a JSON-RPC 1.0 or 2.0 request
 *  @param {String} method Name of method to call
 *  @param {Array|Object} params Array of parameters passed to the method as specified, or an object of parameter names and corresponding value
 *  @param {String|Number|null} [id] Request ID can be a string, number, null for explicit notification or left out for automatic generation
 *  @param {Object} [options]
 *  @param {Number} [options.version=2] JSON-RPC version to use (1 or 2)
 *  @param {Boolean} [options.notificationIdNull=false] When true, version 2 requests will set id to null instead of omitting it
 *  @param {Function} [options.generator] Passed the request, and the options object and is expected to return a request ID
 *  @throws {TypeError} If any of the parameters are invalid
 *  @return {Object} A JSON-RPC 1.0 or 2.0 request
 *  @memberOf Utils
 */
const generateRequest = function(method, params, id, options) {
  if(typeof method !== 'string') {
    throw new TypeError(method + ' must be a string');
  }

  options = options || {};

  // check valid version provided
  const version = typeof options.version === 'number' ? options.version : 2;
  if (version !== 1 && version !== 2) {
    throw new TypeError(version + ' must be 1 or 2');
  }

  const request = {
    method: method
  };

  if(version === 2) {
    request.jsonrpc = '2.0';
  }

  if(params) {
    // params given, but invalid?
    if(typeof params !== 'object' && !Array.isArray(params)) {
      throw new TypeError(params + ' must be an object, array or omitted');
    }
    request.params = params;
  }

  // if id was left out, generate one (null means explicit notification)
  if(typeof(id) === 'undefined') {
    const generator = typeof options.generator === 'function' ? options.generator : function() { return uuid(); };
    request.id = generator(request, options);
  } else if (version === 2 && id === null) {
    // we have a version 2 notification
    if (options.notificationIdNull) {
      request.id = null; // id will not be set at all unless option provided
    }
  } else {
    request.id = id;
  }

  return request;
};

var generateRequest_1 = generateRequest;

(function (module) {

	const JSONStream$1 = JSONStream;
	const JSONstringify = stringifyExports;
	const uuid = dist.v4;

	const generateRequest = generateRequest_1;

	/** * @namespace */
	const Utils = module.exports;

	// same reference as other files use, for tidyness
	const utils = Utils;

	Utils.request = generateRequest;

	/**
	 *  Generates a JSON-RPC 1.0 or 2.0 response
	 *  @param {Object} error Error member
	 *  @param {Object} result Result member
	 *  @param {String|Number|null} id Id of request
	 *  @param {Number} version JSON-RPC version to use
	 *  @return {Object} A JSON-RPC 1.0 or 2.0 response
	 */
	Utils.response = function(error, result, id, version) {
	  id = typeof(id) === 'undefined' || id === null ? null : id;
	  error = typeof(error) === 'undefined' || error === null ? null : error;
	  version = typeof(version) === 'undefined' || version === null ? 2 : version;
	  result = typeof(result) === 'undefined' || result === null ? null : result;
	  const response = (version === 2) ? { jsonrpc: "2.0", id: id } : { id: id };

	  // errors are always included in version 1
	  if(version === 1) {
	    response.error = error;
	  }

	  // one or the other with precedence for errors
	  if(error) {
	    response.error = error;
	  } else {
	    response.result = result;
	  }
	  return response;
	};

	/**
	 *  Generates a random UUID
	 *  @return {String}
	 */
	Utils.generateId = function() {
	  return uuid();
	};

	/**
	 *  Merges properties of object b into object a
	 *  @param {...Object} args Objects to be merged
	 *  @return {Object}
	 *  @private
	 */
	Utils.merge = function(...args) {
	  return args.reduce(function (out, obj) {
	    return {...out, ...obj};
	  }, {});
	};

	/**
	 * Parses an incoming stream for requests using JSONStream
	 * @param {Stream} stream
	 * @param {Object} options
	 * @param {Function} onRequest Called once for stream errors and an unlimited amount of times for valid requests
	 */
	Utils.parseStream = function(stream, options, onRequest) {

	  const onError = Utils.once(onRequest);
	  const onSuccess = (...args) => onRequest(null, ...args);

	  const result = JSONStream$1.parse();

	  result.on('data', function(data) {

	    // apply reviver walk function to prevent stringify/parse again
	    if(typeof options.reviver === 'function') {
	      data = Utils.walk({'': data}, '', options.reviver);
	    }

	    onSuccess(data);
	  });

	  result.on('error', onError);
	  stream.on('error', onError);

	  stream.pipe(result);

	};

	/**
	 * Returns a function that can only be called once
	 * @param {Function} fn
	 * @return {Function}
	 */
	Utils.once = function (fn) {
	  let called = false;
	  let lastRetval;
	  return function (...args) {
	    if (called) return lastRetval;
	    called = true;
	    lastRetval = fn.call(this, ...args);
	  };
	};

	/**
	 * Returns true if obj is a plain object (not null)
	 * @param {*} obj
	 * @return {Boolean}
	 */
	Utils.isPlainObject = function (obj) {
	  return typeof obj === 'object' && obj !== null;
	};

	/**
	 * Converts an object to an array
	 * @param {*} obj
	 * @return {Array}
	 */
	Utils.toArray = function (obj) {
	  if (Array.isArray(obj)) return obj;
	  if (Utils.isPlainObject(obj)) return Object.keys(obj).map(function (key) {
	    return obj[key];
	  });
	  if (!obj) return [];
	  return Array.prototype.slice.call(obj);
	};

	/**
	 * Converts an object to a plain object
	 * @param {*} obj
	 * @return {Object}
	 */
	Utils.toPlainObject = function (value) {
	  value = Object(value);
	  const result = {};
	  for (const key in value) {
	    result[key] = value[key];
	  }
	  return result;
	};

	/**
	 * Picks keys from obj
	 * @param {Object} obj
	 * @param {String[]} keys
	 * @return {Object}
	 */
	Utils.pick = function (obj, keys) {
	  return keys.reduce(function (out, key) {
	    out[key] = obj[key];
	    return out;
	  }, {});
	};

	/**
	 *  Helper to parse a stream and interpret it as JSON
	 *  @param {Stream} stream Stream instance
	 *  @param {Function} [options] Optional options for JSON.parse
	 *  @param {Function} callback
	 */
	Utils.parseBody = function(stream, options, callback) {

	  callback = Utils.once(callback);
	  let data = '';

	  stream.setEncoding('utf8');

	  stream.on('data', function(str) {
	    data += str;
	  });

	  stream.on('error', function(err) {
	    callback(err);
	  });

	  stream.on('end', function() {
	    utils.JSON.parse(data, options, function(err, request) {
	      if(err) {
	        return callback(err);
	      }
	      callback(null, request);
	    });
	  });

	};

	/**
	 *  Returns a HTTP request listener bound to the server in the argument.
	 *  @param {http.Server} self Instance of a HTTP server
	 *  @param {JaysonServer} server Instance of JaysonServer (typically jayson.Server)
	 *  @return {Function}
	 *  @private
	 */
	Utils.getHttpListener = function(self, server) {
	  return function(req, res) {
	    const options = self.options || {};

	    server.emit('http request', req);

	    //  405 method not allowed if not POST
	    if(!Utils.isMethod(req, 'POST')) {
	      return respond('Method Not Allowed', 405, {'allow': 'POST'});
	    }

	    // 415 unsupported media type if Content-Type is not correct
	    if(!Utils.isContentType(req, 'application/json')) {
	      return respond('Unsupported Media Type', 415);
	    }

	    Utils.parseBody(req, options, function(err, request) {
	      if(err) {
	        return respond(err, 400);
	      }

	      server.call(request, function(error, success) {
	        const response = error || success;
	        if(!response) {
	          // no response received at all, must be a notification
	          return respond('', 204);
	        }

	        utils.JSON.stringify(response, options, function(err, body) {
	          if(err) {
	            return respond(err, 500);
	          }

	          const headers = {
	            'content-length': Buffer.byteLength(body, options.encoding),
	            'content-type': 'application/json; charset=utf-8'
	          };

	          respond(body, 200, headers);
	        });

	      });

	    });

	    function respond(response, code, headers) {
	      const body = response instanceof Error ? response.toString() : response;
	      server.emit('http response', res, req);
	      res.writeHead(code, headers || {});
	      res.end(body);
	    }

	  };
	};

	/**
	 *  Determines if a HTTP Request comes with a specific Content-Type
	 *  @param {ServerRequest} request
	 *  @param {String} type
	 *  @return {Boolean}
	 *  @private
	 */
	Utils.isContentType = function(request, type) {
	  request = request || {headers: {}};
	  const contentType = request.headers['content-type'] || '';
	  return RegExp(type, 'i').test(contentType);
	};

	/**
	 *  Determines if a HTTP Request is of a specific method
	 *  @param {ServerRequest} request
	 *  @param {String} method
	 *  @return {Boolean}
	 *  @private
	 */
	Utils.isMethod = function(request, method) {
	  method = (method || '').toUpperCase();
	  return (request.method || '') === method;
	};

	/**
	 * Recursively walk an object and apply a function on its members
	 * @param {Object} holder The object to walk
	 * @param {String} key The key to look at
	 * @param {Function} fn The function to apply to members
	 * @return {Object}
	 */
	Utils.walk = function(holder, key, fn) {
	  let k, v, value = holder[key];
	  if (value && typeof value === 'object') {
	    for (k in value) {
	      if (Object.prototype.hasOwnProperty.call(value, k)) {
	        v = Utils.walk(value, k, fn);
	        if (v !== undefined) {
	          value[k] = v;
	        } else {
	          delete value[k];
	        }
	      }
	    }
	  }
	  return fn.call(holder, key, value);
	};

	/** * @namespace */
	Utils.JSON = {};

	/**
	 * Parses a JSON string and then invokes the given callback
	 * @param {String} str The string to parse
	 * @param {Object} options Object with options, possibly holding a "reviver" function
	 * @param {Function} callback
	 */
	Utils.JSON.parse = function(str, options, callback) {
	  let reviver = null;
	  let obj = null;
	  options = options || {};

	  if(typeof options.reviver === 'function') {
	    reviver = options.reviver;
	  }

	  try {
	    obj = JSON.parse.apply(JSON, [str, reviver].filter(v => v));
	  } catch(err) {
	    return callback(err);
	  }

	  callback(null, obj);
	};

	/**
	 * Stringifies JSON and then invokes the given callback
	 * @param {Object} obj The object to stringify
	 * @param {Object} options Object with options, possibly holding a "replacer" function
	 * @param {Function} callback
	 */
	Utils.JSON.stringify = function(obj, options, callback) {
	  let replacer = null;
	  let str = null;
	  options = options || {};

	  if(typeof options.replacer === 'function') {
	    replacer = options.replacer;
	  }

	  try {
	    str = JSONstringify.apply(JSON, [obj, replacer].filter(v => v));
	  } catch(err) {
	    return callback(err);
	  }

	  callback(null, str);
	};

	/** * @namespace */
	Utils.Request = {};

	/**
	 * Determines if the passed request is a batch request
	 * @param {Object} request The request
	 * @return {Boolean}
	 */
	Utils.Request.isBatch = function(request) {
	  return Array.isArray(request);
	};

	/**
	 * Determines if the passed request is a notification request
	 * @param {Object} request The request
	 * @return {Boolean}
	 */
	Utils.Request.isNotification = function(request) {
	  return Boolean(
	    request
	    && !Utils.Request.isBatch(request)
	    && (typeof(request.id) === 'undefined'
	         || request.id === null)
	  );
	};

	/**
	 * Determines if the passed request is a valid JSON-RPC 2.0 Request
	 * @param {Object} request The request
	 * @return {Boolean}
	 */
	Utils.Request.isValidVersionTwoRequest = function(request) {
	  return Boolean(
	    request
	    && typeof(request) === 'object'
	    && request.jsonrpc === '2.0'
	    && typeof(request.method) === 'string'
	    && (
	      typeof(request.params) === 'undefined'
	      || Array.isArray(request.params)
	      || (request.params && typeof(request.params) === 'object')
	    )
	    && (
	      typeof(request.id) === 'undefined'
	      || typeof(request.id) === 'string'
	      || typeof(request.id) === 'number'
	      || request.id === null
	    )
	  );
	};

	/**
	 * Determines if the passed request is a valid JSON-RPC 1.0 Request
	 * @param {Object} request The request
	 * @return {Boolean}
	 */
	Utils.Request.isValidVersionOneRequest = function(request) {
	  return Boolean(
	    request
	    && typeof(request) === 'object'
	    && typeof(request.method) === 'string'
	    && Array.isArray(request.params)
	    && typeof(request.id) !== 'undefined'
	  );
	};

	/**
	 * Determines if the passed request is a valid JSON-RPC Request
	 * @param {Object} request The request
	 * @param {Number} [version=2] JSON-RPC version 1 or 2
	 * @return {Boolean}
	 */
	Utils.Request.isValidRequest = function(request, version) {
	  version = version === 1 ? 1 : 2;
	  return Boolean(
	    request
	    && (
	      (version === 1 && Utils.Request.isValidVersionOneRequest(request)) ||
	      (version === 2 && Utils.Request.isValidVersionTwoRequest(request))
	    )
	  );
	};

	/** * @namespace */
	Utils.Response = {};

	/**
	 * Determines if the passed error is a valid JSON-RPC error response
	 * @param {Object} error The error
	 * @param {Number} [version=2] JSON-RPC version 1 or 2
	 * @return {Boolean}
	 */
	Utils.Response.isValidError = function(error, version) {
	  version = version === 1 ? 1 : 2;
	  return Boolean(
	    version === 1 && (
	      typeof(error) !== 'undefined'
	      && error !== null
	    )
	    || version === 2 && (
	      error
	      && typeof(error.code) === 'number'
	      && parseInt(error.code, 10) === error.code
	      && typeof(error.message) === 'string'
	    )
	  );
	};

	/**
	 * Determines if the passed object is a valid JSON-RPC response
	 * @param {Object} response The response
	 * @param {Number} [version=2] JSON-RPC version 1 or 2
	 * @return {Boolean}
	 */
	Utils.Response.isValidResponse = function(response, version) {
	  version = version === 1 ? 1 : 2;
	  return Boolean(
	    response !== null
	    && typeof response === 'object'
	    && (version === 2 && (
	      // check version
	      response.jsonrpc === '2.0'
	      && (
	        // check id
	        response.id === null
	        || typeof response.id === 'string'
	        || typeof response.id === 'number'
	      )
	      && (
	        // result and error do not exist at the same time
	        (typeof response.result === 'undefined' && typeof response.error !== 'undefined')
	        || (typeof response.result !== 'undefined' && typeof response.error === 'undefined')
	      )
	      && (
	        // check result
	        (typeof response.result !== 'undefined')
	        // check error object
	        || (
	          response.error !== null
	          && typeof response.error === 'object'
	          && typeof response.error.code === 'number'
	          // check error.code is integer
	          && ((response.error.code | 0) === response.error.code)
	          && typeof response.error.message === 'string'
	        )
	      )
	    )
	      || version === 1 && (
	        typeof response.id !== 'undefined'
	        && (
	          // result and error relation (the other null if one is not)
	          (typeof response.result !== 'undefined' && response.error === null)
	          || (typeof response.error !== 'undefined' && response.result === null)
	        )
	      ))
	  );
	};
} (utils$2));

var name = "jayson";
var version = "4.0.0";
var description = "JSON-RPC 1.0/2.0 compliant server and client";
var license = "MIT";
var keywords = [
	"jsonrpc",
	"json-rpc",
	"rpc",
	"json",
	"jsonrpc-2.0",
	"jsonrpc-1.0",
	"middleware",
	"connect",
	"express",
	"fork",
	"distributed",
	"relay",
	"http",
	"tcp",
	"https",
	"tls",
	"api"
];
var author = "Tedde Lundgren <mail@tedeh.net> (https://tedeh.net)";
var maintainers = "Tedde Lundgren <mail@tedeh.net> (https://tedeh.net)";
var bin = "./bin/jayson.js";
var repository = {
	type: "git",
	url: "git://github.com/tedeh/jayson.git"
};
var homepage = "https://jayson.tedeh.net";
var bugs = "https://github.com/tedeh/jayson/issues";
var contributors = [
	"Tedde Lundgren <mail@tedeh.net> (https://tedeh.net)",
	"Daniel Vicory <dvicory@gmail.com> (http://bzfx.net)",
	"Jonathan Liu <net147@gmail.com>"
];
var scripts = {
	test: "mocha",
	"test-ci": "mocha -w -R min",
	"test-tsc": "tsc --strict --lib es6 --esModuleInterop typescript/test.ts",
	coverage: "nyc mocha",
	coveralls: "mocha && nyc report --reporter=text-lcov | coveralls",
	docs: "jsdoc -t node_modules/ink-docstrap/template -R README.md -c ./jsdoc.conf.json",
	docs_clear: "rm -rf ./docs/jayson/*; exit 0",
	docs_refresh: "npm run docs_clear && npm run docs",
	docs_deploy: "rsync --delete -r docs/jayson/* tedeh.net:/var/www/jayson.tedeh.net; exit 0",
	lint: "jshint lib/*.js lib/**/*.js promise/*.js promise/**/*.js; exit 0"
};
var dependencies = {
	"@types/connect": "^3.4.33",
	"@types/node": "^12.12.54",
	"@types/ws": "^7.4.4",
	commander: "^2.20.3",
	delay: "^5.0.0",
	"es6-promisify": "^5.0.0",
	eyes: "^0.1.8",
	"isomorphic-ws": "^4.0.1",
	"json-stringify-safe": "^5.0.1",
	JSONStream: "^1.3.5",
	uuid: "^8.3.2",
	ws: "^7.4.5"
};
var devDependencies = {
	"@types/express-serve-static-core": "^4.17.30",
	"body-parser": "^1.19.0",
	connect: "^3.7.0",
	coveralls: "^3.1.0",
	"es6-promise": "^4.2.8",
	express: "^4.17.1",
	"ink-docstrap": "^1.3.2",
	jsdoc: "^3.6.5",
	jshint: "^2.12.0",
	mocha: "^7.2.0",
	"node-fetch": "^2.6.7",
	nyc: "^14.1.1",
	"pass-stream": "^1.0.0",
	should: "^13.2.3",
	superagent: "^3.8.3",
	typescript: "^4.7.4"
};
var engines = {
	node: ">=8"
};
var require$$4 = {
	name: name,
	version: version,
	description: description,
	license: license,
	keywords: keywords,
	author: author,
	maintainers: maintainers,
	bin: bin,
	repository: repository,
	homepage: homepage,
	bugs: bugs,
	contributors: contributors,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies,
	engines: engines
};

var http_1$1;
var hasRequiredHttp$2;

function requireHttp$2 () {
	if (hasRequiredHttp$2) return http_1$1;
	hasRequiredHttp$2 = 1;

	const http = require$$0$2;
	const url = require$$1;
	const utils = utilsExports$1;
	const Client = requireClient();
	const { version } = require$$4;

	/**
	 *  Constructor for a Jayson HTTP Client
	 *  @class ClientHttp
	 *  @constructor
	 *  @extends Client
	 *  @param {Object|String} [options] String interpreted as a URL
	 *  @param {String} [options.encoding="utf8"] Encoding to use
	 *  @return {ClientHttp}
	 */
	const ClientHttp = function(options) {
	  // accept first parameter as a url string
	  if(typeof(options) === 'string') {
	    options = url.parse(options);
	  }

	  if(!(this instanceof ClientHttp)) {
	    return new ClientHttp(options);
	  }
	  Client.call(this, options);

	  const defaults = utils.merge(this.options, {
	    encoding: 'utf8'
	  });

	  this.options = utils.merge(defaults, options || {});
	};
	require$$3.inherits(ClientHttp, Client);

	http_1$1 = ClientHttp;

	ClientHttp.prototype._request = function(request, callback) {
	  const self = this;
	  // copies options so object can be modified in this context
	  const options = utils.merge({}, this.options);

	  utils.JSON.stringify(request, options, function(err, body) {
	    if(err) {
	      return callback(err);
	    }

	    options.method = options.method || 'POST';

	    const headers = {
	      'Content-Length': Buffer.byteLength(body, options.encoding),
	      'Content-Type': 'application/json; charset=utf-8',
	      Accept: 'application/json',
	      'User-Agent': `jayson-${version}`,
	    };

	    // let user override the headers
	    options.headers = utils.merge(headers, options.headers || {});

	    const req = self._getRequestStream(options);

	    self.emit('http request', req);

	    req.on('response', function(res) {
	      self.emit('http response', res, req);

	      res.setEncoding(options.encoding);

	      let data = '';
	      res.on('data', function(chunk) { data += chunk; });

	      res.on('end', function() {

	        // assume we have an error
	        if(res.statusCode < 200 || res.statusCode >= 300) {
	          // assume the server gave the reason in the body
	          const err = new Error(data);
	          err.code = res.statusCode;
	          callback(err);
	        } else {
	          // empty reply
	          if(!data || typeof(data) !== 'string') {
	            return callback();
	          }
	          utils.JSON.parse(data, options, callback);
	        }
	      });

	    });

	    // abort on timeout
	    req.on('timeout', function() {
	      req.abort(); // req.abort causes "error" event
	    });

	    // abort on error
	    req.on('error', function(err) {
	      self.emit('http error', err);
	      callback(err);
	      req.abort();
	    });

	    req.end(body);
	  });
	};

	/**
	 *  Gets a stream interface to a http server
	 *  @param {Object} options An options object
	 *  @return {require('http').ClientRequest}
	 *  @private
	 */
	ClientHttp.prototype._getRequestStream = function(options) {
	  return http.request(options || {});
	};
	return http_1$1;
}

var https_1$1;
var hasRequiredHttps$2;

function requireHttps$2 () {
	if (hasRequiredHttps$2) return https_1$1;
	hasRequiredHttps$2 = 1;

	const https = require$$0$3;
	const ClientHttp = requireHttp$2();

	/**
	 *  Constructor for a Jayson HTTPS Client
	 *  @class ClientHttps
	 *  @constructor
	 *  @extends ClientHttp
	 *  @param {Object|String} [options] String interpreted as a URL
	 *  @param {String} [options.encoding="utf8"] Encoding to use
	 *  @return {ClientHttps}
	 */
	const ClientHttps = function(options) {
	  if(!(this instanceof ClientHttps)) {
	    return new ClientHttps(options);
	  }
	  // just proxy to constructor for ClientHttp
	  ClientHttp.call(this, options);
	};
	require$$3.inherits(ClientHttps, ClientHttp);

	https_1$1 = ClientHttps;

	/**
	 *  Gets a stream interface to a https server
	 *  @param {Object} options An options object
	 *  @return {require('https').ClientRequest}
	 *  @private
	 */
	ClientHttps.prototype._getRequestStream = function(options) {
	  return https.request(options || {});
	};
	return https_1$1;
}

var tcp$2;
var hasRequiredTcp$2;

function requireTcp$2 () {
	if (hasRequiredTcp$2) return tcp$2;
	hasRequiredTcp$2 = 1;

	const net = require$$0$4;
	const utils = utilsExports$1;
	const Client = requireClient();

	/**
	 *  Constructor for a Jayson TCP Client
	 *  @class ClientTcp
	 *  @constructor
	 *  @extends Client
	 *  @param {Object|String} [options] Object goes into options for net.connect, String goes into options.path. String option argument is NOT recommended.
	 *  @return {ClientTcp}
	 */
	const ClientTcp = function(options) {
	  if(typeof(options) === 'string') {
	    options = {path: options};
	  }

	  if(!(this instanceof ClientTcp)) {
	    return new ClientTcp(options);
	  }
	  Client.call(this, options);

	  const defaults = utils.merge(this.options, {
	    encoding: 'utf8'
	  });

	  this.options = utils.merge(defaults, options || {});
	};
	require$$3.inherits(ClientTcp, Client);

	tcp$2 = ClientTcp;

	ClientTcp.prototype._request = function(request, callback) {
	  const self = this;

	  // copies options so object can be modified in this context
	  const options = utils.merge({}, this.options);
	  const delimiter = options.delimiter || '\n';

	  utils.JSON.stringify(request, options, function(err, body) {
	    if(err) {
	      return callback(err);
	    }

	    let handled = false;

	    const conn = net.connect(options, function() {

	      conn.setEncoding(options.encoding);

	      // wont get anything for notifications, just end here
	      if(utils.Request.isNotification(request)) {

	        handled = true;
	        conn.end(body + delimiter);
	        callback();

	      } else {

	        utils.parseStream(conn, options, function(err, response) {
	          handled = true;
	          conn.end();
	          if(err) {
	            return callback(err);
	          }
	          callback(null, response);
	        });

	        conn.write(body + delimiter);

	      }

	    });

	    self.emit('tcp socket', conn);

	    conn.on('error', function(err) {
	      self.emit('tcp error', err);
	      callback(err);
	    });

	    conn.on('end', function() {
	      if(!handled) {
	        callback();
	      }
	    });
	  });
	};
	return tcp$2;
}

var tls_1$1;
var hasRequiredTls$2;

function requireTls$2 () {
	if (hasRequiredTls$2) return tls_1$1;
	hasRequiredTls$2 = 1;

	const tls = require$$4$1;
	const utils = utilsExports$1;
	const Client = requireClient();

	/**
	 *  Constructor for a Jayson TLS-encrypted TCP Client
	 *  @class ClientTls
	 *  @constructor
	 *  @extends Client
	 *  @param {Object|String} [options] Object goes into options for tls.connect, String goes into options.path. String option argument is NOT recommended.
	 *  @return {ClientTls}
	 */
	const ClientTls = function(options) {
	  if(typeof(options) === 'string') {
	    options = {path: options};
	  }

	  if(!(this instanceof ClientTls)) {
	    return new ClientTls(options);
	  }
	  Client.call(this, options);

	  const defaults = utils.merge(this.options, {
	    encoding: 'utf8'
	  });

	  this.options = utils.merge(defaults, options || {});
	};
	require$$3.inherits(ClientTls, Client);

	tls_1$1 = ClientTls;

	ClientTls.prototype._request = function(request, callback) {
	  const self = this;

	  // copies options so object can be modified in this context
	  const options = utils.merge({}, this.options);

	  utils.JSON.stringify(request, options, function(err, body) {
	    if(err) {
	      return callback(err);
	    }

	    let handled = false;

	    const conn = tls.connect(options, function() {

	      conn.setEncoding(options.encoding);

	      // wont get anything for notifications, just end here
	      if(utils.Request.isNotification(request)) {

	        handled = true;
	        conn.end(body + '\n');
	        callback();

	      } else {

	        utils.parseStream(conn, options, function(err, response) {
	          handled = true;
	          conn.end();
	          if(err) {
	            return callback(err);
	          }
	          callback(null, response);
	        });

	        conn.write(body + '\n');
	      
	      }

	    });

	    self.emit('tcp socket', conn);

	    conn.on('error', function(err) {
	      self.emit('tcp error', err);
	      callback(err);
	    });

	    conn.on('end', function() {
	      if(!handled) {
	        callback();
	      }
	    });
	  });
	};
	return tls_1$1;
}

var browser;
var hasRequiredBrowser;

function requireBrowser () {
	if (hasRequiredBrowser) return browser;
	hasRequiredBrowser = 1;

	const uuid = dist.v4;
	const generateRequest = generateRequest_1;

	/**
	 * Constructor for a Jayson Browser Client that does not depend any node.js core libraries
	 * @class ClientBrowser
	 * @param {Function} callServer Method that calls the server, receives the stringified request and a regular node-style callback
	 * @param {Object} [options]
	 * @param {Function} [options.reviver] Reviver function for JSON
	 * @param {Function} [options.replacer] Replacer function for JSON
	 * @param {Number} [options.version=2] JSON-RPC version to use (1|2)
	 * @param {Function} [options.generator] Function to use for generating request IDs
	 *  @param {Boolean} [options.notificationIdNull=false] When true, version 2 requests will set id to null instead of omitting it
	 * @return {ClientBrowser}
	 */
	const ClientBrowser = function(callServer, options) {
	  if(!(this instanceof ClientBrowser)) {
	    return new ClientBrowser(callServer, options);
	  }

	  if (!options) {
	    options = {};
	  }

	  this.options = {
	    reviver: typeof options.reviver !== 'undefined' ? options.reviver : null,
	    replacer: typeof options.replacer !== 'undefined' ? options.replacer : null,
	    generator: typeof options.generator !== 'undefined' ? options.generator : function() { return uuid(); },
	    version: typeof options.version !== 'undefined' ? options.version : 2,
	    notificationIdNull: typeof options.notificationIdNull === 'boolean' ? options.notificationIdNull : false,
	  };

	  this.callServer = callServer;
	};

	browser = ClientBrowser;

	/**
	 *  Creates a request and dispatches it if given a callback.
	 *  @param {String|Array} method A batch request if passed an Array, or a method name if passed a String
	 *  @param {Array|Object} [params] Parameters for the method
	 *  @param {String|Number} [id] Optional id. If undefined an id will be generated. If null it creates a notification request
	 *  @param {Function} [callback] Request callback. If specified, executes the request rather than only returning it.
	 *  @throws {TypeError} Invalid parameters
	 *  @return {Object} JSON-RPC 1.0 or 2.0 compatible request
	 */
	ClientBrowser.prototype.request = function(method, params, id, callback) {
	  const self = this;
	  let request = null;

	  // is this a batch request?
	  const isBatch = Array.isArray(method) && typeof params === 'function';

	  if (this.options.version === 1 && isBatch) {
	    throw new TypeError('JSON-RPC 1.0 does not support batching');
	  }

	  // is this a raw request?
	  const isRaw = !isBatch && method && typeof method === 'object' && typeof params === 'function';

	  if(isBatch || isRaw) {
	    callback = params;
	    request = method;
	  } else {
	    if(typeof id === 'function') {
	      callback = id;
	      // specifically undefined because "null" is a notification request
	      id = undefined;
	    }

	    const hasCallback = typeof callback === 'function';

	    try {
	      request = generateRequest(method, params, id, {
	        generator: this.options.generator,
	        version: this.options.version,
	        notificationIdNull: this.options.notificationIdNull,
	      });
	    } catch(err) {
	      if(hasCallback) {
	        return callback(err);
	      }
	      throw err;
	    }

	    // no callback means we should just return a raw request
	    if(!hasCallback) {
	      return request;
	    }

	  }

	  let message;
	  try {
	    message = JSON.stringify(request, this.options.replacer);
	  } catch(err) {
	    return callback(err);
	  }

	  this.callServer(message, function(err, response) {
	    self._parseResponse(err, response, callback);
	  });

	  // always return the raw request
	  return request;
	};

	/**
	 * Parses a response from a server
	 * @param {Object} err Error to pass on that is unrelated to the actual response
	 * @param {String} responseText JSON-RPC 1.0 or 2.0 response
	 * @param {Function} callback Callback that will receive different arguments depending on the amount of parameters
	 * @private
	 */
	ClientBrowser.prototype._parseResponse = function(err, responseText, callback) {
	  if(err) {
	    callback(err);
	    return;
	  }

	  if(!responseText) {
	    // empty response text, assume that is correct because it could be a
	    // notification which jayson does not give any body for
	    return callback();
	  }

	  let response;
	  try {
	    response = JSON.parse(responseText, this.options.reviver);
	  } catch(err) {
	    return callback(err);
	  }

	  if(callback.length === 3) {
	    // if callback length is 3, we split callback arguments on error and response

	    // is batch response?
	    if(Array.isArray(response)) {

	      // neccesary to split strictly on validity according to spec here
	      const isError = function(res) {
	        return typeof res.error !== 'undefined';
	      };

	      const isNotError = function (res) {
	        return !isError(res);
	      };

	      return callback(null, response.filter(isError), response.filter(isNotError));
	    
	    } else {

	      // split regardless of validity
	      return callback(null, response.error, response.result);
	    
	    }
	  
	  }

	  callback(null, response);
	};
	return browser;
}

var nodeExports = {};
var node = {
  get exports(){ return nodeExports; },
  set exports(v){ nodeExports = v; },
};

var bufferUtilExports = {};
var bufferUtil = {
  get exports(){ return bufferUtilExports; },
  set exports(v){ bufferUtilExports = v; },
};

var constants;
var hasRequiredConstants;

function requireConstants () {
	if (hasRequiredConstants) return constants;
	hasRequiredConstants = 1;

	constants = {
	  BINARY_TYPES: ['nodebuffer', 'arraybuffer', 'fragments'],
	  GUID: '258EAFA5-E914-47DA-95CA-C5AB0DC85B11',
	  kStatusCode: Symbol('status-code'),
	  kWebSocket: Symbol('websocket'),
	  EMPTY_BUFFER: Buffer.alloc(0),
	  NOOP: () => {}
	};
	return constants;
}

var hasRequiredBufferUtil;

function requireBufferUtil () {
	if (hasRequiredBufferUtil) return bufferUtilExports;
	hasRequiredBufferUtil = 1;

	const { EMPTY_BUFFER } = requireConstants();

	/**
	 * Merges an array of buffers into a new buffer.
	 *
	 * @param {Buffer[]} list The array of buffers to concat
	 * @param {Number} totalLength The total length of buffers in the list
	 * @return {Buffer} The resulting buffer
	 * @public
	 */
	function concat(list, totalLength) {
	  if (list.length === 0) return EMPTY_BUFFER;
	  if (list.length === 1) return list[0];

	  const target = Buffer.allocUnsafe(totalLength);
	  let offset = 0;

	  for (let i = 0; i < list.length; i++) {
	    const buf = list[i];
	    target.set(buf, offset);
	    offset += buf.length;
	  }

	  if (offset < totalLength) return target.slice(0, offset);

	  return target;
	}

	/**
	 * Masks a buffer using the given mask.
	 *
	 * @param {Buffer} source The buffer to mask
	 * @param {Buffer} mask The mask to use
	 * @param {Buffer} output The buffer where to store the result
	 * @param {Number} offset The offset at which to start writing
	 * @param {Number} length The number of bytes to mask.
	 * @public
	 */
	function _mask(source, mask, output, offset, length) {
	  for (let i = 0; i < length; i++) {
	    output[offset + i] = source[i] ^ mask[i & 3];
	  }
	}

	/**
	 * Unmasks a buffer using the given mask.
	 *
	 * @param {Buffer} buffer The buffer to unmask
	 * @param {Buffer} mask The mask to use
	 * @public
	 */
	function _unmask(buffer, mask) {
	  // Required until https://github.com/nodejs/node/issues/9006 is resolved.
	  const length = buffer.length;
	  for (let i = 0; i < length; i++) {
	    buffer[i] ^= mask[i & 3];
	  }
	}

	/**
	 * Converts a buffer to an `ArrayBuffer`.
	 *
	 * @param {Buffer} buf The buffer to convert
	 * @return {ArrayBuffer} Converted buffer
	 * @public
	 */
	function toArrayBuffer(buf) {
	  if (buf.byteLength === buf.buffer.byteLength) {
	    return buf.buffer;
	  }

	  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
	}

	/**
	 * Converts `data` to a `Buffer`.
	 *
	 * @param {*} data The data to convert
	 * @return {Buffer} The buffer
	 * @throws {TypeError}
	 * @public
	 */
	function toBuffer(data) {
	  toBuffer.readOnly = true;

	  if (Buffer.isBuffer(data)) return data;

	  let buf;

	  if (data instanceof ArrayBuffer) {
	    buf = Buffer.from(data);
	  } else if (ArrayBuffer.isView(data)) {
	    buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
	  } else {
	    buf = Buffer.from(data);
	    toBuffer.readOnly = false;
	  }

	  return buf;
	}

	try {
	  const bufferUtil$1 = require('bufferutil');
	  const bu = bufferUtil$1.BufferUtil || bufferUtil$1;

	  bufferUtil.exports = {
	    concat,
	    mask(source, mask, output, offset, length) {
	      if (length < 48) _mask(source, mask, output, offset, length);
	      else bu.mask(source, mask, output, offset, length);
	    },
	    toArrayBuffer,
	    toBuffer,
	    unmask(buffer, mask) {
	      if (buffer.length < 32) _unmask(buffer, mask);
	      else bu.unmask(buffer, mask);
	    }
	  };
	} catch (e) /* istanbul ignore next */ {
	  bufferUtil.exports = {
	    concat,
	    mask: _mask,
	    toArrayBuffer,
	    toBuffer,
	    unmask: _unmask
	  };
	}
	return bufferUtilExports;
}

var limiter;
var hasRequiredLimiter;

function requireLimiter () {
	if (hasRequiredLimiter) return limiter;
	hasRequiredLimiter = 1;

	const kDone = Symbol('kDone');
	const kRun = Symbol('kRun');

	/**
	 * A very simple job queue with adjustable concurrency. Adapted from
	 * https://github.com/STRML/async-limiter
	 */
	class Limiter {
	  /**
	   * Creates a new `Limiter`.
	   *
	   * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
	   *     to run concurrently
	   */
	  constructor(concurrency) {
	    this[kDone] = () => {
	      this.pending--;
	      this[kRun]();
	    };
	    this.concurrency = concurrency || Infinity;
	    this.jobs = [];
	    this.pending = 0;
	  }

	  /**
	   * Adds a job to the queue.
	   *
	   * @param {Function} job The job to run
	   * @public
	   */
	  add(job) {
	    this.jobs.push(job);
	    this[kRun]();
	  }

	  /**
	   * Removes a job from the queue and runs it if possible.
	   *
	   * @private
	   */
	  [kRun]() {
	    if (this.pending === this.concurrency) return;

	    if (this.jobs.length) {
	      const job = this.jobs.shift();

	      this.pending++;
	      job(this[kDone]);
	    }
	  }
	}

	limiter = Limiter;
	return limiter;
}

var permessageDeflate;
var hasRequiredPermessageDeflate;

function requirePermessageDeflate () {
	if (hasRequiredPermessageDeflate) return permessageDeflate;
	hasRequiredPermessageDeflate = 1;

	const zlib = require$$0$5;

	const bufferUtil = requireBufferUtil();
	const Limiter = requireLimiter();
	const { kStatusCode, NOOP } = requireConstants();

	const TRAILER = Buffer.from([0x00, 0x00, 0xff, 0xff]);
	const kPerMessageDeflate = Symbol('permessage-deflate');
	const kTotalLength = Symbol('total-length');
	const kCallback = Symbol('callback');
	const kBuffers = Symbol('buffers');
	const kError = Symbol('error');

	//
	// We limit zlib concurrency, which prevents severe memory fragmentation
	// as documented in https://github.com/nodejs/node/issues/8871#issuecomment-250915913
	// and https://github.com/websockets/ws/issues/1202
	//
	// Intentionally global; it's the global thread pool that's an issue.
	//
	let zlibLimiter;

	/**
	 * permessage-deflate implementation.
	 */
	class PerMessageDeflate {
	  /**
	   * Creates a PerMessageDeflate instance.
	   *
	   * @param {Object} [options] Configuration options
	   * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
	   *     disabling of server context takeover
	   * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
	   *     acknowledge disabling of client context takeover
	   * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
	   *     use of a custom server window size
	   * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
	   *     for, or request, a custom client window size
	   * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
	   *     deflate
	   * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
	   *     inflate
	   * @param {Number} [options.threshold=1024] Size (in bytes) below which
	   *     messages should not be compressed
	   * @param {Number} [options.concurrencyLimit=10] The number of concurrent
	   *     calls to zlib
	   * @param {Boolean} [isServer=false] Create the instance in either server or
	   *     client mode
	   * @param {Number} [maxPayload=0] The maximum allowed message length
	   */
	  constructor(options, isServer, maxPayload) {
	    this._maxPayload = maxPayload | 0;
	    this._options = options || {};
	    this._threshold =
	      this._options.threshold !== undefined ? this._options.threshold : 1024;
	    this._isServer = !!isServer;
	    this._deflate = null;
	    this._inflate = null;

	    this.params = null;

	    if (!zlibLimiter) {
	      const concurrency =
	        this._options.concurrencyLimit !== undefined
	          ? this._options.concurrencyLimit
	          : 10;
	      zlibLimiter = new Limiter(concurrency);
	    }
	  }

	  /**
	   * @type {String}
	   */
	  static get extensionName() {
	    return 'permessage-deflate';
	  }

	  /**
	   * Create an extension negotiation offer.
	   *
	   * @return {Object} Extension parameters
	   * @public
	   */
	  offer() {
	    const params = {};

	    if (this._options.serverNoContextTakeover) {
	      params.server_no_context_takeover = true;
	    }
	    if (this._options.clientNoContextTakeover) {
	      params.client_no_context_takeover = true;
	    }
	    if (this._options.serverMaxWindowBits) {
	      params.server_max_window_bits = this._options.serverMaxWindowBits;
	    }
	    if (this._options.clientMaxWindowBits) {
	      params.client_max_window_bits = this._options.clientMaxWindowBits;
	    } else if (this._options.clientMaxWindowBits == null) {
	      params.client_max_window_bits = true;
	    }

	    return params;
	  }

	  /**
	   * Accept an extension negotiation offer/response.
	   *
	   * @param {Array} configurations The extension negotiation offers/reponse
	   * @return {Object} Accepted configuration
	   * @public
	   */
	  accept(configurations) {
	    configurations = this.normalizeParams(configurations);

	    this.params = this._isServer
	      ? this.acceptAsServer(configurations)
	      : this.acceptAsClient(configurations);

	    return this.params;
	  }

	  /**
	   * Releases all resources used by the extension.
	   *
	   * @public
	   */
	  cleanup() {
	    if (this._inflate) {
	      this._inflate.close();
	      this._inflate = null;
	    }

	    if (this._deflate) {
	      const callback = this._deflate[kCallback];

	      this._deflate.close();
	      this._deflate = null;

	      if (callback) {
	        callback(
	          new Error(
	            'The deflate stream was closed while data was being processed'
	          )
	        );
	      }
	    }
	  }

	  /**
	   *  Accept an extension negotiation offer.
	   *
	   * @param {Array} offers The extension negotiation offers
	   * @return {Object} Accepted configuration
	   * @private
	   */
	  acceptAsServer(offers) {
	    const opts = this._options;
	    const accepted = offers.find((params) => {
	      if (
	        (opts.serverNoContextTakeover === false &&
	          params.server_no_context_takeover) ||
	        (params.server_max_window_bits &&
	          (opts.serverMaxWindowBits === false ||
	            (typeof opts.serverMaxWindowBits === 'number' &&
	              opts.serverMaxWindowBits > params.server_max_window_bits))) ||
	        (typeof opts.clientMaxWindowBits === 'number' &&
	          !params.client_max_window_bits)
	      ) {
	        return false;
	      }

	      return true;
	    });

	    if (!accepted) {
	      throw new Error('None of the extension offers can be accepted');
	    }

	    if (opts.serverNoContextTakeover) {
	      accepted.server_no_context_takeover = true;
	    }
	    if (opts.clientNoContextTakeover) {
	      accepted.client_no_context_takeover = true;
	    }
	    if (typeof opts.serverMaxWindowBits === 'number') {
	      accepted.server_max_window_bits = opts.serverMaxWindowBits;
	    }
	    if (typeof opts.clientMaxWindowBits === 'number') {
	      accepted.client_max_window_bits = opts.clientMaxWindowBits;
	    } else if (
	      accepted.client_max_window_bits === true ||
	      opts.clientMaxWindowBits === false
	    ) {
	      delete accepted.client_max_window_bits;
	    }

	    return accepted;
	  }

	  /**
	   * Accept the extension negotiation response.
	   *
	   * @param {Array} response The extension negotiation response
	   * @return {Object} Accepted configuration
	   * @private
	   */
	  acceptAsClient(response) {
	    const params = response[0];

	    if (
	      this._options.clientNoContextTakeover === false &&
	      params.client_no_context_takeover
	    ) {
	      throw new Error('Unexpected parameter "client_no_context_takeover"');
	    }

	    if (!params.client_max_window_bits) {
	      if (typeof this._options.clientMaxWindowBits === 'number') {
	        params.client_max_window_bits = this._options.clientMaxWindowBits;
	      }
	    } else if (
	      this._options.clientMaxWindowBits === false ||
	      (typeof this._options.clientMaxWindowBits === 'number' &&
	        params.client_max_window_bits > this._options.clientMaxWindowBits)
	    ) {
	      throw new Error(
	        'Unexpected or invalid parameter "client_max_window_bits"'
	      );
	    }

	    return params;
	  }

	  /**
	   * Normalize parameters.
	   *
	   * @param {Array} configurations The extension negotiation offers/reponse
	   * @return {Array} The offers/response with normalized parameters
	   * @private
	   */
	  normalizeParams(configurations) {
	    configurations.forEach((params) => {
	      Object.keys(params).forEach((key) => {
	        let value = params[key];

	        if (value.length > 1) {
	          throw new Error(`Parameter "${key}" must have only a single value`);
	        }

	        value = value[0];

	        if (key === 'client_max_window_bits') {
	          if (value !== true) {
	            const num = +value;
	            if (!Number.isInteger(num) || num < 8 || num > 15) {
	              throw new TypeError(
	                `Invalid value for parameter "${key}": ${value}`
	              );
	            }
	            value = num;
	          } else if (!this._isServer) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	        } else if (key === 'server_max_window_bits') {
	          const num = +value;
	          if (!Number.isInteger(num) || num < 8 || num > 15) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	          value = num;
	        } else if (
	          key === 'client_no_context_takeover' ||
	          key === 'server_no_context_takeover'
	        ) {
	          if (value !== true) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	        } else {
	          throw new Error(`Unknown parameter "${key}"`);
	        }

	        params[key] = value;
	      });
	    });

	    return configurations;
	  }

	  /**
	   * Decompress data. Concurrency limited.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @public
	   */
	  decompress(data, fin, callback) {
	    zlibLimiter.add((done) => {
	      this._decompress(data, fin, (err, result) => {
	        done();
	        callback(err, result);
	      });
	    });
	  }

	  /**
	   * Compress data. Concurrency limited.
	   *
	   * @param {Buffer} data Data to compress
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @public
	   */
	  compress(data, fin, callback) {
	    zlibLimiter.add((done) => {
	      this._compress(data, fin, (err, result) => {
	        done();
	        callback(err, result);
	      });
	    });
	  }

	  /**
	   * Decompress data.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @private
	   */
	  _decompress(data, fin, callback) {
	    const endpoint = this._isServer ? 'client' : 'server';

	    if (!this._inflate) {
	      const key = `${endpoint}_max_window_bits`;
	      const windowBits =
	        typeof this.params[key] !== 'number'
	          ? zlib.Z_DEFAULT_WINDOWBITS
	          : this.params[key];

	      this._inflate = zlib.createInflateRaw({
	        ...this._options.zlibInflateOptions,
	        windowBits
	      });
	      this._inflate[kPerMessageDeflate] = this;
	      this._inflate[kTotalLength] = 0;
	      this._inflate[kBuffers] = [];
	      this._inflate.on('error', inflateOnError);
	      this._inflate.on('data', inflateOnData);
	    }

	    this._inflate[kCallback] = callback;

	    this._inflate.write(data);
	    if (fin) this._inflate.write(TRAILER);

	    this._inflate.flush(() => {
	      const err = this._inflate[kError];

	      if (err) {
	        this._inflate.close();
	        this._inflate = null;
	        callback(err);
	        return;
	      }

	      const data = bufferUtil.concat(
	        this._inflate[kBuffers],
	        this._inflate[kTotalLength]
	      );

	      if (this._inflate._readableState.endEmitted) {
	        this._inflate.close();
	        this._inflate = null;
	      } else {
	        this._inflate[kTotalLength] = 0;
	        this._inflate[kBuffers] = [];

	        if (fin && this.params[`${endpoint}_no_context_takeover`]) {
	          this._inflate.reset();
	        }
	      }

	      callback(null, data);
	    });
	  }

	  /**
	   * Compress data.
	   *
	   * @param {Buffer} data Data to compress
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @private
	   */
	  _compress(data, fin, callback) {
	    const endpoint = this._isServer ? 'server' : 'client';

	    if (!this._deflate) {
	      const key = `${endpoint}_max_window_bits`;
	      const windowBits =
	        typeof this.params[key] !== 'number'
	          ? zlib.Z_DEFAULT_WINDOWBITS
	          : this.params[key];

	      this._deflate = zlib.createDeflateRaw({
	        ...this._options.zlibDeflateOptions,
	        windowBits
	      });

	      this._deflate[kTotalLength] = 0;
	      this._deflate[kBuffers] = [];

	      //
	      // An `'error'` event is emitted, only on Node.js < 10.0.0, if the
	      // `zlib.DeflateRaw` instance is closed while data is being processed.
	      // This can happen if `PerMessageDeflate#cleanup()` is called at the wrong
	      // time due to an abnormal WebSocket closure.
	      //
	      this._deflate.on('error', NOOP);
	      this._deflate.on('data', deflateOnData);
	    }

	    this._deflate[kCallback] = callback;

	    this._deflate.write(data);
	    this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
	      if (!this._deflate) {
	        //
	        // The deflate stream was closed while data was being processed.
	        //
	        return;
	      }

	      let data = bufferUtil.concat(
	        this._deflate[kBuffers],
	        this._deflate[kTotalLength]
	      );

	      if (fin) data = data.slice(0, data.length - 4);

	      //
	      // Ensure that the callback will not be called again in
	      // `PerMessageDeflate#cleanup()`.
	      //
	      this._deflate[kCallback] = null;

	      this._deflate[kTotalLength] = 0;
	      this._deflate[kBuffers] = [];

	      if (fin && this.params[`${endpoint}_no_context_takeover`]) {
	        this._deflate.reset();
	      }

	      callback(null, data);
	    });
	  }
	}

	permessageDeflate = PerMessageDeflate;

	/**
	 * The listener of the `zlib.DeflateRaw` stream `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function deflateOnData(chunk) {
	  this[kBuffers].push(chunk);
	  this[kTotalLength] += chunk.length;
	}

	/**
	 * The listener of the `zlib.InflateRaw` stream `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function inflateOnData(chunk) {
	  this[kTotalLength] += chunk.length;

	  if (
	    this[kPerMessageDeflate]._maxPayload < 1 ||
	    this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload
	  ) {
	    this[kBuffers].push(chunk);
	    return;
	  }

	  this[kError] = new RangeError('Max payload size exceeded');
	  this[kError].code = 'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH';
	  this[kError][kStatusCode] = 1009;
	  this.removeListener('data', inflateOnData);
	  this.reset();
	}

	/**
	 * The listener of the `zlib.InflateRaw` stream `'error'` event.
	 *
	 * @param {Error} err The emitted error
	 * @private
	 */
	function inflateOnError(err) {
	  //
	  // There is no need to call `Zlib#close()` as the handle is automatically
	  // closed when an error is emitted.
	  //
	  this[kPerMessageDeflate]._inflate = null;
	  err[kStatusCode] = 1007;
	  this[kCallback](err);
	}
	return permessageDeflate;
}

var validationExports = {};
var validation = {
  get exports(){ return validationExports; },
  set exports(v){ validationExports = v; },
};

var hasRequiredValidation;

function requireValidation () {
	if (hasRequiredValidation) return validationExports;
	hasRequiredValidation = 1;

	/**
	 * Checks if a status code is allowed in a close frame.
	 *
	 * @param {Number} code The status code
	 * @return {Boolean} `true` if the status code is valid, else `false`
	 * @public
	 */
	function isValidStatusCode(code) {
	  return (
	    (code >= 1000 &&
	      code <= 1014 &&
	      code !== 1004 &&
	      code !== 1005 &&
	      code !== 1006) ||
	    (code >= 3000 && code <= 4999)
	  );
	}

	/**
	 * Checks if a given buffer contains only correct UTF-8.
	 * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
	 * Markus Kuhn.
	 *
	 * @param {Buffer} buf The buffer to check
	 * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
	 * @public
	 */
	function _isValidUTF8(buf) {
	  const len = buf.length;
	  let i = 0;

	  while (i < len) {
	    if ((buf[i] & 0x80) === 0) {
	      // 0xxxxxxx
	      i++;
	    } else if ((buf[i] & 0xe0) === 0xc0) {
	      // 110xxxxx 10xxxxxx
	      if (
	        i + 1 === len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i] & 0xfe) === 0xc0 // Overlong
	      ) {
	        return false;
	      }

	      i += 2;
	    } else if ((buf[i] & 0xf0) === 0xe0) {
	      // 1110xxxx 10xxxxxx 10xxxxxx
	      if (
	        i + 2 >= len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i + 2] & 0xc0) !== 0x80 ||
	        (buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80) || // Overlong
	        (buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0) // Surrogate (U+D800 - U+DFFF)
	      ) {
	        return false;
	      }

	      i += 3;
	    } else if ((buf[i] & 0xf8) === 0xf0) {
	      // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
	      if (
	        i + 3 >= len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i + 2] & 0xc0) !== 0x80 ||
	        (buf[i + 3] & 0xc0) !== 0x80 ||
	        (buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80) || // Overlong
	        (buf[i] === 0xf4 && buf[i + 1] > 0x8f) ||
	        buf[i] > 0xf4 // > U+10FFFF
	      ) {
	        return false;
	      }

	      i += 4;
	    } else {
	      return false;
	    }
	  }

	  return true;
	}

	try {
	  let isValidUTF8 = require('utf-8-validate');

	  /* istanbul ignore if */
	  if (typeof isValidUTF8 === 'object') {
	    isValidUTF8 = isValidUTF8.Validation.isValidUTF8; // utf-8-validate@<3.0.0
	  }

	  validation.exports = {
	    isValidStatusCode,
	    isValidUTF8(buf) {
	      return buf.length < 150 ? _isValidUTF8(buf) : isValidUTF8(buf);
	    }
	  };
	} catch (e) /* istanbul ignore next */ {
	  validation.exports = {
	    isValidStatusCode,
	    isValidUTF8: _isValidUTF8
	  };
	}
	return validationExports;
}

var receiver;
var hasRequiredReceiver;

function requireReceiver () {
	if (hasRequiredReceiver) return receiver;
	hasRequiredReceiver = 1;

	const { Writable } = require$$0;

	const PerMessageDeflate = requirePermessageDeflate();
	const {
	  BINARY_TYPES,
	  EMPTY_BUFFER,
	  kStatusCode,
	  kWebSocket
	} = requireConstants();
	const { concat, toArrayBuffer, unmask } = requireBufferUtil();
	const { isValidStatusCode, isValidUTF8 } = requireValidation();

	const GET_INFO = 0;
	const GET_PAYLOAD_LENGTH_16 = 1;
	const GET_PAYLOAD_LENGTH_64 = 2;
	const GET_MASK = 3;
	const GET_DATA = 4;
	const INFLATING = 5;

	/**
	 * HyBi Receiver implementation.
	 *
	 * @extends Writable
	 */
	class Receiver extends Writable {
	  /**
	   * Creates a Receiver instance.
	   *
	   * @param {String} [binaryType=nodebuffer] The type for binary data
	   * @param {Object} [extensions] An object containing the negotiated extensions
	   * @param {Boolean} [isServer=false] Specifies whether to operate in client or
	   *     server mode
	   * @param {Number} [maxPayload=0] The maximum allowed message length
	   */
	  constructor(binaryType, extensions, isServer, maxPayload) {
	    super();

	    this._binaryType = binaryType || BINARY_TYPES[0];
	    this[kWebSocket] = undefined;
	    this._extensions = extensions || {};
	    this._isServer = !!isServer;
	    this._maxPayload = maxPayload | 0;

	    this._bufferedBytes = 0;
	    this._buffers = [];

	    this._compressed = false;
	    this._payloadLength = 0;
	    this._mask = undefined;
	    this._fragmented = 0;
	    this._masked = false;
	    this._fin = false;
	    this._opcode = 0;

	    this._totalPayloadLength = 0;
	    this._messageLength = 0;
	    this._fragments = [];

	    this._state = GET_INFO;
	    this._loop = false;
	  }

	  /**
	   * Implements `Writable.prototype._write()`.
	   *
	   * @param {Buffer} chunk The chunk of data to write
	   * @param {String} encoding The character encoding of `chunk`
	   * @param {Function} cb Callback
	   * @private
	   */
	  _write(chunk, encoding, cb) {
	    if (this._opcode === 0x08 && this._state == GET_INFO) return cb();

	    this._bufferedBytes += chunk.length;
	    this._buffers.push(chunk);
	    this.startLoop(cb);
	  }

	  /**
	   * Consumes `n` bytes from the buffered data.
	   *
	   * @param {Number} n The number of bytes to consume
	   * @return {Buffer} The consumed bytes
	   * @private
	   */
	  consume(n) {
	    this._bufferedBytes -= n;

	    if (n === this._buffers[0].length) return this._buffers.shift();

	    if (n < this._buffers[0].length) {
	      const buf = this._buffers[0];
	      this._buffers[0] = buf.slice(n);
	      return buf.slice(0, n);
	    }

	    const dst = Buffer.allocUnsafe(n);

	    do {
	      const buf = this._buffers[0];
	      const offset = dst.length - n;

	      if (n >= buf.length) {
	        dst.set(this._buffers.shift(), offset);
	      } else {
	        dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
	        this._buffers[0] = buf.slice(n);
	      }

	      n -= buf.length;
	    } while (n > 0);

	    return dst;
	  }

	  /**
	   * Starts the parsing loop.
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  startLoop(cb) {
	    let err;
	    this._loop = true;

	    do {
	      switch (this._state) {
	        case GET_INFO:
	          err = this.getInfo();
	          break;
	        case GET_PAYLOAD_LENGTH_16:
	          err = this.getPayloadLength16();
	          break;
	        case GET_PAYLOAD_LENGTH_64:
	          err = this.getPayloadLength64();
	          break;
	        case GET_MASK:
	          this.getMask();
	          break;
	        case GET_DATA:
	          err = this.getData(cb);
	          break;
	        default:
	          // `INFLATING`
	          this._loop = false;
	          return;
	      }
	    } while (this._loop);

	    cb(err);
	  }

	  /**
	   * Reads the first two bytes of a frame.
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  getInfo() {
	    if (this._bufferedBytes < 2) {
	      this._loop = false;
	      return;
	    }

	    const buf = this.consume(2);

	    if ((buf[0] & 0x30) !== 0x00) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'RSV2 and RSV3 must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_RSV_2_3'
	      );
	    }

	    const compressed = (buf[0] & 0x40) === 0x40;

	    if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'RSV1 must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_RSV_1'
	      );
	    }

	    this._fin = (buf[0] & 0x80) === 0x80;
	    this._opcode = buf[0] & 0x0f;
	    this._payloadLength = buf[1] & 0x7f;

	    if (this._opcode === 0x00) {
	      if (compressed) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'RSV1 must be clear',
	          true,
	          1002,
	          'WS_ERR_UNEXPECTED_RSV_1'
	        );
	      }

	      if (!this._fragmented) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'invalid opcode 0',
	          true,
	          1002,
	          'WS_ERR_INVALID_OPCODE'
	        );
	      }

	      this._opcode = this._fragmented;
	    } else if (this._opcode === 0x01 || this._opcode === 0x02) {
	      if (this._fragmented) {
	        this._loop = false;
	        return error(
	          RangeError,
	          `invalid opcode ${this._opcode}`,
	          true,
	          1002,
	          'WS_ERR_INVALID_OPCODE'
	        );
	      }

	      this._compressed = compressed;
	    } else if (this._opcode > 0x07 && this._opcode < 0x0b) {
	      if (!this._fin) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'FIN must be set',
	          true,
	          1002,
	          'WS_ERR_EXPECTED_FIN'
	        );
	      }

	      if (compressed) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'RSV1 must be clear',
	          true,
	          1002,
	          'WS_ERR_UNEXPECTED_RSV_1'
	        );
	      }

	      if (this._payloadLength > 0x7d) {
	        this._loop = false;
	        return error(
	          RangeError,
	          `invalid payload length ${this._payloadLength}`,
	          true,
	          1002,
	          'WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH'
	        );
	      }
	    } else {
	      this._loop = false;
	      return error(
	        RangeError,
	        `invalid opcode ${this._opcode}`,
	        true,
	        1002,
	        'WS_ERR_INVALID_OPCODE'
	      );
	    }

	    if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
	    this._masked = (buf[1] & 0x80) === 0x80;

	    if (this._isServer) {
	      if (!this._masked) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'MASK must be set',
	          true,
	          1002,
	          'WS_ERR_EXPECTED_MASK'
	        );
	      }
	    } else if (this._masked) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'MASK must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_MASK'
	      );
	    }

	    if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
	    else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
	    else return this.haveLength();
	  }

	  /**
	   * Gets extended payload length (7+16).
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  getPayloadLength16() {
	    if (this._bufferedBytes < 2) {
	      this._loop = false;
	      return;
	    }

	    this._payloadLength = this.consume(2).readUInt16BE(0);
	    return this.haveLength();
	  }

	  /**
	   * Gets extended payload length (7+64).
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  getPayloadLength64() {
	    if (this._bufferedBytes < 8) {
	      this._loop = false;
	      return;
	    }

	    const buf = this.consume(8);
	    const num = buf.readUInt32BE(0);

	    //
	    // The maximum safe integer in JavaScript is 2^53 - 1. An error is returned
	    // if payload length is greater than this number.
	    //
	    if (num > Math.pow(2, 53 - 32) - 1) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'Unsupported WebSocket frame: payload length > 2^53 - 1',
	        false,
	        1009,
	        'WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH'
	      );
	    }

	    this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
	    return this.haveLength();
	  }

	  /**
	   * Payload length has been read.
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  haveLength() {
	    if (this._payloadLength && this._opcode < 0x08) {
	      this._totalPayloadLength += this._payloadLength;
	      if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'Max payload size exceeded',
	          false,
	          1009,
	          'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
	        );
	      }
	    }

	    if (this._masked) this._state = GET_MASK;
	    else this._state = GET_DATA;
	  }

	  /**
	   * Reads mask bytes.
	   *
	   * @private
	   */
	  getMask() {
	    if (this._bufferedBytes < 4) {
	      this._loop = false;
	      return;
	    }

	    this._mask = this.consume(4);
	    this._state = GET_DATA;
	  }

	  /**
	   * Reads data bytes.
	   *
	   * @param {Function} cb Callback
	   * @return {(Error|RangeError|undefined)} A possible error
	   * @private
	   */
	  getData(cb) {
	    let data = EMPTY_BUFFER;

	    if (this._payloadLength) {
	      if (this._bufferedBytes < this._payloadLength) {
	        this._loop = false;
	        return;
	      }

	      data = this.consume(this._payloadLength);
	      if (this._masked) unmask(data, this._mask);
	    }

	    if (this._opcode > 0x07) return this.controlMessage(data);

	    if (this._compressed) {
	      this._state = INFLATING;
	      this.decompress(data, cb);
	      return;
	    }

	    if (data.length) {
	      //
	      // This message is not compressed so its lenght is the sum of the payload
	      // length of all fragments.
	      //
	      this._messageLength = this._totalPayloadLength;
	      this._fragments.push(data);
	    }

	    return this.dataMessage();
	  }

	  /**
	   * Decompresses data.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Function} cb Callback
	   * @private
	   */
	  decompress(data, cb) {
	    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

	    perMessageDeflate.decompress(data, this._fin, (err, buf) => {
	      if (err) return cb(err);

	      if (buf.length) {
	        this._messageLength += buf.length;
	        if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
	          return cb(
	            error(
	              RangeError,
	              'Max payload size exceeded',
	              false,
	              1009,
	              'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
	            )
	          );
	        }

	        this._fragments.push(buf);
	      }

	      const er = this.dataMessage();
	      if (er) return cb(er);

	      this.startLoop(cb);
	    });
	  }

	  /**
	   * Handles a data message.
	   *
	   * @return {(Error|undefined)} A possible error
	   * @private
	   */
	  dataMessage() {
	    if (this._fin) {
	      const messageLength = this._messageLength;
	      const fragments = this._fragments;

	      this._totalPayloadLength = 0;
	      this._messageLength = 0;
	      this._fragmented = 0;
	      this._fragments = [];

	      if (this._opcode === 2) {
	        let data;

	        if (this._binaryType === 'nodebuffer') {
	          data = concat(fragments, messageLength);
	        } else if (this._binaryType === 'arraybuffer') {
	          data = toArrayBuffer(concat(fragments, messageLength));
	        } else {
	          data = fragments;
	        }

	        this.emit('message', data);
	      } else {
	        const buf = concat(fragments, messageLength);

	        if (!isValidUTF8(buf)) {
	          this._loop = false;
	          return error(
	            Error,
	            'invalid UTF-8 sequence',
	            true,
	            1007,
	            'WS_ERR_INVALID_UTF8'
	          );
	        }

	        this.emit('message', buf.toString());
	      }
	    }

	    this._state = GET_INFO;
	  }

	  /**
	   * Handles a control message.
	   *
	   * @param {Buffer} data Data to handle
	   * @return {(Error|RangeError|undefined)} A possible error
	   * @private
	   */
	  controlMessage(data) {
	    if (this._opcode === 0x08) {
	      this._loop = false;

	      if (data.length === 0) {
	        this.emit('conclude', 1005, '');
	        this.end();
	      } else if (data.length === 1) {
	        return error(
	          RangeError,
	          'invalid payload length 1',
	          true,
	          1002,
	          'WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH'
	        );
	      } else {
	        const code = data.readUInt16BE(0);

	        if (!isValidStatusCode(code)) {
	          return error(
	            RangeError,
	            `invalid status code ${code}`,
	            true,
	            1002,
	            'WS_ERR_INVALID_CLOSE_CODE'
	          );
	        }

	        const buf = data.slice(2);

	        if (!isValidUTF8(buf)) {
	          return error(
	            Error,
	            'invalid UTF-8 sequence',
	            true,
	            1007,
	            'WS_ERR_INVALID_UTF8'
	          );
	        }

	        this.emit('conclude', code, buf.toString());
	        this.end();
	      }
	    } else if (this._opcode === 0x09) {
	      this.emit('ping', data);
	    } else {
	      this.emit('pong', data);
	    }

	    this._state = GET_INFO;
	  }
	}

	receiver = Receiver;

	/**
	 * Builds an error object.
	 *
	 * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
	 * @param {String} message The error message
	 * @param {Boolean} prefix Specifies whether or not to add a default prefix to
	 *     `message`
	 * @param {Number} statusCode The status code
	 * @param {String} errorCode The exposed error code
	 * @return {(Error|RangeError)} The error
	 * @private
	 */
	function error(ErrorCtor, message, prefix, statusCode, errorCode) {
	  const err = new ErrorCtor(
	    prefix ? `Invalid WebSocket frame: ${message}` : message
	  );

	  Error.captureStackTrace(err, error);
	  err.code = errorCode;
	  err[kStatusCode] = statusCode;
	  return err;
	}
	return receiver;
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^net|tls$" }] */

var sender;
var hasRequiredSender;

function requireSender () {
	if (hasRequiredSender) return sender;
	hasRequiredSender = 1;
	const { randomFillSync } = require$$0$1;

	const PerMessageDeflate = requirePermessageDeflate();
	const { EMPTY_BUFFER } = requireConstants();
	const { isValidStatusCode } = requireValidation();
	const { mask: applyMask, toBuffer } = requireBufferUtil();

	const mask = Buffer.alloc(4);

	/**
	 * HyBi Sender implementation.
	 */
	class Sender {
	  /**
	   * Creates a Sender instance.
	   *
	   * @param {(net.Socket|tls.Socket)} socket The connection socket
	   * @param {Object} [extensions] An object containing the negotiated extensions
	   */
	  constructor(socket, extensions) {
	    this._extensions = extensions || {};
	    this._socket = socket;

	    this._firstFragment = true;
	    this._compress = false;

	    this._bufferedBytes = 0;
	    this._deflating = false;
	    this._queue = [];
	  }

	  /**
	   * Frames a piece of data according to the HyBi WebSocket protocol.
	   *
	   * @param {Buffer} data The data to frame
	   * @param {Object} options Options object
	   * @param {Number} options.opcode The opcode
	   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
	   *     modified
	   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
	   *     FIN bit
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
	   *     RSV1 bit
	   * @return {Buffer[]} The framed data as a list of `Buffer` instances
	   * @public
	   */
	  static frame(data, options) {
	    const merge = options.mask && options.readOnly;
	    let offset = options.mask ? 6 : 2;
	    let payloadLength = data.length;

	    if (data.length >= 65536) {
	      offset += 8;
	      payloadLength = 127;
	    } else if (data.length > 125) {
	      offset += 2;
	      payloadLength = 126;
	    }

	    const target = Buffer.allocUnsafe(merge ? data.length + offset : offset);

	    target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
	    if (options.rsv1) target[0] |= 0x40;

	    target[1] = payloadLength;

	    if (payloadLength === 126) {
	      target.writeUInt16BE(data.length, 2);
	    } else if (payloadLength === 127) {
	      target.writeUInt32BE(0, 2);
	      target.writeUInt32BE(data.length, 6);
	    }

	    if (!options.mask) return [target, data];

	    randomFillSync(mask, 0, 4);

	    target[1] |= 0x80;
	    target[offset - 4] = mask[0];
	    target[offset - 3] = mask[1];
	    target[offset - 2] = mask[2];
	    target[offset - 1] = mask[3];

	    if (merge) {
	      applyMask(data, mask, target, offset, data.length);
	      return [target];
	    }

	    applyMask(data, mask, data, 0, data.length);
	    return [target, data];
	  }

	  /**
	   * Sends a close message to the other peer.
	   *
	   * @param {Number} [code] The status code component of the body
	   * @param {String} [data] The message component of the body
	   * @param {Boolean} [mask=false] Specifies whether or not to mask the message
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  close(code, data, mask, cb) {
	    let buf;

	    if (code === undefined) {
	      buf = EMPTY_BUFFER;
	    } else if (typeof code !== 'number' || !isValidStatusCode(code)) {
	      throw new TypeError('First argument must be a valid error code number');
	    } else if (data === undefined || data === '') {
	      buf = Buffer.allocUnsafe(2);
	      buf.writeUInt16BE(code, 0);
	    } else {
	      const length = Buffer.byteLength(data);

	      if (length > 123) {
	        throw new RangeError('The message must not be greater than 123 bytes');
	      }

	      buf = Buffer.allocUnsafe(2 + length);
	      buf.writeUInt16BE(code, 0);
	      buf.write(data, 2);
	    }

	    if (this._deflating) {
	      this.enqueue([this.doClose, buf, mask, cb]);
	    } else {
	      this.doClose(buf, mask, cb);
	    }
	  }

	  /**
	   * Frames and sends a close message.
	   *
	   * @param {Buffer} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  doClose(data, mask, cb) {
	    this.sendFrame(
	      Sender.frame(data, {
	        fin: true,
	        rsv1: false,
	        opcode: 0x08,
	        mask,
	        readOnly: false
	      }),
	      cb
	    );
	  }

	  /**
	   * Sends a ping message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  ping(data, mask, cb) {
	    const buf = toBuffer(data);

	    if (buf.length > 125) {
	      throw new RangeError('The data size must not be greater than 125 bytes');
	    }

	    if (this._deflating) {
	      this.enqueue([this.doPing, buf, mask, toBuffer.readOnly, cb]);
	    } else {
	      this.doPing(buf, mask, toBuffer.readOnly, cb);
	    }
	  }

	  /**
	   * Frames and sends a ping message.
	   *
	   * @param {Buffer} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Boolean} [readOnly=false] Specifies whether `data` can be modified
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  doPing(data, mask, readOnly, cb) {
	    this.sendFrame(
	      Sender.frame(data, {
	        fin: true,
	        rsv1: false,
	        opcode: 0x09,
	        mask,
	        readOnly
	      }),
	      cb
	    );
	  }

	  /**
	   * Sends a pong message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  pong(data, mask, cb) {
	    const buf = toBuffer(data);

	    if (buf.length > 125) {
	      throw new RangeError('The data size must not be greater than 125 bytes');
	    }

	    if (this._deflating) {
	      this.enqueue([this.doPong, buf, mask, toBuffer.readOnly, cb]);
	    } else {
	      this.doPong(buf, mask, toBuffer.readOnly, cb);
	    }
	  }

	  /**
	   * Frames and sends a pong message.
	   *
	   * @param {Buffer} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Boolean} [readOnly=false] Specifies whether `data` can be modified
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  doPong(data, mask, readOnly, cb) {
	    this.sendFrame(
	      Sender.frame(data, {
	        fin: true,
	        rsv1: false,
	        opcode: 0x0a,
	        mask,
	        readOnly
	      }),
	      cb
	    );
	  }

	  /**
	   * Sends a data message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Object} options Options object
	   * @param {Boolean} [options.compress=false] Specifies whether or not to
	   *     compress `data`
	   * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
	   *     or text
	   * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
	   *     last one
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  send(data, options, cb) {
	    const buf = toBuffer(data);
	    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
	    let opcode = options.binary ? 2 : 1;
	    let rsv1 = options.compress;

	    if (this._firstFragment) {
	      this._firstFragment = false;
	      if (rsv1 && perMessageDeflate) {
	        rsv1 = buf.length >= perMessageDeflate._threshold;
	      }
	      this._compress = rsv1;
	    } else {
	      rsv1 = false;
	      opcode = 0;
	    }

	    if (options.fin) this._firstFragment = true;

	    if (perMessageDeflate) {
	      const opts = {
	        fin: options.fin,
	        rsv1,
	        opcode,
	        mask: options.mask,
	        readOnly: toBuffer.readOnly
	      };

	      if (this._deflating) {
	        this.enqueue([this.dispatch, buf, this._compress, opts, cb]);
	      } else {
	        this.dispatch(buf, this._compress, opts, cb);
	      }
	    } else {
	      this.sendFrame(
	        Sender.frame(buf, {
	          fin: options.fin,
	          rsv1: false,
	          opcode,
	          mask: options.mask,
	          readOnly: toBuffer.readOnly
	        }),
	        cb
	      );
	    }
	  }

	  /**
	   * Dispatches a data message.
	   *
	   * @param {Buffer} data The message to send
	   * @param {Boolean} [compress=false] Specifies whether or not to compress
	   *     `data`
	   * @param {Object} options Options object
	   * @param {Number} options.opcode The opcode
	   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
	   *     modified
	   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
	   *     FIN bit
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
	   *     RSV1 bit
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  dispatch(data, compress, options, cb) {
	    if (!compress) {
	      this.sendFrame(Sender.frame(data, options), cb);
	      return;
	    }

	    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

	    this._bufferedBytes += data.length;
	    this._deflating = true;
	    perMessageDeflate.compress(data, options.fin, (_, buf) => {
	      if (this._socket.destroyed) {
	        const err = new Error(
	          'The socket was closed while data was being compressed'
	        );

	        if (typeof cb === 'function') cb(err);

	        for (let i = 0; i < this._queue.length; i++) {
	          const callback = this._queue[i][4];

	          if (typeof callback === 'function') callback(err);
	        }

	        return;
	      }

	      this._bufferedBytes -= data.length;
	      this._deflating = false;
	      options.readOnly = false;
	      this.sendFrame(Sender.frame(buf, options), cb);
	      this.dequeue();
	    });
	  }

	  /**
	   * Executes queued send operations.
	   *
	   * @private
	   */
	  dequeue() {
	    while (!this._deflating && this._queue.length) {
	      const params = this._queue.shift();

	      this._bufferedBytes -= params[1].length;
	      Reflect.apply(params[0], this, params.slice(1));
	    }
	  }

	  /**
	   * Enqueues a send operation.
	   *
	   * @param {Array} params Send operation parameters.
	   * @private
	   */
	  enqueue(params) {
	    this._bufferedBytes += params[1].length;
	    this._queue.push(params);
	  }

	  /**
	   * Sends a frame.
	   *
	   * @param {Buffer[]} list The frame to send
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  sendFrame(list, cb) {
	    if (list.length === 2) {
	      this._socket.cork();
	      this._socket.write(list[0]);
	      this._socket.write(list[1], cb);
	      this._socket.uncork();
	    } else {
	      this._socket.write(list[0], cb);
	    }
	  }
	}

	sender = Sender;
	return sender;
}

var eventTarget;
var hasRequiredEventTarget;

function requireEventTarget () {
	if (hasRequiredEventTarget) return eventTarget;
	hasRequiredEventTarget = 1;

	/**
	 * Class representing an event.
	 *
	 * @private
	 */
	class Event {
	  /**
	   * Create a new `Event`.
	   *
	   * @param {String} type The name of the event
	   * @param {Object} target A reference to the target to which the event was
	   *     dispatched
	   */
	  constructor(type, target) {
	    this.target = target;
	    this.type = type;
	  }
	}

	/**
	 * Class representing a message event.
	 *
	 * @extends Event
	 * @private
	 */
	class MessageEvent extends Event {
	  /**
	   * Create a new `MessageEvent`.
	   *
	   * @param {(String|Buffer|ArrayBuffer|Buffer[])} data The received data
	   * @param {WebSocket} target A reference to the target to which the event was
	   *     dispatched
	   */
	  constructor(data, target) {
	    super('message', target);

	    this.data = data;
	  }
	}

	/**
	 * Class representing a close event.
	 *
	 * @extends Event
	 * @private
	 */
	class CloseEvent extends Event {
	  /**
	   * Create a new `CloseEvent`.
	   *
	   * @param {Number} code The status code explaining why the connection is being
	   *     closed
	   * @param {String} reason A human-readable string explaining why the
	   *     connection is closing
	   * @param {WebSocket} target A reference to the target to which the event was
	   *     dispatched
	   */
	  constructor(code, reason, target) {
	    super('close', target);

	    this.wasClean = target._closeFrameReceived && target._closeFrameSent;
	    this.reason = reason;
	    this.code = code;
	  }
	}

	/**
	 * Class representing an open event.
	 *
	 * @extends Event
	 * @private
	 */
	class OpenEvent extends Event {
	  /**
	   * Create a new `OpenEvent`.
	   *
	   * @param {WebSocket} target A reference to the target to which the event was
	   *     dispatched
	   */
	  constructor(target) {
	    super('open', target);
	  }
	}

	/**
	 * Class representing an error event.
	 *
	 * @extends Event
	 * @private
	 */
	class ErrorEvent extends Event {
	  /**
	   * Create a new `ErrorEvent`.
	   *
	   * @param {Object} error The error that generated this event
	   * @param {WebSocket} target A reference to the target to which the event was
	   *     dispatched
	   */
	  constructor(error, target) {
	    super('error', target);

	    this.message = error.message;
	    this.error = error;
	  }
	}

	/**
	 * This provides methods for emulating the `EventTarget` interface. It's not
	 * meant to be used directly.
	 *
	 * @mixin
	 */
	const EventTarget = {
	  /**
	   * Register an event listener.
	   *
	   * @param {String} type A string representing the event type to listen for
	   * @param {Function} listener The listener to add
	   * @param {Object} [options] An options object specifies characteristics about
	   *     the event listener
	   * @param {Boolean} [options.once=false] A `Boolean`` indicating that the
	   *     listener should be invoked at most once after being added. If `true`,
	   *     the listener would be automatically removed when invoked.
	   * @public
	   */
	  addEventListener(type, listener, options) {
	    if (typeof listener !== 'function') return;

	    function onMessage(data) {
	      listener.call(this, new MessageEvent(data, this));
	    }

	    function onClose(code, message) {
	      listener.call(this, new CloseEvent(code, message, this));
	    }

	    function onError(error) {
	      listener.call(this, new ErrorEvent(error, this));
	    }

	    function onOpen() {
	      listener.call(this, new OpenEvent(this));
	    }

	    const method = options && options.once ? 'once' : 'on';

	    if (type === 'message') {
	      onMessage._listener = listener;
	      this[method](type, onMessage);
	    } else if (type === 'close') {
	      onClose._listener = listener;
	      this[method](type, onClose);
	    } else if (type === 'error') {
	      onError._listener = listener;
	      this[method](type, onError);
	    } else if (type === 'open') {
	      onOpen._listener = listener;
	      this[method](type, onOpen);
	    } else {
	      this[method](type, listener);
	    }
	  },

	  /**
	   * Remove an event listener.
	   *
	   * @param {String} type A string representing the event type to remove
	   * @param {Function} listener The listener to remove
	   * @public
	   */
	  removeEventListener(type, listener) {
	    const listeners = this.listeners(type);

	    for (let i = 0; i < listeners.length; i++) {
	      if (listeners[i] === listener || listeners[i]._listener === listener) {
	        this.removeListener(type, listeners[i]);
	      }
	    }
	  }
	};

	eventTarget = EventTarget;
	return eventTarget;
}

var extension;
var hasRequiredExtension;

function requireExtension () {
	if (hasRequiredExtension) return extension;
	hasRequiredExtension = 1;

	//
	// Allowed token characters:
	//
	// '!', '#', '$', '%', '&', ''', '*', '+', '-',
	// '.', 0-9, A-Z, '^', '_', '`', a-z, '|', '~'
	//
	// tokenChars[32] === 0 // ' '
	// tokenChars[33] === 1 // '!'
	// tokenChars[34] === 0 // '"'
	// ...
	//
	// prettier-ignore
	const tokenChars = [
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
	  0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, // 32 - 47
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
	  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, // 80 - 95
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0 // 112 - 127
	];

	/**
	 * Adds an offer to the map of extension offers or a parameter to the map of
	 * parameters.
	 *
	 * @param {Object} dest The map of extension offers or parameters
	 * @param {String} name The extension or parameter name
	 * @param {(Object|Boolean|String)} elem The extension parameters or the
	 *     parameter value
	 * @private
	 */
	function push(dest, name, elem) {
	  if (dest[name] === undefined) dest[name] = [elem];
	  else dest[name].push(elem);
	}

	/**
	 * Parses the `Sec-WebSocket-Extensions` header into an object.
	 *
	 * @param {String} header The field value of the header
	 * @return {Object} The parsed object
	 * @public
	 */
	function parse(header) {
	  const offers = Object.create(null);

	  if (header === undefined || header === '') return offers;

	  let params = Object.create(null);
	  let mustUnescape = false;
	  let isEscaping = false;
	  let inQuotes = false;
	  let extensionName;
	  let paramName;
	  let start = -1;
	  let end = -1;
	  let i = 0;

	  for (; i < header.length; i++) {
	    const code = header.charCodeAt(i);

	    if (extensionName === undefined) {
	      if (end === -1 && tokenChars[code] === 1) {
	        if (start === -1) start = i;
	      } else if (code === 0x20 /* ' ' */ || code === 0x09 /* '\t' */) {
	        if (end === -1 && start !== -1) end = i;
	      } else if (code === 0x3b /* ';' */ || code === 0x2c /* ',' */) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        const name = header.slice(start, end);
	        if (code === 0x2c) {
	          push(offers, name, params);
	          params = Object.create(null);
	        } else {
	          extensionName = name;
	        }

	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    } else if (paramName === undefined) {
	      if (end === -1 && tokenChars[code] === 1) {
	        if (start === -1) start = i;
	      } else if (code === 0x20 || code === 0x09) {
	        if (end === -1 && start !== -1) end = i;
	      } else if (code === 0x3b || code === 0x2c) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        push(params, header.slice(start, end), true);
	        if (code === 0x2c) {
	          push(offers, extensionName, params);
	          params = Object.create(null);
	          extensionName = undefined;
	        }

	        start = end = -1;
	      } else if (code === 0x3d /* '=' */ && start !== -1 && end === -1) {
	        paramName = header.slice(start, i);
	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    } else {
	      //
	      // The value of a quoted-string after unescaping must conform to the
	      // token ABNF, so only token characters are valid.
	      // Ref: https://tools.ietf.org/html/rfc6455#section-9.1
	      //
	      if (isEscaping) {
	        if (tokenChars[code] !== 1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }
	        if (start === -1) start = i;
	        else if (!mustUnescape) mustUnescape = true;
	        isEscaping = false;
	      } else if (inQuotes) {
	        if (tokenChars[code] === 1) {
	          if (start === -1) start = i;
	        } else if (code === 0x22 /* '"' */ && start !== -1) {
	          inQuotes = false;
	          end = i;
	        } else if (code === 0x5c /* '\' */) {
	          isEscaping = true;
	        } else {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }
	      } else if (code === 0x22 && header.charCodeAt(i - 1) === 0x3d) {
	        inQuotes = true;
	      } else if (end === -1 && tokenChars[code] === 1) {
	        if (start === -1) start = i;
	      } else if (start !== -1 && (code === 0x20 || code === 0x09)) {
	        if (end === -1) end = i;
	      } else if (code === 0x3b || code === 0x2c) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        let value = header.slice(start, end);
	        if (mustUnescape) {
	          value = value.replace(/\\/g, '');
	          mustUnescape = false;
	        }
	        push(params, paramName, value);
	        if (code === 0x2c) {
	          push(offers, extensionName, params);
	          params = Object.create(null);
	          extensionName = undefined;
	        }

	        paramName = undefined;
	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    }
	  }

	  if (start === -1 || inQuotes) {
	    throw new SyntaxError('Unexpected end of input');
	  }

	  if (end === -1) end = i;
	  const token = header.slice(start, end);
	  if (extensionName === undefined) {
	    push(offers, token, params);
	  } else {
	    if (paramName === undefined) {
	      push(params, token, true);
	    } else if (mustUnescape) {
	      push(params, paramName, token.replace(/\\/g, ''));
	    } else {
	      push(params, paramName, token);
	    }
	    push(offers, extensionName, params);
	  }

	  return offers;
	}

	/**
	 * Builds the `Sec-WebSocket-Extensions` header field value.
	 *
	 * @param {Object} extensions The map of extensions and parameters to format
	 * @return {String} A string representing the given object
	 * @public
	 */
	function format(extensions) {
	  return Object.keys(extensions)
	    .map((extension) => {
	      let configurations = extensions[extension];
	      if (!Array.isArray(configurations)) configurations = [configurations];
	      return configurations
	        .map((params) => {
	          return [extension]
	            .concat(
	              Object.keys(params).map((k) => {
	                let values = params[k];
	                if (!Array.isArray(values)) values = [values];
	                return values
	                  .map((v) => (v === true ? k : `${k}=${v}`))
	                  .join('; ');
	              })
	            )
	            .join('; ');
	        })
	        .join(', ');
	    })
	    .join(', ');
	}

	extension = { format, parse };
	return extension;
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Readable$" }] */

var websocket$3;
var hasRequiredWebsocket$3;

function requireWebsocket$3 () {
	if (hasRequiredWebsocket$3) return websocket$3;
	hasRequiredWebsocket$3 = 1;

	const EventEmitter = eventsExports;
	const https = require$$0$3;
	const http = require$$0$2;
	const net = require$$0$4;
	const tls = require$$4$1;
	const { randomBytes, createHash } = require$$0$1;
	const { URL } = require$$1;

	const PerMessageDeflate = requirePermessageDeflate();
	const Receiver = requireReceiver();
	const Sender = requireSender();
	const {
	  BINARY_TYPES,
	  EMPTY_BUFFER,
	  GUID,
	  kStatusCode,
	  kWebSocket,
	  NOOP
	} = requireConstants();
	const { addEventListener, removeEventListener } = requireEventTarget();
	const { format, parse } = requireExtension();
	const { toBuffer } = requireBufferUtil();

	const readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
	const protocolVersions = [8, 13];
	const closeTimeout = 30 * 1000;

	/**
	 * Class representing a WebSocket.
	 *
	 * @extends EventEmitter
	 */
	class WebSocket extends EventEmitter {
	  /**
	   * Create a new `WebSocket`.
	   *
	   * @param {(String|URL)} address The URL to which to connect
	   * @param {(String|String[])} [protocols] The subprotocols
	   * @param {Object} [options] Connection options
	   */
	  constructor(address, protocols, options) {
	    super();

	    this._binaryType = BINARY_TYPES[0];
	    this._closeCode = 1006;
	    this._closeFrameReceived = false;
	    this._closeFrameSent = false;
	    this._closeMessage = '';
	    this._closeTimer = null;
	    this._extensions = {};
	    this._protocol = '';
	    this._readyState = WebSocket.CONNECTING;
	    this._receiver = null;
	    this._sender = null;
	    this._socket = null;

	    if (address !== null) {
	      this._bufferedAmount = 0;
	      this._isServer = false;
	      this._redirects = 0;

	      if (Array.isArray(protocols)) {
	        protocols = protocols.join(', ');
	      } else if (typeof protocols === 'object' && protocols !== null) {
	        options = protocols;
	        protocols = undefined;
	      }

	      initAsClient(this, address, protocols, options);
	    } else {
	      this._isServer = true;
	    }
	  }

	  /**
	   * This deviates from the WHATWG interface since ws doesn't support the
	   * required default "blob" type (instead we define a custom "nodebuffer"
	   * type).
	   *
	   * @type {String}
	   */
	  get binaryType() {
	    return this._binaryType;
	  }

	  set binaryType(type) {
	    if (!BINARY_TYPES.includes(type)) return;

	    this._binaryType = type;

	    //
	    // Allow to change `binaryType` on the fly.
	    //
	    if (this._receiver) this._receiver._binaryType = type;
	  }

	  /**
	   * @type {Number}
	   */
	  get bufferedAmount() {
	    if (!this._socket) return this._bufferedAmount;

	    return this._socket._writableState.length + this._sender._bufferedBytes;
	  }

	  /**
	   * @type {String}
	   */
	  get extensions() {
	    return Object.keys(this._extensions).join();
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onclose() {
	    return undefined;
	  }

	  /* istanbul ignore next */
	  set onclose(listener) {}

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onerror() {
	    return undefined;
	  }

	  /* istanbul ignore next */
	  set onerror(listener) {}

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onopen() {
	    return undefined;
	  }

	  /* istanbul ignore next */
	  set onopen(listener) {}

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onmessage() {
	    return undefined;
	  }

	  /* istanbul ignore next */
	  set onmessage(listener) {}

	  /**
	   * @type {String}
	   */
	  get protocol() {
	    return this._protocol;
	  }

	  /**
	   * @type {Number}
	   */
	  get readyState() {
	    return this._readyState;
	  }

	  /**
	   * @type {String}
	   */
	  get url() {
	    return this._url;
	  }

	  /**
	   * Set up the socket and the internal resources.
	   *
	   * @param {(net.Socket|tls.Socket)} socket The network socket between the
	   *     server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Number} [maxPayload=0] The maximum allowed message size
	   * @private
	   */
	  setSocket(socket, head, maxPayload) {
	    const receiver = new Receiver(
	      this.binaryType,
	      this._extensions,
	      this._isServer,
	      maxPayload
	    );

	    this._sender = new Sender(socket, this._extensions);
	    this._receiver = receiver;
	    this._socket = socket;

	    receiver[kWebSocket] = this;
	    socket[kWebSocket] = this;

	    receiver.on('conclude', receiverOnConclude);
	    receiver.on('drain', receiverOnDrain);
	    receiver.on('error', receiverOnError);
	    receiver.on('message', receiverOnMessage);
	    receiver.on('ping', receiverOnPing);
	    receiver.on('pong', receiverOnPong);

	    socket.setTimeout(0);
	    socket.setNoDelay();

	    if (head.length > 0) socket.unshift(head);

	    socket.on('close', socketOnClose);
	    socket.on('data', socketOnData);
	    socket.on('end', socketOnEnd);
	    socket.on('error', socketOnError);

	    this._readyState = WebSocket.OPEN;
	    this.emit('open');
	  }

	  /**
	   * Emit the `'close'` event.
	   *
	   * @private
	   */
	  emitClose() {
	    if (!this._socket) {
	      this._readyState = WebSocket.CLOSED;
	      this.emit('close', this._closeCode, this._closeMessage);
	      return;
	    }

	    if (this._extensions[PerMessageDeflate.extensionName]) {
	      this._extensions[PerMessageDeflate.extensionName].cleanup();
	    }

	    this._receiver.removeAllListeners();
	    this._readyState = WebSocket.CLOSED;
	    this.emit('close', this._closeCode, this._closeMessage);
	  }

	  /**
	   * Start a closing handshake.
	   *
	   *          +----------+   +-----------+   +----------+
	   *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
	   *    |     +----------+   +-----------+   +----------+     |
	   *          +----------+   +-----------+         |
	   * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
	   *          +----------+   +-----------+   |
	   *    |           |                        |   +---+        |
	   *                +------------------------+-->|fin| - - - -
	   *    |         +---+                      |   +---+
	   *     - - - - -|fin|<---------------------+
	   *              +---+
	   *
	   * @param {Number} [code] Status code explaining why the connection is closing
	   * @param {String} [data] A string explaining why the connection is closing
	   * @public
	   */
	  close(code, data) {
	    if (this.readyState === WebSocket.CLOSED) return;
	    if (this.readyState === WebSocket.CONNECTING) {
	      const msg = 'WebSocket was closed before the connection was established';
	      return abortHandshake(this, this._req, msg);
	    }

	    if (this.readyState === WebSocket.CLOSING) {
	      if (
	        this._closeFrameSent &&
	        (this._closeFrameReceived || this._receiver._writableState.errorEmitted)
	      ) {
	        this._socket.end();
	      }

	      return;
	    }

	    this._readyState = WebSocket.CLOSING;
	    this._sender.close(code, data, !this._isServer, (err) => {
	      //
	      // This error is handled by the `'error'` listener on the socket. We only
	      // want to know if the close frame has been sent here.
	      //
	      if (err) return;

	      this._closeFrameSent = true;

	      if (
	        this._closeFrameReceived ||
	        this._receiver._writableState.errorEmitted
	      ) {
	        this._socket.end();
	      }
	    });

	    //
	    // Specify a timeout for the closing handshake to complete.
	    //
	    this._closeTimer = setTimeout(
	      this._socket.destroy.bind(this._socket),
	      closeTimeout
	    );
	  }

	  /**
	   * Send a ping.
	   *
	   * @param {*} [data] The data to send
	   * @param {Boolean} [mask] Indicates whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when the ping is sent
	   * @public
	   */
	  ping(data, mask, cb) {
	    if (this.readyState === WebSocket.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof data === 'function') {
	      cb = data;
	      data = mask = undefined;
	    } else if (typeof mask === 'function') {
	      cb = mask;
	      mask = undefined;
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    if (mask === undefined) mask = !this._isServer;
	    this._sender.ping(data || EMPTY_BUFFER, mask, cb);
	  }

	  /**
	   * Send a pong.
	   *
	   * @param {*} [data] The data to send
	   * @param {Boolean} [mask] Indicates whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when the pong is sent
	   * @public
	   */
	  pong(data, mask, cb) {
	    if (this.readyState === WebSocket.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof data === 'function') {
	      cb = data;
	      data = mask = undefined;
	    } else if (typeof mask === 'function') {
	      cb = mask;
	      mask = undefined;
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    if (mask === undefined) mask = !this._isServer;
	    this._sender.pong(data || EMPTY_BUFFER, mask, cb);
	  }

	  /**
	   * Send a data message.
	   *
	   * @param {*} data The message to send
	   * @param {Object} [options] Options object
	   * @param {Boolean} [options.compress] Specifies whether or not to compress
	   *     `data`
	   * @param {Boolean} [options.binary] Specifies whether `data` is binary or
	   *     text
	   * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
	   *     last one
	   * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when data is written out
	   * @public
	   */
	  send(data, options, cb) {
	    if (this.readyState === WebSocket.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof options === 'function') {
	      cb = options;
	      options = {};
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    const opts = {
	      binary: typeof data !== 'string',
	      mask: !this._isServer,
	      compress: true,
	      fin: true,
	      ...options
	    };

	    if (!this._extensions[PerMessageDeflate.extensionName]) {
	      opts.compress = false;
	    }

	    this._sender.send(data || EMPTY_BUFFER, opts, cb);
	  }

	  /**
	   * Forcibly close the connection.
	   *
	   * @public
	   */
	  terminate() {
	    if (this.readyState === WebSocket.CLOSED) return;
	    if (this.readyState === WebSocket.CONNECTING) {
	      const msg = 'WebSocket was closed before the connection was established';
	      return abortHandshake(this, this._req, msg);
	    }

	    if (this._socket) {
	      this._readyState = WebSocket.CLOSING;
	      this._socket.destroy();
	    }
	  }
	}

	/**
	 * @constant {Number} CONNECTING
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'CONNECTING', {
	  enumerable: true,
	  value: readyStates.indexOf('CONNECTING')
	});

	/**
	 * @constant {Number} CONNECTING
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'CONNECTING', {
	  enumerable: true,
	  value: readyStates.indexOf('CONNECTING')
	});

	/**
	 * @constant {Number} OPEN
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'OPEN', {
	  enumerable: true,
	  value: readyStates.indexOf('OPEN')
	});

	/**
	 * @constant {Number} OPEN
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'OPEN', {
	  enumerable: true,
	  value: readyStates.indexOf('OPEN')
	});

	/**
	 * @constant {Number} CLOSING
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'CLOSING', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSING')
	});

	/**
	 * @constant {Number} CLOSING
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'CLOSING', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSING')
	});

	/**
	 * @constant {Number} CLOSED
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'CLOSED', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSED')
	});

	/**
	 * @constant {Number} CLOSED
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'CLOSED', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSED')
	});

	[
	  'binaryType',
	  'bufferedAmount',
	  'extensions',
	  'protocol',
	  'readyState',
	  'url'
	].forEach((property) => {
	  Object.defineProperty(WebSocket.prototype, property, { enumerable: true });
	});

	//
	// Add the `onopen`, `onerror`, `onclose`, and `onmessage` attributes.
	// See https://html.spec.whatwg.org/multipage/comms.html#the-websocket-interface
	//
	['open', 'error', 'close', 'message'].forEach((method) => {
	  Object.defineProperty(WebSocket.prototype, `on${method}`, {
	    enumerable: true,
	    get() {
	      const listeners = this.listeners(method);
	      for (let i = 0; i < listeners.length; i++) {
	        if (listeners[i]._listener) return listeners[i]._listener;
	      }

	      return undefined;
	    },
	    set(listener) {
	      const listeners = this.listeners(method);
	      for (let i = 0; i < listeners.length; i++) {
	        //
	        // Remove only the listeners added via `addEventListener`.
	        //
	        if (listeners[i]._listener) this.removeListener(method, listeners[i]);
	      }
	      this.addEventListener(method, listener);
	    }
	  });
	});

	WebSocket.prototype.addEventListener = addEventListener;
	WebSocket.prototype.removeEventListener = removeEventListener;

	websocket$3 = WebSocket;

	/**
	 * Initialize a WebSocket client.
	 *
	 * @param {WebSocket} websocket The client to initialize
	 * @param {(String|URL)} address The URL to which to connect
	 * @param {String} [protocols] The subprotocols
	 * @param {Object} [options] Connection options
	 * @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
	 *     permessage-deflate
	 * @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
	 *     handshake request
	 * @param {Number} [options.protocolVersion=13] Value of the
	 *     `Sec-WebSocket-Version` header
	 * @param {String} [options.origin] Value of the `Origin` or
	 *     `Sec-WebSocket-Origin` header
	 * @param {Number} [options.maxPayload=104857600] The maximum allowed message
	 *     size
	 * @param {Boolean} [options.followRedirects=false] Whether or not to follow
	 *     redirects
	 * @param {Number} [options.maxRedirects=10] The maximum number of redirects
	 *     allowed
	 * @private
	 */
	function initAsClient(websocket, address, protocols, options) {
	  const opts = {
	    protocolVersion: protocolVersions[1],
	    maxPayload: 100 * 1024 * 1024,
	    perMessageDeflate: true,
	    followRedirects: false,
	    maxRedirects: 10,
	    ...options,
	    createConnection: undefined,
	    socketPath: undefined,
	    hostname: undefined,
	    protocol: undefined,
	    timeout: undefined,
	    method: undefined,
	    host: undefined,
	    path: undefined,
	    port: undefined
	  };

	  if (!protocolVersions.includes(opts.protocolVersion)) {
	    throw new RangeError(
	      `Unsupported protocol version: ${opts.protocolVersion} ` +
	        `(supported versions: ${protocolVersions.join(', ')})`
	    );
	  }

	  let parsedUrl;

	  if (address instanceof URL) {
	    parsedUrl = address;
	    websocket._url = address.href;
	  } else {
	    parsedUrl = new URL(address);
	    websocket._url = address;
	  }

	  const isUnixSocket = parsedUrl.protocol === 'ws+unix:';

	  if (!parsedUrl.host && (!isUnixSocket || !parsedUrl.pathname)) {
	    const err = new Error(`Invalid URL: ${websocket.url}`);

	    if (websocket._redirects === 0) {
	      throw err;
	    } else {
	      emitErrorAndClose(websocket, err);
	      return;
	    }
	  }

	  const isSecure =
	    parsedUrl.protocol === 'wss:' || parsedUrl.protocol === 'https:';
	  const defaultPort = isSecure ? 443 : 80;
	  const key = randomBytes(16).toString('base64');
	  const get = isSecure ? https.get : http.get;
	  let perMessageDeflate;

	  opts.createConnection = isSecure ? tlsConnect : netConnect;
	  opts.defaultPort = opts.defaultPort || defaultPort;
	  opts.port = parsedUrl.port || defaultPort;
	  opts.host = parsedUrl.hostname.startsWith('[')
	    ? parsedUrl.hostname.slice(1, -1)
	    : parsedUrl.hostname;
	  opts.headers = {
	    'Sec-WebSocket-Version': opts.protocolVersion,
	    'Sec-WebSocket-Key': key,
	    Connection: 'Upgrade',
	    Upgrade: 'websocket',
	    ...opts.headers
	  };
	  opts.path = parsedUrl.pathname + parsedUrl.search;
	  opts.timeout = opts.handshakeTimeout;

	  if (opts.perMessageDeflate) {
	    perMessageDeflate = new PerMessageDeflate(
	      opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
	      false,
	      opts.maxPayload
	    );
	    opts.headers['Sec-WebSocket-Extensions'] = format({
	      [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
	    });
	  }
	  if (protocols) {
	    opts.headers['Sec-WebSocket-Protocol'] = protocols;
	  }
	  if (opts.origin) {
	    if (opts.protocolVersion < 13) {
	      opts.headers['Sec-WebSocket-Origin'] = opts.origin;
	    } else {
	      opts.headers.Origin = opts.origin;
	    }
	  }
	  if (parsedUrl.username || parsedUrl.password) {
	    opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
	  }

	  if (isUnixSocket) {
	    const parts = opts.path.split(':');

	    opts.socketPath = parts[0];
	    opts.path = parts[1];
	  }

	  if (opts.followRedirects) {
	    if (websocket._redirects === 0) {
	      websocket._originalUnixSocket = isUnixSocket;
	      websocket._originalSecure = isSecure;
	      websocket._originalHostOrSocketPath = isUnixSocket
	        ? opts.socketPath
	        : parsedUrl.host;

	      const headers = options && options.headers;

	      //
	      // Shallow copy the user provided options so that headers can be changed
	      // without mutating the original object.
	      //
	      options = { ...options, headers: {} };

	      if (headers) {
	        for (const [key, value] of Object.entries(headers)) {
	          options.headers[key.toLowerCase()] = value;
	        }
	      }
	    } else {
	      const isSameHost = isUnixSocket
	        ? websocket._originalUnixSocket
	          ? opts.socketPath === websocket._originalHostOrSocketPath
	          : false
	        : websocket._originalUnixSocket
	        ? false
	        : parsedUrl.host === websocket._originalHostOrSocketPath;

	      if (!isSameHost || (websocket._originalSecure && !isSecure)) {
	        //
	        // Match curl 7.77.0 behavior and drop the following headers. These
	        // headers are also dropped when following a redirect to a subdomain.
	        //
	        delete opts.headers.authorization;
	        delete opts.headers.cookie;

	        if (!isSameHost) delete opts.headers.host;

	        opts.auth = undefined;
	      }
	    }

	    //
	    // Match curl 7.77.0 behavior and make the first `Authorization` header win.
	    // If the `Authorization` header is set, then there is nothing to do as it
	    // will take precedence.
	    //
	    if (opts.auth && !options.headers.authorization) {
	      options.headers.authorization =
	        'Basic ' + Buffer.from(opts.auth).toString('base64');
	    }
	  }

	  let req = (websocket._req = get(opts));

	  if (opts.timeout) {
	    req.on('timeout', () => {
	      abortHandshake(websocket, req, 'Opening handshake has timed out');
	    });
	  }

	  req.on('error', (err) => {
	    if (req === null || req.aborted) return;

	    req = websocket._req = null;
	    emitErrorAndClose(websocket, err);
	  });

	  req.on('response', (res) => {
	    const location = res.headers.location;
	    const statusCode = res.statusCode;

	    if (
	      location &&
	      opts.followRedirects &&
	      statusCode >= 300 &&
	      statusCode < 400
	    ) {
	      if (++websocket._redirects > opts.maxRedirects) {
	        abortHandshake(websocket, req, 'Maximum redirects exceeded');
	        return;
	      }

	      req.abort();

	      let addr;

	      try {
	        addr = new URL(location, address);
	      } catch (err) {
	        emitErrorAndClose(websocket, err);
	        return;
	      }

	      initAsClient(websocket, addr, protocols, options);
	    } else if (!websocket.emit('unexpected-response', req, res)) {
	      abortHandshake(
	        websocket,
	        req,
	        `Unexpected server response: ${res.statusCode}`
	      );
	    }
	  });

	  req.on('upgrade', (res, socket, head) => {
	    websocket.emit('upgrade', res);

	    //
	    // The user may have closed the connection from a listener of the `upgrade`
	    // event.
	    //
	    if (websocket.readyState !== WebSocket.CONNECTING) return;

	    req = websocket._req = null;

	    if (res.headers.upgrade.toLowerCase() !== 'websocket') {
	      abortHandshake(websocket, socket, 'Invalid Upgrade header');
	      return;
	    }

	    const digest = createHash('sha1')
	      .update(key + GUID)
	      .digest('base64');

	    if (res.headers['sec-websocket-accept'] !== digest) {
	      abortHandshake(websocket, socket, 'Invalid Sec-WebSocket-Accept header');
	      return;
	    }

	    const serverProt = res.headers['sec-websocket-protocol'];
	    const protList = (protocols || '').split(/, */);
	    let protError;

	    if (!protocols && serverProt) {
	      protError = 'Server sent a subprotocol but none was requested';
	    } else if (protocols && !serverProt) {
	      protError = 'Server sent no subprotocol';
	    } else if (serverProt && !protList.includes(serverProt)) {
	      protError = 'Server sent an invalid subprotocol';
	    }

	    if (protError) {
	      abortHandshake(websocket, socket, protError);
	      return;
	    }

	    if (serverProt) websocket._protocol = serverProt;

	    const secWebSocketExtensions = res.headers['sec-websocket-extensions'];

	    if (secWebSocketExtensions !== undefined) {
	      if (!perMessageDeflate) {
	        const message =
	          'Server sent a Sec-WebSocket-Extensions header but no extension ' +
	          'was requested';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      let extensions;

	      try {
	        extensions = parse(secWebSocketExtensions);
	      } catch (err) {
	        const message = 'Invalid Sec-WebSocket-Extensions header';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      const extensionNames = Object.keys(extensions);

	      if (extensionNames.length) {
	        if (
	          extensionNames.length !== 1 ||
	          extensionNames[0] !== PerMessageDeflate.extensionName
	        ) {
	          const message =
	            'Server indicated an extension that was not requested';
	          abortHandshake(websocket, socket, message);
	          return;
	        }

	        try {
	          perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
	        } catch (err) {
	          const message = 'Invalid Sec-WebSocket-Extensions header';
	          abortHandshake(websocket, socket, message);
	          return;
	        }

	        websocket._extensions[PerMessageDeflate.extensionName] =
	          perMessageDeflate;
	      }
	    }

	    websocket.setSocket(socket, head, opts.maxPayload);
	  });
	}

	/**
	 * Emit the `'error'` and `'close'` event.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {Error} The error to emit
	 * @private
	 */
	function emitErrorAndClose(websocket, err) {
	  websocket._readyState = WebSocket.CLOSING;
	  websocket.emit('error', err);
	  websocket.emitClose();
	}

	/**
	 * Create a `net.Socket` and initiate a connection.
	 *
	 * @param {Object} options Connection options
	 * @return {net.Socket} The newly created socket used to start the connection
	 * @private
	 */
	function netConnect(options) {
	  options.path = options.socketPath;
	  return net.connect(options);
	}

	/**
	 * Create a `tls.TLSSocket` and initiate a connection.
	 *
	 * @param {Object} options Connection options
	 * @return {tls.TLSSocket} The newly created socket used to start the connection
	 * @private
	 */
	function tlsConnect(options) {
	  options.path = undefined;

	  if (!options.servername && options.servername !== '') {
	    options.servername = net.isIP(options.host) ? '' : options.host;
	  }

	  return tls.connect(options);
	}

	/**
	 * Abort the handshake and emit an error.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {(http.ClientRequest|net.Socket|tls.Socket)} stream The request to
	 *     abort or the socket to destroy
	 * @param {String} message The error message
	 * @private
	 */
	function abortHandshake(websocket, stream, message) {
	  websocket._readyState = WebSocket.CLOSING;

	  const err = new Error(message);
	  Error.captureStackTrace(err, abortHandshake);

	  if (stream.setHeader) {
	    stream.abort();

	    if (stream.socket && !stream.socket.destroyed) {
	      //
	      // On Node.js >= 14.3.0 `request.abort()` does not destroy the socket if
	      // called after the request completed. See
	      // https://github.com/websockets/ws/issues/1869.
	      //
	      stream.socket.destroy();
	    }

	    stream.once('abort', websocket.emitClose.bind(websocket));
	    websocket.emit('error', err);
	  } else {
	    stream.destroy(err);
	    stream.once('error', websocket.emit.bind(websocket, 'error'));
	    stream.once('close', websocket.emitClose.bind(websocket));
	  }
	}

	/**
	 * Handle cases where the `ping()`, `pong()`, or `send()` methods are called
	 * when the `readyState` attribute is `CLOSING` or `CLOSED`.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {*} [data] The data to send
	 * @param {Function} [cb] Callback
	 * @private
	 */
	function sendAfterClose(websocket, data, cb) {
	  if (data) {
	    const length = toBuffer(data).length;

	    //
	    // The `_bufferedAmount` property is used only when the peer is a client and
	    // the opening handshake fails. Under these circumstances, in fact, the
	    // `setSocket()` method is not called, so the `_socket` and `_sender`
	    // properties are set to `null`.
	    //
	    if (websocket._socket) websocket._sender._bufferedBytes += length;
	    else websocket._bufferedAmount += length;
	  }

	  if (cb) {
	    const err = new Error(
	      `WebSocket is not open: readyState ${websocket.readyState} ` +
	        `(${readyStates[websocket.readyState]})`
	    );
	    cb(err);
	  }
	}

	/**
	 * The listener of the `Receiver` `'conclude'` event.
	 *
	 * @param {Number} code The status code
	 * @param {String} reason The reason for closing
	 * @private
	 */
	function receiverOnConclude(code, reason) {
	  const websocket = this[kWebSocket];

	  websocket._closeFrameReceived = true;
	  websocket._closeMessage = reason;
	  websocket._closeCode = code;

	  if (websocket._socket[kWebSocket] === undefined) return;

	  websocket._socket.removeListener('data', socketOnData);
	  process.nextTick(resume, websocket._socket);

	  if (code === 1005) websocket.close();
	  else websocket.close(code, reason);
	}

	/**
	 * The listener of the `Receiver` `'drain'` event.
	 *
	 * @private
	 */
	function receiverOnDrain() {
	  this[kWebSocket]._socket.resume();
	}

	/**
	 * The listener of the `Receiver` `'error'` event.
	 *
	 * @param {(RangeError|Error)} err The emitted error
	 * @private
	 */
	function receiverOnError(err) {
	  const websocket = this[kWebSocket];

	  if (websocket._socket[kWebSocket] !== undefined) {
	    websocket._socket.removeListener('data', socketOnData);

	    //
	    // On Node.js < 14.0.0 the `'error'` event is emitted synchronously. See
	    // https://github.com/websockets/ws/issues/1940.
	    //
	    process.nextTick(resume, websocket._socket);

	    websocket.close(err[kStatusCode]);
	  }

	  websocket.emit('error', err);
	}

	/**
	 * The listener of the `Receiver` `'finish'` event.
	 *
	 * @private
	 */
	function receiverOnFinish() {
	  this[kWebSocket].emitClose();
	}

	/**
	 * The listener of the `Receiver` `'message'` event.
	 *
	 * @param {(String|Buffer|ArrayBuffer|Buffer[])} data The message
	 * @private
	 */
	function receiverOnMessage(data) {
	  this[kWebSocket].emit('message', data);
	}

	/**
	 * The listener of the `Receiver` `'ping'` event.
	 *
	 * @param {Buffer} data The data included in the ping frame
	 * @private
	 */
	function receiverOnPing(data) {
	  const websocket = this[kWebSocket];

	  websocket.pong(data, !websocket._isServer, NOOP);
	  websocket.emit('ping', data);
	}

	/**
	 * The listener of the `Receiver` `'pong'` event.
	 *
	 * @param {Buffer} data The data included in the pong frame
	 * @private
	 */
	function receiverOnPong(data) {
	  this[kWebSocket].emit('pong', data);
	}

	/**
	 * Resume a readable stream
	 *
	 * @param {Readable} stream The readable stream
	 * @private
	 */
	function resume(stream) {
	  stream.resume();
	}

	/**
	 * The listener of the `net.Socket` `'close'` event.
	 *
	 * @private
	 */
	function socketOnClose() {
	  const websocket = this[kWebSocket];

	  this.removeListener('close', socketOnClose);
	  this.removeListener('data', socketOnData);
	  this.removeListener('end', socketOnEnd);

	  websocket._readyState = WebSocket.CLOSING;

	  let chunk;

	  //
	  // The close frame might not have been received or the `'end'` event emitted,
	  // for example, if the socket was destroyed due to an error. Ensure that the
	  // `receiver` stream is closed after writing any remaining buffered data to
	  // it. If the readable side of the socket is in flowing mode then there is no
	  // buffered data as everything has been already written and `readable.read()`
	  // will return `null`. If instead, the socket is paused, any possible buffered
	  // data will be read as a single chunk.
	  //
	  if (
	    !this._readableState.endEmitted &&
	    !websocket._closeFrameReceived &&
	    !websocket._receiver._writableState.errorEmitted &&
	    (chunk = websocket._socket.read()) !== null
	  ) {
	    websocket._receiver.write(chunk);
	  }

	  websocket._receiver.end();

	  this[kWebSocket] = undefined;

	  clearTimeout(websocket._closeTimer);

	  if (
	    websocket._receiver._writableState.finished ||
	    websocket._receiver._writableState.errorEmitted
	  ) {
	    websocket.emitClose();
	  } else {
	    websocket._receiver.on('error', receiverOnFinish);
	    websocket._receiver.on('finish', receiverOnFinish);
	  }
	}

	/**
	 * The listener of the `net.Socket` `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function socketOnData(chunk) {
	  if (!this[kWebSocket]._receiver.write(chunk)) {
	    this.pause();
	  }
	}

	/**
	 * The listener of the `net.Socket` `'end'` event.
	 *
	 * @private
	 */
	function socketOnEnd() {
	  const websocket = this[kWebSocket];

	  websocket._readyState = WebSocket.CLOSING;
	  websocket._receiver.end();
	  this.end();
	}

	/**
	 * The listener of the `net.Socket` `'error'` event.
	 *
	 * @private
	 */
	function socketOnError() {
	  const websocket = this[kWebSocket];

	  this.removeListener('error', socketOnError);
	  this.on('error', NOOP);

	  if (websocket) {
	    websocket._readyState = WebSocket.CLOSING;
	    this.destroy();
	  }
	}
	return websocket$3;
}

var stream;
var hasRequiredStream;

function requireStream () {
	if (hasRequiredStream) return stream;
	hasRequiredStream = 1;

	const { Duplex } = require$$0;

	/**
	 * Emits the `'close'` event on a stream.
	 *
	 * @param {Duplex} stream The stream.
	 * @private
	 */
	function emitClose(stream) {
	  stream.emit('close');
	}

	/**
	 * The listener of the `'end'` event.
	 *
	 * @private
	 */
	function duplexOnEnd() {
	  if (!this.destroyed && this._writableState.finished) {
	    this.destroy();
	  }
	}

	/**
	 * The listener of the `'error'` event.
	 *
	 * @param {Error} err The error
	 * @private
	 */
	function duplexOnError(err) {
	  this.removeListener('error', duplexOnError);
	  this.destroy();
	  if (this.listenerCount('error') === 0) {
	    // Do not suppress the throwing behavior.
	    this.emit('error', err);
	  }
	}

	/**
	 * Wraps a `WebSocket` in a duplex stream.
	 *
	 * @param {WebSocket} ws The `WebSocket` to wrap
	 * @param {Object} [options] The options for the `Duplex` constructor
	 * @return {Duplex} The duplex stream
	 * @public
	 */
	function createWebSocketStream(ws, options) {
	  let resumeOnReceiverDrain = true;
	  let terminateOnDestroy = true;

	  function receiverOnDrain() {
	    if (resumeOnReceiverDrain) ws._socket.resume();
	  }

	  if (ws.readyState === ws.CONNECTING) {
	    ws.once('open', function open() {
	      ws._receiver.removeAllListeners('drain');
	      ws._receiver.on('drain', receiverOnDrain);
	    });
	  } else {
	    ws._receiver.removeAllListeners('drain');
	    ws._receiver.on('drain', receiverOnDrain);
	  }

	  const duplex = new Duplex({
	    ...options,
	    autoDestroy: false,
	    emitClose: false,
	    objectMode: false,
	    writableObjectMode: false
	  });

	  ws.on('message', function message(msg) {
	    if (!duplex.push(msg)) {
	      resumeOnReceiverDrain = false;
	      ws._socket.pause();
	    }
	  });

	  ws.once('error', function error(err) {
	    if (duplex.destroyed) return;

	    // Prevent `ws.terminate()` from being called by `duplex._destroy()`.
	    //
	    // - If the `'error'` event is emitted before the `'open'` event, then
	    //   `ws.terminate()` is a noop as no socket is assigned.
	    // - Otherwise, the error is re-emitted by the listener of the `'error'`
	    //   event of the `Receiver` object. The listener already closes the
	    //   connection by calling `ws.close()`. This allows a close frame to be
	    //   sent to the other peer. If `ws.terminate()` is called right after this,
	    //   then the close frame might not be sent.
	    terminateOnDestroy = false;
	    duplex.destroy(err);
	  });

	  ws.once('close', function close() {
	    if (duplex.destroyed) return;

	    duplex.push(null);
	  });

	  duplex._destroy = function (err, callback) {
	    if (ws.readyState === ws.CLOSED) {
	      callback(err);
	      process.nextTick(emitClose, duplex);
	      return;
	    }

	    let called = false;

	    ws.once('error', function error(err) {
	      called = true;
	      callback(err);
	    });

	    ws.once('close', function close() {
	      if (!called) callback(err);
	      process.nextTick(emitClose, duplex);
	    });

	    if (terminateOnDestroy) ws.terminate();
	  };

	  duplex._final = function (callback) {
	    if (ws.readyState === ws.CONNECTING) {
	      ws.once('open', function open() {
	        duplex._final(callback);
	      });
	      return;
	    }

	    // If the value of the `_socket` property is `null` it means that `ws` is a
	    // client websocket and the handshake failed. In fact, when this happens, a
	    // socket is never assigned to the websocket. Wait for the `'error'` event
	    // that will be emitted by the websocket.
	    if (ws._socket === null) return;

	    if (ws._socket._writableState.finished) {
	      callback();
	      if (duplex._readableState.endEmitted) duplex.destroy();
	    } else {
	      ws._socket.once('finish', function finish() {
	        // `duplex` is not destroyed here because the `'end'` event will be
	        // emitted on `duplex` after this `'finish'` event. The EOF signaling
	        // `null` chunk is, in fact, pushed when the websocket emits `'close'`.
	        callback();
	      });
	      ws.close();
	    }
	  };

	  duplex._read = function () {
	    if (
	      (ws.readyState === ws.OPEN || ws.readyState === ws.CLOSING) &&
	      !resumeOnReceiverDrain
	    ) {
	      resumeOnReceiverDrain = true;
	      if (!ws._receiver._writableState.needDrain) ws._socket.resume();
	    }
	  };

	  duplex._write = function (chunk, encoding, callback) {
	    if (ws.readyState === ws.CONNECTING) {
	      ws.once('open', function open() {
	        duplex._write(chunk, encoding, callback);
	      });
	      return;
	    }

	    ws.send(chunk, callback);
	  };

	  duplex.on('end', duplexOnEnd);
	  duplex.on('error', duplexOnError);
	  return duplex;
	}

	stream = createWebSocketStream;
	return stream;
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^net|tls|https$" }] */

var websocketServer;
var hasRequiredWebsocketServer;

function requireWebsocketServer () {
	if (hasRequiredWebsocketServer) return websocketServer;
	hasRequiredWebsocketServer = 1;

	const EventEmitter = eventsExports;
	const http = require$$0$2;
	const { createHash } = require$$0$1;

	const PerMessageDeflate = requirePermessageDeflate();
	const WebSocket = requireWebsocket$3();
	const { format, parse } = requireExtension();
	const { GUID, kWebSocket } = requireConstants();

	const keyRegex = /^[+/0-9A-Za-z]{22}==$/;

	const RUNNING = 0;
	const CLOSING = 1;
	const CLOSED = 2;

	/**
	 * Class representing a WebSocket server.
	 *
	 * @extends EventEmitter
	 */
	class WebSocketServer extends EventEmitter {
	  /**
	   * Create a `WebSocketServer` instance.
	   *
	   * @param {Object} options Configuration options
	   * @param {Number} [options.backlog=511] The maximum length of the queue of
	   *     pending connections
	   * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
	   *     track clients
	   * @param {Function} [options.handleProtocols] A hook to handle protocols
	   * @param {String} [options.host] The hostname where to bind the server
	   * @param {Number} [options.maxPayload=104857600] The maximum allowed message
	   *     size
	   * @param {Boolean} [options.noServer=false] Enable no server mode
	   * @param {String} [options.path] Accept only connections matching this path
	   * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
	   *     permessage-deflate
	   * @param {Number} [options.port] The port where to bind the server
	   * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
	   *     server to use
	   * @param {Function} [options.verifyClient] A hook to reject connections
	   * @param {Function} [callback] A listener for the `listening` event
	   */
	  constructor(options, callback) {
	    super();

	    options = {
	      maxPayload: 100 * 1024 * 1024,
	      perMessageDeflate: false,
	      handleProtocols: null,
	      clientTracking: true,
	      verifyClient: null,
	      noServer: false,
	      backlog: null, // use default (511 as implemented in net.js)
	      server: null,
	      host: null,
	      path: null,
	      port: null,
	      ...options
	    };

	    if (
	      (options.port == null && !options.server && !options.noServer) ||
	      (options.port != null && (options.server || options.noServer)) ||
	      (options.server && options.noServer)
	    ) {
	      throw new TypeError(
	        'One and only one of the "port", "server", or "noServer" options ' +
	          'must be specified'
	      );
	    }

	    if (options.port != null) {
	      this._server = http.createServer((req, res) => {
	        const body = http.STATUS_CODES[426];

	        res.writeHead(426, {
	          'Content-Length': body.length,
	          'Content-Type': 'text/plain'
	        });
	        res.end(body);
	      });
	      this._server.listen(
	        options.port,
	        options.host,
	        options.backlog,
	        callback
	      );
	    } else if (options.server) {
	      this._server = options.server;
	    }

	    if (this._server) {
	      const emitConnection = this.emit.bind(this, 'connection');

	      this._removeListeners = addListeners(this._server, {
	        listening: this.emit.bind(this, 'listening'),
	        error: this.emit.bind(this, 'error'),
	        upgrade: (req, socket, head) => {
	          this.handleUpgrade(req, socket, head, emitConnection);
	        }
	      });
	    }

	    if (options.perMessageDeflate === true) options.perMessageDeflate = {};
	    if (options.clientTracking) this.clients = new Set();
	    this.options = options;
	    this._state = RUNNING;
	  }

	  /**
	   * Returns the bound address, the address family name, and port of the server
	   * as reported by the operating system if listening on an IP socket.
	   * If the server is listening on a pipe or UNIX domain socket, the name is
	   * returned as a string.
	   *
	   * @return {(Object|String|null)} The address of the server
	   * @public
	   */
	  address() {
	    if (this.options.noServer) {
	      throw new Error('The server is operating in "noServer" mode');
	    }

	    if (!this._server) return null;
	    return this._server.address();
	  }

	  /**
	   * Close the server.
	   *
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  close(cb) {
	    if (cb) this.once('close', cb);

	    if (this._state === CLOSED) {
	      process.nextTick(emitClose, this);
	      return;
	    }

	    if (this._state === CLOSING) return;
	    this._state = CLOSING;

	    //
	    // Terminate all associated clients.
	    //
	    if (this.clients) {
	      for (const client of this.clients) client.terminate();
	    }

	    const server = this._server;

	    if (server) {
	      this._removeListeners();
	      this._removeListeners = this._server = null;

	      //
	      // Close the http server if it was internally created.
	      //
	      if (this.options.port != null) {
	        server.close(emitClose.bind(undefined, this));
	        return;
	      }
	    }

	    process.nextTick(emitClose, this);
	  }

	  /**
	   * See if a given request should be handled by this server instance.
	   *
	   * @param {http.IncomingMessage} req Request object to inspect
	   * @return {Boolean} `true` if the request is valid, else `false`
	   * @public
	   */
	  shouldHandle(req) {
	    if (this.options.path) {
	      const index = req.url.indexOf('?');
	      const pathname = index !== -1 ? req.url.slice(0, index) : req.url;

	      if (pathname !== this.options.path) return false;
	    }

	    return true;
	  }

	  /**
	   * Handle a HTTP Upgrade request.
	   *
	   * @param {http.IncomingMessage} req The request object
	   * @param {(net.Socket|tls.Socket)} socket The network socket between the
	   *     server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Function} cb Callback
	   * @public
	   */
	  handleUpgrade(req, socket, head, cb) {
	    socket.on('error', socketOnError);

	    const key =
	      req.headers['sec-websocket-key'] !== undefined
	        ? req.headers['sec-websocket-key'].trim()
	        : false;
	    const version = +req.headers['sec-websocket-version'];
	    const extensions = {};

	    if (
	      req.method !== 'GET' ||
	      req.headers.upgrade.toLowerCase() !== 'websocket' ||
	      !key ||
	      !keyRegex.test(key) ||
	      (version !== 8 && version !== 13) ||
	      !this.shouldHandle(req)
	    ) {
	      return abortHandshake(socket, 400);
	    }

	    if (this.options.perMessageDeflate) {
	      const perMessageDeflate = new PerMessageDeflate(
	        this.options.perMessageDeflate,
	        true,
	        this.options.maxPayload
	      );

	      try {
	        const offers = parse(req.headers['sec-websocket-extensions']);

	        if (offers[PerMessageDeflate.extensionName]) {
	          perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
	          extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
	        }
	      } catch (err) {
	        return abortHandshake(socket, 400);
	      }
	    }

	    //
	    // Optionally call external client verification handler.
	    //
	    if (this.options.verifyClient) {
	      const info = {
	        origin:
	          req.headers[`${version === 8 ? 'sec-websocket-origin' : 'origin'}`],
	        secure: !!(req.socket.authorized || req.socket.encrypted),
	        req
	      };

	      if (this.options.verifyClient.length === 2) {
	        this.options.verifyClient(info, (verified, code, message, headers) => {
	          if (!verified) {
	            return abortHandshake(socket, code || 401, message, headers);
	          }

	          this.completeUpgrade(key, extensions, req, socket, head, cb);
	        });
	        return;
	      }

	      if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
	    }

	    this.completeUpgrade(key, extensions, req, socket, head, cb);
	  }

	  /**
	   * Upgrade the connection to WebSocket.
	   *
	   * @param {String} key The value of the `Sec-WebSocket-Key` header
	   * @param {Object} extensions The accepted extensions
	   * @param {http.IncomingMessage} req The request object
	   * @param {(net.Socket|tls.Socket)} socket The network socket between the
	   *     server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Function} cb Callback
	   * @throws {Error} If called more than once with the same socket
	   * @private
	   */
	  completeUpgrade(key, extensions, req, socket, head, cb) {
	    //
	    // Destroy the socket if the client has already sent a FIN packet.
	    //
	    if (!socket.readable || !socket.writable) return socket.destroy();

	    if (socket[kWebSocket]) {
	      throw new Error(
	        'server.handleUpgrade() was called more than once with the same ' +
	          'socket, possibly due to a misconfiguration'
	      );
	    }

	    if (this._state > RUNNING) return abortHandshake(socket, 503);

	    const digest = createHash('sha1')
	      .update(key + GUID)
	      .digest('base64');

	    const headers = [
	      'HTTP/1.1 101 Switching Protocols',
	      'Upgrade: websocket',
	      'Connection: Upgrade',
	      `Sec-WebSocket-Accept: ${digest}`
	    ];

	    const ws = new WebSocket(null);
	    let protocol = req.headers['sec-websocket-protocol'];

	    if (protocol) {
	      protocol = protocol.split(',').map(trim);

	      //
	      // Optionally call external protocol selection handler.
	      //
	      if (this.options.handleProtocols) {
	        protocol = this.options.handleProtocols(protocol, req);
	      } else {
	        protocol = protocol[0];
	      }

	      if (protocol) {
	        headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
	        ws._protocol = protocol;
	      }
	    }

	    if (extensions[PerMessageDeflate.extensionName]) {
	      const params = extensions[PerMessageDeflate.extensionName].params;
	      const value = format({
	        [PerMessageDeflate.extensionName]: [params]
	      });
	      headers.push(`Sec-WebSocket-Extensions: ${value}`);
	      ws._extensions = extensions;
	    }

	    //
	    // Allow external modification/inspection of handshake headers.
	    //
	    this.emit('headers', headers, req);

	    socket.write(headers.concat('\r\n').join('\r\n'));
	    socket.removeListener('error', socketOnError);

	    ws.setSocket(socket, head, this.options.maxPayload);

	    if (this.clients) {
	      this.clients.add(ws);
	      ws.on('close', () => this.clients.delete(ws));
	    }

	    cb(ws, req);
	  }
	}

	websocketServer = WebSocketServer;

	/**
	 * Add event listeners on an `EventEmitter` using a map of <event, listener>
	 * pairs.
	 *
	 * @param {EventEmitter} server The event emitter
	 * @param {Object.<String, Function>} map The listeners to add
	 * @return {Function} A function that will remove the added listeners when
	 *     called
	 * @private
	 */
	function addListeners(server, map) {
	  for (const event of Object.keys(map)) server.on(event, map[event]);

	  return function removeListeners() {
	    for (const event of Object.keys(map)) {
	      server.removeListener(event, map[event]);
	    }
	  };
	}

	/**
	 * Emit a `'close'` event on an `EventEmitter`.
	 *
	 * @param {EventEmitter} server The event emitter
	 * @private
	 */
	function emitClose(server) {
	  server._state = CLOSED;
	  server.emit('close');
	}

	/**
	 * Handle premature socket errors.
	 *
	 * @private
	 */
	function socketOnError() {
	  this.destroy();
	}

	/**
	 * Close the connection when preconditions are not fulfilled.
	 *
	 * @param {(net.Socket|tls.Socket)} socket The socket of the upgrade request
	 * @param {Number} code The HTTP response status code
	 * @param {String} [message] The HTTP response body
	 * @param {Object} [headers] Additional HTTP response headers
	 * @private
	 */
	function abortHandshake(socket, code, message, headers) {
	  if (socket.writable) {
	    message = message || http.STATUS_CODES[code];
	    headers = {
	      Connection: 'close',
	      'Content-Type': 'text/html',
	      'Content-Length': Buffer.byteLength(message),
	      ...headers
	    };

	    socket.write(
	      `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` +
	        Object.keys(headers)
	          .map((h) => `${h}: ${headers[h]}`)
	          .join('\r\n') +
	        '\r\n\r\n' +
	        message
	    );
	  }

	  socket.removeListener('error', socketOnError);
	  socket.destroy();
	}

	/**
	 * Remove whitespace characters from both ends of a string.
	 *
	 * @param {String} str The string
	 * @return {String} A new string representing `str` stripped of whitespace
	 *     characters from both its beginning and end
	 * @private
	 */
	function trim(str) {
	  return str.trim();
	}
	return websocketServer;
}

var ws;
var hasRequiredWs;

function requireWs () {
	if (hasRequiredWs) return ws;
	hasRequiredWs = 1;

	const WebSocket = requireWebsocket$3();

	WebSocket.createWebSocketStream = requireStream();
	WebSocket.Server = requireWebsocketServer();
	WebSocket.Receiver = requireReceiver();
	WebSocket.Sender = requireSender();

	ws = WebSocket;
	return ws;
}

var hasRequiredNode;

function requireNode () {
	if (hasRequiredNode) return nodeExports;
	hasRequiredNode = 1;
	(function (module) {

		module.exports = requireWs();
} (node));
	return nodeExports;
}

var delayExports = {};
var delay = {
  get exports(){ return delayExports; },
  set exports(v){ delayExports = v; },
};

var hasRequiredDelay;

function requireDelay () {
	if (hasRequiredDelay) return delayExports;
	hasRequiredDelay = 1;

	// From https://github.com/sindresorhus/random-int/blob/c37741b56f76b9160b0b63dae4e9c64875128146/index.js#L13-L15
	const randomInteger = (minimum, maximum) => Math.floor((Math.random() * (maximum - minimum + 1)) + minimum);

	const createAbortError = () => {
		const error = new Error('Delay aborted');
		error.name = 'AbortError';
		return error;
	};

	const createDelay = ({clearTimeout: defaultClear, setTimeout: set, willResolve}) => (ms, {value, signal} = {}) => {
		if (signal && signal.aborted) {
			return Promise.reject(createAbortError());
		}

		let timeoutId;
		let settle;
		let rejectFn;
		const clear = defaultClear || clearTimeout;

		const signalListener = () => {
			clear(timeoutId);
			rejectFn(createAbortError());
		};

		const cleanup = () => {
			if (signal) {
				signal.removeEventListener('abort', signalListener);
			}
		};

		const delayPromise = new Promise((resolve, reject) => {
			settle = () => {
				cleanup();
				if (willResolve) {
					resolve(value);
				} else {
					reject(value);
				}
			};

			rejectFn = reject;
			timeoutId = (set || setTimeout)(settle, ms);
		});

		if (signal) {
			signal.addEventListener('abort', signalListener, {once: true});
		}

		delayPromise.clear = () => {
			clear(timeoutId);
			timeoutId = null;
			settle();
		};

		return delayPromise;
	};

	const createWithTimers = clearAndSet => {
		const delay = createDelay({...clearAndSet, willResolve: true});
		delay.reject = createDelay({...clearAndSet, willResolve: false});
		delay.range = (minimum, maximum, options) => delay(randomInteger(minimum, maximum), options);
		return delay;
	};

	const delay$1 = createWithTimers();
	delay$1.createWithTimers = createWithTimers;

	delay.exports = delay$1;
	// TODO: Remove this for the next major release
	delayExports.default = delay$1;
	return delayExports;
}

var websocket$2;
var hasRequiredWebsocket$2;

function requireWebsocket$2 () {
	if (hasRequiredWebsocket$2) return websocket$2;
	hasRequiredWebsocket$2 = 1;

	const WebSocket = requireNode();
	const utils = utilsExports$1;
	const delay = requireDelay();
	const Client = requireClient();

	/**
	 *  Constructor for a Jayson Websocket Client
	 *  @class ClientWebsocket
	 *  @constructor
	 *  @extends Client
	 *  @param {Object} [options]
	 *  @param {String} [options.url] When options.ws not provided this will be the URL to open the websocket to
	 *  @param {ws.WebSocket} [options.ws] When not provided will create a WebSocket instance with options.url
	 *  @param {Number} [options.timeout] Will wait this long in ms until callbacking with an error
	 *  @return {ClientWebsocket}
	 */
	const ClientWebsocket = function(options) {
	  if(!(this instanceof ClientWebsocket)) {
	    return new ClientWebsocket(options);
	  }
	  Client.call(this, options);

	  const defaults = utils.merge(this.options, {});
	  this.options = utils.merge(defaults, options || {});

	  const self = this;
	  
	  this.ws = this.options.ws || new WebSocket(this.options.url);
	  this.outstandingRequests = [];
	  this.handlers = {};

	  this.handlers.message = function (str) {
	    utils.JSON.parse(str, self.options, function(err, response) {
	      if (err) {
	        // invalid JSON is ignored
	        return;
	      }

	      if (Array.isArray(response)) {

	        // we have a batch reply
	        const matchingRequest = self.outstandingRequests.find(function ([request]) {
	          if (Array.isArray(request)) {
	            // a batch is considered matching if at least one response id matches one request id
	            return response.some(function (resp) {
	              if (utils.Response.isValidResponse(resp)) {
	                return request.some(function (req) {
	                  return req.id === resp.id;
	                });
	              }
	              return false;
	            });
	          }
	        });

	        if (matchingRequest) {
	          const [ , resolve ] = matchingRequest;
	          return resolve(response);
	        }

	      } else if (utils.Response.isValidResponse(response)) {

	        const matchingRequest = self.outstandingRequests.find(function ([request]) {
	          return !Array.isArray(request) && request.id === response.id;
	        });

	        if (matchingRequest) {
	          const [ , resolve ] = matchingRequest;
	          return resolve(response);
	        }
	      }

	    });
	  };

	  this.ws.on('message', this.handlers.message);
	};
	require$$3.inherits(ClientWebsocket, Client);

	websocket$2 = ClientWebsocket;

	/**
	 * @desc Removes all event listeners from Websocket instance which cancels all outstanding requests too
	 */
	ClientWebsocket.prototype.unlisten = function () {
	  for (const eventName in this.handlers) {
	    this.ws.off(eventName, this.handlers[eventName]);
	  }
	};

	ClientWebsocket.prototype._request = function(request, callback) {
	  const self = this;
	  const { ws, options } = this;

	  // we have to remove the object representing this request when the promise resolves/rejects
	  let outstandingItem;

	  Promise.race([
	    options.timeout > 0 ? delay(options.timeout).then(function () {
	      throw new Error('timeout reached after ' + options.timeout + ' ms');
	    }) : null,
	    new Promise(function (resolve, reject) {
	      utils.JSON.stringify(request, options, function(err, body) {
	        if (err) {
	          return resolve(err);
	        }

	        ws.send(body);

	        if (utils.Request.isNotification(request)) {
	          // notifications callback immediately since they don't have a reply
	          return resolve();
	        }

	        outstandingItem = [request, resolve, reject];
	        self.outstandingRequests.push(outstandingItem);
	      });
	    }),
	  ].filter(v => v !== null)).then(function (result) {
	    removeOutstandingRequest();
	    callback(null, result);
	  }).catch(function (err) {
	    removeOutstandingRequest();
	    callback(err);
	  });

	  function removeOutstandingRequest () {
	    if (!outstandingItem) {
	      return;
	    }
	    self.outstandingRequests = self.outstandingRequests.filter(v => v !== outstandingItem);
	  }
	};
	return websocket$2;
}

var client$1;
var hasRequiredClient;

function requireClient () {
	if (hasRequiredClient) return client$1;
	hasRequiredClient = 1;

	const events = eventsExports;
	const utils = utilsExports$1;

	/**
	 *  Constructor for a Jayson Client
	 *  @class Client
	 *  @extends require('events').EventEmitter
	 *  @param {Server} [server] An instance of Server (a object with a "call" method")
	 *  @param {Object} [options]
	 *  @param {Function} [options.reviver] Reviver function for JSON
	 *  @param {Function} [options.replacer] Replacer function for JSON
	 *  @param {Number} [options.version=2] JSON-RPC version to use (1|2)
	 *  @param {Boolean} [options.notificationIdNull=false] When true, version 2 requests will set id to null instead of omitting it
	 *  @param {Function} [options.generator] Function to use for generating request IDs
	 *  @return {Client}
	 */
	const Client = function(server, options) {
	  if(arguments.length === 1 && utils.isPlainObject(server)) {
	    options = server;
	    server = null;
	  }

	  if(!(this instanceof Client)) {
	    return new Client(server, options);
	  }

	  const defaults = {
	    reviver: null,
	    replacer: null,
	    generator: utils.generateId,
	    version: 2,
	    notificationIdNull: false,
	  };

	  this.options = utils.merge(defaults, options || {});

	  if(server) {
	    this.server = server;
	  }
	};
	require$$3.inherits(Client, events.EventEmitter);

	client$1 = Client;

	/**
	 * HTTP client constructor
	 * @type ClientHttp
	 * @static
	 */
	Client.http = requireHttp$2();

	/**
	 * HTTPS client constructor
	 * @type ClientHttps
	 * @static
	 */
	Client.https = requireHttps$2();

	/**
	 * TCP client constructor
	 * @type ClientTcp
	 * @static
	 */
	Client.tcp = requireTcp$2();

	/**
	 * TLS client constructor
	 * @type ClientTls
	 * @static
	 */
	Client.tls = requireTls$2();

	/**
	 * Browser client constructor
	 * @type ClientBrowser
	 * @static
	 */
	Client.browser = requireBrowser();

	/**
	 * Websocket client constructor
	 * @type ClientWebsocket
	 * @static
	 */
	Client.websocket = requireWebsocket$2();

	/**
	 *  Creates a request and dispatches it if given a callback.
	 *  @param {String|Array} method A batch request if passed an Array, or a method name if passed a String
	 *  @param {Array|Object} params Parameters for the method
	 *  @param {String|Number} [id] Optional id. If undefined an id will be generated. If null it creates a notification request
	 *  @param {Function} [callback] Request callback. If specified, executes the request rather than only returning it.
	 *  @throws {TypeError} Invalid parameters
	 *  @return {Object} JSON-RPC 1.0 or 2.0 compatible request
	 */
	Client.prototype.request = function(method, params, id, callback) {
	  const self = this;
	  let request = null;

	  // is this a batch request?
	  const isBatch = Array.isArray(method) && typeof(params) === 'function';

	  if (this.options.version === 1 && isBatch) {
	    throw new TypeError('JSON-RPC 1.0 does not support batching');
	  }

	  // is this a raw request?
	  const isRaw = !isBatch && method && typeof(method) === 'object' && typeof(params) === 'function';

	  if(isBatch || isRaw) {
	    callback = params;
	    request = method;
	  } else {
	    if(typeof(id) === 'function') {
	      callback = id;
	      // specifically undefined because "null" is a notification request
	      id = undefined;
	    }

	    const hasCallback = typeof(callback) === 'function';

	    try {
	      request = utils.request(method, params, id, {
	        generator: this.options.generator,
	        version: this.options.version,
	        notificationIdNull: this.options.notificationIdNull,
	      });
	    } catch(err) {
	      if(hasCallback) {
	        callback(err);
	        return;
	      }
	      throw err;
	    }

	    // no callback means we should just return a raw request before sending
	    if(!hasCallback) {
	      return request;
	    }

	  }

	  this.emit('request', request);

	  this._request(request, function(err, response) {
	    self.emit('response', request, response);
	    self._parseResponse(err, response, callback);
	  });

	  // always return the raw request
	  return request;
	};

	/**
	 *  Executes a request on a directly bound server
	 *  @param {Object} request A JSON-RPC 1.0 or 2.0 request
	 *  @param {Function} callback Request callback that will receive the server response as the second argument
	 *  @private
	 */
	Client.prototype._request = function(request, callback) {
	  const self = this;

	  // serializes the request as a JSON string so that we get a copy and can run the replacer as intended
	  utils.JSON.stringify(request, this.options, function(err, message) {
	    if(err) {
	      callback(err);
	      return;
	    }

	    self.server.call(message, function(error, success) {
	      const response = error || success;
	      callback(null, response);
	    });

	  });

	};

	/**
	 * Parses a response from a server, taking care of sugaring
	 * @param {Object} err Error to pass on that is unrelated to the actual response
	 * @param {Object} response JSON-RPC 1.0 or 2.0 response
	 * @param {Function} callback Callback that will receive different arguments depending on the amount of parameters
	 * @private
	 */
	Client.prototype._parseResponse = function(err, response, callback) {
	  if(err) {
	    return callback(err);
	  }

	  if(!response || typeof(response) !== 'object') {
	    return callback();
	  }

	  if(callback.length === 3) {
	    // if callback length is 3, we split callback arguments on error and response

	    // is batch response?
	    if(Array.isArray(response)) {

	      // neccesary to split strictly on validity according to spec here
	      const isError = function(res) { return typeof(res.error) !== 'undefined'; };
	      const isNotError = function(res) { return !isError(res); };

	      return callback(null, response.filter(isError), response.filter(isNotError));
	    
	    } else {

	      // split regardless of validity
	      return callback(null, response.error, response.result);
	    
	    }
	  
	  }

	  return callback(null, response);

	};
	return client$1;
}

var http_1;
var hasRequiredHttp$1;

function requireHttp$1 () {
	if (hasRequiredHttp$1) return http_1;
	hasRequiredHttp$1 = 1;

	const http = require$$0$2;
	const utils = utilsExports$1;

	/**
	 *  Constructor for a Jayson HTTP server
	 *  @class ServerHttp
	 *  @extends require('http').Server
	 *  @param {Server} server Server instance
	 *  @param {Object} [options] Options for this instance
	 *  @return {ServerHttp}
	 */
	const ServerHttp = function(server, options) {
	  if(!(this instanceof ServerHttp)) {
	    return new ServerHttp(server, options);
	  }

	  this.options = utils.merge(server.options, options || {});

	  const listener = utils.getHttpListener(this, server);
	  http.Server.call(this, listener);
	};
	require$$3.inherits(ServerHttp, http.Server);

	http_1 = ServerHttp;
	return http_1;
}

var https_1;
var hasRequiredHttps$1;

function requireHttps$1 () {
	if (hasRequiredHttps$1) return https_1;
	hasRequiredHttps$1 = 1;

	const https = require$$0$3;
	const utils = utilsExports$1;

	/**
	 *  Constructor for a Jayson HTTPS server
	 *  @class ServerHttps
	 *  @extends require('https').Server
	 *  @param {Server} server Server instance
	 *  @param {Object} [options] Options for this instance
	 *  @return {ServerHttps}
	 */
	const ServerHttps = function(server, options) {
	  if(!(this instanceof ServerHttps)) {
	    return new ServerHttps(server, options);
	  }

	  this.options = utils.merge(server.options, options || {});

	  const listener = utils.getHttpListener(this, server);
	  https.Server.call(this, this.options, listener);
	};
	require$$3.inherits(ServerHttps, https.Server);

	https_1 = ServerHttps;
	return https_1;
}

var tcp$1;
var hasRequiredTcp$1;

function requireTcp$1 () {
	if (hasRequiredTcp$1) return tcp$1;
	hasRequiredTcp$1 = 1;

	const net = require$$0$4;
	const utils = utilsExports$1;

	/**
	 *  Constructor for a Jayson TCP server
	 *  @class ServerTcp
	 *  @extends require('net').Server
	 *  @param {Server} server Server instance
	 *  @param {Object} [options] Options for this instance
	 *  @return {ServerTcp}
	 */
	const ServerTcp = function(server, options) {
	  if(!(this instanceof ServerTcp)) {
	    return new ServerTcp(server, options);
	  }

	  this.options = utils.merge(server.options, options || {});

	  net.Server.call(this, getTcpListener(this, server));
	};
	require$$3.inherits(ServerTcp, net.Server);

	tcp$1 = ServerTcp;

	/**
	 *  Returns a TCP connection listener bound to the server in the argument.
	 *  @param {Server} server Instance of JaysonServer
	 *  @param {net.Server} self Instance of net.Server
	 *  @return {Function}
	 *  @private
	 *  @ignore
	 */
	function getTcpListener(self, server) {
	  return function(conn) {
	    const options = self.options || {};

	    utils.parseStream(conn, options, function(err, request) {
	      if(err) {
	        return respondError(err);
	      }

	      server.call(request, function(error, success) {
	        const response = error || success;
	        if(response) {
	          utils.JSON.stringify(response, options, function(err, body) {
	            if(err) {
	              return respondError(err);
	            }
	            conn.write(body);
	          });
	        }
	      });
	    });

	    // ends the request with an error code
	    function respondError(err) {
	      const error = server.error(-32700, null, String(err));
	      const response = utils.response(error, undefined, undefined, self.options.version);
	      utils.JSON.stringify(response, options, function(err, body) {
	        if(err) {
	          body = ''; // we tried our best.
	        }
	        conn.end(body);
	      });
	    }

	  };
	}
	return tcp$1;
}

var tls_1;
var hasRequiredTls$1;

function requireTls$1 () {
	if (hasRequiredTls$1) return tls_1;
	hasRequiredTls$1 = 1;

	const tls = require$$4$1;
	const utils = utilsExports$1;

	/**
	 *  Constructor for a Jayson TLS-encrypted TCP server
	 *  @class ServerTls
	 *  @extends require('tls').Server
	 *  @param {Server} server Server instance
	 *  @param {Object} [options] Options for this instance
	 *  @return {ServerTls}
	 */
	const ServerTls = function(server, options) {
	  if(!(this instanceof ServerTls)) {
	    return new ServerTls(server, options);
	  }

	  this.options = utils.merge(server.options, options || {});

	  tls.Server.call(this, this.options, getTlsListener(this, server));
	};
	require$$3.inherits(ServerTls, tls.Server);

	tls_1 = ServerTls;

	/**
	 *  Returns a TLS-encrypted TCP connection listener bound to the server in the argument.
	 *  @param {Server} server Instance of JaysonServer
	 *  @param {tls.Server} self Instance of tls.Server
	 *  @return {Function}
	 *  @private
	 *  @ignore
	 */
	function getTlsListener(self, server) {
	  return function(conn) {
	    const options = self.options || {};

	    utils.parseStream(conn, options, function(err, request) {
	      if(err) {
	        return respondError(err);
	      }

	      server.call(request, function(error, success) {
	        const response = error || success;
	        if(response) {
	          utils.JSON.stringify(response, options, function(err, body) {
	            if(err) {
	              return respondError(err);
	            }
	            conn.write(body);
	          });
	        }
	      });
	    });

	    // ends the request with an error code
	    function respondError(err) {
	      const error = server.error(-32700, null, String(err));
	      const response = utils.response(error, undefined, undefined, self.options.version);
	      utils.JSON.stringify(response, options, function(err, body) {
	        if(err) {
	          body = ''; // we tried our best.
	        }
	        conn.end(body);
	      });
	    }

	  };
	}
	return tls_1;
}

var websocket$1;
var hasRequiredWebsocket$1;

function requireWebsocket$1 () {
	if (hasRequiredWebsocket$1) return websocket$1;
	hasRequiredWebsocket$1 = 1;

	const WebSocket = requireNode();
	const utils = utilsExports$1;

	/**
	 *  Constructor for a Jayson Websocket Server
	 *  @name ServerWebsocket
	 *  @param {Server} server Server instance
	 *  @param {Object} [options] Options for this instance
	 *  @param {ws.Websocket.Server} [options.wss] When provided will not create a new ws.WebSocket.Server but use this one
	 *  @return {ws.WebSocket.Server}
	 */
	const ServerWebsocket = function(server, options) {
	  const jaysonOptions = utils.merge(server.options, options || {});
	  const wss = options.wss || new WebSocket.Server(options);

	  wss.on('connection', onConnection);

	  function onConnection (ws) {
	    // every message received on the socket is handled as a JSON-RPC message
	    ws.on('message', function (buf) {
	      const str = Buffer.isBuffer(buf) ? buf.toString('utf8') : buf;
	      utils.JSON.parse(str, jaysonOptions, function(err, request) {
	        if (err) {
	          return respondError(err);
	        }

	        server.call(request, function(error, success) {
	          const response = error || success;
	          if (response) {
	            utils.JSON.stringify(response, jaysonOptions, function (err, str) {
	              if (err) {
	                return respondError(err);
	              }
	              ws.send(str);
	            });
	          }
	        });
	      });
	    });

	    // writes an error message to the client
	    function respondError (err) {
	      const error = server.error(-32700, null, String(err));
	      const response = utils.response(error, undefined, undefined, jaysonOptions.version);
	      utils.JSON.stringify(response, jaysonOptions, function(err, str) {
	        if(err) {
	          // not much to do here, we couldn't even respond with an error
	          throw err;
	        }
	        ws.send(str);
	      });
	    }
	  }

	  return wss;
	};

	websocket$1 = ServerWebsocket;
	return websocket$1;
}

var middleware;
var hasRequiredMiddleware;

function requireMiddleware () {
	if (hasRequiredMiddleware) return middleware;
	hasRequiredMiddleware = 1;

	const utils = utilsExports$1;

	/**
	 * Creates a Connect/Express compatible middleware bound to a Server
	 * @class ServerMiddleware
	 * @param {Server} server Server instance
	 * @param {Object} [outerOptions] Specific options for the middleware
	 * @return {Function}
	 */
	const Middleware = function(server, outerOptions) {
	  return function(req, res, next) {
	    const options = utils.merge(server.options, outerOptions || {});

	    // default options.end to true
	    if(typeof(options.end) !== 'boolean') {
	      options.end = true;
	    }

	    //  405 method not allowed if not POST
	    if(!utils.isMethod(req, 'POST')) {
	      return error(405, { 'Allow': 'POST' });
	    }

	    // 415 unsupported media type if Content-Type is not correct
	    if(!utils.isContentType(req, 'application/json')) {
	      return error(415);
	    }

	    // body does not appear to be parsed, 500 server error
	    if(!req.body || typeof(req.body) !== 'object') {
	      return next(new Error('Request body must be parsed'));
	    }

	    server.call(req.body, function(error, success) {
	      const response = error || success;

	      utils.JSON.stringify(response, options, function(err, body) {
	        if(err) {
	          return next(err);
	        }

	        // empty response?
	        if(body) {
	          const headers = {
	            'content-length': Buffer.byteLength(body, options.encoding),
	            'content-type': 'application/json; charset=utf-8'
	          };

	          res.writeHead(200, headers);
	          res.write(body);
	        } else {
	          res.writeHead(204);
	        }

	        // if end is false, next request instead of ending it
	        if(options.end) {
	          res.end();
	        } else {
	          next();
	        }

	      });
	    });

	    // ends the request with an error code
	    function error(code, headers) {
	      res.writeHead(code, headers || {});
	      res.end();
	    }
	  };
	};

	middleware = Middleware;
	return middleware;
}

var server$2;
var hasRequiredServer;

function requireServer () {
	if (hasRequiredServer) return server$2;
	hasRequiredServer = 1;

	const events = eventsExports;
	const jayson = requireLib();
	const utils = utilsExports$1;

	/**
	 *  Constructor for a Jayson Server
	 *  @class Server
	 *  @extends require('events').EventEmitter
	 *  @param {Object<String,Function>} [methods] Methods to add
	 *  @param {Object} [options]
	 *  @param {Array|Object} [options.params] Passed to Jayson.Method as an option when created
	 *  @param {Boolean} [options.useContext=false] Passed to Jayson.Method as an option when created
	 *  @param {Function} [options.reviver] Reviver function for JSON
	 *  @param {Function} [options.replacer] Replacer function for JSON
	 *  @param {Function} [options.methodConstructor] Methods will be made instances of this class
	 *  @param {String} [options.encoding="utf8"] Encoding to use
	 *  @param {Number} [options.version=2] JSON-RPC version to use (1|2)
	 *  @param {Function} [options.router] Function to use for routing methods
	 *  @property {Object} options A reference to the internal options object that can be modified directly
	 *  @property {Object} errorMessages Map of error code to error message pairs that will be used in server responses
	 *  @property {ServerHttp} http HTTP interface constructor
	 *  @property {ServerHttps} https HTTPS interface constructor
	 *  @property {ServerTcp} tcp TCP interface constructor
	 *  @property {ServerTls} tls TLS interface constructor
	 *  @property {Middleware} middleware Middleware generator function
	 *  @return {Server}
	 */
	const Server = function(methods, options) {
	  if(!(this instanceof Server)) {
	    return new Server(methods, options);
	  }

	  const defaults = {
	    reviver: null,
	    replacer: null,
	    encoding: 'utf8',
	    version: 2,
	    useContext: false,
	    methodConstructor: jayson.Method,
	    router: function(method) {
	      return this.getMethod(method);
	    }
	  };

	  this.options = utils.merge(defaults, options || {});

	  // bind router to the server
	  this.options.router = this.options.router.bind(this);
	  
	  this._methods = {};

	  // adds methods passed to constructor
	  this.methods(methods || {});

	  // assigns interfaces to this instance
	  const interfaces = Server.interfaces;
	  for(let name in interfaces) {
	    this[name] = interfaces[name].bind(interfaces[name], this);
	  }

	  // copies error messages for defined codes into this instance
	  this.errorMessages = {};
	  for(let handle in Server.errors) {
	    const code = Server.errors[handle];
	    this.errorMessages[code] = Server.errorMessages[code];
	  }

	};
	require$$3.inherits(Server, events.EventEmitter);

	server$2 = Server;

	/**
	 * Interfaces that will be automatically bound as properties of a Server instance
	 * @enum {Function}
	 * @static
	 */
	Server.interfaces = {
	  http: requireHttp$1(),
	  https: requireHttps$1(),
	  tcp: requireTcp$1(),
	  tls: requireTls$1(),
	  websocket: requireWebsocket$1(),
	  middleware: requireMiddleware()
	};

	/**
	 * JSON-RPC specification errors that map to an integer code
	 * @enum {Number}
	 * @static
	 */
	Server.errors = {
	  PARSE_ERROR: -32700,
	  INVALID_REQUEST: -32600,
	  METHOD_NOT_FOUND: -32601,
	  INVALID_PARAMS: -32602,
	  INTERNAL_ERROR: -32603
	};

	/*
	 * Error codes that map to an error message
	 * @enum {String}
	 * @static
	 */
	Server.errorMessages = {};
	Server.errorMessages[Server.errors.PARSE_ERROR] = 'Parse Error';
	Server.errorMessages[Server.errors.INVALID_REQUEST] = 'Invalid request';
	Server.errorMessages[Server.errors.METHOD_NOT_FOUND] = 'Method not found';
	Server.errorMessages[Server.errors.INVALID_PARAMS] = 'Invalid method parameter(s)';
	Server.errorMessages[Server.errors.INTERNAL_ERROR] = 'Internal error';

	/**
	 *  Adds a single method to the server
	 *  @param {String} name Name of method to add
	 *  @param {Function|Client} definition Function or Client for a relayed method
	 *  @throws {TypeError} Invalid parameters
	 */
	Server.prototype.method = function(name, definition) {
	  const Method = this.options.methodConstructor;

	  const isRelay = definition instanceof jayson.Client;
	  const isMethod = definition instanceof Method;
	  const isDefinitionFunction = typeof definition === 'function';

	  // a valid method is either a function or a client (relayed method)
	  if(!isRelay && !isMethod && !isDefinitionFunction) {
	    throw new TypeError('method definition must be either a function, an instance of jayson.Client or an instance of jayson.Method');
	  }

	  if(!name || typeof(name) !== 'string') {
	    throw new TypeError('"' + name + '" must be a non-zero length string');
	  }

	  if(/^rpc\./.test(name)) {
	    throw new TypeError('"' + name + '" is a reserved method name');
	  }

	  // make instance of jayson.Method
	  if(!isRelay && !isMethod) {
	    definition = new Method(definition, {
	      params: this.options.params,
	      useContext: this.options.useContext
	    });
	  }

	  this._methods[name] = definition;
	};

	/**
	 *  Adds a batch of methods to the server
	 *  @param {Object} methods Methods to add
	 */
	Server.prototype.methods = function(methods) {
	  methods = methods || {};

	  for(let name in methods) {
	    this.method(name, methods[name]);
	  }

	};

	/**
	 *  Checks if a method is registered with the server
	 *  @param {String} name Name of method
	 *  @return {Boolean}
	 */
	Server.prototype.hasMethod = function(name) {
	  return name in this._methods;
	};

	/**
	 *  Removes a method from the server
	 *  @param {String} name
	 */
	Server.prototype.removeMethod = function(name) {
	  if(this.hasMethod(name)) {
	    delete this._methods[name];
	  }
	};

	/**
	 * Gets a method from the server
	 * @param {String} name
	 * @return {Method}
	 */
	Server.prototype.getMethod = function(name) {
	  return this._methods[name];
	};

	/**
	 *  Returns a JSON-RPC compatible error property
	 *  @param {Number} [code=-32603] Error code
	 *  @param {String} [message="Internal error"] Error message
	 *  @param {Object} [data] Additional data that should be provided
	 *  @return {Object}
	 */
	Server.prototype.error = function(code, message, data) {
	  if(typeof(code) !== 'number') {
	    code = Server.errors.INTERNAL_ERROR;
	  }

	  if(typeof(message) !== 'string') {
	    message = this.errorMessages[code] || '';
	  }

	  const error = { code: code, message: message };
	  if(typeof(data) !== 'undefined') {
	    error.data = data;
	  }
	  return error;
	};

	/**
	 *  Calls a method on the server
	 *  @param {Object|Array|String} request A JSON-RPC request object. Object for single request, Array for batches and String for automatic parsing (using the reviver option)
	 *  @param {Object} [context] Optional context object passed to methods
	 *  @param {Function} [originalCallback] Callback that receives one of two arguments: first is an error and the second a response
	 */
	Server.prototype.call = function(request, context, originalCallback) {
	  const self = this;

	  if(typeof(context) === 'function') {
	    originalCallback = context;
	    context = {};
	  }

	  if(typeof(context) === 'undefined') {
	    context = {};
	  }

	  if(typeof(originalCallback) !== 'function') {
	    originalCallback = function() {};
	  }

	  // compose the callback so that we may emit an event on every response
	  const callback = function(error, response) {
	    self.emit('response', request, response || error);
	    originalCallback.apply(null, arguments);
	  };

	  maybeParse(request, this.options, function(err, request) {
	    let error = null; // JSON-RPC error

	    if(err) {
	      error = self.error(Server.errors.PARSE_ERROR, null, err);
	      callback(utils.response(error, undefined, undefined, self.options.version));
	      return;
	    }

	    // is this a batch request?
	    if(utils.Request.isBatch(request)) {

	      // batch requests not allowed for version 1
	      if(self.options.version === 1) {
	        error = self.error(Server.errors.INVALID_REQUEST);
	        callback(utils.response(error, undefined, undefined, self.options.version));
	        return;
	      }

	      // special case if empty batch request
	      if(!request.length) {
	        error = self.error(Server.errors.INVALID_REQUEST);
	        callback(utils.response(error, undefined, undefined, self.options.version));
	        return;
	      }
	      self._batch(request, context, callback);
	      return;
	    }

	    self.emit('request', request);

	    // is the request valid?
	    if(!utils.Request.isValidRequest(request, self.options.version)) {
	      error = self.error(Server.errors.INVALID_REQUEST);
	      callback(utils.response(error, undefined, undefined, self.options.version));
	      return;
	    }

	    // from now on we are "notification-aware" and can deliberately ignore errors for such requests
	    const respond = function(error, result) {
	      if(utils.Request.isNotification(request)) {
	        callback();
	        return;
	      }
	      const response = utils.response(error, result, request.id, self.options.version);
	      if(response.error) {
	        callback(response);
	      } else {
	        callback(null, response);
	      }
	    };

	    const method = self._resolveRouter(request.method, request.params);

	    // are we attempting to invoke a relayed method?
	    if(method instanceof jayson.Client) {
	      return method.request(request.method, request.params, request.id, function(error, response) {
	        if(utils.Request.isNotification(request)) {
	          callback();
	          return;
	        }
	        callback(error, response);
	      });
	    }
	    
	    // does the method exist?
	    if(!(method instanceof jayson.Method)) {
	      respond(self.error(Server.errors.METHOD_NOT_FOUND));
	      return;
	    }

	    // execute jayson.Method instance
	    method.execute(self, request.params, context, function(error, result) {
	    
	      if(utils.Response.isValidError(error, self.options.version)) {
	        respond(error);
	        return;
	      }

	      // got an invalid error
	      if(error) {
	        respond(self.error(Server.errors.INTERNAL_ERROR));
	        return;
	      }

	      respond(null, result);
	    
	    });

	  });
	};

	/**
	 *  Calls a method on the server returning a promise
	 *  @param {Object|Array|String} request A JSON-RPC request object. Object for single request, Array for batches and String for automatic parsing (using the reviver option)
	 *  @param {Object} [context] Optional context object passed to methods
	 *  @return {Promise<Object>}
	 */
	Server.prototype.callp = function (...args) {
	  const self = this;
	  return new Promise(function (resolve, reject) {
	    return self.call(...args, function (err, response) {
	      if (err) {
	        reject(err);
	        return;
	      }
	      resolve(response);
	    });
	  });
	};

	/**
	 * Invoke the router
	 * @param {String} method Method to resolve
	 * @param {Array|Object} params Request params
	 * @return {Method}
	 */
	Server.prototype._resolveRouter = function(method, params) {

	  let router = this.options.router;

	  if(typeof router !== 'function') {
	    router = function(method) {
	      return this.getMethod(method);
	    };
	  }

	  const resolved = router.call(this, method, params);

	  // got a jayson.Method or a jayson.Client, return it
	  if((resolved instanceof jayson.Method) || (resolved instanceof jayson.Client)) {
	    return resolved;
	  }

	  // got a regular function, make it an instance of jayson.Method
	  if(typeof resolved === 'function') {
	    return new jayson.Method(resolved);
	  }

	};

	/**
	 *  Evaluates a batch request
	 *  @private
	 */
	Server.prototype._batch = function(requests, context, callback) {
	  const self = this;
	  
	  const responses = [];

	  this.emit('batch', requests);

	  /**
	   * @ignore
	   */
	  const maybeRespond = function() {

	    // done when we have filled up all the responses with a truthy value
	    const isDone = responses.every(function(response) { return response !== null; });
	    if(isDone) {

	      // filters away notifications
	      const filtered = responses.filter(function(res) {
	        return res !== true;
	      });

	      // only notifications in request means empty response
	      if(!filtered.length) {
	        return callback();
	      }
	      callback(null, filtered);
	    }
	  };

	  /**
	   * @ignore
	   */
	  const wrapper = function(request, index) {
	    responses[index] = null;
	    return function() {
	      if(utils.Request.isValidRequest(request, self.options.version)) {
	        self.call(request, context, function(error, response) {
	          responses[index] = error || response || true;
	          maybeRespond();
	        });
	      } else {
	        const error = self.error(Server.errors.INVALID_REQUEST);
	        responses[index] = utils.response(error, undefined, undefined, self.options.version);
	        maybeRespond();
	      }
	    };
	  };

	  const stack = requests.map(function(request, index) {
	    // ignore possibly nested requests
	    if(utils.Request.isBatch(request)) {
	      return null;
	    }
	    return wrapper(request, index);
	  });

	  stack.forEach(function(method) {
	    if(typeof(method) === 'function') {
	      method();
	    }
	  });
	};

	/**
	 * Parse "request" if it is a string, else just invoke callback
	 * @ignore
	 */
	function maybeParse(request, options, callback) {
	  if(typeof(request) === 'string') {
	    utils.JSON.parse(request, options, callback);
	  } else {
	    callback(null, request);
	  }
	}
	return server$2;
}

const utils$1 = utilsExports$1;

/**
 * @summary Constructor for a Jayson Method
 * @class Method
 * @param {Function} [handler] Function to set as handler
 * @param {Object} [options] 
 * @param {Function} [options.handler] Same as separate handler
 * @param {Boolean} [options.useContext=false] When true, the handler expects a context object
 * @param {Array|Object} [options.params] Defines params that the handler accepts
 */
const Method$1 = function(handler, options) {

  if(!(this instanceof Method$1)) {
    return new Method$1(handler, options);
  }

  // only got passed options
  if(utils$1.isPlainObject(handler)) {
    options = handler;
    handler = null;
  }

  const defaults = {
    useContext: false,
  };

  options = options || {};

  this.options = utils$1.merge(defaults, options);
  this.handler = handler || options.handler;
};

var method$1 = Method$1;

/**
 * @summary Returns the handler function associated with this method
 * @return {Function}
 */
Method$1.prototype.getHandler = function() {
  return this.handler;
};

/**
 * @summary Sets the handler function associated with this method
 * @param {Function} handler
 */
Method$1.prototype.setHandler = function(handler) {
  this.handler = handler;
};

/**
 * @summary Prepare parameters for the method handler
 * @private
 */
Method$1.prototype._getHandlerParams = function(params) {
  const options = this.options;

  const isObjectParams = !Array.isArray(params) && utils$1.isPlainObject(params) && params;
  const isArrayParams = Array.isArray(params);

  switch(true) {

      // handler always gets an array
    case options.params === Array:
      return isArrayParams ? params : utils$1.toArray(params);

      // handler always gets an object
    case options.params === Object:
      return isObjectParams ? params : utils$1.toPlainObject(params);

      // handler gets a list of defined properties that should always be set
    case Array.isArray(options.params): {
      const undefinedParams = Object.keys(options.params).reduce(function (out, index) {
        const key = options.params[index];
        out[key] = undefined;
        return out;
      }, {});
      return {...undefinedParams, ...utils$1.pick(params, Object.keys(params))};
    }

      // handler gets a map of defined properties and their default values
    case utils$1.isPlainObject(options.params):
      return {...options.params, ...utils$1.pick(params, Object.keys(params))};

      // give params as is
    default:
      return params;

  }

};

/**
 * @summary Executes this method in the context of a server
 * @param {Server} server
 * @param {Array|Object} requestParams
 * @param {Object} [context]
 * @param {Function} callback
 */
Method$1.prototype.execute = function(server, requestParams, context, callback) {
  if(typeof(context) === 'function') {
    callback = context;
    context = {};
  }

  if(!context) {
    context = {};
  }

  // when useContext is true, the handler gets a context object every time
  const useContext = Boolean(this.options.useContext);
  const handler = this.getHandler();
  const params = this._getHandlerParams(requestParams);

  const args = useContext ? [params, context, callback] : [params, callback];
  return handler.call(server, ...args);
};

var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return libExports;
	hasRequiredLib = 1;
	(function (module) {

		/**
		 * Namespace available as require('jayson')
		 * @namespace Jayson
		 */
		const Jayson = module.exports;

		/**
		 * @static
		 * @type Client
		 */
		Jayson.Client = Jayson.client = requireClient();

		/**
		 * @static
		 * @type Server
		 */
		Jayson.Server = Jayson.server = requireServer();

		/**
		 * @static
		 * @type Utils
		 */
		Jayson.Utils = Jayson.utils = utilsExports$1;

		/**
		 * @static
		 * @type Method
		 */
		Jayson.Method = Jayson.method = method$1;
} (lib));
	return libExports;
}

(function (module) {
	module.exports = requireLib();
} (jayson$4));

function commonjsRequire(path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var es6PromiseExports = {};
var es6Promise = {
  get exports(){ return es6PromiseExports; },
  set exports(v){ es6PromiseExports = v; },
};

/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.8+1e68dce6
 */

(function (module, exports) {
	(function (global, factory) {
		module.exports = factory() ;
	}(commonjsGlobal, (function () {
	function objectOrFunction(x) {
	  var type = typeof x;
	  return x !== null && (type === 'object' || type === 'function');
	}

	function isFunction(x) {
	  return typeof x === 'function';
	}



	var _isArray = void 0;
	if (Array.isArray) {
	  _isArray = Array.isArray;
	} else {
	  _isArray = function (x) {
	    return Object.prototype.toString.call(x) === '[object Array]';
	  };
	}

	var isArray = _isArray;

	var len = 0;
	var vertxNext = void 0;
	var customSchedulerFn = void 0;

	var asap = function asap(callback, arg) {
	  queue[len] = callback;
	  queue[len + 1] = arg;
	  len += 2;
	  if (len === 2) {
	    // If len is 2, that means that we need to schedule an async flush.
	    // If additional callbacks are queued before the queue is flushed, they
	    // will be processed by this flush that we are scheduling.
	    if (customSchedulerFn) {
	      customSchedulerFn(flush);
	    } else {
	      scheduleFlush();
	    }
	  }
	};

	function setScheduler(scheduleFn) {
	  customSchedulerFn = scheduleFn;
	}

	function setAsap(asapFn) {
	  asap = asapFn;
	}

	var browserWindow = typeof window !== 'undefined' ? window : undefined;
	var browserGlobal = browserWindow || {};
	var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
	var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

	// test for web worker but not in IE10
	var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

	// node
	function useNextTick() {
	  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	  // see https://github.com/cujojs/when/issues/410 for details
	  return function () {
	    return process.nextTick(flush);
	  };
	}

	// vertx
	function useVertxTimer() {
	  if (typeof vertxNext !== 'undefined') {
	    return function () {
	      vertxNext(flush);
	    };
	  }

	  return useSetTimeout();
	}

	function useMutationObserver() {
	  var iterations = 0;
	  var observer = new BrowserMutationObserver(flush);
	  var node = document.createTextNode('');
	  observer.observe(node, { characterData: true });

	  return function () {
	    node.data = iterations = ++iterations % 2;
	  };
	}

	// web worker
	function useMessageChannel() {
	  var channel = new MessageChannel();
	  channel.port1.onmessage = flush;
	  return function () {
	    return channel.port2.postMessage(0);
	  };
	}

	function useSetTimeout() {
	  // Store setTimeout reference so es6-promise will be unaffected by
	  // other code modifying setTimeout (like sinon.useFakeTimers())
	  var globalSetTimeout = setTimeout;
	  return function () {
	    return globalSetTimeout(flush, 1);
	  };
	}

	var queue = new Array(1000);
	function flush() {
	  for (var i = 0; i < len; i += 2) {
	    var callback = queue[i];
	    var arg = queue[i + 1];

	    callback(arg);

	    queue[i] = undefined;
	    queue[i + 1] = undefined;
	  }

	  len = 0;
	}

	function attemptVertx() {
	  try {
	    var vertx = Function('return this')().require('vertx');
	    vertxNext = vertx.runOnLoop || vertx.runOnContext;
	    return useVertxTimer();
	  } catch (e) {
	    return useSetTimeout();
	  }
	}

	var scheduleFlush = void 0;
	// Decide what async method to use to triggering processing of queued callbacks:
	if (isNode) {
	  scheduleFlush = useNextTick();
	} else if (BrowserMutationObserver) {
	  scheduleFlush = useMutationObserver();
	} else if (isWorker) {
	  scheduleFlush = useMessageChannel();
	} else if (browserWindow === undefined && typeof commonjsRequire === 'function') {
	  scheduleFlush = attemptVertx();
	} else {
	  scheduleFlush = useSetTimeout();
	}

	function then(onFulfillment, onRejection) {
	  var parent = this;

	  var child = new this.constructor(noop);

	  if (child[PROMISE_ID] === undefined) {
	    makePromise(child);
	  }

	  var _state = parent._state;


	  if (_state) {
	    var callback = arguments[_state - 1];
	    asap(function () {
	      return invokeCallback(_state, child, callback, parent._result);
	    });
	  } else {
	    subscribe(parent, child, onFulfillment, onRejection);
	  }

	  return child;
	}

	/**
	  `Promise.resolve` returns a promise that will become resolved with the
	  passed `value`. It is shorthand for the following:

	  ```javascript
	  let promise = new Promise(function(resolve, reject){
	    resolve(1);
	  });

	  promise.then(function(value){
	    // value === 1
	  });
	  ```

	  Instead of writing the above, your code now simply becomes the following:

	  ```javascript
	  let promise = Promise.resolve(1);

	  promise.then(function(value){
	    // value === 1
	  });
	  ```

	  @method resolve
	  @static
	  @param {Any} value value that the returned promise will be resolved with
	  Useful for tooling.
	  @return {Promise} a promise that will become fulfilled with the given
	  `value`
	*/
	function resolve$1(object) {
	  /*jshint validthis:true */
	  var Constructor = this;

	  if (object && typeof object === 'object' && object.constructor === Constructor) {
	    return object;
	  }

	  var promise = new Constructor(noop);
	  resolve(promise, object);
	  return promise;
	}

	var PROMISE_ID = Math.random().toString(36).substring(2);

	function noop() {}

	var PENDING = void 0;
	var FULFILLED = 1;
	var REJECTED = 2;

	function selfFulfillment() {
	  return new TypeError("You cannot resolve a promise with itself");
	}

	function cannotReturnOwn() {
	  return new TypeError('A promises callback cannot return that same promise.');
	}

	function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
	  try {
	    then$$1.call(value, fulfillmentHandler, rejectionHandler);
	  } catch (e) {
	    return e;
	  }
	}

	function handleForeignThenable(promise, thenable, then$$1) {
	  asap(function (promise) {
	    var sealed = false;
	    var error = tryThen(then$$1, thenable, function (value) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;
	      if (thenable !== value) {
	        resolve(promise, value);
	      } else {
	        fulfill(promise, value);
	      }
	    }, function (reason) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;

	      reject(promise, reason);
	    }, 'Settle: ' + (promise._label || ' unknown promise'));

	    if (!sealed && error) {
	      sealed = true;
	      reject(promise, error);
	    }
	  }, promise);
	}

	function handleOwnThenable(promise, thenable) {
	  if (thenable._state === FULFILLED) {
	    fulfill(promise, thenable._result);
	  } else if (thenable._state === REJECTED) {
	    reject(promise, thenable._result);
	  } else {
	    subscribe(thenable, undefined, function (value) {
	      return resolve(promise, value);
	    }, function (reason) {
	      return reject(promise, reason);
	    });
	  }
	}

	function handleMaybeThenable(promise, maybeThenable, then$$1) {
	  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
	    handleOwnThenable(promise, maybeThenable);
	  } else {
	    if (then$$1 === undefined) {
	      fulfill(promise, maybeThenable);
	    } else if (isFunction(then$$1)) {
	      handleForeignThenable(promise, maybeThenable, then$$1);
	    } else {
	      fulfill(promise, maybeThenable);
	    }
	  }
	}

	function resolve(promise, value) {
	  if (promise === value) {
	    reject(promise, selfFulfillment());
	  } else if (objectOrFunction(value)) {
	    var then$$1 = void 0;
	    try {
	      then$$1 = value.then;
	    } catch (error) {
	      reject(promise, error);
	      return;
	    }
	    handleMaybeThenable(promise, value, then$$1);
	  } else {
	    fulfill(promise, value);
	  }
	}

	function publishRejection(promise) {
	  if (promise._onerror) {
	    promise._onerror(promise._result);
	  }

	  publish(promise);
	}

	function fulfill(promise, value) {
	  if (promise._state !== PENDING) {
	    return;
	  }

	  promise._result = value;
	  promise._state = FULFILLED;

	  if (promise._subscribers.length !== 0) {
	    asap(publish, promise);
	  }
	}

	function reject(promise, reason) {
	  if (promise._state !== PENDING) {
	    return;
	  }
	  promise._state = REJECTED;
	  promise._result = reason;

	  asap(publishRejection, promise);
	}

	function subscribe(parent, child, onFulfillment, onRejection) {
	  var _subscribers = parent._subscribers;
	  var length = _subscribers.length;


	  parent._onerror = null;

	  _subscribers[length] = child;
	  _subscribers[length + FULFILLED] = onFulfillment;
	  _subscribers[length + REJECTED] = onRejection;

	  if (length === 0 && parent._state) {
	    asap(publish, parent);
	  }
	}

	function publish(promise) {
	  var subscribers = promise._subscribers;
	  var settled = promise._state;

	  if (subscribers.length === 0) {
	    return;
	  }

	  var child = void 0,
	      callback = void 0,
	      detail = promise._result;

	  for (var i = 0; i < subscribers.length; i += 3) {
	    child = subscribers[i];
	    callback = subscribers[i + settled];

	    if (child) {
	      invokeCallback(settled, child, callback, detail);
	    } else {
	      callback(detail);
	    }
	  }

	  promise._subscribers.length = 0;
	}

	function invokeCallback(settled, promise, callback, detail) {
	  var hasCallback = isFunction(callback),
	      value = void 0,
	      error = void 0,
	      succeeded = true;

	  if (hasCallback) {
	    try {
	      value = callback(detail);
	    } catch (e) {
	      succeeded = false;
	      error = e;
	    }

	    if (promise === value) {
	      reject(promise, cannotReturnOwn());
	      return;
	    }
	  } else {
	    value = detail;
	  }

	  if (promise._state !== PENDING) ; else if (hasCallback && succeeded) {
	    resolve(promise, value);
	  } else if (succeeded === false) {
	    reject(promise, error);
	  } else if (settled === FULFILLED) {
	    fulfill(promise, value);
	  } else if (settled === REJECTED) {
	    reject(promise, value);
	  }
	}

	function initializePromise(promise, resolver) {
	  try {
	    resolver(function resolvePromise(value) {
	      resolve(promise, value);
	    }, function rejectPromise(reason) {
	      reject(promise, reason);
	    });
	  } catch (e) {
	    reject(promise, e);
	  }
	}

	var id = 0;
	function nextId() {
	  return id++;
	}

	function makePromise(promise) {
	  promise[PROMISE_ID] = id++;
	  promise._state = undefined;
	  promise._result = undefined;
	  promise._subscribers = [];
	}

	function validationError() {
	  return new Error('Array Methods must be provided an Array');
	}

	var Enumerator = function () {
	  function Enumerator(Constructor, input) {
	    this._instanceConstructor = Constructor;
	    this.promise = new Constructor(noop);

	    if (!this.promise[PROMISE_ID]) {
	      makePromise(this.promise);
	    }

	    if (isArray(input)) {
	      this.length = input.length;
	      this._remaining = input.length;

	      this._result = new Array(this.length);

	      if (this.length === 0) {
	        fulfill(this.promise, this._result);
	      } else {
	        this.length = this.length || 0;
	        this._enumerate(input);
	        if (this._remaining === 0) {
	          fulfill(this.promise, this._result);
	        }
	      }
	    } else {
	      reject(this.promise, validationError());
	    }
	  }

	  Enumerator.prototype._enumerate = function _enumerate(input) {
	    for (var i = 0; this._state === PENDING && i < input.length; i++) {
	      this._eachEntry(input[i], i);
	    }
	  };

	  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
	    var c = this._instanceConstructor;
	    var resolve$$1 = c.resolve;


	    if (resolve$$1 === resolve$1) {
	      var _then = void 0;
	      var error = void 0;
	      var didError = false;
	      try {
	        _then = entry.then;
	      } catch (e) {
	        didError = true;
	        error = e;
	      }

	      if (_then === then && entry._state !== PENDING) {
	        this._settledAt(entry._state, i, entry._result);
	      } else if (typeof _then !== 'function') {
	        this._remaining--;
	        this._result[i] = entry;
	      } else if (c === Promise$1) {
	        var promise = new c(noop);
	        if (didError) {
	          reject(promise, error);
	        } else {
	          handleMaybeThenable(promise, entry, _then);
	        }
	        this._willSettleAt(promise, i);
	      } else {
	        this._willSettleAt(new c(function (resolve$$1) {
	          return resolve$$1(entry);
	        }), i);
	      }
	    } else {
	      this._willSettleAt(resolve$$1(entry), i);
	    }
	  };

	  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
	    var promise = this.promise;


	    if (promise._state === PENDING) {
	      this._remaining--;

	      if (state === REJECTED) {
	        reject(promise, value);
	      } else {
	        this._result[i] = value;
	      }
	    }

	    if (this._remaining === 0) {
	      fulfill(promise, this._result);
	    }
	  };

	  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
	    var enumerator = this;

	    subscribe(promise, undefined, function (value) {
	      return enumerator._settledAt(FULFILLED, i, value);
	    }, function (reason) {
	      return enumerator._settledAt(REJECTED, i, reason);
	    });
	  };

	  return Enumerator;
	}();

	/**
	  `Promise.all` accepts an array of promises, and returns a new promise which
	  is fulfilled with an array of fulfillment values for the passed promises, or
	  rejected with the reason of the first passed promise to be rejected. It casts all
	  elements of the passed iterable to promises as it runs this algorithm.

	  Example:

	  ```javascript
	  let promise1 = resolve(1);
	  let promise2 = resolve(2);
	  let promise3 = resolve(3);
	  let promises = [ promise1, promise2, promise3 ];

	  Promise.all(promises).then(function(array){
	    // The array here would be [ 1, 2, 3 ];
	  });
	  ```

	  If any of the `promises` given to `all` are rejected, the first promise
	  that is rejected will be given as an argument to the returned promises's
	  rejection handler. For example:

	  Example:

	  ```javascript
	  let promise1 = resolve(1);
	  let promise2 = reject(new Error("2"));
	  let promise3 = reject(new Error("3"));
	  let promises = [ promise1, promise2, promise3 ];

	  Promise.all(promises).then(function(array){
	    // Code here never runs because there are rejected promises!
	  }, function(error) {
	    // error.message === "2"
	  });
	  ```

	  @method all
	  @static
	  @param {Array} entries array of promises
	  @param {String} label optional string for labeling the promise.
	  Useful for tooling.
	  @return {Promise} promise that is fulfilled when all `promises` have been
	  fulfilled, or rejected if any of them become rejected.
	  @static
	*/
	function all(entries) {
	  return new Enumerator(this, entries).promise;
	}

	/**
	  `Promise.race` returns a new promise which is settled in the same way as the
	  first passed promise to settle.

	  Example:

	  ```javascript
	  let promise1 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 1');
	    }, 200);
	  });

	  let promise2 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 2');
	    }, 100);
	  });

	  Promise.race([promise1, promise2]).then(function(result){
	    // result === 'promise 2' because it was resolved before promise1
	    // was resolved.
	  });
	  ```

	  `Promise.race` is deterministic in that only the state of the first
	  settled promise matters. For example, even if other promises given to the
	  `promises` array argument are resolved, but the first settled promise has
	  become rejected before the other promises became fulfilled, the returned
	  promise will become rejected:

	  ```javascript
	  let promise1 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 1');
	    }, 200);
	  });

	  let promise2 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      reject(new Error('promise 2'));
	    }, 100);
	  });

	  Promise.race([promise1, promise2]).then(function(result){
	    // Code here never runs
	  }, function(reason){
	    // reason.message === 'promise 2' because promise 2 became rejected before
	    // promise 1 became fulfilled
	  });
	  ```

	  An example real-world use case is implementing timeouts:

	  ```javascript
	  Promise.race([ajax('foo.json'), timeout(5000)])
	  ```

	  @method race
	  @static
	  @param {Array} promises array of promises to observe
	  Useful for tooling.
	  @return {Promise} a promise which settles in the same way as the first passed
	  promise to settle.
	*/
	function race(entries) {
	  /*jshint validthis:true */
	  var Constructor = this;

	  if (!isArray(entries)) {
	    return new Constructor(function (_, reject) {
	      return reject(new TypeError('You must pass an array to race.'));
	    });
	  } else {
	    return new Constructor(function (resolve, reject) {
	      var length = entries.length;
	      for (var i = 0; i < length; i++) {
	        Constructor.resolve(entries[i]).then(resolve, reject);
	      }
	    });
	  }
	}

	/**
	  `Promise.reject` returns a promise rejected with the passed `reason`.
	  It is shorthand for the following:

	  ```javascript
	  let promise = new Promise(function(resolve, reject){
	    reject(new Error('WHOOPS'));
	  });

	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```

	  Instead of writing the above, your code now simply becomes the following:

	  ```javascript
	  let promise = Promise.reject(new Error('WHOOPS'));

	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```

	  @method reject
	  @static
	  @param {Any} reason value that the returned promise will be rejected with.
	  Useful for tooling.
	  @return {Promise} a promise rejected with the given `reason`.
	*/
	function reject$1(reason) {
	  /*jshint validthis:true */
	  var Constructor = this;
	  var promise = new Constructor(noop);
	  reject(promise, reason);
	  return promise;
	}

	function needsResolver() {
	  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	}

	function needsNew() {
	  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	}

	/**
	  Promise objects represent the eventual result of an asynchronous operation. The
	  primary way of interacting with a promise is through its `then` method, which
	  registers callbacks to receive either a promise's eventual value or the reason
	  why the promise cannot be fulfilled.

	  Terminology
	  -----------

	  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	  - `thenable` is an object or function that defines a `then` method.
	  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	  - `exception` is a value that is thrown using the throw statement.
	  - `reason` is a value that indicates why a promise was rejected.
	  - `settled` the final resting state of a promise, fulfilled or rejected.

	  A promise can be in one of three states: pending, fulfilled, or rejected.

	  Promises that are fulfilled have a fulfillment value and are in the fulfilled
	  state.  Promises that are rejected have a rejection reason and are in the
	  rejected state.  A fulfillment value is never a thenable.

	  Promises can also be said to *resolve* a value.  If this value is also a
	  promise, then the original promise's settled state will match the value's
	  settled state.  So a promise that *resolves* a promise that rejects will
	  itself reject, and a promise that *resolves* a promise that fulfills will
	  itself fulfill.


	  Basic Usage:
	  ------------

	  ```js
	  let promise = new Promise(function(resolve, reject) {
	    // on success
	    resolve(value);

	    // on failure
	    reject(reason);
	  });

	  promise.then(function(value) {
	    // on fulfillment
	  }, function(reason) {
	    // on rejection
	  });
	  ```

	  Advanced Usage:
	  ---------------

	  Promises shine when abstracting away asynchronous interactions such as
	  `XMLHttpRequest`s.

	  ```js
	  function getJSON(url) {
	    return new Promise(function(resolve, reject){
	      let xhr = new XMLHttpRequest();

	      xhr.open('GET', url);
	      xhr.onreadystatechange = handler;
	      xhr.responseType = 'json';
	      xhr.setRequestHeader('Accept', 'application/json');
	      xhr.send();

	      function handler() {
	        if (this.readyState === this.DONE) {
	          if (this.status === 200) {
	            resolve(this.response);
	          } else {
	            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	          }
	        }
	      };
	    });
	  }

	  getJSON('/posts.json').then(function(json) {
	    // on fulfillment
	  }, function(reason) {
	    // on rejection
	  });
	  ```

	  Unlike callbacks, promises are great composable primitives.

	  ```js
	  Promise.all([
	    getJSON('/posts'),
	    getJSON('/comments')
	  ]).then(function(values){
	    values[0] // => postsJSON
	    values[1] // => commentsJSON

	    return values;
	  });
	  ```

	  @class Promise
	  @param {Function} resolver
	  Useful for tooling.
	  @constructor
	*/

	var Promise$1 = function () {
	  function Promise(resolver) {
	    this[PROMISE_ID] = nextId();
	    this._result = this._state = undefined;
	    this._subscribers = [];

	    if (noop !== resolver) {
	      typeof resolver !== 'function' && needsResolver();
	      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
	    }
	  }

	  /**
	  The primary way of interacting with a promise is through its `then` method,
	  which registers callbacks to receive either a promise's eventual value or the
	  reason why the promise cannot be fulfilled.
	   ```js
	  findUser().then(function(user){
	    // user is available
	  }, function(reason){
	    // user is unavailable, and you are given the reason why
	  });
	  ```
	   Chaining
	  --------
	   The return value of `then` is itself a promise.  This second, 'downstream'
	  promise is resolved with the return value of the first promise's fulfillment
	  or rejection handler, or rejected if the handler throws an exception.
	   ```js
	  findUser().then(function (user) {
	    return user.name;
	  }, function (reason) {
	    return 'default name';
	  }).then(function (userName) {
	    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	    // will be `'default name'`
	  });
	   findUser().then(function (user) {
	    throw new Error('Found user, but still unhappy');
	  }, function (reason) {
	    throw new Error('`findUser` rejected and we're unhappy');
	  }).then(function (value) {
	    // never reached
	  }, function (reason) {
	    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	  });
	  ```
	  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
	   ```js
	  findUser().then(function (user) {
	    throw new PedagogicalException('Upstream error');
	  }).then(function (value) {
	    // never reached
	  }).then(function (value) {
	    // never reached
	  }, function (reason) {
	    // The `PedgagocialException` is propagated all the way down to here
	  });
	  ```
	   Assimilation
	  ------------
	   Sometimes the value you want to propagate to a downstream promise can only be
	  retrieved asynchronously. This can be achieved by returning a promise in the
	  fulfillment or rejection handler. The downstream promise will then be pending
	  until the returned promise is settled. This is called *assimilation*.
	   ```js
	  findUser().then(function (user) {
	    return findCommentsByAuthor(user);
	  }).then(function (comments) {
	    // The user's comments are now available
	  });
	  ```
	   If the assimliated promise rejects, then the downstream promise will also reject.
	   ```js
	  findUser().then(function (user) {
	    return findCommentsByAuthor(user);
	  }).then(function (comments) {
	    // If `findCommentsByAuthor` fulfills, we'll have the value here
	  }, function (reason) {
	    // If `findCommentsByAuthor` rejects, we'll have the reason here
	  });
	  ```
	   Simple Example
	  --------------
	   Synchronous Example
	   ```javascript
	  let result;
	   try {
	    result = findResult();
	    // success
	  } catch(reason) {
	    // failure
	  }
	  ```
	   Errback Example
	   ```js
	  findResult(function(result, err){
	    if (err) {
	      // failure
	    } else {
	      // success
	    }
	  });
	  ```
	   Promise Example;
	   ```javascript
	  findResult().then(function(result){
	    // success
	  }, function(reason){
	    // failure
	  });
	  ```
	   Advanced Example
	  --------------
	   Synchronous Example
	   ```javascript
	  let author, books;
	   try {
	    author = findAuthor();
	    books  = findBooksByAuthor(author);
	    // success
	  } catch(reason) {
	    // failure
	  }
	  ```
	   Errback Example
	   ```js
	   function foundBooks(books) {
	   }
	   function failure(reason) {
	   }
	   findAuthor(function(author, err){
	    if (err) {
	      failure(err);
	      // failure
	    } else {
	      try {
	        findBoooksByAuthor(author, function(books, err) {
	          if (err) {
	            failure(err);
	          } else {
	            try {
	              foundBooks(books);
	            } catch(reason) {
	              failure(reason);
	            }
	          }
	        });
	      } catch(error) {
	        failure(err);
	      }
	      // success
	    }
	  });
	  ```
	   Promise Example;
	   ```javascript
	  findAuthor().
	    then(findBooksByAuthor).
	    then(function(books){
	      // found books
	  }).catch(function(reason){
	    // something went wrong
	  });
	  ```
	   @method then
	  @param {Function} onFulfilled
	  @param {Function} onRejected
	  Useful for tooling.
	  @return {Promise}
	  */

	  /**
	  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	  as the catch block of a try/catch statement.
	  ```js
	  function findAuthor(){
	  throw new Error('couldn't find that author');
	  }
	  // synchronous
	  try {
	  findAuthor();
	  } catch(reason) {
	  // something went wrong
	  }
	  // async with promises
	  findAuthor().catch(function(reason){
	  // something went wrong
	  });
	  ```
	  @method catch
	  @param {Function} onRejection
	  Useful for tooling.
	  @return {Promise}
	  */


	  Promise.prototype.catch = function _catch(onRejection) {
	    return this.then(null, onRejection);
	  };

	  /**
	    `finally` will be invoked regardless of the promise's fate just as native
	    try/catch/finally behaves
	  
	    Synchronous example:
	  
	    ```js
	    findAuthor() {
	      if (Math.random() > 0.5) {
	        throw new Error();
	      }
	      return new Author();
	    }
	  
	    try {
	      return findAuthor(); // succeed or fail
	    } catch(error) {
	      return findOtherAuther();
	    } finally {
	      // always runs
	      // doesn't affect the return value
	    }
	    ```
	  
	    Asynchronous example:
	  
	    ```js
	    findAuthor().catch(function(reason){
	      return findOtherAuther();
	    }).finally(function(){
	      // author was either found, or not
	    });
	    ```
	  
	    @method finally
	    @param {Function} callback
	    @return {Promise}
	  */


	  Promise.prototype.finally = function _finally(callback) {
	    var promise = this;
	    var constructor = promise.constructor;

	    if (isFunction(callback)) {
	      return promise.then(function (value) {
	        return constructor.resolve(callback()).then(function () {
	          return value;
	        });
	      }, function (reason) {
	        return constructor.resolve(callback()).then(function () {
	          throw reason;
	        });
	      });
	    }

	    return promise.then(callback, callback);
	  };

	  return Promise;
	}();

	Promise$1.prototype.then = then;
	Promise$1.all = all;
	Promise$1.race = race;
	Promise$1.resolve = resolve$1;
	Promise$1.reject = reject$1;
	Promise$1._setScheduler = setScheduler;
	Promise$1._setAsap = setAsap;
	Promise$1._asap = asap;

	/*global self*/
	function polyfill() {
	  var local = void 0;

	  if (typeof commonjsGlobal !== 'undefined') {
	    local = commonjsGlobal;
	  } else if (typeof self !== 'undefined') {
	    local = self;
	  } else {
	    try {
	      local = Function('return this')();
	    } catch (e) {
	      throw new Error('polyfill failed because global object is unavailable in this environment');
	    }
	  }

	  var P = local.Promise;

	  if (P) {
	    var promiseToString = null;
	    try {
	      promiseToString = Object.prototype.toString.call(P.resolve());
	    } catch (e) {
	      // silently ignored
	    }

	    if (promiseToString === '[object Promise]' && !P.cast) {
	      return;
	    }
	  }

	  local.Promise = Promise$1;
	}

	// Strange compat..
	Promise$1.polyfill = polyfill;
	Promise$1.Promise = Promise$1;

	return Promise$1;

	})));



	
} (es6Promise));

/* global self, window, module, global, require */
var promise = function () {

    var globalObject = void 0;

    function isFunction(x) {
        return typeof x === "function";
    }

    // Seek the global object
    if (commonjsGlobal !== undefined) {
        globalObject = commonjsGlobal;
    } else if (window !== undefined && window.document) {
        globalObject = window;
    } else {
        globalObject = self;
    }

    // Test for any native promise implementation, and if that
    // implementation appears to conform to the specificaton.
    // This code mostly nicked from the es6-promise module polyfill
    // and then fooled with.
    var hasPromiseSupport = function () {

        // No promise object at all, and it's a non-starter
        if (!globalObject.hasOwnProperty("Promise")) {
            return false;
        }

        // There is a Promise object. Does it conform to the spec?
        var P = globalObject.Promise;

        // Some of these methods are missing from
        // Firefox/Chrome experimental implementations
        if (!P.hasOwnProperty("resolve") || !P.hasOwnProperty("reject")) {
            return false;
        }

        if (!P.hasOwnProperty("all") || !P.hasOwnProperty("race")) {
            return false;
        }

        // Older version of the spec had a resolver object
        // as the arg rather than a function
        return function () {

            var resolve = void 0;

            var p = new globalObject.Promise(function (r) {
                resolve = r;
            });

            if (p) {
                return isFunction(resolve);
            }

            return false;
        }();
    }();

    // Export the native Promise implementation if it
    // looks like it matches the spec
    if (hasPromiseSupport) {
        return globalObject.Promise;
    }

    //  Otherwise, return the es6-promise polyfill by @jaffathecake.
    return es6PromiseExports.Promise;
}();

/* global module, require */
var promisify = function () {

    // Get a promise object. This may be native, or it may be polyfilled

    var ES6Promise = promise;

    /**
     * thatLooksLikeAPromiseToMe()
     *
     * Duck-types a promise.
     *
     * @param {object} o
     * @return {bool} True if this resembles a promise
     */
    function thatLooksLikeAPromiseToMe(o) {
        return o && typeof o.then === "function" && typeof o.catch === "function";
    }

    /**
     * promisify()
     *
     * Transforms callback-based function -- func(arg1, arg2 .. argN, callback) -- into
     * an ES6-compatible Promise. Promisify provides a default callback of the form (error, result)
     * and rejects when `error` is truthy. You can also supply settings object as the second argument.
     *
     * @param {function} original - The function to promisify
     * @param {object} settings - Settings object
     * @param {object} settings.thisArg - A `this` context to use. If not set, assume `settings` _is_ `thisArg`
     * @param {bool} settings.multiArgs - Should multiple arguments be returned as an array?
     * @return {function} A promisified version of `original`
     */
    return function promisify(original, settings) {

        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var returnMultipleArguments = settings && settings.multiArgs;

            var target = void 0;
            if (settings && settings.thisArg) {
                target = settings.thisArg;
            } else if (settings) {
                target = settings;
            }

            // Return the promisified function
            return new ES6Promise(function (resolve, reject) {

                // Append the callback bound to the context
                args.push(function callback(err) {

                    if (err) {
                        return reject(err);
                    }

                    for (var _len2 = arguments.length, values = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                        values[_key2 - 1] = arguments[_key2];
                    }

                    if (false === !!returnMultipleArguments) {
                        return resolve(values[0]);
                    }

                    resolve(values);
                });

                // Call the function
                var response = original.apply(target, args);

                // If it looks like original already returns a promise,
                // then just resolve with that promise. Hopefully, the callback function we added will just be ignored.
                if (thatLooksLikeAPromiseToMe(response)) {
                    resolve(response);
                }
            });
        };
    };
}();

var utilsExports = {};
var utils = {
  get exports(){ return utilsExports; },
  set exports(v){ utilsExports = v; },
};

(function (module) {

	const promisify$1 = promisify;

	/** * @namespace */
	const PromiseUtils = module.exports;

	/**
	 * Wraps the client request method on an instance, making it return a promise in every case except when the fourth argument is explicitly set to false
	 * @param {Function} request The original request method
	 * @return {Function}
	 */
	PromiseUtils.wrapClientRequestMethod = function(request) {
	  const promisified = promisify$1(request);

	  return function(method, params, id, shouldCall) {
	    if(shouldCall === false) {
	      // this should return a raw request for use in batches
	      return request(method, params, id);
	    }
	    return promisified.apply(this, arguments);
	  };
	};
} (utils));

var http;
var hasRequiredHttp;

function requireHttp () {
	if (hasRequiredHttp) return http;
	hasRequiredHttp = 1;
	const jayson = jaysonExports;
	const promiseUtils = utilsExports;

	/**
	 * Constructor for a Jayson Promise Client Http
	 * @see Client
	 * @class PromiseClientHttp
	 * @extends ClientHttp
	 * @return {PromiseClientHttp}
	 */
	const PromiseClientHttp = function(options) {
	  if(!(this instanceof PromiseClientHttp)) {
	    return new PromiseClientHttp(options);
	  }
	  jayson.Client.http.apply(this, arguments);
	  this.request = promiseUtils.wrapClientRequestMethod(this.request.bind(this));
	};
	require$$3.inherits(PromiseClientHttp, jayson.Client.http);

	http = PromiseClientHttp;
	return http;
}

var https;
var hasRequiredHttps;

function requireHttps () {
	if (hasRequiredHttps) return https;
	hasRequiredHttps = 1;
	const jayson = jaysonExports;
	const promiseUtils = utilsExports;

	/**
	 * Constructor for a Jayson Promise Client Http
	 * @see Client
	 * @class PromiseClientHttps
	 * @extends ClientHttps
	 * @return {PromiseClientHttps}
	 */
	const PromiseClientHttps = function(options) {
	  if(!(this instanceof PromiseClientHttps)) {
	    return new PromiseClientHttps(options);
	  }
	  jayson.Client.https.apply(this, arguments);
	  this.request = promiseUtils.wrapClientRequestMethod(this.request.bind(this));
	};
	require$$3.inherits(PromiseClientHttps, jayson.Client.https);

	https = PromiseClientHttps;
	return https;
}

var tls;
var hasRequiredTls;

function requireTls () {
	if (hasRequiredTls) return tls;
	hasRequiredTls = 1;
	const jayson = jaysonExports;
	const promiseUtils = utilsExports;

	/**
	 * Constructor for a Jayson Promise Client Tls
	 * @see Client
	 * @class PromiseClientTls
	 * @extends ClientTls
	 * @return {PromiseClientTls}
	 */
	const PromiseClientTls = function(options) {
	  if(!(this instanceof PromiseClientTls)) {
	    return new PromiseClientTls(options);
	  }
	  jayson.Client.tls.apply(this, arguments);
	  this.request = promiseUtils.wrapClientRequestMethod(this.request.bind(this));
	};
	require$$3.inherits(PromiseClientTls, jayson.Client.tls);

	tls = PromiseClientTls;
	return tls;
}

var tcp;
var hasRequiredTcp;

function requireTcp () {
	if (hasRequiredTcp) return tcp;
	hasRequiredTcp = 1;
	const jayson = jaysonExports;
	const promiseUtils = utilsExports;

	/**
	 * Constructor for a Jayson Promise Client Tcp
	 * @see Client
	 * @class PromiseClientTcp
	 * @extends ClientTcp
	 * @return {PromiseClientTcp}
	 */
	const PromiseClientTcp = function(options) {
	  if(!(this instanceof PromiseClientTcp)) {
	    return new PromiseClientTcp(options);
	  }
	  jayson.Client.tcp.apply(this, arguments);
	  this.request = promiseUtils.wrapClientRequestMethod(this.request.bind(this));
	};
	require$$3.inherits(PromiseClientTcp, jayson.Client.tcp);

	tcp = PromiseClientTcp;
	return tcp;
}

var websocket;
var hasRequiredWebsocket;

function requireWebsocket () {
	if (hasRequiredWebsocket) return websocket;
	hasRequiredWebsocket = 1;
	const jayson = jaysonExports;
	const promiseUtils = utilsExports;

	/**
	 * Constructor for a Jayson Promise Client Websocket
	 * @see Client
	 * @class PromiseClientWebsocket
	 * @extends ClientWebsocket
	 * @return {PromiseClientWebsocket}
	 */
	const PromiseClientWebsocket = function(options) {
	  if(!(this instanceof PromiseClientWebsocket)) {
	    return new PromiseClientWebsocket(options);
	  }
	  jayson.Client.websocket.apply(this, arguments);
	  this.request = promiseUtils.wrapClientRequestMethod(this.request.bind(this));
	};
	require$$3.inherits(PromiseClientWebsocket, jayson.Client.websocket);

	websocket = PromiseClientWebsocket;
	return websocket;
}

const jayson$3 = jaysonExports;
const promiseUtils = utilsExports;

/**
 * Constructor for a Jayson Promise Client
 * @see Client
 * @class PromiseClient
 * @extends Client
 * @return {PromiseClient}
 */
const PromiseClient = function(server, options) {
  if(!(this instanceof PromiseClient)) {
    return new PromiseClient(server, options);
  }
  jayson$3.Client.apply(this, arguments);
  this.request = promiseUtils.wrapClientRequestMethod(this.request.bind(this));
};
require$$3.inherits(PromiseClient, jayson$3.Client);

/**
 * @type PromiseClientHttp
 * @static
 */
PromiseClient.http = requireHttp();

/**
 * @type PromiseClientHttps
 * @static
 */
PromiseClient.https = requireHttps();

/**
 * @type PromiseClientTls
 * @static
 */
PromiseClient.tls = requireTls();

/**
 * @type PromiseClientTcp
 * @static
 */
PromiseClient.tcp = requireTcp();

/**
 * @type PromiseClientWebsocket
 * @static
 */
PromiseClient.websocket = requireWebsocket();

var client = PromiseClient;

const jayson$2 = jaysonExports;

/**
 * Constructor for a Jayson Promise Method
 * @see Method
 * @class PromiseMethod
 * @extends Method
 * @return {PromiseMethod}
 */
const PromiseMethod = method = function(handler, options) {
  if(!(this instanceof PromiseMethod)) {
    return new PromiseMethod(handler, options);
  }
  jayson$2.Method.apply(this, arguments);
};
require$$3.inherits(PromiseMethod, jayson$2.Method);

var method = PromiseMethod;

/**
 * @summary Executes this method in the context of a server
 * @param {Server} server
 * @param {Array|Object} requestParams
 * @param {Object} [context] Optional context object passed to methods
 * @param {Function} outerCallback
 * @return {Promise}
 */
PromiseMethod.prototype.execute = function(server, requestParams, context, outerCallback) {
  let wasPromised = false;

  if(typeof(context) === 'function') {
    outerCallback = context;
    context = {};
  }

  const promise = jayson$2.Method.prototype.execute.call(this, server, requestParams, context, function() {
    if(wasPromised) {
      return; // ignore any invocations of the callback if a promise was returned
    }
    outerCallback.apply(null, arguments);
  });

  wasPromised = promise && typeof promise.then === 'function';

  // if the handler returned a promise, call the callback when it resolves
  if(wasPromised) {
    return promise.then(
      function(fulfilled) { outerCallback(null, fulfilled); },
      function(rejected) { outerCallback(rejected); }
    );
  }
};

const Method = method;
const jayson$1 = jaysonExports;

/**
 * Constructor for a Jayson Promise Server
 * @see Server
 * @class PromiseServer
 * @extends Server
 * @return {PromiseServer}
 */
const PromiseServer = function(methods, options) {
  if(!(this instanceof PromiseServer)) {
    return new PromiseServer(methods, options);
  }
  options = options || {};
  options.methodConstructor = options.methodConstructor || Method;
  jayson$1.Server.call(this, methods, options);
};
require$$3.inherits(PromiseServer, jayson$1.Server);

var server$1 = PromiseServer;

(function (module) {

	const Jayson = jaysonExports;

	/**
	 * Namespace available as require('jayson/promise')
	 * @namespace JaysonPromise
	 */
	const JaysonPromise = module.exports;

	/**
	 * @static
	 * @type PromiseClient
	 */
	JaysonPromise.Client = JaysonPromise.client = client;

	/**
	 * @static
	 * @type Server
	 */
	JaysonPromise.Server = JaysonPromise.server = server$1;

	/**
	 * @static
	 * @type Utils
	 */
	JaysonPromise.Utils = JaysonPromise.utils = Jayson.utils;

	/**
	 * @static
	 * @type PromiseMethod
	 */
	JaysonPromise.Method = JaysonPromise.method = method;
} (lib$1));

(function (module) {

	module.exports = libExports$1;
} (promise$1));

var jayson = /*@__PURE__*/getDefaultExportFromCjs(promiseExports);

const server = new jayson.Server({
    initialize() {
        return { initialized: true };
    },
});
// async function startServer() {
//   const server = new Server(path);
//   await server.listen();
//   return {
//     address: server.address()!,
//     dispose: () => server.dispose(true),
//   };
// }
// const port = await getPort();
// server.http().listen(port, () => process.stdout.write(`${port}${os.EOL}`));
server.http().listen(54188);
// // console.log(actions);
// const { address, dispose } = await startServer();
// const { browser, page } = await launch(address);
// await browser.close();
// await dispose();
