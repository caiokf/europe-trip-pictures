var gulp = require('gulp');
var connect = require('gulp-connect');
var traceur = require('gulp-traceur');
var jade = require('gulp-jade');
var concat = require('gulp-concat');

gulp.task('connect', function(){
	connect.server({
		root: ['build'],
		host: '0.0.0.0',
		port: 8080
	})
});

gulp.task('templates', function() {
  gulp.src('./app/views/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./dist/views/'))
});

gulp.task('vendorjs', function () {
	return gulp.src([
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/classie/classie.js',
    'bower_components/imagesloaded/imagesloaded.pkgd.js',
    'bower_components/dynamics.js/lib/dynamics.min.js',
		'node_modules/traceur/bin/traceur-runtime.js',
		'node_modules/systemjs/dist/system-csp-production.src.js',
		'node_modules/reflect-metadata/Reflect.js',
		'node_modules/angular2/bundles/angular2.js'
	])
  .pipe(concat('vendor.js'))
	.pipe(gulp.dest('./dist'));
});

gulp.task('js', function () {
	return gulp.src([
    'app/js/libs/**/*.js',
    'app/js/index.js'
  ])
	.pipe(traceur({ modules: 'instantiate', annotations: true }))
  .pipe(concat('app.js'))
	.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['connect', 'templates', 'vendorjs', 'js']);
