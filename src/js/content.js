import $ from 'jquery';
import FullScreenSaveData from './FullScreenSaveData';
import VideoSizeSaveData from './VideoSizeSaveData';
import ScreenShotSaveData from './ScreenShotSaveData';
import TextOpenLinkSaveData from './TextOpenLinkSaveData';
import QuestionnaireSaveData from './QuestionnaireSaveData';

import ScreenShotCarousel from './ScreenShotCarousel';
import FullScreenButton from './FullScreenButton';
import ScreenMode from './ScreenMode';
import TextOpenLink from './TextOpenLink';
import Questionnaire from './Questionnaire';
import LessonPrint from './LessonPrint';
import R from "./Resources";

(function () {
    'use strict';

    // 既存の画面にコンテンツを追加していく処理

    const videoSizeSaveData = new VideoSizeSaveData();
    const screenShotSaveData = new ScreenShotSaveData();
    const fullScreenSaveData = new FullScreenSaveData();
    const textOpenLinkSaveData = new TextOpenLinkSaveData();
    const questionnaireSaveData = new QuestionnaireSaveData();

    const carousel = new ScreenShotCarousel();
    const fullScreenButton = new FullScreenButton();
    const screenMode = new ScreenMode(videoSizeSaveData);
    const questionnaire = new Questionnaire(questionnaireSaveData);

    // 放送ページでないならなにもせず終了
    const urlCheckLessons = new RegExp("://www.nnn.ed.nico/lessons/\\d+");
    if (urlCheckLessons.test(location.href)) {
        // $(document).readyやchrome.api等々のページ読み込み完了系イベントのあとで
        // ベージコンテンツが生成されるのでDOMチェックはポーリングで
        const id = setInterval(function () {
            if (R.commentLayer.length === 0 ||
                videoSizeSaveData.isLoaded() === false ||
                screenShotSaveData.isLoaded() === false ||
                fullScreenSaveData.isLoaded() === false ||
                textOpenLinkSaveData.isLoaded() === false ||
                questionnaireSaveData.isLoaded() === false
            ) return;

            clearInterval(id);

            screenMode.init();
            questionnaire.init();
            initVideoSize();
            initScreenShot();
            initFullScreen();
            initTextOpenLink();
            initQuestionnaire();

            // chrome拡張のアイコンから設定を変更されたときの通知を受ける
            chrome.runtime.onMessage.addListener(function (msg) {
                if (msg.type === "videoSize") {
                    videoSizeSaveData.setSaveData(msg.saveData);
                    changeSettingVideoSize();
                }
                else if (msg.type === "screenShot") {
                    screenShotSaveData.setSaveData(msg.saveData);
                    changeSettingScreenShot();
                }
                else if (msg.type === "fullScreen") {
                    fullScreenSaveData.setSaveData(msg.saveData);
                    changeSettingFullScreen();
                }
                else if (msg.type === "textOpenLink") {
                    textOpenLinkSaveData.setSaveData(msg.saveData);
                    changeSettingTextOpenLink();
                }
                else if (msg.type === "questionnaire") {
                    questionnaireSaveData.setSaveData(msg.saveData);
                    changeSettingQuestionnaire();
                }

            });
            // シアターモードボタンの監視
            observeTheaterMode();
        }, 500);
    }

    // 教材ページでないならなにもせず終了
    const lessonPrint = new LessonPrint(textOpenLinkSaveData);
    const urlcheckCourses = new RegExp("://www.nnn.ed.nico/courses/\\d+/chapters/\\d+");
    const urlcheckContents = new RegExp("://www.nnn.ed.nico/contents/links/\\d+");
    if (urlcheckCourses.test(location.href) || urlcheckContents.test(location.href)) {
        const id = setInterval(function () {
            if (textOpenLinkSaveData.isLoaded() === false) return;
            clearInterval(id);


            lessonPrint.init();


            // chrome拡張のアイコンから設定を変更されたときの通知を受ける
            chrome.runtime.onMessage.addListener(function (msg) {
                if (msg.type === "textOpenLink") {
                    textOpenLinkSaveData.setSaveData(msg.saveData);
                    changeSettingTextOpenLinkPrint();
                }

            });
        }, 500);
    }

    // 動画サイズ変更系の初期化
    function initVideoSize() {
        // 設定に合わせて動画サイズ変更
        if (videoSizeSaveData.power === true) {
            changeSettingVideoSize();
        }

        // windowサイズが変更されたときの処理
        $(window).on('resize', function () {
            // シアターモード中はなにもしない
            if (ScreenMode.isTheaterMode()) {
                return;
            }
            // フルスクリーン中ならなにもしない
            if (ScreenMode.isFullScreen()) {
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
        $(window).on('resize', function () {
            carousel.resize();
        });
        changeSettingScreenShot();
    }

    // 全画面系の初期化
    function initFullScreen() {
        fullScreenButton.insertDom(clickFullScreenButton);
        changeSettingFullScreen();
    }

    // テキストURLリンク
    function initTextOpenLink() {
        TextOpenLink.insertDom();
        changeSettingTextOpenLink();
    }

    // アンケート
    function initQuestionnaire() {
        changeSettingQuestionnaire();
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
            ScreenShotCarousel.hide();
            return;
        }
        carousel.autoSave = screenShotSaveData.autoSave;
        ScreenShotCarousel.show();
        carousel.resize(screenShotSaveData.size);
    }

    function changeSettingTextOpenLink() {
        if (textOpenLinkSaveData.power === false) {
            TextOpenLink.hide();
            return;
        }
        TextOpenLink.show();
    }

    function changeSettingQuestionnaire() {
        questionnaire.reset();
    }

    function changeSettingTextOpenLinkPrint() {
        lessonPrint.onoff();
    }

    // シアターモードの監視
    function observeTheaterMode() {
        function handleMutations() {
            screenMode.theaterModeButtonClickEventHandle();

            if (ScreenMode.isTheaterMode()) {
                fullScreenButton.off();// ESCボタンの解除
            }
            carousel.resize();
        }

        const observer = new MutationObserver(handleMutations);
        const config = {attributes: true};
        observer.observe(document.querySelector('#root > div > div[class]:nth-child(2)'), config);
    }

})();


