'use strict';
// Include Packages
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    fileinclude = require('gulp-file-include'),
    concat = require('gulp-concat'),
    server = require('gulp-webserver'),
    uglify = require('gulp-uglify');


// npm install gulp gulp-sass gulp-autoprefixer gulp-clean-css gulp-rename gulp-sourcemaps gulp-concat gulp-uglify gulp-webserver gulp-file-include

// Convert sass file to css123
gulp.task('sass', function () {
    return gulp.src('main/style/**/*.sass')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: [
                "last 15 version",
                "> 1%",
                "IE 10"
            ],
        }))
        .pipe(cleanCSS({format: 'keep-breaks'}))
        .pipe(rename('style.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('../prod/style/css'));
});

// Compress js
gulp.task('compress-js',function () {
    return gulp.src('main/script/js/main.js')
    // .pipe(concat('scripts.min.js'))
        .pipe(rename('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('../prod/script/js'));
});

// File include
gulp.task('file-include',function(done) {
    // есди используем шаблонную верстку анадлогично include в php
    gulp.src(['main/*.html'])// прописываем путь к отслеживаемым файлам .js
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('../prod'));
    done();
});

//Localhost
gulp.task('server', function() {
    gulp.src('../prod/')	// <-- your app folder
        .pipe(server({
            livereload: false,
            open: true,
            port: 8800	// set a port to avoid conflicts with other local apps
        }));
});

//Watch
gulp.task('watch', function(){
    gulp.watch('main/style/**/*.sass', gulp.series('sass'));
    gulp.watch('main/script/js/*.js', gulp.series('compress-js'));
    gulp.watch('main/**/*.html', gulp.series('file-include'));
    gulp.watch('main/template/**/*.html', gulp.series('file-include'));
    gulp.watch('../prod/', gulp.series('server'));
});

//Default
gulp.task('default', gulp.series('watch'));