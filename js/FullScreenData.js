'use strict';

// 全画面の設定を保存する

class FullScreenData {
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

    setSaveData(saveData) {

        var parseData;
        try {
            parseData = JSON.parse(saveData);
        }
        catch (e) { }

        this.data = parseData ? JSON.parse(saveData) : {};

        // アップデートなどで足りない項目がある場合初期値で埋める
        if (!('power' in this.data)) this.data.power = true;// 機能のon/offボタン

        this._isLoaded = true;
    }

    getSaveData() {
        return JSON.stringify(this.data);
    }

    load(callback) {
        var _this = this;
        var callbackWrap = function (items) {

            _this.setSaveData(items['FullScreen']);

            // コールバックがあれば呼び出し
            if (callback) {
                callback();
            }
        };
        chrome.storage.local.get('FullScreen', callbackWrap);
    }

    save() {
        var saveData = this.getSaveData();
        chrome.storage.local.set(
            {
                'FullScreen': saveData,
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
