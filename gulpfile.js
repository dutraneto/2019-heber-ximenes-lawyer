const gulp = require('gulp');
const del = require('del');
// const browserSync = require('browser-sync').create();
const liveServer = require('gulp-live-server');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const pump = require('pump');
const smushit = require('gulp-smushit');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps')

// compile SASS Explicit
sass.compiler = require('node-sass')

// Static Server
gulp.task('serve', serve);

function serve() {
    let server = liveServer.static('/src', 8888);
    server.start();

    gulp.watch("src/**/*.*").on('change', server.start.bind(server));

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
    const sourceFiles = ['./src/**/*.*', '!./src/sass/**/*.*'];
    return gulp.src(sourceFiles)
        .pipe(gulp.dest('dist/'));
};

// Minify CSS and ADD vendor prefix
gulp.task('build-sass', buildSASS);

function buildSASS() {
    return gulp.src('src/sass/**/*.scss')
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
    .pipe(gulp.dest('src/assets/css'));
};

gulp.task('sass:watch', function () {
    gulp.watch(['src/sass/**/*.*', 'src/*.html'], gulp.series('build-sass'));
  });

// Optimize images
gulp.task('build-img', buildIMG);

function buildIMG() {
    return gulp.src('src/assets/img/*')
        .pipe(smushit())
        .pipe(gulp.dest('dist/assets/img'))
};

// Serve dist files
// gulp.task('build-serve', buildServe);

// function buildServe() {
//     browserSync.init({
//         server: "./dist"
//     })
// };

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
gulp.task('build', gulp.series('build-clean', 'build-sass','build-js','build-html','build-img', 'build-copy'));

// Run Default
gulp.task('default', serve);