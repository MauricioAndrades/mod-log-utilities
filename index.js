var util = require('util')
var traverse = require('traverse')
var javascript_stringify = require('javascript-stringify')
module.exports = (function () {
	return {
		log: function (args) {
			console.log('-----')
			args = [...arguments]
			return args.forEach(function (el) {
				return console.log(JSON.stringify(el))
			})
		},
		ulog: function (args) {
			args = [...arguments]
			return args.forEach(function (el) {
				return console.log(util.inspect(el, {
					showHidden: true,
					depth: null
				}))
			})
		},
		tlog: function () {
			var newline = (val) => {
				return (val ? '\n' + val : '\n');
			};
			var args = []
			args.push(...arguments)

			args.forEach(function (el) {
				return setImmediate(function () {
					console.log(newline());
					if (typeof el === 'string') {
						return console.log(newline(JSON.stringify(el)))
					} else {
						var clone = traverse(el).clone()
						var run = function (clone, callback) {
							var scrubbed = traverse(clone).map(function (x) {
								if (this.circular) {
									this.remove()
									this.update()
								}
							})
							return callback(scrubbed)
						}
						var stringify = function (_obj) {
							var s = ''
							traverse(_obj).forEach(function to_s(node) {
								if (Array.isArray(node)) {
									if (node === null) s += 'null';
									this.before(function () {
										s += '[';
									})
									this.post(function (child) {
										if (!child.isLast) s += ', ';
									})
									this.after(function () {
										s += ']';
									})
								} else if (typeof node === 'object') {
									if (node === null) {
										s += 'null'
									} else {
										this.before(function () {
											s += '{';
										});
										this.pre(function (x, key) {
											to_s(key)
											s += ': ';
										})
										this.post(function (child) {
											if (!child.isLast) s += ',';
										})
										this.after(function () {
											s += '}';
										})
									}
								} else if (typeof node === 'string') {
									s += '"' + node.toString().replace(/"/g, '\\"') + '"'
								} else if (typeof node === 'function') {
									s += javascript_stringify(node)
								} else {
									s += javascript_stringify(node)
								}
							})
							console.log(s)
						}
						return run(el, stringify)
					}
				})
			})
		},
		plog: function () {
			var args = []
			args.push(...arguments)

			args.forEach(function (el) {
				return process.nextTick(function () {
					if (typeof el === 'string') {
						return console.log(JSON.stringify(el))
					} else {
						var clone = traverse(el).clone()
						var run = function (clone, callback) {
							var scrubbed = traverse(clone).map(function (x) {
								if (this.circular) {
									this.remove()
								}
							})
							return callback(scrubbed)
						}
						var stringify = function (_obj) {
							var s = ''
							traverse(_obj).forEach(function to_s(node) {
								if (Array.isArray(node)) {
									if (node === null) {
										s += 'null'
									}
									this.before(function () {
										s += '['
									})
									this.post(function (child) {
										if (!child.isLast) s += ', '
									})
									this.after(function () {
										s += ']'
									})
								} else if (typeof node === 'object') {
									if (node === null) {
										s += 'null'
									} else {
										this.before(function () {
											s += '{'
										})
										this.pre(function (x, key) {
											to_s(key)
											s += ': '
										})
										this.post(function (child) {
											if (!child.isLast) s += ', '
										})
										this.after(function () {
											s += '}'
										})
									}
								} else if (typeof node === 'string') {
									s += '"' + node.toString().replace(/"/g, '\\"') + '"'
								} else if (typeof node === 'function') {
									s += javascript_stringify(node)
								} else {
									s += javascript_stringify(node)
								}
							})
							console.log(s)
						}
						return run(el, stringify)
					}
				})
			})
		}
	}
}())
