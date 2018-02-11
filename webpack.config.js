const path = require('path');

module.exports = {
    // エントリーポイントの設定
    entry: {
        content: './src/js/content.js',
        popup: './src/js/popup.js',
    },
    // 出力の設定
    output: {
        path: path.join(__dirname, 'dist'),
        // 出力するファイル名(entryのkey名が[name]に入る)
        filename: '[name].js',

    }
};