module.exports = {
	build: {
		options: {
			exclude: ['.git/.*', 'node_modules/.*', 'release/.*'],
			type: 'wp-theme',
			updateTimestamp: false
		}
	}
}
