'use strict';
var path = require( 'path' );
var childProcess = require( 'child_process' );
var gutil = require( 'gulp-util' );
var chalk = require( 'chalk' );
var through = require( 'through2' );
var phantomjs = require( 'phantomjs' );
var binPath = phantomjs.path;
var fs = require( 'fs' );

module.exports = function( oOptions ) {
	return through.obj( function( file, enc, cb ) {
		var absolutePath = path.resolve( file.path );
		var isAbsolutePath = absolutePath.indexOf( file.path ) >= 0;

		var iIndex = file.path.lastIndexOf( '\\' );
		var sNewFileName = "junit-" + file.path.slice( iIndex + 1 ).replace( ".html", ".xml" );

		var childArgs = [
			path.join( __dirname, 'runner.js' ),
			(isAbsolutePath ? 'file:///' + absolutePath.replace( /\\/g, '/' ) : file.path)
		];

		if( file.isStream() ) {
			this.emit( 'error', new gutil.PluginError( 'gulp-qunit', 'Streaming not supported' ) );
			return cb();
		}

		childProcess.execFile( binPath, childArgs, function( err, stdout, stderr ) {
			var wrWriteStream = fs.createWriteStream('.\\reports\\' +sNewFileName);
			gutil.log( 'Testing ' + file.relative );

			if( stdout ) {
				stdout = stdout.trim(); // Trim trailing cr-lf
				gutil.log( stdout );
				wrWriteStream.write(stdout);
			}

			if( stderr ) {
				gutil.log( "eeeeee: " + stderr );
				//this.emit( 'error', new gutil.PluginError( 'gulp-qunit', stderr ) );
			}

			if( err ) {
				gutil.log( 'gulp-qunit: ' + chalk.red( '✖ ' ) + 'QUnit assertions failed in ' + chalk.blue( file.relative ) );
				//this.emit( 'error', new gutil.PluginError( 'gulp-qunit', err ) );
			}

			this.push( file );

			return cb();
		}.bind( this ) );
	} );
};
