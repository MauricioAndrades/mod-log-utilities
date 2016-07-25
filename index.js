var util = require('util');
var traverse = require('traverse');
var requireg = require("/Users/Op/.npm-global/lib/node_modules/requireg/lib/requireg.js")
var javascript_stringify = requireg('javascript-stringify')

var javascript_string = requireg('javascript-stringify')
module.exports = (function () {
  return {
    log: function (args) {
      console.log('-----');
      args = [...arguments];
      return args.forEach(function (el) {
        return console.log(JSON.stringify(el));
      });
    },

    ulog: function (args) {
      args = [...arguments];
      console.log('----------')
      return args.forEach(function (el) {
        return console.log(util.inspect(el, {
          showHidden: true,
          depth: null
        }));
      })
    },

    tlog: function (obj) {
      return setImmediate(function () {
        var traverse = require('traverse');
        var clone = traverse(obj).clone();

        if (typeof clone === 'string') {
          console.log('------------')
          return console.log(JSON.stringify(obj));
        }

        var run = function (clone, callback) {
          var scrubbed = traverse(clone).map(function (x) {
            if (this.circular) {
              this.remove();
              this.update();
            }
          });
          return callback(scrubbed);
        }
        var stringify = function (_obj) {
          var s = ''
          traverse(_obj).forEach(function to_s(node) {
            if (Array.isArray(node)) {
              this.before(function () {
                s += '['
              });
              this.post(function (child) {
                if (!child.isLast)
                  s += ',';
              });
              this.after(function () {
                s += ']'
              });
            } else if (typeof node === 'object') {
              this.before(function () {
                s += '{'
              });
              this.pre(function (x, key) {
                to_s(key);
                s += ':';
              });
              this.post(function (child) {
                if (!child.isLast)
                  s += ',';
      javascript_stringify        });
              this.after(function () {
                s += '}'
              });
            } else if (typeof node === 'string') {
              s += '"' + node.toString().replace(/"/g, '\\"') + '"';
            } else if (typeof node === 'function') {
              // pull function def's here.
              s += node.toString();
            } else {
              s += 'null'
            }
          });
          return console.log(s)
        }

        return run(obj, stringify);
      })
    },

    plog: function (obj) {
      return process.nextTick(function () {

        console.log('------------')

        if (typeof obj === 'string') {
          // return setImmediate(console.log(JSON.stringify(obj)));
          console.log(JSON.stringify(obj))
        }

        function run(_obj, callback) {
          var scrubbed = traverse(_obj).map(function (x) {
            if (this.circular) {
              this.remove();
            }
          });
          return callback(scrubbed);
        }

        function stringify(_obj) {
          var s = ''
          traverse(_obj).forEach(function to_s(node) {
            if (Array.isArray(node)) {
              this.before(function () {
                s += '['
              });
              this.post(function (child) {
                if (!child.isLast) s += ',';
              });
              this.after(function () {
                s += ']'
              });
            } else if (typeof node === 'object') {
              this.before(function () {
                s += '{'
              });
              this.pre(function (x, key) {
                to_s(key);
                s += ':';
              });
              this.post(function (child) {
                if (!child.isLast) s += ',';
              });
              this.after(function () {
                s += '}'
              });
            } else if (typeof node === 'string') {
              s += '"' + node.toString().replace(/"/g, '\\"') + '"';
            } else if (typeof node === 'function') {
              // pull function def's here.
              s += node.toString();
            } else {
              s+= javascript_stringify(node);
            }
          });
          return (console.log(s))
        }

        run(obj, stringify);

      })
    },
  }
}());
