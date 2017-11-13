'use strict';

// videoサイズの設定を保存する

class QuestionnaireSaveData extends SaveData {
    constructor() {
        // 初期値
        const initialValue = {
            power: true,// 機能のon/offボタン
            autoClose: false,// 結果を自動で閉じる
            autoCloseSeconds: 10,// 自動で閉じるまでの時間
            shrink: false,// 縮小する
            shrinkRatio: 60,// 縮小サイズ(%)
            changeBackGroundColor: false,// 背景を無色にする
            move: false,// 端に寄せる
            movePosition: 'rightUpper',// 右上
            hiddenLive: false,// 生放送で非表示
            hiddenArchive: false,// アーカイブで非表示
        };
        super('Questionnaire', initialValue);
    }
    get autoClose() {
        return this.getSaveData('autoClose');
    }
    set autoClose(flag) {
        return this.saveBool('autoClose', flag);
    }

    get autoCloseSeconds() {
        return this.getSaveData('autoCloseSeconds');
    }
    set autoCloseSeconds(seconds) {
        this.saveNumeric('autoCloseSeconds', seconds);
    }

    get shrink() {
        return this.getSaveData('shrink');
    }
    set shrink(flag) {
        return this.saveBool('shrink', flag);
    }

    get shrinkRatio() {
        return this.getSaveData('shrinkRatio');
    }
    set shrinkRatio(ratio) {
        this.saveNumeric('shrinkRatio', ratio);
    }

    get changeBackGroundColor() {
        return this.getSaveData('changeBackGroundColor');
    }
    set changeBackGroundColor(flag) {
        return this.saveBool('changeBackGroundColor', flag);
    }

    get move() {
        return this.getSaveData('move');
    }
    set move(flag) {
        return this.saveBool('move', flag);
    }

    get movePosition() {
        return this.getSaveData('movePosition');
    }
    set movePosition(position) {
        this.saveFormatString('movePosition', position, ['leftUpper', 'rightUpper', 'leftLower', 'rightLower']);
    }

    get hiddenLive() {
        return this.getSaveData('hiddenLive');
    }
    set hiddenLive(flag) {
        return this.saveBool('hiddenLive', flag);
    }

    get hiddenArchive() {
        return this.getSaveData('hiddenArchive');
    }
    set hiddenArchive(flag) {
        return this.saveBool('hiddenArchive', flag);
    }
}
