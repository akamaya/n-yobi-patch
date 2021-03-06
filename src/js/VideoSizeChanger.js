'use strict';

// videoサイズ変更を管理する

import R from './Resources';
import StyleChangerList from './StyleChangerList';

export default class VideoSizeChanger {
    constructor() {
        this.data = {
            originWidth: 608,
            originHeight: 342,
        };
    }

    static reset() {
        VideoSizeChanger._makeVideoStyleChanger().revert();
        VideoSizeChanger._makeRightColumnStyleChanger().revert();
        VideoSizeChanger._makeHiddenStyleChanger().revert();
        VideoSizeChanger._makeCenterStyleChanger().revert();
        VideoSizeChanger._makeCommentBoxStyleChanger().revert();
    }

    // ビデオコンポーネントのスタイル変更
    static _makeVideoStyleChanger() {
        const components = [
            //旧 '.component-lesson-left-column',
            R.componentLessonLeftColumn,

            R.componentLessonLeftColumnGrandson,

            // 旧'.component-lesson-left-column-player-container'
            R.componentLessonLeftColumnPlayerContainer,

            R.vjsVideo3,

            //旧'.component-lesson-player',
            R.componentLessonPlayer,
        ];

        return new StyleChangerList(components);
    }

    // コメント入力ボックスのスタイル変更
    static _makeCommentBoxStyleChanger() {
        const components = [
            // コメント入力フォーム(生放送のみ)
            R.commentForm,
        ];

        return new StyleChangerList(components);
    }

    // 右側(教科書ゾーン)のスタイル変更
    static _makeRightColumnStyleChanger() {
        const components = [
            // 旧 '.component-lesson-right-column' 画面の右側要素
            R.componentLessonRightColumn,
        ];

        return new StyleChangerList(components);
    }

    // ヘッダ、コメントフォーム、スクショボックスを全画面時に隠す
    static _makeHiddenStyleChanger() {
        const components = [
            // 旧 '.component-lesson-header',
            R.componentLessonHeader,
            R.commentForm,
            '#screenShotBox',
        ];

        return new StyleChangerList(components);
    }

    // 画面中央に乗せるパーツのスタイル変更
    static _makeCenterStyleChanger() {
        const components = [
            R.commentLayer,
        ];

        return new StyleChangerList(components);
    }

    // 動画サイズを変更する前に呼び出してね
    init() {
        // 初期動画サイズを取得
        const videoComponent = R.commentLayer;
        this.data.originWidth = videoComponent.width();
        this.data.originHeight = videoComponent.height();
        this._observeUnneiComment();
    }

    changeFullScreen() {
        const videoCss = {
            'position': 'fixed',
            'width': '100%',
            'height': '100%',
            'top': '0px',
            'left': '0px',
            'bottom': '0px',
            'right': '0px',
            'display': 'block',
        };

        VideoSizeChanger._makeVideoStyleChanger().setStyle(videoCss);
        VideoSizeChanger._makeHiddenStyleChanger().setStyle({'z-index': '-1', 'display': 'none'});
        VideoSizeChanger._makeRightColumnStyleChanger().setStyle({'visibility': 'hidden'});

        this._changeCommentComponent();

    }

    // フルスクリーン状態かどうか
    static isFullScreen() {
        return R.componentLessonHeader.css('z-index') === '-1';
    }

    // 指定したサイズに変更
    changeVideoSize(width) {

        if (!width) {
            width = this.data.originWidth;
        }

        // 旧'.component-lesson-left-column' 画面の左側要素
        if (R.componentLessonLeftColumn.length === 0) {
            return;
        }

        // 画面サイズを修正
        VideoSizeChanger._makeVideoStyleChanger().setStyle({'width': width});
        VideoSizeChanger._makeCommentBoxStyleChanger().setStyle({'width': width});

        // 右テキストの位置を修正
        VideoSizeChanger._makeRightColumnStyleChanger().setStyle({'margin-left': (width + 32) + 'px'});
    }

    changeVideoRatio(ratio) {
        const width = Math.ceil(R.windowWidth * ratio / 100);
        this.changeVideoSize(width);
    }

    // コメントコンポーネントを画面サイズにフィットさせる
    // 全画面のときに画面上部の余った黒塗り部分にコメントが表示されるのを防ぐ
    _changeCommentComponent() {
        const width = R.vjsVideo3.width();
        const height = this.data.originHeight * width / this.data.originWidth;
        const comeCss = {
            'width': width,
            'height': height,
            'top': '50%',
            'left': '50%',
            'transform': 'translate(-50%,-50%)',
        };
        VideoSizeChanger._makeCenterStyleChanger().setStyle(comeCss);
    }

    // 全画面中の運営コメ監視
    // 運営コメはdomの追加と削除を繰り返すので親domを監視して追加があればz-indexをセットする
    _observeUnneiComment() {

        function handleMutations() {
            if (VideoSizeChanger._makeVideoStyleChanger().isChanged()) {
                // 旧 '.component-lesson-interaction-bar-event-information'
                R.componentLessonInteractionBarEventInformation.css({'z-index': 1001});

            }
        }

        const observer = new MutationObserver(handleMutations);
        const config = {childList: true, subtree: true};

        observer.observe(R.unneiCommentBar.get(0), config);
    }

}