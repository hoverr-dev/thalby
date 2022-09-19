const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const ttf2woff2 = require('gulp-ttf2woff2');
const fileinclude = require('gulp-file-include');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const webpackStream = require('webpack-stream');
const browserSync = require('browser-sync').create();

//Dev

let isProd = false; // dev by default

const fonts = () => {
  src('./src/fonts/**.ttf')
    .pipe(ttf2woff2())
    .pipe(dest('./build/fonts/'))
}

const htmlMinify = () => {
  return src('build/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('build'))
}

const htmlInclude = () => {
  return src('src/*.html')
    .pipe(fileinclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(dest('build'))
    .pipe(browserSync.stream());
}

const styles = () => {
  return src('src/scss/**/*.scss')
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 5 versions'],
      grid: true,
      cascade: false
    }))
    .pipe(dest('src/css'))
    .pipe(dest('build/css'))
    .pipe(browserSync.stream());
}

const scripts = () => {
  return src([
    'src/js/main.js'
  ])
    .pipe(webpackStream({
      mode: isProd ? 'production' : 'development',
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ]
            }
          }
        }]
      },
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(dest('build/js'))
    .pipe(browserSync.stream());

}


const images = () => {
  return src([`src/img/**/**.{jpg,jpeg,png,svg}`])
    .pipe(dest('build/img'))
}

const svgSprites = () => {
  return src('src/img/svg/**.svg')
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[style]').removeAttr('style');
        },
        parserOptions: {
          xmlMode: true
        },
      })
    )
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      },
    }))
    .pipe(dest('build/img/svg'))
}

const resources = () => {
  return src('src/**/*.mp4')
    .pipe(dest('build'))
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'build/'
    },
    notify: false,
    browser: 'chrome'
  });
  watch(['src/scss/**/*.scss', 'src/**/*.scss'], styles)
  watch(['src/**/*.html'], htmlInclude)
  watch('src/fonts/**.ttf', fonts)
  watch('src/img/**/**.{jpg,jpeg,png,svg}', images)
  watch('src/img/svg/**.svg', svgSprites)
  watch('src/**/*.mp4', resources)
  watch(['src/js/**/*.js', '!src/js/main.min.js'], scripts)
  watch(['src/**/*.html']).on('change', browserSync.reload)
}

//Build

const build = () => {
  return src([
    'src/*.html',
    'src/css/style.min.css',
    'src/fonts/',
    'src/img/**/*',
    'src/**/*.mp4',
  ], { base: 'src' })
    .pipe(dest('build'))
}

const buildImages = () => {
  return src(['src/img/**/*', 'src/img/svg/**.svg'])
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(dest('build/img'))
}

const cleanDist = () => {
  return del('build')
}

exports.default = parallel(htmlInclude, fonts, images, styles, scripts, svgSprites, resources, watchFiles)
exports.build = series(cleanDist, fonts, build, htmlInclude, buildImages, svgSprites, htmlMinify, scripts)

