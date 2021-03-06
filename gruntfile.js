'use strict';

var Pkg = require('./package.json');

module.exports = function(grunt) {

	// Initialize config.
	grunt.initConfig({
		pkg: Pkg
	});

	grunt.loadTasks('grunts');
	grunt.registerTask('lint', ['eslint']);
	grunt.registerTask('default', ['lint']);
};
