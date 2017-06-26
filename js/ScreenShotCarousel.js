'use strict';

// スクリーンショットのカルーセルを生成

class ScreenShotCarousel {

    constructor() {
        this._autoSave = false;
    }

    get autoSave() {
        return this._autoSave;
    }
    set autoSave(p) {
        var bool = p ? true : false;
        this._autoSave = bool;
    }

    insertDom() {
        var cameraURL = chrome.extension.getURL('images/camera.png');
        var popupCanvas = '<canvas id="popupCanvas" style="display:none;">';
        var screenShotBox = '<div id="screenShotBox" class="largeSize"></div>';
        var cameraButton = '<button type="button" id="screenShotButton"><img src="' + cameraURL + '"></button>';
        var leftMoveButton = '<button id="carouselLeftMoveButton">◁</button>';
        var rightMoveButton = '<button id="carouselRightMoveButton">▷</button>';
        var screenShotCarousel = '<div id="screenShotCarousel"><div id="screenShotCarouselInner"></div></div>';


        $('.component-lesson-left-column-player-container').after(screenShotBox);
        $('#screenShotBox').append(popupCanvas);
        $('#screenShotBox').append(cameraButton);
        $('#screenShotBox').append(leftMoveButton);
        $('#screenShotBox').append(screenShotCarousel);
        $('#screenShotBox').append(rightMoveButton);

        var this_ = this;
        // カルーセルの左矢印を押されたときの処理
        $('#carouselLeftMoveButton').on('click', function () {
            this_.moveLeft();
        });

        // カルーセルの右矢印を押されたときの処理
        $('#carouselRightMoveButton').on('click', function () {
            this_.moveRight();
        });

        // スクショボタンを押されたときの処理
        $('#screenShotButton').on('click', function () {
            // 画像をcanvasElementで取得
            var canvas = this_.snapshot();
            // カルーセルにアイテムを追加
            var item = this_.push(canvas);
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
        var carousel = $('#screenShotCarousel');
        var inner = $('#screenShotCarouselInner');

        var carouselWidth = carousel.width();
        var innerWidth = inner.width();

        // 中身の個数が少ないときは初期地点
        if (carouselWidth >= innerWidth) {
            inner.animate({ marginLeft: 0 }, 300);
            return;
        }

        // 現在表示中のindexを計算
        var marginLeft = parseInt(inner.css('margin-left'), 10);
        var index = Math.ceil(Math.abs(marginLeft) / this._carouselItemWidth());
        // 左にずらす
        index--;

        // indexからmargin-leftを計算
        var marginLeftNew = 0;
        if (index <= 0) {
            marginLeftNew = 0;
        }
        else {
            var rem = carouselWidth % this._carouselItemWidth();
            marginLeftNew = this._carouselItemWidth() * index;
        }

        inner.animate({ marginLeft: -marginLeftNew }, 300);
    }

    // 右移動の矢印押した時の処理
    moveRight() {
        var carousel = $('#screenShotCarousel');
        var inner = $('#screenShotCarouselInner');

        var carouselWidth = carousel.width();
        var innerWidth = inner.width();

        // 中身の個数が少ないときは初期地点
        if (carouselWidth >= innerWidth) {
            inner.animate({ marginLeft: 0 }, 300);
            return;
        }

        // カルーセルのサイズから一度に表示できる個数を計算
        var dispSize = Math.floor(carouselWidth / this._carouselItemWidth());
        if (dispSize == 0) {
            dispSize = 1;
        }
        var itemNum = inner.find('.carouselItem').length;// カルーセルに入ってるアイテム数
        var maxIndex = itemNum - dispSize;// indexの最大値

        // 現在表示中のindexを計算
        var marginLeft = parseInt(inner.css('margin-left'), 10);
        var index = Math.ceil(Math.abs(marginLeft) / this._carouselItemWidth());
        // 右にずらす
        index++;

        // indexからmargin-leftを計算
        var marginLeftNew = 0;
        if (index >= maxIndex) {
            marginLeftNew = innerWidth - carouselWidth;
        }
        else {
            var rem = carouselWidth % this._carouselItemWidth();
            marginLeftNew = this._carouselItemWidth() * index - rem;
        }

        inner.animate({ marginLeft: -marginLeftNew }, 300);
    }

    // 一番うしろのアイテムまでカルーセルを移動
    moveRightMost() {
        var carousel = $('#screenShotCarousel');
        var inner = $('#screenShotCarouselInner');

        var carouselWidth = carousel.width();
        var innerWidth = inner.width();

        // 中身の個数が少ないときは初期地点
        if (carouselWidth >= innerWidth) {
            inner.animate({ marginLeft: 0 }, 300);
            return;
        }

        var marginLeftNew = innerWidth - carouselWidth;

        inner.animate({ marginLeft: -marginLeftNew }, 300);
    }

    // カルーセルにアイテムを追加
    push(canvas) {
        // カルーセル用のDOMを作成
        var item = $('<div class="carouselItem"></div>');

        $(canvas).hover(this.popupOn, this.popupOff);

        var a = $('<a>保存する</a>').attr('href', canvas.toDataURL()).attr('download', this.makeFileName());

        item.append(canvas);
        item.append(a);

        // カルーセルに追加
        var inner = $('#screenShotCarouselInner');
        inner.append(item);
        this._resizeInner();
        return item;
    }

    _resizeInner() {
        var inner = $('#screenShotCarouselInner');
        var itemNum = inner.find(".carouselItem").length;
        inner.width(itemNum * this._carouselItemWidth());
    }

    _carouselItemWidth() {
        var size = this.size();
        if (size === 'large') return 117;
        else if (size === 'medium') return 70;
        else if (size === 'small') return 47;
    }


    // カルーセルのwidthをvideoのwidthに合わせる
    resize(sizeType) {
        if (sizeType) {
            this.setSize(sizeType);
        }

        var width = $('.component-lesson-left-column-player-container').width();
        var buttonWidth = this._getButtonWidth();
        buttonWidth += $('#carouselLeftMoveButton').width() + $('#carouselRightMoveButton').width();
        $('#screenShotCarousel').width(width - buttonWidth - 5);// -5はborder分
        this._resizeInner();
        this.moveRightMost();
    }

    size() {
        var box = $('#screenShotBox');
        if (box.hasClass('largeSize')) return 'large';
        if (box.hasClass('mediumSize')) return 'medium';
        if (box.hasClass('smallSize')) return 'small';
    }

    setSize(sizeType) {
        var box = $('#screenShotBox');
        box.removeClass('largeSize').removeClass('mediumSize').removeClass('smallSize');
        if (sizeType === 'large') { box.addClass('largeSize') }
        else if (sizeType === 'medium') { box.addClass('mediumSize') }
        else if (sizeType === 'small') { box.addClass('smallSize') }
        else { box.addClass('largeSize') }
    }

    _getButtonWidth() {
        var box = $('#screenShotBox');
        if ($('#screenShotButton img').width() == 0) {
            var size = this.size();
            if (size === 'large') return 107;
            if (size === 'medium') return 64;
            if (size === 'small') return 43;
            return 107;
        }
        return Math.ceil($('#screenShotButton').width());
    }

    popupOn() {
        var popupCanvas = $('#popupCanvas');
        var videoComponent = $('.component-lesson-player-controller');
        popupCanvas.attr('width', videoComponent.width()).attr('height', videoComponent.height());
        popupCanvas.css('top', $('.component-lesson-interaction-bar').height()).css('left', 0);

        popupCanvas.get(0).getContext("2d").drawImage(this, 0, 0, this.width, this.height, 0, 0, popupCanvas.width(), popupCanvas.height());

        $('#popupCanvas').show();
    }
    popupOff() {
        $('#popupCanvas').hide();
    }

    snapshot() {
        var videoElement = $('#vjs_video_3_html5_api').get(0);

        var currentTime = videoElement.currentTime;

        // canvas要素を作成してvideoの表示中画面をキャプチャ
        var canvas = $('<canvas>').attr('height', videoElement.videoHeight).attr('width', videoElement.videoWidth).get(0);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight, 0, 0, videoElement.videoWidth, videoElement.videoHeight);

        return canvas;
    }

    // ファイル名の作成
    // "プログラミング入門コース はじめての JavaScript 2017年4月27日19時00分05秒.png"
    makeFileName() {
        var videoElement = $('#vjs_video_3_html5_api').get(0);

        // videoの経過時間
        var elapsedTimeString = $(".component-lesson-player-controller-time").text();// 00:00:00
        elapsedTimeString.match(/^(-?)(\d+):(\d+):(\d+)/);

        var elapsedSecond = Number(RegExp.$2) * 3600 + Number(RegExp.$3) * 60 + Number(RegExp.$4);
        if (RegExp.$1 == '-') {
            elapsedSecond *= -1;
        }
        var title = $('.component-lesson-information-summary-title').text();
        var dateText = $('.component-lesson-information-summary-cast-date').text();

        var date = "";
        if (dateText.match(/^(\S+)\s+(\d+):(\d+)/)) {
            var ymd = RegExp.$1;// 2017年4月27日
            var time = Number(RegExp.$2) * 3600 + Number(RegExp.$3) * 60 + elapsedSecond;

            date = ymd + this.zeroPadding(time / 3600) + '時' + this.zeroPadding((time % 3600) / 60) + '分' + this.zeroPadding(time % 60) + '秒';
        }
        var filename = title + " " + date + ".png";
        return filename;
    }
    zeroPadding(num) {
        return ("00" + Math.floor(num)).slice(-2);
    }

}