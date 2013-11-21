/*
 * grunt-audiotheme
 * http://audiotheme.com/
 *
 * Copyright (c) 2013 AudioTheme, LLC
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore'),
	async = require('async'),
	fs = require('fs'),
	path = require('path');

exports.init = function(grunt) {
	var exports = {};

	/**
	 * Merge two objects. Values in obj2 should replace values in obj1
	 * (including arrays).
	 *
	 * @todo Test this some more
	 */
	function mergeObjects(obj1, obj2) {
		var prop;

		for (prop in obj2) {
			if (prop in obj1 && _.isObject(obj2[prop]) && _.isObject(obj1) && ! _.isArray(obj2[prop])) {
				mergeObjects(obj1[prop], obj2[prop]);
			} else {
				obj1[prop] = obj2[prop];
			}
		}

		return obj1;
	}

	/**
	 * Get the targets within a task object in the main Gruntfile.js config.
	 */
	exports.getTargets = function(task) {
		// Get an array of sub-property keys under the given config object.
		var targets = Object.keys(grunt.config.getRaw(task) || {});

		// Return early if there are no actual properties to iterate over.
		if (0 === targets.length) {
			return [];
		}

		// Filter to a list of valid targets.
		return targets.filter(exports.isValidMultiTaskTarget);
	};

	/**
	 * Load user options from config.json the project root.
	 *
	 * The config.json contains sensitive data and should not be included in
	 * version control.
	 */
	exports.getUserConfig = function() {
		var userConfig = {};

		if (grunt.file.exists('config.json')) {
			userConfig = grunt.file.readJSON('config.json');
		}

		return userConfig;
	};

	/**
	 * Determine if a target is valid.
	 */
	exports.isValidMultiTaskTarget = function(target) {
		return !/^_|^options$/.test(target);
	};

	/**
	 * Get JSHint global or target-level options.
	 */
	exports.jshintOptions = function(target) {
		var defaults = exports.readJSON('../config/.jshintrc', __dirname),
			taskOptions = grunt.config.get('jshint.options') || {},
			targetOptions = {};

		// Retrieve global task options from .jshintrc.
		if (undefined !== taskOptions.jshintrc) {
			taskOptions = grunt.file.readJSON(taskOptions.jshintrc);
		}

		target = target || '';

		if ('' !== target) {
			targetOptions = grunt.config.get('jshint.' + target + '.options');
			targetOptions = targetOptions || {};

			// Merge target options with defaults if 'jshintrc' is defined for the target.
			if (undefined !== targetOptions.jshintrc) {
				targetOptions = grunt.file.readJSON(targetOptions.jshintrc);
				targetOptions = _.extend(defaults, targetOptions);
			}
		}

		return ('' === target) ? _.extend(defaults, taskOptions) : targetOptions;
	};

	/**
	 * Load a JSON file.
	 *
	 * Typically grunt.file.readJSON() or require() should be used, but for JSON
	 * files like .jshintrc that can't be loaded relative to Grunt's current
	 * working directory and don't have a .json extension for use with require(),
	 * this method can be used.
	 */
	exports.readJSON = function(file, from) {
		return JSON.parse(fs.readFileSync(path.resolve(from, file)));
	};

	/**
	 * Set default task options and targets.
	 *
	 * If options already exist for the task or target in the Gruntfile.js, this
	 * method attempts to merge the defaults rather than replace them.
	 */
	exports.setTaskDefaults = function(task, data) {
		var defaults = require('../options/' + task + '.js'),
			currentOptions = grunt.config.get(task) || {},
			options;

		// Merge defaults with currentOptions.
		options = mergeObjects(defaults, currentOptions);

		// Replace template placeholders with data.
		options = grunt.util.recurse(options, function(value) {
			// If the value is not a string, return it.
			if ('string' !== typeof value) {
				return value;
			}

			return grunt.template.process(value, { data: data });
		});

		grunt.config.set(task, options);
	};

	/**
	 * Replace a matched pattern in the specified files.
	 *
	 * Operates on files asynchronously, so a done callback should be passed to
	 * know when the method is done.
	 */
	exports.replaceInFiles = function(pattern, replacement, files, callback) {
		files = grunt.file.expandMapping(files, '');

		async.eachSeries(files, function(f, nextFileObj) {
			var files = f.src.filter(function(filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				}

				return true;
			});

			files.forEach(function(file) {
				var contents = grunt.file.read(file);

				contents = contents.replace(pattern, replacement);
				grunt.file.write(f.dest, contents);
			});

			nextFileObj();
		}, function(error, result) {
			callback(error, result);
		});
	};

	return exports;
};
