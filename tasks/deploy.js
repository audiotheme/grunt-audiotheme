/*
 * grunt-audiotheme
 * http://audiotheme.com/
 *
 * Copyright (c) 2014 AudioTheme, LLC
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function( grunt ) {

	var pkg = grunt.file.readJSON( 'package.json' ),
		util = require('./lib/util').init( grunt ),
		userConfig = util.getUserConfig()

	grunt.registerTask( 'deploy', function() {
		var data,
			cmd = [];

		data = {
			demoPath: userConfig.production.demoPath.replace( /\/+$/, '' ),
			deployPath: userConfig.production.deployPath,
			deployTime: grunt.template.today( 'UTC:yyyy-mm-dd-HHMMss' ),
			name: pkg.name,
			zipFile: pkg.name + '-' + pkg.version + '.zip'
		};

		// Make sure the zip file exists.
		if ( ! grunt.file.exists( 'release/' + data.zipFile ) ) {
			grunt.fail.fatal( 'release/' + data.zipFile + ' does not exist. Run a build before deploying.' );
		}

		// Set the task to upload the zip file.
		grunt.config( 'sftp.demo', {
			options: {
				config: 'production',
				path: data.deployPath,
				srcBasePath: 'release/'
			},
			files: {
				'./': 'release/' + data.zipFile
			}
		});

		// Build the commands for performing a deploy.
		cmd.push( 'cd <%= deployPath %>' );
		cmd.push( 'unzip -q <%= zipFile %>' );
		cmd.push( 'mv <%= name %> <%= deployTime %>' );
		cmd.push( 'rm <%= zipFile %>' );

		// @link http://blog.endpoint.com/2009/09/using-ln-sf-to-replace-symlink-to.html
		cmd.push( 'ln -sn <%= deployPath %><%= deployTime %> <%= demoPath %>-temp' );
		cmd.push( 'mv -T <%= demoPath %>-temp <%= demoPath %>' );
		cmd.push( 'ls -l <%= demoPath %>' );

		// Only keep the last 5 deployments.
		cmd.push( 'rm -rf `ls -r | tail -n +6`' );

		// Combine and process the commands.
		cmd = grunt.template.process( cmd.join( ' && ' ), { data: data });

		// Set the task to process the zip file.
		grunt.config( 'sshexec.demo', {
			options: {
				config: 'production'
			},
			command: cmd
		});

		// Run the tasks.
		grunt.task.run([ 'sftp:demo', 'sshexec:demo' ]);
	});

};
