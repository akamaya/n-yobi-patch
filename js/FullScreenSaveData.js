'use strict';

// 全画面の設定を保存する

class FullScreenSaveData extends SaveData {
    constructor() {
        // 初期値
        const initialValue = {
            power: true,// 機能のon/offボタン
        };
        super('FullScreen', initialValue);
    }

}
