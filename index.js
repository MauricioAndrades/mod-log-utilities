var util = require('util');
var traverse = require('traverse');
var javascript_stringify = require('javascript-stringify')

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
                var clone = traverse(obj).clone();

                var run = function (clone, callback) {
                    var scrubbed = traverse(clone).map(function (x) {
                        if (this.circular) {
                            this.remove();
                            this.update();
                        }
                    });
                    return callback(scrubbed);
                }

                if (typeof clone === 'string') {
                    console.log('------------')
                    console.log(JSON.stringify(clone));
                    return;
                }

                var stringify = function (_obj) {
                    var s = '';
                    traverse(_obj).forEach(function to_s(node) {
                        if (Array.isArray(node)) {
                            if (node === null) {
                                s += 'null'
                            }
                            this.before(function () {
                                s += '['
                            });
                            this.post(function (child) {
                                if (!child.isLast) s += ', ';
                            });
                            this.after(function () {
                                s += ']'
                            });
                        } else if (typeof node === 'object') {
                            if (node === null) {
                                s += 'null'
                            } else {
                                this.before(function () {
                                    s += '{'
                                });
                                this.pre(function (x, key) {
                                    to_s(key);
                                    s += ': ';
                                });
                                this.post(function (child) {
                                    if (!child.isLast) s += ', ';
                                });
                                this.after(function () {
                                    s += '}'
                                });

                            }
                        } else if (typeof node === 'string') {
                            s += '"' + node.toString().replace(/"/g, '\\"') + '"';
                        } else if (typeof node === 'function') {
                            s += javascript_stringify(node);
                        } else {
                            s += javascript_stringify(node);
                        }
                    });
                    console.log(s);
                }
                return run(obj, stringify)
            })
        },

        plog: function (obj) {
            return process.nextTick(function () {

                console.log('------------')

                if (typeof obj === 'string') {
                    console.log(javascript_stringify(obj));
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
                    traverse(_obj).forEach(function to_s(node) {
                        var s = '';
                        if (Array.isArray(node)) {
                            if (node === null) {
                                s += 'null'
                            }
                            this.before(function () {
                                s += '['
                            });
                            this.post(function (child) {
                                if (!child.isLast) s += ', ';
                            });
                            this.after(function () {
                                s += ']'
                            });
                        } else if (typeof node === 'object') {
                            if (node === null) {
                                s += 'null'
                            } else {
                                this.before(function () {
                                    s += '{'
                                });
                                this.pre(function (x, key) {
                                    to_s(key);
                                    s += ': ';
                                });
                                this.post(function (child) {
                                    if (!child.isLast) s += ', ';
                                });
                                this.after(function () {
                                    s += '}'
                                });

                            }
                        } else if (typeof node === 'string') {
                            s += '"' + node.toString().replace(/"/g, '\\"') + '"';
                        } else if (typeof node === 'function') {
                            s += javascript_stringify(node);
                        } else {
                            s += javascript_stringify(node);
                        }
                    })
                }
                run(obj, stringify);
            })
        },
    }
}());
