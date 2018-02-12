'use strict';
import $ from 'jquery';

// DOMのリソース管理
// class名などがハッシュ化されてしまったので名前をつけたい
export default class Resources {

    static get windowWidth() {
        return $(window).width();
    }

    static get componentLessonHeader() {
        return $('#root').find('> div > div[class]').eq(0);
    }

    static get componentLessonBody() {
        return $('#root').find('> div > div[class]').eq(1);
    }

    //旧 '.component-lesson-left-column',
    static get componentLessonLeftColumn() {
        return this.componentLessonBody.children().eq(0);
    }

    // 旧 '.component-lesson-right-column' 画面の右側要素
    static get componentLessonRightColumn() {
        return this.componentLessonBody.children().eq(1);
    }

    static get componentLessonLeftColumnGrandson() {
        return this.componentLessonLeftColumn.children().children().eq(0);
    }

    static get commentForm() {
        return $('#root').find('> div > div[class] > div[class] > div > div > div[class]:has(form)');
    }

    static get commentLayer() {
        return $('#comment-layer');
    }

    static get vjsVideo3() {
        return $('#vjs_video_3');
    }

    // 旧'.component-lesson-player',
    static get componentLessonPlayer() {
        return this.vjsVideo3.parent().parent();
    }

    // 旧'.component-lesson-left-column-player-container'
    static get componentLessonLeftColumnPlayerContainer() {
        // #vjs_video_3の兄弟要素のdiv
        return this.vjsVideo3.find('~ div');
    }

    static get controlBar() {
        return this.componentLessonLeftColumnPlayerContainer.children().eq(1);
    }

    static get controlBarTheaterModeIcon() {
        return this.controlBar.find('i').eq(2);
    }

    // 運営コメントのバー
    static get unneiCommentBar() {
        return this.componentLessonLeftColumnGrandson.children().eq(0).children().eq(0);
    }

    // 旧 '.component-lesson-interaction-bar-event-information' 運営コメがないときは存在しない
    static get componentLessonInteractionBarEventInformation() {
        return this.unneiCommentBar.children().children();
    }

    // アンケートをひっつけるroot
    static get modalRoot() {
        return $('div.ReactModalPortal').eq(0);
    }

    // アンケートの背景
    static get questionnaireBackGround() {
        return $('div.ReactModalPortal div[data-reactroot]').eq(0);
    }

    // アンケートフレーム
    static get questionnaireFrame() {
        return this.questionnaireBackGround.children();
    }

    // アンケートヘッダ
    static get questionnaireHeader() {
        return this.questionnaireFrame.find('header');
    }

    // アンケートボディ
    static get questionnaireBody() {
        return this.questionnaireFrame.children('div').eq(1).children().eq(0).children('div').children();
    }

    // アンケート質問
    static get questionnaireQuestion() {
        return this.questionnaireBody.children().eq(0);
    }

    // アンケート解答フレーム
    static get questionnaireAnswerFrame() {
        return this.questionnaireBody.children().eq(2);
    }

    // アンケート解答欄(複数)
    static get questionnaireAnswerButton() {
        return this.questionnaireAnswerFrame.children().children();
    }

    // アンケート閉じるボタン
    static get questionnaireCloseButton() {
        return this.questionnaireBackGround.find('i').eq(0)
    }

    // 経過時間
    static get elapsedTime() {
        return this.componentLessonLeftColumnPlayerContainer.find('time');
    }

}
