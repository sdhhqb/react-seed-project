// less编译，使用方法: gulp lesswatch
var gulp = require('gulp');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

const exec = require('child_process').exec;
const zip = require('gulp-zip');
const del = require('del');
const BUILD = './build';
const pkg = require('./package.json');

gulp.task('less', function () {
	gulp.src('app/less/**/*.less')
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(cleanCSS())
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('build/css'));
});

gulp.task('lesswatch', function () {
	gulp.watch('app/less/**/*.less', ['less']);
});

gulp.task('build', function() {
	// gulp.src('./image/**/*')
	//     .pipe(gulp.dest(BUILD + '/image'));

	// gulp.src('./json/**/*')
	//     .pipe(gulp.dest(BUILD + '/json'));

	// gulp.src('./lib/**/*')
	//     .pipe(gulp.dest(BUILD + '/lib'));

	exec('cross-env NODE_ENV=production webpack', function(err, stdout, stderr) {
		if (err) {
			console.error(`Exec error: ${err}`);
			return;
		}

		console.log(`Stdout: ${stdout}`);
		console.log(`Stderr: ${stderr}`);
	});

	return 0;
});

gulp.task('zip', function() {
	const date = new Date();

	return gulp.src(BUILD + '/**/**')
		.pipe(zip(`${BUILD}_${pkg.version}_${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}.zip`))
		.pipe(gulp.dest('.'));
});
		
gulp.task('clean', function() {
	del(['build/css/**', 'build/js/**', 'build/index.html']).then(paths => {
		console.log('Deleted files and folders:\n', paths.join('\n'));
	});
});

gulp.task('default', ['less', 'lesswatch']);
