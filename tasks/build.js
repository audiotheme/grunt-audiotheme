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
		var builds = [],
			options;

		if (undefined === version) {
			grunt.warn('Version must be defined for the audiotheme-build-theme task.');
		}

		// Set up the 'replace' task.
		util.setTaskDefaults('replace', { version: version });

		// Run all build targets.
		builds = _.omit( grunt.config.get('audiotheme'), 'options' );

		_.each(builds, function(item, index) {
			// Limit to a single build: grunt build --{target}
			if (grunt.option(index)) {
				builds = _.pick(builds, index);
			}
		});

		_.each(builds, function(item, index, list) {
			options = _.extend({
				tasks: []
			}, item.options);

			if (!grunt.option('update-versions')) {
				options.tasks.unshift('replace');
			}

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
			grunt.task.run(options.tasks);
		});
	});

};
