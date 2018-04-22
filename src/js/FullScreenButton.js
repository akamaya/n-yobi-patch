'use strict';

import $ from 'jquery';
import R from "./Resources";

// 全画面ボタンを生成

export default class FullScreenButton {
    constructor() {
        this._on = false;
    }

    init() {

    }

    insertDom(callback) {
        this._callback = callback;
        const icon = chrome.extension.getURL('images/fullScreenIcon.png');
        const tag = '<div class="component-lesson-player-controller-fullScreen"><button type="submit"><img src="' + icon + '" alt="全画面"/></button></i></div>';
        R.controlBar.append(tag);

        $('.component-lesson-player-controller-fullScreen button').on('click', () => this.clickFullScreenButton());
    }

    show() {
        $('.component-lesson-player-controller-fullScreen').show();
    }

    hide() {
        $('.component-lesson-player-controller-fullScreen').hide();
        this._on = false;
        this._settingESCKey();
    }

    clickFullScreenButton() {
        this._on = !this._on;
        this._settingESCKey();
        this._fireButtonCallback();
    }

    on() {
        this._on = true;
        this._settingESCKey();
    }

    off() {
        this._on = false;
        this._settingESCKey();
    }

    _settingESCKey() {
        if (this._on) {
            $(window).off('keyup');// 2重登録されると2回走るので確実に1つにする
            // ESCで全画面から復帰
            $(window).on('keyup', e => e.keyCode === 27 ? this.clickFullScreenButton() : false);
        }
        else {
            $(window).off('keyup');
        }

    }

    _fireButtonCallback() {
        if (this._callback) {
            this._callback(this._on);
        }
    }

}