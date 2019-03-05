const gulp = require("gulp")
const header = require("gulp-header");
const jade = require("gulp-jade");
const yaml = require("gulp-yaml");
const merge = require("gulp-merge-json");
const rename = require("gulp-rename");

const fs = require("fs-extra");
const args = require("minimist")(process.argv.slice(2));

const GAME_TITLE = args.n || args.name || "new";

gulp.task("init", quit => {
  fs.removeSync(`${process.cwd()}/temp`);
  fs.removeSync(`${process.cwd()}/dest`);
  quit();
});

gulp.task("jade", () => {
  return gulp.src(['src/pug/index.jade'])
    .pipe(header(`- var GAME_TITLE = "${GAME_TITLE}";\n`))
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./temp/'));
});

gulp.task("yaml", () => {
  return gulp.src([
    'src/yaml/**/*.yaml',
  ])
    .pipe(yaml())
    .pipe(gulp.dest('./temp/'));
});

gulp.task("makeSystem", () => {
  fs.writeJSONSync(`${process.cwd()}/temp/data/system/gameTitle.json`, { gameTitle: GAME_TITLE });
  return gulp.src(['temp/data/system/*.json'])
    .pipe(merge())
    .pipe(rename({ basename: "System" }))
    .pipe(gulp.dest('./dest/data'));
});

gulp.task("makeTilesets", quit => {
  fs.moveSync(
    `${process.cwd()}/temp/data/others/tilesets.json`,
    `${process.cwd()}/dest/data/Tilesets.json`
  )
  quit();
});

gulp.task("check", () => {
  console.log(args, GAME_TITLE)
});

gulp.task("default", gulp.series(["init", "jade", "yaml", "makeSystem", "makeTilesets"]))