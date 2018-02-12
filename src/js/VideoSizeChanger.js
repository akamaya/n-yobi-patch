'use strict';

// videoサイズ変更を管理する

import R from './Resources';
import StyleChangerList from './StyleChangerList';

export default class VideoSizeChanger {
    constructor() {
        this.data = {
            originWidth: 608,
            originHeight: 342,
            screenType: 'window',// window or full(未実装)
        };
        this.videoStyleChanger = this._makeVideoStyleChanger();
        this.rightColumnStyleChanger = this._makeRightColumnStyleChanger();
        this.hiddenStyleChanger = this._makeHiddenStyleChanger();
        this.centerStyleChanger = this._makeCenterStyleChanger();
    }

    reset() {
        this.videoStyleChanger.revert();
        this.rightColumnStyleChanger.revert();
        this.hiddenStyleChanger.revert();
        this.centerStyleChanger.revert();
    }

    setWindowScreenType() {
        this.data.screenType = 'window';
    }

    setFullScreenType() {
        this.data.screenType = 'full';
    }

    // ビデオコンポーネントのスタイル変更
    _makeVideoStyleChanger() {
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

    // 右側(教科書ゾーン)のスタイル変更
    _makeRightColumnStyleChanger() {
        const components = [
            // 旧 '.component-lesson-right-column' 画面の右側要素
            R.componentLessonRightColumn,
        ];

        return new StyleChangerList(components);
    }

    // ヘッダとコメントフォームを全画面時に隠す
    _makeHiddenStyleChanger() {
        const components = [
            // 旧 '.component-lesson-header',
            R.componentLessonHeader,
            R.commentForm,
        ];

        return new StyleChangerList(components);
    }

    // 画面中央に乗せるパーツのスタイル変更
    _makeCenterStyleChanger() {
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
        if (this.data.screenType === 'window') {
            this._changeWindowScreen();
        }
        else if (this.data.screenType === 'full') {// 未実装
            this._changeFullScreen();
        }
    }

    // windowサイズにフルスクリーン
    _changeWindowScreen() {
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

        this.videoStyleChanger.setStyle(videoCss);
        this.hiddenStyleChanger.setStyle({'z-index': '-1', 'display': 'none'});
        this.rightColumnStyleChanger.setStyle({'visibility': 'hidden'});

        this._changeCommentComponent();
    }

    // フルスクリーン状態かどうか
    isFullScreen() {
        if (R.componentLessonHeader.css('z-index') === '-1') {
            return true;
        }
        return false;
    }

    // 画面サイズにフルスクリーン(未実装)
    _changeFullScreen() {

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

        const scale = width / this.data.originWidth;
        const height = Math.ceil(this.data.originHeight * scale);

        // 画面サイズを修正
        this.videoStyleChanger.setStyle({'width': width});

        // 右テキストの位置を修正
        this.rightColumnStyleChanger.setStyle({'margin-left': (width + 32) + 'px'});
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
        this.centerStyleChanger.setStyle(comeCss);
    }

    // 全画面中の運営コメ監視
    // 運営コメはdomの追加と削除を繰り返すので親domを監視して追加があればz-indexをセットする
    _observeUnneiComment() {

        const this_ = this;

        function handleMutations(mutations) {
            if (this_.videoStyleChanger.isChanged()) {
                // 旧 '.component-lesson-interaction-bar-event-information'
                R.componentLessonInteractionBarEventInformation.css({'z-index': 1001});

            }
        }

        const observer = new MutationObserver(handleMutations);
        const config = {childList: true, subtree: true};

        observer.observe(R.unneiCommentBar.get(0), config);
    }

}