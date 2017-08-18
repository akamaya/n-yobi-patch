'use strict';

// videoサイズの設定を保存する

class VideoSizeSaveData extends SaveData {
    constructor() {
        // 初期値
        const initialValue = {
            power: true,// 機能のon/offボタン
            type: 'fixed',// 固定:'fixed',割合:'ratio'
            fixed: 608,// 固定時のpx
            ratio: 40,// 割合時の%
        };
        super('VideoSize', initialValue);
    }
    get type() {
        return this.getSaveData('type');
    }
    set type(newType) {
        this.saveFormatString('type', newType, ['fixed', 'ratio']);
    }

    get fixedSize() {
        return this.getSaveData('fixed');
    }
    set fixedSize(newSize) {
        this.saveNumeric('fixed', newSize);
    }

    get ratioSize() {
        return this.getSaveData('ratio');
    }
    set ratioSize(newSize) {
        this.saveNumeric('ratio', newSize);
    }
}
