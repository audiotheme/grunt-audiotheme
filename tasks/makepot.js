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
		path = require('path'),
		pkg = grunt.file.readJSON('package.json'),
		util = require('./lib/util').init(grunt),
		userConfig = util.getUserConfig(),
		wp = require('./lib/wordpress').init(grunt);

	// Mix in non-conflict string functions to Underscore namespace.
	_.str = require('underscore.string');
	_.mixin(_.str.exports());

	/**
	 * Generate a POT file for translating theme strings.
	 *
	 * php-cli and gettext should be in the system path to run this task.
	 *
	 * This task is a multi task and is not configured using the main
	 * 'audiotheme' object, so it can be run independently.
	 *
	 * @link http://develop.svn.wordpress.org/trunk/tools/i18n/
	 */
	grunt.registerMultiTask('makepot', function() {
		var done = this.async(),
			cwd, makepotFile, options, potFile;

		options = this.options({
			cwd: process.cwd(),
			domainPath: wp.getHeader('Domain Path') || '/languages',
			i18nToolsPath: '../../../../tools/i18n/', // Default location when using develop.svn.wordpress.org
			potFilename: pkg.name.toLowerCase() + '.pot',
			type: 'wp-theme'
		});

		options.i18nToolsPath = userConfig.i18nToolsPath || options.i18nToolsPath;
		options.domainPath = _.ltrim(options.domainPath, ['/','\\'] );
		cwd = path.resolve(process.cwd(), options.cwd);
		potFile = path.join(cwd, options.domainPath, options.potFilename);

		// Make sure the makepot.php script exists.
		makepotFile = path.join(options.i18nToolsPath, 'makepot.php');
		if (!grunt.file.exists(makepotFile)) {
			grunt.fatal('makepot.php could not be found in ' + options.i18nToolsPath);
		}

		// Make sure the domain path exists.
		grunt.file.mkdir(path.resolve(cwd, options.domainPath));

		grunt.util.spawn({
			cmd: 'php',
			args: [makepotFile, options.type, cwd, potFile],
			opts: { stdio: 'inherit' }
		}, function(error, result) {
			if (grunt.file.exists(potFile)) {
				grunt.log.ok('POT file saved to ' + potFile);
				// @todo Add 'Plural-Forms' and various Poedit headers to the POT file.
			}

			done(error, result);
		});
	});

};
