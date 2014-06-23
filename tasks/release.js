/*
 * grunt-audiotheme
 * http://audiotheme.com/
 *
 * Copyright (c) 2013 AudioTheme, LLC
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');

	// Alias release task for faster access.
	grunt.registerTask('release', function(version) {
		version = version ? ':' + version : '';
		grunt.task.run('audiotheme-release' + version);
	});

	/**
	 * The main release task.
	 *
	 * Runs the build process first.
	 */
	grunt.registerTask('audiotheme-release', function(version) {
		version = version || pkg.version;

		grunt.task.requires('audiotheme-setup');

		if ('theme' === grunt.option('audiotheme-type')) {
			grunt.task.run('audiotheme-build:' + version);
			grunt.task.run('audiotheme-release-theme:' + version);
		}
	});

	/**
	 * Upload the theme.
	 *
	 * Uses credentials specified in config.json in the project root.
	 */
	grunt.registerTask('audiotheme-release-theme', function(version) {
		var file = 'release/' + pkg.name.toLowerCase() + '-' + version + '.zip';

		if (undefined === version) {
			grunt.warn('Version must be defined for the audiotheme-release-theme task.');
		}

		if (!grunt.file.exists(file)) {
			grunt.warn('The package archive doesn\'t exist at: ' + file);
		}

		// Set a reference to the most recent build in order to upload it.
		if (undefined === grunt.config.get('sftp.release.files')) {
			grunt.config.set('sftp.release.files', {
				'./': [ file ]
			});
		}

		grunt.task.run('sftp:release');
	});

};
