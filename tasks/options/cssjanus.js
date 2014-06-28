module.exports = {
	audiotheme: {
		options: {
			swapLtrRtlInUrl: false
		},
		files: [
			{
				src: 'assets/css/editor-style.css',
				dest: 'assets/css/editor-style-rtl.css'
			},
			{
				src: 'style.css',
				dest: 'style-rtl.css'
			}
		]
	}
}
