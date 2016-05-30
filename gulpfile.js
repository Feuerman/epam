'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    jade = require('gulp-jade'),
    cssmin = require('gulp-minify-css'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    concat = require("gulp-concat"),
    reload = browserSync.reload;

var path = {
    build: {
        jadeIndex: './',
        jadeTemplates: 'build/templates/',
        js: 'build/js/',
        css: 'build/css/'
    },
    src: {
        jadeIndex: 'src/index.jade',
        jadeTemplates: 'src/templates/*.jade',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.less'
    },
    watch: {
        jadeIndex: 'src/index.jade',
        jadeTemplates: 'src/templates/*.jade',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.less'
    },
    clean: './build'
};


var config = {
    server: {
        baseDir: "./"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "epam-test"
};

gulp.task('jadeIndex', function() {
    gulp.src(path.src.jadeIndex)
        .pipe(jade({
            pretty: true
        }))
        .on('error', console.log)
    .pipe(gulp.dest(path.build.jadeIndex))
    .pipe(reload({stream: true}));
});

gulp.task('jadeTemplates', function() {
    gulp.src(path.src.jadeTemplates)
        .pipe(jade({
            pretty: true
        }))
        .on('error', console.log)
    .pipe(gulp.dest(path.build.jadeTemplates))
    .pipe(reload({stream: true}));
});

gulp.task('jsbuild', function () {
    gulp.src(path.src.js)
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('stylebuild', function () {
    gulp.src(path.src.style)
        .pipe(less())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});


gulp.task('build', [
    'jadeIndex',
    'jadeTemplates',
    'jsbuild',
    'stylebuild'
]);

gulp.task('watch', function(){
    watch([path.watch.jadeIndex], function () {
        gulp.start('jadeIndex');
    });
    watch([path.watch.jadeTemplates], function () {
        gulp.start('jadeTemplates');
    });
    watch([path.watch.style], function() {
        gulp.start('stylebuild');
    });
    watch([path.watch.js], function() {
        gulp.start('jsbuild');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);