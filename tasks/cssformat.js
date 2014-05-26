/*
 * grunt-audiotheme
 * http://audiotheme.com/
 *
 * Copyright (c) 2013 AudioTheme, LLC
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	var _ = require('underscore');

	/**
	 * Format CSS according to the rules defined in .csscomb.json.
	 *
	 * This task is a multi task and is not configured using the main
	 * 'audiotheme' object, so it can be run independently.
	 *
	 * The theme doesn't need to include a .csscomb.json unless modifications
	 * are significantly different than the options set in this plugin's
	 * .csscomb.json file. Minor changes can be included in the cssformat
	 * options object.
	 *
	 * Rules are sorted alphabetically by default, with the following exceptions:
	 * - Position units (top, right, bottom, left) follow the 'position' declaration.
	 *
	 * @todo Eventually run on LESS files.
	 * @link https://github.com/csscomb/csscomb.js/pull/95
	 */
	grunt.registerMultiTask('cssformat', function() {
		var Comb = require('csscomb'),
			comb = new Comb(),
			config = require('./config/.csscomb.json'),
			configKeys = _.keys(config),
			userConfig = {},
			options;

		options = this.options();

		if (grunt.file.exists('.csscomb.json')) {
			userConfig = grunt.file.readJSON('.csscomb.json');
		}

		config = _.extend(config, userConfig, options);
		config = _.pick(config, configKeys);

		comb.configure(config);

		this.files.forEach(function(f) {
			var contents, combed;

			// Read and combine source files into the 'contents' var.
			contents = f.src.filter(function(filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function(filepath) {
				return grunt.file.read(filepath).trim();
			}).join('\n\n');

			combed = comb.processString(contents);

			// Add two newlines after curly braces.
			combed = combed.replace(/}\s+?(\t)?/g, '}\n\n$1');
			// Add newlines around comment blocks.
			combed = combed.replace(/}\s*\/\*/g, '}\n\n\n/*');
			combed = combed.replace(/(-| )\*\/\s+/g, '$1*/\n\n');
			// Fix indentation of multiple selectors in a media query.
			combed = combed.replace(/,[\n\r]+  \./g, ',\n\t.');
			// Add EOF newline.
			combed = combed.trim() + '\n';

			grunt.file.write(f.dest, combed);
		});
	});

};
