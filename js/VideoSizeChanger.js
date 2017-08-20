'use strict';

// videoサイズ変更を管理する

class VideoSizeChanger {
    constructor() {
        this.data = {
            originWidth: 608,
            originHeight: 342,
            screenType: 'window',// window or full(未実装)
        };
        this.videoStyleChanger = this._makeVideoStyleChanger();
        this.rightColumnStyleChanger = this._makeRightColumnStyleChanger();
        this.headerStyleChanger = this._makeHeaderStyleChanger();
        this.centerStyleChanger = this._makeCenterStyleChanger();
    }

    reset() {
        this.videoStyleChanger.revert();
        this.rightColumnStyleChanger.revert();
        this.headerStyleChanger.revert();
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
            '.component-lesson-left-column',
            '.component-lesson-left-column-player-container',
            '.vjs_video_3-dimensions',
            '.component-lesson-player',
        ];

        return new StyleChangerList(components);
    }

    // 右側(教科書ゾーン)のスタイル変更
    _makeRightColumnStyleChanger() {
        const components = [
            '.component-lesson-right-column',
        ];

        return new StyleChangerList(components);
    }

    // ヘッダのスタイル変更
    _makeHeaderStyleChanger() {
        const components = [
            '.component-lesson-header',
        ];

        return new StyleChangerList(components);
    }

    // 画面中央に乗せるパーツのスタイル変更
    _makeCenterStyleChanger() {
        const components = [
            '.component-lesson-comment-pane',
        ];

        return new StyleChangerList(components);
    }

    // 動画サイズを変更する前に呼び出してね
    init() {
        // 初期動画サイズを取得
        const videoComponent = $('.component-lesson-player-controller');
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
        this.headerStyleChanger.setStyle({ 'z-index': '-1' });
        this._changeCommentComponent();
    }

    // フルスクリーン状態かどうか
    isFullScreen() {
        if ($('.component-lesson-header').css('z-index') === '-1') {
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

        if ($('.component-lesson-left-column').length === 0) {
            return;
        }

        const scale = width / this.data.originWidth;
        const height = Math.ceil(this.data.originHeight * scale);

        // 画面サイズを修正
        this.videoStyleChanger.setStyle({ 'width': width });

        // 右テキストの位置を修正
        this.rightColumnStyleChanger.setStyle({ 'margin-left': (width + 32) + 'px' });
    }

    changeVideoRatio(ratio) {
        const width = Math.ceil($(window).width() * ratio / 100);
        this.changeVideoSize(width);
    }

    // コメントコンポーネントを画面サイズにフィットさせる
    // 全画面のときに画面上部の余った黒塗り部分にコメントが表示されるのを防ぐ
    _changeCommentComponent() {
        const width = $('#vjs_video_3').width();
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
                $('.component-lesson-interaction-bar-event-information').css({ 'z-index': 1001 });
                $('.component-modal').css({ 'z-index': 1002 })
            }
        }
        const observer = new MutationObserver(handleMutations);
        const config = { childList: true };
        observer.observe(document.querySelector('.component-lesson-interaction-bar'), config);
    }

}