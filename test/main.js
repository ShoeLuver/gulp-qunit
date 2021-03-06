/* jshint node: true */
/* global describe, it */

'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var path = require('path');
var qunit = require('../index');
var out = process.stdout.write.bind(process.stdout);

var events = require('events')

describe('gulp-qunit', function() {
    it('tests should pass', function(cb) {
        this.timeout(5000);

        var stream = qunit();

        process.stdout.write = function (str) {
            //out(str);

            if (/10 passed. 0 failed./.test(str)) {
                assert(true);
                process.stdout.write = out;
                cb();
            }
        };

        stream.write(new gutil.File({
            path: './qunit/test-runner.html',
            contents: new Buffer('')
        }));

        stream.end();
    });

    it('tests should pass with absolute source paths', function(cb) {
        this.timeout(5000);

        var stream = qunit();

        process.stdout.write = function (str) {
            //out(str);

            if (/10 passed. 0 failed./.test(str)) {
                assert(true);
                process.stdout.write = out;
                cb();
            }
        };

        stream.write(new gutil.File({
            path: path.resolve('./qunit/test-runner.html'),
            contents: new Buffer('')
        }));

        stream.end();
    });

    it('tests should pass and emit finished event', function(cb) {
        this.timeout(5000);

        var stream = qunit();

        stream.on('gulp-qunit.finished', function(passed) {
            assert(true, 'phantom finished with errors');
        })

        process.stdout.write = function (str) {
            //out(str);

            if (/10 passed. 0 failed./.test(str)) {
                assert(true);
                process.stdout.write = out;
                cb();
            }
        };

        stream.write(new gutil.File({
            path: path.resolve('./qunit/test-runner.html'),
            contents: new Buffer('')
        }));

        stream.end();



    });
});
