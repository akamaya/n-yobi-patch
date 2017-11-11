'use strict';

// 全画面ボタンを生成

class TextOpenLink {
    constructor() {
        this._on = false;
    }

    insertDom() {
        const url = $('#root > div > div[class] > div[class] > div[class] > iframe').attr('src');
        const tag = `<div class="text-open-link-box"><div>テキストのみを開く</div><div><a href="${url}" target="_blank">${url}</div></div>`;
        $('#root > div > div[class] > div[class] > div[class]:nth-child(1)').after(tag);
    }
    show() {
        $('.text-open-link-box').show();
    }

    hide() {
        $('.text-open-link-box').hide();
    }

}
