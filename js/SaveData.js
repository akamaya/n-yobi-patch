'use strict';

// 設定保存の親クラス

class SaveData {
    constructor(saveName, initialValue) {
        this._isLoaded = false;// 設定のロード完了フラグ
        this._saveData = {};
        this._saveName = saveName;
        this._initialValue = initialValue;
        this.load();
    }

    isLoaded() {
        return this._isLoaded;
    }

    getSaveData(key) {
        return this._saveData[key];
    }

    // bool型のセーブデータ
    saveBool(key, value) {
        var boolValue = value ? true : false;

        // 値に変更がないならなにもしない
        if (boolValue === this._saveData[key]) return;
        this._saveData[key] = boolValue;
        this.save();
    }
    // 数値型のセーブデータ
    saveNumeric(key, value) {
        // 数値でないならなにもしない
        if (isNaN(value)) {
            console.log("invalid numeric:key=" + key + ",value=" + value);
            return;
        }
        // 値に変更がないならなにもしない
        if (value === this._saveData[key]) return;

        this._saveData[key] = value;
        this.save();
    }

    // 特定文字列のセーブデータ
    saveFormatString(key, value, formatList) {
        // 値に変更がないならなにもしない
        if (value === this._saveData[key]) return;

        // formatチェック
        for (var format of formatList) {
            // 合致したらセーブ
            if (value === format) {
                this._saveData[key] = value;
                this.save();
                return;
            }
        }
        // ここまで来たら合致しないのでなにかおかしい
        console.log("invalid format:key=" + key + ",value=" + value);
    }

    get power() {
        return this.getSaveData('power');
    }
    set power(p) {
        this.saveBool('power', p);
    }

    setSaveData(saveData) {

        // なにかおかしな文字列だと怖いのでとりあえずtry-catchしておく
        try {
            this._saveData = JSON.parse(saveData);
        }
        catch (e) { }

        // 設定が保存されてないかセーブデータが不正なときは初期値を設定
        // 1項目ずつチェックするのはバージョンアップで新項目が増えたときに初期値を設定するため
        for (var key of Object.keys(this._initialValue)) {
            if (this._saveData[key] === undefined) {
                this._saveData[key] = this._initialValue[key];
            }
        }
        // セーブデータロード完了フラグを立てる
        this._isLoaded = true;
    }

    serializeSaveData() {
        return JSON.stringify(this._saveData);
    }

    load(callback) {
        var _this = this;
        var callbackWrap = function (items) {

            _this.setSaveData(items[_this._saveName]);

            // コールバックがあれば呼び出し
            if (callback) {
                callback();
            }
        };
        chrome.storage.local.get(_this._saveName, callbackWrap);
    }

    save() {
        var saveName = this._saveName;
        var saveData = {};
        saveData[saveName] = this.serializeSaveData();

        chrome.storage.local.set(saveData);

        if (this._saveNotice) {
            this._saveNotice();
        }
    }

    setSaveNotification(callback) {
        this._saveNotice = callback;
    }

}
