// シアターモードと画面サイズ変更がバッティングしないように調整する
'use strict';
class ScreenMode {
    constructor(videoSizeSaveData) {
        this.videoSizeSaveData = videoSizeSaveData;
        this.videoSizeChanger = new VideoSizeChanger();
        this.reserveAction = null;
        this.theaterModeClass = null;
    }

    init() {
        this.videoSizeChanger.init();
    }

    isTheaterMode() {
        // シアターモードのときはclassが増える
        return $('#root > div > div[class]:nth-child(2)').attr('class').split(' ').length >= 2 ? true : false;
    }

    isFullScreen() {
        return this.videoSizeChanger.isFullScreen();
    }

    // 画面サイズ変更を元に戻す
    // シアターモードの場合、シアターモードボタンをクリックしないと解除できない。
    reset() {
        this.videoSizeChanger.reset();
        if (this.isTheaterMode()) {// シアターモードを解除
            $('#root > div > div[class] > div[class] > div > div > div[class] > div[class] > div > div[class] > div[class] > div[class]:nth-child(6) > a > i').click();
        }
    }

    // 画面サイズ変更を元に戻したあと指定された関数を実行
    // シアターモードの場合、この関数の実行後theaterModeButtonClickEventHandle()が動くのでそこでactionを実行する
    resetAndAction(action) {
        const theaterMode = this.isTheaterMode();

        this.reset();

        if (theaterMode) {
            this.reserveAction = action;
        }
        else if (action) {
            action();
        }
    }

    // 画面を設定されたサイズに変更する
    changeVideoSize() {
        const this_ = this;
        const action = function () {
            if (this_.videoSizeSaveData.power === false) {
                // nop
            }
            else if (this_.videoSizeSaveData.type === 'fixed') {
                this_.videoSizeChanger.changeVideoSize(this_.videoSizeSaveData.fixedSize);
            }
            else if (this_.videoSizeSaveData.type === 'ratio') {
                this_.videoSizeChanger.changeVideoRatio(this_.videoSizeSaveData.ratioSize);
            }
        }
        this.resetAndAction(action);
    }

    // 画面をフルスクリーンにする
    changeFullScreen() {
        const this_ = this;
        const action = function () {
            this_.videoSizeChanger.changeFullScreen();
        }
        this.resetAndAction(action);
    }

    // シアターモードボタンがクリックされたときのイベント
    theaterModeButtonClickEventHandle() {
        if (this.reserveAction) {
            this.reserveAction();
            this.reserveAction = null;
        }
        else if (this.isTheaterMode()) {// シアターモードになった
            this.videoSizeChanger.reset();// 変更した画面設定を削除
        }
        else {// シアターモードを解除した
            this.changeVideoSize();// 設定通りに画面サイズを変更
        }
    }
}