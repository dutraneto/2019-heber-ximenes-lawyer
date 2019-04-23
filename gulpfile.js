const { src, dest, series, watch, task, parallel } = require('gulp');
const del = require('del');
// const browserSync = require('browser-sync').create();
const liveServer = require('gulp-live-server');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const { pipeline } = require('readable-stream');
const pump = require('pump');
const smushit = require('gulp-smushit');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

// compile SASS Explicit
sass.compiler = require('node-sass');

// paths
const path = {
  root: '/',
  source: 'src',
  dist: 'dist',
  allFiles: 'src/**/*.*',
  sass: 'src/sass/**/*.*',
  port: 4000
};

const serve = (
  source = path.source ? path.source : path.dist,
  port = path.port
) => {
  let server = liveServer.static(source, port);
  server.start();
  watch(path.allFiles).on('change', server.start.bind(server));
};
task('serve', () => serve());

// Minimize JS
const buildJS = () => {
  return pipeline(
    src(`${path.source}/assets/js/*`),
    uglify({
      warnings: true,
      compress: true
    }),
    dest(`${path.dist}/assets/js/`)
  );
};
task('build-js', buildJS);

// Copy files to dist
const buildCopy = () => {
  let sourceFiles = [
    path.allFiles,
    `!${path.sass}`,
    '!./src/assets/img/*',
    '!./src/assets/js/*',
    '!src/*.html'
  ];
  return src(sourceFiles).pipe(dest(`${path.dist}/`));
};
task('build-copy', buildCopy);

// Minify CSS and ADD vendor prefix
const buildSASS = () => {
  return src(`${path.sass}`)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'compressed'
      })
    )
    .on('error', sass.logError)
    .pipe(
      autoprefixer({
        browsers: ['last 5 versions']
      })
    )
    .pipe(sourcemaps.write('./maps'))
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(dest('src/assets/css'));
};
task('build-sass', buildSASS);

// watch sass
const watchSASS = () =>
  watch([`${path.sass}`, 'src/*.html'], series('build-html', 'build-sass'));
task('watch:sass', watchSASS);

// Optimize images
const buildIMG = () => {
  return src('src/assets/img/*')
    .pipe(smushit())
    .pipe(dest('dist/assets/img'));
};
task('build-img', buildIMG);

// Clean dist and tmp
const buildClean = () => {
  return del([`${path.dist}`, 'tmp/**/*']);
};
task('build-clean', buildClean);

// Minify HTML
task('build-html', () => {
  return src('src/*.html')
    .pipe(
      htmlmin({
        removeComments: true,
        collapseWhitespace: true
      })
    )
    .pipe(dest('dist'));
});

// Build
const buildAll = series(
  'build-clean',
  'build-copy',
  'build-sass',
  'build-js',
  'build-html',
  'build-img'
);
task('buildAll', buildAll);

// Run Default
task('default', series('watch:sass'));
