'use strict';

// アイコンを押したときに出てくるポップアップの処理

// 保存された設定の読み込みは非同期のため、onload前に読んでおく
var videoSizeSaveData = new VideoSizeSaveData();
videoSizeSaveData.setSaveNotification(noticeVideoSizeSave);
var screenShotSaveData = new ScreenShotSaveData();
screenShotSaveData.setSaveNotification(noticeScreenShotSave);
var fullScreenSaveData = new FullScreenSaveData();
fullScreenSaveData.setSaveNotification(noticeFullScreenSave);


$(document).ready(function () {
    // 設定を変更したときのイベントを登録
    setVideoSizeEvent();
    setScreenShotEvent();
    setFullScreenEvent();

    // 設定を画面上に反映
    refConfig();
});

function refConfig() {
    // 設定が読み込まれるまで待機
    if (videoSizeSaveData.isLoaded() === false ||
        screenShotSaveData.isLoaded() === false ||
        fullScreenSaveData.isLoaded() === false) {
        setTimeout(function () { refConfig() }, 1000);
        return;
    }
    // 設定が読み込まれたら反映
    refVideoSizeConfig();
    refScreenShotConfig();
    refFullScreenConfig();
}

function refVideoSizeConfig() {

    if (videoSizeSaveData.isLoaded() === false) return;


    $('input[name="videoSizeType"][value="' + videoSizeSaveData.type + '"]').prop('checked', true);
    $('#videoSizeFixed').prop('value', videoSizeSaveData.fixedSize);
    $('#videoSizeRatio').prop('value', videoSizeSaveData.ratioSize);

    $('#videoSizePower').prop('disabled', false);
    $('#videoSizePower').prop('checked', videoSizeSaveData.power);


    changeVideoSizePower();
}


function setVideoSizeEvent() {
    // on:offボタンを切り替えたときの処理
    $('#videoSizePower').change(function () {
        changeVideoSizePower();
    });

    // サイズタイプを切り替えたときの処理
    $('input[name="videoSizeType"]:radio').change(function () {
        changeVideoSizeType();
    });

    // 固定サイズを入力したときの処理
    $('#videoSizeFixed').change(function () {
        changeVideoSizeFixed();
    });

    // 初期化ボタンを押したときの処理
    $('#videoSizeInitButton').click(function () {
        pressVideoSizeInitButton();
    })

    // 割合サイズを入力したときの処理
    $('#videoSizeRatio').change(function () {
        changeVideoSizeRatio();
    });

}

// on:offボタンを切り替えたときの処理
function changeVideoSizePower() {
    var power = $('#videoSizePower').is(':checked');
    var boxRight = $('#videoSizeBox .customBoxRight');
    if (power) {
        boxRight.removeClass('disabled');
        boxRight.find('input').prop('disabled', false);
        changeVideoSizeType();
    }
    else {
        boxRight.addClass('disabled');
        boxRight.find('input').prop('disabled', true);
    }
    videoSizeSaveData.power = power;
}

function changeVideoSizeType() {
    var value = $('input[name="videoSizeType"]:checked').prop('value');

    videoSizeSaveData.type = value;
}

function changeVideoSizeFixed() {
    var sizeString = $('#videoSizeFixed').prop('value');
    var size = Number(sizeString);

    if (isNaN(size)) return;

    videoSizeSaveData.fixedSize = size;
}

function pressVideoSizeInitButton() {
    $('#videoSizeFixed').val(608).trigger('change');
}

function changeVideoSizeRatio() {
    var sizeString = $('#videoSizeRatio').prop('value');
    var size = Number(sizeString);

    if (isNaN(size)) return;

    videoSizeSaveData.ratioSize = size;
}



function refScreenShotConfig() {

    if (screenShotSaveData.isLoaded() === false) return;

    $('#screenShotPower').prop('disabled', false);
    $('#screenShotPower').prop('checked', screenShotSaveData.power);

    $('input[name="screenShotCarouselSize"][value="' + screenShotSaveData.size + '"]').prop('checked', true);
    $('input[name="screenShotAutoSave"]').prop('checked', screenShotSaveData.autoSave);

    changeScreenShotPower();
    changeScreenShotCarouselSize();
}


function setScreenShotEvent() {
    // on:offボタンを切り替えたときの処理
    $('#screenShotPower').change(function () {
        changeScreenShotPower();
    });

    // カルーセルサイズを切り替えたときの処理
    $('input[name="screenShotCarouselSize"]:radio').change(function () {
        changeScreenShotCarouselSize();
    });

    // 自動保存を切り替えたときの処理
    $('input[name="screenShotAutoSave"]:checkbox').change(function () {
        changeScreenShotAutoSave();
    });
}

// on:offボタンを切り替えたときの処理
function changeScreenShotPower() {
    var power = $('#screenShotPower').is(':checked');
    var boxRight = $('#screenShotBox .customBoxRight');
    if (power) {
        boxRight.removeClass('disabled');
        boxRight.find('input').prop('disabled', false);
    }
    else {
        boxRight.addClass('disabled');
        boxRight.find('input').prop('disabled', true);
    }
    screenShotSaveData.power = power;
}

// カルーセルサイズを切り替えたときの処理
function changeScreenShotCarouselSize() {
    var value = $('input[name="screenShotCarouselSize"]:checked').prop('value');

    screenShotSaveData.size = value;
}

// 自動保存を切り替えたときの処理
function changeScreenShotAutoSave() {
    var value = $('input[name="screenShotAutoSave"]').prop('checked');
    screenShotSaveData.autoSave = value;
}


function refFullScreenConfig() {

    if (fullScreenSaveData.isLoaded() === false) return;

    $('#fullScreenPower').prop('disabled', false);
    $('#fullScreenPower').prop('checked', fullScreenSaveData.power);

    changeFullScreenPower();
}

function setFullScreenEvent() {
    // on:offボタンを切り替えたときの処理
    $('#fullScreenPower').change(function () {
        changeFullScreenPower();
    });

}

// on:offボタンを切り替えたときの処理
function changeFullScreenPower() {
    var power = $('#fullScreenPower').is(':checked');
    var boxRight = $('#fullScreenBox .customBoxRight');
    if (power) {
        boxRight.removeClass('disabled');
        boxRight.find('input').prop('disabled', false);
    }
    else {
        boxRight.addClass('disabled');
        boxRight.find('input').prop('disabled', true);
    }
    fullScreenSaveData.power = power;
}


// 設定変更があったことをブラウザのタブに通知
function noticeVideoSizeSave() {
    noticeSave("videoSize", videoSizeSaveData.serializeSaveData());
}

function noticeScreenShotSave() {
    noticeSave("screenShot", screenShotSaveData.serializeSaveData());
}

function noticeFullScreenSave() {
    noticeSave("fullScreen", fullScreenSaveData.serializeSaveData());
}

function noticeSave(type, saveData) {
    // chrome.tabs.query => tabの配列をcallbackに渡してくる(N予備校のURLで絞る)
    // callback => tabの配列に設定が変更されたことを通知
    chrome.tabs.query({ url: ['*://www.nnn.ed.nico/lessons/*', '*://nnn.ed.nico/lessons/*'] }, function (tabs) {
        for (var tab of tabs) {
            chrome.tabs.sendMessage(tab.id, { type: type, saveData: saveData });
        }
    });

}

