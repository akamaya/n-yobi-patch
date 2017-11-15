// 教材の印刷ページ作成
'use strict';
class LessonPrint {
    constructor() {
    }

    init() {
        // 選択した教材を1ページで開くのパラメータチェック
        if (location.search.indexOf('n-yobi-patch-print-ids') > -1) {
            this._printPage();
        }
        else if (location.search.indexOf('n-yobi-patch-answer-open') > -1) {
            this._answerOpen();
        }
        else {
            this._addLessonPrintSetting();
        }

    }

    _getSections() {
        // domの生成
        const dataDom = $('div[data-react-props]');

        if (dataDom.length === 0) return undefined;

        const data = JSON.parse(dataDom.attr('data-react-props'));
        let sections;
        for (const header of data.chapter.class_headers) {
            if (header.name === 'section') {
                sections = header.sections;
                break;
            }
        }
        return sections;
    }

    _addLessonPrintSetting() {

        const sections = this._getSections();
        if (sections === undefined || sections.length === 0) return;

        // ヘッダを入れる
        $('div.lesson div.u-card').prepend('<div class="u-list-header type-link"><a class="n-yobi-patch-print-header"><h2 class="typo-list-title"><span>印刷</span></h2><div class="u-list-header-show-more"><div class="icon-arrow-lined-down"></div></div></a></div><ul class="u-list has-linked-children n-yobi-patch-print-list"></ul>')
        /*
                // 選択した教材を1ページで開くのカラムを入れる
                $('.n-yobi-patch-print-list').append(`<li class="guide n-yobi-patch-print-section"><div class="n-yobi-patch-print-section-checkbox"><div><input type="checkbox" class="n-yobi-patch-print-section-checkbox-all-guide" checked>教材全てを選択</div><div><input type="checkbox" class="n-yobi-patch-print-section-checkbox-all-exercise" checked>問題全てを選択</div></div><a class="n-yobi-patch-text-link n-yobi-patch-text-link-all-open" target="_blank">選択した教材を<br>1ページで開く</a></li>`);
        
                // 教材側にダミーカラムを入れる
                $('div.section ul').prepend('<li class="guide n-yobi-patch-print-section"></li>');
        */
        // 印刷側にカラムをいれる
        for (const section of sections) {
            const type = section.resource_type;// exercise,guide
            let url = section.content_url;

            const clear = section.progress.checkpoint.clear;

            let id;
            if (type === 'guide') {
                id = 'g' + section.id;
                url = `https://www.nnn.ed.nico/contents/guides/${section.id}/content`;
            }
            else if (type === 'exercise') {
                url.match(/(\d+)$/);
                id = 'e' + RegExp.$1;
            }
            else {
                continue;
            }


            let sectionClass = '';
            if (clear > 0) {
                sectionClass = 'n-yobi-patch-print-section-clear';
            }

            // 1ページで開く用(現在未使用)
            // `<div class="n-yobi-patch-print-section-checkbox"><div><input type="checkbox" class="n-yobi-patch-print-section-checkbox-${type}" name="n-yobi-patch-print-section-id" value="${id}"checked>選択</div></div>`;

            let checkbox = '';
            let linkClass = '';
            if (type === 'exercise') {
                linkClass = 'n-yobi-patch-exercise-' + id;
                checkbox = `<div class="n-yobi-patch-print-section-checkbox"><div><input type="checkbox" class="n-yobi-patch-answer-open ${linkClass}" checked> 解答を開いて表示</div></div>`;

            }
            else {
                checkbox = `<div class="n-yobi-patch-print-section-checkbox"><div></div></div>`;
            }
            $('.n-yobi-patch-print-list').append(`<li class="guide n-yobi-patch-print-section ${sectionClass}"><a class="n-yobi-patch-text-link" id="${linkClass}" href="${url}" target="_blank">教材を開く</a>${checkbox}</li>`);
        }

        $('.n-yobi-patch-text-link').on('click', function () {
            if (this.id) {
                const checkboxClass = this.id;
                if ($('.' + checkboxClass).length > 0) {
                    this.href = this.href.split('?n-yobi-patch-answer-open')[0]
                    if ($('.' + checkboxClass).prop('checked')) {
                        this.href = this.href + '?n-yobi-patch-answer-open';
                    }
                }
            }
        });

        // 閉じてるときにちょろっと出てるダミー要素の追加
        $('.n-yobi-patch-print-list').append('<li class="guide n-yobi-patch-dummy-section">　</li><li class="guide n-yobi-patch-dummy-section-bottom">　</li>');

        // クリックしたら開くギミック
        $('.n-yobi-patch-print-header').on('click', function () {
            if ($('.n-yobi-patch-print-section').css('display') === 'none') {
                $('.n-yobi-patch-print-section').css('display', 'flex');
            }
            else {
                $('.n-yobi-patch-print-section').css('display', 'none');
            }
        });

        // 教材全てを選択
        $('.n-yobi-patch-print-section-checkbox-all-guide').change(function () {
            $('.n-yobi-patch-print-section-checkbox-guide').prop('checked', $('.n-yobi-patch-print-section-checkbox-all-guide').prop('checked'));
        });

        // 問題全てを選択
        $('.n-yobi-patch-print-section-checkbox-all-exercise').change(function () {
            $('.n-yobi-patch-print-section-checkbox-exercise').prop('checked', $('.n-yobi-patch-print-section-checkbox-all-exercise').prop('checked'));
        });

        // 選択した教材を1ページで開くをクリック
        $('.n-yobi-patch-text-link-all-open').on('click', function () {
            const idList = [];
            $('input[name=n-yobi-patch-print-section-id]:checked').each(function (index, input) { return idList.push(input.value) });
            const url = sections[0].content_url + '?n-yobi-patch-print-ids=' + idList.join(',');
            window.open(url);
        });


    }

    _answerOpen() {
        $('.explanation').show();
    }

    _printPage() {
        // getパラメータ'n-yobi-patch-print-ids'のvalueをカンマで分割してSetで取得
        const typeidList = location.search.split('&').filter((p) => p.indexOf('n-yobi-patch-print-ids') > -1)[0].split('=')[1].split(',');

        if (typeidList[0] === '') {
            return;
        }

        // bodyを空にする
        $('#container').empty();
        $('header').remove();
        $('footer').remove();

        // 対象のコンテンツをiframeで追加する
        for (const typeid of typeidList) {
            const type = typeid.substr(0, 1);
            const id = typeid.substr(1);
            let url;
            if (type === 'g') {
                url = `https://www.nnn.ed.nico/contents/guides/${id}/content`;
                $('#container').append(`<div class="guide-content"><iframe id="n-yobi-patch-iframe-${typeid}" src="${url}"></iframe></div>`);
            }
            else if (type === 'e') {
                url = `https://www.nnn.ed.nico/contents/links/${id}`;
                $('#container').append(`<iframe id="n-yobi-patch-iframe-${typeid}" src="${url}"></iframe>`);
            }


        }

        $('iframe').on('load', function () {
            // 問題の方のiframeはheightがどうしても取れなかったのでinnerHTMLを抜いてきてappendする
            if (this.id.indexOf('n-yobi-patch-iframe-e') > -1) {
                const html = this.contentWindow.document.getElementById('container').innerHTML;
                $(this).after(html);
                $(this).remove();
                $('header a').remove();
                $('.explanation').show();
            }
            else {
                $(this).height(this.contentWindow.document.documentElement.scrollHeight);
            }
        });

        $(window).resize(function () {
            $('iframe').each(function () {
                $(this).height(0);// 一度必大きくなると縮小したときに大きいままで固定されてしまうので0を入れてリセット
                $(this).height(this.contentWindow.document.documentElement.scrollHeight);
            });
        });

    }

}
