const gulp                 = require("gulp"),
      babel                = require("gulp-babel"),
      concat               = require("gulp-concat"),
      sourcemaps           = require('gulp-sourcemaps'),
      rename               = require('gulp-rename'),
      runSequence          = require('run-sequence'),
      browserify           = require('browserify'),
      babelify             = require('babelify'),
      buffer               = require('vinyl-buffer'),
      source               = require('vinyl-source-stream'),
      sass                 = require('gulp-sass'),
      autoprefixer         = require('gulp-autoprefixer'),
      del                  = require('del'),
      browserSync          = require('browser-sync').create();

require('babel-core');

// Browserify config
const b = browserify({
    entries : ['./src/js/bundle.js'],
    debug : true
})
.transform("babelify", {presets: ["env"]})


// Tasks
// 
// gulp.task('clean', () => {
//     return del('./dist/**/*').then(paths => {});
// })

gulp.task("js", () => {
    return b.bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("./dist/js"))
});

gulp.task('sass', ()=>{
    return gulp.src('./src/sass/main.sass')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('watch', () => {
    gulp.watch('./src/**/*.sass', ['sass']);
    gulp.watch('./src/**/*.js', ['js']);
});

gulp.task('default', (cb) => {
    runSequence('sass', 'js', 'browser-sync', 'watch', cb);
});
