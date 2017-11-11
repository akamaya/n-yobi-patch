(function () {
    'use strict';

    // 既存の画面にコンテンツを追加していく処理

    const videoSizeSaveData = new VideoSizeSaveData();
    const screenShotSaveData = new ScreenShotSaveData();
    const fullScreenSaveData = new FullScreenSaveData();
    const textOpenLinkSaveData = new TextOpenLinkSaveData();
    const carousel = new ScreenShotCarousel();
    const fullScreenButton = new FullScreenButton();
    const screenMode = new ScreenMode(videoSizeSaveData);
    const textOpenLink = new TextOpenLink();

    // 放送ページでないならなにもせず終了
    const urlcheck = new RegExp("://www.nnn.ed.nico/lessons/\\d+");
    if (urlcheck.test(location.href)) {
        // $(document).readyやchrome.api等々のページ読み込み完了系イベントのあとで
        // ベージコンテンツが生成されるのでDOMチェックはポーリングで
        const id = setInterval(function () {
            if ($('#comment-layer').length == 0 ||
                videoSizeSaveData.isLoaded() == false ||
                screenShotSaveData.isLoaded() == false ||
                fullScreenSaveData.isLoaded() == false) return;

            clearInterval(id);

            screenMode.init();
            initVideoSize();
            initScreenShot();
            initFullScreen();
            initTextOpenLink();

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
                else if (msg.type == "textOpenLink") {
                    textOpenLinkSaveData.setSaveData(msg.saveData);
                    changeSettingTextOpenLink();
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
            // シアターモード中はなにもしない
            if (screenMode.isTheaterMode()) {
                return;
            }
            // フルスクリーン中ならなにもしない
            if (screenMode.isFullScreen()) {
                return;
            }
            // 画面割合で表示中なら画面サイズを変更する
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

    // テキストのみ開くリンク
    function initTextOpenLink() {
        textOpenLink.insertDom();
        changeSettingTextOpenLink();
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
            changeSettingVideoSize();
            return;
        }
        fullScreenButton.show();
    }

    // 動画サイズを変更
    function changeSettingVideoSize() {
        screenMode.changeVideoSize();
        fullScreenButton.off();// ESCボタンの解除
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

    function changeSettingTextOpenLink() {
        if (textOpenLinkSaveData.power === false) {
            textOpenLink.hide();
            return;
        }
        textOpenLink.show();
    }

    // シアターモードの監視
    function observeTheaterMode() {
        function handleMutations(mutations) {
            screenMode.theaterModeButtonClickEventHandle();

            if (screenMode.isTheaterMode()) {
                fullScreenButton.off();// ESCボタンの解除
                setTimeout(() => carousel.resize(), 400);
            }
            carousel.resize();
        }
        const observer = new MutationObserver(handleMutations);
        const config = { attributes: true };
        observer.observe(document.querySelector('#root > div > div[class]:nth-child(2)'), config);
    }

})();



