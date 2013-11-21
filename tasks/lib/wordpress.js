/*
 * grunt-audiotheme
 * http://audiotheme.com/
 *
 * Copyright (c) 2013 AudioTheme, LLC
 * Licensed under the MIT license.
 */

'use strict';

exports.init = function(grunt) {
	var exports = {};

	/**
	 * Get the value of a header in a theme's style sheet.
	 */
	exports.getHeader = function(name) {
		var file = 'style.css',
			matches, pattern;

		if (grunt.file.exists(file)) {
			pattern = new RegExp(name + ':(.*)$', 'mi');
			matches = grunt.file.read(file).match(pattern);

			if (matches) {
				return matches.pop().trim();
			}
		}

		return false;
	};

	return exports;
};
