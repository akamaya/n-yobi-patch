'use strict';

// 既存の画面にコンテンツを追加していく処理

var originWidth = 608;
var originHeight = 342;
var videoSizeData = new VideoSizeData();
var screenShotData = new ScreenShotData();
var carousel = new ScreenShotCarousel();


// 放送ページでないならなにもせず終了
var urlcheck = new RegExp("://www.nnn.ed.nico/lessons/\\d+");
if (urlcheck.test(location.href)) {
    // $(document).readyやchrome.api等々のページ読み込み完了系イベントのあとで
    // ベージコンテンツが生成されるのでDOMチェックはポーリングで
    var id = setInterval(function () {
        if ($('.component-lesson-player-controller').length == 0 || videoSizeData.isLoaded() == false || screenShotData.isLoaded() == false) return;
        clearInterval(id);
        initVideoSize();
        initScreenShot();
        // chrome拡張のアイコンから設定を変更されたときの通知を受ける
        chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
            if (msg.type == "videoSize") {
                videoSizeData.setSaveData(msg.saveData);
                changeVideoSize();
                carousel.resize();
            }
            else if (msg.type == "screenShot") {
                screenShotData.setSaveData(msg.saveData);
                changeScreenShot();
            }
        });
    }, 500);
}


// 動画サイズ変更系の初期化
function initVideoSize() {
    // 初期動画サイズを取得
    var videoComponent = $('.component-lesson-player-controller');
    originWidth = videoComponent.width();
    originHeight = videoComponent.height();

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

// 動画サイズを変更
function changeVideoSize() {
    if (videoSizeData.power === false) {
        _changeVideoSize(originWidth);
    }
    else if (videoSizeData.type === 'fixed') {
        _changeVideoSize(videoSizeData.fixedSize);
    }
    else if (videoSizeData.type === 'ratio') {

        var width = Math.ceil($(window).width() * videoSizeData.ratioSize / 100);
        _changeVideoSize(width);
    }
}

function _changeVideoSize(width) {

    if ($('.component-lesson-left-column').length === 0) {
        return;
    }

    var scale = width / originWidth;
    var height = Math.ceil(originHeight * scale);

    // 画面サイズを修正
    $('.component-lesson-left-column').width(width);
    $('.component-lesson-player').width(width).height(height);
    $('.component-lesson-player-controller').width(width).height(height);
    $('.vjs_video_3-dimensions').width(width).height(height);
    $('.component-lesson-comment-pane').width(width).height(height);

    // シークバーとコンソールサイズを修正
    $('.component-lesson-player-controller-console').width(width);

    // シークバーを伸ばすとシークしたときの位置と動画の時間が一致しなくなるのでコメントアウト
    //$('.component-lesson-player-controller-seekbar-range').width(width);

    // 画面中央の再生ボタン群の位置を中央に修正(録画のみ)
    var archiveMenu = $('.component-lesson-player-controller-archive-menu');
    if (archiveMenu.length > 0) {
        var top = Math.ceil((height - archiveMenu.height()) / 2) + 80;
        var left = Math.ceil((width - archiveMenu.width()) / 2);

        archiveMenu.offset({ top: top, left: left });
    }

    // 右テキストの位置を修正
    $('.component-lesson-right-column').css('margin-left', (width + 32) + 'px');
}


function changeScreenShot() {
    if (screenShotData.power === false) {
        carousel.hide();
        return;
    }
    carousel.show();

}




