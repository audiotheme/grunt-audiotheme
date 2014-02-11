/*
 * grunt-audiotheme
 * http://audiotheme.com/
 *
 * Copyright (c) 2013 AudioTheme, LLC
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	var _ = require('underscore'),
		async = require('async'),
		pkg = grunt.file.readJSON('package.json'),
		util = require('./lib/util').init(grunt);

	// Alias build task for faster access.
	grunt.registerTask('build', function(version) {
		version = version ? ':' + version : '';
		grunt.task.run('audiotheme-build' + version);
	});

	/**
	 * The main build task.
	 *
	 * The tasks that run during the build process can be configured in the main
	 * Gruntfile.js.
	 */
	grunt.registerTask('audiotheme-build', function(version) {
		version = version || pkg.version;

		grunt.task.requires('audiotheme-setup');
		grunt.event.emit('build.audiotheme', version, grunt.option('audiotheme-type'));

		if ('theme' === grunt.option('audiotheme-type')) {
			grunt.task.run('audiotheme-build-theme:' + version);
		}
	});

	/**
	 * Build a theme.
	 *
	 * Sets up runtime options and executes the tasks configured in the
	 * audiotheme:build target.
	 */
	grunt.registerTask('audiotheme-build-theme', function(version) {
		var tasks = [],
			options;

		if (undefined === version) {
			grunt.warn('Version must be defined for the audiotheme-build-theme task.');
		}

		options = _.extend({
			tasks: []
		}, grunt.config.get('audiotheme.build.options'));

		tasks = options.tasks;
		tasks.unshift('audiotheme-bump-theme-version:' + version);

		// Set runtime options for various tasks.
		options.tasks.forEach(function(task) {
			if (0 === task.indexOf('jshint')) {
				// Set JSHint 'devel' option to false.
				grunt.config.set('jshint.options.devel', false);

				util.getTargets('jshint').forEach(function(target) {
					grunt.config.set('jshint.' + target + '.options.devel', false);
				});
			} else if (0 === task.indexOf('compress')) {
				// Set the zip filename.
				grunt.config.set('compress.build.options.archive', 'release/' + pkg.name.toLowerCase() + '-' + version + '.zip');
			} else if (0 === task.indexOf('makepot')) {
				// Set makepot to operate on the build directory.
				grunt.config.set('makepot.build.options.cwd', 'release/' + pkg.name.toLowerCase());
			}
		});

		// Run specified build tasks.
		grunt.task.run(tasks);
	});

	/**
	 * Bump version numbers throughout the theme codebase.
	 */
	grunt.registerTask('audiotheme-bump-theme-version', function(version) {
		var done = this.async();

		version = version || pkg.version;

		// @todo Allow the files to be configured.
		// @todo Toggle these off with a boolean.
		async.series([
			function(callback) {
				// Bump version numbers in main files.
				var files = ['assets/styles/style.less', 'assets/styles/less/style.less'];
				util.replaceInFiles(/Version:.*$/mi, 'Version: ' + version, files, callback);
			},
			function(callback) {
				// Replace '@since x.x.x' tokens throughout the codebase.
				var files = ['*.php', '**/*.php', '!docs/**', '!node_modules/**', '!release/**'];
				util.replaceInFiles(/@since x.x.x/gi, '@since ' + version, files, callback);
			}
		], function(error, result) {
			done(error, result);
		});
	});

};
