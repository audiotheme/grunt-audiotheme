module.exports = {
	options: {
		textdomain: '<%= name %>'
	},
	build: {
		options: {
			updateDomains: ['cedaro-theme']
		},
		expand: true,
		src: [
			'includes/vendor/*.php',
			'includes/vendor/**/*.php'
		]
	}
}
