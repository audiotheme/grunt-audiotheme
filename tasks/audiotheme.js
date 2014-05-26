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
		util = require('./lib/util').init(grunt),
		userConfig = util.getUserConfig();

	// Load all grunt module peerDependencies.
	require('matchdep').filterPeer('grunt-*').forEach(grunt.loadNpmTasks);

	/**
	 * The entry point.
	 *
	 * Any task prefixed with 'audiotheme-' should use this entry point by
	 * replacing the dash with a colon (eg. audiotheme-build = audiotheme:build).
	 * This ensures the proper options and targets are set up beforehand.
	 */
	grunt.registerTask('audiotheme', function() {
		var task = this.name + '-' + this.args.join(':'),
			subtasks = ['apigen', 'build', 'makepot', 'release'],
			subtask = this.args[0] || 'setup';

		// Require the type of project to be specified.
		grunt.config.requires('audiotheme.options.type');

		// Set the type. Either 'theme' or 'plugin'.
		grunt.option('audiotheme-type', grunt.config.get('audiotheme.options.type'));

		grunt.task.run('audiotheme-setup');

		if ('setup' === subtask) {
			return;
		}

		if (-1 !== _.indexOf(subtasks, subtask)) {
			grunt.task.run(task);
		} else {
			grunt.task.run(subtask);
		}
	});

	/**
	 * Set up AudioTheme task and target defaults.
	 *
	 * This should always run before any task that needs to be filtered. Task
	 * and target rules are loaded from the 'options' folder.
	 */
	grunt.registerTask('audiotheme-setup', function() {
		var options = grunt.config.get('audiotheme.setup'),
			excludes, files;

		options = _.extend({
			autoprefixer: true,
			clean: true,
			compress: true,
			copy: true,
			jshint: true,
			makepot: true,
			sftp: true,
			todos: true
		}, options);

		// Set grunt-autoprefixer defaults.
		if (options.autoprefixer) {
			util.setTaskDefaults('autoprefixer');
		}

		// Set grunt-contrib-clean defaults for the build task.
		if (options.clean) {
			util.setTaskDefaults('clean', { name: pkg.name.toLowerCase() });
		}

		// Set grunt-contrib-compress defaults for the build task.
		if (options.compress) {
			util.setTaskDefaults('compress', { name: pkg.name.toLowerCase() });
		}

		// Set grunt-contrib-copy defaults for the build task.
		if (options.copy) {
			util.setTaskDefaults('copy', { name: pkg.name.toLowerCase() });

			// Add excludes to the source array.
			files = grunt.config.get('copy.build.files');
			excludes = grunt.config.get('audiotheme.build.options.exclude');

			if (_.isArray(files) && undefined !== files[0].src && _.isArray(excludes)) {
				files[0].src = _.union(files[0].src, _.map(excludes, function(value) {
					return (0 === value.indexOf('!')) ? value : '!' + value;
				}));

				grunt.config.set('copy.build.files', files);
			}
		}

		// Set cssformat defaults.
		if (options.compress) {
			util.setTaskDefaults('cssformat');
		}

		// Explicitly set options for each JSHint target.
		// - Custom options are merged with defaults from /config/.jshintrc.json.
		// - The theme package can set a .jshintrc and those properties can
		//   still be overridden (eg. to set the 'devel' option to false at
		//   runtime).
		if (options.jshint) {
			grunt.config.set('jshint.options', util.jshintOptions());

			util.getTargets('jshint').forEach(function(target) {
				grunt.config.set('jshint.' + target + '.options', util.jshintOptions(target));
			});
		}

		// Set makepot defaults for the build task.
		if (options.makepot) {
			grunt.config.set('makepot.build.options.type', 'wp-' + grunt.option('audiotheme-type'));
		}

		// Set grunt-ssh defaults for the release task.
		if (options.sftp && grunt.file.exists('config.json')) {
			util.setTaskDefaults('sftp', {
				host: userConfig.production.host,
				port: userConfig.production.port || 22,
				username: userConfig.production.username,
				password: userConfig.production.password,
				path: userConfig.production.releasePath
			});
		}
	});

	grunt.task.run('audiotheme');

};
