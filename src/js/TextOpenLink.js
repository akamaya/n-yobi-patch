'use strict';

import $ from 'jquery';
import R from './Resources';

// テキストURLリンクを生成

export default class TextOpenLink {
    constructor() {
        this._on = false;
    }

    static insertDom() {
        const url = R.textIframe.attr('src');
        const tag = `<div class="text-open-link-box"><div>テキストのURL</div><div><a href="${url}" target="_blank">${url}</div></div>`;
        R.componentLessonRightColumnUpperBlock.after(tag);
    }

    static show() {
        $('.text-open-link-box').show();
    }

    static hide() {
        $('.text-open-link-box').hide();
    }

}
