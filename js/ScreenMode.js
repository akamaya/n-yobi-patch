// シアターモードと画面サイズ変更がバッティングしないように調整する
'use strict';
class ScreenMode {
    constructor(videoSizeSaveData) {
        this.videoSizeSaveData = videoSizeSaveData;
        this.videoSizeChanger = new VideoSizeChanger();
        this.reserveAction = null;
    }

    init() {
        this.videoSizeChanger.init();
    }

    isTheaterMode() {
        return $('.mode-theater').length ? true : false;
    }

    isFullScreen() {
        return this.videoSizeChanger.isFullScreen();
    }

    // 画面サイズ変更を元に戻す
    reset() {
        this.resetAndAction();
    }

    // 画面サイズ変更を元に戻したあと指定された関数を実行
    resetAndAction(action) {
        this.videoSizeChanger.reset();
        if (this.isTheaterMode()) {// シアターモードを解除
            $('.component-lesson-player-controller-theater-mode').click();
            this.reserveAction = action;
            //この後theaterModeButtonClickEventHandle();が発行されてreserveActionが実行される
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

    // 画面を公式シアターモードにする
    changeTheaterMode() {
        this.videoSizeChanger.reset();
        if (!this.isTheaterMode()) {// シアターモードにセット
            $('.component-lesson-player-controller-theater-mode').click();
        }
    }

    // シアターモードボタンがクリックされたときのイベント
    theaterModeButtonClickEventHandle() {
        if (this.isTheaterMode()) {// シアターモードになった
            this.videoSizeChanger.reset();
        }
        else if (this.reserveAction) {
            this.reserveAction();
            this.reserveAction = null;
        }
        else {// シアターモードを解除した
            this.changeVideoSize();
        }
    }
}