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
		pkg = grunt.file.readJSON('package.json');

	// Mix in non-conflict string functions to Underscore namespace.
	_.str = require('underscore.string');
	_.mixin(_.str.exports());

	/**
	 * Generate documentation using ApiGen.
	 *
	 * @link http://apigen.org
	 */
	grunt.registerTask('audiotheme-apigen', function() {
		var args = [],
			options;

		options = _.extend({
			args: {
				source: '.',
				destination: 'docs',
				exclude: '*/.git*,*/docs/*,*/node_modules/*,*/release/*',
				title: _.capitalize(pkg.name) + ' Documentation',
				main: _.capitalize(pkg.name),
				report: ''
			}
		}, grunt.config.get('audiotheme.apigen.options.args'));

		options.args.report = options.args.report || options.args.destination + '/_report.xml';

		_.each(options.args, function(value, key) {
			args.push('--' + key + '=' + value);
		});

		grunt.util.spawn({
			cmd: 'apigen',
			args: args,
			opts: { stdio: 'inherit' }
		}, this.async());
	});

};
