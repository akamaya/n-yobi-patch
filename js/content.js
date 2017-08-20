(function () {
    'use strict';

    class ScreenMode {
        constructor(videoSizeSaveData) {
            this.videoSizeSaveData = videoSizeSaveData;
            this.videoSizeChanger = new VideoSizeChanger();

        }

        init() {
            this.videoSizeChanger.init();
        }

        isTheaterMode() {
            return $('.mode-theater').length ? true : false;
        }
        // 画面サイズ変更を元に戻す
        reset() {
            if (this.isTheaterMode()) {// シアターモードを解除
                $('.mode-theater').removeClass('mode-theater');
            }
            this.videoSizeChanger.reset();
        }
        // 画面を設定されたサイズに変更する　
        changeVideoSize() {
            this.reset();
            if (this.videoSizeSaveData.power === false) {
                // nop
            }
            else if (this.videoSizeSaveData.type === 'fixed') {
                this.videoSizeChanger.changeVideoSize(this.videoSizeSaveData.fixedSize);
            }
            else if (this.videoSizeSaveData.type === 'ratio') {
                this.videoSizeChanger.changeVideoRatio(this.videoSizeSaveData.ratioSize);
            }
        }
        // 画面をフルスクリーンにする
        changeFullScreen() {
            this.reset();
            this.videoSizeChanger.changeFullScreen();
        }

        // 画面を公式シアターモードにする
        changeTheaterMode() {
            this.videoSizeChanger.reset();
            if (!this.isTheaterMode()) {// シアターモードにセット
                $('.component-lesson-player-controller-theater-mode').click();
            }
        }

        // シアターモードボタンがクリックされたときのイベント
        clickTheaterModeButtonEvent() {
            if (this.isTheaterMode()) {// シアターモードになった
                this.videoSizeChanger.reset();
            }
            else {// シアターモードを解除した
                this.changeVideoSize();
            }
        }
    }

    // 既存の画面にコンテンツを追加していく処理

    const videoSizeSaveData = new VideoSizeSaveData();
    const screenShotSaveData = new ScreenShotSaveData();
    const fullScreenSaveData = new FullScreenSaveData();
    const carousel = new ScreenShotCarousel();
    const fullScreenButton = new FullScreenButton();
    const screenMode = new ScreenMode(videoSizeSaveData);

    // 放送ページでないならなにもせず終了
    const urlcheck = new RegExp("://www.nnn.ed.nico/lessons/\\d+");
    if (urlcheck.test(location.href)) {
        // $(document).readyやchrome.api等々のページ読み込み完了系イベントのあとで
        // ベージコンテンツが生成されるのでDOMチェックはポーリングで
        const id = setInterval(function () {
            if ($('.component-lesson-player-controller').length == 0 ||
                videoSizeSaveData.isLoaded() == false ||
                screenShotSaveData.isLoaded() == false ||
                fullScreenSaveData.isLoaded() == false) return;

            clearInterval(id);

            screenMode.init();
            initVideoSize();
            initScreenShot();
            initFullScreen();

            // chrome拡張のアイコンから設定を変更されたときの通知を受ける
            chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
                if (msg.type == "videoSize") {
                    videoSizeSaveData.setSaveData(msg.saveData);
                    changeSettingVideoSize();
                }
                else if (msg.type == "screenShot") {
                    screenShotSaveData.setSaveData(msg.saveData);
                    changeSettingScreenShot();
                }
                else if (msg.type == "fullScreen") {
                    fullScreenSaveData.setSaveData(msg.saveData);
                    changeSettingFullScreen();
                }
            });
            // シアターモードボタンの監視
            observeTheaterMode();
        }, 500);
    }

    // 動画サイズ変更系の初期化
    function initVideoSize() {
        // 設定に合わせて動画サイズ変更
        if (videoSizeSaveData.power === true) {
            changeSettingVideoSize();
        }

        // windowサイズが変更されたときの処理
        $(window).resize(function () {
            if (videoSizeSaveData.power === true && videoSizeSaveData.type === 'ratio') {
                changeSettingVideoSize();
            }
        });
    }

    // スクショ系の初期化
    function initScreenShot() {
        // スクショデータを溜め込むカルーセルを表示させる
        carousel.insertDom();

        // おれおれカルーセルのため画面サイズが変わったら横幅の再計算が必要
        $(window).resize(function () {
            carousel.resize();
        });
        changeSettingScreenShot();
    };

    // 全画面系の初期化
    function initFullScreen() {
        fullScreenButton.insertDom(clickFullScreenButton);
        changeSettingFullScreen();
    }

    // フルスクリーンボタンが押されたときのコールバック
    function clickFullScreenButton(on) {
        if (on) {
            screenMode.changeFullScreen();
        }
        else {
            changeSettingVideoSize();
        }
    }

    function changeSettingFullScreen() {
        if (fullScreenSaveData.power === false) {
            fullScreenButton.hide();
            return;
        }
        fullScreenButton.show();
    }

    // 動画サイズを変更
    function changeSettingVideoSize() {
        screenMode.changeVideoSize();
        carousel.resize();
    }

    function changeSettingScreenShot() {
        if (screenShotSaveData.power === false) {
            carousel.hide();
            return;
        }
        carousel.autoSave = screenShotSaveData.autoSave;
        carousel.show();
        carousel.resize(screenShotSaveData.size);
    }

    function observeTheaterMode() {
        const this_ = this;
        function handleMutations(mutations) {
            screenMode.clickTheaterModeButtonEvent();
            carousel.resize();
        }
        const observer = new MutationObserver(handleMutations);
        const config = { attributes: true };
        observer.observe(document.querySelector('.component-lesson'), config);
    }

})();



