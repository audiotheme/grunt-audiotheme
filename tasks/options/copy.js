module.exports = {
	build: {
		files: [
			{
				src: [
					'**',
					'!docs/**',
					'!node_modules/**',
					'!release/**',
					'!.csscomb.json',
					'!.jshintrc',
					'!config.json',
					'!config-sample.json',
					'!Gruntfile.js',
					'!package.json',
					'!README.md',
					'!todos.txt'
				],
				dest: 'release/<%= name %>',
				expand: true
			}
		]
	}
}
