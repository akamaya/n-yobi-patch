'use strict';

// スクリーンショットの設定を保存する

class ScreenShotData {
    constructor() {
        this._isLoaded = false;// 設定のロード完了フラグ
        this.data = {};
        this.load();
    }

    isLoaded() {
        return this._isLoaded;
    }

    get power() {
        return this.data.power;
    }
    set power(p) {
        var bool = p ? true : false;

        // 値に変更がないならなにもしない
        if (bool === this.data.power) return;
        this.data.power = bool;
        this.save();
    }

    get size() {
        return this.data.size;
    }
    set size(newSize) {
        if ((newSize !== 'large' && newSize !== 'medium' && newSize !== 'small') || this.data.size === newSize) return;

        this.data.size = newSize;
        this.save();

    }
    get autoSave() {
        return this.data.autoSave;
    }
    set autoSave(newAutoSave) {
        var bool = newAutoSave ? true : false;

        // 値に変更がないならなにもしない
        if (bool === this.data.autoSave) return;
        this.data.autoSave = bool;
        this.save();
    }

    setSaveData(saveData) {

        var parseData;
        try {
            parseData = JSON.parse(saveData);
        }
        catch (e) { }

        this.data = parseData ? JSON.parse(saveData) : {};

        // アップデートなどで足りない項目がある場合初期値で埋める
        if (!('power' in this.data)) this.data.power = true;// 機能のon/offボタン
        if (!('size' in this.data)) this.data.size = 'large';// カルーセルサイズ
        if (!('autoSave' in this.data)) this.data.autoSave = false;// 自動保存

        this._isLoaded = true;
    }

    getSaveData() {
        return JSON.stringify(this.data);
    }

    load(callback) {
        var _this = this;
        var callbackWrap = function (items) {

            _this.setSaveData(items['ScreenShot']);

            // コールバックがあれば呼び出し
            if (callback) {
                callback();
            }
        };
        chrome.storage.local.get('ScreenShot', callbackWrap);
    }

    save() {
        var saveData = this.getSaveData();
        chrome.storage.local.set(
            {
                'ScreenShot': saveData,
            }
        );
        if (this._saveNotice) {
            this._saveNotice();
        }
    }

    setSaveNotification(callback) {
        this._saveNotice = callback;
    }

}
