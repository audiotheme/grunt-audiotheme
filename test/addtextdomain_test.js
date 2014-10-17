'use strict';

var grunt = require( 'grunt' );

/*
======== A Handy Little Nodeunit Reference ========
https://github.com/caolan/nodeunit

Test methods:
	test.expect( numAssertions )
	test.done()
Test assertions:
	test.ok( value, [message])
	test.equal( actual, expected, [message])
	test.notEqual( actual, expected, [message])
	test.deepEqual( actual, expected, [message])
	test.notDeepEqual( actual, expected, [message])
	test.strictEqual( actual, expected, [message])
	test.notStrictEqual( actual, expected, [message])
	test.throws( block, [error], [message])
	test.doesNotThrow( block, [error], [message])
	test.ifError( value )
*/

exports.addtextdomain = {
	setUp: function( done ) {
		done();
	},

	build: function( test ) {
		test.expect( 2 );
		
		var fileContents = grunt.file.read( 'tmp/theme/includes/vendor/cedaro-theme/cedaro-theme.php' );
		test.equal( fileContents.indexOf( 'cedaro-theme' ), -1, "the 'cedaro-theme' text domain should have been updated" );
		
		var fileContents = grunt.file.read( 'tmp/theme/includes/vendor/class-audiotheme-themenotice.php' );
		test.notEqual( fileContents.indexOf( "__( 'Dismiss', 'grunt-audiotheme' )" ), -1, "the 'grunt-audiotheme' text domain should have been added" );

		test.done();
	},
};
