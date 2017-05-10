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

    setSaveData(saveData) {

        var parseData;
        try {
            parseData = JSON.parse(saveData);
        }
        catch (e) { }
        // 設定をVideoSize.dataに格納
        if (parseData) {
            this.data = JSON.parse(saveData);
        }
        // 設定が保存されてないか不正なときは初期値を設定
        else {
            this.data = {
                power: true,// 機能のon/offボタン
            };
        }

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
