'use strict';
import SaveData from './SaveData';

// 全画面の設定を保存する

export default class FullScreenSaveData extends SaveData {
    constructor() {
        // 初期値
        const initialValue = {
            power: true,// 機能のon/offボタン
        };
        super('FullScreen', initialValue);
    }

}
