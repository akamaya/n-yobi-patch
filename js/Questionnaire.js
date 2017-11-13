// アンケートの設定変更機能
'use strict';
class Questionnaire {
    constructor(questionnaireSaveData) {
        this._questionnaireSaveData = questionnaireSaveData;
        this.observer = this._observe();
    }

    // アンケートが非表示の状態からのアンケート表示の監視
    _observe() {
        const this_ = this;
        const handleMutations = function handleMutations(mutations) {
            // アンケート結果
            if ($('body > div:nth-child(6) > div > div > div[class] > div[class] > div > div[class] > ul > li:nth-child(1) > span[class]:nth-child(3)').length > 0) {
                this_._setStyle();
                this_._setAutoClose();
            }
            // アンケート開始
            else if ($('body > div:nth-child(6) > div > div').length > 0) {
                this_._setStyle();
            }
            // アンケート閉じた
            else {

            }
        };
        const observer = new MutationObserver(handleMutations);
        const config = { childList: true, subtree: true };
        observer.observe(document.querySelector('body > div:nth-child(6)'), config);
        return observer;
    }

    _setAutoClose() {
        if (this._questionnaireSaveData.autoClose === false) {
            return;
        }

        const seconds = this._questionnaireSaveData.autoCloseSeconds;
        setTimeout(() => $('body > div:nth-child(6) > div > div > div[class] > i').click(), seconds * 1000);
    }

    _setStyle() {
        const scPortal = new StyleChanger($('body > div:nth-child(6)'));// アンケートを引っ付けるroot
        const scFrame = new StyleChanger($('body > div:nth-child(6) > div > div'));// アンケート枠
        const scTargetHeader = new StyleChanger($('body > div:nth-child(6) > div > div > div[class] > div[class] > div > header'));// 解答枠ヘッダ
        const scTarget = new StyleChanger($('body > div:nth-child(6) > div > div > div[class] > div[class] > div'));// 解答窓
        const scColomn = new StyleChanger($('body > div:nth-child(6) > div > div > div[class] > div[class] > div li'));// 解答欄
        const scBackGround = new StyleChanger($('body > div:nth-child(6) > div'));// 背景

        const stylePortal = {};
        const styleFrame = {};
        const styleTargetHeader = {};
        const styleTarget = {};
        const styleColomn = {};
        const styleBackGround = {};

        if (this._questionnaireSaveData.power) {

            // 背景を無色にする
            if (this._questionnaireSaveData.changeBackGroundColor) {
                styleFrame['border'] = 'solid 1px gray';
                styleBackGround['background-color'] = 'transparent';
            }

            // 縮小する
            if (this._questionnaireSaveData.shrink) {
                const ratio = this._questionnaireSaveData.shrinkRatio;
                styleFrame['width'] = Math.ceil(600 * ratio / 100) + 'px';
                styleFrame['height'] = ratio + '%';

                styleColomn['width'] = Math.ceil(260 * ratio / 100) + 'px';
                styleColomn['height'] = Math.ceil(108 * ratio / 100) + 'px';
                styleColomn['margin-bottom'] = Math.floor(12 * ratio / 100) + 'px';
                styleColomn['margin-right'] = Math.floor(12 * ratio / 100) + 'px';

                styleTarget['padding-left'] = Math.floor(24 * ratio / 100) + 'px';
                styleTarget['padding-right'] = Math.floor(24 * ratio / 100) + 'px';

                styleTargetHeader['margin-left'] = Math.floor(-24 * ratio / 100) + 'px';
                styleTargetHeader['margin-right'] = Math.floor(-24 * ratio / 100) + 'px';

            }

            // 端に寄せる
            if (this._questionnaireSaveData.move) {
                styleFrame['top'] = '0px';
                styleFrame['bottom'] = '0px';
                if (this._questionnaireSaveData.movePosition === 'leftUpper') {
                    styleFrame['margin'] = '0px';
                }
                else if (this._questionnaireSaveData.movePosition === 'rightUpper') {
                    styleFrame['margin'] = '0px';
                    styleFrame['left'] = 'auto';

                }
                else if (this._questionnaireSaveData.movePosition === 'leftLower') {
                    styleFrame['top'] = 'auto';
                    styleFrame['margin'] = '0px';
                }
                else if (this._questionnaireSaveData.movePosition === 'rightLower') {
                    styleFrame['top'] = 'auto';
                    styleFrame['margin'] = '0px';
                    styleFrame['left'] = 'auto';
                }
            }

            // 生放送で非表示
            if (this._questionnaireSaveData.hiddenLive && this.isLive()) {
                stylePortal['display'] = 'none';
            }

            // アーカイブで非表示
            if (this._questionnaireSaveData.hiddenArchive && this.isArchive()) {
                stylePortal['display'] = 'none';
            }

        }

        scPortal.setStyle(stylePortal);
        scFrame.setStyle(styleFrame);
        scTargetHeader.setStyle(styleTargetHeader);
        scTarget.setStyle(styleTarget);
        scColomn.setStyle(styleColomn);
        scBackGround.setStyle(styleBackGround);

    }

    isLive() {
        if ($('#root > div > div[class] > div[class] > div > div > div[class] > div[class] > div > div[class] > div[class] > div[class] > time').length === 1) {
            return true;
        }
        return false;
    }

    isArchive() {
        if ($('#root > div > div[class] > div[class] > div > div > div[class] > div[class] > div > div[class] > div[class] > div[class] > time').length === 2) {
            return true;
        }
        return false;
    }

    // アンケートにスタイルを設定し直す
    reset() {
        this._setStyle();
    }

}