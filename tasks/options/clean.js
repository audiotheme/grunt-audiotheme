module.exports = {
	build: {
		src: 'release/<%= name %>',
	},
	buildwpcom: {
		options: {
			force: true
		},
		src: [
			'../<%= name %>-wpcom/*',
			'!../<%= name %>-wpcom/.svn'
		]
	}
}
