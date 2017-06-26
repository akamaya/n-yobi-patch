'use strict';

// 既存の画面にコンテンツを追加していく処理

var originWidth = 608;
var originHeight = 342;
var videoSizeData = new VideoSizeData();
var screenShotData = new ScreenShotData();
var fullScreenData = new FullScreenData();
var carousel = new ScreenShotCarousel();


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
        initVideoSize();
        initScreenShot();
        initFullScreen();
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
            else if (msg.type == "fullScreen") {
                fullScreenData.setSaveData(msg.saveData);
                changeFullScreen();
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

// 全画面系の初期化
function initFullScreen() {
    var icon = chrome.extension.getURL('images/fullScreenIcon.png');
    var tag = '<div class="component-lesson-player-controller-fullScreen"><button type="submit"><img src="' + icon + '" alt="全画面"/></button></i></div>';
    $('.component-lesson-player-controller-console').append(tag);


    $('.component-lesson-player-controller-fullScreen button').on('click', function () {
        clickFullScreen();
    });

    changeFullScreen();

}

function changeFullScreen() {
    if (fullScreenData.power === false) {
        $('.component-lesson-player-controller-fullScreen').hide();
        return;
    }

    $('.component-lesson-player-controller-fullScreen').show();
}

var fullScreenOriginalCss;
function clickFullScreen() {

    var videoCss = {
        'position': 'absolute',
        'width': '100%',
        'height': '100%',
        'top': '0px',
        'left': '0px',
        'bottom': '0px',
        'right': '0px',
        'display': 'block',
        'z-index': '1000',
    };
    if (fullScreenOriginalCss) {
        _resetVideoComponent(fullScreenOriginalCss);
        fullScreenOriginalCss = undefined;
        // 画面中央の再生ボタン群の位置を中央に修正(録画のみ)
        _centeringArchiveMenu(80);
    }
    else {
        fullScreenOriginalCss = _changeVideoComponent(videoCss);
        // 画面中央の再生ボタン群の位置を中央に修正(録画のみ)
        _centeringArchiveMenu();
    }

}

function backFullScreen() {

}

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
    var videoCss = {
        'width': width,
        'height': height,
    };
    _changeVideoComponent(videoCss);
    // 画面中央の再生ボタン群の位置を中央に修正(録画のみ)
    _centeringArchiveMenu(80);

    // 右テキストの位置を修正
    $('.component-lesson-right-column').css('margin-left', (width + 32) + 'px');
}

// ビデオコンポーネントのサイズ変更
function _changeVideoComponent(videoCss) {
    var components = [
        '.component-lesson-left-column',
        '.component-lesson-player',
        '.component-lesson-player-controller',
        '.vjs_video_3-dimensions',
        '.component-lesson-comment-pane',
    ];
    var cssKeyList = Object.keys(videoCss);
    var originalCss = {};
    for (var component of components) {
        originalCss[component] = $(component).css(cssKeyList);
        $(component).css(videoCss);
    }

    return originalCss;
}
function _resetVideoComponent(originalCss) {
    var componentList = Object.keys(originalCss);

    for (var component of componentList) {
        $(component).css(originalCss[component]);
    }
}

// 画面中央の再生ボタン群の位置を中央に移動(録画のみ)
function _centeringArchiveMenu(unnei_comme_offset = 0) {
    var archiveMenu = $('.component-lesson-player-controller-archive-menu');
    if (archiveMenu.length > 0) {
        var height = $('.component-lesson-player').height();
        var width = $('.component-lesson-player').width();
        var top = Math.ceil((height - archiveMenu.height()) / 2) + unnei_comme_offset;
        var left = Math.ceil((width - archiveMenu.width()) / 2);

        archiveMenu.offset({ top: top, left: left });
        $('.component-lesson-player-controller-console').css({ 'width': width });
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




