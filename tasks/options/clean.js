module.exports = {
	build: {
		src: 'release/<%= name %>',
	},
	buildwporg: {
		options: {
			force: true
		},
		src: [
			'../<%= name %>-wporg'
		]
	},
	buildwpcom: {
		options: {
			force: true
		},
		src: [
			'../<%= name %>-wpcom/*',
			'!../<%= name %>-wpcom/.svn',
			'!../<%= name %>-wpcom/languages'
		]
	}
}
