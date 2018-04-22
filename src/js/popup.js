'use strict';
// アイコンを押したときに出てくるポップアップの処理

import $ from 'jquery';
import VideoSizeSaveData from "./VideoSizeSaveData";
import FullScreenSaveData from './FullScreenSaveData';
import TextOpenLinkSaveData from './TextOpenLinkSaveData';
import QuestionnaireSaveData from './QuestionnaireSaveData';
import ScreenShotSaveData from './ScreenShotSaveData';


$(function () {
    // 保存された設定の読み込みは非同期のため、onload前に読んでおく

    const saveData = {
        videoSize: new VideoSizeSaveData(),
        screenShot: new ScreenShotSaveData(),
        fullScreen: new FullScreenSaveData(),
        textOpenLink: new TextOpenLinkSaveData(),
        questionnaire: new QuestionnaireSaveData(),
    };

    saveData.videoSize.setSaveNotification(noticeVideoSizeSave);
    saveData.screenShot.setSaveNotification(noticeScreenShotSave);
    saveData.fullScreen.setSaveNotification(noticeFullScreenSave);
    saveData.textOpenLink.setSaveNotification(noticeTextOpenLinkSave);
    saveData.questionnaire.setSaveNotification(noticeQuestionnaireSave);

    // 設定を変更したときのイベントを登録
    setVideoSizeEvent();
    setScreenShotEvent();
    setFullScreenEvent();
    setTextOpenLinkEvent();
    setQuestionnaireEvent();


    const loadingList = Object.values(saveData).map((save) => save.load());
    Promise.all(loadingList).then(() => {
        // 設定が読み込まれたら反映
        refVideoSizeConfig();
        refScreenShotConfig();
        refFullScreenConfig();
        refTextOpenLinkConfig();
        refQuestionnaireConfig();
    });

    function refVideoSizeConfig() {
        $('input[name="videoSizeType"][value="' + saveData.videoSize.type + '"]').prop('checked', true);
        $('#videoSizeFixed').prop('value', saveData.videoSize.fixedSize);
        $('#videoSizeRatio').prop('value', saveData.videoSize.ratioSize);

        $('#videoSizePower').prop('disabled', false).prop('checked', saveData.videoSize.power);


        changeVideoSizePower();
    }


    function setVideoSizeEvent() {
        // on:offボタンを切り替えたときの処理
        $('#videoSizePower').on('change', function () {
            changeVideoSizePower();
        });

        // サイズタイプを切り替えたときの処理
        $('input[name="videoSizeType"]:radio').on('change', function () {
            changeVideoSizeType();
        });

        // 固定サイズを入力したときの処理
        $('#videoSizeFixed').on('change', function () {
            changeVideoSizeFixed();
        });

        // 初期化ボタンを押したときの処理
        $('#videoSizeInitButton').on('click', function () {
            pressVideoSizeInitButton();
        });

        // 割合サイズを入力したときの処理
        $('#videoSizeRatio').on('change', function () {
            changeVideoSizeRatio();
        });

    }

    // on:offボタンを切り替えたときの処理
    function changeVideoSizePower() {
        const power = $('#videoSizePower').is(':checked');
        const boxRight = $('#videoSizeBox').find('.customBoxRight');
        if (power) {
            boxRight.removeClass('disabled');
            boxRight.find('input').prop('disabled', false);
        }
        else {
            boxRight.addClass('disabled');
            boxRight.find('input').prop('disabled', true);
        }
        saveData.videoSize.power = power;
    }

    function changeVideoSizeType() {
        saveData.videoSize.type = $('input[name="videoSizeType"]:checked').prop('value');
    }

    function changeVideoSizeFixed() {
        const sizeString = $('#videoSizeFixed').prop('value');
        const size = Number(sizeString);

        if (isNaN(size)) return;

        saveData.videoSize.fixedSize = size;
    }

    function pressVideoSizeInitButton() {
        $('#videoSizeFixed').val(608).trigger('change');
    }

    function changeVideoSizeRatio() {
        const sizeString = $('#videoSizeRatio').prop('value');
        const size = Number(sizeString);

        if (isNaN(size)) return;

        saveData.videoSize.ratioSize = size;
    }


    function refScreenShotConfig() {
        $('#screenShotPower').prop('disabled', false).prop('checked', saveData.screenShot.power);

        $('input[name="screenShotCarouselSize"][value="' + saveData.screenShot.size + '"]').prop('checked', true);
        $('input[name="screenShotShortCut"]').prop('checked', saveData.screenShot.shortCut);
        $('input[name="screenShotAutoSave"]').prop('checked', saveData.screenShot.autoSave);
        $('select[name="screenShotShortCutKey1"]').val(saveData.screenShot.shortCutKey1);
        $('select[name="screenShotShortCutKey2"]').val(saveData.screenShot.shortCutKey2);

        changeScreenShotPower();
        changeScreenShotCarouselSize();
    }


    function setScreenShotEvent() {
        // on:offボタンを切り替えたときの処理
        $('#screenShotPower').on('change', function () {
            changeScreenShotPower();
        });

        // カルーセルサイズを切り替えたときの処理
        $('input[name="screenShotCarouselSize"]:radio').on('change', function () {
            changeScreenShotCarouselSize();
        });

        // ショートカットを切り替えた時の処理
        $('input[name="screenShotShortCut"]:checkbox').on('change', function () {
            changeScreenShotShortCut();
        });

        // ショートカットkey1を切り替えた時の処理
        $('select[name="screenShotShortCutKey1"]').on('change', function () {
            changeScreenShotShortCutKey1();
        });

        // ショートカットkey2を切り替えた時の処理
        $('select[name="screenShotShortCutKey2"]').on('change', function () {
            changeScreenShotShortCutKey2();
        });

        // 自動保存を切り替えたときの処理
        $('input[name="screenShotAutoSave"]:checkbox').on('change', function () {
            changeScreenShotAutoSave();
        });
    }

    // on:offボタンを切り替えたときの処理
    function changeScreenShotPower() {
        const power = $('#screenShotPower').is(':checked');
        const boxRight = $('#screenShotBox').find('.customBoxRight');
        if (power) {
            boxRight.removeClass('disabled');
            boxRight.find('input').prop('disabled', false);
            boxRight.find('select').prop('disabled', false);
        }
        else {
            boxRight.addClass('disabled');
            boxRight.find('input').prop('disabled', true);
            boxRight.find('select').prop('disabled', true);
        }
        saveData.screenShot.power = power;
    }

    // カルーセルサイズを切り替えたときの処理
    function changeScreenShotCarouselSize() {
        saveData.screenShot.size = $('input[name="screenShotCarouselSize"]:checked').prop('value');
    }

    // ショートカットを切り替えた時の処理
    function changeScreenShotShortCut() {
        saveData.screenShot.shortCut = $('input[name="screenShotShortCut"]:checked').prop('checked');
    }

    // ショートカットkey1を切り替えた時の処理
    function changeScreenShotShortCutKey1() {
        saveData.screenShot.shortCutKey1 = $('select[name="screenShotShortCutKey1"]').val();
    }

    // ショートカットkey2を切り替えた時の処理
    function changeScreenShotShortCutKey2() {
        saveData.screenShot.shortCutKey2 = $('select[name="screenShotShortCutKey2"]').val();
    }

    // 自動保存を切り替えたときの処理
    function changeScreenShotAutoSave() {
        saveData.screenShot.autoSave = $('input[name="screenShotAutoSave"]').prop('checked');
    }


    function refFullScreenConfig() {
        $('#fullScreenPower').prop('disabled', false).prop('checked', saveData.fullScreen.power);

        changeFullScreenPower();
    }

    function setFullScreenEvent() {
        // on:offボタンを切り替えたときの処理
        $('#fullScreenPower').on('change', function () {
            changeFullScreenPower();
        });

    }

    // on:offボタンを切り替えたときの処理
    function changeFullScreenPower() {
        const power = $('#fullScreenPower').is(':checked');
        const boxRight = $('#fullScreenBox').find('.customBoxRight');
        if (power) {
            boxRight.removeClass('disabled');
            boxRight.find('input').prop('disabled', false);
        }
        else {
            boxRight.addClass('disabled');
            boxRight.find('input').prop('disabled', true);
        }
        saveData.fullScreen.power = power;
    }


    function refTextOpenLinkConfig() {
        $('#textOpenLinkPower').prop('disabled', false).prop('checked', saveData.textOpenLink.power);

        changeTextOpenLinkPower();
    }

    function setTextOpenLinkEvent() {
        // on:offボタンを切り替えたときの処理
        $('#textOpenLinkPower').on('change', function () {
            changeTextOpenLinkPower();
        });

    }

    // on:offボタンを切り替えたときの処理
    function changeTextOpenLinkPower() {
        const power = $('#textOpenLinkPower').is(':checked');
        const boxRight = $('#textOpenLinkBox').find('.customBoxRight');
        if (power) {
            boxRight.removeClass('disabled');
            boxRight.find('input').prop('disabled', false);
        }
        else {
            boxRight.addClass('disabled');
            boxRight.find('input').prop('disabled', true);
        }
        saveData.textOpenLink.power = power;
    }

    function refQuestionnaireConfig() {

        $('#questionnairePower').prop('disabled', false).prop('checked', saveData.questionnaire.power);

        $('input[name="questionnaireAutoClose"]').prop('checked', saveData.questionnaire.autoClose);
        $('#questionnaireAutoCloseSeconds').prop('value', saveData.questionnaire.autoCloseSeconds);
        $('input[name="questionnaireShrink"]').prop('checked', saveData.questionnaire.shrink);
        $('#questionnaireShrinkRatio').prop('value', saveData.questionnaire.shrinkRatio);
        $('input[name="questionnaireChangeBackGroundColor"]').prop('checked', saveData.questionnaire.changeBackGroundColor);
        $('input[name="questionnaireMove"]').prop('checked', saveData.questionnaire.move);
        $('input[name="questionnaireMovePosition"][value="' + saveData.questionnaire.movePosition + '"]').prop('checked', true);
        $('input[name="questionnaireHiddenLive"]').prop('checked', saveData.questionnaire.hiddenLive);
        $('input[name="questionnaireHiddenArchive"]').prop('checked', saveData.questionnaire.hiddenArchive);

        changeQuestionnairePower();
    }


    function setQuestionnaireEvent() {
        // on:offボタンを切り替えたときの処理
        $('#questionnairePower').on('change', function () {
            changeQuestionnairePower();
        });

        // 結果を自動で閉じるを切り替えたときの処理
        $('input[name="questionnaireAutoClose"]:checkbox').on('change', function () {
            changeQuestionnaireAutoClose();
        });

        // 自動で閉じるまでの時間を入力したときの処理
        $('#questionnaireAutoCloseSeconds').on('change', function () {
            changeQuestionnaireAutoCloseSeconds();
        });

        // 縮小するを切り替えたときの処理
        $('input[name="questionnaireShrink"]:checkbox').on('change', function () {
            changeQuestionnaireShrink();
        });

        // 縮小サイズ(%)を入力したときの処理
        $('#questionnaireShrinkRatio').on('change', function () {
            changeQuestionnaireShrinkRatio();
        });

        // 背景を無色にするを切り替えたときの処理
        $('input[name="questionnaireChangeBackGroundColor"]:checkbox').on('change', function () {
            changeQuestionnaireChangeBackGroundColor();
        });

        // 端に寄せるを切り替えたときの処理
        $('input[name="questionnaireMove"]:checkbox').on('change', function () {
            changeQuestionnaireMove();
        });

        // 位置を切り替えたときの処理
        $('input[name="questionnaireMovePosition"]:radio').on('change', function () {
            changeQuestionnaireMovePosition();
        });

        // 生放送で非表示を切り替えたときの処理
        $('input[name="questionnaireHiddenLive"]:checkbox').on('change', function () {
            changeQuestionnaireHiddenLive();
        });

        // アーカイブで非表示を切り替えたときの処理
        $('input[name="questionnaireHiddenArchive"]:checkbox').on('change', function () {
            changeQuestionnaireHiddenArchive();
        });

    }


    function changeQuestionnaireAutoClose() {
        saveData.questionnaire.autoClose = $('input[name="questionnaireAutoClose"]:checkbox').prop('checked');
    }

    function changeQuestionnaireAutoCloseSeconds() {
        const valueString = $('#questionnaireAutoCloseSeconds').prop('value');
        const value = Number(valueString);

        if (isNaN(value)) return;

        saveData.questionnaire.autoCloseSeconds = value;
    }

    function changeQuestionnaireShrink() {
        saveData.questionnaire.shrink = $('input[name="questionnaireShrink"]:checkbox').prop('checked');
    }

    function changeQuestionnaireShrinkRatio() {
        const ratio = $('#questionnaireShrinkRatio');
        const valueString = ratio.prop('value');
        let value = Number(valueString);

        if (isNaN(value)) return;

        if (value < 50) {
            ratio.val(50);
            value = 50;
        }

        saveData.questionnaire.shrinkRatio = value;
    }

    function changeQuestionnaireChangeBackGroundColor() {
        saveData.questionnaire.changeBackGroundColor = $('input[name="questionnaireChangeBackGroundColor"]:checkbox').prop('checked');
    }

    function changeQuestionnaireMove() {
        saveData.questionnaire.move = $('input[name="questionnaireMove"]:checkbox').prop('checked');
    }

    function changeQuestionnaireMovePosition() {
        saveData.questionnaire.movePosition = $('input[name="questionnaireMovePosition"]:checked').prop('value');
    }

    function changeQuestionnaireHiddenLive() {
        saveData.questionnaire.hiddenLive = $('input[name="questionnaireHiddenLive"]:checkbox').prop('checked');
    }

    function changeQuestionnaireHiddenArchive() {
        saveData.questionnaire.hiddenArchive = $('input[name="questionnaireHiddenArchive"]:checkbox').prop('checked');
    }


    // on:offボタンを切り替えたときの処理
    function changeQuestionnairePower() {
        const power = $('#questionnairePower').is(':checked');
        const boxRight = $('#questionnaireBox').find('.customBoxRight');
        if (power) {
            boxRight.removeClass('disabled');
            boxRight.find('input').prop('disabled', false);
        }
        else {
            boxRight.addClass('disabled');
            boxRight.find('input').prop('disabled', true);
        }
        saveData.questionnaire.power = power;
    }

    // 設定変更があったことをブラウザのタブに通知
    function noticeVideoSizeSave() {
        noticeSave("videoSize", saveData.videoSize.serializeSaveData());
    }

    function noticeScreenShotSave() {
        noticeSave("screenShot", saveData.screenShot.serializeSaveData());
    }

    function noticeFullScreenSave() {
        noticeSave("fullScreen", saveData.fullScreen.serializeSaveData());
    }

    function noticeTextOpenLinkSave() {
        noticeSave("textOpenLink", saveData.textOpenLink.serializeSaveData());
    }

    function noticeQuestionnaireSave() {
        noticeSave("questionnaire", saveData.questionnaire.serializeSaveData());
    }

    function noticeSave(type, saveData) {
        // chrome.tabs.query => tabの配列をcallbackに渡してくる(N予備校のURLで絞る)
        // callback => tabの配列に設定が変更されたことを通知
        chrome.tabs.query({url: ['*://www.nnn.ed.nico/lessons/*', '*://nnn.ed.nico/lessons/*', '*://www.nnn.ed.nico/courses/*', '*://nnn.ed.nico/courses/*']}, function (tabs) {
            for (const tab of tabs) {
                chrome.tabs.sendMessage(tab.id, {type: type, saveData: saveData});
            }
        });

    }

});
