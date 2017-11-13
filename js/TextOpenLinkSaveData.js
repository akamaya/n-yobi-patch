'use strict';

// テキストURLリンクを保存する

class TextOpenLinkSaveData extends SaveData {
    constructor() {
        // 初期値
        const initialValue = {
            power: true,// 機能のon/offボタン
        };
        super('TextOpenLink', initialValue);
    }

}
