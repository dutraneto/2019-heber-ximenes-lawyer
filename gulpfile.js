const { src, dest, series, watch, task, parallel } = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const { pipeline } = require('readable-stream');
const smushit = require('gulp-smushit');
const autoprefixer = require('autoprefixer');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber')
const postcss = require('gulp-postcss')
const cssnano = require('cssnano')

// compile SASS Explicit
sass.compiler = require('node-sass');

// paths
const path = {
  root: '/',
  source: 'src/',
  dist: 'dist/',
  allFiles: 'src/**/*.*',
  sass: 'src/sass/**/*.scss',
  port: 4000
};

const serve = (source=path.source ? path.source : path.dist, port=path.port) => {
  browserSync.init({
    browser: "firefox developer edition",
    watch: true,
    server: {
      baseDir: source
    },
    port: port
  })
  watch(path.sass).on('change', series('build:css', browserSync.reload))
  watch('./src/*.html').on('change', series('build-html', browserSync.reload));
};
task('serve', () => serve(path.source, 5000));

// Minimize JS
const buildJS = () => {
  return pipeline(
    src(`${path.source}assets/js/*`),
    uglify({
      warnings: true,
      compress: true
    }),
    dest(`${path.dist}assets/js/`)
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
    '!src/*.html',
  ];
  return src(sourceFiles).pipe(dest(`${path.dist}`));
};
task('build-copy', buildCopy);

// Minify CSS and ADD vendor prefix
const css = () => {
  let postcssPlugins = [
    autoprefixer({
      grid: true,
      browsers: ['last 3 versions', "ie 6-8", 'Firefox > 20']}),
    cssnano()
  ]
  return src(`${path.sass}`)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' }))
    .on('error', sass.logError)
    .pipe(postcss(postcssPlugins))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest('src/assets/css/'))
    .pipe(browserSync.stream())
};
task('build:css', css);

// watch sass
const watchFiles = () => {

}
task('watchFiles', () => watchFiles())

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

const delCSS = () => {
  return del(['src/assets/css/*.min.css']);
};
task('del-css', delCSS);

// Minify HTML
task('build-html', () => {
  return src('src/*.html')
    .pipe(
      htmlmin({
        removeComments: true,
        collapseWhitespace: true
      })
    )
    .pipe(dest(`${path.dist}`));
});

// Build
const buildAll = series(
  'build-clean',
  'build:css',
  'build-copy',
  'build-js',
  'build-html',
  'build-img'
);
task('buildAll', buildAll);

