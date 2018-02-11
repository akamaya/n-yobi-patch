'use strict';
import SaveData from './SaveData';

// テキストURLリンクを保存する

export default class TextOpenLinkSaveData extends SaveData {
    constructor() {
        // 初期値
        const initialValue = {
            power: true,// 機能のon/offボタン
        };
        super('TextOpenLink', initialValue);
    }

}
