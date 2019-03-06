# rpgmv-new
デフォルトデータや素材の紐づけなどがない、
<br>まっさらな RPGツクールMV プロジェクトファイル を新規作成します。

## Usage
0. Node.js, Yarn, Git, Gulp をインストール
1. `git clone https://github.com/katai5plate/rpgmv-new && cd rpgmv-new`
2. `yarn install`
3. RPGツクールMVのインストール先の `NewData` を開き、
<br>(例: `C:\Program Files (x86)\KADOKAWA\RPGMV\NewData` )
<br>`resources` ディレクトリの中に、以下の必要なファイルをコピーする
* `fonts/`
* `icon/`
* `img/`
  + `img/system/` だけでOK
* `js/`
  + `plugins/Community_Basic.js` , `plugins/MadeWithMv.js` を含む
  + `plugins.js` は無くてもOK
4. `gulp` または `yarn start` で実行

## Options
|option|description|default|
|-|-|-|
|`-n` or `--name`|ゲーム名を設定|`"rpgmv-new"`|
|`-e` or `--edition`|バージョン番号を設定|`1.6.2`|
|`-o` or `--output`|出力先を設定|`./dest`|

```
gulp
gulp -n "Eternal Force Blizzard" -e 1.5.1 -o C:\MyGames\
gulp --name "Eternal Force Blizzard" --edition 1.5.1 --output C:\MyGames\
yarn start
yarn start -n "Eternal Force Blizzard" -e 1.5.1 -o C:\MyGames\
yarn start --name "Eternal Force Blizzard" --edition 1.5.1 --output C:\MyGames\
```

## Advanced Usage
### デフォルトデータの設定値を編集する
- `src/yaml/data/` の中の yamlファイル を編集してください。
  - `copy/` : JSON化されたものをそのまま data にコピーします。
  - `system/` : このディレクトリにある yamlファイル が全てマージされ System.json として出力します。
- 値が `[null]` になる data は `src/yaml/structures/nilDataFiles.yaml` で定義します。
### `index.html` を編集する
- `src/jade/index.jade` を編集してください。
- HTML変換時、先頭行に `- var GAME_TITLE = "<ゲームタイトル>";` が挿入されます。
### 同梱する素材やプラグインを変更する
- `resources/` の中のデータはそのまま生成プロジェクトにコピーされます。
### 実行順序
0. デフォルトのパス以外が設定されている場合、上書きを中止する。
1. init: yamlファイル を JSON に変換
2. mkdir: 各フォルダを作成
3. copyResources: `resources/` の中身をコピー
4. makeSystem: `data/System.json` を作成
5. copyData: `src/yaml/data/copy/` の中身をコピー
6. makeEmptyData: 値が `[null]` になる JSON をコピー
7. makeIndex: jadeファイル を HTML に変換し配置
8. makeDevData: `plugins.js`, `package.json`, `Game.rpgproject` を作成
### Windowsで起動用バッチファイルの作成例
- `run.bat`
```bat
@echo off
setlocal
set DIST_DIR="C:\Users\%USERNAME%\Documents\Games"
:retry
set /p GAME_TITLE="ゲームタイトル: "
if x%GAME_TITLE%==x goto retry
gulp -n "%GAME_TITLE%" -o "%DIST_DIR%" & (
  pause & explorer "%DIST_DIR%\%GAME_TITLE%"
)
endlocal
```