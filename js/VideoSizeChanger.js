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

    setOriginalSize() {
        // 初期動画サイズを取得
        var videoComponent = $('.component-lesson-player-controller');
        this.data.originWidth = videoComponent.width();
        this.data.originHeight = videoComponent.height();
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
            'position': 'absolute',
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
        this.data.originalCss = undefined;
        this._centeringArchiveMenu(80);
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
        this._centeringArchiveMenu(80);

        // 右テキストの位置を修正
        $('.component-lesson-right-column').css('margin-left', (width + 32) + 'px');
    }

    changeVideoRasio(ratio) {
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

    resize() {
        if (this.data.originalCss) {
            this._centeringArchiveMenu();
        }
        else {
            this._centeringArchiveMenu(80);
        }
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
    _centeringArchiveMenu(unnei_comme_offset = 0) {
        var archiveMenu = $('.component-lesson-player-controller-archive-menu');
        if (archiveMenu.length > 0) {
            var height = $('.component-lesson-player').height();
            var width = $('.component-lesson-player').width();
            var top = Math.ceil((height - archiveMenu.height()) / 2) + unnei_comme_offset;
            var left = Math.ceil((width - archiveMenu.width()) / 2);

            archiveMenu.offset({ top: top, left: left });
            $('.component-lesson-player-controller-console').css({ 'width': width });
        }
    }
}