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