'use strict';

// 全画面ボタンを生成

class FullScreenButton {
    constructor() {
        this._on = false;
    }

    insertDom(callback) {
        this._callback = callback;
        const icon = chrome.extension.getURL('images/fullScreenIcon.png');
        const tag = '<div class="component-lesson-player-controller-fullScreen"><button type="submit"><img src="' + icon + '" alt="全画面"/></button></i></div>';
        $('.component-lesson-player-controller-console').append(tag);

        $('.component-lesson-player-controller-fullScreen button').on('click', () => this.clickFullScreenButton());
    }
    show() {
        $('.component-lesson-player-controller-fullScreen').show();
    }

    hide() {
        $('.component-lesson-player-controller-fullScreen').hide();
        this._on = false;
        this._fireFullScreenButton();
    }

    clickFullScreenButton() {
        this._on = this._on ? false : true;
        this._fireFullScreenButton();
    }

    _fireFullScreenButton() {
        if (this._on) {
            // ESCで全画面から復帰
            $(window).on('keydown', e => e.keyCode == 27 ? this.clickFullScreenButton() : false);
        }
        else {
            $(window).off('keydown');
        }
        if (this._callback) {
            this._callback(this._on);
        }
    }

}