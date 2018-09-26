'use strict';

require('colors');
var _ = require('underscore');
var Loggly = require('node-loggly-bulk');

function errToObject(err) {
	return _.extend({message: err.stack}, err);
}

module.exports = function(cfg) {

	var defaults = {
		json: true,
		production: false
	};

	cfg = _.defaults(cfg, defaults);

	var client = Loggly.createClient(cfg);

	return {

		info: function(arg1, arg2) {

			var indent = ' ';

			if (cfg.production) return;

			// augment arguments
			if (arg1[0] === '*') {

				if (!_.isString(arg1)) arg1 = JSON.stringify(arg1);
				if (!_.isString(arg2)) arg2 = JSON.stringify(arg2);

				if (arg1) arg1 = indent + arg1.gray;
				if (arg2) arg2 = indent + arg2.gray;
			}

			if (arguments.length === 2) {
				console.log(arg1, arg2);
			} else {
				console.log(arg1);
			}
		},

		startup: function(name, message, data) {
			if (cfg.production) {
				this._startupSend(name, message, data);
			} else {
				this._startupLog(name, message, data);
			}
		},

		error: function(err, data) {

			if (_.isObject(data)) err = _.extend(err, data);

			if (cfg.production) {
				this._errorSend(err);
			} else {
				this._errorLog(err);
			}
		},

		_startupSend: function(name, message, data) {

			if (_.isObject(data)) {
				data = _.extend({startup: name}, data); // make `startup` first property shown on Loggly
			} else {
				data = {startup: name};
			}

			// console.log(data);
			client.log(data, function(err/*, result*/) {
				if (err) console.log(err);
			});
		},

		_startupLog: function(name, message/*, data*/) {
			console.log(message);
		},

		_errorSend: function(err) {

			var data = (_.isError(err))? errToObject(err) : err;

			// console.log(data);
			client.log(data, function(err/*, result*/) {
				if (err) console.log(err);
			});
		},

		_errorLog: function(err) {

			var message = (_.isError(err))? err.stack : err;
			var data = (_.isError(err))? _.clone(err) : null; // properties added onto the error object (e.g., `resource_id`)

			if (!_.isString(message)) message = JSON.stringify(message);
			if (!_.isEmpty(data)) data = JSON.stringify(data); // `_.isEmpty` required because `data` defaults to `{}`

			console.log(message.red);
			if (_.isString(data)) console.log(data.red); // `data` is either `{}` or a string
		},

		search: function(query, next) {
			client.search(query, next);
		}
	};
};
