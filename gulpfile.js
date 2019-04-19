const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const pump = require('pump');
const smushit = require('gulp-smushit');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps')

// Static Server
gulp.task('serve', serve);

function serve() {
    browserSync.init({
        server: "./src"
    });

    gulp.watch("src/**/*.*").on('change', browserSync.reload);
};

// Minimize JS
gulp.task('build-js', buildJs);

function buildJs(cb) {
    pump([
            gulp.src('src/assets/js/*'),
            uglify(),
            gulp.dest('dist/assets/js/')
        ],
        cb
    );
};

// Copy files to dist
gulp.task('build-copy', buildCopy);

function buildCopy() {
    return gulp.src('src/**/*')
        .pipe(gulp.dest('dist/'));
};

// Minify CSS and ADD vendor prefix
gulp.task('build-sass', buildSASS);

function buildSASS() {
    return gulp.src('src/assets/sass/*.*')
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'compressed'
    }))
    .on('error', sass.logError)
    .pipe(autoprefixer({
        browsers: ['last 3 versions'],
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('dist/assets/css'));
};

// Optimize images
gulp.task('build-img', buildIMG);

function buildIMG() {
    return gulp.src('src/assets/img/*')
        .pipe(smushit())
        .pipe(gulp.dest('dist/assets/img'))
};

// Serve dist files
gulp.task('build-serve', buildServe);

function buildServe() {
    browserSync.init({
        server: "./dist"
    })
};

// Clean dist and tmp
gulp.task('build-clean', buildClean);

function buildClean() {
    return del([
        'dist/**/*',
        'tmp/**/*'
    ]);
};

// Minify XHTML
gulp.task('build-html', () => {
    return gulp.src('src/*.html')
      .pipe(htmlmin({ removeComments: true, collapseWhitespace: true }))
      .pipe(gulp.dest('dist'));
  });

// Build
gulp.task('build', gulp.series('build-clean', 'build-copy', 'build-sass','build-js','build-html','build-img','build-serve'));

// Run Default
gulp.task('default', serve);