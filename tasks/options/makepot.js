module.exports = {
	build: {
		options: {
			cwd: 'release/<%= name %>',
			exclude: ['.git/.*', 'node_modules/.*', 'release/.*'],
			potHeaders: {
				'report-msgid-bugs-to': 'http://audiotheme.com/support/',
				'language': 'en',
				'plural-forms': 'nplurals=2; plural=(n != 1);',
				'x-poedit-basepath': '../',
				'x-poedit-bookmarks': '',
				'x-poedit-country': 'United States',
				'x-poedit-keywordslist': '__;_e;__ngettext:1,2;_n:1,2;__ngettext_noop:1,2;_n_noop:1,2;_c;_nc:1,2;_x:1,2c;_ex:1,2c;_nx:4c,1,2;_nx_noop:4c,1,2;',
				'x-poedit-searchpath-0': '.',
				'x-poedit-sourcecharset': 'utf-8',
				'x-textdomain-support': 'yes'
			},
			type: 'wp-theme',
			updateTimestamp: false
		}
	}
}
