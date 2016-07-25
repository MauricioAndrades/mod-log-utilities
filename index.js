var util = require('util');
var traverse = require('traverse');
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
              s += 'null'
            }
          });
          return console.log(s)
        }

        return run(obj, stringify);
      })
    },

  }
}());
