'use strict';

// 既存の画面にコンテンツを追加していく処理

var videoSizeData = new VideoSizeData();
var screenShotData = new ScreenShotData();
var fullScreenData = new FullScreenData();
var carousel = new ScreenShotCarousel();
var videoSizeChanger = new VideoSizeChanger();


// 放送ページでないならなにもせず終了
var urlcheck = new RegExp("://www.nnn.ed.nico/lessons/\\d+");
if (urlcheck.test(location.href)) {
    // $(document).readyやchrome.api等々のページ読み込み完了系イベントのあとで
    // ベージコンテンツが生成されるのでDOMチェックはポーリングで
    var id = setInterval(function () {
        if ($('.component-lesson-player-controller').length == 0 ||
            videoSizeData.isLoaded() == false ||
            screenShotData.isLoaded() == false ||
            fullScreenData.isLoaded() == false) return;

        clearInterval(id);
        videoSizeChanger.init();
        videoSizeChanger.setVideoSizeChangeEvent(videoSizeChangeEvent);
        initVideoSize();
        initScreenShot();
        initFullScreen();

        // chrome拡張のアイコンから設定を変更されたときの通知を受ける
        chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
            if (msg.type == "videoSize") {
                videoSizeData.setSaveData(msg.saveData);
                changeVideoSize();
            }
            else if (msg.type == "screenShot") {
                screenShotData.setSaveData(msg.saveData);
                changeScreenShot();
            }
            else if (msg.type == "fullScreen") {
                fullScreenData.setSaveData(msg.saveData);
                changeFullScreen();
            }
        });
    }, 500);
}

// 動画サイズ変更系の初期化
function initVideoSize() {
    // 設定に合わせて動画サイズ変更
    if (videoSizeData.power === true) {
        changeVideoSize();
    }

    // windowサイズが変更されたときの処理
    $(window).resize(function () {
        if (videoSizeData.power === true && videoSizeData.type === 'ratio') {
            changeVideoSize();
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

    changeScreenShot();

};
// videoのサイズ変更が合ったら呼び出される
function videoSizeChangeEvent() {
    carousel.resize();
}

// 全画面系の初期化
function initFullScreen() {

    videoSizeChanger.insertDom();

    // windowサイズが変更されたときの処理
    $(window).resize(function () {
        videoSizeChanger.resize();
    });

    changeFullScreen();

}

function changeFullScreen() {
    if (fullScreenData.power === false) {
        videoSizeChanger.hide();
        return;
    }
    videoSizeChanger.show();
}


// 動画サイズを変更
function changeVideoSize() {
    if (videoSizeData.power === false) {
        videoSizeChanger.changeVideoSize();
    }
    else if (videoSizeData.type === 'fixed') {
        videoSizeChanger.changeVideoSize(videoSizeData.fixedSize);
    }
    else if (videoSizeData.type === 'ratio') {
        videoSizeChanger.changeVideoRatio(videoSizeData.ratioSize);
    }
}

function changeScreenShot() {
    if (screenShotData.power === false) {
        carousel.hide();
        return;
    }
    carousel.autoSave = screenShotData.autoSave;
    carousel.show();
    carousel.resize(screenShotData.size);
}




