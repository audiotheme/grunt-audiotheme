module.exports = {
	options: {
		textdomain: '<%= name %>'
	},
	build: {
		options: {
			updateDomains: ['cedaro-theme']
		},
		files: [
			{
				src: [
					'includes/vendor/cedaro-theme/*.php',
					'includes/vendor/cedaro-theme/**/*.php'
				]
			}
		]
	}
}
