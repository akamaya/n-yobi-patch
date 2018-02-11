'use strict';
import $ from 'jQuery';

// DOMのリソース管理
// class名などがハッシュ化されてしまったので名前をつけたい
export default class Resources {

    get windowWidth() {
        return $(window).width();
    }

    get windowHeight() {
        return $(window).height();
    }


    get componentLessonHeader() {
        return $('#root > div > div[class]').eq(0);
    }

    get componentLessonBody() {
        return $('#root > div > div[class]').eq(1);
    }

    //旧 '.component-lesson-left-column',
    get componentLessonLeftColumn() {
        return this.componentLessonBody.children().eq(0);
    }

    // 旧 '.component-lesson-right-column' 画面の右側要素
    get componentLessonRightColumn() {
        return this.componentLessonBody.children().eq(1);
    }

    get componentLessonLeftColumnGrandson() {
        return this.componentLessonLeftColumn.children().children().eq(0);
    }

    get commentForm() {
        return $('#root > div > div[class] > div[class] > div > div > div[class]:has(form)');
    }

    get commentLayer() {
        return $('#comment-layer');
    }

    // 旧'.component-lesson-player',
    get componentLessonPlayer() {
        return $('#vjs_video_3').parent().parent();
    }

    get vjsVideo3() {
        return $('#vjs_video_3');
    }

    // 旧'.component-lesson-left-column-player-container'
    get componentLessonLeftColumnPlayerContainer() {
        // #vjs_video_3の兄弟要素のdiv
        return $('#vjs_video_3 ~ div');
    }

    // 運営コメントのバー
    get unneiCommentBar() {
        return this.componentLessonLeftColumnGrandson.children().eq(0).children().eq(0);
    }

    // 旧 '.component-lesson-interaction-bar-event-information' 運営コメがないときは存在しない
    get componentLessonInteractionBarEventInformation() {
        return this.unneiCommentBar.children().children();
    }

    // アンケートをひっつけるroot
    get modalRoot() {
        return $('div.ReactModalPortal').eq(0);
    }

    // アンケートの背景
    get questionnaireBackGround() {
        return $('div.ReactModalPortal div[data-reactroot]').eq(0);
    }

    // アンケートフレーム
    get questionnaireFrame() {
        return this.questionnaireBackGround.children();
    }

    // アンケートヘッダ
    get questionnaireHeader() {
        return this.questionnaireFrame.find('header');
    }

    // アンケートボディ
    get questionnaireBody() {
        return this.questionnaireFrame.children('div').eq(1).children().eq(0).children('div').children();
    }

    // アンケート質問
    get questionnaireQuestion() {
        return this.questionnaireBody.children().eq(0);
    }

    // アンケート解答フレーム
    get questionnaireAnswerFrame() {
        return this.questionnaireBody.children().eq(2);
    }

    // アンケート解答欄(複数)
    get questionnaireAnswerButton() {
        return this.questionnaireAnswerFrame.children().children();
    }

    // アンケート閉じるボタン
    get questionnaireCloseButton() {
        return this.questionnaireBackGround.find('i').eq(0)
    }

    // 経過時間
    get elapsedTime() {
        return this.componentLessonLeftColumnPlayerContainer.find('time');
    }

}
