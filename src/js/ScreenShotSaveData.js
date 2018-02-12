'use strict';
import SaveData from './SaveData';

// スクリーンショットの設定を保存する

export default class ScreenShotSaveData extends SaveData {
    constructor() {
        // 初期値
        const initialValue = {
            power: true,// 機能のon/offボタン
            size: 'large',// カルーセルサイズ
            shortCut: true,// ショートカット
            autoSave: false,// 自動保存
        };
        super('ScreenShot', initialValue);
    }

    get size() {
        return this.getSaveData('size');
    }

    set size(newSize) {
        this.saveFormatString('size', newSize, ['large', 'medium', 'small']);
    }

    get shortCut() {
        return this.getSaveData('shortCut');
    }

    set shortCut(value) {
        this.saveBool('shortCut', value);
    }

    get autoSave() {
        return this.getSaveData('autoSave');
    }

    set autoSave(newAutoSave) {
        this.saveBool('autoSave', newAutoSave);
    }
}
