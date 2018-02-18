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
            shortCutKey1: 17,// 17 = ctrl
            shortCutKey2: 73,// 73 = I
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

    get shortCutKey1() {
        return Number(this.getSaveData('shortCutKey1'));
    }

    set shortCutKey1(value) {
        this.saveNumeric('shortCutKey1', value);
    }

    get shortCutKey2() {
        return Number(this.getSaveData('shortCutKey2'));
    }

    set shortCutKey2(value) {
        this.saveNumeric('shortCutKey2', value);
    }

    get autoSave() {
        return this.getSaveData('autoSave');
    }

    set autoSave(newAutoSave) {
        this.saveBool('autoSave', newAutoSave);
    }
}
