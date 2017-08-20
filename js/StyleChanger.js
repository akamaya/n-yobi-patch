'use strict';

// domのstyle変更を保持しておいて、後から一発で戻すクラス

class StyleChanger {
    constructor(dom) {
        this._dom = dom;
        this._originStyle = null;
    }

    setStyle(styleHash) {
        this.revert();
        $(this._dom).css(styleHash);
    }

    revert() {
        $(this._dom).removeAttr('style');
    }

    isChanged() {
        return $(this._dom).attr('style') ? true : false;
    }
}

class StyleChangerList {
    constructor(domList) {
        this._changeList = [];
        for (const dom of domList) {
            this._changeList.push(new StyleChanger(dom));
        }
    }

    setStyle(styleHash) {
        for (const sc of this._changeList) {
            sc.setStyle(styleHash);
        }
    }

    revert() {
        for (const sc of this._changeList) {
            sc.revert();
        }
    }

    isChanged() {
        for (const sc of this._changeList) {
            if (sc.isChanged()) {
                return true;
            }
        }
        return false;
    }
}