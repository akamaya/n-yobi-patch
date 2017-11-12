'use strict';

// スクリーンショットのカルーセルを生成

class ScreenShotCarousel {

    constructor() {
        this._autoSave = false;
        this._carouselSpeed = 100;
    }

    get autoSave() {
        return this._autoSave;
    }
    set autoSave(p) {
        const bool = p ? true : false;
        this._autoSave = bool;
    }

    insertDom() {
        const cameraURL = chrome.extension.getURL('images/camera.png');
        const popupCanvas = '<canvas id="popupCanvas" style="display:none;">';
        const screenShotBox = '<div id="screenShotBox" class="largeSize"></div>';
        const cameraButton = '<button id="screenShotButton"><img src="' + cameraURL + '"></button>';
        const leftMoveButton = '<button id="carouselLeftMoveButton">◁</button>';
        const rightMoveButton = '<button id="carouselRightMoveButton">▷</button>';
        const screenShotCarousel = '<div id="screenShotCarousel"><div id="screenShotCarouselInner"></div></div>';


        $('#root > div > div[class] > div[class] > div > div > div[class]:nth-child(1)').after(screenShotBox);
        $('#screenShotBox').append(popupCanvas);
        $('#screenShotBox').append(cameraButton);
        $('#screenShotBox').append(leftMoveButton);
        $('#screenShotBox').append(screenShotCarousel);
        $('#screenShotBox').append(rightMoveButton);

        // カルーセルの左矢印を押されたときの処理
        $('#carouselLeftMoveButton').on('click', () => this.moveLeft());

        // カルーセルの右矢印を押されたときの処理
        $('#carouselRightMoveButton').on('click', () => this.moveRight());

        // スクショボタンを押されたときの処理
        const this_ = this;
        $('#screenShotButton').on('click', function () {
            // 画像をcanvasElementで取得
            const canvas = this_.snapshot();
            // カルーセルにアイテムを追加
            const item = this_.push(canvas);
            // カルーセルの一番後ろを表示
            this_.moveRightMost();

            if (this_.autoSave) {
                setTimeout(
                    function () {
                        item.find('a').get(0).click();
                    }, 1000)
            }
        });
        // 初回横幅計算
        this.resize();

    }

    show() {
        $('#screenShotBox').show();
    }

    hide() {
        $('#screenShotBox').hide();
    }

    // 左移動の矢印押した時の処理
    moveLeft() {
        const carousel = $('#screenShotCarousel');
        const inner = $('#screenShotCarouselInner');

        const carouselWidth = carousel.width();
        const innerWidth = inner.width();

        // 中身の個数が少ないときは初期地点
        if (carouselWidth >= innerWidth) {
            inner.animate({ marginLeft: 0 }, this._carouselSpeed);
            return;
        }

        // 現在表示中のindexを計算
        const marginLeft = parseInt(inner.css('margin-left'), 10);
        let index = Math.ceil(Math.abs(marginLeft) / this._carouselItemWidth());
        // 左にずらす
        index--;

        // indexからmargin-leftを計算
        let marginLeftNew = 0;
        if (index > 0) {
            marginLeftNew = this._carouselItemWidth() * index;
        }

        inner.animate({ marginLeft: -marginLeftNew }, this._carouselSpeed);
    }

    // 右移動の矢印押した時の処理
    moveRight() {
        const carousel = $('#screenShotCarousel');
        const inner = $('#screenShotCarouselInner');

        const carouselWidth = carousel.width();
        const innerWidth = inner.width();

        // 中身の個数が少ないときは初期地点
        if (carouselWidth >= innerWidth) {
            inner.animate({ marginLeft: 0 }, this._carouselSpeed);
            return;
        }

        // カルーセルのサイズから一度に表示できる個数を計算
        let dispSize = Math.floor(carouselWidth / this._carouselItemWidth());
        if (dispSize == 0) {
            dispSize = 1;
        }
        const itemNum = inner.find('.carouselItem').length;// カルーセルに入ってるアイテム数
        const maxIndex = itemNum - dispSize;// indexの最大値

        // 現在表示中のindexを計算
        const marginLeft = parseInt(inner.css('margin-left'), 10);
        let index = Math.ceil(Math.abs(marginLeft) / this._carouselItemWidth());
        // 右にずらす
        index++;

        // indexからmargin-leftを計算
        let marginLeftNew = 0;
        if (index >= maxIndex) {
            marginLeftNew = innerWidth - carouselWidth;
        }
        else {
            const rem = carouselWidth % this._carouselItemWidth();
            marginLeftNew = this._carouselItemWidth() * index - rem;
        }

        inner.animate({ marginLeft: -marginLeftNew }, this._carouselSpeed);
    }

    // 一番うしろのアイテムまでカルーセルを移動
    moveRightMost() {
        const carousel = $('#screenShotCarousel');
        const inner = $('#screenShotCarouselInner');

        const carouselWidth = carousel.width();
        const innerWidth = inner.width();

        // 中身の個数が少ないときは初期地点
        if (carouselWidth >= innerWidth) {
            inner.animate({ marginLeft: 0 }, this._carouselSpeed);
            return;
        }

        const marginLeftNew = innerWidth - carouselWidth;

        inner.animate({ marginLeft: -marginLeftNew }, this._carouselSpeed);
    }

    // カルーセルにアイテムを追加
    push(canvas) {
        // カルーセル用のDOMを作成
        const item = $('<div class="carouselItem"></div>');

        $(canvas).hover(this.popupOn, this.popupOff);

        const a = $('<a>保存する</a>').attr('href', canvas.toDataURL()).attr('download', this.makeFileName());

        item.append(canvas);
        item.append(a);

        // カルーセルに追加
        const inner = $('#screenShotCarouselInner');
        inner.append(item);
        this._resizeInner();
        return item;
    }

    _resizeInner() {
        const inner = $('#screenShotCarouselInner');
        const itemNum = inner.find(".carouselItem").length;
        inner.width(itemNum * this._carouselItemWidth());
    }

    _carouselItemWidth() {
        const sizeType = this.sizeType();
        if (sizeType === 'large') return 117;
        else if (sizeType === 'medium') return 70;
        else if (sizeType === 'small') return 47;
    }


    // カルーセルのwidthをvideoのwidthに合わせる
    resize(sizeType) {
        if (sizeType) {
            this.setSize(sizeType);
        }

        const width = $('#screenShotBox').width();
        const buttonWidth = this._getButtonWidth() + $('#carouselLeftMoveButton').width() + $('#carouselRightMoveButton').width();
        $('#screenShotCarousel').width(width - buttonWidth - 5);// -5はborder分
        this._resizeInner();
        this.moveRightMost();

        // widthが設定上は変更されているはずなのに変更後の値が取得できないことがあるのでsetTimeoutで苦肉の策
        setTimeout(() => {
            if ($('#screenShotBox').width() !== width) {
                this.resize();
            }
        }, 400);
    }

    sizeType() {
        const box = $('#screenShotBox');
        if (box.hasClass('largeSize')) return 'large';
        if (box.hasClass('mediumSize')) return 'medium';
        if (box.hasClass('smallSize')) return 'small';
    }

    setSize(sizeType) {
        const box = $('#screenShotBox');
        box.removeClass('largeSize').removeClass('mediumSize').removeClass('smallSize');
        if (sizeType === 'large') { box.addClass('largeSize') }
        else if (sizeType === 'medium') { box.addClass('mediumSize') }
        else if (sizeType === 'small') { box.addClass('smallSize') }
        else { box.addClass('largeSize') }
    }

    _getButtonWidth() {
        const box = $('#screenShotBox');

        // まだ読み込みが完了していなくて横幅が取れなかった時の処理
        if ($('#screenShotButton img').length === 0 || $('#screenShotButton img').width() === 0) {
            const sizeType = this.sizeType();
            let size = 107;
            if (sizeType === 'large') size = 107;
            if (sizeType === 'medium') size = 64;
            if (sizeType === 'small') size = 43;

            // screenShotButtonのwidthはmax-width: 20%;が指定されているのでscreenShotBoxの20%まで
            size = Math.ceil(Math.min(box.width() * 0.2, size));
            return size;
        }
        return Math.ceil($('#screenShotButton').width());
    }

    popupOn() {
        const popupCanvas = $('#popupCanvas');
        const videoComponent = $('#comment-layer');
        popupCanvas.attr('width', videoComponent.width()).attr('height', videoComponent.height());
        popupCanvas.css('top', $('#root > div > div[class] > div[class] > div > div > div[class]:nth-child(1) > div[class]:nth-child(1)').height()).css('left', 0);

        popupCanvas.get(0).getContext("2d").drawImage(this, 0, 0, this.width, this.height, 0, 0, popupCanvas.width(), popupCanvas.height());

        $('#popupCanvas').show();
    }
    popupOff() {
        $('#popupCanvas').hide();
    }

    snapshot() {
        const videoElement = $('#vjs_video_3_html5_api').get(0);

        const currentTime = videoElement.currentTime;

        // canvas要素を作成してvideoの表示中画面をキャプチャ
        const canvas = $('<canvas>').attr('height', videoElement.videoHeight).attr('width', videoElement.videoWidth).get(0);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight, 0, 0, videoElement.videoWidth, videoElement.videoHeight);

        return canvas;
    }

    // ファイル名の作成
    // "プログラミング入門コース はじめての JavaScript 2017年4月27日19時00分05秒.png"
    makeFileName() {
        const videoElement = $('#vjs_video_3_html5_api').get(0);

        // videoの経過時間
        const elapsedTimeString = $('#root > div > div[class] > div[class] > div > div > div[class] > div[class] > div > div[class] > div[class] > div[class] > time:nth-child(1)').text();// 00:00:00
        elapsedTimeString.match(/^(-?)(\d+):(\d+):(\d+)/);

        let elapsedSecond = Number(RegExp.$2) * 3600 + Number(RegExp.$3) * 60 + Number(RegExp.$4);
        if (RegExp.$1 == '-') {
            elapsedSecond *= -1;
        }
        const title = $('#root > div > div[class] > div[class] > div[class] > article > header > div[class] > h2').text();

        const dateText = $('#root > div > div[class] > div[class] > div[class] > article > header > div[class] > div > p[class] > time').text();
        let date = "";
        if (dateText.match(/^(\S+)\s+(\d+):(\d+)/)) {
            const ymd = RegExp.$1;// 2017年4月27日
            const hour = RegExp.$2;
            const min = RegExp.$3;

            const time = Number(hour) * 3600 + Number(min) * 60 + elapsedSecond;

            date = ymd + this.zeroPadding(time / 3600) + '時' + this.zeroPadding((time % 3600) / 60) + '分' + this.zeroPadding(time % 60) + '秒';
        }
        const filename = title + " " + date + ".png";
        return filename;
    }
    zeroPadding(num) {
        return ("00" + Math.floor(num)).slice(-2);
    }

}