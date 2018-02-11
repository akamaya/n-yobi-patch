// アンケートの設定変更機能
'use strict';

class Questionnaire {
    constructor(questionnaireSaveData) {
        this._questionnaireSaveData = questionnaireSaveData;
    }

    init() {
        this.observer = this._observe();
    }

    // アンケート結果が表示されているか？
    _isResultDisplayed() {
        return R.questionnaireAnswerButton.eq(1).children('span').eq(2).length > 0
    }

    // アンケートが非表示の状態からのアンケート表示の監視
    _observe() {
        const this_ = this;
        const handleMutations = function handleMutations(mutations) {
            // アンケート結果
            if (this_._isResultDisplayed()) {
                this_._setStyle();
                this_._setAutoClose();
            }
            // アンケート開始
            else if (R.questionnaireAnswerButton.length > 0) {
                this_._setStyle();
            }
            // アンケート閉じた
            else {

            }
        };
        const observer = new MutationObserver(handleMutations);
        const config = {
            childList: true,
            subtree: true
        };
        observer.observe(document.querySelector('body > div:nth-of-type(2)'), config);
        return observer;
    }

    _setAutoClose() {
        if (this._questionnaireSaveData.power === false) {
            return;
        }

        if (this._questionnaireSaveData.autoClose === false) {
            return;
        }

        const seconds = this._questionnaireSaveData.autoCloseSeconds;
        setTimeout(() => $('body > div:nth-of-type(2) > div > div > div[class] > i').click(), seconds * 1000);
    }

    _scaleDownCeil(base) {
        const ratio = this._questionnaireSaveData.shrinkRatio;
        return Math.ceil(base * ratio / 100) + 'px';
    }

    _scaleDownFloor(base) {
        const ratio = this._questionnaireSaveData.shrinkRatio;
        return Math.floor(base * ratio / 100) + 'px';
    }

    _setStyle() {
        const styleRoot = {};
        const styleBackGround = {};
        const styleFrame = {};
        const styleHeader = {};
        const styleBody = {};
        const styleQuestion = {};
        const styleAnswerFrame = {};
        const styleAnswerButton = {};

        if (this._questionnaireSaveData.power) {

            // 縮小する
            if (this._questionnaireSaveData.shrink) {
                const ratio = this._questionnaireSaveData.shrinkRatio;


                styleFrame['width'] = this._scaleDownCeil(600);
                styleFrame['height'] = ratio + '%';

                styleAnswerFrame['padding-left'] = this._scaleDownFloor(12);
                styleAnswerFrame['padding-right'] = this._scaleDownFloor(12);

                styleHeader['margin-left'] = this._scaleDownFloor(-24);
                styleHeader['margin-right'] = this._scaleDownFloor(-24);

                styleBody['padding'] = this._scaleDownFloor(12);

                styleQuestion['font-size'] = 1 + Math.floor(8 * ratio / 100) / 10 + 'rem';

                styleAnswerButton['width'] = this._scaleDownCeil(260);
                styleAnswerButton['height'] = this._scaleDownCeil(108);
                styleAnswerButton['margin-bottom'] = this._scaleDownFloor(12);
                styleAnswerButton['margin-right'] = this._scaleDownFloor(12);
                styleAnswerButton['padding'] = this._scaleDownFloor(16);

            }

            // 端に寄せる 背景色あり
            if (this._questionnaireSaveData.move && this._questionnaireSaveData.changeBackGroundColor === false) {
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
            // 端に寄せる 背景色なしに変更(下の画面をクリックできるようにする)
            else if (this._questionnaireSaveData.move && this._questionnaireSaveData.changeBackGroundColor) {
                if (this._questionnaireSaveData.movePosition === 'leftUpper') {
                    styleBackGround['top'] = 'auto';
                    styleFrame['border'] = 'solid 1px gray';
                    styleFrame['top'] = '0px';
                    styleFrame['margin'] = '0px';
                }
                else if (this._questionnaireSaveData.movePosition === 'rightUpper') {
                    styleBackGround['top'] = 'auto';
                    styleFrame['border'] = 'solid 1px gray';
                    styleFrame['top'] = '0px';
                    styleFrame['left'] = 'auto';
                    styleFrame['margin'] = '0px';
                }
                else if (this._questionnaireSaveData.movePosition === 'leftLower') {
                    styleBackGround['bottom'] = 'auto';
                    styleFrame['border'] = 'solid 1px gray';
                    styleFrame['top'] = 'auto';
                    styleFrame['bottom'] = '0px';
                    styleFrame['margin'] = '0px';
                }
                else if (this._questionnaireSaveData.movePosition === 'rightLower') {
                    styleBackGround['left'] = 'auto';
                    styleFrame['border'] = 'solid 1px gray';
                    styleFrame['top'] = 'auto';
                    styleFrame['bottom'] = '0px';
                    styleFrame['left'] = 'auto';
                }

            }
            // 端に寄せない 背景色あり
            else if (this._questionnaireSaveData.move === false && this._questionnaireSaveData.changeBackGroundColor === false) {
                // もともとなのでなにもしない
            }
            // 端に寄せない 背景色なしに変更(下の画面をクリックできるようにする)
            else {
                styleBackGround['bottom'] = 'auto';
                styleFrame['border'] = 'solid 1px gray';
                styleFrame['bottom'] = '0px';
            }

            // 生放送で非表示
            if (this._questionnaireSaveData.hiddenLive && this.isLive()) {
                styleRoot['display'] = 'none';
            }

            // アーカイブで非表示
            if (this._questionnaireSaveData.hiddenArchive && this.isArchive()) {
                styleRoot['display'] = 'none';
            }

        }


        function setStyle(dom, style) {
            const styleChanger = new StyleChanger(dom);
            styleChanger.setStyle(style);
        }

        setStyle(R.modalRoot, styleRoot); // アンケートを引っ付けるroot
        setStyle(R.questionnaireBackGround, styleBackGround); // アンケート背景
        setStyle(R.questionnaireFrame, styleFrame); // アンケートフレーム
        setStyle(R.questionnaireHeader, styleHeader); // 解答欄ヘッダ
        setStyle(R.questionnaireBody, styleBody); // 解答欄ボディ
        setStyle(R.questionnaireQuestion, styleQuestion); // 質問
        setStyle(R.questionnaireAnswerFrame, styleAnswerFrame); // 解答窓
        setStyle(R.questionnaireAnswerButton, styleAnswerButton); // 解答欄

    }

    isLive() {
        if (R.elapsedTime.length === 1) {
            return true;
        }
        return false;
    }

    isArchive() {
        if (R.elapsedTime.length === 2) {
            return true;
        }
        return false;
    }

    // アンケートにスタイルを設定し直す
    reset() {
        this._setStyle();
    }

}