module.exports = {
	build: {
		options: {
			archive: '{{set at runtime to include version}}'
		},
		expand: true,
		cwd: 'release/<%= name %>/',
		src: ['**/*'],
		dest: '<%= name %>/',
	}
}
