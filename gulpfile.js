const gulp = require("gulp");
const cssDeclarationSorter = require("css-declaration-sorter");
const cssMqpacker = require("css-mqpacker");
const browserSync = require("browser-sync").create();
const $ = require("gulp-load-plugins")({
	pattern: ["*"],
	scope: ["devDependencies"],
});

const NODE_ENV = process.env.NODE_ENV || "development";

const paths = {
	styles: {
		src: "src/styles/style.scss",
		all: "src/styles/**/*.scss",
		build: "build/css",
	},
	php: {
		src: "index.php",
		all: "**/*.php",
	},
	js: {
		index: "src/js/script.js",
		all: "src/js/*.js",
		build: "build/js",
	}
};

function isMax(mq) {
	return /max-width/.test(mq);
}

function isMin(mq) {
	return /min-width/.test(mq);
}

function sortMediaQueries(a, b) {
	const A = a.replace(/\D/g, "");

	const B = b.replace(/\D/g, "");

	if (isMax(a) && isMax(b)) {
		return B - A;
	} else if (isMin(a) && isMin(b)) {
		return A - B;
	} else if (isMax(a) && isMin(b)) {
		return 1;
	} else if (isMin(a) && isMax(b)) {
		return -1;
	}
	return 1;
}

function styles() {
	return gulp
		.src(paths.styles.src)
		.pipe($.if(NODE_ENV === "development", $.sourcemaps.init()))
		.pipe(
			$.sassGlob({
				ignorePaths: [
					"src/styles/utils/**",
					"src/styles/base/**",
					"src/styles/sprite/**",
				],
			}),
		)
		.pipe($.sass())
		.pipe(
			$.autoprefixer({
				cascade: false,
				grid: true,
			}),
		)
		.pipe(
			$.cleanCss({
				level: 2,
			}),
		)
		.pipe(
			$.postcss([
				cssDeclarationSorter({
					order: "smacss",
				}),
				cssMqpacker({
					sort: sortMediaQueries,
				}),
			]),
		)
		.pipe($.if(NODE_ENV === "development", $.sourcemaps.write("./")))
		.pipe(gulp.dest(paths.styles.build))
		.pipe(browserSync.stream());
}

function php() {
	return gulp.src(paths.php.src).pipe(browserSync.stream());
}

function watch() {
	browserSync.init({
		notify: false,
		open: false,
		proxy: "custom",
	});
	gulp.watch(paths.styles.all, styles);
	gulp.watch("build/js/script.js").on("change", browserSync.reload);
	gulp.watch(paths.php.all, php);
}

gulp.task("default", gulp.series(styles, watch));
gulp.task("build", gulp.parallel(styles));
