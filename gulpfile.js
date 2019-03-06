const gulp = require("gulp")
const header = require("gulp-header");
const jade = require("gulp-jade");
const yaml = require("gulp-yaml");
const merge = require("gulp-merge-json");
const rename = require("gulp-rename");

const fs = require("fs-extra");
const args = require("minimist")(process.argv.slice(2));

const GAME_TITLE = args.n || args.name || "rpgmv-new";
const VERSION = args.e || args.edition || "1.6.2";
const DEFAULT_DIR = `${process.cwd()}/dest/${GAME_TITLE}`;
let DEST_DIR_PARENT = args.o || args.output || DEFAULT_DIR;
let DEST_DIR = DEST_DIR_PARENT;

gulp.task("init", quit => {
  if (DEST_DIR_PARENT !== DEFAULT_DIR) {
    DEST_DIR = `${DEST_DIR_PARENT}/${GAME_TITLE}`
    try {
      const safety = fs.existsSync(DEST_DIR);
      if (safety) {
        console.error([
          "",
          "指定されたディレクトリは存在するため、作業を開始できません。",
          "指定のパスで続行する場合、ディレクトリを移動するか、削除してください。",
          "",
          "The specified directory exists, so you can not start work.",
          "If you continue, please move or delete specified directory.",
          "",
          `DEST_DIR: ${DEST_DIR}`,
          "",
        ].join("\n"));
        process.exit(1)
      }
    } catch (e) { }
  } else {
    fs.removeSync(`${process.cwd()}/dest`);
  }
  fs.removeSync(`${process.cwd()}/temp`);
  quit();
});

gulp.task("yaml", () => {
  return gulp.src([
    'src/yaml/**/*.yaml',
  ])
    .pipe(yaml())
    .pipe(gulp.dest('./temp/'));
});

gulp.task("mkdir", quit => {
  const list = require(`${process.cwd()}/temp/structures/mkdir.json`)
  list.map(dn => {
    fs.mkdirpSync(`${DEST_DIR}/${dn}`)
  })
  quit();
});

gulp.task("copyResources", quit => {
  const list = require(`${process.cwd()}/temp/structures/resources.json`)
  list.map(dn => {
    fs.copySync(`${process.cwd()}/resources/${dn}`, `${DEST_DIR}/${dn}`)
  })
  quit();
});

gulp.task("makeSystem", () => {
  fs.writeJSONSync(`${process.cwd()}/temp/data/system/gameTitle.json`, { gameTitle: GAME_TITLE });
  return gulp.src(['temp/data/system/*.json'])
    .pipe(merge())
    .pipe(rename({ basename: "System" }))
    .pipe(gulp.dest(`${DEST_DIR}/data`));
});

gulp.task("copyData", quit => {
  fs.readdirSync(`${process.cwd()}/temp/data/copy`).map(fn => {
    fs.copySync(
      `${process.cwd()}/temp/data/copy/${fn}`,
      `${DEST_DIR}/data/${fn}`
    )
  })
  quit();
});

gulp.task("makeEmptyData", quit => {
  const list = require(`${process.cwd()}/temp/structures/nilDataFiles.json`)
  list.map(fn => {
    fs.copySync(
      `${process.cwd()}/temp/data/others/nil.json`,
      `${DEST_DIR}/data/${fn}.json`
    )
  })
  quit();
});

gulp.task("makeIndex", () => {
  return gulp.src(['src/pug/index.jade'])
    .pipe(header(`- var GAME_TITLE = "${GAME_TITLE}";\n`))
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest(`${DEST_DIR}/`));
});

gulp.task("makeDevData", quit => {
  // plugins.js
  const plugins = JSON
    .stringify(require(`${process.cwd()}/temp/structures/plugins.json`))
    .replace(/\A\[(.*?)\]\Z/m, "$1")
  fs.outputFileSync(
    `${DEST_DIR}/js/plugins.js`,
    `var $plugins = \n[\n${plugins}\n];\n`
  )
  // package.json
  fs.copySync(`${process.cwd()}/temp/structures/package.json`, `${DEST_DIR}/package.json`)
  // Game.rpgproject
  fs.outputFileSync(`${DEST_DIR}/Game.rpgproject`, `RPGMV ${VERSION}`)
  quit();
});

gulp.task("check", () => {
  console.log(args, GAME_TITLE)
});

gulp.task("default", gulp.series([
  "init",
  "yaml",
  "mkdir",
  "copyResources",
  "makeSystem",
  "copyData",
  "makeEmptyData",
  "makeIndex",
  "makeDevData",
]))
