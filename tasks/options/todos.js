module.exports = {
	audiotheme: {
		options: {
			priorities: {
				low: /@todo|TODO/
			},
			verbose: false
		},
		src: [
			'**/*.{js,less,php}',
			'!docs/**',
			'!languages/**',
			'!node_modules/**',
			'!release/**',
			'!Gruntfile.js',
			'!package.json',
			'!README.md',
			'!todos.txt'
		],
		dest: 'todos.txt'
	}
}
