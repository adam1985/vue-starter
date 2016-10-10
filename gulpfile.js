const gulp = require('gulp');
const path = require('path');
const runSequence = require('run-sequence');
const cdnImage = require('@q/gulp-cdn-image');
const cdnStatic = require('@q/gulp-cdn-static');
const template = require('gulp-template');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const releasePath = __dirname + '/dist';
const distAbsolutePath = __dirname + '/dist/static/';

const PRJ_ROOT = path.normalize(__dirname);
const PKG = require('./package.json');
const USER = process.env.USER;
const DOMAIN = PKG.domain;

// 生成nginx配置
gulp.task('ngx',  () => {

    let data = {
        USER: USER,
        DOMAIN: DOMAIN,
        PRJ_ROOT: PRJ_ROOT
    };

    return gulp.src(PRJ_ROOT + '/options/conf/*.conf')
        .pipe(template(data))
        .pipe(gulpif("*.conf", rename({
            prefix: data.USER + '_'
        })))
        .pipe(gulp.dest(PRJ_ROOT + '/options/used'));

});

gulp.task('cdn_img', () => {
	return gulp.src([releasePath + '/**', '!' + releasePath + '/static/{images,img,fonts}/**', '!' + releasePath + '/**/*.{swf,map}'])
		.pipe(cdnImage({
			notCssTypeExts: ['.html', '.js', '.php'],
			relativePath: distAbsolutePath
		}))
		.pipe(gulp.dest(releasePath));
});

gulp.task('cdn_html', () => {
	return gulp.src(releasePath + '/**/*.{html,php}')
		.pipe(cdnStatic({
			relativePath: distAbsolutePath,
			exts: ['.html', '.php']
		}))
		.pipe(gulp.dest(releasePath));
});

//发布任务
gulp.task('deploy', () => {
	return runSequence('cdn_img','cdn_html',
		() => {
			console.log('发布完成！');
		}
	);
});
