'use strict';

// videoサイズ変更を管理する

class VideoSizeChanger {
    constructor() {
        this.data = {
            originWidth: 608,
            originHeight: 342,

            screenType: 'window',// window or full
        };
    }

    setWindowScreenType() {
        this.data.screenType = 'window';
    }

    setFullScreenType() {
        this.data.screenType = 'full';
    }

    setVideoSizeChangeEvent(e) {
        this.data.videoSizeChangeEvent = e;
    }
    _fireVideoSizeChangeEvent() {
        if (this.data.videoSizeChangeEvent) {
            this.data.videoSizeChangeEvent();
        }
    }

    // 動画サイズを変更する前に呼び出してね
    init() {
        // 初期動画サイズを取得
        var videoComponent = $('.component-lesson-player-controller');
        this.data.originWidth = videoComponent.width();
        this.data.originHeight = videoComponent.height();
        this._observeUnneiComment();
    }

    insertDom() {

        var icon = chrome.extension.getURL('images/fullScreenIcon.png');
        var tag = '<div class="component-lesson-player-controller-fullScreen"><button type="submit"><img src="' + icon + '" alt="全画面"/></button></i></div>';
        $('.component-lesson-player-controller-console').append(tag);

        var this_ = this;
        $('.component-lesson-player-controller-fullScreen button').on('click', function () {
            this_.clickFullScreenButton();
        });

    }

    clickFullScreenButton() {
        if (this.data.originalCss) {
            this._backFullScreen();
        }
        else if (this.data.screenType === 'window') {
            this._changeWindowScreen();
        }
        else if (this.data.screenType === 'full') {
            this._changeFullScreen();
        }
    }

    // windowサイズにフルスクリーン
    _changeWindowScreen() {
        var videoCss = {
            'position': 'fixed',
            'width': '100%',
            'height': '100%',
            'top': '0px',
            'left': '0px',
            'bottom': '0px',
            'right': '0px',
            'display': 'block',
            'z-index': '1000',
            'transform': '',
        };
        if (this.data.originalCss) {
            this._backFullScreen();
        }
        else {
            this.data.originalCss = this._changeVideoComponent(videoCss);
            this._changeCommentComponent();
            this._centeringArchiveMenu();

            // ESCで全画面から復帰
            var this_ = this;
            $(window).on('keydown', function (e) {
                if (e.keyCode == 27) {
                    this_._backFullScreen();
                }
                return false;
            });
        }
    }

    // 画面サイズにフルスクリーン
    _changeFullScreen() {

    }
    // フルスクリーンから戻る
    _backFullScreen() {
        if (!this.data.originalCss) return;

        this._resetVideoComponent(this.data.originalCss);
        // こいつだけ元のheightが変な値で取れてしまうので元に戻らない。
        // とりあえずの応急処置
        $('.vjs_video_3-dimensions').css('height', this.data.originalCss['.component-lesson-player'].height);

        this.data.originalCss = undefined;
        this._centeringArchiveMenu();

        $(window).off('keydown');
    }

    // 指定したサイズに変更
    changeVideoSize(width) {

        if (!width) {
            width = this.data.originWidth;
        }

        if ($('.component-lesson-left-column').length === 0) {
            return;
        }

        // フルスクリーン中にサイズ変更があったときは元のサイズに戻してから続行
        if (this.data.originalCss) {
            this._backFullScreen();
        }


        var scale = width / this.data.originWidth;
        var height = Math.ceil(this.data.originHeight * scale);

        // 画面サイズを修正
        var videoCss = {
            'width': width,
            'height': height,
        };
        this._changeVideoComponent(videoCss);
        // 画面中央の再生ボタン群の位置を中央に修正(録画のみ)
        this._centeringArchiveMenu();

        // 右テキストの位置を修正
        $('.component-lesson-right-column').css('margin-left', (width + 32) + 'px');
    }

    changeVideoRatio(ratio) {
        var width = Math.ceil($(window).width() * ratio / 100);
        this.changeVideoSize(width);
    }

    // ビデオコンポーネントのサイズ変更
    _changeVideoComponent(videoCss) {
        var components = [
            '.component-lesson-left-column',
            '.component-lesson-player',
            '.component-lesson-player-controller',
            '.vjs_video_3-dimensions',
            '.component-lesson-comment-pane',
        ];
        var cssKeyList = Object.keys(videoCss);
        var originalCss = {};
        for (var component of components) {
            originalCss[component] = $(component).css(cssKeyList);
            $(component).css(videoCss);
        }

        this._fireVideoSizeChangeEvent();

        return originalCss;
    }
    // コメントコンポーネントを画面サイズにフィットさせる
    // 全画面のときに画面上部の余った黒塗り部分にコメントが表示されるのを防ぐ
    _changeCommentComponent() {
        var width = $('.component-lesson-player', ).width();
        var height = this.data.originHeight * width / this.data.originWidth;
        var comeCss = {
            'width': width,
            'height': height,
            'top': '50%',
            'left': '50%',
            'transform': 'translate(-50%,-50%)',
        };
        $('.component-lesson-comment-pane').css(comeCss);
    }

    // 全画面中の運営コメ監視
    // 運営コメはdomの追加と削除を繰り返すので親domを監視して追加があればz-indexをセットする
    _observeUnneiComment() {

        var this_ = this;
        function handleMutations(mutations) {
            if (this_.data.originalCss) {
                $('.component-lesson-interaction-bar-event-information').css({ 'z-index': 1001 });
                $('.component-modal').css({ 'z-index': 1002 })
            }
        }
        var observer = new MutationObserver(handleMutations);
        var config = { childList: true };
        observer.observe(document.querySelector('.component-lesson-interaction-bar'), config);

    }

    resize() {
        this._centeringArchiveMenu();

    }

    show() {
        $('.component-lesson-player-controller-fullScreen').show();
    }

    hide() {
        $('.component-lesson-player-controller-fullScreen').hide();
    }

    _resetVideoComponent(originalCss) {
        var componentList = Object.keys(originalCss);

        for (var component of componentList) {
            $(component).css(originalCss[component]);
        }
        this._fireVideoSizeChangeEvent();
    }

    // 画面中央の再生ボタン群の位置を中央に移動(録画のみ)
    _centeringArchiveMenu() {
        var width = $('.component-lesson-player').width();
        $('.component-lesson-player-controller-console').css({ 'width': width });

        var archiveMenu = $('.component-lesson-player-controller-archive-menu');
        if (archiveMenu.length > 0) {

            var centeringCss = {
                'top': '50%',
                'left': '50%',
            };
            archiveMenu.css(centeringCss);

        }
    }
}