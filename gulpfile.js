//Include gulp, and launch the task loader
var gulp = require('gulp');

//Manage CLI flags
var args = require('yargs').argv;

//Get all the other module dependencies
var bourbon = require('node-bourbon');
var debug = require('gulp-debug');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var watch = require('gulp-watch');



//Error handling
function handleError (err) {
	console.log(err.toString());
	//process.exit(-1);
	this.emit('end');
}



//Process SCSS
gulp.task('scss', function(){
	return gulp.src('./app/scss/style.scss')
		.pipe(sass({
			includePaths: bourbon.includePaths
		})).on('error', handleError)
		.pipe(gulp.dest('./app/css'))
});



//Lint the JS
gulp.task('lint', function () {
	return gulp.src(['./app/js/**/*.js'])
		.pipe(jshint({
			expr: true,
			multistr: true
		})).on('error', handleError)
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});



//Load gulp watchers
gulp.task('watch', function(){
	var cssWatcher = watch('./app/scss/**/*(*.sass|*.scss)', function(){
		gulp.start('scss', function(){
			console.log('Style bundle updated');
		});
	});

	var jsWatcher = gulp.watch('./app/js/**/*.js', function(){
		gulp.start('lint', function(){
			console.log('Javascript linted');
		});
	});
});