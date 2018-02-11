class Resources {
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

    get elapsedTime() {
        // #vjs_video_3の兄弟要素のdivの子孫のtime
        return $('#vjs_video_3 ~ div time');
    }

}

const R = new Resources();