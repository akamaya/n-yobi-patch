'use strict';

// videoサイズの設定を保存する

class VideoSizeData {
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

    get type() {
        return this.data.type;
    }
    set type(newType) {
        if ((newType !== 'fixed' && newType !== 'ratio') || this.data.type === newType) return;

        this.data.type = newType;
        this.save();
    }

    get fixedSize() {
        return this.data.fixed;
    }
    set fixedSize(newSize) {
        if (isNaN(newSize) || newSize === this.data.fixed) return;

        this.data.fixed = newSize;
        this.save();
    }

    get ratioSize() {
        return this.data.ratio;
    }
    set ratioSize(newSize) {
        if (isNaN(newSize) || newSize === this.data.ratio) return;

        this.data.ratio = newSize;
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
                type: 'fixed',// 固定:'fixed',割合:'ratio'
                fixed: 608,// 固定時のpx
                ratio: 40,// 割合時の%
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

            _this.setSaveData(items['VideoSize']);

            // コールバックがあれば呼び出し
            if (callback) {
                callback();
            }
        };
        chrome.storage.local.get('VideoSize', callbackWrap);
    }

    save() {
        var saveData = this.getSaveData();
        chrome.storage.local.set(
            {
                'VideoSize': saveData,
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
