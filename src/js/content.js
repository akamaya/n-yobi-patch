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

    // 現在開いているページのチェック
    let pageType;
    const saveData = {};
    const changeSetting = {};
    const init = {};
    const pageParts = {};
    let domChecker;

    // 放送ページ
    const urlCheckLessons = new RegExp("://www.nnn.ed.nico/lessons/\\d+");
    if (urlCheckLessons.test(location.href)) {
        pageType = 'lesson';
        saveData.videoSize = new VideoSizeSaveData();
        saveData.screenShot = new ScreenShotSaveData();
        saveData.fullScreen = new FullScreenSaveData();
        saveData.textOpenLink = new TextOpenLinkSaveData();
        saveData.questionnaire = new QuestionnaireSaveData();

        changeSetting.videoSize = changeSettingVideoSize;
        changeSetting.screenShot = changeSettingScreenShot;
        changeSetting.fullScreen = changeSettingFullScreen;
        changeSetting.textOpenLink = changeSettingTextOpenLink;
        changeSetting.questionnaire = changeSettingQuestionnaire;

        init.videoSize = initVideoSize;
        init.screenShot = initScreenShot;
        init.fullScreen = initFullScreen;
        init.textOpenLink = initTextOpenLink;
        init.questionnaire = initQuestionnaire;

        pageParts.screenShotCarousel = new ScreenShotCarousel();
        pageParts.fullScreenButton = new FullScreenButton();
        pageParts.screenMode = new ScreenMode(saveData.videoSize);
        pageParts.questionnaire = new Questionnaire(saveData.questionnaire);


        domChecker = () => R.vjsVideo3.length !== 0;
    }

    // 教材一覧ページ
    const urlCheckCourses = new RegExp("://www.nnn.ed.nico/courses/\\d+/chapters/\\d+");
    if (urlCheckCourses.test(location.href)) {
        pageType = 'courses';
        saveData.textOpenLink = new TextOpenLinkSaveData();

        changeSetting.textOpenLink = changeSettingTextOpenLink;

        pageParts.lessonPrint = new LessonPrint(saveData.textOpenLink);

        init.textOpenLink = initTextOpenLink;

        domChecker = () => $('div.lesson div.u-card').length !== 0;
    }

    // 教材ページ。解答を開いて表示に使用
    const urlCheckContentsLinks = new RegExp("://www.nnn.ed.nico/contents/links/\\d+");
    if (urlCheckContentsLinks.test(location.href)) {
        pageType = 'contentsLinks';
        saveData.textOpenLink = new TextOpenLinkSaveData();

        changeSetting.textOpenLink = changeSettingTextOpenLink;

        pageParts.lessonPrint = new LessonPrint(saveData.textOpenLink);

        init.textOpenLink = initTextOpenLink;

        domChecker = () => true;
    }

    if (!pageType) {
        return;
    }

    // $(document).readyやchrome.api等々のページ読み込み完了系イベントのあとでベージコンテンツが生成されるので
    // まことに遺憾ながらDOMチェックはポーリングで行う
    async function checkDom(checker) {
        return new Promise(function (resolve) {
            const id = setInterval(function () {
                // コメント用のレイヤーが作成されていればDomが生成完了とみなす
                if (checker()) {
                    clearInterval(id);
                    resolve(true);
                }
            }, 500);
        });
    }

    const loadingList = Object.values(saveData).map((save) => save.load());
    loadingList.push(checkDom(domChecker));

    Promise.all(loadingList).then(() => {
        Object.values(pageParts).forEach((parts) => parts.init());
        Object.values(init).forEach((ini) => ini());

        // chrome拡張のアイコンから設定を変更されたときの通知を受ける
        chrome.runtime.onMessage.addListener(settingMessageEvent);
        // シアターモードボタンの監視
        observeTheaterMode();
    });

    // 動画サイズ変更系の初期化
    function initVideoSize() {
        // 設定に合わせて動画サイズ変更
        if (saveData.videoSize.power === true) {
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
            if (saveData.videoSize.power === true && saveData.videoSize.type === 'ratio') {
                changeSettingVideoSize();
            }
        });

    }

    // スクショ系の初期化
    function initScreenShot() {
        // スクショデータを溜め込むカルーセルを表示させる
        pageParts.screenShotCarousel.insertDom();

        // おれおれカルーセルのため画面サイズが変わったら横幅の再計算が必要
        $(window).on('resize', function () {
            pageParts.screenShotCarousel.resize();
        });
        changeSettingScreenShot();
    }

    // 全画面系の初期化
    function initFullScreen() {
        pageParts.fullScreenButton.insertDom(clickFullScreenButton);
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
            pageParts.screenMode.changeFullScreen();
        }
        else {
            changeSettingVideoSize();
        }
    }

    function changeSettingFullScreen() {
        if (saveData.fullScreen.power === false) {
            pageParts.fullScreenButton.hide();
            changeSettingVideoSize();
            return;
        }
        pageParts.fullScreenButton.show();
    }

    // 動画サイズを変更
    function changeSettingVideoSize() {
        pageParts.screenMode.changeVideoSize();
        pageParts.fullScreenButton.off();// ESCボタンの解除
        pageParts.screenShotCarousel.resize();
    }

    function changeSettingScreenShot() {
        const sd = saveData.screenShot;
        ScreenShotCarousel.shortCutSetting(sd.power, sd.shortCut, sd.shortCutKey1, sd.shortCutKey2, sd.autoSave);
        if (sd.power === false) {
            ScreenShotCarousel.hide();
            return;
        }

        pageParts.screenShotCarousel.autoSave = sd.autoSave;
        ScreenShotCarousel.show();
        pageParts.screenShotCarousel.resize(sd.size);
    }

    function changeSettingTextOpenLink() {
        if (pageParts.lessonPrint) {
            pageParts.lessonPrint.onoff();
        }

        if (saveData.textOpenLink.power === false) {
            TextOpenLink.hide();
            return;
        }
        TextOpenLink.show();
    }

    function changeSettingQuestionnaire() {
        pageParts.questionnaire.reset();
    }

    // シアターモードの監視
    function observeTheaterMode() {
        if (R.componentLessonBody.length === 0) {
            return;
        }

        function handleMutations() {
            pageParts.screenMode.theaterModeButtonClickEventHandle();

            if (ScreenMode.isTheaterMode()) {
                pageParts.fullScreenButton.off();// ESCボタンの解除
            }
            pageParts.screenShotCarousel.resize();
        }

        const observer = new MutationObserver(handleMutations);
        const config = {attributes: true};
        observer.observe(R.componentLessonBody.get(0), config);
    }

    function settingMessageEvent(msg) {
        if (saveData[msg.type]) {
            saveData[msg.type].setSaveData(msg.saveData);
        }

        if (changeSetting[msg.type]) {
            changeSetting[msg.type]();
        }
    }

})();



