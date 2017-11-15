'use strict';

// アイコンを押したときに出てくるポップアップの処理

// 保存された設定の読み込みは非同期のため、onload前に読んでおく
const videoSizeSaveData = new VideoSizeSaveData();
videoSizeSaveData.setSaveNotification(noticeVideoSizeSave);
const screenShotSaveData = new ScreenShotSaveData();
screenShotSaveData.setSaveNotification(noticeScreenShotSave);
const fullScreenSaveData = new FullScreenSaveData();
fullScreenSaveData.setSaveNotification(noticeFullScreenSave);
const textOpenLinkSaveData = new TextOpenLinkSaveData();
textOpenLinkSaveData.setSaveNotification(noticeTextOpenLinkSave);
const questionnaireSaveData = new QuestionnaireSaveData();
questionnaireSaveData.setSaveNotification(noticeQuestionnaireSave);


$(document).ready(function () {
    // 設定を変更したときのイベントを登録
    setVideoSizeEvent();
    setScreenShotEvent();
    setFullScreenEvent();
    setTextOpenLinkEvent();
    setQuestionnaireEvent();

    // 設定を画面上に反映
    refConfig();
});

function refConfig() {
    // 設定が読み込まれるまで待機
    if (videoSizeSaveData.isLoaded() === false ||
        screenShotSaveData.isLoaded() === false ||
        fullScreenSaveData.isLoaded() === false ||
        textOpenLinkSaveData.isLoaded() === false ||
        questionnaireSaveData.isLoaded() === false
    ) {
        setTimeout(function () { refConfig() }, 1000);
        return;
    }
    // 設定が読み込まれたら反映
    refVideoSizeConfig();
    refScreenShotConfig();
    refFullScreenConfig();
    refTextOpenLinkConfig();
    refQuestionnaireConfig();
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
    const power = $('#videoSizePower').is(':checked');
    const boxRight = $('#videoSizeBox .customBoxRight');
    if (power) {
        boxRight.removeClass('disabled');
        boxRight.find('input').prop('disabled', false);
    }
    else {
        boxRight.addClass('disabled');
        boxRight.find('input').prop('disabled', true);
    }
    videoSizeSaveData.power = power;
}

function changeVideoSizeType() {
    const value = $('input[name="videoSizeType"]:checked').prop('value');

    videoSizeSaveData.type = value;
}

function changeVideoSizeFixed() {
    const sizeString = $('#videoSizeFixed').prop('value');
    const size = Number(sizeString);

    if (isNaN(size)) return;

    videoSizeSaveData.fixedSize = size;
}

function pressVideoSizeInitButton() {
    $('#videoSizeFixed').val(608).trigger('change');
}

function changeVideoSizeRatio() {
    const sizeString = $('#videoSizeRatio').prop('value');
    const size = Number(sizeString);

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
    const power = $('#screenShotPower').is(':checked');
    const boxRight = $('#screenShotBox .customBoxRight');
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
    const value = $('input[name="screenShotCarouselSize"]:checked').prop('value');

    screenShotSaveData.size = value;
}

// 自動保存を切り替えたときの処理
function changeScreenShotAutoSave() {
    const value = $('input[name="screenShotAutoSave"]').prop('checked');
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
    const power = $('#fullScreenPower').is(':checked');
    const boxRight = $('#fullScreenBox .customBoxRight');
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


function refTextOpenLinkConfig() {

    if (textOpenLinkSaveData.isLoaded() === false) return;

    $('#textOpenLinkPower').prop('disabled', false);
    $('#textOpenLinkPower').prop('checked', textOpenLinkSaveData.power);

    changeTextOpenLinkPower();
}

function setTextOpenLinkEvent() {
    // on:offボタンを切り替えたときの処理
    $('#textOpenLinkPower').change(function () {
        changeTextOpenLinkPower();
    });

}

// on:offボタンを切り替えたときの処理
function changeTextOpenLinkPower() {
    const power = $('#textOpenLinkPower').is(':checked');
    const boxRight = $('#textOpenLinkBox .customBoxRight');
    if (power) {
        boxRight.removeClass('disabled');
        boxRight.find('input').prop('disabled', false);
    }
    else {
        boxRight.addClass('disabled');
        boxRight.find('input').prop('disabled', true);
    }
    textOpenLinkSaveData.power = power;
}

function refQuestionnaireConfig() {

    if (questionnaireSaveData.isLoaded() === false) return;

    $('#questionnairePower').prop('disabled', false);
    $('#questionnairePower').prop('checked', questionnaireSaveData.power);

    $('input[name="questionnaireAutoClose"]').prop('checked', questionnaireSaveData.autoClose);
    $('#questionnaireAutoCloseSeconds').prop('value', questionnaireSaveData.autoCloseSeconds);
    $('input[name="questionnaireShrink"]').prop('checked', questionnaireSaveData.shrink);
    $('#questionnaireShrinkRatio').prop('value', questionnaireSaveData.shrinkRatio);
    $('input[name="questionnaireChangeBackGroundColor"]').prop('checked', questionnaireSaveData.changeBackGroundColor);
    $('input[name="questionnaireMove"]').prop('checked', questionnaireSaveData.move);
    $('input[name="questionnaireMovePosition"][value="' + questionnaireSaveData.movePosition + '"]').prop('checked', true);
    $('input[name="questionnaireHiddenLive"]').prop('checked', questionnaireSaveData.hiddenLive);
    $('input[name="questionnaireHiddenArchive"]').prop('checked', questionnaireSaveData.hiddenArchive);

    changeQuestionnairePower();
}


function setQuestionnaireEvent() {
    // on:offボタンを切り替えたときの処理
    $('#questionnairePower').change(function () {
        changeQuestionnairePower();
    });

    // 結果を自動で閉じるを切り替えたときの処理
    $('input[name="questionnaireAutoClose"]:checkbox').change(function () {
        changeQuestionnaireAutoClose();
    });

    // 自動で閉じるまでの時間を入力したときの処理
    $('#questionnaireAutoCloseSeconds').change(function () {
        changeQuestionnaireAutoCloseSeconds();
    });

    // 縮小するを切り替えたときの処理
    $('input[name="questionnaireShrink"]:checkbox').change(function () {
        changeQuestionnaireShrink();
    });

    // 縮小サイズ(%)を入力したときの処理
    $('#questionnaireShrinkRatio').change(function () {
        changeQuestionnaireShrinkRatio();
    });

    // 背景を無色にするを切り替えたときの処理
    $('input[name="questionnaireChangeBackGroundColor"]:checkbox').change(function () {
        changeQuestionnaireChangeBackGroundColor();
    });

    // 端に寄せるを切り替えたときの処理
    $('input[name="questionnaireMove"]:checkbox').change(function () {
        changeQuestionnaireMove();
    });

    // 位置を切り替えたときの処理
    $('input[name="questionnaireMovePosition"]:radio').change(function () {
        changeQuestionnaireMovePosition();
    });

    // 生放送で非表示を切り替えたときの処理
    $('input[name="questionnaireHiddenLive"]:checkbox').change(function () {
        changeQuestionnaireHiddenLive();
    });

    // アーカイブで非表示を切り替えたときの処理
    $('input[name="questionnaireHiddenArchive"]:checkbox').change(function () {
        changeQuestionnaireHiddenArchive();
    });

}


function changeQuestionnaireAutoClose() {
    const value = $('input[name="questionnaireAutoClose"]:checkbox').prop('checked');
    questionnaireSaveData.autoClose = value;
}
function changeQuestionnaireAutoCloseSeconds() {
    const valueString = $('#questionnaireAutoCloseSeconds').prop('value');
    const value = Number(valueString);

    if (isNaN(value)) return;

    questionnaireSaveData.autoCloseSeconds = value;
}
function changeQuestionnaireShrink() {
    const value = $('input[name="questionnaireShrink"]:checkbox').prop('checked');
    questionnaireSaveData.shrink = value;
}
function changeQuestionnaireShrinkRatio() {
    const valueString = $('#questionnaireShrinkRatio').prop('value');
    const value = Number(valueString);

    if (isNaN(value)) return;

    if (value < 50) {
        $('#questionnaireShrinkRatio').val(50);
        value = 50;
    }

    questionnaireSaveData.shrinkRatio = value;
}
function changeQuestionnaireChangeBackGroundColor() {
    const value = $('input[name="questionnaireChangeBackGroundColor"]:checkbox').prop('checked');
    questionnaireSaveData.changeBackGroundColor = value;
}
function changeQuestionnaireMove() {
    const value = $('input[name="questionnaireMove"]:checkbox').prop('checked');
    questionnaireSaveData.move = value;
}
function changeQuestionnaireMovePosition() {
    const value = $('input[name="questionnaireMovePosition"]:checked').prop('value');
    questionnaireSaveData.movePosition = value;
}
function changeQuestionnaireHiddenLive() {
    const value = $('input[name="questionnaireHiddenLive"]:checkbox').prop('checked');
    questionnaireSaveData.hiddenLive = value;
}
function changeQuestionnaireHiddenArchive() {
    const value = $('input[name="questionnaireHiddenArchive"]:checkbox').prop('checked');
    questionnaireSaveData.hiddenArchive = value;
}


// on:offボタンを切り替えたときの処理
function changeQuestionnairePower() {
    const power = $('#questionnairePower').is(':checked');
    const boxRight = $('#questionnaireBox .customBoxRight');
    if (power) {
        boxRight.removeClass('disabled');
        boxRight.find('input').prop('disabled', false);
    }
    else {
        boxRight.addClass('disabled');
        boxRight.find('input').prop('disabled', true);
    }
    questionnaireSaveData.power = power;
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

function noticeTextOpenLinkSave() {
    noticeSave("textOpenLink", textOpenLinkSaveData.serializeSaveData());
}

function noticeQuestionnaireSave() {
    noticeSave("questionnaire", questionnaireSaveData.serializeSaveData());
}

function noticeSave(type, saveData) {
    // chrome.tabs.query => tabの配列をcallbackに渡してくる(N予備校のURLで絞る)
    // callback => tabの配列に設定が変更されたことを通知
    chrome.tabs.query({ url: ['*://www.nnn.ed.nico/lessons/*', '*://nnn.ed.nico/lessons/*', '*://www.nnn.ed.nico/courses/*', '*://nnn.ed.nico/courses/*'] }, function (tabs) {
        for (const tab of tabs) {
            chrome.tabs.sendMessage(tab.id, { type: type, saveData: saveData });
        }
    });

}

