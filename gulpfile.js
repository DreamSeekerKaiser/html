/* Needed gulp config */

const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const minifycss = require('gulp-minify-css');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

/* Setup scss path */
const paths = {
    scss: './sass/*.scss'
};

/* Scripts task */
gulp.task('scripts', function () {
    return gulp.src([
        /* Add your JS files here, they will be combined in this order */
        'js/vendor/jquery.min.js',
        'js/vendor/jquery.easing.1.3.js',
        'js/vendor/jquery.stellar.min.js',
        'js/vendor/jquery.flexslider-min.js',
        'js/vendor/imagesloaded.pkgd.min.js',
        'js/vendor/isotope.pkgd.min.js',
        'js/vendor/jquery.timepicker.min.js',
        'js/vendor/bootstrap-datepicker.js',
        'js/vendor/photoswipe.min.js',
        'js/vendor/photoswipe-ui-default.min.js',
        'js/vendor/owl.carousel.min.js',
        'js/vendor/bootstrap.min.js',
        'js/vendor/jquery.waypoints.min.js'
    ])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});

function minify_custom() {
    return gulp.src([
        /* Add your JS files here, they will be combined in this order */
        'js/custom.js'
    ])
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
};

/* Sass task */
async function on_sass() {
    gulp.src('scss/style.scss')
        .pipe(plumber())
        .pipe(sass({
            errLogToConsole: true,

            //outputStyle: 'compressed',
            // outputStyle: 'compact',
            // outputStyle: 'nested',
            outputStyle: 'expanded',
            precision: 10
        }))

        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('css'))

        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('css'))
        /* Reload the browser CSS after every change */
        .pipe(reload({stream: true}));
};

gulp.task('merge-styles', function () {

    return gulp.src([
        'css/vendor/bootstrap.min.css',
        'css/vendor/animate.css',
        'css/vendor/icomoon.css',
        'css/vendor/flexslider.css',
        'css/vendor/owl.carousel.min.css',
        'css/vendor/owl.theme.default.min.css',
        'css/vendor/photoswipe.css',
        'css/vendor/jquery.timepicker.css',
        'css/vendor/bootstrap-datepicker.css',
        'css/vendor/default-skin.css',
        'fonts/icomoon/style.css',
    ])
        // .pipe(sourcemaps.init())
        // .pipe(autoprefixer({
        //     browsers: ['last 2 versions'],
        //     cascade: false
        // }))
        .pipe(concat('styles-merged.css'))
        .pipe(gulp.dest('css'))
        // .pipe(rename({suffix: '.min'}))
        // .pipe(minifycss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css'))
        .pipe(reload({stream: true}));
});

/* Reload task */
gulp.task('bs-reload', function () {
    browserSync.reload();
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', function () {
    browserSync.init(['css/*.css', 'js/*.js'], {

        // proxy: 'localhost/probootstrap/resto'
        /* For a static server you would use this: */

        server: {
            baseDir: './'
        },
        files: ['*.html', 'css/*.css'],

    });
});

/*
watcher
 */
function watcher() {
    /* Watch scss, run the sass task on change. */
    gulp.watch(['scss/*.scss', 'scss/**/*.scss'], gulp.series(on_sass))
    /* Watch app.js file, run the scripts task on change. */
    gulp.watch(['js/custom.js'], gulp.series(minify_custom))
    /* Watch .html files, run the bs-reload task on change. */
    // gulp.watch(['*.html'], gulp.series('bs-reload'));
}

exports.watcher = watcher();

/* Watch scss, js and html files, doing different things with each. */
gulp.task('default', gulp.series(on_sass, 'scripts', 'browser-sync', watcher));
