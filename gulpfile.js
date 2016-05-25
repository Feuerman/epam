'use strict';

var gulp ;
var watch;
var prefixer;
var uglify;
var sass;
var sourcemaps;
var jade;
var cssmin;
var imagemin;
var pngquant;
var rimraf;
var browserSync;
var reload;

gulp = require('gulp');
watch = require('gulp-watch');
prefixer = require('gulp-autoprefixer');
uglify = require('gulp-uglify');
sass = require('gulp-sass');
sourcemaps = require('gulp-sourcemaps');
jade = require('gulp-jade');
cssmin = require('gulp-minify-css');
imagemin = require('gulp-imagemin');
pngquant = require('imagemin-pngquant');
rimraf = require('rimraf');
browserSync = require("browser-sync");
reload = browserSync.reload;

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        jade: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        jade: 'src/*.jade', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/**/*.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/style/main.scss',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        jade: 'src/**/*.jade',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};


var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('jade', function() {
    gulp.src(['src/*.jade', '!src/_*.jade'])
        .pipe(jade({
            pretty: true
        }))  // Собираем Jade только в папке ./assets/template/ исключая файлы с _*
        .on('error', console.log) // Если есть ошибки, выводим и продолжаем
    .pipe(gulp.dest(path.build.jade)) // Записываем собранные файлы
    .pipe(reload({stream: true})); // даем команду на перезагрузку страницы
}); 

gulp.task('jsbuild', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('stylebuild', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        //.pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        //.pipe(cssmin()) //Сожмем
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

gulp.task('imagebuild', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        // .pipe(imagemin({ //Сожмем их
        //     progressive: true,
        //     svgoPlugins: [{removeViewBox: false}],
        //     use: [pngquant()],
        //     interlaced: true
        // }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('fontsbuild', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});


gulp.task('build', [
    'jade',
    'jsbuild',
    'stylebuild',
    'fontsbuild'
]);

gulp.task('watch', function(){
    watch([path.watch.jade], function () {
        gulp.start('jade');
    });
    watch([path.watch.style], function() {
        gulp.start('stylebuild');
    });
    watch([path.watch.js], function() {
        gulp.start('jsbuild');
    });
    watch([path.watch.img], function() {
        gulp.start('imagebuild');
    });
    watch([path.watch.fonts], function() {
        gulp.start('fontsbuild');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);