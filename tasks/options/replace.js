module.exports = {
	styleVersion: {
		src: [
			'assets/**/*(style|wpcom).less'
		],
		overwrite: true,
		replacements: [
			{
				from: /Version:.*$/m,
				to: 'Version: <%= version %>'
			}
		]
	},
	functionsVersion: {
		src: [
			'functions.php'
		],
		overwrite: true,
		replacements: [
			{
				from: /return '\d+\.\d+\.\d+/g,
				to: "return '<%= version %>"
			}
		]
	},
	sinceVersions: {
		src: [
			'*.php',
			'**/*.php',
			'!docs/**',
			'!node_modules/**',
			'!release/**'
		],
		overwrite: true,
		replacements: [
			{
				from: /@since x\.x\.x/g,
				to: '@since <%= version %>'
			}
		]
	}
}
