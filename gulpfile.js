const {src,dest,series,parallel,watch} = require("gulp");
const cssDeclarationSorter = require("css-declaration-sorter");
const cssMqpacker = require("css-mqpacker");
const browserSync = require("browser-sync").create();
const $ = require("gulp-load-plugins")({
    pattern: ["*"],
    scope: ["devDependencies"]
});

const NODE_ENV = process.env.NODE_ENV || "development";

const paths = {
    styles: {
        src: "src/styles/style.scss",
        all: "src/styles/**/*.scss",
        build: "build/css"
    },
    php: {
        src: "index.php",
        all: "**/*.php"
    },
    js: {
        index: "src/js/script.js",
        all: "src/js/*.js",
        build: "build/js"
    }
};

const isMax = mq => /max-width/.test(mq);

const isMin = mq => /min-width/.test(mq);

const sortMediaQueries = (a, b) => {
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
};

const styles = () =>
   src(paths.styles.src)
        .pipe($.if(NODE_ENV === "development", $.sourcemaps.init()))
        .pipe(
            $.sassGlob({
                ignorePaths: [
                    "src/styles/utils/**",
                    "src/styles/base/**",
                    "src/styles/sprite/**"
                ]
            })
        )
        .pipe($.sass())
        .pipe(
            $.autoprefixer({
                cascade: false,
                grid: true
            })
        )
        .pipe(
            $.cleanCss({
                level: 2
            })
        )
        .pipe(
            $.postcss([
                cssDeclarationSorter({
                    order: "smacss"
                }),
                cssMqpacker({
                    sort: sortMediaQueries
                })
            ])
        )
        .pipe($.if(NODE_ENV === "development", $.sourcemaps.write("./")))
        .pipe(dest(paths.styles.build))
        .pipe(browserSync.stream());

const php = () => src(paths.php.src).pipe(browserSync.stream());

const sync = () => {
    browserSync.init({
        notify: false,
        open: false,
        proxy: "custom",
    });
    watch(paths.styles.all, series(styles));
   watch("build/js/script.js").on("change", browserSync.reload);
   watch(paths.php.all, series(php));
};

exports.default = series(styles, sync);
exports.build = parallel(styles);
